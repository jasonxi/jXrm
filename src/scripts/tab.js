define('tab', ['core', 'utility'], function(jXrm, util) {

    // method name | sdk method name | collection | return value | paramenter
    var m = [
        'setVisible||t',
        'show|setVisible|t||1',
        'hide|setVisible|t||0',
        'disable|setDisabled|t||1',
        'enable|setDisabled|t||0'
    ];
    util.toObject(jXrm.fn1, m);

    util.extend(jXrm.fn1, {
        toggleVisible : function() {
            this.tabs.exec(function(c) {
                if (c && c.setVisible) c.setVisible(!c.getVsible());
            });
            return this;
        },
    });

    return jXrm;
});