/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: "#",
    blockComment: ["/*", "*/"]
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
    { open: '"', close: '"', notIn: ["string"] }
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
  tokenPostfix: ".hcl",
  keywords: [
    "var",
    "local",
    "path",
    "for_each",
    "any",
    "string",
    "number",
    "bool",
    "true",
    "false",
    "null",
    "if ",
    "else ",
    "endif ",
    "for ",
    "in",
    "endfor"
  ],
  operators: [
    "=",
    ">=",
    "<=",
    "==",
    "!=",
    "+",
    "-",
    "*",
    "/",
    "%",
    "&&",
    "||",
    "!",
    "<",
    ">",
    "?",
    "...",
    ":"
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  terraformFunctions: /(abs|ceil|floor|log|max|min|pow|signum|chomp|format|formatlist|indent|join|lower|regex|regexall|replace|split|strrev|substr|title|trimspace|upper|chunklist|coalesce|coalescelist|compact|concat|contains|distinct|element|flatten|index|keys|length|list|lookup|map|matchkeys|merge|range|reverse|setintersection|setproduct|setunion|slice|sort|transpose|values|zipmap|base64decode|base64encode|base64gzip|csvdecode|jsondecode|jsonencode|urlencode|yamldecode|yamlencode|abspath|dirname|pathexpand|basename|file|fileexists|fileset|filebase64|templatefile|formatdate|timeadd|timestamp|base64sha256|base64sha512|bcrypt|filebase64sha256|filebase64sha512|filemd5|filemd1|filesha256|filesha512|md5|rsadecrypt|sha1|sha256|sha512|uuid|uuidv5|cidrhost|cidrnetmask|cidrsubnet|tobool|tolist|tomap|tonumber|toset|tostring)/,
  terraformMainBlocks: /(module|data|terraform|resource|provider|variable|output|locals)/,
  tokenizer: {
    root: [
      [
        /^@terraformMainBlocks([ \t]*)([\w-]+|"[\w-]+"|)([ \t]*)([\w-]+|"[\w-]+"|)([ \t]*)(\{)/,
        ["type", "", "string", "", "string", "", "@brackets"]
      ],
      [
        /(\w+[ \t]+)([ \t]*)([\w-]+|"[\w-]+"|)([ \t]*)([\w-]+|"[\w-]+"|)([ \t]*)(\{)/,
        ["identifier", "", "string", "", "string", "", "@brackets"]
      ],
      [
        /(\w+[ \t]+)([ \t]*)([\w-]+|"[\w-]+"|)([ \t]*)([\w-]+|"[\w-]+"|)(=)(\{)/,
        ["identifier", "", "string", "", "operator", "", "@brackets"]
      ],
      { include: "@terraform" }
    ],
    terraform: [
      [/@terraformFunctions(\()/, ["type", "@brackets"]],
      [
        /[a-zA-Z_]\w*-*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@default": "variable"
          }
        }
      ],
      { include: "@whitespace" },
      { include: "@heredoc" },
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": ""
          }
        }
      ],
      [/\d*\d+[eE]([\-+]?\d+)?/, "number.float"],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/\d[\d']*/, "number"],
      [/\d/, "number"],
      [/[;,.]/, "delimiter"],
      [/"/, "string", "@string"],
      [/'/, "invalid"]
    ],
    heredoc: [
      [/<<[-]*\s*["]?([\w\-]+)["]?/, { token: "string.heredoc.delimiter", next: "@heredocBody.$1" }]
    ],
    heredocBody: [
      [
        /([\w\-]+)$/,
        {
          cases: {
            "$1==$S2": [
              {
                token: "string.heredoc.delimiter",
                next: "@popall"
              }
            ],
            "@default": "string.heredoc"
          }
        }
      ],
      [/./, "string.heredoc"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
      [/#.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    string: [
      [/\$\{/, { token: "delimiter", next: "@stringExpression" }],
      [/[^\\"\$]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@popall"]
    ],
    stringInsideExpression: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ],
    stringExpression: [
      [/\}/, { token: "delimiter", next: "@pop" }],
      [/"/, "string", "@stringInsideExpression"],
      { include: "@terraform" }
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGNsLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2hjbC9oY2wuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2hjbC9oY2wudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIiNcIixcbiAgICBibG9ja0NvbW1lbnQ6IFtcIi8qXCIsIFwiKi9cIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJywgbm90SW46IFtcInN0cmluZ1wiXSB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH1cbiAgXVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiLmhjbFwiLFxuICBrZXl3b3JkczogW1xuICAgIFwidmFyXCIsXG4gICAgXCJsb2NhbFwiLFxuICAgIFwicGF0aFwiLFxuICAgIFwiZm9yX2VhY2hcIixcbiAgICBcImFueVwiLFxuICAgIFwic3RyaW5nXCIsXG4gICAgXCJudW1iZXJcIixcbiAgICBcImJvb2xcIixcbiAgICBcInRydWVcIixcbiAgICBcImZhbHNlXCIsXG4gICAgXCJudWxsXCIsXG4gICAgXCJpZiBcIixcbiAgICBcImVsc2UgXCIsXG4gICAgXCJlbmRpZiBcIixcbiAgICBcImZvciBcIixcbiAgICBcImluXCIsXG4gICAgXCJlbmRmb3JcIlxuICBdLFxuICBvcGVyYXRvcnM6IFtcbiAgICBcIj1cIixcbiAgICBcIj49XCIsXG4gICAgXCI8PVwiLFxuICAgIFwiPT1cIixcbiAgICBcIiE9XCIsXG4gICAgXCIrXCIsXG4gICAgXCItXCIsXG4gICAgXCIqXCIsXG4gICAgXCIvXCIsXG4gICAgXCIlXCIsXG4gICAgXCImJlwiLFxuICAgIFwifHxcIixcbiAgICBcIiFcIixcbiAgICBcIjxcIixcbiAgICBcIj5cIixcbiAgICBcIj9cIixcbiAgICBcIi4uLlwiLFxuICAgIFwiOlwiXG4gIF0sXG4gIHN5bWJvbHM6IC9bPT48IX4/OiZ8K1xcLSpcXC9cXF4lXSsvLFxuICBlc2NhcGVzOiAvXFxcXCg/OlthYmZucnR2XFxcXFwiJ118eFswLTlBLUZhLWZdezEsNH18dVswLTlBLUZhLWZdezR9fFVbMC05QS1GYS1mXXs4fSkvLFxuICB0ZXJyYWZvcm1GdW5jdGlvbnM6IC8oYWJzfGNlaWx8Zmxvb3J8bG9nfG1heHxtaW58cG93fHNpZ251bXxjaG9tcHxmb3JtYXR8Zm9ybWF0bGlzdHxpbmRlbnR8am9pbnxsb3dlcnxyZWdleHxyZWdleGFsbHxyZXBsYWNlfHNwbGl0fHN0cnJldnxzdWJzdHJ8dGl0bGV8dHJpbXNwYWNlfHVwcGVyfGNodW5rbGlzdHxjb2FsZXNjZXxjb2FsZXNjZWxpc3R8Y29tcGFjdHxjb25jYXR8Y29udGFpbnN8ZGlzdGluY3R8ZWxlbWVudHxmbGF0dGVufGluZGV4fGtleXN8bGVuZ3RofGxpc3R8bG9va3VwfG1hcHxtYXRjaGtleXN8bWVyZ2V8cmFuZ2V8cmV2ZXJzZXxzZXRpbnRlcnNlY3Rpb258c2V0cHJvZHVjdHxzZXR1bmlvbnxzbGljZXxzb3J0fHRyYW5zcG9zZXx2YWx1ZXN8emlwbWFwfGJhc2U2NGRlY29kZXxiYXNlNjRlbmNvZGV8YmFzZTY0Z3ppcHxjc3ZkZWNvZGV8anNvbmRlY29kZXxqc29uZW5jb2RlfHVybGVuY29kZXx5YW1sZGVjb2RlfHlhbWxlbmNvZGV8YWJzcGF0aHxkaXJuYW1lfHBhdGhleHBhbmR8YmFzZW5hbWV8ZmlsZXxmaWxlZXhpc3RzfGZpbGVzZXR8ZmlsZWJhc2U2NHx0ZW1wbGF0ZWZpbGV8Zm9ybWF0ZGF0ZXx0aW1lYWRkfHRpbWVzdGFtcHxiYXNlNjRzaGEyNTZ8YmFzZTY0c2hhNTEyfGJjcnlwdHxmaWxlYmFzZTY0c2hhMjU2fGZpbGViYXNlNjRzaGE1MTJ8ZmlsZW1kNXxmaWxlbWQxfGZpbGVzaGEyNTZ8ZmlsZXNoYTUxMnxtZDV8cnNhZGVjcnlwdHxzaGExfHNoYTI1NnxzaGE1MTJ8dXVpZHx1dWlkdjV8Y2lkcmhvc3R8Y2lkcm5ldG1hc2t8Y2lkcnN1Ym5ldHx0b2Jvb2x8dG9saXN0fHRvbWFwfHRvbnVtYmVyfHRvc2V0fHRvc3RyaW5nKS8sXG4gIHRlcnJhZm9ybU1haW5CbG9ja3M6IC8obW9kdWxlfGRhdGF8dGVycmFmb3JtfHJlc291cmNlfHByb3ZpZGVyfHZhcmlhYmxlfG91dHB1dHxsb2NhbHMpLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgW1xuICAgICAgICAvXkB0ZXJyYWZvcm1NYWluQmxvY2tzKFsgXFx0XSopKFtcXHctXSt8XCJbXFx3LV0rXCJ8KShbIFxcdF0qKShbXFx3LV0rfFwiW1xcdy1dK1wifCkoWyBcXHRdKikoXFx7KS8sXG4gICAgICAgIFtcInR5cGVcIiwgXCJcIiwgXCJzdHJpbmdcIiwgXCJcIiwgXCJzdHJpbmdcIiwgXCJcIiwgXCJAYnJhY2tldHNcIl1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8oXFx3K1sgXFx0XSspKFsgXFx0XSopKFtcXHctXSt8XCJbXFx3LV0rXCJ8KShbIFxcdF0qKShbXFx3LV0rfFwiW1xcdy1dK1wifCkoWyBcXHRdKikoXFx7KS8sXG4gICAgICAgIFtcImlkZW50aWZpZXJcIiwgXCJcIiwgXCJzdHJpbmdcIiwgXCJcIiwgXCJzdHJpbmdcIiwgXCJcIiwgXCJAYnJhY2tldHNcIl1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8oXFx3K1sgXFx0XSspKFsgXFx0XSopKFtcXHctXSt8XCJbXFx3LV0rXCJ8KShbIFxcdF0qKShbXFx3LV0rfFwiW1xcdy1dK1wifCkoPSkoXFx7KS8sXG4gICAgICAgIFtcImlkZW50aWZpZXJcIiwgXCJcIiwgXCJzdHJpbmdcIiwgXCJcIiwgXCJvcGVyYXRvclwiLCBcIlwiLCBcIkBicmFja2V0c1wiXVxuICAgICAgXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAdGVycmFmb3JtXCIgfVxuICAgIF0sXG4gICAgdGVycmFmb3JtOiBbXG4gICAgICBbL0B0ZXJyYWZvcm1GdW5jdGlvbnMoXFwoKS8sIFtcInR5cGVcIiwgXCJAYnJhY2tldHNcIl1dLFxuICAgICAgW1xuICAgICAgICAvW2EtekEtWl9dXFx3Ki0qLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBrZXl3b3Jkc1wiOiB7IHRva2VuOiBcImtleXdvcmQuJDBcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInZhcmlhYmxlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBoZXJlZG9jXCIgfSxcbiAgICAgIFsvW3t9KClcXFtcXF1dLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbL1s8Pl0oPyFAc3ltYm9scykvLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFtcbiAgICAgICAgL0BzeW1ib2xzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBvcGVyYXRvcnNcIjogXCJvcGVyYXRvclwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9cXGQqXFxkK1tlRV0oW1xcLStdP1xcZCspPy8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy9cXGQqXFwuXFxkKyhbZUVdW1xcLStdP1xcZCspPy8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy9cXGRbXFxkJ10qLywgXCJudW1iZXJcIl0sXG4gICAgICBbL1xcZC8sIFwibnVtYmVyXCJdLFxuICAgICAgWy9bOywuXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nXCIsIFwiQHN0cmluZ1wiXSxcbiAgICAgIFsvJy8sIFwiaW52YWxpZFwiXVxuICAgIF0sXG4gICAgaGVyZWRvYzogW1xuICAgICAgWy88PFstXSpcXHMqW1wiXT8oW1xcd1xcLV0rKVtcIl0/LywgeyB0b2tlbjogXCJzdHJpbmcuaGVyZWRvYy5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAaGVyZWRvY0JvZHkuJDFcIiB9XVxuICAgIF0sXG4gICAgaGVyZWRvY0JvZHk6IFtcbiAgICAgIFtcbiAgICAgICAgLyhbXFx3XFwtXSspJC8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCIkMT09JFMyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRva2VuOiBcInN0cmluZy5oZXJlZG9jLmRlbGltaXRlclwiLFxuICAgICAgICAgICAgICAgIG5leHQ6IFwiQHBvcGFsbFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwic3RyaW5nLmhlcmVkb2NcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvLi8sIFwic3RyaW5nLmhlcmVkb2NcIl1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwiXCJdLFxuICAgICAgWy9cXC9cXCovLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwvLiokLywgXCJjb21tZW50XCJdLFxuICAgICAgWy8jLiokLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1teXFwvKl0rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXFwvKl0vLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIHN0cmluZzogW1xuICAgICAgWy9cXCRcXHsvLCB7IHRva2VuOiBcImRlbGltaXRlclwiLCBuZXh0OiBcIkBzdHJpbmdFeHByZXNzaW9uXCIgfV0sXG4gICAgICBbL1teXFxcXFwiXFwkXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgXCJAcG9wYWxsXCJdXG4gICAgXSxcbiAgICBzdHJpbmdJbnNpZGVFeHByZXNzaW9uOiBbXG4gICAgICBbL1teXFxcXFwiXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBzdHJpbmdFeHByZXNzaW9uOiBbXG4gICAgICBbL1xcfS8sIHsgdG9rZW46IFwiZGVsaW1pdGVyXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgWy9cIi8sIFwic3RyaW5nXCIsIFwiQHN0cmluZ0luc2lkZUV4cHJlc3Npb25cIl0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHRlcnJhZm9ybVwiIH1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGNBQWMsQ0FBQyxNQUFNLElBQUk7QUFBQSxFQUMxQjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsUUFBUSxFQUFHO0FBQUEsRUFDN0M7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztB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
