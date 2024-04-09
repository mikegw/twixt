"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pegRadius = exports.drawPeg = void 0;
var renderer_1 = require("../renderer");
var gameUI_1 = require("../../gameUI");
var animation_1 = require("./animation");
var PEG_RADIUS = 0.00525;
var ANIMATION_SPEED = 0.05;
var drawPeg = function (pegAnimation, canvas, gapSize, electrified) {
    var slotCoordinates = (0, renderer_1.positionToCoordinates)(pegAnimation.peg.position, gapSize);
    var colors = electrified ? renderer_1.COLORS : renderer_1.DIM_COLORS;
    var pegColor = colors[gameUI_1.ColorForDirection.get(pegAnimation.peg.direction)];
    var radius = (0, exports.pegRadius)(pegAnimation.completion, radiusValue, canvas);
    canvas.drawCircle(slotCoordinates, radius, pegColor);
    (0, animation_1.setNextFrame)(pegAnimation, ANIMATION_SPEED);
};
exports.drawPeg = drawPeg;
var pegRadius = function (completion, animation, canvas) {
    return Math.ceil(PEG_RADIUS * canvas.size * animation(completion));
};
exports.pegRadius = pegRadius;
var radiusValue = function (completion) {
    if (completion < 0.75) {
        return (0, animation_1.easeInOutCubic)(completion * 2);
    }
    else {
        return (0, animation_1.easeInOutCubic)(1.5 - ((completion - 0.75) * 2));
    }
};
