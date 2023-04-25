import { Color } from "../../src/twixt/player";

describe('Playing a game', () => {
  it('allows player to move', () => {
    cy.startGameBetween('player1', 'player2')

    cy.playMoves('player2', 'C4,D8,D6')

    cy.pegAt('C4').should("eq", Color.Red)
    cy.pegAt('D8').should("eq", Color.Blue)
    cy.pegAt('D6').should("eq", Color.Red)
  })
})
