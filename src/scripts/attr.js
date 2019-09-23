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
                return this.attribute.getValue();
            else {
                this.attribute.setValue(v);
                return this;
            }
        },
        // Set focus
        focus : function() {
            this.control.setFocus();
            return this;
        },
        // Set requirement
        setRequiredLevel : function(level) {
            this.control.setRequiredLevel(level);
            return this;
        },
        // Set submit mode
        setSubmitMode : function(mode) {
            this.control.setSubmitMode(mode);
            return this;
        },
        // Show
        show : function() {
            this.control.setVisible(true);
            return this;
        },
        // Hide
        hide : function() {
            this.control.setVisible(false);
            return this;
        }
    });

    return jXrm;
});