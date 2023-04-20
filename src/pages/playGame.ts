import { GlobalContext } from "../index";
import { startGame } from "../twixt";

export function PlayGame(): void {
  setTimeout(() => {
      startGame(
        GlobalContext.dataStore,
        GlobalContext.currentUser.name,
        GlobalContext.gameId
      )
  }, 100)
}

