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
    ["(", ")"],
    ["<", ">"]
  ],
  autoClosingPairs: [
    { open: '"', close: '"', notIn: ["string", "comment"] },
    { open: "{", close: "}", notIn: ["string", "comment"] },
    { open: "[", close: "]", notIn: ["string", "comment"] },
    { open: "(", close: ")", notIn: ["string", "comment"] }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".aes",
  brackets: [
    { token: "delimiter.curly", open: "{", close: "}" },
    { token: "delimiter.parenthesis", open: "(", close: ")" },
    { token: "delimiter.square", open: "[", close: "]" },
    { token: "delimiter.angle", open: "<", close: ">" }
  ],
  keywords: [
    "contract",
    "library",
    "entrypoint",
    "function",
    "stateful",
    "state",
    "hash",
    "signature",
    "tuple",
    "list",
    "address",
    "string",
    "bool",
    "int",
    "record",
    "datatype",
    "type",
    "option",
    "oracle",
    "oracle_query",
    "Call",
    "Bits",
    "Bytes",
    "Oracle",
    "String",
    "Crypto",
    "Address",
    "Auth",
    "Chain",
    "None",
    "Some",
    "bits",
    "bytes",
    "event",
    "let",
    "map",
    "private",
    "public",
    "true",
    "false",
    "var",
    "if",
    "else",
    "throw"
  ],
  operators: [
    "=",
    ">",
    "<",
    "!",
    "~",
    "?",
    "::",
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
  integersuffix: /(ll|LL|u|U|l|L)?(ll|LL|u|U|l|L)?/,
  floatsuffix: /[fFlL]?/,
  tokenizer: {
    root: [
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@default": "identifier"
          }
        }
      ],
      { include: "@whitespace" },
      [/\[\[.*\]\]/, "annotation"],
      [/^\s*#\w+/, "keyword"],
      [/int\d*/, "keyword"],
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
      [/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, "number.float"],
      [/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, "number.float"],
      [/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, "number.hex"],
      [/0[0-7']*[0-7](@integersuffix)/, "number.octal"],
      [/0[bB][0-1']*[0-1](@integersuffix)/, "number.binary"],
      [/\d[\d']*\d(@integersuffix)/, "number"],
      [/\d(@integersuffix)/, "number"],
      [/[;,.]/, "delimiter"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string"],
      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@doccomment"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    doccomment: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"]
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29waGlhLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL3NvcGhpYS9zb3BoaWEuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3NvcGhpYS9zb3BoaWEudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi8vXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCIvKlwiLCBcIiovXCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl0sXG4gICAgW1wiPFwiLCBcIj5cIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH0sXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH1cbiAgXVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiLmFlc1wiLFxuICBicmFja2V0czogW1xuICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmN1cmx5XCIsIG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiLCBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIsIG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5hbmdsZVwiLCBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiIH1cbiAgXSxcbiAga2V5d29yZHM6IFtcbiAgICBcImNvbnRyYWN0XCIsXG4gICAgXCJsaWJyYXJ5XCIsXG4gICAgXCJlbnRyeXBvaW50XCIsXG4gICAgXCJmdW5jdGlvblwiLFxuICAgIFwic3RhdGVmdWxcIixcbiAgICBcInN0YXRlXCIsXG4gICAgXCJoYXNoXCIsXG4gICAgXCJzaWduYXR1cmVcIixcbiAgICBcInR1cGxlXCIsXG4gICAgXCJsaXN0XCIsXG4gICAgXCJhZGRyZXNzXCIsXG4gICAgXCJzdHJpbmdcIixcbiAgICBcImJvb2xcIixcbiAgICBcImludFwiLFxuICAgIFwicmVjb3JkXCIsXG4gICAgXCJkYXRhdHlwZVwiLFxuICAgIFwidHlwZVwiLFxuICAgIFwib3B0aW9uXCIsXG4gICAgXCJvcmFjbGVcIixcbiAgICBcIm9yYWNsZV9xdWVyeVwiLFxuICAgIFwiQ2FsbFwiLFxuICAgIFwiQml0c1wiLFxuICAgIFwiQnl0ZXNcIixcbiAgICBcIk9yYWNsZVwiLFxuICAgIFwiU3RyaW5nXCIsXG4gICAgXCJDcnlwdG9cIixcbiAgICBcIkFkZHJlc3NcIixcbiAgICBcIkF1dGhcIixcbiAgICBcIkNoYWluXCIsXG4gICAgXCJOb25lXCIsXG4gICAgXCJTb21lXCIsXG4gICAgXCJiaXRzXCIsXG4gICAgXCJieXRlc1wiLFxuICAgIFwiZXZlbnRcIixcbiAgICBcImxldFwiLFxuICAgIFwibWFwXCIsXG4gICAgXCJwcml2YXRlXCIsXG4gICAgXCJwdWJsaWNcIixcbiAgICBcInRydWVcIixcbiAgICBcImZhbHNlXCIsXG4gICAgXCJ2YXJcIixcbiAgICBcImlmXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJ0aHJvd1wiXG4gIF0sXG4gIG9wZXJhdG9yczogW1xuICAgIFwiPVwiLFxuICAgIFwiPlwiLFxuICAgIFwiPFwiLFxuICAgIFwiIVwiLFxuICAgIFwiflwiLFxuICAgIFwiP1wiLFxuICAgIFwiOjpcIixcbiAgICBcIjpcIixcbiAgICBcIj09XCIsXG4gICAgXCI8PVwiLFxuICAgIFwiPj1cIixcbiAgICBcIiE9XCIsXG4gICAgXCImJlwiLFxuICAgIFwifHxcIixcbiAgICBcIisrXCIsXG4gICAgXCItLVwiLFxuICAgIFwiK1wiLFxuICAgIFwiLVwiLFxuICAgIFwiKlwiLFxuICAgIFwiL1wiLFxuICAgIFwiJlwiLFxuICAgIFwifFwiLFxuICAgIFwiXlwiLFxuICAgIFwiJVwiLFxuICAgIFwiPDxcIixcbiAgICBcIj4+XCIsXG4gICAgXCI+Pj5cIixcbiAgICBcIis9XCIsXG4gICAgXCItPVwiLFxuICAgIFwiKj1cIixcbiAgICBcIi89XCIsXG4gICAgXCImPVwiLFxuICAgIFwifD1cIixcbiAgICBcIl49XCIsXG4gICAgXCIlPVwiLFxuICAgIFwiPDw9XCIsXG4gICAgXCI+Pj1cIixcbiAgICBcIj4+Pj1cIlxuICBdLFxuICBzeW1ib2xzOiAvWz0+PCF+PzomfCtcXC0qXFwvXFxeJV0rLyxcbiAgZXNjYXBlczogL1xcXFwoPzpbYWJmbnJ0dlxcXFxcIiddfHhbMC05QS1GYS1mXXsxLDR9fHVbMC05QS1GYS1mXXs0fXxVWzAtOUEtRmEtZl17OH0pLyxcbiAgaW50ZWdlcnN1ZmZpeDogLyhsbHxMTHx1fFV8bHxMKT8obGx8TEx8dXxVfGx8TCk/LyxcbiAgZmxvYXRzdWZmaXg6IC9bZkZsTF0/LyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgW1xuICAgICAgICAvW2EtekEtWl9dXFx3Ki8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogeyB0b2tlbjogXCJrZXl3b3JkLiQwXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJpZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy9cXFtcXFsuKlxcXVxcXS8sIFwiYW5ub3RhdGlvblwiXSxcbiAgICAgIFsvXlxccyojXFx3Ky8sIFwia2V5d29yZFwiXSxcbiAgICAgIFsvaW50XFxkKi8sIFwia2V5d29yZFwiXSxcbiAgICAgIFsvW3t9KClcXFtcXF1dLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbL1s8Pl0oPyFAc3ltYm9scykvLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFtcbiAgICAgICAgL0BzeW1ib2xzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBvcGVyYXRvcnNcIjogXCJkZWxpbWl0ZXJcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXFxkKlxcZCtbZUVdKFtcXC0rXT9cXGQrKT8oQGZsb2F0c3VmZml4KS8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy9cXGQqXFwuXFxkKyhbZUVdW1xcLStdP1xcZCspPyhAZmxvYXRzdWZmaXgpLywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbLzBbeFhdWzAtOWEtZkEtRiddKlswLTlhLWZBLUZdKEBpbnRlZ2Vyc3VmZml4KS8sIFwibnVtYmVyLmhleFwiXSxcbiAgICAgIFsvMFswLTcnXSpbMC03XShAaW50ZWdlcnN1ZmZpeCkvLCBcIm51bWJlci5vY3RhbFwiXSxcbiAgICAgIFsvMFtiQl1bMC0xJ10qWzAtMV0oQGludGVnZXJzdWZmaXgpLywgXCJudW1iZXIuYmluYXJ5XCJdLFxuICAgICAgWy9cXGRbXFxkJ10qXFxkKEBpbnRlZ2Vyc3VmZml4KS8sIFwibnVtYmVyXCJdLFxuICAgICAgWy9cXGQoQGludGVnZXJzdWZmaXgpLywgXCJudW1iZXJcIl0sXG4gICAgICBbL1s7LC5dLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1wiKFteXCJcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgXCJAc3RyaW5nXCJdLFxuICAgICAgWy8nW15cXFxcJ10nLywgXCJzdHJpbmdcIl0sXG4gICAgICBbLygnKShAZXNjYXBlcykoJykvLCBbXCJzdHJpbmdcIiwgXCJzdHJpbmcuZXNjYXBlXCIsIFwic3RyaW5nXCJdXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nLmludmFsaWRcIl1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwiXCJdLFxuICAgICAgWy9cXC9cXCpcXCooPyFcXC8pLywgXCJjb21tZW50LmRvY1wiLCBcIkBkb2Njb21tZW50XCJdLFxuICAgICAgWy9cXC9cXCovLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwvLiokLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1teXFwvKl0rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXFwvKl0vLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIGRvY2NvbW1lbnQ6IFtcbiAgICAgIFsvW15cXC8qXSsvLCBcImNvbW1lbnQuZG9jXCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnQuZG9jXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW1xcLypdLywgXCJjb21tZW50LmRvY1wiXVxuICAgIF0sXG4gICAgc3RyaW5nOiBbXG4gICAgICBbL1teXFxcXFwiXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgXCJAcG9wXCJdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUcsSUFBQyxPQUFPO0FBQUEsRUFDVCxVQUFVO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixjQUFjLENBQUMsTUFBTSxJQUFJO0FBQUEsRUFDMUI7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsRUFDVjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sQ0FBQyxVQUFVLFNBQVMsRUFBRztBQUFBLElBQ3ZELEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsVUFBVSxTQUFTLEVBQUc7QUFBQSxJQUN2RCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFVB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
