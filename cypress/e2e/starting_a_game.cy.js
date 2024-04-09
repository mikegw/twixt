"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("../../src/user");
var usernameList_1 = require("../../src/usernameList");
describe('Starting a Game', function () {
    beforeEach(function () {
        var users = new usernameList_1.UsernameList(this.dataStore);
        users.addUser('Tim');
        cy.loginAs('Mike');
    });
    it('Enables players to invite a friend to play', function () {
        cy.get('.player').contains('Tim')
            .get('.invite-friend')
            .click()
            .then(function () {
            var tim = new user_1.User({ name: 'Tim' }, this.dataStore);
            tim.onInviteReceived(function (invite, key) { return tim.acceptInvite(invite, key); });
        });
        cy.get('.player').contains('Tim')
            .get('.play-game').should('be.visible');
    });
    it('Enables players to accept an invite from a friend', function () {
        var tim = new user_1.User({ name: 'Tim' }, this.dataStore);
        tim.invite({ name: 'Mike' });
        cy.get('.player').contains('Tim')
            .get('.invite-pending').should('be.visible')
            .click();
        cy.get('.player').contains('Tim')
            .get('.play-game').should('be.visible');
    });
    it('Picks a random first player', function () {
        var tim = new user_1.User({ name: 'Tim' }, this.dataStore);
        tim.invite({ name: 'Mike' });
        cy.get('.player').contains('Tim')
            .get('.invite-pending').should('be.visible')
            .click();
        cy.get('.player').contains('Tim')
            .get('.play-game').should('be.visible')
            .click();
        cy.get('#player-color').contains(/RED|BLUE/)
            .then(function (currentPlayer) {
            expect(currentPlayer.text()).to.be.oneOf(['RED', 'BLUE']);
        });
    });
});
