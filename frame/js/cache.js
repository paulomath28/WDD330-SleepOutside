var localCache = {
    timeout: 3e4,
    data: {},
    remove: function(a) {
        delete localCache.data[a]
    },
    exist: function(a) {
        return !!localCache.data[a] && (new Date).getTime() - localCache.data[a]._ < localCache.timeout
    },
    get: function(a) {
        return localCache.data[a].data
    },
    set: function(a, e, t) {
        localCache.remove(a),
        localCache.data[a] = {
            _: (new Date).getTime(),
            data: e
        },
        $.isFunction(t) && t(e)
    }
};
$.ajaxPrefilter((function(a, e, t) {
    if (a.cache && "json" === a.dataType) {
        var c = e.url + JSON.stringify(e.data);
        a.cache = !1,
        a.beforeSend = function() {
            return localCache.exist(c) || t.promise().done((function(a, e) {
                localCache.set(c, a)
            }
            )),
            !0
        }
    }
}
)),
$.ajaxTransport("+*", (function(a, e, t, c, n) {
    var o = e.url + JSON.stringify(e.data);
    if (a.cache = !1,
    localCache.exist(o))
        return {
            send: function(a, e) {
                e(200, "success", {
                    json: localCache.get(o)
                })
            },
            abort: function() {}
        }
}
));
