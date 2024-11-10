/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}", notIn: ["string"] },
    { open: "[", close: "]", notIn: ["string"] },
    { open: "(", close: ")", notIn: ["string"] },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*(#|//)region\\b"),
      end: new RegExp("^\\s*(#|//)endregion\\b")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: "",
  tokenizer: {
    root: [
      [/<\?((php)|=)?/, { token: "@rematch", switchTo: "@phpInSimpleState.root" }],
      [/<!DOCTYPE/, "metatag.html", "@doctype"],
      [/<!--/, "comment.html", "@comment"],
      [/(<)(\w+)(\/>)/, ["delimiter.html", "tag.html", "delimiter.html"]],
      [/(<)(script)/, ["delimiter.html", { token: "tag.html", next: "@script" }]],
      [/(<)(style)/, ["delimiter.html", { token: "tag.html", next: "@style" }]],
      [/(<)([:\w]+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
      [/(<\/)(\w+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
      [/</, "delimiter.html"],
      [/[^<]+/]
    ],
    doctype: [
      [/<\?((php)|=)?/, { token: "@rematch", switchTo: "@phpInSimpleState.comment" }],
      [/[^>]+/, "metatag.content.html"],
      [/>/, "metatag.html", "@pop"]
    ],
    comment: [
      [/<\?((php)|=)?/, { token: "@rematch", switchTo: "@phpInSimpleState.comment" }],
      [/-->/, "comment.html", "@pop"],
      [/[^-]+/, "comment.content.html"],
      [/./, "comment.content.html"]
    ],
    otherTag: [
      [/<\?((php)|=)?/, { token: "@rematch", switchTo: "@phpInSimpleState.otherTag" }],
      [/\/?>/, "delimiter.html", "@pop"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/]
    ],
    script: [
      [/<\?((php)|=)?/, { token: "@rematch", switchTo: "@phpInSimpleState.script" }],
      [/type/, "attribute.name", "@scriptAfterType"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.text/javascript",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [
        /(<\/)(script\s*)(>)/,
        ["delimiter.html", "tag.html", { token: "delimiter.html", next: "@pop" }]
      ]
    ],
    scriptAfterType: [
      [
        /<\?((php)|=)?/,
        {
          token: "@rematch",
          switchTo: "@phpInSimpleState.scriptAfterType"
        }
      ],
      [/=/, "delimiter", "@scriptAfterTypeEquals"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.text/javascript",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptAfterTypeEquals: [
      [
        /<\?((php)|=)?/,
        {
          token: "@rematch",
          switchTo: "@phpInSimpleState.scriptAfterTypeEquals"
        }
      ],
      [
        /"([^"]*)"/,
        {
          token: "attribute.value",
          switchTo: "@scriptWithCustomType.$1"
        }
      ],
      [
        /'([^']*)'/,
        {
          token: "attribute.value",
          switchTo: "@scriptWithCustomType.$1"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.text/javascript",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptWithCustomType: [
      [
        /<\?((php)|=)?/,
        {
          token: "@rematch",
          switchTo: "@phpInSimpleState.scriptWithCustomType.$S2"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.$S2",
          nextEmbedded: "$S2"
        }
      ],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptEmbedded: [
      [
        /<\?((php)|=)?/,
        {
          token: "@rematch",
          switchTo: "@phpInEmbeddedState.scriptEmbedded.$S2",
          nextEmbedded: "@pop"
        }
      ],
      [/<\/script/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]
    ],
    style: [
      [/<\?((php)|=)?/, { token: "@rematch", switchTo: "@phpInSimpleState.style" }],
      [/type/, "attribute.name", "@styleAfterType"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.text/css",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [
        /(<\/)(style\s*)(>)/,
        ["delimiter.html", "tag.html", { token: "delimiter.html", next: "@pop" }]
      ]
    ],
    styleAfterType: [
      [
        /<\?((php)|=)?/,
        {
          token: "@rematch",
          switchTo: "@phpInSimpleState.styleAfterType"
        }
      ],
      [/=/, "delimiter", "@styleAfterTypeEquals"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.text/css",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleAfterTypeEquals: [
      [
        /<\?((php)|=)?/,
        {
          token: "@rematch",
          switchTo: "@phpInSimpleState.styleAfterTypeEquals"
        }
      ],
      [
        /"([^"]*)"/,
        {
          token: "attribute.value",
          switchTo: "@styleWithCustomType.$1"
        }
      ],
      [
        /'([^']*)'/,
        {
          token: "attribute.value",
          switchTo: "@styleWithCustomType.$1"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.text/css",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleWithCustomType: [
      [
        /<\?((php)|=)?/,
        {
          token: "@rematch",
          switchTo: "@phpInSimpleState.styleWithCustomType.$S2"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.$S2",
          nextEmbedded: "$S2"
        }
      ],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleEmbedded: [
      [
        /<\?((php)|=)?/,
        {
          token: "@rematch",
          switchTo: "@phpInEmbeddedState.styleEmbedded.$S2",
          nextEmbedded: "@pop"
        }
      ],
      [/<\/style/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]
    ],
    phpInSimpleState: [
      [/<\?((php)|=)?/, "metatag.php"],
      [/\?>/, { token: "metatag.php", switchTo: "@$S2.$S3" }],
      { include: "phpRoot" }
    ],
    phpInEmbeddedState: [
      [/<\?((php)|=)?/, "metatag.php"],
      [
        /\?>/,
        {
          token: "metatag.php",
          switchTo: "@$S2.$S3",
          nextEmbedded: "$S3"
        }
      ],
      { include: "phpRoot" }
    ],
    phpRoot: [
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@phpKeywords": { token: "keyword.php" },
            "@phpCompileTimeConstants": { token: "constant.php" },
            "@default": "identifier.php"
          }
        }
      ],
      [
        /[$a-zA-Z_]\w*/,
        {
          cases: {
            "@phpPreDefinedVariables": {
              token: "variable.predefined.php"
            },
            "@default": "variable.php"
          }
        }
      ],
      [/[{}]/, "delimiter.bracket.php"],
      [/[\[\]]/, "delimiter.array.php"],
      [/[()]/, "delimiter.parenthesis.php"],
      [/[ \t\r\n]+/],
      [/(#|\/\/)$/, "comment.php"],
      [/(#|\/\/)/, "comment.php", "@phpLineComment"],
      [/\/\*/, "comment.php", "@phpComment"],
      [/"/, "string.php", "@phpDoubleQuoteString"],
      [/'/, "string.php", "@phpSingleQuoteString"],
      [/[\+\-\*\%\&\|\^\~\!\=\<\>\/\?\;\:\.\,\@]/, "delimiter.php"],
      [/\d*\d+[eE]([\-+]?\d+)?/, "number.float.php"],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float.php"],
      [/0[xX][0-9a-fA-F']*[0-9a-fA-F]/, "number.hex.php"],
      [/0[0-7']*[0-7]/, "number.octal.php"],
      [/0[bB][0-1']*[0-1]/, "number.binary.php"],
      [/\d[\d']*/, "number.php"],
      [/\d/, "number.php"]
    ],
    phpComment: [
      [/\*\//, "comment.php", "@pop"],
      [/[^*]+/, "comment.php"],
      [/./, "comment.php"]
    ],
    phpLineComment: [
      [/\?>/, { token: "@rematch", next: "@pop" }],
      [/.$/, "comment.php", "@pop"],
      [/[^?]+$/, "comment.php", "@pop"],
      [/[^?]+/, "comment.php"],
      [/./, "comment.php"]
    ],
    phpDoubleQuoteString: [
      [/[^\\"]+/, "string.php"],
      [/@escapes/, "string.escape.php"],
      [/\\./, "string.escape.invalid.php"],
      [/"/, "string.php", "@pop"]
    ],
    phpSingleQuoteString: [
      [/[^\\']+/, "string.php"],
      [/@escapes/, "string.escape.php"],
      [/\\./, "string.escape.invalid.php"],
      [/'/, "string.php", "@pop"]
    ]
  },
  phpKeywords: [
    "abstract",
    "and",
    "array",
    "as",
    "break",
    "callable",
    "case",
    "catch",
    "cfunction",
    "class",
    "clone",
    "const",
    "continue",
    "declare",
    "default",
    "do",
    "else",
    "elseif",
    "enddeclare",
    "endfor",
    "endforeach",
    "endif",
    "endswitch",
    "endwhile",
    "extends",
    "false",
    "final",
    "for",
    "foreach",
    "function",
    "global",
    "goto",
    "if",
    "implements",
    "interface",
    "instanceof",
    "insteadof",
    "namespace",
    "new",
    "null",
    "object",
    "old_function",
    "or",
    "private",
    "protected",
    "public",
    "resource",
    "static",
    "switch",
    "throw",
    "trait",
    "try",
    "true",
    "use",
    "var",
    "while",
    "xor",
    "die",
    "echo",
    "empty",
    "exit",
    "eval",
    "include",
    "include_once",
    "isset",
    "list",
    "require",
    "require_once",
    "return",
    "print",
    "unset",
    "yield",
    "__construct"
  ],
  phpCompileTimeConstants: [
    "__CLASS__",
    "__DIR__",
    "__FILE__",
    "__LINE__",
    "__NAMESPACE__",
    "__METHOD__",
    "__FUNCTION__",
    "__TRAIT__"
  ],
  phpPreDefinedVariables: [
    "$GLOBALS",
    "$_SERVER",
    "$_GET",
    "$_POST",
    "$_FILES",
    "$_REQUEST",
    "$_SESSION",
    "$_ENV",
    "$_COOKIE",
    "$php_errormsg",
    "$HTTP_RAW_POST_DATA",
    "$http_response_header",
    "$argc",
    "$argv"
  ],
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhwLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL3BocC9waHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3BocC9waHAudHNcbnZhciBjb25mID0ge1xuICB3b3JkUGF0dGVybjogLygtP1xcZCpcXC5cXGRcXHcqKXwoW15cXGBcXH5cXCFcXEBcXCNcXCVcXF5cXCZcXCpcXChcXClcXC1cXD1cXCtcXFtcXHtcXF1cXH1cXFxcXFx8XFw7XFw6XFwnXFxcIlxcLFxcLlxcPFxcPlxcL1xcP1xcc10rKS9nLFxuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi8vXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCIvKlwiLCBcIiovXCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiwgbm90SW46IFtcInN0cmluZ1wiXSB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiwgbm90SW46IFtcInN0cmluZ1wiXSB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgbm90SW46IFtcInN0cmluZ1wiXSB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicsIG5vdEluOiBbXCJzdHJpbmdcIl0gfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH1cbiAgXSxcbiAgZm9sZGluZzoge1xuICAgIG1hcmtlcnM6IHtcbiAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKFwiXlxcXFxzKigjfC8vKXJlZ2lvblxcXFxiXCIpLFxuICAgICAgZW5kOiBuZXcgUmVnRXhwKFwiXlxcXFxzKigjfC8vKWVuZHJlZ2lvblxcXFxiXCIpXG4gICAgfVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCJcIixcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy88XFw/KChwaHApfD0pPy8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgc3dpdGNoVG86IFwiQHBocEluU2ltcGxlU3RhdGUucm9vdFwiIH1dLFxuICAgICAgWy88IURPQ1RZUEUvLCBcIm1ldGF0YWcuaHRtbFwiLCBcIkBkb2N0eXBlXCJdLFxuICAgICAgWy88IS0tLywgXCJjb21tZW50Lmh0bWxcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvKDwpKFxcdyspKFxcLz4pLywgW1wiZGVsaW1pdGVyLmh0bWxcIiwgXCJ0YWcuaHRtbFwiLCBcImRlbGltaXRlci5odG1sXCJdXSxcbiAgICAgIFsvKDwpKHNjcmlwdCkvLCBbXCJkZWxpbWl0ZXIuaHRtbFwiLCB7IHRva2VuOiBcInRhZy5odG1sXCIsIG5leHQ6IFwiQHNjcmlwdFwiIH1dXSxcbiAgICAgIFsvKDwpKHN0eWxlKS8sIFtcImRlbGltaXRlci5odG1sXCIsIHsgdG9rZW46IFwidGFnLmh0bWxcIiwgbmV4dDogXCJAc3R5bGVcIiB9XV0sXG4gICAgICBbLyg8KShbOlxcd10rKS8sIFtcImRlbGltaXRlci5odG1sXCIsIHsgdG9rZW46IFwidGFnLmh0bWxcIiwgbmV4dDogXCJAb3RoZXJUYWdcIiB9XV0sXG4gICAgICBbLyg8XFwvKShcXHcrKS8sIFtcImRlbGltaXRlci5odG1sXCIsIHsgdG9rZW46IFwidGFnLmh0bWxcIiwgbmV4dDogXCJAb3RoZXJUYWdcIiB9XV0sXG4gICAgICBbLzwvLCBcImRlbGltaXRlci5odG1sXCJdLFxuICAgICAgWy9bXjxdKy9dXG4gICAgXSxcbiAgICBkb2N0eXBlOiBbXG4gICAgICBbLzxcXD8oKHBocCl8PSk/LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogXCJAcGhwSW5TaW1wbGVTdGF0ZS5jb21tZW50XCIgfV0sXG4gICAgICBbL1tePl0rLywgXCJtZXRhdGFnLmNvbnRlbnQuaHRtbFwiXSxcbiAgICAgIFsvPi8sIFwibWV0YXRhZy5odG1sXCIsIFwiQHBvcFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy88XFw/KChwaHApfD0pPy8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgc3dpdGNoVG86IFwiQHBocEluU2ltcGxlU3RhdGUuY29tbWVudFwiIH1dLFxuICAgICAgWy8tLT4vLCBcImNvbW1lbnQuaHRtbFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1teLV0rLywgXCJjb21tZW50LmNvbnRlbnQuaHRtbFwiXSxcbiAgICAgIFsvLi8sIFwiY29tbWVudC5jb250ZW50Lmh0bWxcIl1cbiAgICBdLFxuICAgIG90aGVyVGFnOiBbXG4gICAgICBbLzxcXD8oKHBocCl8PSk/LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogXCJAcGhwSW5TaW1wbGVTdGF0ZS5vdGhlclRhZ1wiIH1dLFxuICAgICAgWy9cXC8/Pi8sIFwiZGVsaW1pdGVyLmh0bWxcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9cIihbXlwiXSopXCIvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvJyhbXiddKiknLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbL1tcXHdcXC1dKy8sIFwiYXR0cmlidXRlLm5hbWVcIl0sXG4gICAgICBbLz0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dXG4gICAgXSxcbiAgICBzY3JpcHQ6IFtcbiAgICAgIFsvPFxcPygocGhwKXw9KT8vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBcIkBwaHBJblNpbXBsZVN0YXRlLnNjcmlwdFwiIH1dLFxuICAgICAgWy90eXBlLywgXCJhdHRyaWJ1dGUubmFtZVwiLCBcIkBzY3JpcHRBZnRlclR5cGVcIl0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy8nKFteJ10qKScvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvW1xcd1xcLV0rLywgXCJhdHRyaWJ1dGUubmFtZVwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHNjcmlwdEVtYmVkZGVkLnRleHQvamF2YXNjcmlwdFwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2phdmFzY3JpcHRcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbXG4gICAgICAgIC8oPFxcLykoc2NyaXB0XFxzKikoPikvLFxuICAgICAgICBbXCJkZWxpbWl0ZXIuaHRtbFwiLCBcInRhZy5odG1sXCIsIHsgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICAgIF1cbiAgICBdLFxuICAgIHNjcmlwdEFmdGVyVHlwZTogW1xuICAgICAgW1xuICAgICAgICAvPFxcPygocGhwKXw9KT8vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAcGhwSW5TaW1wbGVTdGF0ZS5zY3JpcHRBZnRlclR5cGVcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXJcIiwgXCJAc2NyaXB0QWZ0ZXJUeXBlRXF1YWxzXCJdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHNjcmlwdEVtYmVkZGVkLnRleHQvamF2YXNjcmlwdFwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2phdmFzY3JpcHRcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLzxcXC9zY3JpcHRcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHNjcmlwdEFmdGVyVHlwZUVxdWFsczogW1xuICAgICAgW1xuICAgICAgICAvPFxcPygocGhwKXw9KT8vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAcGhwSW5TaW1wbGVTdGF0ZS5zY3JpcHRBZnRlclR5cGVFcXVhbHNcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvXCIoW15cIl0qKVwiLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImF0dHJpYnV0ZS52YWx1ZVwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBzY3JpcHRXaXRoQ3VzdG9tVHlwZS4kMVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8nKFteJ10qKScvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHNjcmlwdFdpdGhDdXN0b21UeXBlLiQxXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzY3JpcHRFbWJlZGRlZC50ZXh0L2phdmFzY3JpcHRcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9qYXZhc2NyaXB0XCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc2NyaXB0XFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzY3JpcHRXaXRoQ3VzdG9tVHlwZTogW1xuICAgICAgW1xuICAgICAgICAvPFxcPygocGhwKXw9KT8vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAcGhwSW5TaW1wbGVTdGF0ZS5zY3JpcHRXaXRoQ3VzdG9tVHlwZS4kUzJcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHNjcmlwdEVtYmVkZGVkLiRTMlwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCIkUzJcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9cIihbXlwiXSopXCIvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvJyhbXiddKiknLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbL1tcXHdcXC1dKy8sIFwiYXR0cmlidXRlLm5hbWVcIl0sXG4gICAgICBbLz0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc2NyaXB0XFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzY3JpcHRFbWJlZGRlZDogW1xuICAgICAgW1xuICAgICAgICAvPFxcPygocGhwKXw9KT8vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAcGhwSW5FbWJlZGRlZFN0YXRlLnNjcmlwdEVtYmVkZGVkLiRTMlwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJAcG9wXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvPFxcL3NjcmlwdC8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIsIG5leHRFbWJlZGRlZDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHN0eWxlOiBbXG4gICAgICBbLzxcXD8oKHBocCl8PSk/LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogXCJAcGhwSW5TaW1wbGVTdGF0ZS5zdHlsZVwiIH1dLFxuICAgICAgWy90eXBlLywgXCJhdHRyaWJ1dGUubmFtZVwiLCBcIkBzdHlsZUFmdGVyVHlwZVwiXSxcbiAgICAgIFsvXCIoW15cIl0qKVwiLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbLycoW14nXSopJy8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy9bXFx3XFwtXSsvLCBcImF0dHJpYnV0ZS5uYW1lXCJdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc3R5bGVFbWJlZGRlZC50ZXh0L2Nzc1wiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2Nzc1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFtcbiAgICAgICAgLyg8XFwvKShzdHlsZVxccyopKD4pLyxcbiAgICAgICAgW1wiZGVsaW1pdGVyLmh0bWxcIiwgXCJ0YWcuaHRtbFwiLCB7IHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgICBdXG4gICAgXSxcbiAgICBzdHlsZUFmdGVyVHlwZTogW1xuICAgICAgW1xuICAgICAgICAvPFxcPygocGhwKXw9KT8vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAcGhwSW5TaW1wbGVTdGF0ZS5zdHlsZUFmdGVyVHlwZVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLz0vLCBcImRlbGltaXRlclwiLCBcIkBzdHlsZUFmdGVyVHlwZUVxdWFsc1wiXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzdHlsZUVtYmVkZGVkLnRleHQvY3NzXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcInRleHQvY3NzXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc3R5bGVcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHN0eWxlQWZ0ZXJUeXBlRXF1YWxzOiBbXG4gICAgICBbXG4gICAgICAgIC88XFw/KChwaHApfD0pPy8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJAcmVtYXRjaFwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBwaHBJblNpbXBsZVN0YXRlLnN0eWxlQWZ0ZXJUeXBlRXF1YWxzXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1wiKFteXCJdKilcIi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJhdHRyaWJ1dGUudmFsdWVcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc3R5bGVXaXRoQ3VzdG9tVHlwZS4kMVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8nKFteJ10qKScvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHN0eWxlV2l0aEN1c3RvbVR5cGUuJDFcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHN0eWxlRW1iZWRkZWQudGV4dC9jc3NcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9jc3NcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLzxcXC9zdHlsZVxccyo+LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc3R5bGVXaXRoQ3VzdG9tVHlwZTogW1xuICAgICAgW1xuICAgICAgICAvPFxcPygocGhwKXw9KT8vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAcGhwSW5TaW1wbGVTdGF0ZS5zdHlsZVdpdGhDdXN0b21UeXBlLiRTMlwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc3R5bGVFbWJlZGRlZC4kUzJcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiJFMyXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXCIoW15cIl0qKVwiLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbLycoW14nXSopJy8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy9bXFx3XFwtXSsvLCBcImF0dHJpYnV0ZS5uYW1lXCJdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvPFxcL3N0eWxlXFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzdHlsZUVtYmVkZGVkOiBbXG4gICAgICBbXG4gICAgICAgIC88XFw/KChwaHApfD0pPy8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJAcmVtYXRjaFwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBwaHBJbkVtYmVkZGVkU3RhdGUuc3R5bGVFbWJlZGRlZC4kUzJcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLzxcXC9zdHlsZS8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIsIG5leHRFbWJlZGRlZDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHBocEluU2ltcGxlU3RhdGU6IFtcbiAgICAgIFsvPFxcPygocGhwKXw9KT8vLCBcIm1ldGF0YWcucGhwXCJdLFxuICAgICAgWy9cXD8+LywgeyB0b2tlbjogXCJtZXRhdGFnLnBocFwiLCBzd2l0Y2hUbzogXCJAJFMyLiRTM1wiIH1dLFxuICAgICAgeyBpbmNsdWRlOiBcInBocFJvb3RcIiB9XG4gICAgXSxcbiAgICBwaHBJbkVtYmVkZGVkU3RhdGU6IFtcbiAgICAgIFsvPFxcPygocGhwKXw9KT8vLCBcIm1ldGF0YWcucGhwXCJdLFxuICAgICAgW1xuICAgICAgICAvXFw/Pi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJtZXRhdGFnLnBocFwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkAkUzIuJFMzXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcIiRTM1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwicGhwUm9vdFwiIH1cbiAgICBdLFxuICAgIHBocFJvb3Q6IFtcbiAgICAgIFtcbiAgICAgICAgL1thLXpBLVpfXVxcdyovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQHBocEtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZC5waHBcIiB9LFxuICAgICAgICAgICAgXCJAcGhwQ29tcGlsZVRpbWVDb25zdGFudHNcIjogeyB0b2tlbjogXCJjb25zdGFudC5waHBcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXIucGhwXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC9bJGEtekEtWl9dXFx3Ki8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAcGhwUHJlRGVmaW5lZFZhcmlhYmxlc1wiOiB7XG4gICAgICAgICAgICAgIHRva2VuOiBcInZhcmlhYmxlLnByZWRlZmluZWQucGhwXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwidmFyaWFibGUucGhwXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1t7fV0vLCBcImRlbGltaXRlci5icmFja2V0LnBocFwiXSxcbiAgICAgIFsvW1xcW1xcXV0vLCBcImRlbGltaXRlci5hcnJheS5waHBcIl0sXG4gICAgICBbL1soKV0vLCBcImRlbGltaXRlci5wYXJlbnRoZXNpcy5waHBcIl0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvKCN8XFwvXFwvKSQvLCBcImNvbW1lbnQucGhwXCJdLFxuICAgICAgWy8oI3xcXC9cXC8pLywgXCJjb21tZW50LnBocFwiLCBcIkBwaHBMaW5lQ29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50LnBocFwiLCBcIkBwaHBDb21tZW50XCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nLnBocFwiLCBcIkBwaHBEb3VibGVRdW90ZVN0cmluZ1wiXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nLnBocFwiLCBcIkBwaHBTaW5nbGVRdW90ZVN0cmluZ1wiXSxcbiAgICAgIFsvW1xcK1xcLVxcKlxcJVxcJlxcfFxcXlxcflxcIVxcPVxcPFxcPlxcL1xcP1xcO1xcOlxcLlxcLFxcQF0vLCBcImRlbGltaXRlci5waHBcIl0sXG4gICAgICBbL1xcZCpcXGQrW2VFXShbXFwtK10/XFxkKyk/LywgXCJudW1iZXIuZmxvYXQucGhwXCJdLFxuICAgICAgWy9cXGQqXFwuXFxkKyhbZUVdW1xcLStdP1xcZCspPy8sIFwibnVtYmVyLmZsb2F0LnBocFwiXSxcbiAgICAgIFsvMFt4WF1bMC05YS1mQS1GJ10qWzAtOWEtZkEtRl0vLCBcIm51bWJlci5oZXgucGhwXCJdLFxuICAgICAgWy8wWzAtNyddKlswLTddLywgXCJudW1iZXIub2N0YWwucGhwXCJdLFxuICAgICAgWy8wW2JCXVswLTEnXSpbMC0xXS8sIFwibnVtYmVyLmJpbmFyeS5waHBcIl0sXG4gICAgICBbL1xcZFtcXGQnXSovLCBcIm51bWJlci5waHBcIl0sXG4gICAgICBbL1xcZC8sIFwibnVtYmVyLnBocFwiXVxuICAgIF0sXG4gICAgcGhwQ29tbWVudDogW1xuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnQucGhwXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW14qXSsvLCBcImNvbW1lbnQucGhwXCJdLFxuICAgICAgWy8uLywgXCJjb21tZW50LnBocFwiXVxuICAgIF0sXG4gICAgcGhwTGluZUNvbW1lbnQ6IFtcbiAgICAgIFsvXFw/Pi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICBbLy4kLywgXCJjb21tZW50LnBocFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1teP10rJC8sIFwiY29tbWVudC5waHBcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXj9dKy8sIFwiY29tbWVudC5waHBcIl0sXG4gICAgICBbLy4vLCBcImNvbW1lbnQucGhwXCJdXG4gICAgXSxcbiAgICBwaHBEb3VibGVRdW90ZVN0cmluZzogW1xuICAgICAgWy9bXlxcXFxcIl0rLywgXCJzdHJpbmcucGhwXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZS5waHBcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWQucGhwXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nLnBocFwiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIHBocFNpbmdsZVF1b3RlU3RyaW5nOiBbXG4gICAgICBbL1teXFxcXCddKy8sIFwic3RyaW5nLnBocFwiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGUucGhwXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkLnBocFwiXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nLnBocFwiLCBcIkBwb3BcIl1cbiAgICBdXG4gIH0sXG4gIHBocEtleXdvcmRzOiBbXG4gICAgXCJhYnN0cmFjdFwiLFxuICAgIFwiYW5kXCIsXG4gICAgXCJhcnJheVwiLFxuICAgIFwiYXNcIixcbiAgICBcImJyZWFrXCIsXG4gICAgXCJjYWxsYWJsZVwiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImNmdW5jdGlvblwiLFxuICAgIFwiY2xhc3NcIixcbiAgICBcImNsb25lXCIsXG4gICAgXCJjb25zdFwiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcImRlY2xhcmVcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcImRvXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJlbHNlaWZcIixcbiAgICBcImVuZGRlY2xhcmVcIixcbiAgICBcImVuZGZvclwiLFxuICAgIFwiZW5kZm9yZWFjaFwiLFxuICAgIFwiZW5kaWZcIixcbiAgICBcImVuZHN3aXRjaFwiLFxuICAgIFwiZW5kd2hpbGVcIixcbiAgICBcImV4dGVuZHNcIixcbiAgICBcImZhbHNlXCIsXG4gICAgXCJmaW5hbFwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJmb3JlYWNoXCIsXG4gICAgXCJmdW5jdGlvblwiLFxuICAgIFwiZ2xvYmFsXCIsXG4gICAgXCJnb3RvXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW1wbGVtZW50c1wiLFxuICAgIFwiaW50ZXJmYWNlXCIsXG4gICAgXCJpbnN0YW5jZW9mXCIsXG4gICAgXCJpbnN0ZWFkb2ZcIixcbiAgICBcIm5hbWVzcGFjZVwiLFxuICAgIFwibmV3XCIsXG4gICAgXCJudWxsXCIsXG4gICAgXCJvYmplY3RcIixcbiAgICBcIm9sZF9mdW5jdGlvblwiLFxuICAgIFwib3JcIixcbiAgICBcInByaXZhdGVcIixcbiAgICBcInByb3RlY3RlZFwiLFxuICAgIFwicHVibGljXCIsXG4gICAgXCJyZXNvdXJjZVwiLFxuICAgIFwic3RhdGljXCIsXG4gICAgXCJzd2l0Y2hcIixcbiAgICBcInRocm93XCIsXG4gICAgXCJ0cmFpdFwiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJ1c2VcIixcbiAgICBcInZhclwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcInhvclwiLFxuICAgIFwiZGllXCIsXG4gICAgXCJlY2hvXCIsXG4gICAgXCJlbXB0eVwiLFxuICAgIFwiZXhpdFwiLFxuICAgIFwiZXZhbFwiLFxuICAgIFwiaW5jbHVkZVwiLFxuICAgIFwiaW5jbHVkZV9vbmNlXCIsXG4gICAgXCJpc3NldFwiLFxuICAgIFwibGlzdFwiLFxuICAgIFwicmVxdWlyZVwiLFxuICAgIFwicmVxdWlyZV9vbmNlXCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcInByaW50XCIsXG4gICAgXCJ1bnNldFwiLFxuICAgIFwieWllbGRcIixcbiAgICBcIl9fY29uc3RydWN0XCJcbiAgXSxcbiAgcGhwQ29tcGlsZVRpbWVDb25zdGFudHM6IFtcbiAgICBcIl9fQ0xBU1NfX1wiLFxuICAgIFwiX19ESVJfX1wiLFxuICAgIFwiX19GSUxFX19cIixcbiAgICBcIl9fTElORV9fXCIsXG4gICAgXCJfX05BTUVTUEFDRV9fXCIsXG4gICAgXCJfX01FVEhPRF9fXCIsXG4gICAgXCJfX0ZVTkNUSU9OX19cIixcbiAgICBcIl9fVFJBSVRfX1wiXG4gIF0sXG4gIHBocFByZURlZmluZWRWYXJpYWJsZXM6IFtcbiAgICBcIiRHTE9CQUxTXCIsXG4gICAgXCIkX1NFUlZFUlwiLFxuICAgIFwiJF9HRVRcIixcbiAgICBcIiRfUE9TVFwiLFxuICAgIFwiJF9GSUxFU1wiLFxuICAgIFwiJF9SRVFVRVNUXCIsXG4gICAgXCIkX1NFU1NJT05cIixcbiAgICBcIiRfRU5WXCIsXG4gICAgXCIkX0NPT0tJRVwiLFxuICAgIFwiJHBocF9lcnJvcm1zZ1wiLFxuICAgIFwiJEhUVFBfUkFXX1BPU1RfREFUQVwiLFxuICAgIFwiJGh0dHBfcmVzcG9uc2VfaGVhZGVyXCIsXG4gICAgXCIkYXJnY1wiLFxuICAgIFwiJGFyZ3ZcIlxuICBdLFxuICBlc2NhcGVzOiAvXFxcXCg/OlthYmZucnR2XFxcXFwiJ118eFswLTlBLUZhLWZdezEsNH18dVswLTlBLUZhLWZdezR9fFVbMC05QS1GYS1mXXs4fSkvXG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUcsSUFBQyxPQUFPO0FBQUEs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QTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCx5QkFBeUI7QUFBQSxJQUN2QjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCx3QkFBd0I7QUFBQSxJQUN0QjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxTQUFTO0FBQ1g7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
