"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var localDataStore_1 = require("../src/dataStore/localDataStore");
describe('Data Storage', function () {
    it('can store data', function () {
        var dataStore = (0, localDataStore_1.newDataStore)();
        dataStore.write('games', 'some data');
        dataStore.read('games', function (data, key) {
            (0, chai_1.expect)(data).to.eq('some data');
        });
    });
    it('can store nested data', function () {
        var dataStore = (0, localDataStore_1.newDataStore)();
        dataStore.write('games', 'a game');
        dataStore.write('games/1/moves/1', 'a move');
        dataStore.read('games', function (data, key) {
            (0, chai_1.expect)(data).to.eq('a game');
        });
        dataStore.read('games/1/moves/1', function (data, key) {
            (0, chai_1.expect)(data).to.eq('a move');
        });
    });
    describe('stored data', function () {
        it('can be changed', function () {
            var dataStore = (0, localDataStore_1.newDataStore)();
            dataStore.write('games', 'a game');
            dataStore.write('games', 'another game');
            dataStore.read('games', function (data, key) {
                (0, chai_1.expect)(data).to.eq('another game');
            });
        });
        it('can be appended to existing data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataStore, _a, data, key;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dataStore = (0, localDataStore_1.newDataStore)();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                dataStore.onChildAdded('game/moves', function (data, key) {
                                    console.log(data, key);
                                    resolve({ data: data, key: key });
                                });
                                dataStore.append('game/moves', 'a move');
                            })];
                    case 1:
                        _a = _b.sent(), data = _a.data, key = _a.key;
                        (0, chai_1.expect)(data).to.eq('a move');
                        (0, chai_1.expect)(typeof key).to.eq('string');
                        return [2 /*return*/];
                }
            });
        }); });
        it('can be removed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataStore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dataStore = (0, localDataStore_1.newDataStore)();
                        dataStore.write('game', 'stuff');
                        return [4 /*yield*/, dataStore.destroy('game')];
                    case 1:
                        _a.sent();
                        dataStore.read('games', function (data, key) {
                            (0, chai_1.expect)(data).to.be.null;
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when a child is added', function () {
        it('notifies each subscriber', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataStore, triggerAfterNCalls, _a, data, key;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dataStore = (0, localDataStore_1.newDataStore)();
                        triggerAfterNCalls = function (n, callback) {
                            var counter = 0;
                            return function (data, key) {
                                counter += 1;
                                if (counter >= n)
                                    callback({ data: data, key: key });
                            };
                        };
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var maybeResolve = triggerAfterNCalls(2, resolve);
                                dataStore.onChildAdded('game/moves', maybeResolve);
                                dataStore.onChildAdded('game/moves', maybeResolve);
                                dataStore.append('game/moves', 'a move');
                            })];
                    case 1:
                        _a = _b.sent(), data = _a.data, key = _a.key;
                        (0, chai_1.expect)(data).to.eq('a move');
                        (0, chai_1.expect)(typeof key).to.eq('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
