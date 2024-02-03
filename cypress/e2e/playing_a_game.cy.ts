import { Color } from "../../src/twixt/player";
import { parseMove } from "../../src/twixt/parse";

describe('Playing a game', () => {
  it('allows player to move', () => {
    cy.startGameBetween('player1', 'player2', true)

    cy.playMoves('player2', 'C4,D8,D6,B2').then(() => {
      cy.pegAt('C4').should("eq", Color.Red)
      cy.pegAt('D8').should("eq", Color.Blue)
      cy.pegAt('D6').should("eq", Color.Red)
      cy.pegAt('B2').should("eq", Color.Blue)
    })
  })

  it('expects players to confirm moves', () => {
    cy.startGameBetween('player1', 'player2', true)
    cy.playMove(parseMove('B2'), Color.Red, false)
    cy.currentPlayer().should("eq", Color.Red)
  })

  it('allows players to change moves before confirming', () => {
    cy.startGameBetween('player1', 'player2', true)
    cy.playMove(parseMove('B2'), Color.Red, false)
    cy.playMove(parseMove('B3'), Color.Red, false).then(() => {
      cy.pegAt('B2').should("be.null")
      cy.pegAt('B3').should("eq", Color.Red)
      cy.currentPlayer().should("eq", Color.Red)
    })
  })
})
