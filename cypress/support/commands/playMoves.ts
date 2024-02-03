import {parseMoves} from "../../../src/twixt/parse";
import {GameInProgress, User} from "../../../src/user";
import {GameData} from "../../../src/twixt/gameData";
import {Color} from "../../../src/twixt/player";

export function playMoves(opponentName: string, moves: string) {
  const positions = parseMoves(moves)

  const receiveGame = new Promise<GameInProgress>(resolve => {
    this.dataStore.read(User.gamesInProgressPath(opponentName), (games: {[key: string]: GameInProgress}) => {
      resolve(Object.values(games)[0])
    })
  })

  return (cy.wrap(receiveGame) as Cypress.Chainable<GameInProgress>)
    .then((gameInProgress: GameInProgress) => {
      const gameData =
        cy.wrap(new GameData(this.dataStore, gameInProgress.gameId)).as('gameData')

      cy.get('#player-color')
        .contains(/RED|BLUE/)
        .invoke('text')
        .as('playerColor')

      return cy.get<HTMLCanvasElement>('#game-canvas')
        .then(canvas => {
          for (let position of positions) {
            cy.get('#current-player')
              .contains(/RED|BLUE/)
              .invoke('text')
              .as('currentPlayerColor')
              .then(() => {
                const opponentColor = this.playerColor == Color.Red ? Color.Blue : Color.Red

                console.log(this.currentPlayerColor, this.playerColor)
                if (this.currentPlayerColor == this.playerColor) {
                  cy.playMove(position, this.playerColor)
                } else {
                  this.gameData.write(position)
                  cy.get('#game-status').contains(RegExp(`${this.playerColor}|wins`))
                }
              })
          }
        })
    })
}
