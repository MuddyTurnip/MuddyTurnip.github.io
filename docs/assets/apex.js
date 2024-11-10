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
var keywords = [
  "abstract",
  "activate",
  "and",
  "any",
  "array",
  "as",
  "asc",
  "assert",
  "autonomous",
  "begin",
  "bigdecimal",
  "blob",
  "boolean",
  "break",
  "bulk",
  "by",
  "case",
  "cast",
  "catch",
  "char",
  "class",
  "collect",
  "commit",
  "const",
  "continue",
  "convertcurrency",
  "decimal",
  "default",
  "delete",
  "desc",
  "do",
  "double",
  "else",
  "end",
  "enum",
  "exception",
  "exit",
  "export",
  "extends",
  "false",
  "final",
  "finally",
  "float",
  "for",
  "from",
  "future",
  "get",
  "global",
  "goto",
  "group",
  "having",
  "hint",
  "if",
  "implements",
  "import",
  "in",
  "inner",
  "insert",
  "instanceof",
  "int",
  "interface",
  "into",
  "join",
  "last_90_days",
  "last_month",
  "last_n_days",
  "last_week",
  "like",
  "limit",
  "list",
  "long",
  "loop",
  "map",
  "merge",
  "native",
  "new",
  "next_90_days",
  "next_month",
  "next_n_days",
  "next_week",
  "not",
  "null",
  "nulls",
  "number",
  "object",
  "of",
  "on",
  "or",
  "outer",
  "override",
  "package",
  "parallel",
  "pragma",
  "private",
  "protected",
  "public",
  "retrieve",
  "return",
  "returning",
  "rollback",
  "savepoint",
  "search",
  "select",
  "set",
  "short",
  "sort",
  "stat",
  "static",
  "strictfp",
  "super",
  "switch",
  "synchronized",
  "system",
  "testmethod",
  "then",
  "this",
  "this_month",
  "this_week",
  "throw",
  "throws",
  "today",
  "tolabel",
  "tomorrow",
  "transaction",
  "transient",
  "trigger",
  "true",
  "try",
  "type",
  "undelete",
  "update",
  "upsert",
  "using",
  "virtual",
  "void",
  "volatile",
  "webservice",
  "when",
  "where",
  "while",
  "yesterday"
];
var uppercaseFirstLetter = (lowercase) => lowercase.charAt(0).toUpperCase() + lowercase.substr(1);
var keywordsWithCaseVariations = [];
keywords.forEach((lowercase) => {
  keywordsWithCaseVariations.push(lowercase);
  keywordsWithCaseVariations.push(lowercase.toUpperCase());
  keywordsWithCaseVariations.push(uppercaseFirstLetter(lowercase));
});
var language = {
  defaultToken: "",
  tokenPostfix: ".apex",
  keywords: keywordsWithCaseVariations,
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
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@default": "identifier"
          }
        }
      ],
      [
        /[A-Z][\w\$]*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@default": "type.identifier"
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
      [/(@digits)[fFdD]/, "number.float"],
      [/(@digits)[lL]?/, "number"],
      [/[;,.]/, "delimiter"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", '@string."'],
      [/'/, "string", "@string.'"],
      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@apexdoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    apexdoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"]
    ],
    string: [
      [/[^\\"']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [
        /["']/,
        {
          cases: {
            "$#==$S2": { token: "string", next: "@pop" },
            "@default": "string"
          }
        }
      ]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBleC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9hcGV4L2FwZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2FwZXgvYXBleC50c1xudmFyIGNvbmYgPSB7XG4gIHdvcmRQYXR0ZXJuOiAvKC0/XFxkKlxcLlxcZFxcdyopfChbXlxcYFxcflxcIVxcI1xcJVxcXlxcJlxcKlxcKFxcKVxcLVxcPVxcK1xcW1xce1xcXVxcfVxcXFxcXHxcXDtcXDpcXCdcXFwiXFwsXFwuXFw8XFw+XFwvXFw/XFxzXSspL2csXG4gIGNvbW1lbnRzOiB7XG4gICAgbGluZUNvbW1lbnQ6IFwiLy9cIixcbiAgICBibG9ja0NvbW1lbnQ6IFtcIi8qXCIsIFwiKi9cIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH0sXG4gICAgeyBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiIH1cbiAgXSxcbiAgZm9sZGluZzoge1xuICAgIG1hcmtlcnM6IHtcbiAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKFwiXlxcXFxzKi8vXFxcXHMqKD86KD86Iz9yZWdpb25cXFxcYil8KD86PGVkaXRvci1mb2xkXFxcXGIpKVwiKSxcbiAgICAgIGVuZDogbmV3IFJlZ0V4cChcIl5cXFxccyovL1xcXFxzKig/Oig/OiM/ZW5kcmVnaW9uXFxcXGIpfCg/OjwvZWRpdG9yLWZvbGQ+KSlcIilcbiAgICB9XG4gIH1cbn07XG52YXIga2V5d29yZHMgPSBbXG4gIFwiYWJzdHJhY3RcIixcbiAgXCJhY3RpdmF0ZVwiLFxuICBcImFuZFwiLFxuICBcImFueVwiLFxuICBcImFycmF5XCIsXG4gIFwiYXNcIixcbiAgXCJhc2NcIixcbiAgXCJhc3NlcnRcIixcbiAgXCJhdXRvbm9tb3VzXCIsXG4gIFwiYmVnaW5cIixcbiAgXCJiaWdkZWNpbWFsXCIsXG4gIFwiYmxvYlwiLFxuICBcImJvb2xlYW5cIixcbiAgXCJicmVha1wiLFxuICBcImJ1bGtcIixcbiAgXCJieVwiLFxuICBcImNhc2VcIixcbiAgXCJjYXN0XCIsXG4gIFwiY2F0Y2hcIixcbiAgXCJjaGFyXCIsXG4gIFwiY2xhc3NcIixcbiAgXCJjb2xsZWN0XCIsXG4gIFwiY29tbWl0XCIsXG4gIFwiY29uc3RcIixcbiAgXCJjb250aW51ZVwiLFxuICBcImNvbnZlcnRjdXJyZW5jeVwiLFxuICBcImRlY2ltYWxcIixcbiAgXCJkZWZhdWx0XCIsXG4gIFwiZGVsZXRlXCIsXG4gIFwiZGVzY1wiLFxuICBcImRvXCIsXG4gIFwiZG91YmxlXCIsXG4gIFwiZWxzZVwiLFxuICBcImVuZFwiLFxuICBcImVudW1cIixcbiAgXCJleGNlcHRpb25cIixcbiAgXCJleGl0XCIsXG4gIFwiZXhwb3J0XCIsXG4gIFwiZXh0ZW5kc1wiLFxuICBcImZhbHNlXCIsXG4gIFwiZmluYWxcIixcbiAgXCJmaW5hbGx5XCIsXG4gIFwiZmxvYXRcIixcbiAgXCJmb3JcIixcbiAgXCJmcm9tXCIsXG4gIFwiZnV0dXJlXCIsXG4gIFwiZ2V0XCIsXG4gIFwiZ2xvYmFsXCIsXG4gIFwiZ290b1wiLFxuICBcImdyb3VwXCIsXG4gIFwiaGF2aW5nXCIsXG4gIFwiaGludFwiLFxuICBcImlmXCIsXG4gIFwiaW1wbGVtZW50c1wiLFxuICBcImltcG9ydFwiLFxuICBcImluXCIsXG4gIFwiaW5uZXJcIixcbiAgXCJpbnNlcnRcIixcbiAgXCJpbnN0YW5jZW9mXCIsXG4gIFwiaW50XCIsXG4gIFwiaW50ZXJmYWNlXCIsXG4gIFwiaW50b1wiLFxuICBcImpvaW5cIixcbiAgXCJsYXN0XzkwX2RheXNcIixcbiAgXCJsYXN0X21vbnRoXCIsXG4gIFwibGFzdF9uX2RheXNcIixcbiAgXCJsYXN0X3dlZWtcIixcbiAgXCJsaWtlXCIsXG4gIFwibGltaXRcIixcbiAgXCJsaXN0XCIsXG4gIFwibG9uZ1wiLFxuICBcImxvb3BcIixcbiAgXCJtYXBcIixcbiAgXCJtZXJnZVwiLFxuICBcIm5hdGl2ZVwiLFxuICBcIm5ld1wiLFxuICBcIm5leHRfOTBfZGF5c1wiLFxuICBcIm5leHRfbW9udGhcIixcbiAgXCJuZXh0X25fZGF5c1wiLFxuICBcIm5leHRfd2Vla1wiLFxuICBcIm5vdFwiLFxuICBcIm51bGxcIixcbiAgXCJudWxsc1wiLFxuICBcIm51bWJlclwiLFxuICBcIm9iamVjdFwiLFxuICBcIm9mXCIsXG4gIFwib25cIixcbiAgXCJvclwiLFxuICBcIm91dGVyXCIsXG4gIFwib3ZlcnJpZGVcIixcbiAgXCJwYWNrYWdlXCIsXG4gIFwicGFyYWxsZWxcIixcbiAgXCJwcmFnbWFcIixcbiAgXCJwcml2YXRlXCIsXG4gIFwicHJvdGVjdGVkXCIsXG4gIFwicHVibGljXCIsXG4gIFwicmV0cmlldmVcIixcbiAgXCJyZXR1cm5cIixcbiAgXCJyZXR1cm5pbmdcIixcbiAgXCJyb2xsYmFja1wiLFxuICBcInNhdmVwb2ludFwiLFxuICBcInNlYXJjaFwiLFxuICBcInNlbGVjdFwiLFxuICBcInNldFwiLFxuICBcInNob3J0XCIsXG4gIFwic29ydFwiLFxuICBcInN0YXRcIixcbiAgXCJzdGF0aWNcIixcbiAgXCJzdHJpY3RmcFwiLFxuICBcInN1cGVyXCIsXG4gIFwic3dpdGNoXCIsXG4gIFwic3luY2hyb25pemVkXCIsXG4gIFwic3lzdGVtXCIsXG4gIFwidGVzdG1ldGhvZFwiLFxuICBcInRoZW5cIixcbiAgXCJ0aGlzXCIsXG4gIFwidGhpc19tb250aFwiLFxuICBcInRoaXNfd2Vla1wiLFxuICBcInRocm93XCIsXG4gIFwidGhyb3dzXCIsXG4gIFwidG9kYXlcIixcbiAgXCJ0b2xhYmVsXCIsXG4gIFwidG9tb3Jyb3dcIixcbiAgXCJ0cmFuc2FjdGlvblwiLFxuICBcInRyYW5zaWVudFwiLFxuICBcInRyaWdnZXJcIixcbiAgXCJ0cnVlXCIsXG4gIFwidHJ5XCIsXG4gIFwidHlwZVwiLFxuICBcInVuZGVsZXRlXCIsXG4gIFwidXBkYXRlXCIsXG4gIFwidXBzZXJ0XCIsXG4gIFwidXNpbmdcIixcbiAgXCJ2aXJ0dWFsXCIsXG4gIFwidm9pZFwiLFxuICBcInZvbGF0aWxlXCIsXG4gIFwid2Vic2VydmljZVwiLFxuICBcIndoZW5cIixcbiAgXCJ3aGVyZVwiLFxuICBcIndoaWxlXCIsXG4gIFwieWVzdGVyZGF5XCJcbl07XG52YXIgdXBwZXJjYXNlRmlyc3RMZXR0ZXIgPSAobG93ZXJjYXNlKSA9PiBsb3dlcmNhc2UuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBsb3dlcmNhc2Uuc3Vic3RyKDEpO1xudmFyIGtleXdvcmRzV2l0aENhc2VWYXJpYXRpb25zID0gW107XG5rZXl3b3Jkcy5mb3JFYWNoKChsb3dlcmNhc2UpID0+IHtcbiAga2V5d29yZHNXaXRoQ2FzZVZhcmlhdGlvbnMucHVzaChsb3dlcmNhc2UpO1xuICBrZXl3b3Jkc1dpdGhDYXNlVmFyaWF0aW9ucy5wdXNoKGxvd2VyY2FzZS50b1VwcGVyQ2FzZSgpKTtcbiAga2V5d29yZHNXaXRoQ2FzZVZhcmlhdGlvbnMucHVzaCh1cHBlcmNhc2VGaXJzdExldHRlcihsb3dlcmNhc2UpKTtcbn0pO1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCIuYXBleFwiLFxuICBrZXl3b3Jkczoga2V5d29yZHNXaXRoQ2FzZVZhcmlhdGlvbnMsXG4gIG9wZXJhdG9yczogW1xuICAgIFwiPVwiLFxuICAgIFwiPlwiLFxuICAgIFwiPFwiLFxuICAgIFwiIVwiLFxuICAgIFwiflwiLFxuICAgIFwiP1wiLFxuICAgIFwiOlwiLFxuICAgIFwiPT1cIixcbiAgICBcIjw9XCIsXG4gICAgXCI+PVwiLFxuICAgIFwiIT1cIixcbiAgICBcIiYmXCIsXG4gICAgXCJ8fFwiLFxuICAgIFwiKytcIixcbiAgICBcIi0tXCIsXG4gICAgXCIrXCIsXG4gICAgXCItXCIsXG4gICAgXCIqXCIsXG4gICAgXCIvXCIsXG4gICAgXCImXCIsXG4gICAgXCJ8XCIsXG4gICAgXCJeXCIsXG4gICAgXCIlXCIsXG4gICAgXCI8PFwiLFxuICAgIFwiPj5cIixcbiAgICBcIj4+PlwiLFxuICAgIFwiKz1cIixcbiAgICBcIi09XCIsXG4gICAgXCIqPVwiLFxuICAgIFwiLz1cIixcbiAgICBcIiY9XCIsXG4gICAgXCJ8PVwiLFxuICAgIFwiXj1cIixcbiAgICBcIiU9XCIsXG4gICAgXCI8PD1cIixcbiAgICBcIj4+PVwiLFxuICAgIFwiPj4+PVwiXG4gIF0sXG4gIHN5bWJvbHM6IC9bPT48IX4/OiZ8K1xcLSpcXC9cXF4lXSsvLFxuICBlc2NhcGVzOiAvXFxcXCg/OlthYmZucnR2XFxcXFwiJ118eFswLTlBLUZhLWZdezEsNH18dVswLTlBLUZhLWZdezR9fFVbMC05QS1GYS1mXXs4fSkvLFxuICBkaWdpdHM6IC9cXGQrKF8rXFxkKykqLyxcbiAgb2N0YWxkaWdpdHM6IC9bMC03XSsoXytbMC03XSspKi8sXG4gIGJpbmFyeWRpZ2l0czogL1swLTFdKyhfK1swLTFdKykqLyxcbiAgaGV4ZGlnaXRzOiAvW1swLTlhLWZBLUZdKyhfK1swLTlhLWZBLUZdKykqLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgW1xuICAgICAgICAvW2Etel8kXVtcXHckXSovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZC4kMFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvW0EtWl1bXFx3XFwkXSovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZC4kMFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwidHlwZS5pZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy9be30oKVxcW1xcXV0vLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFsvWzw+XSg/IUBzeW1ib2xzKS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgW1xuICAgICAgICAvQHN5bWJvbHMvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQG9wZXJhdG9yc1wiOiBcImRlbGltaXRlclwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9AXFxzKlthLXpBLVpfXFwkXVtcXHdcXCRdKi8sIFwiYW5ub3RhdGlvblwiXSxcbiAgICAgIFsvKEBkaWdpdHMpW2VFXShbXFwtK10/KEBkaWdpdHMpKT9bZkZkRF0/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbLyhAZGlnaXRzKVxcLihAZGlnaXRzKShbZUVdW1xcLStdPyhAZGlnaXRzKSk/W2ZGZERdPy8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy8oQGRpZ2l0cylbZkZkRF0vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvKEBkaWdpdHMpW2xMXT8vLCBcIm51bWJlclwiXSxcbiAgICAgIFsvWzssLl0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvXCIoW15cIlxcXFxdfFxcXFwuKSokLywgXCJzdHJpbmcuaW52YWxpZFwiXSxcbiAgICAgIFsvJyhbXidcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgJ0BzdHJpbmcuXCInXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nXCIsIFwiQHN0cmluZy4nXCJdLFxuICAgICAgWy8nW15cXFxcJ10nLywgXCJzdHJpbmdcIl0sXG4gICAgICBbLygnKShAZXNjYXBlcykoJykvLCBbXCJzdHJpbmdcIiwgXCJzdHJpbmcuZXNjYXBlXCIsIFwic3RyaW5nXCJdXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nLmludmFsaWRcIl1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwiXCJdLFxuICAgICAgWy9cXC9cXCpcXCooPyFcXC8pLywgXCJjb21tZW50LmRvY1wiLCBcIkBhcGV4ZG9jXCJdLFxuICAgICAgWy9cXC9cXCovLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwvLiokLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1teXFwvKl0rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXFwvKl0vLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIGFwZXhkb2M6IFtcbiAgICAgIFsvW15cXC8qXSsvLCBcImNvbW1lbnQuZG9jXCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnQuZG9jXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW1xcLypdLywgXCJjb21tZW50LmRvY1wiXVxuICAgIF0sXG4gICAgc3RyaW5nOiBbXG4gICAgICBbL1teXFxcXFwiJ10rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgW1xuICAgICAgICAvW1wiJ10vLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiJCM9PSRTMlwiOiB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUcsSUFBQyxPQUFPO0FBQUEsRUFDVCxhQUFhO0FBQUEsRUFDYixVQUFVO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixjQUFjLENBQUMsTUFBTSxJQUFJO0FBQUEsRUFDMUI7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxFQUNWO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFBQSxFQUNELFNBQVM7QUFBQSxJQUNQLFNBQVM7QUFBQSxNQUNQLE9BQU8sSUFBSSxPQUFPLG9EQUFvRDtBQUFBLE1BQ3RFLEtBQUssSUFBSSxPQUFPLHNEQUFzRDtBQUFBLElBQ3ZFO0FBQUEsRUFDRjtBQUNIO0FBQ0EsSUFBSSxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FB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
