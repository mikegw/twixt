import { Game } from "./game";
import { Renderer } from "./renderer";

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement

const game = new Game()

const renderer = new Renderer(
  canvas,
  canvas.getContext('2d'),
  game.board
)

const boardImageSize = Math.min(canvas.width, canvas.height)
const slotGapSize = boardImageSize / game.board.size

const render = () => {
  window.requestAnimationFrame(() => renderer.draw())
}
const getCursorPosition = (event: MouseEvent) => {
  const rect = canvas.getBoundingClientRect()
  return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
  }
}

canvas.addEventListener("click", (event) => {
  const cursorPosition = getCursorPosition(event)
  const positionClicked = {
    row: Math.floor(cursorPosition.y / slotGapSize),
    column:  Math.floor(cursorPosition.x / slotGapSize)
  };

  game.placePeg(positionClicked)
  render()
})

render();


/*--- TESTING ---*/

(<any>window).game = game

function shuffle(o: any[]){ //v1.0
  for(let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

let shuffled: any[] = [];

for (let i = 0; i < game.board.size; i++) {
  for (let j = 0; j < game.board.size; j++) {
    shuffled.push([i, j]);
  }
}

shuffle(shuffled);
const delayMS = 50
for (let i = 0; i < shuffled.length*0.8; i++) {
  setTimeout(
    () =>  {
        game.placePeg({row: shuffled[i][0], column: shuffled[i][1]})
        render()
    },
    delayMS*i
  )
}

render()
