(function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload"))
        return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]'))
        n(r);
    new MutationObserver(r => {
        for (const o of r)
            if (o.type === "childList")
                for (const s of o.addedNodes)
                    s.tagName === "LINK" && s.rel === "modulepreload" && n(s)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function a(r) {
        const o = {};
        return r.integrity && (o.integrity = r.integrity),
        r.referrerPolicy && (o.referrerPolicy = r.referrerPolicy),
        r.crossOrigin === "use-credentials" ? o.credentials = "include" : r.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin",
        o
    }
    function n(r) {
        if (r.ep)
            return;
        r.ep = !0;
        const o = a(r);
        fetch(r.href, o)
    }
}
)();
function l(t) {
    return JSON.parse(localStorage.getItem(t))
}
function d(t, e) {
    localStorage.setItem(t, JSON.stringify(e))
}
function f(t) {
    const e = window.location.search;
    return new URLSearchParams(e).get(t)
}
function c(t, e, a, n) {
    e.insertAdjacentHTML("afterbegin", t),
    n && n(a)
}
async function i(t) {
    return await (await fetch(t)).text()
}
async function m() {
    const t = await i("../partials/header.html")
      , e = document.getElementById("main-header");
    c(t, e, null, u);
    const a = await i("../partials/footer.html")
      , n = document.getElementById("main-footer");
    c(a, n)
}
function u() {
    const t = l("so-cart") || []
      , e = document.getElementById("cart-count");
    e && (t.length === 0 ? e.style.display = "none" : (e.style.display = "block",
    e.textContent = t.length))
}
export {f as a, l as g, m as l, d as s, u};
