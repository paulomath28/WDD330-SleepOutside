let PLATFORM_NAME = "browserExtension"
  , lexicalError = "No data for this word"
  , bookmarkError = "No bookmark found"
  , historyEmptyText = "History is empty"
  , activeAdIndex = 0
  , autoDetectionText = "Auto-Detection"
  , areaSelectionHint = "Please select area to translate"
  , voiceErrorMsg = "Error during voice loading";
const guidTranslate = "c12b5a4e69860bc968b47223fd-"
  , textareaFrom = $(`#${guidTranslate}inputText`);
let backensterConfig, audio, uuidv, translateCount, translatorLink, lastRequestTime, translationErrorMsg = "translation error", isTranslating = !1, backensterCharacterCountRequestLimitFree = 3e3, backensterTTSRequestLimit = 3e3, backensterAdChangeInterval = 4, backensterRatingTranslationEventCount = 3e3;
const soundActive = chrome.runtime.getURL("assets/Images/sound_active.png")
  , soundInactive = chrome.runtime.getURL("assets/Images/sound.png")
  , loader = chrome.runtime.getURL("assets/Images/spin.gif");
let lastTextOriginal = ""
  , lastTextTranslation = "";
const logographicScripts = ["zh-Hant_TW", "zh-Hans_CN", "ko_KR", "ja_JP"];
function getParentPopupByTarget(e) {
    return $($(e).closest(`#${guidTranslate}small-translator-div`)[0] || $(e).closest(`#${guidTranslate}medium-translator-div`)[0] || $(e).closest(`#${guidTranslate}translator-div-container`)[0])
}
function getPopupNameById(e) {
    return e === `${guidTranslate}small-translator-div` ? "Small Popup" : e === `${guidTranslate}medium-translator-div` ? "Medium Popup" : e === `${guidTranslate}translator-div-container` ? "Big Popup" : void 0
}
function getTemplate(e) {
    return new Promise((function(t) {
        $.ajax({
            url: chrome.runtime.getURL(e),
            success: function(e) {
                return t($.parseHTML(e))
            }
        })
    }
    ))
}
function resetPopupIcons() {
    $(`.${guidTranslate}ToDropArrow, .${guidTranslate}FromDropArrow`).removeClass(`${guidTranslate}arrowClosed`),
    $(`.${guidTranslate}translator-list #${guidTranslate}from .${guidTranslate}country-flag, .${guidTranslate}translator-list #${guidTranslate}to .${guidTranslate}country-flag`).removeClass(`${guidTranslate}showCloudArrow`),
    $(`.${guidTranslate}tab-container-icon`).each(( (e, t) => {
        $(t).removeClass(`${guidTranslate}activeSvg`)
    }
    ))
}
String.prototype.trimBraces || (String.prototype.trimBraces = function() {
    return this.replace(/^[\s()]+|[\s()]+$/g, "")
}
),
String.prototype.splice || (String.prototype.splice = function(e, t, a) {
    return this.slice(0, e) + a + this.slice(e + Math.abs(t))
}
),
$("body").hasClass(`${guidTranslate}mtz-popup`) && chrome.runtime.sendMessage({
    msg: "popup-loaded"
}),
jQuery.fn.visible = function() {
    return this.css("visibility", "visible")
}
,
jQuery.fn.invisible = function() {
    return this.css("visibility", "hidden")
}
;
const trackTabSwitchingEvent = e => {
    let t = "Show General panel";
    "history" === e ? t = "Show History panel" : "vocabulary" === e ? t = "Show Dictionary panel" : "bookmark" === e ? t = "Show Bookmarks panel" : "settings" === e && (t = "Show Settings panel")
}
;
function hideLngList() {
    document.getElementById(`${guidTranslate}toListSelect`).style.display = "none",
    document.getElementById(`${guidTranslate}listDiv`).style.display = "none"
}
function onTabClick(e) {
    const t = $(e.target).closest(`.${guidTranslate}tab-container-item`).data("tab");
    showTabByName(t),
    trackTabSwitchingEvent(t)
}
function showTabByName(e) {
    resetPopupIcons(),
    hideLngList(),
    "settings" === e ? ($(`.${guidTranslate}translator-setting-headline`).show(),
    $(`.${guidTranslate}regular-translator-header`).hide(),
    $(`#${guidTranslate}regular-translator-header`).hide(),
    $(`#${guidTranslate}setting-translator-header`).show(),
    $(`#${guidTranslate}translator-div-container`).css({
        height: 600
    })) : "translate" === e ? ($(`#${guidTranslate}setting-translator-header`).hide(),
    $(`.${guidTranslate}translator-setting-headline`).hide(),
    $(`#${guidTranslate}regular-translator-header`).show(),
    $(`#${guidTranslate}extension-tabs`).show(),
    $(`#${guidTranslate}translator-div-container`).css({
        height: "450px"
    })) : ($(`#${guidTranslate}regular-translator-header`).show(),
    $(`#${guidTranslate}setting-translator-header`).hide(),
    $(`#${guidTranslate}translator-div-container`).css({
        height: "502px"
    })),
    $(`#${guidTranslate}${e}-img`).addClass(`${guidTranslate}activeSvg`),
    $(`.${guidTranslate}extension-tabs`).each((function() {
        $(this).hide()
    }
    )),
    $(`#${guidTranslate}${e}-tab`).show()
}
const ocrImageShowLoader = () => {
    showBigPopup(),
    $(`.${guidTranslate}bigTranslateModal`).prepend(`\n                 <img class="${guidTranslate}imageloader-first"  src="${loader}" />\n                 <img class="${guidTranslate}imageloader-second"  src="${loader}" />\n            `)
}
  , ocrImageHideLoader = () => {
    $(`.${guidTranslate}imageloader-first`).remove(),
    $(`.${guidTranslate}imageloader-second`).remove()
}
  , settingsTabsInitialize = () => {
    window.location.href.startsWith("https://accounts.google.com/") || window.location.href.startsWith("https://console.firebase.google.com/") || window.location.href.startsWith("https://console.cloud.google.com/") || $(`#${guidTranslate}tabs`).tabs({
        activate: function(e, t) {
            let a = t.newTab.index()
              , n = "";
            1 === a ? n = "Show Main tab" : 1 === a ? n = "Show Account tab" : 2 === a ? n = "Show Info tab" : 3 === a && (n = "Show About tab")
        }
    })
}
  , textSpeedSliderInitialize = () => {
    let e;
    $(`#${guidTranslate}slider-range-min`).slider({
        range: "min",
        value: 100,
        step: 10,
        min: 0,
        max: 200,
        slide: function(t, a) {
            let n = a.value;
            n < 20 && (n = 20),
            clearTimeout(e),
            e = setTimeout((function() {
                analyticsTrackEvent("Settings", "Change Voice Speed", {
                    speed: n
                })
            }
            ), 1e3),
            chrome.storage.local.set({
                speedOfText: n
            })
        }
    })
}
;
$(document).ready((async function() {
    window.location.href.startsWith("https://accounts.google.com/") || window.location.href.startsWith("https://console.firebase.google.com/") || window.location.href.startsWith("https://console.cloud.google.com/") || $(`#${guidTranslate}tabs`).tabs({
        activate: function(e, t) {
            let a = t.newTab.index()
              , n = "";
            1 === a ? n = "Show Main tab" : 1 === a ? n = "Show Account tab" : 2 === a ? n = "Show Info tab" : 3 === a && (n = "Show About tab")
        }
    }),
    textSpeedSliderInitialize(),
    getSettingsValues(),
    handleTabsUpdate();
    try {
        let e = null;
        initSmallLngList(),
        $(`#${guidTranslate}inputText`).val(e),
        loadStorageVars((function() {
            chrome.runtime.sendMessage({
                msg: "load_popup_ended"
            }),
            readBackensterParams((function() {
                initLangLists((function() {
                    attachHandlers(),
                    showAdsBanner()
                }
                ))
            }
            ))
        }
        ))
    } catch (e) {}
}
));
const onPopupOpen = () => {
    $("body").hasClass(`${guidTranslate}mtz-popup`) ? (chrome.runtime.sendMessage({
        msg: "popup-loaded"
    }),
    trackEventWithLanguageData("Main(popup) screen", "Shown")) : trackEventWithLanguageData("Main screen", "Shown")
}
;
function loadStorageVars(e) {
    chrome.storage.local.get(["mtz_uuid", "locales", "appLng", "justInstalled", "analyticsEnabled"], (function(e) {
        e.locales && (localesLng = e.locales,
        generateLocaliseSelect(e.locales),
        localize(e.appLng))
    }
    )),
    loadPiwikVars(e),
    readTranslateCount()
}
const generateLocaliseSelect = e => {
    debug_log("generateLocaliseSelect"),
    chrome.storage.local.get(["appLng", "localeNames"], (function({appLng: t, localeNames: a}) {
        let n = $(`#${guidTranslate}change-ext-lng-btn`);
        n.empty();
        var r = Object.keys(e).map((function(t) {
            return t in a && (e[t].languageNameText = a[t][t]),
            [t, e[t]]
        }
        ));
        r = r.sort((function(e, t) {
            return t[1].languageNameText < e[1].languageNameText
        }
        ));
        for (let e in r) {
            const t = r[e][0]
              , a = r[e][1]
              , s = a.languageNameText || a.LanguageNameText || "Default";
            n.append(`<option value="${t}">${s}</option>`)
        }
        n.val(t)
    }
    ))
}
;
function incrementTranslateCount() {
    translateCount++,
    chrome.storage.local.set({
        mtzTranslateCount: translateCount
    })
}
function readTranslateCount() {
    chrome.storage.local.get("mtzTranslateCount", (function(e) {
        chrome.runtime.error || (translateCount = e.mtzTranslateCount),
        translateCount || (translateCount = 0)
    }
    ))
}
function incrementCounter() {
    const e = document.getElementById("popup-container");
    if (e) {
        e.addEventListener("click", (e => {
            chrome.storage.local.get(["openTimes", "rateClicked"], (function(e) {
                let {openTimes: a, rateClicked: n} = e;
                a ? a += 1 : a = 1,
                chrome.storage.local.set({
                    openTimes: a
                }),
                n || a % 20 != 0 || document.getElementById("xxdialog-rate") || (document.querySelector("body").insertAdjacentHTML("beforeend", t),
                function() {
                    for (var e = document.querySelectorAll("[i18n]"), t = 0; t < e.length; ++t)
                        e[t].textContent = chrome.i18n.getMessage(e[t].getAttribute("i18n"));
                    e = document.querySelectorAll("[i18n-alt]");
                    for (t = 0; t < e.length; ++t) {
                        var a = chrome.i18n.getMessage(e[t].getAttribute("i18n-alt"));
                        e[t].alt = a,
                        e[t].title = a
                    }
                }(),
                document.querySelector("#xxdialog-yes").addEventListener("click", (function() {
                    chrome.storage.local.set({
                        rateClicked: !0
                    });
                    document.getElementById("xxdialog-rate").remove(),
                    window.open("https://chrome.google.com/webstore/detail/translator-ulanguage-trns/mnlohknjofogcljbcknkakphddjpijak/reviews", "_blank").focus()
                }
                )),
                document.querySelector("#xxdialog-no").addEventListener("click", (function() {
                    document.getElementById("xxdialog-rate").remove()
                }
                )))
            }
            ))
        }
        ));
        const t = '<div id="xxdialog-rate" class="xxflex-container">    <div class="xxdialog">       <h2 class="xxdialog-header" i18n="rateDialogTitle"></h2>         <div class="xxdialog-content">            <p i18n="rateDialogDesc"></p>    </div>        <div class="xxdialog-button">            <a href="#" id="xxdialog-yes" class="xxcancel" i18n="rateDialogYes"></a>        <a href="#" id="xxdialog-no" i18n="rateDialogNo"></a>\n      </div>\n    </div>\n  </div>\n'
    }
}
function showAdsBanner(e) {
    chrome.storage.local.get(["addInfo"], (function({addInfo: t}) {
        if (t) {
            activeAdIndex >= t.length && (activeAdIndex = 0);
            const {adsUrl: a, assetUrl: n, description: r} = t[activeAdIndex];
            $(`.${guidTranslate}moreAplacationText a`).attr("href", a),
            $(`.${guidTranslate}moreAplacationText img`).attr("src", n),
            $(`.${guidTranslate}moreAplacationText span`).text(r),
            $(`.${guidTranslate}footer-left-side img`).attr("src", n),
            $(`#${guidTranslate}linkMoreApps`).attr("href", a).find("span").text(r),
            e && animateBanner()
        }
    }
    ))
}
const animateBanner = () => {
    const e = $(`.${guidTranslate}footer-left-side`)
      , t = $(`.${guidTranslate}add-link`);
    e.removeClass("scale-up-center"),
    t.removeClass("scale-up-center"),
    setTimeout(( () => {
        t.addClass("scale-up-center"),
        e.addClass("scale-up-center")
    }
    ), 100)
}
  , getText = (e, t) => e in localesLng && t in localesLng[e] ? localesLng[e][t] : t;
function localize(e="en") {
    chrome.i18n.getMessage("titleText");
    e = e.trim(),
    fillLanguages(),
    initSmallLngList(),
    initLangLists(),
    translationErrorMsg = getText(e, "serverErrorText"),
    voiceErrorMsg = getText(e, "voiceLoadErrorText"),
    $(`.${guidTranslate}change-ext-lng label`).text(getText(e, "extLanguageText")),
    $(".lexical-error-msg:not(.bookmark-error-msg)").text(getText(e, "vocabNotFoundText")),
    $(".bookmark-error-msg").text(getText(e, "bookmarkNotFoundText")),
    lexicalError = getText(e, "vocabNotFoundText"),
    bookmarkError = getText(e, "bookmarkNotFoundText"),
    areaSelectionHint = getText(e, "areaSelectionHint"),
    $(`.${guidTranslate}log-out`).text(getText(e, "logoutText")),
    $(`.${guidTranslate}speed-change-slider-header > span`).text(getText(e, "voiceSpeedText")),
    $(`.${guidTranslate}change-voice-gender > span`).text(getText(e, "voiceText")),
    $(`.${guidTranslate}change-translation-type > span`).text(getText(e, "chooseTranslator")),
    $(`.${guidTranslate}settings-radio:not(.settings-second-radio) span`).text(getText(e, "maleText")),
    $(`.${guidTranslate}settings-radio-translation:not(.settings-second-radio) span`).text("uLanguage"),
    $(".settings-second-radio span").text(getText(e, "femaleText")),
    $(".settings-second-radio-translation span").text("Google Translate"),
    $(`.${guidTranslate}show-in-small-menu .${guidTranslate}left-side > span:not(.${guidTranslate}settings-gray-text)`).text(getText(e, "wordAutoTranslateText")),
    $(`.${guidTranslate}show-in-small-menu .${guidTranslate}left-side > span.${guidTranslate}settings-gray-text`).text(getText(e, "wordAutoTranslateSelectText")),
    $(`.${guidTranslate}show-translition .${guidTranslate}left-side > span:not(.${guidTranslate}settings-gray-text)`).text(getText(e, "sentenceTranslateAutoText")),
    $(`.${guidTranslate}show-translition .${guidTranslate}left-side > span.${guidTranslate}settings-gray-text`).text(getText(e, "sentenceTranslateAutoSelectText")),
    $(`.${guidTranslate}show-translation-icon .${guidTranslate}left-side > span:not(.${guidTranslate}settings-gray-text)`).text(getText(e, "translateIconTitle")),
    $(`.${guidTranslate}show-translation-icon .${guidTranslate}left-side > span.${guidTranslate}settings-gray-text`).text(getText(e, "translateIconDescription")),
    $(`.${guidTranslate}show-speak-icon .${guidTranslate}left-side > span:not(.${guidTranslate}settings-gray-text)`).text(getText(e, "speakIconTitle")),
    $(`.${guidTranslate}show-speak-icon .${guidTranslate}left-side > span.${guidTranslate}settings-gray-text`).text(getText(e, "speakIconDescription")),
    $("#ui-id-1").text(getText(e, "generalTabText")),
    $("#ui-id-2").text(getText(e, "accountTabText")),
    $("#ui-id-3").text(getText(e, "infoTabText")),
    $("#ui-id-4").text(getText(e, "aboutTabText")),
    $(`#${guidTranslate}settings-tab .${guidTranslate}info-headline`).text(getText(e, "infoDnwTabText")),
    $(`#${guidTranslate}settings-tab .${guidTranslate}info-btn-download`).text(getText(e, "downloadBtnText")),
    $(`label[for='${guidTranslate}analytics']`).text(getText(e, "collectAnalytics")),
    $(`.${guidTranslate}btn-rate`).text(getText(e, "leaveFeedbackText")),
    $(`.${guidTranslate}translator-setting-headline`).text(getText(e, "settingText")),
    $(`.${guidTranslate}terms-link`).text(getText(e, "agreementText")),
    $(`.${guidTranslate}privacy-policy-link`).text(getText(e, "confidentialityText")),
    $(`.${guidTranslate}third-components`).text(getText(e, "thirdPartyComponentsText")),
    $(`.${guidTranslate}sign-in-username-container label`).text(getText(e, "usernameText")),
    $(`.${guidTranslate}sign-in-psw-container label`).text(getText(e, "passwordText")),
    $(`.${guidTranslate}psw-recovery a`).text(getText(e, "frgPasswordText")),
    $(`.${guidTranslate}sign-in-submit`).text(getText(e, "signInText")),
    $(`.${guidTranslate}create-acc a`).html(`${getText(e, "dontHaveAccountText")} <span class="${guidTranslate}text-important">${getText(e, "signUpText")}</span>`),
    $(`.${guidTranslate}reg-submit`).text(getText(e, "signUpText")),
    $(`.${guidTranslate}sign-in-acc a`).html(`${getText(e, "haveAccountText")} <span class="${guidTranslate}text-important">${getText(e, "signInText")}</span>`),
    $(`.${guidTranslate}privacy-policy`).html(`\n        <span>${getText(e, "doYouHaveText")}<br>\n        <span class="${guidTranslate}text-important ${guidTranslate}terms-link">${getText(e, "agreementText")}</span> ${getText(e, "andText")}\n                                            <span class="${guidTranslate}text-important ${guidTranslate}privacy-policy-link">${getText(e, "privacyPolicyText")}</span></span>\n    `),
    $(`#${guidTranslate}autoDetect`).text(getText(e, "autoDetectionText")),
    autoDetectionText = getText(e, "autoDetectionText"),
    $(`#${guidTranslate}btn-info`).attr("title", getText(e, "aboutText")),
    $(`#${guidTranslate}btnCloseList`).attr("title", getText(e, "closeText")),
    $(`#${guidTranslate}btnCloseSupport`).attr("title", getText(e, "closeText")),
    $(`#${guidTranslate}btnCloseAbout`).attr("title", getText(e, "closeText")),
    $(`#${guidTranslate}btn-swap`).attr("title", getText(e, "swapText")),
    $(`.${guidTranslate}fa-volume-up`).attr("title", getText(e, "listenText")),
    $(`#${guidTranslate}linkMoreApps span`).text(getText(e, "moreAppsText")),
    $(`#${guidTranslate}btnTranslate`).text(getText(e, "translateText")),
    $(`#${guidTranslate}dictionary-title`).text(getText(e, "dictionaryText")),
    $(`#${guidTranslate}select-title`).text(getText(e, "languageSelectionText")),
    $(`#${guidTranslate}support-title`).text(getText(e, "supportText")),
    $(`#${guidTranslate}emailText`).text(getText(e, "emailText")),
    $(`#${guidTranslate}messageText`).text(getText(e, "messageText")),
    $(`#${guidTranslate}btnSupportSend`).text(getText(e, "sendText")),
    $("#btnPrivacy").text(getText(e, "confidentialityText")),
    $("#btnTerms").text(getText(e, "termsText")),
    $("#btnSupport").text(getText(e, "supportText")),
    $("#btnRate").text(getText(e, "rateText")),
    $(`#${guidTranslate}searchLanguage, #${guidTranslate}singleWordSearch`).attr("placeholder", getText(e, "searchText")),
    $(`#${guidTranslate}outputText`).attr("placeholder", getText(e, "textareaPlaceholderText")),
    $(`#${guidTranslate}sign-in-email, #${guidTranslate}reg-email`).attr("placeholder", getText(e, "emailText")),
    $(`#${guidTranslate}sign-in-psw, #${guidTranslate}reg-psw`).attr("placeholder", getText(e, "passwordText")),
    $(`#${guidTranslate}reg-name`).attr("placeholder", getText(e, "usernameText")),
    $(`#${guidTranslate}inputText`).attr("placeholder", getText(e, "fromTextAreaText"))
}
const updateSmallModalSelectedLanguage = (e, t, a) => {
    const n = `../assets/Images/flags/${e.split("_").pop().toLocaleLowerCase()}-min.png`;
    getLocalizedLanguageName(e, (r => {
        r || (r = t);
        let s = `<div class="${guidTranslate}ToDropArrow"><img src="${chrome.runtime.getURL("/assets/Images/arrow.png")}" alt="dropdown arrow"></div>`;
        $(`.${guidTranslate}init`).html(`<img class="${guidTranslate}small-select-img" src="${chrome.runtime.getURL(n)}">${s}`).attr("data-value", e).attr("data-name", r).attr("data-voice", a)
    }
    ))
}
  , updateSmallSelectedLanguages = () => {
    chrome.storage.local.get(["langDst", "langDstName", "langDstSpeakAvailable"], (function(e) {
        updateSmallModalSelectedLanguage(e.langDst, e.langDstName, e.langDstSpeakAvailable),
        toggleSpeakButtons(e.langDstSpeakAvailable)
    }
    ))
}
;
function setLanguageSelectElement(e=!1, t, a, n, r) {
    const s = a.split("_").pop().toLowerCase()
      , o = chrome.runtime.getURL(`/assets/Images/flags/${s}-min.png`);
    "from" === t && ("auto" === s ? ($("#translateUrl").hide(),
    $("#imageOcr").hide()) : ($("#translateUrl").show(),
    $("#imageOcr").show())),
    getLocalizedLanguageName(a, (a => {
        a || (a = n),
        e ? $(`#${guidTranslate}${t}`).val(a) : $(`#${guidTranslate}${t}`).html(`<div class="${guidTranslate}country-flag" data-voice="${r}"  style="background-image:url('${o}');" ></div>${a}`)
    }
    ))
}
function updateSelectedLanguages() {
    chrome.storage.local.get(["langSrc", "langSrcName", "langDst", "langDstName", "langSrcSpeakAvailable", "langDstSpeakAvailable"], (function(e) {
        setLanguageSelectElement(!1, "from", e.langSrc, e.langSrcName, e.langSrcSpeakAvailable),
        setLanguageSelectElement(!1, "to", e.langDst, e.langDstName, e.langDstSpeakAvailable)
    }
    ))
}
function getLocalizedLanguageName(e, t) {
    if ("auto" === e)
        return t(autoDetectionText);
    $.getJSON(chrome.runtime.getURL("/frame/languages.json"), (function(a) {
        chrome.storage.local.get(["appLng"], (function({appLng: n}) {
            if (a[e])
                return t(a[e][n])
        }
        ))
    }
    ))
}
function fillLanguages(e) {
    $.getJSON(browser.runtime.getURL("/frame/languages.json"), (function(t) {
        browser.storage.local.get(["languageList", "appLng", "recentLangs"], (function({languageList: a, appLng: n, recentLangs: r}) {
            void 0 === r && (r = []);
            let s = []
              , o = [];
            a.forEach((function(e) {
                let a;
                t[e.full_code] && (a = t[e.full_code][n]),
                a || (a = e.englishName.replace(/<[^>]*>?/g, "")),
                e.localizedName = a,
                r.find((t => t === e.full_code)) ? s.push(e) : o.push(e)
            }
            )),
            s = s.sort(( (e, t) => {
                let a = r.indexOf(e.full_code)
                  , n = r.indexOf(t.full_code);
                return a < n ? -1 : a > n ? 1 : 0
            }
            )),
            o = o.sort((function(e, t) {
                return e.localizedName.localeCompare(t.localizedName, n)
            }
            ));
            let l = s.concat(o);
            $(`.${guidTranslate}small-select-to`).empty(),
            $(`.${guidTranslate}listSelect`).empty(),
            l.forEach((function(e) {
                const {modes: t} = e;
                let a = !1
                  , n = !0 === e.rtl
                  , r = e.full_code.replace(/<[^>]*>?/g, "");
                const s = `assets/Images/flags/${r.split("_").pop().toLocaleLowerCase()}-min.png`;
                t && t.map((e => {
                    const {name: t, value: n} = e;
                    "Speech synthesis" === t && n && (a = !0)
                }
                ));
                let o = $(`<li>\n                                <div class="${guidTranslate}country-flag" style="background-image:url('${browser.runtime.getURL(s)}');"></div>\n                            </li>`);
                o.attr({
                    "data-value": r,
                    "data-voice": a,
                    "data-rtl": n,
                    "data-name": e.localizedName
                }),
                o.append(DOMPurify.sanitize(e.localizedName)),
                $(`.${guidTranslate}small-select-to`).append(o),
                $(`.${guidTranslate}listSelect`).append(o.clone())
            }
            )),
            $(`#${guidTranslate}fromListSelect`).prepend(`<li id="${guidTranslate}autoDetect" data-value="auto">` + autoDetectionText + "</li>"),
            $(`#${guidTranslate}fromListSelect li`).off("click").on("click", fromLangSelected),
            $(`#${guidTranslate}toListSelect li`).off("click").on("click", toLangSelected),
            e && e()
        }
        ))
    }
    ))
}
function initSmallLngList() {
    chrome.storage.local.get(["langDst", "langDstName", "langDstSpeakAvailable"], (function(e) {
        updateSmallModalSelectedLanguage(e.langDst, e.langDstName, e.langDstSpeakAvailable),
        toggleSpeakButtons(e.langDstSpeakAvailable)
    }
    ))
}
function initLangLists(e) {
    updateSelectedLanguages(),
    e && e()
}
const languageSearchSmall = e => {
    const t = $(e.target).val().trim().toUpperCase();
    $(`.${guidTranslate}small-select-to li`).each((function(e, a) {
        a.innerText.trim().toUpperCase().indexOf(t) > -1 ? a.style.display = "" : a.style.display = "none"
    }
    ))
}
  , languageSearch = () => {
    const e = $(`#${guidTranslate}searchLanguage`).val().trim().toUpperCase();
    $(`#${guidTranslate}listDiv ul:visible li`).each((function(t, a) {
        a.innerText.trim().toUpperCase().indexOf(e) > -1 ? a.style.display = "" : a.style.display = "none"
    }
    ))
}
;
function attachHandlers() {
    $(`#${guidTranslate}singleWordSearch`).off("keydown").on("keydown", onSingleWordSearch),
    $(`#${guidTranslate}btnTranslate`).off("click").on("click", onTranslateClick),
    $(`#${guidTranslate}translator-div-container .${guidTranslate}btn-speak-target .${guidTranslate}sound_inactive`).off("click").click(0, playSound),
    $(`#${guidTranslate}translator-div-container .${guidTranslate}btn-speak-source .${guidTranslate}sound_inactive`).off("click").click(1, playSound),
    $(`.${guidTranslate}btn-rate`).off("click").on("click", rateApp),
    $(`#${guidTranslate}translator-div-container`).off("click").on("click", incrementCounter()),
    $(`#${guidTranslate}from`).off("click").on("click", fromClick),
    $(`#${guidTranslate}selectLanguages .${guidTranslate}FromDropArrow`).off("click").on("click", fromClick),
    $(`#${guidTranslate}to`).off("click").on("click", toClick),
    $(`#${guidTranslate}selectLanguages .${guidTranslate}ToDropArrow`).off("click").on("click", toClick),
    $(`#${guidTranslate}fromListSelect li`).off("click").on("click", fromLangSelected),
    $(`#${guidTranslate}toListSelect li`).off("click").on("click", toLangSelected),
    $(`.${guidTranslate}languageRevers`).off("click").on("click", languageReverse),
    $(`#${guidTranslate}change-ext-lng-btn`).off("change").on("change", onAppLngChange),
    $(`.${guidTranslate}moreAplacationText`).off("click").on("click", onMediumBannerClick),
    $(`#${guidTranslate}linkMoreApps`).off("click").on("click", onAdsClick),
    $(`#${guidTranslate}btnCloseAbout`).click(closeAbout),
    $(`#${guidTranslate}btnCloseSupport`).click(closeAbout),
    $(`#${guidTranslate}btnCloseList`).click(closeLanguagesList),
    $(`.${guidTranslate}translateEngine`).click(openTranslateBy),
    $(`#${guidTranslate}searchLanguage`).on("input", languageSearch),
    $(`.${guidTranslate}small-lng-search`).on("input", languageSearchSmall),
    $(`.${guidTranslate}vcb-search-icon`).off("click").on("click", singleWordSearch),
    $(`.${guidTranslate}close_btn_delete_text:not(.${guidTranslate}position-bottom)`).click(clearBigPopupInputArea),
    $(`.${guidTranslate}copy-text-btn`).click(copyTextToClipBoard),
    $(`.${guidTranslate}tab-container-item`).click(onTabClick),
    $(`.${guidTranslate}class-trn-close-div`).click(closeSettingPage),
    $(`#${guidTranslate}inputText, #${guidTranslate}outputText`).bind("input propertychange", textareaFromChange),
    $(`.${guidTranslate}site-icons#translateUrl`).off("click").on("click", translateUrlClick),
    $("#imageOcr").off("click").on("click", captureEntryPage),
    $(document).on("change", `input[id="${guidTranslate}analytics"]`, analyticsCheckboxChange),
    $(`.${guidTranslate}bottom-icons #clear`).off("click").on("click", clearBookmarks),
    $(`.${guidTranslate}history-clear-icons #clear`).off("click").on("click", clearHistory),
    $(`#${guidTranslate}inputText`).bind("paste", (e => {
        let t = e.originalEvent.clipboardData.getData("text");
        return $(`#${guidTranslate}inputText`).val(t),
        translate(),
        !1
    }
    )),
    $(`#${guidTranslate}inputText`).change((function() {
        saveInputText()
    }
    )),
    $("input[name=gender]").change((function() {
        onVoiceGenderChange($(this).val())
    }
    )),
    $("input:radio[name=translationType]").click((function() {
        onTypeTranslationChange($(this).val())
    }
    ))
}
function onAppLngChange(e) {
    const {value: t} = e.target;
    chrome.storage.local.set({
        appLng: t
    }),
    generateLocaliseSelect(),
    localize(t),
    loadStorageVars()
}
function onMediumBannerClick(e) {
    let t = $(e.target).closest(`.${guidTranslate}moreAplacationText`);
    t.find("a").attr("href"),
    t.find("span").text()
}
function onAdsClick(e) {
    let t = $(e.target).closest(`#${guidTranslate}linkMoreApps`);
    t.attr("href"),
    t.text()
}
function onVoiceGenderChange(e) {
    chrome.storage.local.set({
        voiceGender: e
    })
}
function onTypeTranslationChange(e) {
    chrome.storage.local.set({
        translationType: e
    })
}
function captureEntryPage() {
    "undefined" != typeof hideBigPopup ? (hideBigPopup(),
    window.OCRTranslator._initializing ? window.onOCRRecapture() : window.OCRTranslator.init()) : chrome.runtime.sendMessage({
        msg: "start_bg_image_capturing"
    }, (e => {
        "ok" === e && window.close()
    }
    ))
}
const onSettingsBtnChange = (e, t) => {
    "words" === t ? chrome.storage.local.set({
        allowWordAuto: e
    }) : "sentence" === t ? chrome.storage.local.set({
        allowSentenceAuto: e
    }) : "icon" === t ? chrome.storage.local.set({
        showTranslateIcon: e
    }) : "speak" === t && chrome.storage.local.set({
        showSpeakIcon: e
    })
}
  , textareaFromChange = ({target: e}) => {
    const t = e.value;
    isEmptyString(t.trim()) ? hideSoundAndDeleteBtn() : showSoundAndDeleteBtn()
}
  , isEmptyString = e => {
    try {
        return "" === e.trim() || !e || " " === e.trim() || 0 === e.trim().length
    } catch (e) {
        return !1
    }
}
;
function closeSettingPage() {
    $(`#${guidTranslate}regular-translator-header`).hide(),
    $(`#${guidTranslate}setting-translator-header`).hide(),
    $(`#${guidTranslate}translator-div-container`).css({
        height: "502px"
    }),
    $("#c12b5a4e69860bc968b47223fd-welcome-tab").is(":visible") ? startButtonClick() : showTabByName("translate")
}
let copyToggle;
const copyTextToClipBoard = e => {
    let t = $(`#${guidTranslate}outputText`);
    clearTimeout(copyToggle),
    copyToggle = setTimeout(( () => {
        t.removeClass("copyTextColor")
    }
    ), 500),
    t.addClass("copyTextColor"),
    navigator.clipboard.writeText(` ${t.val()}`).then(( () => {}
    )).catch((e => {}
    ))
}
  , hideSoundAndDeleteBtn = () => {
    isEmptyString($(`#${guidTranslate}outputText`).val()) && $(`.${guidTranslate}btn-speak-target`).hide(),
    isEmptyString($(`#${guidTranslate}inputText`).val()) && ($(`.${guidTranslate}close_btn_delete_text`).hide(),
    $(`.${guidTranslate}btn-speak-source`).hide())
}
  , showSoundAndDeleteBtn = () => {
    let e = $(`.${guidTranslate}btn-speak-target`)
      , t = $(`.${guidTranslate}btn-speak-source`)
      , a = !$(`#${guidTranslate}to > div`).data("voice") || !1
      , n = !$(`#${guidTranslate}from > div`).data("voice") || !1;
    isEmptyString($(`#${guidTranslate}outputText`).val()) || a ? a && e.hide() : e.show(),
    isEmptyString($(`#${guidTranslate}inputText`).val()) || ($(`.${guidTranslate}close_btn_delete_text`).show(),
    n ? n && t.hide() : t.show())
}
;
function clearBigPopupInputArea(e) {
    $(`#${guidTranslate}inputText`).val(""),
    $(`#${guidTranslate}outputText`).val(""),
    hideSoundAndDeleteBtn(),
    stopAudioPlay(`.${guidTranslate}sound_activate`),
    saveInputText()
}
function toggleSpeakButtons(e) {
    const t = $(`.${guidTranslate}speaker-icon-container`);
    !0 === e ? t.visible() : t.invisible()
}
isEmptyString(textareaFrom.val()) && hideSoundAndDeleteBtn();
const onSingleWordSearch = e => {
    if (32 === e.which)
        return !1;
    13 === e.which && singleWordSearch()
}
  , singleWordSearch = () => {
    getLexicalMeaning("en_GB", "en_GB", $(`#${guidTranslate}singleWordSearch`).val())
}
;
function readBackensterParams(e) {
    debug_log("readBackensterParams"),
    $.ajax({
        type: "post",
        timeout: 15e3,
        url: "https://backenster.com/api/app/config",
        cache: !1,
        dataType: "json",
        data: {
            appKey: window.mtzEnv.backensterKey,
            uuid: uuidv
        },
        success: function({config: t, err: a}) {
            if (a)
                ;
            else if (t) {
                const {AdChangeInterval: e, CharacterCountRequestLimitFree: a, RatingTranslationEventCount: n, TTSRequestLimit: r} = t;
                backensterConfig = t,
                backensterAdChangeInterval = backensterAdChangeInterval || e,
                backensterCharacterCountRequestLimitFree = backensterCharacterCountRequestLimitFree || a,
                backensterRatingTranslationEventCount = backensterRatingTranslationEventCount || n,
                backensterTTSRequestLimit = backensterTTSRequestLimit || r
            }
            hideOutputProgress(),
            e && e()
        },
        error: function(t) {
            e && e()
        }
    })
}
function openTranslateBy() {
    if (translatorLink) {
        let e = window.open(translatorLink, "_blank");
        e ? e.focus() : alert("Please allow popups")
    }
}
function fromClick(e) {
    debug_log("fromClick");
    getPopupNameById(getParentPopupByTarget(e.target)[0].id);
    let t = document.getElementById(`${guidTranslate}listDiv`)
      , a = "none" !== t.style.display
      , n = "block" === document.getElementById(`${guidTranslate}fromListSelect`).style.display;
    a && closeLanguagesList(e),
    a && n || (t.style.display = "block",
    $(`.${guidTranslate}FromDropArrow`).addClass(`${guidTranslate}arrowClosed`).animate("fast"),
    $(`#${guidTranslate}listDiv`).removeClass(`${guidTranslate}alignRight`),
    $(`.${guidTranslate}translator-list #${guidTranslate}to .${guidTranslate}country-flag`).removeClass(`${guidTranslate}showCloudArrow`),
    $(`.${guidTranslate}translator-list #${guidTranslate}from .${guidTranslate}country-flag`).addClass(`${guidTranslate}showCloudArrow`),
    document.getElementById(`${guidTranslate}fromListSelect`).style.display = "block",
    document.getElementById(`${guidTranslate}toListSelect`).style.display = "none")
}
function setLanguagesListPosition(e, t) {
    let a = e.getBoundingClientRect()
      , n = a.top;
    a.bottom > (window.innerHeight || document.documentElement.clientHeight) && (n -= a.bottom - (window.innerHeight || document.documentElement.clientHeight))
}
function toClick(e) {
    debug_log("toClick");
    getPopupNameById(getParentPopupByTarget(e.target)[0].id);
    let t = document.getElementById(`${guidTranslate}listDiv`)
      , a = "none" !== t.style.display
      , n = "block" === document.getElementById(`${guidTranslate}toListSelect`).style.display;
    a && closeLanguagesList(e),
    a && n || (t.style.display = "block",
    $(`.${guidTranslate}ToDropArrow`).addClass(`${guidTranslate}arrowClosed`).animate("fast"),
    $(`#${guidTranslate}listDiv`).addClass(`${guidTranslate}alignRight`),
    $(`.${guidTranslate}translator-list #${guidTranslate}from .${guidTranslate}country-flag`).removeClass(`${guidTranslate}showCloudArrow`),
    $(`.${guidTranslate}translator-list #${guidTranslate}to .${guidTranslate}country-flag`).addClass(`${guidTranslate}showCloudArrow`),
    document.getElementById(`${guidTranslate}fromListSelect`).style.display = "none",
    document.getElementById(`${guidTranslate}toListSelect`).style.display = "block")
}
const resetSearchInputOnLangSelect = () => {
    $(`#${guidTranslate}searchLanguage`).val("")
}
;
function fromLangSelected(e) {
    debug_log("fromLangSelected");
    getPopupNameById(getParentPopupByTarget(e.target)[0].id);
    closeLanguagesList(e);
    let t = $(this).data("value")
      , a = $(this).data("voice") || !1
      , n = $(this).text();
    $(`.${guidTranslate}search-container input:not(.${guidTranslate}small-lng-search)`).val();
    setLanguageSelectElement(!1, "from", t, n, a),
    chrome.storage.local.set({
        langSrc: t,
        langSrcName: n,
        langSrcSpeakAvailable: a
    }),
    chrome.storage.local.get(["recentLangs"], (function({recentLangs: e}) {
        void 0 === e && (e = []);
        let a = e.indexOf(t);
        -1 !== a && e.splice(a, 1),
        e.unshift(t) > 5 && e.pop(),
        chrome.storage.local.set({
            recentLangs: e
        }),
        fillLanguages()
    }
    ));
    let r = $(`.${guidTranslate}btn-speak-source`);
    a ? r.show() : r.hide(),
    resetSearchInputOnLangSelect(),
    listSearchReset("fromListSelect"),
    translate()
}
function toLangSelected(e) {
    getPopupNameById(getParentPopupByTarget(e.target)[0].id);
    closeLanguagesList(e);
    let t = $(this).data("value")
      , a = $(this).data("voice") || !1
      , n = $(this).text();
    $(`.${guidTranslate}search-container input:not(.${guidTranslate}small-lng-search)`).val();
    setLanguageSelectElement(!1, "to", t, n, a);
    let r = $(`.${guidTranslate}btn-speak-target`);
    a ? r.show() : r.hide(),
    chrome.storage.local.set({
        langDst: t,
        langDstName: n,
        langDstSpeakAvailable: a
    }),
    resetSearchInputOnLangSelect(),
    listSearchReset("toListSelect"),
    translate()
}
const initStorage = () => {}
  , listSearchReset = e => {
    $(`#${guidTranslate + e} li`).each((function(e, t) {
        t.style.display = ""
    }
    ))
}
;
function compareLangsLocalized(e, t) {
    return e.localizedName < t.localizedName ? -1 : e.localizedName > t.localizedName ? 1 : 0
}
const generateId = () => "_" + Math.random().toString(36).substr(2, 9)
  , handleTabsUpdate = () => {
    debug_log("handleTabsUpdate"),
    chrome.storage.local.get(["translateHistory"], (function({translateHistory: e}) {
        void 0 === e && (e = []),
        e = e.filter((e => !0 !== e.remove)),
        showTranslateHistory(e),
        showBookmarkList(e)
    }
    )),
    getSettingsValues()
}
  , getSettingsValues = () => {
    chrome.storage.local.get(["allowWordAuto", "allowSentenceAuto", "showTranslateIcon", "showSpeakIcon", "speedOfText", "voiceGender", "translationType"], (function({allowWordAuto: e, allowSentenceAuto: t, showTranslateIcon: a, showSpeakIcon: n, speedOfText: r, voiceGender: s, translationType: o}) {
        $("input[name=gender]").prop("checked", !1),
        $(`input[name=gender][value=${s}]`).prop("checked", !0),
        o || (o = "ULanguage"),
        $("input[name=translationType]").prop("checked", !1),
        $(`input[name=translationType][value=${o}]`).prop("checked", !0),
        $(`#${guidTranslate}slider-range-min`).slider("value", r || 100),
        $(`#${guidTranslate}switchBtn`).btnSwitch({
            Theme: "iOS",
            OnCallback: e => onSettingsBtnChange(e, "words"),
            OffCallback: e => onSettingsBtnChange(e, "words"),
            ToggleState: !0 === e
        }),
        $(`#${guidTranslate}switchBtnSecond`).btnSwitch({
            Theme: "iOS",
            OnCallback: e => onSettingsBtnChange(e, "sentence"),
            OffCallback: e => onSettingsBtnChange(e, "sentence"),
            ToggleState: !0 === t
        }),
        $(`#${guidTranslate}switchBtnTranslateIcon`).btnSwitch({
            Theme: "iOS",
            OnCallback: e => onSettingsBtnChange(e, "icon"),
            OffCallback: e => onSettingsBtnChange(e, "icon"),
            ToggleState: !0 === a
        }),
        $(`#${guidTranslate}switchBtnSpeakIcon`).btnSwitch({
            Theme: "iOS",
            OnCallback: e => onSettingsBtnChange(e, "speak"),
            OffCallback: e => onSettingsBtnChange(e, "speak"),
            ToggleState: !0 === n
        })
    }
    ))
}
  , showTranslateHistory = e => {
    let t = "";
    if ($(`.${guidTranslate}history-link`).empty(),
    e.length > 0) {
        const t = chrome.runtime.getURL("assets/Images/added-bookmark-icon.svg")
          , a = chrome.runtime.getURL("assets/Images/add-bookmark-icon.svg")
          , n = chrome.runtime.getURL("assets/Images/arrow_right.svg")
          , r = chrome.runtime.getURL("assets/Images/delete-icon.svg");
        getTemplate("/frame/history-item.html").then((function(s) {
            s = s[0].innerHTML,
            e.map(( ({from: e, id: o, originalText: l, to: i, translatedText: g, toName: c, fromName: d, bookmark: u}, T) => {
                if (T > 100)
                    return !1;
                const m = chrome.runtime.getURL("assets/Images/flags/" + e.split("_").pop().toLocaleLowerCase().replace(/\s/g, "") + "-min.png")
                  , p = chrome.runtime.getURL("assets/Images/flags/" + i.split("_").pop().toLocaleLowerCase().replace(/\s/g, "") + "-min.png");
                let h = {
                    guid: guidTranslate,
                    id: o,
                    "bookmark-icon-src": u ? t : a,
                    "arrow-icon-src": n,
                    "delete-icon-src": r,
                    flagFrom: m,
                    flagTo: p,
                    fromName: d,
                    toName: c,
                    originalText: l,
                    translatedText: g
                }
                  , f = Mustache.render(s, h);
                $(`.${guidTranslate}history-link`).append(f)
            }
            )),
            $(`.${guidTranslate}history-item-bookmark img`).click(toggleBookmarkHistoryList),
            $(`.${guidTranslate}history-item-remove img`).click(removeTranslateHistoryItem)
        }
        ))
    } else
        t = `<span class='center-msg history-empty-msg'>${historyEmptyText}</span>`,
        $(`.${guidTranslate}history-link`).html(t)
}
  , generateBookmarkItem = (e, t, a, n, r, s, o, l, i, g) => `\n\n                 <li class="${guidTranslate}bookmark-item" data-id = "${e}">\n                <div class="${guidTranslate}bookmark-item-bookmark">\n                    <img src="${t}" alt="add to bookmark">\n                </div>\n                <div class="${guidTranslate}bookmark-item-container">\n\n                    <div class="${guidTranslate}bookmark-item-lng">\n                        <div class="${guidTranslate}bookmark-item-lng-from">\n                            <img src='${chrome.runtime.getURL(a)}'>\n                            <span title="${n}" class="${guidTranslate}bookmark-lng-name-from">\n                                ${n}\n                            </span>\n                        </div>\n                        <img class="${guidTranslate}arrow-right" src="${r}" alt="arrow right">\n                        <div class="${guidTranslate}bookmark-item-lng-to">\n                            <img src='${chrome.runtime.getURL(s)}'>\n                            <span title="${o}" class="${guidTranslate}bookmark-lng-name-to">\n                                 ${o}\n                            </span>\n                        </div>\n                    </div>\n\n                    <span title="${l}" class="${guidTranslate}bookmark-item-text-from">\n                        ${l}\n                    </span>\n\n                    <span title="${i}" class="${guidTranslate}bookmark-item-text-to">\n                        ${i}\n                    </span>\n\n                </div>\n                <div class="${guidTranslate}bookmark-item-remove">\n                    <img src="${g}" alt="delete history element">\n                </div>\n            </li>\n\n                `
  , showBookmarkList = e => {
    let t = e.filter((e => !0 === e.bookmark))
      , a = "";
    if (t.length > 0) {
        t.reverse();
        const e = chrome.runtime.getURL("assets/Images/added-bookmark-icon.svg")
          , n = chrome.runtime.getURL("assets/Images/arrow_right.svg")
          , r = chrome.runtime.getURL("assets/Images/delete-icon.svg");
        t.map(( ({from: t, id: s, originalText: o, to: l, translatedText: i, toName: g, fromName: c, bookmark: d}) => {
            if (!1 !== d && d) {
                const d = `/assets/Images/flags/${t.split("_").pop().toLocaleLowerCase().replace(/\s/g, "")}-min.png`
                  , u = `/assets/Images/flags/${l.split("_").pop().toLocaleLowerCase().replace(/\s/g, "")}-min.png `;
                a += generateBookmarkItem(s, e, d, c, n, u, g, o, i, r)
            }
            $(`.${guidTranslate}extension-tabs .${guidTranslate}bottom-icons`).show()
        }
        ))
    } else
        a = `<span class='center-msg bookmark-error-msg'>${bookmarkError}</span>`,
        $(`.${guidTranslate}extension-tabs .${guidTranslate}bottom-icons`).hide();
    $(`.${guidTranslate}bookmark-link`).html(a),
    $(`.${guidTranslate}bookmark-item-remove img, .${guidTranslate}bookmark-item-bookmark img`).click(removeBookmarkItem)
}
  , removeTranslateHistoryItem = e => {
    bookmarkItem($(e.target).parent().parent().data("id").toString(), !0, !1, ( () => {
        handleTabsUpdate()
    }
    ))
}
;
function clearHistory(e) {
    debug_log("clear history"),
    chrome.storage.local.get(["translateHistory"], (function({translateHistory: e}) {
        let t = e;
        for (key of t)
            key.remove = !0;
        chrome.storage.local.set({
            translateHistory: e
        }, ( () => {
            chrome.runtime.sendMessage({
                msg: "syncBookmarks"
            }, ( () => {
                handleTabsUpdate()
            }
            ))
        }
        ))
    }
    ))
}
const getHistoryItemParent = e => "flex" === $(`#${guidTranslate}small-translator-div`).css("display") ? $(e).closest(`#${guidTranslate}small-translator-div`).find(`.${guidTranslate}translatedText`) : $(`#${guidTranslate}medium-translator-div`).is(":visible") ? $(e).closest(`#${guidTranslate}medium-translator-div`).find(`.${guidTranslate}translatedText`) : $(e).parent().parent();
function clearBookmarks() {
    chrome.storage.local.get(["translateHistory"], (function({translateHistory: e}) {
        e.filter((e => !0 === e.bookmark)).map((e => {
            e.bookmark = !1,
            e.synced = !1
        }
        )),
        chrome.storage.local.set({
            translateHistory: e
        }, ( () => {
            chrome.runtime.sendMessage({
                msg: "syncBookmarks"
            }, ( () => {
                handleTabsUpdate()
            }
            ))
        }
        ))
    }
    ))
}
function bookmarkItem(e, t, a, n) {
    chrome.storage.local.get(["translateHistory"], (function({translateHistory: r}) {
        void 0 === r && (r = []);
        let s = r.find((t => t.id === e.toString()));
        void 0 !== s && (s.bookmark = void 0 !== a ? a : !s.bookmark,
        s.remove = t,
        s.synced = !1,
        debug_log(s)),
        chrome.storage.local.set({
            translateHistory: r
        }, ( () => {
            chrome.runtime.sendMessage({
                msg: "syncBookmarks"
            }, ( () => {
                n && n(r)
            }
            ))
        }
        ))
    }
    ))
}
function toggleBookmark(e) {
    debug_log("toggleBookmark");
    getPopupNameById(getParentPopupByTarget(e.target)[0].id);
    const t = getHistoryItemParent(e.target).attr("data-id");
    $(`.${guidTranslate}bookmark-icon`).hasClass(`${guidTranslate}svg-red`) ? ($(`.${guidTranslate}bookmark-icon`).removeClass(`${guidTranslate}svg-red`),
    bookmarkItem(t, !1, !1, ( () => {
        handleTabsUpdate()
    }
    ))) : ($(`.${guidTranslate}bookmark-icon`).addClass(`${guidTranslate}svg-red`),
    bookmarkItem(t, !1, !0, ( () => {
        handleTabsUpdate()
    }
    )))
}
const toggleBookmarkHistoryList = e => {
    debug_log("toggleBookmarkHistoryList");
    let t = getHistoryItemParent(e.target);
    getPopupNameById(getParentPopupByTarget(e.target)[0].id);
    bookmarkItem(t.attr("data-id"), !1, void 0, ( () => {
        handleTabsUpdate()
    }
    ))
}
;
function removeBookmarkItem({target: e}) {
    debug_log("removeBookmarkItem");
    let t = getHistoryItemParent(e).attr("data-id");
    $(`.${guidTranslate}bookmark-icon`).removeClass(`${guidTranslate}svg-red`),
    bookmarkItem(t, !1, !1, ( () => {
        handleTabsUpdate()
    }
    ))
}
const addToTranslateHistory = (e, t, a, n, r, s, o) => {
    let l = {
        id: o,
        from: e,
        fromName: t.trim(),
        toName: n.trim(),
        to: a,
        originalText: r,
        bookmark: !1,
        translatedText: s,
        time: Date.now(),
        remove: !1
    };
    debug_log("addToTranslateHistory " + r + " id: " + o),
    chrome.storage.local.get(["translateHistory"], (function({translateHistory: e}) {
        void 0 === e && (e = []);
        let t = e.find((e => e.from === l.from && e.to === l.to && e.originalText === l.originalText));
        void 0 !== t ? (t.time = Date.now(),
        t.remove = !1,
        "flex" === $(`#${guidTranslate}small-translator-div`).css("display") ? $(`#${guidTranslate}small-translator-div`).find(`.${guidTranslate}translatedText`).attr("data-id", t.id) : $(`#${guidTranslate}medium-translator-div`).is(":visible") && $(`#${guidTranslate}medium-translator-div`).find(`.${guidTranslate}translatedText`).attr("data-id", t.id),
        t.bookmark ? $(`.${guidTranslate}bookmark-icon`).addClass(`${guidTranslate}svg-red`) : $(`.${guidTranslate}bookmark-icon`).removeClass(`${guidTranslate}svg-red`)) : (e.push(l),
        debug_log("Added to history: " + l.originalText)),
        e.sort(( (e, t) => e.time > t.time ? -1 : 1)),
        chrome.storage.local.set({
            translateHistory: e
        }, (function() {
            handleTabsUpdate()
        }
        ))
    }
    ))
}
  , showMediumLoader = () => {
    debug_log("showMediumLoader"),
    $(`.${guidTranslate}spinner-gif-medium`).show(),
    $(`.${guidTranslate}spinner-gif-small`).show(),
    $(`.${guidTranslate}icon-nav`).hide(),
    $(`.${guidTranslate}translate-small-div-bottom`).hide()
}
  , hideMediumLoader = () => {
    debug_log("hideMediumLoader"),
    $(`.${guidTranslate}spinner-gif-medium`).hide(),
    $(`.${guidTranslate}spinner-gif-small`).hide(),
    $(`.${guidTranslate}icon-nav`).show()
}
  , selectDetectedLanguageFromServer = (e, t) => {
    t ? $(`.${guidTranslate}small-select-to li`).each((function() {
        let t = $(this).data("value");
        if (t.startsWith(e)) {
            let e = $(this).data("voice") || !1;
            const a = $(this).data("name");
            return chrome.storage.local.set({
                langSrc: t,
                langSrcName: a,
                langSrcSpeakAvailable: e
            }),
            from = t,
            !1
        }
    }
    )) : $(`#${guidTranslate}fromListSelect li`).each((function() {
        let t = $(this).data("value");
        if (t.startsWith(e)) {
            let e = $(this).data("voice") || !1;
            const a = $(this).text().trim();
            return setLanguageSelectElement(!1, "from", t, a, e),
            showSoundAndDeleteBtn(),
            chrome.storage.local.set({
                langSrc: t,
                langSrcName: a,
                langSrcSpeakAvailable: e
            }),
            from = t,
            !1
        }
    }
    ))
}
  , onSmallTranslateSuccess = (e, t, a, n, r, s) => {
    const o = generateId();
    if (e.err)
        t.text(e.err),
        hideMediumLoader(),
        showTranslateError(t);
    else {
        if (lastTextTranslation = e.result,
        t.text(e.result).attr("data-id", o),
        translateCount >= backensterAdChangeInterval && (activeAdIndex++,
        chrome.storage.local.set({
            mtzTranslateCount: 1
        }),
        readTranslateCount(),
        showAdsBanner(!0)),
        hideMediumLoader(),
        !e.result || 0 === e.result.length || !String(e.result).trim())
            return t.text(translationErrorMsg),
            !1;
        e.from && selectDetectedLanguageFromServer(e.from, !0)
    }
    addToTranslateHistory(from, a, r, n, s, e.result, o),
    isTranslating = !1,
    incrementTranslateCount()
}
;
function getTranslatedTextTarget(e) {
    let t = $(`.${guidTranslate}translatedText`);
    return "medium" === e ? t = $(`#${guidTranslate}medium-translator-div .${guidTranslate}translatedText`) : "small" === e && (t = $(`#${guidTranslate}small-translator-div .${guidTranslate}translatedText`)),
    t
}
const oneWordTranslate = (e, t) => {
    if (!e)
        return;
    if (0 === (e = e.trim()).length || 1 === e.length && !logographicScripts.includes(from))
        return;
    if (e.length > backensterCharacterCountRequestLimitFree)
        return void showLimitError();
    lastTextOriginal = e,
    debug_log("showMediumLoader"),
    $(`.${guidTranslate}spinner-gif-medium`).show(),
    $(`.${guidTranslate}spinner-gif-small`).show(),
    $(`.${guidTranslate}icon-nav`).hide(),
    $(`.${guidTranslate}translate-small-div-bottom`).hide();
    let a = getTranslatedTextTarget(t);
    a.text("");
    try {
        chrome.storage.local.get(["langDst", "langDstName", "langSrc", "langSrcName", "translationType"], (function(t) {
            debug_log("Translate from:'" + t.langSrc + "' to:'" + t.langDst + "' text:'" + e + "' length: " + e.length),
            isTranslating = !0;
            let n = {
                lang_src: t.langSrc,
                lang_dst: t.langDst,
                text: e
            };
            "ULanguage" === t.translationType ? useULanguageTranslatorSmallPopup(t, e, a, n) : useGoogleTranslateSmallPopup(t, e, a, n)
        }
        ))
    } catch (e) {
        isTranslating = !1,
        hideMediumLoader(),
        showTranslateError(a)
    }
    return !1
}
;
function validURL(e) {
    return !!new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i").test(e)
}
function onTranslateClick() {
    translate()
}
function translate() {
    const e = $(`#${guidTranslate}outputText`)
      , t = $(`#${guidTranslate}inputText`);
    let a = t.val();
    if (a)
        if (validURL(a))
            translateWebsite(a, !1);
        else {
            if (!(a.length > backensterCharacterCountRequestLimitFree)) {
                lastTextOriginal = a,
                e.val("");
                try {
                    chrome.storage.local.get(["langSrc", "langSrcName", "langDst", "langDstName", "translationType"], (function(n) {
                        if (debug_log("Translate from:'" + n.langSrc + "' to:'" + n.langDst + "' text:'" + a + "' length: " + a.length),
                        0 === a.length || 1 === a.length && !logographicScripts.includes(n.langSrc))
                            return;
                        if (n.langSrc === n.langDst)
                            return void e.val(t.val());
                        isTranslating = !0,
                        showOutputProgress();
                        let r = {
                            lang_src: n.langSrc,
                            lang_dst: n.langDst,
                            text: a
                        };
                        "ULanguage" === n.translationType ? useULanguageTranslatorBigPopup(n, a, e, r) : useGoogleTranslateBigPopup(n, a, e, r)
                    }
                    ))
                } catch (t) {
                    isTranslating = !1,
                    showTranslateError(e)
                }
                return !1
            }
            showLimitError()
        }
}
function useULanguageTranslatorBigPopup(e, t, a, n) {
    $.ajax({
        type: "post",
        timeout: 15e3,
        headers: {
            Authorization: "Fujiwaranosai"
        },
        url: "https://backenster.com/v2/api/v3/translate/",
        dataType: "json",
        data: {
            from: "auto" === e.langSrc ? null : e.langSrc,
            to: e.langDst,
            text: t,
            platform: PLATFORM_NAME,
            uuid: uuidv
        },
        cache: !0,
        success: function(a) {
            isTranslating = !1,
            n.result = a.result,
            onBigModalTranslateSuccess(a, t, e.langDst, e.langSrc),
            translateCount >= backensterAdChangeInterval && (activeAdIndex++,
            chrome.storage.local.set({
                mtzTranslateCount: 1
            }),
            readTranslateCount(),
            showAdsBanner(!0));
            const r = generateId();
            addToTranslateHistory(e.langSrc, e.langSrcName, e.langDst, e.langDstName, t, a.result, r),
            hideOutputProgress(),
            incrementTranslateCount(),
            checkAppRateShown(translateCount, backensterRatingTranslationEventCount)
        },
        error: function(e) {
            n.error = e.responseText,
            isTranslating = !1,
            hideOutputProgress(),
            hideSmallPopup(),
            hideMediumPopup(),
            updateExtensionData(),
            showTranslateError(a)
        }
    })
}
function translateUrlClick(e) {
    chrome.tabs ? chrome.tabs.query({
        active: !0,
        currentWindow: !0
    }, (function(e) {
        translateWebsite(e[0].url, !0)
    }
    )) : translateWebsite(window.location.href, !0)
}
function translateWebsite(e, t) {
    const a = $(`#${guidTranslate}outputText`)
      , n = $(`#${guidTranslate}inputText`);
    n.val(e),
    a.val("");
    try {
        chrome.storage.local.get(["langSrc", "langSrcName", "langDst", "langDstName"], (function(r) {
            if (r.langSrc === r.langDst)
                return void a.val(n.val());
            isTranslating = !0,
            showOutputProgress();
            let s = {
                lang_src: r.langSrc,
                lang_dst: r.langDst,
                url: e
            };
            $.ajax({
                type: "post",
                timeout: 15e3,
                headers: {
                    Authorization: "Fujiwaranosai"
                },
                url: "https://backenster.com/translateWebpageAPI",
                cache: !1,
                dataType: "json",
                data: {
                    from: "auto" === r.langSrc ? null : r.langSrc,
                    to: r.langDst,
                    url: e,
                    platform: PLATFORM_NAME,
                    uuid: uuidv
                },
                success: function(e) {
                    isTranslating = !1,
                    e.err ? (updateExtensionData(),
                    showTranslateError(a),
                    s.error = e.err) : (s.result = e.result,
                    a.val(e.result),
                    t && chrome.tabs.create({
                        url: e.result
                    }),
                    translateCount >= backensterAdChangeInterval && (activeAdIndex++,
                    chrome.storage.local.set({
                        mtzTranslateCount: 1
                    }),
                    readTranslateCount(),
                    showAdsBanner(!0)),
                    hideOutputProgress(),
                    incrementTranslateCount(),
                    checkAppRateShown(translateCount, backensterRatingTranslationEventCount))
                },
                error: function(e) {
                    let t = e.responseText || e.statusText;
                    s.error = t,
                    isTranslating = !1,
                    hideOutputProgress(),
                    showTranslateError(a)
                }
            })
        }
        ))
    } catch (e) {
        isTranslating = !1,
        showTranslateError(a)
    }
    return !1
}
function showTranslateError(e) {
    e.text(translationErrorMsg)
}
useULanguageTranslatorSmallPopup = (e, t, a, n) => {
    $.ajax({
        type: "post",
        timeout: 15e3,
        headers: {
            Authorization: "Fujiwaranosai"
        },
        url: "https://backenster.com/v2/api/v3/translate/",
        cache: !0,
        dataType: "json",
        data: {
            from: "auto" === e.langSrc ? null : e.langSrc,
            to: e.langDst,
            text: t,
            platform: PLATFORM_NAME,
            uuid: uuidv
        },
        success: function(r) {
            n.result = r.result,
            isTranslating = !1,
            onSmallTranslateSuccess(r, a, e.langSrcName, e.langDstName, e.langDst, t),
            checkAppRateShown(translateCount, backensterRatingTranslationEventCount),
            getLexicalMeaning(e.langSrc, e.langDst, t)
        },
        error: function(e) {
            n.error = e.responseText,
            isTranslating = !1,
            hideOutputProgress(),
            hideMediumLoader(),
            showTranslateError(a)
        }
    })
}
,
useGoogleTranslateSmallPopup = (e, t, a, n) => {
    $.ajax({
        url: "https://translate.googleapis.com/translate_a/single?dt=t&dt=bd&dt=qc&dt=rm&dt=ex",
        type: "GET",
        dataType: "json",
        headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        data: {
            client: "gtx",
            hl: e.langDst.slice(0, 2),
            sl: "auto" === e.langSrc ? "auto" : e.langSrc,
            tl: e.langDst.slice(0, 2),
            q: t,
            dj: 1
        },
        success: r => {
            let s, o = r.sentences.filter((e => !0 == !!e.trans)), l = r.sentences.filter((e => !0 == !!e.translit));
            s = 0 !== l.length ? l[0].translit : "";
            let i = o.map((e => e.trans)).join("")
              , g = o.map((e => e.orig)).join("")
              , c = {
                err: null,
                from: r.src,
                result: i,
                source: g,
                sourceTransliteration: g,
                targetTransliteration: s || "",
                translator: "",
                translatorLink: ""
            };
            n.result = c.result,
            isTranslating = !1,
            onSmallTranslateSuccess(c, a, e.langSrcName, e.langDstName, e.langDst, t),
            checkAppRateShown(translateCount, backensterRatingTranslationEventCount),
            getLexicalMeaning(e.langSrc, e.langDst, t)
        }
        ,
        error: e => {
            n.error = e.responseText,
            isTranslating = !1,
            hideOutputProgress(),
            hideMediumLoader(),
            showTranslateError(a)
        }
    })
}
,
onBigModalTranslateSuccess = (e, t, a, n) => {
    if ($(`#${guidTranslate}outputText`).val(e.result),
    showSoundAndDeleteBtn(),
    "auto" === n && e.from && selectDetectedLanguageFromServer(e.from),
    e.result && isOneWord(t) && (n.startsWith("en") || a.startsWith("en"))) {
        let n = a.startsWith("en") ? e.result.replace(/<[^>]*>?/g, "") : t;
        getLexicalMeaning("en_GB", a, n)
    }
}
,
useGoogleTranslateBigPopup = (e, t, a, n) => {
    $.ajax({
        url: "https://translate.googleapis.com/translate_a/single?dt=t&dt=bd&dt=qc&dt=rm&dt=ex",
        type: "GET",
        dataType: "json",
        headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        data: {
            client: "gtx",
            hl: e.langDst.slice(0, 2),
            sl: "auto" === e.langSrc ? "auto" : e.langSrc,
            tl: e.langDst.slice(0, 2),
            q: t,
            dj: 1
        },
        success: a => {
            let r;
            isTranslating = !1;
            let s = a.sentences.filter((e => !0 == !!e.trans))
              , o = a.sentences.filter((e => !0 == !!e.translit));
            r = 0 !== o.length ? o[0].translit : "";
            let l = s.map((e => e.trans)).join("")
              , i = s.map((e => e.orig)).join("")
              , g = {
                err: null,
                from: a.src,
                result: l,
                source: i,
                sourceTransliteration: i,
                targetTransliteration: r || "",
                translator: "",
                translatorLink: ""
            };
            n.result = g.result,
            onBigModalTranslateSuccess(g, t, e.langDst, e.langSrc),
            translateCount >= backensterAdChangeInterval && (activeAdIndex++,
            chrome.storage.local.set({
                mtzTranslateCount: 1
            }),
            readTranslateCount(),
            showAdsBanner(!0));
            const c = generateId();
            addToTranslateHistory(e.langSrc, e.langSrcName, e.langDst, e.langDstName, t, g.result, c),
            hideOutputProgress(),
            incrementTranslateCount(),
            checkAppRateShown(translateCount, backensterRatingTranslationEventCount)
        }
        ,
        error: e => {
            n.error = e.responseText,
            isTranslating = !1,
            hideOutputProgress(),
            hideMediumLoader(),
            showTranslateError(translatedTextTarget)
        }
    })
}
;
const showMsg = e => {
    alert(e)
}
;
function showLimitError() {
    swal("Exceeded the limit on the number of characters per translation.", {
        dangerMode: !0,
        buttons: {
            cancel: "Close"
        }
    }).then((e => {
        e
    }
    ))
}
function checkAppRateShown(e, t) {
    chrome.storage.local.get("mtzRateAppShown", (function(a) {
        !chrome.runtime.error && a.mtzRateAppShown || e % t == 0 && (swal("Please rate our application", {
            buttons: {
                cancel: "Cancel",
                ok: {
                    text: "OK",
                    value: "OK"
                }
            }
        }).then((e => {
            switch (e) {
            case "OK":
                rateApp()
            }
        }
        )),
        chrome.storage.local.set({
            mtzRateAppShown: !0
        }))
    }
    ))
}
function playSound(e) {
    getPopupNameById(getParentPopupByTarget(e.target)[0].id);
    try {
        chrome.storage.local.get(["langSrc", "langDst"], (function(t) {
            let a = e.data ? `.${guidTranslate}btn-speak-source` : `.${guidTranslate}btn-speak-target`
              , n = e.data ? t.langSrc : t.langDst
              , r = e.data ? $(`#${guidTranslate}inputText`).val() : $(`#${guidTranslate}outputText`).val();
            "auto" !== n && 0 !== r.trim().length && speakText(r, n, a)
        }
        ))
    } catch (e) {}
}
const stopAudioPlay = e => {
    if (debug_log("stopAudioPlay"),
    toggleSpeakAudioButton(e, "normal"),
    audio)
        try {
            audio.stop()
        } catch (e) {}
    audio = null
}
  , toggleSpeakAudioButton = (e, t) => {
    const a = $(e).find(`.${guidTranslate}sound_activate`)
      , n = $(e).find(`.${guidTranslate}sound_inactive`)
      , r = $(e).find(`.${guidTranslate}sound_loader`);
    a.on("click", ( () => stopAudioPlay(e))),
    "normal" === t ? ($(e).removeClass(`${guidTranslate}active`),
    r.hide(),
    a.hide(),
    n.show()) : "load" === t ? (r.show(),
    n.hide(),
    a.hide()) : "play" === t && ($(e).addClass(`${guidTranslate}active`),
    a.show(),
    r.hide())
}
;
function acPlay(e, t) {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        let a = new AudioContext;
        a.decodeAudioData(e, (e => {
            let n = a.createBufferSource();
            n.buffer = e,
            n.connect(a.destination),
            n.start(),
            toggleSpeakAudioButton(t, "play"),
            audio = n,
            n.addEventListener("ended", (function(e) {
                stopAudioPlay(t)
            }
            ))
        }
        ), (e => {
            showMsg("Playback error. Try another word."),
            toggleSpeakAudioButton(t, "normal"),
            audio = null
        }
        ))
    } catch (e) {}
}
const speakAudioOnLoad = (e, t) => {
    debug_log("speakAudioOnLoad");
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        let a = new AudioContext;
        a.decodeAudioData(t, (t => {
            let n = a.createBufferSource();
            n.buffer = t,
            n.connect(a.destination),
            n.start(),
            toggleSpeakAudioButton(e, "play"),
            audio = n,
            n.addEventListener("ended", (function(t) {
                stopAudioPlay(e)
            }
            ))
        }
        ), (t => {
            showMsg("Playback error. Try another word."),
            toggleSpeakAudioButton(e, "normal"),
            audio = null
        }
        ))
    } catch (e) {}
}
;
function speakText(e, t, a) {
    debug_log(`speakText: "${e}"`),
    stopAudioPlay($(`.${guidTranslate}sound_activate`).parent()),
    null == e || e.length < 2 || (e.length > backensterCharacterCountRequestLimitFree && (e = e.substring(0, backensterCharacterCountRequestLimitFree)),
    chrome.storage.local.get(["speedOfText", "voiceGender"], (function({speedOfText: n, voiceGender: r}) {
        toggleSpeakAudioButton(a, "load"),
        backensterTTSRequestLimit && e.length > backensterTTSRequestLimit && (e = e.substring(0, backensterTTSRequestLimit)),
        r = r || "Male",
        n = n || 100,
        debug_log(`textToSpeech (gender=${r}, speed=${n}, lang=${t}): "${e}"`);
        let s = JSON.stringify({
            platform: PLATFORM_NAME,
            lang: t,
            text: e,
            uuid: uuidv,
            gender: r,
            rate: n + "%"
        })
          , o = new XMLHttpRequest;
        o.open("POST", "https://backenster.com/v2/api/v3/textToSpeech", !0),
        o.responseType = "arraybuffer",
        o.setRequestHeader("Authorization", "Fujiwaranosai"),
        o.setRequestHeader("Content-type", "application/json; charset=utf-8"),
        o.onload = function(e) {
            speakAudioOnLoad(a, o.response)
        }
        ,
        o.onerror = function(e) {
            showMsg("Playback error. Try another word."),
            toggleSpeakAudioButton(a, "normal")
        }
        ,
        o.send(s)
    }
    )))
}
function closeAbout(e) {
    $(`#${guidTranslate}translator-div-container`).removeClass(`${guidTranslate}about-body`)
}
function closeLanguagesList(e) {
    getPopupNameById(getParentPopupByTarget(e.target)[0].id);
    $(`.${guidTranslate}ToDropArrow, .${guidTranslate}FromDropArrow`).removeClass(`${guidTranslate}arrowClosed`),
    $(`.${guidTranslate}translator-list #${guidTranslate}from .${guidTranslate}country-flag, .${guidTranslate}translator-list #${guidTranslate}to .${guidTranslate}country-flag`).removeClass(`${guidTranslate}showCloudArrow`),
    document.getElementById(`${guidTranslate}fromListSelect`).style.display = "block",
    document.getElementById(`${guidTranslate}listDiv`).style.display = "none"
}
function animateReverseIcon() {
    const e = $(`.${guidTranslate}languageRevers`);
    let t = 0;
    "matrix(1, -2.44929e-16, 2.44929e-16, 1, 0, 0)" === e.css("transform") ? t = 0 : t += 360,
    e.animate({
        deg: t
    }, {
        duration: 300,
        step: function(t) {
            e.css({
                transform: "rotate(" + t + "deg)"
            })
        }
    })
}
function languageReverse() {
    chrome.storage.local.get(["langSrc", "langSrcName", "langDst", "langDstName", "langSrcSpeakAvailable", "langDstSpeakAvailable"], (function(e) {
        animateReverseIcon();
        let t = $(`#${guidTranslate}outputText`).val();
        $(`#${guidTranslate}inputText`).val(t),
        "auto" !== e.langSrc ? (chrome.storage.local.set({
            langSrc: e.langDst,
            langSrcName: e.langDstName,
            langSrcSpeakAvailable: e.langDstSpeakAvailable,
            langDst: e.langSrc,
            langDstName: e.langSrcName,
            langDstSpeakAvailable: e.langSrcSpeakAvailable
        }),
        setLanguageSelectElement(!1, "from", e.langDst, e.langDstName, e.langDstSpeakAvailable),
        setLanguageSelectElement(!1, "to", e.langSrc, e.langSrcName, e.langSrcSpeakAvailable),
        showSoundAndDeleteBtn(),
        translate()) : showMsg("Unable to reverse languages because you can't translate to AUTO DETECTION")
    }
    ))
}
function isOneWord(e) {
    let t = !1;
    if (e) {
        let a = e.split(" ");
        a = a.filter((function(e) {
            return e.trim()
        }
        )),
        t = a.length < 2
    }
    return t
}
function renderDictionaryContent(e, t) {
    $(`.${guidTranslate}id-lexical-meaning`).empty(),
    getTemplate("/frame/dictionary.html").then((function(a) {
        let n = a[0].innerHTML
          , r = a[2].innerHTML
          , s = [];
        $.each(e.result.partsOfSpeech, (function(e, t) {
            let a = [];
            $.each(t, (function(e, t) {
                let n = t.meaning.replace(/^\(/g, "").replace(/\)$/g, "").split("; ")
                  , s = n.shift(0)
                  , o = []
                  , l = []
                  , i = [];
                t.syn && (o = t.syn.split(",")),
                t.hyponym && (l = t.hyponym.split(",")),
                t.hypernym && (i = t.hypernym.split(","));
                let g = {
                    index: e + 1,
                    guid: guidTranslate,
                    meaning: s,
                    examples: n,
                    synonyms: o,
                    hypernyms: i,
                    hyponyms: l,
                    hasSynonyms: o.length > 0,
                    hasHyponyms: l.length > 0,
                    hasHypernyms: i.length > 0,
                    "sound-active-icon-src": soundActive,
                    "sound-inactive-icon": soundInactive,
                    "loader-icon-src": loader
                }
                  , c = Mustache.render(r, g);
                a.push(c)
            }
            )),
            s.push({
                name: e.toUpperCase(),
                definitions: a
            })
        }
        ));
        let o = {
            guid: guidTranslate,
            word: t.toLowerCase(),
            transcription: e.result.transcription || t,
            partsOfSpeech: s
        }
          , l = Mustache.render(n, o);
        $(`.${guidTranslate}id-lexical-meaning`).append(l),
        $(`.${guidTranslate}target`).click(sourceClick),
        $(`.${guidTranslate}source`).click(sourceClick),
        $(`.${guidTranslate}speak-icon`).click(onSpeakIconClick)
    }
    ))
}
const toggleDictionaryPanel = () => {
    chrome.storage.local.get(["dictionaryEnabled"], (function(e) {
        e.dictionaryEnabled ? ($(`.${guidTranslate}translate-small-div-bottom`).show(),
        $(`.${guidTranslate}vocabulary-icon-container svg`).addClass(`${guidTranslate}svg-red-border-none`)) : $(`.${guidTranslate}translate-small-div-bottom`).hide()
    }
    ))
}
;
function getLexicalMeaning(e, t, a) {
    $(`.${guidTranslate}id-lexical-meaning`).html(""),
    null == a || null == e || a.length < 2 || !isOneWord(a) || (debug_log("getLexicalMeaning: from:'" + e + "' to:'" + t + "' word:'" + a + "'"),
    $.ajax({
        type: "post",
        timeout: 15e3,
        headers: {
            Authorization: "Bearer sdf2fsd34lkkdfg"
        },
        url: "https://backenster.com/v2/api/v3/getLexicalMeaning",
        cache: !1,
        dataType: "json",
        data: {
            from: e,
            to: t,
            word: a,
            platform: PLATFORM_NAME,
            uuid: uuidv
        },
        success: function(n) {
            n.err || n.result && (void 0 !== n.result.examples && 0 !== n.result.examples.length || void 0 !== n.result.partsOfSpeech && 0 !== Object.entries(n.result.partsOfSpeech).length ? (chrome.storage.local.get(["dictionaryEnabled"], (function(e) {
                e.dictionaryEnabled ? ($(`.${guidTranslate}translate-small-div-bottom`).show(),
                $(`.${guidTranslate}vocabulary-icon-container svg`).addClass(`${guidTranslate}svg-red-border-none`)) : $(`.${guidTranslate}translate-small-div-bottom`).hide()
            }
            )),
            $(`.${guidTranslate}vocabulary-icon-container`).show()) : $(`.${guidTranslate}vocabulary-icon-container`).hide(),
            renderDictionaryContent(n, a)),
            getSentencesByWord(e, t, a)
        },
        error: function(e) {
            $(`.${guidTranslate}vocabulary-icon`).removeClass(`${guidTranslate}svg-red-border-none`),
            $(`.${guidTranslate}dictionary-row, .${guidTranslate}translate-small-div-bottom`).hide(),
            $(`.${guidTranslate}id-lexical-meaning`).html(`<span class="center-msg lexical-error-msg" >${lexicalError}</span>`)
        }
    }))
}
const onSpeakIconClick = e => {
    speakText($(e.target).attr("tag"), "en_GB", $(e.target).parent())
}
;
function renderSentencesContent(e, t) {
    getTemplate("/frame/sentences.html").then((function(a) {
        a = a[0].innerHTML;
        let n = 1;
        $.map(e.result, (function(e) {
            let a = DOMPurify.sanitize(e.fromText)
              , r = new RegExp(t + "(?=[\\s\\W])","gi");
            return e.fromText = a.replace(r, `<span class='${guidTranslate}dictionary-word ${guidTranslate}source ${guidTranslate}bold-class'>${t.toLowerCase()}</span>`),
            e.index = n++,
            e
        }
        ));
        let r = {
            guid: guidTranslate,
            sentences: e.result
        }
          , s = Mustache.render(a, r);
        $(`.${guidTranslate}id-lexical-meaning`).append(s)
    }
    ))
}
function getSentencesByWord(e, t, a) {
    null == a || a.length > 45 || (debug_log("getSentencesByWord: from:'" + e + "' to:'" + t + "' word:'" + a + "'"),
    $.ajax({
        type: "get",
        timeout: 15e3,
        headers: {
            Authorization: "Bearer sdf2fsd34lkkdfg"
        },
        url: "https://backenster.com/v2/api/v3/getSentencesByWord",
        cache: !1,
        dataType: "json",
        data: {
            from: e,
            to: t,
            word: a,
            platform: PLATFORM_NAME,
            uuid: uuidv
        },
        success: function(e) {
            e.err || e.result && e.result.length > 0 && renderSentencesContent(e, a)
        },
        error: function(e) {}
    }))
}
function sourceClick(e) {
    $(`#${guidTranslate}singleWordSearch`).val(e.currentTarget.innerText),
    $(`#${guidTranslate}inputText`).val(e.currentTarget.innerText),
    $(`#${guidTranslate}ouputText`).val(""),
    saveInputText(),
    translate()
}
function targetClick(e) {
    sourceClick(e)
}
function showOutputProgress() {
    document.getElementById(`${guidTranslate}outputProgress`).style.visibility = "visible"
}
function hideOutputProgress() {
    document.getElementById(`${guidTranslate}outputProgress`).style.visibility = "hidden"
}
function startButtonClick() {
    $(".video-container").children()[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*"),
    showTabByName("translate"),
    chrome.storage.local.set({
        justInstalled: !1
    })
}
function analyticsCheckboxChange(e) {
    $(`input[id="${guidTranslate}analytics"]`).prop("checked", $(this).is(":checked")),
    $(this).is(":checked") ? chrome.storage.local.set({
        analyticsEnabled: !0
    }) : $(this).is(":not(:checked)") && chrome.storage.local.set({
        analyticsEnabled: !1
    })
}
function rateApp() {
    try {
        let e = window.open("https://chrome.google.com/webstore/detail/" + chrome.runtime.id + "/reviews", "_blank");
        e && e.focus()
    } catch (e) {}
}
const setTranslationText = e => {
    debug_log("setTranslationText"),
    e && e.trim() ? ($(`#${guidTranslate}inputText`).val(e),
    saveInputText(),
    translate()) : chrome.storage.local.get(["inputText"], (function({inputText: e}) {
        $(`#${guidTranslate}inputText`).val(e),
        translate()
    }
    ))
}
;
function saveInputText() {
    let e = $(`#${guidTranslate}inputText`).val();
    debug_log(`saveInputText text: ${e}`),
    chrome.storage.local.set({
        inputText: e
    })
}
window.addEventListener("keypress", (function(e) {
    "Enter" === e.key && translate()
}
), !1),
window.addEventListener("DOMContentLoaded", ( () => {
    chrome.tabs.query({
        active: !0,
        currentWindow: !0
    }, (e => {
        debug_log("getSelection Request"),
        chrome.tabs.sendMessage(e[0].id, {
            from: "popup",
            subject: "getSelection"
        }, setTranslationText)
    }
    ))
}
)),
chrome.runtime.onMessage.addListener((function(e, t, a) {
    if ("close_translate_popups" === e.msg)
        hideBigPopup(),
        hideSmallPopup(),
        hideMediumPopup(),
        hideSquareButtons(),
        updateExtensionData(),
        clearPopups();
    else if ("start_load_animation" === e.msg)
        showBigPopup(),
        $(`.${guidTranslate}bigTranslateModal`).prepend(`\n                 <img class="${guidTranslate}imageloader-first"  src="${loader}" />\n                 <img class="${guidTranslate}imageloader-second"  src="${loader}" />\n            `);
    else if ("start_image_ocr" === e.msg)
        captureEntryPage();
    else if ("image_ocr_success" === e.msg) {
        const {sourceData: t, translatedData: a} = e;
        ocrImageHideLoader(),
        $(`#${guidTranslate}inputText`).val(t),
        $(`#${guidTranslate}outputText`).val(a),
        saveInputText()
    } else if ("image_ocr_error" === e.msg) {
        const {error: t} = e;
        ocrImageHideLoader(),
        $(`#${guidTranslate}inputText`).val(t)
    }
}
));
