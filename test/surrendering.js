"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("../src/twixt/game");
var chai_1 = require("chai");
var player_1 = require("../src/twixt/player");
describe('When a player surrenders', function () {
    it('declares the other player as the winner', function () {
        var game = new game_1.Game();
        game.parse('C4,A2');
        (0, chai_1.expect)(game.winner).to.be.null;
        game.surrender(player_1.Direction.Vertical);
        (0, chai_1.expect)(game.winner).to.eq(player_1.Direction.Horizontal);
    });
    it('can happen out of turn', function () {
        var game = new game_1.Game();
        game.parse('C4,A2');
        (0, chai_1.expect)(game.winner).to.be.null;
        game.surrender(player_1.Direction.Horizontal);
        (0, chai_1.expect)(game.winner).to.eq(player_1.Direction.Vertical);
    });
});
