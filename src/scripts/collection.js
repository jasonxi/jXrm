define([], function() {
    "use strict";

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
                this.items.forEach(function(a) {
                    r[a.getName()] = callback(a); 
                });
                return r;
            }
            // var r = this.items.map(function (a) {
            //   if (callback) 
            //     return callback(a);
            // });
            // return r && r.length > 0 ? r.length === 1 ? r[0] : r : null;
        },
        push: function(o) {
            this.items.push(o);
        },
        get first() {
            return this.items.length > 0? this.items[0] : null;
        },
        get length() {
            return this.items.length;
        }
    };

    return Collection;
});