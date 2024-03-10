import { Board, Position } from "../board"
import { Canvas, Coordinates } from "./canvas";
import { Direction } from "../player";
import { AnimatedPeg, drawPeg, pegRadius } from "./renderer/renderPeg";
import { AnimatedConnection, drawConnection } from "./renderer/renderConnection";
import { Color } from "../gameUI";

const EMPTY_SLOT_RADIUS = 0.003
const BOUNDARY_WIDTH = 0.002

const EMPTY_SLOT_COLOR = '#999'
const HIGHLIGHT_COLOR = '#FFFFFF22'

export const COLORS: Record<Color, string> = {
  'RED': '#F72595',
  'BLUE': '#4682F4'
}

export const BOARD_PADDING = 1

const LABEL_COLOR = '#FAD240'

export class Renderer {
  canvas: Canvas
  board: Board
  padding = BOARD_PADDING
  animatedPegs: AnimatedPeg[] = []
  animatedConnections: AnimatedConnection[] = []

  get slotGapSize() {
    return this.canvas.size / (this.board.size + 2 * this.padding)
  }

  constructor(canvas: Canvas, board: Board) {
    this.canvas = canvas
    this.board = board
    this.prerenderEmptyBoard()
  }

  draw() {
    window.requestAnimationFrame(() => {
      this.canvas.clear()
      this.canvas.prerender()
      this.drawConnections()
      this.drawPegs()

      this.highlightLastPegDrawn()

      if (this.animatedPegs.some(animation => animation.completion < 1)) this.draw()
    })
  }

  prerenderEmptyBoard() {
    this.drawEmptySlots()
    this.drawBoundaries()
    this.drawLabels()
  }

  private drawEmptySlots() {
    for (let row = 0; row < this.board.size; row++) {
      for (let column = 0; column < this.board.size; column++) {
        const position = { row, column }
        if (!this.board.isValidPosition(position)) continue

        this.canvas.drawCircle(
          this.positionToCoordinates(position),
          this.emptySlotRadius,
          EMPTY_SLOT_COLOR,
          true
        )
      }
    }
  }

  private drawBoundaries() {
    const min = this.slotGapSize * (1 + BOARD_PADDING)
    const max = this.canvas.size - min

    const topLeft = { x: min, y: min }
    const topRight = { x: max, y: min }
    const bottomLeft = { x: min, y: max }
    const bottomRight = { x: max, y: max }

    this.canvas.drawLine(COLORS[Color.Red], this.boundaryWidth, topLeft, topRight, true)
    this.canvas.drawLine(COLORS[Color.Red], this.boundaryWidth, bottomLeft, bottomRight, true)
    this.canvas.drawLine(COLORS[Color.Blue], this.boundaryWidth, topLeft, bottomLeft, true)
    this.canvas.drawLine(COLORS[Color.Blue], this.boundaryWidth, topRight, bottomRight, true)
  }

  private drawConnections() {
    for (let connection of this.board.connections) {
      let animatedConnection =
        this.animatedConnections.find(animated => animated.connection == connection)

      if (!animatedConnection) {
        animatedConnection = { connection, completion: 0 }
        this.animatedConnections.push(animatedConnection)
      }

      drawConnection(animatedConnection, this.canvas, this.slotGapSize)
    }
  }

  private drawPegs() {
    for (let slot of this.board.slots) {
      let animatedPeg = this.animatedPegs.find(animated => animated.peg == slot)
      if (!animatedPeg) {
        animatedPeg = { peg: slot, completion: 0 }
        this.animatedPegs.push(animatedPeg)
      }
      drawPeg(animatedPeg, this.canvas, this.slotGapSize)
    }
  }

  private highlightLastPegDrawn() {
    const lastPegDrawn = this.animatedPegs[this.animatedPegs.length - 1]
    if(!lastPegDrawn) return

    this.canvas.drawCircle(
      this.positionToCoordinates(lastPegDrawn.peg.position),
      2 * pegRadius(lastPegDrawn.completion, n => n, this.canvas),
      HIGHLIGHT_COLOR,
    )
  }

  private positionToCoordinates(position: Position): Coordinates {
    return positionToCoordinates(position, this.slotGapSize)
  }

  private drawLabels() {
    for (let index = 0; index < this.board.size; index++) {
      const columnLabel = String.fromCharCode(index + 'A'.charCodeAt(0))
      this.drawLabel(columnLabel, { row: -1, column: index })
      this.drawLabel(columnLabel, { row: this.board.size, column: index })

      const rowLabel = (index + 1).toString()
      this.drawLabel(rowLabel, { row: index , column: -1 })
      this.drawLabel(rowLabel, { row: index , column: this.board.size })
    }
  }

  private drawLabel(label: string , position: Position) {
    const coordinates = this.positionToCoordinates(position)
    this.canvas.drawText(LABEL_COLOR, label, coordinates, true)
  }

  private get emptySlotRadius() {
    return Math.ceil(EMPTY_SLOT_RADIUS * this.canvas.size)
  }

  private get boundaryWidth() {
    return Math.ceil(BOUNDARY_WIDTH * this.canvas.size)
  }
}

export const positionToCoordinates = (position: Position, gapSize: number): Coordinates => {
  return {
    x: (position.column + BOARD_PADDING + 0.5) * gapSize,
    y: (position.row + BOARD_PADDING + 0.5) * gapSize
  }
}
