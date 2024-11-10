/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
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
  tokenPostfix: ".tcl",
  specialFunctions: [
    "set",
    "unset",
    "rename",
    "variable",
    "proc",
    "coroutine",
    "foreach",
    "incr",
    "append",
    "lappend",
    "linsert",
    "lreplace"
  ],
  mainFunctions: [
    "if",
    "then",
    "elseif",
    "else",
    "case",
    "switch",
    "while",
    "for",
    "break",
    "continue",
    "return",
    "package",
    "namespace",
    "catch",
    "exit",
    "eval",
    "expr",
    "uplevel",
    "upvar"
  ],
  builtinFunctions: [
    "file",
    "info",
    "concat",
    "join",
    "lindex",
    "list",
    "llength",
    "lrange",
    "lsearch",
    "lsort",
    "split",
    "array",
    "parray",
    "binary",
    "format",
    "regexp",
    "regsub",
    "scan",
    "string",
    "subst",
    "dict",
    "cd",
    "clock",
    "exec",
    "glob",
    "pid",
    "pwd",
    "close",
    "eof",
    "fblocked",
    "fconfigure",
    "fcopy",
    "fileevent",
    "flush",
    "gets",
    "open",
    "puts",
    "read",
    "seek",
    "socket",
    "tell",
    "interp",
    "after",
    "auto_execok",
    "auto_load",
    "auto_mkindex",
    "auto_reset",
    "bgerror",
    "error",
    "global",
    "history",
    "load",
    "source",
    "time",
    "trace",
    "unknown",
    "unset",
    "update",
    "vwait",
    "winfo",
    "wm",
    "bind",
    "event",
    "pack",
    "place",
    "grid",
    "font",
    "bell",
    "clipboard",
    "destroy",
    "focus",
    "grab",
    "lower",
    "option",
    "raise",
    "selection",
    "send",
    "tk",
    "tkwait",
    "tk_bisque",
    "tk_focusNext",
    "tk_focusPrev",
    "tk_focusFollowsMouse",
    "tk_popup",
    "tk_setPalette"
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  brackets: [
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" }
  ],
  escapes: /\\(?:[abfnrtv\\"'\[\]\{\};\$]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  variables: /(?:\$+(?:(?:\:\:?)?[a-zA-Z_]\w*)+)/,
  tokenizer: {
    root: [
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@specialFunctions": {
              token: "keyword.flow",
              next: "@specialFunc"
            },
            "@mainFunctions": "keyword",
            "@builtinFunctions": "variable",
            "@default": "operator.scss"
          }
        }
      ],
      [/\s+\-+(?!\d|\.)\w*|{\*}/, "metatag"],
      { include: "@whitespace" },
      [/[{}()\[\]]/, "@brackets"],
      [/@symbols/, "operator"],
      [/\$+(?:\:\:)?\{/, { token: "identifier", next: "@nestedVariable" }],
      [/@variables/, "type.identifier"],
      [/\.(?!\d|\.)[\w\-]*/, "operator.sql"],
      [/\d+(\.\d+)?/, "number"],
      [/\d+/, "number"],
      [/;/, "delimiter"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@dstring" }],
      [/'/, { token: "string.quote", bracket: "@open", next: "@sstring" }]
    ],
    dstring: [
      [/\[/, { token: "@brackets", next: "@nestedCall" }],
      [/\$+(?:\:\:)?\{/, { token: "identifier", next: "@nestedVariable" }],
      [/@variables/, "type.identifier"],
      [/[^\\$\[\]"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    sstring: [
      [/\[/, { token: "@brackets", next: "@nestedCall" }],
      [/\$+(?:\:\:)?\{/, { token: "identifier", next: "@nestedVariable" }],
      [/@variables/, "type.identifier"],
      [/[^\\$\[\]']+/, "string"],
      [/@escapes/, "string.escape"],
      [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/#.*\\$/, { token: "comment", next: "@newlineComment" }],
      [/#.*(?!\\)$/, "comment"]
    ],
    newlineComment: [
      [/.*\\$/, "comment"],
      [/.*(?!\\)$/, { token: "comment", next: "@pop" }]
    ],
    nestedVariable: [
      [/[^\{\}\$]+/, "type.identifier"],
      [/\}/, { token: "identifier", next: "@pop" }]
    ],
    nestedCall: [
      [/\[/, { token: "@brackets", next: "@nestedCall" }],
      [/\]/, { token: "@brackets", next: "@pop" }],
      { include: "root" }
    ],
    specialFunc: [
      [/"/, { token: "string", next: "@dstring" }],
      [/'/, { token: "string", next: "@sstring" }],
      [/\S+/, { token: "type", next: "@pop" }]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGNsLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL3RjbC90Y2wuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3RjbC90Y2wudHNcbnZhciBjb25mID0ge1xuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdXG59O1xudmFyIGxhbmd1YWdlID0ge1xuICB0b2tlblBvc3RmaXg6IFwiLnRjbFwiLFxuICBzcGVjaWFsRnVuY3Rpb25zOiBbXG4gICAgXCJzZXRcIixcbiAgICBcInVuc2V0XCIsXG4gICAgXCJyZW5hbWVcIixcbiAgICBcInZhcmlhYmxlXCIsXG4gICAgXCJwcm9jXCIsXG4gICAgXCJjb3JvdXRpbmVcIixcbiAgICBcImZvcmVhY2hcIixcbiAgICBcImluY3JcIixcbiAgICBcImFwcGVuZFwiLFxuICAgIFwibGFwcGVuZFwiLFxuICAgIFwibGluc2VydFwiLFxuICAgIFwibHJlcGxhY2VcIlxuICBdLFxuICBtYWluRnVuY3Rpb25zOiBbXG4gICAgXCJpZlwiLFxuICAgIFwidGhlblwiLFxuICAgIFwiZWxzZWlmXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJjYXNlXCIsXG4gICAgXCJzd2l0Y2hcIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJmb3JcIixcbiAgICBcImJyZWFrXCIsXG4gICAgXCJjb250aW51ZVwiLFxuICAgIFwicmV0dXJuXCIsXG4gICAgXCJwYWNrYWdlXCIsXG4gICAgXCJuYW1lc3BhY2VcIixcbiAgICBcImNhdGNoXCIsXG4gICAgXCJleGl0XCIsXG4gICAgXCJldmFsXCIsXG4gICAgXCJleHByXCIsXG4gICAgXCJ1cGxldmVsXCIsXG4gICAgXCJ1cHZhclwiXG4gIF0sXG4gIGJ1aWx0aW5GdW5jdGlvbnM6IFtcbiAgICBcImZpbGVcIixcbiAgICBcImluZm9cIixcbiAgICBcImNvbmNhdFwiLFxuICAgIFwiam9pblwiLFxuICAgIFwibGluZGV4XCIsXG4gICAgXCJsaXN0XCIsXG4gICAgXCJsbGVuZ3RoXCIsXG4gICAgXCJscmFuZ2VcIixcbiAgICBcImxzZWFyY2hcIixcbiAgICBcImxzb3J0XCIsXG4gICAgXCJzcGxpdFwiLFxuICAgIFwiYXJyYXlcIixcbiAgICBcInBhcnJheVwiLFxuICAgIFwiYmluYXJ5XCIsXG4gICAgXCJmb3JtYXRcIixcbiAgICBcInJlZ2V4cFwiLFxuICAgIFwicmVnc3ViXCIsXG4gICAgXCJzY2FuXCIsXG4gICAgXCJzdHJpbmdcIixcbiAgICBcInN1YnN0XCIsXG4gICAgXCJkaWN0XCIsXG4gICAgXCJjZFwiLFxuICAgIFwiY2xvY2tcIixcbiAgICBcImV4ZWNcIixcbiAgICBcImdsb2JcIixcbiAgICBcInBpZFwiLFxuICAgIFwicHdkXCIsXG4gICAgXCJjbG9zZVwiLFxuICAgIFwiZW9mXCIsXG4gICAgXCJmYmxvY2tlZFwiLFxuICAgIFwiZmNvbmZpZ3VyZVwiLFxuICAgIFwiZmNvcHlcIixcbiAgICBcImZpbGVldmVudFwiLFxuICAgIFwiZmx1c2hcIixcbiAgICBcImdldHNcIixcbiAgICBcIm9wZW5cIixcbiAgICBcInB1dHNcIixcbiAgICBcInJlYWRcIixcbiAgICBcInNlZWtcIixcbiAgICBcInNvY2tldFwiLFxuICAgIFwidGVsbFwiLFxuICAgIFwiaW50ZXJwXCIsXG4gICAgXCJhZnRlclwiLFxuICAgIFwiYXV0b19leGVjb2tcIixcbiAgICBcImF1dG9fbG9hZFwiLFxuICAgIFwiYXV0b19ta2luZGV4XCIsXG4gICAgXCJhdXRvX3Jlc2V0XCIsXG4gICAgXCJiZ2Vycm9yXCIsXG4gICAgXCJlcnJvclwiLFxuICAgIFwiZ2xvYmFsXCIsXG4gICAgXCJoaXN0b3J5XCIsXG4gICAgXCJsb2FkXCIsXG4gICAgXCJzb3VyY2VcIixcbiAgICBcInRpbWVcIixcbiAgICBcInRyYWNlXCIsXG4gICAgXCJ1bmtub3duXCIsXG4gICAgXCJ1bnNldFwiLFxuICAgIFwidXBkYXRlXCIsXG4gICAgXCJ2d2FpdFwiLFxuICAgIFwid2luZm9cIixcbiAgICBcIndtXCIsXG4gICAgXCJiaW5kXCIsXG4gICAgXCJldmVudFwiLFxuICAgIFwicGFja1wiLFxuICAgIFwicGxhY2VcIixcbiAgICBcImdyaWRcIixcbiAgICBcImZvbnRcIixcbiAgICBcImJlbGxcIixcbiAgICBcImNsaXBib2FyZFwiLFxuICAgIFwiZGVzdHJveVwiLFxuICAgIFwiZm9jdXNcIixcbiAgICBcImdyYWJcIixcbiAgICBcImxvd2VyXCIsXG4gICAgXCJvcHRpb25cIixcbiAgICBcInJhaXNlXCIsXG4gICAgXCJzZWxlY3Rpb25cIixcbiAgICBcInNlbmRcIixcbiAgICBcInRrXCIsXG4gICAgXCJ0a3dhaXRcIixcbiAgICBcInRrX2Jpc3F1ZVwiLFxuICAgIFwidGtfZm9jdXNOZXh0XCIsXG4gICAgXCJ0a19mb2N1c1ByZXZcIixcbiAgICBcInRrX2ZvY3VzRm9sbG93c01vdXNlXCIsXG4gICAgXCJ0a19wb3B1cFwiLFxuICAgIFwidGtfc2V0UGFsZXR0ZVwiXG4gIF0sXG4gIHN5bWJvbHM6IC9bPT48IX4/OiZ8K1xcLSpcXC9cXF4lXSsvLFxuICBicmFja2V0czogW1xuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIsIHRva2VuOiBcImRlbGltaXRlci5jdXJseVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIgfVxuICBdLFxuICBlc2NhcGVzOiAvXFxcXCg/OlthYmZucnR2XFxcXFwiJ1xcW1xcXVxce1xcfTtcXCRdfHhbMC05QS1GYS1mXXsxLDR9fHVbMC05QS1GYS1mXXs0fXxVWzAtOUEtRmEtZl17OH0pLyxcbiAgdmFyaWFibGVzOiAvKD86XFwkKyg/Oig/OlxcOlxcOj8pP1thLXpBLVpfXVxcdyopKykvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbXG4gICAgICAgIC9bYS16QS1aX11cXHcqLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBzcGVjaWFsRnVuY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgdG9rZW46IFwia2V5d29yZC5mbG93XCIsXG4gICAgICAgICAgICAgIG5leHQ6IFwiQHNwZWNpYWxGdW5jXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkBtYWluRnVuY3Rpb25zXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAYnVpbHRpbkZ1bmN0aW9uc1wiOiBcInZhcmlhYmxlXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwib3BlcmF0b3Iuc2Nzc1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9cXHMrXFwtKyg/IVxcZHxcXC4pXFx3Knx7XFwqfS8sIFwibWV0YXRhZ1wiXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9Ac3ltYm9scy8sIFwib3BlcmF0b3JcIl0sXG4gICAgICBbL1xcJCsoPzpcXDpcXDopP1xcey8sIHsgdG9rZW46IFwiaWRlbnRpZmllclwiLCBuZXh0OiBcIkBuZXN0ZWRWYXJpYWJsZVwiIH1dLFxuICAgICAgWy9AdmFyaWFibGVzLywgXCJ0eXBlLmlkZW50aWZpZXJcIl0sXG4gICAgICBbL1xcLig/IVxcZHxcXC4pW1xcd1xcLV0qLywgXCJvcGVyYXRvci5zcWxcIl0sXG4gICAgICBbL1xcZCsoXFwuXFxkKyk/LywgXCJudW1iZXJcIl0sXG4gICAgICBbL1xcZCsvLCBcIm51bWJlclwiXSxcbiAgICAgIFsvOy8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cIi8sIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIGJyYWNrZXQ6IFwiQG9wZW5cIiwgbmV4dDogXCJAZHN0cmluZ1wiIH1dLFxuICAgICAgWy8nLywgeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgYnJhY2tldDogXCJAb3BlblwiLCBuZXh0OiBcIkBzc3RyaW5nXCIgfV1cbiAgICBdLFxuICAgIGRzdHJpbmc6IFtcbiAgICAgIFsvXFxbLywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgbmV4dDogXCJAbmVzdGVkQ2FsbFwiIH1dLFxuICAgICAgWy9cXCQrKD86XFw6XFw6KT9cXHsvLCB7IHRva2VuOiBcImlkZW50aWZpZXJcIiwgbmV4dDogXCJAbmVzdGVkVmFyaWFibGVcIiB9XSxcbiAgICAgIFsvQHZhcmlhYmxlcy8sIFwidHlwZS5pZGVudGlmaWVyXCJdLFxuICAgICAgWy9bXlxcXFwkXFxbXFxdXCJdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXCIvLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBicmFja2V0OiBcIkBjbG9zZVwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc3N0cmluZzogW1xuICAgICAgWy9cXFsvLCB7IHRva2VuOiBcIkBicmFja2V0c1wiLCBuZXh0OiBcIkBuZXN0ZWRDYWxsXCIgfV0sXG4gICAgICBbL1xcJCsoPzpcXDpcXDopP1xcey8sIHsgdG9rZW46IFwiaWRlbnRpZmllclwiLCBuZXh0OiBcIkBuZXN0ZWRWYXJpYWJsZVwiIH1dLFxuICAgICAgWy9AdmFyaWFibGVzLywgXCJ0eXBlLmlkZW50aWZpZXJcIl0sXG4gICAgICBbL1teXFxcXCRcXFtcXF0nXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbLycvLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBicmFja2V0OiBcIkBjbG9zZVwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgd2hpdGVzcGFjZTogW1xuICAgICAgWy9bIFxcdFxcclxcbl0rLywgXCJ3aGl0ZVwiXSxcbiAgICAgIFsvIy4qXFxcXCQvLCB7IHRva2VuOiBcImNvbW1lbnRcIiwgbmV4dDogXCJAbmV3bGluZUNvbW1lbnRcIiB9XSxcbiAgICAgIFsvIy4qKD8hXFxcXCkkLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBuZXdsaW5lQ29tbWVudDogW1xuICAgICAgWy8uKlxcXFwkLywgXCJjb21tZW50XCJdLFxuICAgICAgWy8uKig/IVxcXFwpJC8sIHsgdG9rZW46IFwiY29tbWVudFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgbmVzdGVkVmFyaWFibGU6IFtcbiAgICAgIFsvW15cXHtcXH1cXCRdKy8sIFwidHlwZS5pZGVudGlmaWVyXCJdLFxuICAgICAgWy9cXH0vLCB7IHRva2VuOiBcImlkZW50aWZpZXJcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIG5lc3RlZENhbGw6IFtcbiAgICAgIFsvXFxbLywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgbmV4dDogXCJAbmVzdGVkQ2FsbFwiIH1dLFxuICAgICAgWy9cXF0vLCB7IHRva2VuOiBcIkBicmFja2V0c1wiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIHsgaW5jbHVkZTogXCJyb290XCIgfVxuICAgIF0sXG4gICAgc3BlY2lhbEZ1bmM6IFtcbiAgICAgIFsvXCIvLCB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBkc3RyaW5nXCIgfV0sXG4gICAgICBbLycvLCB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBzc3RyaW5nXCIgfV0sXG4gICAgICBbL1xcUysvLCB7IHRva2VuOiBcInR5cGVcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxFQUNWO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2Qsa0JBQWtCO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELGVBQWU7QUFBQSxJQUNiO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxTQUFTO0FBQUEsRUFDVCxVQUFVO0FBQUEsSUFDUixFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyx3QkFBeUI7QUFBQSxJQUN6RCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxrQkFBbUI7QUFBQSxJQUNuRCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxtQkFBb0I7QUFBQSxFQUNyRDtBQUFBLEVBQ0QsU0FBUztBQUFBLEVBQ1QsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLElBQ1QsTUFBTTtBQUFBLE1BQ0o7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFlBQ0wscUJBQXFCO0FBQUEsY0FDbkIsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLFlBQ1A7QUFBQSxZQUNELGtCQUFrQjtBQUFBLFlBQ2xCLHFCQUFxQjtBQUFBLFlBQ3JCLFlBQVk7QUFBQSxVQUNiO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsMkJBQTJCLFNBQVM7QUFBQSxNQUNyQyxFQUFFLFNBQVMsY0FBZTtBQUFBLE1BQzFCLENBQUMsY0FBYyxXQUFXO0FBQUEsTUFDMUIsQ0FBQyxZQUFZLFVBQVU7QUFBQSxNQUN2QixDQUFDLGtCQUFrQixFQUFFLE9BQU8sY0FBYyxNQUFNLGtCQUFpQixDQUFFO0FBQUEsTUFDbkUsQ0FBQyxjQUFjLGlCQUFpQjtBQUFBLE1BQ2hDLENBQUMsc0JBQXNCLGNBQWM7QUFBQSxNQUNyQyxDQUFDLGVBQWUsUUFBUTtBQUFBLE1BQ3hCLENBQUMsT0FBTyxRQUFRO0FBQUEsTUFDaEIsQ0FBQyxLQUFLLFdBQVc7QUFBQSxNQUNqQixDQUFDLEtBQUssRUFBRSxPQUFPLGdCQUFnQixTQUFTLFNBQVMsTUFBTSxZQUFZO0FBQUEsTUFDbkUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxnQkFBZ0IsU0FBUyxTQUFTLE1BQU0sWUFBWTtBQUFBLElBQ3BFO0FBQUEsSUFDRCxTQUFTO0FBQUEsTUFDUCxDQUFDLE1BQU0sRUFBRSxPQUFPLGFBQWEsTUFBTSxjQUFhLENBQUU7QUFBQSxNQUNsRCxDQUFDLGtCQUFrQixFQUFFLE9BQU8sY0FBYyxNQUFNLGtCQUFpQixDQUFFO0FBQUEsTUFDbkUsQ0FBQyxjQUFjLGlCQUFpQjtBQUFBLE1BQ2hDLENBQUMsZ0JBQWdCLFFBQVE7QUFBQSxNQUN6QixDQUFDLFlBQVksZUFBZTtBQUFBLE1BQzVCLENBQUMsS0FBSyxFQUFFLE9BQU8sZ0JBQWdCLFNBQVMsVUFBVSxNQUFNLFFBQVE7QUFBQSxJQUNqRTtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxNQUFNLEVBQUUsT0FBTyxhQUFhLE1BQU0sY0FBYSxDQUFFO0FBQUEsTUFDbEQsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLGNBQWMsTUFBTSxrQkFBaUIsQ0FBRTtBQUFBLE1BQ25FLENBQUMsY0FBYyxpQkFBaUI7QUFBQSxNQUNoQyxDQUFDLGdCQUFnQixRQUFRO0FBQUEsTUFDekIsQ0FBQyxZQUFZLGVBQWU7QUFBQSxNQUM1QixDQUFDLEtBQUssRUFBRSxPQUFPLGdCQUFnQixTQUFTLFVBQVUsTUFBTSxRQUFRO0FBQUEsSUFDakU7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNWLENBQUMsY0FBYyxPQUFPO0FBQUEsTUFDdEIsQ0FBQyxVQUFVLEVBQUUsT0FBTyxXQUFXLE1BQU0sa0JBQWlCLENBQUU7QUFBQSxNQUN4RCxDQUFDLGNBQWMsU0FBUztBQUFBLElBQ3pCO0FBQUEsSUFDRCxnQkFBZ0I7QUFBQSxNQUNkLENBQUMsU0FBUyxTQUFTO0FBQUEsTUFDbkIsQ0FBQyxhQUFhLEVBQUUsT0FBTyxXQUFXLE1BQU0sT0FBTSxDQUFFO0FBQUEsSUFDakQ7QUFBQSxJQUNELGdCQUFnQjtBQUFBLE1BQ2QsQ0FBQyxjQUFjLGlCQUFpQjtBQUFBLE1BQ2hDLENBQUMsTUFBTSxFQUFFLE9BQU8sY0FBYyxNQUFNLE9BQU0sQ0FBRTtBQUFBLElBQzdDO0FBQUEsSUFDRCxZQUFZO0FBQUEsTUFDVixDQUFDLE1BQU0sRUFBRSxPQUFPLGFBQWEsTUFBTSxjQUFhLENBQUU7QUFBQSxNQUNsRCxDQUFDLE1BQU0sRUFBRSxPQUFPLGFBQWEsTUFBTSxPQUFNLENBQUU7QUFBQSxNQUMzQyxFQUFFLFNBQVMsT0FBUTtBQUFBLElBQ3BCO0FBQUEsSUFDRCxhQUFhO0FBQUEsTUFDWCxDQUFDLEtBQUssRUFBRSxPQUFPLFVBQVUsTUFBTSxXQUFVLENBQUU7QUFBQSxNQUMzQyxDQUFDLEtBQUssRUFBRSxPQUFPLFVBQVUsTUFBTSxXQUFVLENBQUU7QUFBQSxNQUMzQyxDQUFDLE9BQU8sRUFBRSxPQUFPLFFBQVEsTUFBTSxPQUFNLENBQUU7QUFBQSxJQUN4QztBQUFBLEVBQ0Y7QUFDSDsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMF19
