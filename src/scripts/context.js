define('context', ['core'], function(jXrm) {
    jXrm.context = function() {
        return {
            user: {
                id: Xrm.Page.context.getUserId().replace(/[{}]/g, '').toLowerCase(),
                name: Xrm.Page.context.getUserName(), 
                roles: Xrm.Page.context.getUserRoles()
            }
        };
    };
    return jXrm;
});