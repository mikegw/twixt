import { Position } from "../board";
import { Direction } from "../player";
import { serializeMove } from "../parse";

export class Slot {
  position: Position
  direction: Direction
  isConnectedToStart: boolean;
  isConnectedToEnd: boolean;

  constructor(position: Position) {
    this.direction = null
    this.position = position
  }

  get isOccupied() {
    return this.direction !== null
  }

  toString() {
    return serializeMove(this.position)
  }
}
