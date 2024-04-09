"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmMove = void 0;
var confirmMove = function () {
    cy.waitUntil(function () {
        return cy.get('#game-confirm').then(function ($el) { return !$el.prop('disabled'); });
    }).then(function () {
        cy.get('#game-confirm').click();
        cy.waitUntil(function () {
            return cy.get('#game-confirm').then(function ($el) { return $el.prop('disabled'); });
        });
    });
};
exports.confirmMove = confirmMove;
