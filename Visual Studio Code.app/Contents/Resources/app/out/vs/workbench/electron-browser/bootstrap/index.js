/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";function onError(e,t){t&&remote.getCurrentWebContents().openDevTools(),console.error("[uncaught exception]: "+e),e.stack&&console.error(e.stack)}function assign(e,t){return Object.keys(t).reduce(function(e,r){return e[r]=t[r],e},e)}function parseURLQueryArgs(){return(window.location.search||"").split(/[?&]/).filter(function(e){return!!e}).map(function(e){return e.split("=")}).filter(function(e){return 2===e.length}).reduce(function(e,t){return e[t[0]]=decodeURIComponent(t[1]),e},{})}function uriFromPath(e){var t=path.resolve(e).replace(/\\/g,"/");return t.length>0&&"/"!==t.charAt(0)&&(t="/"+t),encodeURI("file://"+t)}function readFile(e){return new Promise(function(t,r){fs.readFile(e,"utf8",function(e,o){e?r(e):t(o)})})}function showPartsSplash(e){perf.mark("willShowPartsSplash"),perf.mark("willAccessLocalStorage");let t=window.localStorage;perf.mark("didAccessLocalStorage");let r;try{let e=t.getItem("storage://global/parts-splash-data");r=JSON.parse(e)}catch(e){}if(r){
const t=document.createElement("div");t.id=r.id;const{layoutInfo:o,colorInfo:n}=r;o.sideBarWidth=Math.min(o.sideBarWidth,window.innerWidth-(o.activityBarWidth+o.editorPartMinWidth)),
e.folderUri||e.workspace?t.innerHTML=`\n\t\t\t<div style="position: absolute; width: 100%; left: 0; top: 0; height: ${o.titleBarHeight}px; background-color: ${n.titleBarBackground};"></div>\n\t\t\t<div style="position: absolute; height: calc(100% - ${o.titleBarHeight}px); top: ${o.titleBarHeight}px; ${o.sideBarSide}: 0; width: ${o.activityBarWidth}px; background-color: ${n.activityBarBackground};"></div>\n\t\t\t<div style="position: absolute; height: calc(100% - ${o.titleBarHeight}px); top: ${o.titleBarHeight}px; ${o.sideBarSide}: ${o.activityBarWidth}px; width: ${o.sideBarWidth}px; background-color: ${n.sideBarBackground};"></div>\n\t\t\t<div style="position: absolute; width: 100%; bottom: 0; left: 0; height: ${o.statusBarHeight}px; background-color: ${n.statusBarBackground};"></div>\n\t\t\t`:t.innerHTML=`\n\t\t\t<div style="position: absolute; width: 100%; left: 0; top: 0; height: ${o.titleBarHeight}px; background-color: ${n.titleBarBackground};"></div>\n\t\t\t<div style="position: absolute; height: calc(100% - ${o.titleBarHeight}px); top: ${o.titleBarHeight}px; ${o.sideBarSide}: 0; width: ${o.activityBarWidth}px; background-color: ${n.activityBarBackground};"></div>\n\t\t\t<div style="position: absolute; width: 100%; bottom: 0; left: 0; height: ${o.statusBarHeight}px; background-color: ${n.statusBarNoFolderBackground};"></div>\n\t\t\t`,
document.body.appendChild(t)}perf.mark("didShowPartsSplash")}function registerListeners(e){var t;if(e){const e="darwin"===process.platform?"meta-alt-73":"ctrl-shift-73",r="darwin"===process.platform?"meta-82":"ctrl-82";t=function(t){const o=function(e){return[e.ctrlKey?"ctrl-":"",e.metaKey?"meta-":"",e.altKey?"alt-":"",e.shiftKey?"shift-":"",e.keyCode].join("")}(t);o===e?remote.getCurrentWebContents().toggleDevTools():o===r&&remote.getCurrentWindow().reload()},window.addEventListener("keydown",t)}return process.on("uncaughtException",function(t){onError(t,e)}),function(){t&&(window.removeEventListener("keydown",t),t=void 0)}}function main(){const e=require("electron").webFrame,t=parseURLQueryArgs(),r=JSON.parse(t.config||"{}")||{};!function(){const e=require("path"),t=require("module");let o=e.join(r.appRoot,"node_modules");/[a-z]\:/.test(o)&&(o=o.charAt(0).toUpperCase()+o.substr(1));const n=o+".asar",i=t._resolveLookupPaths;t._resolveLookupPaths=function(e,t,r){const a=i(e,t,r),s=r?a:a[1]
;for(let e=0,t=s.length;e<t;e++)if(s[e]===o){s.splice(e,0,n);break}return a}}(),assign(process.env,r.userEnv),perf.importEntries(r.perfEntries),showPartsSplash(r);var o={availableLanguages:{}};const n=process.env.VSCODE_NLS_CONFIG;if(n){process.env.VSCODE_NLS_CONFIG=n;try{o=JSON.parse(n)}catch(e){}}if(o._resolvedLanguagePackCoreLocation){let e=Object.create(null);o.loadBundle=function(t,r,n){let i=e[t];if(i)return void n(void 0,i);readFile(path.join(o._resolvedLanguagePackCoreLocation,t.replace(/\//g,"!")+".nls.json")).then(function(r){let o=JSON.parse(r);e[t]=o,n(void 0,o)}).catch(e=>{try{o._corruptedFile&&writeFile(o._corruptedFile,"corrupted").catch(function(e){console.error(e)})}finally{n(e,void 0)}})}}var i=o.availableLanguages["*"]||"en";"zh-tw"===i?i="zh-Hant":"zh-cn"===i&&(i="zh-Hans"),window.document.documentElement.setAttribute("lang",i);const a=(process.env.VSCODE_DEV||!!r.extensionDevelopmentPath)&&!r.extensionTestsPath,s=registerListeners(a),c=r.zoomLevel;e.setVisualZoomLevelLimits(1,1),
"number"==typeof c&&0!==c&&e.setZoomLevel(c);const l=r.appRoot+"/out/vs/loader.js",d=require("fs").readFileSync(l);require("vm").runInThisContext(d,{filename:l});var p=global.define;global.define=void 0,window.nodeRequire=require.__$__nodeRequire,p("fs",["original-fs"],function(e){return e}),window.MonacoEnvironment={};const u=window.MonacoEnvironment.onNodeCachedData=[];require.config({baseUrl:uriFromPath(r.appRoot)+"/out","vs/nls":o,recordStats:!!r.performance,nodeCachedDataDir:r.nodeCachedDataDir,onNodeCachedData:function(){u.push(arguments)},
nodeModules:["electron","original-fs","vsda","nan","readable-stream","strip-ansi","applicationinsights","fast-plist","gc-signals","getmac","graceful-fs","http-proxy-agent","debug","https-proxy-agent","iconv-lite","jschardet","keytar","minimist","native-is-elevated","native-keymap","native-watchdog","node-pty","semver","spdlog","sudo-prompt","v8-inspect-profiler","vscode-chokidar","vscode-fsevents","vscode-debugprotocol","vscode-nsfw","vscode-ripgrep","vscode-textmate","vscode-xterm","vsda","winreg","yauzl","windows-foreground-love","windows-mutex","windows-process-tree","agent-base","ansi-regex","anymatch","async-each","bindings","buffer-crc32","chrome-remote-interface","core-util-is","ms","editions","extract-opts","fd-slicer","fs-extra","glob-parent","inherits","is-binary-path","is-glob","isarray","lodash.isinteger","lodash.isundefined","mkdirp","oniguruma","path-is-absolute","prebuild-install","github-from-package","process-nextick-args","promisify-node","readdirp","string_decoder","safe-buffer","safer-buffer","util-deprecate","binary-extensions","commander","detect-libc","eachr","es6-promisify","expand-template","is-extglob","jsonfile","klaw","micromatch","normalize-path","minimatch","node-abi","nodegit-promise","noop-logger","npmlog","os-homedir","pend","pump","rc","rimraf","set-immediate-shim","simple-get","tar-fs","tunnel-agent","typechecker","which-pm-runs","ws","are-we-there-yet","arr-diff","array-unique","asap","async-limiter","brace-expansion","concat-map","braces","chownr","console-control-strings","decompress-response","deep-extend","end-of-stream","es6-promise","expand-brackets","extglob","filename-regex","gauge","glob","ini","kind-of","object.omit","once","parse-glob","regex-cache","remove-trailing-separator","set-blocking","simple-concat","strip-json-comments","tar-stream","ultron","aproba","arr-flatten","balanced-match","bl","buffer-alloc","delegates","expand-range","for-own","fs-constants","fs.realpath","glob-base","has-unicode","inflight","is-buffer","is-dotfile","is-equal-shallow","is-extendable","is-posix-bracket","is-primitive","mimic-response","object-assign","preserve","repeat-element","signal-exit","string-width","to-buffer","wide-align","is-fullwidth-code-point","wrappy","xtend","buffer-alloc-unsafe","buffer-fill","code-point-at","fill-range","for-in","is-number","isobject","number-is-nan","randomatic","repeat-string","async_hooks","assert","buffer","child_process","console","constants","crypto","cluster","dgram","dns","domain","events","fs","http","http2","https","inspector","module","net","os","path","perf_hooks","process","punycode","querystring","readline","repl","stream","string_decoder","sys","timers","tls","tty","url","util","v8","vm","zlib"]
}),o.pseudo&&require(["vs/nls"],function(e){e.setPseudoTranslation(o.pseudo)}),window.MonacoEnvironment.timers={isInitialStartup:!!r.isInitialStartup,hasAccessibilitySupport:!!r.accessibilitySupport,start:r.perfStartTime,windowLoad:r.perfWindowLoadTime},perf.mark("willLoadWorkbenchMain"),require(["vs/workbench/workbench.main","vs/nls!vs/workbench/workbench.main","vs/css!vs/workbench/workbench.main"],function(){perf.mark("didLoadWorkbenchMain"),process.lazyEnv.then(function(){perf.mark("main/startup"),require("vs/workbench/electron-browser/main").startup(r).done(function(){s()},function(e){onError(e,a)})})})}const perf=require("../../../base/common/performance");perf.mark("renderer/started");const path=require("path"),fs=require("fs"),electron=require("electron"),remote=electron.remote,ipc=electron.ipcRenderer;process.lazyEnv=new Promise(function(e){const t=setTimeout(function(){e(),console.warn("renderer did not receive lazyEnv in time")},1e4);ipc.once("vscode:acceptShellEnv",function(r,o){clearTimeout(t),
assign(process.env,o),e(process.env)}),ipc.send("vscode:fetchShellEnv")}),Error.stackTraceLimit=100;const writeFile=(e,t)=>new Promise((r,o)=>fs.writeFile(e,t,"utf8",e=>e?o(e):r()));main();
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/4e9361845dc28659923a300945f84731393e210d/core/vs/workbench/electron-browser/bootstrap/index.js.map
