"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInviteFrom = void 0;
var acceptInviteFrom = function (player) {
    cy.get('.player').contains(player)
        .get('.invite-pending').should('be.visible')
        .click();
};
exports.acceptInviteFrom = acceptInviteFrom;
