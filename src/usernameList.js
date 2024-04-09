"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameList = void 0;
var UsernameList = /** @class */ (function () {
    function UsernameList(dataStore) {
        this.unsubscribeCallbacks = [];
        this.dataStore = dataStore;
    }
    UsernameList.usernamesPath = function () {
        return "userNames";
    };
    UsernameList.usernamePath = function (name) {
        return UsernameList.usernamesPath() + "/".concat(name);
    };
    UsernameList.prototype.addUser = function (name) {
        this.dataStore.write(UsernameList.usernamePath(name), true);
    };
    UsernameList.prototype.onUserAdded = function (callback) {
        var unsubscribe = this.dataStore.onChildAdded(UsernameList.usernamesPath(), function (_, name) { return callback(name); });
        this.unsubscribeCallbacks.push(unsubscribe);
    };
    UsernameList.prototype.onUserRemoved = function (callback) {
        var unsubscribe = this.dataStore.onChildRemoved(UsernameList.usernamesPath(), callback);
        this.unsubscribeCallbacks.push(unsubscribe);
    };
    UsernameList.prototype.unsubscribe = function () {
        this.unsubscribeCallbacks.forEach(function (unsubscribe) { return unsubscribe(); });
    };
    return UsernameList;
}());
exports.UsernameList = UsernameList;
