"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNextFrame = exports.easeInOutCubic = void 0;
function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
exports.easeInOutCubic = easeInOutCubic;
function setNextFrame(animation, speed) {
    if (animation.completion < 1) {
        animation.completion = nextFrame(animation.completion, speed);
    }
}
exports.setNextFrame = setNextFrame;
function nextFrame(animationFrame, speed) {
    return Math.min(animationFrame + speed, 1);
}
