"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.surrender = void 0;
var surrender = function () {
    cy.get('#game-surrender').click();
    cy.get('#game-status').contains(/BLUE|RED wins!/);
};
exports.surrender = surrender;
