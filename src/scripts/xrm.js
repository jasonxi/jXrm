
define('xrm', [], function() {
    "use strict";
    if (typeof(Xrm) === "undefined") {
        window.Xrm = {__namespace: true};
    }
    return Xrm;
});