import { Callback, CallbackWithType, CallbackType } from "../../dataStore";
import { generateId } from "../../generateId";

export type Node = {
  key: string,
  data: any,
  callbacks: Record<string, CallbackWithType>,
  children: Record<string, Node>,
  callbacksOfType: (t: CallbackType) => Callback[]
}

export const buildNode = (data?: any) : Node => {
  const callbacks: Record<string, CallbackWithType> = {}
  const callbacksOfType = (type: CallbackType): Callback[] => {
    return Object.values(callbacks)
      .filter(withType => withType.type == 'childAdded')
      .map(callbackWithType => callbackWithType.callback)
  }

  return {
    key: generateId(),
    data,
    children: {},
    callbacks,
    callbacksOfType
  }
}
