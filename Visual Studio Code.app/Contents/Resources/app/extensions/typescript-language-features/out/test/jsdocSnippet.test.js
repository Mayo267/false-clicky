"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
require("mocha");
const jsDocCompletions_1 = require("../features/jsDocCompletions");
suite('typescript.jsDocSnippet', () => {
    test('Should do nothing for single line input', async () => {
        const input = `/** */`;
        assert.strictEqual(jsDocCompletions_1.templateToSnippet(input).value, input);
    });
    test('Should put cursor inside multiline line input', async () => {
        assert.strictEqual(jsDocCompletions_1.templateToSnippet([
            '/**',
            ' * ',
            ' */'
        ].join('\n')).value, [
            '/**',
            ' * $0',
            ' */'
        ].join('\n'));
    });
    test('Should add placeholders after each parameter', async () => {
        assert.strictEqual(jsDocCompletions_1.templateToSnippet([
            '/**',
            ' * @param a',
            ' * @param b',
            ' */'
        ].join('\n')).value, [
            '/**',
            ' * @param a ${1}',
            ' * @param b ${2}',
            ' */'
        ].join('\n'));
    });
    test('Should add placeholders for types', async () => {
        assert.strictEqual(jsDocCompletions_1.templateToSnippet([
            '/**',
            ' * @param {*} a',
            ' * @param {*} b',
            ' */'
        ].join('\n')).value, [
            '/**',
            ' * @param {${1:*}} a ${2}',
            ' * @param {${3:*}} b ${4}',
            ' */'
        ].join('\n'));
    });
    test('Should properly escape dollars in parameter names', async () => {
        assert.strictEqual(jsDocCompletions_1.templateToSnippet([
            '/**',
            ' * ',
            ' * @param $arg',
            ' */'
        ].join('\n')).value, [
            '/**',
            ' * $0',
            ' * @param \\$arg ${1}',
            ' */'
        ].join('\n'));
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/4e9361845dc28659923a300945f84731393e210d/extensions/typescript-language-features/out/test/jsdocSnippet.test.js.map
