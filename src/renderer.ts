import { Board, Position } from "./board"
import color = Mocha.reporters.Base.color;
import { Color } from "./color";

const EMPTY_SLOT_RADIUS = 4
const EMPTY_SLOT_COLOR = '#999'

const PEG_RADIUS = 7
const COLORS: Record<Color, string> = {
  'RED': '#F72595',
  'BLUE': '#4682F4'
}

const CONNECTION_WIDTH = 5
const BOUNDARY_WIDTH = 3

type Coordinates = {
  x: number,
  y: number
}

export class Renderer {
  canvas: HTMLCanvasElement
  private offscreenCanvas: HTMLCanvasElement
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
    this.drawEmptyBoard()
  }

  draw() {
    this.clear()
    this.redrawEmptyBoard()
    this.drawConnections()
    this.drawPegs()
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawEmptyBoard() {
    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas.width = this.canvas.width;
    this.offscreenCanvas.height = this.canvas.height;

    const context = this.offscreenCanvas.getContext("2d")
    this.drawEmptySlots(context)
    this.drawBoundaries(context)
  }

  private drawEmptySlots(context: CanvasRenderingContext2D) {
    for (let slot of this.board.slots) {
      this.drawCircle(
        this.positionToCoordinates(slot.position),
        EMPTY_SLOT_RADIUS,
        EMPTY_SLOT_COLOR,
        context
      )
    }
  }

  private drawBoundaries(context: CanvasRenderingContext2D) {
    const min = this.slotGapSize
    const max = this.boardImageSize - min

    const topLeft = { x: min, y: min }
    const topRight = { x: max, y: min }
    const bottomLeft = { x: min, y: max }
    const bottomRight = { x: max, y: max }

    this.drawLine(COLORS[Color.Red], BOUNDARY_WIDTH, topLeft, topRight, context)
    this.drawLine(COLORS[Color.Red], BOUNDARY_WIDTH, bottomLeft, bottomRight, context)
    this.drawLine(COLORS[Color.Blue], BOUNDARY_WIDTH, topLeft, bottomLeft, context)
    this.drawLine(COLORS[Color.Blue], BOUNDARY_WIDTH, topRight, bottomRight, context)
  }

  private redrawEmptyBoard() {
    this.ctx.drawImage(this.offscreenCanvas, 0, 0, this.canvas.width, this.canvas.height)
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

  private drawCircle(coordinates: Coordinates, radius: number, color: string, context?: CanvasRenderingContext2D) {
    const ctx = context || this.ctx

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(coordinates.x, coordinates.y, radius, 0, 2 * Math.PI)
    ctx.fill()
  }

  private drawLine(color: string, width: number, from: Coordinates, to: Coordinates, context?: CanvasRenderingContext2D) {
    const ctx = context || this.ctx

    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke();
  }

  private positionToCoordinates(position: Position): Coordinates {
    return {
      x: (position.column + 0.5) * this.slotGapSize,
      y: (position.row + 0.5) * this.slotGapSize
    }
  }
}
