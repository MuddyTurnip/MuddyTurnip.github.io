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
    blockComment: ["{/*", "*/}"]
  },
  brackets: [["{", "}"]],
  autoClosingPairs: [
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "“", close: "”" },
    { open: "‘", close: "’" },
    { open: "`", close: "`" },
    { open: "{", close: "}" },
    { open: "(", close: ")" },
    { open: "_", close: "_" },
    { open: "**", close: "**" },
    { open: "<", close: ">" }
  ],
  onEnterRules: [
    {
      beforeText: /^\s*- .+/,
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.None, appendText: "- " }
    },
    {
      beforeText: /^\s*\+ .+/,
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.None, appendText: "+ " }
    },
    {
      beforeText: /^\s*\* .+/,
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.None, appendText: "* " }
    },
    {
      beforeText: /^> /,
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.None, appendText: "> " }
    },
    {
      beforeText: /<\w+/,
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
    },
    {
      beforeText: /\s+>\s*$/,
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
    },
    {
      beforeText: /<\/\w+>/,
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Outdent }
    },
    ...Array.from({ length: 100 }, (_, index) => ({
      beforeText: new RegExp(`^${index}\\. .+`),
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.None, appendText: `${index + 1}. ` }
    }))
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".mdx",
  control: /[!#()*+.[\\\]_`{}\-]/,
  escapes: /\\@control/,
  tokenizer: {
    root: [
      [/^---$/, { token: "meta.content", next: "@frontmatter", nextEmbedded: "yaml" }],
      [/^\s*import/, { token: "keyword", next: "@import", nextEmbedded: "js" }],
      [/^\s*export/, { token: "keyword", next: "@export", nextEmbedded: "js" }],
      [/<\w+/, { token: "type.identifier", next: "@jsx" }],
      [/<\/?\w+>/, "type.identifier"],
      [
        /^(\s*)(>*\s*)(#{1,6}\s)/,
        [{ token: "white" }, { token: "comment" }, { token: "keyword", next: "@header" }]
      ],
      [/^(\s*)(>*\s*)([*+-])(\s+)/, ["white", "comment", "keyword", "white"]],
      [/^(\s*)(>*\s*)(\d{1,9}\.)(\s+)/, ["white", "comment", "number", "white"]],
      [/^(\s*)(>*\s*)(\d{1,9}\.)(\s+)/, ["white", "comment", "number", "white"]],
      [/^(\s*)(>*\s*)(-{3,}|\*{3,}|_{3,})$/, ["white", "comment", "keyword"]],
      [/`{3,}(\s.*)?$/, { token: "string", next: "@codeblock_backtick" }],
      [/~{3,}(\s.*)?$/, { token: "string", next: "@codeblock_tilde" }],
      [
        /`{3,}(\S+).*$/,
        { token: "string", next: "@codeblock_highlight_backtick", nextEmbedded: "$1" }
      ],
      [
        /~{3,}(\S+).*$/,
        { token: "string", next: "@codeblock_highlight_tilde", nextEmbedded: "$1" }
      ],
      [/^(\s*)(-{4,})$/, ["white", "comment"]],
      [/^(\s*)(>+)/, ["white", "comment"]],
      { include: "content" }
    ],
    content: [
      [
        /(\[)(.+)(]\()(.+)(\s+".*")(\))/,
        ["", "string.link", "", "type.identifier", "string.link", ""]
      ],
      [/(\[)(.+)(]\()(.+)(\))/, ["", "type.identifier", "", "string.link", ""]],
      [/(\[)(.+)(]\[)(.+)(])/, ["", "type.identifier", "", "type.identifier", ""]],
      [/(\[)(.+)(]:\s+)(\S*)/, ["", "type.identifier", "", "string.link"]],
      [/(\[)(.+)(])/, ["", "type.identifier", ""]],
      [/`.*`/, "variable.source"],
      [/_/, { token: "emphasis", next: "@emphasis_underscore" }],
      [/\*(?!\*)/, { token: "emphasis", next: "@emphasis_asterisk" }],
      [/\*\*/, { token: "strong", next: "@strong" }],
      [/{/, { token: "delimiter.bracket", next: "@expression", nextEmbedded: "js" }]
    ],
    import: [[/'\s*(;|$)/, { token: "string", next: "@pop", nextEmbedded: "@pop" }]],
    expression: [
      [/{/, { token: "delimiter.bracket", next: "@expression" }],
      [/}/, { token: "delimiter.bracket", next: "@pop", nextEmbedded: "@pop" }]
    ],
    export: [[/^\s*$/, { token: "delimiter.bracket", next: "@pop", nextEmbedded: "@pop" }]],
    jsx: [
      [/\s+/, ""],
      [/(\w+)(=)("(?:[^"\\]|\\.)*")/, ["attribute.name", "operator", "string"]],
      [/(\w+)(=)('(?:[^'\\]|\\.)*')/, ["attribute.name", "operator", "string"]],
      [/(\w+(?=\s|>|={|$))/, ["attribute.name"]],
      [/={/, { token: "delimiter.bracket", next: "@expression", nextEmbedded: "js" }],
      [/>/, { token: "type.identifier", next: "@pop" }]
    ],
    header: [
      [/.$/, { token: "keyword", next: "@pop" }],
      { include: "content" },
      [/./, { token: "keyword" }]
    ],
    strong: [
      [/\*\*/, { token: "strong", next: "@pop" }],
      { include: "content" },
      [/./, { token: "strong" }]
    ],
    emphasis_underscore: [
      [/_/, { token: "emphasis", next: "@pop" }],
      { include: "content" },
      [/./, { token: "emphasis" }]
    ],
    emphasis_asterisk: [
      [/\*(?!\*)/, { token: "emphasis", next: "@pop" }],
      { include: "content" },
      [/./, { token: "emphasis" }]
    ],
    frontmatter: [[/^---$/, { token: "meta.content", nextEmbedded: "@pop", next: "@pop" }]],
    codeblock_highlight_backtick: [
      [/\s*`{3,}\s*$/, { token: "string", next: "@pop", nextEmbedded: "@pop" }],
      [/.*$/, "variable.source"]
    ],
    codeblock_highlight_tilde: [
      [/\s*~{3,}\s*$/, { token: "string", next: "@pop", nextEmbedded: "@pop" }],
      [/.*$/, "variable.source"]
    ],
    codeblock_backtick: [
      [/\s*`{3,}\s*$/, { token: "string", next: "@pop" }],
      [/.*$/, "variable.source"]
    ],
    codeblock_tilde: [
      [/\s*~{3,}\s*$/, { token: "string", next: "@pop" }],
      [/.*$/, "variable.source"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWR4LmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL21keC9tZHguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3JlRXhwb3J0ID0gKHRhcmdldCwgbW9kLCBzZWNvbmRUYXJnZXQpID0+IChfX2NvcHlQcm9wcyh0YXJnZXQsIG1vZCwgXCJkZWZhdWx0XCIpLCBzZWNvbmRUYXJnZXQgJiYgX19jb3B5UHJvcHMoc2Vjb25kVGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSk7XG5cbi8vIHNyYy9maWxsZXJzL21vbmFjby1lZGl0b3ItY29yZS50c1xudmFyIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzID0ge307XG5fX3JlRXhwb3J0KG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLCBtb25hY29fZWRpdG9yX2NvcmVfc3Rhcik7XG5pbXBvcnQgKiBhcyBtb25hY29fZWRpdG9yX2NvcmVfc3RhciBmcm9tIFwiLi4vLi4vZWRpdG9yL2VkaXRvci5hcGkuanNcIjtcblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy9tZHgvbWR4LnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBibG9ja0NvbW1lbnQ6IFtcInsvKlwiLCBcIiovfVwiXVxuICB9LFxuICBicmFja2V0czogW1tcIntcIiwgXCJ9XCJdXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46IFwiXFx1MjAxQ1wiLCBjbG9zZTogXCJcXHUyMDFEXCIgfSxcbiAgICB7IG9wZW46IFwiXFx1MjAxOFwiLCBjbG9zZTogXCJcXHUyMDE5XCIgfSxcbiAgICB7IG9wZW46IFwiYFwiLCBjbG9zZTogXCJgXCIgfSxcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46IFwiX1wiLCBjbG9zZTogXCJfXCIgfSxcbiAgICB7IG9wZW46IFwiKipcIiwgY2xvc2U6IFwiKipcIiB9LFxuICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiB9XG4gIF0sXG4gIG9uRW50ZXJSdWxlczogW1xuICAgIHtcbiAgICAgIGJlZm9yZVRleHQ6IC9eXFxzKi0gLisvLFxuICAgICAgYWN0aW9uOiB7IGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5Ob25lLCBhcHBlbmRUZXh0OiBcIi0gXCIgfVxuICAgIH0sXG4gICAge1xuICAgICAgYmVmb3JlVGV4dDogL15cXHMqXFwrIC4rLyxcbiAgICAgIGFjdGlvbjogeyBpbmRlbnRBY3Rpb246IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5JbmRlbnRBY3Rpb24uTm9uZSwgYXBwZW5kVGV4dDogXCIrIFwiIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGJlZm9yZVRleHQ6IC9eXFxzKlxcKiAuKy8sXG4gICAgICBhY3Rpb246IHsgaW5kZW50QWN0aW9uOiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMuSW5kZW50QWN0aW9uLk5vbmUsIGFwcGVuZFRleHQ6IFwiKiBcIiB9XG4gICAgfSxcbiAgICB7XG4gICAgICBiZWZvcmVUZXh0OiAvXj4gLyxcbiAgICAgIGFjdGlvbjogeyBpbmRlbnRBY3Rpb246IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5JbmRlbnRBY3Rpb24uTm9uZSwgYXBwZW5kVGV4dDogXCI+IFwiIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGJlZm9yZVRleHQ6IC88XFx3Ky8sXG4gICAgICBhY3Rpb246IHsgaW5kZW50QWN0aW9uOiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMuSW5kZW50QWN0aW9uLkluZGVudCB9XG4gICAgfSxcbiAgICB7XG4gICAgICBiZWZvcmVUZXh0OiAvXFxzKz5cXHMqJC8sXG4gICAgICBhY3Rpb246IHsgaW5kZW50QWN0aW9uOiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMuSW5kZW50QWN0aW9uLkluZGVudCB9XG4gICAgfSxcbiAgICB7XG4gICAgICBiZWZvcmVUZXh0OiAvPFxcL1xcdys+LyxcbiAgICAgIGFjdGlvbjogeyBpbmRlbnRBY3Rpb246IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5JbmRlbnRBY3Rpb24uT3V0ZGVudCB9XG4gICAgfSxcbiAgICAuLi5BcnJheS5mcm9tKHsgbGVuZ3RoOiAxMDAgfSwgKF8sIGluZGV4KSA9PiAoe1xuICAgICAgYmVmb3JlVGV4dDogbmV3IFJlZ0V4cChgXiR7aW5kZXh9XFxcXC4gLitgKSxcbiAgICAgIGFjdGlvbjogeyBpbmRlbnRBY3Rpb246IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5JbmRlbnRBY3Rpb24uTm9uZSwgYXBwZW5kVGV4dDogYCR7aW5kZXggKyAxfS4gYCB9XG4gICAgfSkpXG4gIF1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5tZHhcIixcbiAgY29udHJvbDogL1shIygpKisuW1xcXFxcXF1fYHt9XFwtXS8sXG4gIGVzY2FwZXM6IC9cXFxcQGNvbnRyb2wvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbL14tLS0kLywgeyB0b2tlbjogXCJtZXRhLmNvbnRlbnRcIiwgbmV4dDogXCJAZnJvbnRtYXR0ZXJcIiwgbmV4dEVtYmVkZGVkOiBcInlhbWxcIiB9XSxcbiAgICAgIFsvXlxccyppbXBvcnQvLCB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAaW1wb3J0XCIsIG5leHRFbWJlZGRlZDogXCJqc1wiIH1dLFxuICAgICAgWy9eXFxzKmV4cG9ydC8sIHsgdG9rZW46IFwia2V5d29yZFwiLCBuZXh0OiBcIkBleHBvcnRcIiwgbmV4dEVtYmVkZGVkOiBcImpzXCIgfV0sXG4gICAgICBbLzxcXHcrLywgeyB0b2tlbjogXCJ0eXBlLmlkZW50aWZpZXJcIiwgbmV4dDogXCJAanN4XCIgfV0sXG4gICAgICBbLzxcXC8/XFx3Kz4vLCBcInR5cGUuaWRlbnRpZmllclwiXSxcbiAgICAgIFtcbiAgICAgICAgL14oXFxzKikoPipcXHMqKSgjezEsNn1cXHMpLyxcbiAgICAgICAgW3sgdG9rZW46IFwid2hpdGVcIiB9LCB7IHRva2VuOiBcImNvbW1lbnRcIiB9LCB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAaGVhZGVyXCIgfV1cbiAgICAgIF0sXG4gICAgICBbL14oXFxzKikoPipcXHMqKShbKistXSkoXFxzKykvLCBbXCJ3aGl0ZVwiLCBcImNvbW1lbnRcIiwgXCJrZXl3b3JkXCIsIFwid2hpdGVcIl1dLFxuICAgICAgWy9eKFxccyopKD4qXFxzKikoXFxkezEsOX1cXC4pKFxccyspLywgW1wid2hpdGVcIiwgXCJjb21tZW50XCIsIFwibnVtYmVyXCIsIFwid2hpdGVcIl1dLFxuICAgICAgWy9eKFxccyopKD4qXFxzKikoXFxkezEsOX1cXC4pKFxccyspLywgW1wid2hpdGVcIiwgXCJjb21tZW50XCIsIFwibnVtYmVyXCIsIFwid2hpdGVcIl1dLFxuICAgICAgWy9eKFxccyopKD4qXFxzKikoLXszLH18XFwqezMsfXxfezMsfSkkLywgW1wid2hpdGVcIiwgXCJjb21tZW50XCIsIFwia2V5d29yZFwiXV0sXG4gICAgICBbL2B7Myx9KFxccy4qKT8kLywgeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAY29kZWJsb2NrX2JhY2t0aWNrXCIgfV0sXG4gICAgICBbL357Myx9KFxccy4qKT8kLywgeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAY29kZWJsb2NrX3RpbGRlXCIgfV0sXG4gICAgICBbXG4gICAgICAgIC9gezMsfShcXFMrKS4qJC8sXG4gICAgICAgIHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQGNvZGVibG9ja19oaWdobGlnaHRfYmFja3RpY2tcIiwgbmV4dEVtYmVkZGVkOiBcIiQxXCIgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL357Myx9KFxcUyspLiokLyxcbiAgICAgICAgeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAY29kZWJsb2NrX2hpZ2hsaWdodF90aWxkZVwiLCBuZXh0RW1iZWRkZWQ6IFwiJDFcIiB9XG4gICAgICBdLFxuICAgICAgWy9eKFxccyopKC17NCx9KSQvLCBbXCJ3aGl0ZVwiLCBcImNvbW1lbnRcIl1dLFxuICAgICAgWy9eKFxccyopKD4rKS8sIFtcIndoaXRlXCIsIFwiY29tbWVudFwiXV0sXG4gICAgICB7IGluY2x1ZGU6IFwiY29udGVudFwiIH1cbiAgICBdLFxuICAgIGNvbnRlbnQ6IFtcbiAgICAgIFtcbiAgICAgICAgLyhcXFspKC4rKShdXFwoKSguKykoXFxzK1wiLipcIikoXFwpKS8sXG4gICAgICAgIFtcIlwiLCBcInN0cmluZy5saW5rXCIsIFwiXCIsIFwidHlwZS5pZGVudGlmaWVyXCIsIFwic3RyaW5nLmxpbmtcIiwgXCJcIl1cbiAgICAgIF0sXG4gICAgICBbLyhcXFspKC4rKShdXFwoKSguKykoXFwpKS8sIFtcIlwiLCBcInR5cGUuaWRlbnRpZmllclwiLCBcIlwiLCBcInN0cmluZy5saW5rXCIsIFwiXCJdXSxcbiAgICAgIFsvKFxcWykoLispKF1cXFspKC4rKShdKS8sIFtcIlwiLCBcInR5cGUuaWRlbnRpZmllclwiLCBcIlwiLCBcInR5cGUuaWRlbnRpZmllclwiLCBcIlwiXV0sXG4gICAgICBbLyhcXFspKC4rKShdOlxccyspKFxcUyopLywgW1wiXCIsIFwidHlwZS5pZGVudGlmaWVyXCIsIFwiXCIsIFwic3RyaW5nLmxpbmtcIl1dLFxuICAgICAgWy8oXFxbKSguKykoXSkvLCBbXCJcIiwgXCJ0eXBlLmlkZW50aWZpZXJcIiwgXCJcIl1dLFxuICAgICAgWy9gLipgLywgXCJ2YXJpYWJsZS5zb3VyY2VcIl0sXG4gICAgICBbL18vLCB7IHRva2VuOiBcImVtcGhhc2lzXCIsIG5leHQ6IFwiQGVtcGhhc2lzX3VuZGVyc2NvcmVcIiB9XSxcbiAgICAgIFsvXFwqKD8hXFwqKS8sIHsgdG9rZW46IFwiZW1waGFzaXNcIiwgbmV4dDogXCJAZW1waGFzaXNfYXN0ZXJpc2tcIiB9XSxcbiAgICAgIFsvXFwqXFwqLywgeyB0b2tlbjogXCJzdHJvbmdcIiwgbmV4dDogXCJAc3Ryb25nXCIgfV0sXG4gICAgICBbL3svLCB7IHRva2VuOiBcImRlbGltaXRlci5icmFja2V0XCIsIG5leHQ6IFwiQGV4cHJlc3Npb25cIiwgbmV4dEVtYmVkZGVkOiBcImpzXCIgfV1cbiAgICBdLFxuICAgIGltcG9ydDogW1svJ1xccyooO3wkKS8sIHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcFwiLCBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiIH1dXSxcbiAgICBleHByZXNzaW9uOiBbXG4gICAgICBbL3svLCB7IHRva2VuOiBcImRlbGltaXRlci5icmFja2V0XCIsIG5leHQ6IFwiQGV4cHJlc3Npb25cIiB9XSxcbiAgICAgIFsvfS8sIHsgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXRcIiwgbmV4dDogXCJAcG9wXCIsIG5leHRFbWJlZGRlZDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIGV4cG9ydDogW1svXlxccyokLywgeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBuZXh0OiBcIkBwb3BcIiwgbmV4dEVtYmVkZGVkOiBcIkBwb3BcIiB9XV0sXG4gICAganN4OiBbXG4gICAgICBbL1xccysvLCBcIlwiXSxcbiAgICAgIFsvKFxcdyspKD0pKFwiKD86W15cIlxcXFxdfFxcXFwuKSpcIikvLCBbXCJhdHRyaWJ1dGUubmFtZVwiLCBcIm9wZXJhdG9yXCIsIFwic3RyaW5nXCJdXSxcbiAgICAgIFsvKFxcdyspKD0pKCcoPzpbXidcXFxcXXxcXFxcLikqJykvLCBbXCJhdHRyaWJ1dGUubmFtZVwiLCBcIm9wZXJhdG9yXCIsIFwic3RyaW5nXCJdXSxcbiAgICAgIFsvKFxcdysoPz1cXHN8Pnw9e3wkKSkvLCBbXCJhdHRyaWJ1dGUubmFtZVwiXV0sXG4gICAgICBbLz17LywgeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBuZXh0OiBcIkBleHByZXNzaW9uXCIsIG5leHRFbWJlZGRlZDogXCJqc1wiIH1dLFxuICAgICAgWy8+LywgeyB0b2tlbjogXCJ0eXBlLmlkZW50aWZpZXJcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIGhlYWRlcjogW1xuICAgICAgWy8uJC8sIHsgdG9rZW46IFwia2V5d29yZFwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIHsgaW5jbHVkZTogXCJjb250ZW50XCIgfSxcbiAgICAgIFsvLi8sIHsgdG9rZW46IFwia2V5d29yZFwiIH1dXG4gICAgXSxcbiAgICBzdHJvbmc6IFtcbiAgICAgIFsvXFwqXFwqLywgeyB0b2tlbjogXCJzdHJvbmdcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiY29udGVudFwiIH0sXG4gICAgICBbLy4vLCB7IHRva2VuOiBcInN0cm9uZ1wiIH1dXG4gICAgXSxcbiAgICBlbXBoYXNpc191bmRlcnNjb3JlOiBbXG4gICAgICBbL18vLCB7IHRva2VuOiBcImVtcGhhc2lzXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgeyBpbmNsdWRlOiBcImNvbnRlbnRcIiB9LFxuICAgICAgWy8uLywgeyB0b2tlbjogXCJlbXBoYXNpc1wiIH1dXG4gICAgXSxcbiAgICBlbXBoYXNpc19hc3RlcmlzazogW1xuICAgICAgWy9cXCooPyFcXCopLywgeyB0b2tlbjogXCJlbXBoYXNpc1wiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIHsgaW5jbHVkZTogXCJjb250ZW50XCIgfSxcbiAgICAgIFsvLi8sIHsgdG9rZW46IFwiZW1waGFzaXNcIiB9XVxuICAgIF0sXG4gICAgZnJvbnRtYXR0ZXI6IFtbL14tLS0kLywgeyB0b2tlbjogXCJtZXRhLmNvbnRlbnRcIiwgbmV4dEVtYmVkZGVkOiBcIkBwb3BcIiwgbmV4dDogXCJAcG9wXCIgfV1dLFxuICAgIGNvZGVibG9ja19oaWdobGlnaHRfYmFja3RpY2s6IFtcbiAgICAgIFsvXFxzKmB7Myx9XFxzKiQvLCB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BcIiwgbmV4dEVtYmVkZGVkOiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvLiokLywgXCJ2YXJpYWJsZS5zb3VyY2VcIl1cbiAgICBdLFxuICAgIGNvZGVibG9ja19oaWdobGlnaHRfdGlsZGU6IFtcbiAgICAgIFsvXFxzKn57Myx9XFxzKiQvLCB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BcIiwgbmV4dEVtYmVkZGVkOiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvLiokLywgXCJ2YXJpYWJsZS5zb3VyY2VcIl1cbiAgICBdLFxuICAgIGNvZGVibG9ja19iYWNrdGljazogW1xuICAgICAgWy9cXHMqYHszLH1cXHMqJC8sIHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgWy8uKiQvLCBcInZhcmlhYmxlLnNvdXJjZVwiXVxuICAgIF0sXG4gICAgY29kZWJsb2NrX3RpbGRlOiBbXG4gICAgICBbL1xccyp+ezMsfVxccyokLywgeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICBbLy4qJC8sIFwidmFyaWFibGUuc291cmNlXCJdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9BLElBQUksWUFB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
