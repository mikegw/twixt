import { dataStore } from "../src/dataStore/firebase";
import { Invite, User } from "../src/user";
import { expect } from "chai";
import { config } from "./support/config";
import { TestDataStore } from "../src/dataStore";

describe('User Coordination', () => {
  const db = dataStore(config) as TestDataStore
  beforeEach(() => db.clearEnvironment())

  describe('A user', () => {
    it('can invite another user to play', () => {
      const tim = new User({ name: 'Tim' }, db)
      const mike = new User({ name: 'Mike' }, db)

      const timInvited =
        new Promise((resolve) => tim.onInviteReceived(resolve))

      mike.invite({ name: 'Tim' })

      return timInvited.then((invite: Invite) => {
        expect(invite.name).to.eq('Mike')
      })
    })

    it('can accept an invitation to play', () => {
      const tim = new User({ name: 'Tim' }, db)
      const mike = new User({ name: 'Mike' }, db)

      const timInvited = new Promise((resolve) => {
        tim.onInviteReceived((invite, key) => resolve({ invite, key }))
      })

      const timAccepted = new Promise((resolve) => {
        mike.onGameInProgress((gameInProgress, key) => resolve({ gameInProgress, key }))
      })

      mike.invite({ name: 'Tim' })

      return timInvited
        .then(({ invite, key }) => tim.acceptInvite(invite, key))
        .then(() => timAccepted)
        .then(({ gameInProgress, key }) => {
          tim.completeGame(key)
          mike.completeGame(key)

          expect(gameInProgress.opponent).to.eq('Tim')
          expect(gameInProgress).to.haveOwnProperty('gameId')
        })
    })
  })
})
