!function() {
    "use strict";
    let t, e = function() {
        let t, e, n, r, i, o, s, a = function() {
            return !!t && t.HasOverlay
        };
        return e = $(".ocrext-textoverlay-container"),
        n = ['<div class="ocrext-element ocrext-text-overlay">', '<div class="ocrext-element ocrext-text-overlay-word-wrapper">', '<img class="ocrext-element ocrext-text-overlay-img" id="text-overlay-img"/>', "</div>", "</div>"].join(""),
        r = '<span class="ocrext-element ocrext-text-overlay-word"></span>',
        s = function(t) {
            i = $(n),
            i.appendTo(e),
            e.on("click", ".ocrext-close-link", (function() {
                o.hide()
            }
            ))
        }
        ,
        o = {
            setOverlayInformation: function(e, n, r, i, o) {
                return t || (t = e,
                this.render(n, r, i, o)),
                this
            },
            getOverlayInformation: function() {
                return t
            },
            render: function(n, r, o, s) {
                if (s = s || 1,
                a()) {
                    let a, l = t.Lines, c = i.find(".ocrext-text-overlay-word-wrapper");
                    o && e.find("#text-overlay-img").attr("src", o),
                    this.setDimensions(n, r),
                    $.each(l, (function(t, e) {
                        let n = e.MaxHeight * s
                          , r = e.MinTop * s;
                        $.each(e.Words, (function(t, e) {
                            a = $('<span class="ocrext-element ocrext-text-overlay-word"></span>'),
                            a.text(e.WordText).css({
                                left: e.Left * s,
                                top: r,
                                height: n,
                                width: e.Width * s,
                                fontSize: .7 * n
                            }).appendTo(c),
                            a = null
                        }
                        ))
                    }
                    ))
                }
                return this
            },
            setDimensions: function(t, e) {
                return $.each([i, i.find(".ocrext-text-overlay-word-wrapper")], (function() {
                    this.width(t).height(e)
                }
                )),
                this
            },
            reset: function() {
                return t = null,
                i.find(".ocrext-text-overlay-word-wrapper span").remove(),
                this
            },
            show: function() {
                return a() && (e.addClass("visible"),
                i.addClass("visible")),
                this
            },
            hide: function() {
                return e.removeClass("visible"),
                i.removeClass("visible"),
                this
            },
            position: function() {
                let t, e;
                return t = $("body").width(),
                e = $(window).height(),
                i.css({
                    left: t / 2 - i.width() / 2,
                    top: 150
                }),
                this
            },
            setTitle: function() {
                return $("title,.ocrext-textoverlay-title").text(chrome.i18n.getMessage("overlayTab")),
                this
            },
            listenToBackgroundEvents: function() {
                let t = this;
                chrome.runtime.onMessage.addListener((function(e, n, r) {
                    return !!n.tab || ("init-overlay-tab" === e.evt ? (t.setOverlayInformation(e.overlayInfo, e.canWidth, e.canHeight, e.imgDataURI, e.zoom),
                    t.show(),
                    r({
                        farewell: "init-overlay-tab:OK"
                    }),
                    !0) : void 0)
                }
                ))
            }
        },
        s(),
        o
    };
    $("body").attr("data-ocrext-run") && (t = e(),
    t.listenToBackgroundEvents(),
    t.setTitle()),
    window.__TextOverlay__ = e
}();
