export const loginAs = (username: string, reload = true) => {
  if (reload) cy.visit('/')

  cy.get('input[name=username]')
    .type(username)

  cy.get('button').contains('Play TwixT')
    .click()

  cy.get('h2').contains('Main Menu').should('be.visible')

  cy.get('button').contains(/^Play$/)
    .click()

  cy.get('h2').contains('Join or Start Game').should('be.visible')
}
