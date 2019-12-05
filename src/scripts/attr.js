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
    // method name | sdk method name | collection | return value | paramenter
    var m = ['getType|getAttributeType|a|1', 
        'isDirty|getIsDirty|a|1', 
        'isPartyList|getIsPartyList|a|1', 
        'isValid||a|1',
        'maxLength|getMaxLength|a|1',
        'getRequiredLevel||a|1',
        'setRequiredLevel||a',
        'required|setRequiredLevel|a||required',
        'recommended|setRequiredLevel|a||recommended',
        'getSubmitMode||a|1',
        'setSubmitMode||a',
        'getVisible||c|1',
        'setVisible||c',
        'show|setVisible|c||1',
        'hide|setVisible|c||0',
        'parent|getParent|a|1',
        'getPrivilege|getUserPrivilege|a|1',
        'change|addOnChange|a',
        'removeOnChange||a',
        'fireOnChange||a',

        'addCustomFilter||c',
        
    ];
    util.toObject(jXrm.fn, m);

    util.extend(jXrm.fn, {
        val: function(v, fireOnChange) {
            if (v=== undefined) 
                return this.attributes.exec(function(a) {
                    return a && a.getValue ? a.getValue() : null;
                });
            else {
                this.attributes.exec(function(a) {
                    if (a && a.setValue) a.setValue(v);
                    if (fireOnChange === true) a.fireOnChange();
                });
                return this;
            }
        },
        focus : function() {
            if(this.controls.first && this.controls.first.setFocus) this.controls.first.setFocus();
            return this;
        },
        toggleVisible : function() {
            this.controls.exec(function(c) {
                if (c && c.setVisible) c.setVisible(!c.getVsible());
            });
            return this;
        },
        on: function(evt, handler) {
            
        }
    });

    return jXrm;
});