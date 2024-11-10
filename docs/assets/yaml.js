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
    offSide: true
  },
  onEnterRules: [
    {
      beforeText: /:\s*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.Indent
      }
    }
  ]
};
var language = {
  tokenPostfix: ".yaml",
  brackets: [
    { token: "delimiter.bracket", open: "{", close: "}" },
    { token: "delimiter.square", open: "[", close: "]" }
  ],
  keywords: ["true", "True", "TRUE", "false", "False", "FALSE", "null", "Null", "Null", "~"],
  numberInteger: /(?:0|[+-]?[0-9]+)/,
  numberFloat: /(?:0|[+-]?[0-9]+)(?:\.[0-9]+)?(?:e[-+][1-9][0-9]*)?/,
  numberOctal: /0o[0-7]+/,
  numberHex: /0x[0-9a-fA-F]+/,
  numberInfinity: /[+-]?\.(?:inf|Inf|INF)/,
  numberNaN: /\.(?:nan|Nan|NAN)/,
  numberDate: /\d{4}-\d\d-\d\d([Tt ]\d\d:\d\d:\d\d(\.\d+)?(( ?[+-]\d\d?(:\d\d)?)|Z)?)?/,
  escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@comment" },
      [/%[^ ]+.*$/, "meta.directive"],
      [/---/, "operators.directivesEnd"],
      [/\.{3}/, "operators.documentEnd"],
      [/[-?:](?= )/, "operators"],
      { include: "@anchor" },
      { include: "@tagHandle" },
      { include: "@flowCollections" },
      { include: "@blockStyle" },
      [/@numberInteger(?![ \t]*\S+)/, "number"],
      [/@numberFloat(?![ \t]*\S+)/, "number.float"],
      [/@numberOctal(?![ \t]*\S+)/, "number.octal"],
      [/@numberHex(?![ \t]*\S+)/, "number.hex"],
      [/@numberInfinity(?![ \t]*\S+)/, "number.infinity"],
      [/@numberNaN(?![ \t]*\S+)/, "number.nan"],
      [/@numberDate(?![ \t]*\S+)/, "number.date"],
      [/(".*?"|'.*?'|[^#'"]*?)([ \t]*)(:)( |$)/, ["type", "white", "operators", "white"]],
      { include: "@flowScalars" },
      [
        /.+?(?=(\s+#|$))/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "string"
          }
        }
      ]
    ],
    object: [
      { include: "@whitespace" },
      { include: "@comment" },
      [/\}/, "@brackets", "@pop"],
      [/,/, "delimiter.comma"],
      [/:(?= )/, "operators"],
      [/(?:".*?"|'.*?'|[^,\{\[]+?)(?=: )/, "type"],
      { include: "@flowCollections" },
      { include: "@flowScalars" },
      { include: "@tagHandle" },
      { include: "@anchor" },
      { include: "@flowNumber" },
      [
        /[^\},]+/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "string"
          }
        }
      ]
    ],
    array: [
      { include: "@whitespace" },
      { include: "@comment" },
      [/\]/, "@brackets", "@pop"],
      [/,/, "delimiter.comma"],
      { include: "@flowCollections" },
      { include: "@flowScalars" },
      { include: "@tagHandle" },
      { include: "@anchor" },
      { include: "@flowNumber" },
      [
        /[^\],]+/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "string"
          }
        }
      ]
    ],
    multiString: [[/^( +).+$/, "string", "@multiStringContinued.$1"]],
    multiStringContinued: [
      [
        /^( *).+$/,
        {
          cases: {
            "$1==$S2": "string",
            "@default": { token: "@rematch", next: "@popall" }
          }
        }
      ]
    ],
    whitespace: [[/[ \t\r\n]+/, "white"]],
    comment: [[/#.*$/, "comment"]],
    flowCollections: [
      [/\[/, "@brackets", "@array"],
      [/\{/, "@brackets", "@object"]
    ],
    flowScalars: [
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/'[^']*'/, "string"],
      [/"/, "string", "@doubleQuotedString"]
    ],
    doubleQuotedString: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ],
    blockStyle: [[/[>|][0-9]*[+-]?$/, "operators", "@multiString"]],
    flowNumber: [
      [/@numberInteger(?=[ \t]*[,\]\}])/, "number"],
      [/@numberFloat(?=[ \t]*[,\]\}])/, "number.float"],
      [/@numberOctal(?=[ \t]*[,\]\}])/, "number.octal"],
      [/@numberHex(?=[ \t]*[,\]\}])/, "number.hex"],
      [/@numberInfinity(?=[ \t]*[,\]\}])/, "number.infinity"],
      [/@numberNaN(?=[ \t]*[,\]\}])/, "number.nan"],
      [/@numberDate(?=[ \t]*[,\]\}])/, "number.date"]
    ],
    tagHandle: [[/\![^ ]*/, "tag"]],
    anchor: [[/[&*][^ ]+/, "namespace"]]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFtbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy95YW1sL3lhbWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3JlRXhwb3J0ID0gKHRhcmdldCwgbW9kLCBzZWNvbmRUYXJnZXQpID0+IChfX2NvcHlQcm9wcyh0YXJnZXQsIG1vZCwgXCJkZWZhdWx0XCIpLCBzZWNvbmRUYXJnZXQgJiYgX19jb3B5UHJvcHMoc2Vjb25kVGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSk7XG5cbi8vIHNyYy9maWxsZXJzL21vbmFjby1lZGl0b3ItY29yZS50c1xudmFyIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzID0ge307XG5fX3JlRXhwb3J0KG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLCBtb25hY29fZWRpdG9yX2NvcmVfc3Rhcik7XG5pbXBvcnQgKiBhcyBtb25hY29fZWRpdG9yX2NvcmVfc3RhciBmcm9tIFwiLi4vLi4vZWRpdG9yL2VkaXRvci5hcGkuanNcIjtcblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy95YW1sL3lhbWwudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIiNcIlxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdLFxuICBmb2xkaW5nOiB7XG4gICAgb2ZmU2lkZTogdHJ1ZVxuICB9LFxuICBvbkVudGVyUnVsZXM6IFtcbiAgICB7XG4gICAgICBiZWZvcmVUZXh0OiAvOlxccyokLyxcbiAgICAgIGFjdGlvbjoge1xuICAgICAgICBpbmRlbnRBY3Rpb246IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5JbmRlbnRBY3Rpb24uSW5kZW50XG4gICAgICB9XG4gICAgfVxuICBdXG59O1xudmFyIGxhbmd1YWdlID0ge1xuICB0b2tlblBvc3RmaXg6IFwiLnlhbWxcIixcbiAgYnJhY2tldHM6IFtcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5icmFja2V0XCIsIG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5zcXVhcmVcIiwgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9XG4gIF0sXG4gIGtleXdvcmRzOiBbXCJ0cnVlXCIsIFwiVHJ1ZVwiLCBcIlRSVUVcIiwgXCJmYWxzZVwiLCBcIkZhbHNlXCIsIFwiRkFMU0VcIiwgXCJudWxsXCIsIFwiTnVsbFwiLCBcIk51bGxcIiwgXCJ+XCJdLFxuICBudW1iZXJJbnRlZ2VyOiAvKD86MHxbKy1dP1swLTldKykvLFxuICBudW1iZXJGbG9hdDogLyg/OjB8WystXT9bMC05XSspKD86XFwuWzAtOV0rKT8oPzplWy0rXVsxLTldWzAtOV0qKT8vLFxuICBudW1iZXJPY3RhbDogLzBvWzAtN10rLyxcbiAgbnVtYmVySGV4OiAvMHhbMC05YS1mQS1GXSsvLFxuICBudW1iZXJJbmZpbml0eTogL1srLV0/XFwuKD86aW5mfEluZnxJTkYpLyxcbiAgbnVtYmVyTmFOOiAvXFwuKD86bmFufE5hbnxOQU4pLyxcbiAgbnVtYmVyRGF0ZTogL1xcZHs0fS1cXGRcXGQtXFxkXFxkKFtUdCBdXFxkXFxkOlxcZFxcZDpcXGRcXGQoXFwuXFxkKyk/KCggP1srLV1cXGRcXGQ/KDpcXGRcXGQpPyl8Wik/KT8vLFxuICBlc2NhcGVzOiAvXFxcXCg/OltidG5mclxcXFxcIiddfFswLTddWzAtN10/fFswLTNdWzAtN117Mn0pLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAY29tbWVudFwiIH0sXG4gICAgICBbLyVbXiBdKy4qJC8sIFwibWV0YS5kaXJlY3RpdmVcIl0sXG4gICAgICBbLy0tLS8sIFwib3BlcmF0b3JzLmRpcmVjdGl2ZXNFbmRcIl0sXG4gICAgICBbL1xcLnszfS8sIFwib3BlcmF0b3JzLmRvY3VtZW50RW5kXCJdLFxuICAgICAgWy9bLT86XSg/PSApLywgXCJvcGVyYXRvcnNcIl0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGFuY2hvclwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHRhZ0hhbmRsZVwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGZsb3dDb2xsZWN0aW9uc1wiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGJsb2NrU3R5bGVcIiB9LFxuICAgICAgWy9AbnVtYmVySW50ZWdlcig/IVsgXFx0XSpcXFMrKS8sIFwibnVtYmVyXCJdLFxuICAgICAgWy9AbnVtYmVyRmxvYXQoPyFbIFxcdF0qXFxTKykvLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvQG51bWJlck9jdGFsKD8hWyBcXHRdKlxcUyspLywgXCJudW1iZXIub2N0YWxcIl0sXG4gICAgICBbL0BudW1iZXJIZXgoPyFbIFxcdF0qXFxTKykvLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbL0BudW1iZXJJbmZpbml0eSg/IVsgXFx0XSpcXFMrKS8sIFwibnVtYmVyLmluZmluaXR5XCJdLFxuICAgICAgWy9AbnVtYmVyTmFOKD8hWyBcXHRdKlxcUyspLywgXCJudW1iZXIubmFuXCJdLFxuICAgICAgWy9AbnVtYmVyRGF0ZSg/IVsgXFx0XSpcXFMrKS8sIFwibnVtYmVyLmRhdGVcIl0sXG4gICAgICBbLyhcIi4qP1wifCcuKj8nfFteIydcIl0qPykoWyBcXHRdKikoOikoIHwkKS8sIFtcInR5cGVcIiwgXCJ3aGl0ZVwiLCBcIm9wZXJhdG9yc1wiLCBcIndoaXRlXCJdXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAZmxvd1NjYWxhcnNcIiB9LFxuICAgICAgW1xuICAgICAgICAvLis/KD89KFxccysjfCQpKS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwic3RyaW5nXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIG9iamVjdDogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAY29tbWVudFwiIH0sXG4gICAgICBbL1xcfS8sIFwiQGJyYWNrZXRzXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvLC8sIFwiZGVsaW1pdGVyLmNvbW1hXCJdLFxuICAgICAgWy86KD89ICkvLCBcIm9wZXJhdG9yc1wiXSxcbiAgICAgIFsvKD86XCIuKj9cInwnLio/J3xbXixcXHtcXFtdKz8pKD89OiApLywgXCJ0eXBlXCJdLFxuICAgICAgeyBpbmNsdWRlOiBcIkBmbG93Q29sbGVjdGlvbnNcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBmbG93U2NhbGFyc1wiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHRhZ0hhbmRsZVwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGFuY2hvclwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGZsb3dOdW1iZXJcIiB9LFxuICAgICAgW1xuICAgICAgICAvW15cXH0sXSsvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBhcnJheTogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAY29tbWVudFwiIH0sXG4gICAgICBbL1xcXS8sIFwiQGJyYWNrZXRzXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvLC8sIFwiZGVsaW1pdGVyLmNvbW1hXCJdLFxuICAgICAgeyBpbmNsdWRlOiBcIkBmbG93Q29sbGVjdGlvbnNcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBmbG93U2NhbGFyc1wiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHRhZ0hhbmRsZVwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGFuY2hvclwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGZsb3dOdW1iZXJcIiB9LFxuICAgICAgW1xuICAgICAgICAvW15cXF0sXSsvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBtdWx0aVN0cmluZzogW1svXiggKykuKyQvLCBcInN0cmluZ1wiLCBcIkBtdWx0aVN0cmluZ0NvbnRpbnVlZC4kMVwiXV0sXG4gICAgbXVsdGlTdHJpbmdDb250aW51ZWQ6IFtcbiAgICAgIFtcbiAgICAgICAgL14oICopLiskLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQxPT0kUzJcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BhbGxcIiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbWy9bIFxcdFxcclxcbl0rLywgXCJ3aGl0ZVwiXV0sXG4gICAgY29tbWVudDogW1svIy4qJC8sIFwiY29tbWVudFwiXV0sXG4gICAgZmxvd0NvbGxlY3Rpb25zOiBbXG4gICAgICBbL1xcWy8sIFwiQGJyYWNrZXRzXCIsIFwiQGFycmF5XCJdLFxuICAgICAgWy9cXHsvLCBcIkBicmFja2V0c1wiLCBcIkBvYmplY3RcIl1cbiAgICBdLFxuICAgIGZsb3dTY2FsYXJzOiBbXG4gICAgICBbL1wiKFteXCJcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbLycoW14nXFxcXF18XFxcXC4pKiQvLCBcInN0cmluZy5pbnZhbGlkXCJdLFxuICAgICAgWy8nW14nXSonLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgXCJAZG91YmxlUXVvdGVkU3RyaW5nXCJdXG4gICAgXSxcbiAgICBkb3VibGVRdW90ZWRTdHJpbmc6IFtcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIGJsb2NrU3R5bGU6IFtbL1s+fF1bMC05XSpbKy1dPyQvLCBcIm9wZXJhdG9yc1wiLCBcIkBtdWx0aVN0cmluZ1wiXV0sXG4gICAgZmxvd051bWJlcjogW1xuICAgICAgWy9AbnVtYmVySW50ZWdlcig/PVsgXFx0XSpbLFxcXVxcfV0pLywgXCJudW1iZXJcIl0sXG4gICAgICBbL0BudW1iZXJGbG9hdCg/PVsgXFx0XSpbLFxcXVxcfV0pLywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbL0BudW1iZXJPY3RhbCg/PVsgXFx0XSpbLFxcXVxcfV0pLywgXCJudW1iZXIub2N0YWxcIl0sXG4gICAgICBbL0BudW1iZXJIZXgoPz1bIFxcdF0qWyxcXF1cXH1dKS8sIFwibnVtYmVyLmhleFwiXSxcbiAgICAgIFsvQG51bWJlckluZmluaXR5KD89WyBcXHRdKlssXFxdXFx9XSkvLCBcIm51bWJlci5pbmZpbml0eVwiXSxcbiAgICAgIFsvQG51bWJlck5hTig/PVsgXFx0XSpbLFxcXVxcfV0pLywgXCJudW1iZXIubmFuXCJdLFxuICAgICAgWy9AbnVtYmVyRGF0ZSg/PVsgXFx0XSpbLFxcXVxcfV0pLywgXCJudW1iZXIuZGF0ZVwiXVxuICAgIF0sXG4gICAgdGFnSGFuZGxlOiBbWy9cXCFbXiBdKi8sIFwidGFnXCJdXSxcbiAgICBhbmNob3I6IFtbL1smKl1bXiBdKy8sIFwibmFtZXNwYWNlXCJdXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9BLElBQUksWUFBWSxPQUFPO0FBQ3ZCLElBQUksbUJBQW1CLE9BQU87QUFDOUIsSUFBSSxvQkFBb0IsT0FBTztBQUMvQixJQUFJLGVBQWUsT0FBTyxVQUFVO0FBQ3BDLElBQUksY0FBYyxDQUFDLElBQUksTUFBTSxRQUFRLFNBQVM7QUFDNUMsTUFBSSxRQUFRLE9BQU8sU0FBUyxZQUFZLE9BQU8sU0FBUyxZQUFZO0FBQ2xFLGFBQVMsT0FBTyxrQkFBa0IsSUFBSTtBQUNwQyxVQUFJLENBQUMsYUFBYSxLQUFL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dEIsRUFBRSxTQUFTLGNBQWU7QUFBQSxNQUMxQjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxhQUFhO0FBQUEsWUFDYixZQUFZO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0QsYUFBYSxDQUFDLENBQUMsWUFBWSxVQUFVLDBCQUEwQixDQUFDO0FBQUEsSUFDaEUsc0JBQXNCO0FBQUEsTUFDcEI7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFlBQ0wsV0FBVztBQUFBLFlBQ1gsWUFBWSxFQUFFLE9BQU8sWUFBWSxNQUFNLFVBQVc7QUFBQSxVQUNuRDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0QsWUFBWSxDQUFDLENBQUMsY0FBYyxPQUFPLENBQUM7QUFBQSxJQUNwQyxTQUFTLENBQUMsQ0FBQyxRQUFRLFNBQVMsQ0FBQztBQUFBLElBQzdCLGlCQUFpQjtBQUFBLE1BQ2YsQ0FBQyxNQUFNLGFBQWEsUUFBUTtBQUFBLE1BQzVCLENBQUMsTUFBTSxhQUFhLFNBQVM7QUFBQSxJQUM5QjtBQUFBLElBQ0QsYUFBYTtBQUFBLE1BQ1gsQ0FBQyxtQkFBbUIsZ0JBQWdCO0FBQUEsTUFDcEMsQ0FBQyxtQkFBbUIsZ0JBQWdCO0FBQUEsTUFDcEMsQ0FBQyxXQUFXLFFBQVE7QUFBQSxNQUNwQixDQUFDLEtBQUssVUFBVSxxQkFBcUI7QUFBQSxJQUN0QztBQUFBLElBQ0Qsb0JBQW9CO0FBQUEsTUFDbEIsQ0FBQyxXQUFXLFFBQVE7QUFBQSxNQUNwQixDQUFDLFlBQVksZUFBZTtBQUFBLE1BQzVCLENBQUMsT0FBTyx1QkFBdUI7QUFBQSxNQUMvQixDQUFDLEtBQUssVUFBVSxNQUFNO0FBQUEsSUFDdkI7QUFBQSxJQUNELFlBQVksQ0FBQyxDQUFDLG9CQUFvQixhQUFhLGNBQWMsQ0FBQztBQUFBLElBQzlELFlBQVk7QUFBQSxNQUNWLENBQUMsbUNBQW1DLFFBQVE7QUFBQSxNQUM1QyxDQUFDLGlDQUFpQyxjQUFjO0FBQUEsTUFDaEQsQ0FBQyxpQ0FBaUMsY0FBYztBQUFBLE1BQ2hELENBQUMsK0JBQStCLFlBQVk7QUFBQSxNQUM1QyxDQUFDLG9DQUFvQyxpQkFBaUI7QUFBQSxNQUN0RCxDQUFDLCtCQUErQixZQUFZO0FBQUEsTUFDNUMsQ0FBQyxnQ0FBZ0MsYUFBYTtBQUFBLElBQy9DO0FBQUEsSUFDRCxXQUFXLENBQUMsQ0FBQyxXQUFXLEtBQUssQ0FBQztBQUFBLElBQzlCLFFBQVEsQ0FBQyxDQUFDLGFBQWEsV0FBVyxDQUFDO0FBQUEsRUFDcEM7QUFDSDsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMF19
