import { Color } from "../../../src/twixt/gameUI";

export const undoMove = (color: Color) => {
  cy.waitUntil(() => {
    return cy.get('#game-undo').then($el => !$el.prop('disabled'))
  }).then(() => {
    cy.get('#game-undo').click()
    cy.waitUntil(() => {
      return cy.get('#game-undo').then($el => $el.prop('disabled'))
    })
  })
}
