"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
var generateId = function () {
    // https://stackoverflow.com/a/6248722
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    var firstPartString = ("000" + firstPart.toString(36)).slice(-3);
    var secondPartString = ("000" + secondPart.toString(36)).slice(-3);
    return firstPartString + secondPartString;
};
exports.generateId = generateId;
