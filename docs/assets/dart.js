/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
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
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "`", close: "`", notIn: ["string", "comment"] },
    { open: "/**", close: " */", notIn: ["string"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "<", close: ">" },
    { open: "'", close: "'" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "`", close: "`" }
  ],
  folding: {
    markers: {
      start: /^\s*\s*#?region\b/,
      end: /^\s*\s*#?endregion\b/
    }
  }
};
var language = {
  defaultToken: "invalid",
  tokenPostfix: ".dart",
  keywords: [
    "abstract",
    "dynamic",
    "implements",
    "show",
    "as",
    "else",
    "import",
    "static",
    "assert",
    "enum",
    "in",
    "super",
    "async",
    "export",
    "interface",
    "switch",
    "await",
    "extends",
    "is",
    "sync",
    "break",
    "external",
    "library",
    "this",
    "case",
    "factory",
    "mixin",
    "throw",
    "catch",
    "false",
    "new",
    "true",
    "class",
    "final",
    "null",
    "try",
    "const",
    "finally",
    "on",
    "typedef",
    "continue",
    "for",
    "operator",
    "var",
    "covariant",
    "Function",
    "part",
    "void",
    "default",
    "get",
    "rethrow",
    "while",
    "deferred",
    "hide",
    "return",
    "with",
    "do",
    "if",
    "set",
    "yield"
  ],
  typeKeywords: ["int", "double", "String", "bool"],
  operators: [
    "+",
    "-",
    "*",
    "/",
    "~/",
    "%",
    "++",
    "--",
    "==",
    "!=",
    ">",
    "<",
    ">=",
    "<=",
    "=",
    "-=",
    "/=",
    "%=",
    ">>=",
    "^=",
    "+=",
    "*=",
    "~/=",
    "<<=",
    "&=",
    "!=",
    "||",
    "&&",
    "&",
    "|",
    "^",
    "~",
    "<<",
    ">>",
    "!",
    ">>>",
    "??",
    "?",
    ":",
    "|="
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
  tokenizer: {
    root: [[/[{}]/, "delimiter.bracket"], { include: "common" }],
    common: [
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@typeKeywords": "type.identifier",
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ],
      [/[A-Z_$][\w\$]*/, "type.identifier"],
      { include: "@whitespace" },
      [
        /\/(?=([^\\\/]|\\.)+\/([gimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
        { token: "regexp", bracket: "@open", next: "@regexp" }
      ],
      [/@[a-zA-Z]+/, "annotation"],
      [/[()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/!(?=([^=]|$))/, "delimiter"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": ""
          }
        }
      ],
      [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
      [/0[xX](@hexdigits)n?/, "number.hex"],
      [/0[oO]?(@octaldigits)n?/, "number.octal"],
      [/0[bB](@binarydigits)n?/, "number.binary"],
      [/(@digits)n?/, "number"],
      [/[;,.]/, "delimiter"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/\/.*$/, "comment.doc"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    jsdoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"]
    ],
    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        ["regexp.escape.control", "regexp.escape.control", "regexp.escape.control"]
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        ["regexp.escape.control", { token: "regexp.escape.control", next: "@regexrange" }]
      ],
      [/(\()(\?:|\?=|\?!)/, ["regexp.escape.control", "regexp.escape.control"]],
      [/[()]/, "regexp.escape.control"],
      [/@regexpctl/, "regexp.escape.control"],
      [/[^\\\/]/, "regexp"],
      [/@regexpesc/, "regexp.escape"],
      [/\\\./, "regexp.invalid"],
      [/(\/)([gimsuy]*)/, [{ token: "regexp", bracket: "@close", next: "@pop" }, "keyword.other"]]
    ],
    regexrange: [
      [/-/, "regexp.escape.control"],
      [/\^/, "regexp.invalid"],
      [/@regexpesc/, "regexp.escape"],
      [/[^\]]/, "regexp"],
      [
        /\]/,
        {
          token: "regexp.escape.control",
          next: "@pop",
          bracket: "@close"
        }
      ]
    ],
    string_double: [
      [/[^\\"\$]+/, "string"],
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"],
      [/\$\w+/, "identifier"]
    ],
    string_single: [
      [/[^\\'\$]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"],
      [/\$\w+/, "identifier"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFydC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9kYXJ0L2RhcnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2RhcnQvZGFydC50c1xudmFyIGNvbmYgPSB7XG4gIGNvbW1lbnRzOiB7XG4gICAgbGluZUNvbW1lbnQ6IFwiLy9cIixcbiAgICBibG9ja0NvbW1lbnQ6IFtcIi8qXCIsIFwiKi9cIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicsIG5vdEluOiBbXCJzdHJpbmdcIl0gfSxcbiAgICB7IG9wZW46IFwiYFwiLCBjbG9zZTogXCJgXCIsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH0sXG4gICAgeyBvcGVuOiBcIi8qKlwiLCBjbG9zZTogXCIgKi9cIiwgbm90SW46IFtcInN0cmluZ1wiXSB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcImBcIiwgY2xvc2U6IFwiYFwiIH1cbiAgXSxcbiAgZm9sZGluZzoge1xuICAgIG1hcmtlcnM6IHtcbiAgICAgIHN0YXJ0OiAvXlxccypcXHMqIz9yZWdpb25cXGIvLFxuICAgICAgZW5kOiAvXlxccypcXHMqIz9lbmRyZWdpb25cXGIvXG4gICAgfVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiaW52YWxpZFwiLFxuICB0b2tlblBvc3RmaXg6IFwiLmRhcnRcIixcbiAga2V5d29yZHM6IFtcbiAgICBcImFic3RyYWN0XCIsXG4gICAgXCJkeW5hbWljXCIsXG4gICAgXCJpbXBsZW1lbnRzXCIsXG4gICAgXCJzaG93XCIsXG4gICAgXCJhc1wiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJzdGF0aWNcIixcbiAgICBcImFzc2VydFwiLFxuICAgIFwiZW51bVwiLFxuICAgIFwiaW5cIixcbiAgICBcInN1cGVyXCIsXG4gICAgXCJhc3luY1wiLFxuICAgIFwiZXhwb3J0XCIsXG4gICAgXCJpbnRlcmZhY2VcIixcbiAgICBcInN3aXRjaFwiLFxuICAgIFwiYXdhaXRcIixcbiAgICBcImV4dGVuZHNcIixcbiAgICBcImlzXCIsXG4gICAgXCJzeW5jXCIsXG4gICAgXCJicmVha1wiLFxuICAgIFwiZXh0ZXJuYWxcIixcbiAgICBcImxpYnJhcnlcIixcbiAgICBcInRoaXNcIixcbiAgICBcImNhc2VcIixcbiAgICBcImZhY3RvcnlcIixcbiAgICBcIm1peGluXCIsXG4gICAgXCJ0aHJvd1wiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImZhbHNlXCIsXG4gICAgXCJuZXdcIixcbiAgICBcInRydWVcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJmaW5hbFwiLFxuICAgIFwibnVsbFwiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJjb25zdFwiLFxuICAgIFwiZmluYWxseVwiLFxuICAgIFwib25cIixcbiAgICBcInR5cGVkZWZcIixcbiAgICBcImNvbnRpbnVlXCIsXG4gICAgXCJmb3JcIixcbiAgICBcIm9wZXJhdG9yXCIsXG4gICAgXCJ2YXJcIixcbiAgICBcImNvdmFyaWFudFwiLFxuICAgIFwiRnVuY3Rpb25cIixcbiAgICBcInBhcnRcIixcbiAgICBcInZvaWRcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcImdldFwiLFxuICAgIFwicmV0aHJvd1wiLFxuICAgIFwid2hpbGVcIixcbiAgICBcImRlZmVycmVkXCIsXG4gICAgXCJoaWRlXCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcIndpdGhcIixcbiAgICBcImRvXCIsXG4gICAgXCJpZlwiLFxuICAgIFwic2V0XCIsXG4gICAgXCJ5aWVsZFwiXG4gIF0sXG4gIHR5cGVLZXl3b3JkczogW1wiaW50XCIsIFwiZG91YmxlXCIsIFwiU3RyaW5nXCIsIFwiYm9vbFwiXSxcbiAgb3BlcmF0b3JzOiBbXG4gICAgXCIrXCIsXG4gICAgXCItXCIsXG4gICAgXCIqXCIsXG4gICAgXCIvXCIsXG4gICAgXCJ+L1wiLFxuICAgIFwiJVwiLFxuICAgIFwiKytcIixcbiAgICBcIi0tXCIsXG4gICAgXCI9PVwiLFxuICAgIFwiIT1cIixcbiAgICBcIj5cIixcbiAgICBcIjxcIixcbiAgICBcIj49XCIsXG4gICAgXCI8PVwiLFxuICAgIFwiPVwiLFxuICAgIFwiLT1cIixcbiAgICBcIi89XCIsXG4gICAgXCIlPVwiLFxuICAgIFwiPj49XCIsXG4gICAgXCJePVwiLFxuICAgIFwiKz1cIixcbiAgICBcIio9XCIsXG4gICAgXCJ+Lz1cIixcbiAgICBcIjw8PVwiLFxuICAgIFwiJj1cIixcbiAgICBcIiE9XCIsXG4gICAgXCJ8fFwiLFxuICAgIFwiJiZcIixcbiAgICBcIiZcIixcbiAgICBcInxcIixcbiAgICBcIl5cIixcbiAgICBcIn5cIixcbiAgICBcIjw8XCIsXG4gICAgXCI+PlwiLFxuICAgIFwiIVwiLFxuICAgIFwiPj4+XCIsXG4gICAgXCI/P1wiLFxuICAgIFwiP1wiLFxuICAgIFwiOlwiLFxuICAgIFwifD1cIlxuICBdLFxuICBzeW1ib2xzOiAvWz0+PCF+PzomfCtcXC0qXFwvXFxeJV0rLyxcbiAgZXNjYXBlczogL1xcXFwoPzpbYWJmbnJ0dlxcXFxcIiddfHhbMC05QS1GYS1mXXsxLDR9fHVbMC05QS1GYS1mXXs0fXxVWzAtOUEtRmEtZl17OH0pLyxcbiAgZGlnaXRzOiAvXFxkKyhfK1xcZCspKi8sXG4gIG9jdGFsZGlnaXRzOiAvWzAtN10rKF8rWzAtN10rKSovLFxuICBiaW5hcnlkaWdpdHM6IC9bMC0xXSsoXytbMC0xXSspKi8sXG4gIGhleGRpZ2l0czogL1tbMC05YS1mQS1GXSsoXytbMC05YS1mQS1GXSspKi8sXG4gIHJlZ2V4cGN0bDogL1soKXt9XFxbXFxdXFwkXFxefFxcLSorP1xcLl0vLFxuICByZWdleHBlc2M6IC9cXFxcKD86W2JCZERmbnJzdHZ3V24wXFxcXFxcL118QHJlZ2V4cGN0bHxjW0EtWl18eFswLTlhLWZBLUZdezJ9fHVbMC05YS1mQS1GXXs0fSkvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbWy9be31dLywgXCJkZWxpbWl0ZXIuYnJhY2tldFwiXSwgeyBpbmNsdWRlOiBcImNvbW1vblwiIH1dLFxuICAgIGNvbW1vbjogW1xuICAgICAgW1xuICAgICAgICAvW2Etel8kXVtcXHckXSovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQHR5cGVLZXl3b3Jkc1wiOiBcInR5cGUuaWRlbnRpZmllclwiLFxuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bQS1aXyRdW1xcd1xcJF0qLywgXCJ0eXBlLmlkZW50aWZpZXJcIl0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgW1xuICAgICAgICAvXFwvKD89KFteXFxcXFxcL118XFxcXC4pK1xcLyhbZ2ltc3V5XSopKFxccyopKFxcLnw7fCx8XFwpfFxcXXxcXH18JCkpLyxcbiAgICAgICAgeyB0b2tlbjogXCJyZWdleHBcIiwgYnJhY2tldDogXCJAb3BlblwiLCBuZXh0OiBcIkByZWdleHBcIiB9XG4gICAgICBdLFxuICAgICAgWy9AW2EtekEtWl0rLywgXCJhbm5vdGF0aW9uXCJdLFxuICAgICAgWy9bKClcXFtcXF1dLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbL1s8Pl0oPyFAc3ltYm9scykvLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFsvISg/PShbXj1dfCQpKS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW1xuICAgICAgICAvQHN5bWJvbHMvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQG9wZXJhdG9yc1wiOiBcImRlbGltaXRlclwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy8oQGRpZ2l0cylbZUVdKFtcXC0rXT8oQGRpZ2l0cykpPy8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy8oQGRpZ2l0cylcXC4oQGRpZ2l0cykoW2VFXVtcXC0rXT8oQGRpZ2l0cykpPy8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy8wW3hYXShAaGV4ZGlnaXRzKW4/LywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgWy8wW29PXT8oQG9jdGFsZGlnaXRzKW4/LywgXCJudW1iZXIub2N0YWxcIl0sXG4gICAgICBbLzBbYkJdKEBiaW5hcnlkaWdpdHMpbj8vLCBcIm51bWJlci5iaW5hcnlcIl0sXG4gICAgICBbLyhAZGlnaXRzKW4/LywgXCJudW1iZXJcIl0sXG4gICAgICBbL1s7LC5dLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1wiKFteXCJcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbLycoW14nXFxcXF18XFxcXC4pKiQvLCBcInN0cmluZy5pbnZhbGlkXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nXCIsIFwiQHN0cmluZ19kb3VibGVcIl0sXG4gICAgICBbLycvLCBcInN0cmluZ1wiLCBcIkBzdHJpbmdfc2luZ2xlXCJdXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIlwiXSxcbiAgICAgIFsvXFwvXFwqXFwqKD8hXFwvKS8sIFwiY29tbWVudC5kb2NcIiwgXCJAanNkb2NcIl0sXG4gICAgICBbL1xcL1xcKi8sIFwiY29tbWVudFwiLCBcIkBjb21tZW50XCJdLFxuICAgICAgWy9cXC9cXC9cXC8uKiQvLCBcImNvbW1lbnQuZG9jXCJdLFxuICAgICAgWy9cXC9cXC8uKiQvLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIGNvbW1lbnQ6IFtcbiAgICAgIFsvW15cXC8qXSsvLCBcImNvbW1lbnRcIl0sXG4gICAgICBbL1xcKlxcLy8sIFwiY29tbWVudFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1tcXC8qXS8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAganNkb2M6IFtcbiAgICAgIFsvW15cXC8qXSsvLCBcImNvbW1lbnQuZG9jXCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnQuZG9jXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW1xcLypdLywgXCJjb21tZW50LmRvY1wiXVxuICAgIF0sXG4gICAgcmVnZXhwOiBbXG4gICAgICBbXG4gICAgICAgIC8oXFx7KShcXGQrKD86LFxcZCopPykoXFx9KS8sXG4gICAgICAgIFtcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiLCBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiLCBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiXVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLyhcXFspKFxcXj8pKD89KD86W15cXF1cXFxcXFwvXXxcXFxcLikrKS8sXG4gICAgICAgIFtcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiLCB7IHRva2VuOiBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiLCBuZXh0OiBcIkByZWdleHJhbmdlXCIgfV1cbiAgICAgIF0sXG4gICAgICBbLyhcXCgpKFxcPzp8XFw/PXxcXD8hKS8sIFtcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiLCBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiXV0sXG4gICAgICBbL1soKV0vLCBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiXSxcbiAgICAgIFsvQHJlZ2V4cGN0bC8sIFwicmVnZXhwLmVzY2FwZS5jb250cm9sXCJdLFxuICAgICAgWy9bXlxcXFxcXC9dLywgXCJyZWdleHBcIl0sXG4gICAgICBbL0ByZWdleHBlc2MvLCBcInJlZ2V4cC5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFxcXC4vLCBcInJlZ2V4cC5pbnZhbGlkXCJdLFxuICAgICAgWy8oXFwvKShbZ2ltc3V5XSopLywgW3sgdG9rZW46IFwicmVnZXhwXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIG5leHQ6IFwiQHBvcFwiIH0sIFwia2V5d29yZC5vdGhlclwiXV1cbiAgICBdLFxuICAgIHJlZ2V4cmFuZ2U6IFtcbiAgICAgIFsvLS8sIFwicmVnZXhwLmVzY2FwZS5jb250cm9sXCJdLFxuICAgICAgWy9cXF4vLCBcInJlZ2V4cC5pbnZhbGlkXCJdLFxuICAgICAgWy9AcmVnZXhwZXNjLywgXCJyZWdleHAuZXNjYXBlXCJdLFxuICAgICAgWy9bXlxcXV0vLCBcInJlZ2V4cFwiXSxcbiAgICAgIFtcbiAgICAgICAgL1xcXS8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIixcbiAgICAgICAgICBuZXh0OiBcIkBwb3BcIixcbiAgICAgICAgICBicmFja2V0OiBcIkBjbG9zZVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIHN0cmluZ19kb3VibGU6IFtcbiAgICAgIFsvW15cXFxcXCJcXCRdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9bXlxcXFxcIl0rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvXFwkXFx3Ky8sIFwiaWRlbnRpZmllclwiXVxuICAgIF0sXG4gICAgc3RyaW5nX3NpbmdsZTogW1xuICAgICAgWy9bXlxcXFwnXFwkXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIl0sXG4gICAgICBbLycvLCBcInN0cmluZ1wiLCBcIkBwb3BcIl0sXG4gICAgICBbL1xcJFxcdysvLCBcImlkZW50aWZpZXJcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGNBQWMsQ0FBQyxNQUFNLElBQUk7QUFBQSxFQUMxQjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsVUFBVSxTQUFTLEVBQUc7QUFBQSxJQUN2RCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFFBQVEsRUFBRztBQUFBLElBQzVDLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsVUFBVSxTQUFTLEVBQUc7QUFBQSxJQUN2RCxFQUFFLE1BQU0sT0FBTyxPQUFPLE9BQU8sT0FBTyxDQUFDLFFBQVEsRUFBRztBQUFBLEVBQ2pEO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0QsU0FBUztBQUFBLElBQ1AsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLE1BQ1AsS0FBSztBQUFBLElBQ047QUFBQSxFQUNGO0FBQ0g7QUFDRyxJQUFDLFdBQVc7QUFBQSxFQUNiLGNBQWM7QUFBQSxFQUNkLGNBQWM7QUFBQSxFQUNkLFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxjQUFjLENBQUMsT0FBTyxVQUFVLFVBQVUsTUFB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QUFhO0FBQUEsSUFDeEI7QUFBQSxJQUNELFFBQVE7QUFBQSxNQUNOO0FBQUEsUUFDRTtBQUFBLFFBQ0EsQ0FBQyx5QkFBeUIseUJBQXlCLHVCQUF1QjtBQUFBLE1BQzNFO0FBQUEsTUFDRDtBQUFBLFFBQ0U7QUFBQSxRQUNBLENBQUMseUJBQXlCLEVBQUUsT0FBTyx5QkFBeUIsTUFBTSxjQUFhLENBQUU7QUFBQSxNQUNsRjtBQUFBLE1BQ0QsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsdUJBQXVCLENBQUM7QUFBQSxNQUN4RSxDQUFDLFFBQVEsdUJBQXVCO0FBQUEsTUFDaEMsQ0FBQyxjQUFjLHVCQUF1QjtBQUFBLE1BQ3RDLENBQUMsV0FBVyxRQUFRO0FBQUEsTUFDcEIsQ0FBQyxjQUFjLGVBQWU7QUFBQSxNQUM5QixDQUFDLFFBQVEsZ0JBQWdCO0FBQUEsTUFDekIsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLE9BQU8sVUFBVSxTQUFTLFVBQVUsTUFBTSxVQUFVLGVBQWUsQ0FBQztBQUFBLElBQzVGO0FBQUEsSUFDRCxZQUFZO0FBQUEsTUFDVixDQUFDLEtBQUssdUJBQXVCO0FBQUEsTUFDN0IsQ0FBQyxNQUFNLGdCQUFnQjtBQUFBLE1BQ3ZCLENBQUMsY0FBYyxlQUFlO0FBQUEsTUFDOUIsQ0FBQyxTQUFTLFFBQVE7QUFBQSxNQUNsQjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsVUFDTixTQUFTO0FBQUEsUUFDVjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDRCxlQUFlO0FBQUEsTUFDYixDQUFDLGFBQWEsUUFBUTtBQUFBLE1BQ3RCLENBQUMsV0FBVyxRQUFRO0FBQUEsTUFDcEIsQ0FBQyxZQUFZLGVBQWU7QUFBQSxNQUM1QixDQUFDLE9BQU8sdUJBQXVCO0FBQUEsTUFDL0IsQ0FBQyxLQUFLLFVBQVUsTUFBTTtBQUFBLE1BQ3RCLENBQUMsU0FBUyxZQUFZO0FBQUEsSUFDdkI7QUFBQSxJQUNELGVBQWU7QUFBQSxNQUNiLENBQUMsYUFBYSxRQUFRO0FBQUEsTUFDdEIsQ0FBQyxZQUFZLGVBQWU7QUFBQSxNQUM1QixDQUFDLE9BQU8sdUJBQXVCO0FBQUEsTUFDL0IsQ0FBQyxLQUFLLFVBQVUsTUFBTTtBQUFBLE1BQ3RCLENBQUMsU0FBUyxZQUFZO0FBQUEsSUFDdkI7QUFBQSxFQUNGO0FBQ0g7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
