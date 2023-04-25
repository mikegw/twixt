import { BOARD_PADDING, Renderer } from "./gameUI/renderer";
import { Canvas, Coordinates } from "./gameUI/canvas";

import { Game } from "./game";
import { Position } from "./board";
import { GameData } from "./gameData";
import { Color } from "./player";

export class GameUI {
  game: Game
  gameData: GameData
  canvas: Canvas
  renderer: Renderer
  color: Color
  currentPlayerSpan: HTMLSpanElement
  playerStatusSpan: HTMLSpanElement

  constructor(game: Game, gameData: GameData, player: string) {
    this.game = game
    this.gameData = gameData
    this.canvas = new Canvas()
    this.renderer = new Renderer(this.canvas, this.game.board)
    this.currentPlayerSpan = document.getElementById('current-player')
    this.playerStatusSpan = document.getElementById('player-status')
    const playerColorSpan = document.getElementById('player-color')

    gameData.getFirstPlayer(firstPlayer => {
      this.color = player == firstPlayer ? Color.Red : Color.Blue
      playerColorSpan.innerText = this.color
      this.currentPlayerSpan.innerText = Color.Red
    })
  }

  start() {
    this.canvas.setDimensions()
    this.renderer.prerenderEmptyBoard()

    window.addEventListener("resize", this.windowResized)
    document.addEventListener('DOMContentLoaded', this.windowResized)

    this.gameData.subscribe(this.moveMade)
    this.canvas.whenClicked(cursorPosition => this.canvasClicked(cursorPosition))

    this.renderer.draw()
  }

  canvasClicked = (cursorPosition: Coordinates) => {
    if (this.game.currentPlayer.color != this.color) return

    const positionClicked: Position = {
      row: Math.floor(cursorPosition.y / this.slotGapSize) - BOARD_PADDING,
      column:  Math.floor(cursorPosition.x / this.slotGapSize) - BOARD_PADDING
    }

    console.log(positionClicked)
    this.gameData.write(positionClicked)
  }

  moveMade = (position: Position) => {
    console.debug(`Move made by ${this.game.currentPlayer.color}: { row: ${position.row}, column: ${position.column} }`)
    this.game.placePeg(position as Position)
    this.render()
    if (this.game.winner) {
      this.playerStatusSpan.innerText = 'wins!'
    } else {
      this.currentPlayerSpan.innerText = this.game.currentPlayer.color
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
}
