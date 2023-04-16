import { GameUI } from "./gameUI";
import { Game } from "./game";
import { GameData } from "./gameData";

const gameIdSpan = document.getElementById('game-id-span')
const gameIdCopyButton = document.getElementById('game-id-copy')
const gameIdInfo = document.getElementById('game-id-info')
const gameStart = document.getElementById('game-start')
const gameIdInput = document.getElementById('game-id-input') as HTMLInputElement
const joinButton = document.getElementById('join-button')
const startButton = document.getElementById('start-button');

const startGame = (id: string = null) => {
  const game = new Game()
  const gameData = new GameData(id)
  const gameEngine = new GameUI(game, gameData)

  gameIdSpan.innerText = gameData.gameId
  gameIdCopyButton.onclick = () => navigator.clipboard.writeText(gameData.gameId)

  gameStart.style.display = 'none'
  gameIdInfo.style.display = 'flex'

  gameEngine.start()
}

startButton.onclick = (e) => {
  e.preventDefault()
  startGame()
}

joinButton.onclick = (e) => {
  e.preventDefault()
  const gameId = gameIdInput.value
  startGame(gameId)
}

const query = new URLSearchParams(window.location.search);
if (query.has('gameId')) {
  startGame(query.get('gameId'))
} else {
  gameStart.style.display = 'flex';
}









/*--- TESTING ---*/
//
// (<any>window).game = game
//
// function shuffle(o: any[]){ //v1.0
//   for(let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//   return o;
// }
//
// let shuffled: any[] = [];
//
// for (let i = 0; i < game.board.size; i++) {
//   for (let j = 0; j < game.board.size; j++) {
//     shuffled.push([i, j]);
//   }
// }
//
// shuffle(shuffled);
// const delayMS = 50
// for (let i = 0; i < shuffled.length*0.8; i++) {
//   setTimeout(
//     () =>  {
//         game.placePeg({row: shuffled[i][0], column: shuffled[i][1]})
//         render()
//     },
//     delayMS*i
//   )
// }
//
// render()
