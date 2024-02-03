export const logout = () => {
  cy.get('#log-out').click()
  cy.get('#get-started').should('be.visible')
}
