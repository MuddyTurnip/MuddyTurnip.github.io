/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: "//",
    blockComment: ["(*", "*)"]
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
    { open: "'", close: "'" },
    { open: '"', close: '"' },
    { open: "(*", close: "*)" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "<", close: ">" },
    { open: "'", close: "'" },
    { open: '"', close: '"' },
    { open: "(*", close: "*)" }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".cameligo",
  ignoreCase: true,
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "<", close: ">", token: "delimiter.angle" }
  ],
  keywords: [
    "abs",
    "assert",
    "block",
    "Bytes",
    "case",
    "Crypto",
    "Current",
    "else",
    "failwith",
    "false",
    "for",
    "fun",
    "if",
    "in",
    "let",
    "let%entry",
    "let%init",
    "List",
    "list",
    "Map",
    "map",
    "match",
    "match%nat",
    "mod",
    "not",
    "operation",
    "Operation",
    "of",
    "record",
    "Set",
    "set",
    "sender",
    "skip",
    "source",
    "String",
    "then",
    "to",
    "true",
    "type",
    "with"
  ],
  typeKeywords: ["int", "unit", "string", "tz", "nat", "bool"],
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
    "mod",
    "or",
    "+",
    "-",
    "*",
    "/",
    "@",
    "&",
    "^",
    "%",
    "->",
    "<-",
    "&&",
    "||"
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
      [/[^\(\*]+/, "comment"],
      [/\*\)/, "comment", "@pop"],
      [/\(\*/, "comment"]
    ],
    string: [
      [/[^\\']+/, "string"],
      [/\\./, "string.escape.invalid"],
      [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\(\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZWxpZ28uanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvY2FtZWxpZ28vY2FtZWxpZ28uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2NhbWVsaWdvL2NhbWVsaWdvLnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBsaW5lQ29tbWVudDogXCIvL1wiLFxuICAgIGJsb2NrQ29tbWVudDogW1wiKCpcIiwgXCIqKVwiXVxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdLFxuICAgIFtcIjxcIiwgXCI+XCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIigqXCIsIGNsb3NlOiBcIiopXCIgfVxuICBdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCIoKlwiLCBjbG9zZTogXCIqKVwiIH1cbiAgXVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiLmNhbWVsaWdvXCIsXG4gIGlnbm9yZUNhc2U6IHRydWUsXG4gIGJyYWNrZXRzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuY3VybHlcIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiwgdG9rZW46IFwiZGVsaW1pdGVyLnNxdWFyZVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiB9LFxuICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmFuZ2xlXCIgfVxuICBdLFxuICBrZXl3b3JkczogW1xuICAgIFwiYWJzXCIsXG4gICAgXCJhc3NlcnRcIixcbiAgICBcImJsb2NrXCIsXG4gICAgXCJCeXRlc1wiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiQ3J5cHRvXCIsXG4gICAgXCJDdXJyZW50XCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJmYWlsd2l0aFwiLFxuICAgIFwiZmFsc2VcIixcbiAgICBcImZvclwiLFxuICAgIFwiZnVuXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW5cIixcbiAgICBcImxldFwiLFxuICAgIFwibGV0JWVudHJ5XCIsXG4gICAgXCJsZXQlaW5pdFwiLFxuICAgIFwiTGlzdFwiLFxuICAgIFwibGlzdFwiLFxuICAgIFwiTWFwXCIsXG4gICAgXCJtYXBcIixcbiAgICBcIm1hdGNoXCIsXG4gICAgXCJtYXRjaCVuYXRcIixcbiAgICBcIm1vZFwiLFxuICAgIFwibm90XCIsXG4gICAgXCJvcGVyYXRpb25cIixcbiAgICBcIk9wZXJhdGlvblwiLFxuICAgIFwib2ZcIixcbiAgICBcInJlY29yZFwiLFxuICAgIFwiU2V0XCIsXG4gICAgXCJzZXRcIixcbiAgICBcInNlbmRlclwiLFxuICAgIFwic2tpcFwiLFxuICAgIFwic291cmNlXCIsXG4gICAgXCJTdHJpbmdcIixcbiAgICBcInRoZW5cIixcbiAgICBcInRvXCIsXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJ0eXBlXCIsXG4gICAgXCJ3aXRoXCJcbiAgXSxcbiAgdHlwZUtleXdvcmRzOiBbXCJpbnRcIiwgXCJ1bml0XCIsIFwic3RyaW5nXCIsIFwidHpcIiwgXCJuYXRcIiwgXCJib29sXCJdLFxuICBvcGVyYXRvcnM6IFtcbiAgICBcIj1cIixcbiAgICBcIj5cIixcbiAgICBcIjxcIixcbiAgICBcIjw9XCIsXG4gICAgXCI+PVwiLFxuICAgIFwiPD5cIixcbiAgICBcIjpcIixcbiAgICBcIjo9XCIsXG4gICAgXCJhbmRcIixcbiAgICBcIm1vZFwiLFxuICAgIFwib3JcIixcbiAgICBcIitcIixcbiAgICBcIi1cIixcbiAgICBcIipcIixcbiAgICBcIi9cIixcbiAgICBcIkBcIixcbiAgICBcIiZcIixcbiAgICBcIl5cIixcbiAgICBcIiVcIixcbiAgICBcIi0+XCIsXG4gICAgXCI8LVwiLFxuICAgIFwiJiZcIixcbiAgICBcInx8XCJcbiAgXSxcbiAgc3ltYm9sczogL1s9Pjw6QFxcXiZ8K1xcLSpcXC9cXF4lXSsvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbXG4gICAgICAgIC9bYS16QS1aX11bXFx3XSovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZC4kMFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIFsvW3t9KClcXFtcXF1dLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbL1s8Pl0oPyFAc3ltYm9scykvLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFtcbiAgICAgICAgL0BzeW1ib2xzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBvcGVyYXRvcnNcIjogXCJkZWxpbWl0ZXJcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXFxkKlxcLlxcZCsoW2VFXVtcXC0rXT9cXGQrKT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvXFwkWzAtOWEtZkEtRl17MSwxNn0vLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbL1xcZCsvLCBcIm51bWJlclwiXSxcbiAgICAgIFsvWzssLl0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvJyhbXidcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbLycvLCBcInN0cmluZ1wiLCBcIkBzdHJpbmdcIl0sXG4gICAgICBbLydbXlxcXFwnXScvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbL1xcI1xcZCsvLCBcInN0cmluZ1wiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXlxcKFxcKl0rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9cXCpcXCkvLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9cXChcXCovLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIHN0cmluZzogW1xuICAgICAgWy9bXlxcXFwnXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvJy8sIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIndoaXRlXCJdLFxuICAgICAgWy9cXChcXCovLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwvLiokLywgXCJjb21tZW50XCJdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUcsSUFBQyxPQUFPO0FBQUEsRUFDVCxVQUFVO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixjQUFjLENBQUMsTUFBTSxJQUFJO0FBQUEsRUFDMUI7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsRUFDVjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtB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