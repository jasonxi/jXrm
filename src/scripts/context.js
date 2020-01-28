define('context', ['core'], function(jXrm) {
    "use strict";
    var getContext = function(executionContext) {
        var ctx = jXrm.getFormContext(executionContext).context;
        return ctx;
    };
    var getGlobalContext = function() {
        var ctx = Xrm.Utility.getGlobalContext();
        return ctx;
    };
    jXrm.context =  {
        getUserId: function(executionContext) {
            return getContext(executionContext).getUserId();
        },
        getUserName: function(executionContext) {
            return getContext(executionContext).getUserName();
        },
        getUserRoles: function(executionContext) {
            return getContext(executionContext).getUserRoles();
        },
        getClientUrl: function() {
            return getGlobalContext().getClientUrl();
        },
        get isOffline() {
            return getGlobalContext().client.isOffline();
        }
    };

    return jXrm;
});