import { Color } from "../../src/twixt/gameUI";
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
    cy.startGameBetween('player1', 'player2')
    cy.playMove(parseMove('B2'), false)
    cy.currentPlayer().should("eq", Color.Red)
  })

  it('allows players to change moves before confirming', () => {
    cy.startGameBetween('player1', 'player2')
    cy.playMove(parseMove('B2'), false)
    cy.playMove(parseMove('B3'), false).then(() => {
      cy.pegAt('B2').should("be.null")
      cy.pegAt('B3').should("eq", Color.Red)
      cy.currentPlayer().should("eq", Color.Red)
    })
  })

  it('allows players to undo their move before confirming', () => {
    cy.startGameBetween('player1', 'player2')
    cy.playMove(parseMove('B2'), false)
    cy.playMove(parseMove('B3'), false).then(() => {
      cy.pegAt('B2').should("be.null")
      cy.pegAt('B3').should("eq", Color.Red)
      cy.currentPlayer().should("eq", Color.Red)
    })
  })
})
