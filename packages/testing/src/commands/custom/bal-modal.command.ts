import { selectors } from '../helpers'

Cypress.Commands.add(
  'balModalIsOpen',
  {
    prevSubject: true,
  },
  subject => {
    return cy.wrap(subject).find(selectors.modal.main).should('have.class', 'is-active')
  },
)

Cypress.Commands.add(
  'balModalIsClosed',
  {
    prevSubject: true,
  },
  subject => {
    return cy.wrap(subject).find(selectors.modal.main).should('not.have.class', 'is-active')
  },
)