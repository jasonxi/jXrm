;(function() {
var xrm, core, context, utility, attr, main;
(function () {
  xrm = function () {
    if (typeof Xrm === 'undefined') {
      window.Xrm = { __namespace: true };
    }
    return Xrm;
  }();
  core = function () {
    if (typeof jXrm === 'undefined') {
      window.jXrm = { __namespace: true };
    }
    var ver = '0.01';
    jXrm = function (selector, context) {
      var attribute = null, control = null, id = null;
      return jXrm.fn.init(selector, context);
    };
    jXrm.fn = jXrm.prototype = {
      version: ver,
      init: function (selector, ctx) {
        this.attribute = Xrm.Page.getAttribute(selector);
        this.control = Xrm.Page.getAttribute(selector);
        this.context = null;
        return this;
      }
    };
    jXrm.enum = {};
    return jXrm;
  }();
  context = function (jXrm) {
    jXrm.context = {
      user: {
        id: Xrm.Page.context.getUserId().replace(/[{}]/g, '').toLowerCase(),
        name: Xrm.Page.context.getUserName(),
        roles: Xrm.Page.context.getUserRoles()
      }
    };
    return jXrm;
  }(core);
  utility = {
    extend: function (t, s) {
      if (typeof Object.assign != 'function') {
        Object.assign = function (target, varArgs) {
          // .length of function is 2
          'use strict';
          if (target == null) {
            // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
          }
          var to = Object(target);
          for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
              // Skip over if undefined or null
              for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }
          return to;
        };
      }
      Object.assign(t, s);
    }
  };
  attr = function (jXrm, util) {
    util.extend(jXrm.enum, {
      RequiredLevel: {
        None: 'none',
        Required: 'required',
        Recommended: 'recommended'
      },
      SubmitMode: {
        Always: 'always',
        Never: 'never',
        Dirty: 'dirty'
      }
    });
    util.extend(jXrm.fn, {
      // Get / set value
      val: function (v) {
        if (v === undefined)
          return this.attribute.getValue();
        else {
          this.attribute.setValue(v);
          return this;
        }
      },
      // Set focus
      focus: function () {
        this.control.setFocus();
        return this;
      },
      // Set requirement
      setRequiredLevel: function (level) {
        this.control.setRequiredLevel(level);
        return this;
      },
      // Set submit mode
      setSubmitMode: function (mode) {
        this.control.setSubmitMode(mode);
        return this;
      },
      // Show
      show: function () {
        this.control.setVisible(true);
        return this;
      },
      // Hide
      hide: function () {
        this.control.setVisible(false);
        return this;
      }
    });
    return jXrm;
  }(core, utility);
  main = function (jXrm) {
    return jXrm;
  }(core);
}());
}());