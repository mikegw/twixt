"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("../src/twixt/game");
var chai_1 = require("chai");
describe('Move Parsing', function () {
    it('can parse a string of moves', function () {
        var moves = 'B4,H12,D5,H8,E6,I10,G12,B9,B3';
        var game = new game_1.Game();
        game.parse(moves);
        (0, chai_1.expect)(game.board.slots.filter(function (slot) { return slot.isOccupied; }).length).to.eq(9);
        (0, chai_1.expect)(game.board.connections.length).to.eq(3);
    });
    it('can serialize a collection of moves', function () {
        var moves = 'B4,H12,D5,H8,E6,I10,G12,B9,B3';
        var game = new game_1.Game();
        game.parse(moves);
        (0, chai_1.expect)(game.serialize).to.eq(moves);
    });
    it('can pass a string of moves that includes a removed peg', function () {
        var moves = 'B4,H12,D6,D6,D5';
        var game = new game_1.Game();
        game.parse(moves);
        (0, chai_1.expect)(game.board.slots.filter(function (slot) { return slot.isOccupied; }).length).to.eq(3);
        (0, chai_1.expect)(game.board.connections.length).to.eq(1);
    });
});
