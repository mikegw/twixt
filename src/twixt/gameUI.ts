import { BOARD_PADDING, Renderer } from "./gameUI/renderer";
import { Canvas, Coordinates } from "./gameUI/canvas";

import { Game } from "./game";
import { Position } from "./board";
import { GameData } from "./gameData";
import { Direction } from "./player";
import { Action } from "./action";


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
  direction: Direction
  currentPlayerSpan: HTMLSpanElement
  playerStatusSpan: HTMLSpanElement
  actionButtons: Map<string,HTMLButtonElement>
  moveInProgress: Position
  onComplete: () => void

  constructor(game: Game, gameData: GameData, player: string, onComplete: () => void) {
    this.game = game
    this.gameData = gameData
    this.canvas = new Canvas()
    this.renderer = new Renderer(this.canvas, this.game.board)
    this.currentPlayerSpan = document.getElementById('current-player')
    this.playerStatusSpan = document.getElementById('player-status')
    this.actionButtons = new Map<string, HTMLButtonElement>

    this.onComplete = onComplete

    const playerColorSpan = document.getElementById('player-color')
    gameData.getFirstPlayer(firstPlayer => {
      this.color = player == firstPlayer ? Color.Red : Color.Blue
      this.direction = player == firstPlayer ? Direction.Vertical : Direction.Horizontal
      this.setPlayerColor(playerColorSpan, this.color)
    })

    this.setPlayerColor(this.currentPlayerSpan, Color.Red)
    this.playerStatusSpan.innerText = 'to move'
  }

  start() {
    this.canvas.setDimensions()
    this.renderer.prerenderEmptyBoard()

    window.addEventListener("resize", this.windowResized)
    document.addEventListener('DOMContentLoaded', this.windowResized)

    this.gameData.subscribe(this.actionReceived)
    this.canvas.whenClicked(cursorPosition => this.canvasClicked(cursorPosition))

    this.addActionButton('confirm', 'game-confirm', this.endTurn)
    this.addActionButton('undo', 'game-undo', this.undo)
    this.addActionButton('surrender', 'game-surrender', this.surrender)

    this.renderer.draw()
  }

  canvasClicked(cursorPosition: Coordinates) {
    if (this.game.currentPlayer.direction != this.direction) return

    const position: Position = {
      row: Math.floor(cursorPosition.y / this.slotGapSize) - BOARD_PADDING,
      column:  Math.floor(cursorPosition.x / this.slotGapSize) - BOARD_PADDING
    }

    console.log("Position Clicked: ", position)

    if (!this.game.isValidPlacement(position)) return

    this.placePeg(position)
  }

  placePeg(position: Position) {
    if (this.moveInProgress) this.undo()

    this.gameData.write({kind: 'PLACE_PEG', position })
    this.moveInProgress = position
    this.actionButtons.get('confirm').disabled = false
    this.actionButtons.get('undo').disabled = false
  }

  undo = () => {
    this.gameData.write({kind: 'UNDO'})
  }

  endTurn = () => {
    console.log('Move confirmed')
    this.gameData.write({kind: 'END_TURN'})
  }

  surrender = () => {
    if (window.confirm('Are you sure you want to surrender?')) {
      console.log('I SURRENDER!')
      this.gameData.write({ kind: 'SURRENDER', direction: this.direction })
    }
  }

  actionReceived = (action: Action) => {
    console.log('Received Action:', action)
    switch (action.kind) {
      case 'PLACE_PEG':
        const placePegResult = this.game.placePeg(action.position)
        console.debug(`Move made by ${this.game.currentPlayer.direction}: ${placePegResult.slot}`)
        break
      case 'UNDO':
        this.game.undo()
        this.actionButtons.get('confirm').disabled = true
        this.actionButtons.get('undo').disabled = true
        break
      case 'END_TURN':
        this.game.endTurn()
        this.moveInProgress = null
        this.actionButtons.get('confirm').disabled = true
        this.actionButtons.get('undo').disabled = true
        break
      case "SURRENDER":
        this.game.surrender(action.direction)
    }

    this.renderer.setConnectionDirection(this.game.currentPlayer.direction)
    this.render()
    if (this.game.winner) {
      this.setCurrentPlayerColor(this.game.winner)
      this.playerStatusSpan.innerText = 'wins!'
      this.onComplete()
    } else {
      this.setCurrentPlayerColor(this.game.currentPlayer.direction)
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

  private setCurrentPlayerColor(direction: Direction) {
    const color = ColorForDirection.get(direction)
    this.currentPlayerSpan.innerText = color
    this.currentPlayerSpan.setAttribute('color', color)
  }

  private addActionButton(name: string, buttonId: string, actionHandler: () => void) {
    const buttonElement =  document.getElementById(buttonId)
    const newButton = buttonElement.cloneNode(true) as HTMLButtonElement
    buttonElement.replaceWith(newButton)

    newButton.addEventListener('click', actionHandler)

    this.actionButtons.set(name, newButton)
  }
}
