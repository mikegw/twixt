import { Board, Position } from "./board";
import { Color, Player } from "./player";
import { Slot } from "./board/slot";
import { Connection } from "./board/connection";
import { parseMoves, serializeMoves } from "./parse";

export class Game {
  players = [new Player(Color.Red), new Player(Color.Blue)]
  board =  new Board()
  currentPlayerIndex = 0
  moves: Position[] = []

  get currentPlayer() {
    return this.players[this.currentPlayerIndex]
  }

  get winner(): Color {
    const slotsToCheck = this.board.slots.filter(slot => slot.isOccupied)
    const winningSlot = slotsToCheck.find(slot => slot.isConnectedToStart && slot.isConnectedToEnd)
    return winningSlot ? winningSlot.color : null
  }

  placePeg(position: Position): PlacePegResult {
    const slot = this.board.place(this.currentPlayer.color, position)
    if (!slot) return { slot, connectionsAdded: [] }
    this.moves.push(position)

    if ((position.row == 0 && this.currentPlayer.color == Color.Red) ||
      (position.column == 0 && this.currentPlayer.color == Color.Blue)) {
      slot.isConnectedToStart = true
    }

    if ((position.row == this.board.size - 1 && this.currentPlayer.color == Color.Red) ||
      (position.column == this.board.size - 1 && this.currentPlayer.color == Color.Blue)) {
      slot.isConnectedToEnd = true
    }

    const connections = this.addConnections(position, slot);

    this.endTurn()

    return { slot, connectionsAdded: connections }
  }

  private addConnections(position: Position, slot: Slot) {
    const neighboringSlots = this.board.neighboringSlots(position)

    const neighboringSlotsWithColor =
      neighboringSlots.filter(slot => slot.color == this.currentPlayer.color)

    const connections =
      neighboringSlotsWithColor.map(neighbor => this.connect(neighbor, slot))

    if ([this.board.slotAt(position), ...neighboringSlotsWithColor].some(slot => slot.isConnectedToStart)) {
      this.propagateToNeighbors(this.board.slotAt(position), 'isConnectedToStart')
    }

    if ([this.board.slotAt(position), ...neighboringSlotsWithColor].some(slot => slot.isConnectedToEnd)) {
      this.propagateToNeighbors(this.board.slotAt(position), 'isConnectedToStart')
    }

    return connections.filter(Boolean);
  }

  private propagateToNeighbors = (slot: Slot, connection: 'isConnectedToStart'|'isConnectedToEnd') => {
    const slotsToConnect = [slot]

    while (slotsToConnect.length > 0) {
      const slotToConnect = slotsToConnect.shift()
      slotToConnect[connection] = true

      const neighboringSlotsToConnect =
        this.board.neighboringSlots(slotToConnect.position)
        .filter(slot => slot.color == this.currentPlayer.color)
        .filter(slot => !slot[connection])

      slotsToConnect.push(...neighboringSlotsToConnect)
    }
  }

  private connect(slot1: Slot, slot2: Slot): Connection | null {
    return this.board.connect(this.currentPlayer.color, [slot1, slot2])
  }

  endTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
  }

  parse(rawMoves: string) {
    const positions = parseMoves(rawMoves)
    for (let position of positions) this.placePeg(position)
  }

  get serialize() {
    return serializeMoves(this.moves)
  }
}

type PlacePegResult = {
  slot: Slot,
  connectionsAdded: any[]
}

