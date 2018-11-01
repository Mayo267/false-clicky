/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var vscode = require("vscode");
function fixDriveC(_path) {
    var root = path.parse(_path).root;
    return root.toLowerCase() === 'c:/' ?
        _path.replace(/^c:[/\\]/i, '/') :
        _path;
}
exports.fixDriveC = fixDriveC;
function anchorGlob(glob) {
    return glob.startsWith('**') || glob.startsWith('/') ? glob : "/" + glob;
}
exports.anchorGlob = anchorGlob;
function joinPath(resource, pathFragment) {
    var joinedPath = path.join(resource.fsPath || '/', pathFragment);
    return vscode.Uri.file(joinedPath);
}
exports.joinPath = joinPath;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/4e9361845dc28659923a300945f84731393e210d/extensions/search-rg/out/utils.js.map
