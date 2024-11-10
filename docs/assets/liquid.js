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
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
  brackets: [
    ["<!--", "-->"],
    ["<", ">"],
    ["{{", "}}"],
    ["{%", "%}"],
    ["{", "}"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "%", close: "%" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: "<", close: ">" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
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
  builtinTags: [
    "if",
    "else",
    "elseif",
    "endif",
    "render",
    "assign",
    "capture",
    "endcapture",
    "case",
    "endcase",
    "comment",
    "endcomment",
    "cycle",
    "decrement",
    "for",
    "endfor",
    "include",
    "increment",
    "layout",
    "raw",
    "endraw",
    "render",
    "tablerow",
    "endtablerow",
    "unless",
    "endunless"
  ],
  builtinFilters: [
    "abs",
    "append",
    "at_least",
    "at_most",
    "capitalize",
    "ceil",
    "compact",
    "date",
    "default",
    "divided_by",
    "downcase",
    "escape",
    "escape_once",
    "first",
    "floor",
    "join",
    "json",
    "last",
    "lstrip",
    "map",
    "minus",
    "modulo",
    "newline_to_br",
    "plus",
    "prepend",
    "remove",
    "remove_first",
    "replace",
    "replace_first",
    "reverse",
    "round",
    "rstrip",
    "size",
    "slice",
    "sort",
    "sort_natural",
    "split",
    "strip",
    "strip_html",
    "strip_newlines",
    "times",
    "truncate",
    "truncatewords",
    "uniq",
    "upcase",
    "url_decode",
    "url_encode",
    "where"
  ],
  constants: ["true", "false"],
  operators: ["==", "!=", ">", "<", ">=", "<="],
  symbol: /[=><!]+/,
  identifier: /[a-zA-Z_][\w]*/,
  tokenizer: {
    root: [
      [/\{\%\s*comment\s*\%\}/, "comment.start.liquid", "@comment"],
      [/\{\{/, { token: "@rematch", switchTo: "@liquidState.root" }],
      [/\{\%/, { token: "@rematch", switchTo: "@liquidState.root" }],
      [/(<)([\w\-]+)(\/>)/, ["delimiter.html", "tag.html", "delimiter.html"]],
      [/(<)([:\w]+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
      [/(<\/)([\w\-]+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
      [/</, "delimiter.html"],
      [/\{/, "delimiter.html"],
      [/[^<{]+/]
    ],
    comment: [
      [/\{\%\s*endcomment\s*\%\}/, "comment.end.liquid", "@pop"],
      [/./, "comment.content.liquid"]
    ],
    otherTag: [
      [
        /\{\{/,
        {
          token: "@rematch",
          switchTo: "@liquidState.otherTag"
        }
      ],
      [
        /\{\%/,
        {
          token: "@rematch",
          switchTo: "@liquidState.otherTag"
        }
      ],
      [/\/?>/, "delimiter.html", "@pop"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/]
    ],
    liquidState: [
      [/\{\{/, "delimiter.output.liquid"],
      [/\}\}/, { token: "delimiter.output.liquid", switchTo: "@$S2.$S3" }],
      [/\{\%/, "delimiter.tag.liquid"],
      [/raw\s*\%\}/, "delimiter.tag.liquid", "@liquidRaw"],
      [/\%\}/, { token: "delimiter.tag.liquid", switchTo: "@$S2.$S3" }],
      { include: "liquidRoot" }
    ],
    liquidRaw: [
      [/^(?!\{\%\s*endraw\s*\%\}).+/],
      [/\{\%/, "delimiter.tag.liquid"],
      [/@identifier/],
      [/\%\}/, { token: "delimiter.tag.liquid", next: "@root" }]
    ],
    liquidRoot: [
      [/\d+(\.\d+)?/, "number.liquid"],
      [/"[^"]*"/, "string.liquid"],
      [/'[^']*'/, "string.liquid"],
      [/\s+/],
      [
        /@symbol/,
        {
          cases: {
            "@operators": "operator.liquid",
            "@default": ""
          }
        }
      ],
      [/\./],
      [
        /@identifier/,
        {
          cases: {
            "@constants": "keyword.liquid",
            "@builtinFilters": "predefined.liquid",
            "@builtinTags": "predefined.liquid",
            "@default": "variable.liquid"
          }
        }
      ],
      [/[^}|%]/, "variable.liquid"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlxdWlkLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2xpcXVpZC9saXF1aWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3JlRXhwb3J0ID0gKHRhcmdldCwgbW9kLCBzZWNvbmRUYXJnZXQpID0+IChfX2NvcHlQcm9wcyh0YXJnZXQsIG1vZCwgXCJkZWZhdWx0XCIpLCBzZWNvbmRUYXJnZXQgJiYgX19jb3B5UHJvcHMoc2Vjb25kVGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSk7XG5cbi8vIHNyYy9maWxsZXJzL21vbmFjby1lZGl0b3ItY29yZS50c1xudmFyIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzID0ge307XG5fX3JlRXhwb3J0KG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLCBtb25hY29fZWRpdG9yX2NvcmVfc3Rhcik7XG5pbXBvcnQgKiBhcyBtb25hY29fZWRpdG9yX2NvcmVfc3RhciBmcm9tIFwiLi4vLi4vZWRpdG9yL2VkaXRvci5hcGkuanNcIjtcblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy9saXF1aWQvbGlxdWlkLnRzXG52YXIgRU1QVFlfRUxFTUVOVFMgPSBbXG4gIFwiYXJlYVwiLFxuICBcImJhc2VcIixcbiAgXCJiclwiLFxuICBcImNvbFwiLFxuICBcImVtYmVkXCIsXG4gIFwiaHJcIixcbiAgXCJpbWdcIixcbiAgXCJpbnB1dFwiLFxuICBcImtleWdlblwiLFxuICBcImxpbmtcIixcbiAgXCJtZW51aXRlbVwiLFxuICBcIm1ldGFcIixcbiAgXCJwYXJhbVwiLFxuICBcInNvdXJjZVwiLFxuICBcInRyYWNrXCIsXG4gIFwid2JyXCJcbl07XG52YXIgY29uZiA9IHtcbiAgd29yZFBhdHRlcm46IC8oLT9cXGQqXFwuXFxkXFx3Kil8KFteXFxgXFx+XFwhXFxAXFwkXFxeXFwmXFwqXFwoXFwpXFw9XFwrXFxbXFx7XFxdXFx9XFxcXFxcfFxcO1xcOlxcJ1xcXCJcXCxcXC5cXDxcXD5cXC9cXHNdKykvZyxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCI8IS0tXCIsIFwiLS0+XCJdLFxuICAgIFtcIjxcIiwgXCI+XCJdLFxuICAgIFtcInt7XCIsIFwifX1cIl0sXG4gICAgW1wieyVcIiwgXCIlfVwiXSxcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIiVcIiwgY2xvc2U6IFwiJVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH1cbiAgXSxcbiAgb25FbnRlclJ1bGVzOiBbXG4gICAge1xuICAgICAgYmVmb3JlVGV4dDogbmV3IFJlZ0V4cChgPCg/ISg/OiR7RU1QVFlfRUxFTUVOVFMuam9pbihcInxcIil9KSkoXFxcXHdbXFxcXHdcXFxcZF0qKShbXi8+XSooPyEvKT4pW148XSokYCwgXCJpXCIpLFxuICAgICAgYWZ0ZXJUZXh0OiAvXjxcXC8oXFx3W1xcd1xcZF0qKVxccyo+JC9pLFxuICAgICAgYWN0aW9uOiB7XG4gICAgICAgIGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5JbmRlbnRPdXRkZW50XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBiZWZvcmVUZXh0OiBuZXcgUmVnRXhwKGA8KD8hKD86JHtFTVBUWV9FTEVNRU5UUy5qb2luKFwifFwiKX0pKShcXFxcd1tcXFxcd1xcXFxkXSopKFteLz5dKig/IS8pPilbXjxdKiRgLCBcImlcIiksXG4gICAgICBhY3Rpb246IHsgaW5kZW50QWN0aW9uOiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMuSW5kZW50QWN0aW9uLkluZGVudCB9XG4gICAgfVxuICBdXG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCJcIixcbiAgYnVpbHRpblRhZ3M6IFtcbiAgICBcImlmXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJlbHNlaWZcIixcbiAgICBcImVuZGlmXCIsXG4gICAgXCJyZW5kZXJcIixcbiAgICBcImFzc2lnblwiLFxuICAgIFwiY2FwdHVyZVwiLFxuICAgIFwiZW5kY2FwdHVyZVwiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiZW5kY2FzZVwiLFxuICAgIFwiY29tbWVudFwiLFxuICAgIFwiZW5kY29tbWVudFwiLFxuICAgIFwiY3ljbGVcIixcbiAgICBcImRlY3JlbWVudFwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJlbmRmb3JcIixcbiAgICBcImluY2x1ZGVcIixcbiAgICBcImluY3JlbWVudFwiLFxuICAgIFwibGF5b3V0XCIsXG4gICAgXCJyYXdcIixcbiAgICBcImVuZHJhd1wiLFxuICAgIFwicmVuZGVyXCIsXG4gICAgXCJ0YWJsZXJvd1wiLFxuICAgIFwiZW5kdGFibGVyb3dcIixcbiAgICBcInVubGVzc1wiLFxuICAgIFwiZW5kdW5sZXNzXCJcbiAgXSxcbiAgYnVpbHRpbkZpbHRlcnM6IFtcbiAgICBcImFic1wiLFxuICAgIFwiYXBwZW5kXCIsXG4gICAgXCJhdF9sZWFzdFwiLFxuICAgIFwiYXRfbW9zdFwiLFxuICAgIFwiY2FwaXRhbGl6ZVwiLFxuICAgIFwiY2VpbFwiLFxuICAgIFwiY29tcGFjdFwiLFxuICAgIFwiZGF0ZVwiLFxuICAgIFwiZGVmYXVsdFwiLFxuICAgIFwiZGl2aWRlZF9ieVwiLFxuICAgIFwiZG93bmNhc2VcIixcbiAgICBcImVzY2FwZVwiLFxuICAgIFwiZXNjYXBlX29uY2VcIixcbiAgICBcImZpcnN0XCIsXG4gICAgXCJmbG9vclwiLFxuICAgIFwiam9pblwiLFxuICAgIFwianNvblwiLFxuICAgIFwibGFzdFwiLFxuICAgIFwibHN0cmlwXCIsXG4gICAgXCJtYXBcIixcbiAgICBcIm1pbnVzXCIsXG4gICAgXCJtb2R1bG9cIixcbiAgICBcIm5ld2xpbmVfdG9fYnJcIixcbiAgICBcInBsdXNcIixcbiAgICBcInByZXBlbmRcIixcbiAgICBcInJlbW92ZVwiLFxuICAgIFwicmVtb3ZlX2ZpcnN0XCIsXG4gICAgXCJyZXBsYWNlXCIsXG4gICAgXCJyZXBsYWNlX2ZpcnN0XCIsXG4gICAgXCJyZXZlcnNlXCIsXG4gICAgXCJyb3VuZFwiLFxuICAgIFwicnN0cmlwXCIsXG4gICAgXCJzaXplXCIsXG4gICAgXCJzbGljZVwiLFxuICAgIFwic29ydFwiLFxuICAgIFwic29ydF9uYXR1cmFsXCIsXG4gICAgXCJzcGxpdFwiLFxuICAgIFwic3RyaXBcIixcbiAgICBcInN0cmlwX2h0bWxcIixcbiAgICBcInN0cmlwX25ld2xpbmVzXCIsXG4gICAgXCJ0aW1lc1wiLFxuICAgIFwidHJ1bmNhdGVcIixcbiAgICBcInRydW5jYXRld29yZHNcIixcbiAgICBcInVuaXFcIixcbiAgICBcInVwY2FzZVwiLFxuICAgIFwidXJsX2RlY29kZVwiLFxuICAgIFwidXJsX2VuY29kZVwiLFxuICAgIFwid2hlcmVcIlxuICBdLFxuICBjb25zdGFudHM6IFtcInRydWVcIiwgXCJmYWxzZVwiXSxcbiAgb3BlcmF0b3JzOiBbXCI9PVwiLCBcIiE9XCIsIFwiPlwiLCBcIjxcIiwgXCI+PVwiLCBcIjw9XCJdLFxuICBzeW1ib2w6IC9bPT48IV0rLyxcbiAgaWRlbnRpZmllcjogL1thLXpBLVpfXVtcXHddKi8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIFsvXFx7XFwlXFxzKmNvbW1lbnRcXHMqXFwlXFx9LywgXCJjb21tZW50LnN0YXJ0LmxpcXVpZFwiLCBcIkBjb21tZW50XCJdLFxuICAgICAgWy9cXHtcXHsvLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBcIkBsaXF1aWRTdGF0ZS5yb290XCIgfV0sXG4gICAgICBbL1xce1xcJS8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgc3dpdGNoVG86IFwiQGxpcXVpZFN0YXRlLnJvb3RcIiB9XSxcbiAgICAgIFsvKDwpKFtcXHdcXC1dKykoXFwvPikvLCBbXCJkZWxpbWl0ZXIuaHRtbFwiLCBcInRhZy5odG1sXCIsIFwiZGVsaW1pdGVyLmh0bWxcIl1dLFxuICAgICAgWy8oPCkoWzpcXHddKykvLCBbXCJkZWxpbWl0ZXIuaHRtbFwiLCB7IHRva2VuOiBcInRhZy5odG1sXCIsIG5leHQ6IFwiQG90aGVyVGFnXCIgfV1dLFxuICAgICAgWy8oPFxcLykoW1xcd1xcLV0rKS8sIFtcImRlbGltaXRlci5odG1sXCIsIHsgdG9rZW46IFwidGFnLmh0bWxcIiwgbmV4dDogXCJAb3RoZXJUYWdcIiB9XV0sXG4gICAgICBbLzwvLCBcImRlbGltaXRlci5odG1sXCJdLFxuICAgICAgWy9cXHsvLCBcImRlbGltaXRlci5odG1sXCJdLFxuICAgICAgWy9bXjx7XSsvXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9cXHtcXCVcXHMqZW5kY29tbWVudFxccypcXCVcXH0vLCBcImNvbW1lbnQuZW5kLmxpcXVpZFwiLCBcIkBwb3BcIl0sXG4gICAgICBbLy4vLCBcImNvbW1lbnQuY29udGVudC5saXF1aWRcIl1cbiAgICBdLFxuICAgIG90aGVyVGFnOiBbXG4gICAgICBbXG4gICAgICAgIC9cXHtcXHsvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAbGlxdWlkU3RhdGUub3RoZXJUYWdcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvXFx7XFwlLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcIkByZW1hdGNoXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQGxpcXVpZFN0YXRlLm90aGVyVGFnXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXFwvPz4vLCBcImRlbGltaXRlci5odG1sXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvXCIoW15cIl0qKVwiLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbLycoW14nXSopJy8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy9bXFx3XFwtXSsvLCBcImF0dHJpYnV0ZS5uYW1lXCJdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXVxuICAgIF0sXG4gICAgbGlxdWlkU3RhdGU6IFtcbiAgICAgIFsvXFx7XFx7LywgXCJkZWxpbWl0ZXIub3V0cHV0LmxpcXVpZFwiXSxcbiAgICAgIFsvXFx9XFx9LywgeyB0b2tlbjogXCJkZWxpbWl0ZXIub3V0cHV0LmxpcXVpZFwiLCBzd2l0Y2hUbzogXCJAJFMyLiRTM1wiIH1dLFxuICAgICAgWy9cXHtcXCUvLCBcImRlbGltaXRlci50YWcubGlxdWlkXCJdLFxuICAgICAgWy9yYXdcXHMqXFwlXFx9LywgXCJkZWxpbWl0ZXIudGFnLmxpcXVpZFwiLCBcIkBsaXF1aWRSYXdcIl0sXG4gICAgICBbL1xcJVxcfS8sIHsgdG9rZW46IFwiZGVsaW1pdGVyLnRhZy5saXF1aWRcIiwgc3dpdGNoVG86IFwiQCRTMi4kUzNcIiB9XSxcbiAgICAgIHsgaW5jbHVkZTogXCJsaXF1aWRSb290XCIgfVxuICAgIF0sXG4gICAgbGlxdWlkUmF3OiBbXG4gICAgICBbL14oPyFcXHtcXCVcXHMqZW5kcmF3XFxzKlxcJVxcfSkuKy9dLFxuICAgICAgWy9cXHtcXCUvLCBcImRlbGltaXRlci50YWcubGlxdWlkXCJdLFxuICAgICAgWy9AaWRlbnRpZmllci9dLFxuICAgICAgWy9cXCVcXH0vLCB7IHRva2VuOiBcImRlbGltaXRlci50YWcubGlxdWlkXCIsIG5leHQ6IFwiQHJvb3RcIiB9XVxuICAgIF0sXG4gICAgbGlxdWlkUm9vdDogW1xuICAgICAgWy9cXGQrKFxcLlxcZCspPy8sIFwibnVtYmVyLmxpcXVpZFwiXSxcbiAgICAgIFsvXCJbXlwiXSpcIi8sIFwic3RyaW5nLmxpcXVpZFwiXSxcbiAgICAgIFsvJ1teJ10qJy8sIFwic3RyaW5nLmxpcXVpZFwiXSxcbiAgICAgIFsvXFxzKy9dLFxuICAgICAgW1xuICAgICAgICAvQHN5bWJvbC8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAb3BlcmF0b3JzXCI6IFwib3BlcmF0b3IubGlxdWlkXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1xcLi9dLFxuICAgICAgW1xuICAgICAgICAvQGlkZW50aWZpZXIvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGNvbnN0YW50c1wiOiBcImtleXdvcmQubGlxdWlkXCIsXG4gICAgICAgICAgICBcIkBidWlsdGluRmlsdGVyc1wiOiBcInByZWRlZmluZWQubGlxdWlkXCIsXG4gICAgICAgICAgICBcIkBidWlsdGluVGFnc1wiOiBcInByZWRlZmluZWQubGlxdWlkXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwidmFyaWFibGUubGlxdWlkXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1tefXwlXS8sIFwidmFyaWFibGUubGlxdWlkXCJdXG4gICAgXVxuICB9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
