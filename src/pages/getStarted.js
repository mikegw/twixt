"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStarted = void 0;
var index_1 = require("../index");
var page_1 = require("../page");
function GetStarted() {
    var getStartedForm = document.querySelector('#get-started');
    var usernameInput = document.querySelector('input[name="username"]');
    getStartedForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var username = usernameInput.value;
        (0, index_1.loginUser)(username);
        (0, page_1.navigateTo)(page_1.Pages.MainMenu);
        usernameInput.value = "";
    });
}
exports.GetStarted = GetStarted;
