import { Position } from "../../../src/twixt/board";
import { Color } from "../../../src/twixt/player";
import { positionToCoordinates } from "../helpers/positionToCoordinates";

export const playMove = (position: Position, color: Color, confirm = true) => {
  return cy.get<HTMLCanvasElement>('#game-canvas')
    .then(canvas => {
      const { x, y } = positionToCoordinates(canvas[0], position)
      cy.get('#game-canvas').click(x, y)
      if (confirm) {
        return cy.waitUntil(() => {
          return cy.get('#game-confirm').then($el => !$el.prop('disabled'))
        }).then(() => {
          cy.get('#game-confirm').click()
          cy.get('#current-player').contains(color === Color.Red ? Color.Blue : Color.Red)
        })
      }
    })
}
