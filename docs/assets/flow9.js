/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
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
    { open: "{", close: "}", notIn: ["string"] },
    { open: "[", close: "]", notIn: ["string"] },
    { open: "(", close: ")", notIn: ["string"] },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "<", close: ">" }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".flow",
  keywords: [
    "import",
    "require",
    "export",
    "forbid",
    "native",
    "if",
    "else",
    "cast",
    "unsafe",
    "switch",
    "default"
  ],
  types: [
    "io",
    "mutable",
    "bool",
    "int",
    "double",
    "string",
    "flow",
    "void",
    "ref",
    "true",
    "false",
    "with"
  ],
  operators: [
    "=",
    ">",
    "<",
    "<=",
    ">=",
    "==",
    "!",
    "!=",
    ":=",
    "::=",
    "&&",
    "||",
    "+",
    "-",
    "*",
    "/",
    "@",
    "&",
    "%",
    ":",
    "->",
    "\\",
    "$",
    "??",
    "^"
  ],
  symbols: /[@$=><!~?:&|+\-*\\\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@types": "type",
            "@default": "identifier"
          }
        }
      ],
      { include: "@whitespace" },
      [/[{}()\[\]]/, "delimiter"],
      [/[<>](?!@symbols)/, "delimiter"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": ""
          }
        }
      ],
      [/((0(x|X)[0-9a-fA-F]*)|(([0-9]+\.?[0-9]*)|(\.[0-9]+))((e|E)(\+|-)?[0-9]+)?)/, "number"],
      [/[;,.]/, "delimiter"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvdzkuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvZmxvdzkvZmxvdzkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2Zsb3c5L2Zsb3c5LnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBibG9ja0NvbW1lbnQ6IFtcIi8qXCIsIFwiKi9cIl0sXG4gICAgbGluZUNvbW1lbnQ6IFwiLy9cIlxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIsIG5vdEluOiBbXCJzdHJpbmdcIl0gfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIsIG5vdEluOiBbXCJzdHJpbmdcIl0gfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIsIG5vdEluOiBbXCJzdHJpbmdcIl0gfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInLCBub3RJbjogW1wic3RyaW5nXCJdIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiLCBub3RJbjogW1wic3RyaW5nXCJdIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIgfVxuICBdXG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCIuZmxvd1wiLFxuICBrZXl3b3JkczogW1xuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJyZXF1aXJlXCIsXG4gICAgXCJleHBvcnRcIixcbiAgICBcImZvcmJpZFwiLFxuICAgIFwibmF0aXZlXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiY2FzdFwiLFxuICAgIFwidW5zYWZlXCIsXG4gICAgXCJzd2l0Y2hcIixcbiAgICBcImRlZmF1bHRcIlxuICBdLFxuICB0eXBlczogW1xuICAgIFwiaW9cIixcbiAgICBcIm11dGFibGVcIixcbiAgICBcImJvb2xcIixcbiAgICBcImludFwiLFxuICAgIFwiZG91YmxlXCIsXG4gICAgXCJzdHJpbmdcIixcbiAgICBcImZsb3dcIixcbiAgICBcInZvaWRcIixcbiAgICBcInJlZlwiLFxuICAgIFwidHJ1ZVwiLFxuICAgIFwiZmFsc2VcIixcbiAgICBcIndpdGhcIlxuICBdLFxuICBvcGVyYXRvcnM6IFtcbiAgICBcIj1cIixcbiAgICBcIj5cIixcbiAgICBcIjxcIixcbiAgICBcIjw9XCIsXG4gICAgXCI+PVwiLFxuICAgIFwiPT1cIixcbiAgICBcIiFcIixcbiAgICBcIiE9XCIsXG4gICAgXCI6PVwiLFxuICAgIFwiOjo9XCIsXG4gICAgXCImJlwiLFxuICAgIFwifHxcIixcbiAgICBcIitcIixcbiAgICBcIi1cIixcbiAgICBcIipcIixcbiAgICBcIi9cIixcbiAgICBcIkBcIixcbiAgICBcIiZcIixcbiAgICBcIiVcIixcbiAgICBcIjpcIixcbiAgICBcIi0+XCIsXG4gICAgXCJcXFxcXCIsXG4gICAgXCIkXCIsXG4gICAgXCI/P1wiLFxuICAgIFwiXlwiXG4gIF0sXG4gIHN5bWJvbHM6IC9bQCQ9Pjwhfj86JnwrXFwtKlxcXFxcXC9cXF4lXSsvLFxuICBlc2NhcGVzOiAvXFxcXCg/OlthYmZucnR2XFxcXFwiJ118eFswLTlBLUZhLWZdezEsNH18dVswLTlBLUZhLWZdezR9fFVbMC05QS1GYS1mXXs4fSkvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbXG4gICAgICAgIC9bYS16QS1aX11cXHcqLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBrZXl3b3Jkc1wiOiBcImtleXdvcmRcIixcbiAgICAgICAgICAgIFwiQHR5cGVzXCI6IFwidHlwZVwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9bPD5dKD8hQHN5bWJvbHMpLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbXG4gICAgICAgIC9Ac3ltYm9scy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAb3BlcmF0b3JzXCI6IFwiZGVsaW1pdGVyXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLygoMCh4fFgpWzAtOWEtZkEtRl0qKXwoKFswLTldK1xcLj9bMC05XSopfChcXC5bMC05XSspKSgoZXxFKShcXCt8LSk/WzAtOV0rKT8pLywgXCJudW1iZXJcIl0sXG4gICAgICBbL1s7LC5dLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1wiKFteXCJcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgXCJAc3RyaW5nXCJdXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIlwiXSxcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50XCIsIFwiQGNvbW1lbnRcIl0sXG4gICAgICBbL1xcL1xcLy4qJC8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXlxcLypdKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXFwqXFwvLywgXCJjb21tZW50XCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW1xcLypdLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBzdHJpbmc6IFtcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiLCBcIkBwb3BcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGNBQWMsQ0FBQyxNQUFNLElBQUk7QUFBQSxJQUN6QixhQUFhO0FBQUEsRUFDZDtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsUUFBUSxFQUFHO0FBQUEsSUFDNUMsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sQ0FBQyxRQUFRLEVBQUc7QUFBQSxJQUM1QyxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFFBQVEsRUFBRztBQUFBLElBQzVDLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsUUFBUSxFQUFHO0FBQUEsSUFDNUMsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sQ0FBQyxRQUFRLEVBQUc7QUFBQSxFQUM3QztBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsVUFBVTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsT0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELFdBQVc7QUFBQSxJQUNUO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsU0FBUztBQUFBLEVBQ1QsU0FBUztBQUFBLEVBQ1QsV0FBVztBQUFBLElBQ1QsTUFBTTtBQUFBLE1BQ0o7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFlBQ0wsYUFBYTtBQUFBLFlBQ2IsVUFBVTtBQUFBLFlBQ1YsWUFBWTtBQUFBLFVBQ2I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0QsRUFBRSxTQUFTLGNBQWU7QUFBQSxNQUMxQixDQUFDLGNBQWMsV0FBVztBQUFBLE1BQzFCLENBQUMsb0JBQW9CLFdBQVc7QUFBQSxNQUNoQztBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxjQUFjO0FBQUEsWUFDZCxZQUFZO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxDQUFDLDhFQUE4RSxRQUFRO0FBQUEsTUFDdkYsQ0FBQyxTQUFTLFdBQVc7QUFBQSxNQUNyQixDQUFDLG1CQUFtQixnQkFBZ0I7QUFBQSxNQUNwQyxDQUFDLEtBQUssVUFBVSxTQUFTO0FBQUEsSUFDMUI7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNWLENBQUMsY0FBYyxFQUFFO0FBQUEsTUFDakIsQ0FBQyxRQUFRLFdBQVcsVUFBVTtBQUFBLE1BQzlCLENBQUMsV0FBVyxTQUFTO0FBQUEsSUFDdEI7QUFBQSxJQUNELFNBQVM7QUFBQSxNQUNQLENBQUMsV0FBVyxTQUFTO0FBQUEsTUFDckIsQ0FBQyxRQUFRLFdBQVcsTUFBTTtBQUFBLE1BQzFCLENBQUMsU0FBUyxTQUFTO0FBQUEsSUFDcEI7QUFBQSxJQUNELFFBQVE7QUFBQSxNQUNOLENBQUMsV0FBVyxRQUFRO0FBQUEsTUFDcEIsQ0FBQyxZQUFZLGVBQWU7QUFBQSxNQUM1QixDQUFDLE9BQU8sdUJBQXVCO0FBQUEsTUFDL0IsQ0FBQyxLQUFLLFVBQVUsTUFBTTtBQUFBLElBQ3ZCO0FBQUEsRUFDRjtBQUNIOyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
