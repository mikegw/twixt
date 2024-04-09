"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
var vector_1 = require("./vector");
var Connection = /** @class */ (function () {
    function Connection(direction, slots) {
        var _this = this;
        this.overlaps = function (other) {
            var sharedSlots = _this.sharedSlots(other);
            if (sharedSlots.length == 2)
                return true;
            if (sharedSlots.length == 1)
                return false;
            return (0, vector_1.intersects)(_this.positions, other.positions);
        };
        this.direction = direction;
        this.slots = slots;
    }
    Object.defineProperty(Connection.prototype, "positions", {
        get: function () {
            return [this.slots[0].position, this.slots[1].position];
        },
        enumerable: false,
        configurable: true
    });
    Connection.prototype.toString = function () {
        return "".concat(this.slots[0], "->").concat(this.slots[1], " (").concat(this.direction[0], ")");
    };
    Connection.prototype.hasSharedSlots = function (other) {
        return this.slots.some(function (slot) { return other.slots.includes(slot); });
    };
    Connection.prototype.sharedSlots = function (other) {
        return this.slots.filter(function (slot) { return other.slots.includes(slot); });
    };
    return Connection;
}());
exports.Connection = Connection;
