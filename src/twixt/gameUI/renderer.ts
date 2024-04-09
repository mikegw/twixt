import { Board, Position } from "../board"
import { Canvas, Coordinates } from "./canvas";
import { Direction } from "../player";
import { AnimatedPeg, drawPeg, pegRadius } from "./renderer/renderPeg";
import { AnimatedConnection, drawConnection } from "./renderer/renderConnection";
import { Color } from "../gameUI";
import { addVectors, scale, subtractVectors, Vector, vectorLength } from "../board/vector";
import { drawElectrifiedLine, Fidelity } from "./renderer/renderElectrifiedLine";

const MIN_FRAME_RATE = 20

const EMPTY_SLOT_RADIUS = 0.003
const BOUNDARY_WIDTH = 0.003

const EMPTY_SLOT_COLOR = '#999'
const HIGHLIGHT_COLOR = '#FFFFFF22'

type ColorHex =  '#F72595' | '#4682F4'
type DimColorHex = '#ae1f6a' | '#3463bc'

export const COLORS: Record<Color, ColorHex> = {
  'RED': '#F72595',
  'BLUE': '#4682F4'
}

export const DIM_COLORS: Record<Color, DimColorHex> = {
  'RED': '#ae1f6a',
  'BLUE': '#3463bc'
}

export const BOARD_PADDING = 1

const LABEL_COLOR = '#FAD240'

type Boundary = {
  color: ColorHex,
  from: Coordinates,
  to: Coordinates
}

export class Renderer {
  canvas: Canvas
  board: Board
  connectionDirection: Direction
  boundaryDirection: Direction
  padding = BOARD_PADDING
  animatedPegs: AnimatedPeg[] = []
  animatedConnections: AnimatedConnection[] = []
  boundaryFidelity: Fidelity = 'high'
  connectionFidelity: Fidelity = 'medium'
  frameCount = 0

  get slotGapSize() {
    return this.canvas.size / (this.board.size + 2 * this.padding)
  }

  constructor(canvas: Canvas, board: Board) {
    this.canvas = canvas
    this.board = board
    this.prerenderEmptyBoard()
    setTimeout(() => this.checkFrameRate(), 1000)
  }

  checkFrameRate() {
    console.log("Frame Rate:", this.frameCount)
    if (this.frameCount < MIN_FRAME_RATE) {
      this.boundaryFidelity = 'medium'
      this.connectionFidelity = 'low'
    } else {
      this.boundaryFidelity = 'high'
      this.connectionFidelity = 'medium'
    }
    this.frameCount = 0
    setTimeout(() => this.checkFrameRate(), 1000)
  }

  setConnectionDirection(direction: Direction) {
    this.connectionDirection = direction
  }

  setBoundariesDirection(direction: Direction) {
    this.boundaryDirection = direction
  }

  draw() {
    window.requestAnimationFrame(() => {
      this.frameCount += 1
      this.canvas.clear()
      this.canvas.prerender()
      this.drawConnections()
      this.drawPegs()
      this.drawElectricity()

      this.highlightLastPegDrawn()

      this.draw()
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

  private corners() {
    const min = this.slotGapSize * (1 + BOARD_PADDING)
    const max = this.canvas.size - min

    return {
      topLeft: { x: min, y: min },
      topRight: { x: max, y: min },
      bottomLeft: { x: min, y: max },
      bottomRight: { x: max, y: max }
    }
  }

  private verticalBoundaries(): Boundary[] {
    const corners = this.corners()

    return [
      { color: COLORS[Color.Red], from: corners.topLeft, to: corners.topRight },
      { color: COLORS[Color.Red], from: corners.bottomLeft, to: corners.bottomRight },
    ]
  }

  private horizontalBoundaries(): Boundary[] {
    const corners = this.corners()

    return [
      { color: COLORS[Color.Blue], from: corners.topLeft, to: corners.bottomLeft },
      { color: COLORS[Color.Blue], from: corners.topRight, to: corners.bottomRight },
    ]
  }

  private drawBoundaries() {
    for (let boundary of (this.verticalBoundaries().concat(this.horizontalBoundaries()))) {
      this.canvas.drawLine(boundary.color, this.boundaryWidth, boundary.from, boundary.to, true)
    }
  }

  private electrifyBoundaries() {
    const electrifiedBoundaries =
      this.boundaryDirection == Direction.Vertical ? this.verticalBoundaries() : this.horizontalBoundaries()

    for (let boundary of electrifiedBoundaries) {
      drawElectrifiedLine(boundary.from, boundary.to, this.canvas,this.boundaryFidelity)
    }
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
      const electrified = slot.direction == this.connectionDirection

      drawPeg(animatedPeg, this.canvas, this.slotGapSize, electrified)
    }
  }

  private drawElectricity() {
    this.electrifyBoundaries()
    for (let connection of this.board.connections) {
      if (connection.direction == this.connectionDirection) {
        drawElectrifiedLine(
          positionToCoordinates(connection.slots[0].position, this.slotGapSize),
          positionToCoordinates(connection.slots[1].position, this.slotGapSize),
          this.canvas,
          this.connectionFidelity
        )
      }
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
    x: Math.floor((position.column + BOARD_PADDING + 0.5) * gapSize),
    y: Math.floor((position.row + BOARD_PADDING + 0.5) * gapSize)
  }
}
