import {Callback, CallbackType, DataStore, Unsubscription} from "../dataStore"
import { generateId } from "../generateId"
import { Node, buildNode } from "./localDataStore/node"

type NodeInBranch = { fragment: string, node: Node, created: boolean }
type Branch = NodeInBranch[]

const deleteItem = (obj: Record<string, any>, key: string) => {
  obj[key] = undefined
}

export const newDataStore = (): DataStore => {
  const storageTree = buildNode()

  const getBranch = (path: string, create = false): Branch | null => {
    const nodePath = path.split('/')
    let node = storageTree
    const branch: Branch = [{ fragment: '', node, created: false }]

    for (let fragment of nodePath) {
      const nextNode = node.children[fragment]
      if (nextNode) {
        branch.push({ fragment, node: nextNode, created: false })
      } else {
        if (!create) return null

        const newNode = buildNode()
        node.children[fragment] = newNode
        branch.push({ fragment, node: newNode, created: true })
      }
    }

    return branch
  }

  const read = (path: string, callback: (data: any, key: string) => void) => {
    const branch = getBranch(path)
    if (!branch) return callback(null, null)

    const { node } = branch.pop()
    callback(node.data, node.key)
  }

  const write = (path: string, data: any) => {
    const branch = getBranch(path, true)
    branch[branch.length - 1].node.data = data

    const firstNewNodeIndex = branch.findIndex(nodeWithCreated => nodeWithCreated.created)
    if(firstNewNodeIndex < 0) return

    const newNode = branch[firstNewNodeIndex].node
    console.log("New Node:", newNode)
    const lastExistingNode = branch[firstNewNodeIndex - 1].node

    const childAddedCallbacks = lastExistingNode.callbacksOfType('childAdded')
    for (let callback of childAddedCallbacks) callback(newNode.data, newNode.key)
  }

  const append = (path: string, data: any) => {
    write(`${path}/${generateId()}`, data)
  }

  const destroy = (path: string) => {
    const branch = getBranch(path)
    if (branch) {
      const [parent, child] = branch.slice(-2)
      deleteItem(parent.node.children, child.fragment)
    }

    return new Promise<void>(resolve => resolve())
  }

  const onCallback = (type: CallbackType) => {
    return (path: string, callback: Callback): Unsubscription => {
      const branch = getBranch(path, true)
      const node = branch.pop().node
      const callbackId = generateId()
      node.callbacks[callbackId] = { type, callback }

      return () => deleteItem(node.callbacks, callbackId)
    }
  }

  return {
    read,
    write,
    append,
    destroy,
    onChildAdded: onCallback('childAdded'),
    onChildChanged: onCallback('childChanged'),
    onChildRemoved: onCallback('childRemoved')
  }
}
