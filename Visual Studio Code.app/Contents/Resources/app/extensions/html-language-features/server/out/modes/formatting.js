/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var arrays_1 = require("../utils/arrays");
var strings_1 = require("../utils/strings");
function format(languageModes, document, formatRange, formattingOptions, settings, enabledModes) {
    var result = [];
    var endPos = formatRange.end;
    var endOffset = document.offsetAt(endPos);
    var content = document.getText();
    if (endPos.character === 0 && endPos.line > 0 && endOffset !== content.length) {
        // if selection ends after a new line, exclude that new line
        var prevLineStart = document.offsetAt(vscode_languageserver_types_1.Position.create(endPos.line - 1, 0));
        while (strings_1.isEOL(content, endOffset - 1) && endOffset > prevLineStart) {
            endOffset--;
        }
        formatRange = vscode_languageserver_types_1.Range.create(formatRange.start, document.positionAt(endOffset));
    }
    // run the html formatter on the full range and pass the result content to the embedded formatters.
    // from the final content create a single edit
    // advantages of this approach are
    //  - correct indents in the html document
    //  - correct initial indent for embedded formatters
    //  - no worrying of overlapping edits
    // make sure we start in html
    var allRanges = languageModes.getModesInRange(document, formatRange);
    var i = 0;
    var startPos = formatRange.start;
    var isHTML = function (range) { return range.mode && range.mode.getId() === 'html'; };
    while (i < allRanges.length && !isHTML(allRanges[i])) {
        var range = allRanges[i];
        if (!range.attributeValue && range.mode && range.mode.format) {
            var edits = range.mode.format(document, vscode_languageserver_types_1.Range.create(startPos, range.end), formattingOptions, settings);
            arrays_1.pushAll(result, edits);
        }
        startPos = range.end;
        i++;
    }
    if (i === allRanges.length) {
        return result;
    }
    // modify the range
    formatRange = vscode_languageserver_types_1.Range.create(startPos, formatRange.end);
    // perform a html format and apply changes to a new document
    var htmlMode = languageModes.getMode('html');
    var htmlEdits = htmlMode.format(document, formatRange, formattingOptions, settings);
    var htmlFormattedContent = vscode_languageserver_types_1.TextDocument.applyEdits(document, htmlEdits);
    var newDocument = vscode_languageserver_types_1.TextDocument.create(document.uri + '.tmp', document.languageId, document.version, htmlFormattedContent);
    try {
        // run embedded formatters on html formatted content: - formatters see correct initial indent
        var afterFormatRangeLength = document.getText().length - document.offsetAt(formatRange.end); // length of unchanged content after replace range
        var newFormatRange = vscode_languageserver_types_1.Range.create(formatRange.start, newDocument.positionAt(htmlFormattedContent.length - afterFormatRangeLength));
        var embeddedRanges = languageModes.getModesInRange(newDocument, newFormatRange);
        var embeddedEdits = [];
        for (var _i = 0, embeddedRanges_1 = embeddedRanges; _i < embeddedRanges_1.length; _i++) {
            var r = embeddedRanges_1[_i];
            var mode = r.mode;
            if (mode && mode.format && enabledModes[mode.getId()] && !r.attributeValue) {
                var edits = mode.format(newDocument, r, formattingOptions, settings);
                for (var _a = 0, edits_1 = edits; _a < edits_1.length; _a++) {
                    var edit = edits_1[_a];
                    embeddedEdits.push(edit);
                }
            }
        }
        if (embeddedEdits.length === 0) {
            arrays_1.pushAll(result, htmlEdits);
            return result;
        }
        // apply all embedded format edits and create a single edit for all changes
        var resultContent = vscode_languageserver_types_1.TextDocument.applyEdits(newDocument, embeddedEdits);
        var resultReplaceText = resultContent.substring(document.offsetAt(formatRange.start), resultContent.length - afterFormatRangeLength);
        result.push(vscode_languageserver_types_1.TextEdit.replace(formatRange, resultReplaceText));
        return result;
    }
    finally {
        languageModes.onDocumentRemoved(newDocument);
    }
}
exports.format = format;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/4e9361845dc28659923a300945f84731393e210d/extensions/html-language-features/server/out/modes/formatting.js.map
