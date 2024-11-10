/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: ";",
    blockComment: ["#|", "|#"]
  },
  brackets: [
    ["(", ")"],
    ["{", "}"],
    ["[", "]"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' }
  ]
};
var language = {
  defaultToken: "",
  ignoreCase: true,
  tokenPostfix: ".scheme",
  brackets: [
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" }
  ],
  keywords: [
    "case",
    "do",
    "let",
    "loop",
    "if",
    "else",
    "when",
    "cons",
    "car",
    "cdr",
    "cond",
    "lambda",
    "lambda*",
    "syntax-rules",
    "format",
    "set!",
    "quote",
    "eval",
    "append",
    "list",
    "list?",
    "member?",
    "load"
  ],
  constants: ["#t", "#f"],
  operators: ["eq?", "eqv?", "equal?", "and", "or", "not", "null?"],
  tokenizer: {
    root: [
      [/#[xXoObB][0-9a-fA-F]+/, "number.hex"],
      [/[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?/, "number.float"],
      [
        /(?:\b(?:(define|define-syntax|define-macro))\b)(\s+)((?:\w|\-|\!|\?)*)/,
        ["keyword", "white", "variable"]
      ],
      { include: "@whitespace" },
      { include: "@strings" },
      [
        /[a-zA-Z_#][a-zA-Z0-9_\-\?\!\*]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@constants": "constant",
            "@operators": "operators",
            "@default": "identifier"
          }
        }
      ]
    ],
    comment: [
      [/[^\|#]+/, "comment"],
      [/#\|/, "comment", "@push"],
      [/\|#/, "comment", "@pop"],
      [/[\|#]/, "comment"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/#\|/, "comment", "@comment"],
      [/;.*$/, "comment"]
    ],
    strings: [
      [/"$/, "string", "@popall"],
      [/"(?=.)/, "string", "@multiLineString"]
    ],
    multiLineString: [
      [/[^\\"]+$/, "string", "@popall"],
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape"],
      [/"/, "string", "@popall"],
      [/\\$/, "string"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1lLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL3NjaGVtZS9zY2hlbWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3NjaGVtZS9zY2hlbWUudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIjtcIixcbiAgICBibG9ja0NvbW1lbnQ6IFtcIiN8XCIsIFwifCNcIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCIoXCIsIFwiKVwiXSxcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH1cbiAgXVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICBpZ25vcmVDYXNlOiB0cnVlLFxuICB0b2tlblBvc3RmaXg6IFwiLnNjaGVtZVwiLFxuICBicmFja2V0czogW1xuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIsIHRva2VuOiBcImRlbGltaXRlci5jdXJseVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIgfVxuICBdLFxuICBrZXl3b3JkczogW1xuICAgIFwiY2FzZVwiLFxuICAgIFwiZG9cIixcbiAgICBcImxldFwiLFxuICAgIFwibG9vcFwiLFxuICAgIFwiaWZcIixcbiAgICBcImVsc2VcIixcbiAgICBcIndoZW5cIixcbiAgICBcImNvbnNcIixcbiAgICBcImNhclwiLFxuICAgIFwiY2RyXCIsXG4gICAgXCJjb25kXCIsXG4gICAgXCJsYW1iZGFcIixcbiAgICBcImxhbWJkYSpcIixcbiAgICBcInN5bnRheC1ydWxlc1wiLFxuICAgIFwiZm9ybWF0XCIsXG4gICAgXCJzZXQhXCIsXG4gICAgXCJxdW90ZVwiLFxuICAgIFwiZXZhbFwiLFxuICAgIFwiYXBwZW5kXCIsXG4gICAgXCJsaXN0XCIsXG4gICAgXCJsaXN0P1wiLFxuICAgIFwibWVtYmVyP1wiLFxuICAgIFwibG9hZFwiXG4gIF0sXG4gIGNvbnN0YW50czogW1wiI3RcIiwgXCIjZlwiXSxcbiAgb3BlcmF0b3JzOiBbXCJlcT9cIiwgXCJlcXY/XCIsIFwiZXF1YWw/XCIsIFwiYW5kXCIsIFwib3JcIiwgXCJub3RcIiwgXCJudWxsP1wiXSxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy8jW3hYb09iQl1bMC05YS1mQS1GXSsvLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbL1srLV0/XFxkKyg/Oig/OlxcLlxcZCopPyg/OltlRV1bKy1dP1xcZCspPyk/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbXG4gICAgICAgIC8oPzpcXGIoPzooZGVmaW5lfGRlZmluZS1zeW50YXh8ZGVmaW5lLW1hY3JvKSlcXGIpKFxccyspKCg/Olxcd3xcXC18XFwhfFxcPykqKS8sXG4gICAgICAgIFtcImtleXdvcmRcIiwgXCJ3aGl0ZVwiLCBcInZhcmlhYmxlXCJdXG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAc3RyaW5nc1wiIH0sXG4gICAgICBbXG4gICAgICAgIC9bYS16QS1aXyNdW2EtekEtWjAtOV9cXC1cXD9cXCFcXCpdKi8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgICBcIkBjb25zdGFudHNcIjogXCJjb25zdGFudFwiLFxuICAgICAgICAgICAgXCJAb3BlcmF0b3JzXCI6IFwib3BlcmF0b3JzXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1teXFx8I10rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy8jXFx8LywgXCJjb21tZW50XCIsIFwiQHB1c2hcIl0sXG4gICAgICBbL1xcfCMvLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXFx8I10vLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwid2hpdGVcIl0sXG4gICAgICBbLyNcXHwvLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvOy4qJC8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgc3RyaW5nczogW1xuICAgICAgWy9cIiQvLCBcInN0cmluZ1wiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbL1wiKD89LikvLCBcInN0cmluZ1wiLCBcIkBtdWx0aUxpbmVTdHJpbmdcIl1cbiAgICBdLFxuICAgIG11bHRpTGluZVN0cmluZzogW1xuICAgICAgWy9bXlxcXFxcIl0rJC8sIFwic3RyaW5nXCIsIFwiQHBvcGFsbFwiXSxcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbL1xcXFwkLywgXCJzdHJpbmdcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGNBQWMsQ0FBQyxNQUFNLElBQUk7QUFBQSxFQUMxQjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8s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
