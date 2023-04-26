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
        GlobalContext.gameId
      )
  }, 100)

  const backButton = document.getElementById('back-to-join-or-start')
  backButton.addEventListener('click', (e) => {
    GlobalContext.currentUser.completeGame(GlobalContext.gameInProgressKey)
  })
}

