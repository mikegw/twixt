"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataStore = void 0;
var app_1 = require("firebase/app");
var database_1 = require("firebase/database");
var environment = 'local';
var newDataStore = function (environment, db) {
    var reference = function (path) {
        return (0, database_1.ref)(db, [environment, path].join('/'));
    };
    var read = function (path, callback) {
        (0, database_1.get)(reference(path)).then(function (snapshot) { return callback(snapshot.val(), snapshot.key); });
    };
    var write = function (path, data) {
        (0, database_1.set)(reference(path), data);
    };
    var append = function (path, data) {
        (0, database_1.push)(reference(path), data).catch(function (reason) { return console.log(reason); });
    };
    var childAdded = function (path, callback) {
        return (0, database_1.onChildAdded)(reference(path), function (snapshot) {
            callback(snapshot.val(), snapshot.key);
        });
    };
    var childChanged = function (path, callback) {
        return (0, database_1.onChildChanged)(reference(path), function (snapshot) { return callback(snapshot.val(), snapshot.key); });
    };
    var childRemoved = function (path, callback) {
        return (0, database_1.onChildRemoved)(reference(path), function (snapshot) { return callback(snapshot.key, snapshot.val()); });
    };
    var destroy = function (path) {
        return (0, database_1.remove)(reference(path));
    };
    return {
        read: read,
        write: write,
        append: append,
        destroy: destroy,
        onChildAdded: childAdded,
        onChildChanged: childChanged,
        onChildRemoved: childRemoved
    };
};
var newSandboxDataStore = function (environmentName, db) {
    var clearEnvironment = function () {
        return (0, database_1.remove)((0, database_1.ref)(db, environmentName));
    };
    return __assign(__assign({}, newDataStore(environmentName, db)), { clearEnvironment: clearEnvironment });
};
var dataStore = function (config) {
    environment = config.environment;
    var app = (0, app_1.initializeApp)(config.firebaseConfig, environment);
    var db = (0, database_1.getDatabase)(app);
    switch (environment) {
        case 'test':
        case 'e2e':
            return newSandboxDataStore('test', db);
        case 'production':
            return newDataStore('production', db);
        default:
            return newSandboxDataStore('local', db);
    }
};
exports.dataStore = dataStore;
