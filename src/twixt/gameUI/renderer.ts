import { Board, Position } from "../board"
import { Canvas, Coordinates } from "./canvas";
import { Color } from "../player";
import { AnimatedPeg, drawPeg, pegRadius } from "./renderer/renderPeg";

const EMPTY_SLOT_RADIUS = 0.003
const CONNECTION_WIDTH = 0.004
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
    for (let slot of this.board.slots) {
      this.canvas.drawCircle(
        this.positionToCoordinates(slot.position),
        this.emptySlotRadius,
        EMPTY_SLOT_COLOR,
        true
      )
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
      this.canvas.drawLine(
        COLORS[connection.color],
        this.connectionWidth,
        this.positionToCoordinates(connection.slots[0].position),
        this.positionToCoordinates(connection.slots[1].position)
      )
    }
  }

  private drawPegs() {
    for (let slot of this.board.slots.filter(slot => slot.isOccupied)) {
      let animatedPeg = this.animatedPegs.find(animated => animated.peg == slot)
      if (!animatedPeg) {
        animatedPeg = { peg: slot, completion: 0 }
        this.animatedPegs.push(animatedPeg)
      }
      if (slot.isOccupied) drawPeg(animatedPeg, this.canvas, this.slotGapSize)
    }
  }

  private slotsToDraw() {
    return this.board.slots.filter(slot => slot.isOccupied)
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

  private get connectionWidth() {
    return Math.ceil(CONNECTION_WIDTH * this.canvas.size)
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
