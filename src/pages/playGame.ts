import { GlobalContext } from "../index";
import { startGame } from "../twixt";
import { User } from "../user";
import { UsernameList } from "../usernameList";
import { GameData } from "../twixt/gameData";

export function PlayGame(): void {
  setTimeout(() => {
      startGame(
        GlobalContext.dataStore,
        GlobalContext.currentUser.name,
        GlobalContext.gameId,
        () => GlobalContext.currentUser.completeGame(GlobalContext.gameInProgressKey)
      )
  }, 100)
}

