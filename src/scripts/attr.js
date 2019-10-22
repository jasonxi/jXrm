define('attr', ['core', 'utility'], function(jXrm, util) {
    util.extend(jXrm.enum, {
        RequiredLevel: {
            None: 'none',
            Required: 'required',
            Recommended:'recommended'
        },
        SubmitMode: {
            Always: 'always',
            Never: 'never',
            Dirty: 'dirty'
        }
    });
    util.extend(jXrm.fn, {
        // Get / set value
        val: function(v) {
            if (v=== undefined) 
                if (this.attributes.length === 1) 
                    return this.attributes.first.getValue();
                else
                    return this.attributes.items.map(function(a) {
                        return a.getValue();
                    });
            else {
                this.attributes.exec(function(a) {
                    a.setValue(v);
                });
                return this;
            }
        },
        // Set focus
        focus : function() {
            this.controls.first.setFocus();
            return this;
        },
        // Set requirement
        setRequiredLevel : function(level) {
            this.controls.exec(function(c) {
                c.setRequiredLevel(level);
            });
            return this;
        },
        // Set submit mode
        setSubmitMode : function(mode) {
            this.controls.exec(function(c) {
                c.setSubmitMode(level);
            }); 
            return this;
        },
        // Show
        show : function() {
            this.controls.exec(function(c) {
                c.setVisible(true);
            }); 
            return this;
        },
        // Hide
        hide : function() {
            this.controls.exec(function(c) {
                c.setVisible(false);
            }); 
            return this;
        }
    });

    return jXrm;
});