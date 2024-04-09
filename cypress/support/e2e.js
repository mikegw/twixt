"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./commands");
var firebase_1 = require("../../src/dataStore/firebase");
before(function () {
    var defaultConfig = {};
    return cy.readFile('config/default.json')
        .then(function (defaults) {
        defaultConfig = defaults;
        return cy.readFile('config/test.json');
    }).then(function (environmentConfig) {
        var config = __assign(__assign({}, defaultConfig), environmentConfig);
        return (0, firebase_1.dataStore)(config);
    }).as('dataStore');
});
beforeEach(function () {
    window.localStorage.removeItem('twixt-username');
    this.dataStore.clearEnvironment();
});
