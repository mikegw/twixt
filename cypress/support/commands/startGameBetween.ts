import { UsernameList } from "../../../src/usernameList";
import { User } from "../../../src/user";

export function startGameBetween(name1: string, name2: string) {
  const userNames = new UsernameList(this.dataStore)
  userNames.addUser(name2)
  const player2 = new User({ name: name2 }, this.dataStore)
  player2.invite({ name: name1 })

  cy.loginAs(name1)
  cy.acceptInviteFrom(name2)
  cy.startGameWith(name2)
}
