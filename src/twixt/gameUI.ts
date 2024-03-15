import { BOARD_PADDING, Renderer } from "./gameUI/renderer";
import { Canvas, Coordinates } from "./gameUI/canvas";

import { Game } from "./game";
import { Position } from "./board";
import { GameData } from "./gameData";
import { Direction } from "./player";


export enum Color {
  Red = 'RED',
  Blue = 'BLUE'
}

export const ColorForDirection = new Map<Direction, Color>([
  [Direction.Vertical, Color.Red],
  [Direction.Horizontal, Color.Blue]
])

export class GameUI {
  game: Game
  gameData: GameData
  canvas: Canvas
  renderer: Renderer
  color: Color
  currentPlayerSpan: HTMLSpanElement
  playerStatusSpan: HTMLSpanElement
  confirmButton: HTMLButtonElement
  moveInProgress: Position
  onComplete: () => void

  constructor(game: Game, gameData: GameData, player: string, onComplete: () => void) {
    this.game = game
    this.gameData = gameData
    this.canvas = new Canvas()
    this.renderer = new Renderer(this.canvas, this.game.board)
    this.currentPlayerSpan = document.getElementById('current-player')
    this.playerStatusSpan = document.getElementById('player-status')
    this.confirmButton = document.getElementById('game-confirm') as HTMLButtonElement

    this.onComplete = onComplete

    const playerColorSpan = document.getElementById('player-color')
    gameData.getFirstPlayer(firstPlayer => {
      this.color = player == firstPlayer ? Color.Red : Color.Blue
      this.setPlayerColor(playerColorSpan, this.color)
    })

    this.setPlayerColor(this.currentPlayerSpan, Color.Red)
  }

  start() {
    this.canvas.setDimensions()
    this.renderer.prerenderEmptyBoard()

    window.addEventListener("resize", this.windowResized)
    document.addEventListener('DOMContentLoaded', this.windowResized)

    this.gameData.subscribe(this.moveMade)
    this.canvas.whenClicked(cursorPosition => this.canvasClicked(cursorPosition))

    const newConfirmButton = this.confirmButton.cloneNode(true) as HTMLButtonElement
    this.confirmButton.replaceWith(newConfirmButton)
    this.confirmButton = newConfirmButton

    this.confirmButton.addEventListener('click', this.confirmMove)

    this.renderer.draw()
  }

  canvasClicked = (cursorPosition: Coordinates) => {
    if (ColorForDirection.get(this.game.currentPlayer.direction) != this.color && !this.moveInProgress) return

    const positionClicked: Position = {
      row: Math.floor(cursorPosition.y / this.slotGapSize) - BOARD_PADDING,
      column:  Math.floor(cursorPosition.x / this.slotGapSize) - BOARD_PADDING
    }

    console.log("Position Clicked: ", positionClicked)
    if (this.moveInProgress) this.game.removePeg(this.moveInProgress)

    const peg = this.game.placePeg(positionClicked)
    if (!peg.slot) {
      console.log("Placing peg failed?", peg)
      return
    }

    this.moveInProgress = positionClicked
    this.render()
    console.log("Rendered")

    this.confirmButton.disabled = false
    console.log('Confirm button active')
  }

  confirmMove = () => {
    console.log('Move confirmed')
    this.gameData.write(this.moveInProgress)
    this.confirmButton.disabled = true
    console.log('Confirm button deactivated')
  }

  moveMade = (position: Position) => {
    console.debug(`Move made by ${this.game.currentPlayer.direction}: { row: ${position.row}, column: ${position.column} }`)
    if (this.moveInProgress) {
      this.moveInProgress = null
    } else {
      this.game.placePeg(position as Position)
    }
    this.renderer.setConnectionDirection(this.game.currentPlayer.direction)
    this.render()
    if (this.game.winner) {
      this.playerStatusSpan.innerText = 'wins!'
      this.onComplete()
    } else {
      const color = ColorForDirection.get(this.game.currentPlayer.direction)
      this.currentPlayerSpan.innerText = color
      this.currentPlayerSpan.setAttribute('color', color)
      console.log("Set span to ", color)
    }
  }

  private windowResized = () => {
    this.canvas.setDimensions()
    this.renderer.prerenderEmptyBoard()
    this.render()
  }

  private render() {
    this.renderer.draw()
  }

  private get slotGapSize(): number {
    return this.canvas.size / (this.game.board.size + 2 * BOARD_PADDING)
  }

  private setPlayerColor(span: HTMLSpanElement, color: Color) {
    this.renderer.setBoundariesDirection(color == Color.Red ? Direction.Vertical : Direction.Horizontal)
    span.innerText = color
    span.setAttribute('color', color)
  }
}
