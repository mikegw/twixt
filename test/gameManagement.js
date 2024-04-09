"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var game_1 = require("../src/twixt/game");
var player_1 = require("../src/twixt/player");
describe('Game Management', function () {
    it('can start a new game', function () {
        var game = new game_1.Game();
        (0, chai_1.expect)(game.currentPlayer.direction).to.eq(player_1.Direction.Vertical);
    });
    it('alternates between players', function () {
        var game = new game_1.Game();
        game.placePeg({ row: 4, column: 5 });
        (0, chai_1.expect)(game.currentPlayer.direction).to.eq(player_1.Direction.Horizontal);
    });
});
