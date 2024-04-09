"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRow = void 0;
var index_1 = require("../index");
var page_1 = require("../page");
var playerRowTemplate = document.querySelector('#player-row');
var UserRow = /** @class */ (function () {
    function UserRow(options) {
        var _this = this;
        this.element = playerRowTemplate.content.firstElementChild.cloneNode(true);
        this.element.setAttribute('player-name', options.name);
        this.element.id = "player-".concat(options.name);
        this.element.querySelector('.friend-name').textContent = options.name;
        this.inviteButton = this.element.querySelector('.invite-friend');
        this.invitePendingButton = this.element.querySelector('.invite-pending');
        this.playGameButton = this.element.querySelector('.play-game');
        this.inviteButton.addEventListener('click', function (e) {
            e.preventDefault();
            options.onInvite();
            _this.invitePendingButton.disabled = true;
            _this.element.setAttribute('invite', 'pending');
        });
        this.invitePendingButton.addEventListener('click', function (e) {
            e.preventDefault();
            var inviteKey = _this.element.getAttribute('invite-key');
            options.onAcceptInvite(inviteKey);
            _this.element.removeAttribute('invite-key');
        });
        this.playGameButton.addEventListener('click', function (e) {
            e.preventDefault();
            console.log("Loading game with ".concat(options.name, " (as ").concat(index_1.GlobalContext.currentUser.name, ")"));
            index_1.GlobalContext.gameId = _this.element.attributes.getNamedItem('game-id').value;
            index_1.GlobalContext.gameInProgressKey = _this.element.attributes.getNamedItem('game-in-progress-key').value;
            (0, page_1.navigateTo)(page_1.Pages.PlayGame);
        });
    }
    return UserRow;
}());
exports.UserRow = UserRow;
