import { Position } from "../board";
import { Direction } from "../player";

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
}
