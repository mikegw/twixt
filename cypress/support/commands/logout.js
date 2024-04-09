"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
var logout = function () {
    cy.get('#log-out').click();
    cy.get('#get-started').should('be.visible');
};
exports.logout = logout;
