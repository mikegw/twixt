import { addVectors, sameVectors, Vector } from "./board/vector";
import { Slot } from "./board/slot";
import { Connection } from "./board/connection";
import { Direction } from "./player";
import { serializeMoves } from "./parse";

export type Position = Vector

export function isPosition(data: object): data is Position {
  return 'row' in data && 'column' in data
}

export const BOARD_SIZE = 18

export class Board {
  private static neighborDiffs: Vector[] = [
    {row: 1, column: 2},
    {row: 2, column: 1},
    {row: 1, column: -2},
    {row: -2, column: 1},
    {row: -1, column: 2},
    {row: 2, column: -1},
    {row: -1, column: -2},
    {row: -2, column: -1}
  ]

  readonly slots: Slot[] = []
  readonly connections: Connection[] = []
  readonly size: number

  constructor(size = BOARD_SIZE) {
    this.size = size
  }

  toString() {
    const newRow = () => new Array(this.size).fill('.')
    const rows = new Array(this.size).fill(null).map(x => newRow())
    for (let corner of this.corners) rows[corner.row][corner.column] = 'X'
    for (let slot of this.slots) rows[slot.position.row][slot.position.column] = slot.direction[0]

    return rows.map(row => row.join('  ')).join("\n")
  }

  isValidPlacement(direction: Direction, position: Position) {
    console.log(`Checking ${serializeMoves([position])}`)
    if (!this.isValidPosition(position)) return false
    // console.log('Valid')

    if (this.onOpponentBorder(position, direction)) return false
    // console.log('Not on opponent border')

    const slot = this.slotAt(position)

    return !slot
  }

  place(direction: Direction, position: Position): Slot {
    if (!this.isValidPlacement(direction, position)) return null

    console.log(`Placing a ${direction} peg at ${serializeMoves([position])}`)

    const slot = new Slot(position)
    slot.direction = direction
    this.slots.push(slot)

    return slot
  }

  removePeg(direction: Direction, position: Position) {
    return removeMatchingElements(this.slots, slot => slot.direction == direction && sameVectors(slot.position, position))[0]
  }

  connect(direction: Direction, slots: [Slot, Slot]): Connection {
    const connection = new Connection(direction, slots)
    if(!this.isValidConnection(connection)) return null;

    this.connections.push(connection)

    return connection
  }

  disconnect(direction: Direction, positions: [Position, Position]) {
    return removeMatchingElements(this.connections, connection => {
      const connectionSlotPositions = connection.slots.map((slot: Slot) => slot.position)

      return connection.direction == direction && samePositions(positions, connectionSlotPositions)
    })
  }

  slotAt = (position: Position): Slot | null => {
    return this.slots.find(slot => sameVectors(slot.position, position))
  }

  neighboringSlots(position: Position): Slot[] {
    return this.neighboringPositions(position).map(this.slotAt).filter(slot => slot)
  }

  isValidPosition = (position: Position): boolean => {
    return (
      this.isOnBoard(position) &&
      !this.corners.some(corner => sameVectors(position, corner))
    )
  }

  private isValidConnection = (connection: Connection): boolean => {
    return !(this.connections.some((other) => connection.overlaps(other)))
  }

  isOnBoard = (position: Position): boolean => {
    return (
      position.row >= 0 &&
      position.row < this.size &&
      position.column >= 0 &&
      position.column < this.size
    )
  }

  private get corners(): Position[] {
    return [
      { row: 0, column: 0 },
      { row: 0, column: this.size - 1 },
      { row: this.size - 1, column: 0 },
      { row: this.size - 1, column: this.size - 1 }
    ]
  }

  private onOpponentBorder(position: Position, direction: Direction) {
    return (
      direction == Direction.Vertical && (position.column == 0 || position.column == this.size - 1) ||
      direction == Direction.Horizontal && (position.row == 0 || position.row == this.size - 1)
    )
  }

  private neighboringPositions(position: Position): Position[] {
    const potentialNeighbors = Board.neighborDiffs.map(diff => addVectors(position, diff))
    return potentialNeighbors.filter(this.isValidPosition)
  }
}

const removeMatchingElements = (array: any[], predicate: (element: any) => boolean) => {
  let index
  const removed = []
  while ((index = array.findIndex(predicate)) >= 0) {
    removed.push(array[index])
    array.splice(index, 1)
  }
  return removed
}

const samePositions = (positions1: Position[], positions2: Position[]) => {
  if (positions1.length != positions2.length) return false

  return positions2.every(p2 => positions1.some(p1 => sameVectors(p1, p2)))
}
