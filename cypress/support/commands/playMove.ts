import { Position } from "../../../src/twixt/board";
import { Color } from "../../../src/twixt/gameUI";
import { positionToCoordinates } from "../helpers/positionToCoordinates";

export const playMove = (position: Position, confirm = true) => {
  return cy.get<HTMLCanvasElement>('#game-canvas')
    .then(canvas => {
      const { x, y } = positionToCoordinates(canvas[0], position)
      cy.get('#game-canvas').click(x, y)
      if (confirm) {
        return cy.confirmMove()
      }
    })
}
