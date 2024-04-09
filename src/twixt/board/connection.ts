import { Slot } from "./slot";
import { intersects, sameVectors, subtractVectors, Vector } from "./vector";
import { Position } from "../board";
import { Direction } from "../player";

export class Connection {
  direction: Direction
  slots: [Slot, Slot]

  constructor(direction: Direction, slots: [Slot, Slot]) {
    this.direction = direction
    this.slots = slots
  }

  get positions(): [Position, Position] {
    return [this.slots[0].position, this.slots[1].position]
  }

  toString() {
    return `${this.slots[0]}->${this.slots[1]} (${this.direction[0]})`
  }

  hasSharedSlots(other: Connection): Boolean {
    return this.slots.some(slot => other.slots.includes(slot))
  }

  sharedSlots(other: Connection): Slot[] {
    return this.slots.filter(slot => other.slots.includes(slot))
  }

  overlaps = (other: Connection): Boolean => {
    const sharedSlots = this.sharedSlots(other)

    if (sharedSlots.length == 2) return true
    if (sharedSlots.length == 1) return false

    return intersects(this.positions, other.positions)
  }
}
