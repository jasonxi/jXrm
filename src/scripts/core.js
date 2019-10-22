define(['xrm', 'selector', 'collection'], function(xrm, sltr, Collection) {
    "use strict";
    if (typeof(jXrm) === "undefined") {
        jXrm = {__namespace: true};
    }

    var ver = '0.01';
    jXrm = function(selector, context) {
        return jXrm.fn.init(selector, context);
    };

    jXrm.fn = jXrm.prototype = {
        version: ver,
        init: function (selector, ctx) {
            var attrs = this.attributes = new Collection();
            var ctrls = this.controls = new Collection();
            var elms = sltr.parse(selector);
            if (elms.length > 0) {
                elms.forEach(function(elm) {
                    switch(elm.type) {
                        case 'ID':
                            attrs.push(Xrm.Page.getAttribute(elm.id));
                            ctrls.push(Xrm.Page.getControl(elm.id));
                      }
                });
            } else {
                console.log('Invalid selector.');
            }
            this.context = null;
            return this;
        }
    };

    jXrm.enum = {};

    return jXrm;
});