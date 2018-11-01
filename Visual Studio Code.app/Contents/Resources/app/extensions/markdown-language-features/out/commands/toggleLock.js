"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class ToggleLockCommand {
    constructor(previewManager) {
        this.previewManager = previewManager;
        this.id = 'markdown.preview.toggleLock';
    }
    execute() {
        this.previewManager.toggleLock();
    }
}
exports.ToggleLockCommand = ToggleLockCommand;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/4e9361845dc28659923a300945f84731393e210d/extensions/markdown-language-features/out/commands/toggleLock.js.map
