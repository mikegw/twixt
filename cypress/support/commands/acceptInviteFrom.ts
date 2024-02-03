export const acceptInviteFrom = (player: string) => {
  cy.get('.player').contains(player)
    .get('.invite-pending').should('be.visible')
    .click()
}
