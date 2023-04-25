import { Board, Position } from "../board"
import { Canvas, Coordinates } from "./canvas";
import { Color } from "../player";

const PEG_RADIUS = 0.00525
const EMPTY_SLOT_RADIUS = 0.003
const CONNECTION_WIDTH = 0.004
const BOUNDARY_WIDTH = 0.002

const EMPTY_SLOT_COLOR = '#999'

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

  get slotGapSize() {
    return this.canvas.size / (this.board.size + 2 * this.padding)
  }

  constructor(canvas: Canvas, board: Board) {
    this.canvas = canvas
    this.board = board
    this.prerenderEmptyBoard()
  }

  draw() {
    this.canvas.clear()
    this.canvas.prerender()
    this.drawConnections()
    this.drawPegs()
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
    for (let slot of this.board.slots) {
      if (!slot.isOccupied) continue
      const slotCoordinates = this.positionToCoordinates(slot.position)
      this.canvas.drawCircle(
        slotCoordinates,
        this.pegRadius,
        COLORS[slot.color]
      )
    }
  }

  private positionToCoordinates(position: Position): Coordinates {
    return {
      x: (position.column + BOARD_PADDING + 0.5) * this.slotGapSize,
      y: (position.row + BOARD_PADDING + 0.5) * this.slotGapSize
    }
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

  private get pegRadius() {
    return Math.ceil(PEG_RADIUS * this.canvas.size)
  }

  private get connectionWidth() {
    return Math.ceil(CONNECTION_WIDTH * this.canvas.size)
  }

  private get boundaryWidth() {
    return Math.ceil(BOUNDARY_WIDTH * this.canvas.size)
  }
}
