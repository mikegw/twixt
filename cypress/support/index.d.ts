import { Position } from "../../src/twixt/board";
import { Color } from "../../src/twixt/gameUI";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      loginAs(username: string, reload?: boolean): Chainable<any>

      logout(): Chainable<any>

      acceptInviteFrom(username: string): Chainable<any>

      startGameWith(username: string): Chainable<any>

      startGameBetween(player1: string, player2: string): Chainable<any>

      playMoves(opponent: string, moves: string): Chainable<any>

      playMove(move: Position, confirm?: boolean): Chainable<any>

      confirmMove(): Chainable<any>

      undoMove(): Chainable<any>
      
      surrender(): Chainable<any>

      pegAt(rawPosition: string): Chainable<any>

      pegAtPosition(position: Position): Chainable<any>

      currentPlayer(): Chainable<any>
    }
  }
}
