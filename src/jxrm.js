;(function() {
var xrm, selector, collection, core, context, utility, attr, main;
xrm = function () {
  if (typeof Xrm === 'undefined') {
    window.Xrm = { __namespace: true };
  }
  return Xrm;
}();
selector = function () {
  //var tokenCache = createCache(),
  // http://www.w3.org/TR/css3-selectors/#whitespace
  var whitespace = '[\\x20\\t\\r\\n\\f]',
    // https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
    identifier = '(?:\\\\[\\da-fA-F]{1,6}' + whitespace + '?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+',
    // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    attributes = '\\[' + whitespace + '*(' + identifier + ')(?:' + whitespace + // Operator (capture 2)
    '*([*^$|!~]?=)' + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
    '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' + identifier + '))|)' + whitespace + '*\\]', pseudos = ':(' + identifier + ')(?:\\((' + // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
    // 1. quoted (capture 3; capture 4 or capture 5)
    '(\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|' + // 2. simple (capture 6)
    '((?:\\\\.|[^\\\\()[\\]]|' + attributes + ')*)|' + // 3. anything else (capture 2)
    '.*' + ')\\)|)',
    // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    rwhitespace = new RegExp(whitespace + '+', 'g'), rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g'), rcomma = new RegExp('^' + whitespace + '*,' + whitespace + '*'), rcombinators = new RegExp('^' + whitespace + '*([>+~]|' + whitespace + ')' + whitespace + '*'), rdescend = new RegExp(whitespace + '|>'), rpseudo = new RegExp(pseudos), ridentifier = new RegExp('^' + identifier + '$'), matchExpr = {
      ID: new RegExp('^#(' + identifier + ')'),
      TAG: new RegExp('^%(' + identifier + ')'),
      SECTION: new RegExp('^$(' + identifier + ')'),
      CLASS: new RegExp('^\\.(' + identifier + ')'),
      ATTR: new RegExp('^' + attributes)
    }, rsibling = /[+~]/,
    // CSS escapes
    // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    runescape = new RegExp('\\\\[\\da-fA-F]{1,6}' + whitespace + '?|\\\\([^\\r\\n\\f])', 'g');
  function parseSelector(selector, context) {
    var t = [], match;
    if (selector != null && selector != '') {
      var groups = selector.split(',');
      groups.forEach(function (v) {
        v = v.replace(rtrim, '');
        for (var prop in matchExpr) {
          if (match = matchExpr[prop].exec(v)) {
            t.push({
              type: prop,
              value: match.shift(),
              id: match.shift().toLowerCase()
            });
            break;
          }
        }
      });
    }
    return t;  //return JSON.stringify(t);
  }
  return { parse: parseSelector };
}();
collection = function () {
  var Collection = function () {
    this.items = [];
  };
  Collection.prototype = {
    exec: function (callback) {
      if (this.items.length === 0 || !callback) {
        return null;
      } else if (this.items.length === 1 && callback) {
        return callback(this.items[0]);
      } else if (this.items.length > 1 && callback) {
        var r = {};
        this.items.forEach(function (a) {
          r[a.name] = callback(a);
        });
        return r;
      }  // var r = this.items.map(function (a) {
         //   if (callback) 
         //     return callback(a);
         // });
         // return r && r.length > 0 ? r.length === 1 ? r[0] : r : null;
    },
    push: function (o) {
      this.items.push(o);
    },
    get first() {
      return this.items.length > 0 ? this.items[0] : null;
    },
    get length() {
      return this.items.length;
    }
  };
  return Collection;
}();
core = function (xrm, sltr, Collection) {
  if (typeof jXrm === 'undefined') {
    jXrm = { __namespace: true };
  }
  var ver = '0.01';
  jXrm = function (selector, context) {
    return jXrm.fn.init(selector, context);
  };
  jXrm.fn = jXrm.prototype = {
    version: ver,
    init: function (selector, ctx) {
      var attrs = this.attributes = new Collection();
      var ctrls = this.controls = new Collection();
      var elms = sltr.parse(selector);
      if (elms.length > 0) {
        elms.forEach(function (elm) {
          switch (elm.type) {
          case 'ID':
            attrs.push(Xrm.Page.getAttribute(elm.id));
            ctrls.push(Xrm.Page.getControl(elm.id));
          }
        });
      } else {
        console.log('Invalid selector.');
      }
      this.context = null;
      return this;
    }
  };
  jXrm.enum = {};
  return jXrm;
}(xrm, selector, collection);
context = function (jXrm) {
  jXrm.context = function () {
    return {
      user: {
        id: Xrm.Page.context.getUserId().replace(/[{}]/g, '').toLowerCase(),
        name: Xrm.Page.context.getUserName(),
        roles: Xrm.Page.context.getUserRoles()
      }
    };
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
  },
  toObject: function (obj, props) {
    if (!obj)
      obj = {};
    props.forEach(function (prop) {
      if (prop !== null) {
        var p = prop.split('|');
        if (!p[1])
          p[1] = p[0];
        obj[p[0]] = function (x) {
          var c = p[2] === 'a' ? obj.attributes : obj.controls;
          if (p[4])
            x = p[4];
          if (c) {
            if (p[3]) {
              // return
              return c.exec(function (o) {
                return o && o[p[1]] ? o[p[1]](x) : null;
              });
            } else {
              c.exec(function (o) {
                if (o && o[p[1]])
                  o[p[1]](x);
              });
              return obj;
            }
          }
        };
      }
    });
    return obj;
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
  // method name | sdk method name | collection | return value | paramenter
  var m = [
    'getType|getAttributeType|a|1',
    'isDirty|getIsDirty|a|1',
    'isPartyList|getIsPartyList|a|1',
    'maxLength|getMaxLength|a|1',
    'setRequiredLevel||c',
    'required|setRequiredLevel|c||required',
    'recommended|setRequiredLevel|c||recommended',
    'getSubmitMode||a|1',
    'setSubmitMode||a',
    'getVisible||c|1',
    'show|setVisible|c||1',
    'hide|setVisible|c||0',
    'parent|getParent|a|1',
    'getPrivilege|getUserPrivilege|a|1',
    'change|addOnChange|a',
    ''
  ];
  util.toObject(jXrm.fn, m);
  util.extend(jXrm.fn, {
    val: function (v, fireOnChange) {
      if (v === undefined)
        return this.attributes.exec(function (a) {
          return a && a.getValue ? a.getValue() : null;
        });
      else {
        this.attributes.exec(function (a) {
          if (a && a.setValue)
            a.setValue(v);
          if (fireOnChange === true)
            a.fireOnChange();
        });
        return this;
      }
    },
    focus: function () {
      if (this.controls.first && this.controls.first.setFocus)
        this.controls.first.setFocus();
      return this;
    },
    toggleVisible: function () {
      this.controls.exec(function (c) {
        if (c && c.setVisible)
          c.setVisible(!c.getVsible());
      });
      return this;
    },
    on: function (evt, handler) {
    }
  });
  return jXrm;
}(core, utility);
(function (jXrm) {
  window.jXrm = jXrm;
  return jXrm;
}(core));
main = undefined;
}());