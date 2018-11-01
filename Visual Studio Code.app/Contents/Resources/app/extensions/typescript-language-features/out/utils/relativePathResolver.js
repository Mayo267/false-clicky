"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const path = require("path");
const vscode = require("vscode");
class RelativeWorkspacePathResolver {
    asAbsoluteWorkspacePath(relativePath) {
        for (const root of vscode.workspace.workspaceFolders || []) {
            const rootPrefixes = [`./${root.name}/`, `${root.name}/`, `.\\${root.name}\\`, `${root.name}\\`];
            for (const rootPrefix of rootPrefixes) {
                if (relativePath.startsWith(rootPrefix)) {
                    return path.join(root.uri.fsPath, relativePath.replace(rootPrefix, ''));
                }
            }
        }
        return undefined;
    }
}
exports.RelativeWorkspacePathResolver = RelativeWorkspacePathResolver;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/4e9361845dc28659923a300945f84731393e210d/extensions/typescript-language-features/out/utils/relativePathResolver.js.map
