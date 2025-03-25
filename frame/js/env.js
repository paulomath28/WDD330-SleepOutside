const debug = !1;
void 0 === window.browser && void 0 !== window.chrome && (window.browser = window.chrome),
void 0 === window.browser && void 0 !== window.safari && (window.browser = window.safari);
const TestEnv = {
    backensterKey: "8b68e2e73e27ad625f197c74e4403c716f1854e8",
    rateUrl: ""
}
  , FirefoxEnv = {
    backensterKey: "78f54c05e71da015bdc316d03d10f30f17bf4d49",
    rateUrl: ""
}
  , OperaEnv = {
    backensterKey: "eb86e2d781c5948db8d2b28762de789ebe7574ca",
    rateUrl: ""
}
  , ChromeEnv = {
    backensterKey: "09c0217b8ff14da927ab7556b7e2aa5e42a0b0d9",
    rateUrl: ""
}
  , EdgeEnv = {
    backensterKey: "a65279118f11c96516d185a999617fd8124bbfc1",
    rateUrl: ""
}
  , SavariEnv = {
    backensterKey: "9b8ddfd5dc3b7ba4b312d95bd2593535969aeb1e",
    rateUrl: ""
};
function debug_log(e) {
    false
}
function detectBrowser() {
    try {
        const e = navigator.userAgent;
        if (e.match(/chrome|chromium|crios/i))
            return "Chrome";
        if (e.match(/firefox|fxios/i))
            return "Firefox";
        if (e.match(/safari/i))
            return "Safari";
        if (e.match(/opr\//i))
            return "Opera";
        if (e.match(/edg/i))
            return "Edge"
    } catch (e) {}
    return "Other"
}
function getEnv() {
    switch (debug_log("Load env"),
    detectBrowser()) {
    case "Firefox":
        return FirefoxEnv;
    case "Opera":
        return OperaEnv;
    case "Edge":
        return EdgeEnv;
    case "Chrome":
        return ChromeEnv;
    case "Safari":
        return SavariEnv
    }
}
window.mtzEnv = getEnv();
