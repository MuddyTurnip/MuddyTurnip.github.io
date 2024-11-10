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
    lineComment: "#",
    blockComment: ["'''", "'''"]
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
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  onEnterRules: [
    {
      beforeText: new RegExp("^\\s*(?:def|class|for|if|elif|else|while|try|with|finally|except|async|match|case).*?:\\s*$"),
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
    }
  ],
  folding: {
    offSide: true,
    markers: {
      start: new RegExp("^\\s*#region\\b"),
      end: new RegExp("^\\s*#endregion\\b")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".python",
  keywords: [
    "False",
    "None",
    "True",
    "_",
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "case",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "exec",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "match",
    "nonlocal",
    "not",
    "or",
    "pass",
    "print",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield",
    "int",
    "float",
    "long",
    "complex",
    "hex",
    "abs",
    "all",
    "any",
    "apply",
    "basestring",
    "bin",
    "bool",
    "buffer",
    "bytearray",
    "callable",
    "chr",
    "classmethod",
    "cmp",
    "coerce",
    "compile",
    "complex",
    "delattr",
    "dict",
    "dir",
    "divmod",
    "enumerate",
    "eval",
    "execfile",
    "file",
    "filter",
    "format",
    "frozenset",
    "getattr",
    "globals",
    "hasattr",
    "hash",
    "help",
    "id",
    "input",
    "intern",
    "isinstance",
    "issubclass",
    "iter",
    "len",
    "locals",
    "list",
    "map",
    "max",
    "memoryview",
    "min",
    "next",
    "object",
    "oct",
    "open",
    "ord",
    "pow",
    "print",
    "property",
    "reversed",
    "range",
    "raw_input",
    "reduce",
    "reload",
    "repr",
    "reversed",
    "round",
    "self",
    "set",
    "setattr",
    "slice",
    "sorted",
    "staticmethod",
    "str",
    "sum",
    "super",
    "tuple",
    "type",
    "unichr",
    "unicode",
    "vars",
    "xrange",
    "zip",
    "__dict__",
    "__methods__",
    "__members__",
    "__class__",
    "__bases__",
    "__name__",
    "__mro__",
    "__subclasses__",
    "__init__",
    "__import__"
  ],
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.bracket" },
    { open: "(", close: ")", token: "delimiter.parenthesis" }
  ],
  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@numbers" },
      { include: "@strings" },
      [/[,:;]/, "delimiter"],
      [/[{}\[\]()]/, "@brackets"],
      [/@[a-zA-Z_]\w*/, "tag"],
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ]
    ],
    whitespace: [
      [/\s+/, "white"],
      [/(^#.*$)/, "comment"],
      [/'''/, "string", "@endDocString"],
      [/"""/, "string", "@endDblDocString"]
    ],
    endDocString: [
      [/[^']+/, "string"],
      [/\\'/, "string"],
      [/'''/, "string", "@popall"],
      [/'/, "string"]
    ],
    endDblDocString: [
      [/[^"]+/, "string"],
      [/\\"/, "string"],
      [/"""/, "string", "@popall"],
      [/"/, "string"]
    ],
    numbers: [
      [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, "number.hex"],
      [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, "number"]
    ],
    strings: [
      [/'$/, "string.escape", "@popall"],
      [/'/, "string.escape", "@stringBody"],
      [/"$/, "string.escape", "@popall"],
      [/"/, "string.escape", "@dblStringBody"]
    ],
    stringBody: [
      [/[^\\']+$/, "string", "@popall"],
      [/[^\\']+/, "string"],
      [/\\./, "string"],
      [/'/, "string.escape", "@popall"],
      [/\\$/, "string"]
    ],
    dblStringBody: [
      [/[^\\"]+$/, "string", "@popall"],
      [/[^\\"]+/, "string"],
      [/\\./, "string"],
      [/"/, "string.escape", "@popall"],
      [/\\$/, "string"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHl0aG9uLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL3B5dGhvbi9weXRob24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3JlRXhwb3J0ID0gKHRhcmdldCwgbW9kLCBzZWNvbmRUYXJnZXQpID0+IChfX2NvcHlQcm9wcyh0YXJnZXQsIG1vZCwgXCJkZWZhdWx0XCIpLCBzZWNvbmRUYXJnZXQgJiYgX19jb3B5UHJvcHMoc2Vjb25kVGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSk7XG5cbi8vIHNyYy9maWxsZXJzL21vbmFjby1lZGl0b3ItY29yZS50c1xudmFyIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzID0ge307XG5fX3JlRXhwb3J0KG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLCBtb25hY29fZWRpdG9yX2NvcmVfc3Rhcik7XG5pbXBvcnQgKiBhcyBtb25hY29fZWRpdG9yX2NvcmVfc3RhciBmcm9tIFwiLi4vLi4vZWRpdG9yL2VkaXRvci5hcGkuanNcIjtcblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy9weXRob24vcHl0aG9uLnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBsaW5lQ29tbWVudDogXCIjXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCInJydcIiwgXCInJydcIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJywgbm90SW46IFtcInN0cmluZ1wiXSB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfVxuICBdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF0sXG4gIG9uRW50ZXJSdWxlczogW1xuICAgIHtcbiAgICAgIGJlZm9yZVRleHQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqKD86ZGVmfGNsYXNzfGZvcnxpZnxlbGlmfGVsc2V8d2hpbGV8dHJ5fHdpdGh8ZmluYWxseXxleGNlcHR8YXN5bmN8bWF0Y2h8Y2FzZSkuKj86XFxcXHMqJFwiKSxcbiAgICAgIGFjdGlvbjogeyBpbmRlbnRBY3Rpb246IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5JbmRlbnRBY3Rpb24uSW5kZW50IH1cbiAgICB9XG4gIF0sXG4gIGZvbGRpbmc6IHtcbiAgICBvZmZTaWRlOiB0cnVlLFxuICAgIG1hcmtlcnM6IHtcbiAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKFwiXlxcXFxzKiNyZWdpb25cXFxcYlwiKSxcbiAgICAgIGVuZDogbmV3IFJlZ0V4cChcIl5cXFxccyojZW5kcmVnaW9uXFxcXGJcIilcbiAgICB9XG4gIH1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5weXRob25cIixcbiAga2V5d29yZHM6IFtcbiAgICBcIkZhbHNlXCIsXG4gICAgXCJOb25lXCIsXG4gICAgXCJUcnVlXCIsXG4gICAgXCJfXCIsXG4gICAgXCJhbmRcIixcbiAgICBcImFzXCIsXG4gICAgXCJhc3NlcnRcIixcbiAgICBcImFzeW5jXCIsXG4gICAgXCJhd2FpdFwiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImNhc2VcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJjb250aW51ZVwiLFxuICAgIFwiZGVmXCIsXG4gICAgXCJkZWxcIixcbiAgICBcImVsaWZcIixcbiAgICBcImVsc2VcIixcbiAgICBcImV4Y2VwdFwiLFxuICAgIFwiZXhlY1wiLFxuICAgIFwiZmluYWxseVwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJmcm9tXCIsXG4gICAgXCJnbG9iYWxcIixcbiAgICBcImlmXCIsXG4gICAgXCJpbXBvcnRcIixcbiAgICBcImluXCIsXG4gICAgXCJpc1wiLFxuICAgIFwibGFtYmRhXCIsXG4gICAgXCJtYXRjaFwiLFxuICAgIFwibm9ubG9jYWxcIixcbiAgICBcIm5vdFwiLFxuICAgIFwib3JcIixcbiAgICBcInBhc3NcIixcbiAgICBcInByaW50XCIsXG4gICAgXCJyYWlzZVwiLFxuICAgIFwicmV0dXJuXCIsXG4gICAgXCJ0cnlcIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJ3aXRoXCIsXG4gICAgXCJ5aWVsZFwiLFxuICAgIFwiaW50XCIsXG4gICAgXCJmbG9hdFwiLFxuICAgIFwibG9uZ1wiLFxuICAgIFwiY29tcGxleFwiLFxuICAgIFwiaGV4XCIsXG4gICAgXCJhYnNcIixcbiAgICBcImFsbFwiLFxuICAgIFwiYW55XCIsXG4gICAgXCJhcHBseVwiLFxuICAgIFwiYmFzZXN0cmluZ1wiLFxuICAgIFwiYmluXCIsXG4gICAgXCJib29sXCIsXG4gICAgXCJidWZmZXJcIixcbiAgICBcImJ5dGVhcnJheVwiLFxuICAgIFwiY2FsbGFibGVcIixcbiAgICBcImNoclwiLFxuICAgIFwiY2xhc3NtZXRob2RcIixcbiAgICBcImNtcFwiLFxuICAgIFwiY29lcmNlXCIsXG4gICAgXCJjb21waWxlXCIsXG4gICAgXCJjb21wbGV4XCIsXG4gICAgXCJkZWxhdHRyXCIsXG4gICAgXCJkaWN0XCIsXG4gICAgXCJkaXJcIixcbiAgICBcImRpdm1vZFwiLFxuICAgIFwiZW51bWVyYXRlXCIsXG4gICAgXCJldmFsXCIsXG4gICAgXCJleGVjZmlsZVwiLFxuICAgIFwiZmlsZVwiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJmb3JtYXRcIixcbiAgICBcImZyb3plbnNldFwiLFxuICAgIFwiZ2V0YXR0clwiLFxuICAgIFwiZ2xvYmFsc1wiLFxuICAgIFwiaGFzYXR0clwiLFxuICAgIFwiaGFzaFwiLFxuICAgIFwiaGVscFwiLFxuICAgIFwiaWRcIixcbiAgICBcImlucHV0XCIsXG4gICAgXCJpbnRlcm5cIixcbiAgICBcImlzaW5zdGFuY2VcIixcbiAgICBcImlzc3ViY2xhc3NcIixcbiAgICBcIml0ZXJcIixcbiAgICBcImxlblwiLFxuICAgIFwibG9jYWxzXCIsXG4gICAgXCJsaXN0XCIsXG4gICAgXCJtYXBcIixcbiAgICBcIm1heFwiLFxuICAgIFwibWVtb3J5dmlld1wiLFxuICAgIFwibWluXCIsXG4gICAgXCJuZXh0XCIsXG4gICAgXCJvYmplY3RcIixcbiAgICBcIm9jdFwiLFxuICAgIFwib3BlblwiLFxuICAgIFwib3JkXCIsXG4gICAgXCJwb3dcIixcbiAgICBcInByaW50XCIsXG4gICAgXCJwcm9wZXJ0eVwiLFxuICAgIFwicmV2ZXJzZWRcIixcbiAgICBcInJhbmdlXCIsXG4gICAgXCJyYXdfaW5wdXRcIixcbiAgICBcInJlZHVjZVwiLFxuICAgIFwicmVsb2FkXCIsXG4gICAgXCJyZXByXCIsXG4gICAgXCJyZXZlcnNlZFwiLFxuICAgIFwicm91bmRcIixcbiAgICBcInNlbGZcIixcbiAgICBcInNldFwiLFxuICAgIFwic2V0YXR0clwiLFxuICAgIFwic2xpY2VcIixcbiAgICBcInNvcnRlZFwiLFxuICAgIFwic3RhdGljbWV0aG9kXCIsXG4gICAgXCJzdHJcIixcbiAgICBcInN1bVwiLFxuICAgIFwic3VwZXJcIixcbiAgICBcInR1cGxlXCIsXG4gICAgXCJ0eXBlXCIsXG4gICAgXCJ1bmljaHJcIixcbiAgICBcInVuaWNvZGVcIixcbiAgICBcInZhcnNcIixcbiAgICBcInhyYW5nZVwiLFxuICAgIFwiemlwXCIsXG4gICAgXCJfX2RpY3RfX1wiLFxuICAgIFwiX19tZXRob2RzX19cIixcbiAgICBcIl9fbWVtYmVyc19fXCIsXG4gICAgXCJfX2NsYXNzX19cIixcbiAgICBcIl9fYmFzZXNfX1wiLFxuICAgIFwiX19uYW1lX19cIixcbiAgICBcIl9fbXJvX19cIixcbiAgICBcIl9fc3ViY2xhc3Nlc19fXCIsXG4gICAgXCJfX2luaXRfX1wiLFxuICAgIFwiX19pbXBvcnRfX1wiXG4gIF0sXG4gIGJyYWNrZXRzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuY3VybHlcIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXRcIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfVxuICBdLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBudW1iZXJzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAc3RyaW5nc1wiIH0sXG4gICAgICBbL1ssOjtdLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1t7fVxcW1xcXSgpXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9AW2EtekEtWl9dXFx3Ki8sIFwidGFnXCJdLFxuICAgICAgW1xuICAgICAgICAvW2EtekEtWl9dXFx3Ki8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1xccysvLCBcIndoaXRlXCJdLFxuICAgICAgWy8oXiMuKiQpLywgXCJjb21tZW50XCJdLFxuICAgICAgWy8nJycvLCBcInN0cmluZ1wiLCBcIkBlbmREb2NTdHJpbmdcIl0sXG4gICAgICBbL1wiXCJcIi8sIFwic3RyaW5nXCIsIFwiQGVuZERibERvY1N0cmluZ1wiXVxuICAgIF0sXG4gICAgZW5kRG9jU3RyaW5nOiBbXG4gICAgICBbL1teJ10rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL1xcXFwnLywgXCJzdHJpbmdcIl0sXG4gICAgICBbLycnJy8sIFwic3RyaW5nXCIsIFwiQHBvcGFsbFwiXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nXCJdXG4gICAgXSxcbiAgICBlbmREYmxEb2NTdHJpbmc6IFtcbiAgICAgIFsvW15cIl0rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL1xcXFxcIi8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9cIlwiXCIvLCBcInN0cmluZ1wiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIl1cbiAgICBdLFxuICAgIG51bWJlcnM6IFtcbiAgICAgIFsvLT8weChbYWJjZGVmXXxbQUJDREVGXXxcXGQpK1tsTF0/LywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgWy8tPyhcXGQqXFwuKT9cXGQrKFtlRV1bK1xcLV0/XFxkKyk/W2pKXT9bbExdPy8sIFwibnVtYmVyXCJdXG4gICAgXSxcbiAgICBzdHJpbmdzOiBbXG4gICAgICBbLyckLywgXCJzdHJpbmcuZXNjYXBlXCIsIFwiQHBvcGFsbFwiXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nLmVzY2FwZVwiLCBcIkBzdHJpbmdCb2R5XCJdLFxuICAgICAgWy9cIiQvLCBcInN0cmluZy5lc2NhcGVcIiwgXCJAcG9wYWxsXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nLmVzY2FwZVwiLCBcIkBkYmxTdHJpbmdCb2R5XCJdXG4gICAgXSxcbiAgICBzdHJpbmdCb2R5OiBbXG4gICAgICBbL1teXFxcXCddKyQvLCBcInN0cmluZ1wiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbL1teXFxcXCddKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nXCJdLFxuICAgICAgWy8nLywgXCJzdHJpbmcuZXNjYXBlXCIsIFwiQHBvcGFsbFwiXSxcbiAgICAgIFsvXFxcXCQvLCBcInN0cmluZ1wiXVxuICAgIF0sXG4gICAgZGJsU3RyaW5nQm9keTogW1xuICAgICAgWy9bXlxcXFxcIl0rJC8sIFwic3RyaW5nXCIsIFwiQHBvcGFsbFwiXSxcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nLmVzY2FwZVwiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbL1xcXFwkLywgXCJzdHJpbmdcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT0EsSUFBSSxZQUFZLE9BQU87QUFDdkIsSUFBSSxtQkFBbUIsT0FBTztBQUM5QixJQUFJLG9CQUFvQixPQUFPO0FBQy9CLElBQUksZUFBZSxPQUFPLFVBQVU7QUFDcEMsSUFBSSxjQUFjLENBQUMsSUFBSSxNQUFNLFFBQVEsU0FBUztBQUM1QyxNQUFJLFFBQVEsT0FBTyxTQUFTLFlBQVksT0FBTyxTQUFTLFlBQVk7QUFDbEUsYUFBUyxPQUFPLGtCQUFrQixJQUFJO0FBQ3BDLFVBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxHQUFHLEtBQUssUUFBUTtBQUN6QyxrQkFBVSxJQUFJ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QUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxVQUFVO0FBQUEsSUFDUixFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxrQkFBbUI7QUFBQSxJQUNuRCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxvQkFBcUI7QUFBQSxJQUNyRCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyx3QkFBeUI7QUFBQSxFQUMxRDtBQUFBLEVBQ0QsV0FBVztBQUFBLElBQ1QsTUFBTTtBQUFBLE1BQ0osRUFBRSxTQUFTLGNBQWU7QUFBQSxNQUMxQixFQUFFLFNBQVMsV0FBWTtBQUFBLE1BQ3ZCLEVBQUUsU0FBUyxXQUFZO0FBQUEsTUFDdkIsQ0FBQyxTQUFTLFdBQVc7QUFBQSxNQUNyQixDQUFDLGNBQWMsV0FBVztBQUFBLE1BQzFCLENBQUMsaUJBQWlCLEtBQUs7QUFBQSxNQUN2QjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxhQUFhO0FBQUEsWUFDYixZQUFZO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0QsWUFBWTtBQUFBLE1BQ1YsQ0FBQyxPQUFPLE9BQU87QUFBQSxNQUNmLENBQUMsV0FBVyxTQUFTO0FBQUEsTUFDckIsQ0FBQyxPQUFPLFVBQVUsZUFBZTtBQUFBLE1BQ2pDLENBQUMsT0FBTyxVQUFVLGtCQUFrQjtBQUFBLElBQ3JDO0FBQUEsSUFDRCxjQUFjO0FBQUEsTUFDWixDQUFDLFNBQVMsUUFBUTtBQUFBLE1BQ2xCLENBQUMsT0FBTyxRQUFRO0FBQUEsTUFDaEIsQ0FBQyxPQUFPLFVBQVUsU0FBUztBQUFBLE1BQzNCLENBQUMsS0FBSyxRQUFRO0FBQUEsSUFDZjtBQUFBLElBQ0QsaUJBQWlCO0FBQUEsTUFDZixDQUFDLFNBQVMsUUFBUTtBQUFBLE1BQ2xCLENBQUMsT0FBTyxRQUFRO0FBQUEsTUFDaEIsQ0FBQyxPQUFPLFVBQVUsU0FBUztBQUFBLE1BQzNCLENBQUMsS0FBSyxRQUFRO0FBQUEsSUFDZjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxvQ0FBb0MsWUFBWTtBQUFBLE1BQ2pELENBQUMsMkNBQTJDLFFBQVE7QUFBQSxJQUNyRDtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxNQUFNLGlCQUFpQixTQUFTO0FBQUEsTUFDakMsQ0FBQyxLQUFLLGlCQUFpQixhQUFhO0FBQUEsTUFDcEMsQ0FBQyxNQUFNLGlCQUFpQixTQUFTO0FBQUEsTUFDakMsQ0FBQyxLQUFLLGlCQUFpQixnQkFBZ0I7QUFBQSxJQUN4QztBQUFBLElBQ0QsWUFBWTtBQUFBLE1BQ1YsQ0FBQyxZQUFZLFVBQVUsU0FBUztBQUFBLE1BQ2hDLENBQUMsV0FBVyxRQUFRO0FBQUEsTUFDcEIsQ0FBQyxPQUFPLFFBQVE7QUFBQSxNQUNoQixDQUFDLEtBQUssaUJBQWlCLFNBQVM7QUFBQSxNQUNoQyxDQUFDLE9BQU8sUUFBUTtBQUFBLElBQ2pCO0FBQUEsSUFDRCxlQUFlO0FBQUEsTUFDYixDQUFDLFlBQVksVUFBVSxTQUFTO0FBQUEsTUFDaEMsQ0FBQyxXQUFXLFFBQVE7QUFBQSxNQUNwQixDQUFDLE9BQU8sUUFBUTtBQUFBLE1BQ2hCLENBQUMsS0FBSyxpQkFBaUIsU0FBUztBQUFBLE1BQ2hDLENBQUMsT0FBTyxRQUFRO0FBQUEsSUFDakI7QUFBQSxFQUNGO0FBQ0g7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
