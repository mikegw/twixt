export const surrender = () => {
  cy.get('#game-surrender').click()
  cy.get('#game-status').contains(/BLUE|RED wins!/)
}
