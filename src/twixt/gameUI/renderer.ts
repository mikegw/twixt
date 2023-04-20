import { Board, Position } from "../board"
import { Canvas, Coordinates } from "./canvas";
import { Color } from "../player";

const EMPTY_SLOT_RADIUS = 4
const EMPTY_SLOT_COLOR = '#999'

const PEG_RADIUS = 7
const COLORS: Record<Color, string> = {
  'RED': '#F72595',
  'BLUE': '#4682F4'
}

const CONNECTION_WIDTH = 5
const BOUNDARY_WIDTH = 3

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
        EMPTY_SLOT_RADIUS,
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

    this.canvas.drawLine(COLORS[Color.Red], BOUNDARY_WIDTH, topLeft, topRight, true)
    this.canvas.drawLine(COLORS[Color.Red], BOUNDARY_WIDTH, bottomLeft, bottomRight, true)
    this.canvas.drawLine(COLORS[Color.Blue], BOUNDARY_WIDTH, topLeft, bottomLeft, true)
    this.canvas.drawLine(COLORS[Color.Blue], BOUNDARY_WIDTH, topRight, bottomRight, true)
  }

  private drawConnections() {
    for (let connection of this.board.connections) {
      this.canvas.drawLine(
        COLORS[connection.color],
        CONNECTION_WIDTH,
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
        PEG_RADIUS,
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
    for (let index = 1; index < this.board.size - 1; index++) {
      const columnLabel = String.fromCharCode(index + 'A'.charCodeAt(0) - 1)
      this.drawLabel(columnLabel, { row: -1, column: index })
      this.drawLabel(columnLabel, { row: this.board.size, column: index })

      const rowLabel = index.toString()
      this.drawLabel(rowLabel, { row: index , column: -1 })
      this.drawLabel(rowLabel, { row: index , column: this.board.size })
    }
  }

  private drawLabel(label: string , position: Position) {
    const coordinates = this.positionToCoordinates(position)
    this.canvas.drawText(LABEL_COLOR, label, coordinates, true)
  }
}
