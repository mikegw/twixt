// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'
import { dataStore as buildDataStore } from "../../src/dataStore/firebase";
import { TestDataStore } from "../../src/dataStore";


before(function () {
  let defaultConfig = {}
  return cy.readFile('config/default.json')
  .then((defaults) => {
    defaultConfig = defaults
    return cy.readFile('config/test.json')
  }).then((environmentConfig) => {
    const config = { ...defaultConfig, ...environmentConfig }
    return buildDataStore(config) as TestDataStore
  }).as('dataStore')
})

beforeEach(function() {
  this.dataStore.clearEnvironment()
})
