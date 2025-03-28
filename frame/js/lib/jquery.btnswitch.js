if ("undefined" == typeof jQuery)
    throw alert("jQuery Switch Button requires jQuery"),
    new Error("jQuery Switch Button requires jQuery");
if (jQuery.fn.jquery < "2.0")
    throw alert("Incompatible version of jQuery detected, please upgrade to at least 2.0"),
    new Error("Incompatible version of jQuery detected, please upgrade to at least 2.0");
!function(t) {
    t.fn.btnSwitch = function(e) {
        var a = function(e, a) {
            a == n.OnValue ? (t('button[data-toggle="' + e + '"][data-title="' + n.OnValue + '"]').removeClass("button-default").addClass("button-on"),
            t('button[data-toggle="' + e + '"][data-title="' + n.OffValue + '"]').removeClass("button-off").addClass("button-default"),
            t.isFunction(n.OnCallback) && n.OnCallback(a)) : (t('button[data-toggle="' + e + '"][data-title="' + n.OnValue + '"]').removeClass("button-on").addClass("button-default"),
            t('button[data-toggle="' + e + '"][data-title="' + n.OffValue + '"]').removeClass("button-default").addClass("button-off"),
            t.isFunction(n.OffCallback) && n.OffCallback(a)),
            t('button[data-toggle="' + e + '"]').not('[data-title="' + a + '"]').prop("disabled", !1).removeClass("active").addClass("notActive"),
            t('button[data-toggle="' + e + '"][data-title="' + a + '"]').prop("disabled", !0).removeClass("notActive").addClass("active")
        }
          , l = function(e, a, l, i) {
            l ? (t("#light-" + a).removeClass("tgl-sw-light-checked tgl-sw-active"),
            e.data("state", !1),
            t.isFunction(n.OffCallback) && n.OffCallback(i)) : (t("#light-" + a).addClass("tgl-sw-light-checked tgl-sw-active"),
            e.data("state", !0),
            t.isFunction(n.OnCallback) && n.OnCallback(i))
        }
          , i = function(e, a, l, i) {
            l ? (t("#swipe-" + a).removeClass("tgl-sw-swipe-checked tgl-sw-active"),
            e.data("state", !1),
            t.isFunction(n.OffCallback) && n.OffCallback(i)) : (t("#swipe-" + a).addClass("tgl-sw-swipe-checked tgl-sw-active"),
            e.data("state", !0),
            t.isFunction(n.OnCallback) && n.OnCallback(i))
        }
          , d = function(e, a, l, i) {
            l ? (t("#ios-" + a).removeClass("tgl-sw-ios-checked tgl-sw-active"),
            e.data("state", !1),
            t.isFunction(n.OffCallback) && n.OffCallback(i)) : (t("#ios-" + a).addClass("tgl-sw-ios-checked tgl-sw-active"),
            e.data("state", !0),
            t.isFunction(n.OnCallback) && n.OnCallback(i))
        }
          , s = function(e, a, l, i) {
            l ? (t("#android-" + a).removeClass("tgl-sw-android-checked tgl-sw-active"),
            e.data("state", !1),
            t.isFunction(n.OffCallback) && n.OffCallback(i)) : (t("#android-" + a).addClass("tgl-sw-android-checked tgl-sw-active"),
            e.data("state", !0),
            t.isFunction(n.OnCallback) && n.OnCallback(i))
        }
          , n = t.extend({
            Theme: "Button",
            OnText: "On",
            OffText: "Off",
            OnValue: !0,
            OffValue: !1,
            OnCallback: null,
            OffCallback: null,
            ToggleState: !1,
            ConfirmChanges: !1,
            ConfirmText: "Are you sure?",
            HiddenInputId: !1
        }, e);
        return this.each((function() {
            var e, o, c = Math.floor(1e6 * Math.random() + 1), u = t(this), r = this.id;
            switch (n.Theme) {
            case "Button":
            default:
                e = '<div id="bsh-' + r + '"><button type="button" class="button-group button-on" data-toggle="' + c + '" data-title="' + n.OnValue + '" disabled>' + n.OnText + '</button><button type="button" class="button-group button-default" data-toggle="' + c + '" data-title="' + n.OffValue + '">' + n.OffText + '</button></div><div style="clear:both"></div>',
                o = '<div id="bsh-' + r + '"><button type="button" class="button-group button-default" data-toggle="' + c + '" data-title="' + n.OnValue + '">' + n.OnText + '</button><button type="button" class="button-group button-off" data-toggle="' + c + '" data-title="' + n.OffValue + '" disabled>' + n.OffText + '</button></div><div style="clear:both"></div>',
                u.html(n.ToggleState == n.OnValue ? e : o),
                t("#bsh-" + r + " button").on("click", (function() {
                    var e = t(this).data("title");
                    n.ConfirmChanges ? confirm(n.ConfirmText) && (0 != n.HiddenInputId && t("#" + n.HiddenInputId).prop("value", e),
                    a(c, e)) : (0 != n.HiddenInputId && t("#" + n.HiddenInputId).prop("value", e),
                    a(c, e))
                }
                ));
                break;
            case "Light":
                e = '<div id="bsh-' + r + '"><input class="tgl-sw tgl-sw-light tgl-sw-light-checked tgl-sw-active" id="light-' + r + '" type="checkbox" checked><label class="btn-switch" for="light-' + r + '" id="sw-light-' + c + '" data-state="true"></label></div><div style="clear:both"></div>',
                o = '<div id="bsh-' + r + '"><input class="tgl-sw tgl-sw-light" id="light-' + r + '" type="checkbox"><label class="btn-switch" for="light-' + r + '" id="sw-light-' + c + '" data-state="false"></label></div><div style="clear:both"></div>',
                u.html(n.ToggleState == n.OnValue ? e : o),
                t("#sw-light-" + c).on("click", (function() {
                    var e = t(this).data("state")
                      , a = e ? n.OffValue : n.OnValue;
                    n.ConfirmChanges ? confirm(n.ConfirmText) && (0 != n.HiddenInputId && t("#" + n.HiddenInputId).prop("value", a),
                    l(t(this), r, e, a)) : (0 != n.HiddenInputId && t("#" + n.HiddenInputId).prop("value", a),
                    l(t(this), r, e, a))
                }
                ));
                break;
            case "Swipe":
                e = '<div id="bsh-' + r + '"><input class="tgl-sw tgl-sw-swipe tgl-sw-swipe-checked tgl-sw-active" id="swipe-' + r + '" type="checkbox" checked><label class="btn-switch" for="swipe-' + r + '" id="sw-swipe-' + c + '" data-tg-off="' + n.OffText + '" data-tg-on="' + n.OnText + '" data-state="true"></label></div><div style="clear:both"></div>',
                o = '<div id="bsh-' + r + '"><input class="tgl-sw tgl-sw-swipe" id="swipe-' + r + '" type="checkbox"><label class="btn-switch" for="swipe-' + r + '" id="sw-swipe-' + c + '" data-tg-off="' + n.OffText + '" data-tg-on="' + n.OnText + '" data-state="false"></label></div><div style="clear:both"></div>',
                u.html(n.ToggleState == n.OnValue ? e : o),
                t("#sw-swipe-" + c).on("click", (function() {
                    var e = t(this).data("state")
                      , a = e ? n.OffValue : n.OnValue
                      , l = t("#swipe-" + r);
                    n.ConfirmChanges ? confirm(n.ConfirmText) ? (0 != n.HiddenInputId && t("#" + n.HiddenInputId).prop("value", a),
                    i(t(this), r, e, a)) : l.is(":checked") ? l.prop("checked", !1) : l.attr("checked", !0) : (0 != n.HiddenInputId && t("#" + n.HiddenInputId).prop("value", a),
                    i(t(this), r, e, a))
                }
                ));
                break;
            case "iOS":
                e = '<div id="bsh-' + r + '"><input class="tgl-sw tgl-sw-ios tgl-sw-ios-checked tgl-sw-active" id="ios-' + r + '" type="checkbox" checked><label class="btn-switch" for="ios-' + r + '" id="sw-ios-' + c + '" data-state="true"></label></div><div style="clear:both"></div>',
                o = '<div id="bsh-' + r + '"><input class="tgl-sw tgl-sw-ios" id="ios-' + r + '" type="checkbox"><label class="btn-switch" for="ios-' + r + '" id="sw-ios-' + c + '" data-state="false"></label></div><div style="clear:both"></div>',
                u.html(n.ToggleState == n.OnValue ? e : o),
                t("#sw-ios-" + c).on("click", (function() {
                    var e = t(this).data("state")
                      , a = e ? n.OffValue : n.OnValue;
                    n.ConfirmChanges ? confirm(n.ConfirmText) && (0 != n.HiddenInputId && t("#" + n.HiddenInputId).prop("value", a),
                    d(t(this), r, e, a)) : (0 != n.HiddenInputId && t("#" + n.HiddenInputId).prop("value", a),
                    d(t(this), r, e, a))
                }
                ));
                break;
            case "Android":
                e = '<div id="bsh-' + r + '"><input class="tgl-sw tgl-sw-android tgl-sw-android-checked tgl-sw-active" id="android-' + r + '" type="checkbox" checked><label class="btn-switch" for="android-' + r + '" id="sw-android-' + c + '" data-state="true"></label></div><div style="clear:both"></div>',
                o = '<div id="bsh-' + r + '"><input class="tgl-sw tgl-sw-android" id="android-' + r + '" type="checkbox"><label class="btn-switch" for="android-' + r + '" id="sw-android-' + c + '" data-state="false"></label></div><div style="clear:both"></div>',
                u.html(n.ToggleState == n.OnValue ? e : o),
                t("#sw-android-" + c).on("click", (function() {
                    var e = t(this).data("state")
                      , a = e ? n.OffValue : n.OnValue;
                    n.ConfirmChanges ? confirm(n.ConfirmText) && (0 != n.HiddenInputId && t("#" + n.HiddenInputId).prop("value", a),
                    s(t(this), r, e, a)) : (0 != n.HiddenInputId && t("#" + n.HiddenInputId).prop("value", a),
                    s(t(this), r, e, a))
                }
                ))
            }
        }
        ))
    }
}(jQuery);
