"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionToCoordinates = exports.Renderer = exports.BOARD_PADDING = exports.DIM_COLORS = exports.COLORS = void 0;
var player_1 = require("../player");
var renderPeg_1 = require("./renderer/renderPeg");
var renderConnection_1 = require("./renderer/renderConnection");
var gameUI_1 = require("../gameUI");
var renderElectrifiedLine_1 = require("./renderer/renderElectrifiedLine");
var MIN_FRAME_RATE = 20;
var EMPTY_SLOT_RADIUS = 0.003;
var BOUNDARY_WIDTH = 0.003;
var EMPTY_SLOT_COLOR = '#999';
var HIGHLIGHT_COLOR = '#FFFFFF22';
exports.COLORS = {
    'RED': '#F72595',
    'BLUE': '#4682F4'
};
exports.DIM_COLORS = {
    'RED': '#ae1f6a',
    'BLUE': '#3463bc'
};
exports.BOARD_PADDING = 1;
var LABEL_COLOR = '#FAD240';
var Renderer = /** @class */ (function () {
    function Renderer(canvas, board) {
        var _this = this;
        this.padding = exports.BOARD_PADDING;
        this.animatedPegs = [];
        this.animatedConnections = [];
        this.boundaryFidelity = 'high';
        this.connectionFidelity = 'medium';
        this.frameCount = 0;
        this.canvas = canvas;
        this.board = board;
        this.prerenderEmptyBoard();
        setTimeout(function () { return _this.checkFrameRate(); }, 1000);
    }
    Object.defineProperty(Renderer.prototype, "slotGapSize", {
        get: function () {
            return this.canvas.size / (this.board.size + 2 * this.padding);
        },
        enumerable: false,
        configurable: true
    });
    Renderer.prototype.checkFrameRate = function () {
        var _this = this;
        console.log("Frame Rate:", this.frameCount);
        if (this.frameCount < MIN_FRAME_RATE) {
            this.boundaryFidelity = 'medium';
            this.connectionFidelity = 'low';
        }
        else {
            this.boundaryFidelity = 'high';
            this.connectionFidelity = 'medium';
        }
        this.frameCount = 0;
        setTimeout(function () { return _this.checkFrameRate(); }, 1000);
    };
    Renderer.prototype.setConnectionDirection = function (direction) {
        this.connectionDirection = direction;
    };
    Renderer.prototype.setBoundariesDirection = function (direction) {
        this.boundaryDirection = direction;
    };
    Renderer.prototype.draw = function () {
        var _this = this;
        window.requestAnimationFrame(function () {
            _this.frameCount += 1;
            _this.canvas.clear();
            _this.canvas.prerender();
            _this.drawConnections();
            _this.drawPegs();
            _this.drawElectricity();
            _this.highlightLastPegDrawn();
            _this.draw();
        });
    };
    Renderer.prototype.prerenderEmptyBoard = function () {
        this.drawEmptySlots();
        this.drawBoundaries();
        this.drawLabels();
    };
    Renderer.prototype.drawEmptySlots = function () {
        for (var row = 0; row < this.board.size; row++) {
            for (var column = 0; column < this.board.size; column++) {
                var position = { row: row, column: column };
                if (!this.board.isValidPosition(position))
                    continue;
                this.canvas.drawCircle(this.positionToCoordinates(position), this.emptySlotRadius, EMPTY_SLOT_COLOR, true);
            }
        }
    };
    Renderer.prototype.corners = function () {
        var min = this.slotGapSize * (1 + exports.BOARD_PADDING);
        var max = this.canvas.size - min;
        return {
            topLeft: { x: min, y: min },
            topRight: { x: max, y: min },
            bottomLeft: { x: min, y: max },
            bottomRight: { x: max, y: max }
        };
    };
    Renderer.prototype.verticalBoundaries = function () {
        var corners = this.corners();
        return [
            { color: exports.COLORS[gameUI_1.Color.Red], from: corners.topLeft, to: corners.topRight },
            { color: exports.COLORS[gameUI_1.Color.Red], from: corners.bottomLeft, to: corners.bottomRight },
        ];
    };
    Renderer.prototype.horizontalBoundaries = function () {
        var corners = this.corners();
        return [
            { color: exports.COLORS[gameUI_1.Color.Blue], from: corners.topLeft, to: corners.bottomLeft },
            { color: exports.COLORS[gameUI_1.Color.Blue], from: corners.topRight, to: corners.bottomRight },
        ];
    };
    Renderer.prototype.drawBoundaries = function () {
        for (var _i = 0, _a = (this.verticalBoundaries().concat(this.horizontalBoundaries())); _i < _a.length; _i++) {
            var boundary = _a[_i];
            this.canvas.drawLine(boundary.color, this.boundaryWidth, boundary.from, boundary.to, true);
        }
    };
    Renderer.prototype.electrifyBoundaries = function () {
        var electrifiedBoundaries = this.boundaryDirection == player_1.Direction.Vertical ? this.verticalBoundaries() : this.horizontalBoundaries();
        for (var _i = 0, electrifiedBoundaries_1 = electrifiedBoundaries; _i < electrifiedBoundaries_1.length; _i++) {
            var boundary = electrifiedBoundaries_1[_i];
            (0, renderElectrifiedLine_1.drawElectrifiedLine)(boundary.from, boundary.to, this.canvas, this.boundaryFidelity);
        }
    };
    Renderer.prototype.drawConnections = function () {
        var _loop_1 = function (connection) {
            var animatedConnection = this_1.animatedConnections.find(function (animated) { return animated.connection == connection; });
            if (!animatedConnection) {
                animatedConnection = { connection: connection, completion: 0 };
                this_1.animatedConnections.push(animatedConnection);
            }
            (0, renderConnection_1.drawConnection)(animatedConnection, this_1.canvas, this_1.slotGapSize);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.board.connections; _i < _a.length; _i++) {
            var connection = _a[_i];
            _loop_1(connection);
        }
    };
    Renderer.prototype.drawPegs = function () {
        var _loop_2 = function (slot) {
            var animatedPeg = this_2.animatedPegs.find(function (animated) { return animated.peg == slot; });
            if (!animatedPeg) {
                animatedPeg = { peg: slot, completion: 0 };
                this_2.animatedPegs.push(animatedPeg);
            }
            var electrified = slot.direction == this_2.connectionDirection;
            (0, renderPeg_1.drawPeg)(animatedPeg, this_2.canvas, this_2.slotGapSize, electrified);
        };
        var this_2 = this;
        for (var _i = 0, _a = this.board.slots; _i < _a.length; _i++) {
            var slot = _a[_i];
            _loop_2(slot);
        }
    };
    Renderer.prototype.drawElectricity = function () {
        this.electrifyBoundaries();
        for (var _i = 0, _a = this.board.connections; _i < _a.length; _i++) {
            var connection = _a[_i];
            if (connection.direction == this.connectionDirection) {
                (0, renderElectrifiedLine_1.drawElectrifiedLine)((0, exports.positionToCoordinates)(connection.slots[0].position, this.slotGapSize), (0, exports.positionToCoordinates)(connection.slots[1].position, this.slotGapSize), this.canvas, this.connectionFidelity);
            }
        }
    };
    Renderer.prototype.highlightLastPegDrawn = function () {
        var lastPegDrawn = this.animatedPegs[this.animatedPegs.length - 1];
        if (!lastPegDrawn)
            return;
        this.canvas.drawCircle(this.positionToCoordinates(lastPegDrawn.peg.position), 2 * (0, renderPeg_1.pegRadius)(lastPegDrawn.completion, function (n) { return n; }, this.canvas), HIGHLIGHT_COLOR);
    };
    Renderer.prototype.positionToCoordinates = function (position) {
        return (0, exports.positionToCoordinates)(position, this.slotGapSize);
    };
    Renderer.prototype.drawLabels = function () {
        for (var index = 0; index < this.board.size; index++) {
            var columnLabel = String.fromCharCode(index + 'A'.charCodeAt(0));
            this.drawLabel(columnLabel, { row: -1, column: index });
            this.drawLabel(columnLabel, { row: this.board.size, column: index });
            var rowLabel = (index + 1).toString();
            this.drawLabel(rowLabel, { row: index, column: -1 });
            this.drawLabel(rowLabel, { row: index, column: this.board.size });
        }
    };
    Renderer.prototype.drawLabel = function (label, position) {
        var coordinates = this.positionToCoordinates(position);
        this.canvas.drawText(LABEL_COLOR, label, coordinates, true);
    };
    Object.defineProperty(Renderer.prototype, "emptySlotRadius", {
        get: function () {
            return Math.ceil(EMPTY_SLOT_RADIUS * this.canvas.size);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "boundaryWidth", {
        get: function () {
            return Math.ceil(BOUNDARY_WIDTH * this.canvas.size);
        },
        enumerable: false,
        configurable: true
    });
    return Renderer;
}());
exports.Renderer = Renderer;
var positionToCoordinates = function (position, gapSize) {
    return {
        x: Math.floor((position.column + exports.BOARD_PADDING + 0.5) * gapSize),
        y: Math.floor((position.row + exports.BOARD_PADDING + 0.5) * gapSize)
    };
};
exports.positionToCoordinates = positionToCoordinates;
