define('section', ['core', 'utility'], function(jXrm, util) {

    // method name | sdk method name | collection | return value | paramenter
    var m = [
        'setVisible||s',
        'show|setVisible|s||1',
        'hide|setVisible|s||0',
        'disable|setDisabled|s||1',
        'enable|setDisabled|s||0'
    ];
    util.toObject(jXrm.fn2, m);

    util.extend(jXrm.fn2, {
        toggleVisible : function() {
            this.sections.exec(function(c) {
                if (c && c.setVisible) c.setVisible(!c.getVsible());
            });
            return this;
        },
    });

    return jXrm;
});