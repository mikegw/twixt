"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var usernameList_1 = require("../../src/usernameList");
describe('Navigation', function () {
    beforeEach(function () {
        var users = new usernameList_1.UsernameList(this.dataStore);
        users.addUser('Tim');
        cy.loginAs('Mike');
    });
});
