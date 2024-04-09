"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undoMove = void 0;
var undoMove = function (color) {
    cy.waitUntil(function () {
        return cy.get('#game-undo').then(function ($el) { return !$el.prop('disabled'); });
    }).then(function () {
        cy.get('#game-undo').click();
        cy.waitUntil(function () {
            return cy.get('#game-undo').then(function ($el) { return $el.prop('disabled'); });
        });
    });
};
exports.undoMove = undoMove;
