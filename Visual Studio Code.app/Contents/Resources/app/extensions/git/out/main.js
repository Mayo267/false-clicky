/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const vscode_1 = require("vscode");
const git_1 = require("./git");
const model_1 = require("./model");
const commands_1 = require("./commands");
const contentProvider_1 = require("./contentProvider");
const decorationProvider_1 = require("./decorationProvider");
const askpass_1 = require("./askpass");
const util_1 = require("./util");
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const api_1 = require("./api");
const protocolHandler_1 = require("./protocolHandler");
const deactivateTasks = [];
function deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const task of deactivateTasks) {
            yield task();
        }
    });
}
exports.deactivate = deactivate;
function createModel(context, outputChannel, telemetryReporter, disposables) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathHint = vscode_1.workspace.getConfiguration('git').get('path');
        const info = yield git_1.findGit(pathHint, path => outputChannel.appendLine(localize(0, null, path)));
        const askpass = new askpass_1.Askpass();
        disposables.push(askpass);
        const env = yield askpass.getEnv();
        const git = new git_1.Git({ gitPath: info.path, version: info.version, env });
        const model = new model_1.Model(git, context.globalState, outputChannel);
        disposables.push(model);
        const onRepository = () => vscode_1.commands.executeCommand('setContext', 'gitOpenRepositoryCount', `${model.repositories.length}`);
        model.onDidOpenRepository(onRepository, null, disposables);
        model.onDidCloseRepository(onRepository, null, disposables);
        onRepository();
        outputChannel.appendLine(localize(1, null, info.version, info.path));
        const onOutput = (str) => {
            const lines = str.split(/\r?\n/mg);
            while (/^\s*$/.test(lines[lines.length - 1])) {
                lines.pop();
            }
            outputChannel.appendLine(lines.join('\n'));
        };
        git.onOutput.addListener('log', onOutput);
        disposables.push(util_1.toDisposable(() => git.onOutput.removeListener('log', onOutput)));
        disposables.push(new commands_1.CommandCenter(git, model, outputChannel, telemetryReporter), new contentProvider_1.GitContentProvider(model), new decorationProvider_1.GitDecorations(model), new protocolHandler_1.GitProtocolHandler());
        yield checkGitVersion(info);
        return model;
    });
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const disposables = [];
        context.subscriptions.push(new vscode_1.Disposable(() => vscode_1.Disposable.from(...disposables).dispose()));
        const outputChannel = vscode_1.window.createOutputChannel('Git');
        vscode_1.commands.registerCommand('git.showOutput', () => outputChannel.show());
        disposables.push(outputChannel);
        const { name, version, aiKey } = require(context.asAbsolutePath('./package.json'));
        const telemetryReporter = new vscode_extension_telemetry_1.default(name, version, aiKey);
        deactivateTasks.push(() => telemetryReporter.dispose());
        const config = vscode_1.workspace.getConfiguration('git', null);
        const enabled = config.get('enabled');
        if (!enabled) {
            const onConfigChange = util_1.filterEvent(vscode_1.workspace.onDidChangeConfiguration, e => e.affectsConfiguration('git'));
            const onEnabled = util_1.filterEvent(onConfigChange, () => vscode_1.workspace.getConfiguration('git', null).get('enabled') === true);
            yield util_1.eventToPromise(onEnabled);
        }
        try {
            const model = yield createModel(context, outputChannel, telemetryReporter, disposables);
            return new api_1.APIImpl(model);
        }
        catch (err) {
            if (!/Git installation not found/.test(err.message || '')) {
                throw err;
            }
            const config = vscode_1.workspace.getConfiguration('git');
            const shouldIgnore = config.get('ignoreMissingGitWarning') === true;
            if (!shouldIgnore) {
                console.warn(err.message);
                outputChannel.appendLine(err.message);
                outputChannel.show();
                const download = localize(2, null);
                const neverShowAgain = localize(3, null);
                const choice = yield vscode_1.window.showWarningMessage(localize(4, null), download, neverShowAgain);
                if (choice === download) {
                    vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.parse('https://git-scm.com/'));
                }
                else if (choice === neverShowAgain) {
                    yield config.update('ignoreMissingGitWarning', true, true);
                }
            }
            return new api_1.NoopAPIImpl();
        }
    });
}
exports.activate = activate;
function checkGitVersion(info) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = vscode_1.workspace.getConfiguration('git');
        const shouldIgnore = config.get('ignoreLegacyWarning') === true;
        if (shouldIgnore) {
            return;
        }
        if (!/^[01]/.test(info.version)) {
            return;
        }
        const update = localize(5, null);
        const neverShowAgain = localize(6, null);
        const choice = yield vscode_1.window.showWarningMessage(localize(7, null, info.version), update, neverShowAgain);
        if (choice === update) {
            vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.parse('https://git-scm.com/'));
        }
        else if (choice === neverShowAgain) {
            yield config.update('ignoreLegacyWarning', true, true);
        }
    });
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/4e9361845dc28659923a300945f84731393e210d/extensions/git/out/main.js.map
