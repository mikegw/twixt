"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('Surrendering', function () {
    it('displays the name of the winner', function () {
        cy.startGameBetween('player1', 'player2');
        cy.playMoves('player2', 'C4,A2,C5');
        cy.surrender();
        cy.get('#game-status').contains('BLUE wins!');
    });
});
