/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: "COMMENT"
  },
  brackets: [["(", ")"]],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: ":", close: "." }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "`", close: "`" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: ":", close: "." }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*(::\\s*|COMMENT\\s+)#region"),
      end: new RegExp("^\\s*(::\\s*|COMMENT\\s+)#endregion")
    }
  }
};
var language = {
  tokenPostfix: ".lexon",
  ignoreCase: true,
  keywords: [
    "lexon",
    "lex",
    "clause",
    "terms",
    "contracts",
    "may",
    "pay",
    "pays",
    "appoints",
    "into",
    "to"
  ],
  typeKeywords: ["amount", "person", "key", "time", "date", "asset", "text"],
  operators: [
    "less",
    "greater",
    "equal",
    "le",
    "gt",
    "or",
    "and",
    "add",
    "added",
    "subtract",
    "subtracted",
    "multiply",
    "multiplied",
    "times",
    "divide",
    "divided",
    "is",
    "be",
    "certified"
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  tokenizer: {
    root: [
      [/^(\s*)(comment:?(?:\s.*|))$/, ["", "comment"]],
      [
        /"/,
        {
          token: "identifier.quote",
          bracket: "@open",
          next: "@quoted_identifier"
        }
      ],
      [
        "LEX$",
        {
          token: "keyword",
          bracket: "@open",
          next: "@identifier_until_period"
        }
      ],
      ["LEXON", { token: "keyword", bracket: "@open", next: "@semver" }],
      [
        ":",
        {
          token: "delimiter",
          bracket: "@open",
          next: "@identifier_until_period"
        }
      ],
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@operators": "operator",
            "@typeKeywords": "keyword.type",
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ],
      { include: "@whitespace" },
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/@symbols/, "delimiter"],
      [/\d*\.\d*\.\d*/, "number.semver"],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],
      [/[;,.]/, "delimiter"]
    ],
    quoted_identifier: [
      [/[^\\"]+/, "identifier"],
      [/"/, { token: "identifier.quote", bracket: "@close", next: "@pop" }]
    ],
    space_identifier_until_period: [
      [":", "delimiter"],
      [" ", { token: "white", next: "@identifier_rest" }]
    ],
    identifier_until_period: [
      { include: "@whitespace" },
      [":", { token: "delimiter", next: "@identifier_rest" }],
      [/[^\\.]+/, "identifier"],
      [/\./, { token: "delimiter", bracket: "@close", next: "@pop" }]
    ],
    identifier_rest: [
      [/[^\\.]+/, "identifier"],
      [/\./, { token: "delimiter", bracket: "@close", next: "@pop" }]
    ],
    semver: [
      { include: "@whitespace" },
      [":", "delimiter"],
      [/\d*\.\d*\.\d*/, { token: "number.semver", bracket: "@close", next: "@pop" }]
    ],
    whitespace: [[/[ \t\r\n]+/, "white"]]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4b24uanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvbGV4b24vbGV4b24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2xleG9uL2xleG9uLnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBsaW5lQ29tbWVudDogXCJDT01NRU5UXCJcbiAgfSxcbiAgYnJhY2tldHM6IFtbXCIoXCIsIFwiKVwiXV0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIjpcIiwgY2xvc2U6IFwiLlwiIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogXCJgXCIsIGNsb3NlOiBcImBcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46IFwiOlwiLCBjbG9zZTogXCIuXCIgfVxuICBdLFxuICBmb2xkaW5nOiB7XG4gICAgbWFya2Vyczoge1xuICAgICAgc3RhcnQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqKDo6XFxcXHMqfENPTU1FTlRcXFxccyspI3JlZ2lvblwiKSxcbiAgICAgIGVuZDogbmV3IFJlZ0V4cChcIl5cXFxccyooOjpcXFxccyp8Q09NTUVOVFxcXFxzKykjZW5kcmVnaW9uXCIpXG4gICAgfVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICB0b2tlblBvc3RmaXg6IFwiLmxleG9uXCIsXG4gIGlnbm9yZUNhc2U6IHRydWUsXG4gIGtleXdvcmRzOiBbXG4gICAgXCJsZXhvblwiLFxuICAgIFwibGV4XCIsXG4gICAgXCJjbGF1c2VcIixcbiAgICBcInRlcm1zXCIsXG4gICAgXCJjb250cmFjdHNcIixcbiAgICBcIm1heVwiLFxuICAgIFwicGF5XCIsXG4gICAgXCJwYXlzXCIsXG4gICAgXCJhcHBvaW50c1wiLFxuICAgIFwiaW50b1wiLFxuICAgIFwidG9cIlxuICBdLFxuICB0eXBlS2V5d29yZHM6IFtcImFtb3VudFwiLCBcInBlcnNvblwiLCBcImtleVwiLCBcInRpbWVcIiwgXCJkYXRlXCIsIFwiYXNzZXRcIiwgXCJ0ZXh0XCJdLFxuICBvcGVyYXRvcnM6IFtcbiAgICBcImxlc3NcIixcbiAgICBcImdyZWF0ZXJcIixcbiAgICBcImVxdWFsXCIsXG4gICAgXCJsZVwiLFxuICAgIFwiZ3RcIixcbiAgICBcIm9yXCIsXG4gICAgXCJhbmRcIixcbiAgICBcImFkZFwiLFxuICAgIFwiYWRkZWRcIixcbiAgICBcInN1YnRyYWN0XCIsXG4gICAgXCJzdWJ0cmFjdGVkXCIsXG4gICAgXCJtdWx0aXBseVwiLFxuICAgIFwibXVsdGlwbGllZFwiLFxuICAgIFwidGltZXNcIixcbiAgICBcImRpdmlkZVwiLFxuICAgIFwiZGl2aWRlZFwiLFxuICAgIFwiaXNcIixcbiAgICBcImJlXCIsXG4gICAgXCJjZXJ0aWZpZWRcIlxuICBdLFxuICBzeW1ib2xzOiAvWz0+PCF+PzomfCtcXC0qXFwvXFxeJV0rLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy9eKFxccyopKGNvbW1lbnQ6Pyg/Olxccy4qfCkpJC8sIFtcIlwiLCBcImNvbW1lbnRcIl1dLFxuICAgICAgW1xuICAgICAgICAvXCIvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiaWRlbnRpZmllci5xdW90ZVwiLFxuICAgICAgICAgIGJyYWNrZXQ6IFwiQG9wZW5cIixcbiAgICAgICAgICBuZXh0OiBcIkBxdW90ZWRfaWRlbnRpZmllclwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFwiTEVYJFwiLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwia2V5d29yZFwiLFxuICAgICAgICAgIGJyYWNrZXQ6IFwiQG9wZW5cIixcbiAgICAgICAgICBuZXh0OiBcIkBpZGVudGlmaWVyX3VudGlsX3BlcmlvZFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXCJMRVhPTlwiLCB7IHRva2VuOiBcImtleXdvcmRcIiwgYnJhY2tldDogXCJAb3BlblwiLCBuZXh0OiBcIkBzZW12ZXJcIiB9XSxcbiAgICAgIFtcbiAgICAgICAgXCI6XCIsXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXJcIixcbiAgICAgICAgICBicmFja2V0OiBcIkBvcGVuXCIsXG4gICAgICAgICAgbmV4dDogXCJAaWRlbnRpZmllcl91bnRpbF9wZXJpb2RcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvW2Etel8kXVtcXHckXSovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQG9wZXJhdG9yc1wiOiBcIm9wZXJhdG9yXCIsXG4gICAgICAgICAgICBcIkB0eXBlS2V5d29yZHNcIjogXCJrZXl3b3JkLnR5cGVcIixcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9bPD5dKD8hQHN5bWJvbHMpLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbL0BzeW1ib2xzLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1xcZCpcXC5cXGQqXFwuXFxkKi8sIFwibnVtYmVyLnNlbXZlclwiXSxcbiAgICAgIFsvXFxkKlxcLlxcZCsoW2VFXVtcXC0rXT9cXGQrKT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvMFt4WF1bMC05YS1mQS1GXSsvLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbL1xcZCsvLCBcIm51bWJlclwiXSxcbiAgICAgIFsvWzssLl0vLCBcImRlbGltaXRlclwiXVxuICAgIF0sXG4gICAgcXVvdGVkX2lkZW50aWZpZXI6IFtcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwiaWRlbnRpZmllclwiXSxcbiAgICAgIFsvXCIvLCB7IHRva2VuOiBcImlkZW50aWZpZXIucXVvdGVcIiwgYnJhY2tldDogXCJAY2xvc2VcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHNwYWNlX2lkZW50aWZpZXJfdW50aWxfcGVyaW9kOiBbXG4gICAgICBbXCI6XCIsIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW1wiIFwiLCB7IHRva2VuOiBcIndoaXRlXCIsIG5leHQ6IFwiQGlkZW50aWZpZXJfcmVzdFwiIH1dXG4gICAgXSxcbiAgICBpZGVudGlmaWVyX3VudGlsX3BlcmlvZDogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIFtcIjpcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXJcIiwgbmV4dDogXCJAaWRlbnRpZmllcl9yZXN0XCIgfV0sXG4gICAgICBbL1teXFxcXC5dKy8sIFwiaWRlbnRpZmllclwiXSxcbiAgICAgIFsvXFwuLywgeyB0b2tlbjogXCJkZWxpbWl0ZXJcIiwgYnJhY2tldDogXCJAY2xvc2VcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIGlkZW50aWZpZXJfcmVzdDogW1xuICAgICAgWy9bXlxcXFwuXSsvLCBcImlkZW50aWZpZXJcIl0sXG4gICAgICBbL1xcLi8sIHsgdG9rZW46IFwiZGVsaW1pdGVyXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzZW12ZXI6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbXCI6XCIsIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cXGQqXFwuXFxkKlxcLlxcZCovLCB7IHRva2VuOiBcIm51bWJlci5zZW12ZXJcIiwgYnJhY2tldDogXCJAY2xvc2VcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtbL1sgXFx0XFxyXFxuXSsvLCBcIndoaXRlXCJdXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUcsSUFBQyxPQUFPO0FBQUEsRUFDVCxVQUFVO0FBQUEsSUFDUixhQUFhO0FBQUEsRUFDZDtBQUFB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
