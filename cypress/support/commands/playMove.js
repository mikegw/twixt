"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playMove = void 0;
var positionToCoordinates_1 = require("../helpers/positionToCoordinates");
var playMove = function (position, confirm) {
    if (confirm === void 0) { confirm = true; }
    return cy.get('#game-canvas')
        .then(function (canvas) {
        var _a = (0, positionToCoordinates_1.positionToCoordinates)(canvas[0], position), x = _a.x, y = _a.y;
        cy.get('#game-canvas').click(x, y);
        if (confirm) {
            return cy.confirmMove();
        }
    });
};
exports.playMove = playMove;
