/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var bounded = (text) => `\\b${text}\\b`;
var identifierStart = "[_a-zA-Z]";
var identifierContinue = "[_a-zA-Z0-9]";
var identifier = bounded(`${identifierStart}${identifierContinue}*`);
var keywords = [
  "targetScope",
  "resource",
  "module",
  "param",
  "var",
  "output",
  "for",
  "in",
  "if",
  "existing"
];
var namedLiterals = ["true", "false", "null"];
var nonCommentWs = `[ \\t\\r\\n]`;
var numericLiteral = `[0-9]+`;
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
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "'", close: "'" },
    { open: "'''", close: "'''" }
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: "'''", close: "'''", notIn: ["string", "comment"] }
  ],
  autoCloseBefore: ":.,=}])' \n	",
  indentationRules: {
    increaseIndentPattern: new RegExp("^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$"),
    decreaseIndentPattern: new RegExp("^((?!.*?\\/\\*).*\\*/)?\\s*[\\}\\]].*$")
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".bicep",
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" }
  ],
  symbols: /[=><!~?:&|+\-*/^%]+/,
  keywords,
  namedLiterals,
  escapes: `\\\\(u{[0-9A-Fa-f]+}|n|r|t|\\\\|'|\\\${)`,
  tokenizer: {
    root: [{ include: "@expression" }, { include: "@whitespace" }],
    stringVerbatim: [
      { regex: `(|'|'')[^']`, action: { token: "string" } },
      { regex: `'''`, action: { token: "string.quote", next: "@pop" } }
    ],
    stringLiteral: [
      { regex: `\\\${`, action: { token: "delimiter.bracket", next: "@bracketCounting" } },
      { regex: `[^\\\\'$]+`, action: { token: "string" } },
      { regex: "@escapes", action: { token: "string.escape" } },
      { regex: `\\\\.`, action: { token: "string.escape.invalid" } },
      { regex: `'`, action: { token: "string", next: "@pop" } }
    ],
    bracketCounting: [
      { regex: `{`, action: { token: "delimiter.bracket", next: "@bracketCounting" } },
      { regex: `}`, action: { token: "delimiter.bracket", next: "@pop" } },
      { include: "expression" }
    ],
    comment: [
      { regex: `[^\\*]+`, action: { token: "comment" } },
      { regex: `\\*\\/`, action: { token: "comment", next: "@pop" } },
      { regex: `[\\/*]`, action: { token: "comment" } }
    ],
    whitespace: [
      { regex: nonCommentWs },
      { regex: `\\/\\*`, action: { token: "comment", next: "@comment" } },
      { regex: `\\/\\/.*$`, action: { token: "comment" } }
    ],
    expression: [
      { regex: `'''`, action: { token: "string.quote", next: "@stringVerbatim" } },
      { regex: `'`, action: { token: "string.quote", next: "@stringLiteral" } },
      { regex: numericLiteral, action: { token: "number" } },
      {
        regex: identifier,
        action: {
          cases: {
            "@keywords": { token: "keyword" },
            "@namedLiterals": { token: "keyword" },
            "@default": { token: "identifier" }
          }
        }
      }
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmljZXAuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvYmljZXAvYmljZXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2JpY2VwL2JpY2VwLnRzXG52YXIgYm91bmRlZCA9ICh0ZXh0KSA9PiBgXFxcXGIke3RleHR9XFxcXGJgO1xudmFyIGlkZW50aWZpZXJTdGFydCA9IFwiW19hLXpBLVpdXCI7XG52YXIgaWRlbnRpZmllckNvbnRpbnVlID0gXCJbX2EtekEtWjAtOV1cIjtcbnZhciBpZGVudGlmaWVyID0gYm91bmRlZChgJHtpZGVudGlmaWVyU3RhcnR9JHtpZGVudGlmaWVyQ29udGludWV9KmApO1xudmFyIGtleXdvcmRzID0gW1xuICBcInRhcmdldFNjb3BlXCIsXG4gIFwicmVzb3VyY2VcIixcbiAgXCJtb2R1bGVcIixcbiAgXCJwYXJhbVwiLFxuICBcInZhclwiLFxuICBcIm91dHB1dFwiLFxuICBcImZvclwiLFxuICBcImluXCIsXG4gIFwiaWZcIixcbiAgXCJleGlzdGluZ1wiXG5dO1xudmFyIG5hbWVkTGl0ZXJhbHMgPSBbXCJ0cnVlXCIsIFwiZmFsc2VcIiwgXCJudWxsXCJdO1xudmFyIG5vbkNvbW1lbnRXcyA9IGBbIFxcXFx0XFxcXHJcXFxcbl1gO1xudmFyIG51bWVyaWNMaXRlcmFsID0gYFswLTldK2A7XG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBsaW5lQ29tbWVudDogXCIvL1wiLFxuICAgIGJsb2NrQ29tbWVudDogW1wiLypcIiwgXCIqL1wiXVxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdXG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46IFwiJycnXCIsIGNsb3NlOiBcIicnJ1wiIH1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46IFwiJycnXCIsIGNsb3NlOiBcIicnJ1wiLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9XG4gIF0sXG4gIGF1dG9DbG9zZUJlZm9yZTogXCI6Liw9fV0pJyBcXG5cdFwiLFxuICBpbmRlbnRhdGlvblJ1bGVzOiB7XG4gICAgaW5jcmVhc2VJbmRlbnRQYXR0ZXJuOiBuZXcgUmVnRXhwKFwiXigoPyFcXFxcL1xcXFwvKS4pKihcXFxce1tefVxcXCInYF0qfFxcXFwoW14pXFxcIidgXSp8XFxcXFtbXlxcXFxdXFxcIidgXSopJFwiKSxcbiAgICBkZWNyZWFzZUluZGVudFBhdHRlcm46IG5ldyBSZWdFeHAoXCJeKCg/IS4qP1xcXFwvXFxcXCopLipcXFxcKi8pP1xcXFxzKltcXFxcfVxcXFxdXS4qJFwiKVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCIuYmljZXBcIixcbiAgYnJhY2tldHM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIsIHRva2VuOiBcImRlbGltaXRlci5jdXJseVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIsIHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiIH1cbiAgXSxcbiAgc3ltYm9sczogL1s9Pjwhfj86JnwrXFwtKi9eJV0rLyxcbiAga2V5d29yZHMsXG4gIG5hbWVkTGl0ZXJhbHMsXG4gIGVzY2FwZXM6IGBcXFxcXFxcXCh1e1swLTlBLUZhLWZdK318bnxyfHR8XFxcXFxcXFx8J3xcXFxcXFwkeylgLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbeyBpbmNsdWRlOiBcIkBleHByZXNzaW9uXCIgfSwgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfV0sXG4gICAgc3RyaW5nVmVyYmF0aW06IFtcbiAgICAgIHsgcmVnZXg6IGAofCd8JycpW14nXWAsIGFjdGlvbjogeyB0b2tlbjogXCJzdHJpbmdcIiB9IH0sXG4gICAgICB7IHJlZ2V4OiBgJycnYCwgYWN0aW9uOiB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBuZXh0OiBcIkBwb3BcIiB9IH1cbiAgICBdLFxuICAgIHN0cmluZ0xpdGVyYWw6IFtcbiAgICAgIHsgcmVnZXg6IGBcXFxcXFwke2AsIGFjdGlvbjogeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBuZXh0OiBcIkBicmFja2V0Q291bnRpbmdcIiB9IH0sXG4gICAgICB7IHJlZ2V4OiBgW15cXFxcXFxcXCckXStgLCBhY3Rpb246IHsgdG9rZW46IFwic3RyaW5nXCIgfSB9LFxuICAgICAgeyByZWdleDogXCJAZXNjYXBlc1wiLCBhY3Rpb246IHsgdG9rZW46IFwic3RyaW5nLmVzY2FwZVwiIH0gfSxcbiAgICAgIHsgcmVnZXg6IGBcXFxcXFxcXC5gLCBhY3Rpb246IHsgdG9rZW46IFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCIgfSB9LFxuICAgICAgeyByZWdleDogYCdgLCBhY3Rpb246IHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcFwiIH0gfVxuICAgIF0sXG4gICAgYnJhY2tldENvdW50aW5nOiBbXG4gICAgICB7IHJlZ2V4OiBge2AsIGFjdGlvbjogeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBuZXh0OiBcIkBicmFja2V0Q291bnRpbmdcIiB9IH0sXG4gICAgICB7IHJlZ2V4OiBgfWAsIGFjdGlvbjogeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBuZXh0OiBcIkBwb3BcIiB9IH0sXG4gICAgICB7IGluY2x1ZGU6IFwiZXhwcmVzc2lvblwiIH1cbiAgICBdLFxuICAgIGNvbW1lbnQ6IFtcbiAgICAgIHsgcmVnZXg6IGBbXlxcXFwqXStgLCBhY3Rpb246IHsgdG9rZW46IFwiY29tbWVudFwiIH0gfSxcbiAgICAgIHsgcmVnZXg6IGBcXFxcKlxcXFwvYCwgYWN0aW9uOiB7IHRva2VuOiBcImNvbW1lbnRcIiwgbmV4dDogXCJAcG9wXCIgfSB9LFxuICAgICAgeyByZWdleDogYFtcXFxcLypdYCwgYWN0aW9uOiB7IHRva2VuOiBcImNvbW1lbnRcIiB9IH1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIHsgcmVnZXg6IG5vbkNvbW1lbnRXcyB9LFxuICAgICAgeyByZWdleDogYFxcXFwvXFxcXCpgLCBhY3Rpb246IHsgdG9rZW46IFwiY29tbWVudFwiLCBuZXh0OiBcIkBjb21tZW50XCIgfSB9LFxuICAgICAgeyByZWdleDogYFxcXFwvXFxcXC8uKiRgLCBhY3Rpb246IHsgdG9rZW46IFwiY29tbWVudFwiIH0gfVxuICAgIF0sXG4gICAgZXhwcmVzc2lvbjogW1xuICAgICAgeyByZWdleDogYCcnJ2AsIGFjdGlvbjogeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgbmV4dDogXCJAc3RyaW5nVmVyYmF0aW1cIiB9IH0sXG4gICAgICB7IHJlZ2V4OiBgJ2AsIGFjdGlvbjogeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgbmV4dDogXCJAc3RyaW5nTGl0ZXJhbFwiIH0gfSxcbiAgICAgIHsgcmVnZXg6IG51bWVyaWNMaXRlcmFsLCBhY3Rpb246IHsgdG9rZW46IFwibnVtYmVyXCIgfSB9LFxuICAgICAge1xuICAgICAgICByZWdleDogaWRlbnRpZmllcixcbiAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZFwiIH0sXG4gICAgICAgICAgICBcIkBuYW1lZExpdGVyYWxzXCI6IHsgdG9rZW46IFwia2V5d29yZFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IHsgdG9rZW46IFwiaWRlbnRpZmllclwiIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRQSxJQUFJLFVBQVUsQ0FBQyxTQUFTLE1BQU0sSUFBSTtBQUNsQyxJQUFJLGtCQUFrQjtBQUN0QixJQUFJLHFC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
