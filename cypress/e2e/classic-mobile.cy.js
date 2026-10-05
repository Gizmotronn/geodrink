const byLabel = (label) => `[aria-label="${label}"]`;

function stubWeather() {
  cy.intercept('GET', '**/data/2.5/weather**', {
    statusCode: 200,
    body: {
      main: {
        temp: 20,
        humidity: 50,
      },
      weather: [{ description: 'clear sky' }],
      wind: { speed: 3 },
    },
  }).as('weather');
}

describe('classic mode mobile flow', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
    cy.clearLocalStorage();
    stubWeather();
  });

  it('persists sound settings and completes a classic game through results', () => {
    cy.visit('/');
    cy.contains('Enter App').click();

    cy.get(byLabel('Settings')).first().click();
    cy.get(byLabel('Sound Effects')).should('be.checked').click();
    cy.get(byLabel('Sound Effects')).should('not.be.checked');
    cy.window().then((win) => {
      const storedValues = [
        win.localStorage.getItem('@weathr_sound_effects'),
        win.localStorage.getItem('AsyncStorage:@weathr_sound_effects'),
      ];
      expect(storedValues).to.include('false');
    });
    cy.get(byLabel('Back')).click();

    cy.get(byLabel('Classic Mode')).click();
    cy.get(byLabel('What is the current temperature?'), { timeout: 30000 }).should('be.visible');
    cy.wait('@weather');

    cy.get(byLabel('What is the current temperature?')).click().should('have.focus');
    cy.get(byLabel('Add minus')).click();
    cy.get(byLabel('What is the current temperature?')).should('have.value', '-').and('have.focus');
    cy.get(byLabel('Remove minus')).click();
    cy.get(byLabel('What is the current temperature?')).should('have.value', '').and('have.focus');

    for (let round = 1; round <= 10; round += 1) {
      cy.get(byLabel('What is the current temperature?')).click().type('20');
      cy.get(byLabel('Submit Guess')).should('not.be.disabled').click();
      cy.contains('Correct! Within 2°C!').should('be.visible');

      if (round < 10) {
        cy.get(byLabel('Next City')).click();
        cy.get(byLabel('What is the current temperature?')).should('have.value', '');
      } else {
        cy.get(byLabel('View Results')).should('contain', 'View Results').click();
      }
    }

    cy.contains('Round Complete!').should('be.visible');
    cy.contains('Final Score').should('be.visible');
    cy.contains('Accuracy: 100%').should('be.visible');
    cy.contains('Exit to Home').should('be.visible');
  });
});
