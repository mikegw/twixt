import { Position } from "../board";
import { Color } from "../player";

export class Slot {
  position: Position
  color: Color

  constructor(position: Position) {
    this.color = null
    this.position = position
  }

  get isOccupied() {
    return this.color !== null
  }
}
