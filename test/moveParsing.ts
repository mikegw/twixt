import { Game } from "../src/twixt/game";
import { expect } from "chai";

describe('Move Parsing', () => {
  it('can parse a string of moves', () => {
    const moves: string = 'B4,H12,D5,H8,E6,I10,G12,B1,B3'
    const game = new Game()
    game.parse(moves)

    expect(game.board.slots.filter(slot => slot.isOccupied).length).to.eq(9)
    expect(game.board.connections.length).to.eq(3)
  })
});
