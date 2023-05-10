/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { UsernameList } from "../../src/usernameList";
import { GameInProgress, User } from "../../src/user";
import { parseMove, parseMoves } from "../../src/twixt/parse";
import { BOARD_SIZE, Position } from "../../src/twixt/board";
import { BOARD_PADDING, COLORS } from "../../src/twixt/gameUI/renderer";
import { Color } from "../../src/twixt/player";
import { GameData } from "../../src/twixt/gameData";

Cypress.Commands.add('loginAs', (username, reload = true) => {
  if (reload) cy.visit('/')

  cy.get('input[name=username]')
  .type(username)

  cy.get('button').contains('Get Started')
  .click()

  cy.get('h1').contains('Main Menu').should('be.visible')

  cy.get('button').contains('Play')
  .click()

  cy.get('h1').contains('Join or Start Game').should('be.visible')
})

Cypress.Commands.add('logout', () => {
  cy.get('#log-out').click()
  cy.get('#get-started').should('be.visible')
})

Cypress.Commands.add('acceptInviteFrom', (player) => {
  cy.get('.player').contains(player)
  .get('.invite-pending').should('be.visible')
  .click()
})

Cypress.Commands.add('startGameWith', (player) => {
  cy.get('.player').contains(player)
  .get('.play-game').should('be.visible')
  .click()
})

Cypress.Commands.add('startGameBetween', function(name1, name2, firstPlayer?: boolean) {
  const userNames = new UsernameList(this.dataStore)
  userNames.addUser(name2)
  const player2 = new User({ name: name2 }, this.dataStore)
  player2.invite({ name: name1 })

  if (firstPlayer) {
    cy.stub(Math, 'random').returns(firstPlayer ? 1 : 0) // bias coin-toss so that player 1 starts
  }


  cy.loginAs(name1)
  cy.acceptInviteFrom(name2)
  cy.startGameWith(name2)
})

const positionToCoordinates = (canvas: HTMLCanvasElement, position: Position) => {
  const size = canvas.getBoundingClientRect().width
  const slotGapSize = size / (BOARD_SIZE + 2 * BOARD_PADDING)

  const coordinates = {
    x: (position.column + BOARD_PADDING + 0.5) * slotGapSize,
    y: (position.row + BOARD_PADDING + 0.5) * slotGapSize
  }
  console.log(`Coordinates for { row: ${position.row}, column: ${position.column} }: { x: ${coordinates.x}, y: ${coordinates.y} }`)

  return coordinates
}

Cypress.Commands.add('playMove', function (position: Position, color: Color, confirm = true) {
  return cy.get<HTMLCanvasElement>('#game-canvas')
    .then(canvas => {
      const { x, y } = positionToCoordinates(canvas[0], position)
      cy.get('#game-canvas').click(x, y)
      cy.get('#game-status').contains(RegExp(`${color === Color.Red ? Color.Blue : Color.Red}|wins`))
    })
})

Cypress.Commands.add('playMoves', function(opponentName: string, moves: string) {
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
})

Cypress.Commands.add('pegAt', (rawPosition: string) => {
  const position = parseMove(rawPosition)

  return cy.get<HTMLCanvasElement>('#game-canvas').then($canvas => {
      const canvas = $canvas[0]
      const ctx = canvas.getContext('2d')

      const { x, y} = positionToCoordinates(canvas, position)
      const pixel = ctx.getImageData(x * window.devicePixelRatio, y * window.devicePixelRatio, 1, 1).data;

      const [r, g, b] = Array.from(pixel.slice(0,3))
      const hex = ((r << 16) | (g << 8) | b).toString(16)
      const colorCode = "#" + ("000000" + hex).slice(-6).toUpperCase()
      console.log(colorCode)
      let color: Color

      switch(colorCode) {
        case COLORS[Color.Red]:
        case '#F842A3': // Red but highlighted
          color = Color.Red
          break;
        case COLORS[Color.Blue]:
        case '#5F93F5': // Blue but highlighted
          color = Color.Blue
          break;
        default:
          color = null
      }

      return cy.wrap(color)
    })
})
