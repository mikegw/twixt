import { Board, Position } from "./board";
import { Color } from "./color";
import { Player } from "./player";
import { Slot } from "./board/slot";
import { Connection } from "./board/connection";

export class Game {
  players = [new Player(Color.Red), new Player(Color.Blue)]
  board =  new Board()
  currentPlayerIndex = 0

  get currentPlayer() {
    return this.players[this.currentPlayerIndex]
  }

  placePeg(position: Position): PlacePegResult {
    const slot = this.board.place(this.currentPlayer.color, position)
    if (!slot) return { slot, connectionsAdded: [] }

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

    return connections.filter(Boolean);
  }

  private connect(slot1: Slot, slot2: Slot): Connection | null {
    return this.board.connect(this.currentPlayer.color, [slot1, slot2])
  }

  endTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
  }
}

type PlacePegResult = {
  slot: Slot,
  connectionsAdded: any[]
}

