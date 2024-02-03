import { parseMove } from "../../../src/twixt/parse";
import { COLORS } from "../../../src/twixt/gameUI/renderer";
import { Color } from "../../../src/twixt/player";
import { positionToCoordinates } from "../helpers/positionToCoordinates";

export const pegAt = (rawPosition: string) => {
  const position = parseMove(rawPosition)

  return cy.get<HTMLCanvasElement>('#game-canvas').then($canvas => {
    const canvas = $canvas[0]
    const ctx = canvas.getContext('2d')

    const { x, y} = positionToCoordinates(canvas, position)
    const pixel = ctx.getImageData(x * window.devicePixelRatio, y * window.devicePixelRatio, 1, 1).data;

    const [r, g, b] = Array.from(pixel.slice(0,3))
    const hex = ((r << 16) | (g << 8) | b).toString(16)
    const colorCode = "#" + ("000000" + hex).slice(-6).toUpperCase()
    console.log(colorCode)
    let color: Color

    switch(colorCode) {
      case COLORS[Color.Red]:
      case '#F842A3': // Red but highlighted
        color = Color.Red
        break;
      case COLORS[Color.Blue]:
      case '#5F93F5': // Blue but highlighted
        color = Color.Blue
        break;
      default:
        color = null
    }

    return cy.wrap(color)
  })
}
