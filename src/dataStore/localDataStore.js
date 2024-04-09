"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newDataStore = void 0;
var generateId_1 = require("../generateId");
var node_1 = require("./localDataStore/node");
var deleteItem = function (obj, key) {
    obj[key] = undefined;
};
var newDataStore = function () {
    var storageTree = (0, node_1.buildNode)();
    var getBranch = function (path, create) {
        if (create === void 0) { create = false; }
        var nodePath = path.split('/');
        var node = storageTree;
        var branch = [{ fragment: '', node: node, created: false }];
        for (var _i = 0, nodePath_1 = nodePath; _i < nodePath_1.length; _i++) {
            var fragment = nodePath_1[_i];
            var nextNode = node.children[fragment];
            if (nextNode) {
                branch.push({ fragment: fragment, node: nextNode, created: false });
            }
            else {
                if (!create)
                    return null;
                var newNode = (0, node_1.buildNode)();
                node.children[fragment] = newNode;
                branch.push({ fragment: fragment, node: newNode, created: true });
            }
        }
        return branch;
    };
    var read = function (path, callback) {
        var branch = getBranch(path);
        if (!branch)
            return callback(null, null);
        var node = branch.pop().node;
        callback(node.data, node.key);
    };
    var write = function (path, data) {
        var branch = getBranch(path, true);
        branch[branch.length - 1].node.data = data;
        var firstNewNodeIndex = branch.findIndex(function (nodeWithCreated) { return nodeWithCreated.created; });
        if (firstNewNodeIndex < 0)
            return;
        var newNode = branch[firstNewNodeIndex].node;
        var lastExistingNode = branch[firstNewNodeIndex - 1].node;
        var childAddedCallbacks = lastExistingNode.callbacksOfType('childAdded');
        for (var _i = 0, childAddedCallbacks_1 = childAddedCallbacks; _i < childAddedCallbacks_1.length; _i++) {
            var callback = childAddedCallbacks_1[_i];
            callback(newNode.data, newNode.key);
        }
    };
    var append = function (path, data) {
        write("".concat(path, "/").concat((0, generateId_1.generateId)()), data);
    };
    var destroy = function (path) {
        var branch = getBranch(path);
        if (branch) {
            var _a = branch.slice(-2), parent_1 = _a[0], child = _a[1];
            deleteItem(parent_1.node.children, child.fragment);
        }
        return new Promise(function (resolve) { return resolve(); });
    };
    var onCallback = function (type) {
        return function (path, callback) {
            var branch = getBranch(path, true);
            var node = branch.pop().node;
            var callbackId = (0, generateId_1.generateId)();
            node.callbacks[callbackId] = { type: type, callback: callback };
            return function () { return deleteItem(node.callbacks, callbackId); };
        };
    };
    return {
        read: read,
        write: write,
        append: append,
        destroy: destroy,
        onChildAdded: onCallback('childAdded'),
        onChildChanged: onCallback('childChanged'),
        onChildRemoved: onCallback('childRemoved')
    };
};
exports.newDataStore = newDataStore;
