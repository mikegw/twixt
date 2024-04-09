"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGameWith = void 0;
var positionToCoordinates_1 = require("../helpers/positionToCoordinates");
var startGameWith = function (player) {
    cy.get('.player').contains(player)
        .get('.play-game').should('be.visible')
        .click();
    return cy.get('#game-canvas').then(function ($canvas) {
        var canvas = $canvas[0];
        var ctx = canvas.getContext('2d');
        var _a = (0, positionToCoordinates_1.positionToCoordinates)(canvas, { row: 1, column: 1 }), x = _a.x, y = _a.y;
        var pixel = ctx.getImageData(x * window.devicePixelRatio, y * window.devicePixelRatio, 1, 1).data;
        var _b = Array.from(pixel.slice(0, 3)), r = _b[0], g = _b[1], b = _b[2];
        var hex = ((r << 16) | (g << 8) | b).toString(16);
        var colorCode = "#" + ("000000" + hex).slice(-6).toUpperCase();
        expect(colorCode).to.eq('#999999');
    });
};
exports.startGameWith = startGameWith;
