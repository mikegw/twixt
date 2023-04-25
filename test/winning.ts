import { Game } from "../src/twixt/game";
import { Color } from "../src/twixt/player";
import { expect } from "chai";

describe('When the game is complete', () => {
  it('declares a winner', () => {
    const game = new Game()
    game.parse('C4,A2,C5,C3,C6,E2,C7,G3,C8,I2,C9,K3,C10,M2,C11,O3,C12,Q2,C13')
    expect(game.winner).to.be.null
    game.parse('R4')
    expect(game.winner).to.eq(Color.Blue)
  })
});
