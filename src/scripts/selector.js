define([], function() {
    "use strict";
    //var tokenCache = createCache(),
    
    // http://www.w3.org/TR/css3-selectors/#whitespace
    var whitespace = "[\\x20\\t\\r\\n\\f]",

    // https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
    identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
            "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

    // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

            // Operator (capture 2)
            "*([*^$|!~]?=)" + whitespace +

            // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
            "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
            whitespace + "*\\]",

    pseudos = ":(" + identifier + ")(?:\\((" +

            // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
            // 1. quoted (capture 3; capture 4 or capture 5)
            "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

            // 2. simple (capture 6)
            "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

            // 3. anything else (capture 2)
            ".*" +
            ")\\)|)",

    // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    rwhitespace = new RegExp(whitespace + "+", "g"),
    rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

    rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
    rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" +
            whitespace + "*"),
    rdescend = new RegExp(whitespace + "|>"),

    rpseudo = new RegExp(pseudos),
    ridentifier = new RegExp("^" + identifier + "$"),

    matchExpr = {
        ID: new RegExp("^#(" + identifier + ")"),
    //    TAG: new RegExp("^%(" + identifier + ")"),
        TAB: new RegExp("^(?:tab|t)" + whitespace + "#(" + identifier + ")", 'i'),
        SECTION: new RegExp("^(?:section|s|sec)" + whitespace + "#(" + identifier + ")", 'i')
    //    CLASS: new RegExp("^\\.(" + identifier + ")"),
    //    ATTR: new RegExp("^" + attributes)
    },

    rsibling = /[+~]/,

    // CSS escapes
    // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace +
              "?|\\\\([^\\r\\n\\f])", "g");

    function parseSelector(selector, context) {
        var t = [], match;
        if (selector != null && selector != '') {
            var groups = selector.split(',');
            groups.forEach(function(v) {
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
            })
        }
        return t;
        //return JSON.stringify(t);
    }



    return {
        parse: parseSelector
    }
});
