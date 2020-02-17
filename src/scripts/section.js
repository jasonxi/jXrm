define('section', ['core', 'utility'], function(jXrm, util) {

    // method name | sdk method name | collection | return value | paramenter
    var m = [
        'setVisible||s',
        'getVisible||s|1',
        'getLabel||s|1',
        'setLabel||s',
        'getName||s|1',
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
    
    Object.defineProperty(jXrm.fn2, 'name', {
        get: function() {
            return this.sections.exec(function(c) {
                return (c && c.getName) ? c.getName() : null;
            });
        }
    });

    Object.defineProperty(jXrm.fn2, 'label', {
        get: function() {
            return this.sections.exec(function(c) {
                return (c && c.getLabel) ? c.getLabel() : null;
            });
        },
        set: function(v) {
            this.sections.exec(function(c) {
                if (c && c.setLabel)  c.setLabel(v);
            });
        }
    });

    Object.defineProperty(jXrm.fn2, 'visible', {
        get: function() {
            return this.sections.exec(function(c) {
                return (c && c.getVisible) ? c.getVisible() : null;
            });
        },
        set: function(v) {
            this.sections.exec(function(c) {
                if (c && c.setVisible)  c.setVisible(v);
            });
        }
    });

    return jXrm;
});