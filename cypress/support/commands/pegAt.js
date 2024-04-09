"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pegAt = void 0;
var parse_1 = require("../../../src/twixt/parse");
var pegAt = function (rawPosition) {
    var position = (0, parse_1.parseMove)(rawPosition);
    return cy.pegAtPosition(position);
};
exports.pegAt = pegAt;
