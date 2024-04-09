import { Color } from "../../../src/twixt/gameUI";

export const confirmMove = () => {
  cy.waitUntil(() => {
    return cy.get('#game-confirm').then($el => !$el.prop('disabled'))
  }).then(() => {
    cy.get('#game-confirm').click()
    cy.waitUntil(() => {
      return cy.get('#game-confirm').then($el => $el.prop('disabled'))
    })
  })
}
