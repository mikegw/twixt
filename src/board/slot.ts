import { Color } from "../color";
import { Position } from "../board";

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
