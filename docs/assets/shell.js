/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
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
    { open: "'", close: "'" },
    { open: "`", close: "`" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "`", close: "`" }
  ]
};
var language = {
  defaultToken: "",
  ignoreCase: true,
  tokenPostfix: ".shell",
  brackets: [
    { token: "delimiter.bracket", open: "{", close: "}" },
    { token: "delimiter.parenthesis", open: "(", close: ")" },
    { token: "delimiter.square", open: "[", close: "]" }
  ],
  keywords: [
    "if",
    "then",
    "do",
    "else",
    "elif",
    "while",
    "until",
    "for",
    "in",
    "esac",
    "fi",
    "fin",
    "fil",
    "done",
    "exit",
    "set",
    "unset",
    "export",
    "function"
  ],
  builtins: [
    "ab",
    "awk",
    "bash",
    "beep",
    "cat",
    "cc",
    "cd",
    "chown",
    "chmod",
    "chroot",
    "clear",
    "cp",
    "curl",
    "cut",
    "diff",
    "echo",
    "find",
    "gawk",
    "gcc",
    "get",
    "git",
    "grep",
    "hg",
    "kill",
    "killall",
    "ln",
    "ls",
    "make",
    "mkdir",
    "openssl",
    "mv",
    "nc",
    "node",
    "npm",
    "ping",
    "ps",
    "restart",
    "rm",
    "rmdir",
    "sed",
    "service",
    "sh",
    "shopt",
    "shred",
    "source",
    "sort",
    "sleep",
    "ssh",
    "start",
    "stop",
    "su",
    "sudo",
    "svn",
    "tee",
    "telnet",
    "top",
    "touch",
    "vi",
    "vim",
    "wall",
    "wc",
    "wget",
    "who",
    "write",
    "yes",
    "zsh"
  ],
  startingWithDash: /\-+\w+/,
  identifiersWithDashes: /[a-zA-Z]\w+(?:@startingWithDash)+/,
  symbols: /[=><!~?&|+\-*\/\^;\.,]+/,
  tokenizer: {
    root: [
      [/@identifiersWithDashes/, ""],
      [/(\s)((?:@startingWithDash)+)/, ["white", "attribute.name"]],
      [
        /[a-zA-Z]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@builtins": "type.identifier",
            "@default": ""
          }
        }
      ],
      { include: "@whitespace" },
      { include: "@strings" },
      { include: "@parameters" },
      { include: "@heredoc" },
      [/[{}\[\]()]/, "@brackets"],
      [/@symbols/, "delimiter"],
      { include: "@numbers" },
      [/[,;]/, "delimiter"]
    ],
    whitespace: [
      [/\s+/, "white"],
      [/(^#!.*$)/, "metatag"],
      [/(^#.*$)/, "comment"]
    ],
    numbers: [
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, "number.hex"],
      [/\d+/, "number"]
    ],
    strings: [
      [/'/, "string", "@stringBody"],
      [/"/, "string", "@dblStringBody"]
    ],
    stringBody: [
      [/'/, "string", "@popall"],
      [/./, "string"]
    ],
    dblStringBody: [
      [/"/, "string", "@popall"],
      [/./, "string"]
    ],
    heredoc: [
      [
        /(<<[-<]?)(\s*)(['"`]?)([\w\-]+)(['"`]?)/,
        [
          "constants",
          "white",
          "string.heredoc.delimiter",
          "string.heredoc",
          "string.heredoc.delimiter"
        ]
      ]
    ],
    parameters: [
      [/\$\d+/, "variable.predefined"],
      [/\$\w+/, "variable"],
      [/\$[*@#?\-$!0_]/, "variable"],
      [/\$'/, "variable", "@parameterBodyQuote"],
      [/\$"/, "variable", "@parameterBodyDoubleQuote"],
      [/\$\(/, "variable", "@parameterBodyParen"],
      [/\$\{/, "variable", "@parameterBodyCurlyBrace"]
    ],
    parameterBodyQuote: [
      [/[^#:%*@\-!_']+/, "variable"],
      [/[#:%*@\-!_]/, "delimiter"],
      [/[']/, "variable", "@pop"]
    ],
    parameterBodyDoubleQuote: [
      [/[^#:%*@\-!_"]+/, "variable"],
      [/[#:%*@\-!_]/, "delimiter"],
      [/["]/, "variable", "@pop"]
    ],
    parameterBodyParen: [
      [/[^#:%*@\-!_)]+/, "variable"],
      [/[#:%*@\-!_]/, "delimiter"],
      [/[)]/, "variable", "@pop"]
    ],
    parameterBodyCurlyBrace: [
      [/[^#:%*@\-!_}]+/, "variable"],
      [/[#:%*@\-!_]/, "delimiter"],
      [/[}]/, "variable", "@pop"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlbGwuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvc2hlbGwvc2hlbGwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3NoZWxsL3NoZWxsLnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBsaW5lQ29tbWVudDogXCIjXCJcbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9LFxuICAgIHsgb3BlbjogXCJgXCIsIGNsb3NlOiBcImBcIiB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH0sXG4gICAgeyBvcGVuOiBcImBcIiwgY2xvc2U6IFwiYFwiIH1cbiAgXVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICBpZ25vcmVDYXNlOiB0cnVlLFxuICB0b2tlblBvc3RmaXg6IFwiLnNoZWxsXCIsXG4gIGJyYWNrZXRzOiBbXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiwgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLnNxdWFyZVwiLCBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH1cbiAgXSxcbiAga2V5d29yZHM6IFtcbiAgICBcImlmXCIsXG4gICAgXCJ0aGVuXCIsXG4gICAgXCJkb1wiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiZWxpZlwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcInVudGlsXCIsXG4gICAgXCJmb3JcIixcbiAgICBcImluXCIsXG4gICAgXCJlc2FjXCIsXG4gICAgXCJmaVwiLFxuICAgIFwiZmluXCIsXG4gICAgXCJmaWxcIixcbiAgICBcImRvbmVcIixcbiAgICBcImV4aXRcIixcbiAgICBcInNldFwiLFxuICAgIFwidW5zZXRcIixcbiAgICBcImV4cG9ydFwiLFxuICAgIFwiZnVuY3Rpb25cIlxuICBdLFxuICBidWlsdGluczogW1xuICAgIFwiYWJcIixcbiAgICBcImF3a1wiLFxuICAgIFwiYmFzaFwiLFxuICAgIFwiYmVlcFwiLFxuICAgIFwiY2F0XCIsXG4gICAgXCJjY1wiLFxuICAgIFwiY2RcIixcbiAgICBcImNob3duXCIsXG4gICAgXCJjaG1vZFwiLFxuICAgIFwiY2hyb290XCIsXG4gICAgXCJjbGVhclwiLFxuICAgIFwiY3BcIixcbiAgICBcImN1cmxcIixcbiAgICBcImN1dFwiLFxuICAgIFwiZGlmZlwiLFxuICAgIFwiZWNob1wiLFxuICAgIFwiZmluZFwiLFxuICAgIFwiZ2F3a1wiLFxuICAgIFwiZ2NjXCIsXG4gICAgXCJnZXRcIixcbiAgICBcImdpdFwiLFxuICAgIFwiZ3JlcFwiLFxuICAgIFwiaGdcIixcbiAgICBcImtpbGxcIixcbiAgICBcImtpbGxhbGxcIixcbiAgICBcImxuXCIsXG4gICAgXCJsc1wiLFxuICAgIFwibWFrZVwiLFxuICAgIFwibWtkaXJcIixcbiAgICBcIm9wZW5zc2xcIixcbiAgICBcIm12XCIsXG4gICAgXCJuY1wiLFxuICAgIFwibm9kZVwiLFxuICAgIFwibnBtXCIsXG4gICAgXCJwaW5nXCIsXG4gICAgXCJwc1wiLFxuICAgIFwicmVzdGFydFwiLFxuICAgIFwicm1cIixcbiAgICBcInJtZGlyXCIsXG4gICAgXCJzZWRcIixcbiAgICBcInNlcnZpY2VcIixcbiAgICBcInNoXCIsXG4gICAgXCJzaG9wdFwiLFxuICAgIFwic2hyZWRcIixcbiAgICBcInNvdXJjZVwiLFxuICAgIFwic29ydFwiLFxuICAgIFwic2xlZXBcIixcbiAgICBcInNzaFwiLFxuICAgIFwic3RhcnRcIixcbiAgICBcInN0b3BcIixcbiAgICBcInN1XCIsXG4gICAgXCJzdWRvXCIsXG4gICAgXCJzdm5cIixcbiAgICBcInRlZVwiLFxuICAgIFwidGVsbmV0XCIsXG4gICAgXCJ0b3BcIixcbiAgICBcInRvdWNoXCIsXG4gICAgXCJ2aVwiLFxuICAgIFwidmltXCIsXG4gICAgXCJ3YWxsXCIsXG4gICAgXCJ3Y1wiLFxuICAgIFwid2dldFwiLFxuICAgIFwid2hvXCIsXG4gICAgXCJ3cml0ZVwiLFxuICAgIFwieWVzXCIsXG4gICAgXCJ6c2hcIlxuICBdLFxuICBzdGFydGluZ1dpdGhEYXNoOiAvXFwtK1xcdysvLFxuICBpZGVudGlmaWVyc1dpdGhEYXNoZXM6IC9bYS16QS1aXVxcdysoPzpAc3RhcnRpbmdXaXRoRGFzaCkrLyxcbiAgc3ltYm9sczogL1s9Pjwhfj8mfCtcXC0qXFwvXFxeO1xcLixdKy8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIFsvQGlkZW50aWZpZXJzV2l0aERhc2hlcy8sIFwiXCJdLFxuICAgICAgWy8oXFxzKSgoPzpAc3RhcnRpbmdXaXRoRGFzaCkrKS8sIFtcIndoaXRlXCIsIFwiYXR0cmlidXRlLm5hbWVcIl1dLFxuICAgICAgW1xuICAgICAgICAvW2EtekEtWl1cXHcqLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBrZXl3b3Jkc1wiOiBcImtleXdvcmRcIixcbiAgICAgICAgICAgIFwiQGJ1aWx0aW5zXCI6IFwidHlwZS5pZGVudGlmaWVyXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBzdHJpbmdzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAcGFyYW1ldGVyc1wiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGhlcmVkb2NcIiB9LFxuICAgICAgWy9be31cXFtcXF0oKV0vLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFsvQHN5bWJvbHMvLCBcImRlbGltaXRlclwiXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAbnVtYmVyc1wiIH0sXG4gICAgICBbL1ssO10vLCBcImRlbGltaXRlclwiXVxuICAgIF0sXG4gICAgd2hpdGVzcGFjZTogW1xuICAgICAgWy9cXHMrLywgXCJ3aGl0ZVwiXSxcbiAgICAgIFsvKF4jIS4qJCkvLCBcIm1ldGF0YWdcIl0sXG4gICAgICBbLyheIy4qJCkvLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIG51bWJlcnM6IFtcbiAgICAgIFsvXFxkKlxcLlxcZCsoW2VFXVtcXC0rXT9cXGQrKT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvMFt4WF1bMC05YS1mQS1GX10qWzAtOWEtZkEtRl0vLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbL1xcZCsvLCBcIm51bWJlclwiXVxuICAgIF0sXG4gICAgc3RyaW5nczogW1xuICAgICAgWy8nLywgXCJzdHJpbmdcIiwgXCJAc3RyaW5nQm9keVwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiLCBcIkBkYmxTdHJpbmdCb2R5XCJdXG4gICAgXSxcbiAgICBzdHJpbmdCb2R5OiBbXG4gICAgICBbLycvLCBcInN0cmluZ1wiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbLy4vLCBcInN0cmluZ1wiXVxuICAgIF0sXG4gICAgZGJsU3RyaW5nQm9keTogW1xuICAgICAgWy9cIi8sIFwic3RyaW5nXCIsIFwiQHBvcGFsbFwiXSxcbiAgICAgIFsvLi8sIFwic3RyaW5nXCJdXG4gICAgXSxcbiAgICBoZXJlZG9jOiBbXG4gICAgICBbXG4gICAgICAgIC8oPDxbLTxdPykoXFxzKikoWydcImBdPykoW1xcd1xcLV0rKShbJ1wiYF0/KS8sXG4gICAgICAgIFtcbiAgICAgICAgICBcImNvbnN0YW50c1wiLFxuICAgICAgICAgIFwid2hpdGVcIixcbiAgICAgICAgICBcInN0cmluZy5oZXJlZG9jLmRlbGltaXRlclwiLFxuICAgICAgICAgIFwic3RyaW5nLmhlcmVkb2NcIixcbiAgICAgICAgICBcInN0cmluZy5oZXJlZG9jLmRlbGltaXRlclwiXG4gICAgICAgIF1cbiAgICAgIF1cbiAgICBdLFxuICAgIHBhcmFtZXRlcnM6IFtcbiAgICAgIFsvXFwkXFxkKy8sIFwidmFyaWFibGUucHJlZGVmaW5lZFwiXSxcbiAgICAgIFsvXFwkXFx3Ky8sIFwidmFyaWFibGVcIl0sXG4gICAgICBbL1xcJFsqQCM/XFwtJCEwX10vLCBcInZhcmlhYmxlXCJdLFxuICAgICAgWy9cXCQnLywgXCJ2YXJpYWJsZVwiLCBcIkBwYXJhbWV0ZXJCb2R5UXVvdGVcIl0sXG4gICAgICBbL1xcJFwiLywgXCJ2YXJpYWJsZVwiLCBcIkBwYXJhbWV0ZXJCb2R5RG91YmxlUXVvdGVcIl0sXG4gICAgICBbL1xcJFxcKC8sIFwidmFyaWFibGVcIiwgXCJAcGFyYW1ldGVyQm9keVBhcmVuXCJdLFxuICAgICAgWy9cXCRcXHsvLCBcInZhcmlhYmxlXCIsIFwiQHBhcmFtZXRlckJvZHlDdXJseUJyYWNlXCJdXG4gICAgXSxcbiAgICBwYXJhbWV0ZXJCb2R5UXVvdGU6IFtcbiAgICAgIFsvW14jOiUqQFxcLSFfJ10rLywgXCJ2YXJpYWJsZVwiXSxcbiAgICAgIFsvWyM6JSpAXFwtIV9dLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1snXS8sIFwidmFyaWFibGVcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBwYXJhbWV0ZXJCb2R5RG91YmxlUXVvdGU6IFtcbiAgICAgIFsvW14jOiUqQFxcLSFfXCJdKy8sIFwidmFyaWFibGVcIl0sXG4gICAgICBbL1sjOiUqQFxcLSFfXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9bXCJdLywgXCJ2YXJpYWJsZVwiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIHBhcmFtZXRlckJvZHlQYXJlbjogW1xuICAgICAgWy9bXiM6JSpAXFwtIV8pXSsvLCBcInZhcmlhYmxlXCJdLFxuICAgICAgWy9bIzolKkBcXC0hX10vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvWyldLywgXCJ2YXJpYWJsZVwiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIHBhcmFtZXRlckJvZHlDdXJseUJyYWNlOiBbXG4gICAgICBbL1teIzolKkBcXC0hX31dKy8sIFwidmFyaWFibGVcIl0sXG4gICAgICBbL1sjOiUqQFxcLSFfXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9bfV0vLCBcInZhcmlhYmxlXCIsIFwiQHBvcFwiXVxuICAgIF1cbiAgfVxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFHLElBQUMsT0FBTztBQUFBLEVBQ1QsVUFBVTtBQUFBLElBQ1IsYUFBYTtBQUFBLEVBQ2Q7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxFQUNWO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsWUFBWTtBQUFBLEVBQ1osY0FBYztBQUFBLEVBQ2QsVUFBVTtBQUFBLElBQ1IsRUFBRSxPQUFPLHFCQUFxQixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDckQsRUFBRSxPQUFPLHlCQUF5QixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekQsRUFBRSxPQUFPLG9CQUFvQixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDckQ7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELGtCQUFrQjtBQUFBLEVBQ2xCLHVCQUF1QjtBQUFBLEVBQ3ZCLFNBQVM7QUFBQSxFQUNULFdBQVc7QUFBQSxJQUNULE1BQU07QUFBQSxNQUNKLENBQUMsMEJBQTBCLEVBQUU7QUFBQSxNQUM3QixDQUFDLGdDQUFnQyxDQUFDLFNBQVMsZ0JBQWdCLENBQUM7QUFBQSxNQUM1RDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxhQUFhO0FBQUEsWUFDYixhQUFhO0FBQUEsWUFDYixZQUFZO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxFQUFFLFNBQVMsY0FBZTtBQUFBLE1BQzFCLEVBQUUsU0FBUyxXQUFZO0FBQUEsTUFDdkIsRUFBRSxTQUFTLGNBQWU7QUFBQSxNQUMxQixFQUFFLFNBQVMsV0FBWTtBQUFBLE1BQ3ZCLENBQUMsY0FBYyxXQUFXO0FBQUEsTUFDMUIsQ0FBQyxZQUFZLFdBQVc7QUFBQSxNQUN4QixFQUFFLFNBQVMsV0FBWTtBQUFBLE1BQ3ZCLENBQUMsUUFBUSxXQUFXO0FBQUEsSUFDckI7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNWLENBQUMsT0FBTyxPQUFPO0FBQUEsTUFDZixDQUFDLFlBQVksU0FBUztBQUFBLE1BQ3RCLENBQUMsV0FBVyxTQUFTO0FBQUEsSUFDdEI7QUFBQSxJQUNELFNBQVM7QUFBQSxNQUNQLENBQUMsNEJBQTRCLGNBQWM7QUFBQSxNQUMzQyxDQUFDLGlDQUFpQyxZQUFZO0FBQUEsTUFDOUMsQ0FBQyxPQUFPLFFBQVE7QUFBQSxJQUNqQjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxLQUFLLFVBQVUsYUFBYTtBQUFBLE1BQzdCLENBQUMsS0FBSyxVQUFVLGdCQUFnQjtBQUFBLElBQ2pDO0FBQUEsSUFDRCxZQUFZO0FBQUEsTUFDVixDQUFDLEtBQUssVUFBVSxTQUFTO0FBQUEsTUFDekIsQ0FBQyxLQUFLLFFBQVE7QUFBQSxJQUNmO0FBQUEsSUFDRCxlQUFlO0FBQUEsTUFDYixDQUFDLEtBQUssVUFBVSxTQUFTO0FBQUEsTUFDekIsQ0FBQyxLQUFLLFFBQVE7QUFBQSxJQUNmO0FBQUEsSUFDRCxTQUFTO0FBQUEsTUFDUDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNWLENBQUMsU0FBUyxxQkFBcUI7QUFBQSxNQUMvQixDQUFDLFNBQVMsVUFBVTtBQUFBLE1BQ3BCLENBQUMsa0JBQWtCLFVBQVU7QUFBQSxNQUM3QixDQUFDLE9BQU8sWUFBWSxxQkFBcUI7QUFBQSxNQUN6QyxDQUFDLE9BQU8sWUFBWSwyQkFBMkI7QUFBQSxNQUMvQyxDQUFDLFFBQVEsWUFBWSxxQkFBcUI7QUFBQSxNQUMxQyxDQUFDLFFBQVEsWUFBWSwwQkFBMEI7QUFBQSxJQUNoRDtBQUFBLElBQ0Qsb0JBQW9CO0FBQUEsTUFDbEIsQ0FBQyxrQkFBa0IsVUFBVTtBQUFBLE1BQzdCLENBQUMsZUFBZSxXQUFXO0FBQUEsTUFDM0IsQ0FBQyxPQUFPLFlBQVksTUFBTTtBQUFBLElBQzNCO0FBQUEsSUFDRCwwQkFBMEI7QUFBQSxNQUN4QixDQUFDLGtCQUFrQixVQUFVO0FBQUEsTUFDN0IsQ0FBQyxlQUFlLFdBQVc7QUFBQSxNQUMzQixDQUFDLE9BQU8sWUFBWSxNQUFNO0FBQUEsSUFDM0I7QUFBQSxJQUNELG9CQUFvQjtBQUFBLE1BQ2xCLENBQUMsa0JBQWtCLFVBQVU7QUFBQSxNQUM3QixDQUFDLGVBQWUsV0FBVztBQUFBLE1BQzNCLENBQUMsT0FBTyxZQUFZLE1BQU07QUFBQSxJQUMzQjtBQUFBLElBQ0QseUJBQXlCO0FBQUEsTUFDdkIsQ0FBQyxrQkFBa0IsVUFBVTtBQUFBLE1BQzdCLENBQUMsZUFBZSxXQUFXO0FBQUEsTUFDM0IsQ0FBQyxPQUFPLFlBQVksTUFBTTtBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUNIOyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
