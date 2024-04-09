"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coin = void 0;
exports.Coin = {
    Heads: 'HEADS',
    Tails: 'TAILS',
    bias: undefined,
    toss: function () {
        if (exports.Coin.bias)
            return exports.Coin.bias;
        return Math.random() > 0.5 ? 'HEADS' : 'TAILS';
    }
};
