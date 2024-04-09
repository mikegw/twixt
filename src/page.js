"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPages = exports.navigateTo = exports.Pages = void 0;
var index_1 = require("./index");
var getStarted_1 = require("./pages/getStarted");
var mainMenu_1 = require("./pages/mainMenu");
var joinOrStart_1 = require("./pages/joinOrStart");
var playGame_1 = require("./pages/playGame");
var isNavigationButton = function (button) { return "nextPage" in button; };
var pageNames = ['GetStarted', 'MainMenu', 'JoinOrStart', 'PlayGame'];
exports.Pages = {
    GetStarted: {
        id: 'get-started',
        navigation: [],
        setup: getStarted_1.GetStarted
    },
    MainMenu: {
        id: 'main-menu',
        navigation: [
            { id: 'play', nextPage: 'JoinOrStart' }
        ],
        setup: mainMenu_1.MainMenu
    },
    JoinOrStart: {
        id: 'join-or-start-game',
        navigation: [
            { id: 'back-to-main-menu', nextPage: 'MainMenu' }
        ],
        setup: joinOrStart_1.JoinOrStart
    },
    PlayGame: {
        id: 'play-game',
        navigation: [
            { id: 'back-to-join-or-start', nextPage: 'JoinOrStart' }
        ],
        setup: playGame_1.PlayGame
    }
};
var navigateTo = function (page) {
    for (var _i = 0, _a = Object.values(exports.Pages); _i < _a.length; _i++) {
        var otherPage = _a[_i];
        (0, index_1.hide)(otherPage);
    }
    index_1.GlobalContext.currentPage = page;
    page.setup();
    (0, index_1.display)(page);
};
exports.navigateTo = navigateTo;
var addNavigation = function (button) {
    var nextPage = exports.Pages[button.nextPage];
    var buttonHTMLElement = document.getElementById(button.id);
    buttonHTMLElement.addEventListener('click', function (e) {
        e.preventDefault();
        (0, exports.navigateTo)(nextPage);
    });
};
var setupPages = function () {
    for (var _i = 0, _a = Object.values(exports.Pages); _i < _a.length; _i++) {
        var page = _a[_i];
        var navigationButtons = page.navigation.filter(isNavigationButton);
        for (var _b = 0, navigationButtons_1 = navigationButtons; _b < navigationButtons_1.length; _b++) {
            var button = navigationButtons_1[_b];
            addNavigation(button);
        }
    }
};
exports.setupPages = setupPages;
