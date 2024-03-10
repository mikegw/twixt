import { Board, Position } from "./board";
import { Direction, Player } from "./player";
import { Slot } from "./board/slot";
import { Connection } from "./board/connection";
import { parseMoves, serializeMoves } from "./parse";

export class Game {
  players = [new Player(Direction.Vertical), new Player(Direction.Horizontal)]
  board =  new Board()
  currentPlayerIndex = 0
  moves: Position[] = []

  get currentPlayer() {
    return this.players[this.currentPlayerIndex]
  }

  get waitingPlayer() {
    return this.players[this.waitingPlayerIndex]
  }

  get winner(): Direction {
    const slotsToCheck = this.board.slots.filter(slot => slot.isOccupied)
    const winningSlot = slotsToCheck.find(slot => slot.isConnectedToStart && slot.isConnectedToEnd)
    return winningSlot ? winningSlot.direction : null
  }

  placePeg(position: Position): PlacePegResult {
    const slot = this.board.place(this.currentPlayer.direction, position)
    if (!slot) return { slot, connectionsAdded: [] }
    this.moves.push(position)

    if ((position.row == 0 && this.currentPlayer.direction == Direction.Vertical) ||
      (position.column == 0 && this.currentPlayer.direction == Direction.Horizontal)) {
      slot.isConnectedToStart = true
    }

    if ((position.row == this.board.size - 1 && this.currentPlayer.direction == Direction.Vertical) ||
      (position.column == this.board.size - 1 && this.currentPlayer.direction == Direction.Horizontal)) {
      slot.isConnectedToEnd = true
    }

    const connections = this.addConnections(position, slot);

    this.endTurn()

    return { slot, connectionsAdded: connections }
  }

  removePeg(position: Position) {
    const removed = this.board.removePeg(this.waitingPlayer.direction, position)
    if (!removed) return

    this.moves.push(position)
    const neighboringSlots = this.board.neighboringSlots(position)
    for (let neighbor of neighboringSlots) {
      this.board.disconnect(this.waitingPlayer.direction,[position, neighbor.position])
    }

    this.endTurn()
  }

  endTurn() {
    this.currentPlayerIndex = this.waitingPlayerIndex
  }

  parse(rawMoves: string) {
    const positions = parseMoves(rawMoves)
    for (let position of positions) {
      if (this.board.slotAt(position)) {
        this.removePeg(position)
      } else {
        this.placePeg(position)
      }
    }
  }

  get serialize() {
    return serializeMoves(this.moves)
  }

  private addConnections(position: Position, slot: Slot) {
    const neighboringSlots = this.board.neighboringSlots(position)

    const neighboringSlotsWithColor =
      neighboringSlots.filter(slot => slot.direction == this.currentPlayer.direction)

    const connections =
      neighboringSlotsWithColor.map(neighbor => this.connect(neighbor, slot))

    if ([this.board.slotAt(position), ...neighboringSlotsWithColor].some(slot => slot.isConnectedToStart)) {
      this.propagateToNeighbors(this.board.slotAt(position), 'isConnectedToStart')
    }

    if ([this.board.slotAt(position), ...neighboringSlotsWithColor].some(slot => slot.isConnectedToEnd)) {
      this.propagateToNeighbors(this.board.slotAt(position), 'isConnectedToEnd')
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
        .filter(slot => slot.direction == this.currentPlayer.direction)
        .filter(slot => !slot[connection])

      slotsToConnect.push(...neighboringSlotsToConnect)
    }
  }

  private connect(slot1: Slot, slot2: Slot): Connection | null {
    return this.board.connect(this.currentPlayer.direction, [slot1, slot2])
  }

  private get waitingPlayerIndex() {
    return (this.currentPlayerIndex + 1) % this.players.length
  }
}

type PlacePegResult = {
  slot: Slot,
  connectionsAdded: any[]
}
