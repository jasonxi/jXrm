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
        var self = this;
//        this.prototype = jXrm.fn0;
        var frmCtx = getFormContext(context);
        var elms = sltr.parse(selector);
        if (elms.length > 0) {
            elms.forEach(function(elm) {
                switch(elm.type) {
                    case 'ID':
                        self.type = 'a';
                        if (!self.attributes) {
                            self.attributes = new Collection();
                            self.controls = new Collection();
                        }
                        self.attributes.push(frmCtx.getAttribute(elm.id));
                        self.controls.push(frmCtx.getControl(elm.id));
                        break;
                    case 'TAB':
                        self.type = 't';
                        if (!self.tabs)
                            self.tabs = new Collection();
                        self.tabs.push(frmCtx.ui.tabs.get(elm.id));
                        break;
                    case 'SECTION':
                        self.type = 's';
                        if (!self.sections)
                            self.sections = new Collection();
                        var tabs = frmCtx.ui.tabs.get();
                        if (tabs){
                            tabs.forEach(function(tab){
                                var sec = tab.sections.get(elm.id);
                                if (sec) {
                                    self.sections.push(sec);
                                }
                            })
                        }
                        break;
                }
            });
        } else {
            console.log('Invalid selector.');
        }
    };

    jXrm = function(selector, context) {
        var r = new func(selector, context);
        switch(r.type) {
            case 'a':
                r.__proto__ = jXrm.fn0;
                break;
            case 't':
                r.__proto__ = jXrm.fn1;
                break;
            case 's':
                r.__proto__ = jXrm.fn2;
                break;
        }
        
        return r;
    };

    jXrm.fn0 = {};
    jXrm.fn1 = {};
    jXrm.fn2 = {};

//    func.prototype = jXrm.fn0 = { };
    jXrm.fn = jXrm.prototype = {
        version: ver
    };

    util.extend(jXrm, {
        getFormContext: getFormContext,
        set executionContext(context) {
            jXrm.formContext = getFormContext(context);
        },
        enum: {}
    });

    return jXrm;
});