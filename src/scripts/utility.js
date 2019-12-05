
define([], function() {
    "use strict";

    return {
        extend: function(t, s ){
            if (typeof Object.assign != 'function') {
                Object.assign = function (target, varArgs) { // .length of function is 2
                    'use strict';
                    if (target == null) { // TypeError if undefined or null
                        throw new TypeError('Cannot convert undefined or null to object');
                    }
    
                    var to = Object(target);
    
                    for (var index = 1; index < arguments.length; index++) {
                        var nextSource = arguments[index];
    
                        if (nextSource != null) { // Skip over if undefined or null
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
        toObject: function(obj, props) {
            if (!obj) obj = {};
            props.forEach(function(prop) {
                if (prop !== null) {
                    var p = prop.split('|');
                    if (!p[1]) p[1] = p[0];
                    obj[p[0]] = function() {
                        var c = p[2] === 'a'? obj.attributes : obj.controls;
                        var args = [];
                        for(var i=0; i<arguments.length; i++)
                            args[i] = arguments[i];
                        if (p[4]) args[0] = p[4] === '1' ? true : p[4] === '0' ? false : p[4];
                        if (c) {
                            if (p[3]) { // return
                                return c.exec(function(o) {
                                    return (o && o[p[1]]) ? o[p[1]].apply(o, args) : null;
                                });
                            } else {
                                c.exec(function(o) {
                                    if (o && o[p[1]]) o[p[1]].apply(o, args);
                                });
                                return obj;
                            }
                        }
                    }
                }
            });
            return obj;
        }
    };
});