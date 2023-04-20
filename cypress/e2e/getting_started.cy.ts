import { User } from "../../src/user";
import { UsernameList } from "../../src/usernameList";
import { dataStore as buildDataStore } from "../../src/dataStore/firebase";
import { TestDataStore } from "../../src/dataStore";


describe('Getting Started', function() {
  beforeEach(function () {
    const users = new UsernameList(this.dataStore)
    users.addUser('Tim')

    cy.loginAs('Mike')
  })

  it('Enables players to invite a friend to play', function() {
    cy.get('.player').contains('Tim')
      .get('.invite-friend')
      .click()
      .then(function() {
        const tim = new User({ name: 'Tim' }, this.dataStore)
        tim.onInviteReceived((invite, key) => tim.acceptInvite(invite, key))
      })

    cy.get('.player').contains('Tim')
      .get('.play-game').should('be.visible')
  })

  it('Enables players to accept an invite from a friend', function() {
    const tim = new User({ name: 'Tim' }, this.dataStore)
    tim.invite({ name: 'Mike' })

    cy.get('.player').contains('Tim')
      .get('.invite-pending').should('be.visible')
      .click()

    cy.get('.player').contains('Tim')
      .get('.play-game').should('be.visible')
  })

  it('Picks a random first player', function () {
    const tim = new User({ name: 'Tim' }, this.dataStore)
    tim.invite({ name: 'Mike' })

    cy.get('.player').contains('Tim')
      .get('.invite-pending').should('be.visible')
      .click()

    cy.get('.player').contains('Tim')
      .get('.play-game').should('be.visible')
      .click()

    cy.get('#currentPlayer').then(currentPlayer => {
      expect(currentPlayer.text()).to.be.oneOf(['Tim', 'Mike'])
    })
  })
})
