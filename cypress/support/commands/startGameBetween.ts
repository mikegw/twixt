import { UsernameList } from "../../../src/usernameList";
import { User } from "../../../src/user";
import { Coin } from "../../../src/coin";

export function startGameBetween(name1: string, name2: string, firstPlayer?: boolean) {
  const userNames = new UsernameList(this.dataStore)
  userNames.addUser(name2)
  const player2 = new User({ name: name2 }, this.dataStore)
  player2.invite({ name: name1 })

  if (firstPlayer) {
    cy.stub(Coin, 'toss').returns(firstPlayer ? 'HEADS' : 'TAILS') // bias coin-toss so that player 1 starts
  }


  cy.loginAs(name1)
  cy.acceptInviteFrom(name2)
  cy.startGameWith(name2)
}
