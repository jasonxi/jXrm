
define(['xrm'], function() {
    "use strict";
    if (typeof(jXrm) === "undefined") {
        window.jXrm = {__namespace: true};
    }

    var ver = '0.01';
    jXrm = function(selector, context) {
        return jXrm.fn.init(selector, context);
    };

    jXrm.fn = jXrm.prototype = {
        version: ver,
        init: function (selector, ctx) {
            this.attribute = Xrm.Page.getAttribute(selector);
            this.control = Xrm.Page.getAttribute(selector);
            this.context = null;
            return this;
        }

    };

    jXrm.enum = {};

    return jXrm;
});