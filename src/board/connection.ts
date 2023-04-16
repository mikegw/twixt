import { Color } from "../color";
import { Slot } from "./slot";
import { intersects, sameVectors, subtractVectors, Vector } from "./vector";
import { Position } from "../board";

export class Connection {
  color: Color
  slots: [Slot, Slot]

  constructor(color: Color, slots: [Slot, Slot]) {
    this.color = color
    this.slots = slots
  }

  get positions(): [Position, Position] {
    return [this.slots[0].position, this.slots[1].position]
  }

  overlaps = (otherConnection: Connection) => {
    const firstPegConnectedToOtherConnection =
      otherConnection.positions.some(position => sameVectors(this.positions[0], position))
    const secondPegConnectedToOtherConnection =
      otherConnection.positions.some(position => sameVectors(this.positions[1], position))

    if (firstPegConnectedToOtherConnection && secondPegConnectedToOtherConnection) return true
    if (firstPegConnectedToOtherConnection || secondPegConnectedToOtherConnection) return false

    return intersects(this.positions, otherConnection.positions)
  }
}
