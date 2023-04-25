import { UsernameList } from "../../src/usernameList";
import { User } from "../../src/user";

describe('Navigation', () => {
  beforeEach(function () {
    const users = new UsernameList(this.dataStore)
    users.addUser('Tim')

    cy.loginAs('Mike')


  })
});
