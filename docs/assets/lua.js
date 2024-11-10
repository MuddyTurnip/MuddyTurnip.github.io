/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: "--",
    blockComment: ["--[[", "]]"]
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
    { open: "'", close: "'" }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".lua",
  keywords: [
    "and",
    "break",
    "do",
    "else",
    "elseif",
    "end",
    "false",
    "for",
    "function",
    "goto",
    "if",
    "in",
    "local",
    "nil",
    "not",
    "or",
    "repeat",
    "return",
    "then",
    "true",
    "until",
    "while"
  ],
  brackets: [
    { token: "delimiter.bracket", open: "{", close: "}" },
    { token: "delimiter.array", open: "[", close: "]" },
    { token: "delimiter.parenthesis", open: "(", close: ")" }
  ],
  operators: [
    "+",
    "-",
    "*",
    "/",
    "%",
    "^",
    "#",
    "==",
    "~=",
    "<=",
    ">=",
    "<",
    ">",
    "=",
    ";",
    ":",
    ",",
    ".",
    "..",
    "..."
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
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
      [/(,)(\s*)([a-zA-Z_]\w*)(\s*)(:)(?!:)/, ["delimiter", "", "key", "", "delimiter"]],
      [/({)(\s*)([a-zA-Z_]\w*)(\s*)(:)(?!:)/, ["@brackets", "", "key", "", "delimiter"]],
      [/[{}()\[\]]/, "@brackets"],
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
      [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, "number.hex"],
      [/\d+?/, "number"],
      [/[;,.]/, "delimiter"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", '@string."'],
      [/'/, "string", "@string.'"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/--\[([=]*)\[/, "comment", "@comment.$1"],
      [/--.*$/, "comment"]
    ],
    comment: [
      [/[^\]]+/, "comment"],
      [
        /\]([=]*)\]/,
        {
          cases: {
            "$1==$S2": { token: "comment", next: "@pop" },
            "@default": "comment"
          }
        }
      ],
      [/./, "comment"]
    ],
    string: [
      [/[^\\"']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [
        /["']/,
        {
          cases: {
            "$#==$S2": { token: "string", next: "@pop" },
            "@default": "string"
          }
        }
      ]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibHVhLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2x1YS9sdWEuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2x1YS9sdWEudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi0tXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCItLVtbXCIsIFwiXV1cIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH1cbiAgXVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiLmx1YVwiLFxuICBrZXl3b3JkczogW1xuICAgIFwiYW5kXCIsXG4gICAgXCJicmVha1wiLFxuICAgIFwiZG9cIixcbiAgICBcImVsc2VcIixcbiAgICBcImVsc2VpZlwiLFxuICAgIFwiZW5kXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJmdW5jdGlvblwiLFxuICAgIFwiZ290b1wiLFxuICAgIFwiaWZcIixcbiAgICBcImluXCIsXG4gICAgXCJsb2NhbFwiLFxuICAgIFwibmlsXCIsXG4gICAgXCJub3RcIixcbiAgICBcIm9yXCIsXG4gICAgXCJyZXBlYXRcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwidGhlblwiLFxuICAgIFwidHJ1ZVwiLFxuICAgIFwidW50aWxcIixcbiAgICBcIndoaWxlXCJcbiAgXSxcbiAgYnJhY2tldHM6IFtcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5icmFja2V0XCIsIG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5hcnJheVwiLCBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiwgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9XG4gIF0sXG4gIG9wZXJhdG9yczogW1xuICAgIFwiK1wiLFxuICAgIFwiLVwiLFxuICAgIFwiKlwiLFxuICAgIFwiL1wiLFxuICAgIFwiJVwiLFxuICAgIFwiXlwiLFxuICAgIFwiI1wiLFxuICAgIFwiPT1cIixcbiAgICBcIn49XCIsXG4gICAgXCI8PVwiLFxuICAgIFwiPj1cIixcbiAgICBcIjxcIixcbiAgICBcIj5cIixcbiAgICBcIj1cIixcbiAgICBcIjtcIixcbiAgICBcIjpcIixcbiAgICBcIixcIixcbiAgICBcIi5cIixcbiAgICBcIi4uXCIsXG4gICAgXCIuLi5cIlxuICBdLFxuICBzeW1ib2xzOiAvWz0+PCF+PzomfCtcXC0qXFwvXFxeJV0rLyxcbiAgZXNjYXBlczogL1xcXFwoPzpbYWJmbnJ0dlxcXFxcIiddfHhbMC05QS1GYS1mXXsxLDR9fHVbMC05QS1GYS1mXXs0fXxVWzAtOUEtRmEtZl17OH0pLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgW1xuICAgICAgICAvW2EtekEtWl9dXFx3Ki8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogeyB0b2tlbjogXCJrZXl3b3JkLiQwXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJpZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy8oLCkoXFxzKikoW2EtekEtWl9dXFx3KikoXFxzKikoOikoPyE6KS8sIFtcImRlbGltaXRlclwiLCBcIlwiLCBcImtleVwiLCBcIlwiLCBcImRlbGltaXRlclwiXV0sXG4gICAgICBbLyh7KShcXHMqKShbYS16QS1aX11cXHcqKShcXHMqKSg6KSg/ITopLywgW1wiQGJyYWNrZXRzXCIsIFwiXCIsIFwia2V5XCIsIFwiXCIsIFwiZGVsaW1pdGVyXCJdXSxcbiAgICAgIFsvW3t9KClcXFtcXF1dLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbXG4gICAgICAgIC9Ac3ltYm9scy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAb3BlcmF0b3JzXCI6IFwiZGVsaW1pdGVyXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1xcZCpcXC5cXGQrKFtlRV1bXFwtK10/XFxkKyk/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbLzBbeFhdWzAtOWEtZkEtRl9dKlswLTlhLWZBLUZdLywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgWy9cXGQrPy8sIFwibnVtYmVyXCJdLFxuICAgICAgWy9bOywuXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cIihbXlwiXFxcXF18XFxcXC4pKiQvLCBcInN0cmluZy5pbnZhbGlkXCJdLFxuICAgICAgWy8nKFteJ1xcXFxdfFxcXFwuKSokLywgXCJzdHJpbmcuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiLCAnQHN0cmluZy5cIiddLFxuICAgICAgWy8nLywgXCJzdHJpbmdcIiwgXCJAc3RyaW5nLidcIl1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwiXCJdLFxuICAgICAgWy8tLVxcWyhbPV0qKVxcWy8sIFwiY29tbWVudFwiLCBcIkBjb21tZW50LiQxXCJdLFxuICAgICAgWy8tLS4qJC8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXlxcXV0rLywgXCJjb21tZW50XCJdLFxuICAgICAgW1xuICAgICAgICAvXFxdKFs9XSopXFxdLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQxPT0kUzJcIjogeyB0b2tlbjogXCJjb21tZW50XCIsIG5leHQ6IFwiQHBvcFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiY29tbWVudFwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy8uLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBzdHJpbmc6IFtcbiAgICAgIFsvW15cXFxcXCInXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIl0sXG4gICAgICBbXG4gICAgICAgIC9bXCInXS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCIkIz09JFMyXCI6IHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwic3RyaW5nXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGNBQWMsQ0FBQyxRQUFRLElBQUk7QUFBQSxFQUM1QjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8s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
