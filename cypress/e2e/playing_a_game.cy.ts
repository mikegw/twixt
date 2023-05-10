import { Color } from "../../src/twixt/player";
import { parseMove } from "../../src/twixt/parse";

describe('Playing a game', () => {
  it('allows player to move', () => {
    cy.startGameBetween('player1', 'player2')

    cy.playMoves('player2', 'C4,D8,D6,B2').then(() => {
      cy.pegAt('C4').should("eq", Color.Red)
      cy.pegAt('D8').should("eq", Color.Blue)
      cy.pegAt('D6').should("eq", Color.Red)
      cy.pegAt('B2').should("eq", Color.Blue)
    })
  })

  it('expects players to confirm moves', () => {
    cy.startGameBetween('player1', 'player2') // hmm will need to figure out how to play as red so I can immediately play a move
    cy.playMove(parseMove('B2'), Color.Red)
  })
})
