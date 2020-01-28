define(['xrm', 'selector', 'collection', 'utility'], function(xrm, sltr, Collection, util) {
    "use strict";
    if (typeof(jXrm) === "undefined") {
        jXrm = {__namespace: true};
    }

    var ver = '0.03';
    var getFormContext = function(context) {
        if (context && context.getFormContext) {
            return context.getFormContext();
        } else {
            return jXrm.formContext || Xrm.Page;
        }
    };

    var func = function(selector, context) {
        var attrs = this.attributes = new Collection();
        var ctrls = this.controls = new Collection();
        var frmCtx = getFormContext(context);
        var elms = sltr.parse(selector);
        if (elms.length > 0) {
            elms.forEach(function(elm) {
                switch(elm.type) {
                    case 'ID':
                        attrs.push(frmCtx.getAttribute(elm.id));
                        ctrls.push(frmCtx.getControl(elm.id));
                }
            });
        } else {
            console.log('Invalid selector.');
        }
    };

    jXrm = function(selector, context) {
        return new func(selector, context);
    };

    jXrm.fn0 = func.prototype = { };
    jXrm.fn = jXrm.prototype = {
        version: ver
    };

    util.extend(jXrm, {
        getFormContext: getFormContext,
        set executeContext(context) {
            jXrm.formContext = getFormContext(context);
        },
        enum: {}
    });

    return jXrm;
});