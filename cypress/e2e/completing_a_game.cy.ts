describe('Completing a game', () => {
  it('displays the name of the winner', () => {
    cy.startGameBetween('player1', 'player2')

    cy.playMoves('player2', 'C4,A2,C5,C3,C6,E2,C7,G3,C8,I2,C9,K3,C10,M2,C11,O3,C12,Q2,C13,R4')

    cy.get('#game-status').contains('BLUE wins!')
  })

  it('allows the user to return to the coordination page', () => {
    cy.startGameBetween('player1', 'player2')

    cy.playMoves('player2', 'C4,A2,C5,C3,C6,E2,C7,G3,C8,I2,C9,K3,C10,M2,C11,O3,C12,Q2,C13,R4')

    cy.get('#back-to-join-or-start').click()

    cy.get('h1').contains('Join or Start Game')
  })
});
