import { Game } from "../src/twixt/game";
import { expect } from "chai";

describe('Move Parsing', () => {
  it('can parse a string of moves', () => {
    const moves: string = 'B4,H12,D5,H8,E6,I10,G12,B9,B3'
    const game = new Game()
    game.parse(moves)

    expect(game.board.slots.filter(slot => slot.isOccupied).length).to.eq(9)
    expect(game.board.connections.length).to.eq(3)
  })

  it('can serialize a collection of moves', () => {
    const moves: string = 'B4,H12,D5,H8,E6,I10,G12,B9,B3'
    const game = new Game()
    game.parse(moves)

    expect(game.serialize).to.eq(moves)
  })

  it('can pass a string of moves that includes a removed peg', () => {
    const moves: string = 'B4,H12,D6,D6,D5'
    const game = new Game()
    game.parse(moves)

    expect(game.board.slots.filter(slot => slot.isOccupied).length).to.eq(3)
    expect(game.board.connections.length).to.eq(1)
  })
});
