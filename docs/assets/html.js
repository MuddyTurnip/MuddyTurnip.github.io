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
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "<", close: ">" }
  ],
  onEnterRules: [
    {
      beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join("|")}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
      afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent
      }
    },
    {
      beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
    }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*<!--\\s*#region\\b.*-->"),
      end: new RegExp("^\\s*<!--\\s*#endregion\\b.*-->")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".html",
  ignoreCase: true,
  tokenizer: {
    root: [
      [/<!DOCTYPE/, "metatag", "@doctype"],
      [/<!--/, "comment", "@comment"],
      [/(<)((?:[\w\-]+:)?[\w\-]+)(\s*)(\/>)/, ["delimiter", "tag", "", "delimiter"]],
      [/(<)(script)/, ["delimiter", { token: "tag", next: "@script" }]],
      [/(<)(style)/, ["delimiter", { token: "tag", next: "@style" }]],
      [/(<)((?:[\w\-]+:)?[\w\-]+)/, ["delimiter", { token: "tag", next: "@otherTag" }]],
      [/(<\/)((?:[\w\-]+:)?[\w\-]+)/, ["delimiter", { token: "tag", next: "@otherTag" }]],
      [/</, "delimiter"],
      [/[^<]+/]
    ],
    doctype: [
      [/[^>]+/, "metatag.content"],
      [/>/, "metatag", "@pop"]
    ],
    comment: [
      [/-->/, "comment", "@pop"],
      [/[^-]+/, "comment.content"],
      [/./, "comment.content"]
    ],
    otherTag: [
      [/\/?>/, "delimiter", "@pop"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/]
    ],
    script: [
      [/type/, "attribute.name", "@scriptAfterType"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [
        />/,
        {
          token: "delimiter",
          next: "@scriptEmbedded",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [/(<\/)(script\s*)(>)/, ["delimiter", "tag", { token: "delimiter", next: "@pop" }]]
    ],
    scriptAfterType: [
      [/=/, "delimiter", "@scriptAfterTypeEquals"],
      [
        />/,
        {
          token: "delimiter",
          next: "@scriptEmbedded",
          nextEmbedded: "text/javascript"
        }
      ],
      [/[ \t\r\n]+/],
      [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    scriptAfterTypeEquals: [
      [
        /"module"/,
        {
          token: "attribute.value",
          switchTo: "@scriptWithCustomType.text/javascript"
        }
      ],
      [
        /'module'/,
        {
          token: "attribute.value",
          switchTo: "@scriptWithCustomType.text/javascript"
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
          token: "delimiter",
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
          token: "delimiter",
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
      [/<\/script/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
      [/[^<]+/, ""]
    ],
    style: [
      [/type/, "attribute.name", "@styleAfterType"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [
        />/,
        {
          token: "delimiter",
          next: "@styleEmbedded",
          nextEmbedded: "text/css"
        }
      ],
      [/[ \t\r\n]+/],
      [/(<\/)(style\s*)(>)/, ["delimiter", "tag", { token: "delimiter", next: "@pop" }]]
    ],
    styleAfterType: [
      [/=/, "delimiter", "@styleAfterTypeEquals"],
      [
        />/,
        {
          token: "delimiter",
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
          token: "delimiter",
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
          token: "delimiter",
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
      [/<\/style/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
      [/[^<]+/, ""]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9odG1sL2h0bWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3JlRXhwb3J0ID0gKHRhcmdldCwgbW9kLCBzZWNvbmRUYXJnZXQpID0+IChfX2NvcHlQcm9wcyh0YXJnZXQsIG1vZCwgXCJkZWZhdWx0XCIpLCBzZWNvbmRUYXJnZXQgJiYgX19jb3B5UHJvcHMoc2Vjb25kVGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSk7XG5cbi8vIHNyYy9maWxsZXJzL21vbmFjby1lZGl0b3ItY29yZS50c1xudmFyIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzID0ge307XG5fX3JlRXhwb3J0KG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLCBtb25hY29fZWRpdG9yX2NvcmVfc3Rhcik7XG5pbXBvcnQgKiBhcyBtb25hY29fZWRpdG9yX2NvcmVfc3RhciBmcm9tIFwiLi4vLi4vZWRpdG9yL2VkaXRvci5hcGkuanNcIjtcblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy9odG1sL2h0bWwudHNcbnZhciBFTVBUWV9FTEVNRU5UUyA9IFtcbiAgXCJhcmVhXCIsXG4gIFwiYmFzZVwiLFxuICBcImJyXCIsXG4gIFwiY29sXCIsXG4gIFwiZW1iZWRcIixcbiAgXCJoclwiLFxuICBcImltZ1wiLFxuICBcImlucHV0XCIsXG4gIFwia2V5Z2VuXCIsXG4gIFwibGlua1wiLFxuICBcIm1lbnVpdGVtXCIsXG4gIFwibWV0YVwiLFxuICBcInBhcmFtXCIsXG4gIFwic291cmNlXCIsXG4gIFwidHJhY2tcIixcbiAgXCJ3YnJcIlxuXTtcbnZhciBjb25mID0ge1xuICB3b3JkUGF0dGVybjogLygtP1xcZCpcXC5cXGRcXHcqKXwoW15cXGBcXH5cXCFcXEBcXCRcXF5cXCZcXCpcXChcXClcXD1cXCtcXFtcXHtcXF1cXH1cXFxcXFx8XFw7XFw6XFwnXFxcIlxcLFxcLlxcPFxcPlxcL1xcc10rKS9nLFxuICBjb21tZW50czoge1xuICAgIGJsb2NrQ29tbWVudDogW1wiPCEtLVwiLCBcIi0tPlwiXVxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIjwhLS1cIiwgXCItLT5cIl0sXG4gICAgW1wiPFwiLCBcIj5cIl0sXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9LFxuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiB9XG4gIF0sXG4gIG9uRW50ZXJSdWxlczogW1xuICAgIHtcbiAgICAgIGJlZm9yZVRleHQ6IG5ldyBSZWdFeHAoYDwoPyEoPzoke0VNUFRZX0VMRU1FTlRTLmpvaW4oXCJ8XCIpfSkpKFtfOlxcXFx3XVtfOlxcXFx3LS5cXFxcZF0qKShbXi8+XSooPyEvKT4pW148XSokYCwgXCJpXCIpLFxuICAgICAgYWZ0ZXJUZXh0OiAvXjxcXC8oW186XFx3XVtfOlxcdy0uXFxkXSopXFxzKj4kL2ksXG4gICAgICBhY3Rpb246IHtcbiAgICAgICAgaW5kZW50QWN0aW9uOiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMuSW5kZW50QWN0aW9uLkluZGVudE91dGRlbnRcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGJlZm9yZVRleHQ6IG5ldyBSZWdFeHAoYDwoPyEoPzoke0VNUFRZX0VMRU1FTlRTLmpvaW4oXCJ8XCIpfSkpKFxcXFx3W1xcXFx3XFxcXGRdKikoW14vPl0qKD8hLyk+KVtePF0qJGAsIFwiaVwiKSxcbiAgICAgIGFjdGlvbjogeyBpbmRlbnRBY3Rpb246IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5JbmRlbnRBY3Rpb24uSW5kZW50IH1cbiAgICB9XG4gIF0sXG4gIGZvbGRpbmc6IHtcbiAgICBtYXJrZXJzOiB7XG4gICAgICBzdGFydDogbmV3IFJlZ0V4cChcIl5cXFxccyo8IS0tXFxcXHMqI3JlZ2lvblxcXFxiLiotLT5cIiksXG4gICAgICBlbmQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqPCEtLVxcXFxzKiNlbmRyZWdpb25cXFxcYi4qLS0+XCIpXG4gICAgfVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCIuaHRtbFwiLFxuICBpZ25vcmVDYXNlOiB0cnVlLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbLzwhRE9DVFlQRS8sIFwibWV0YXRhZ1wiLCBcIkBkb2N0eXBlXCJdLFxuICAgICAgWy88IS0tLywgXCJjb21tZW50XCIsIFwiQGNvbW1lbnRcIl0sXG4gICAgICBbLyg8KSgoPzpbXFx3XFwtXSs6KT9bXFx3XFwtXSspKFxccyopKFxcLz4pLywgW1wiZGVsaW1pdGVyXCIsIFwidGFnXCIsIFwiXCIsIFwiZGVsaW1pdGVyXCJdXSxcbiAgICAgIFsvKDwpKHNjcmlwdCkvLCBbXCJkZWxpbWl0ZXJcIiwgeyB0b2tlbjogXCJ0YWdcIiwgbmV4dDogXCJAc2NyaXB0XCIgfV1dLFxuICAgICAgWy8oPCkoc3R5bGUpLywgW1wiZGVsaW1pdGVyXCIsIHsgdG9rZW46IFwidGFnXCIsIG5leHQ6IFwiQHN0eWxlXCIgfV1dLFxuICAgICAgWy8oPCkoKD86W1xcd1xcLV0rOik/W1xcd1xcLV0rKS8sIFtcImRlbGltaXRlclwiLCB7IHRva2VuOiBcInRhZ1wiLCBuZXh0OiBcIkBvdGhlclRhZ1wiIH1dXSxcbiAgICAgIFsvKDxcXC8pKCg/OltcXHdcXC1dKzopP1tcXHdcXC1dKykvLCBbXCJkZWxpbWl0ZXJcIiwgeyB0b2tlbjogXCJ0YWdcIiwgbmV4dDogXCJAb3RoZXJUYWdcIiB9XV0sXG4gICAgICBbLzwvLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvW148XSsvXVxuICAgIF0sXG4gICAgZG9jdHlwZTogW1xuICAgICAgWy9bXj5dKy8sIFwibWV0YXRhZy5jb250ZW50XCJdLFxuICAgICAgWy8+LywgXCJtZXRhdGFnXCIsIFwiQHBvcFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy8tLT4vLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXi1dKy8sIFwiY29tbWVudC5jb250ZW50XCJdLFxuICAgICAgWy8uLywgXCJjb21tZW50LmNvbnRlbnRcIl1cbiAgICBdLFxuICAgIG90aGVyVGFnOiBbXG4gICAgICBbL1xcLz8+LywgXCJkZWxpbWl0ZXJcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9cIihbXlwiXSopXCIvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvJyhbXiddKiknLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbL1tcXHdcXC1dKy8sIFwiYXR0cmlidXRlLm5hbWVcIl0sXG4gICAgICBbLz0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dXG4gICAgXSxcbiAgICBzY3JpcHQ6IFtcbiAgICAgIFsvdHlwZS8sIFwiYXR0cmlidXRlLm5hbWVcIiwgXCJAc2NyaXB0QWZ0ZXJUeXBlXCJdLFxuICAgICAgWy9cIihbXlwiXSopXCIvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvJyhbXiddKiknLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbL1tcXHdcXC1dKy8sIFwiYXR0cmlidXRlLm5hbWVcIl0sXG4gICAgICBbLz0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyXCIsXG4gICAgICAgICAgbmV4dDogXCJAc2NyaXB0RW1iZWRkZWRcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9qYXZhc2NyaXB0XCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy8oPFxcLykoc2NyaXB0XFxzKikoPikvLCBbXCJkZWxpbWl0ZXJcIiwgXCJ0YWdcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wXCIgfV1dXG4gICAgXSxcbiAgICBzY3JpcHRBZnRlclR5cGU6IFtcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCIsIFwiQHNjcmlwdEFmdGVyVHlwZUVxdWFsc1wiXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyXCIsXG4gICAgICAgICAgbmV4dDogXCJAc2NyaXB0RW1iZWRkZWRcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9qYXZhc2NyaXB0XCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc2NyaXB0XFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzY3JpcHRBZnRlclR5cGVFcXVhbHM6IFtcbiAgICAgIFtcbiAgICAgICAgL1wibW9kdWxlXCIvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHNjcmlwdFdpdGhDdXN0b21UeXBlLnRleHQvamF2YXNjcmlwdFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8nbW9kdWxlJy8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJhdHRyaWJ1dGUudmFsdWVcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc2NyaXB0V2l0aEN1c3RvbVR5cGUudGV4dC9qYXZhc2NyaXB0XCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1wiKFteXCJdKilcIi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJhdHRyaWJ1dGUudmFsdWVcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc2NyaXB0V2l0aEN1c3RvbVR5cGUuJDFcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvJyhbXiddKiknLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImF0dHJpYnV0ZS52YWx1ZVwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBzY3JpcHRXaXRoQ3VzdG9tVHlwZS4kMVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlclwiLFxuICAgICAgICAgIG5leHQ6IFwiQHNjcmlwdEVtYmVkZGVkXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcInRleHQvamF2YXNjcmlwdFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvPFxcL3NjcmlwdFxccyo+LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc2NyaXB0V2l0aEN1c3RvbVR5cGU6IFtcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyXCIsXG4gICAgICAgICAgbmV4dDogXCJAc2NyaXB0RW1iZWRkZWQuJFMyXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcIiRTMlwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy8nKFteJ10qKScvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvW1xcd1xcLV0rLywgXCJhdHRyaWJ1dGUubmFtZVwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLzxcXC9zY3JpcHRcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHNjcmlwdEVtYmVkZGVkOiBbXG4gICAgICBbLzxcXC9zY3JpcHQvLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiLCBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiIH1dLFxuICAgICAgWy9bXjxdKy8sIFwiXCJdXG4gICAgXSxcbiAgICBzdHlsZTogW1xuICAgICAgWy90eXBlLywgXCJhdHRyaWJ1dGUubmFtZVwiLCBcIkBzdHlsZUFmdGVyVHlwZVwiXSxcbiAgICAgIFsvXCIoW15cIl0qKVwiLywgXCJhdHRyaWJ1dGUudmFsdWVcIl0sXG4gICAgICBbLycoW14nXSopJy8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy9bXFx3XFwtXSsvLCBcImF0dHJpYnV0ZS5uYW1lXCJdLFxuICAgICAgWy89LywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlclwiLFxuICAgICAgICAgIG5leHQ6IFwiQHN0eWxlRW1iZWRkZWRcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwidGV4dC9jc3NcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLyg8XFwvKShzdHlsZVxccyopKD4pLywgW1wiZGVsaW1pdGVyXCIsIFwidGFnXCIsIHsgdG9rZW46IFwiZGVsaW1pdGVyXCIsIG5leHQ6IFwiQHBvcFwiIH1dXVxuICAgIF0sXG4gICAgc3R5bGVBZnRlclR5cGU6IFtcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCIsIFwiQHN0eWxlQWZ0ZXJUeXBlRXF1YWxzXCJdLFxuICAgICAgW1xuICAgICAgICAvPi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJkZWxpbWl0ZXJcIixcbiAgICAgICAgICBuZXh0OiBcIkBzdHlsZUVtYmVkZGVkXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcInRleHQvY3NzXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy9dLFxuICAgICAgWy88XFwvc3R5bGVcXHMqPi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHN0eWxlQWZ0ZXJUeXBlRXF1YWxzOiBbXG4gICAgICBbXG4gICAgICAgIC9cIihbXlwiXSopXCIvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHN0eWxlV2l0aEN1c3RvbVR5cGUuJDFcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvJyhbXiddKiknLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImF0dHJpYnV0ZS52YWx1ZVwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBzdHlsZVdpdGhDdXN0b21UeXBlLiQxXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLz4vLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwiZGVsaW1pdGVyXCIsXG4gICAgICAgICAgbmV4dDogXCJAc3R5bGVFbWJlZGRlZFwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2Nzc1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvXSxcbiAgICAgIFsvPFxcL3N0eWxlXFxzKj4vLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBzdHlsZVdpdGhDdXN0b21UeXBlOiBbXG4gICAgICBbXG4gICAgICAgIC8+LyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImRlbGltaXRlclwiLFxuICAgICAgICAgIG5leHQ6IFwiQHN0eWxlRW1iZWRkZWQuJFMyXCIsXG4gICAgICAgICAgbmV4dEVtYmVkZGVkOiBcIiRTMlwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1wiKFteXCJdKilcIi8sIFwiYXR0cmlidXRlLnZhbHVlXCJdLFxuICAgICAgWy8nKFteJ10qKScvLCBcImF0dHJpYnV0ZS52YWx1ZVwiXSxcbiAgICAgIFsvW1xcd1xcLV0rLywgXCJhdHRyaWJ1dGUubmFtZVwiXSxcbiAgICAgIFsvPS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rL10sXG4gICAgICBbLzxcXC9zdHlsZVxccyo+LywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc3R5bGVFbWJlZGRlZDogW1xuICAgICAgWy88XFwvc3R5bGUvLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQHBvcFwiLCBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiIH1dLFxuICAgICAgWy9bXjxdKy8sIFwiXCJdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3Vh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QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLE1BQ0QsQ0FBQyxZQUFZO0FBQUEsTUFDYixDQUFDLHNCQUFzQixDQUFDLGFBQWEsT0FBTyxFQUFFLE9BQU8sYUFBYSxNQUFNLE9BQU0sQ0FBRSxDQUFDO0FBQUEsSUFDbEY7QUFBQSxJQUNELGdCQUFnQjtBQUFBLE1BQ2QsQ0FBQyxLQUFLLGFBQWEsdUJBQXVCO0FBQUEsTUFDMUM7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsTUFBTTtBQUFBLFVBQ04sY0FBYztBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxDQUFDLFlBQVk7QUFBQSxNQUNiLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxZQUFZLE1BQU0sT0FBTSxDQUFFO0FBQUEsSUFDckQ7QUFBQSxJQUNELHNCQUFzQjtBQUFBLE1BQ3BCO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLFVBQVU7QUFBQSxRQUNYO0FBQUEsTUFDRjtBQUFBLE1BQ0Q7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsVUFBVTtBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsTUFDRDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsVUFDTixjQUFjO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsWUFBWTtBQUFBLE1BQ2IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLFlBQVksTUFBTSxPQUFNLENBQUU7QUFBQSxJQUNyRDtBQUFBLElBQ0QscUJBQXFCO0FBQUEsTUFDbkI7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsTUFBTTtBQUFBLFVBQ04sY0FBYztBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxDQUFDLGFBQWEsaUJBQWlCO0FBQUEsTUFDL0IsQ0FBQyxhQUFhLGlCQUFpQjtBQUFBLE1BQy9CLENBQUMsV0FBVyxnQkFBZ0I7QUFBQSxNQUM1QixDQUFDLEtBQUssV0FBVztBQUFBLE1BQ2pCLENBQUMsWUFBWTtBQUFBLE1BQ2IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLFlBQVksTUFBTSxPQUFNLENBQUU7QUFBQSxJQUNyRDtBQUFBLElBQ0QsZUFBZTtBQUFBLE1BQ2IsQ0FBQyxZQUFZLEVBQUUsT0FBTyxZQUFZLE1BQU0sUUFBUSxjQUFjLFFBQVE7QUFBQSxNQUN0RSxDQUFDLFNBQVMsRUFBRTtBQUFBLElBQ2I7QUFBQSxFQUNGO0FBQ0g7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
