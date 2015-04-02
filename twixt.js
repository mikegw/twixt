var Game = function () {
  this.canvas = document.getElementById("game-canvas");
  this.gridCanvas = document.getElementById("grid-canvas");
  this.ctx = this.canvas.getContext("2d");
  this.grid = this.gridCanvas.getContext("2d");
  this.board = [];
  this.moves = [];
  this.setupEmptyBoard(this.board);
  this.populateNeighbors();
  this.drawSquares();
  this.toMove = "red"
}

Game.BOARD_SIZE = 30;
Game.SQ_SIZE = 20;

Game.prototype.eachSquare = function (callback) {
  for (var row in this.board) {
    for (var sq in this.board[row]) {
      callback(this.board[row][sq]);
    }
  }
};

Game.prototype.squareAt = function (pos) {
  console.log(pos);
  return this.board[pos.row][pos.col];
}

Game.prototype.setupEmptyBoard = function (board) {

  for (var r = 0; r < Game.BOARD_SIZE; r++) {
    var row = [];
    for (var c = 0; c < Game.BOARD_SIZE; c++) {
      row.push(new Square({row: r, col: c}));
    }
    board.push(row);
  }
}

Game.prototype.drawSquares = function () {
  this.eachSquare(function(sq) {
    sq.draw(this.grid, Game.SQ_SIZE);
  }.bind(this));
};


Game.prototype.populateNeighbors = function () {
  this.eachSquare(this.populateNeighborsOfSq.bind(this))
}

Game.prototype.populateNeighborsOfSq = function (sq) {
  var vects = [[1,2], [2,1], [1,-2], [-2,1], [-1,2], [2,-1], [-1,-2], [-2,-1]]
  sq.neighbors = [];
  for (var i = 0; i < vects.length; i++) {
    var neighborRow = vects[i][0] + sq.pos.row;
    var neighborCol = vects[i][1] + sq.pos.col;

    if (neighborRow === ((neighborRow + Game.BOARD_SIZE) % Game.BOARD_SIZE) &&
        neighborCol === ((neighborCol + Game.BOARD_SIZE) % Game.BOARD_SIZE)) {
      sq.neighbors.push(this.board[neighborRow][neighborCol]);
    }
  }
};

Game.prototype.addPeg = function (pos, color) {
  var sq = this.squareAt(pos);
  sq.peg = color;

  this.ctx.fillStyle = (color == "red" ? "#C71585" : "#4682B4");
  this.ctx.beginPath();
  this.ctx.arc(
    sq.topLeft(Game.SQ_SIZE).x + Game.SQ_SIZE/2,
    sq.topLeft(Game.SQ_SIZE).y + Game.SQ_SIZE/2,
    Game.SQ_SIZE/2 - 4,
    0, 2 * Math.PI,
    true
  );
  this.ctx.fill();


  for (var i = 0; i < sq.neighbors.length; i++) {
    var nbr = sq.neighbors[i];
    if (nbr.peg && nbr.peg === color && this.testConnection(sq, nbr)) {
      this.connect(sq, nbr, color);
    }
  }
};

Game.prototype.testConnection = function(sq, nbr) {
  // Have to check 9 different possible obstructing connections
  // BRUTE FORCE!!!

  var bigUp = [
    //90deg rotations
    [[-2,-1], [-1,1]],
    [[-1,-1], [0,1]],
    [[-2,0], [-1,2]],
    [[-1,0], [0,2]],

    //x-reflections
    [[-3,0], [-1,1]],
    [[-2,0], [0,1]],
    [[-1,0], [1,1]],

    //45deg reflections
    [[0,-1], [-1, 1]],
    [[-1, 0], [-2, 2]]
  ]

  var bigDown = [
    //90deg rotations
    [[1,-1], [0,1]],
    [[2,-1], [1,1]],
    [[1,0], [0,2]],
    [[2,0], [1,2]],

    //x-reflections
    [[3,0], [1,1]],
    [[2,0], [0,1]],
    [[1,0], [-1,1]],

    //45deg reflections
    [[0,-1], [1, 1]],
    [[1, 0], [2, 2]]
  ]

  var smallUp = [
    //90deg rotations
    [[1,2], [-1,1]],
    [[1,1], [-1,0]],
    [[0,2], [-2,1]],
    [[0,1], [-2,0]],

    //x-reflections
    [[-1,-1], [0,1]],
    [[-1,0], [0,2]],
    [[-1,1], [0,3]],

    //45deg reflections
    [[0,1], [-2, 2]],
    [[1, 0], [-1, 1]]
  ]

  var smallDown = [
    //90deg rotations
    [[1,0], [-1,1]],
    [[1,1], [-1,2]],
    [[2,0], [0,1]],
    [[2,1], [0,2]],

    //x-reflections
    [[0,3], [1,1]],
    [[0,2], [1,0]],
    [[0,1], [1,-1]],

    //45deg reflections
    [[-1,0], [1, 1]],
    [[0, 1], [2, 2]]
  ]

  var leftSq = (sq.pos.col > nbr.pos.col) ? nbr : sq;
  var rightSq = (sq.pos.col > nbr.pos.col) ? sq : nbr;

  var opposingConnections

  switch (rightSq.pos.row - leftSq.pos.row) {
    case -2:
      opposingConnections = bigUp;
      break;
    case -1:
      opposingConnections = smallUp;
      break;
    case 1:
      opposingConnections = smallDown;
      break;
    case 2:
      opposingConnections = bigDown;
      break;
  }

  for (var i = 0; i < opposingConnections.length; i++) {
    var sq0Row = leftSq.pos.row + opposingConnections[i][0][0];
    var sq0Col = leftSq.pos.col + opposingConnections[i][0][1];
    var sq1Row = leftSq.pos.row + opposingConnections[i][1][0];
    var sq1Col = leftSq.pos.col + opposingConnections[i][1][1];

    if (
      sq0Row !== ((sq0Row + Game.BOARD_SIZE) % Game.BOARD_SIZE) ||
      sq0Col !== ((sq0Col + Game.BOARD_SIZE) % Game.BOARD_SIZE) ||
      sq1Row !== ((sq1Row + Game.BOARD_SIZE) % Game.BOARD_SIZE) ||
      sq1Col !== ((sq1Col + Game.BOARD_SIZE) % Game.BOARD_SIZE)
    ) {
      continue;
    }

    var sq0 = this.board[sq0Row][sq0Col];
    var sq1 = this.board[sq1Row][sq1Col];

    if (sq0.connections.indexOf(sq1) != -1) return false;
  }

  return true;
}




Game.prototype.connect = function (sq1, sq2, color) {
  sq1.connections.push(sq2);
  sq2.connections.push(sq1);

  this.ctx.strokeStyle = (color == "red" ? "#C71585" : "#4682B4");
  this.ctx.lineWidth = Game.SQ_SIZE / 4;
  this.ctx.lineCap = "round";
  this.ctx.beginPath();
  this.ctx.moveTo(
    sq1.topLeft(Game.SQ_SIZE).x + Game.SQ_SIZE/2,
    sq1.topLeft(Game.SQ_SIZE).y + Game.SQ_SIZE/2
  );
  this.ctx.lineTo(
    sq2.topLeft(Game.SQ_SIZE).x + Game.SQ_SIZE/2,
    sq2.topLeft(Game.SQ_SIZE).y + Game.SQ_SIZE/2
  );
  this.ctx.stroke();
};


Game.prototype.checkWin = function () {
  var checked = [];

  var dfCheck = function (sq, options) {
    checked.push(sq.id);
    if (sq.pos[options.direction] === options.value) {
      return true;
    } else {
      for (var i = 0; i < sq.connections.length; i++) {
        if (checked.indexOf(sq.connections[i].id) == -1) {
          if (dfCheck(sq.connections[i], options)) {
            return true;
          }
        }
      }
    }
  }

  for (var col = 0; col < Game.BOARD_SIZE; col++) {
    if (
      (this.board[0][col].peg === "green") &&
      dfCheck(
        this.board[0][col],
        {direction: "row", value: Game.BOARD_SIZE - 1}
      )
    ) {
      console.log("Green Wins");
    }
  }

  checked = [];

  for (var row = 0; row < Game.BOARD_SIZE; row++) {
    if (
      (this.board[row][0].peg === "red") &&
      dfCheck(
        this.board[row][0],
      {direction: "col", value: Game.BOARD_SIZE - 1}
    )
  ) {
    console.log("Red Wins");
  }
}

}

var Square = function (pos){
  this.pos = pos;
  this.topLeft = function (boxSize) {
    return {
      x: pos.col * boxSize,
      y: pos.row * boxSize
    };
  };
  this.state = "empty";
  this.isSelected = false;
  this.connections = [];
  this.id = Game.BOARD_SIZE*pos.row + pos.col;
};

Square.prototype.color = function () {
  if (this.isSelected) {return "rgba(200,200,200,0.5)";}
  switch (this.state) {
    case "empty":
      return "rgba(230,230,230,0.2)";
      break;
    case "green":
      return "rgba(0,255,0,0.5)";
      break;
    case "red":
      return "rgba(255,0,0,0.5)";
  }
};

Square.prototype.draw = function (ctx, size) {
  ctx.clearRect(
    this.topLeft(size).x + 2,
    this.topLeft(size).y + 2,
    size - 4,
    size - 4
  );

  ctx.fillStyle = this.color();

  ctx.fillRect(
    this.topLeft(size).x + 2,
    this.topLeft(size).y + 2,
    size - 4,
    size - 4
  );

  ctx.fillStyle = "#777";
  ctx.beginPath();
  ctx.arc(
    this.topLeft(Game.SQ_SIZE).x + Game.SQ_SIZE/2,
    this.topLeft(Game.SQ_SIZE).y + Game.SQ_SIZE/2,
    3,
    0, 2 * Math.PI,
    true
  );
  ctx.fill();

}

var game = new Game();

$("#game-canvas").click(function(event){
  var offset = $("#game-canvas").offset();
  var pos = {
    x: event.pageX - offset.left ,
    y: event.pageY - offset.top
  }

  var row = Math.floor(pos.y / Game.SQ_SIZE);
  var col =  Math.floor(pos.x / Game.SQ_SIZE);
  var coords = {row: row, col: col};

  game.addPeg(coords, game.toMove);
  game.toMove = (game.toMove === "red" ? "green" : "red");
  game.checkWin();
});


//----TESTING----

function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

var shuffled = [];

for (var i = 0; i < Game.BOARD_SIZE; i++) {
  for (var j = 0; j < Game.BOARD_SIZE; j++) {
    shuffled.push([i, j]);
  }
}

shuffle(shuffled);



//
for (var i = 0; i < shuffled.length*0.3; i++) {
  game.addPeg({row: shuffled[i][0], col: shuffled[i][1]}, ((Math.random() < 0.5) ? "red": "green"))
}
//
game.checkWin();
