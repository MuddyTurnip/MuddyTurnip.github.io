/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  wordPattern: /(#?-?\d*\.\d\w*%?)|((::|[@#.!:])?[\w-?]+%?)|::|[@#.!:]/g,
  comments: {
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}", notIn: ["string", "comment"] },
    { open: "[", close: "]", notIn: ["string", "comment"] },
    { open: "(", close: ")", notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["string", "comment"] },
    { open: "'", close: "'", notIn: ["string", "comment"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*\\/\\*\\s*#region\\b\\s*(.*?)\\s*\\*\\/"),
      end: new RegExp("^\\s*\\/\\*\\s*#endregion\\b.*\\*\\/")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".css",
  ws: "[ 	\n\r\f]*",
  identifier: "-?-?([a-zA-Z]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*",
  brackets: [
    { open: "{", close: "}", token: "delimiter.bracket" },
    { open: "[", close: "]", token: "delimiter.bracket" },
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "<", close: ">", token: "delimiter.angle" }
  ],
  tokenizer: {
    root: [{ include: "@selector" }],
    selector: [
      { include: "@comments" },
      { include: "@import" },
      { include: "@strings" },
      [
        "[@](keyframes|-webkit-keyframes|-moz-keyframes|-o-keyframes)",
        { token: "keyword", next: "@keyframedeclaration" }
      ],
      ["[@](page|content|font-face|-moz-document)", { token: "keyword" }],
      ["[@](charset|namespace)", { token: "keyword", next: "@declarationbody" }],
      [
        "(url-prefix)(\\()",
        ["attribute.value", { token: "delimiter.parenthesis", next: "@urldeclaration" }]
      ],
      [
        "(url)(\\()",
        ["attribute.value", { token: "delimiter.parenthesis", next: "@urldeclaration" }]
      ],
      { include: "@selectorname" },
      ["[\\*]", "tag"],
      ["[>\\+,]", "delimiter"],
      ["\\[", { token: "delimiter.bracket", next: "@selectorattribute" }],
      ["{", { token: "delimiter.bracket", next: "@selectorbody" }]
    ],
    selectorbody: [
      { include: "@comments" },
      ["[*_]?@identifier@ws:(?=(\\s|\\d|[^{;}]*[;}]))", "attribute.name", "@rulevalue"],
      ["}", { token: "delimiter.bracket", next: "@pop" }]
    ],
    selectorname: [
      ["(\\.|#(?=[^{])|%|(@identifier)|:)+", "tag"]
    ],
    selectorattribute: [{ include: "@term" }, ["]", { token: "delimiter.bracket", next: "@pop" }]],
    term: [
      { include: "@comments" },
      [
        "(url-prefix)(\\()",
        ["attribute.value", { token: "delimiter.parenthesis", next: "@urldeclaration" }]
      ],
      [
        "(url)(\\()",
        ["attribute.value", { token: "delimiter.parenthesis", next: "@urldeclaration" }]
      ],
      { include: "@functioninvocation" },
      { include: "@numbers" },
      { include: "@name" },
      { include: "@strings" },
      ["([<>=\\+\\-\\*\\/\\^\\|\\~,])", "delimiter"],
      [",", "delimiter"]
    ],
    rulevalue: [
      { include: "@comments" },
      { include: "@strings" },
      { include: "@term" },
      ["!important", "keyword"],
      [";", "delimiter", "@pop"],
      ["(?=})", { token: "", next: "@pop" }]
    ],
    warndebug: [["[@](warn|debug)", { token: "keyword", next: "@declarationbody" }]],
    import: [["[@](import)", { token: "keyword", next: "@declarationbody" }]],
    urldeclaration: [
      { include: "@strings" },
      ["[^)\r\n]+", "string"],
      ["\\)", { token: "delimiter.parenthesis", next: "@pop" }]
    ],
    parenthizedterm: [
      { include: "@term" },
      ["\\)", { token: "delimiter.parenthesis", next: "@pop" }]
    ],
    declarationbody: [
      { include: "@term" },
      [";", "delimiter", "@pop"],
      ["(?=})", { token: "", next: "@pop" }]
    ],
    comments: [
      ["\\/\\*", "comment", "@comment"],
      ["\\/\\/+.*", "comment"]
    ],
    comment: [
      ["\\*\\/", "comment", "@pop"],
      [/[^*/]+/, "comment"],
      [/./, "comment"]
    ],
    name: [["@identifier", "attribute.value"]],
    numbers: [
      ["-?(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?", { token: "attribute.value.number", next: "@units" }],
      ["#[0-9a-fA-F_]+(?!\\w)", "attribute.value.hex"]
    ],
    units: [
      [
        "(em|ex|ch|rem|fr|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)?",
        "attribute.value.unit",
        "@pop"
      ]
    ],
    keyframedeclaration: [
      ["@identifier", "attribute.value"],
      ["{", { token: "delimiter.bracket", switchTo: "@keyframebody" }]
    ],
    keyframebody: [
      { include: "@term" },
      ["{", { token: "delimiter.bracket", next: "@selectorbody" }],
      ["}", { token: "delimiter.bracket", next: "@pop" }]
    ],
    functioninvocation: [
      ["@identifier\\(", { token: "attribute.value", next: "@functionarguments" }]
    ],
    functionarguments: [
      ["\\$@identifier@ws:", "attribute.name"],
      ["[,]", "delimiter"],
      { include: "@term" },
      ["\\)", { token: "attribute.value", next: "@pop" }]
    ],
    strings: [
      ['~?"', { token: "string", next: "@stringenddoublequote" }],
      ["~?'", { token: "string", next: "@stringendquote" }]
    ],
    stringenddoublequote: [
      ["\\\\.", "string"],
      ['"', { token: "string", next: "@pop" }],
      [/[^\\"]+/, "string"],
      [".", "string"]
    ],
    stringendquote: [
      ["\\\\.", "string"],
      ["'", { token: "string", next: "@pop" }],
      [/[^\\']+/, "string"],
      [".", "string"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2Nzcy9jc3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2Nzcy9jc3MudHNcbnZhciBjb25mID0ge1xuICB3b3JkUGF0dGVybjogLygjPy0/XFxkKlxcLlxcZFxcdyolPyl8KCg6OnxbQCMuITpdKT9bXFx3LT9dKyU/KXw6OnxbQCMuITpdL2csXG4gIGNvbW1lbnRzOiB7XG4gICAgYmxvY2tDb21tZW50OiBbXCIvKlwiLCBcIiovXCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH1cbiAgXSxcbiAgZm9sZGluZzoge1xuICAgIG1hcmtlcnM6IHtcbiAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKFwiXlxcXFxzKlxcXFwvXFxcXCpcXFxccyojcmVnaW9uXFxcXGJcXFxccyooLio/KVxcXFxzKlxcXFwqXFxcXC9cIiksXG4gICAgICBlbmQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqXFxcXC9cXFxcKlxcXFxzKiNlbmRyZWdpb25cXFxcYi4qXFxcXCpcXFxcL1wiKVxuICAgIH1cbiAgfVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiLmNzc1wiLFxuICB3czogXCJbIFx0XFxuXFxyXFxmXSpcIixcbiAgaWRlbnRpZmllcjogXCItPy0/KFthLXpBLVpdfChcXFxcXFxcXCgoWzAtOWEtZkEtRl17MSw2fVxcXFxzPyl8W15bMC05YS1mQS1GXSkpKShbXFxcXHdcXFxcLV18KFxcXFxcXFxcKChbMC05YS1mQS1GXXsxLDZ9XFxcXHM/KXxbXlswLTlhLWZBLUZdKSkpKlwiLFxuICBicmFja2V0czogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXRcIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXRcIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIsIHRva2VuOiBcImRlbGltaXRlci5hbmdsZVwiIH1cbiAgXSxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW3sgaW5jbHVkZTogXCJAc2VsZWN0b3JcIiB9XSxcbiAgICBzZWxlY3RvcjogW1xuICAgICAgeyBpbmNsdWRlOiBcIkBjb21tZW50c1wiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGltcG9ydFwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ3NcIiB9LFxuICAgICAgW1xuICAgICAgICBcIltAXShrZXlmcmFtZXN8LXdlYmtpdC1rZXlmcmFtZXN8LW1vei1rZXlmcmFtZXN8LW8ta2V5ZnJhbWVzKVwiLFxuICAgICAgICB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAa2V5ZnJhbWVkZWNsYXJhdGlvblwiIH1cbiAgICAgIF0sXG4gICAgICBbXCJbQF0ocGFnZXxjb250ZW50fGZvbnQtZmFjZXwtbW96LWRvY3VtZW50KVwiLCB7IHRva2VuOiBcImtleXdvcmRcIiB9XSxcbiAgICAgIFtcIltAXShjaGFyc2V0fG5hbWVzcGFjZSlcIiwgeyB0b2tlbjogXCJrZXl3b3JkXCIsIG5leHQ6IFwiQGRlY2xhcmF0aW9uYm9keVwiIH1dLFxuICAgICAgW1xuICAgICAgICBcIih1cmwtcHJlZml4KShcXFxcKClcIixcbiAgICAgICAgW1wiYXR0cmlidXRlLnZhbHVlXCIsIHsgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIsIG5leHQ6IFwiQHVybGRlY2xhcmF0aW9uXCIgfV1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFwiKHVybCkoXFxcXCgpXCIsXG4gICAgICAgIFtcImF0dHJpYnV0ZS52YWx1ZVwiLCB7IHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiLCBuZXh0OiBcIkB1cmxkZWNsYXJhdGlvblwiIH1dXG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkBzZWxlY3Rvcm5hbWVcIiB9LFxuICAgICAgW1wiW1xcXFwqXVwiLCBcInRhZ1wiXSxcbiAgICAgIFtcIls+XFxcXCssXVwiLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFtcIlxcXFxbXCIsIHsgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXRcIiwgbmV4dDogXCJAc2VsZWN0b3JhdHRyaWJ1dGVcIiB9XSxcbiAgICAgIFtcIntcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBuZXh0OiBcIkBzZWxlY3RvcmJvZHlcIiB9XVxuICAgIF0sXG4gICAgc2VsZWN0b3Jib2R5OiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbW1lbnRzXCIgfSxcbiAgICAgIFtcIlsqX10/QGlkZW50aWZpZXJAd3M6KD89KFxcXFxzfFxcXFxkfFteezt9XSpbO31dKSlcIiwgXCJhdHRyaWJ1dGUubmFtZVwiLCBcIkBydWxldmFsdWVcIl0sXG4gICAgICBbXCJ9XCIsIHsgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXRcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHNlbGVjdG9ybmFtZTogW1xuICAgICAgW1wiKFxcXFwufCMoPz1bXntdKXwlfChAaWRlbnRpZmllcil8OikrXCIsIFwidGFnXCJdXG4gICAgXSxcbiAgICBzZWxlY3RvcmF0dHJpYnV0ZTogW3sgaW5jbHVkZTogXCJAdGVybVwiIH0sIFtcIl1cIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBuZXh0OiBcIkBwb3BcIiB9XV0sXG4gICAgdGVybTogW1xuICAgICAgeyBpbmNsdWRlOiBcIkBjb21tZW50c1wiIH0sXG4gICAgICBbXG4gICAgICAgIFwiKHVybC1wcmVmaXgpKFxcXFwoKVwiLFxuICAgICAgICBbXCJhdHRyaWJ1dGUudmFsdWVcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiwgbmV4dDogXCJAdXJsZGVjbGFyYXRpb25cIiB9XVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgXCIodXJsKShcXFxcKClcIixcbiAgICAgICAgW1wiYXR0cmlidXRlLnZhbHVlXCIsIHsgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIsIG5leHQ6IFwiQHVybGRlY2xhcmF0aW9uXCIgfV1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGZ1bmN0aW9uaW52b2NhdGlvblwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQG51bWJlcnNcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBuYW1lXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAc3RyaW5nc1wiIH0sXG4gICAgICBbXCIoWzw+PVxcXFwrXFxcXC1cXFxcKlxcXFwvXFxcXF5cXFxcfFxcXFx+LF0pXCIsIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW1wiLFwiLCBcImRlbGltaXRlclwiXVxuICAgIF0sXG4gICAgcnVsZXZhbHVlOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbW1lbnRzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAc3RyaW5nc1wiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHRlcm1cIiB9LFxuICAgICAgW1wiIWltcG9ydGFudFwiLCBcImtleXdvcmRcIl0sXG4gICAgICBbXCI7XCIsIFwiZGVsaW1pdGVyXCIsIFwiQHBvcFwiXSxcbiAgICAgIFtcIig/PX0pXCIsIHsgdG9rZW46IFwiXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICB3YXJuZGVidWc6IFtbXCJbQF0od2FybnxkZWJ1ZylcIiwgeyB0b2tlbjogXCJrZXl3b3JkXCIsIG5leHQ6IFwiQGRlY2xhcmF0aW9uYm9keVwiIH1dXSxcbiAgICBpbXBvcnQ6IFtbXCJbQF0oaW1wb3J0KVwiLCB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAZGVjbGFyYXRpb25ib2R5XCIgfV1dLFxuICAgIHVybGRlY2xhcmF0aW9uOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ3NcIiB9LFxuICAgICAgW1wiW14pXFxyXFxuXStcIiwgXCJzdHJpbmdcIl0sXG4gICAgICBbXCJcXFxcKVwiLCB7IHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgcGFyZW50aGl6ZWR0ZXJtOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHRlcm1cIiB9LFxuICAgICAgW1wiXFxcXClcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uYm9keTogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB0ZXJtXCIgfSxcbiAgICAgIFtcIjtcIiwgXCJkZWxpbWl0ZXJcIiwgXCJAcG9wXCJdLFxuICAgICAgW1wiKD89fSlcIiwgeyB0b2tlbjogXCJcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIGNvbW1lbnRzOiBbXG4gICAgICBbXCJcXFxcL1xcXFwqXCIsIFwiY29tbWVudFwiLCBcIkBjb21tZW50XCJdLFxuICAgICAgW1wiXFxcXC9cXFxcLysuKlwiLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIGNvbW1lbnQ6IFtcbiAgICAgIFtcIlxcXFwqXFxcXC9cIiwgXCJjb21tZW50XCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW14qL10rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy8uLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBuYW1lOiBbW1wiQGlkZW50aWZpZXJcIiwgXCJhdHRyaWJ1dGUudmFsdWVcIl1dLFxuICAgIG51bWJlcnM6IFtcbiAgICAgIFtcIi0/KFxcXFxkKlxcXFwuKT9cXFxcZCsoW2VFXVtcXFxcLStdP1xcXFxkKyk/XCIsIHsgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlLm51bWJlclwiLCBuZXh0OiBcIkB1bml0c1wiIH1dLFxuICAgICAgW1wiI1swLTlhLWZBLUZfXSsoPyFcXFxcdylcIiwgXCJhdHRyaWJ1dGUudmFsdWUuaGV4XCJdXG4gICAgXSxcbiAgICB1bml0czogW1xuICAgICAgW1xuICAgICAgICBcIihlbXxleHxjaHxyZW18ZnJ8dm1pbnx2bWF4fHZ3fHZofHZtfGNtfG1tfGlufHB4fHB0fHBjfGRlZ3xncmFkfHJhZHx0dXJufHN8bXN8SHp8a0h6fCUpP1wiLFxuICAgICAgICBcImF0dHJpYnV0ZS52YWx1ZS51bml0XCIsXG4gICAgICAgIFwiQHBvcFwiXG4gICAgICBdXG4gICAgXSxcbiAgICBrZXlmcmFtZWRlY2xhcmF0aW9uOiBbXG4gICAgICBbXCJAaWRlbnRpZmllclwiLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFtcIntcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBzd2l0Y2hUbzogXCJAa2V5ZnJhbWVib2R5XCIgfV1cbiAgICBdLFxuICAgIGtleWZyYW1lYm9keTogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB0ZXJtXCIgfSxcbiAgICAgIFtcIntcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBuZXh0OiBcIkBzZWxlY3RvcmJvZHlcIiB9XSxcbiAgICAgIFtcIn1cIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgZnVuY3Rpb25pbnZvY2F0aW9uOiBbXG4gICAgICBbXCJAaWRlbnRpZmllclxcXFwoXCIsIHsgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsIG5leHQ6IFwiQGZ1bmN0aW9uYXJndW1lbnRzXCIgfV1cbiAgICBdLFxuICAgIGZ1bmN0aW9uYXJndW1lbnRzOiBbXG4gICAgICBbXCJcXFxcJEBpZGVudGlmaWVyQHdzOlwiLCBcImF0dHJpYnV0ZS5uYW1lXCJdLFxuICAgICAgW1wiWyxdXCIsIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgeyBpbmNsdWRlOiBcIkB0ZXJtXCIgfSxcbiAgICAgIFtcIlxcXFwpXCIsIHsgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzdHJpbmdzOiBbXG4gICAgICBbJ34/XCInLCB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBzdHJpbmdlbmRkb3VibGVxdW90ZVwiIH1dLFxuICAgICAgW1wifj8nXCIsIHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHN0cmluZ2VuZHF1b3RlXCIgfV1cbiAgICBdLFxuICAgIHN0cmluZ2VuZGRvdWJsZXF1b3RlOiBbXG4gICAgICBbXCJcXFxcXFxcXC5cIiwgXCJzdHJpbmdcIl0sXG4gICAgICBbJ1wiJywgeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICBbL1teXFxcXFwiXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFtcIi5cIiwgXCJzdHJpbmdcIl1cbiAgICBdLFxuICAgIHN0cmluZ2VuZHF1b3RlOiBbXG4gICAgICBbXCJcXFxcXFxcXC5cIiwgXCJzdHJpbmdcIl0sXG4gICAgICBbXCInXCIsIHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgWy9bXlxcXFwnXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFtcIi5cIiwgXCJzdHJpbmdcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULGFBQWE7QUFBQSxFQUNi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
