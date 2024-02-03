export const startGameWith = (player: string) => {
  cy.get('.player').contains(player)
    .get('.play-game').should('be.visible')
    .click()
}
