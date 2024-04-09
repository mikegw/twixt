"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGameBetween = void 0;
var usernameList_1 = require("../../../src/usernameList");
var user_1 = require("../../../src/user");
function startGameBetween(name1, name2) {
    var userNames = new usernameList_1.UsernameList(this.dataStore);
    userNames.addUser(name2);
    var player2 = new user_1.User({ name: name2 }, this.dataStore);
    player2.invite({ name: name1 });
    cy.loginAs(name1);
    cy.acceptInviteFrom(name2);
    cy.startGameWith(name2);
}
exports.startGameBetween = startGameBetween;
