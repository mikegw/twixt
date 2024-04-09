import { Board, Position } from "./board";
import { Direction, Player } from "./player";
import { Slot } from "./board/slot";
import { Connection } from "./board/connection";
import { parseMoves, serializeMoves } from "./parse";

export class Game {
  players = [new Player(Direction.Vertical), new Player(Direction.Horizontal)]
  board =  new Board()
  moves: Position[] = []

  private currentPlayerIndex = 0
  private currentMoveIndex = 0
  private _winner: Direction = null

  get currentPlayer() {
    return this.players[this.currentPlayerIndex]
  }

  get waitingPlayer() {
    return this.players[this.waitingPlayerIndex]
  }

  get winner(): Direction {
    if (this._winner) return this._winner

    for (let player of this.players) {
      if (this.directionHasWon(player.direction)) return player.direction
    }

    return null
  }

  get currentMove(): Position {
    return this.moves[this.currentMoveIndex];
  }

  isValidPlacement(position: Position) {
    return this.board.isValidPlacement(this.currentPlayer.direction, position)
  }

  placePeg(position: Position): PlacePegResult {
    if (this.currentMove) return;

    const slot = this.board.place(this.currentPlayer.direction, position)
    if (!slot) return { slot, connectionsAdded: [] }
    this.moves.push(position)

    if (this.onStartingBoundary(position)) slot.isConnectedToStart = true
    if (this.onEndingBoundary(position)) slot.isConnectedToEnd = true

    const connections = this.addConnections(position, slot);

    return { slot, connectionsAdded: connections }
  }

  removeConnection(position: Position) {

  }

  undo() {
    if (!this.currentMove) return;

    const position = this.moves.pop()
    const removed = this.board.removePeg(this.currentPlayer.direction, position)
    if (!removed) return

    const neighboringSlots = this.board.neighboringSlots(position)
    for (let neighbor of neighboringSlots) {
      this.board.disconnect(this.currentPlayer.direction,[position, neighbor.position])
    }
  }

  endTurn() {
    this.currentMoveIndex = this.moves.length
    this.currentPlayerIndex = this.waitingPlayerIndex
  }

  surrender(direction: Direction) {
    this._winner = direction == Direction.Horizontal ? Direction.Vertical : Direction.Horizontal
  }

  parse(rawMoves: string) {
    const positions = parseMoves(rawMoves)

    for (let position of positions) {
      this.placePeg(position)
      this.endTurn()
    }
  }

  get serialize() {
    return serializeMoves(this.moves)
  }

  private onEndingBoundary(position: Position) {
    return (position.row == this.board.size - 1 && this.currentPlayer.direction == Direction.Vertical) ||
      (position.column == this.board.size - 1 && this.currentPlayer.direction == Direction.Horizontal);
  }

  private onStartingBoundary(position: Position) {
    return (position.row == 0 && this.currentPlayer.direction == Direction.Vertical) ||
      (position.column == 0 && this.currentPlayer.direction == Direction.Horizontal);
  }

  private addConnections(position: Position, slot: Slot) {
    const neighboringSlots = this.board.neighboringSlots(position)

    const neighboringSlotsWithColor =
      neighboringSlots.filter(slot => slot.direction == this.currentPlayer.direction)

    const connections =
      neighboringSlotsWithColor.map(neighbor => this.connect(neighbor, slot))

    return connections.filter(Boolean);
  }

  private connect(slot1: Slot, slot2: Slot): Connection | null {
    return this.board.connect(this.currentPlayer.direction, [slot1, slot2])
  }

  private get waitingPlayerIndex() {
    return (this.currentPlayerIndex + 1) % this.players.length
  }

  private directionHasWon(direction: Direction): Boolean {
    console.log(`Checking ${direction}`)

    const connections =
      this.board.connections.filter(connection => connection.direction == direction)

    const checkedConnections = new Set<Connection>()
    const checked = checkedConnections.has.bind(checkedConnections)

    const connectionsToCheck = connections.filter(connection => {
      return connection.slots.some(slot => slot.isConnectedToStart)
    })

    let connection: Connection
    let attempts = 0

    while (connectionsToCheck.length > 0 && attempts < 10) {
      attempts++

      connection = connectionsToCheck.shift()
      console.log(`Checking ${connection}`)
      checkedConnections.add(connection)

      if (connection.slots.some(slot => slot.isConnectedToEnd)) return true

      const neighboringConnections =
        connections.filter(other => connection.hasSharedSlots(other))

      connectionsToCheck.push(...neighboringConnections.filter(neighbor => !checked(neighbor) ))
    }

    return false
  }
}

type PlacePegResult = {
  slot: Slot,
  connectionsAdded: any[]
}
