"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const html_matcher_1 = require("@emmetio/html-matcher");
const css_parser_1 = require("@emmetio/css-parser");
const bufferStream_1 = require("./bufferStream");
let _emmetHelper;
let _currentExtensionsPath = undefined;
function getEmmetHelper() {
    if (!_emmetHelper) {
        _emmetHelper = require('vscode-emmet-helper');
    }
    resolveUpdateExtensionsPath();
    return _emmetHelper;
}
exports.getEmmetHelper = getEmmetHelper;
function resolveUpdateExtensionsPath() {
    if (!_emmetHelper) {
        return;
    }
    let extensionsPath = vscode.workspace.getConfiguration('emmet')['extensionsPath'];
    if (_currentExtensionsPath !== extensionsPath) {
        _currentExtensionsPath = extensionsPath;
        _emmetHelper.updateExtensionsPath(extensionsPath, vscode.workspace.rootPath).then(null, (err) => vscode.window.showErrorMessage(err));
    }
}
exports.resolveUpdateExtensionsPath = resolveUpdateExtensionsPath;
exports.LANGUAGE_MODES = {
    'html': ['!', '.', '}', ':', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'jade': ['!', '.', '}', ':', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'slim': ['!', '.', '}', ':', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'haml': ['!', '.', '}', ':', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'xml': ['.', '}', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'xsl': ['!', '.', '}', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'css': [':', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'scss': [':', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'sass': [':', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'less': [':', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'stylus': [':', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'javascriptreact': ['!', '.', '}', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'typescriptreact': ['!', '.', '}', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
};
const allowedMimeTypesInScriptTag = ['text/html', 'text/plain', 'text/x-template', 'text/template', 'text/ng-template'];
const emmetModes = ['html', 'pug', 'slim', 'haml', 'xml', 'xsl', 'jsx', 'css', 'scss', 'sass', 'less', 'stylus'];
// Explicitly map languages that have built-in grammar in VS Code to their parent language
// to get emmet completion support
// For other languages, users will have to use `emmet.includeLanguages` or
// language specific extensions can provide emmet completion support
exports.MAPPED_MODES = {
    'handlebars': 'html',
    'php': 'html'
};
function isStyleSheet(syntax) {
    let stylesheetSyntaxes = ['css', 'scss', 'sass', 'less', 'stylus'];
    return (stylesheetSyntaxes.indexOf(syntax) > -1);
}
exports.isStyleSheet = isStyleSheet;
function validate(allowStylesheet = true) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active');
        return false;
    }
    if (!allowStylesheet && isStyleSheet(editor.document.languageId)) {
        return false;
    }
    return true;
}
exports.validate = validate;
function getMappingForIncludedLanguages() {
    const finalMappedModes = Object.create(null);
    let includeLanguagesConfig = vscode.workspace.getConfiguration('emmet')['includeLanguages'];
    let includeLanguages = Object.assign({}, exports.MAPPED_MODES, includeLanguagesConfig ? includeLanguagesConfig : {});
    Object.keys(includeLanguages).forEach(syntax => {
        if (typeof includeLanguages[syntax] === 'string' && exports.LANGUAGE_MODES[includeLanguages[syntax]]) {
            finalMappedModes[syntax] = includeLanguages[syntax];
        }
    });
    return finalMappedModes;
}
exports.getMappingForIncludedLanguages = getMappingForIncludedLanguages;
/**
* Get the corresponding emmet mode for given vscode language mode
* Eg: jsx for typescriptreact/javascriptreact or pug for jade
* If the language is not supported by emmet or has been exlcuded via `exlcudeLanguages` setting,
* then nothing is returned
*
* @param language
* @param exlcudedLanguages Array of language ids that user has chosen to exlcude for emmet
*/
function getEmmetMode(language, excludedLanguages) {
    if (!language || excludedLanguages.indexOf(language) > -1) {
        return;
    }
    if (/\b(typescriptreact|javascriptreact|jsx-tags)\b/.test(language)) { // treat tsx like jsx
        return 'jsx';
    }
    if (language === 'sass-indented') { // map sass-indented to sass
        return 'sass';
    }
    if (language === 'jade') {
        return 'pug';
    }
    if (emmetModes.indexOf(language) > -1) {
        return language;
    }
}
exports.getEmmetMode = getEmmetMode;
/**
 * Parses the given document using emmet parsing modules
 */
function parseDocument(document, showError = true) {
    let parseContent = isStyleSheet(document.languageId) ? css_parser_1.default : html_matcher_1.default;
    try {
        return parseContent(new bufferStream_1.DocumentStreamReader(document));
    }
    catch (e) {
        if (showError) {
            vscode.window.showErrorMessage('Emmet: Failed to parse the file');
        }
    }
    return undefined;
}
exports.parseDocument = parseDocument;
const closeBrace = 125;
const openBrace = 123;
const slash = 47;
const star = 42;
function parsePartialStylesheet(document, position) {
    const isCSS = document.languageId === 'css';
    let startPosition = new vscode.Position(0, 0);
    let endPosition = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
    const limitCharacter = document.offsetAt(position) - 5000;
    const limitPosition = limitCharacter > 0 ? document.positionAt(limitCharacter) : startPosition;
    const stream = new bufferStream_1.DocumentStreamReader(document, position);
    function consumeLineCommentBackwards() {
        if (!isCSS && currentLine !== stream.pos.line) {
            currentLine = stream.pos.line;
            let startLineComment = document.lineAt(currentLine).text.indexOf('//');
            if (startLineComment > -1) {
                stream.pos = new vscode.Position(currentLine, startLineComment);
            }
        }
    }
    function consumeBlockCommentBackwards() {
        if (stream.peek() === slash) {
            if (stream.backUp(1) === star) {
                stream.pos = findOpeningCommentBeforePosition(document, stream.pos) || startPosition;
            }
            else {
                stream.next();
            }
        }
    }
    function consumeCommentForwards() {
        if (stream.eat(slash)) {
            if (stream.eat(slash) && !isCSS) {
                stream.pos = new vscode.Position(stream.pos.line + 1, 0);
            }
            else if (stream.eat(star)) {
                stream.pos = findClosingCommentAfterPosition(document, stream.pos) || endPosition;
            }
        }
    }
    // Go forward until we find a closing brace.
    while (!stream.eof() && !stream.eat(closeBrace)) {
        if (stream.peek() === slash) {
            consumeCommentForwards();
        }
        else {
            stream.next();
        }
    }
    if (!stream.eof()) {
        endPosition = stream.pos;
    }
    stream.pos = position;
    let openBracesToFind = 1;
    let currentLine = position.line;
    let exit = false;
    // Go back until we found an opening brace. If we find a closing one, consume its pair and continue.
    while (!exit && openBracesToFind > 0 && !stream.sof()) {
        consumeLineCommentBackwards();
        switch (stream.backUp(1)) {
            case openBrace:
                openBracesToFind--;
                break;
            case closeBrace:
                if (isCSS) {
                    stream.next();
                    startPosition = stream.pos;
                    exit = true;
                }
                else {
                    openBracesToFind++;
                }
                break;
            case slash:
                consumeBlockCommentBackwards();
                break;
            default:
                break;
        }
        if (position.line - stream.pos.line > 100 || stream.pos.isBeforeOrEqual(limitPosition)) {
            exit = true;
        }
    }
    // We are at an opening brace. We need to include its selector.
    currentLine = stream.pos.line;
    openBracesToFind = 0;
    let foundSelector = false;
    while (!exit && !stream.sof() && !foundSelector && openBracesToFind >= 0) {
        consumeLineCommentBackwards();
        const ch = stream.backUp(1);
        if (/\s/.test(String.fromCharCode(ch))) {
            continue;
        }
        switch (ch) {
            case slash:
                consumeBlockCommentBackwards();
                break;
            case closeBrace:
                openBracesToFind++;
                break;
            case openBrace:
                openBracesToFind--;
                break;
            default:
                if (!openBracesToFind) {
                    foundSelector = true;
                }
                break;
        }
        if (!stream.sof() && foundSelector) {
            startPosition = stream.pos;
        }
    }
    try {
        return css_parser_1.default(new bufferStream_1.DocumentStreamReader(document, startPosition, new vscode.Range(startPosition, endPosition)));
    }
    catch (e) {
    }
}
exports.parsePartialStylesheet = parsePartialStylesheet;
function findOpeningCommentBeforePosition(document, position) {
    let text = document.getText(new vscode.Range(0, 0, position.line, position.character));
    let offset = text.lastIndexOf('/*');
    if (offset === -1) {
        return;
    }
    return document.positionAt(offset);
}
function findClosingCommentAfterPosition(document, position) {
    let text = document.getText(new vscode.Range(position.line, position.character, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length));
    let offset = text.indexOf('*/');
    if (offset === -1) {
        return;
    }
    offset += 2 + document.offsetAt(position);
    return document.positionAt(offset);
}
/**
 * Returns node corresponding to given position in the given root node
 */
function getNode(root, position, includeNodeBoundary) {
    if (!root) {
        return null;
    }
    let currentNode = root.firstChild;
    let foundNode = null;
    while (currentNode) {
        const nodeStart = currentNode.start;
        const nodeEnd = currentNode.end;
        if ((nodeStart.isBefore(position) && nodeEnd.isAfter(position))
            || (includeNodeBoundary && (nodeStart.isBeforeOrEqual(position) && nodeEnd.isAfterOrEqual(position)))) {
            foundNode = currentNode;
            // Dig deeper
            currentNode = currentNode.firstChild;
        }
        else {
            currentNode = currentNode.nextSibling;
        }
    }
    return foundNode;
}
exports.getNode = getNode;
function getHtmlNode(document, root, position, includeNodeBoundary) {
    let currentNode = getNode(root, position, includeNodeBoundary);
    if (!currentNode) {
        return;
    }
    if (isTemplateScript(currentNode) && currentNode.close &&
        (position.isAfter(currentNode.open.end) && position.isBefore(currentNode.close.start))) {
        let buffer = new bufferStream_1.DocumentStreamReader(document, currentNode.open.end, new vscode.Range(currentNode.open.end, currentNode.close.start));
        try {
            let scriptInnerNodes = html_matcher_1.default(buffer);
            currentNode = getNode(scriptInnerNodes, position, includeNodeBoundary) || currentNode;
        }
        catch (e) { }
    }
    return currentNode;
}
exports.getHtmlNode = getHtmlNode;
/**
 * Returns inner range of an html node.
 * @param currentNode
 */
function getInnerRange(currentNode) {
    if (!currentNode.close) {
        return undefined;
    }
    return new vscode.Range(currentNode.open.end, currentNode.close.start);
}
exports.getInnerRange = getInnerRange;
function getDeepestNode(node) {
    if (!node || !node.children || node.children.length === 0 || !node.children.find(x => x.type !== 'comment')) {
        return node;
    }
    for (let i = node.children.length - 1; i >= 0; i--) {
        if (node.children[i].type !== 'comment') {
            return getDeepestNode(node.children[i]);
        }
    }
    return undefined;
}
exports.getDeepestNode = getDeepestNode;
function findNextWord(propertyValue, pos) {
    let foundSpace = pos === -1;
    let foundStart = false;
    let foundEnd = false;
    let newSelectionStart;
    let newSelectionEnd;
    while (pos < propertyValue.length - 1) {
        pos++;
        if (!foundSpace) {
            if (propertyValue[pos] === ' ') {
                foundSpace = true;
            }
            continue;
        }
        if (foundSpace && !foundStart && propertyValue[pos] === ' ') {
            continue;
        }
        if (!foundStart) {
            newSelectionStart = pos;
            foundStart = true;
            continue;
        }
        if (propertyValue[pos] === ' ') {
            newSelectionEnd = pos;
            foundEnd = true;
            break;
        }
    }
    if (foundStart && !foundEnd) {
        newSelectionEnd = propertyValue.length;
    }
    return [newSelectionStart, newSelectionEnd];
}
exports.findNextWord = findNextWord;
function findPrevWord(propertyValue, pos) {
    let foundSpace = pos === propertyValue.length;
    let foundStart = false;
    let foundEnd = false;
    let newSelectionStart;
    let newSelectionEnd;
    while (pos > -1) {
        pos--;
        if (!foundSpace) {
            if (propertyValue[pos] === ' ') {
                foundSpace = true;
            }
            continue;
        }
        if (foundSpace && !foundEnd && propertyValue[pos] === ' ') {
            continue;
        }
        if (!foundEnd) {
            newSelectionEnd = pos + 1;
            foundEnd = true;
            continue;
        }
        if (propertyValue[pos] === ' ') {
            newSelectionStart = pos + 1;
            foundStart = true;
            break;
        }
    }
    if (foundEnd && !foundStart) {
        newSelectionStart = 0;
    }
    return [newSelectionStart, newSelectionEnd];
}
exports.findPrevWord = findPrevWord;
function getNodesInBetween(node1, node2) {
    // Same node
    if (sameNodes(node1, node2)) {
        return [node1];
    }
    // Same parent
    if (sameNodes(node1.parent, node2.parent)) {
        return getNextSiblingsTillPosition(node1, node2.end);
    }
    // node2 is ancestor of node1
    if (node2.start.isBefore(node1.start)) {
        return [node2];
    }
    // node1 is ancestor of node2
    if (node2.start.isBefore(node1.end)) {
        return [node1];
    }
    // Get the highest ancestor of node1 that should be commented
    while (node1.parent && node1.parent.end.isBefore(node2.start)) {
        node1 = node1.parent;
    }
    // Get the highest ancestor of node2 that should be commented
    while (node2.parent && node2.parent.start.isAfter(node1.start)) {
        node2 = node2.parent;
    }
    return getNextSiblingsTillPosition(node1, node2.end);
}
exports.getNodesInBetween = getNodesInBetween;
function getNextSiblingsTillPosition(node, position) {
    let siblings = [];
    let currentNode = node;
    while (currentNode && position.isAfter(currentNode.start)) {
        siblings.push(currentNode);
        currentNode = currentNode.nextSibling;
    }
    return siblings;
}
function sameNodes(node1, node2) {
    if (!node1 || !node2) {
        return false;
    }
    return node1.start.isEqual(node2.start) && node1.end.isEqual(node2.end);
}
exports.sameNodes = sameNodes;
function getEmmetConfiguration(syntax) {
    const emmetConfig = vscode.workspace.getConfiguration('emmet');
    const syntaxProfiles = Object.assign({}, emmetConfig['syntaxProfiles'] || {});
    const preferences = Object.assign({}, emmetConfig['preferences'] || {});
    // jsx, xml and xsl syntaxes need to have self closing tags unless otherwise configured by user
    if (syntax === 'jsx' || syntax === 'xml' || syntax === 'xsl') {
        syntaxProfiles[syntax] = syntaxProfiles[syntax] || {};
        if (typeof syntaxProfiles[syntax] === 'object'
            && !syntaxProfiles[syntax].hasOwnProperty('self_closing_tag') // Old Emmet format
            && !syntaxProfiles[syntax].hasOwnProperty('selfClosingStyle') // Emmet 2.0 format
        ) {
            syntaxProfiles[syntax] = Object.assign({}, syntaxProfiles[syntax], { selfClosingStyle: 'xml' });
        }
    }
    return {
        preferences,
        showExpandedAbbreviation: emmetConfig['showExpandedAbbreviation'],
        showAbbreviationSuggestions: emmetConfig['showAbbreviationSuggestions'],
        syntaxProfiles,
        variables: emmetConfig['variables'],
        excludeLanguages: emmetConfig['excludeLanguages'],
        showSuggestionsAsSnippets: emmetConfig['showSuggestionsAsSnippets']
    };
}
exports.getEmmetConfiguration = getEmmetConfiguration;
/**
 * Itereates by each child, as well as nested child's children, in their order
 * and invokes `fn` for each. If `fn` function returns `false`, iteration stops
 */
function iterateCSSToken(token, fn) {
    for (let i = 0, il = token.size; i < il; i++) {
        if (fn(token.item(i)) === false || iterateCSSToken(token.item(i), fn) === false) {
            return false;
        }
    }
}
exports.iterateCSSToken = iterateCSSToken;
/**
 * Returns `name` CSS property from given `rule`
 */
function getCssPropertyFromRule(rule, name) {
    return rule.children.find(node => node.type === 'property' && node.name === name);
}
exports.getCssPropertyFromRule = getCssPropertyFromRule;
/**
 * Returns css property under caret in given editor or `null` if such node cannot
 * be found
 */
function getCssPropertyFromDocument(editor, position) {
    const rootNode = parseDocument(editor.document);
    const node = getNode(rootNode, position, true);
    if (isStyleSheet(editor.document.languageId)) {
        return node && node.type === 'property' ? node : null;
    }
    let htmlNode = node;
    if (htmlNode
        && htmlNode.name === 'style'
        && htmlNode.open.end.isBefore(position)
        && htmlNode.close.start.isAfter(position)) {
        let buffer = new bufferStream_1.DocumentStreamReader(editor.document, htmlNode.start, new vscode.Range(htmlNode.start, htmlNode.end));
        let rootNode = css_parser_1.default(buffer);
        const node = getNode(rootNode, position, true);
        return (node && node.type === 'property') ? node : null;
    }
}
exports.getCssPropertyFromDocument = getCssPropertyFromDocument;
function getEmbeddedCssNodeIfAny(document, currentNode, position) {
    if (!currentNode) {
        return;
    }
    const currentHtmlNode = currentNode;
    if (currentHtmlNode && currentHtmlNode.close) {
        const innerRange = getInnerRange(currentHtmlNode);
        if (innerRange && innerRange.contains(position)) {
            if (currentHtmlNode.name === 'style'
                && currentHtmlNode.open.end.isBefore(position)
                && currentHtmlNode.close.start.isAfter(position)) {
                let buffer = new bufferStream_1.DocumentStreamReader(document, currentHtmlNode.open.end, new vscode.Range(currentHtmlNode.open.end, currentHtmlNode.close.start));
                return css_parser_1.default(buffer);
            }
        }
    }
}
exports.getEmbeddedCssNodeIfAny = getEmbeddedCssNodeIfAny;
function isStyleAttribute(currentNode, position) {
    if (!currentNode) {
        return false;
    }
    const currentHtmlNode = currentNode;
    const index = (currentHtmlNode.attributes || []).findIndex(x => x.name.toString() === 'style');
    if (index === -1) {
        return false;
    }
    const styleAttribute = currentHtmlNode.attributes[index];
    return position.isAfterOrEqual(styleAttribute.value.start) && position.isBeforeOrEqual(styleAttribute.value.end);
}
exports.isStyleAttribute = isStyleAttribute;
function isTemplateScript(currentNode) {
    return currentNode.name === 'script' &&
        (currentNode.attributes &&
            currentNode.attributes.some(x => x.name.toString() === 'type'
                && allowedMimeTypesInScriptTag.indexOf(x.value.toString()) > -1));
}
exports.isTemplateScript = isTemplateScript;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/4e9361845dc28659923a300945f84731393e210d/extensions/emmet/out/util.js.map
