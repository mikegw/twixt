import { expect } from "chai";

import { Game } from "../src/twixt/game";
import { Position } from "../src/twixt/board";
import { Direction } from "../src/twixt/player";

describe('Peg Placement', () => {
  it('can place a peg on the board', () => {
    const game = new Game()
    const position: Position = { row: 5, column: 4 }

    const result = game.placePeg(position)

    expect(result.slot).not.to.be.null
  });


  it('can only place a single peg at a given position', () => {
    const game = new Game()
    const position: Position = { row: 5, column: 4 }
    game.placePeg(position)
    game.endTurn()

    const result = game.placePeg(position)

    expect(result.slot).to.be.null
  });

  it('can only place a peg on the board', () => {
    const game = new Game()

    const result = game.placePeg({ row: 4, column: -1 })

    expect(result.slot).to.be.null
  });

  it('can not place a peg in a corner', () => {
    const game = new Game()

    const corners = [
      { row: 0, column: 0 },
      { row: 0, column: game.board.size - 1 },
      { row: game.board.size - 1, column: 0 },
      { row: 0, column: game.board.size - 1 }
    ]

    const placementResults =
      corners.map(corner => game.placePeg(corner))
    const validPlacements =
      placementResults.filter(result => result.slot)

    expect(validPlacements).to.be.empty
  })


  it('connects two pegs of the same color an L-shape apart', () => {
    const game = new Game()
    game.placePeg({ row: 1, column: 1 })
    game.endTurn()

    game.placePeg({ row: 10, column: 10 })
    game.endTurn()

    const result = game.placePeg({ row: 2, column: 3 })

    expect(result.connectionsAdded[0].positions).not.to.be.null
  });

  it('only connects pegs of the same color', () => {
    const game = new Game()
    game.placePeg({ row: 1, column: 1 })
    game.endTurn()

    const result = game.placePeg({ row: 2, column: 3 })

    expect(result.connectionsAdded).to.be.empty
  });

  it('can create more than one connection at a time', () => {
    const game = new Game()
    game.placePeg({ row: 1, column: 1 })
    game.endTurn()

    game.placePeg({ row: 10, column: 10 })
    game.endTurn()

    game.placePeg({ row: 4, column: 4 })
    game.endTurn()

    game.placePeg({ row: 9, column: 10 })
    game.endTurn()

    const result = game.placePeg({ row: 2, column: 3 })

    expect(result.connectionsAdded.length).to.eq(2)
  })

  it('does not add overlapping connections', () => {
    const game = new Game()
    game.placePeg({ row: 1, column: 1 })
    game.endTurn()

    game.placePeg({ row: 2, column: 1 })
    game.endTurn()

    game.placePeg({ row: 2, column: 3 })
    game.endTurn()

    const result = game.placePeg({ row: 1, column: 3 })

    expect(result.connectionsAdded).to.be.empty
  });

  it('can place connections for each player', () => {
    const game = new Game()
    game.placePeg({ row: 1, column: 1 })
    game.endTurn()

    game.placePeg({ row: 4, column: 4 })
    game.endTurn()

    game.placePeg({ row: 2, column: 3 })
    game.endTurn()

    game.placePeg({ row: 5, column: 6 })
    game.endTurn()

    expect(game.board.connections.length).to.eq(2)
  })

  it('can place multiple connections for a player', () => {
    const game = new Game()
    game.placePeg({ row: 0, column: 1 })
    game.endTurn()

    game.placePeg({ row: 1, column: 0 })
    game.endTurn()

    game.placePeg({ row: 2, column: 2 })
    game.endTurn()

    game.placePeg({ row: 2, column: 0 })
    game.endTurn()

    game.placePeg({ row: 0, column: 3 })
    expect(game.board.connections.length).to.eq(2)
  })

  it('does not allow players to place pegs on their opponents border rows', () => {
    const game = new Game()
    const result = game.placePeg({ row: 1, column: 0 })

    expect(result.slot).to.be.null
  })

  it('exposes pegs in the order they were placed', () => {
    const game = new Game()

    game.placePeg({ row: 0, column: 1 })
    game.endTurn()

    game.placePeg({ row: 2, column: 2 })
    game.endTurn()

    game.placePeg({ row: 1, column: 1 })

    expect(game.board.slots[2].direction).to.eq(Direction.Vertical)
  })

  it('can undo a move', () => {
    const game = new Game()
    const position = { row: 0, column: 1 }
    game.placePeg(position)
    game.undo()
    expect(game.board.slotAt(position)).to.be.undefined
  })

  describe('when undoing a move', () => {
    it('removes the most recently placed peg', () => {
      const game = new Game()

      game.placePeg({ row: 0, column: 1 })
      game.endTurn()

      game.placePeg({ row: 1, column: 0 })
      game.undo()

      expect(game.board.slotAt({ row: 0, column: 1 })).not.to.be.undefined
    })

    it('removes connections to neighboring pegs', () => {
      const game = new Game()

      game.placePeg({ row: 0, column: 1 })
      game.endTurn()

      game.placePeg({ row: 1, column: 0 })
      game.endTurn()

      game.placePeg({ row: 1, column: 3 })

      game.undo()

      expect(game.board.connections).to.be.empty
    })

    it('only removes neighboring pegs', () => {
      const game = new Game()

      game.placePeg({ row: 0, column: 1 })
      game.endTurn()

      game.placePeg({ row: 1, column: 0 })
      game.endTurn()

      game.placePeg({ row: 1, column: 3 })
      game.endTurn()

      game.placePeg({ row: 2, column: 0 })
      game.endTurn()

      game.placePeg({ row: 3, column: 4 })
      expect(game.board.connections.length).to.eq(2)

      game.undo()

      expect(game.board.connections).not.to.be.empty
    })
  })
});
