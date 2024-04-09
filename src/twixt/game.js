"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var board_1 = require("./board");
var player_1 = require("./player");
var parse_1 = require("./parse");
var Game = /** @class */ (function () {
    function Game() {
        this.players = [new player_1.Player(player_1.Direction.Vertical), new player_1.Player(player_1.Direction.Horizontal)];
        this.board = new board_1.Board();
        this.moves = [];
        this.currentPlayerIndex = 0;
        this.currentMoveIndex = 0;
        this._winner = null;
    }
    Object.defineProperty(Game.prototype, "currentPlayer", {
        get: function () {
            return this.players[this.currentPlayerIndex];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "waitingPlayer", {
        get: function () {
            return this.players[this.waitingPlayerIndex];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "winner", {
        get: function () {
            if (this._winner)
                return this._winner;
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (this.directionHasWon(player.direction))
                    return player.direction;
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "currentMove", {
        get: function () {
            return this.moves[this.currentMoveIndex];
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.isValidPlacement = function (position) {
        return this.board.isValidPlacement(this.currentPlayer.direction, position);
    };
    Game.prototype.placePeg = function (position) {
        if (this.currentMove)
            return;
        var slot = this.board.place(this.currentPlayer.direction, position);
        if (!slot)
            return { slot: slot, connectionsAdded: [] };
        this.moves.push(position);
        if (this.onStartingBoundary(position))
            slot.isConnectedToStart = true;
        if (this.onEndingBoundary(position))
            slot.isConnectedToEnd = true;
        var connections = this.addConnections(position, slot);
        return { slot: slot, connectionsAdded: connections };
    };
    Game.prototype.removeConnection = function (position) {
    };
    Game.prototype.undo = function () {
        if (!this.currentMove)
            return;
        var position = this.moves.pop();
        var removed = this.board.removePeg(this.currentPlayer.direction, position);
        if (!removed)
            return;
        var neighboringSlots = this.board.neighboringSlots(position);
        for (var _i = 0, neighboringSlots_1 = neighboringSlots; _i < neighboringSlots_1.length; _i++) {
            var neighbor = neighboringSlots_1[_i];
            this.board.disconnect(this.currentPlayer.direction, [position, neighbor.position]);
        }
    };
    Game.prototype.endTurn = function () {
        this.currentMoveIndex = this.moves.length;
        this.currentPlayerIndex = this.waitingPlayerIndex;
    };
    Game.prototype.surrender = function (direction) {
        this._winner = direction == player_1.Direction.Horizontal ? player_1.Direction.Vertical : player_1.Direction.Horizontal;
    };
    Game.prototype.parse = function (rawMoves) {
        var positions = (0, parse_1.parseMoves)(rawMoves);
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
            var position = positions_1[_i];
            this.placePeg(position);
            this.endTurn();
        }
    };
    Object.defineProperty(Game.prototype, "serialize", {
        get: function () {
            return (0, parse_1.serializeMoves)(this.moves);
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.onEndingBoundary = function (position) {
        return (position.row == this.board.size - 1 && this.currentPlayer.direction == player_1.Direction.Vertical) ||
            (position.column == this.board.size - 1 && this.currentPlayer.direction == player_1.Direction.Horizontal);
    };
    Game.prototype.onStartingBoundary = function (position) {
        return (position.row == 0 && this.currentPlayer.direction == player_1.Direction.Vertical) ||
            (position.column == 0 && this.currentPlayer.direction == player_1.Direction.Horizontal);
    };
    Game.prototype.addConnections = function (position, slot) {
        var _this = this;
        var neighboringSlots = this.board.neighboringSlots(position);
        var neighboringSlotsWithColor = neighboringSlots.filter(function (slot) { return slot.direction == _this.currentPlayer.direction; });
        var connections = neighboringSlotsWithColor.map(function (neighbor) { return _this.connect(neighbor, slot); });
        return connections.filter(Boolean);
    };
    Game.prototype.connect = function (slot1, slot2) {
        return this.board.connect(this.currentPlayer.direction, [slot1, slot2]);
    };
    Object.defineProperty(Game.prototype, "waitingPlayerIndex", {
        get: function () {
            return (this.currentPlayerIndex + 1) % this.players.length;
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.directionHasWon = function (direction) {
        console.log("Checking ".concat(direction));
        var connections = this.board.connections.filter(function (connection) { return connection.direction == direction; });
        var checkedConnections = new Set();
        var checked = checkedConnections.has.bind(checkedConnections);
        var connectionsToCheck = connections.filter(function (connection) {
            return connection.slots.some(function (slot) { return slot.isConnectedToStart; });
        });
        var connection;
        var attempts = 0;
        while (connectionsToCheck.length > 0 && attempts < 10) {
            attempts++;
            connection = connectionsToCheck.shift();
            console.log("Checking ".concat(connection));
            checkedConnections.add(connection);
            if (connection.slots.some(function (slot) { return slot.isConnectedToEnd; }))
                return true;
            var neighboringConnections = connections.filter(function (other) { return connection.hasSharedSlots(other); });
            connectionsToCheck.push.apply(connectionsToCheck, neighboringConnections.filter(function (neighbor) { return !checked(neighbor); }));
        }
        return false;
    };
    return Game;
}());
exports.Game = Game;
