import { m as monaco_editor_core_star } from "./index.js";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);
var monaco_editor_core_exports = {};
__reExport(monaco_editor_core_exports, monaco_editor_core_star);
var EMPTY_ELEMENTS = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "menuitem",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
  comments: {
    blockComment: ["<!--", "-->"]
  },
  brackets: [
    ["<!--", "-->"],
    ["<", ">"],
    ["{", "}"],
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
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "<", close: ">" }
  ],
  onEnterRules: [
    {
      beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
      afterText: /^<\/(\w[\w\d]*)\s*>$/i,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent
      }
    },
    {
      beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
    }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: "",
  tokenizer: {
    root: [
      [/@@@@/],
      [/@[^@]/, { token: "@rematch", switchTo: "@razorInSimpleState.root" }],
      [/<!DOCTYPE/, "metatag.html", "@doctype"],
      [/<!--/, "comment.html", "@comment"],
      [/(<)([\w\-]+)(\/>)/, ["delimiter.html", "tag.html", "delimiter.html"]],
      [/(<)(script)/, ["delimiter.html", { token: "tag.html", next: "@script" }]],
      [/(<)(style)/, ["delimiter.html", { token: "tag.html", next: "@style" }]],
      [/(<)([:\w\-]+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
      [/(<\/)([\w\-]+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
      [/</, "delimiter.html"],
      [/[ \t\r\n]+/],
      [/[^<@]+/]
    ],
    doctype: [
      [/@[^@]/, { token: "@rematch", switchTo: "@razorInSimpleState.comment" }],
      [/[^>]+/, "metatag.content.html"],
      [/>/, "metatag.html", "@pop"]
    ],
    comment: [
      [/@[^@]/, { token: "@rematch", switchTo: "@razorInSimpleState.comment" }],
      [/-->/, "comment.html", "@pop"],
      [/[^-]+/, "comment.content.html"],
      [/./, "comment.content.html"]
    ],
    otherTag: [
      [/@[^@]/, { token: "@rematch", switchTo: "@razorInSimpleState.otherTag" }],
      [/\/?>/, "delimiter.html", "@pop"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/]
    ],
    script: [
      [/@[^@]/, { token: "@rematch", switchTo: "@razorInSimpleState.script" }],
      [/type/, "attribute.name", "@scriptAfterType"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.text/javascript",
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
      [
        /@[^@]/,
        {
          token: "@rematch",
          switchTo: "@razorInSimpleState.scriptAfterType"
        }
      ],
      [/=/, "delimiter", "@scriptAfterTypeEquals"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.text/javascript",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptAfterTypeEquals: [
      [
        /@[^@]/,
        {
          token: "@rematch",
          switchTo: "@razorInSimpleState.scriptAfterTypeEquals"
        }
      ],
      [
        /"([^"]*)"/,
        {
          token: "attribute.value",
          switchTo: "@scriptWithCustomType.$1"
        }
      ],
      [
        /'([^']*)'/,
        {
          token: "attribute.value",
          switchTo: "@scriptWithCustomType.$1"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.text/javascript",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptWithCustomType: [
      [
        /@[^@]/,
        {
          token: "@rematch",
          switchTo: "@razorInSimpleState.scriptWithCustomType.$S2"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@scriptEmbedded.$S2",
          nextEmbedded: "$S2"
        }
      ],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptEmbedded: [
      [
        /@[^@]/,
        {
          token: "@rematch",
          switchTo: "@razorInEmbeddedState.scriptEmbedded.$S2",
          nextEmbedded: "@pop"
        }
      ],
      [/<\/script/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]
    ],
    style: [
      [/@[^@]/, { token: "@rematch", switchTo: "@razorInSimpleState.style" }],
      [/type/, "attribute.name", "@styleAfterType"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.text/css",
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
      [
        /@[^@]/,
        {
          token: "@rematch",
          switchTo: "@razorInSimpleState.styleAfterType"
        }
      ],
      [/=/, "delimiter", "@styleAfterTypeEquals"],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.text/css",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleAfterTypeEquals: [
      [
        /@[^@]/,
        {
          token: "@rematch",
          switchTo: "@razorInSimpleState.styleAfterTypeEquals"
        }
      ],
      [
        /"([^"]*)"/,
        {
          token: "attribute.value",
          switchTo: "@styleWithCustomType.$1"
        }
      ],
      [
        /'([^']*)'/,
        {
          token: "attribute.value",
          switchTo: "@styleWithCustomType.$1"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.text/css",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleWithCustomType: [
      [
        /@[^@]/,
        {
          token: "@rematch",
          switchTo: "@razorInSimpleState.styleWithCustomType.$S2"
        }
      ],
      [
        />/,
        {
          token: "delimiter.html",
          next: "@styleEmbedded.$S2",
          nextEmbedded: "$S2"
        }
      ],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleEmbedded: [
      [
        /@[^@]/,
        {
          token: "@rematch",
          switchTo: "@razorInEmbeddedState.styleEmbedded.$S2",
          nextEmbedded: "@pop"
        }
      ],
      [/<\/style/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]
    ],
    razorInSimpleState: [
      [/@\*/, "comment.cs", "@razorBlockCommentTopLevel"],
      [/@[{(]/, "metatag.cs", "@razorRootTopLevel"],
      [/(@)(\s*[\w]+)/, ["metatag.cs", { token: "identifier.cs", switchTo: "@$S2.$S3" }]],
      [/[})]/, { token: "metatag.cs", switchTo: "@$S2.$S3" }],
      [/\*@/, { token: "comment.cs", switchTo: "@$S2.$S3" }]
    ],
    razorInEmbeddedState: [
      [/@\*/, "comment.cs", "@razorBlockCommentTopLevel"],
      [/@[{(]/, "metatag.cs", "@razorRootTopLevel"],
      [
        /(@)(\s*[\w]+)/,
        [
          "metatag.cs",
          {
            token: "identifier.cs",
            switchTo: "@$S2.$S3",
            nextEmbedded: "$S3"
          }
        ]
      ],
      [
        /[})]/,
        {
          token: "metatag.cs",
          switchTo: "@$S2.$S3",
          nextEmbedded: "$S3"
        }
      ],
      [
        /\*@/,
        {
          token: "comment.cs",
          switchTo: "@$S2.$S3",
          nextEmbedded: "$S3"
        }
      ]
    ],
    razorBlockCommentTopLevel: [
      [/\*@/, "@rematch", "@pop"],
      [/[^*]+/, "comment.cs"],
      [/./, "comment.cs"]
    ],
    razorBlockComment: [
      [/\*@/, "comment.cs", "@pop"],
      [/[^*]+/, "comment.cs"],
      [/./, "comment.cs"]
    ],
    razorRootTopLevel: [
      [/\{/, "delimiter.bracket.cs", "@razorRoot"],
      [/\(/, "delimiter.parenthesis.cs", "@razorRoot"],
      [/[})]/, "@rematch", "@pop"],
      { include: "razorCommon" }
    ],
    razorRoot: [
      [/\{/, "delimiter.bracket.cs", "@razorRoot"],
      [/\(/, "delimiter.parenthesis.cs", "@razorRoot"],
      [/\}/, "delimiter.bracket.cs", "@pop"],
      [/\)/, "delimiter.parenthesis.cs", "@pop"],
      { include: "razorCommon" }
    ],
    razorCommon: [
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@razorKeywords": { token: "keyword.cs" },
            "@default": "identifier.cs"
          }
        }
      ],
      [/[\[\]]/, "delimiter.array.cs"],
      [/[ \t\r\n]+/],
      [/\/\/.*$/, "comment.cs"],
      [/@\*/, "comment.cs", "@razorBlockComment"],
      [/"([^"]*)"/, "string.cs"],
      [/'([^']*)'/, "string.cs"],
      [/(<)([\w\-]+)(\/>)/, ["delimiter.html", "tag.html", "delimiter.html"]],
      [/(<)([\w\-]+)(>)/, ["delimiter.html", "tag.html", "delimiter.html"]],
      [/(<\/)([\w\-]+)(>)/, ["delimiter.html", "tag.html", "delimiter.html"]],
      [/[\+\-\*\%\&\|\^\~\!\=\<\>\/\?\;\:\.\,]/, "delimiter.cs"],
      [/\d*\d+[eE]([\-+]?\d+)?/, "number.float.cs"],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float.cs"],
      [/0[xX][0-9a-fA-F']*[0-9a-fA-F]/, "number.hex.cs"],
      [/0[0-7']*[0-7]/, "number.octal.cs"],
      [/0[bB][0-1']*[0-1]/, "number.binary.cs"],
      [/\d[\d']*/, "number.cs"],
      [/\d/, "number.cs"]
    ]
  },
  razorKeywords: [
    "abstract",
    "as",
    "async",
    "await",
    "base",
    "bool",
    "break",
    "by",
    "byte",
    "case",
    "catch",
    "char",
    "checked",
    "class",
    "const",
    "continue",
    "decimal",
    "default",
    "delegate",
    "do",
    "double",
    "descending",
    "explicit",
    "event",
    "extern",
    "else",
    "enum",
    "false",
    "finally",
    "fixed",
    "float",
    "for",
    "foreach",
    "from",
    "goto",
    "group",
    "if",
    "implicit",
    "in",
    "int",
    "interface",
    "internal",
    "into",
    "is",
    "lock",
    "long",
    "nameof",
    "new",
    "null",
    "namespace",
    "object",
    "operator",
    "out",
    "override",
    "orderby",
    "params",
    "private",
    "protected",
    "public",
    "readonly",
    "ref",
    "return",
    "switch",
    "struct",
    "sbyte",
    "sealed",
    "short",
    "sizeof",
    "stackalloc",
    "static",
    "string",
    "select",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "uint",
    "ulong",
    "unchecked",
    "unsafe",
    "ushort",
    "using",
    "var",
    "virtual",
    "volatile",
    "void",
    "when",
    "while",
    "where",
    "yield",
    "model",
    "inject"
  ],
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF6b3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvcmF6b3IvcmF6b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3JlRXhwb3J0ID0gKHRhcmdldCwgbW9kLCBzZWNvbmRUYXJnZXQpID0+IChfX2NvcHlQcm9wcyh0YXJnZXQsIG1vZCwgXCJkZWZhdWx0XCIpLCBzZWNvbmRUYXJnZXQgJiYgX19jb3B5UHJvcHMoc2Vjb25kVGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSk7XG5cbi8vIHNyYy9maWxsZXJzL21vbmFjby1lZGl0b3ItY29yZS50c1xudmFyIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzID0ge307XG5fX3JlRXhwb3J0KG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLCBtb25hY29fZWRpdG9yX2NvcmVfc3Rhcik7XG5pbXBvcnQgKiBhcyBtb25hY29fZWRpdG9yX2NvcmVfc3RhciBmcm9tIFwiLi4vLi4vZWRpdG9yL2VkaXRvci5hcGkuanNcIjtcblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy9yYXpvci9yYXpvci50c1xudmFyIEVNUFRZX0VMRU1FTlRTID0gW1xuICBcImFyZWFcIixcbiAgXCJiYXNlXCIsXG4gIFwiYnJcIixcbiAgXCJjb2xcIixcbiAgXCJlbWJlZFwiLFxuICBcImhyXCIsXG4gIFwiaW1nXCIsXG4gIFwiaW5wdXRcIixcbiAgXCJrZXlnZW5cIixcbiAgXCJsaW5rXCIsXG4gIFwibWVudWl0ZW1cIixcbiAgXCJtZXRhXCIsXG4gIFwicGFyYW1cIixcbiAgXCJzb3VyY2VcIixcbiAgXCJ0cmFja1wiLFxuICBcIndiclwiXG5dO1xudmFyIGNvbmYgPSB7XG4gIHdvcmRQYXR0ZXJuOiAvKC0/XFxkKlxcLlxcZFxcdyopfChbXlxcYFxcflxcIVxcQFxcJFxcXlxcJlxcKlxcKFxcKVxcLVxcPVxcK1xcW1xce1xcXVxcfVxcXFxcXHxcXDtcXDpcXCdcXFwiXFwsXFwuXFw8XFw+XFwvXFxzXSspL2csXG4gIGNvbW1lbnRzOiB7XG4gICAgYmxvY2tDb21tZW50OiBbXCI8IS0tXCIsIFwiLS0+XCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wiPCEtLVwiLCBcIi0tPlwiXSxcbiAgICBbXCI8XCIsIFwiPlwiXSxcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH0sXG4gICAgeyBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiIH1cbiAgXSxcbiAgb25FbnRlclJ1bGVzOiBbXG4gICAge1xuICAgICAgYmVmb3JlVGV4dDogbmV3IFJlZ0V4cChgPCg/ISg/OiR7RU1QVFlfRUxFTUVOVFMuam9pbihcInxcIil9KSkoXFxcXHdbXFxcXHdcXFxcZF0qKShbXi8+XSooPyEvKT4pW148XSokYCwgXCJpXCIpLFxuICAgICAgYWZ0ZXJUZXh0OiAvXjxcXC8oXFx3W1xcd1xcZF0qKVxccyo+JC9pLFxuICAgICAgYWN0aW9uOiB7XG4gICAgICAgIGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5JbmRlbnRPdXRkZW50XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBiZWZvcmVUZXh0OiBuZXcgUmVnRXhwKGA8KD8hKD86JHtFTVBUWV9FTEVNRU5UUy5qb2luKFwifFwiKX0pKShcXFxcd1tcXFxcd1xcXFxkXSopKFteLz5dKig/IS8pPilbXjxdKiRgLCBcImlcIiksXG4gICAgICBhY3Rpb246IHsgaW5kZW50QWN0aW9uOiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMuSW5kZW50QWN0aW9uLkluZGVudCB9XG4gICAgfVxuICBdXG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCJcIixcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy9AQEBAL10sXG4gICAgICBbL0BbXkBdLywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogXCJAcmF6b3JJblNpbXBsZVN0YXRlLnJvb3RcIiB9XSxcbiAgICAgIFsvPCFET0NUWVBFLywgXCJtZXRhdGFnLmh0bWxcIiwgXCJAZG9jdHlwZVwiXSxcbiAgICAgIFsvPCEtLS8sIFwiY29tbWVudC5odG1sXCIsIFwiQGNvbW1lbnRcIl0sXG4gICAgICBbLyg8KShbXFx3XFwtXSspKFxcLz4pLywgW1wiZGVsaW1pdGVyLmh0bWxcIiwgXCJ0YWcuaHRtbFwiLCBcImRlbGltaXRlci5odG1sXCJdXSxcbiAgICAgIFsvKDwpKHNjcmlwdCkvLCBbXCJkZWxpbWl0ZXIuaHRtbFwiLCB7IHRva2VuOiBcInRhZy5odG1sXCIsIG5leHQ6IFwiQHNjcmlwdFwiIH1dXSxcbiAgICAgIFsvKDwpKHN0eWxlKS8sIFtcImRlbGltaXRlci5odG1sXCIsIHsgdG9rZW46IFwidGFnLmh0bWxcIiwgbmV4dDogXCJAc3R5bGVcIiB9XV0sXG4gICAgICBbLyg8KShbOlxcd1xcLV0rKS8sIFtcImRlbGltaXRlci5odG1sXCIsIHsgdG9rZW46IFwidGFnLmh0bWxcIiwgbmV4dDogXCJAb3RoZXJUYWdcIiB9XV0sXG4gICAgICBbLyg8XFwvKShbXFx3XFwtXSspLywgW1wiZGVsaW1pdGVyLmh0bWxcIiwgeyB0b2tlbjogXCJ0YWcuaHRtbFwiLCBuZXh0OiBcIkBvdGhlclRhZ1wiIH1dXSxcbiAgICAgIFsvPC8sIFwiZGVsaW1pdGVyLmh0bWxcIl0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvW148QF0rL11cbiAgICBdLFxuICAgIGRvY3R5cGU6IFtcbiAgICAgIFsvQFteQF0vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBcIkByYXpvckluU2ltcGxlU3RhdGUuY29tbWVudFwiIH1dLFxuICAgICAgWy9bXj5dKy8sIFwibWV0YXRhZy5jb250ZW50Lmh0bWxcIl0sXG4gICAgICBbLz4vLCBcIm1ldGF0YWcuaHRtbFwiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIGNvbW1lbnQ6IFtcbiAgICAgIFsvQFteQF0vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBcIkByYXpvckluU2ltcGxlU3RhdGUuY29tbWVudFwiIH1dLFxuICAgICAgWy8tLT4vLCBcImNvbW1lbnQuaHRtbFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1teLV0rLywgXCJjb21tZW50LmNvbnRlbnQuaHRtbFwiXSxcbiAgICAgIFsvLi8sIFwiY29tbWVudC5jb250ZW50Lmh0bWxcIl1cbiAgICBdLFxuICAgIG90aGVyVGFnOiBbXG4gICAgICBbL0BbXkBdLywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogXCJAcmF6b3JJblNpbXBsZVN0YXRlLm90aGVyVGFnXCIgfV0sXG4gICAgICBbL1xcLz8+LywgXCJkZWxpbWl0ZXIuaHRtbFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy8nKFteJ10qKScvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvW1xcd1xcLV0rLywgXCJhdHRyaWJ1dGUubmFtZVwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL11cbiAgICBdLFxuICAgIHNjcmlwdDogW1xuICAgICAgWy9AW15AXS8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgc3dpdGNoVG86IFwiQHJhem9ySW5TaW1wbGVTdGF0ZS5zY3JpcHRcIiB9XSxcbiAgICAgIFsvdHlwZS8sIFwiYXR0cmlidXRlLm5hbWVcIiwgXCJAc2NyaXB0QWZ0ZXJUeXBlXCJdLFxuICAgICAgWy9cIihbXlwiXSopXCIvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvJyhbXiddKiknLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbL1tcXHdcXC1dKy8sIFwiYXR0cmlidXRlLm5hbWVcIl0sXG4gICAgICBbLz0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzY3JpcHRFbWJlZGRlZC50ZXh0L2phdmFzY3JpcHRcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9qYXZhc2NyaXB0XCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgW1xuICAgICAgICAvKDxcXC8pKHNjcmlwdFxccyopKD4pLyxcbiAgICAgICAgW1wiZGVsaW1pdGVyLmh0bWxcIiwgXCJ0YWcuaHRtbFwiLCB7IHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgICBdXG4gICAgXSxcbiAgICBzY3JpcHRBZnRlclR5cGU6IFtcbiAgICAgIFtcbiAgICAgICAgL0BbXkBdLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcIkByZW1hdGNoXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHJhem9ySW5TaW1wbGVTdGF0ZS5zY3JpcHRBZnRlclR5cGVcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXJcIiwgXCJAc2NyaXB0QWZ0ZXJUeXBlRXF1YWxzXCJdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHNjcmlwdEVtYmVkZGVkLnRleHQvamF2YXNjcmlwdFwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2phdmFzY3JpcHRcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLzxcXC9zY3JpcHRcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHNjcmlwdEFmdGVyVHlwZUVxdWFsczogW1xuICAgICAgW1xuICAgICAgICAvQFteQF0vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAcmF6b3JJblNpbXBsZVN0YXRlLnNjcmlwdEFmdGVyVHlwZUVxdWFsc1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC9cIihbXlwiXSopXCIvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHNjcmlwdFdpdGhDdXN0b21UeXBlLiQxXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLycoW14nXSopJy8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJhdHRyaWJ1dGUudmFsdWVcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc2NyaXB0V2l0aEN1c3RvbVR5cGUuJDFcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHNjcmlwdEVtYmVkZGVkLnRleHQvamF2YXNjcmlwdFwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2phdmFzY3JpcHRcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLzxcXC9zY3JpcHRcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHNjcmlwdFdpdGhDdXN0b21UeXBlOiBbXG4gICAgICBbXG4gICAgICAgIC9AW15AXS8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJAcmVtYXRjaFwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkByYXpvckluU2ltcGxlU3RhdGUuc2NyaXB0V2l0aEN1c3RvbVR5cGUuJFMyXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzY3JpcHRFbWJlZGRlZC4kUzJcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiJFMyXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXCIoW15cIl0qKVwiLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbLycoW14nXSopJy8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy9bXFx3XFwtXSsvLCBcImF0dHJpYnV0ZS5uYW1lXCJdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvPFxcL3NjcmlwdFxccyo+LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc2NyaXB0RW1iZWRkZWQ6IFtcbiAgICAgIFtcbiAgICAgICAgL0BbXkBdLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcIkByZW1hdGNoXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHJhem9ySW5FbWJlZGRlZFN0YXRlLnNjcmlwdEVtYmVkZGVkLiRTMlwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJAcG9wXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvPFxcL3NjcmlwdC8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIsIG5leHRFbWJlZGRlZDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHN0eWxlOiBbXG4gICAgICBbL0BbXkBdLywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogXCJAcmF6b3JJblNpbXBsZVN0YXRlLnN0eWxlXCIgfV0sXG4gICAgICBbL3R5cGUvLCBcImF0dHJpYnV0ZS5uYW1lXCIsIFwiQHN0eWxlQWZ0ZXJUeXBlXCJdLFxuICAgICAgWy9cIihbXlwiXSopXCIvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvJyhbXiddKiknLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbL1tcXHdcXC1dKy8sIFwiYXR0cmlidXRlLm5hbWVcIl0sXG4gICAgICBbLz0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzdHlsZUVtYmVkZGVkLnRleHQvY3NzXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcInRleHQvY3NzXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgW1xuICAgICAgICAvKDxcXC8pKHN0eWxlXFxzKikoPikvLFxuICAgICAgICBbXCJkZWxpbWl0ZXIuaHRtbFwiLCBcInRhZy5odG1sXCIsIHsgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICAgIF1cbiAgICBdLFxuICAgIHN0eWxlQWZ0ZXJUeXBlOiBbXG4gICAgICBbXG4gICAgICAgIC9AW15AXS8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJAcmVtYXRjaFwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkByYXpvckluU2ltcGxlU3RhdGUuc3R5bGVBZnRlclR5cGVcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXJcIiwgXCJAc3R5bGVBZnRlclR5cGVFcXVhbHNcIl0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlci5odG1sXCIsXG4gICAgICAgICAgbmV4dDogXCJAc3R5bGVFbWJlZGRlZC50ZXh0L2Nzc1wiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2Nzc1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvPFxcL3N0eWxlXFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzdHlsZUFmdGVyVHlwZUVxdWFsczogW1xuICAgICAgW1xuICAgICAgICAvQFteQF0vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAcmF6b3JJblNpbXBsZVN0YXRlLnN0eWxlQWZ0ZXJUeXBlRXF1YWxzXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1wiKFteXCJdKilcIi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJhdHRyaWJ1dGUudmFsdWVcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc3R5bGVXaXRoQ3VzdG9tVHlwZS4kMVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8nKFteJ10qKScvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHN0eWxlV2l0aEN1c3RvbVR5cGUuJDFcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXIuaHRtbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHN0eWxlRW1iZWRkZWQudGV4dC9jc3NcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9jc3NcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLzxcXC9zdHlsZVxccyo+LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc3R5bGVXaXRoQ3VzdG9tVHlwZTogW1xuICAgICAgW1xuICAgICAgICAvQFteQF0vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAcmF6b3JJblNpbXBsZVN0YXRlLnN0eWxlV2l0aEN1c3RvbVR5cGUuJFMyXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyLmh0bWxcIixcbiAgICAgICAgICBuZXh0OiBcIkBzdHlsZUVtYmVkZGVkLiRTMlwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCIkUzJcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9cIihbXlwiXSopXCIvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvJyhbXiddKiknLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbL1tcXHdcXC1dKy8sIFwiYXR0cmlidXRlLm5hbWVcIl0sXG4gICAgICBbLz0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc3R5bGVcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHN0eWxlRW1iZWRkZWQ6IFtcbiAgICAgIFtcbiAgICAgICAgL0BbXkBdLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcIkByZW1hdGNoXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHJhem9ySW5FbWJlZGRlZFN0YXRlLnN0eWxlRW1iZWRkZWQuJFMyXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcIkBwb3BcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy88XFwvc3R5bGUvLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiLCBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICByYXpvckluU2ltcGxlU3RhdGU6IFtcbiAgICAgIFsvQFxcKi8sIFwiY29tbWVudC5jc1wiLCBcIkByYXpvckJsb2NrQ29tbWVudFRvcExldmVsXCJdLFxuICAgICAgWy9AW3soXS8sIFwibWV0YXRhZy5jc1wiLCBcIkByYXpvclJvb3RUb3BMZXZlbFwiXSxcbiAgICAgIFsvKEApKFxccypbXFx3XSspLywgW1wibWV0YXRhZy5jc1wiLCB7IHRva2VuOiBcImlkZW50aWZpZXIuY3NcIiwgc3dpdGNoVG86IFwiQCRTMi4kUzNcIiB9XV0sXG4gICAgICBbL1t9KV0vLCB7IHRva2VuOiBcIm1ldGF0YWcuY3NcIiwgc3dpdGNoVG86IFwiQCRTMi4kUzNcIiB9XSxcbiAgICAgIFsvXFwqQC8sIHsgdG9rZW46IFwiY29tbWVudC5jc1wiLCBzd2l0Y2hUbzogXCJAJFMyLiRTM1wiIH1dXG4gICAgXSxcbiAgICByYXpvckluRW1iZWRkZWRTdGF0ZTogW1xuICAgICAgWy9AXFwqLywgXCJjb21tZW50LmNzXCIsIFwiQHJhem9yQmxvY2tDb21tZW50VG9wTGV2ZWxcIl0sXG4gICAgICBbL0BbeyhdLywgXCJtZXRhdGFnLmNzXCIsIFwiQHJhem9yUm9vdFRvcExldmVsXCJdLFxuICAgICAgW1xuICAgICAgICAvKEApKFxccypbXFx3XSspLyxcbiAgICAgICAgW1xuICAgICAgICAgIFwibWV0YXRhZy5jc1wiLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcImlkZW50aWZpZXIuY3NcIixcbiAgICAgICAgICAgIHN3aXRjaFRvOiBcIkAkUzIuJFMzXCIsXG4gICAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiJFMzXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC9bfSldLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcIm1ldGF0YWcuY3NcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAJFMyLiRTM1wiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCIkUzNcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvXFwqQC8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJjb21tZW50LmNzXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQCRTMi4kUzNcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiJFMzXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIF0sXG4gICAgcmF6b3JCbG9ja0NvbW1lbnRUb3BMZXZlbDogW1xuICAgICAgWy9cXCpALywgXCJAcmVtYXRjaFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1teKl0rLywgXCJjb21tZW50LmNzXCJdLFxuICAgICAgWy8uLywgXCJjb21tZW50LmNzXCJdXG4gICAgXSxcbiAgICByYXpvckJsb2NrQ29tbWVudDogW1xuICAgICAgWy9cXCpALywgXCJjb21tZW50LmNzXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW14qXSsvLCBcImNvbW1lbnQuY3NcIl0sXG4gICAgICBbLy4vLCBcImNvbW1lbnQuY3NcIl1cbiAgICBdLFxuICAgIHJhem9yUm9vdFRvcExldmVsOiBbXG4gICAgICBbL1xcey8sIFwiZGVsaW1pdGVyLmJyYWNrZXQuY3NcIiwgXCJAcmF6b3JSb290XCJdLFxuICAgICAgWy9cXCgvLCBcImRlbGltaXRlci5wYXJlbnRoZXNpcy5jc1wiLCBcIkByYXpvclJvb3RcIl0sXG4gICAgICBbL1t9KV0vLCBcIkByZW1hdGNoXCIsIFwiQHBvcFwiXSxcbiAgICAgIHsgaW5jbHVkZTogXCJyYXpvckNvbW1vblwiIH1cbiAgICBdLFxuICAgIHJhem9yUm9vdDogW1xuICAgICAgWy9cXHsvLCBcImRlbGltaXRlci5icmFja2V0LmNzXCIsIFwiQHJhem9yUm9vdFwiXSxcbiAgICAgIFsvXFwoLywgXCJkZWxpbWl0ZXIucGFyZW50aGVzaXMuY3NcIiwgXCJAcmF6b3JSb290XCJdLFxuICAgICAgWy9cXH0vLCBcImRlbGltaXRlci5icmFja2V0LmNzXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvXFwpLywgXCJkZWxpbWl0ZXIucGFyZW50aGVzaXMuY3NcIiwgXCJAcG9wXCJdLFxuICAgICAgeyBpbmNsdWRlOiBcInJhem9yQ29tbW9uXCIgfVxuICAgIF0sXG4gICAgcmF6b3JDb21tb246IFtcbiAgICAgIFtcbiAgICAgICAgL1thLXpBLVpfXVxcdyovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQHJhem9yS2V5d29yZHNcIjogeyB0b2tlbjogXCJrZXl3b3JkLmNzXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJpZGVudGlmaWVyLmNzXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1tcXFtcXF1dLywgXCJkZWxpbWl0ZXIuYXJyYXkuY3NcIl0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvXFwvXFwvLiokLywgXCJjb21tZW50LmNzXCJdLFxuICAgICAgWy9AXFwqLywgXCJjb21tZW50LmNzXCIsIFwiQHJhem9yQmxvY2tDb21tZW50XCJdLFxuICAgICAgWy9cIihbXlwiXSopXCIvLCBcInN0cmluZy5jc1wiXSxcbiAgICAgIFsvJyhbXiddKiknLywgXCJzdHJpbmcuY3NcIl0sXG4gICAgICBbLyg8KShbXFx3XFwtXSspKFxcLz4pLywgW1wiZGVsaW1pdGVyLmh0bWxcIiwgXCJ0YWcuaHRtbFwiLCBcImRlbGltaXRlci5odG1sXCJdXSxcbiAgICAgIFsvKDwpKFtcXHdcXC1dKykoPikvLCBbXCJkZWxpbWl0ZXIuaHRtbFwiLCBcInRhZy5odG1sXCIsIFwiZGVsaW1pdGVyLmh0bWxcIl1dLFxuICAgICAgWy8oPFxcLykoW1xcd1xcLV0rKSg+KS8sIFtcImRlbGltaXRlci5odG1sXCIsIFwidGFnLmh0bWxcIiwgXCJkZWxpbWl0ZXIuaHRtbFwiXV0sXG4gICAgICBbL1tcXCtcXC1cXCpcXCVcXCZcXHxcXF5cXH5cXCFcXD1cXDxcXD5cXC9cXD9cXDtcXDpcXC5cXCxdLywgXCJkZWxpbWl0ZXIuY3NcIl0sXG4gICAgICBbL1xcZCpcXGQrW2VFXShbXFwtK10/XFxkKyk/LywgXCJudW1iZXIuZmxvYXQuY3NcIl0sXG4gICAgICBbL1xcZCpcXC5cXGQrKFtlRV1bXFwtK10/XFxkKyk/LywgXCJudW1iZXIuZmxvYXQuY3NcIl0sXG4gICAgICBbLzBbeFhdWzAtOWEtZkEtRiddKlswLTlhLWZBLUZdLywgXCJudW1iZXIuaGV4LmNzXCJdLFxuICAgICAgWy8wWzAtNyddKlswLTddLywgXCJudW1iZXIub2N0YWwuY3NcIl0sXG4gICAgICBbLzBbYkJdWzAtMSddKlswLTFdLywgXCJudW1iZXIuYmluYXJ5LmNzXCJdLFxuICAgICAgWy9cXGRbXFxkJ10qLywgXCJudW1iZXIuY3NcIl0sXG4gICAgICBbL1xcZC8sIFwibnVtYmVyLmNzXCJdXG4gICAgXVxuICB9LFxuICByYXpvcktleXdvcmRzOiBbXG4gICAgXCJhYnN0cmFjdFwiLFxuICAgIFwiYXNcIixcbiAgICBcImFzeW5jXCIsXG4gICAgXCJhd2FpdFwiLFxuICAgIFwiYmFzZVwiLFxuICAgIFwiYm9vbFwiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImJ5XCIsXG4gICAgXCJieXRlXCIsXG4gICAgXCJjYXNlXCIsXG4gICAgXCJjYXRjaFwiLFxuICAgIFwiY2hhclwiLFxuICAgIFwiY2hlY2tlZFwiLFxuICAgIFwiY2xhc3NcIixcbiAgICBcImNvbnN0XCIsXG4gICAgXCJjb250aW51ZVwiLFxuICAgIFwiZGVjaW1hbFwiLFxuICAgIFwiZGVmYXVsdFwiLFxuICAgIFwiZGVsZWdhdGVcIixcbiAgICBcImRvXCIsXG4gICAgXCJkb3VibGVcIixcbiAgICBcImRlc2NlbmRpbmdcIixcbiAgICBcImV4cGxpY2l0XCIsXG4gICAgXCJldmVudFwiLFxuICAgIFwiZXh0ZXJuXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJlbnVtXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwiZmluYWxseVwiLFxuICAgIFwiZml4ZWRcIixcbiAgICBcImZsb2F0XCIsXG4gICAgXCJmb3JcIixcbiAgICBcImZvcmVhY2hcIixcbiAgICBcImZyb21cIixcbiAgICBcImdvdG9cIixcbiAgICBcImdyb3VwXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW1wbGljaXRcIixcbiAgICBcImluXCIsXG4gICAgXCJpbnRcIixcbiAgICBcImludGVyZmFjZVwiLFxuICAgIFwiaW50ZXJuYWxcIixcbiAgICBcImludG9cIixcbiAgICBcImlzXCIsXG4gICAgXCJsb2NrXCIsXG4gICAgXCJsb25nXCIsXG4gICAgXCJuYW1lb2ZcIixcbiAgICBcIm5ld1wiLFxuICAgIFwibnVsbFwiLFxuICAgIFwibmFtZXNwYWNlXCIsXG4gICAgXCJvYmplY3RcIixcbiAgICBcIm9wZXJhdG9yXCIsXG4gICAgXCJvdXRcIixcbiAgICBcIm92ZXJyaWRlXCIsXG4gICAgXCJvcmRlcmJ5XCIsXG4gICAgXCJwYXJhbXNcIixcbiAgICBcInByaXZhdGVcIixcbiAgICBcInByb3RlY3RlZFwiLFxuICAgIFwicHVibGljXCIsXG4gICAgXCJyZWFkb25seVwiLFxuICAgIFwicmVmXCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcInN3aXRjaFwiLFxuICAgIFwic3RydWN0XCIsXG4gICAgXCJzYnl0ZVwiLFxuICAgIFwic2VhbGVkXCIsXG4gICAgXCJzaG9ydFwiLFxuICAgIFwic2l6ZW9mXCIsXG4gICAgXCJzdGFja2FsbG9jXCIsXG4gICAgXCJzdGF0aWNcIixcbiAgICBcInN0cmluZ1wiLFxuICAgIFwic2VsZWN0XCIsXG4gICAgXCJ0aGlzXCIsXG4gICAgXCJ0aHJvd1wiLFxuICAgIFwidHJ1ZVwiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJ0eXBlb2ZcIixcbiAgICBcInVpbnRcIixcbiAgICBcInVsb25nXCIsXG4gICAgXCJ1bmNoZWNrZWRcIixcbiAgICBcInVuc2FmZVwiLFxuICAgIFwidXNob3J0XCIsXG4gICAgXCJ1c2luZ1wiLFxuICAgIFwidmFyXCIsXG4gICAgXCJ2aXJ0dWFsXCIsXG4gICAgXCJ2b2xhdGlsZVwiLFxuICAgIFwidm9pZFwiLFxuICAgIFwid2hlblwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcIndoZXJlXCIsXG4gICAgXCJ5aWVsZFwiLFxuICAgIFwibW9kZWxcIixcbiAgICBcImluamVjdFwiXG4gIF0sXG4gIGVzY2FwZXM6IC9cXFxcKD86W2FiZm5ydHZcXFxcXCInXXx4WzAtOUEtRmEtZl17MSw0fXx1WzAtOUEtRmEtZl17NH18VVswLTlBLUZhLWZdezh9KS9cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT0EsSUFBSSxZQUFZLE9BQU87QUFDdkIsSUFBSSxtQkFBbUIsT0FBTztBQUM5QixJQUFJLG9CQUFvQixPQUFPO0FBQy9CLElBQUksZUFBZSxPQUFPLFVBQVU7QUFDcEMsSUFBSSxjQUFjLENBQUMsSUFBSSxNQUFNLFFBQVEsU0FBUztBQUM1QyxNQUFJLFFBQVEsT0FBTyxTQUFTLFlBQVksT0FBTyxTQUFTLFlBQVk7QUFDbEUsYUFBUyxPQUFPLGtCQUFrQixJQUFJO0FBQ3BDLFVBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxHQUFHLEtBQUssUUFBUTtBQUN6QyxrQkFBVSxJQUFJLEtBQUssRUFBRSxLQUFLLE1BQU0sS0FBSyxHQUFHLEdBQUcsWUFBWSxFQUFFLE9BQU8saUJBQWlCLE1BQU0sR0FBRyxNQUFNLEtBQUssV0FBVSxDQUFFO0FBQUEsRUFDdEg7QUFDRCxTQUFPO0FBQ1Q7QUFDQSxJQUFJLGFBQWEsQ0FBQyxRQUFRLEtBQUssa0JBQWtCLFlBQVksUUFBUSxLQUFLLFNBQVMsR0FBRztBQUd0RixJQUFJLDZCQUE2QixDQUFBO0FBQ2pDLFdBQVcsNEJBQTRCLHVCQUF1QjtBQUk5RCxJQUFJLGlCQUFpQjtBQUFBLEVBQ25CO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUFDRyxJQUFDLE9BQU87QUFBQSxFQUNULGFBQWE7QUFBQSxFQUNiLFVBQVU7QUFBQSxJQUNSLGNBQWMsQ0FBQyxRQUFRLEtBQUs7QUFBQSxFQUM3QjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxRQUFRLEtBQUs7QUFBQSxJQUNkLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxFQUNWO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFBQSxFQUNELGNBQWM7QUFBQSxJQUNaO0FBQUEsTUFDRSxZQUFZLElBQUksT0FBTyxVQUFVLGVBQWUsS0FBSyxHQUFHLENBQUMsd0NBQXdDLEdBQUc7QUFBQSxNQUNwRyxXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsUUFDTixjQUFjLDJCQUEyQixVQUFVLGFBQWE7QUFBQSxNQUNqRTtBQUFBLElBQ0Y7QUFBQSxJQUNEO0FBQUEsTUFDRSxZQUFZLElBQUksT0FBTyxVQUFVLGVBQWUsS0FBSyxHQUFHLENBQUMsd0NBQXdDLEdBQUc7QUFBQSxNQUNwRyxRQUFRLEVBQUUsY0FBYywyQkFBMkIsVUFBVSxhQUFhLE9BQVE7QUFBQSxJQUNuRjtBQUFBLEVBQ0Y7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsV0FBVztBQUFBLElBQ1QsTUFBTTtBQUFBLE1BQ0osQ0FBQyxNQUFNO0FBQUEsTUFDUCxDQUFDLFNBQVMsRUFBRSxPQUFPLFlBQVksVUFBVSwyQkFBMEIsQ0FBRTtBQUFBLE1BQ3JFLENBQUMsYUFBYSxnQkFBZ0IsVUFBVTtBQUFBLE1BQ3hDLENBQUMsUUFBUSxnQkFBZ0IsVUFBVTtBQUFBLE1BQ25DLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLFlBQVksZ0JBQWdCLENBQUM7QUFBQSxNQUN0RSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLFlBQVksTUFBTSxVQUFTLENBQUUsQ0FBQztBQUFBLE1BQzFFLENBQUMsY0FBYyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sWUFBWSxNQUFNLFNBQVEsQ0FBRSxDQUFDO0FBQUEsTUFDeEUsQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLFlBQVksTUFBTSxZQUFXLENBQUUsQ0FBQztBQUFBLE1BQzlFLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxZQUFZLE1BQU0sWUFBVyxDQUFFLENBQUM7QUFBQSxNQUMvRSxDQUFDLEtBQUssZ0JBQWdCO0FBQUEsTUFDdEIsQ0FBQyxZQUFZO0FBQUEsTUFDYixDQUFDLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDRCxTQUFTO0FBQUEsTUFDUCxDQUFDLFNBQVMsRUFBRSxPQUFPLFlBQVksVUFBVSw4QkFBNkIsQ0FBRTtBQUFBLE1BQ3hFLENBQUMsU0FBUyxzQkFBc0I7QUFBQSxNQUNoQyxDQUFDLEtBQUssZ0JBQWdCLE1BQU07QUFBQSxJQUM3QjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxTQUFTLEVBQUUsT0FBTyxZQUFZLFVBQVUsOEJBQTZCLENBQUU7QUFBQSxNQUN4RSxDQUFDLE9BQU8sZ0JBQWdCLE1BQU07QUFBQSxNQUM5QixDQUFDLFNBQVMsc0JBQXNCO0FBQUEsTUFDaEMsQ0FBQyxLQUFLLHNCQUFzQjtBQUFBLElBQzdCO0FBQUEsSUFDRCxVQUFVO0FBQUEsTUFDUixDQUFDLFNBQVMsRUFBRSxPQUFPLFlBQVksVUFBVSwrQkFBOEIsQ0FBRTtBQUFBLE1BQ3pFLENBQUMsUUFBUSxrQkFBa0IsTUFBTTtBQUFBLE1BQ2pDLENBQUMsYUFBYSxpQkFBaUI7QUFBQSxNQUMvQixDQUFDLGFBQWEsaUJBQWlCO0FBQUEsTUFDL0IsQ0FBQyxXQUFXLGdCQUFnQjtBQUFBLE1BQzVCLENBQUMsS0FBSyxXQUFXO0FBQUEsTUFDakIsQ0FBQyxZQUFZO0FBQUEsSUFDZDtBQUFBLElBQ0QsUUFBUTtBQUFBLE1BQ04sQ0FBQyxTQUFTLEVBQUUsT0FBTyxZQUFZLFVBQVUsNkJBQTRCLENBQUU7QUFBQSxNQUN2RSxDQUFDLFFBQVEsa0JBQWtCLGtCQUFrQjtBQUFBLE1BQzdDLENBQUMsYUFBYSxpQkFBaUI7QUFBQSxNQUMvQixDQUFDLGFBQWEsaUJBQWlCO0FBQUEsTUFDL0IsQ0FBQyxXQUFXLGdCQUFnQjtBQUFBLE1BQzVCLENBQUMsS0FBSyxXQUFXO0FBQUEsTUFDakI7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsTUFBTTtBQUFBLFVBQ04sY0FBYztBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxDQUFDLFlBQVk7QUFBQSxNQUNiO0FBQUEsUUFDRTtBQUFBLFFBQ0EsQ0FBQyxrQkFBa0IsWUFBWSxFQUFFLE9BQU8sa0JBQWtCLE1BQU0sUUFBUTtBQUFBLE1BQ3pFO0FBQUEsSUFDRjtBQUFBLElBQ0QsaUJBQWlCO0FBQUEsTUFDZjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsS0FBSyxhQUFhLHdCQUF3QjtBQUFBLE1BQzNDO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLE1BQU07QUFBQSxVQUNOLGNBQWM7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLE1BQ0QsQ0FBQyxZQUFZO0FBQUEsTUFDYixDQUFDLGlCQUFpQixFQUFFLE9BQU8sWUFBWSxNQUFNLE9BQU0sQ0FBRTtBQUFBLElBQ3REO0FBQUEsSUFDRCx1QkFBdUI7QUFBQSxNQUNyQjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxNQUNEO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLFVBQVU7QUFBQSxRQUNYO0FBQUEsTUFDRjtBQUFBLE1BQ0Q7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsVUFBVTtBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsTUFDRDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsVUFDTixjQUFjO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsWUFBWTtBQUFBLE1BQ2IsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLFlBQVksTUFBTSxPQUFNLENBQUU7QUFBQSxJQUN0RDtBQUFBLElBQ0Qsc0JBQXNCO0FBQUEsTUFDcEI7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsVUFBVTtBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsTUFDRDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsVUFDTixjQUFjO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsYUFBYSxpQkFBaUI7QUFBQSxNQUMvQixDQUFDLGFBQWEsaUJBQWlCO0FBQUEsTUFDL0IsQ0FBQyxXQUFXLGdCQUFnQjtBQUFBLE1BQzVCLENBQUMsS0FBSyxXQUFXO0FBQUEsTUFDakIsQ0FBQyxZQUFZO0FBQUEsTUFDYixDQUFDLGlCQUFpQixFQUFFLE9BQU8sWUFBWSxNQUFNLE9BQU0sQ0FBRTtBQUFBLElBQ3REO0FBQUEsSUFDRCxnQkFBZ0I7QUFBQSxNQUNkO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLFVBQVU7QUFBQSxVQUNWLGNBQWM7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLE1BQ0QsQ0FBQyxhQUFhLEVBQUUsT0FBTyxZQUFZLE1BQU0sUUFBUSxjQUFjLFFBQVE7QUFBQSxJQUN4RTtBQUFBLElBQ0QsT0FBTztBQUFBLE1BQ0wsQ0FBQyxTQUFTLEVBQUUsT0FBTyxZQUFZLFVBQVUsNEJBQTJCLENBQUU7QUFBQSxNQUN0RSxDQUFDLFFBQVEsa0JBQWtCLGlCQUFpQjtBQUFBLE1BQzVDLENBQUMsYUFBYSxpQkFBaUI7QUFBQSxNQUMvQixDQUFDLGFBQWEsaUJBQWlCO0FBQUEsTUFDL0IsQ0FBQyxXQUFXLGdCQUFnQjtBQUFBLE1BQzVCLENBQUMsS0FBSyxXQUFXO0FBQUEsTUFDakI7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsTUFBTTtBQUFBLFVBQ04sY0FBYztBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxDQUFDLFlBQVk7QUFBQSxNQUNiO0FBQUEsUUFDRTtBQUFBLFFBQ0EsQ0FBQyxrQkFBa0IsWUFBWSxFQUFFLE9BQU8sa0JBQWtCLE1BQU0sUUFBUTtBQUFBLE1BQ3pFO0FBQUEsSUFDRjtBQUFBLElBQ0QsZ0JBQWdCO0FBQUEsTUFDZDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsS0FBSyxhQUFhLHVCQUF1QjtBQUFBLE1BQzFDO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLE1BQU07QUFBQSxVQUNOLGNBQWM7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLE1BQ0QsQ0FBQyxZQUFZO0FBQUEsTUFDYixDQUFDLGdCQUFnQixFQUFFLE9BQU8sWUFBWSxNQUFNLE9BQU0sQ0FBRTtBQUFBLElBQ3JEO0FBQUEsSUFDRCxzQkFBc0I7QUFBQSxNQUNwQjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxNQUNEO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLFVBQVU7QUFBQSxRQUNYO0FBQUEsTUFDRjtBQUFBLE1BQ0Q7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsVUFBVTtBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsTUFDRDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsVUFDTixjQUFjO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsWUFBWTtBQUFBLE1BQ2IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLFlBQVksTUFBTSxPQUFNLENBQUU7QUFBQSxJQUNyRDtBQUFBLElBQ0QscUJBQXFCO0FBQUEsTUFDbkI7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsVUFBVTtBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsTUFDRDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsVUFDTixjQUFjO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsYUFBYSxpQkFBaUI7QUFBQSxNQUMvQixDQUFDLGFBQWEsaUJBQWlCO0FBQUEsTUFDL0IsQ0FBQyxXQUFXLGdCQUFnQjtBQUFBLE1BQzVCLENBQUMsS0FBSyxXQUFXO0FBQUEsTUFDakIsQ0FBQyxZQUFZO0FBQUEsTUFDYixDQUFDLGdCQUFnQixFQUFFLE9BQU8sWUFBWSxNQUFNLE9BQU0sQ0FBRTtBQUFBLElBQ3JEO0FBQUEsSUFDRCxlQUFlO0FBQUEsTUFDYjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsVUFDVixjQUFjO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsWUFBWSxFQUFFLE9BQU8sWUFBWSxNQUFNLFFBQVEsY0FBYyxRQUFRO0FBQUEsSUFDdkU7QUFBQSxJQUNELG9CQUFvQjtBQUFBLE1BQ2xCLENBQUMsT0FBTyxjQUFjLDRCQUE0QjtBQUFBLE1BQ2xELENBQUMsU0FBUyxjQUFjLG9CQUFvQjtBQUFBLE1BQzVDLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLE9BQU8saUJBQWlCLFVBQVUsV0FBVSxDQUFFLENBQUM7QUFBQSxNQUNsRixDQUFDLFFBQVEsRUFBRSxPQUFPLGNBQWMsVUFBVSxXQUFVLENBQUU7QUFBQSxNQUN0RCxDQUFDLE9BQU8sRUFBRSxPQUFPLGNBQWMsVUFBVSxXQUFVLENBQUU7QUFBQSxJQUN0RDtBQUFBLElBQ0Qsc0JBQXNCO0FBQUEsTUFDcEIsQ0FBQyxPQUFPLGNBQWMsNEJBQTRCO0FBQUEsTUFDbEQsQ0FBQyxTQUFTLGNBQWMsb0JBQW9CO0FBQUEsTUFDNUM7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0U7QUFBQSxVQUNBO0FBQUEsWUFDRSxPQUFPO0FBQUEsWUFDUCxVQUFVO0FBQUEsWUFDVixjQUFjO0FBQUEsVUFDZjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDRDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsVUFDVixjQUFjO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxNQUNEO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLFVBQVU7QUFBQSxVQUNWLGNBQWM7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNELDJCQUEyQjtBQUFBLE1BQ3pCLENBQUMsT0FBTyxZQUFZLE1BQU07QUFBQSxNQUMxQixDQUFDLFNBQVMsWUFBWTtBQUFBLE1BQ3RCLENBQUMsS0FBSyxZQUFZO0FBQUEsSUFDbkI7QUFBQSxJQUNELG1CQUFtQjtBQUFBLE1BQ2pCLENBQUMsT0FBTyxjQUFjLE1BQU07QUFBQSxNQUM1QixDQUFDLFNBQVMsWUFBWTtBQUFBLE1BQ3RCLENBQUMsS0FBSyxZQUFZO0FBQUEsSUFDbkI7QUFBQSxJQUNELG1CQUFtQjtBQUFBLE1BQ2pCLENBQUMsTUFBTSx3QkFBd0IsWUFBWTtBQUFBLE1BQzNDLENBQUMsTUFBTSw0QkFBNEIsWUFBWTtBQUFBLE1BQy9DLENBQUMsUUFBUSxZQUFZLE1BQU07QUFBQSxNQUMzQixFQUFFLFNBQVMsY0FBZTtBQUFBLElBQzNCO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxDQUFDLE1BQU0sd0JBQXdCLFlBQVk7QUFBQSxNQUMzQyxDQUFDLE1BQU0sNEJBQTRCLFlBQVk7QUFBQSxNQUMvQyxDQUFDLE1BQU0sd0JBQXdCLE1BQU07QUFBQSxNQUNyQyxDQUFDLE1BQU0sNEJBQTRCLE1BQU07QUFBQSxNQUN6QyxFQUFFLFNBQVMsY0FBZTtBQUFBLElBQzNCO0FBQUEsSUFDRCxhQUFhO0FBQUEsTUFDWDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxrQkFBa0IsRUFBRSxPQUFPLGFBQWM7QUFBQSxZQUN6QyxZQUFZO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxDQUFDLFVBQVUsb0JBQW9CO0FBQUEsTUFDL0IsQ0FBQyxZQUFZO0FBQUEsTUFDYixDQUFDLFdBQVcsWUFBWTtBQUFBLE1BQ3hCLENBQUMsT0FBTyxjQUFjLG9CQUFvQjtBQUFBLE1BQzFDLENBQUMsYUFBYSxXQUFXO0FBQUEsTUFDekIsQ0FBQyxhQUFhLFdBQVc7QUFBQSxNQUN6QixDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixZQUFZLGdCQUFnQixDQUFDO0FBQUEsTUFDdEUsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsWUFBWSxnQkFBZ0IsQ0FBQztBQUFBLE1BQ3BFLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLFlBQVksZ0JBQWdCLENBQUM7QUFBQSxNQUN0RSxDQUFDLDBDQUEwQyxjQUFjO0FBQUEsTUFDekQsQ0FBQywwQkFBMEIsaUJBQWlCO0FBQUEsTUFDNUMsQ0FBQyw0QkFBNEIsaUJBQWlCO0FBQUEsTUFDOUMsQ0FBQyxpQ0FBaUMsZUFBZTtBQUFBLE1BQ2pELENBQUMsaUJBQWlCLGlCQUFpQjtBQUFBLE1BQ25DLENBQUMscUJBQXFCLGtCQUFrQjtBQUFBLE1BQ3hDLENBQUMsWUFBWSxXQUFXO0FBQUEsTUFDeEIsQ0FBQyxNQUFNLFdBQVc7QUFBQSxJQUNuQjtBQUFBLEVBQ0Y7QUFBQSxFQUNELGVBQWU7QUFBQSxJQUNiO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxTQUFTO0FBQ1g7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
