"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameData = void 0;
var generateId_1 = require("../generateId");
var GameData = /** @class */ (function () {
    function GameData(dataStore, id) {
        this.dataStore = dataStore;
        this.id = id || (0, generateId_1.generateId)();
    }
    Object.defineProperty(GameData.prototype, "gamePath", {
        get: function () {
            return "games/".concat(this.id);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameData.prototype, "actionsPath", {
        get: function () {
            return this.gamePath + '/actions';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameData.prototype, "firstPlayerPath", {
        get: function () {
            return this.gamePath + '/firstPlayer';
        },
        enumerable: false,
        configurable: true
    });
    GameData.prototype.subscribe = function (callback) {
        this.dataStore.onChildAdded(this.actionsPath, callback);
    };
    GameData.prototype.write = function (action) {
        this.dataStore.append(this.actionsPath, action);
    };
    GameData.prototype.setFirstPlayer = function (name) {
        this.dataStore.write(this.firstPlayerPath, name);
    };
    GameData.prototype.getFirstPlayer = function (callback) {
        this.dataStore.read(this.firstPlayerPath, callback);
    };
    return GameData;
}());
exports.GameData = GameData;
