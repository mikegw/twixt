"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionToCoordinates = void 0;
var board_1 = require("../../../src/twixt/board");
var renderer_1 = require("../../../src/twixt/gameUI/renderer");
var positionToCoordinates = function (canvas, position) {
    var size = canvas.getBoundingClientRect().width;
    var slotGapSize = size / (board_1.BOARD_SIZE + 2 * renderer_1.BOARD_PADDING);
    var coordinates = {
        x: (position.column + renderer_1.BOARD_PADDING + 0.5) * slotGapSize,
        y: (position.row + renderer_1.BOARD_PADDING + 0.5) * slotGapSize
    };
    console.log("Coordinates for { row: ".concat(position.row, ", column: ").concat(position.column, " }: { x: ").concat(coordinates.x, ", y: ").concat(coordinates.y, " }"));
    return coordinates;
};
exports.positionToCoordinates = positionToCoordinates;
