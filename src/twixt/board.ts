import { addVectors, sameVectors, Vector } from "./board/vector";
import { Slot } from "./board/slot";
import { Connection } from "./board/connection";
import { Color } from "./player";

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

  place(color: Color, position: Position): Slot {
    if (!this.isValidPosition(position)) return null

    if (this.onOpponentBorder(position, color)) return null

    let slot = this.slotAt(position)
    if (slot) return null

    slot = new Slot(position)
    slot.color = color
    this.slots.push(slot)

    return slot
  }

  connect(color: Color, slots: [Slot, Slot]): Connection {
    const connection = new Connection(color, slots)
    if(!this.isValidConnection(connection)) return null;

    this.connections.push(connection)

    return connection
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

  private onOpponentBorder(position: Position, color: Color) {
    return (
      color == Color.Red && (position.column == 0 || position.column == this.size - 1) ||
      color == Color.Blue && (position.row == 0 || position.row == this.size - 1)
    )
  }

  private neighboringPositions(position: Position): Position[] {
    const potentialNeighbors = Board.neighborDiffs.map(diff => addVectors(position, diff))
    return potentialNeighbors.filter(this.isValidPosition)
  }
}
