import { expect } from "chai";
import { newDataStore } from "../src/dataStore/localDataStore";
import {Callback} from "../src/dataStore";

describe('Data Storage', () => {
  it('can store data', () => {
    const dataStore = newDataStore()
    dataStore.write('games', 'some data')
    dataStore.read('games', (data, key) => {
      expect(data).to.eq('some data')
    })
  })

  it('can store nested data', () => {
    const dataStore = newDataStore()
    dataStore.write('games', 'a game')
    dataStore.write('games/1/moves/1', 'a move')

    dataStore.read('games', (data, key) => {
      expect(data).to.eq('a game')
    })

    dataStore.read('games/1/moves/1', (data, key) => {
      expect(data).to.eq('a move')
    })
  })

  describe('stored data', () => {
    it('can be changed', () => {
      const dataStore = newDataStore()

      dataStore.write('games', 'a game')
      dataStore.write('games', 'another game')

      dataStore.read('games', (data, key) => {
        expect(data).to.eq('another game')
      })
    })

    it('can be appended to existing data', async () => {
      const dataStore = newDataStore()

      const { data, key } = await new Promise((resolve: (x: any) => void) => {
        dataStore.onChildAdded('game/moves', (data, key) => {
          console.log(data, key)
          resolve({ data, key })
        })

        dataStore.append('game/moves', 'a move');
      })

      expect(data).to.eq('a move')
      expect(typeof key).to.eq('string')
    })

    it('can be removed', async () => {
      const dataStore = newDataStore()
      dataStore.write('game', 'stuff')

      await dataStore.destroy('game');
      dataStore.read('games', (data, key) => {
        expect(data).to.be.null;
      });
    })
  })

  describe('when a child is added', () => {
    it('notifies each subscriber', async () => {
      const dataStore = newDataStore()

      const triggerAfterNCalls = (n: number, callback: (x: any) => void): Callback => {
        let counter = 0

        return (data, key) => {
          counter += 1
          if (counter >= n) callback({ data, key })
        }
      }

      const {data, key} = await new Promise((resolve: (x: any) => void) => {
        const maybeResolve = triggerAfterNCalls(2, resolve)
        dataStore.onChildAdded('game/moves', maybeResolve)
        dataStore.onChildAdded('game/moves', maybeResolve)

        dataStore.append('game/moves', 'a move');
      })
      expect(data).to.eq('a move')
      expect(typeof key).to.eq('string')
    })
  })
})
