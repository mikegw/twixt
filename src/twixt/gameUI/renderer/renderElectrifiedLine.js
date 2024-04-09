"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawElectrifiedLine = void 0;
var vector_1 = require("../../board/vector");
var animation_1 = require("./animation");
var ELECTRICITY_WIDTH = 0.002;
var HIGH_FIDELITY_ANIMATION_SPEED = 0.001;
var MEDIUM_FIDELITY_ANIMATION_SPEED = 0.0015;
var LOW_FIDELITY_ANIMATION_SPEED = 0.005;
var HIGH_FIDELITY_SEGMENTS = 50;
var MEDIUM_FIDELITY_SEGMENTS = 20;
var LOW_FIDELITY_SEGMENTS = 7;
var HIGH_FIDELITY_PERTURBATION = 0.2;
var MEDIUM_FIDELITY_PERTURBATION = 0.1;
var LOW_FIDELITY_PERTURBATION = 0.1;
var ElectrifiedLines = [];
var drawElectrifiedLine = function (from, to, canvas, fidelity) {
    var fromVector = coordinatesToVector(from);
    var toVector = coordinatesToVector(to);
    var electricityWidth = Math.ceil(ELECTRICITY_WIDTH * canvas.size);
    var electrifiedLine = ElectrifiedLines.find(function (line) {
        return (0, vector_1.sameVectors)(line.from, fromVector) && (0, vector_1.sameVectors)(line.to, toVector);
    }) || createElectrifiedLine(fromVector, toVector, fidelity);
    var color;
    for (var _i = 0, _a = electrifiedLine.sparks; _i < _a.length; _i++) {
        var spark = _a[_i];
        color = "rgba(255, 255, 255, ".concat(spark.intensity, ")");
        canvas.drawPath(color, electricityWidth, sparkCoordinates(spark));
        color = "rgba(255, 255, 255, ".concat(spark.intensity / 4, ")");
        canvas.drawPath(color, electricityWidth * 3, sparkCoordinates(spark));
        (0, animation_1.setNextFrame)(spark, spark.speed);
    }
    var completedSparks = electrifiedLine.sparks.filter(function (spark) { return spark.completion >= 1; }).length;
    if (completedSparks == 0 && electrifiedLine.sparks.length > 1)
        return;
    electrifiedLine.sparks = electrifiedLine.sparks.filter(function (spark) { return spark.completion < 1; });
    if (electrifiedLine.sparks.length >= 3)
        return;
    var newSparks = randomInt(4);
    for (var i = 0; i < newSparks; i++) {
        electrifiedLine.sparks.push(createSpark(fromVector, toVector, fidelity));
    }
};
exports.drawElectrifiedLine = drawElectrifiedLine;
var createElectrifiedLine = function (from, to, fidelity) {
    var sparks = Array.from({ length: randomInt(3) + 3 }, function () { return createSpark(from, to, fidelity); });
    var electrifiedLine = { from: from, to: to, sparks: sparks };
    ElectrifiedLines.push(electrifiedLine);
    return electrifiedLine;
};
var createSpark = function (from, to, fidelity) {
    var segments = segmentsForFidelity(fidelity);
    var lineVector = (0, vector_1.subtractVectors)(to, from);
    var lineSegment = (0, vector_1.scale)(lineVector, 1 / segments);
    var segmentLength = Math.round((0, vector_1.vectorLength)(lineSegment));
    var perturbationVector = { row: -lineSegment.column, column: lineSegment.row };
    var perturbationScale = perturbationForFidelity(fidelity);
    var perturbationScaleOffset = perturbationScale / 2;
    var randomPerturbation = function () { return (Math.pow(Math.random(), 2)) * (Math.random() * perturbationScale - perturbationScaleOffset); };
    var perturbations = [];
    var minAmplitudes = [];
    for (var i = 0; i <= segments; i++) {
        var nextSegment = (0, vector_1.addVectors)(from, (0, vector_1.scale)(lineSegment, i));
        minAmplitudes.push(nextSegment);
        var parallelPerturbationSize = segmentLength * randomPerturbation() * 0.5;
        var perpendicularPerturbationSize = segmentLength * randomPerturbation() * 0.5;
        var parallelPerturbation = (0, vector_1.scale)(lineSegment, parallelPerturbationSize);
        var perpendicularPerturbation = (0, vector_1.scale)(perturbationVector, perpendicularPerturbationSize);
        var perturbed = (0, vector_1.addVectors)(parallelPerturbation, perpendicularPerturbation);
        perturbations.push(perturbed);
    }
    var intensity = 0.15 + 0.1 * Math.random();
    var speed = animationSpeed(fidelity);
    return { perturbations: perturbations, minAmplitudes: minAmplitudes, completion: 0, intensity: intensity, speed: speed };
};
var segmentsForFidelity = function (fidelity) {
    var segments;
    switch (fidelity) {
        case "high":
            segments = HIGH_FIDELITY_SEGMENTS;
            break;
        case "medium":
            segments = MEDIUM_FIDELITY_SEGMENTS;
            break;
        case "low":
            segments = LOW_FIDELITY_SEGMENTS;
            break;
    }
    return segments + randomInt(Math.ceil(segments / 3));
};
var perturbationForFidelity = function (fidelity) {
    switch (fidelity) {
        case "high": return HIGH_FIDELITY_PERTURBATION;
        case "medium": return MEDIUM_FIDELITY_PERTURBATION;
        case "low": return LOW_FIDELITY_PERTURBATION;
    }
};
var animationSpeed = function (fidelity) {
    var speed;
    switch (fidelity) {
        case "high":
            speed = HIGH_FIDELITY_ANIMATION_SPEED;
            break;
        case "medium":
            speed = MEDIUM_FIDELITY_ANIMATION_SPEED;
            break;
        case "low":
            speed = LOW_FIDELITY_ANIMATION_SPEED;
            break;
    }
    return speed * (0.7 + Math.random() * 0.6);
};
var sparkCoordinates = function (spark) {
    var perturbations = spark.perturbations.map(function (p) { return (0, vector_1.scale)(p, scaleCompletion(spark.completion)); });
    var animatedAmplitudes = perturbations.map(function (p, index) { return (0, vector_1.addVectors)(spark.minAmplitudes[index], p); });
    return animatedAmplitudes.map(vectorToCoordinates);
};
var coordinatesToVector = function (coordinates) {
    return {
        row: coordinates.y,
        column: coordinates.x
    };
};
var vectorToCoordinates = function (vector) {
    return {
        x: Math.floor(vector.column),
        y: Math.floor(vector.row)
    };
};
function randomInt(max) {
    return Math.floor(Math.random() * max);
}
function scaleCompletion(completion) {
    return (0, animation_1.easeInOutCubic)((completion >= 0.5 ? (1 - completion) : completion) * 2);
}
