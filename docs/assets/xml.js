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
    blockComment: ["<!--", "-->"]
  },
  brackets: [["<", ">"]],
  autoClosingPairs: [
    { open: "<", close: ">" },
    { open: "'", close: "'" },
    { open: '"', close: '"' }
  ],
  surroundingPairs: [
    { open: "<", close: ">" },
    { open: "'", close: "'" },
    { open: '"', close: '"' }
  ],
  onEnterRules: [
    {
      beforeText: new RegExp(`<([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
      afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent
      }
    },
    {
      beforeText: new RegExp(`<(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
    }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".xml",
  ignoreCase: true,
  qualifiedName: /(?:[\w\.\-]+:)?[\w\.\-]+/,
  tokenizer: {
    root: [
      [/[^<&]+/, ""],
      { include: "@whitespace" },
      [/(<)(@qualifiedName)/, [{ token: "delimiter" }, { token: "tag", next: "@tag" }]],
      [
        /(<\/)(@qualifiedName)(\s*)(>)/,
        [{ token: "delimiter" }, { token: "tag" }, "", { token: "delimiter" }]
      ],
      [/(<\?)(@qualifiedName)/, [{ token: "delimiter" }, { token: "metatag", next: "@tag" }]],
      [/(<\!)(@qualifiedName)/, [{ token: "delimiter" }, { token: "metatag", next: "@tag" }]],
      [/<\!\[CDATA\[/, { token: "delimiter.cdata", next: "@cdata" }],
      [/&\w+;/, "string.escape"]
    ],
    cdata: [
      [/[^\]]+/, ""],
      [/\]\]>/, { token: "delimiter.cdata", next: "@pop" }],
      [/\]/, ""]
    ],
    tag: [
      [/[ \t\r\n]+/, ""],
      [/(@qualifiedName)(\s*=\s*)("[^"]*"|'[^']*')/, ["attribute.name", "", "attribute.value"]],
      [
        /(@qualifiedName)(\s*=\s*)("[^">?\/]*|'[^'>?\/]*)(?=[\?\/]\>)/,
        ["attribute.name", "", "attribute.value"]
      ],
      [/(@qualifiedName)(\s*=\s*)("[^">]*|'[^'>]*)/, ["attribute.name", "", "attribute.value"]],
      [/@qualifiedName/, "attribute.name"],
      [/\?>/, { token: "delimiter", next: "@pop" }],
      [/(\/)(>)/, [{ token: "tag" }, { token: "delimiter", next: "@pop" }]],
      [/>/, { token: "delimiter", next: "@pop" }]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/<!--/, { token: "comment", next: "@comment" }]
    ],
    comment: [
      [/[^<\-]+/, "comment.content"],
      [/-->/, { token: "comment", next: "@pop" }],
      [/<!--/, "comment.content.invalid"],
      [/[<\-]/, "comment.content"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL3htbC94bWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3JlRXhwb3J0ID0gKHRhcmdldCwgbW9kLCBzZWNvbmRUYXJnZXQpID0+IChfX2NvcHlQcm9wcyh0YXJnZXQsIG1vZCwgXCJkZWZhdWx0XCIpLCBzZWNvbmRUYXJnZXQgJiYgX19jb3B5UHJvcHMoc2Vjb25kVGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSk7XG5cbi8vIHNyYy9maWxsZXJzL21vbmFjby1lZGl0b3ItY29yZS50c1xudmFyIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzID0ge307XG5fX3JlRXhwb3J0KG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLCBtb25hY29fZWRpdG9yX2NvcmVfc3Rhcik7XG5pbXBvcnQgKiBhcyBtb25hY29fZWRpdG9yX2NvcmVfc3RhciBmcm9tIFwiLi4vLi4vZWRpdG9yL2VkaXRvci5hcGkuanNcIjtcblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy94bWwveG1sLnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBibG9ja0NvbW1lbnQ6IFtcIjwhLS1cIiwgXCItLT5cIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtbXCI8XCIsIFwiPlwiXV0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfVxuICBdLFxuICBvbkVudGVyUnVsZXM6IFtcbiAgICB7XG4gICAgICBiZWZvcmVUZXh0OiBuZXcgUmVnRXhwKGA8KFtfOlxcXFx3XVtfOlxcXFx3LS5cXFxcZF0qKShbXi8+XSooPyEvKT4pW148XSokYCwgXCJpXCIpLFxuICAgICAgYWZ0ZXJUZXh0OiAvXjxcXC8oW186XFx3XVtfOlxcdy0uXFxkXSopXFxzKj4kL2ksXG4gICAgICBhY3Rpb246IHtcbiAgICAgICAgaW5kZW50QWN0aW9uOiBtb25hY29fZWRpdG9yX2NvcmVfZXhwb3J0cy5sYW5ndWFnZXMuSW5kZW50QWN0aW9uLkluZGVudE91dGRlbnRcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGJlZm9yZVRleHQ6IG5ldyBSZWdFeHAoYDwoXFxcXHdbXFxcXHdcXFxcZF0qKShbXi8+XSooPyEvKT4pW148XSokYCwgXCJpXCIpLFxuICAgICAgYWN0aW9uOiB7IGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5JbmRlbnQgfVxuICAgIH1cbiAgXVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiLnhtbFwiLFxuICBpZ25vcmVDYXNlOiB0cnVlLFxuICBxdWFsaWZpZWROYW1lOiAvKD86W1xcd1xcLlxcLV0rOik/W1xcd1xcLlxcLV0rLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy9bXjwmXSsvLCBcIlwiXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbLyg8KShAcXVhbGlmaWVkTmFtZSkvLCBbeyB0b2tlbjogXCJkZWxpbWl0ZXJcIiB9LCB7IHRva2VuOiBcInRhZ1wiLCBuZXh0OiBcIkB0YWdcIiB9XV0sXG4gICAgICBbXG4gICAgICAgIC8oPFxcLykoQHF1YWxpZmllZE5hbWUpKFxccyopKD4pLyxcbiAgICAgICAgW3sgdG9rZW46IFwiZGVsaW1pdGVyXCIgfSwgeyB0b2tlbjogXCJ0YWdcIiB9LCBcIlwiLCB7IHRva2VuOiBcImRlbGltaXRlclwiIH1dXG4gICAgICBdLFxuICAgICAgWy8oPFxcPykoQHF1YWxpZmllZE5hbWUpLywgW3sgdG9rZW46IFwiZGVsaW1pdGVyXCIgfSwgeyB0b2tlbjogXCJtZXRhdGFnXCIsIG5leHQ6IFwiQHRhZ1wiIH1dXSxcbiAgICAgIFsvKDxcXCEpKEBxdWFsaWZpZWROYW1lKS8sIFt7IHRva2VuOiBcImRlbGltaXRlclwiIH0sIHsgdG9rZW46IFwibWV0YXRhZ1wiLCBuZXh0OiBcIkB0YWdcIiB9XV0sXG4gICAgICBbLzxcXCFcXFtDREFUQVxcWy8sIHsgdG9rZW46IFwiZGVsaW1pdGVyLmNkYXRhXCIsIG5leHQ6IFwiQGNkYXRhXCIgfV0sXG4gICAgICBbLyZcXHcrOy8sIFwic3RyaW5nLmVzY2FwZVwiXVxuICAgIF0sXG4gICAgY2RhdGE6IFtcbiAgICAgIFsvW15cXF1dKy8sIFwiXCJdLFxuICAgICAgWy9cXF1cXF0+LywgeyB0b2tlbjogXCJkZWxpbWl0ZXIuY2RhdGFcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICBbL1xcXS8sIFwiXCJdXG4gICAgXSxcbiAgICB0YWc6IFtcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwiXCJdLFxuICAgICAgWy8oQHF1YWxpZmllZE5hbWUpKFxccyo9XFxzKikoXCJbXlwiXSpcInwnW14nXSonKS8sIFtcImF0dHJpYnV0ZS5uYW1lXCIsIFwiXCIsIFwiYXR0cmlidXRlLnZhbHVlXCJdXSxcbiAgICAgIFtcbiAgICAgICAgLyhAcXVhbGlmaWVkTmFtZSkoXFxzKj1cXHMqKShcIlteXCI+P1xcL10qfCdbXic+P1xcL10qKSg/PVtcXD9cXC9dXFw+KS8sXG4gICAgICAgIFtcImF0dHJpYnV0ZS5uYW1lXCIsIFwiXCIsIFwiYXR0cmlidXRlLnZhbHVlXCJdXG4gICAgICBdLFxuICAgICAgWy8oQHF1YWxpZmllZE5hbWUpKFxccyo9XFxzKikoXCJbXlwiPl0qfCdbXic+XSopLywgW1wiYXR0cmlidXRlLm5hbWVcIiwgXCJcIiwgXCJhdHRyaWJ1dGUudmFsdWVcIl1dLFxuICAgICAgWy9AcXVhbGlmaWVkTmFtZS8sIFwiYXR0cmlidXRlLm5hbWVcIl0sXG4gICAgICBbL1xcPz4vLCB7IHRva2VuOiBcImRlbGltaXRlclwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvKFxcLykoPikvLCBbeyB0b2tlbjogXCJ0YWdcIiB9LCB7IHRva2VuOiBcImRlbGltaXRlclwiLCBuZXh0OiBcIkBwb3BcIiB9XV0sXG4gICAgICBbLz4vLCB7IHRva2VuOiBcImRlbGltaXRlclwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgd2hpdGVzcGFjZTogW1xuICAgICAgWy9bIFxcdFxcclxcbl0rLywgXCJcIl0sXG4gICAgICBbLzwhLS0vLCB7IHRva2VuOiBcImNvbW1lbnRcIiwgbmV4dDogXCJAY29tbWVudFwiIH1dXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1tePFxcLV0rLywgXCJjb21tZW50LmNvbnRlbnRcIl0sXG4gICAgICBbLy0tPi8sIHsgdG9rZW46IFwiY29tbWVudFwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvPCEtLS8sIFwiY29tbWVudC5jb250ZW50LmludmFsaWRcIl0sXG4gICAgICBbL1s8XFwtXS8sIFwiY29tbWVudC5jb250ZW50XCJdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9BLElBQUksWUFBWSxPQUFPO0FBQ3ZCLElBQUksbUJBQW1CLE9BQU87QUFDOUIsSUFBSSxvQkFBb0IsT0FBTztBQUMvQixJQUFJLGVBQWUsT0FBTyxVQUFVO0FBQ3BDLElBQUksY0FBYyxDQUFDLElBQUksTUFBTSxRQUFRLFNBQVM7QUFDNUMsTUFBSSxRQUFRLE9BQU8sU0FBUyxZQUFZLE9BQU8sU0FBUyxZQUFZO0FBQ2xFLGFBQVMsT0FBTyxrQkFBa0IsSUFBSTtBQUNwQyxVQUFJLENBQUMsYUFBYSxLQUFLLElBQUksR0FBRyxLQUFLLFFBQVE7QUFDekMsa0JBQVUsSUFBSSxLQUFLLEVBQUUsS0FBSyxNQUFNLEtBQUssR0FBRyxHQUFHLFlBQVksRUFBRSxPQUFPLGlCQUFpQixNQUFNLEdBQUcsTUFBTSxLQUFLLFdBQVUsQ0FBRTtBQUFBLEVBQ3RIO0FBQ0QsU0FBTztBQUNUO0FBQ0EsSUFBSSxhQUFhLENBQUMsUUFBUSxLQUFLLGtCQUFrQixZQUFZLFFBQVEsS0FBSyxTQUFTLEdBQUc7QUFHdEYsSUFBSSw2QkFBNkIsQ0FBQTtBQUNqQyxXQUFXLDRCQUE0Qix1QkFBdUI7QUFJM0QsSUFBQyxPQUFPO0FBQUEsRUFDVCxVQUFVO0FBQUEsSUFDUixjQUFjLENBQUMsUUFBUSxLQUFLO0FBQUEsRUFDN0I7QUFBQSxFQUNELFVBQVUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQUEsRUFDckIsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFCO0FBQUEsRUFDRCxjQUFjO0FBQUEsSUFDWjtBQUFBLE1BQ0UsWUFBWSxJQUFJLE9BQU8sK0NBQStDLEdBQUc7QUFBQSxNQUN6RSxXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsUUFDTixjQUFjLDJCQUEyQixVQUFVLGFBQWE7QUFBQSxNQUNqRTtBQUFBLElBQ0Y7QUFBQSxJQUNEO0FBQUEsTUFDRSxZQUFZLElBQUksT0FBTyx1Q0FBdUMsR0FBRztBQUFBLE1BQ2pFLFFBQVEsRUFBRSxjQUFjLDJCQUEyQixVQUFVLGFBQWEsT0FBUTtBQUFBLElBQ25GO0FBQUEsRUFDRjtBQUNIO0FBQ0csSUFBQyxXQUFXO0FBQUEsRUFDYixjQUFjO0FBQUEsRUFDZCxjQUFjO0FBQUEsRUFDZCxZQUFZO0FBQUEsRUFDWixlQUFlO0FBQUEsRUFDZixXQUFXO0FBQUEsSUFDVCxNQUFNO0FBQUEsTUFDSixDQUFDLFVBQVUsRUFBRTtBQUFBLE1BQ2IsRUFBRSxTQUFTLGNBQWU7QUFBQSxNQUMxQixDQUFDLHVCQUF1QixDQUFDLEVBQUUsT0FBTyxZQUFhLEdBQUUsRUFBRSxPQUFPLE9BQU8sTUFBTSxPQUFNLENBQUUsQ0FBQztBQUFBLE1BQ2hGO0FBQUEsUUFDRTtBQUFBLFFBQ0EsQ0FBQyxFQUFFLE9BQU8sWUFBYSxHQUFFLEVBQUUsT0FBTyxNQUFPLEdBQUUsSUFBSSxFQUFFLE9BQU8sYUFBYTtBQUFBLE1BQ3RFO0FBQUEsTUFDRCxDQUFDLHlCQUF5QixDQUFDLEVBQUUsT0FBTyxZQUFhLEdBQUUsRUFBRSxPQUFPLFdBQVcsTUFBTSxPQUFNLENBQUUsQ0FBQztBQUFBLE1BQ3RGLENBQUMseUJBQXlCLENBQUMsRUFBRSxPQUFPLFlBQWEsR0FBRSxFQUFFLE9BQU8sV0FBVyxNQUFNLE9BQU0sQ0FBRSxDQUFDO0FBQUEsTUFDdEYsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLG1CQUFtQixNQUFNLFNBQVEsQ0FBRTtBQUFBLE1BQzdELENBQUMsU0FBUyxlQUFlO0FBQUEsSUFDMUI7QUFBQSxJQUNELE9BQU87QUFBQSxNQUNMLENBQUMsVUFBVSxFQUFFO0FBQUEsTUFDYixDQUFDLFNBQVMsRUFBRSxPQUFPLG1CQUFtQixNQUFNLE9BQU0sQ0FBRTtBQUFBLE1BQ3BELENBQUMsTUFBTSxFQUFFO0FBQUEsSUFDVjtBQUFBLElBQ0QsS0FBSztBQUFBLE1BQ0gsQ0FBQyxjQUFjLEVBQUU7QUFBQSxNQUNqQixDQUFDLDhDQUE4QyxDQUFDLGtCQUFrQixJQUFJLGlCQUFpQixDQUFDO0FBQUEsTUFDeEY7QUFBQSxRQUNFO0FBQUEsUUFDQSxDQUFDLGtCQUFrQixJQUFJLGlCQUFpQjtBQUFBLE1BQ3pDO0FBQUEsTUFDRCxDQUFDLDhDQUE4QyxDQUFDLGtCQUFrQixJQUFJLGlCQUFpQixDQUFDO0FBQUEsTUFDeEYsQ0FBQyxrQkFBa0IsZ0JBQWdCO0FBQUEsTUFDbkMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxhQUFhLE1BQU0sT0FBTSxDQUFFO0FBQUEsTUFDNUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLE1BQU8sR0FBRSxFQUFFLE9BQU8sYUFBYSxNQUFNLE9BQU0sQ0FBRSxDQUFDO0FBQUEsTUFDcEUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxhQUFhLE1BQU0sT0FBTSxDQUFFO0FBQUEsSUFDM0M7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNWLENBQUMsY0FBYyxFQUFFO0FBQUEsTUFDakIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxXQUFXLE1BQU0sV0FBVSxDQUFFO0FBQUEsSUFDaEQ7QUFBQSxJQUNELFNBQVM7QUFBQSxNQUNQLENBQUMsV0FBVyxpQkFBaUI7QUFBQSxNQUM3QixDQUFDLE9BQU8sRUFBRSxPQUFPLFdBQVcsTUFBTSxPQUFNLENBQUU7QUFBQSxNQUMxQyxDQUFDLFFBQVEseUJBQXlCO0FBQUEsTUFDbEMsQ0FBQyxTQUFTLGlCQUFpQjtBQUFBLElBQzVCO0FBQUEsRUFDRjtBQUNIOyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
