/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
  comments: {
    blockComment: ["{#", "#}"]
  },
  brackets: [
    ["{#", "#}"],
    ["{%", "%}"],
    ["{{", "}}"],
    ["(", ")"],
    ["[", "]"],
    ["<!--", "-->"],
    ["<", ">"]
  ],
  autoClosingPairs: [
    { open: "{# ", close: " #}" },
    { open: "{% ", close: " %}" },
    { open: "{{ ", close: " }}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "<", close: ">" }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: "",
  ignoreCase: true,
  keywords: [
    "apply",
    "autoescape",
    "block",
    "deprecated",
    "do",
    "embed",
    "extends",
    "flush",
    "for",
    "from",
    "if",
    "import",
    "include",
    "macro",
    "sandbox",
    "set",
    "use",
    "verbatim",
    "with",
    "endapply",
    "endautoescape",
    "endblock",
    "endembed",
    "endfor",
    "endif",
    "endmacro",
    "endsandbox",
    "endset",
    "endwith",
    "true",
    "false"
  ],
  tokenizer: {
    root: [
      [/\s+/],
      [/{#/, "comment.twig", "@commentState"],
      [/{%[-~]?/, "delimiter.twig", "@blockState"],
      [/{{[-~]?/, "delimiter.twig", "@variableState"],
      [/<!DOCTYPE/, "metatag.html", "@doctype"],
      [/<!--/, "comment.html", "@comment"],
      [/(<)((?:[\w\-]+:)?[\w\-]+)(\s*)(\/>)/, ["delimiter.html", "tag.html", "", "delimiter.html"]],
      [/(<)(script)/, ["delimiter.html", { token: "tag.html", next: "@script" }]],
      [/(<)(style)/, ["delimiter.html", { token: "tag.html", next: "@style" }]],
      [/(<)((?:[\w\-]+:)?[\w\-]+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
      [/(<\/)((?:[\w\-]+:)?[\w\-]+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
      [/</, "delimiter.html"],
      [/[^<{]+/]
    ],
    commentState: [
      [/#}/, "comment.twig", "@pop"],
      [/./, "comment.twig"]
    ],
    blockState: [
      [/[-~]?%}/, "delimiter.twig", "@pop"],
      [/\s+/],
      [
        /(verbatim)(\s*)([-~]?%})/,
        ["keyword.twig", "", { token: "delimiter.twig", next: "@rawDataState" }]
      ],
      { include: "expression" }
    ],
    rawDataState: [
      [
        /({%[-~]?)(\s*)(endverbatim)(\s*)([-~]?%})/,
        ["delimiter.twig", "", "keyword.twig", "", { token: "delimiter.twig", next: "@popall" }]
      ],
      [/./, "string.twig"]
    ],
    variableState: [[/[-~]?}}/, "delimiter.twig", "@pop"], { include: "expression" }],
    stringState: [
      [/"/, "string.twig", "@pop"],
      [/#{\s*/, "string.twig", "@interpolationState"],
      [/[^#"\\]*(?:(?:\\.|#(?!\{))[^#"\\]*)*/, "string.twig"]
    ],
    interpolationState: [
      [/}/, "string.twig", "@pop"],
      { include: "expression" }
    ],
    expression: [
      [/\s+/],
      [/\+|-|\/{1,2}|%|\*{1,2}/, "operators.twig"],
      [/(and|or|not|b-and|b-xor|b-or)(\s+)/, ["operators.twig", ""]],
      [/==|!=|<|>|>=|<=/, "operators.twig"],
      [/(starts with|ends with|matches)(\s+)/, ["operators.twig", ""]],
      [/(in)(\s+)/, ["operators.twig", ""]],
      [/(is)(\s+)/, ["operators.twig", ""]],
      [/\||~|:|\.{1,2}|\?{1,2}/, "operators.twig"],
      [
        /[^\W\d][\w]*/,
        {
          cases: {
            "@keywords": "keyword.twig",
            "@default": "variable.twig"
          }
        }
      ],
      [/\d+(\.\d+)?/, "number.twig"],
      [/\(|\)|\[|\]|{|}|,/, "delimiter.twig"],
      [/"([^#"\\]*(?:\\.[^#"\\]*)*)"|\'([^\'\\]*(?:\\.[^\'\\]*)*)\'/, "string.twig"],
      [/"/, "string.twig", "@stringState"],
      [/=>/, "operators.twig"],
      [/=/, "operators.twig"]
    ],
    doctype: [
      [/[^>]+/, "metatag.content.html"],
      [/>/, "metatag.html", "@pop"]
    ],
    comment: [
      [/-->/, "comment.html", "@pop"],
      [/[^-]+/, "comment.content.html"],
      [/./, "comment.content.html"]
    ],
    otherTag: [
      [/\/?>/, "delimiter.html", "@pop"],
      [/"([^"]*)"/, "attribute.value.html"],
      [/'([^']*)'/, "attribute.value.html"],
      [/[\w\-]+/, "attribute.name.html"],
      [/=/, "delimiter.html"],
      [/[ \t\r\n]+/]
    ],
    script: [
      [/type/, "attribute.name.html", "@scriptAfterType"],
      [/"([^"]*)"/, "attribute.value.html"],
      [/'([^']*)'/, "attribute.value.html"],
      [/[\w\-]+/, "attribute.name.html"],
      [/=/, "delimiter.html"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [
        /(<\/)(script\s*)(>)/,
        ["delimiter.html", "tag.html", { token: "delimiter.html", next: "@pop" }]
      ]
    ],
    scriptAfterType: [
      [/=/, "delimiter.html", "@scriptAfterTypeEquals"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptAfterTypeEquals: [
      [
        /"([^"]*)"/,
        {
          token: "attribute.value.html",
          switchTo: "@scriptWithCustomType.$1"
        }
      ],
      [
        /'([^']*)'/,
        {
          token: "attribute.value.html",
          switchTo: "@scriptWithCustomType.$1"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptWithCustomType: [
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.$S2",
          nextEmbedded: "$S2"
        }
      ],
      [/"([^"]*)"/, "attribute.value.html"],
      [/'([^']*)'/, "attribute.value.html"],
      [/[\w\-]+/, "attribute.name.html"],
      [/=/, "delimiter.html"],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptEmbedded: [
      [/<\/script/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
      [/[^<]+/, ""]
    ],
    style: [
      [/type/, "attribute.name.html", "@styleAfterType"],
      [/"([^"]*)"/, "attribute.value.html"],
      [/'([^']*)'/, "attribute.value.html"],
      [/[\w\-]+/, "attribute.name.html"],
      [/=/, "delimiter.html"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [
        /(<\/)(style\s*)(>)/,
        ["delimiter.html", "tag.html", { token: "delimiter.html", next: "@pop" }]
      ]
    ],
    styleAfterType: [
      [/=/, "delimiter.html", "@styleAfterTypeEquals"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleAfterTypeEquals: [
      [
        /"([^"]*)"/,
        {
          token: "attribute.value.html",
          switchTo: "@styleWithCustomType.$1"
        }
      ],
      [
        /'([^']*)'/,
        {
          token: "attribute.value.html",
          switchTo: "@styleWithCustomType.$1"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleWithCustomType: [
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.$S2",
          nextEmbedded: "$S2"
        }
      ],
      [/"([^"]*)"/, "attribute.value.html"],
      [/'([^']*)'/, "attribute.value.html"],
      [/[\w\-]+/, "attribute.name.html"],
      [/=/, "delimiter.html"],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleEmbedded: [
      [/<\/style/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
      [/[^<]+/, ""]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdpZy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy90d2lnL3R3aWcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3R3aWcvdHdpZy50c1xudmFyIGNvbmYgPSB7XG4gIHdvcmRQYXR0ZXJuOiAvKC0/XFxkKlxcLlxcZFxcdyopfChbXlxcYFxcflxcIVxcQFxcJFxcXlxcJlxcKlxcKFxcKVxcPVxcK1xcW1xce1xcXVxcfVxcXFxcXHxcXDtcXDpcXCdcXFwiXFwsXFwuXFw8XFw+XFwvXFxzXSspL2csXG4gIGNvbW1lbnRzOiB7XG4gICAgYmxvY2tDb21tZW50OiBbXCJ7I1wiLCBcIiN9XCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wieyNcIiwgXCIjfVwiXSxcbiAgICBbXCJ7JVwiLCBcIiV9XCJdLFxuICAgIFtcInt7XCIsIFwifX1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiPCEtLVwiLCBcIi0tPlwiXSxcbiAgICBbXCI8XCIsIFwiPlwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcInsjIFwiLCBjbG9zZTogXCIgI31cIiB9LFxuICAgIHsgb3BlbjogXCJ7JSBcIiwgY2xvc2U6IFwiICV9XCIgfSxcbiAgICB7IG9wZW46IFwie3sgXCIsIGNsb3NlOiBcIiB9fVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH0sXG4gICAgeyBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiIH1cbiAgXVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiXCIsXG4gIGlnbm9yZUNhc2U6IHRydWUsXG4gIGtleXdvcmRzOiBbXG4gICAgXCJhcHBseVwiLFxuICAgIFwiYXV0b2VzY2FwZVwiLFxuICAgIFwiYmxvY2tcIixcbiAgICBcImRlcHJlY2F0ZWRcIixcbiAgICBcImRvXCIsXG4gICAgXCJlbWJlZFwiLFxuICAgIFwiZXh0ZW5kc1wiLFxuICAgIFwiZmx1c2hcIixcbiAgICBcImZvclwiLFxuICAgIFwiZnJvbVwiLFxuICAgIFwiaWZcIixcbiAgICBcImltcG9ydFwiLFxuICAgIFwiaW5jbHVkZVwiLFxuICAgIFwibWFjcm9cIixcbiAgICBcInNhbmRib3hcIixcbiAgICBcInNldFwiLFxuICAgIFwidXNlXCIsXG4gICAgXCJ2ZXJiYXRpbVwiLFxuICAgIFwid2l0aFwiLFxuICAgIFwiZW5kYXBwbHlcIixcbiAgICBcImVuZGF1dG9lc2NhcGVcIixcbiAgICBcImVuZGJsb2NrXCIsXG4gICAgXCJlbmRlbWJlZFwiLFxuICAgIFwiZW5kZm9yXCIsXG4gICAgXCJlbmRpZlwiLFxuICAgIFwiZW5kbWFjcm9cIixcbiAgICBcImVuZHNhbmRib3hcIixcbiAgICBcImVuZHNldFwiLFxuICAgIFwiZW5kd2l0aFwiLFxuICAgIFwidHJ1ZVwiLFxuICAgIFwiZmFsc2VcIlxuICBdLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbL1xccysvXSxcbiAgICAgIFsveyMvLCBcImNvbW1lbnQudHdpZ1wiLCBcIkBjb21tZW50U3RhdGVcIl0sXG4gICAgICBbL3slWy1+XT8vLCBcImRlbGltaXRlci50d2lnXCIsIFwiQGJsb2NrU3RhdGVcIl0sXG4gICAgICBbL3t7Wy1+XT8vLCBcImRlbGltaXRlci50d2lnXCIsIFwiQHZhcmlhYmxlU3RhdGVcIl0sXG4gICAgICBbLzwhRE9DVFlQRS8sIFwibWV0YXRhZy5odG1sXCIsIFwiQGRvY3R5cGVcIl0sXG4gICAgICBbLzwhLS0vLCBcImNvbW1lbnQuaHRtbFwiLCBcIkBjb21tZW50XCJdLFxuICAgICAgWy8oPCkoKD86W1xcd1xcLV0rOik/W1xcd1xcLV0rKShcXHMqKShcXC8+KS8sIFtcImRlbGltaXRlci5odG1sXCIsIFwidGFnLmh0bWxcIiwgXCJcIiwgXCJkZWxpbWl0ZXIuaHRtbFwiXV0sXG4gICAgICBbLyg8KShzY3JpcHQpLywgW1wiZGVsaW1pdGVyLmh0bWxcIiwgeyB0b2tlbjogXCJ0YWcuaHRtbFwiLCBuZXh0OiBcIkBzY3JpcHRcIiB9XV0sXG4gICAgICBbLyg8KShzdHlsZSkvLCBbXCJkZWxpbWl0ZXIuaHRtbFwiLCB7IHRva2VuOiBcInRhZy5odG1sXCIsIG5leHQ6IFwiQHN0eWxlXCIgfV1dLFxuICAgICAgWy8oPCkoKD86W1xcd1xcLV0rOik/W1xcd1xcLV0rKS8sIFtcImRlbGltaXRlci5odG1sXCIsIHsgdG9rZW46IFwidGFnLmh0bWxcIiwgbmV4dDogXCJAb3RoZXJUYWdcIiB9XV0sXG4gICAgICBbLyg8XFwvKSgoPzpbXFx3XFwtXSs6KT9bXFx3XFwtXSspLywgW1wiZGVsaW1pdGVyLmh0bWxcIiwgeyB0b2tlbjogXCJ0YWcuaHRtbFwiLCBuZXh0OiBcIkBvdGhlclRhZ1wiIH1dXSxcbiAgICAgIFsvPC8sIFwiZGVsaW1pdGVyLmh0bWxcIl0sXG4gICAgICBbL1tePHtdKy9dXG4gICAgXSxcbiAgICBjb21tZW50U3RhdGU6IFtcbiAgICAgIFsvI30vLCBcImNvbW1lbnQudHdpZ1wiLCBcIkBwb3BcIl0sXG4gICAgICBbLy4vLCBcImNvbW1lbnQudHdpZ1wiXVxuICAgIF0sXG4gICAgYmxvY2tTdGF0ZTogW1xuICAgICAgWy9bLX5dPyV9LywgXCJkZWxpbWl0ZXIudHdpZ1wiLCBcIkBwb3BcIl0sXG4gICAgICBbL1xccysvXSxcbiAgICAgIFtcbiAgICAgICAgLyh2ZXJiYXRpbSkoXFxzKikoWy1+XT8lfSkvLFxuICAgICAgICBbXCJrZXl3b3JkLnR3aWdcIiwgXCJcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIudHdpZ1wiLCBuZXh0OiBcIkByYXdEYXRhU3RhdGVcIiB9XVxuICAgICAgXSxcbiAgICAgIHsgaW5jbHVkZTogXCJleHByZXNzaW9uXCIgfVxuICAgIF0sXG4gICAgcmF3RGF0YVN0YXRlOiBbXG4gICAgICBbXG4gICAgICAgIC8oeyVbLX5dPykoXFxzKikoZW5kdmVyYmF0aW0pKFxccyopKFstfl0/JX0pLyxcbiAgICAgICAgW1wiZGVsaW1pdGVyLnR3aWdcIiwgXCJcIiwgXCJrZXl3b3JkLnR3aWdcIiwgXCJcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXIudHdpZ1wiLCBuZXh0OiBcIkBwb3BhbGxcIiB9XVxuICAgICAgXSxcbiAgICAgIFsvLi8sIFwic3RyaW5nLnR3aWdcIl1cbiAgICBdLFxuICAgIHZhcmlhYmxlU3RhdGU6IFtbL1stfl0/fX0vLCBcImRlbGltaXRlci50d2lnXCIsIFwiQHBvcFwiXSwgeyBpbmNsdWRlOiBcImV4cHJlc3Npb25cIiB9XSxcbiAgICBzdHJpbmdTdGF0ZTogW1xuICAgICAgWy9cIi8sIFwic3RyaW5nLnR3aWdcIiwgXCJAcG9wXCJdLFxuICAgICAgWy8je1xccyovLCBcInN0cmluZy50d2lnXCIsIFwiQGludGVycG9sYXRpb25TdGF0ZVwiXSxcbiAgICAgIFsvW14jXCJcXFxcXSooPzooPzpcXFxcLnwjKD8hXFx7KSlbXiNcIlxcXFxdKikqLywgXCJzdHJpbmcudHdpZ1wiXVxuICAgIF0sXG4gICAgaW50ZXJwb2xhdGlvblN0YXRlOiBbXG4gICAgICBbL30vLCBcInN0cmluZy50d2lnXCIsIFwiQHBvcFwiXSxcbiAgICAgIHsgaW5jbHVkZTogXCJleHByZXNzaW9uXCIgfVxuICAgIF0sXG4gICAgZXhwcmVzc2lvbjogW1xuICAgICAgWy9cXHMrL10sXG4gICAgICBbL1xcK3wtfFxcL3sxLDJ9fCV8XFwqezEsMn0vLCBcIm9wZXJhdG9ycy50d2lnXCJdLFxuICAgICAgWy8oYW5kfG9yfG5vdHxiLWFuZHxiLXhvcnxiLW9yKShcXHMrKS8sIFtcIm9wZXJhdG9ycy50d2lnXCIsIFwiXCJdXSxcbiAgICAgIFsvPT18IT18PHw+fD49fDw9LywgXCJvcGVyYXRvcnMudHdpZ1wiXSxcbiAgICAgIFsvKHN0YXJ0cyB3aXRofGVuZHMgd2l0aHxtYXRjaGVzKShcXHMrKS8sIFtcIm9wZXJhdG9ycy50d2lnXCIsIFwiXCJdXSxcbiAgICAgIFsvKGluKShcXHMrKS8sIFtcIm9wZXJhdG9ycy50d2lnXCIsIFwiXCJdXSxcbiAgICAgIFsvKGlzKShcXHMrKS8sIFtcIm9wZXJhdG9ycy50d2lnXCIsIFwiXCJdXSxcbiAgICAgIFsvXFx8fH58OnxcXC57MSwyfXxcXD97MSwyfS8sIFwib3BlcmF0b3JzLnR3aWdcIl0sXG4gICAgICBbXG4gICAgICAgIC9bXlxcV1xcZF1bXFx3XSovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IFwia2V5d29yZC50d2lnXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwidmFyaWFibGUudHdpZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9cXGQrKFxcLlxcZCspPy8sIFwibnVtYmVyLnR3aWdcIl0sXG4gICAgICBbL1xcKHxcXCl8XFxbfFxcXXx7fH18LC8sIFwiZGVsaW1pdGVyLnR3aWdcIl0sXG4gICAgICBbL1wiKFteI1wiXFxcXF0qKD86XFxcXC5bXiNcIlxcXFxdKikqKVwifFxcJyhbXlxcJ1xcXFxdKig/OlxcXFwuW15cXCdcXFxcXSopKilcXCcvLCBcInN0cmluZy50d2lnXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nLnR3aWdcIiwgXCJAc3RyaW5nU3RhdGVcIl0sXG4gICAgICBbLz0+LywgXCJvcGVyYXRvcnMudHdpZ1wiXSxcbiAgICAgIFsvPS8sIFwib3BlcmF0b3JzLnR3aWdcIl1cbiAgICBdLFxuICAgIGRvY3R5cGU6IFtcbiAgICAgIFsvW14+XSsvLCBcIm1ldGF0YWcuY29udGVudC5odG1sXCJdLFxuICAgICAgWy8+LywgXCJtZXRhdGFnLmh0bWxcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbLy0tPi8sIFwiY29tbWVudC5odG1sXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW14tXSsvLCBcImNvbW1lbnQuY29udGVudC5odG1sXCJdLFxuICAgICAgWy8uLywgXCJjb21tZW50LmNvbnRlbnQuaHRtbFwiXVxuICAgIF0sXG4gICAgb3RoZXJUYWc6IFtcbiAgICAgIFsvXFwvPz4vLCBcImRlbGltaXRlci5odG1sXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvXCIoW15cIl0qKVwiLywgXCJhdHRyaWJ1dGUudmFsdWUuaHRtbFwiXSxcbiAgICAgIFsvJyhbXiddKiknLywgXCJhdHRyaWJ1dGUudmFsdWUuaHRtbFwiXSxcbiAgICAgIFsvW1xcd1xcLV0rLywgXCJhdHRyaWJ1dGUubmFtZS5odG1sXCJdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXIuaHRtbFwiXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dXG4gICAgXSxcbiAgICBzY3JpcHQ6IFtcbiAgICAgIFsvdHlwZS8sIFwiYXR0cmlidXRlLm5hbWUuaHRtbFwiLCBcIkBzY3JpcHRBZnRlclR5cGVcIl0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlLmh0bWxcIl0sXG4gICAgICBbLycoW14nXSopJy8sIFwiYXR0cmlidXRlLnZhbHVlLmh0bWxcIl0sXG4gICAgICBbL1tcXHdcXC1dKy8sIFwiYXR0cmlidXRlLm5hbWUuaHRtbFwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyLmh0bWxcIl0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc2NyaXB0RW1iZWRkZWRcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9qYXZhc2NyaXB0XCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgW1xuICAgICAgICAvKDxcXC8pKHNjcmlwdFxccyopKD4pLyxcbiAgICAgICAgW1wiZGVsaW1pdGVyLmh0bWxcIiwgXCJ0YWcuaHRtbFwiLCB7IHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgICBdXG4gICAgXSxcbiAgICBzY3JpcHRBZnRlclR5cGU6IFtcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyLmh0bWxcIiwgXCJAc2NyaXB0QWZ0ZXJUeXBlRXF1YWxzXCJdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHNjcmlwdEVtYmVkZGVkXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcInRleHQvamF2YXNjcmlwdFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvPFxcL3NjcmlwdFxccyo+LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc2NyaXB0QWZ0ZXJUeXBlRXF1YWxzOiBbXG4gICAgICBbXG4gICAgICAgIC9cIihbXlwiXSopXCIvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlLmh0bWxcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc2NyaXB0V2l0aEN1c3RvbVR5cGUuJDFcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvJyhbXiddKiknLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImF0dHJpYnV0ZS52YWx1ZS5odG1sXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHNjcmlwdFdpdGhDdXN0b21UeXBlLiQxXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzY3JpcHRFbWJlZGRlZFwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2phdmFzY3JpcHRcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLzxcXC9zY3JpcHRcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHNjcmlwdFdpdGhDdXN0b21UeXBlOiBbXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc2NyaXB0RW1iZWRkZWQuJFMyXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcIiRTMlwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlLmh0bWxcIl0sXG4gICAgICBbLycoW14nXSopJy8sIFwiYXR0cmlidXRlLnZhbHVlLmh0bWxcIl0sXG4gICAgICBbL1tcXHdcXC1dKy8sIFwiYXR0cmlidXRlLm5hbWUuaHRtbFwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyLmh0bWxcIl0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvPFxcL3NjcmlwdFxccyo+LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc2NyaXB0RW1iZWRkZWQ6IFtcbiAgICAgIFsvPFxcL3NjcmlwdC8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIsIG5leHRFbWJlZGRlZDogXCJAcG9wXCIgfV0sXG4gICAgICBbL1tePF0rLywgXCJcIl1cbiAgICBdLFxuICAgIHN0eWxlOiBbXG4gICAgICBbL3R5cGUvLCBcImF0dHJpYnV0ZS5uYW1lLmh0bWxcIiwgXCJAc3R5bGVBZnRlclR5cGVcIl0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlLmh0bWxcIl0sXG4gICAgICBbLycoW14nXSopJy8sIFwiYXR0cmlidXRlLnZhbHVlLmh0bWxcIl0sXG4gICAgICBbL1tcXHdcXC1dKy8sIFwiYXR0cmlidXRlLm5hbWUuaHRtbFwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyLmh0bWxcIl0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc3R5bGVFbWJlZGRlZFwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2Nzc1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFtcbiAgICAgICAgLyg8XFwvKShzdHlsZVxccyopKD4pLyxcbiAgICAgICAgW1wiZGVsaW1pdGVyLmh0bWxcIiwgXCJ0YWcuaHRtbFwiLCB7IHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgICBdXG4gICAgXSxcbiAgICBzdHlsZUFmdGVyVHlwZTogW1xuICAgICAgWy89LywgXCJkZWxpbWl0ZXIuaHRtbFwiLCBcIkBzdHlsZUFmdGVyVHlwZUVxdWFsc1wiXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzdHlsZUVtYmVkZGVkXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcInRleHQvY3NzXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc3R5bGVcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHN0eWxlQWZ0ZXJUeXBlRXF1YWxzOiBbXG4gICAgICBbXG4gICAgICAgIC9cIihbXlwiXSopXCIvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlLmh0bWxcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc3R5bGVXaXRoQ3VzdG9tVHlwZS4kMVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8nKFteJ10qKScvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlLmh0bWxcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc3R5bGVXaXRoQ3VzdG9tVHlwZS4kMVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc3R5bGVFbWJlZGRlZFwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2Nzc1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvPFxcL3N0eWxlXFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzdHlsZVdpdGhDdXN0b21UeXBlOiBbXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc3R5bGVFbWJlZGRlZC4kUzJcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiJFMyXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXCIoW15cIl0qKVwiLywgXCJhdHRyaWJ1dGUudmFsdWUuaHRtbFwiXSxcbiAgICAgIFsvJyhbXiddKiknLywgXCJhdHRyaWJ1dGUudmFsdWUuaHRtbFwiXSxcbiAgICAgIFsvW1xcd1xcLV0rLywgXCJhdHRyaWJ1dGUubmFtZS5odG1sXCJdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXIuaHRtbFwiXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc3R5bGVcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHN0eWxlRW1iZWRkZWQ6IFtcbiAgICAgIFsvPFxcL3N0eWxlLywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiwgbmV4dEVtYmVkZGVkOiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvW148XSsvLCBcIlwiXVxuICAgIF1cbiAgfVxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59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
