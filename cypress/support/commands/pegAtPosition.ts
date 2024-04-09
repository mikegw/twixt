import { positionToCoordinates } from "../helpers/positionToCoordinates";
import { Color } from "../../../src/twixt/gameUI";
import { COLORS } from "../../../src/twixt/gameUI/renderer";
import { Position } from "../../../src/twixt/board";

export function pegAtPosition(position: Position, attempts = 5) {
  return cy.get<HTMLCanvasElement>('#game-canvas').then($canvas => {
    const canvas = $canvas[0]
    const ctx = canvas.getContext('2d')
    const coordinates = positionToCoordinates(canvas, position)

    return retry(() => colorOfPixel(ctx, coordinates), 5)
  });
}


const colorOfPixel = (ctx: CanvasRenderingContext2D, coordinates: { x: number, y: number }) => {
  const { x, y } = coordinates
  const pixelColor = ctx.getImageData(x * window.devicePixelRatio, y * window.devicePixelRatio, 1, 1).data;

  const [r, g, b] = Array.from(pixelColor.slice(0, 3))
  const hex = ((r << 16) | (g << 8) | b).toString(16)
  const colorCode = "#" + ("000000" + hex).slice(-6).toUpperCase()
  console.log(`Color of Pixel: ${colorCode}`)
  let color: Color

  if (r > 172) {// #B0....
    color = Color.Red
  } else if (b > 172) {
    color = Color.Blue
  }

  return color
}

function retry(callback: () => any, attempts = 5): any {
  const result = callback()
  if (result) return cy.wrap(result)
  if (attempts == 0) return cy.wrap(null)

  cy.log("Retrying")
  return cy.wait(50).then(() => retry(callback, attempts - 1))
}
