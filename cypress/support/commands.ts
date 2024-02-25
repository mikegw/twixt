import 'cypress-wait-until';

import { logout } from "./commands/logout";
import { loginAs } from "./commands/loginAs";
import { acceptInviteFrom } from "./commands/acceptInviteFrom";
import { startGameWith } from "./commands/startGameWith";
import { startGameBetween } from "./commands/startGameBetween";
import { playMove } from "./commands/playMove";
import { playMoves } from "./commands/playMoves";
import { pegAt } from "./commands/pegAt";
import { currentPlayer } from "./commands/currentPlayer";
import { pegAtPosition } from "./commands/pegAtPosition";

Cypress.Commands.add('loginAs', loginAs)
Cypress.Commands.add('logout', logout)
Cypress.Commands.add('acceptInviteFrom', acceptInviteFrom)
Cypress.Commands.add('startGameWith', startGameWith)
Cypress.Commands.add('startGameBetween', startGameBetween)
Cypress.Commands.add('playMove',  playMove)
Cypress.Commands.add('playMoves', playMoves)
Cypress.Commands.add('pegAt', pegAt)
Cypress.Commands.add('pegAtPosition', pegAtPosition)
Cypress.Commands.add('currentPlayer', currentPlayer)
