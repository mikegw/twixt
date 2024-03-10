import { Color } from "../../../src/twixt/gameUI";

export const currentPlayer = () => {
  return cy.get('#current-player')
    .invoke('text')
    .then((text) => {
      const color = text.toString().includes(Color.Red) ? Color.Red : Color.Blue

      return cy.wrap(color)
    })
}
