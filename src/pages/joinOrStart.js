"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinOrStart = void 0;
var userList_1 = require("../components/userList");
var usernameList_1 = require("../usernameList");
var index_1 = require("../index");
var userList;
var JoinOrStart = function () {
    if (userList !== undefined)
        return;
    var userListElement = document.getElementById('users');
    var usernames = new usernameList_1.UsernameList(index_1.GlobalContext.dataStore);
    userList = new userList_1.UserList(userListElement, usernames);
};
exports.JoinOrStart = JoinOrStart;
