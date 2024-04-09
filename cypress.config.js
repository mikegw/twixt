"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cypress_1 = require("cypress");
exports.default = (0, cypress_1.defineConfig)({
    viewportWidth: 375,
    viewportHeight: 667,
    e2e: {
        setupNodeEvents: function (on, config) {
            // implement node event listeners here
        },
    },
});
