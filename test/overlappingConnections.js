"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var slot_1 = require("../src/twixt/board/slot");
var connection_1 = require("../src/twixt/board/connection");
var player_1 = require("../src/twixt/player");
function buildConnection(position1, position2) {
    return new connection_1.Connection(player_1.Direction.Vertical, [new slot_1.Slot(position1), new slot_1.Slot(position2)]);
}
describe('checking whether two connections overlap', function () {
    context('when the connections do not share anything', function () {
        it('allows the connection', function () {
            var connection1 = buildConnection({ row: 1, column: 1 }, { row: 2, column: 3 });
            var connection2 = buildConnection({ row: 4, column: 4 }, { row: 5, column: 6 });
            (0, chai_1.expect)(connection1.overlaps(connection2)).to.be.false;
        });
    });
    context('when the connections do not share columns', function () {
        it('allows the connection', function () {
            var connection1 = buildConnection({ row: 1, column: 1 }, { row: 2, column: 3 });
            var connection2 = buildConnection({ row: 1, column: 4 }, { row: 2, column: 6 });
            (0, chai_1.expect)(connection1.overlaps(connection2)).to.be.false;
        });
    });
    context('when the connections do not share rows', function () {
        it('allows the connection', function () {
            var connection1 = buildConnection({ row: 1, column: 1 }, { row: 2, column: 3 });
            var connection2 = buildConnection({ row: 4, column: 1 }, { row: 5, column: 3 });
            (0, chai_1.expect)(connection1.overlaps(connection2)).to.be.false;
        });
    });
    context('when the two connections share a slot', function () {
        it('allows the connection', function () {
            var connection1 = buildConnection({ row: 1, column: 1 }, { row: 3, column: 2 });
            var connection2 = buildConnection({ row: 1, column: 3 }, { row: 3, column: 2 });
            (0, chai_1.expect)(connection1.overlaps(connection2)).to.be.false;
        });
    });
    context('when the two connections share both slots', function () {
        it('does not allow the connection', function () {
            var connection1 = buildConnection({ row: 1, column: 1 }, { row: 2, column: 3 });
            var connection2 = buildConnection({ row: 1, column: 1 }, { row: 2, column: 3 });
            (0, chai_1.expect)(connection1.overlaps(connection2)).to.be.true;
        });
    });
    context('when the first slot of the new connection is colinear with the old connection', function () {
        it('allows the connection', function () {
            var old = buildConnection({ row: 3, column: 3 }, { row: 4, column: 5 });
            var connection = buildConnection({ row: 6, column: 9 }, { row: 5, column: 11 });
            (0, chai_1.expect)(connection.overlaps(old)).to.be.false;
        });
    });
    context('when a slot from the new connection bisects a long side of the rectangle defined by the old connection', function () {
        context('when the other slot is on the same side of the old connection', function () {
            it('allows the connection', function () {
                var old = buildConnection({ row: 3, column: 3 }, { row: 4, column: 5 });
                var firstPosition = { row: 3, column: 4 };
                var otherPositions = [
                    // {row: 2, column: 2},
                    // {row: 1, column: 3},
                    // {row: 1, column: 5},
                    // {row: 2, column: 6},
                    { row: 4, column: 6 }
                ];
                var allowedConnections = otherPositions.map(function (position) { return buildConnection(firstPosition, position); });
                for (var _i = 0, allowedConnections_1 = allowedConnections; _i < allowedConnections_1.length; _i++) {
                    var connection = allowedConnections_1[_i];
                    (0, chai_1.expect)(connection.overlaps(old)).to.be.false;
                }
            });
        });
        context('when the other slot is on the opposite side of the old connection', function () {
            it('prevents the connection', function () {
                var old = buildConnection({ row: 3, column: 3 }, { row: 4, column: 5 });
                var firstPosition = { row: 3, column: 4 };
                var otherPositions = [
                    { row: 5, column: 5 },
                    { row: 5, column: 3 },
                    { row: 4, column: 2 },
                ];
                var allowedConnections = otherPositions.map(function (position) { return buildConnection(firstPosition, position); });
                for (var _i = 0, allowedConnections_2 = allowedConnections; _i < allowedConnections_2.length; _i++) {
                    var connection = allowedConnections_2[_i];
                    (0, chai_1.expect)(connection.overlaps(old)).to.be.true;
                }
            });
        });
    });
});
