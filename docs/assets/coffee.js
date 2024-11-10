/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#%\^\&\*\(\)\=\$\-\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    blockComment: ["###", "###"],
    lineComment: "#"
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
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*#region\\b"),
      end: new RegExp("^\\s*#endregion\\b")
    }
  }
};
var language = {
  defaultToken: "",
  ignoreCase: true,
  tokenPostfix: ".coffee",
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" }
  ],
  regEx: /\/(?!\/\/)(?:[^\/\\]|\\.)*\/[igm]*/,
  keywords: [
    "and",
    "or",
    "is",
    "isnt",
    "not",
    "on",
    "yes",
    "@",
    "no",
    "off",
    "true",
    "false",
    "null",
    "this",
    "new",
    "delete",
    "typeof",
    "in",
    "instanceof",
    "return",
    "throw",
    "break",
    "continue",
    "debugger",
    "if",
    "else",
    "switch",
    "for",
    "while",
    "do",
    "try",
    "catch",
    "finally",
    "class",
    "extends",
    "super",
    "undefined",
    "then",
    "unless",
    "until",
    "loop",
    "of",
    "by",
    "when"
  ],
  symbols: /[=><!~?&%|+\-*\/\^\.,\:]+/,
  escapes: /\\(?:[abfnrtv\\"'$]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      [/\@[a-zA-Z_]\w*/, "variable.predefined"],
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            this: "variable.predefined",
            "@keywords": { token: "keyword.$0" },
            "@default": ""
          }
        }
      ],
      [/[ \t\r\n]+/, ""],
      [/###/, "comment", "@comment"],
      [/#.*$/, "comment"],
      ["///", { token: "regexp", next: "@hereregexp" }],
      [/^(\s*)(@regEx)/, ["", "regexp"]],
      [/(\()(\s*)(@regEx)/, ["@brackets", "", "regexp"]],
      [/(\,)(\s*)(@regEx)/, ["delimiter", "", "regexp"]],
      [/(\=)(\s*)(@regEx)/, ["delimiter", "", "regexp"]],
      [/(\:)(\s*)(@regEx)/, ["delimiter", "", "regexp"]],
      [/(\[)(\s*)(@regEx)/, ["@brackets", "", "regexp"]],
      [/(\!)(\s*)(@regEx)/, ["delimiter", "", "regexp"]],
      [/(\&)(\s*)(@regEx)/, ["delimiter", "", "regexp"]],
      [/(\|)(\s*)(@regEx)/, ["delimiter", "", "regexp"]],
      [/(\?)(\s*)(@regEx)/, ["delimiter", "", "regexp"]],
      [/(\{)(\s*)(@regEx)/, ["@brackets", "", "regexp"]],
      [/(\;)(\s*)(@regEx)/, ["", "", "regexp"]],
      [
        /}/,
        {
          cases: {
            "$S2==interpolatedstring": {
              token: "string",
              next: "@pop"
            },
            "@default": "@brackets"
          }
        }
      ],
      [/[{}()\[\]]/, "@brackets"],
      [/@symbols/, "delimiter"],
      [/\d+[eE]([\-+]?\d+)?/, "number.float"],
      [/\d+\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/0[0-7]+(?!\d)/, "number.octal"],
      [/\d+/, "number"],
      [/[,.]/, "delimiter"],
      [/"""/, "string", '@herestring."""'],
      [/'''/, "string", "@herestring.'''"],
      [
        /"/,
        {
          cases: {
            "@eos": "string",
            "@default": { token: "string", next: '@string."' }
          }
        }
      ],
      [
        /'/,
        {
          cases: {
            "@eos": "string",
            "@default": { token: "string", next: "@string.'" }
          }
        }
      ]
    ],
    string: [
      [/[^"'\#\\]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\./, "string.escape.invalid"],
      [/\./, "string.escape.invalid"],
      [
        /#{/,
        {
          cases: {
            '$S2=="': {
              token: "string",
              next: "root.interpolatedstring"
            },
            "@default": "string"
          }
        }
      ],
      [
        /["']/,
        {
          cases: {
            "$#==$S2": { token: "string", next: "@pop" },
            "@default": "string"
          }
        }
      ],
      [/#/, "string"]
    ],
    herestring: [
      [
        /("""|''')/,
        {
          cases: {
            "$1==$S2": { token: "string", next: "@pop" },
            "@default": "string"
          }
        }
      ],
      [/[^#\\'"]+/, "string"],
      [/['"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\./, "string.escape.invalid"],
      [/#{/, { token: "string.quote", next: "root.interpolatedstring" }],
      [/#/, "string"]
    ],
    comment: [
      [/[^#]+/, "comment"],
      [/###/, "comment", "@pop"],
      [/#/, "comment"]
    ],
    hereregexp: [
      [/[^\\\/#]+/, "regexp"],
      [/\\./, "regexp"],
      [/#.*$/, "comment"],
      ["///[igm]*", { token: "regexp", next: "@pop" }],
      [/\//, "regexp"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29mZmVlLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2NvZmZlZS9jb2ZmZWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2NvZmZlZS9jb2ZmZWUudHNcbnZhciBjb25mID0ge1xuICB3b3JkUGF0dGVybjogLygtP1xcZCpcXC5cXGRcXHcqKXwoW15cXGBcXH5cXCFcXEBcXCMlXFxeXFwmXFwqXFwoXFwpXFw9XFwkXFwtXFwrXFxbXFx7XFxdXFx9XFxcXFxcfFxcO1xcOlxcJ1xcXCJcXCxcXC5cXDxcXD5cXC9cXD9cXHNdKykvZyxcbiAgY29tbWVudHM6IHtcbiAgICBibG9ja0NvbW1lbnQ6IFtcIiMjI1wiLCBcIiMjI1wiXSxcbiAgICBsaW5lQ29tbWVudDogXCIjXCJcbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH1cbiAgXSxcbiAgZm9sZGluZzoge1xuICAgIG1hcmtlcnM6IHtcbiAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKFwiXlxcXFxzKiNyZWdpb25cXFxcYlwiKSxcbiAgICAgIGVuZDogbmV3IFJlZ0V4cChcIl5cXFxccyojZW5kcmVnaW9uXFxcXGJcIilcbiAgICB9XG4gIH1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgaWdub3JlQ2FzZTogdHJ1ZSxcbiAgdG9rZW5Qb3N0Zml4OiBcIi5jb2ZmZWVcIixcbiAgYnJhY2tldHM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIsIHRva2VuOiBcImRlbGltaXRlci5jdXJseVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIsIHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiIH1cbiAgXSxcbiAgcmVnRXg6IC9cXC8oPyFcXC9cXC8pKD86W15cXC9cXFxcXXxcXFxcLikqXFwvW2lnbV0qLyxcbiAga2V5d29yZHM6IFtcbiAgICBcImFuZFwiLFxuICAgIFwib3JcIixcbiAgICBcImlzXCIsXG4gICAgXCJpc250XCIsXG4gICAgXCJub3RcIixcbiAgICBcIm9uXCIsXG4gICAgXCJ5ZXNcIixcbiAgICBcIkBcIixcbiAgICBcIm5vXCIsXG4gICAgXCJvZmZcIixcbiAgICBcInRydWVcIixcbiAgICBcImZhbHNlXCIsXG4gICAgXCJudWxsXCIsXG4gICAgXCJ0aGlzXCIsXG4gICAgXCJuZXdcIixcbiAgICBcImRlbGV0ZVwiLFxuICAgIFwidHlwZW9mXCIsXG4gICAgXCJpblwiLFxuICAgIFwiaW5zdGFuY2VvZlwiLFxuICAgIFwicmV0dXJuXCIsXG4gICAgXCJ0aHJvd1wiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImNvbnRpbnVlXCIsXG4gICAgXCJkZWJ1Z2dlclwiLFxuICAgIFwiaWZcIixcbiAgICBcImVsc2VcIixcbiAgICBcInN3aXRjaFwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJ3aGlsZVwiLFxuICAgIFwiZG9cIixcbiAgICBcInRyeVwiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImZpbmFsbHlcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJleHRlbmRzXCIsXG4gICAgXCJzdXBlclwiLFxuICAgIFwidW5kZWZpbmVkXCIsXG4gICAgXCJ0aGVuXCIsXG4gICAgXCJ1bmxlc3NcIixcbiAgICBcInVudGlsXCIsXG4gICAgXCJsb29wXCIsXG4gICAgXCJvZlwiLFxuICAgIFwiYnlcIixcbiAgICBcIndoZW5cIlxuICBdLFxuICBzeW1ib2xzOiAvWz0+PCF+PyYlfCtcXC0qXFwvXFxeXFwuLFxcOl0rLyxcbiAgZXNjYXBlczogL1xcXFwoPzpbYWJmbnJ0dlxcXFxcIickXXx4WzAtOUEtRmEtZl17MSw0fXx1WzAtOUEtRmEtZl17NH18VVswLTlBLUZhLWZdezh9KS8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIFsvXFxAW2EtekEtWl9dXFx3Ki8sIFwidmFyaWFibGUucHJlZGVmaW5lZFwiXSxcbiAgICAgIFtcbiAgICAgICAgL1thLXpBLVpfXVxcdyovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIHRoaXM6IFwidmFyaWFibGUucHJlZGVmaW5lZFwiLFxuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogeyB0b2tlbjogXCJrZXl3b3JkLiQwXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwiXCJdLFxuICAgICAgWy8jIyMvLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvIy4qJC8sIFwiY29tbWVudFwiXSxcbiAgICAgIFtcIi8vL1wiLCB7IHRva2VuOiBcInJlZ2V4cFwiLCBuZXh0OiBcIkBoZXJlcmVnZXhwXCIgfV0sXG4gICAgICBbL14oXFxzKikoQHJlZ0V4KS8sIFtcIlwiLCBcInJlZ2V4cFwiXV0sXG4gICAgICBbLyhcXCgpKFxccyopKEByZWdFeCkvLCBbXCJAYnJhY2tldHNcIiwgXCJcIiwgXCJyZWdleHBcIl1dLFxuICAgICAgWy8oXFwsKShcXHMqKShAcmVnRXgpLywgW1wiZGVsaW1pdGVyXCIsIFwiXCIsIFwicmVnZXhwXCJdXSxcbiAgICAgIFsvKFxcPSkoXFxzKikoQHJlZ0V4KS8sIFtcImRlbGltaXRlclwiLCBcIlwiLCBcInJlZ2V4cFwiXV0sXG4gICAgICBbLyhcXDopKFxccyopKEByZWdFeCkvLCBbXCJkZWxpbWl0ZXJcIiwgXCJcIiwgXCJyZWdleHBcIl1dLFxuICAgICAgWy8oXFxbKShcXHMqKShAcmVnRXgpLywgW1wiQGJyYWNrZXRzXCIsIFwiXCIsIFwicmVnZXhwXCJdXSxcbiAgICAgIFsvKFxcISkoXFxzKikoQHJlZ0V4KS8sIFtcImRlbGltaXRlclwiLCBcIlwiLCBcInJlZ2V4cFwiXV0sXG4gICAgICBbLyhcXCYpKFxccyopKEByZWdFeCkvLCBbXCJkZWxpbWl0ZXJcIiwgXCJcIiwgXCJyZWdleHBcIl1dLFxuICAgICAgWy8oXFx8KShcXHMqKShAcmVnRXgpLywgW1wiZGVsaW1pdGVyXCIsIFwiXCIsIFwicmVnZXhwXCJdXSxcbiAgICAgIFsvKFxcPykoXFxzKikoQHJlZ0V4KS8sIFtcImRlbGltaXRlclwiLCBcIlwiLCBcInJlZ2V4cFwiXV0sXG4gICAgICBbLyhcXHspKFxccyopKEByZWdFeCkvLCBbXCJAYnJhY2tldHNcIiwgXCJcIiwgXCJyZWdleHBcIl1dLFxuICAgICAgWy8oXFw7KShcXHMqKShAcmVnRXgpLywgW1wiXCIsIFwiXCIsIFwicmVnZXhwXCJdXSxcbiAgICAgIFtcbiAgICAgICAgL30vLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiJFMyPT1pbnRlcnBvbGF0ZWRzdHJpbmdcIjoge1xuICAgICAgICAgICAgICB0b2tlbjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgbmV4dDogXCJAcG9wXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiQGJyYWNrZXRzXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9Ac3ltYm9scy8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cXGQrW2VFXShbXFwtK10/XFxkKyk/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbL1xcZCtcXC5cXGQrKFtlRV1bXFwtK10/XFxkKyk/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbLzBbeFhdWzAtOWEtZkEtRl0rLywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgWy8wWzAtN10rKD8hXFxkKS8sIFwibnVtYmVyLm9jdGFsXCJdLFxuICAgICAgWy9cXGQrLywgXCJudW1iZXJcIl0sXG4gICAgICBbL1ssLl0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvXCJcIlwiLywgXCJzdHJpbmdcIiwgJ0BoZXJlc3RyaW5nLlwiXCJcIiddLFxuICAgICAgWy8nJycvLCBcInN0cmluZ1wiLCBcIkBoZXJlc3RyaW5nLicnJ1wiXSxcbiAgICAgIFtcbiAgICAgICAgL1wiLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogJ0BzdHJpbmcuXCInIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8nLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAc3RyaW5nLidcIiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBzdHJpbmc6IFtcbiAgICAgIFsvW15cIidcXCNcXFxcXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgWy9cXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFtcbiAgICAgICAgLyN7LyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICAnJFMyPT1cIic6IHtcbiAgICAgICAgICAgICAgdG9rZW46IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgIG5leHQ6IFwicm9vdC5pbnRlcnBvbGF0ZWRzdHJpbmdcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJzdHJpbmdcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1tcIiddLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQjPT0kUzJcIjogeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJzdHJpbmdcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvIy8sIFwic3RyaW5nXCJdXG4gICAgXSxcbiAgICBoZXJlc3RyaW5nOiBbXG4gICAgICBbXG4gICAgICAgIC8oXCJcIlwifCcnJykvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiJDE9PSRTMlwiOiB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bXiNcXFxcJ1wiXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvWydcIl0rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9cXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvI3svLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBuZXh0OiBcInJvb3QuaW50ZXJwb2xhdGVkc3RyaW5nXCIgfV0sXG4gICAgICBbLyMvLCBcInN0cmluZ1wiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXiNdKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvIyMjLywgXCJjb21tZW50XCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvIy8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgaGVyZXJlZ2V4cDogW1xuICAgICAgWy9bXlxcXFxcXC8jXSsvLCBcInJlZ2V4cFwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInJlZ2V4cFwiXSxcbiAgICAgIFsvIy4qJC8sIFwiY29tbWVudFwiXSxcbiAgICAgIFtcIi8vL1tpZ21dKlwiLCB7IHRva2VuOiBcInJlZ2V4cFwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvXFwvLywgXCJyZWdleHBcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULGFBQWE7QUFBQSxFQUNiLFVBQVU7QUFBQSxJQUNSLGNBQWMsQ0FBQyxPQUFPLEtBQUs7QUFBQSxJQUMzQixhQUFhO0FBQUEsRUFDZDtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFCO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtB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
