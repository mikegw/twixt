import { Position } from "../../src/twixt/board";
import { Color } from "../../src/twixt/player";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      loginAs(username: string, reload?: boolean): Chainable<any>

      logout(): Chainable<any>

      acceptInviteFrom(username: string): Chainable<any>

      startGameWith(username: string): Chainable<any>

      startGameBetween(player1: string, player2: string): Chainable<any>

      playMoves(opponent: string, moves: string): Chainable<any>

      playMove(move: Position, color: Color, confirm?: boolean): Chainable<any>

      pegAt(rawPosition: string): Chainable<any>
    }
  }
}
