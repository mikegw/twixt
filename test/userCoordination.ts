import dataStore from "../src/dataStore/firebase";
import { GameInProgress, Invite, User } from "../src/user";
import { expect } from "chai";

describe('User Coordination', () => {
  describe('A user', () => {
    it('can invite another user to play', () => {
      const tim = new User({ name: 'Tim' }, dataStore)
      const mike = new User({ name: 'Mike' }, dataStore)

      const timInvited =
        new Promise((resolve, reject) => tim.onInviteReceived(resolve))

      mike.invite({ name: 'Tim' })

      return timInvited.then((invite: Invite) => {
        expect(invite.name).to.eq('Mike')
      })
    })

    it('can accept an invitation to play', () => {
      const tim = new User({ name: 'Tim' }, dataStore)
      const mike = new User({ name: 'Mike' }, dataStore)

      const timInvited = new Promise((resolve, reject) => {
        tim.onInviteReceived((invite, key) => resolve({ invite, key }))
      })

      const timAccepted = new Promise((resolve, reject) => {
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
