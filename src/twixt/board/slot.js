"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
var parse_1 = require("../parse");
var Slot = /** @class */ (function () {
    function Slot(position) {
        this.direction = null;
        this.position = position;
    }
    Object.defineProperty(Slot.prototype, "isOccupied", {
        get: function () {
            return this.direction !== null;
        },
        enumerable: false,
        configurable: true
    });
    Slot.prototype.toString = function () {
        return (0, parse_1.serializeMove)(this.position);
    };
    return Slot;
}());
exports.Slot = Slot;
