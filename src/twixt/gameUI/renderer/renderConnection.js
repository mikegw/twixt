"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawConnection = void 0;
var renderer_1 = require("../renderer");
var vector_1 = require("../../board/vector");
var gameUI_1 = require("../../gameUI");
var animation_1 = require("./animation");
var CONNECTION_WIDTH = 0.004;
var ANIMATION_SPEED = 0.06;
var drawConnection = function (animatedConnection, canvas, gapSize) {
    var positions = animatedPositions(animatedConnection);
    var coordinates = positions.map(function (position) {
        return (0, renderer_1.positionToCoordinates)(position, gapSize);
    });
    canvas.drawLine(renderer_1.COLORS[gameUI_1.ColorForDirection.get(animatedConnection.connection.direction)] + "99", connectionWidth(canvas), coordinates[0], coordinates[1]);
    (0, animation_1.setNextFrame)(animatedConnection, ANIMATION_SPEED);
};
exports.drawConnection = drawConnection;
var connectionWidth = function (canvas) {
    return Math.ceil(CONNECTION_WIDTH * canvas.size);
};
var animatedPositions = function (_a) {
    var connection = _a.connection, completion = _a.completion;
    var direction = (0, vector_1.subtractVectors)(connection.positions[1], connection.positions[0]);
    var scaledDirection = (0, vector_1.scale)(direction, (0, animation_1.easeInOutCubic)(completion));
    return [connection.positions[0], (0, vector_1.addVectors)(connection.positions[0], scaledDirection)];
};
