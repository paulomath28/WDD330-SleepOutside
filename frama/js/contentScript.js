let selectedText = "";
const mediumTranslatorLimit = 30
  , guidContent = "c12b5a4e69860bc968b47223fd-"
  , popupX = -2
  , popupY = 20;
function init() {
    $("#bro-container").hide();
    let e = $("#translator-icon");
    $("#speak-icon");
    e.on("mouseup", onTranslationIconClick),
    $(`#speak-icon .${guidContent}sound_inactive`).click(onSpeakIconClick1),
    makePopupDraggable()
}
function isInside(e, t) {
    return $(e.target).closest(t).length > 0
}
function onDocumentClick(e) {
    let t = !1;
    $(`#${guidContent}small-translator-div`).is(":visible") && (isInside(e, `#${guidContent}small-translator-div`) || (hideSmallPopup(),
    t = !0)),
    $(`#${guidContent}medium-translator-div`).is(":visible") && (isInside(e, `#${guidContent}medium-translator-div`) || (hideMediumPopup(),
    t = !0)),
    $(`#${guidContent}translator-div-container`).is(":visible") && (isInside(e, `#translator-icon,#${guidContent}translator-div-container`) || (hideBigPopup(),
    t = !0)),
    t && clearPopups()
}
function clearPopups() {
    $(`#${guidContent}inputText`).val(""),
    $(`#${guidContent}outputText`).val(""),
    $(`.${guidContent}translatedText`).text(""),
    stopAudioPlay($(`.${guidContent}sound_activate`).parent())
}
function hideMediumPopup() {
    debug;
    const e = $(`#${guidContent}medium-translator-div`);
    e.is(":visible") && (e.find(`.${guid}lng_list_container`).hide(),
    e.hide(),
    $(`.${guidContent}bookmark-icon`).removeClass(`${guidContent}svg-red`),
    clearPopups())
}
$(document).ready((function() {
    init()
}
)),
document.addEventListener("mouseup", (e => {
    if ($("#bro-container").is(":visible")) {
        if (e.target && "speak-icon" === $(e.target.parentElement).attr("id"))
            return;
        hideSquareButtons()
    }
    "block" === $(`#${guidContent}translator-div, #${guidContent}translator-div-container`).css("display") && chrome.runtime.sendMessage({
        mtzClosed: !0
    }),
    onDocumentClick(e),
    isInside(e, `#${guidContent}small-translator-div`) || isInside(e, `#${guidContent}medium-translator-div`) || isInside(e, `#translator-icon,#${guidContent}translator-div-container`) || (selectedText = getSelectedText(),
    translatedTextIsValid(e.target, selectedText) && chrome.storage.local.get(["allowWordAuto", "allowSentenceAuto", "showTranslateIcon", "showSpeakIcon"], (function({allowWordAuto: t, allowSentenceAuto: n, showTranslateIcon: o, showSpeakIcon: i}) {
        let a = !0;
        isOneWord(selectedText) ? !0 === t && (a = !1,
        updateExtensionData(),
        showSmallPopup(e.pageX, e.pageY, selectedText)) : isMediumSentence(selectedText) && !0 === n && (a = !1,
        updateExtensionData(),
        showMediumPopup(e.pageX, e.pageY, selectedText)),
        a && (!0 !== o && !0 !== i || showSquareButtons(e.pageX, e.pageY, selectedText, o, i))
    }
    )))
}
));
const hideBigPopup = () => {
    debug;
    const e = $(`#${guidContent}translator-div-container`);
    e.is(":visible") && (e.hide(),
    clearPopups())
}
  , hideSmallPopup = () => {
    debug;
    const e = $(`#${guidContent}small-translator-div`);
    e.is(":visible") && (e.find(`.${guid}lng_list_container`).hide(),
    e.hide(),
    $(`.${guidContent}bookmark-icon`).removeClass(`${guidContent}svg-red`),
    $(`.${guidContent}vocabulary-icon-container svg`).removeClass(`${guidContent}svg-red-border-none`),
    clearPopups())
}
  , updateExtensionData = () => {
    updateSelectedLanguages(),
    updateSmallSelectedLanguages()
}
  , clearSelectedText = () => {}
  , translatedTextIsValid = (e, t) => !$(e).closest(`#${guidContent}medium-translator-div, .swal-modal`).length && !$(e).closest(`#${guidContent}small-translator-div`).length && (null !== t && 0 !== t.trim().length);
function showSquareButtons(e, t, n, o, i) {
    const a = $("#bro-container")
      , s = $("#translator-icon")
      , l = $("#speak-icon");
    let d = 0;
    isOneWord(n) && (d = -2 * n.length),
    s.css("display", "none"),
    l.css("display", "none"),
    o && s.css("display", "block"),
    i && chrome.storage.local.get(["langSrcSpeakAvailable"], (function(e) {
        e.langSrcSpeakAvailable && l.css("display", "block")
    }
    )),
    a.css({
        left: e + d,
        top: t + 15
    }),
    a.show(),
    chrome.runtime.sendMessage({
        mtzOpened: !0
    })
}
function hideSquareButtons() {
    const e = $("#bro-container");
    e.is(":visible") && e.hide()
}
function setPopupPosition(e, t, n) {
    let o = t + -2
      , i = n + 20;
    e.css({
        left: o,
        top: i
    });
    let a = e[0].getBoundingClientRect();
    o < 0 && (o = 50),
    i < 0 && (i = 50),
    a.right > (window.innerWidth || document.documentElement.clientWidth) && (o = (window.innerWidth || document.documentElement.clientWidth) - a.width - 50),
    a.bottom > (window.innerHeight || document.documentElement.clientHeight) && (i -= a.bottom - (window.innerHeight || document.documentElement.clientHeight) + 50),
    e.css({
        left: o,
        top: i
    })
}
function showSmallPopup(e, t, n) {
    let o = $(`#${guidContent}small-translator-div`);
    o.show(),
    setPopupPosition(o, e, t),
    oneWordTranslate(n, "small"),
    chrome.runtime.sendMessage({
        mtzOpened: !0
    })
}
function showMediumPopup(e, t, n) {
    let o = $(`#${guidContent}medium-translator-div`);
    o.show(),
    setPopupPosition(o, e, t),
    oneWordTranslate(n, "medium")
}
function showBigPopup(e="", t="", n="translate") {
    let o = $(`#${guidContent}translator-div-container`);
    o.find(`#${guidContent}inputText`).val(e),
    o.find(`#${guidTranslate}outputText`).val(t),
    saveInputText(),
    updateExtensionData(),
    showTabByName(n),
    o.show()
}
function isOneWord(e) {
    let t = !1;
    if (e) {
        let n = e.split(" ");
        n = n.filter((function(e) {
            return e.trim()
        }
        )),
        t = n.length < 2
    }
    return t
}
function isMediumSentence(e) {
    let t = !1;
    if (e) {
        let n = e.split(" ");
        n = n.filter((function(e) {
            return e.trim()
        }
        )),
        t = n.length < 30
    }
    return t
}
const onSpeakIconClick1 = e => {
    chrome.storage.local.get(["langSrc"], (function(t) {
        speakText(selectedText, t.langSrc, $(e.target).parent())
    }
    ))
}
;
function onTranslationIconClick(e) {
    debug_log("onTranslationIconClick"),
    e.stopPropagation(),
    hideSquareButtons(),
    chrome.storage.local.get(["popupX", "popupY"], (function({popupX: e, popupY: t}) {
        void 0 !== e && $(`#${guidContent}translator-div-container`).css({
            top: t + "px",
            left: e + "px"
        })
    }
    )),
    isOneWord(selectedText) ? (updateExtensionData(),
    showSmallPopup(e.pageX, e.pageY - 25, selectedText)) : isMediumSentence(selectedText) ? (updateExtensionData(),
    showMediumPopup(e.pageX, e.pageY - 25, selectedText)) : (updateExtensionData(),
    clearPopups(),
    showBigPopup(selectedText),
    translate())
}
const makePopupDraggable = () => {
    $(`#${guidContent}translator-div-container`).draggable({
        stop: function() {
            let e = this.getBoundingClientRect()
              , t = e.left % ((window.innerWidth || document.documentElement.clientWidth) - 10)
              , n = e.top % ((window.innerHeight || document.documentElement.clientHeight) - 10);
            chrome.storage.local.set({
                popupY: n,
                popupX: t
            }, null)
        }
    })
}
;
function getSelectedText() {
    let e = "";
    if (window.getSelection) {
        let t = window.getSelection();
        t.anchorNode && t.anchorNode.nodeType === Node.TEXT_NODE && (e = window.getSelection().toString())
    } else if (document.getSelection) {
        let t = document.getSelection();
        t.anchorNode && t.anchorNode.nodeType === Node.TEXT_NODE && (e = document.getSelection().toString())
    } else {
        if (!document.selection)
            return;
        e = document.selection.createRange().text
    }
    return e.trim()
}
function receiveMessage(e) {
    "mtzCloseFrame" == e.data && $(`#${guidContent}translator-div-container`).hide()
}
window.addEventListener("message", receiveMessage, !1),
chrome.runtime.sendMessage({
    from: "content",
    subject: "getSelection"
}),
chrome.runtime.onMessage.addListener((function(e, t, n) {
    "showBigPopup" === e.msg && (hideSquareButtons(),
    hideSmallPopup(),
    hideMediumPopup(),
    showBigPopup(e.inputText, e.outputText, e.tabName),
    translate())
}
)),
chrome.runtime.onMessage.addListener(( (e, t, n) => {
    "popup" === e.from && "getSelection" === e.subject && n(getSelectedText())
}
));
