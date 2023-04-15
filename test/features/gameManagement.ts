import { expect } from "chai";
import { Game } from "../../src/game";

import { Color } from "../../src/color";

describe('Game Management', () => {
  it('can start a new game', () => {
    const game = new Game()

    expect(game.currentPlayer.color).to.eq(Color.Red)
  })

  it('alternates between players', () => {
    const game = new Game()

    game.placePeg({ row: 4, column: 5 })

    expect(game.currentPlayer.color).to.eq(Color.Blue)
  })
})
