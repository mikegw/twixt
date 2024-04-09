"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeMove = exports.serializeMoves = exports.parseMove = exports.parseMoves = void 0;
var parseMoves = function (rawMovesString) {
    var rawMoves = rawMovesString.split(',');
    return rawMoves.map(exports.parseMove);
};
exports.parseMoves = parseMoves;
var parseMove = function (rawMove) {
    var rawColumn = rawMove[0];
    var rawRow = rawMove.substring(1);
    return {
        row: Number(rawRow) - 1,
        column: rawColumn.charCodeAt(0) - 'A'.charCodeAt(0)
    };
};
exports.parseMove = parseMove;
var serializeMoves = function (moves) {
    return moves.map(exports.serializeMove).join(',');
};
exports.serializeMoves = serializeMoves;
var serializeMove = function (move) {
    var column = String.fromCharCode(move.column + 'A'.charCodeAt(0));
    var row = String(move.row + 1);
    return column + row;
};
exports.serializeMove = serializeMove;
