let piwik_idts, piwik_idvc, piwik_uuid, _paq = [];
function loadPiwikVars(i) {
    try {
        let t = chrome.storage.local || chrome.storage.sync;
        t.get(["mtz_uuid", "id", "userLogged"], (function({mtz_uuid: e, id: d, userLogged: r}) {
            chrome.runtime.error || (piwik_uuid = r ? d : e),
            t.get("piwik_idvc", (function(e) {
                chrome.runtime.error || (piwik_idvc = e.piwik_idvc),
                piwik_idvc || (piwik_idvc = 0),
                piwik_idvc++,
                t.set({
                    piwik_idvc: piwik_idvc
                }, (function() {}
                )),
                t.get("piwik_idts", (function(e) {
                    chrome.runtime.error || (piwik_idts = e.piwik_idts),
                    piwik_idts || (piwik_idts = Date.now(),
                    t.set({
                        piwik_idts: piwik_idts
                    }, (function() {}
                    ))),
                    i && i()
                }
                ))
            }
            ))
        }
        ))
    } catch (i) {}
}
_paq.push(["setCustomVariable", 1, "Visitor", "myfile", "page"]);
