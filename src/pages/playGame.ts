import { GlobalContext } from "../index";
import { startGame } from "../twixt";
import { User } from "../user";
import { UsernameList } from "../usernameList";
import { GameData } from "../twixt/gameData";
import { Canvas } from "../twixt/gameUI/canvas";

export function PlayGame(): void {
  const canvas = new Canvas()
  canvas.clear()

  setTimeout(() => {
      startGame(
        GlobalContext.dataStore,
        GlobalContext.currentUser.name,
        GlobalContext.gameId,
        () => GlobalContext.currentUser.completeGame(GlobalContext.gameInProgressKey)
      )
  }, 100)
}

