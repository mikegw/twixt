import { Board, Position } from "./board"
import color = Mocha.reporters.Base.color;
import { Color } from "./color";

const EMPTY_SLOT_RADIUS = 4
const EMPTY_SLOT_COLOR = '#777'

const PEG_RADIUS = 7
const COLORS: Record<Color, string> = {
  'RED': '#C71585',
  'BLUE': '#4682B4'
}

const CONNECTION_WIDTH = 5
const BOUNDARY_WIDTH = 3

type Coordinates = {
  x: number,
  y: number
}

export class Renderer {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  board: Board

  get boardImageSize() {
    return Math.min(this.canvas.width, this.canvas.height)
  }

  get slotGapSize() {
    return this.boardImageSize / this.board.size
  }

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, board: Board) {
    this.canvas = canvas
    this.ctx = ctx
    this.board = board
  }

  draw() {
    this.clear()
    this.drawEmptySlots()
    this.drawBoundaries()
    this.drawConnections()
    this.drawPegs()
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawEmptySlots() {
    for (let slot of this.board.slots) {
      this.drawCircle(
        this.positionToCoordinates(slot.position),
        EMPTY_SLOT_RADIUS,
        EMPTY_SLOT_COLOR
      )
    }
  }

  private drawBoundaries() {
    const min = this.slotGapSize
    const max = this.boardImageSize - min

    const topLeft = { x: min, y: min }
    const topRight = { x: max, y: min }
    const bottomLeft = { x: min, y: max }
    const bottomRight = { x: max, y: max }

    this.drawLine(COLORS[Color.Red], BOUNDARY_WIDTH, topLeft, topRight)
    this.drawLine(COLORS[Color.Red], BOUNDARY_WIDTH, bottomLeft, bottomRight)
    this.drawLine(COLORS[Color.Blue], BOUNDARY_WIDTH, topLeft, bottomLeft)
    this.drawLine(COLORS[Color.Blue], BOUNDARY_WIDTH, topRight, bottomRight)

  }

  private drawConnections() {
    for (let connection of this.board.connections) {
      this.drawLine(
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
      this.drawCircle(
        slotCoordinates,
        PEG_RADIUS,
        COLORS[slot.color]
      )
    }
  }

  private drawCircle(coordinates: Coordinates, radius: number, color: string) {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(coordinates.x, coordinates.y, radius, 0, 2 * Math.PI)
    this.ctx.fill()
  }

  private drawLine(color: string, width: number, from: Coordinates, to: Coordinates) {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.lineCap = "round"
    this.ctx.beginPath()
    this.ctx.moveTo(from.x, from.y)
    this.ctx.lineTo(to.x, to.y)
    this.ctx.stroke();
  }

  private positionToCoordinates(position: Position): Coordinates {
    return {
      x: (position.column + 0.5) * this.slotGapSize,
      y: (position.row + 0.5) * this.slotGapSize
    }
  }
}
