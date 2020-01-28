define('data', ['core', 'utility'], function(jXrm, util) {
    util.extend(jXrm, {
        save: function(successHandler, errHandler, context) {
            jXrm.getFormContext(context).data.save().then(successHandler, errHandler);
            return this;
        },
        refresh: function(save, successHandler, errHandler, context) {
            jXrm.getFormContext(context).data.refresh(save).then(successHandler, errHandler);
            return this;
        },
        addOnLoad: function(handler, context) {
            jXrm.getFormContext(context).data.addOnLoad(handler);
            return this;
        }
    });

    return jXrm;
});