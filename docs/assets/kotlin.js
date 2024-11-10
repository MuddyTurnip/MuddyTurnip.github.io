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
  tokenPostfix: ".kt",
  keywords: [
    "as",
    "as?",
    "break",
    "class",
    "continue",
    "do",
    "else",
    "false",
    "for",
    "fun",
    "if",
    "in",
    "!in",
    "interface",
    "is",
    "!is",
    "null",
    "object",
    "package",
    "return",
    "super",
    "this",
    "throw",
    "true",
    "try",
    "typealias",
    "val",
    "var",
    "when",
    "while",
    "by",
    "catch",
    "constructor",
    "delegate",
    "dynamic",
    "field",
    "file",
    "finally",
    "get",
    "import",
    "init",
    "param",
    "property",
    "receiver",
    "set",
    "setparam",
    "where",
    "actual",
    "abstract",
    "annotation",
    "companion",
    "const",
    "crossinline",
    "data",
    "enum",
    "expect",
    "external",
    "final",
    "infix",
    "inline",
    "inner",
    "internal",
    "lateinit",
    "noinline",
    "open",
    "operator",
    "out",
    "override",
    "private",
    "protected",
    "public",
    "reified",
    "sealed",
    "suspend",
    "tailrec",
    "vararg",
    "field",
    "it"
  ],
  operators: [
    "+",
    "-",
    "*",
    "/",
    "%",
    "=",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "++",
    "--",
    "&&",
    "||",
    "!",
    "==",
    "!=",
    "===",
    "!==",
    ">",
    "<",
    "<=",
    ">=",
    "[",
    "]",
    "!!",
    "?.",
    "?:",
    "::",
    "..",
    ":",
    "?",
    "->",
    "@",
    ";",
    "$",
    "_"
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  tokenizer: {
    root: [
      [/[A-Z][\w\$]*/, "type.identifier"],
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
      [/\/\*/, "comment", "@comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    javadoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\/\*/, "comment.doc", "@push"],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia290bGluLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2tvdGxpbi9rb3RsaW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2tvdGxpbi9rb3RsaW4udHNcbnZhciBjb25mID0ge1xuICB3b3JkUGF0dGVybjogLygtP1xcZCpcXC5cXGRcXHcqKXwoW15cXGBcXH5cXCFcXCNcXCVcXF5cXCZcXCpcXChcXClcXC1cXD1cXCtcXFtcXHtcXF1cXH1cXFxcXFx8XFw7XFw6XFwnXFxcIlxcLFxcLlxcPFxcPlxcL1xcP1xcc10rKS9nLFxuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi8vXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCIvKlwiLCBcIiovXCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9LFxuICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiB9XG4gIF0sXG4gIGZvbGRpbmc6IHtcbiAgICBtYXJrZXJzOiB7XG4gICAgICBzdGFydDogbmV3IFJlZ0V4cChcIl5cXFxccyovL1xcXFxzKig/Oig/OiM/cmVnaW9uXFxcXGIpfCg/OjxlZGl0b3ItZm9sZFxcXFxiKSlcIiksXG4gICAgICBlbmQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqLy9cXFxccyooPzooPzojP2VuZHJlZ2lvblxcXFxiKXwoPzo8L2VkaXRvci1mb2xkPikpXCIpXG4gICAgfVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCIua3RcIixcbiAga2V5d29yZHM6IFtcbiAgICBcImFzXCIsXG4gICAgXCJhcz9cIixcbiAgICBcImJyZWFrXCIsXG4gICAgXCJjbGFzc1wiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcImRvXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJmdW5cIixcbiAgICBcImlmXCIsXG4gICAgXCJpblwiLFxuICAgIFwiIWluXCIsXG4gICAgXCJpbnRlcmZhY2VcIixcbiAgICBcImlzXCIsXG4gICAgXCIhaXNcIixcbiAgICBcIm51bGxcIixcbiAgICBcIm9iamVjdFwiLFxuICAgIFwicGFja2FnZVwiLFxuICAgIFwicmV0dXJuXCIsXG4gICAgXCJzdXBlclwiLFxuICAgIFwidGhpc1wiLFxuICAgIFwidGhyb3dcIixcbiAgICBcInRydWVcIixcbiAgICBcInRyeVwiLFxuICAgIFwidHlwZWFsaWFzXCIsXG4gICAgXCJ2YWxcIixcbiAgICBcInZhclwiLFxuICAgIFwid2hlblwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcImJ5XCIsXG4gICAgXCJjYXRjaFwiLFxuICAgIFwiY29uc3RydWN0b3JcIixcbiAgICBcImRlbGVnYXRlXCIsXG4gICAgXCJkeW5hbWljXCIsXG4gICAgXCJmaWVsZFwiLFxuICAgIFwiZmlsZVwiLFxuICAgIFwiZmluYWxseVwiLFxuICAgIFwiZ2V0XCIsXG4gICAgXCJpbXBvcnRcIixcbiAgICBcImluaXRcIixcbiAgICBcInBhcmFtXCIsXG4gICAgXCJwcm9wZXJ0eVwiLFxuICAgIFwicmVjZWl2ZXJcIixcbiAgICBcInNldFwiLFxuICAgIFwic2V0cGFyYW1cIixcbiAgICBcIndoZXJlXCIsXG4gICAgXCJhY3R1YWxcIixcbiAgICBcImFic3RyYWN0XCIsXG4gICAgXCJhbm5vdGF0aW9uXCIsXG4gICAgXCJjb21wYW5pb25cIixcbiAgICBcImNvbnN0XCIsXG4gICAgXCJjcm9zc2lubGluZVwiLFxuICAgIFwiZGF0YVwiLFxuICAgIFwiZW51bVwiLFxuICAgIFwiZXhwZWN0XCIsXG4gICAgXCJleHRlcm5hbFwiLFxuICAgIFwiZmluYWxcIixcbiAgICBcImluZml4XCIsXG4gICAgXCJpbmxpbmVcIixcbiAgICBcImlubmVyXCIsXG4gICAgXCJpbnRlcm5hbFwiLFxuICAgIFwibGF0ZWluaXRcIixcbiAgICBcIm5vaW5saW5lXCIsXG4gICAgXCJvcGVuXCIsXG4gICAgXCJvcGVyYXRvclwiLFxuICAgIFwib3V0XCIsXG4gICAgXCJvdmVycmlkZVwiLFxuICAgIFwicHJpdmF0ZVwiLFxuICAgIFwicHJvdGVjdGVkXCIsXG4gICAgXCJwdWJsaWNcIixcbiAgICBcInJlaWZpZWRcIixcbiAgICBcInNlYWxlZFwiLFxuICAgIFwic3VzcGVuZFwiLFxuICAgIFwidGFpbHJlY1wiLFxuICAgIFwidmFyYXJnXCIsXG4gICAgXCJmaWVsZFwiLFxuICAgIFwiaXRcIlxuICBdLFxuICBvcGVyYXRvcnM6IFtcbiAgICBcIitcIixcbiAgICBcIi1cIixcbiAgICBcIipcIixcbiAgICBcIi9cIixcbiAgICBcIiVcIixcbiAgICBcIj1cIixcbiAgICBcIis9XCIsXG4gICAgXCItPVwiLFxuICAgIFwiKj1cIixcbiAgICBcIi89XCIsXG4gICAgXCIlPVwiLFxuICAgIFwiKytcIixcbiAgICBcIi0tXCIsXG4gICAgXCImJlwiLFxuICAgIFwifHxcIixcbiAgICBcIiFcIixcbiAgICBcIj09XCIsXG4gICAgXCIhPVwiLFxuICAgIFwiPT09XCIsXG4gICAgXCIhPT1cIixcbiAgICBcIj5cIixcbiAgICBcIjxcIixcbiAgICBcIjw9XCIsXG4gICAgXCI+PVwiLFxuICAgIFwiW1wiLFxuICAgIFwiXVwiLFxuICAgIFwiISFcIixcbiAgICBcIj8uXCIsXG4gICAgXCI/OlwiLFxuICAgIFwiOjpcIixcbiAgICBcIi4uXCIsXG4gICAgXCI6XCIsXG4gICAgXCI/XCIsXG4gICAgXCItPlwiLFxuICAgIFwiQFwiLFxuICAgIFwiO1wiLFxuICAgIFwiJFwiLFxuICAgIFwiX1wiXG4gIF0sXG4gIHN5bWJvbHM6IC9bPT48IX4/OiZ8K1xcLSpcXC9cXF4lXSsvLFxuICBlc2NhcGVzOiAvXFxcXCg/OlthYmZucnR2XFxcXFwiJ118eFswLTlBLUZhLWZdezEsNH18dVswLTlBLUZhLWZdezR9fFVbMC05QS1GYS1mXXs4fSkvLFxuICBkaWdpdHM6IC9cXGQrKF8rXFxkKykqLyxcbiAgb2N0YWxkaWdpdHM6IC9bMC03XSsoXytbMC03XSspKi8sXG4gIGJpbmFyeWRpZ2l0czogL1swLTFdKyhfK1swLTFdKykqLyxcbiAgaGV4ZGlnaXRzOiAvW1swLTlhLWZBLUZdKyhfK1swLTlhLWZBLUZdKykqLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy9bQS1aXVtcXHdcXCRdKi8sIFwidHlwZS5pZGVudGlmaWVyXCJdLFxuICAgICAgW1xuICAgICAgICAvW2EtekEtWl8kXVtcXHckXSovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZC4kMFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIFsvW3t9KClcXFtcXF1dLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbL1s8Pl0oPyFAc3ltYm9scykvLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFtcbiAgICAgICAgL0BzeW1ib2xzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBvcGVyYXRvcnNcIjogXCJkZWxpbWl0ZXJcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvQFxccypbYS16QS1aX1xcJF1bXFx3XFwkXSovLCBcImFubm90YXRpb25cIl0sXG4gICAgICBbLyhAZGlnaXRzKVtlRV0oW1xcLStdPyhAZGlnaXRzKSk/W2ZGZERdPy8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy8oQGRpZ2l0cylcXC4oQGRpZ2l0cykoW2VFXVtcXC0rXT8oQGRpZ2l0cykpP1tmRmREXT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvMFt4WF0oQGhleGRpZ2l0cylbTGxdPy8sIFwibnVtYmVyLmhleFwiXSxcbiAgICAgIFsvMChAb2N0YWxkaWdpdHMpW0xsXT8vLCBcIm51bWJlci5vY3RhbFwiXSxcbiAgICAgIFsvMFtiQl0oQGJpbmFyeWRpZ2l0cylbTGxdPy8sIFwibnVtYmVyLmJpbmFyeVwiXSxcbiAgICAgIFsvKEBkaWdpdHMpW2ZGZERdLywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbLyhAZGlnaXRzKVtsTF0/LywgXCJudW1iZXJcIl0sXG4gICAgICBbL1s7LC5dLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1wiKFteXCJcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbL1wiXCJcIi8sIFwic3RyaW5nXCIsIFwiQG11bHRpc3RyaW5nXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nXCIsIFwiQHN0cmluZ1wiXSxcbiAgICAgIFsvJ1teXFxcXCddJy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy8oJykoQGVzY2FwZXMpKCcpLywgW1wic3RyaW5nXCIsIFwic3RyaW5nLmVzY2FwZVwiLCBcInN0cmluZ1wiXV0sXG4gICAgICBbLycvLCBcInN0cmluZy5pbnZhbGlkXCJdXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIlwiXSxcbiAgICAgIFsvXFwvXFwqXFwqKD8hXFwvKS8sIFwiY29tbWVudC5kb2NcIiwgXCJAamF2YWRvY1wiXSxcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50XCIsIFwiQGNvbW1lbnRcIl0sXG4gICAgICBbL1xcL1xcLy4qJC8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXlxcLypdKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50XCIsIFwiQGNvbW1lbnRcIl0sXG4gICAgICBbL1xcKlxcLy8sIFwiY29tbWVudFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1tcXC8qXS8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgamF2YWRvYzogW1xuICAgICAgWy9bXlxcLypdKy8sIFwiY29tbWVudC5kb2NcIl0sXG4gICAgICBbL1xcL1xcKi8sIFwiY29tbWVudC5kb2NcIiwgXCJAcHVzaFwiXSxcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50LmRvYy5pbnZhbGlkXCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnQuZG9jXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW1xcLypdLywgXCJjb21tZW50LmRvY1wiXVxuICAgIF0sXG4gICAgc3RyaW5nOiBbXG4gICAgICBbL1teXFxcXFwiXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBtdWx0aXN0cmluZzogW1xuICAgICAgWy9bXlxcXFxcIl0rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgWy9cIlwiXCIvLCBcInN0cmluZ1wiLCBcIkBwb3BcIl0sXG4gICAgICBbLy4vLCBcInN0cmluZ1wiXVxuICAgIF1cbiAgfVxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFHLElBQUMsT0FBTztBQUFBLEVBQ1QsYUFBYTtBQUFBLEVBQ2IsVUFBVTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsY0FBYyxDQUFDLE1BQU0sSUFBSTtBQUFBLEVBQzFCO0FBQUEsRUFDRCxVQUFVO0FBQUEsSUFDUixDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsRUFDVjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFCO0FBQUEsRUFDRCxTQUFTO0FBQUEsSUFDUCxTQUFTO0FBQUEsTUFDUCxPQUFPLElBQUksT0FBTyxvREFBb0Q7QUFBQSxNQUN0RSxLQUFLLElBQUksT0FBTyxzREFBc0Q7QUFBQSxJQUN2RTtBQUFBLEVBQ0Y7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsVUFBVTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELFdBQVc7QUFBQSxJQUNUO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFB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
