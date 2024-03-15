import { GlobalContext } from "../index";
import { navigateTo, Pages } from "../page";

type UserRowOptions = {
  name: string,
  onInvite: () => void,
  onAcceptInvite: (key: string) => void,
}

const playerRowTemplate: HTMLTemplateElement = document.querySelector('#player-row')

export class UserRow {
  element = playerRowTemplate.content.firstElementChild.cloneNode(true) as HTMLLIElement
  inviteButton: HTMLButtonElement
  invitePendingButton: HTMLButtonElement
  playGameButton: HTMLButtonElement
  constructor(options: UserRowOptions) {
    this.element.setAttribute('player-name', options.name)
    this.element.id = `player-${options.name}`
    this.element.querySelector('.friend-name').textContent = options.name

    this.inviteButton = this.element.querySelector('.invite-friend')
    this.invitePendingButton = this.element.querySelector('.invite-pending')
    this.playGameButton = this.element.querySelector('.play-game')

    this.inviteButton.addEventListener('click', (e) => {
      e.preventDefault()
      options.onInvite()
      this.invitePendingButton.disabled = true
      this.element.setAttribute('invite', 'pending')
    })

    this.invitePendingButton.addEventListener('click', (e) => {
      e.preventDefault()
      const inviteKey = this.element.getAttribute('invite-key')
      options.onAcceptInvite(inviteKey)
      this.element.removeAttribute('invite-key')
    })

    this.playGameButton.addEventListener('click', (e) => {
      e.preventDefault()
      console.log(`Loading game with ${options.name} (as ${GlobalContext.currentUser.name})`)

      GlobalContext.gameId = this.element.attributes.getNamedItem('game-id').value
      GlobalContext.gameInProgressKey = this.element.attributes.getNamedItem('game-in-progress-key').value

      navigateTo(Pages.PlayGame)
    })
  }
}
