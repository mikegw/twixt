(() => {
  // src/vector.ts
  var addVectors = (v1, v2) => {
    return {
      row: v1.row + v2.row,
      column: v1.column + v2.column
    };
  };
  var sameVectors = (vector1, vector2) => {
    return vector1.row == vector2.row && vector1.column == vector2.column;
  };
  function intersects([a, b], [c, d]) {
    const determinant = (b.row - a.row) * (d.column - c.column) - (d.row - c.row) * (b.column - a.column);
    if (determinant == 0)
      return false;
    const lambda = ((d.column - c.column) * (d.row - a.row) + (c.row - d.row) * (d.column - a.column)) / determinant;
    const gamma = ((a.column - b.column) * (d.row - a.row) + (b.row - a.row) * (d.column - a.column)) / determinant;
    return 0 < lambda && lambda < 1 && (0 < gamma && gamma < 1);
  }

  // src/board/slot.ts
  var Slot = class {
    constructor(position) {
      this.color = null;
      this.position = position;
    }
    get isOccupied() {
      return this.color !== null;
    }
  };

  // src/board/connection.ts
  var Connection = class {
    constructor(color, slots) {
      this.overlaps = (otherConnection) => {
        const firstPegConnectedToOtherConnection = otherConnection.positions.some((position) => sameVectors(this.positions[0], position));
        const secondPegConnectedToOtherConnection = otherConnection.positions.some((position) => sameVectors(this.positions[1], position));
        if (firstPegConnectedToOtherConnection && secondPegConnectedToOtherConnection)
          return true;
        if (firstPegConnectedToOtherConnection || secondPegConnectedToOtherConnection)
          return false;
        return intersects(this.positions, otherConnection.positions);
      };
      this.color = color;
      this.slots = slots;
    }
    get positions() {
      return [this.slots[0].position, this.slots[1].position];
    }
  };

  // src/board.ts
  var _Board = class {
    constructor(size = 16) {
      this.slots = [];
      this.connections = [];
      this.slotAt = (position) => {
        return this.slots.find((slot) => sameVectors(slot.position, position));
      };
      this.isValidPosition = (position) => {
        return this.isOnBoard(position) && !this.corners.some((corner) => sameVectors(position, corner));
      };
      this.isValidConnection = (connection) => {
        return !this.connections.some((other) => connection.overlaps(other));
      };
      this.isOnBoard = (position) => {
        return position.row >= 0 && position.row < this.size && position.column >= 0 && position.column < this.size;
      };
      this.size = size;
      this.populateSlots(size);
    }
    place(color, position) {
      if (!this.isValidPosition(position))
        return null;
      if (this.onOpponentBorder(position, color))
        return null;
      const slot = this.slotAt(position);
      if (slot.isOccupied)
        return null;
      slot.color = color;
      return slot;
    }
    connect(color, slots) {
      const connection = new Connection(color, slots);
      if (!this.isValidConnection(connection))
        return null;
      this.connections.push(connection);
      return connection;
    }
    neighboringSlots(position) {
      return this.neighboringPositions(position).map(this.slotAt).filter((slot) => slot.isOccupied);
    }
    populateSlots(size) {
      for (let row = 0; row <= size; row++) {
        for (let column = 0; column <= size; column++) {
          const position = { row, column };
          if (this.corners.some((corner) => sameVectors(position, corner)))
            continue;
          this.slots.push(new Slot(position));
        }
      }
    }
    get corners() {
      return [
        { row: 0, column: 0 },
        { row: 0, column: this.size - 1 },
        { row: this.size - 1, column: 0 },
        { row: this.size - 1, column: this.size - 1 }
      ];
    }
    onOpponentBorder(position, color) {
      return color == "RED" /* Red */ && (position.column == 0 || position.column == this.size - 1) || color == "BLUE" /* Blue */ && (position.row == 0 || position.row == this.size - 1);
    }
    neighboringPositions(position) {
      const potentialNeighbors = _Board.neighborDiffs.map((diff) => addVectors(position, diff));
      return potentialNeighbors.filter(this.isValidPosition);
    }
  };
  var Board = _Board;
  Board.neighborDiffs = [
    { row: 1, column: 2 },
    { row: 2, column: 1 },
    { row: 1, column: -2 },
    { row: -2, column: 1 },
    { row: -1, column: 2 },
    { row: 2, column: -1 },
    { row: -1, column: -2 },
    { row: -2, column: -1 }
  ];

  // src/player.ts
  var Player = class {
    constructor(color) {
      this.color = color;
    }
  };

  // src/game.ts
  var Game = class {
    constructor() {
      this.players = [new Player("RED" /* Red */), new Player("BLUE" /* Blue */)];
      this.board = new Board();
      this.currentPlayerIndex = 0;
    }
    get currentPlayer() {
      return this.players[this.currentPlayerIndex];
    }
    placePeg(position) {
      const slot = this.board.place(this.currentPlayer.color, position);
      if (!slot)
        return { slot, connectionsAdded: [] };
      const connections = this.addConnections(position, slot);
      this.endTurn();
      return { slot, connectionsAdded: connections };
    }
    addConnections(position, slot) {
      const neighboringSlots = this.board.neighboringSlots(position);
      const neighboringSlotsWithColor = neighboringSlots.filter((slot2) => slot2.color == this.currentPlayer.color);
      const connections = neighboringSlotsWithColor.map((neighbor) => this.connect(neighbor, slot));
      return connections.filter(Boolean);
    }
    connect(slot1, slot2) {
      return this.board.connect(this.currentPlayer.color, [slot1, slot2]);
    }
    endTurn() {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
  };

  // src/renderer.ts
  var EMPTY_SLOT_RADIUS = 4;
  var EMPTY_SLOT_COLOR = "#999";
  var PEG_RADIUS = 7;
  var COLORS = {
    "RED": "#F72595",
    "BLUE": "#4682F4"
  };
  var CONNECTION_WIDTH = 5;
  var BOUNDARY_WIDTH = 3;
  var Renderer = class {
    get boardImageSize() {
      return Math.min(this.canvas.width, this.canvas.height);
    }
    get slotGapSize() {
      return this.boardImageSize / this.board.size;
    }
    constructor(canvas2, ctx, board) {
      this.canvas = canvas2;
      this.ctx = ctx;
      this.board = board;
      this.drawEmptyBoard();
    }
    draw() {
      this.clear();
      this.redrawEmptyBoard();
      this.drawConnections();
      this.drawPegs();
    }
    clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawEmptyBoard() {
      this.offscreenCanvas = document.createElement("canvas");
      this.offscreenCanvas.width = this.canvas.width;
      this.offscreenCanvas.height = this.canvas.height;
      const context = this.offscreenCanvas.getContext("2d");
      this.drawEmptySlots(context);
      this.drawBoundaries(context);
    }
    drawEmptySlots(context) {
      for (let slot of this.board.slots) {
        this.drawCircle(
          this.positionToCoordinates(slot.position),
          EMPTY_SLOT_RADIUS,
          EMPTY_SLOT_COLOR,
          context
        );
      }
    }
    drawBoundaries(context) {
      const min = this.slotGapSize;
      const max = this.boardImageSize - min;
      const topLeft = { x: min, y: min };
      const topRight = { x: max, y: min };
      const bottomLeft = { x: min, y: max };
      const bottomRight = { x: max, y: max };
      this.drawLine(COLORS["RED" /* Red */], BOUNDARY_WIDTH, topLeft, topRight, context);
      this.drawLine(COLORS["RED" /* Red */], BOUNDARY_WIDTH, bottomLeft, bottomRight, context);
      this.drawLine(COLORS["BLUE" /* Blue */], BOUNDARY_WIDTH, topLeft, bottomLeft, context);
      this.drawLine(COLORS["BLUE" /* Blue */], BOUNDARY_WIDTH, topRight, bottomRight, context);
    }
    redrawEmptyBoard() {
      this.ctx.drawImage(this.offscreenCanvas, 0, 0, this.canvas.width, this.canvas.height);
    }
    drawConnections() {
      for (let connection of this.board.connections) {
        this.drawLine(
          COLORS[connection.color],
          CONNECTION_WIDTH,
          this.positionToCoordinates(connection.slots[0].position),
          this.positionToCoordinates(connection.slots[1].position)
        );
      }
    }
    drawPegs() {
      for (let slot of this.board.slots) {
        if (!slot.isOccupied)
          continue;
        const slotCoordinates = this.positionToCoordinates(slot.position);
        this.drawCircle(
          slotCoordinates,
          PEG_RADIUS,
          COLORS[slot.color]
        );
      }
    }
    drawCircle(coordinates, radius, color, context) {
      const ctx = context || this.ctx;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(coordinates.x, coordinates.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    drawLine(color, width, from, to, context) {
      const ctx = context || this.ctx;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
    positionToCoordinates(position) {
      return {
        x: (position.column + 0.5) * this.slotGapSize,
        y: (position.row + 0.5) * this.slotGapSize
      };
    }
  };

  // src/index.ts
  var canvas = document.getElementById("game-canvas");
  var setCanvasDimensions = () => {
    canvas.width = Math.min(canvas.offsetHeight, canvas.offsetWidth);
    canvas.height = Math.min(canvas.offsetHeight, canvas.offsetWidth);
  };
  var game = new Game();
  var renderer = new Renderer(
    canvas,
    canvas.getContext("2d"),
    game.board
  );
  var render = () => {
    window.requestAnimationFrame(() => renderer.draw());
  };
  var getCursorPosition = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };
  canvas.addEventListener("click", (event) => {
    const cursorPosition = getCursorPosition(event);
    const boardImageSize = Math.min(canvas.width, canvas.height);
    const slotGapSize = boardImageSize / game.board.size;
    const positionClicked = {
      row: Math.floor(cursorPosition.y / slotGapSize),
      column: Math.floor(cursorPosition.x / slotGapSize)
    };
    game.placePeg(positionClicked);
    render();
  });
  window.addEventListener("resize", () => {
    setCanvasDimensions();
    render();
  });
  document.addEventListener("DOMContentLoaded", () => {
    setCanvasDimensions();
    render();
  });
})();
//# sourceMappingURL=index.js.map
