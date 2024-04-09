"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
var Canvas = /** @class */ (function () {
    function Canvas() {
        var _this = this;
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setDimensions = function () {
            console.log(_this.canvas.height, _this.canvas.width);
            var minSize = Math.min(_this.canvas.parentElement.offsetHeight, _this.canvas.parentElement.offsetWidth);
            _this.canvas.style.height = "".concat(minSize, "px");
            _this.canvas.style.width = "".concat(minSize, "px");
            _this.canvas.width = minSize * _this.pixelRatio;
            _this.canvas.height = minSize * _this.pixelRatio;
            _this.offscreenCanvas.width = _this.canvas.width;
            _this.offscreenCanvas.height = _this.canvas.height;
        };
        this.offscreenCanvas = document.createElement("canvas");
        this.offscreenCtx = this.offscreenCanvas.getContext("2d");
        this.pixelRatio = window.devicePixelRatio;
    }
    Object.defineProperty(Canvas.prototype, "size", {
        get: function () {
            return Math.min(this.canvas.width, this.canvas.height);
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Canvas.prototype.prerender = function () {
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    };
    Canvas.prototype.drawCircle = function (coordinates, radius, color, prerender) {
        var ctx = prerender ? this.offscreenCtx : this.ctx;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(coordinates.x, coordinates.y, radius * this.pixelRatio, 0, 2 * Math.PI);
        ctx.fill();
    };
    Canvas.prototype.drawLine = function (color, width, from, to, prerender) {
        this.drawPath(color, width, [from, to], prerender);
    };
    Canvas.prototype.drawPath = function (color, width, coordinates, prerender) {
        var ctx = prerender ? this.offscreenCtx : this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = width * this.pixelRatio;
        ctx.lineCap = "round";
        ctx.beginPath();
        var startCoordinates = coordinates.shift();
        ctx.moveTo(startCoordinates.x, startCoordinates.y);
        for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
            var nextCoordinate = coordinates_1[_i];
            ctx.lineTo(nextCoordinate.x, nextCoordinate.y);
        }
        ctx.stroke();
    };
    Canvas.prototype.drawText = function (color, text, position, prerender) {
        if (prerender === void 0) { prerender = false; }
        var ctx = prerender ? this.offscreenCtx : this.ctx;
        ctx.fillStyle = color;
        ctx.font = "".concat(14 * this.pixelRatio, "px Trebuchet MS");
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, position.x, position.y);
    };
    Canvas.prototype.whenClicked = function (callback) {
        var _this = this;
        this.canvas.addEventListener("click", function (event) {
            var rect = _this.canvas.getBoundingClientRect();
            var cursorPosition = {
                x: (event.clientX - rect.left) * _this.pixelRatio,
                y: (event.clientY - rect.top) * _this.pixelRatio
            };
            console.log(_this.pixelRatio, _this.size, cursorPosition);
            callback(cursorPosition);
        });
    };
    return Canvas;
}());
exports.Canvas = Canvas;
