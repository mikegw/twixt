import { expect } from "chai";
import { Position } from "../src/twixt/board";
import { Slot } from "../src/twixt/board/slot";
import { Connection } from "../src/twixt/board/connection";
import { Direction } from "../src/twixt/player";

function buildConnection(position1: Position, position2: Position): Connection {
  return new Connection(Direction.Vertical, [new Slot(position1), new Slot(position2)])
}
describe('checking whether two connections overlap', () => {
  context('when the connections do not share anything', () => {
    it('allows the connection', () => {
      const connection1 = buildConnection({row: 1, column: 1}, {row: 2, column: 3})
      const connection2 = buildConnection({row: 4, column: 4}, {row: 5, column: 6})

      expect(connection1.overlaps(connection2)).to.be.false
    })
  })

  context('when the connections do not share columns', () => {
    it('allows the connection', () => {
      const connection1 = buildConnection({row: 1, column: 1}, {row: 2, column: 3})
      const connection2 = buildConnection({row: 1, column: 4}, {row: 2, column: 6})

      expect(connection1.overlaps(connection2)).to.be.false
    })
  })

  context('when the connections do not share rows', () => {
    it('allows the connection', () => {
      const connection1 = buildConnection({row: 1, column: 1}, {row: 2, column: 3})
      const connection2 = buildConnection({row: 4, column: 1}, {row: 5, column: 3})

      expect(connection1.overlaps(connection2)).to.be.false
    })
  })

  context('when the two connections share a slot', () => {
    it('allows the connection', () => {
      const connection1 = buildConnection({row: 1, column: 1}, {row: 3, column: 2})
      const connection2 = buildConnection({row: 1, column: 3}, {row: 3, column: 2})

      expect(connection1.overlaps(connection2)).to.be.false
    })
  })

  context('when the two connections share both slots', () => {
    it('does not allow the connection', () => {
      const connection1 = buildConnection({row: 1, column: 1}, {row: 2, column: 3})
      const connection2 = buildConnection({row: 1, column: 1}, {row: 2, column: 3})

      expect(connection1.overlaps(connection2)).to.be.true
    })
  })

  context('when the first slot of the new connection is colinear with the old connection', () => {
    it('allows the connection', () => {
      const old = buildConnection({row: 3, column: 3}, {row: 4, column: 5})
      const connection = buildConnection({row: 6, column: 9}, { row: 5, column: 11})

      expect(connection.overlaps(old)).to.be.false
    })
  })

  context('when a slot from the new connection bisects a long side of the rectangle defined by the old connection', () => {
    context('when the other slot is on the same side of the old connection', () => {
      it('allows the connection', () => {
        const old = buildConnection({row: 3, column: 3}, {row: 4, column: 5})
        const firstPosition: Position = {row: 3, column: 4}
        const otherPositions: Position[] = [
          // {row: 2, column: 2},
          // {row: 1, column: 3},
          // {row: 1, column: 5},
          // {row: 2, column: 6},
          {row: 4, column: 6}
        ]
        const allowedConnections =
          otherPositions.map( (position) => buildConnection(firstPosition, position))

        for (let connection of allowedConnections) {
          expect(connection.overlaps(old)).to.be.false
        }
      })

    })

    context('when the other slot is on the opposite side of the old connection', () => {
      it('prevents the connection', () => {
        const old = buildConnection({row: 3, column: 3}, {row: 4, column: 5})
        const firstPosition: Position = {row: 3, column: 4}
        const otherPositions: Position[] = [
          {row: 5, column: 5},
          {row: 5, column: 3},
          {row: 4, column: 2},
        ]
        const allowedConnections =
          otherPositions.map( (position) => buildConnection(firstPosition, position))

        for (let connection of allowedConnections) {
          expect(connection.overlaps(old)).to.be.true
        }
      })
    })
  })
})
