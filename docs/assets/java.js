/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
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
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "<", close: ">" }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*//\\s*(?:(?:#?region\\b)|(?:<editor-fold\\b))"),
      end: new RegExp("^\\s*//\\s*(?:(?:#?endregion\\b)|(?:</editor-fold>))")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".java",
  keywords: [
    "abstract",
    "continue",
    "for",
    "new",
    "switch",
    "assert",
    "default",
    "goto",
    "package",
    "synchronized",
    "boolean",
    "do",
    "if",
    "private",
    "this",
    "break",
    "double",
    "implements",
    "protected",
    "throw",
    "byte",
    "else",
    "import",
    "public",
    "throws",
    "case",
    "enum",
    "instanceof",
    "return",
    "transient",
    "catch",
    "extends",
    "int",
    "short",
    "try",
    "char",
    "final",
    "interface",
    "static",
    "void",
    "class",
    "finally",
    "long",
    "strictfp",
    "volatile",
    "const",
    "float",
    "native",
    "super",
    "while",
    "true",
    "false",
    "yield",
    "record",
    "sealed",
    "non-sealed",
    "permits"
  ],
  operators: [
    "=",
    ">",
    "<",
    "!",
    "~",
    "?",
    ":",
    "==",
    "<=",
    ">=",
    "!=",
    "&&",
    "||",
    "++",
    "--",
    "+",
    "-",
    "*",
    "/",
    "&",
    "|",
    "^",
    "%",
    "<<",
    ">>",
    ">>>",
    "+=",
    "-=",
    "*=",
    "/=",
    "&=",
    "|=",
    "^=",
    "%=",
    "<<=",
    ">>=",
    ">>>="
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  tokenizer: {
    root: [
      ["non-sealed", "keyword.non-sealed"],
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@default": "identifier"
          }
        }
      ],
      { include: "@whitespace" },
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": ""
          }
        }
      ],
      [/@\s*[a-zA-Z_\$][\w\$]*/, "annotation"],
      [/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, "number.float"],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, "number.float"],
      [/0[xX](@hexdigits)[Ll]?/, "number.hex"],
      [/0(@octaldigits)[Ll]?/, "number.octal"],
      [/0[bB](@binarydigits)[Ll]?/, "number.binary"],
      [/(@digits)[fFdD]/, "number.float"],
      [/(@digits)[lL]?/, "number"],
      [/[;,.]/, "delimiter"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"""/, "string", "@multistring"],
      [/"/, "string", "@string"],
      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@javadoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    javadoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\/\*/, "comment.doc.invalid"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"]
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ],
    multistring: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"""/, "string", "@pop"],
      [/./, "string"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9qYXZhL2phdmEuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2phdmEvamF2YS50c1xudmFyIGNvbmYgPSB7XG4gIHdvcmRQYXR0ZXJuOiAvKC0/XFxkKlxcLlxcZFxcdyopfChbXlxcYFxcflxcIVxcI1xcJVxcXlxcJlxcKlxcKFxcKVxcLVxcPVxcK1xcW1xce1xcXVxcfVxcXFxcXHxcXDtcXDpcXCdcXFwiXFwsXFwuXFw8XFw+XFwvXFw/XFxzXSspL2csXG4gIGNvbW1lbnRzOiB7XG4gICAgbGluZUNvbW1lbnQ6IFwiLy9cIixcbiAgICBibG9ja0NvbW1lbnQ6IFtcIi8qXCIsIFwiKi9cIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH0sXG4gICAgeyBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiIH1cbiAgXSxcbiAgZm9sZGluZzoge1xuICAgIG1hcmtlcnM6IHtcbiAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKFwiXlxcXFxzKi8vXFxcXHMqKD86KD86Iz9yZWdpb25cXFxcYil8KD86PGVkaXRvci1mb2xkXFxcXGIpKVwiKSxcbiAgICAgIGVuZDogbmV3IFJlZ0V4cChcIl5cXFxccyovL1xcXFxzKig/Oig/OiM/ZW5kcmVnaW9uXFxcXGIpfCg/OjwvZWRpdG9yLWZvbGQ+KSlcIilcbiAgICB9XG4gIH1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5qYXZhXCIsXG4gIGtleXdvcmRzOiBbXG4gICAgXCJhYnN0cmFjdFwiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcImZvclwiLFxuICAgIFwibmV3XCIsXG4gICAgXCJzd2l0Y2hcIixcbiAgICBcImFzc2VydFwiLFxuICAgIFwiZGVmYXVsdFwiLFxuICAgIFwiZ290b1wiLFxuICAgIFwicGFja2FnZVwiLFxuICAgIFwic3luY2hyb25pemVkXCIsXG4gICAgXCJib29sZWFuXCIsXG4gICAgXCJkb1wiLFxuICAgIFwiaWZcIixcbiAgICBcInByaXZhdGVcIixcbiAgICBcInRoaXNcIixcbiAgICBcImJyZWFrXCIsXG4gICAgXCJkb3VibGVcIixcbiAgICBcImltcGxlbWVudHNcIixcbiAgICBcInByb3RlY3RlZFwiLFxuICAgIFwidGhyb3dcIixcbiAgICBcImJ5dGVcIixcbiAgICBcImVsc2VcIixcbiAgICBcImltcG9ydFwiLFxuICAgIFwicHVibGljXCIsXG4gICAgXCJ0aHJvd3NcIixcbiAgICBcImNhc2VcIixcbiAgICBcImVudW1cIixcbiAgICBcImluc3RhbmNlb2ZcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwidHJhbnNpZW50XCIsXG4gICAgXCJjYXRjaFwiLFxuICAgIFwiZXh0ZW5kc1wiLFxuICAgIFwiaW50XCIsXG4gICAgXCJzaG9ydFwiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJjaGFyXCIsXG4gICAgXCJmaW5hbFwiLFxuICAgIFwiaW50ZXJmYWNlXCIsXG4gICAgXCJzdGF0aWNcIixcbiAgICBcInZvaWRcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJmaW5hbGx5XCIsXG4gICAgXCJsb25nXCIsXG4gICAgXCJzdHJpY3RmcFwiLFxuICAgIFwidm9sYXRpbGVcIixcbiAgICBcImNvbnN0XCIsXG4gICAgXCJmbG9hdFwiLFxuICAgIFwibmF0aXZlXCIsXG4gICAgXCJzdXBlclwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcInRydWVcIixcbiAgICBcImZhbHNlXCIsXG4gICAgXCJ5aWVsZFwiLFxuICAgIFwicmVjb3JkXCIsXG4gICAgXCJzZWFsZWRcIixcbiAgICBcIm5vbi1zZWFsZWRcIixcbiAgICBcInBlcm1pdHNcIlxuICBdLFxuICBvcGVyYXRvcnM6IFtcbiAgICBcIj1cIixcbiAgICBcIj5cIixcbiAgICBcIjxcIixcbiAgICBcIiFcIixcbiAgICBcIn5cIixcbiAgICBcIj9cIixcbiAgICBcIjpcIixcbiAgICBcIj09XCIsXG4gICAgXCI8PVwiLFxuICAgIFwiPj1cIixcbiAgICBcIiE9XCIsXG4gICAgXCImJlwiLFxuICAgIFwifHxcIixcbiAgICBcIisrXCIsXG4gICAgXCItLVwiLFxuICAgIFwiK1wiLFxuICAgIFwiLVwiLFxuICAgIFwiKlwiLFxuICAgIFwiL1wiLFxuICAgIFwiJlwiLFxuICAgIFwifFwiLFxuICAgIFwiXlwiLFxuICAgIFwiJVwiLFxuICAgIFwiPDxcIixcbiAgICBcIj4+XCIsXG4gICAgXCI+Pj5cIixcbiAgICBcIis9XCIsXG4gICAgXCItPVwiLFxuICAgIFwiKj1cIixcbiAgICBcIi89XCIsXG4gICAgXCImPVwiLFxuICAgIFwifD1cIixcbiAgICBcIl49XCIsXG4gICAgXCIlPVwiLFxuICAgIFwiPDw9XCIsXG4gICAgXCI+Pj1cIixcbiAgICBcIj4+Pj1cIlxuICBdLFxuICBzeW1ib2xzOiAvWz0+PCF+PzomfCtcXC0qXFwvXFxeJV0rLyxcbiAgZXNjYXBlczogL1xcXFwoPzpbYWJmbnJ0dlxcXFxcIiddfHhbMC05QS1GYS1mXXsxLDR9fHVbMC05QS1GYS1mXXs0fXxVWzAtOUEtRmEtZl17OH0pLyxcbiAgZGlnaXRzOiAvXFxkKyhfK1xcZCspKi8sXG4gIG9jdGFsZGlnaXRzOiAvWzAtN10rKF8rWzAtN10rKSovLFxuICBiaW5hcnlkaWdpdHM6IC9bMC0xXSsoXytbMC0xXSspKi8sXG4gIGhleGRpZ2l0czogL1tbMC05YS1mQS1GXSsoXytbMC05YS1mQS1GXSspKi8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIFtcIm5vbi1zZWFsZWRcIiwgXCJrZXl3b3JkLm5vbi1zZWFsZWRcIl0sXG4gICAgICBbXG4gICAgICAgIC9bYS16QS1aXyRdW1xcdyRdKi8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogeyB0b2tlbjogXCJrZXl3b3JkLiQwXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJpZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy9be30oKVxcW1xcXV0vLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFsvWzw+XSg/IUBzeW1ib2xzKS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgW1xuICAgICAgICAvQHN5bWJvbHMvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQG9wZXJhdG9yc1wiOiBcImRlbGltaXRlclwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9AXFxzKlthLXpBLVpfXFwkXVtcXHdcXCRdKi8sIFwiYW5ub3RhdGlvblwiXSxcbiAgICAgIFsvKEBkaWdpdHMpW2VFXShbXFwtK10/KEBkaWdpdHMpKT9bZkZkRF0/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbLyhAZGlnaXRzKVxcLihAZGlnaXRzKShbZUVdW1xcLStdPyhAZGlnaXRzKSk/W2ZGZERdPy8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy8wW3hYXShAaGV4ZGlnaXRzKVtMbF0/LywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgWy8wKEBvY3RhbGRpZ2l0cylbTGxdPy8sIFwibnVtYmVyLm9jdGFsXCJdLFxuICAgICAgWy8wW2JCXShAYmluYXJ5ZGlnaXRzKVtMbF0/LywgXCJudW1iZXIuYmluYXJ5XCJdLFxuICAgICAgWy8oQGRpZ2l0cylbZkZkRF0vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvKEBkaWdpdHMpW2xMXT8vLCBcIm51bWJlclwiXSxcbiAgICAgIFsvWzssLl0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvXCIoW15cIlxcXFxdfFxcXFwuKSokLywgXCJzdHJpbmcuaW52YWxpZFwiXSxcbiAgICAgIFsvXCJcIlwiLywgXCJzdHJpbmdcIiwgXCJAbXVsdGlzdHJpbmdcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgXCJAc3RyaW5nXCJdLFxuICAgICAgWy8nW15cXFxcJ10nLywgXCJzdHJpbmdcIl0sXG4gICAgICBbLygnKShAZXNjYXBlcykoJykvLCBbXCJzdHJpbmdcIiwgXCJzdHJpbmcuZXNjYXBlXCIsIFwic3RyaW5nXCJdXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nLmludmFsaWRcIl1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwiXCJdLFxuICAgICAgWy9cXC9cXCpcXCooPyFcXC8pLywgXCJjb21tZW50LmRvY1wiLCBcIkBqYXZhZG9jXCJdLFxuICAgICAgWy9cXC9cXCovLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwvLiokLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1teXFwvKl0rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXFwvKl0vLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIGphdmFkb2M6IFtcbiAgICAgIFsvW15cXC8qXSsvLCBcImNvbW1lbnQuZG9jXCJdLFxuICAgICAgWy9cXC9cXCovLCBcImNvbW1lbnQuZG9jLmludmFsaWRcIl0sXG4gICAgICBbL1xcKlxcLy8sIFwiY29tbWVudC5kb2NcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXFwvKl0vLCBcImNvbW1lbnQuZG9jXCJdXG4gICAgXSxcbiAgICBzdHJpbmc6IFtcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIG11bHRpc3RyaW5nOiBbXG4gICAgICBbL1teXFxcXFwiXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIl0sXG4gICAgICBbL1wiXCJcIi8sIFwic3RyaW5nXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvLi8sIFwic3RyaW5nXCJdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUcsSUFBQyxPQUFPO0FBQUEsRUFDVCxhQUFhO0FBQUEsRUFDYixVQUFVO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixjQUFjLENBQUMsTUFBTSxJQUFJO0FBQUEsRUFDMUI7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxFQUNWO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFL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WUFBWTtBQUFBLE1BQ3ZDLENBQUMsd0JBQXdCLGNBQWM7QUFBQSxNQUN2QyxDQUFDLDZCQUE2QixlQUFlO0FBQUEsTUFDN0MsQ0FBQyxtQkFBbUIsY0FBYztBQUFBLE1BQ2xDLENBQUMsa0JBQWtCLFFBQVE7QUFBQSxNQUMzQixDQUFDLFNBQVMsV0FBVztBQUFBLE1BQ3JCLENBQUMsbUJBQW1CLGdCQUFnQjtBQUFBLE1BQ3BDLENBQUMsT0FBTyxVQUFVLGNBQWM7QUFBQSxNQUNoQyxDQUFDLEtBQUssVUFBVSxTQUFTO0FBQUEsTUFDekIsQ0FBQyxZQUFZLFFBQVE7QUFBQSxNQUNyQixDQUFDLG9CQUFvQixDQUFDLFVBQVUsaUJBQWlCLFFBQVEsQ0FBQztBQUFBLE1BQzFELENBQUMsS0FBSyxnQkFBZ0I7QUFBQSxJQUN2QjtBQUFBLElBQ0QsWUFBWTtBQUFBLE1BQ1YsQ0FBQyxjQUFjLEVBQUU7QUFBQSxNQUNqQixDQUFDLGdCQUFnQixlQUFlLFVBQVU7QUFBQSxNQUMxQyxDQUFDLFFBQVEsV0FBVyxVQUFVO0FBQUEsTUFDOUIsQ0FBQyxXQUFXLFNBQVM7QUFBQSxJQUN0QjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxXQUFXLFNBQVM7QUFBQSxNQUNyQixDQUFDLFFBQVEsV0FBVyxNQUFNO0FBQUEsTUFDMUIsQ0FBQyxTQUFTLFNBQVM7QUFBQSxJQUNwQjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxXQUFXLGFBQWE7QUFBQSxNQUN6QixDQUFDLFFBQVEscUJBQXFCO0FBQUEsTUFDOUIsQ0FBQyxRQUFRLGVBQWUsTUFBTTtBQUFBLE1BQzlCLENBQUMsU0FBUyxhQUFhO0FBQUEsSUFDeEI7QUFBQSxJQUNELFFBQVE7QUFBQSxNQUNOLENBQUMsV0FBVyxRQUFRO0FBQUEsTUFDcEIsQ0FBQyxZQUFZLGVBQWU7QUFBQSxNQUM1QixDQUFDLE9BQU8sdUJBQXVCO0FBQUEsTUFDL0IsQ0FBQyxLQUFLLFVBQVUsTUFBTTtBQUFBLElBQ3ZCO0FBQUEsSUFDRCxhQUFhO0FBQUEsTUFDWCxDQUFDLFdBQVcsUUFBUTtBQUFBLE1BQ3BCLENBQUMsWUFBWSxlQUFlO0FBQUEsTUFDNUIsQ0FBQyxPQUFPLHVCQUF1QjtBQUFBLE1BQy9CLENBQUMsT0FBTyxVQUFVLE1BQU07QUFBQSxNQUN4QixDQUFDLEtBQUssUUFBUTtBQUFBLElBQ2Y7QUFBQSxFQUNGO0FBQ0g7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
