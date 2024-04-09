"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var gameData_1 = require("./twixt/gameData");
var coin_1 = require("./coin");
var User = /** @class */ (function () {
    function User(userData, dataStore) {
        this.unsubscribeCallbacks = [];
        this.name = userData.name;
        this.dataStore = dataStore;
    }
    User.userPath = function (name) {
        return "users/".concat(name);
    };
    User.invitesPath = function (user) {
        return this.userPath(user) + "/invites";
    };
    User.invitePath = function (user, key) {
        return this.invitesPath(user) + "/".concat(key);
    };
    User.gamesInProgressPath = function (user) {
        return this.userPath(user) + "/gamesInProgress";
    };
    User.gameInProgressPath = function (user, key) {
        return this.gamesInProgressPath(user) + "/".concat(key);
    };
    Object.defineProperty(User.prototype, "userPath", {
        get: function () {
            return User.userPath(this.name);
        },
        enumerable: false,
        configurable: true
    });
    User.prototype.invite = function (user) {
        this.dataStore.append(User.invitesPath(user.name), { name: this.name });
    };
    User.prototype.onInviteReceived = function (callback) {
        var unsubscribe = this.dataStore.onChildAdded(User.invitesPath(this.name), callback);
        this.unsubscribeCallbacks.push(unsubscribe);
    };
    User.prototype.acceptInvite = function (invite, key) {
        this.dataStore.destroy(User.invitePath(this.name, key));
        var game = new gameData_1.GameData(this.dataStore);
        game.setFirstPlayer(coin_1.Coin.toss() === coin_1.Coin.Heads ? this.name : invite.name);
        this.dataStore.append(User.gamesInProgressPath(this.name), { gameId: game.id, opponent: invite.name });
        this.dataStore.append(User.gamesInProgressPath(invite.name), { gameId: game.id, opponent: this.name });
    };
    User.prototype.onGameInProgress = function (callback) {
        var unsubscribe = this.dataStore.onChildAdded(User.gamesInProgressPath(this.name), callback);
        this.unsubscribeCallbacks.push(unsubscribe);
    };
    User.prototype.completeGame = function (key) {
        this.dataStore.destroy(User.gameInProgressPath(this.name, key));
    };
    User.prototype.onGameCompleted = function (callback) {
        var unsubscribe = this.dataStore.onChildRemoved(User.gamesInProgressPath(this.name), callback);
        this.unsubscribeCallbacks.push(unsubscribe);
    };
    User.prototype.unsubscribe = function () {
        this.unsubscribeCallbacks.forEach(function (unsubscribe) { return unsubscribe(); });
    };
    return User;
}());
exports.User = User;
