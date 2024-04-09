"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersects = exports.vectorLength = exports.vToS = exports.sameVectors = exports.subtractVectors = exports.scale = exports.addVectors = void 0;
var addVectors = function () {
    var vectors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        vectors[_i] = arguments[_i];
    }
    return {
        row: vectors.reduce(function (sum, vector) { return sum + vector.row; }, 0),
        column: vectors.reduce(function (sum, vector) { return sum + vector.column; }, 0)
    };
};
exports.addVectors = addVectors;
var scale = function (vector, scalar) {
    return {
        row: vector.row * scalar,
        column: vector.column * scalar
    };
};
exports.scale = scale;
var subtractVectors = function (v1, v2) {
    return (0, exports.addVectors)(v1, (0, exports.scale)(v2, -1));
};
exports.subtractVectors = subtractVectors;
var sameVectors = function (vector1, vector2) {
    return vector1.row == vector2.row
        && vector1.column == vector2.column;
};
exports.sameVectors = sameVectors;
var vToS = function (vector) {
    return "{row: ".concat(vector.row, ", column: ").concat(vector.column, "}");
};
exports.vToS = vToS;
var vectorLength = function (vector) {
    return Math.sqrt(Math.pow(vector.row, 2) + Math.pow(vector.column, 2));
};
exports.vectorLength = vectorLength;
function intersects(_a, _b) {
    var a = _a[0], b = _a[1];
    var c = _b[0], d = _b[1];
    var determinant = (b.row - a.row) * (d.column - c.column) - (d.row - c.row) * (b.column - a.column);
    if (determinant == 0)
        return false;
    var lambda = ((d.column - c.column) * (d.row - a.row) + (c.row - d.row) * (d.column - a.column)) / determinant;
    var gamma = ((a.column - b.column) * (d.row - a.row) + (b.row - a.row) * (d.column - a.column)) / determinant;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
}
exports.intersects = intersects;
;
