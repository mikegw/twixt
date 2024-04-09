"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserList = void 0;
var index_1 = require("../index");
var userRow_1 = require("./userRow");
var UserList = /** @class */ (function () {
    function UserList(element, usernames) {
        var _this = this;
        this.addEventListeners = function () {
            var user = index_1.GlobalContext.currentUser;
            user.onInviteReceived(_this.receiveInvite);
            user.onGameInProgress(_this.gameInProgress);
        };
        this.receiveInvite = function (_a, key) {
            var name = _a.name;
            var userLi = document.getElementById("player-".concat(name));
            if (userLi) {
                userLi.setAttribute('invite', 'pending');
                userLi.setAttribute('invite-key', key);
            }
            else {
                setTimeout(function () { return _this.receiveInvite({ name: name }, key); }, 50);
            }
        };
        this.gameInProgress = function (_a, key) {
            var gameId = _a.gameId, opponent = _a.opponent;
            var userLi = document.getElementById("player-".concat(opponent));
            if (!userLi) {
                setTimeout(function () { return _this.gameInProgress({ gameId: gameId, opponent: opponent }, key); }, 50);
                return;
            }
            userLi.setAttribute('invite', 'accepted');
            userLi.setAttribute('game-id', gameId);
            userLi.setAttribute('game-in-progress-key', key);
            index_1.GlobalContext.currentUser.onGameCompleted(function (_a, key) {
                var gameId = _a.gameId, opponent = _a.opponent;
                userLi.removeAttribute('invite');
                userLi.removeAttribute('invite-key');
                userLi.removeAttribute('game-id');
                userLi.removeAttribute('game-in-progress-key');
            });
        };
        this.compare = function (li1, li2) {
            return li1.textContent.toLocaleLowerCase().localeCompare(li2.textContent.toLocaleLowerCase());
        };
        this.usernames = usernames;
        this.element = element;
        this.populate();
        this.addEventListeners();
    }
    UserList.prototype.clear = function () {
        var _this = this;
        return Array.from(this.element.children).map(function (child) { return _this.element.removeChild(child); });
    };
    UserList.prototype.populate = function () {
        var _this = this;
        this.usernames.onUserAdded(function (name) {
            console.log("populate ".concat(name, " for ").concat(index_1.GlobalContext.currentUser.name));
            if (index_1.GlobalContext.currentUser.name == name)
                return;
            var row = _this.newRowElement(name);
            _this.element.appendChild(row.element);
            _this.sort();
        });
        this.usernames.onUserRemoved(function (_, name) {
            var userLi = document.getElementById("player-".concat(name));
            if (userLi)
                userLi.remove();
        });
    };
    UserList.prototype.newRowElement = function (name) {
        return new userRow_1.UserRow({
            name: name,
            onInvite: function () { return index_1.GlobalContext.currentUser.invite({ name: name }); },
            onAcceptInvite: function (key) {
                index_1.GlobalContext.currentUser.acceptInvite({ name: name }, key);
            }
        });
    };
    UserList.prototype.sort = function () {
        var _this = this;
        this.sorting = true;
        setTimeout(function () {
            if (!_this.sorting)
                return;
            _this.sorting = false;
            console.log('Sorting');
            var items = _this.clear();
            var orderedItems = items.sort(_this.compare);
            for (var _i = 0, orderedItems_1 = orderedItems; _i < orderedItems_1.length; _i++) {
                var item = orderedItems_1[_i];
                _this.element.appendChild(item);
            }
        }, 30);
    };
    return UserList;
}());
exports.UserList = UserList;
