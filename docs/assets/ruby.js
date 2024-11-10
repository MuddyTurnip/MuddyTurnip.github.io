/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: "#",
    blockComment: ["=begin", "=end"]
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
  indentationRules: {
    increaseIndentPattern: new RegExp(`^\\s*((begin|class|(private|protected)\\s+def|def|else|elsif|ensure|for|if|module|rescue|unless|until|when|while|case)|([^#]*\\sdo\\b)|([^#]*=\\s*(case|if|unless)))\\b([^#\\{;]|("|'|/).*\\4)*(#.*)?$`),
    decreaseIndentPattern: new RegExp("^\\s*([}\\]]([,)]?\\s*(#|$)|\\.[a-zA-Z_]\\w*\\b)|(end|rescue|ensure|else|elsif|when)\\b)")
  }
};
var language = {
  tokenPostfix: ".ruby",
  keywords: [
    "__LINE__",
    "__ENCODING__",
    "__FILE__",
    "BEGIN",
    "END",
    "alias",
    "and",
    "begin",
    "break",
    "case",
    "class",
    "def",
    "defined?",
    "do",
    "else",
    "elsif",
    "end",
    "ensure",
    "for",
    "false",
    "if",
    "in",
    "module",
    "next",
    "nil",
    "not",
    "or",
    "redo",
    "rescue",
    "retry",
    "return",
    "self",
    "super",
    "then",
    "true",
    "undef",
    "unless",
    "until",
    "when",
    "while",
    "yield"
  ],
  keywordops: ["::", "..", "...", "?", ":", "=>"],
  builtins: [
    "require",
    "public",
    "private",
    "include",
    "extend",
    "attr_reader",
    "protected",
    "private_class_method",
    "protected_class_method",
    "new"
  ],
  declarations: [
    "module",
    "class",
    "def",
    "case",
    "do",
    "begin",
    "for",
    "if",
    "while",
    "until",
    "unless"
  ],
  linedecls: ["def", "case", "do", "begin", "for", "if", "while", "until", "unless"],
  operators: [
    "^",
    "&",
    "|",
    "<=>",
    "==",
    "===",
    "!~",
    "=~",
    ">",
    ">=",
    "<",
    "<=",
    "<<",
    ">>",
    "+",
    "-",
    "*",
    "/",
    "%",
    "**",
    "~",
    "+@",
    "-@",
    "[]",
    "[]=",
    "`",
    "+=",
    "-=",
    "*=",
    "**=",
    "/=",
    "^=",
    "%=",
    "<<=",
    ">>=",
    "&=",
    "&&=",
    "||=",
    "|="
  ],
  brackets: [
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" }
  ],
  symbols: /[=><!~?:&|+\-*\/\^%\.]+/,
  escape: /(?:[abefnrstv\\"'\n\r]|[0-7]{1,3}|x[0-9A-Fa-f]{1,2}|u[0-9A-Fa-f]{4})/,
  escapes: /\\(?:C\-(@escape|.)|c(@escape|.)|@escape)/,
  decpart: /\d(_?\d)*/,
  decimal: /0|@decpart/,
  delim: /[^a-zA-Z0-9\s\n\r]/,
  heredelim: /(?:\w+|'[^']*'|"[^"]*"|`[^`]*`)/,
  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[AzZbBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})?/,
  tokenizer: {
    root: [
      [
        /^(\s*)([a-z_]\w*[!?=]?)/,
        [
          "white",
          {
            cases: {
              "for|until|while": {
                token: "keyword.$2",
                next: "@dodecl.$2"
              },
              "@declarations": {
                token: "keyword.$2",
                next: "@root.$2"
              },
              end: { token: "keyword.$S2", next: "@pop" },
              "@keywords": "keyword",
              "@builtins": "predefined",
              "@default": "identifier"
            }
          }
        ]
      ],
      [
        /[a-z_]\w*[!?=]?/,
        {
          cases: {
            "if|unless|while|until": {
              token: "keyword.$0x",
              next: "@modifier.$0x"
            },
            for: { token: "keyword.$2", next: "@dodecl.$2" },
            "@linedecls": { token: "keyword.$0", next: "@root.$0" },
            end: { token: "keyword.$S2", next: "@pop" },
            "@keywords": "keyword",
            "@builtins": "predefined",
            "@default": "identifier"
          }
        }
      ],
      [/[A-Z][\w]*[!?=]?/, "constructor.identifier"],
      [/\$[\w]*/, "global.constant"],
      [/@[\w]*/, "namespace.instance.identifier"],
      [/@@@[\w]*/, "namespace.class.identifier"],
      [/<<[-~](@heredelim).*/, { token: "string.heredoc.delimiter", next: "@heredoc.$1" }],
      [/[ \t\r\n]+<<(@heredelim).*/, { token: "string.heredoc.delimiter", next: "@heredoc.$1" }],
      [/^<<(@heredelim).*/, { token: "string.heredoc.delimiter", next: "@heredoc.$1" }],
      { include: "@whitespace" },
      [/"/, { token: "string.d.delim", next: '@dstring.d."' }],
      [/'/, { token: "string.sq.delim", next: "@sstring.sq" }],
      [/%([rsqxwW]|Q?)/, { token: "@rematch", next: "pstring" }],
      [/`/, { token: "string.x.delim", next: "@dstring.x.`" }],
      [/:(\w|[$@])\w*[!?=]?/, "string.s"],
      [/:"/, { token: "string.s.delim", next: '@dstring.s."' }],
      [/:'/, { token: "string.s.delim", next: "@sstring.s" }],
      [/\/(?=(\\\/|[^\/\n])+\/)/, { token: "regexp.delim", next: "@regexp" }],
      [/[{}()\[\]]/, "@brackets"],
      [
        /@symbols/,
        {
          cases: {
            "@keywordops": "keyword",
            "@operators": "operator",
            "@default": ""
          }
        }
      ],
      [/[;,]/, "delimiter"],
      [/0[xX][0-9a-fA-F](_?[0-9a-fA-F])*/, "number.hex"],
      [/0[_oO][0-7](_?[0-7])*/, "number.octal"],
      [/0[bB][01](_?[01])*/, "number.binary"],
      [/0[dD]@decpart/, "number"],
      [
        /@decimal((\.@decpart)?([eE][\-+]?@decpart)?)/,
        {
          cases: {
            $1: "number.float",
            "@default": "number"
          }
        }
      ]
    ],
    dodecl: [
      [/^/, { token: "", switchTo: "@root.$S2" }],
      [
        /[a-z_]\w*[!?=]?/,
        {
          cases: {
            end: { token: "keyword.$S2", next: "@pop" },
            do: { token: "keyword", switchTo: "@root.$S2" },
            "@linedecls": {
              token: "@rematch",
              switchTo: "@root.$S2"
            },
            "@keywords": "keyword",
            "@builtins": "predefined",
            "@default": "identifier"
          }
        }
      ],
      { include: "@root" }
    ],
    modifier: [
      [/^/, "", "@pop"],
      [
        /[a-z_]\w*[!?=]?/,
        {
          cases: {
            end: { token: "keyword.$S2", next: "@pop" },
            "then|else|elsif|do": {
              token: "keyword",
              switchTo: "@root.$S2"
            },
            "@linedecls": {
              token: "@rematch",
              switchTo: "@root.$S2"
            },
            "@keywords": "keyword",
            "@builtins": "predefined",
            "@default": "identifier"
          }
        }
      ],
      { include: "@root" }
    ],
    sstring: [
      [/[^\\']+/, "string.$S2"],
      [/\\\\|\\'|\\$/, "string.$S2.escape"],
      [/\\./, "string.$S2.invalid"],
      [/'/, { token: "string.$S2.delim", next: "@pop" }]
    ],
    dstring: [
      [/[^\\`"#]+/, "string.$S2"],
      [/#/, "string.$S2.escape", "@interpolated"],
      [/\\$/, "string.$S2.escape"],
      [/@escapes/, "string.$S2.escape"],
      [/\\./, "string.$S2.escape.invalid"],
      [
        /[`"]/,
        {
          cases: {
            "$#==$S3": { token: "string.$S2.delim", next: "@pop" },
            "@default": "string.$S2"
          }
        }
      ]
    ],
    heredoc: [
      [
        /^(\s*)(@heredelim)$/,
        {
          cases: {
            "$2==$S2": ["string.heredoc", { token: "string.heredoc.delimiter", next: "@pop" }],
            "@default": ["string.heredoc", "string.heredoc"]
          }
        }
      ],
      [/.*/, "string.heredoc"]
    ],
    interpolated: [
      [/\$\w*/, "global.constant", "@pop"],
      [/@\w*/, "namespace.class.identifier", "@pop"],
      [/@@@\w*/, "namespace.instance.identifier", "@pop"],
      [
        /[{]/,
        {
          token: "string.escape.curly",
          switchTo: "@interpolated_compound"
        }
      ],
      ["", "", "@pop"]
    ],
    interpolated_compound: [
      [/[}]/, { token: "string.escape.curly", next: "@pop" }],
      { include: "@root" }
    ],
    pregexp: [
      { include: "@whitespace" },
      [
        /[^\(\{\[\\]/,
        {
          cases: {
            "$#==$S3": { token: "regexp.delim", next: "@pop" },
            "$#==$S2": { token: "regexp.delim", next: "@push" },
            "~[)}\\]]": "@brackets.regexp.escape.control",
            "~@regexpctl": "regexp.escape.control",
            "@default": "regexp"
          }
        }
      ],
      { include: "@regexcontrol" }
    ],
    regexp: [
      { include: "@regexcontrol" },
      [/[^\\\/]/, "regexp"],
      ["/[ixmp]*", { token: "regexp.delim" }, "@pop"]
    ],
    regexcontrol: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        [
          "@brackets.regexp.escape.control",
          "regexp.escape.control",
          "@brackets.regexp.escape.control"
        ]
      ],
      [
        /(\[)(\^?)/,
        ["@brackets.regexp.escape.control", { token: "regexp.escape.control", next: "@regexrange" }]
      ],
      [/(\()(\?[:=!])/, ["@brackets.regexp.escape.control", "regexp.escape.control"]],
      [/\(\?#/, { token: "regexp.escape.control", next: "@regexpcomment" }],
      [/[()]/, "@brackets.regexp.escape.control"],
      [/@regexpctl/, "regexp.escape.control"],
      [/\\$/, "regexp.escape"],
      [/@regexpesc/, "regexp.escape"],
      [/\\\./, "regexp.invalid"],
      [/#/, "regexp.escape", "@interpolated"]
    ],
    regexrange: [
      [/-/, "regexp.escape.control"],
      [/\^/, "regexp.invalid"],
      [/\\$/, "regexp.escape"],
      [/@regexpesc/, "regexp.escape"],
      [/[^\]]/, "regexp"],
      [/\]/, "@brackets.regexp.escape.control", "@pop"]
    ],
    regexpcomment: [
      [/[^)]+/, "comment"],
      [/\)/, { token: "regexp.escape.control", next: "@pop" }]
    ],
    pstring: [
      [/%([qws])\(/, { token: "string.$1.delim", switchTo: "@qstring.$1.(.)" }],
      [/%([qws])\[/, { token: "string.$1.delim", switchTo: "@qstring.$1.[.]" }],
      [/%([qws])\{/, { token: "string.$1.delim", switchTo: "@qstring.$1.{.}" }],
      [/%([qws])</, { token: "string.$1.delim", switchTo: "@qstring.$1.<.>" }],
      [/%([qws])(@delim)/, { token: "string.$1.delim", switchTo: "@qstring.$1.$2.$2" }],
      [/%r\(/, { token: "regexp.delim", switchTo: "@pregexp.(.)" }],
      [/%r\[/, { token: "regexp.delim", switchTo: "@pregexp.[.]" }],
      [/%r\{/, { token: "regexp.delim", switchTo: "@pregexp.{.}" }],
      [/%r</, { token: "regexp.delim", switchTo: "@pregexp.<.>" }],
      [/%r(@delim)/, { token: "regexp.delim", switchTo: "@pregexp.$1.$1" }],
      [/%(x|W|Q?)\(/, { token: "string.$1.delim", switchTo: "@qqstring.$1.(.)" }],
      [/%(x|W|Q?)\[/, { token: "string.$1.delim", switchTo: "@qqstring.$1.[.]" }],
      [/%(x|W|Q?)\{/, { token: "string.$1.delim", switchTo: "@qqstring.$1.{.}" }],
      [/%(x|W|Q?)</, { token: "string.$1.delim", switchTo: "@qqstring.$1.<.>" }],
      [/%(x|W|Q?)(@delim)/, { token: "string.$1.delim", switchTo: "@qqstring.$1.$2.$2" }],
      [/%([rqwsxW]|Q?)./, { token: "invalid", next: "@pop" }],
      [/./, { token: "invalid", next: "@pop" }]
    ],
    qstring: [
      [/\\$/, "string.$S2.escape"],
      [/\\./, "string.$S2.escape"],
      [
        /./,
        {
          cases: {
            "$#==$S4": { token: "string.$S2.delim", next: "@pop" },
            "$#==$S3": { token: "string.$S2.delim", next: "@push" },
            "@default": "string.$S2"
          }
        }
      ]
    ],
    qqstring: [[/#/, "string.$S2.escape", "@interpolated"], { include: "@qstring" }],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/^\s*=begin\b/, "comment", "@comment"],
      [/#.*$/, "comment"]
    ],
    comment: [
      [/[^=]+/, "comment"],
      [/^\s*=begin\b/, "comment.invalid"],
      [/^\s*=end\b.*/, "comment", "@pop"],
      [/[=]/, "comment"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVieS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9ydWJ5L3J1YnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3J1YnkvcnVieS50c1xudmFyIGNvbmYgPSB7XG4gIGNvbW1lbnRzOiB7XG4gICAgbGluZUNvbW1lbnQ6IFwiI1wiLFxuICAgIGJsb2NrQ29tbWVudDogW1wiPWJlZ2luXCIsIFwiPWVuZFwiXVxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIihcIiwgXCIpXCJdLFxuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdLFxuICBpbmRlbnRhdGlvblJ1bGVzOiB7XG4gICAgaW5jcmVhc2VJbmRlbnRQYXR0ZXJuOiBuZXcgUmVnRXhwKGBeXFxcXHMqKChiZWdpbnxjbGFzc3wocHJpdmF0ZXxwcm90ZWN0ZWQpXFxcXHMrZGVmfGRlZnxlbHNlfGVsc2lmfGVuc3VyZXxmb3J8aWZ8bW9kdWxlfHJlc2N1ZXx1bmxlc3N8dW50aWx8d2hlbnx3aGlsZXxjYXNlKXwoW14jXSpcXFxcc2RvXFxcXGIpfChbXiNdKj1cXFxccyooY2FzZXxpZnx1bmxlc3MpKSlcXFxcYihbXiNcXFxceztdfChcInwnfC8pLipcXFxcNCkqKCMuKik/JGApLFxuICAgIGRlY3JlYXNlSW5kZW50UGF0dGVybjogbmV3IFJlZ0V4cChcIl5cXFxccyooW31cXFxcXV0oWywpXT9cXFxccyooI3wkKXxcXFxcLlthLXpBLVpfXVxcXFx3KlxcXFxiKXwoZW5kfHJlc2N1ZXxlbnN1cmV8ZWxzZXxlbHNpZnx3aGVuKVxcXFxiKVwiKVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICB0b2tlblBvc3RmaXg6IFwiLnJ1YnlcIixcbiAga2V5d29yZHM6IFtcbiAgICBcIl9fTElORV9fXCIsXG4gICAgXCJfX0VOQ09ESU5HX19cIixcbiAgICBcIl9fRklMRV9fXCIsXG4gICAgXCJCRUdJTlwiLFxuICAgIFwiRU5EXCIsXG4gICAgXCJhbGlhc1wiLFxuICAgIFwiYW5kXCIsXG4gICAgXCJiZWdpblwiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImNhc2VcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJkZWZcIixcbiAgICBcImRlZmluZWQ/XCIsXG4gICAgXCJkb1wiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiZWxzaWZcIixcbiAgICBcImVuZFwiLFxuICAgIFwiZW5zdXJlXCIsXG4gICAgXCJmb3JcIixcbiAgICBcImZhbHNlXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW5cIixcbiAgICBcIm1vZHVsZVwiLFxuICAgIFwibmV4dFwiLFxuICAgIFwibmlsXCIsXG4gICAgXCJub3RcIixcbiAgICBcIm9yXCIsXG4gICAgXCJyZWRvXCIsXG4gICAgXCJyZXNjdWVcIixcbiAgICBcInJldHJ5XCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcInNlbGZcIixcbiAgICBcInN1cGVyXCIsXG4gICAgXCJ0aGVuXCIsXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJ1bmRlZlwiLFxuICAgIFwidW5sZXNzXCIsXG4gICAgXCJ1bnRpbFwiLFxuICAgIFwid2hlblwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcInlpZWxkXCJcbiAgXSxcbiAga2V5d29yZG9wczogW1wiOjpcIiwgXCIuLlwiLCBcIi4uLlwiLCBcIj9cIiwgXCI6XCIsIFwiPT5cIl0sXG4gIGJ1aWx0aW5zOiBbXG4gICAgXCJyZXF1aXJlXCIsXG4gICAgXCJwdWJsaWNcIixcbiAgICBcInByaXZhdGVcIixcbiAgICBcImluY2x1ZGVcIixcbiAgICBcImV4dGVuZFwiLFxuICAgIFwiYXR0cl9yZWFkZXJcIixcbiAgICBcInByb3RlY3RlZFwiLFxuICAgIFwicHJpdmF0ZV9jbGFzc19tZXRob2RcIixcbiAgICBcInByb3RlY3RlZF9jbGFzc19tZXRob2RcIixcbiAgICBcIm5ld1wiXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFwibW9kdWxlXCIsXG4gICAgXCJjbGFzc1wiLFxuICAgIFwiZGVmXCIsXG4gICAgXCJjYXNlXCIsXG4gICAgXCJkb1wiLFxuICAgIFwiYmVnaW5cIixcbiAgICBcImZvclwiLFxuICAgIFwiaWZcIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJ1bnRpbFwiLFxuICAgIFwidW5sZXNzXCJcbiAgXSxcbiAgbGluZWRlY2xzOiBbXCJkZWZcIiwgXCJjYXNlXCIsIFwiZG9cIiwgXCJiZWdpblwiLCBcImZvclwiLCBcImlmXCIsIFwid2hpbGVcIiwgXCJ1bnRpbFwiLCBcInVubGVzc1wiXSxcbiAgb3BlcmF0b3JzOiBbXG4gICAgXCJeXCIsXG4gICAgXCImXCIsXG4gICAgXCJ8XCIsXG4gICAgXCI8PT5cIixcbiAgICBcIj09XCIsXG4gICAgXCI9PT1cIixcbiAgICBcIiF+XCIsXG4gICAgXCI9flwiLFxuICAgIFwiPlwiLFxuICAgIFwiPj1cIixcbiAgICBcIjxcIixcbiAgICBcIjw9XCIsXG4gICAgXCI8PFwiLFxuICAgIFwiPj5cIixcbiAgICBcIitcIixcbiAgICBcIi1cIixcbiAgICBcIipcIixcbiAgICBcIi9cIixcbiAgICBcIiVcIixcbiAgICBcIioqXCIsXG4gICAgXCJ+XCIsXG4gICAgXCIrQFwiLFxuICAgIFwiLUBcIixcbiAgICBcIltdXCIsXG4gICAgXCJbXT1cIixcbiAgICBcImBcIixcbiAgICBcIis9XCIsXG4gICAgXCItPVwiLFxuICAgIFwiKj1cIixcbiAgICBcIioqPVwiLFxuICAgIFwiLz1cIixcbiAgICBcIl49XCIsXG4gICAgXCIlPVwiLFxuICAgIFwiPDw9XCIsXG4gICAgXCI+Pj1cIixcbiAgICBcIiY9XCIsXG4gICAgXCImJj1cIixcbiAgICBcInx8PVwiLFxuICAgIFwifD1cIlxuICBdLFxuICBicmFja2V0czogW1xuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIsIHRva2VuOiBcImRlbGltaXRlci5jdXJseVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIgfVxuICBdLFxuICBzeW1ib2xzOiAvWz0+PCF+PzomfCtcXC0qXFwvXFxeJVxcLl0rLyxcbiAgZXNjYXBlOiAvKD86W2FiZWZucnN0dlxcXFxcIidcXG5cXHJdfFswLTddezEsM318eFswLTlBLUZhLWZdezEsMn18dVswLTlBLUZhLWZdezR9KS8sXG4gIGVzY2FwZXM6IC9cXFxcKD86Q1xcLShAZXNjYXBlfC4pfGMoQGVzY2FwZXwuKXxAZXNjYXBlKS8sXG4gIGRlY3BhcnQ6IC9cXGQoXz9cXGQpKi8sXG4gIGRlY2ltYWw6IC8wfEBkZWNwYXJ0LyxcbiAgZGVsaW06IC9bXmEtekEtWjAtOVxcc1xcblxccl0vLFxuICBoZXJlZGVsaW06IC8oPzpcXHcrfCdbXiddKid8XCJbXlwiXSpcInxgW15gXSpgKS8sXG4gIHJlZ2V4cGN0bDogL1soKXt9XFxbXFxdXFwkXFxefFxcLSorP1xcLl0vLFxuICByZWdleHBlc2M6IC9cXFxcKD86W0F6WmJCZERmbnJzdHZ3V24wXFxcXFxcL118QHJlZ2V4cGN0bHxjW0EtWl18eFswLTlhLWZBLUZdezJ9fHVbMC05YS1mQS1GXXs0fSk/LyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgW1xuICAgICAgICAvXihcXHMqKShbYS16X11cXHcqWyE/PV0/KS8sXG4gICAgICAgIFtcbiAgICAgICAgICBcIndoaXRlXCIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgXCJmb3J8dW50aWx8d2hpbGVcIjoge1xuICAgICAgICAgICAgICAgIHRva2VuOiBcImtleXdvcmQuJDJcIixcbiAgICAgICAgICAgICAgICBuZXh0OiBcIkBkb2RlY2wuJDJcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIkBkZWNsYXJhdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgIHRva2VuOiBcImtleXdvcmQuJDJcIixcbiAgICAgICAgICAgICAgICBuZXh0OiBcIkByb290LiQyXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZW5kOiB7IHRva2VuOiBcImtleXdvcmQuJFMyXCIsIG5leHQ6IFwiQHBvcFwiIH0sXG4gICAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgICBcIkBidWlsdGluc1wiOiBcInByZWRlZmluZWRcIixcbiAgICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1thLXpfXVxcdypbIT89XT8vLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiaWZ8dW5sZXNzfHdoaWxlfHVudGlsXCI6IHtcbiAgICAgICAgICAgICAgdG9rZW46IFwia2V5d29yZC4kMHhcIixcbiAgICAgICAgICAgICAgbmV4dDogXCJAbW9kaWZpZXIuJDB4XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3I6IHsgdG9rZW46IFwia2V5d29yZC4kMlwiLCBuZXh0OiBcIkBkb2RlY2wuJDJcIiB9LFxuICAgICAgICAgICAgXCJAbGluZWRlY2xzXCI6IHsgdG9rZW46IFwia2V5d29yZC4kMFwiLCBuZXh0OiBcIkByb290LiQwXCIgfSxcbiAgICAgICAgICAgIGVuZDogeyB0b2tlbjogXCJrZXl3b3JkLiRTMlwiLCBuZXh0OiBcIkBwb3BcIiB9LFxuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgICBcIkBidWlsdGluc1wiOiBcInByZWRlZmluZWRcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJpZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1tBLVpdW1xcd10qWyE/PV0/LywgXCJjb25zdHJ1Y3Rvci5pZGVudGlmaWVyXCJdLFxuICAgICAgWy9cXCRbXFx3XSovLCBcImdsb2JhbC5jb25zdGFudFwiXSxcbiAgICAgIFsvQFtcXHddKi8sIFwibmFtZXNwYWNlLmluc3RhbmNlLmlkZW50aWZpZXJcIl0sXG4gICAgICBbL0BAQFtcXHddKi8sIFwibmFtZXNwYWNlLmNsYXNzLmlkZW50aWZpZXJcIl0sXG4gICAgICBbLzw8Wy1+XShAaGVyZWRlbGltKS4qLywgeyB0b2tlbjogXCJzdHJpbmcuaGVyZWRvYy5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAaGVyZWRvYy4kMVwiIH1dLFxuICAgICAgWy9bIFxcdFxcclxcbl0rPDwoQGhlcmVkZWxpbSkuKi8sIHsgdG9rZW46IFwic3RyaW5nLmhlcmVkb2MuZGVsaW1pdGVyXCIsIG5leHQ6IFwiQGhlcmVkb2MuJDFcIiB9XSxcbiAgICAgIFsvXjw8KEBoZXJlZGVsaW0pLiovLCB7IHRva2VuOiBcInN0cmluZy5oZXJlZG9jLmRlbGltaXRlclwiLCBuZXh0OiBcIkBoZXJlZG9jLiQxXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy9cIi8sIHsgdG9rZW46IFwic3RyaW5nLmQuZGVsaW1cIiwgbmV4dDogJ0Bkc3RyaW5nLmQuXCInIH1dLFxuICAgICAgWy8nLywgeyB0b2tlbjogXCJzdHJpbmcuc3EuZGVsaW1cIiwgbmV4dDogXCJAc3N0cmluZy5zcVwiIH1dLFxuICAgICAgWy8lKFtyc3F4d1ddfFE/KS8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJwc3RyaW5nXCIgfV0sXG4gICAgICBbL2AvLCB7IHRva2VuOiBcInN0cmluZy54LmRlbGltXCIsIG5leHQ6IFwiQGRzdHJpbmcueC5gXCIgfV0sXG4gICAgICBbLzooXFx3fFskQF0pXFx3KlshPz1dPy8sIFwic3RyaW5nLnNcIl0sXG4gICAgICBbLzpcIi8sIHsgdG9rZW46IFwic3RyaW5nLnMuZGVsaW1cIiwgbmV4dDogJ0Bkc3RyaW5nLnMuXCInIH1dLFxuICAgICAgWy86Jy8sIHsgdG9rZW46IFwic3RyaW5nLnMuZGVsaW1cIiwgbmV4dDogXCJAc3N0cmluZy5zXCIgfV0sXG4gICAgICBbL1xcLyg/PShcXFxcXFwvfFteXFwvXFxuXSkrXFwvKS8sIHsgdG9rZW46IFwicmVnZXhwLmRlbGltXCIsIG5leHQ6IFwiQHJlZ2V4cFwiIH1dLFxuICAgICAgWy9be30oKVxcW1xcXV0vLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFtcbiAgICAgICAgL0BzeW1ib2xzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBrZXl3b3Jkb3BzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAb3BlcmF0b3JzXCI6IFwib3BlcmF0b3JcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWzssXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy8wW3hYXVswLTlhLWZBLUZdKF8/WzAtOWEtZkEtRl0pKi8sIFwibnVtYmVyLmhleFwiXSxcbiAgICAgIFsvMFtfb09dWzAtN10oXz9bMC03XSkqLywgXCJudW1iZXIub2N0YWxcIl0sXG4gICAgICBbLzBbYkJdWzAxXShfP1swMV0pKi8sIFwibnVtYmVyLmJpbmFyeVwiXSxcbiAgICAgIFsvMFtkRF1AZGVjcGFydC8sIFwibnVtYmVyXCJdLFxuICAgICAgW1xuICAgICAgICAvQGRlY2ltYWwoKFxcLkBkZWNwYXJ0KT8oW2VFXVtcXC0rXT9AZGVjcGFydCk/KS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgJDE6IFwibnVtYmVyLmZsb2F0XCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwibnVtYmVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIGRvZGVjbDogW1xuICAgICAgWy9eLywgeyB0b2tlbjogXCJcIiwgc3dpdGNoVG86IFwiQHJvb3QuJFMyXCIgfV0sXG4gICAgICBbXG4gICAgICAgIC9bYS16X11cXHcqWyE/PV0/LyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBlbmQ6IHsgdG9rZW46IFwia2V5d29yZC4kUzJcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIGRvOiB7IHRva2VuOiBcImtleXdvcmRcIiwgc3dpdGNoVG86IFwiQHJvb3QuJFMyXCIgfSxcbiAgICAgICAgICAgIFwiQGxpbmVkZWNsc1wiOiB7XG4gICAgICAgICAgICAgIHRva2VuOiBcIkByZW1hdGNoXCIsXG4gICAgICAgICAgICAgIHN3aXRjaFRvOiBcIkByb290LiRTMlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgICBcIkBidWlsdGluc1wiOiBcInByZWRlZmluZWRcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJpZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHJvb3RcIiB9XG4gICAgXSxcbiAgICBtb2RpZmllcjogW1xuICAgICAgWy9eLywgXCJcIiwgXCJAcG9wXCJdLFxuICAgICAgW1xuICAgICAgICAvW2Etel9dXFx3KlshPz1dPy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgZW5kOiB7IHRva2VuOiBcImtleXdvcmQuJFMyXCIsIG5leHQ6IFwiQHBvcFwiIH0sXG4gICAgICAgICAgICBcInRoZW58ZWxzZXxlbHNpZnxkb1wiOiB7XG4gICAgICAgICAgICAgIHRva2VuOiBcImtleXdvcmRcIixcbiAgICAgICAgICAgICAgc3dpdGNoVG86IFwiQHJvb3QuJFMyXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkBsaW5lZGVjbHNcIjoge1xuICAgICAgICAgICAgICB0b2tlbjogXCJAcmVtYXRjaFwiLFxuICAgICAgICAgICAgICBzd2l0Y2hUbzogXCJAcm9vdC4kUzJcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAYnVpbHRpbnNcIjogXCJwcmVkZWZpbmVkXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkByb290XCIgfVxuICAgIF0sXG4gICAgc3N0cmluZzogW1xuICAgICAgWy9bXlxcXFwnXSsvLCBcInN0cmluZy4kUzJcIl0sXG4gICAgICBbL1xcXFxcXFxcfFxcXFwnfFxcXFwkLywgXCJzdHJpbmcuJFMyLmVzY2FwZVwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy4kUzIuaW52YWxpZFwiXSxcbiAgICAgIFsvJy8sIHsgdG9rZW46IFwic3RyaW5nLiRTMi5kZWxpbVwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgZHN0cmluZzogW1xuICAgICAgWy9bXlxcXFxgXCIjXSsvLCBcInN0cmluZy4kUzJcIl0sXG4gICAgICBbLyMvLCBcInN0cmluZy4kUzIuZXNjYXBlXCIsIFwiQGludGVycG9sYXRlZFwiXSxcbiAgICAgIFsvXFxcXCQvLCBcInN0cmluZy4kUzIuZXNjYXBlXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLiRTMi5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuJFMyLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgW1xuICAgICAgICAvW2BcIl0vLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiJCM9PSRTM1wiOiB7IHRva2VuOiBcInN0cmluZy4kUzIuZGVsaW1cIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJzdHJpbmcuJFMyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIGhlcmVkb2M6IFtcbiAgICAgIFtcbiAgICAgICAgL14oXFxzKikoQGhlcmVkZWxpbSkkLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQyPT0kUzJcIjogW1wic3RyaW5nLmhlcmVkb2NcIiwgeyB0b2tlbjogXCJzdHJpbmcuaGVyZWRvYy5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFtcInN0cmluZy5oZXJlZG9jXCIsIFwic3RyaW5nLmhlcmVkb2NcIl1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLy4qLywgXCJzdHJpbmcuaGVyZWRvY1wiXVxuICAgIF0sXG4gICAgaW50ZXJwb2xhdGVkOiBbXG4gICAgICBbL1xcJFxcdyovLCBcImdsb2JhbC5jb25zdGFudFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL0BcXHcqLywgXCJuYW1lc3BhY2UuY2xhc3MuaWRlbnRpZmllclwiLCBcIkBwb3BcIl0sXG4gICAgICBbL0BAQFxcdyovLCBcIm5hbWVzcGFjZS5pbnN0YW5jZS5pZGVudGlmaWVyXCIsIFwiQHBvcFwiXSxcbiAgICAgIFtcbiAgICAgICAgL1t7XS8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJzdHJpbmcuZXNjYXBlLmN1cmx5XCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQGludGVycG9sYXRlZF9jb21wb3VuZFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBpbnRlcnBvbGF0ZWRfY29tcG91bmQ6IFtcbiAgICAgIFsvW31dLywgeyB0b2tlbjogXCJzdHJpbmcuZXNjYXBlLmN1cmx5XCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgeyBpbmNsdWRlOiBcIkByb290XCIgfVxuICAgIF0sXG4gICAgcHJlZ2V4cDogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIFtcbiAgICAgICAgL1teXFwoXFx7XFxbXFxcXF0vLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiJCM9PSRTM1wiOiB7IHRva2VuOiBcInJlZ2V4cC5kZWxpbVwiLCBuZXh0OiBcIkBwb3BcIiB9LFxuICAgICAgICAgICAgXCIkIz09JFMyXCI6IHsgdG9rZW46IFwicmVnZXhwLmRlbGltXCIsIG5leHQ6IFwiQHB1c2hcIiB9LFxuICAgICAgICAgICAgXCJ+Wyl9XFxcXF1dXCI6IFwiQGJyYWNrZXRzLnJlZ2V4cC5lc2NhcGUuY29udHJvbFwiLFxuICAgICAgICAgICAgXCJ+QHJlZ2V4cGN0bFwiOiBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInJlZ2V4cFwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkByZWdleGNvbnRyb2xcIiB9XG4gICAgXSxcbiAgICByZWdleHA6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAcmVnZXhjb250cm9sXCIgfSxcbiAgICAgIFsvW15cXFxcXFwvXS8sIFwicmVnZXhwXCJdLFxuICAgICAgW1wiL1tpeG1wXSpcIiwgeyB0b2tlbjogXCJyZWdleHAuZGVsaW1cIiB9LCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIHJlZ2V4Y29udHJvbDogW1xuICAgICAgW1xuICAgICAgICAvKFxceykoXFxkKyg/OixcXGQqKT8pKFxcfSkvLFxuICAgICAgICBbXG4gICAgICAgICAgXCJAYnJhY2tldHMucmVnZXhwLmVzY2FwZS5jb250cm9sXCIsXG4gICAgICAgICAgXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIixcbiAgICAgICAgICBcIkBicmFja2V0cy5yZWdleHAuZXNjYXBlLmNvbnRyb2xcIlxuICAgICAgICBdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvKFxcWykoXFxePykvLFxuICAgICAgICBbXCJAYnJhY2tldHMucmVnZXhwLmVzY2FwZS5jb250cm9sXCIsIHsgdG9rZW46IFwicmVnZXhwLmVzY2FwZS5jb250cm9sXCIsIG5leHQ6IFwiQHJlZ2V4cmFuZ2VcIiB9XVxuICAgICAgXSxcbiAgICAgIFsvKFxcKCkoXFw/Wzo9IV0pLywgW1wiQGJyYWNrZXRzLnJlZ2V4cC5lc2NhcGUuY29udHJvbFwiLCBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiXV0sXG4gICAgICBbL1xcKFxcPyMvLCB7IHRva2VuOiBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiLCBuZXh0OiBcIkByZWdleHBjb21tZW50XCIgfV0sXG4gICAgICBbL1soKV0vLCBcIkBicmFja2V0cy5yZWdleHAuZXNjYXBlLmNvbnRyb2xcIl0sXG4gICAgICBbL0ByZWdleHBjdGwvLCBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiXSxcbiAgICAgIFsvXFxcXCQvLCBcInJlZ2V4cC5lc2NhcGVcIl0sXG4gICAgICBbL0ByZWdleHBlc2MvLCBcInJlZ2V4cC5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFxcXC4vLCBcInJlZ2V4cC5pbnZhbGlkXCJdLFxuICAgICAgWy8jLywgXCJyZWdleHAuZXNjYXBlXCIsIFwiQGludGVycG9sYXRlZFwiXVxuICAgIF0sXG4gICAgcmVnZXhyYW5nZTogW1xuICAgICAgWy8tLywgXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIl0sXG4gICAgICBbL1xcXi8sIFwicmVnZXhwLmludmFsaWRcIl0sXG4gICAgICBbL1xcXFwkLywgXCJyZWdleHAuZXNjYXBlXCJdLFxuICAgICAgWy9AcmVnZXhwZXNjLywgXCJyZWdleHAuZXNjYXBlXCJdLFxuICAgICAgWy9bXlxcXV0vLCBcInJlZ2V4cFwiXSxcbiAgICAgIFsvXFxdLywgXCJAYnJhY2tldHMucmVnZXhwLmVzY2FwZS5jb250cm9sXCIsIFwiQHBvcFwiXVxuICAgIF0sXG4gICAgcmVnZXhwY29tbWVudDogW1xuICAgICAgWy9bXildKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXFwpLywgeyB0b2tlbjogXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHBzdHJpbmc6IFtcbiAgICAgIFsvJShbcXdzXSlcXCgvLCB7IHRva2VuOiBcInN0cmluZy4kMS5kZWxpbVwiLCBzd2l0Y2hUbzogXCJAcXN0cmluZy4kMS4oLilcIiB9XSxcbiAgICAgIFsvJShbcXdzXSlcXFsvLCB7IHRva2VuOiBcInN0cmluZy4kMS5kZWxpbVwiLCBzd2l0Y2hUbzogXCJAcXN0cmluZy4kMS5bLl1cIiB9XSxcbiAgICAgIFsvJShbcXdzXSlcXHsvLCB7IHRva2VuOiBcInN0cmluZy4kMS5kZWxpbVwiLCBzd2l0Y2hUbzogXCJAcXN0cmluZy4kMS57Ln1cIiB9XSxcbiAgICAgIFsvJShbcXdzXSk8LywgeyB0b2tlbjogXCJzdHJpbmcuJDEuZGVsaW1cIiwgc3dpdGNoVG86IFwiQHFzdHJpbmcuJDEuPC4+XCIgfV0sXG4gICAgICBbLyUoW3F3c10pKEBkZWxpbSkvLCB7IHRva2VuOiBcInN0cmluZy4kMS5kZWxpbVwiLCBzd2l0Y2hUbzogXCJAcXN0cmluZy4kMS4kMi4kMlwiIH1dLFxuICAgICAgWy8lclxcKC8sIHsgdG9rZW46IFwicmVnZXhwLmRlbGltXCIsIHN3aXRjaFRvOiBcIkBwcmVnZXhwLiguKVwiIH1dLFxuICAgICAgWy8lclxcWy8sIHsgdG9rZW46IFwicmVnZXhwLmRlbGltXCIsIHN3aXRjaFRvOiBcIkBwcmVnZXhwLlsuXVwiIH1dLFxuICAgICAgWy8lclxcey8sIHsgdG9rZW46IFwicmVnZXhwLmRlbGltXCIsIHN3aXRjaFRvOiBcIkBwcmVnZXhwLnsufVwiIH1dLFxuICAgICAgWy8lcjwvLCB7IHRva2VuOiBcInJlZ2V4cC5kZWxpbVwiLCBzd2l0Y2hUbzogXCJAcHJlZ2V4cC48Lj5cIiB9XSxcbiAgICAgIFsvJXIoQGRlbGltKS8sIHsgdG9rZW46IFwicmVnZXhwLmRlbGltXCIsIHN3aXRjaFRvOiBcIkBwcmVnZXhwLiQxLiQxXCIgfV0sXG4gICAgICBbLyUoeHxXfFE/KVxcKC8sIHsgdG9rZW46IFwic3RyaW5nLiQxLmRlbGltXCIsIHN3aXRjaFRvOiBcIkBxcXN0cmluZy4kMS4oLilcIiB9XSxcbiAgICAgIFsvJSh4fFd8UT8pXFxbLywgeyB0b2tlbjogXCJzdHJpbmcuJDEuZGVsaW1cIiwgc3dpdGNoVG86IFwiQHFxc3RyaW5nLiQxLlsuXVwiIH1dLFxuICAgICAgWy8lKHh8V3xRPylcXHsvLCB7IHRva2VuOiBcInN0cmluZy4kMS5kZWxpbVwiLCBzd2l0Y2hUbzogXCJAcXFzdHJpbmcuJDEuey59XCIgfV0sXG4gICAgICBbLyUoeHxXfFE/KTwvLCB7IHRva2VuOiBcInN0cmluZy4kMS5kZWxpbVwiLCBzd2l0Y2hUbzogXCJAcXFzdHJpbmcuJDEuPC4+XCIgfV0sXG4gICAgICBbLyUoeHxXfFE/KShAZGVsaW0pLywgeyB0b2tlbjogXCJzdHJpbmcuJDEuZGVsaW1cIiwgc3dpdGNoVG86IFwiQHFxc3RyaW5nLiQxLiQyLiQyXCIgfV0sXG4gICAgICBbLyUoW3Jxd3N4V118UT8pLi8sIHsgdG9rZW46IFwiaW52YWxpZFwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvLi8sIHsgdG9rZW46IFwiaW52YWxpZFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgcXN0cmluZzogW1xuICAgICAgWy9cXFxcJC8sIFwic3RyaW5nLiRTMi5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuJFMyLmVzY2FwZVwiXSxcbiAgICAgIFtcbiAgICAgICAgLy4vLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiJCM9PSRTNFwiOiB7IHRva2VuOiBcInN0cmluZy4kUzIuZGVsaW1cIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIFwiJCM9PSRTM1wiOiB7IHRva2VuOiBcInN0cmluZy4kUzIuZGVsaW1cIiwgbmV4dDogXCJAcHVzaFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwic3RyaW5nLiRTMlwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBxcXN0cmluZzogW1svIy8sIFwic3RyaW5nLiRTMi5lc2NhcGVcIiwgXCJAaW50ZXJwb2xhdGVkXCJdLCB7IGluY2x1ZGU6IFwiQHFzdHJpbmdcIiB9XSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIlwiXSxcbiAgICAgIFsvXlxccyo9YmVnaW5cXGIvLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvIy4qJC8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXj1dKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXlxccyo9YmVnaW5cXGIvLCBcImNvbW1lbnQuaW52YWxpZFwiXSxcbiAgICAgIFsvXlxccyo9ZW5kXFxiLiovLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bPV0vLCBcImNvbW1lbnRcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGNBQWMsQ0FBQyxVQUFVLE1BQU07QUFBQSxFQUNoQztBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFCO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsdUJBQXVCLElBQUksT0FBTyx3TUFBd007QUFBQSxJQUMxTyx1QkFBdUIsSUFBSSxPQUFPLDBGQUEwRjtBQUFBLEVBQzdIO0FBQ0g7QUFDRyxJQUFDLFdBQVc7QUFBQSxFQUNiLGNBQWM7QUFBQSxFQUNkLFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELFlBQVksQ0FBQyxNQUFNLE1BQU0sT0FBTyxLQUFLLEtBQUssSUFBSTtBQUFBLEVBQzlDLFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsY0FBYztBQUFBLElBQ1o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsV0FBVyxDQUFDLE9BQU8sUUFBUSxNQUFNLFNBQVMsT0FBTyxNQUFNLFNBQVMsU0FBUyxRQUFRO0FBQUEsRUFDakYsV0FBVztBQUFBLElBQ1Q7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLHdCQUF5QjtBQUFBLElBQ3pELEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLGtC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
