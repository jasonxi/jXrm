;(function() {
var xrm, selector, collection, utility, core, global, context, attr, tab, section, entity, ui, data, main;
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
      //    TAG: new RegExp("^%(" + identifier + ")"),
      TAB: new RegExp('^(?:tab|t)' + whitespace + '#(' + identifier + ')', 'i'),
      SECTION: new RegExp('^(?:section|s|sec)' + whitespace + '#(' + identifier + ')', 'i')  //    CLASS: new RegExp("^\\.(" + identifier + ")"),
                                                                                    //    ATTR: new RegExp("^" + attributes)
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
              id: match.shift()
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
          r[a.getName()] = callback(a);
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
        obj[p[0]] = function () {
          var c = null;
          switch (p[2]) {
          case 'a':
            c = this.attributes;
            break;
          case 'c':
            c = this.controls;
            break;
          case 't':
            c = this.tabs;
            break;
          case 's':
            c = this.sections;
            break;
          }
          var args = [];
          for (var i = 0; i < arguments.length; i++)
            args[i] = arguments[i];
          if (p[4])
            args[0] = p[4] === '1' ? true : p[4] === '0' ? false : p[4];
          if (c) {
            if (p[3]) {
              // return
              return c.exec(function (o) {
                return o && o[p[1]] ? o[p[1]].apply(o, args) : null;
              });
            } else {
              c.exec(function (o) {
                if (o && o[p[1]])
                  o[p[1]].apply(o, args);
              });
              return this;
            }
          }
        };
      }
    });
    return obj;
  }
};
core = function (xrm, sltr, Collection, util) {
  if (typeof jXrm === 'undefined') {
    jXrm = { __namespace: true };
  }
  var ver = '0.03';
  var getFormContext = function (context) {
    if (context && context.getFormContext) {
      return context.getFormContext();
    } else {
      return jXrm.formContext || Xrm.Page;
    }
  };
  var func = function (selector, context) {
    var self = this;
    //        this.prototype = jXrm.fn0;
    var frmCtx = getFormContext(context);
    var elms = sltr.parse(selector);
    if (elms.length > 0) {
      elms.forEach(function (elm) {
        switch (elm.type) {
        case 'ID':
          self.type = 'a';
          if (!self.attributes) {
            self.attributes = new Collection();
            self.controls = new Collection();
          }
          self.attributes.push(frmCtx.getAttribute(elm.id));
          self.controls.push(frmCtx.getControl(elm.id));
          break;
        case 'TAB':
          self.type = 't';
          if (!self.tabs)
            self.tabs = new Collection();
          self.tabs.push(frmCtx.ui.tabs.get(elm.id));
          break;
        case 'SECTION':
          self.type = 's';
          if (!self.sections)
            self.sections = new Collection();
          var tabs = frmCtx.ui.tabs.get();
          if (tabs) {
            tabs.forEach(function (tab) {
              var sec = tab.sections.get(elm.id);
              if (sec) {
                self.sections.push(sec);
              }
            });
          }
          break;
        }
      });
    } else {
      console.log('Invalid selector.');
    }
  };
  jXrm = function (selector, context) {
    var r = new func(selector, context);
    switch (r.type) {
    case 'a':
      r.__proto__ = jXrm.fn0;
      break;
    case 't':
      r.__proto__ = jXrm.fn1;
      break;
    case 's':
      r.__proto__ = jXrm.fn2;
      break;
    }
    return r;
  };
  jXrm.fn0 = {};
  jXrm.fn1 = {};
  jXrm.fn2 = {};
  //    func.prototype = jXrm.fn0 = { };
  jXrm.fn = jXrm.prototype = { version: ver };
  util.extend(jXrm, {
    getFormContext: getFormContext,
    set executionContext(context) {
      jXrm.formContext = getFormContext(context);
    },
    enum: {}
  });
  return jXrm;
}(xrm, selector, collection, utility);
global = {
  AlertOpts: {
    width: 450,
    height: 150
  },
  ConfirmOpts: {
    width: 450,
    height: 200
  }
};
context = function (jXrm) {
  var getGlobalContext = function () {
    return Xrm.Utility.getGlobalContext ? Xrm.Utility.getGlobalContext() : Xrm.Page.context;
  };
  jXrm.context = {
    get userId() {
      var ctx = getGlobalContext();
      return ctx.userSettings ? ctx.userSettings.userId : ctx.getUserId();
    },
    get userName() {
      var ctx = getGlobalContext();
      return ctx.userSettings ? ctx.userSettings.userName : ctx.getUserName();
    },
    get roles() {
      var ctx = getGlobalContext();
      return ctx.userSettings ? ctx.userSettings.securityRoles : ctx.getUserRoles();
    },
    get clientUrl() {
      var ctx = getGlobalContext();
      return ctx.getClientUrl ? ctx.getClientUrl() : undefined;
    },
    get isOffline() {
      var ctx = getGlobalContext();
      return ctx.client ? ctx.client.isOffline() : undefined;
    }
  };
  return jXrm;
}(core);
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
    'isValid||a|1',
    'maxLength|getMaxLength|a|1',
    'getRequiredLevel||a|1',
    'setRequiredLevel||a',
    'required|setRequiredLevel|a||required',
    'recommended|setRequiredLevel|a||recommended',
    'optional|setRequiredLevel|a||none',
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
    'getOption||a|1',
    'getOptions||a|1',
    'disable|setDisabled|c||1',
    'enable|setDisabled|c||0',
    'addCustomFilter||c',
    'addPreSearch||c',
    'removePreSearch||c'
  ];
  util.toObject(jXrm.fn0, m);
  util.extend(jXrm.fn0, {
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
          c.setVisible(!c.getVisible());
      });
      return this;
    },
    on: function (evt, handler) {
    },
    filter: function (entityName, fetchXml) {
      this.controls.exec(function (c) {
        if (c && c.addPreSearch)
          c.addPreSearch(function () {
            c.addCustomFilter(fetchXml, entityName);
          });
      });
      return this;
    }
  });
  return jXrm;
}(core, utility);
tab = function (jXrm, util) {
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
    'change|addTabStateChange|t'
  ];
  util.toObject(jXrm.fn1, m);
  util.extend(jXrm.fn1, {
    toggleVisible: function () {
      this.tabs.exec(function (c) {
        if (c && c.setVisible)
          c.setVisible(!c.getVisible());
      });
      return this;
    }
  });
  Object.defineProperty(jXrm.fn1, 'name', {
    get: function () {
      return this.tabs.exec(function (c) {
        return c && c.getName ? c.getName() : null;
      });
    }
  });
  Object.defineProperty(jXrm.fn1, 'label', {
    get: function () {
      return this.tabs.exec(function (c) {
        return c && c.getLabel ? c.getLabel() : null;
      });
    },
    set: function (v) {
      this.tabs.exec(function (c) {
        if (c && c.setLabel)
          c.setLabel(v);
      });
    }
  });
  Object.defineProperty(jXrm.fn1, 'state', {
    get: function () {
      return this.tabs.exec(function (c) {
        return c && c.getDisplayState ? c.getDisplayState() : null;
      });
    },
    set: function (v) {
      this.tabs.exec(function (c) {
        if (c && c.setDisplayState)
          c.setDisplayState(v);
      });
    }
  });
  Object.defineProperty(jXrm.fn1, 'visible', {
    get: function () {
      return this.tabs.exec(function (c) {
        return c && c.getVisible ? c.getVisible() : null;
      });
    },
    set: function (v) {
      this.tabs.exec(function (c) {
        if (c && c.setVisible)
          c.setVisible(v);
      });
    }
  });
  return jXrm;
}(core, utility);
section = function (jXrm, util) {
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
    toggleVisible: function () {
      this.sections.exec(function (c) {
        if (c && c.setVisible)
          c.setVisible(!c.getVsible());
      });
      return this;
    }
  });
  Object.defineProperty(jXrm.fn2, 'name', {
    get: function () {
      return this.sections.exec(function (c) {
        return c && c.getName ? c.getName() : null;
      });
    }
  });
  Object.defineProperty(jXrm.fn2, 'label', {
    get: function () {
      return this.sections.exec(function (c) {
        return c && c.getLabel ? c.getLabel() : null;
      });
    },
    set: function (v) {
      this.sections.exec(function (c) {
        if (c && c.setLabel)
          c.setLabel(v);
      });
    }
  });
  Object.defineProperty(jXrm.fn2, 'visible', {
    get: function () {
      return this.sections.exec(function (c) {
        return c && c.getVisible ? c.getVisible() : null;
      });
    },
    set: function (v) {
      this.sections.exec(function (c) {
        if (c && c.setVisible)
          c.setVisible(v);
      });
    }
  });
  return jXrm;
}(core, utility);
entity = function (jXrm, util) {
  jXrm.entity = {
    get id() {
      return (jXrm.formContext || Xrm.Page).data.entity.getId();
    },
    get dataXml() {
      return (jXrm.formContext || Xrm.Page).data.entity.getDataXml();
    },
    get entityName() {
      return (jXrm.formContext || Xrm.Page).data.entity.getEntityName();
    },
    get name() {
      return (jXrm.formContext || Xrm.Page).data.entity.getPrimaryAttributeValue();
    },
    get valid() {
      return (jXrm.formContext || Xrm.Page).data.entity.isValid();
    },
    get isDirty() {
      return (jXrm.formContext || Xrm.Page).data.entity.getIsDirty();
    },
    get entityReference() {
      return (jXrm.formContext || Xrm.Page).data.entity.getEntityReference();
    }
  };
  return jXrm;
}(core, utility);
ui = function (jXrm, util, global) {
  var toggleForm = function (attrs, context, disabled) {
    var controls = jXrm.getFormContext(context).ui.controls.get();
    controls.forEach(function (c) {
      if ((!attrs || attrs.indexOf(c.getName()) < 0) && c.setDisabled)
        c.setDisabled(disabled);
    });
  };
  var toggleTab = function (tabName, context, visible) {
    tabName.split(',').forEach(function (n) {
      var tab = jXrm.getFormContext(context).ui.tabs.get(n.replace(' ', ''));
      if (tab)
        tab.setVisible(visible);
    });
  };
  var toggleSection = function (tabName, secName, context, visible) {
    var tab = jXrm.getFormContext(context).ui.tabs.get(tabName);
    if (tab) {
      var sec = tab.sections.get(secName);
      if (sec)
        sec.setVisible(visible);
    }
  };
  util.extend(jXrm, {
    // alertStrings	Object	Yes	The strings to be used in the alert dialog. The object contains the following attributes:
    //     - confirmButtonLabel: (Optional) String. The confirm button label. If you do not specify the button label, OK is used as the button label.
    //     - text: String. The message to be displyed in the alert dialog.
    //     - title: (Optional) String. The title of the alert dialog.
    // alertOptions	Object	No	The height and width options for alert dialog. The object contains the following attributes:
    //     - height: (Optional) Number. Height of the alert dialog in pixels.
    //     - width: (Optional) Number. Width of the alert dialog pixels.
    alert: function (alertStrings, successCallback, errorCallback, alertOptions) {
      var msg = typeof alertStrings === 'string' ? { text: alertStrings } : alertStrings;
      var opts = global.AlertOpts;
      util.extend(opts, alertOptions);
      Xrm.Navigation.openAlertDialog(msg, opts).then(successCallback, errorCallback);
    },
    // confirmStrings	Object	Yes	The strings to be used in the confirmation dialog. The object contains the following attributes:
    //     - cancelButtonLabel: (Optional) String. The cancel button label. If you do not specify the cancel button label, Cancel is used as the button label.
    //     - confirmButtonLabel: (Optional) String. The confirm button label. If you do not specify the confirm button label, OK is used as the button label.
    //     - subtitle: (Optional) String. The subtitle to be displayed in the confirmation dialog.
    //     - text: String. The message to be displayed in the confirmation dialog.
    //     - title: (Optional) String. The title to be displayed in the confirmation dialog.
    // confirmOptions	Object	No	The height and width options for confirmation dialog. The object contains the following attributes:
    //     - height: (Optional) Number. Height of the confirmation dialog in pixels.
    //     - width: (Optional) Number. Width of the confirmation dialog in pixels.
    confirm: function (confirmStrings, yesCallback, noCallback, errorCallback, confirmOptions) {
      var msg = typeof confirmStrings === 'string' ? { text: confirmStrings } : confirmStrings;
      var opts = global.ConfirmOpts;
      // TODO: move to CONSTANT JS
      util.extend(opts, confirmOptions);
      Xrm.Navigation.openConfirmDialog(msg, opts).then(function (success) {
        if (success.confirmed)
          if (yesCallback)
            yesCallback();
          else if (noCallback)
            // TODO: BUG: not been called
            noCallback();
      }, errorCallback);
    },
    // entityFormOptions	Object	Yes	Entity form options for opening the form. The object contains the following attributes:
    //     cmdbar: (Optional) Boolean. Indicates whether to display the command bar. If you do not specify this parameter, the command bar is displayed by default.
    //     createFromEntity: (Optional) Lookup. Designates a record that will provide default values based on mapped attribute values. The lookup object has the following String properties: entityType, id, and name (optional).
    //     entityId: (Optional) String. ID of the entity record to display the form for.
    //     entityName: (Optional) String. Logical name of the entity to display the form for.
    //     formId: (Optional) String. ID of the form instance to be displayed.
    //     height: (Optional) Number. Height of the form window to be displayed in pixels.
    //     navbar: (Optional) String. Controls whether the navigation bar is displayed and whether application navigation is available using the areas and subareas defined in the sitemap. Valid vlaues are: "on", "off", or "entity".
    //         on: The navigation bar is displayed. This is the default behavior if the navbar parameter is not used.
    //         off: The navigation bar is not displayed. People can navigate using other user interface elements or the back and forward buttons.
    //         entity: On an entity form, only the navigation options for related entities are available. After navigating to a related entity, a back button is displayed in the navigation bar to allow returning to the original record.
    //     openInNewWindow: (Optional) Boolean. Indicates whether to display form in a new window.
    //     windowPosition: (Optional) Number. Specify one of the following values for the window position of the form on the screen:
    //         1:center
    //         2:side
    //     processId: (Optional) String. ID of the business process to be displayed on the form.
    //     processInstanceId: (Optional) String. ID of the business process instance to be displayed on the form.
    //     relationship: (Optional) Object. Define a relationship object to display the related records on the form. The object has the following attributes.              
    //         Name	Type	Description
    //         attributeName	String	Name of the attribute used for relationship.
    //         name	String	Name of the relationship.
    //         navigationPropertyName	String	Name of the navigation property for this relationship.
    //         relationshipType	Number	Relationship type. Specify one of the following values:
    //             0:OneToMany
    //             1:ManyToMany
    //         roleType	Number	Role type in relationship. Specify one of the following values:
    //             1:Referencing
    //             2:AssociationEntity
    //     selectedStageId: (Optional) String. ID of the selected stage in business process instance.
    //     useQuickCreateForm: (Optional) Boolean. Indicates whether to open a quick create form. If you do not specify this, by default false is passed.
    //     width: (Optional) Number. Width of the form window to be displayed in pixels.
    openForm: function (name, id, parameters, successCallback, errorCallback, options) {
      var entityFormOptions = {
        entityName: name,
        entityId: id
      };
      if (options)
        util.extend(entityFormOptions, options);
      Xrm.Navigation.openForm(entityFormOptions, parameters).then(successCallback, errorCallback);  //Xrm.Utility.openEntityForm(name,id,parameters,options)
    },
    // file	Object	Yes	An object describing the file to open. The object has the following attributes:
    //     - fileContent: String. Contents of the file.
    //     - fileName: String. Name of the file.
    //     - fileSize: Number. Size of the file in KB.
    //     - mimeType: String. MIME type of the file.
    // openFileOptions	Object	No	An object describing whether to open or save the file. The object has the following attribute:
    //     - openMode: Specify 1 to open; 2 to save.
    //     If you do not specify this parameter, by default 1 (open) is passed.
    //     This parameter is only supported on Unified Interface.
    openFile: function (file, openFileOptions) {
      Xrm.Navigation.openFile(file, openFileOptions);
    },
    // url	String	Yes	URL to open.
    // openUrlOptions	Object	No	Options to open the URL.The object contains the following attributes:
    //     - height: (Optional) Number. Height of the window to display the resultant page in pixels.
    //     - width: (Optional) Number. Width of the window to display the resultant page in pixels.
    openUrl: function (url, openUrlOptions) {
      Xrm.Navigation.openUrl(url, openUrlOptions);
    },
    // webResourceName	String	Yes	Name of the HTML web resource to open.
    // windowOptions	Object	No	Window options for opening the web resource. The object contains the following attributes:
    //     - height: (Optional) Number. Height of the window to open in pixels.
    //     - openInNewWindow: Boolean. Indicates whether to open the web resource in a new window.
    //     - width: (Optional) Number. Width of the window to open in pixels.
    // data	String	No	Data to be passed into the data parameter.
    openWebResource: function (webResourceName, windowOptions, data) {
      Xrm.Navigation.openWebResource(webResourceName, windowOptions, data);
    },
    disableForm: function (attrs, context) {
      toggleForm(attrs, context, true);
    },
    enableForm: function (attrs, context) {
      toggleForm(attrs, context, false);
    },
    showTab: function (tabName, context) {
      toggleTab(tabName, context, true);
    },
    hideTab: function (tabName, context) {
      toggleTab(tabName, context, false);
    },
    showSection: function (tabName, secName, context) {
      toggleSection(tabName, secName, context, true);
    },
    hideSection: function (tabName, secName, context) {
      toggleSection(tabName, secName, context, false);
    },
    getFormType: function (context) {
      return jXrm.getFormContext(context).ui.getFormType();
    }
  });
  return jXrm;
}(core, utility, global);
data = function (jXrm, util) {
  util.extend(jXrm, {
    save: function (successHandler, errHandler, context) {
      jXrm.getFormContext(context).data.save().then(successHandler, errHandler);
      return this;
    },
    refresh: function (save, successHandler, errHandler, context) {
      jXrm.getFormContext(context).data.refresh(save).then(successHandler, errHandler);
      return this;
    },
    addOnLoad: function (handler, context) {
      jXrm.getFormContext(context).data.addOnLoad(handler);
      return this;
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