define('context', ['core'], function(jXrm) {
    "use strict";
    var getContext = function() {
        var ctx = Xrm.Page.context;
        return ctx;
    };
    var getGlobalContext = function() {
        var ctx = Xrm.Utility.getGlobalContext();
        return ctx;
    };
    jXrm.context =  {
        getUserId: function() {
            return getContext().getUserId();
        },
        getUserName: function() {
            return getContext().getUserName();
        },
        getUserRoles: function() {
            return getContext().getUserRoles();
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