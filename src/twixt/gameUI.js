"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameUI = exports.ColorForDirection = exports.Color = void 0;
var renderer_1 = require("./gameUI/renderer");
var canvas_1 = require("./gameUI/canvas");
var player_1 = require("./player");
var Color;
(function (Color) {
    Color["Red"] = "RED";
    Color["Blue"] = "BLUE";
})(Color || (exports.Color = Color = {}));
exports.ColorForDirection = new Map([
    [player_1.Direction.Vertical, Color.Red],
    [player_1.Direction.Horizontal, Color.Blue]
]);
var GameUI = /** @class */ (function () {
    function GameUI(game, gameData, player, onComplete) {
        var _this = this;
        this.undo = function () {
            _this.gameData.write({ kind: 'UNDO' });
        };
        this.endTurn = function () {
            console.log('Move confirmed');
            _this.gameData.write({ kind: 'END_TURN' });
        };
        this.surrender = function () {
            console.log('I SURRENDER!');
            _this.gameData.write({ kind: 'SURRENDER', direction: _this.direction });
        };
        this.actionReceived = function (action) {
            console.log('Received Action:', action);
            switch (action.kind) {
                case 'PLACE_PEG':
                    var placePegResult = _this.game.placePeg(action.position);
                    console.debug("Move made by ".concat(_this.game.currentPlayer.direction, ": ").concat(placePegResult.slot));
                    break;
                case 'UNDO':
                    _this.game.undo();
                    _this.actionButtons.get('confirm').disabled = true;
                    _this.actionButtons.get('undo').disabled = true;
                    break;
                case 'END_TURN':
                    _this.game.endTurn();
                    _this.moveInProgress = null;
                    _this.actionButtons.get('confirm').disabled = true;
                    _this.actionButtons.get('undo').disabled = true;
                    break;
                case "SURRENDER":
                    _this.game.surrender(action.direction);
            }
            _this.renderer.setConnectionDirection(_this.game.currentPlayer.direction);
            _this.render();
            if (_this.game.winner) {
                _this.setCurrentPlayerColor(_this.game.winner);
                _this.playerStatusSpan.innerText = 'wins!';
                _this.onComplete();
            }
            else {
                _this.setCurrentPlayerColor(_this.game.currentPlayer.direction);
            }
        };
        this.windowResized = function () {
            _this.canvas.setDimensions();
            _this.renderer.prerenderEmptyBoard();
            _this.render();
        };
        this.game = game;
        this.gameData = gameData;
        this.canvas = new canvas_1.Canvas();
        this.renderer = new renderer_1.Renderer(this.canvas, this.game.board);
        this.currentPlayerSpan = document.getElementById('current-player');
        this.playerStatusSpan = document.getElementById('player-status');
        this.actionButtons = new Map;
        this.onComplete = onComplete;
        var playerColorSpan = document.getElementById('player-color');
        gameData.getFirstPlayer(function (firstPlayer) {
            _this.color = player == firstPlayer ? Color.Red : Color.Blue;
            _this.direction = player == firstPlayer ? player_1.Direction.Vertical : player_1.Direction.Horizontal;
            _this.setPlayerColor(playerColorSpan, _this.color);
        });
        this.setPlayerColor(this.currentPlayerSpan, Color.Red);
        this.playerStatusSpan.innerText = 'to move';
    }
    GameUI.prototype.start = function () {
        var _this = this;
        this.canvas.setDimensions();
        this.renderer.prerenderEmptyBoard();
        window.addEventListener("resize", this.windowResized);
        document.addEventListener('DOMContentLoaded', this.windowResized);
        this.gameData.subscribe(this.actionReceived);
        this.canvas.whenClicked(function (cursorPosition) { return _this.canvasClicked(cursorPosition); });
        this.addActionButton('confirm', 'game-confirm', this.endTurn);
        this.addActionButton('undo', 'game-undo', this.undo);
        this.addActionButton('surrender', 'game-surrender', this.surrender);
        this.renderer.draw();
    };
    GameUI.prototype.canvasClicked = function (cursorPosition) {
        if (this.game.currentPlayer.direction != this.direction)
            return;
        var position = {
            row: Math.floor(cursorPosition.y / this.slotGapSize) - renderer_1.BOARD_PADDING,
            column: Math.floor(cursorPosition.x / this.slotGapSize) - renderer_1.BOARD_PADDING
        };
        console.log("Position Clicked: ", position);
        if (!this.game.isValidPlacement(position))
            return;
        this.placePeg(position);
    };
    GameUI.prototype.placePeg = function (position) {
        if (this.moveInProgress)
            this.undo();
        this.gameData.write({ kind: 'PLACE_PEG', position: position });
        this.moveInProgress = position;
        this.actionButtons.get('confirm').disabled = false;
        this.actionButtons.get('undo').disabled = false;
    };
    GameUI.prototype.render = function () {
        this.renderer.draw();
    };
    Object.defineProperty(GameUI.prototype, "slotGapSize", {
        get: function () {
            return this.canvas.size / (this.game.board.size + 2 * renderer_1.BOARD_PADDING);
        },
        enumerable: false,
        configurable: true
    });
    GameUI.prototype.setPlayerColor = function (span, color) {
        this.renderer.setBoundariesDirection(color == Color.Red ? player_1.Direction.Vertical : player_1.Direction.Horizontal);
        span.innerText = color;
        span.setAttribute('color', color);
    };
    GameUI.prototype.setCurrentPlayerColor = function (direction) {
        var color = exports.ColorForDirection.get(direction);
        this.currentPlayerSpan.innerText = color;
        this.currentPlayerSpan.setAttribute('color', color);
    };
    GameUI.prototype.addActionButton = function (name, buttonId, actionHandler) {
        var buttonElement = document.getElementById(buttonId);
        var newButton = buttonElement.cloneNode(true);
        buttonElement.replaceWith(newButton);
        newButton.addEventListener('click', actionHandler);
        this.actionButtons.set(name, newButton);
    };
    return GameUI;
}());
exports.GameUI = GameUI;
