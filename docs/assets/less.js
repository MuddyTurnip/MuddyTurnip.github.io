/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  wordPattern: /(#?-?\d*\.\d\w*%?)|([@#!.:]?[\w-?]+%?)|[@#!.]/g,
  comments: {
    blockComment: ["/*", "*/"],
    lineComment: "//"
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
  tokenPostfix: ".less",
  identifier: "-?-?([a-zA-Z]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*",
  identifierPlus: "-?-?([a-zA-Z:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*",
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.bracket" },
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "<", close: ">", token: "delimiter.angle" }
  ],
  tokenizer: {
    root: [
      { include: "@nestedJSBegin" },
      ["[ \\t\\r\\n]+", ""],
      { include: "@comments" },
      { include: "@keyword" },
      { include: "@strings" },
      { include: "@numbers" },
      ["[*_]?[a-zA-Z\\-\\s]+(?=:.*(;|(\\\\$)))", "attribute.name", "@attribute"],
      ["url(\\-prefix)?\\(", { token: "tag", next: "@urldeclaration" }],
      ["[{}()\\[\\]]", "@brackets"],
      ["[,:;]", "delimiter"],
      ["#@identifierPlus", "tag.id"],
      ["&", "tag"],
      ["\\.@identifierPlus(?=\\()", "tag.class", "@attribute"],
      ["\\.@identifierPlus", "tag.class"],
      ["@identifierPlus", "tag"],
      { include: "@operators" },
      ["@(@identifier(?=[:,\\)]))", "variable", "@attribute"],
      ["@(@identifier)", "variable"],
      ["@", "key", "@atRules"]
    ],
    nestedJSBegin: [
      ["``", "delimiter.backtick"],
      [
        "`",
        {
          token: "delimiter.backtick",
          next: "@nestedJSEnd",
          nextEmbedded: "text/javascript"
        }
      ]
    ],
    nestedJSEnd: [
      [
        "`",
        {
          token: "delimiter.backtick",
          next: "@pop",
          nextEmbedded: "@pop"
        }
      ]
    ],
    operators: [["[<>=\\+\\-\\*\\/\\^\\|\\~]", "operator"]],
    keyword: [
      [
        "(@[\\s]*import|![\\s]*important|true|false|when|iscolor|isnumber|isstring|iskeyword|isurl|ispixel|ispercentage|isem|hue|saturation|lightness|alpha|lighten|darken|saturate|desaturate|fadein|fadeout|fade|spin|mix|round|ceil|floor|percentage)\\b",
        "keyword"
      ]
    ],
    urldeclaration: [
      { include: "@strings" },
      ["[^)\r\n]+", "string"],
      ["\\)", { token: "tag", next: "@pop" }]
    ],
    attribute: [
      { include: "@nestedJSBegin" },
      { include: "@comments" },
      { include: "@strings" },
      { include: "@numbers" },
      { include: "@keyword" },
      ["[a-zA-Z\\-]+(?=\\()", "attribute.value", "@attribute"],
      [">", "operator", "@pop"],
      ["@identifier", "attribute.value"],
      { include: "@operators" },
      ["@(@identifier)", "variable"],
      ["[)\\}]", "@brackets", "@pop"],
      ["[{}()\\[\\]>]", "@brackets"],
      ["[;]", "delimiter", "@pop"],
      ["[,=:]", "delimiter"],
      ["\\s", ""],
      [".", "attribute.value"]
    ],
    comments: [
      ["\\/\\*", "comment", "@comment"],
      ["\\/\\/+.*", "comment"]
    ],
    comment: [
      ["\\*\\/", "comment", "@pop"],
      [".", "comment"]
    ],
    numbers: [
      ["(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?", { token: "attribute.value.number", next: "@units" }],
      ["#[0-9a-fA-F_]+(?!\\w)", "attribute.value.hex"]
    ],
    units: [
      [
        "(em|ex|ch|rem|fr|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)?",
        "attribute.value.unit",
        "@pop"
      ]
    ],
    strings: [
      ['~?"', { token: "string.delimiter", next: "@stringsEndDoubleQuote" }],
      ["~?'", { token: "string.delimiter", next: "@stringsEndQuote" }]
    ],
    stringsEndDoubleQuote: [
      ['\\\\"', "string"],
      ['"', { token: "string.delimiter", next: "@popall" }],
      [".", "string"]
    ],
    stringsEndQuote: [
      ["\\\\'", "string"],
      ["'", { token: "string.delimiter", next: "@popall" }],
      [".", "string"]
    ],
    atRules: [
      { include: "@comments" },
      { include: "@strings" },
      ["[()]", "delimiter"],
      ["[\\{;]", "delimiter", "@pop"],
      [".", "key"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVzcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9sZXNzL2xlc3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2xlc3MvbGVzcy50c1xudmFyIGNvbmYgPSB7XG4gIHdvcmRQYXR0ZXJuOiAvKCM/LT9cXGQqXFwuXFxkXFx3KiU/KXwoW0AjIS46XT9bXFx3LT9dKyU/KXxbQCMhLl0vZyxcbiAgY29tbWVudHM6IHtcbiAgICBibG9ja0NvbW1lbnQ6IFtcIi8qXCIsIFwiKi9cIl0sXG4gICAgbGluZUNvbW1lbnQ6IFwiLy9cIlxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfVxuICBdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF0sXG4gIGZvbGRpbmc6IHtcbiAgICBtYXJrZXJzOiB7XG4gICAgICBzdGFydDogbmV3IFJlZ0V4cChcIl5cXFxccypcXFxcL1xcXFwqXFxcXHMqI3JlZ2lvblxcXFxiXFxcXHMqKC4qPylcXFxccypcXFxcKlxcXFwvXCIpLFxuICAgICAgZW5kOiBuZXcgUmVnRXhwKFwiXlxcXFxzKlxcXFwvXFxcXCpcXFxccyojZW5kcmVnaW9uXFxcXGIuKlxcXFwqXFxcXC9cIilcbiAgICB9XG4gIH1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5sZXNzXCIsXG4gIGlkZW50aWZpZXI6IFwiLT8tPyhbYS16QS1aXXwoXFxcXFxcXFwoKFswLTlhLWZBLUZdezEsNn1cXFxccz8pfFteWzAtOWEtZkEtRl0pKSkoW1xcXFx3XFxcXC1dfChcXFxcXFxcXCgoWzAtOWEtZkEtRl17MSw2fVxcXFxzPyl8W15bMC05YS1mQS1GXSkpKSpcIixcbiAgaWRlbnRpZmllclBsdXM6IFwiLT8tPyhbYS16QS1aOi5dfChcXFxcXFxcXCgoWzAtOWEtZkEtRl17MSw2fVxcXFxzPyl8W15bMC05YS1mQS1GXSkpKShbXFxcXHdcXFxcLTouXXwoXFxcXFxcXFwoKFswLTlhLWZBLUZdezEsNn1cXFxccz8pfFteWzAtOWEtZkEtRl0pKSkqXCIsXG4gIGJyYWNrZXRzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuY3VybHlcIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXRcIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIsIHRva2VuOiBcImRlbGltaXRlci5hbmdsZVwiIH1cbiAgXSxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgeyBpbmNsdWRlOiBcIkBuZXN0ZWRKU0JlZ2luXCIgfSxcbiAgICAgIFtcIlsgXFxcXHRcXFxcclxcXFxuXStcIiwgXCJcIl0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbW1lbnRzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAa2V5d29yZFwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ3NcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBudW1iZXJzXCIgfSxcbiAgICAgIFtcIlsqX10/W2EtekEtWlxcXFwtXFxcXHNdKyg/PTouKig7fChcXFxcXFxcXCQpKSlcIiwgXCJhdHRyaWJ1dGUubmFtZVwiLCBcIkBhdHRyaWJ1dGVcIl0sXG4gICAgICBbXCJ1cmwoXFxcXC1wcmVmaXgpP1xcXFwoXCIsIHsgdG9rZW46IFwidGFnXCIsIG5leHQ6IFwiQHVybGRlY2xhcmF0aW9uXCIgfV0sXG4gICAgICBbXCJbe30oKVxcXFxbXFxcXF1dXCIsIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgW1wiWyw6O11cIiwgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbXCIjQGlkZW50aWZpZXJQbHVzXCIsIFwidGFnLmlkXCJdLFxuICAgICAgW1wiJlwiLCBcInRhZ1wiXSxcbiAgICAgIFtcIlxcXFwuQGlkZW50aWZpZXJQbHVzKD89XFxcXCgpXCIsIFwidGFnLmNsYXNzXCIsIFwiQGF0dHJpYnV0ZVwiXSxcbiAgICAgIFtcIlxcXFwuQGlkZW50aWZpZXJQbHVzXCIsIFwidGFnLmNsYXNzXCJdLFxuICAgICAgW1wiQGlkZW50aWZpZXJQbHVzXCIsIFwidGFnXCJdLFxuICAgICAgeyBpbmNsdWRlOiBcIkBvcGVyYXRvcnNcIiB9LFxuICAgICAgW1wiQChAaWRlbnRpZmllcig/PVs6LFxcXFwpXSkpXCIsIFwidmFyaWFibGVcIiwgXCJAYXR0cmlidXRlXCJdLFxuICAgICAgW1wiQChAaWRlbnRpZmllcilcIiwgXCJ2YXJpYWJsZVwiXSxcbiAgICAgIFtcIkBcIiwgXCJrZXlcIiwgXCJAYXRSdWxlc1wiXVxuICAgIF0sXG4gICAgbmVzdGVkSlNCZWdpbjogW1xuICAgICAgW1wiYGBcIiwgXCJkZWxpbWl0ZXIuYmFja3RpY2tcIl0sXG4gICAgICBbXG4gICAgICAgIFwiYFwiLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmJhY2t0aWNrXCIsXG4gICAgICAgICAgbmV4dDogXCJAbmVzdGVkSlNFbmRcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9qYXZhc2NyaXB0XCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIF0sXG4gICAgbmVzdGVkSlNFbmQ6IFtcbiAgICAgIFtcbiAgICAgICAgXCJgXCIsXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuYmFja3RpY2tcIixcbiAgICAgICAgICBuZXh0OiBcIkBwb3BcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIG9wZXJhdG9yczogW1tcIls8Pj1cXFxcK1xcXFwtXFxcXCpcXFxcL1xcXFxeXFxcXHxcXFxcfl1cIiwgXCJvcGVyYXRvclwiXV0sXG4gICAga2V5d29yZDogW1xuICAgICAgW1xuICAgICAgICBcIihAW1xcXFxzXSppbXBvcnR8IVtcXFxcc10qaW1wb3J0YW50fHRydWV8ZmFsc2V8d2hlbnxpc2NvbG9yfGlzbnVtYmVyfGlzc3RyaW5nfGlza2V5d29yZHxpc3VybHxpc3BpeGVsfGlzcGVyY2VudGFnZXxpc2VtfGh1ZXxzYXR1cmF0aW9ufGxpZ2h0bmVzc3xhbHBoYXxsaWdodGVufGRhcmtlbnxzYXR1cmF0ZXxkZXNhdHVyYXRlfGZhZGVpbnxmYWRlb3V0fGZhZGV8c3BpbnxtaXh8cm91bmR8Y2VpbHxmbG9vcnxwZXJjZW50YWdlKVxcXFxiXCIsXG4gICAgICAgIFwia2V5d29yZFwiXG4gICAgICBdXG4gICAgXSxcbiAgICB1cmxkZWNsYXJhdGlvbjogW1xuICAgICAgeyBpbmNsdWRlOiBcIkBzdHJpbmdzXCIgfSxcbiAgICAgIFtcIlteKVxcclxcbl0rXCIsIFwic3RyaW5nXCJdLFxuICAgICAgW1wiXFxcXClcIiwgeyB0b2tlbjogXCJ0YWdcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIGF0dHJpYnV0ZTogW1xuICAgICAgeyBpbmNsdWRlOiBcIkBuZXN0ZWRKU0JlZ2luXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAY29tbWVudHNcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBzdHJpbmdzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAbnVtYmVyc1wiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGtleXdvcmRcIiB9LFxuICAgICAgW1wiW2EtekEtWlxcXFwtXSsoPz1cXFxcKClcIiwgXCJhdHRyaWJ1dGUudmFsdWVcIiwgXCJAYXR0cmlidXRlXCJdLFxuICAgICAgW1wiPlwiLCBcIm9wZXJhdG9yXCIsIFwiQHBvcFwiXSxcbiAgICAgIFtcIkBpZGVudGlmaWVyXCIsIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgeyBpbmNsdWRlOiBcIkBvcGVyYXRvcnNcIiB9LFxuICAgICAgW1wiQChAaWRlbnRpZmllcilcIiwgXCJ2YXJpYWJsZVwiXSxcbiAgICAgIFtcIlspXFxcXH1dXCIsIFwiQGJyYWNrZXRzXCIsIFwiQHBvcFwiXSxcbiAgICAgIFtcIlt7fSgpXFxcXFtcXFxcXT5dXCIsIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgW1wiWztdXCIsIFwiZGVsaW1pdGVyXCIsIFwiQHBvcFwiXSxcbiAgICAgIFtcIlssPTpdXCIsIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW1wiXFxcXHNcIiwgXCJcIl0sXG4gICAgICBbXCIuXCIsIFwiYXR0cmlidXRlLnZhbHVlXCJdXG4gICAgXSxcbiAgICBjb21tZW50czogW1xuICAgICAgW1wiXFxcXC9cXFxcKlwiLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFtcIlxcXFwvXFxcXC8rLipcIiwgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbXCJcXFxcKlxcXFwvXCIsIFwiY29tbWVudFwiLCBcIkBwb3BcIl0sXG4gICAgICBbXCIuXCIsIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgbnVtYmVyczogW1xuICAgICAgW1wiKFxcXFxkKlxcXFwuKT9cXFxcZCsoW2VFXVtcXFxcLStdP1xcXFxkKyk/XCIsIHsgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlLm51bWJlclwiLCBuZXh0OiBcIkB1bml0c1wiIH1dLFxuICAgICAgW1wiI1swLTlhLWZBLUZfXSsoPyFcXFxcdylcIiwgXCJhdHRyaWJ1dGUudmFsdWUuaGV4XCJdXG4gICAgXSxcbiAgICB1bml0czogW1xuICAgICAgW1xuICAgICAgICBcIihlbXxleHxjaHxyZW18ZnJ8dm1pbnx2bWF4fHZ3fHZofHZtfGNtfG1tfGlufHB4fHB0fHBjfGRlZ3xncmFkfHJhZHx0dXJufHN8bXN8SHp8a0h6fCUpP1wiLFxuICAgICAgICBcImF0dHJpYnV0ZS52YWx1ZS51bml0XCIsXG4gICAgICAgIFwiQHBvcFwiXG4gICAgICBdXG4gICAgXSxcbiAgICBzdHJpbmdzOiBbXG4gICAgICBbJ34/XCInLCB7IHRva2VuOiBcInN0cmluZy5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAc3RyaW5nc0VuZERvdWJsZVF1b3RlXCIgfV0sXG4gICAgICBbXCJ+PydcIiwgeyB0b2tlbjogXCJzdHJpbmcuZGVsaW1pdGVyXCIsIG5leHQ6IFwiQHN0cmluZ3NFbmRRdW90ZVwiIH1dXG4gICAgXSxcbiAgICBzdHJpbmdzRW5kRG91YmxlUXVvdGU6IFtcbiAgICAgIFsnXFxcXFxcXFxcIicsIFwic3RyaW5nXCJdLFxuICAgICAgWydcIicsIHsgdG9rZW46IFwic3RyaW5nLmRlbGltaXRlclwiLCBuZXh0OiBcIkBwb3BhbGxcIiB9XSxcbiAgICAgIFtcIi5cIiwgXCJzdHJpbmdcIl1cbiAgICBdLFxuICAgIHN0cmluZ3NFbmRRdW90ZTogW1xuICAgICAgW1wiXFxcXFxcXFwnXCIsIFwic3RyaW5nXCJdLFxuICAgICAgW1wiJ1wiLCB7IHRva2VuOiBcInN0cmluZy5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wYWxsXCIgfV0sXG4gICAgICBbXCIuXCIsIFwic3RyaW5nXCJdXG4gICAgXSxcbiAgICBhdFJ1bGVzOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbW1lbnRzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAc3RyaW5nc1wiIH0sXG4gICAgICBbXCJbKCldXCIsIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW1wiW1xcXFx7O11cIiwgXCJkZWxpbWl0ZXJcIiwgXCJAcG9wXCJdLFxuICAgICAgW1wiLlwiLCBcImtleVwiXVxuICAgIF1cbiAgfVxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FB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
