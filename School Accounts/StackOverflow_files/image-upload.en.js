"use strict";StackExchange.imageUploader=function(){var e=window.URL||window.webkitURL,t={},n=function(){var e,t,n,i,r=window.document,a=window.self;a.innerHeight&&a.scrollMaxY?(e=r.body.scrollWidth,t=a.innerHeight+a.scrollMaxY):r.body.scrollHeight>r.body.offsetHeight?(e=r.body.scrollWidth,t=r.body.scrollHeight):(e=r.body.offsetWidth,t=r.body.offsetHeight),a.innerHeight?(n=a.innerWidth,i=a.innerHeight):r.documentElement&&r.documentElement.clientHeight?(n=r.documentElement.clientWidth,i=r.documentElement.clientHeight):r.body&&(n=r.body.clientWidth,i=r.body.clientHeight);var o=Math.max(e,n),s=Math.max(t,i);return[o,s,n,i]},i={"uploadUrl":"/upload/image?https=true","showLowRepWarning":!1},r=function(){$(".wmd-prompt-background").remove()},a=function(){var e=window.document,t=window.navigator,i={"isIE":/msie/.test(t.userAgent.toLowerCase()),"isIE_5or6":/msie [56]/.test(t.userAgent.toLowerCase()),"isOpera":/opera/.test(t.userAgent.toLowerCase())},r=e.createElement("div"),a=r.style;r.className="wmd-prompt-background",a.position="absolute",a.top="0",a.zIndex="1000",i.isIE?a.filter="alpha(opacity=50)":a.opacity="0.5";var o=n();return a.height=o[1]+"px",i.isIE?(a.left=e.documentElement.scrollLeft,a.width=e.documentElement.clientWidth):(a.left="0",a.width="100%"),e.body.appendChild(r),r};return{"createImageUploadBackground":a,"removeImageUploadBackground":r,"enableLowRepWarning":function(){i.showLowRepWarning=!0},"uploadImageDialog":function(n,r){"string"===$.type(r)&&(r={"uploadUrl":r}),r=$.extend(i,r);var a,o="upload-iframe-"+(new Date).getTime(),s=window.FileReader&&window.FormData,c=s&&"ondrop"in window,l="/render/image-upload?uploadUrl={0}&canDragDrop={1}&showLowRepWarning={2}".formatUnicorn(encodeURIComponent(r.uploadUrl),c?"true":"false",r.showLowRepWarning?"true":"false"),u=$('<div class="modal image-upload wmd-prompt-dialog auto-center" tabindex="-1"></div>').addClass("async-load").data("load-url",l),d=0,p=function(e){u&&u.fadeOutAndRemove(),$("body").off("keydown",y.checkEscape).off("paste",y.paste),void 0!==e&&n(e)},f=function(e){return 0===e.type.indexOf("image/")},h=function(e){var t;return e.items&&(t=$.grep(e.items,f),t.length>0)?t[0].getAsFile():e.files&&(t=$.grep(e.files,f),t.length>0)?t[0]:void 0},g=function(e,t){var n=u.find("."+e);n.find(".tab-page").hide(),n.find("."+e+"-"+t).show(),n.data("active-tab",t)},m=function(e){var t=u.find("."+e);return t.data("active-tab")},v=function(){window.closeDialog=p,window.displayUploadError=b.uploadError},b={"resetInputs":function(){u.find(".modal-input-file, .modal-input-url").prop("disabled",!1).attr("value","")},"uploadError":function(e){b.resetInputs(),u.find(".modal-options-error .modal-options-error-message").text(e),g("modal-options","error")},"ajaxResult":function(e){$("#"+o).contents().find("html").html(e)},"ajaxError":function(e,t,n){b.uploadError(function(e){return"Request returned an error: ["+e.status+"] "+e.error}({"status":t,"error":n}))}},y={"showLink":function(e){e&&e.preventDefault(),g("modal-options","url"),u.find(".modal-input-url").focus()},"resetView":function(e){e&&e.preventDefault(),g("modal-dropzone","default"),g("modal-options","default"),u.find(".modal-cta-submit").prop("disabled",!0),u.find(".modal-dropzone-preview").empty(),u.find(".modal-input-file").val(""),b.resetInputs(),d=0,a.removeClass("hover"),u.find("form").off("submit").on("submit",y.oldSchoolSubmit),u.find("form input[name=fkey]").val(StackExchange.options.user.fkey)},"inputFileOrUrl":function(){var e=!!u.find(".user-input").filter(function(){return this.value.length}).length;u.find(".modal-cta-submit").prop("disabled",!e)},"disablePasteHandling":function(){$("body").off("paste",y.previewImage)},"enablePasteHandling":function(){$("body").on("paste",{"property":"clipboardData"},y.previewImage)},"selectFile":function(e){e.preventDefault(),u.find(".modal-input-file").click()},"clickFile":function(e){e.stopPropagation()},"previewImage":function(t){t.preventDefault();var n,i,r,a=h(t.originalEvent[t.data.property]);a&&(n=a.size>=2097152,i=u.find(".modal-dropzone-preview"),i.empty(),r=e.createObjectURL(a),$("<img>").attr("src",r).css({"maxWidth":i.css("width"),"maxHeight":i.css("height")}).on("load",{"url":r},y.loadPreviewImage).appendTo(i),u.find("form").off("submit").on("submit",a,y.ajaxSubmit),u.find(".modal-cta-submit").prop("disabled",n),g("modal-dropzone","preview"),g("modal-options",n?"toobig":"preview"))},"dragEnter":function(e){e.preventDefault(),d++,a.addClass("hover")},"dragLeave":function(){0===--d&&a.removeClass("hover")},"clickClose":function(e){e.preventDefault(),p(null)},"loadPreviewImage":function(t){e.revokeObjectURL(t.data.url)},"oldSchoolSubmit":function(e){var t="url"===m("modal-options");g("modal-options","uploading"),u.find(".modal-input-file").prop("disabled",t),u.find(".modal-input-url").prop("disabled",!t),e.target.target=o,v()},"ajaxSubmit":function(e){e.preventDefault(),g("modal-options","uploading");var t=new window.FormData;t.append("file",e.data),t.append("fkey",StackExchange.options.user.fkey),v(),$.ajax({"url":r.uploadUrl,"data":t,"cache":!1,"contentType":!1,"processData":!1,"type":"POST","success":b.ajaxResult,"error":b.ajaxError})},"checkEscape":function(e){27===e.which&&(e.preventDefault(),p(null))}},w=function(){u.css("height","auto"),u.find(".modal-options-uploading p").addSpinner(),u.find(".modal-options-default a").click(y.showLink),u.find(".modal-options-cancel").click(y.resetView),u.find(".modal-input-file").on("click",y.clickFile).on("change",y.inputFileOrUrl);var e=u.find(".modal-input-url").on("input keydown",y.inputFileOrUrl);u.find(".modal-dropzone-default").click(y.selectFile),s&&(u.find(".modal-input-file").change({"property":"target"},y.previewImage),u.find(".modal-input-url").focus(y.disablePasteHandling).blur(y.enablePasteHandling),y.enablePasteHandling()),c&&(a=u.find(".modal-dropzone-default").on("dragenter",y.dragEnter).on("dragleave",y.dragLeave).on("dragover",!1).on("drop",{"property":"dataTransfer"},y.previewImage)),u.find(".modal-close").click(y.clickClose),y.resetView(),u.focus(),r.imageUrl&&(y.showLink(),e.val(r.imageUrl),y.inputFileOrUrl())},k=function(){u.asyncLoad({"callback":function(){x(u),w()},"cache":t})},x=function(e){$('<iframe style="display: none;" src="about:blank" />').attr("id",o).attr("name",o).appendTo(e)};return u.appendTo("body").center().fadeIn("fast").promise().done(k),u.on("popupClose",y.disablePasteHandling),$("body").on("keydown",y.checkEscape),!0}}}();