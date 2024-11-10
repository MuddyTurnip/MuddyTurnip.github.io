/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    blockComment: ["<!--", "-->"]
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
    { open: "<", close: ">", notIn: ["string"] }
  ],
  surroundingPairs: [
    { open: "(", close: ")" },
    { open: "[", close: "]" },
    { open: "`", close: "`" }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*<!--\\s*#?region\\b.*-->"),
      end: new RegExp("^\\s*<!--\\s*#?endregion\\b.*-->")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".md",
  control: /[\\`*_\[\]{}()#+\-\.!]/,
  noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
  escapes: /\\(?:@control)/,
  jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
  empty: [
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "link",
    "meta",
    "param"
  ],
  tokenizer: {
    root: [
      [/^\s*\|/, "@rematch", "@table_header"],
      [/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/, ["white", "keyword", "keyword", "keyword"]],
      [/^\s*(=+|\-+)\s*$/, "keyword"],
      [/^\s*((\*[ ]?)+)\s*$/, "meta.separator"],
      [/^\s*>+/, "comment"],
      [/^\s*([\*\-+:]|\d+\.)\s/, "keyword"],
      [/^(\t|[ ]{4})[^ ].*$/, "string"],
      [/^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/, { token: "string", next: "@codeblock" }],
      [
        /^\s*```\s*((?:\w|[\/\-#])+).*$/,
        { token: "string", next: "@codeblockgh", nextEmbedded: "$1" }
      ],
      [/^\s*```\s*$/, { token: "string", next: "@codeblock" }],
      { include: "@linecontent" }
    ],
    table_header: [
      { include: "@table_common" },
      [/[^\|]+/, "keyword.table.header"]
    ],
    table_body: [{ include: "@table_common" }, { include: "@linecontent" }],
    table_common: [
      [/\s*[\-:]+\s*/, { token: "keyword", switchTo: "table_body" }],
      [/^\s*\|/, "keyword.table.left"],
      [/^\s*[^\|]/, "@rematch", "@pop"],
      [/^\s*$/, "@rematch", "@pop"],
      [
        /\|/,
        {
          cases: {
            "@eos": "keyword.table.right",
            "@default": "keyword.table.middle"
          }
        }
      ]
    ],
    codeblock: [
      [/^\s*~~~\s*$/, { token: "string", next: "@pop" }],
      [/^\s*```\s*$/, { token: "string", next: "@pop" }],
      [/.*$/, "variable.source"]
    ],
    codeblockgh: [
      [/```\s*$/, { token: "string", next: "@pop", nextEmbedded: "@pop" }],
      [/[^`]+/, "variable.source"]
    ],
    linecontent: [
      [/&\w+;/, "string.escape"],
      [/@escapes/, "escape"],
      [/\b__([^\\_]|@escapes|_(?!_))+__\b/, "strong"],
      [/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/, "strong"],
      [/\b_[^_]+_\b/, "emphasis"],
      [/\*([^\\*]|@escapes)+\*/, "emphasis"],
      [/`([^\\`]|@escapes)+`/, "variable"],
      [/\{+[^}]+\}+/, "string.target"],
      [/(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/, ["string.link", "", "string.link"]],
      [/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, "string.link"],
      { include: "html" }
    ],
    html: [
      [/<(\w+)\/>/, "tag"],
      [
        /<(\w+)(\-|\w)*/,
        {
          cases: {
            "@empty": { token: "tag", next: "@tag.$1" },
            "@default": { token: "tag", next: "@tag.$1" }
          }
        }
      ],
      [/<\/(\w+)(\-|\w)*\s*>/, { token: "tag" }],
      [/<!--/, "comment", "@comment"]
    ],
    comment: [
      [/[^<\-]+/, "comment.content"],
      [/-->/, "comment", "@pop"],
      [/<!--/, "comment.content.invalid"],
      [/[<\-]/, "comment.content"]
    ],
    tag: [
      [/[ \t\r\n]+/, "white"],
      [
        /(type)(\s*=\s*)(")([^"]+)(")/,
        [
          "attribute.name.html",
          "delimiter.html",
          "string.html",
          { token: "string.html", switchTo: "@tag.$S2.$4" },
          "string.html"
        ]
      ],
      [
        /(type)(\s*=\s*)(')([^']+)(')/,
        [
          "attribute.name.html",
          "delimiter.html",
          "string.html",
          { token: "string.html", switchTo: "@tag.$S2.$4" },
          "string.html"
        ]
      ],
      [/(\w+)(\s*=\s*)("[^"]*"|'[^']*')/, ["attribute.name.html", "delimiter.html", "string.html"]],
      [/\w+/, "attribute.name.html"],
      [/\/>/, "tag", "@pop"],
      [
        />/,
        {
          cases: {
            "$S2==style": {
              token: "tag",
              switchTo: "embeddedStyle",
              nextEmbedded: "text/css"
            },
            "$S2==script": {
              cases: {
                $S3: {
                  token: "tag",
                  switchTo: "embeddedScript",
                  nextEmbedded: "$S3"
                },
                "@default": {
                  token: "tag",
                  switchTo: "embeddedScript",
                  nextEmbedded: "text/javascript"
                }
              }
            },
            "@default": { token: "tag", next: "@pop" }
          }
        }
      ]
    ],
    embeddedStyle: [
      [/[^<]+/, ""],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
      [/</, ""]
    ],
    embeddedScript: [
      [/[^<]+/, ""],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
      [/</, ""]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24uanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvbWFya2Rvd24vbWFya2Rvd24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL21hcmtkb3duL21hcmtkb3duLnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBibG9ja0NvbW1lbnQ6IFtcIjwhLS1cIiwgXCItLT5cIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiLCBub3RJbjogW1wic3RyaW5nXCJdIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCJgXCIsIGNsb3NlOiBcImBcIiB9XG4gIF0sXG4gIGZvbGRpbmc6IHtcbiAgICBtYXJrZXJzOiB7XG4gICAgICBzdGFydDogbmV3IFJlZ0V4cChcIl5cXFxccyo8IS0tXFxcXHMqIz9yZWdpb25cXFxcYi4qLS0+XCIpLFxuICAgICAgZW5kOiBuZXcgUmVnRXhwKFwiXlxcXFxzKjwhLS1cXFxccyojP2VuZHJlZ2lvblxcXFxiLiotLT5cIilcbiAgICB9XG4gIH1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5tZFwiLFxuICBjb250cm9sOiAvW1xcXFxgKl9cXFtcXF17fSgpIytcXC1cXC4hXS8sXG4gIG5vbmNvbnRyb2w6IC9bXlxcXFxgKl9cXFtcXF17fSgpIytcXC1cXC4hXS8sXG4gIGVzY2FwZXM6IC9cXFxcKD86QGNvbnRyb2wpLyxcbiAganNlc2NhcGVzOiAvXFxcXCg/OltidG5mclxcXFxcIiddfFswLTddWzAtN10/fFswLTNdWzAtN117Mn0pLyxcbiAgZW1wdHk6IFtcbiAgICBcImFyZWFcIixcbiAgICBcImJhc2VcIixcbiAgICBcImJhc2Vmb250XCIsXG4gICAgXCJiclwiLFxuICAgIFwiY29sXCIsXG4gICAgXCJmcmFtZVwiLFxuICAgIFwiaHJcIixcbiAgICBcImltZ1wiLFxuICAgIFwiaW5wdXRcIixcbiAgICBcImlzaW5kZXhcIixcbiAgICBcImxpbmtcIixcbiAgICBcIm1ldGFcIixcbiAgICBcInBhcmFtXCJcbiAgXSxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy9eXFxzKlxcfC8sIFwiQHJlbWF0Y2hcIiwgXCJAdGFibGVfaGVhZGVyXCJdLFxuICAgICAgWy9eKFxcc3swLDN9KSgjKykoKD86W15cXFxcI118QGVzY2FwZXMpKykoKD86IyspPykvLCBbXCJ3aGl0ZVwiLCBcImtleXdvcmRcIiwgXCJrZXl3b3JkXCIsIFwia2V5d29yZFwiXV0sXG4gICAgICBbL15cXHMqKD0rfFxcLSspXFxzKiQvLCBcImtleXdvcmRcIl0sXG4gICAgICBbL15cXHMqKChcXCpbIF0/KSspXFxzKiQvLCBcIm1ldGEuc2VwYXJhdG9yXCJdLFxuICAgICAgWy9eXFxzKj4rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9eXFxzKihbXFwqXFwtKzpdfFxcZCtcXC4pXFxzLywgXCJrZXl3b3JkXCJdLFxuICAgICAgWy9eKFxcdHxbIF17NH0pW14gXS4qJC8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9eXFxzKn5+flxccyooKD86XFx3fFtcXC9cXC0jXSkrKT9cXHMqJC8sIHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQGNvZGVibG9ja1wiIH1dLFxuICAgICAgW1xuICAgICAgICAvXlxccypgYGBcXHMqKCg/Olxcd3xbXFwvXFwtI10pKykuKiQvLFxuICAgICAgICB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBjb2RlYmxvY2tnaFwiLCBuZXh0RW1iZWRkZWQ6IFwiJDFcIiB9XG4gICAgICBdLFxuICAgICAgWy9eXFxzKmBgYFxccyokLywgeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAY29kZWJsb2NrXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGxpbmVjb250ZW50XCIgfVxuICAgIF0sXG4gICAgdGFibGVfaGVhZGVyOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHRhYmxlX2NvbW1vblwiIH0sXG4gICAgICBbL1teXFx8XSsvLCBcImtleXdvcmQudGFibGUuaGVhZGVyXCJdXG4gICAgXSxcbiAgICB0YWJsZV9ib2R5OiBbeyBpbmNsdWRlOiBcIkB0YWJsZV9jb21tb25cIiB9LCB7IGluY2x1ZGU6IFwiQGxpbmVjb250ZW50XCIgfV0sXG4gICAgdGFibGVfY29tbW9uOiBbXG4gICAgICBbL1xccypbXFwtOl0rXFxzKi8sIHsgdG9rZW46IFwia2V5d29yZFwiLCBzd2l0Y2hUbzogXCJ0YWJsZV9ib2R5XCIgfV0sXG4gICAgICBbL15cXHMqXFx8LywgXCJrZXl3b3JkLnRhYmxlLmxlZnRcIl0sXG4gICAgICBbL15cXHMqW15cXHxdLywgXCJAcmVtYXRjaFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL15cXHMqJC8sIFwiQHJlbWF0Y2hcIiwgXCJAcG9wXCJdLFxuICAgICAgW1xuICAgICAgICAvXFx8LyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogXCJrZXl3b3JkLnRhYmxlLnJpZ2h0XCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwia2V5d29yZC50YWJsZS5taWRkbGVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIF0sXG4gICAgY29kZWJsb2NrOiBbXG4gICAgICBbL15cXHMqfn5+XFxzKiQvLCB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvXlxccypgYGBcXHMqJC8sIHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgWy8uKiQvLCBcInZhcmlhYmxlLnNvdXJjZVwiXVxuICAgIF0sXG4gICAgY29kZWJsb2NrZ2g6IFtcbiAgICAgIFsvYGBgXFxzKiQvLCB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BcIiwgbmV4dEVtYmVkZGVkOiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvW15gXSsvLCBcInZhcmlhYmxlLnNvdXJjZVwiXVxuICAgIF0sXG4gICAgbGluZWNvbnRlbnQ6IFtcbiAgICAgIFsvJlxcdys7LywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwiZXNjYXBlXCJdLFxuICAgICAgWy9cXGJfXyhbXlxcXFxfXXxAZXNjYXBlc3xfKD8hXykpK19fXFxiLywgXCJzdHJvbmdcIl0sXG4gICAgICBbL1xcKlxcKihbXlxcXFwqXXxAZXNjYXBlc3xcXCooPyFcXCopKStcXCpcXCovLCBcInN0cm9uZ1wiXSxcbiAgICAgIFsvXFxiX1teX10rX1xcYi8sIFwiZW1waGFzaXNcIl0sXG4gICAgICBbL1xcKihbXlxcXFwqXXxAZXNjYXBlcykrXFwqLywgXCJlbXBoYXNpc1wiXSxcbiAgICAgIFsvYChbXlxcXFxgXXxAZXNjYXBlcykrYC8sIFwidmFyaWFibGVcIl0sXG4gICAgICBbL1xceytbXn1dK1xcfSsvLCBcInN0cmluZy50YXJnZXRcIl0sXG4gICAgICBbLyghP1xcWykoKD86W15cXF1cXFxcXXxAZXNjYXBlcykqKShcXF1cXChbXlxcKV0rXFwpKS8sIFtcInN0cmluZy5saW5rXCIsIFwiXCIsIFwic3RyaW5nLmxpbmtcIl1dLFxuICAgICAgWy8oIT9cXFspKCg/OlteXFxdXFxcXF18QGVzY2FwZXMpKikoXFxdKS8sIFwic3RyaW5nLmxpbmtcIl0sXG4gICAgICB7IGluY2x1ZGU6IFwiaHRtbFwiIH1cbiAgICBdLFxuICAgIGh0bWw6IFtcbiAgICAgIFsvPChcXHcrKVxcLz4vLCBcInRhZ1wiXSxcbiAgICAgIFtcbiAgICAgICAgLzwoXFx3KykoXFwtfFxcdykqLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlbXB0eVwiOiB7IHRva2VuOiBcInRhZ1wiLCBuZXh0OiBcIkB0YWcuJDFcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcInRhZ1wiLCBuZXh0OiBcIkB0YWcuJDFcIiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy88XFwvKFxcdyspKFxcLXxcXHcpKlxccyo+LywgeyB0b2tlbjogXCJ0YWdcIiB9XSxcbiAgICAgIFsvPCEtLS8sIFwiY29tbWVudFwiLCBcIkBjb21tZW50XCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1tePFxcLV0rLywgXCJjb21tZW50LmNvbnRlbnRcIl0sXG4gICAgICBbLy0tPi8sIFwiY29tbWVudFwiLCBcIkBwb3BcIl0sXG4gICAgICBbLzwhLS0vLCBcImNvbW1lbnQuY29udGVudC5pbnZhbGlkXCJdLFxuICAgICAgWy9bPFxcLV0vLCBcImNvbW1lbnQuY29udGVudFwiXVxuICAgIF0sXG4gICAgdGFnOiBbXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIndoaXRlXCJdLFxuICAgICAgW1xuICAgICAgICAvKHR5cGUpKFxccyo9XFxzKikoXCIpKFteXCJdKykoXCIpLyxcbiAgICAgICAgW1xuICAgICAgICAgIFwiYXR0cmlidXRlLm5hbWUuaHRtbFwiLFxuICAgICAgICAgIFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBcInN0cmluZy5odG1sXCIsXG4gICAgICAgICAgeyB0b2tlbjogXCJzdHJpbmcuaHRtbFwiLCBzd2l0Y2hUbzogXCJAdGFnLiRTMi4kNFwiIH0sXG4gICAgICAgICAgXCJzdHJpbmcuaHRtbFwiXG4gICAgICAgIF1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8odHlwZSkoXFxzKj1cXHMqKSgnKShbXiddKykoJykvLFxuICAgICAgICBbXG4gICAgICAgICAgXCJhdHRyaWJ1dGUubmFtZS5odG1sXCIsXG4gICAgICAgICAgXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIFwic3RyaW5nLmh0bWxcIixcbiAgICAgICAgICB7IHRva2VuOiBcInN0cmluZy5odG1sXCIsIHN3aXRjaFRvOiBcIkB0YWcuJFMyLiQ0XCIgfSxcbiAgICAgICAgICBcInN0cmluZy5odG1sXCJcbiAgICAgICAgXVxuICAgICAgXSxcbiAgICAgIFsvKFxcdyspKFxccyo9XFxzKikoXCJbXlwiXSpcInwnW14nXSonKS8sIFtcImF0dHJpYnV0ZS5uYW1lLmh0bWxcIiwgXCJkZWxpbWl0ZXIuaHRtbFwiLCBcInN0cmluZy5odG1sXCJdXSxcbiAgICAgIFsvXFx3Ky8sIFwiYXR0cmlidXRlLm5hbWUuaHRtbFwiXSxcbiAgICAgIFsvXFwvPi8sIFwidGFnXCIsIFwiQHBvcFwiXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiJFMyPT1zdHlsZVwiOiB7XG4gICAgICAgICAgICAgIHRva2VuOiBcInRhZ1wiLFxuICAgICAgICAgICAgICBzd2l0Y2hUbzogXCJlbWJlZGRlZFN0eWxlXCIsXG4gICAgICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2Nzc1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkUzI9PXNjcmlwdFwiOiB7XG4gICAgICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICAgICAgJFMzOiB7XG4gICAgICAgICAgICAgICAgICB0b2tlbjogXCJ0YWdcIixcbiAgICAgICAgICAgICAgICAgIHN3aXRjaFRvOiBcImVtYmVkZGVkU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiJFMzXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiQGRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgdG9rZW46IFwidGFnXCIsXG4gICAgICAgICAgICAgICAgICBzd2l0Y2hUbzogXCJlbWJlZGRlZFNjcmlwdFwiLFxuICAgICAgICAgICAgICAgICAgbmV4dEVtYmVkZGVkOiBcInRleHQvamF2YXNjcmlwdFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcInRhZ1wiLCBuZXh0OiBcIkBwb3BcIiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBlbWJlZGRlZFN0eWxlOiBbXG4gICAgICBbL1tePF0rLywgXCJcIl0sXG4gICAgICBbLzxcXC9zdHlsZVxccyo+LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiwgbmV4dEVtYmVkZGVkOiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvPC8sIFwiXCJdXG4gICAgXSxcbiAgICBlbWJlZGRlZFNjcmlwdDogW1xuICAgICAgWy9bXjxdKy8sIFwiXCJdLFxuICAgICAgWy88XFwvc2NyaXB0XFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiLCBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiIH1dLFxuICAgICAgWy88LywgXCJcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGNBQWMsQ0FBQyxRQUFRLEtBQUs7QUFBQSxFQUM3QjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsUUFBUSxFQUFHO0FBQUEsRUFDN0M7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFCO0FBQUEsRUFDRCxTQUFTO0FBQUEsSUFDUCxTQUFTO0FBQUEsTUFDUCxP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
