import { serializeMoves } from "../../src/twixt/parse";
import { Position } from "../../src/twixt/board";

describe('Surrendering', () => {
  it('displays the name of the winner', () => {
    cy.startGameBetween('player1', 'player2')

    cy.playMoves('player2', 'C4,A2,C5')
    cy.surrender()

    cy.get('#game-status').contains('BLUE wins!')
  })
});
