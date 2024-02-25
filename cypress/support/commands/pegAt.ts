import { parseMove } from "../../../src/twixt/parse";

export const pegAt = (rawPosition: string) => {
  const position = parseMove(rawPosition)

  return cy.pegAtPosition(position)
}
