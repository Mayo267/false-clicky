/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";function assign(e,n){return Object.keys(n).reduce(function(e,t){return e[t]=n[t],e},e)}function parseURLQueryArgs(){return(window.location.search||"").split(/[?&]/).filter(function(e){return!!e}).map(function(e){return e.split("=")}).filter(function(e){return 2===e.length}).reduce(function(e,n){return e[n[0]]=decodeURIComponent(n[1]),e},{})}function createScript(e,n){const t=document.createElement("script");t.src=e,t.addEventListener("load",n);const r=document.getElementsByTagName("head")[0];r.insertBefore(t,r.lastChild)}function uriFromPath(e){var n=path.resolve(e).replace(/\\/g,"/");return n.length>0&&"/"!==n.charAt(0)&&(n="/"+n),encodeURI("file://"+n)}function readFile(e){return new Promise(function(n,t){fs.readFile(e,"utf8",function(e,r){e?t(e):n(r)})})}function main(){const e=parseURLQueryArgs(),n=JSON.parse(e.config||"{}")||{};!function(){const e=require("path"),t=require("module");let r=e.join(n.appRoot,"node_modules");/[a-z]\:/.test(r)&&(r=r.charAt(0).toUpperCase()+r.substr(1))
;const o=r+".asar",a=t._resolveLookupPaths;t._resolveLookupPaths=function(e,n,t){const i=a(e,n,t),s=t?i:i[1];for(let e=0,n=s.length;e<n;e++)if(s[e]===r){s.splice(e,0,o);break}return i}}(),assign(process.env,n.userEnv);var t={availableLanguages:{}};const r=process.env.VSCODE_NLS_CONFIG;if(r){process.env.VSCODE_NLS_CONFIG=r;try{t=JSON.parse(r)}catch(e){}}if(t._resolvedLanguagePackCoreLocation){let e=Object.create(null);t.loadBundle=function(n,r,o){let a=e[n];if(a)return void o(void 0,a);readFile(path.join(t._resolvedLanguagePackCoreLocation,n.replace(/\//g,"!")+".nls.json")).then(function(t){let r=JSON.parse(t);e[n]=r,o(void 0,r)}).catch(e=>{try{t._corruptedFile&&writeFile(t._corruptedFile,"corrupted").catch(function(e){console.error(e)})}finally{o(e,void 0)}})}}var o=t.availableLanguages["*"]||"en";"zh-tw"===o?o="zh-Hant":"zh-cn"===o&&(o="zh-Hans"),window.document.documentElement.setAttribute("lang",o);const a=uriFromPath(n.appRoot)+"/out";createScript(a+"/vs/loader.js",function(){var e=global.define
;global.define=void 0,e("fs",["original-fs"],function(e){return e}),window.MonacoEnvironment={},require.config({baseUrl:a,"vs/nls":t,nodeCachedDataDir:n.nodeCachedDataDir,nodeModules:[]}),t.pseudo&&require(["vs/nls"],function(e){e.setPseudoTranslation(t.pseudo)}),require(["vs/code/electron-browser/sharedProcess/sharedProcessMain"],function(e){e.startup({machineId:n.machineId})})})}const path=require("path"),fs=require("fs"),writeFile=(e,n)=>new Promise((t,r)=>fs.writeFile(e,n,"utf8",e=>e?r(e):t()));main();
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/4e9361845dc28659923a300945f84731393e210d/core/vs/code/electron-browser/sharedProcess/sharedProcess.js.map
