define('tab', ['core', 'utility'], function(jXrm, util) {

    // method name | sdk method name | collection | return value | paramenter
    var m = [
        'setVisible||t',
        'getVisible||t|1',
        'getLabel||t|1',
        'setLabel||t',
        'getName||t|1',
        'getDisplayState||t|1',
        'setDisplayState||t',
        'show|setVisible|t||1',
        'hide|setVisible|t||0',
        'change|addTabStateChange|t',
    ];
    util.toObject(jXrm.fn1, m);

    util.extend(jXrm.fn1, {
        toggleVisible : function() {
            this.tabs.exec(function(c) {
                if (c && c.setVisible) c.setVisible(!c.getVisible());
            });
            return this;
        }
    });

    Object.defineProperty(jXrm.fn1, 'name', {
        get: function() {
            return this.tabs.exec(function(c) {
                return (c && c.getName) ? c.getName() : null;
            });
        }
    });

    Object.defineProperty(jXrm.fn1, 'label', {
        get: function() {
            return this.tabs.exec(function(c) {
                return (c && c.getLabel) ? c.getLabel() : null;
            });
        },
        set: function(v) {
            this.tabs.exec(function(c) {
                if (c && c.setLabel)  c.setLabel(v);
            });
        }
    });
    Object.defineProperty(jXrm.fn1, 'state', {
        get: function() {
            return this.tabs.exec(function(c) {
                return (c && c.getDisplayState) ? c.getDisplayState() : null;
            });
        },
        set: function(v) {
            this.tabs.exec(function(c) {
                if (c && c.setDisplayState)  c.setDisplayState(v);
            });
        }
    });
    Object.defineProperty(jXrm.fn1, 'visible', {
        get: function() {
            return this.tabs.exec(function(c) {
                return (c && c.getVisible) ? c.getVisible() : null;
            });
        },
        set: function(v) {
            this.tabs.exec(function(c) {
                if (c && c.setVisible)  c.setVisible(v);
            });
        }
    });

      
    return jXrm;
});