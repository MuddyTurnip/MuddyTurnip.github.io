/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
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
    { open: '"', close: '"', notIn: ["string", "comment"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "<", close: ">" },
    { open: "'", close: "'" },
    { open: '"', close: '"' }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*#region\\b"),
      end: new RegExp("^\\s*#endregion\\b")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".cs",
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "<", close: ">", token: "delimiter.angle" }
  ],
  keywords: [
    "extern",
    "alias",
    "using",
    "bool",
    "decimal",
    "sbyte",
    "byte",
    "short",
    "ushort",
    "int",
    "uint",
    "long",
    "ulong",
    "char",
    "float",
    "double",
    "object",
    "dynamic",
    "string",
    "assembly",
    "is",
    "as",
    "ref",
    "out",
    "this",
    "base",
    "new",
    "typeof",
    "void",
    "checked",
    "unchecked",
    "default",
    "delegate",
    "var",
    "const",
    "if",
    "else",
    "switch",
    "case",
    "while",
    "do",
    "for",
    "foreach",
    "in",
    "break",
    "continue",
    "goto",
    "return",
    "throw",
    "try",
    "catch",
    "finally",
    "lock",
    "yield",
    "from",
    "let",
    "where",
    "join",
    "on",
    "equals",
    "into",
    "orderby",
    "ascending",
    "descending",
    "select",
    "group",
    "by",
    "namespace",
    "partial",
    "class",
    "field",
    "event",
    "method",
    "param",
    "public",
    "protected",
    "internal",
    "private",
    "abstract",
    "sealed",
    "static",
    "struct",
    "readonly",
    "volatile",
    "virtual",
    "override",
    "params",
    "get",
    "set",
    "add",
    "remove",
    "operator",
    "true",
    "false",
    "implicit",
    "explicit",
    "interface",
    "enum",
    "null",
    "async",
    "await",
    "fixed",
    "sizeof",
    "stackalloc",
    "unsafe",
    "nameof",
    "when"
  ],
  namespaceFollows: ["namespace", "using"],
  parenFollows: ["if", "for", "while", "switch", "foreach", "using", "catch", "when"],
  operators: [
    "=",
    "??",
    "||",
    "&&",
    "|",
    "^",
    "&",
    "==",
    "!=",
    "<=",
    ">=",
    "<<",
    "+",
    "-",
    "*",
    "/",
    "%",
    "!",
    "~",
    "++",
    "--",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "&=",
    "|=",
    "^=",
    "<<=",
    ">>=",
    ">>",
    "=>"
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      [
        /\@?[a-zA-Z_]\w*/,
        {
          cases: {
            "@namespaceFollows": {
              token: "keyword.$0",
              next: "@namespace"
            },
            "@keywords": {
              token: "keyword.$0",
              next: "@qualified"
            },
            "@default": { token: "identifier", next: "@qualified" }
          }
        }
      ],
      { include: "@whitespace" },
      [
        /}/,
        {
          cases: {
            "$S2==interpolatedstring": {
              token: "string.quote",
              next: "@pop"
            },
            "$S2==litinterpstring": {
              token: "string.quote",
              next: "@pop"
            },
            "@default": "@brackets"
          }
        }
      ],
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
      [/[0-9_]*\.[0-9_]+([eE][\-+]?\d+)?[fFdD]?/, "number.float"],
      [/0[xX][0-9a-fA-F_]+/, "number.hex"],
      [/0[bB][01_]+/, "number.hex"],
      [/[0-9_]+/, "number"],
      [/[;,.]/, "delimiter"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, { token: "string.quote", next: "@string" }],
      [/\$\@"/, { token: "string.quote", next: "@litinterpstring" }],
      [/\@"/, { token: "string.quote", next: "@litstring" }],
      [/\$"/, { token: "string.quote", next: "@interpolatedstring" }],
      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"]
    ],
    qualified: [
      [
        /[a-zA-Z_][\w]*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@default": "identifier"
          }
        }
      ],
      [/\./, "delimiter"],
      ["", "", "@pop"]
    ],
    namespace: [
      { include: "@whitespace" },
      [/[A-Z]\w*/, "namespace"],
      [/[\.=]/, "delimiter"],
      ["", "", "@pop"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      ["\\*/", "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", next: "@pop" }]
    ],
    litstring: [
      [/[^"]+/, "string"],
      [/""/, "string.escape"],
      [/"/, { token: "string.quote", next: "@pop" }]
    ],
    litinterpstring: [
      [/[^"{]+/, "string"],
      [/""/, "string.escape"],
      [/{{/, "string.escape"],
      [/}}/, "string.escape"],
      [/{/, { token: "string.quote", next: "root.litinterpstring" }],
      [/"/, { token: "string.quote", next: "@pop" }]
    ],
    interpolatedstring: [
      [/[^\\"{]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/{{/, "string.escape"],
      [/}}/, "string.escape"],
      [/{/, { token: "string.quote", next: "root.interpolatedstring" }],
      [/"/, { token: "string.quote", next: "@pop" }]
    ],
    whitespace: [
      [/^[ \t\v\f]*#((r)|(load))(?=\s)/, "directive.csx"],
      [/^[ \t\v\f]*#\w.*$/, "namespace.cpp"],
      [/[ \t\v\f\r\n]+/, ""],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NoYXJwLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2NzaGFycC9jc2hhcnAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2NzaGFycC9jc2hhcnAudHNcbnZhciBjb25mID0ge1xuICB3b3JkUGF0dGVybjogLygtP1xcZCpcXC5cXGRcXHcqKXwoW15cXGBcXH5cXCFcXCNcXCRcXCVcXF5cXCZcXCpcXChcXClcXC1cXD1cXCtcXFtcXHtcXF1cXH1cXFxcXFx8XFw7XFw6XFwnXFxcIlxcLFxcLlxcPFxcPlxcL1xcP1xcc10rKS9nLFxuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi8vXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCIvKlwiLCBcIiovXCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH1cbiAgXSxcbiAgZm9sZGluZzoge1xuICAgIG1hcmtlcnM6IHtcbiAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKFwiXlxcXFxzKiNyZWdpb25cXFxcYlwiKSxcbiAgICAgIGVuZDogbmV3IFJlZ0V4cChcIl5cXFxccyojZW5kcmVnaW9uXFxcXGJcIilcbiAgICB9XG4gIH1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5jc1wiLFxuICBicmFja2V0czogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmN1cmx5XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIsIHRva2VuOiBcImRlbGltaXRlci5zcXVhcmVcIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIsIHRva2VuOiBcImRlbGltaXRlci5hbmdsZVwiIH1cbiAgXSxcbiAga2V5d29yZHM6IFtcbiAgICBcImV4dGVyblwiLFxuICAgIFwiYWxpYXNcIixcbiAgICBcInVzaW5nXCIsXG4gICAgXCJib29sXCIsXG4gICAgXCJkZWNpbWFsXCIsXG4gICAgXCJzYnl0ZVwiLFxuICAgIFwiYnl0ZVwiLFxuICAgIFwic2hvcnRcIixcbiAgICBcInVzaG9ydFwiLFxuICAgIFwiaW50XCIsXG4gICAgXCJ1aW50XCIsXG4gICAgXCJsb25nXCIsXG4gICAgXCJ1bG9uZ1wiLFxuICAgIFwiY2hhclwiLFxuICAgIFwiZmxvYXRcIixcbiAgICBcImRvdWJsZVwiLFxuICAgIFwib2JqZWN0XCIsXG4gICAgXCJkeW5hbWljXCIsXG4gICAgXCJzdHJpbmdcIixcbiAgICBcImFzc2VtYmx5XCIsXG4gICAgXCJpc1wiLFxuICAgIFwiYXNcIixcbiAgICBcInJlZlwiLFxuICAgIFwib3V0XCIsXG4gICAgXCJ0aGlzXCIsXG4gICAgXCJiYXNlXCIsXG4gICAgXCJuZXdcIixcbiAgICBcInR5cGVvZlwiLFxuICAgIFwidm9pZFwiLFxuICAgIFwiY2hlY2tlZFwiLFxuICAgIFwidW5jaGVja2VkXCIsXG4gICAgXCJkZWZhdWx0XCIsXG4gICAgXCJkZWxlZ2F0ZVwiLFxuICAgIFwidmFyXCIsXG4gICAgXCJjb25zdFwiLFxuICAgIFwiaWZcIixcbiAgICBcImVsc2VcIixcbiAgICBcInN3aXRjaFwiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcImRvXCIsXG4gICAgXCJmb3JcIixcbiAgICBcImZvcmVhY2hcIixcbiAgICBcImluXCIsXG4gICAgXCJicmVha1wiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcImdvdG9cIixcbiAgICBcInJldHVyblwiLFxuICAgIFwidGhyb3dcIixcbiAgICBcInRyeVwiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImZpbmFsbHlcIixcbiAgICBcImxvY2tcIixcbiAgICBcInlpZWxkXCIsXG4gICAgXCJmcm9tXCIsXG4gICAgXCJsZXRcIixcbiAgICBcIndoZXJlXCIsXG4gICAgXCJqb2luXCIsXG4gICAgXCJvblwiLFxuICAgIFwiZXF1YWxzXCIsXG4gICAgXCJpbnRvXCIsXG4gICAgXCJvcmRlcmJ5XCIsXG4gICAgXCJhc2NlbmRpbmdcIixcbiAgICBcImRlc2NlbmRpbmdcIixcbiAgICBcInNlbGVjdFwiLFxuICAgIFwiZ3JvdXBcIixcbiAgICBcImJ5XCIsXG4gICAgXCJuYW1lc3BhY2VcIixcbiAgICBcInBhcnRpYWxcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJmaWVsZFwiLFxuICAgIFwiZXZlbnRcIixcbiAgICBcIm1ldGhvZFwiLFxuICAgIFwicGFyYW1cIixcbiAgICBcInB1YmxpY1wiLFxuICAgIFwicHJvdGVjdGVkXCIsXG4gICAgXCJpbnRlcm5hbFwiLFxuICAgIFwicHJpdmF0ZVwiLFxuICAgIFwiYWJzdHJhY3RcIixcbiAgICBcInNlYWxlZFwiLFxuICAgIFwic3RhdGljXCIsXG4gICAgXCJzdHJ1Y3RcIixcbiAgICBcInJlYWRvbmx5XCIsXG4gICAgXCJ2b2xhdGlsZVwiLFxuICAgIFwidmlydHVhbFwiLFxuICAgIFwib3ZlcnJpZGVcIixcbiAgICBcInBhcmFtc1wiLFxuICAgIFwiZ2V0XCIsXG4gICAgXCJzZXRcIixcbiAgICBcImFkZFwiLFxuICAgIFwicmVtb3ZlXCIsXG4gICAgXCJvcGVyYXRvclwiLFxuICAgIFwidHJ1ZVwiLFxuICAgIFwiZmFsc2VcIixcbiAgICBcImltcGxpY2l0XCIsXG4gICAgXCJleHBsaWNpdFwiLFxuICAgIFwiaW50ZXJmYWNlXCIsXG4gICAgXCJlbnVtXCIsXG4gICAgXCJudWxsXCIsXG4gICAgXCJhc3luY1wiLFxuICAgIFwiYXdhaXRcIixcbiAgICBcImZpeGVkXCIsXG4gICAgXCJzaXplb2ZcIixcbiAgICBcInN0YWNrYWxsb2NcIixcbiAgICBcInVuc2FmZVwiLFxuICAgIFwibmFtZW9mXCIsXG4gICAgXCJ3aGVuXCJcbiAgXSxcbiAgbmFtZXNwYWNlRm9sbG93czogW1wibmFtZXNwYWNlXCIsIFwidXNpbmdcIl0sXG4gIHBhcmVuRm9sbG93czogW1wiaWZcIiwgXCJmb3JcIiwgXCJ3aGlsZVwiLCBcInN3aXRjaFwiLCBcImZvcmVhY2hcIiwgXCJ1c2luZ1wiLCBcImNhdGNoXCIsIFwid2hlblwiXSxcbiAgb3BlcmF0b3JzOiBbXG4gICAgXCI9XCIsXG4gICAgXCI/P1wiLFxuICAgIFwifHxcIixcbiAgICBcIiYmXCIsXG4gICAgXCJ8XCIsXG4gICAgXCJeXCIsXG4gICAgXCImXCIsXG4gICAgXCI9PVwiLFxuICAgIFwiIT1cIixcbiAgICBcIjw9XCIsXG4gICAgXCI+PVwiLFxuICAgIFwiPDxcIixcbiAgICBcIitcIixcbiAgICBcIi1cIixcbiAgICBcIipcIixcbiAgICBcIi9cIixcbiAgICBcIiVcIixcbiAgICBcIiFcIixcbiAgICBcIn5cIixcbiAgICBcIisrXCIsXG4gICAgXCItLVwiLFxuICAgIFwiKz1cIixcbiAgICBcIi09XCIsXG4gICAgXCIqPVwiLFxuICAgIFwiLz1cIixcbiAgICBcIiU9XCIsXG4gICAgXCImPVwiLFxuICAgIFwifD1cIixcbiAgICBcIl49XCIsXG4gICAgXCI8PD1cIixcbiAgICBcIj4+PVwiLFxuICAgIFwiPj5cIixcbiAgICBcIj0+XCJcbiAgXSxcbiAgc3ltYm9sczogL1s9Pjwhfj86JnwrXFwtKlxcL1xcXiVdKy8sXG4gIGVzY2FwZXM6IC9cXFxcKD86W2FiZm5ydHZcXFxcXCInXXx4WzAtOUEtRmEtZl17MSw0fXx1WzAtOUEtRmEtZl17NH18VVswLTlBLUZhLWZdezh9KS8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIFtcbiAgICAgICAgL1xcQD9bYS16QS1aX11cXHcqLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBuYW1lc3BhY2VGb2xsb3dzXCI6IHtcbiAgICAgICAgICAgICAgdG9rZW46IFwia2V5d29yZC4kMFwiLFxuICAgICAgICAgICAgICBuZXh0OiBcIkBuYW1lc3BhY2VcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHtcbiAgICAgICAgICAgICAgdG9rZW46IFwia2V5d29yZC4kMFwiLFxuICAgICAgICAgICAgICBuZXh0OiBcIkBxdWFsaWZpZWRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJpZGVudGlmaWVyXCIsIG5leHQ6IFwiQHF1YWxpZmllZFwiIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgW1xuICAgICAgICAvfS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCIkUzI9PWludGVycG9sYXRlZHN0cmluZ1wiOiB7XG4gICAgICAgICAgICAgIHRva2VuOiBcInN0cmluZy5xdW90ZVwiLFxuICAgICAgICAgICAgICBuZXh0OiBcIkBwb3BcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJFMyPT1saXRpbnRlcnBzdHJpbmdcIjoge1xuICAgICAgICAgICAgICB0b2tlbjogXCJzdHJpbmcucXVvdGVcIixcbiAgICAgICAgICAgICAgbmV4dDogXCJAcG9wXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiQGJyYWNrZXRzXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9bPD5dKD8hQHN5bWJvbHMpLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbXG4gICAgICAgIC9Ac3ltYm9scy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAb3BlcmF0b3JzXCI6IFwiZGVsaW1pdGVyXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1swLTlfXSpcXC5bMC05X10rKFtlRV1bXFwtK10/XFxkKyk/W2ZGZERdPy8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy8wW3hYXVswLTlhLWZBLUZfXSsvLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbLzBbYkJdWzAxX10rLywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgWy9bMC05X10rLywgXCJudW1iZXJcIl0sXG4gICAgICBbL1s7LC5dLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1wiKFteXCJcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgbmV4dDogXCJAc3RyaW5nXCIgfV0sXG4gICAgICBbL1xcJFxcQFwiLywgeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgbmV4dDogXCJAbGl0aW50ZXJwc3RyaW5nXCIgfV0sXG4gICAgICBbL1xcQFwiLywgeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgbmV4dDogXCJAbGl0c3RyaW5nXCIgfV0sXG4gICAgICBbL1xcJFwiLywgeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgbmV4dDogXCJAaW50ZXJwb2xhdGVkc3RyaW5nXCIgfV0sXG4gICAgICBbLydbXlxcXFwnXScvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvKCcpKEBlc2NhcGVzKSgnKS8sIFtcInN0cmluZ1wiLCBcInN0cmluZy5lc2NhcGVcIiwgXCJzdHJpbmdcIl1dLFxuICAgICAgWy8nLywgXCJzdHJpbmcuaW52YWxpZFwiXVxuICAgIF0sXG4gICAgcXVhbGlmaWVkOiBbXG4gICAgICBbXG4gICAgICAgIC9bYS16QS1aX11bXFx3XSovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZC4kMFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9cXC4vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFtcIlwiLCBcIlwiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIG5hbWVzcGFjZTogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIFsvW0EtWl1cXHcqLywgXCJuYW1lc3BhY2VcIl0sXG4gICAgICBbL1tcXC49XS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiQHBvcFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXlxcLypdKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFtcIlxcXFwqL1wiLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXFwvKl0vLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIHN0cmluZzogW1xuICAgICAgWy9bXlxcXFxcIl0rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgWy9cIi8sIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBsaXRzdHJpbmc6IFtcbiAgICAgIFsvW15cIl0rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL1wiXCIvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1wiLywgeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIGxpdGludGVycHN0cmluZzogW1xuICAgICAgWy9bXlwie10rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL1wiXCIvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL3t7LywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy99fS8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvey8sIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIG5leHQ6IFwicm9vdC5saXRpbnRlcnBzdHJpbmdcIiB9XSxcbiAgICAgIFsvXCIvLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgaW50ZXJwb2xhdGVkc3RyaW5nOiBbXG4gICAgICBbL1teXFxcXFwie10rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgWy97ey8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvfX0vLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL3svLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBuZXh0OiBcInJvb3QuaW50ZXJwb2xhdGVkc3RyaW5nXCIgfV0sXG4gICAgICBbL1wiLywgeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIFsvXlsgXFx0XFx2XFxmXSojKChyKXwobG9hZCkpKD89XFxzKS8sIFwiZGlyZWN0aXZlLmNzeFwiXSxcbiAgICAgIFsvXlsgXFx0XFx2XFxmXSojXFx3LiokLywgXCJuYW1lc3BhY2UuY3BwXCJdLFxuICAgICAgWy9bIFxcdFxcdlxcZlxcclxcbl0rLywgXCJcIl0sXG4gICAgICBbL1xcL1xcKi8sIFwiY29tbWVudFwiLCBcIkBjb21tZW50XCJdLFxuICAgICAgWy9cXC9cXC8uKiQvLCBcImNvbW1lbnRcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULGFBQWE7QUFBQSxFQUNiLFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGNBQWMsQ0FBQyxNQUFNLElBQUk7QUFBQSxFQUMxQjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsVUFBVSxTQUFTLEVBQUc7QUFBQSxJQUN2RCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFVBQVUsU0FBUyxFQUFHO0FBQUEsRUFDeEQ7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFCO0FBQUEsRUFDRCxTQUFTO0FBQUEsSUFDUCxTQUFTO0FBQUEsTUFDUCxPQUFPLElBQUksT0FBTyxpQkFBaUI7QUFBQSxNQUNuQyxLQUFLLElBQUksT0FBTyxvQkFBb0I7QUFBQSxJQUNyQztBQUFBLEVBQ0Y7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsVUFBVTtBQUFBLElBQ1IsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sa0JBQW1CO0FBQUEsSUFDbkQsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sbUJBQW9CO0FBQUEsSUFDcEQsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sd0JBQXlCO0FBQUEsSUFDekQsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sa0JBQW1CO0FBQUEsRUFDcEQ7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELGtCQUFrQixDQUFDLGFBQWEsT0FBTztBQUFBLEVBQ3ZDLGNBQWMsQ0FBQyxNQUFNLE9BQU8sU0FBUyxVQUFVLFdBQVcsU0FBUyxTQUFTLE1BQU07QUFBQSxFQUNsRixXQUFXO0FBQUEsSUFDVDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7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
