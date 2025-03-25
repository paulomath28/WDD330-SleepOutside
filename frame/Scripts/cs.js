!function(e) {
    "use strict";
    let t, o, r;
    var n, a, s, i, c, l, d, u, x, p, h, g, v, f, m, y, b, w = !1, C = 2147483646, _ = {
        width: 40,
        height: 40
    }, O = {
        width: 2600,
        height: 2600
    }, T = !1, k = chrome.i18n.getMessage("ocrDimensionError"), S = window.__TextOverlay__, z = function() {
        e(".ocrext-ocr-message,.ocrext-ocr-translated").removeClass((function(e, t) {
            var o = t.match(/ocrext-font-\d\dpx/gi);
            return o && o.length ? o.join(" ") : ""
        }
        )).addClass("ocrext-font-" + p.visualCopyOCRFontSize)
    }, M = function() {
        if (p.visualCopySupportDicts) {
            e(".ocrext-wrapper").css("zIndex", 1200);
            let t = e("textarea.ocrext-result");
            0 === e("#popup_support_text").length && (t.after(`<p id="popup_support_text" class="${t.prop("classList")}">${t.val()}</p>`),
            t.hide())
        } else
            e(".ocrext-wrapper").css("zIndex", C)
    }, L = function() {
        var t, o, r = e(".ocrext-quickselect-btn-container");
        r.empty(),
        e.each(p.visualCopyQuickSelectLangs, (function(n, a) {
            if ("none" === a)
                return !0;
            o = _searchOCRLanguageList(a),
            (t = e(['<button class="ocrext-element ocrext-ocr-quickselect ocrext-btn mdl-button', 'mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"></button>'].join(" "))).attr({
                "data-lang": o.lang,
                title: o.name
            }).text(o.short),
            p.visualCopyOCRLang === o.lang && t.addClass("selected"),
            r.append(t),
            componentHandler.upgradeElement(t.get(0))
        }
        ))
    }, D = (b = ['<div class="ocrext-element ocrext-mask">', '<div class="ocrext-overlay-corner ocrext-corner-tl"></div>', '<div class="ocrext-overlay-corner ocrext-corner-tr"></div>', '<div class="ocrext-overlay-corner ocrext-corner-br"></div>', '<div class="ocrext-overlay-corner ocrext-corner-bl"></div>', '<p class="ocrext-element">' + areaSelectionHint + "</p>", "</div>"].join(""),
    {
        addToBody: function() {
            return h = e("body"),
            g || h.find(".ocrext-mask").length || ((g = e(b).css({
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                zIndex: 2147483644,
                display: "none"
            })).appendTo(h),
            v = e(".ocrext-corner-tl"),
            f = e(".ocrext-corner-tr"),
            y = e(".ocrext-corner-br"),
            m = e(".ocrext-corner-bl"),
            this.resetPosition()),
            g.width(e(document).width()),
            g.height(e(document).width()),
            ["absolute", "relative", "fixed"].indexOf(e("body").css("position")) >= 0 && g.css("position", "fixed"),
            this
        },
        width: function(e) {
            if (void 0 === e)
                return g.width();
            g.width(e)
        },
        height: function(e) {
            if (void 0 === e)
                return g.height();
            g.height(e)
        },
        show: function() {
            return this.resetPosition(),
            g.show(),
            e(".ocrext-mask p.ocrext-element").show(),
            this
        },
        hide: function() {
            return g.hide(),
            this
        },
        remove: function() {
            g.remove(),
            g = null
        },
        resetPosition: function() {
            var t = e(document).width()
              , o = e(document).height();
            v.css({
                top: 0,
                left: 0,
                width: t / 2,
                height: o / 2
            }),
            f.css({
                top: 0,
                left: t / 2,
                width: t / 2,
                height: o / 2
            }),
            m.css({
                top: o / 2,
                left: 0,
                width: t / 2,
                height: o / 2
            }),
            y.css({
                top: o / 2,
                left: t / 2,
                width: t / 2,
                height: o / 2
            })
        },
        reposition: function(t) {
            var o = e(document).width()
              , r = e(document).height();
            v.css({
                left: 0,
                top: 0,
                width: t.tr[0],
                height: t.tl[1]
            }),
            f.css({
                left: t.tr[0],
                top: 0,
                width: o - t.tr[0],
                height: t.br[1]
            }),
            y.css({
                left: t.bl[0],
                top: t.bl[1],
                width: o - t.bl[0],
                height: r - t.bl[1]
            }),
            m.css({
                left: 0,
                top: t.tl[1],
                width: t.tl[0],
                height: r - t.tl[1]
            })
        }
    });
    function E() {
        var t = e.Deferred();
        return chrome.storage.local.get({
            visualCopyOCRLang: "",
            visualCopyTranslateLang: "",
            visualCopyAutoTranslate: "",
            visualCopyOCRFontSize: "",
            visualCopySupportDicts: "",
            visualCopyQuickSelectLangs: [],
            visualCopyTextOverlay: "",
            openGrabbingScreenHotkey: 0,
            closePanelHotkey: 0,
            copyTextHotkey: 0,
            transitionEngine: "",
            ocrEngine: "",
            google_ocr_api_key: "",
            google_ocr_api_url: "",
            google_trs_api_key: "",
            google_trs_api_url: ""
        }, (function(e) {
            p = e,
            t.resolve()
        }
        )),
        t
    }
    function j() {
        var t = e("#ocrext-canOrig")
          , o = (e("#ocrext-can"),
        e("body").find(".ocrext-wrapper"),
        e.Deferred());
        return E().done((function() {
            z(),
            L(),
            setTimeout((function() {
                chrome.runtime.sendMessage({
                    evt: "capture-screen"
                }, (function(r) {
                    var n = e.Deferred()
                      , a = new Image;
                    a.onload = function() {
                        n.resolve()
                    }
                    ,
                    a.src = r.dataURL,
                    n.done((function() {
                        var r = 1 / (window.innerWidth / a.width)
                          , n = Math.min(c, d) * r
                          , s = Math.min(l, u) * r
                          , i = Math.abs(d - c)
                          , x = Math.abs(u - l)
                          , p = i * r
                          , h = x * r;
                        t.attr({
                            width: p,
                            height: h
                        }),
                        t.attr({
                            width: i,
                            height: x
                        }),
                        t.get(0).getContext("2d").drawImage(a, n, s, p, h, 0, 0, i, x);
                        let g = t.get(0).toDataURL();
                        g.replace("data:image/png;base64,", "");
                        chrome.runtime.sendMessage({
                            msg: "image-parse",
                            url: g
                        }),
                        e("body").removeClass("ocrext-overlay"),
                        o.resolve()
                    }
                    ))
                }
                ))
            }
            ), 150)
        }
        )),
        o
    }
    function P() {
        var t, o = e.Deferred(), n = e.Deferred(), a = e("#ocrext-canOrig"), s = a.width(), i = a.height();
        E().done((function() {
            if (z(),
            null != p.ocrEngine && (p.ocrEngine,
            p.transitionEngine),
            N.resetOverlayInformation(),
            n.done((function(t, o) {
                "no-translate" === t ? (e(".ocrext-ocr-message").addClass("ocrext-preserve-whitespace expanded"),
                e(".ocrext-grid-translated").hide(),
                e(".ocrext-ocr-translated").text(""),
                e(".ocrext-ocr-retranslate").hide()) : (e(".ocrext-ocr-message").removeClass("ocrext-preserve-whitespace expanded"),
                e(".ocrext-grid-translated").show(),
                e(".ocrext-ocr-retranslate").show(),
                e(".ocrext-ocr-translated").text(t).show()),
                e(".ocrext-btn").removeClass("disabled"),
                N.setStatus("success", o ? chrome.i18n.getMessage("ocrSuccessStatus") : chrome.i18n.getMessage("translationSuccessStatus")),
                N.enableContent()
            }
            )).fail((function(t) {
                e(".ocrext-btn").removeClass("disabled"),
                N.setStatus("error", t.stat),
                "OCR" === t.type && e(".ocrext-ocr-message").text(t.message),
                e(".ocrext-ocr-translated").text("N/A"),
                N.enableContent()
            }
            )).always((function() {
                t = null,
                null,
                a = null,
                o = null
            }
            )),
            o.done((function(o, a) {
                if (e(".ocrext-ocr-message").text(o),
                e("#popup_support_text").text(o),
                N.setOverlayInformation(a, t),
                p.visualCopyTextOverlay && N.showOverlay(),
                !p.visualCopyAutoTranslate)
                    return n.resolve("no-translate", !0),
                    !0;
                N.setStatus("progress", chrome.i18n.getMessage("translationProgressStatus"), !0),
                "GoogleTranslator" == p.transitionEngine ? chrome.runtime.sendMessage({
                    evt: "google-translate",
                    options: p,
                    text: o
                }, (function(e) {
                    !0 === e.success ? n.resolve(e.data) : !1 === e.success && n.reject({
                        type: "translate",
                        stat: "timeout" === e.time ? "Translation request timed out" : "An error occurred during translation",
                        message: e.data.message,
                        details: null,
                        code: e.data.code
                    })
                }
                )) : "YandexTranslator" === p.transitionEngine && e.ajax({
                    url: r.yandex_api_url,
                    data: {
                        key: r.yandex_api_key,
                        lang: p.visualCopyTranslateLang,
                        text: o
                    },
                    dataType: "json",
                    timeout: r.yandex_timeout,
                    type: "GET",
                    success: function(e) {
                        200 === e.code && n.resolve(e.text)
                    },
                    error: function(e, t) {
                        var o;
                        try {
                            o = JSON.parse(e.responseText)
                        } catch (e) {
                            o = {}
                        }
                        n.reject({
                            type: "translate",
                            stat: "timeout" === t ? "Translation request timed out" : "An error occurred during translation",
                            message: o.message,
                            details: null,
                            code: o.code
                        })
                    }
                })
            }
            )).fail((function(e) {
                n.reject(e)
            }
            )),
            s < _.width && i < _.height || s > O.width && i > O.height)
                return o.reject({
                    type: "OCR",
                    stat: "OCR conversion failed",
                    message: k,
                    details: null,
                    code: null
                }),
                !1;
            N.disableContent(),
            N.setStatus("progress", chrome.i18n.getMessage("ocrProgressStatus"), !0),
            {}.language = p.visualCopyOCRLang
        }
        ))
    }
    function R(t) {
        var o, r, c, l;
        T ? (s = t.pageX - e("body").scrollLeft(),
        i = t.pageY - e("body").scrollTop(),
        x.css({
            position: "fixed"
        })) : (s = t.pageX,
        i = t.pageY,
        x.css({
            position: "absolute"
        })),
        o = Math.min(n, s),
        r = Math.min(a, i),
        c = Math.abs(s - n),
        l = Math.abs(i - a),
        x.css({
            left: o,
            top: r,
            width: c,
            height: l
        }),
        D.reposition({
            tl: [o + 2, r + 2],
            tr: [o + c + 2, r + 2],
            bl: [o + 2, r + l + 2],
            br: [o + c + 2, r + l + 2]
        })
    }
    function A(t) {
        if (w)
            return !0;
        w = !0;
        var o = e("body");
        e(".ocrext-mask p.ocrext-element").hide(),
        (x = e('<div class="ocrext-selector"></div>')).appendTo(o),
        T ? (n = t.pageX - o.scrollLeft(),
        a = t.pageY - o.scrollTop(),
        x.css({
            position: "fixed"
        })) : (n = t.pageX,
        a = t.pageY,
        x.css({
            position: "absolute"
        })),
        c = t.clientX,
        l = t.clientY,
        x.css({
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            zIndex: 2147483645
        }),
        o.on("mousemove", R),
        o.one("mouseup", (function(e) {
            var t;
            d = e.clientX,
            u = e.clientY,
            o.off("mousemove", R),
            o.removeClass("ocrext-ch"),
            x.remove(),
            D.hide(),
            M(),
            (t = o.find(".ocrext-wrapper")).css({
                bottom: -t.height()
            }).show(),
            j().done((function() {
                P()
            }
            ))
        }
        ))
    }
    function I() {
        e(".ocrext-wrapper").css("opacity", 0),
        N.reset(),
        setTimeout((function() {
            j().done((function() {
                P(),
                M()
            }
            ))
        }
        ), 20)
    }
    function H() {
        e("body").addClass("ocrext-overlay").addClass("ocrext-ch"),
        w = !1,
        N.slideDown(),
        N.reset(),
        D.addToBody().show()
    }
    function q() {
        var t = e.Deferred();
        t.done((function(t) {
            "no-translate" === t ? (e(".ocrext-ocr-message").addClass("ocrext-preserve-whitespace expanded"),
            e(".ocrext-grid-translated").hide(),
            e(".ocrext-ocr-translated").text(""),
            e(".ocrext-ocr-retranslate").hide()) : (e(".ocrext-ocr-message").removeClass("ocrext-preserve-whitespace expanded"),
            e(".ocrext-grid-translated").show(),
            e(".ocrext-ocr-retranslate").show(),
            e(".ocrext-ocr-translated").text(t).show()),
            e(".ocrext-btn").removeClass("disabled"),
            N.setStatus("success", chrome.i18n.getMessage("translationSuccessStatus")),
            N.enableContent()
        }
        )).fail((function(t) {
            e(".ocrext-btn").removeClass("disabled"),
            N.setStatus("error", t.stat),
            e(".ocrext-ocr-translated").text("N/A"),
            N.enableContent()
        }
        ));
        var o = e(".ocrext-ocr-message").val();
        "GoogleTranslator" == p.transitionEngine ? e.ajax({
            url: p.google_trs_api_url,
            data: {
                key: p.google_trs_api_key,
                target: p.visualCopyTranslateLang,
                q: o
            },
            timeout: r.yandex_timeout,
            type: "GET",
            success: function(e) {
                null != e.data.translations[0].translatedText && t.resolve(e.data.translations[0].translatedText)
            },
            error: function(e, o) {
                var r;
                try {
                    r = JSON.parse(e.responseText)
                } catch (e) {
                    r = {}
                }
                t.reject({
                    type: "translate",
                    stat: "timeout" === o ? "Translation request timed out" : "An error occurred during translation",
                    message: r.message,
                    details: null,
                    code: r.code
                })
            }
        }) : (p.transitionEngine = "YandexTranslator") && e.ajax({
            url: r.yandex_api_url,
            data: {
                key: r.yandex_api_key,
                lang: p.visualCopyTranslateLang,
                text: o
            },
            timeout: r.yandex_timeout,
            type: "GET",
            success: function(e) {
                200 === e.code && t.resolve(e.text)
            },
            error: function(e, o) {
                var r;
                try {
                    r = JSON.parse(e.responseText)
                } catch (e) {
                    r = {}
                }
                t.reject({
                    type: "translate",
                    stat: "timeout" === o ? "Translation request timed out" : "An error occurred during translation",
                    message: r.message,
                    details: null,
                    code: r.code
                })
            }
        })
    }
    function G(t) {
        if (t && t.stopPropagation(),
        "disabled" === N.state)
            return !0;
        e("header.ocrext-header").removeClass("minimized"),
        e(".ocrext-wrapper").removeClass("ocrext-wrapper-minimized"),
        N.disable(),
        chrome.runtime.sendMessage({
            evt: "capture-done"
        }, (function() {}
        ))
    }
    var N = {
        init: function() {
            var n, a = this;
            return this._initializing = !0,
            this._initialized = !1,
            n = e.Deferred(),
            e.when(E()).done((function(e, t) {
                o = t[0],
                N.APPCONFIG = r = "string" == typeof e[0] ? JSON.parse(e[0]) : e[0],
                n.resolve(r, o)
            }
            )).fail((function(e) {
                n.reject(),
                function(e, t) {
                    t = t || "",
                    e = e || "An error occurred."
                }("Failed to initialize", e)
            }
            )),
            t = n,
            N.enable(),
            chrome.runtime.onMessage.addListener((function(o, r, n) {
                if (r.tab)
                    return !0;
                if ("isavailable" === o.evt)
                    return a._initialized ? n({
                        farewell: "isavailable:OK"
                    }) : e("body").length ? t.done((function() {
                        a._initialize(),
                        n({
                            farewell: "isavailable:OK"
                        })
                    }
                    )) : n({
                        farewell: "isavailable:FAIL"
                    }),
                    !0;
                if ("enableselection" === o.evt)
                    t.done((function() {
                        N.enable()
                    }
                    )),
                    n({
                        farewell: "enableselection:OK"
                    });
                else if ("disableselection" === o.evt) {
                    if ("disabled" === N.state)
                        return !0;
                    t.done((function() {
                        N.disable()
                    }
                    ))
                }
            }
            )),
            e(document).ready((function() {
                a._initialized || a._initializing || t.done((function() {
                    a._initialize()
                }
                ))
            }
            )),
            this
        },
        _initialize: function() {
            this._initializing = !1,
            this._initialized = !0,
            T = ["absolute", "relative", "fixed"].indexOf(e("body").css("position")) >= 0,
            this.initWidgets(),
            this.bindEvents(),
            chrome.runtime.sendMessage({
                evt: "ready"
            })
        },
        initWidgets: function() {
            e("body").append(o),
            p.visualCopyAutoTranslate || (e(".ocrext-ocr-message").addClass("ocrext-preserve-whitespace expanded"),
            e(".ocrext-grid-translated").hide()),
            z(),
            L(),
            e("button.ocrext-btn").each((function(e, t) {
                componentHandler.upgradeElement(t)
            }
            )),
            componentHandler.upgradeElement(e(".ocrext-spinner").get(0))
        },
        bindEvents: function() {
            var t = e("body");
            let o = e("#popup_translate_button");
            var r = this;
            return o.on("click", o, openGoogleTransatePage),
            t.on("dblclick", ".ocrext-textoverlay-container", (function() {
                if (e("#ocrext-can").parents(".ocrext-content").hasClass("ocrext-disabled"))
                    return !0;
                p.visualCopyTextOverlay ? r.showOverlayTab() : window.alert('Please enable the "Show Text Overlay" option to view text overlays.')
            }
            )).on("dblclick", "#ocrext-can", (function() {
                if (e(this).parents(".ocrext-content").hasClass("ocrext-disabled"))
                    return !0;
                p.visualCopyTextOverlay ? r.showOverlayTab() : window.alert('Please enable the "Show Text Overlay" option to view text overlays.')
            }
            )).on("click", ".ocrext-ocr-recapture", H).on("click", ".ocrext-ocr-retranslate", q).on("click", ".ocrext-ocr-sendocr", I).on("click", ".ocrext-closeToolbar-link", G).on("click", ".ocrext-ocr-copy", (function() {
                var t = e(".ocrext-ocr-message").val() + e(".ocrext-ocr-translated").text();
                chrome.runtime.sendMessage({
                    evt: "copy",
                    text: t
                })
            }
            )).on("click", ".ocrext-ocr-quickselect", (function() {
                var t, o, r = e(this);
                r.siblings().removeClass("selected"),
                r.addClass("selected"),
                (t = {
                    visualCopyOCRLang: e(this).attr("data-lang")
                },
                o = e.Deferred(),
                chrome.storage.local.set(t, (function() {
                    e.extend(p, t),
                    o.resolve()
                }
                )),
                o).done((function() {
                    I()
                }
                ))
            }
            )).on("click", "header.ocrext-header", (function() {
                var t = e(this);
                t.hasClass("minimized") ? (e(".ocrext-wrapper").removeClass("ocrext-wrapper-minimized"),
                t.removeClass("minimized")) : (e(".ocrext-wrapper").addClass("ocrext-wrapper-minimized"),
                t.addClass("minimized"))
            }
            )).on("click", "a.ocrext-settings-link", (function(e) {
                e.stopPropagation(),
                chrome.runtime.sendMessage({
                    evt: "open-settings"
                })
            }
            )),
            e(document).on("keyup", (function(e) {
                27 === e.keyCode && G()
            }
            )),
            this
        },
        enable: function() {
            var t = e("body");
            return t.find(".ocrext-wrapper").length || t.append(o),
            t.addClass("ocrext-overlay ocrext-ch").find(".ocrext-wrapper").hide(),
            N.reset(),
            D.addToBody().show(),
            this.textOverlay = S(),
            t.on("mousedown", A),
            N.state = "enabled",
            this
        },
        disable: function() {
            var t = e("body");
            try {
                t.removeClass("ocrext-overlay ocrext-ch").find(".ocrext-wrapper").hide(),
                t.off("mousedown", A),
                N.state = "disabled",
                D.remove(),
                N.reset(),
                w = !1
            } catch (e) {}
            return this
        },
        reset: function() {
            return e(".ocrext-status").text("").removeClass("ocrext-success ocrext-error ocrext-progress"),
            e(".ocrext-result").text("N/A"),
            e(".ocrext-result").attr({
                title: ""
            }),
            this.textOverlay && this.resetOverlay(),
            this
        },
        enableContent: function() {
            return e(".ocrext-spinner").removeClass("is-active"),
            e(".ocrext-content").removeClass("ocrext-disabled"),
            e(".ocrext-btn-container .ocrext-btn").removeClass("disabled").removeAttr("disabled"),
            e(".ocrext-quickselect-btn-container .ocrext-btn").removeClass("disabled").removeAttr("disabled"),
            this
        },
        disableContent: function() {
            return e(".ocrext-spinner").addClass("is-active"),
            e(".ocrext-content").addClass("ocrext-disabled"),
            e(".ocrext-btn-container .ocrext-btn").addClass("disabled").attr("disabled", "disabled"),
            e(".ocrext-quickselect-btn-container .ocrext-btn").addClass("disabled").attr("disabled", "disabled"),
            this
        },
        setStatus: function(t, o, r) {
            "error" === t ? e(".ocrext-content").addClass("ocrext-error") : e(".ocrext-content").removeClass("ocrext-error"),
            e(".ocrext-status").removeClass("ocrext-success ocrext-error ocrext-progress").addClass("error" === t ? "ocrext-error" : "success" === t ? "ocrext-success" : "ocrext-progress").text(o),
            r || setTimeout((function() {
                e(".ocrext-status").removeClass("ocrext-success ocrext-error ocrext-progress")
            }
            ), 1e4)
        },
        slideDown: function() {
            var t = e(".ocrext-wrapper");
            t.css({
                bottom: -t.height()
            })
        },
        slideUp: function() {
            e(".ocrext-wrapper").css("bottom", -8)
        },
        setOverlayInformation: function(e, t) {
            this._overlay = e
        },
        resetOverlayInformation: function() {
            this._overlay = null
        },
        showOverlay: function() {
            var t = e("#ocrext-can")
              , o = e("#ocrext-canOrig");
            this.textOverlay.setOverlayInformation(this._overlay, t.width(), t.height(), null, t.width() / o.width()).show()
        },
        showOverlayTab: function() {
            var t = e("#ocrext-can")
              , o = e("#ocrext-canOrig");
            chrome.runtime.sendMessage({
                evt: "show-overlay-tab",
                overlayInfo: this._overlay,
                imgDataURI: t.get(0).toDataURL(),
                canWidth: t.width(),
                canHeight: t.height(),
                zoom: t.width() / o.width()
            }, (function() {}
            ))
        },
        hideOverlay: function() {
            this.textOverlay.hide()
        },
        resetOverlay: function() {
            this.textOverlay.reset().hide()
        }
    };
    E().done((function() {
        e(document.body).on("keydown", (function(t) {
            if (t.ctrlKey && t.shiftKey) {
                if (t.keyCode === p.openGrabbingScreenHotkey)
                    return chrome.runtime.sendMessage({
                        evt: "activate"
                    }),
                    t.stopPropagation(),
                    t.preventDefault(),
                    !1;
                if (t.keyCode === p.closePanelHotkey)
                    return e(".ocrext-closeToolbar-link").click(),
                    t.stopPropagation(),
                    t.preventDefault(),
                    !1;
                if (t.keyCode === p.copyTextHotkey)
                    return e(".ocrext-ocr-copy").click(),
                    t.stopPropagation(),
                    t.preventDefault(),
                    !1
            }
        }
        ))
    }
    )),
    window.OCRTranslator = N,
    window.onOCRRecapture = H
}(jQuery);
