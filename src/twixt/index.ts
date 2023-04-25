import { Game } from "./game";
import { GameData } from "./gameData";
import { GameUI } from "./gameUI";
import { DataStore } from "../dataStore";

export const startGame = (dataStore: DataStore, player: string, id?: string) => {
  const game = new Game()
  const gameData = new GameData(dataStore, id)
  const gameUI = new GameUI(game, gameData, player)

  gameUI.start();


  /*--- SILLY UI TESTING ---*/

  (<any>window).game = game

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
  // const delayMS = 5
  // for (let i = 0; i < shuffled.length*0.8; i++) {
  //   setTimeout(
  //     () => {
  //       if (game.winner) document.getElementById('game-status').innerText = 'GAME OVER'
  //       gameUI.moveMade({row: shuffled[i][0], column: shuffled[i][1]})
  //     },
  //     delayMS*i
  //   )
  // }
}
