"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("./util");
let balanceOutStack = [];
let lastOut = false;
let lastBalancedSelections = [];
function balanceOut() {
    balance(true);
}
exports.balanceOut = balanceOut;
function balanceIn() {
    balance(false);
}
exports.balanceIn = balanceIn;
function balance(out) {
    if (!util_1.validate(false) || !vscode.window.activeTextEditor) {
        return;
    }
    const editor = vscode.window.activeTextEditor;
    let rootNode = util_1.parseDocument(editor.document);
    if (!rootNode) {
        return;
    }
    let getRangeFunction = out ? getRangeToBalanceOut : getRangeToBalanceIn;
    let newSelections = [];
    editor.selections.forEach(selection => {
        let range = getRangeFunction(editor.document, selection, rootNode);
        newSelections.push(range);
    });
    if (areSameSelections(newSelections, editor.selections)) {
        return;
    }
    if (areSameSelections(lastBalancedSelections, editor.selections)) {
        if (out) {
            if (!balanceOutStack.length) {
                balanceOutStack.push(editor.selections);
            }
            balanceOutStack.push(newSelections);
        }
        else {
            if (lastOut) {
                balanceOutStack.pop();
            }
            newSelections = balanceOutStack.pop() || newSelections;
        }
    }
    else {
        balanceOutStack = out ? [editor.selections, newSelections] : [];
    }
    lastOut = out;
    lastBalancedSelections = editor.selections = newSelections;
}
function getRangeToBalanceOut(document, selection, rootNode) {
    let nodeToBalance = util_1.getHtmlNode(document, rootNode, selection.start, false);
    if (!nodeToBalance) {
        return selection;
    }
    if (!nodeToBalance.close) {
        return new vscode.Selection(nodeToBalance.start, nodeToBalance.end);
    }
    let innerSelection = new vscode.Selection(nodeToBalance.open.end, nodeToBalance.close.start);
    let outerSelection = new vscode.Selection(nodeToBalance.start, nodeToBalance.end);
    if (innerSelection.contains(selection) && !innerSelection.isEqual(selection)) {
        return innerSelection;
    }
    if (outerSelection.contains(selection) && !outerSelection.isEqual(selection)) {
        return outerSelection;
    }
    return selection;
}
function getRangeToBalanceIn(document, selection, rootNode) {
    let nodeToBalance = util_1.getHtmlNode(document, rootNode, selection.start, true);
    if (!nodeToBalance) {
        return selection;
    }
    if (selection.start.isEqual(nodeToBalance.start)
        && selection.end.isEqual(nodeToBalance.end)
        && nodeToBalance.close) {
        return new vscode.Selection(nodeToBalance.open.end, nodeToBalance.close.start);
    }
    if (!nodeToBalance.firstChild) {
        return selection;
    }
    if (selection.start.isEqual(nodeToBalance.firstChild.start)
        && selection.end.isEqual(nodeToBalance.firstChild.end)
        && nodeToBalance.firstChild.close) {
        return new vscode.Selection(nodeToBalance.firstChild.open.end, nodeToBalance.firstChild.close.start);
    }
    return new vscode.Selection(nodeToBalance.firstChild.start, nodeToBalance.firstChild.end);
}
function areSameSelections(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (!a[i].isEqual(b[i])) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/4e9361845dc28659923a300945f84731393e210d/extensions/emmet/out/balance.js.map
