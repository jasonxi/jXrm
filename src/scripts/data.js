define('data', ['core', 'utility'], function(jXrm, util) {
    util.extend(jXrm, {
        save: function(successHandler, errHandler) {
            Xrm.Page.data.save().then(successHandler, errHandler);
            return this;
        },
        refresh: function(save, successHandler, errHandler) {
            Xrm.Page.data.refresh(save).then(successHandler, errHandler);
            return this;
        },
        addOnLoad: function(handler) {
            Xrm.Page.data.addOnLoad(handler);
            return this;
        }
    });

    return jXrm;
});