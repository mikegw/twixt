"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction["Vertical"] = "VERTICAL";
    Direction["Horizontal"] = "HORIZONTAL";
})(Direction || (exports.Direction = Direction = {}));
var Player = /** @class */ (function () {
    function Player(direction) {
        this.direction = direction;
    }
    return Player;
}());
exports.Player = Player;
