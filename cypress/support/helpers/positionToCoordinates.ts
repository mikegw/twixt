import { BOARD_SIZE, Position } from "../../../src/twixt/board";
import { BOARD_PADDING } from "../../../src/twixt/gameUI/renderer";

export const positionToCoordinates = (canvas: HTMLCanvasElement, position: Position) => {
  const size = canvas.getBoundingClientRect().width
  const slotGapSize = size / (BOARD_SIZE + 2 * BOARD_PADDING)

  const coordinates = {
    x: (position.column + BOARD_PADDING + 0.5) * slotGapSize,
    y: (position.row + BOARD_PADDING + 0.5) * slotGapSize
  }
  console.log(`Coordinates for { row: ${position.row}, column: ${position.column} }: { x: ${coordinates.x}, y: ${coordinates.y} }`)

  return coordinates
}
