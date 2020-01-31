define('context', ['core'], function(jXrm) {
    "use strict";

    var getGlobalContext = function() {
        return Xrm.Utility.getGlobalContext ? Xrm.Utility.getGlobalContext() : Xrm.Page.context;
    };

    jXrm.context =  {
        get userId() {
            var ctx = getGlobalContext();
            return ctx.userSettings ? ctx.userSettings.userId : ctx.getUserId();
        },
        get userName() {
            var ctx = getGlobalContext();
            return ctx.userSettings ? ctx.userSettings.userName : ctx.getUserName();
        },
        get roles() {
            var ctx = getGlobalContext();
            return ctx.userSettings ? ctx.userSettings.securityRoles : ctx.getUserRoles();
        },
        get clientUrl() {
            var ctx = getGlobalContext();
            return ctx.getClientUrl ? ctx.getClientUrl() : undefined;
        },
        get isOffline() {
            var ctx = getGlobalContext();
            return ctx.client ? ctx.client.isOffline() : undefined;
        }
    };

    return jXrm;
});