"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("../src/twixt/game");
var player_1 = require("../src/twixt/player");
var chai_1 = require("chai");
describe('When the game is complete', function () {
    it('declares a winner', function () {
        var game = new game_1.Game();
        game.parse('C4,A2,C5,C3,C6,E2,C7,G3,C8,I2,C9,K3,C10,M2,C11,O3,C12,Q2,C13');
        (0, chai_1.expect)(game.winner).to.be.null;
        game.parse('R4');
        (0, chai_1.expect)(game.winner).to.eq(player_1.Direction.Horizontal);
    });
    context('with real games', function () {
        it('declares a winner for game 1', function () {
            var game = new game_1.Game();
            game.parse('C3,N6,E4,M8,D6,D10,C11,C12,B13,B14,K13,P7,J11');
            game.parse('K7,I9,I8,H7,K16,F6,H13,E2,O16,I15,J14,L15,M17');
            game.parse('N16,H10,Q17,N14,P15,G11,M14,O12,Q13,A12,F9,E12');
            game.parse('P10,Q11,Q8,R9');
            console.log(game.board.toString());
            (0, chai_1.expect)(game.winner).to.eq(player_1.Direction.Horizontal);
        });
    });
});
