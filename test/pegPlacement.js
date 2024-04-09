"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var game_1 = require("../src/twixt/game");
var player_1 = require("../src/twixt/player");
describe('Peg Placement', function () {
    it('can place a peg on the board', function () {
        var game = new game_1.Game();
        var position = { row: 5, column: 4 };
        var result = game.placePeg(position);
        (0, chai_1.expect)(result.slot).not.to.be.null;
    });
    it('can only place a single peg at a given position', function () {
        var game = new game_1.Game();
        var position = { row: 5, column: 4 };
        game.placePeg(position);
        game.endTurn();
        var result = game.placePeg(position);
        (0, chai_1.expect)(result.slot).to.be.null;
    });
    it('can only place a peg on the board', function () {
        var game = new game_1.Game();
        var result = game.placePeg({ row: 4, column: -1 });
        (0, chai_1.expect)(result.slot).to.be.null;
    });
    it('can not place a peg in a corner', function () {
        var game = new game_1.Game();
        var corners = [
            { row: 0, column: 0 },
            { row: 0, column: game.board.size - 1 },
            { row: game.board.size - 1, column: 0 },
            { row: 0, column: game.board.size - 1 }
        ];
        var placementResults = corners.map(function (corner) { return game.placePeg(corner); });
        var validPlacements = placementResults.filter(function (result) { return result.slot; });
        (0, chai_1.expect)(validPlacements).to.be.empty;
    });
    it('connects two pegs of the same color an L-shape apart', function () {
        var game = new game_1.Game();
        game.placePeg({ row: 1, column: 1 });
        game.endTurn();
        game.placePeg({ row: 10, column: 10 });
        game.endTurn();
        var result = game.placePeg({ row: 2, column: 3 });
        (0, chai_1.expect)(result.connectionsAdded[0].positions).not.to.be.null;
    });
    it('only connects pegs of the same color', function () {
        var game = new game_1.Game();
        game.placePeg({ row: 1, column: 1 });
        game.endTurn();
        var result = game.placePeg({ row: 2, column: 3 });
        (0, chai_1.expect)(result.connectionsAdded).to.be.empty;
    });
    it('can create more than one connection at a time', function () {
        var game = new game_1.Game();
        game.placePeg({ row: 1, column: 1 });
        game.endTurn();
        game.placePeg({ row: 10, column: 10 });
        game.endTurn();
        game.placePeg({ row: 4, column: 4 });
        game.endTurn();
        game.placePeg({ row: 9, column: 10 });
        game.endTurn();
        var result = game.placePeg({ row: 2, column: 3 });
        (0, chai_1.expect)(result.connectionsAdded.length).to.eq(2);
    });
    it('does not add overlapping connections', function () {
        var game = new game_1.Game();
        game.placePeg({ row: 1, column: 1 });
        game.endTurn();
        game.placePeg({ row: 2, column: 1 });
        game.endTurn();
        game.placePeg({ row: 2, column: 3 });
        game.endTurn();
        var result = game.placePeg({ row: 1, column: 3 });
        (0, chai_1.expect)(result.connectionsAdded).to.be.empty;
    });
    it('can place connections for each player', function () {
        var game = new game_1.Game();
        game.placePeg({ row: 1, column: 1 });
        game.endTurn();
        game.placePeg({ row: 4, column: 4 });
        game.endTurn();
        game.placePeg({ row: 2, column: 3 });
        game.endTurn();
        game.placePeg({ row: 5, column: 6 });
        game.endTurn();
        (0, chai_1.expect)(game.board.connections.length).to.eq(2);
    });
    it('can place multiple connections for a player', function () {
        var game = new game_1.Game();
        game.placePeg({ row: 0, column: 1 });
        game.endTurn();
        game.placePeg({ row: 1, column: 0 });
        game.endTurn();
        game.placePeg({ row: 2, column: 2 });
        game.endTurn();
        game.placePeg({ row: 2, column: 0 });
        game.endTurn();
        game.placePeg({ row: 0, column: 3 });
        (0, chai_1.expect)(game.board.connections.length).to.eq(2);
    });
    it('does not allow players to place pegs on their opponents border rows', function () {
        var game = new game_1.Game();
        var result = game.placePeg({ row: 1, column: 0 });
        (0, chai_1.expect)(result.slot).to.be.null;
    });
    it('exposes pegs in the order they were placed', function () {
        var game = new game_1.Game();
        game.placePeg({ row: 0, column: 1 });
        game.endTurn();
        game.placePeg({ row: 2, column: 2 });
        game.endTurn();
        game.placePeg({ row: 1, column: 1 });
        (0, chai_1.expect)(game.board.slots[2].direction).to.eq(player_1.Direction.Vertical);
    });
    it('can undo a move', function () {
        var game = new game_1.Game();
        var position = { row: 0, column: 1 };
        game.placePeg(position);
        game.undo();
        (0, chai_1.expect)(game.board.slotAt(position)).to.be.undefined;
    });
    describe('when undoing a move', function () {
        it('removes the most recently placed peg', function () {
            var game = new game_1.Game();
            game.placePeg({ row: 0, column: 1 });
            game.endTurn();
            game.placePeg({ row: 1, column: 0 });
            game.undo();
            (0, chai_1.expect)(game.board.slotAt({ row: 0, column: 1 })).not.to.be.undefined;
        });
        it('removes connections to neighboring pegs', function () {
            var game = new game_1.Game();
            game.placePeg({ row: 0, column: 1 });
            game.endTurn();
            game.placePeg({ row: 1, column: 0 });
            game.endTurn();
            game.placePeg({ row: 1, column: 3 });
            game.undo();
            (0, chai_1.expect)(game.board.connections).to.be.empty;
        });
        it('only removes neighboring pegs', function () {
            var game = new game_1.Game();
            game.placePeg({ row: 0, column: 1 });
            game.endTurn();
            game.placePeg({ row: 1, column: 0 });
            game.endTurn();
            game.placePeg({ row: 1, column: 3 });
            game.endTurn();
            game.placePeg({ row: 2, column: 0 });
            game.endTurn();
            game.placePeg({ row: 3, column: 4 });
            (0, chai_1.expect)(game.board.connections.length).to.eq(2);
            game.undo();
            (0, chai_1.expect)(game.board.connections).not.to.be.empty;
        });
    });
});
