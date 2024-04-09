"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playMoves = void 0;
var parse_1 = require("../../../src/twixt/parse");
var user_1 = require("../../../src/user");
var gameData_1 = require("../../../src/twixt/gameData");
var gameUI_1 = require("../../../src/twixt/gameUI");
function playMoves(opponentName, moves) {
    var _this = this;
    var positions = (0, parse_1.parseMoves)(moves);
    var rawMoves = moves.split(',');
    var receiveGame = new Promise(function (resolve) {
        _this.dataStore.read(user_1.User.gamesInProgressPath(opponentName), function (games) {
            resolve(Object.values(games)[0]);
        });
    });
    return cy.wrap(receiveGame)
        .then(function (gameInProgress) {
        var gameData = cy.wrap(new gameData_1.GameData(_this.dataStore, gameInProgress.gameId))
            .as('gameData');
        cy.get('#player-color')
            .contains(/RED|BLUE/)
            .invoke('text')
            .as('playerColor')
            .then(function () {
            var _loop_1 = function (i) {
                if (i % 2 == 1) {
                    cy.log('Opponent to move', positions[i])
                        .then(function () {
                        _this.gameData.write({ kind: 'PLACE_PEG', position: positions[i] });
                        _this.gameData.write({ kind: 'END_TURN' });
                    });
                    cy.pegAtPosition(positions[i]).should("eq", gameUI_1.Color.Blue);
                }
                else {
                    cy.log('Player to move', positions[i]);
                    cy.playMove(positions[i]);
                    cy.get('#current-player').contains(gameUI_1.Color.Blue);
                }
            };
            for (var i = 0; i < positions.length; i++) {
                _loop_1(i);
            }
        });
    });
}
exports.playMoves = playMoves;
