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
    blockComment: ["{", "}"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["<", ">"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "<", close: ">" },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "<", close: ">" },
    { open: "'", close: "'" }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*\\{\\$REGION(\\s\\'.*\\')?\\}"),
      end: new RegExp("^\\s*\\{\\$ENDREGION\\}")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".pascal",
  ignoreCase: true,
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "<", close: ">", token: "delimiter.angle" }
  ],
  keywords: [
    "absolute",
    "abstract",
    "all",
    "and_then",
    "array",
    "as",
    "asm",
    "attribute",
    "begin",
    "bindable",
    "case",
    "class",
    "const",
    "contains",
    "default",
    "div",
    "else",
    "end",
    "except",
    "exports",
    "external",
    "far",
    "file",
    "finalization",
    "finally",
    "forward",
    "generic",
    "goto",
    "if",
    "implements",
    "import",
    "in",
    "index",
    "inherited",
    "initialization",
    "interrupt",
    "is",
    "label",
    "library",
    "mod",
    "module",
    "name",
    "near",
    "not",
    "object",
    "of",
    "on",
    "only",
    "operator",
    "or_else",
    "otherwise",
    "override",
    "package",
    "packed",
    "pow",
    "private",
    "program",
    "protected",
    "public",
    "published",
    "interface",
    "implementation",
    "qualified",
    "read",
    "record",
    "resident",
    "requires",
    "resourcestring",
    "restricted",
    "segment",
    "set",
    "shl",
    "shr",
    "specialize",
    "stored",
    "strict",
    "then",
    "threadvar",
    "to",
    "try",
    "type",
    "unit",
    "uses",
    "var",
    "view",
    "virtual",
    "dynamic",
    "overload",
    "reintroduce",
    "with",
    "write",
    "xor",
    "true",
    "false",
    "procedure",
    "function",
    "constructor",
    "destructor",
    "property",
    "break",
    "continue",
    "exit",
    "abort",
    "while",
    "do",
    "for",
    "raise",
    "repeat",
    "until"
  ],
  typeKeywords: [
    "boolean",
    "double",
    "byte",
    "integer",
    "shortint",
    "char",
    "longint",
    "float",
    "string"
  ],
  operators: [
    "=",
    ">",
    "<",
    "<=",
    ">=",
    "<>",
    ":",
    ":=",
    "and",
    "or",
    "+",
    "-",
    "*",
    "/",
    "@",
    "&",
    "^",
    "%"
  ],
  symbols: /[=><:@\^&|+\-*\/\^%]+/,
  tokenizer: {
    root: [
      [
        /[a-zA-Z_][\w]*/,
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
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/\$[0-9a-fA-F]{1,16}/, "number.hex"],
      [/\d+/, "number"],
      [/[;,.]/, "delimiter"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/'/, "string", "@string"],
      [/'[^\\']'/, "string"],
      [/'/, "string.invalid"],
      [/\#\d+/, "string"]
    ],
    comment: [
      [/[^\*\}]+/, "comment"],
      [/\}/, "comment", "@pop"],
      [/[\{]/, "comment"]
    ],
    string: [
      [/[^\\']+/, "string"],
      [/\\./, "string.escape.invalid"],
      [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\{/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzY2FsLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL3Bhc2NhbC9wYXNjYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3Bhc2NhbC9wYXNjYWwudHNcbnZhciBjb25mID0ge1xuICB3b3JkUGF0dGVybjogLygtP1xcZCpcXC5cXGRcXHcqKXwoW15cXGBcXH5cXCFcXCNcXCVcXF5cXCZcXCpcXChcXClcXC1cXD1cXCtcXFtcXHtcXF1cXH1cXFxcXFx8XFw7XFw6XFwnXFxcIlxcLFxcLlxcPFxcPlxcL1xcP1xcc10rKS9nLFxuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi8vXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCJ7XCIsIFwifVwiXVxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdLFxuICAgIFtcIjxcIiwgXCI+XCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH1cbiAgXSxcbiAgZm9sZGluZzoge1xuICAgIG1hcmtlcnM6IHtcbiAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKFwiXlxcXFxzKlxcXFx7XFxcXCRSRUdJT04oXFxcXHNcXFxcJy4qXFxcXCcpP1xcXFx9XCIpLFxuICAgICAgZW5kOiBuZXcgUmVnRXhwKFwiXlxcXFxzKlxcXFx7XFxcXCRFTkRSRUdJT05cXFxcfVwiKVxuICAgIH1cbiAgfVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiLnBhc2NhbFwiLFxuICBpZ25vcmVDYXNlOiB0cnVlLFxuICBicmFja2V0czogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmN1cmx5XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIsIHRva2VuOiBcImRlbGltaXRlci5zcXVhcmVcIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIsIHRva2VuOiBcImRlbGltaXRlci5hbmdsZVwiIH1cbiAgXSxcbiAga2V5d29yZHM6IFtcbiAgICBcImFic29sdXRlXCIsXG4gICAgXCJhYnN0cmFjdFwiLFxuICAgIFwiYWxsXCIsXG4gICAgXCJhbmRfdGhlblwiLFxuICAgIFwiYXJyYXlcIixcbiAgICBcImFzXCIsXG4gICAgXCJhc21cIixcbiAgICBcImF0dHJpYnV0ZVwiLFxuICAgIFwiYmVnaW5cIixcbiAgICBcImJpbmRhYmxlXCIsXG4gICAgXCJjYXNlXCIsXG4gICAgXCJjbGFzc1wiLFxuICAgIFwiY29uc3RcIixcbiAgICBcImNvbnRhaW5zXCIsXG4gICAgXCJkZWZhdWx0XCIsXG4gICAgXCJkaXZcIixcbiAgICBcImVsc2VcIixcbiAgICBcImVuZFwiLFxuICAgIFwiZXhjZXB0XCIsXG4gICAgXCJleHBvcnRzXCIsXG4gICAgXCJleHRlcm5hbFwiLFxuICAgIFwiZmFyXCIsXG4gICAgXCJmaWxlXCIsXG4gICAgXCJmaW5hbGl6YXRpb25cIixcbiAgICBcImZpbmFsbHlcIixcbiAgICBcImZvcndhcmRcIixcbiAgICBcImdlbmVyaWNcIixcbiAgICBcImdvdG9cIixcbiAgICBcImlmXCIsXG4gICAgXCJpbXBsZW1lbnRzXCIsXG4gICAgXCJpbXBvcnRcIixcbiAgICBcImluXCIsXG4gICAgXCJpbmRleFwiLFxuICAgIFwiaW5oZXJpdGVkXCIsXG4gICAgXCJpbml0aWFsaXphdGlvblwiLFxuICAgIFwiaW50ZXJydXB0XCIsXG4gICAgXCJpc1wiLFxuICAgIFwibGFiZWxcIixcbiAgICBcImxpYnJhcnlcIixcbiAgICBcIm1vZFwiLFxuICAgIFwibW9kdWxlXCIsXG4gICAgXCJuYW1lXCIsXG4gICAgXCJuZWFyXCIsXG4gICAgXCJub3RcIixcbiAgICBcIm9iamVjdFwiLFxuICAgIFwib2ZcIixcbiAgICBcIm9uXCIsXG4gICAgXCJvbmx5XCIsXG4gICAgXCJvcGVyYXRvclwiLFxuICAgIFwib3JfZWxzZVwiLFxuICAgIFwib3RoZXJ3aXNlXCIsXG4gICAgXCJvdmVycmlkZVwiLFxuICAgIFwicGFja2FnZVwiLFxuICAgIFwicGFja2VkXCIsXG4gICAgXCJwb3dcIixcbiAgICBcInByaXZhdGVcIixcbiAgICBcInByb2dyYW1cIixcbiAgICBcInByb3RlY3RlZFwiLFxuICAgIFwicHVibGljXCIsXG4gICAgXCJwdWJsaXNoZWRcIixcbiAgICBcImludGVyZmFjZVwiLFxuICAgIFwiaW1wbGVtZW50YXRpb25cIixcbiAgICBcInF1YWxpZmllZFwiLFxuICAgIFwicmVhZFwiLFxuICAgIFwicmVjb3JkXCIsXG4gICAgXCJyZXNpZGVudFwiLFxuICAgIFwicmVxdWlyZXNcIixcbiAgICBcInJlc291cmNlc3RyaW5nXCIsXG4gICAgXCJyZXN0cmljdGVkXCIsXG4gICAgXCJzZWdtZW50XCIsXG4gICAgXCJzZXRcIixcbiAgICBcInNobFwiLFxuICAgIFwic2hyXCIsXG4gICAgXCJzcGVjaWFsaXplXCIsXG4gICAgXCJzdG9yZWRcIixcbiAgICBcInN0cmljdFwiLFxuICAgIFwidGhlblwiLFxuICAgIFwidGhyZWFkdmFyXCIsXG4gICAgXCJ0b1wiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJ0eXBlXCIsXG4gICAgXCJ1bml0XCIsXG4gICAgXCJ1c2VzXCIsXG4gICAgXCJ2YXJcIixcbiAgICBcInZpZXdcIixcbiAgICBcInZpcnR1YWxcIixcbiAgICBcImR5bmFtaWNcIixcbiAgICBcIm92ZXJsb2FkXCIsXG4gICAgXCJyZWludHJvZHVjZVwiLFxuICAgIFwid2l0aFwiLFxuICAgIFwid3JpdGVcIixcbiAgICBcInhvclwiLFxuICAgIFwidHJ1ZVwiLFxuICAgIFwiZmFsc2VcIixcbiAgICBcInByb2NlZHVyZVwiLFxuICAgIFwiZnVuY3Rpb25cIixcbiAgICBcImNvbnN0cnVjdG9yXCIsXG4gICAgXCJkZXN0cnVjdG9yXCIsXG4gICAgXCJwcm9wZXJ0eVwiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImNvbnRpbnVlXCIsXG4gICAgXCJleGl0XCIsXG4gICAgXCJhYm9ydFwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcImRvXCIsXG4gICAgXCJmb3JcIixcbiAgICBcInJhaXNlXCIsXG4gICAgXCJyZXBlYXRcIixcbiAgICBcInVudGlsXCJcbiAgXSxcbiAgdHlwZUtleXdvcmRzOiBbXG4gICAgXCJib29sZWFuXCIsXG4gICAgXCJkb3VibGVcIixcbiAgICBcImJ5dGVcIixcbiAgICBcImludGVnZXJcIixcbiAgICBcInNob3J0aW50XCIsXG4gICAgXCJjaGFyXCIsXG4gICAgXCJsb25naW50XCIsXG4gICAgXCJmbG9hdFwiLFxuICAgIFwic3RyaW5nXCJcbiAgXSxcbiAgb3BlcmF0b3JzOiBbXG4gICAgXCI9XCIsXG4gICAgXCI+XCIsXG4gICAgXCI8XCIsXG4gICAgXCI8PVwiLFxuICAgIFwiPj1cIixcbiAgICBcIjw+XCIsXG4gICAgXCI6XCIsXG4gICAgXCI6PVwiLFxuICAgIFwiYW5kXCIsXG4gICAgXCJvclwiLFxuICAgIFwiK1wiLFxuICAgIFwiLVwiLFxuICAgIFwiKlwiLFxuICAgIFwiL1wiLFxuICAgIFwiQFwiLFxuICAgIFwiJlwiLFxuICAgIFwiXlwiLFxuICAgIFwiJVwiXG4gIF0sXG4gIHN5bWJvbHM6IC9bPT48OkBcXF4mfCtcXC0qXFwvXFxeJV0rLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgW1xuICAgICAgICAvW2EtekEtWl9dW1xcd10qLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBrZXl3b3Jkc1wiOiB7IHRva2VuOiBcImtleXdvcmQuJDBcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9bPD5dKD8hQHN5bWJvbHMpLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbXG4gICAgICAgIC9Ac3ltYm9scy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAb3BlcmF0b3JzXCI6IFwiZGVsaW1pdGVyXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1xcZCpcXC5cXGQrKFtlRV1bXFwtK10/XFxkKyk/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbL1xcJFswLTlhLWZBLUZdezEsMTZ9LywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgWy9cXGQrLywgXCJudW1iZXJcIl0sXG4gICAgICBbL1s7LC5dLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbLycoW14nXFxcXF18XFxcXC4pKiQvLCBcInN0cmluZy5pbnZhbGlkXCJdLFxuICAgICAgWy8nLywgXCJzdHJpbmdcIiwgXCJAc3RyaW5nXCJdLFxuICAgICAgWy8nW15cXFxcJ10nLywgXCJzdHJpbmdcIl0sXG4gICAgICBbLycvLCBcInN0cmluZy5pbnZhbGlkXCJdLFxuICAgICAgWy9cXCNcXGQrLywgXCJzdHJpbmdcIl1cbiAgICBdLFxuICAgIGNvbW1lbnQ6IFtcbiAgICAgIFsvW15cXCpcXH1dKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXFx9LywgXCJjb21tZW50XCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW1xce10vLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIHN0cmluZzogW1xuICAgICAgWy9bXlxcXFwnXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvJy8sIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIndoaXRlXCJdLFxuICAgICAgWy9cXHsvLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwvLiokLywgXCJjb21tZW50XCJdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUcsSUFBQyxPQUFPO0FBQUEsRUFDVCxhQUFhO0FBQUEsRUFDYixVQUFVO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixjQUFjLENBQUMsS0FBSyxHQUFHO0FBQUEsRUFDeEI7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsRUFDVjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFCO0FBQUEsRUFDRCxTQUFTO0FBQUEsSUFDUCxTQUFTO0FBQUEsTUFDUCxPQUFPLElBQUksT0FBTyxvQ0FBb0M7QUFBQSxNQUN0RCxLQUFLLElBQUksT0FBTyx5QkFBeUI7QUFBQSxJQUMxQztBQUFBLEVBQ0Y7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsWUFBWTtBQUFBLEVBQ1osVUFBVTtBQUFBLElBQ1IsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sa0JBQW1CO0FBQUEsSUFDbkQsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sbUJBQW9CO0FBQUEsSUFDcEQsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sd0JBQXlCO0FBQUEsSUFDekQsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sa0JBQW1CO0FBQUEsRUFDcEQ7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsY0FBYztBQUFBLElBQ1o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELFdBQVc7QUFBQSxJQUNUO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxTQUFTO0FBQUEsRUFDVCxXQUFXO0FBQUEsSUFDVCxNQUFNO0FBQUEsTUFDSjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxhQUFhLEVBQUUsT0FBTyxhQUFjO0FBQUEsWUFDcEMsWUFBWTtBQUFBLFVBQ2I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0QsRUFBRSxTQUFTLGNBQWU7QUFBQSxNQUMxQixDQUFDLGNBQWMsV0FBVztBQUFBLE1BQzFCLENBQUMsb0JBQW9CLFdBQVc7QUFBQSxNQUNoQztBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxjQUFjO0FBQUEsWUFDZCxZQUFZO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxDQUFDLDRCQUE0QixjQUFjO0FBQUEsTUFDM0MsQ0FBQyx1QkFBdUIsWUFBWTtBQUFBLE1BQ3BDLENBQUMsT0FBTyxRQUFRO0FBQUEsTUFDaEIsQ0FBQyxTQUFTLFdBQVc7QUFBQSxNQUNyQixDQUFDLG1CQUFtQixnQkFBZ0I7QUFBQSxNQUNwQyxDQUFDLEtBQUssVUFBVSxTQUFTO0FBQUEsTUFDekIsQ0FBQyxZQUFZLFFBQVE7QUFBQSxNQUNyQixDQUFDLEtBQUssZ0JBQWdCO0FBQUEsTUFDdEIsQ0FBQyxTQUFTLFFBQVE7QUFBQSxJQUNuQjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxZQUFZLFNBQVM7QUFBQSxNQUN0QixDQUFDLE1BQU0sV0FBVyxNQUFNO0FBQUEsTUFDeEIsQ0FBQyxRQUFRLFNBQVM7QUFBQSxJQUNuQjtBQUFBLElBQ0QsUUFBUTtBQUFBLE1BQ04sQ0FBQyxXQUFXLFFBQVE7QUFBQSxNQUNwQixDQUFDLE9BQU8sdUJBQXVCO0FBQUEsTUFDL0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxnQkFBZ0IsU0FBUyxVQUFVLE1BQU0sUUFBUTtBQUFBLElBQ2pFO0FBQUEsSUFDRCxZQUFZO0FBQUEsTUFDVixDQUFDLGNBQWMsT0FBTztBQUFBLE1BQ3RCLENBQUMsTUFBTSxXQUFXLFVBQVU7QUFBQSxNQUM1QixDQUFDLFdBQVcsU0FBUztBQUFBLElBQ3RCO0FBQUEsRUFDRjtBQUNIOyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
