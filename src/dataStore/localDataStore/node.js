"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNode = void 0;
var generateId_1 = require("../../generateId");
var buildNode = function (data) {
    var callbacks = {};
    var callbacksOfType = function (type) {
        return Object.values(callbacks)
            .filter(function (withType) { return withType.type == 'childAdded'; })
            .map(function (callbackWithType) { return callbackWithType.callback; });
    };
    return {
        key: (0, generateId_1.generateId)(),
        data: data,
        children: {},
        callbacks: callbacks,
        callbacksOfType: callbacksOfType
    };
};
exports.buildNode = buildNode;
