/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: "REM"
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
    { open: '"', close: '"' }
  ],
  surroundingPairs: [
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*(::\\s*|REM\\s+)#region"),
      end: new RegExp("^\\s*(::\\s*|REM\\s+)#endregion")
    }
  }
};
var language = {
  defaultToken: "",
  ignoreCase: true,
  tokenPostfix: ".bat",
  brackets: [
    { token: "delimiter.bracket", open: "{", close: "}" },
    { token: "delimiter.parenthesis", open: "(", close: ")" },
    { token: "delimiter.square", open: "[", close: "]" }
  ],
  keywords: /call|defined|echo|errorlevel|exist|for|goto|if|pause|set|shift|start|title|not|pushd|popd/,
  symbols: /[=><!~?&|+\-*\/\^;\.,]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      [/^(\s*)(rem(?:\s.*|))$/, ["", "comment"]],
      [/(\@?)(@keywords)(?!\w)/, [{ token: "keyword" }, { token: "keyword.$2" }]],
      [/[ \t\r\n]+/, ""],
      [/setlocal(?!\w)/, "keyword.tag-setlocal"],
      [/endlocal(?!\w)/, "keyword.tag-setlocal"],
      [/[a-zA-Z_]\w*/, ""],
      [/:\w*/, "metatag"],
      [/%[^%]+%/, "variable"],
      [/%%[\w]+(?!\w)/, "variable"],
      [/[{}()\[\]]/, "@brackets"],
      [/@symbols/, "delimiter"],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, "number.hex"],
      [/\d+/, "number"],
      [/[;,.]/, "delimiter"],
      [/"/, "string", '@string."'],
      [/'/, "string", "@string.'"]
    ],
    string: [
      [
        /[^\\"'%]+/,
        {
          cases: {
            "@eos": { token: "string", next: "@popall" },
            "@default": "string"
          }
        }
      ],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/%[\w ]+%/, "variable"],
      [/%%[\w]+(?!\w)/, "variable"],
      [
        /["']/,
        {
          cases: {
            "$#==$S2": { token: "string", next: "@pop" },
            "@default": "string"
          }
        }
      ],
      [/$/, "string", "@popall"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0LmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2JhdC9iYXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2JhdC9iYXQudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIlJFTVwiXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfVxuICBdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9XG4gIF0sXG4gIGZvbGRpbmc6IHtcbiAgICBtYXJrZXJzOiB7XG4gICAgICBzdGFydDogbmV3IFJlZ0V4cChcIl5cXFxccyooOjpcXFxccyp8UkVNXFxcXHMrKSNyZWdpb25cIiksXG4gICAgICBlbmQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqKDo6XFxcXHMqfFJFTVxcXFxzKykjZW5kcmVnaW9uXCIpXG4gICAgfVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIGlnbm9yZUNhc2U6IHRydWUsXG4gIHRva2VuUG9zdGZpeDogXCIuYmF0XCIsXG4gIGJyYWNrZXRzOiBbXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiwgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLnNxdWFyZVwiLCBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH1cbiAgXSxcbiAga2V5d29yZHM6IC9jYWxsfGRlZmluZWR8ZWNob3xlcnJvcmxldmVsfGV4aXN0fGZvcnxnb3RvfGlmfHBhdXNlfHNldHxzaGlmdHxzdGFydHx0aXRsZXxub3R8cHVzaGR8cG9wZC8sXG4gIHN5bWJvbHM6IC9bPT48IX4/JnwrXFwtKlxcL1xcXjtcXC4sXSsvLFxuICBlc2NhcGVzOiAvXFxcXCg/OlthYmZucnR2XFxcXFwiJ118eFswLTlBLUZhLWZdezEsNH18dVswLTlBLUZhLWZdezR9fFVbMC05QS1GYS1mXXs4fSkvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbL14oXFxzKikocmVtKD86XFxzLip8KSkkLywgW1wiXCIsIFwiY29tbWVudFwiXV0sXG4gICAgICBbLyhcXEA/KShAa2V5d29yZHMpKD8hXFx3KS8sIFt7IHRva2VuOiBcImtleXdvcmRcIiB9LCB7IHRva2VuOiBcImtleXdvcmQuJDJcIiB9XV0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIlwiXSxcbiAgICAgIFsvc2V0bG9jYWwoPyFcXHcpLywgXCJrZXl3b3JkLnRhZy1zZXRsb2NhbFwiXSxcbiAgICAgIFsvZW5kbG9jYWwoPyFcXHcpLywgXCJrZXl3b3JkLnRhZy1zZXRsb2NhbFwiXSxcbiAgICAgIFsvW2EtekEtWl9dXFx3Ki8sIFwiXCJdLFxuICAgICAgWy86XFx3Ki8sIFwibWV0YXRhZ1wiXSxcbiAgICAgIFsvJVteJV0rJS8sIFwidmFyaWFibGVcIl0sXG4gICAgICBbLyUlW1xcd10rKD8hXFx3KS8sIFwidmFyaWFibGVcIl0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9Ac3ltYm9scy8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cXGQqXFwuXFxkKyhbZUVdW1xcLStdP1xcZCspPy8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy8wW3hYXVswLTlhLWZBLUZfXSpbMC05YS1mQS1GXS8sIFwibnVtYmVyLmhleFwiXSxcbiAgICAgIFsvXFxkKy8sIFwibnVtYmVyXCJdLFxuICAgICAgWy9bOywuXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nXCIsICdAc3RyaW5nLlwiJ10sXG4gICAgICBbLycvLCBcInN0cmluZ1wiLCBcIkBzdHJpbmcuJ1wiXVxuICAgIF0sXG4gICAgc3RyaW5nOiBbXG4gICAgICBbXG4gICAgICAgIC9bXlxcXFxcIiclXSsvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGVvc1wiOiB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BhbGxcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvJVtcXHcgXSslLywgXCJ2YXJpYWJsZVwiXSxcbiAgICAgIFsvJSVbXFx3XSsoPyFcXHcpLywgXCJ2YXJpYWJsZVwiXSxcbiAgICAgIFtcbiAgICAgICAgL1tcIiddLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQjPT0kUzJcIjogeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJzdHJpbmdcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvJC8sIFwic3RyaW5nXCIsIFwiQHBvcGFsbFwiXVxuICAgIF1cbiAgfVxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFHLElBQUMsT0FBTztBQUFBLEVBQ1QsVUFBVTtBQUFBLElBQ1IsYUFBYTtBQUFBLEVBQ2Q7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxFQUNWO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0Qsa0JBQWtCO0FB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
