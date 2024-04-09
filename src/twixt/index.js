"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = void 0;
var game_1 = require("./game");
var gameData_1 = require("./gameData");
var gameUI_1 = require("./gameUI");
var startGame = function (dataStore, player, id, onComplete) {
    var game = new game_1.Game();
    var gameData = new gameData_1.GameData(dataStore, id);
    var gameUI = new gameUI_1.GameUI(game, gameData, player, onComplete);
    gameUI.start();
    /*--- SILLY UI TESTING ---*/
    window.game = game;
    // function shuffle(o: any[]){ //v1.0
    //   for(let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    //   return o;
    // }
    //
    // let shuffled: any[] = [];
    //
    // for (let i = 0; i < game.board.size; i++) {
    //   for (let j = 0; j < game.board.size; j++) {
    //     shuffled.push([i, j]);
    //   }
    // }
    //
    // shuffle(shuffled);
    // const delayMS = 5
    // for (let i = 0; i < shuffled.length*0.8; i++) {
    //   setTimeout(
    //     () => {
    //       if (game.winner) document.getElementById('game-status').innerText = 'GAME OVER'
    //       gameUI.moveMade({row: shuffled[i][0], column: shuffled[i][1]})
    //     },
    //     delayMS*i
    //   )
    // }
};
exports.startGame = startGame;
