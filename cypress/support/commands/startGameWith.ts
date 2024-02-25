import { positionToCoordinates } from "../helpers/positionToCoordinates";

export const startGameWith = (player: string) => {
  cy.get('.player').contains(player)
    .get('.play-game').should('be.visible')
    .click()

  return cy.get<HTMLCanvasElement>('#game-canvas').then($canvas => {
    const canvas = $canvas[0]
    const ctx = canvas.getContext('2d')

    const { x, y } = positionToCoordinates(canvas, { row: 1, column: 1 })
    const pixel = ctx.getImageData(x * window.devicePixelRatio, y * window.devicePixelRatio, 1, 1).data;

    const [r, g, b] = Array.from(pixel.slice(0,3))
    const hex = ((r << 16) | (g << 8) | b).toString(16)
    const colorCode = "#" + ("000000" + hex).slice(-6).toUpperCase()
    expect(colorCode).to.eq('#999999')
  })
}
