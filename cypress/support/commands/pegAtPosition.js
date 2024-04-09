"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pegAtPosition = void 0;
var positionToCoordinates_1 = require("../helpers/positionToCoordinates");
var gameUI_1 = require("../../../src/twixt/gameUI");
function pegAtPosition(position, attempts) {
    if (attempts === void 0) { attempts = 5; }
    return cy.get('#game-canvas').then(function ($canvas) {
        var canvas = $canvas[0];
        var ctx = canvas.getContext('2d');
        var coordinates = (0, positionToCoordinates_1.positionToCoordinates)(canvas, position);
        return retry(function () { return colorOfPixel(ctx, coordinates); }, 5);
    });
}
exports.pegAtPosition = pegAtPosition;
var colorOfPixel = function (ctx, coordinates) {
    var x = coordinates.x, y = coordinates.y;
    var pixelColor = ctx.getImageData(x * window.devicePixelRatio, y * window.devicePixelRatio, 1, 1).data;
    var _a = Array.from(pixelColor.slice(0, 3)), r = _a[0], g = _a[1], b = _a[2];
    var hex = ((r << 16) | (g << 8) | b).toString(16);
    var colorCode = "#" + ("000000" + hex).slice(-6).toUpperCase();
    console.log("Color of Pixel: ".concat(colorCode));
    var color;
    if (r > 172) { // #B0....
        color = gameUI_1.Color.Red;
    }
    else if (b > 172) {
        color = gameUI_1.Color.Blue;
    }
    return color;
};
function retry(callback, attempts) {
    if (attempts === void 0) { attempts = 5; }
    var result = callback();
    if (result)
        return cy.wrap(result);
    if (attempts == 0)
        return cy.wrap(null);
    cy.log("Retrying");
    return cy.wait(50).then(function () { return retry(callback, attempts - 1); });
}
