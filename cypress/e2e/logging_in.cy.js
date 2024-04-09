describe('Logging in', function () {
    context('as a new user', function () {
        it('requires a valid username', function () {
            cy.visit('/');
            cy.get('input[name=username]')
                .type('<')
                .type('{enter}');
            cy.get('h2').contains('Main Menu').should('not.be.visible');
        });
        it('creates a user automatically', function () {
            cy.visit('/');
            cy.get('input[name=username]')
                .type('NewUser')
                .type('{enter}');
            cy.get('h2').contains('Main Menu').should('be.visible');
        });
    });
    it('keeps the user logged in', function () {
        cy.visit('/');
        cy.get('input[name=username]')
            .type('User')
            .type('{enter}');
        cy.visit('/');
        cy.get('h2').contains('Main Menu').should('be.visible');
    });
    it('keeps a reference to the logged in user', function () {
        cy.visit('/');
        cy.get('input[name=username]')
            .type('User')
            .type('{enter}');
        cy.visit('/');
        cy.get('button').contains(/^Play$/)
            .click();
        cy.get('#users').should('be.empty');
    });
    it('lets a user log out', function () {
        cy.visit('/');
        cy.get('input[name=username]')
            .type('User')
            .type('{enter}');
        cy.logout();
        cy.get('h2').contains('Main Menu').should('not.be.visible');
    });
    it('remembers that a user has been logged out', function () {
        cy.visit('/');
        cy.get('input[name=username]')
            .type('User')
            .type('{enter}');
        cy.logout();
        cy.visit('/');
        cy.get('h2').contains('Main Menu').should('not.be.visible');
    });
    it('clears the list of players on log out', function () {
        cy.loginAs('player1');
        cy.logout();
        cy.loginAs('player2');
        cy.contains('player1');
        cy.logout();
        cy.loginAs('player1', false);
        cy.contains('player2').should('be.visible');
        cy.contains('player1').should('not.exist');
    });
});
