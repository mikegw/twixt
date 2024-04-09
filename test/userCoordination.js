"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_1 = require("../src/dataStore/firebase");
var user_1 = require("../src/user");
var chai_1 = require("chai");
var config_1 = require("./support/config");
describe('User Coordination', function () {
    var db = (0, firebase_1.dataStore)(config_1.config);
    beforeEach(function () { return db.clearEnvironment(); });
    describe('A user', function () {
        it('can invite another user to play', function () {
            var tim = new user_1.User({ name: 'Tim' }, db);
            var mike = new user_1.User({ name: 'Mike' }, db);
            var timInvited = new Promise(function (resolve) { return tim.onInviteReceived(resolve); });
            mike.invite({ name: 'Tim' });
            return timInvited.then(function (invite) {
                (0, chai_1.expect)(invite.name).to.eq('Mike');
            });
        });
        it('can accept an invitation to play', function () {
            var tim = new user_1.User({ name: 'Tim' }, db);
            var mike = new user_1.User({ name: 'Mike' }, db);
            var timInvited = new Promise(function (resolve) {
                tim.onInviteReceived(function (invite, key) { return resolve({ invite: invite, key: key }); });
            });
            var timAccepted = new Promise(function (resolve) {
                mike.onGameInProgress(function (gameInProgress, key) { return resolve({ gameInProgress: gameInProgress, key: key }); });
            });
            mike.invite({ name: 'Tim' });
            return timInvited
                .then(function (_a) {
                var invite = _a.invite, key = _a.key;
                return tim.acceptInvite(invite, key);
            })
                .then(function () { return timAccepted; })
                .then(function (_a) {
                var gameInProgress = _a.gameInProgress, key = _a.key;
                tim.completeGame(key);
                mike.completeGame(key);
                (0, chai_1.expect)(gameInProgress.opponent).to.eq('Tim');
                (0, chai_1.expect)(gameInProgress).to.haveOwnProperty('gameId');
            });
        });
    });
});
