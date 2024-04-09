import {parseMoves} from "../../../src/twixt/parse";
import {GameInProgress, User} from "../../../src/user";
import {GameData} from "../../../src/twixt/gameData";
import {Color} from "../../../src/twixt/gameUI";

export function playMoves(opponentName: string, moves: string) {
  const positions = parseMoves(moves)
  const rawMoves = moves.split(',')

  const receiveGame = new Promise<GameInProgress>(resolve => {
    this.dataStore.read(User.gamesInProgressPath(opponentName), (games: {[key: string]: GameInProgress}) => {
      resolve(Object.values(games)[0])
    })
  })

  return (cy.wrap(receiveGame) as Cypress.Chainable<GameInProgress>)
    .then((gameInProgress: GameInProgress) => {
      const gameData =
        cy.wrap(new GameData(this.dataStore, gameInProgress.gameId))
          .as('gameData')

      cy.get('#player-color')
        .contains(/RED|BLUE/)
        .invoke('text')
        .as('playerColor')
        .then(() => {
          for (let i = 0; i < positions.length; i++) {
            if (i % 2 == 1) {
              cy.log('Opponent to move', positions[i])
                .then(() => {
                  this.gameData.write({ kind: 'PLACE_PEG', position: positions[i] })
                  this.gameData.write({ kind: 'END_TURN' })
                })
              cy.pegAtPosition(positions[i]).should("eq", Color.Blue)
            } else {
              cy.log('Player to move', positions[i])
              cy.playMove(positions[i])
              cy.get('#current-player').contains(Color.Blue)
            }
          }
        })
    })
}
