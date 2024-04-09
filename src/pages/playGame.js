"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayGame = void 0;
var index_1 = require("../index");
var twixt_1 = require("../twixt");
var canvas_1 = require("../twixt/gameUI/canvas");
function PlayGame() {
    var canvas = new canvas_1.Canvas();
    canvas.clear();
    setTimeout(function () {
        (0, twixt_1.startGame)(index_1.GlobalContext.dataStore, index_1.GlobalContext.currentUser.name, index_1.GlobalContext.gameId, function () { return index_1.GlobalContext.currentUser.completeGame(index_1.GlobalContext.gameInProgressKey); });
    }, 0);
}
exports.PlayGame = PlayGame;
