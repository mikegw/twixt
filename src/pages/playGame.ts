import { GlobalContext } from "../index";
import { startGame } from "../twixt";
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
  }, 0)
}

