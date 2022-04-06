import { byTestId } from '../../../../testing/src'

export class ButtonPage {
  primaryButton = byTestId('primary-button')
  primaryButtonDisabled = byTestId('primary-button-disabled')

  open() {
    cy.visit('/components/bal-button')
  }
}