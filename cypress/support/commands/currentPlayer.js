"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentPlayer = void 0;
var gameUI_1 = require("../../../src/twixt/gameUI");
var currentPlayer = function () {
    return cy.get('#current-player')
        .invoke('text')
        .then(function (text) {
        var color = text.toString().includes(gameUI_1.Color.Red) ? gameUI_1.Color.Red : gameUI_1.Color.Blue;
        return cy.wrap(color);
    });
};
exports.currentPlayer = currentPlayer;
