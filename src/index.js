"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.GlobalContext = exports.hide = exports.display = void 0;
var page_1 = require("./page");
var user_1 = require("./user");
var firebase_1 = require("./dataStore/firebase");
var usernameList_1 = require("./usernameList");
var localDataStore_1 = require("./dataStore/localDataStore");
var coin_1 = require("./coin");
// @ts-ignore
var config = CONFIG;
function isHTMLElement(element) {
    return "innerHTML" in element;
}
var display = function (element) {
    var htmlElement = isHTMLElement(element) ? element : document.getElementById(element.id);
    htmlElement.classList.remove('hidden');
};
exports.display = display;
var hide = function (element) {
    var htmlElement = isHTMLElement(element) ? element : document.getElementById(element.id);
    htmlElement.classList.add('hidden');
};
exports.hide = hide;
exports.GlobalContext = {
    currentPage: page_1.Pages.GetStarted,
    currentUser: null,
    gameId: null,
    gameInProgressKey: null,
    dataStore: (0, firebase_1.dataStore)(config)
};
var USERNAME_STORAGE_KEY = 'twixt-username';
var logoutButton = document.querySelector('.log-out-button');
logoutButton.addEventListener('click', function () {
    exports.GlobalContext.currentUser.unsubscribe();
    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    window.location.reload();
});
var loginUser = function (name) {
    console.log('Logging in ', name);
    window.localStorage.setItem(USERNAME_STORAGE_KEY, name);
    exports.GlobalContext.currentUser = new user_1.User({ name: name }, exports.GlobalContext.dataStore);
    var usernames = new usernameList_1.UsernameList(exports.GlobalContext.dataStore);
    usernames.addUser(name);
    (0, exports.display)(logoutButton);
};
exports.loginUser = loginUser;
(0, page_1.setupPages)();
var username = window.localStorage.getItem(USERNAME_STORAGE_KEY);
if (username != null) {
    console.log(username, "logged in");
    (0, exports.loginUser)(username);
    (0, page_1.navigateTo)(page_1.Pages.MainMenu);
}
else {
    (0, page_1.navigateTo)(page_1.Pages.GetStarted);
}
window.newDataStore = (0, localDataStore_1.newDataStore)();
if (config.environment == 'e2e')
    coin_1.Coin.bias = 'HEADS';
