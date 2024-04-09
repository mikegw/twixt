import { Game } from "../src/twixt/game";
import { expect } from "chai";
import { Direction } from "../src/twixt/player";

describe('When a player surrenders', () => {
  it('declares the other player as the winner', () => {
    const game = new Game()
    game.parse('C4,A2')
    expect(game.winner).to.be.null
    game.surrender(Direction.Vertical)
    expect(game.winner).to.eq(Direction.Horizontal)
  })

  it('can happen out of turn', () => {
    const game = new Game()
    game.parse('C4,A2')
    expect(game.winner).to.be.null
    game.surrender(Direction.Horizontal)
    expect(game.winner).to.eq(Direction.Vertical)
  })
})
