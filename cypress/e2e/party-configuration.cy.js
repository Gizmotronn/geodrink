describe('how-to-play language', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
    cy.clearLocalStorage();
  });

  it('keeps the how-to-play copy focused on playing with friends', () => {
    cy.visit('/');
    cy.contains('Enter App').click();
    cy.contains('Rules/Help').click();

    cy.contains('Playing with friends').should('be.visible');
    cy.contains('Guess right? Everyone else drinks').should('be.visible');
    cy.contains('Guess wrong? You drink').should('be.visible');
    cy.contains('The social drinking game version!').should('not.exist');
  });
});
