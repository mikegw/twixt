declare namespace Cypress {
  interface Chainable<Subject> {
    loginAs(username: string): Chainable<any>
    acceptInviteFrom(username: string): Chainable<any>
    startGameWith(username: string): Chainable<any>
    startGameBetween(player1: string, player2: string): Chainable<any>
    playMoves(opponent: string, moves: string): Chainable<any>
    pegAt(rawPosition: string): Chainable<any>
  }
}
