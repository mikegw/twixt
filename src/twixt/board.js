"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = exports.BOARD_SIZE = exports.isPosition = void 0;
var vector_1 = require("./board/vector");
var slot_1 = require("./board/slot");
var connection_1 = require("./board/connection");
var player_1 = require("./player");
var parse_1 = require("./parse");
function isPosition(data) {
    return 'row' in data && 'column' in data;
}
exports.isPosition = isPosition;
exports.BOARD_SIZE = 18;
var Board = /** @class */ (function () {
    function Board(size) {
        if (size === void 0) { size = exports.BOARD_SIZE; }
        var _this = this;
        this.slots = [];
        this.connections = [];
        this.slotAt = function (position) {
            return _this.slots.find(function (slot) { return (0, vector_1.sameVectors)(slot.position, position); });
        };
        this.isValidPosition = function (position) {
            return (_this.isOnBoard(position) &&
                !_this.corners.some(function (corner) { return (0, vector_1.sameVectors)(position, corner); }));
        };
        this.isValidConnection = function (connection) {
            return !(_this.connections.some(function (other) { return connection.overlaps(other); }));
        };
        this.isOnBoard = function (position) {
            return (position.row >= 0 &&
                position.row < _this.size &&
                position.column >= 0 &&
                position.column < _this.size);
        };
        this.size = size;
    }
    Board.prototype.toString = function () {
        var _this = this;
        var newRow = function () { return new Array(_this.size).fill('.'); };
        var rows = new Array(this.size).fill(null).map(function (x) { return newRow(); });
        for (var _i = 0, _a = this.corners; _i < _a.length; _i++) {
            var corner = _a[_i];
            rows[corner.row][corner.column] = 'X';
        }
        for (var _b = 0, _c = this.slots; _b < _c.length; _b++) {
            var slot = _c[_b];
            rows[slot.position.row][slot.position.column] = slot.direction[0];
        }
        return rows.map(function (row) { return row.join('  '); }).join("\n");
    };
    Board.prototype.isValidPlacement = function (direction, position) {
        console.log("Checking ".concat((0, parse_1.serializeMoves)([position])));
        if (!this.isValidPosition(position))
            return false;
        // console.log('Valid')
        if (this.onOpponentBorder(position, direction))
            return false;
        // console.log('Not on opponent border')
        var slot = this.slotAt(position);
        return !slot;
    };
    Board.prototype.place = function (direction, position) {
        if (!this.isValidPlacement(direction, position))
            return null;
        console.log("Placing a ".concat(direction, " peg at ").concat((0, parse_1.serializeMoves)([position])));
        var slot = new slot_1.Slot(position);
        slot.direction = direction;
        this.slots.push(slot);
        return slot;
    };
    Board.prototype.removePeg = function (direction, position) {
        return removeMatchingElements(this.slots, function (slot) { return slot.direction == direction && (0, vector_1.sameVectors)(slot.position, position); })[0];
    };
    Board.prototype.connect = function (direction, slots) {
        var connection = new connection_1.Connection(direction, slots);
        if (!this.isValidConnection(connection))
            return null;
        this.connections.push(connection);
        return connection;
    };
    Board.prototype.disconnect = function (direction, positions) {
        return removeMatchingElements(this.connections, function (connection) {
            var connectionSlotPositions = connection.slots.map(function (slot) { return slot.position; });
            return connection.direction == direction && samePositions(positions, connectionSlotPositions);
        });
    };
    Board.prototype.neighboringSlots = function (position) {
        return this.neighboringPositions(position).map(this.slotAt).filter(function (slot) { return slot; });
    };
    Object.defineProperty(Board.prototype, "corners", {
        get: function () {
            return [
                { row: 0, column: 0 },
                { row: 0, column: this.size - 1 },
                { row: this.size - 1, column: 0 },
                { row: this.size - 1, column: this.size - 1 }
            ];
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.onOpponentBorder = function (position, direction) {
        return (direction == player_1.Direction.Vertical && (position.column == 0 || position.column == this.size - 1) ||
            direction == player_1.Direction.Horizontal && (position.row == 0 || position.row == this.size - 1));
    };
    Board.prototype.neighboringPositions = function (position) {
        var potentialNeighbors = Board.neighborDiffs.map(function (diff) { return (0, vector_1.addVectors)(position, diff); });
        return potentialNeighbors.filter(this.isValidPosition);
    };
    Board.neighborDiffs = [
        { row: 1, column: 2 },
        { row: 2, column: 1 },
        { row: 1, column: -2 },
        { row: -2, column: 1 },
        { row: -1, column: 2 },
        { row: 2, column: -1 },
        { row: -1, column: -2 },
        { row: -2, column: -1 }
    ];
    return Board;
}());
exports.Board = Board;
var removeMatchingElements = function (array, predicate) {
    var index;
    var removed = [];
    while ((index = array.findIndex(predicate)) >= 0) {
        removed.push(array[index]);
        array.splice(index, 1);
    }
    return removed;
};
var samePositions = function (positions1, positions2) {
    if (positions1.length != positions2.length)
        return false;
    return positions2.every(function (p2) { return positions1.some(function (p1) { return (0, vector_1.sameVectors)(p1, p2); }); });
};
