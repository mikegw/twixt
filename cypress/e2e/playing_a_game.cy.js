"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameUI_1 = require("../../src/twixt/gameUI");
var parse_1 = require("../../src/twixt/parse");
describe('Playing a game', function () {
    it('allows player to move', function () {
        cy.startGameBetween('player1', 'player2');
        cy.playMoves('player2', 'C4,D8,D6,B2').then(function () {
            cy.pegAt('C4').should("eq", gameUI_1.Color.Red);
            cy.pegAt('D8').should("eq", gameUI_1.Color.Blue);
            cy.pegAt('D6').should("eq", gameUI_1.Color.Red);
            cy.pegAt('B2').should("eq", gameUI_1.Color.Blue);
        });
    });
    it('expects players to confirm moves', function () {
        cy.startGameBetween('player1', 'player2');
        cy.playMove((0, parse_1.parseMove)('B2'), false);
        cy.currentPlayer().should("eq", gameUI_1.Color.Red);
    });
    it('allows players to change moves before confirming', function () {
        cy.startGameBetween('player1', 'player2');
        cy.playMove((0, parse_1.parseMove)('B2'), false);
        cy.playMove((0, parse_1.parseMove)('B3'), false).then(function () {
            cy.pegAt('B2').should("be.null");
            cy.pegAt('B3').should("eq", gameUI_1.Color.Red);
            cy.currentPlayer().should("eq", gameUI_1.Color.Red);
        });
    });
    it('allows players to undo their move before confirming', function () {
        cy.startGameBetween('player1', 'player2');
        cy.playMove((0, parse_1.parseMove)('B2'), false);
        cy.playMove((0, parse_1.parseMove)('B3'), false).then(function () {
            cy.pegAt('B2').should("be.null");
            cy.pegAt('B3').should("eq", gameUI_1.Color.Red);
            cy.currentPlayer().should("eq", gameUI_1.Color.Red);
        });
    });
});
