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
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  onEnterRules: [
    {
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      afterText: /^\s*\*\/$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent,
        appendText: " * "
      }
    },
    {
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        appendText: " * "
      }
    },
    {
      beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        appendText: "* "
      }
    },
    {
      beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        removeText: 1
      }
    }
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: "`", close: "`", notIn: ["string", "comment"] },
    { open: "/**", close: " */", notIn: ["string"] }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*//\\s*#?region\\b"),
      end: new RegExp("^\\s*//\\s*#?endregion\\b")
    }
  }
};
var language = {
  defaultToken: "invalid",
  tokenPostfix: ".ts",
  keywords: [
    "abstract",
    "any",
    "as",
    "asserts",
    "bigint",
    "boolean",
    "break",
    "case",
    "catch",
    "class",
    "continue",
    "const",
    "constructor",
    "debugger",
    "declare",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "get",
    "if",
    "implements",
    "import",
    "in",
    "infer",
    "instanceof",
    "interface",
    "is",
    "keyof",
    "let",
    "module",
    "namespace",
    "never",
    "new",
    "null",
    "number",
    "object",
    "out",
    "package",
    "private",
    "protected",
    "public",
    "override",
    "readonly",
    "require",
    "global",
    "return",
    "satisfies",
    "set",
    "static",
    "string",
    "super",
    "switch",
    "symbol",
    "this",
    "throw",
    "true",
    "try",
    "type",
    "typeof",
    "undefined",
    "unique",
    "unknown",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "async",
    "await",
    "of"
  ],
  operators: [
    "<=",
    ">=",
    "==",
    "!=",
    "===",
    "!==",
    "=>",
    "+",
    "-",
    "**",
    "*",
    "/",
    "%",
    "++",
    "--",
    "<<",
    "</",
    ">>",
    ">>>",
    "&",
    "|",
    "^",
    "!",
    "~",
    "&&",
    "||",
    "??",
    "?",
    ":",
    "=",
    "+=",
    "-=",
    "*=",
    "**=",
    "/=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "@"
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
  tokenizer: {
    root: [[/[{}]/, "delimiter.bracket"], { include: "common" }],
    common: [
      [
        /#?[a-z_$][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ],
      [/[A-Z][\w\$]*/, "type.identifier"],
      { include: "@whitespace" },
      [
        /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
        { token: "regexp", bracket: "@open", next: "@regexp" }
      ],
      [/[()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/!(?=([^=]|$))/, "delimiter"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": ""
          }
        }
      ],
      [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
      [/0[xX](@hexdigits)n?/, "number.hex"],
      [/0[oO]?(@octaldigits)n?/, "number.octal"],
      [/0[bB](@binarydigits)n?/, "number.binary"],
      [/(@digits)n?/, "number"],
      [/[;,.]/, "delimiter"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/`/, "string", "@string_backtick"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    jsdoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"]
    ],
    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        ["regexp.escape.control", "regexp.escape.control", "regexp.escape.control"]
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        ["regexp.escape.control", { token: "regexp.escape.control", next: "@regexrange" }]
      ],
      [/(\()(\?:|\?=|\?!)/, ["regexp.escape.control", "regexp.escape.control"]],
      [/[()]/, "regexp.escape.control"],
      [/@regexpctl/, "regexp.escape.control"],
      [/[^\\\/]/, "regexp"],
      [/@regexpesc/, "regexp.escape"],
      [/\\\./, "regexp.invalid"],
      [/(\/)([dgimsuy]*)/, [{ token: "regexp", bracket: "@close", next: "@pop" }, "keyword.other"]]
    ],
    regexrange: [
      [/-/, "regexp.escape.control"],
      [/\^/, "regexp.invalid"],
      [/@regexpesc/, "regexp.escape"],
      [/[^\]]/, "regexp"],
      [
        /\]/,
        {
          token: "regexp.escape.control",
          next: "@pop",
          bracket: "@close"
        }
      ]
    ],
    string_double: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ],
    string_single: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"]
    ],
    string_backtick: [
      [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
      [/[^\\`$]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/`/, "string", "@pop"]
    ],
    bracketCounting: [
      [/\{/, "delimiter.bracket", "@bracketCounting"],
      [/\}/, "delimiter.bracket", "@pop"],
      { include: "common" }
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy90eXBlc2NyaXB0L3R5cGVzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3JlRXhwb3J0ID0gKHRhcmdldCwgbW9kLCBzZWNvbmRUYXJnZXQpID0+IChfX2NvcHlQcm9wcyh0YXJnZXQsIG1vZCwgXCJkZWZhdWx0XCIpLCBzZWNvbmRUYXJnZXQgJiYgX19jb3B5UHJvcHMoc2Vjb25kVGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSk7XG5cbi8vIHNyYy9maWxsZXJzL21vbmFjby1lZGl0b3ItY29yZS50c1xudmFyIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzID0ge307XG5fX3JlRXhwb3J0KG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLCBtb25hY29fZWRpdG9yX2NvcmVfc3Rhcik7XG5pbXBvcnQgKiBhcyBtb25hY29fZWRpdG9yX2NvcmVfc3RhciBmcm9tIFwiLi4vLi4vZWRpdG9yL2VkaXRvci5hcGkuanNcIjtcblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy90eXBlc2NyaXB0L3R5cGVzY3JpcHQudHNcbnZhciBjb25mID0ge1xuICB3b3JkUGF0dGVybjogLygtP1xcZCpcXC5cXGRcXHcqKXwoW15cXGBcXH5cXCFcXEBcXCNcXCVcXF5cXCZcXCpcXChcXClcXC1cXD1cXCtcXFtcXHtcXF1cXH1cXFxcXFx8XFw7XFw6XFwnXFxcIlxcLFxcLlxcPFxcPlxcL1xcP1xcc10rKS9nLFxuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi8vXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCIvKlwiLCBcIiovXCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgb25FbnRlclJ1bGVzOiBbXG4gICAge1xuICAgICAgYmVmb3JlVGV4dDogL15cXHMqXFwvXFwqXFwqKD8hXFwvKShbXlxcKl18XFwqKD8hXFwvKSkqJC8sXG4gICAgICBhZnRlclRleHQ6IC9eXFxzKlxcKlxcLyQvLFxuICAgICAgYWN0aW9uOiB7XG4gICAgICAgIGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5JbmRlbnRPdXRkZW50LFxuICAgICAgICBhcHBlbmRUZXh0OiBcIiAqIFwiXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBiZWZvcmVUZXh0OiAvXlxccypcXC9cXCpcXCooPyFcXC8pKFteXFwqXXxcXCooPyFcXC8pKSokLyxcbiAgICAgIGFjdGlvbjoge1xuICAgICAgICBpbmRlbnRBY3Rpb246IG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLmxhbmd1YWdlcy5JbmRlbnRBY3Rpb24uTm9uZSxcbiAgICAgICAgYXBwZW5kVGV4dDogXCIgKiBcIlxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgYmVmb3JlVGV4dDogL14oXFx0fChcXCBcXCApKSpcXCBcXCooXFwgKFteXFwqXXxcXCooPyFcXC8pKSopPyQvLFxuICAgICAgYWN0aW9uOiB7XG4gICAgICAgIGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5Ob25lLFxuICAgICAgICBhcHBlbmRUZXh0OiBcIiogXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGJlZm9yZVRleHQ6IC9eKFxcdHwoXFwgXFwgKSkqXFwgXFwqXFwvXFxzKiQvLFxuICAgICAgYWN0aW9uOiB7XG4gICAgICAgIGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5Ob25lLFxuICAgICAgICByZW1vdmVUZXh0OiAxXG4gICAgICB9XG4gICAgfVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJywgbm90SW46IFtcInN0cmluZ1wiXSB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46IFwiYFwiLCBjbG9zZTogXCJgXCIsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH0sXG4gICAgeyBvcGVuOiBcIi8qKlwiLCBjbG9zZTogXCIgKi9cIiwgbm90SW46IFtcInN0cmluZ1wiXSB9XG4gIF0sXG4gIGZvbGRpbmc6IHtcbiAgICBtYXJrZXJzOiB7XG4gICAgICBzdGFydDogbmV3IFJlZ0V4cChcIl5cXFxccyovL1xcXFxzKiM/cmVnaW9uXFxcXGJcIiksXG4gICAgICBlbmQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqLy9cXFxccyojP2VuZHJlZ2lvblxcXFxiXCIpXG4gICAgfVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiaW52YWxpZFwiLFxuICB0b2tlblBvc3RmaXg6IFwiLnRzXCIsXG4gIGtleXdvcmRzOiBbXG4gICAgXCJhYnN0cmFjdFwiLFxuICAgIFwiYW55XCIsXG4gICAgXCJhc1wiLFxuICAgIFwiYXNzZXJ0c1wiLFxuICAgIFwiYmlnaW50XCIsXG4gICAgXCJib29sZWFuXCIsXG4gICAgXCJicmVha1wiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJjb250aW51ZVwiLFxuICAgIFwiY29uc3RcIixcbiAgICBcImNvbnN0cnVjdG9yXCIsXG4gICAgXCJkZWJ1Z2dlclwiLFxuICAgIFwiZGVjbGFyZVwiLFxuICAgIFwiZGVmYXVsdFwiLFxuICAgIFwiZGVsZXRlXCIsXG4gICAgXCJkb1wiLFxuICAgIFwiZWxzZVwiLFxuICAgIFwiZW51bVwiLFxuICAgIFwiZXhwb3J0XCIsXG4gICAgXCJleHRlbmRzXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwiZmluYWxseVwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJmcm9tXCIsXG4gICAgXCJmdW5jdGlvblwiLFxuICAgIFwiZ2V0XCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW1wbGVtZW50c1wiLFxuICAgIFwiaW1wb3J0XCIsXG4gICAgXCJpblwiLFxuICAgIFwiaW5mZXJcIixcbiAgICBcImluc3RhbmNlb2ZcIixcbiAgICBcImludGVyZmFjZVwiLFxuICAgIFwiaXNcIixcbiAgICBcImtleW9mXCIsXG4gICAgXCJsZXRcIixcbiAgICBcIm1vZHVsZVwiLFxuICAgIFwibmFtZXNwYWNlXCIsXG4gICAgXCJuZXZlclwiLFxuICAgIFwibmV3XCIsXG4gICAgXCJudWxsXCIsXG4gICAgXCJudW1iZXJcIixcbiAgICBcIm9iamVjdFwiLFxuICAgIFwib3V0XCIsXG4gICAgXCJwYWNrYWdlXCIsXG4gICAgXCJwcml2YXRlXCIsXG4gICAgXCJwcm90ZWN0ZWRcIixcbiAgICBcInB1YmxpY1wiLFxuICAgIFwib3ZlcnJpZGVcIixcbiAgICBcInJlYWRvbmx5XCIsXG4gICAgXCJyZXF1aXJlXCIsXG4gICAgXCJnbG9iYWxcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwic2F0aXNmaWVzXCIsXG4gICAgXCJzZXRcIixcbiAgICBcInN0YXRpY1wiLFxuICAgIFwic3RyaW5nXCIsXG4gICAgXCJzdXBlclwiLFxuICAgIFwic3dpdGNoXCIsXG4gICAgXCJzeW1ib2xcIixcbiAgICBcInRoaXNcIixcbiAgICBcInRocm93XCIsXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJ0cnlcIixcbiAgICBcInR5cGVcIixcbiAgICBcInR5cGVvZlwiLFxuICAgIFwidW5kZWZpbmVkXCIsXG4gICAgXCJ1bmlxdWVcIixcbiAgICBcInVua25vd25cIixcbiAgICBcInZhclwiLFxuICAgIFwidm9pZFwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcIndpdGhcIixcbiAgICBcInlpZWxkXCIsXG4gICAgXCJhc3luY1wiLFxuICAgIFwiYXdhaXRcIixcbiAgICBcIm9mXCJcbiAgXSxcbiAgb3BlcmF0b3JzOiBbXG4gICAgXCI8PVwiLFxuICAgIFwiPj1cIixcbiAgICBcIj09XCIsXG4gICAgXCIhPVwiLFxuICAgIFwiPT09XCIsXG4gICAgXCIhPT1cIixcbiAgICBcIj0+XCIsXG4gICAgXCIrXCIsXG4gICAgXCItXCIsXG4gICAgXCIqKlwiLFxuICAgIFwiKlwiLFxuICAgIFwiL1wiLFxuICAgIFwiJVwiLFxuICAgIFwiKytcIixcbiAgICBcIi0tXCIsXG4gICAgXCI8PFwiLFxuICAgIFwiPC9cIixcbiAgICBcIj4+XCIsXG4gICAgXCI+Pj5cIixcbiAgICBcIiZcIixcbiAgICBcInxcIixcbiAgICBcIl5cIixcbiAgICBcIiFcIixcbiAgICBcIn5cIixcbiAgICBcIiYmXCIsXG4gICAgXCJ8fFwiLFxuICAgIFwiPz9cIixcbiAgICBcIj9cIixcbiAgICBcIjpcIixcbiAgICBcIj1cIixcbiAgICBcIis9XCIsXG4gICAgXCItPVwiLFxuICAgIFwiKj1cIixcbiAgICBcIioqPVwiLFxuICAgIFwiLz1cIixcbiAgICBcIiU9XCIsXG4gICAgXCI8PD1cIixcbiAgICBcIj4+PVwiLFxuICAgIFwiPj4+PVwiLFxuICAgIFwiJj1cIixcbiAgICBcInw9XCIsXG4gICAgXCJePVwiLFxuICAgIFwiQFwiXG4gIF0sXG4gIHN5bWJvbHM6IC9bPT48IX4/OiZ8K1xcLSpcXC9cXF4lXSsvLFxuICBlc2NhcGVzOiAvXFxcXCg/OlthYmZucnR2XFxcXFwiJ118eFswLTlBLUZhLWZdezEsNH18dVswLTlBLUZhLWZdezR9fFVbMC05QS1GYS1mXXs4fSkvLFxuICBkaWdpdHM6IC9cXGQrKF8rXFxkKykqLyxcbiAgb2N0YWxkaWdpdHM6IC9bMC03XSsoXytbMC03XSspKi8sXG4gIGJpbmFyeWRpZ2l0czogL1swLTFdKyhfK1swLTFdKykqLyxcbiAgaGV4ZGlnaXRzOiAvW1swLTlhLWZBLUZdKyhfK1swLTlhLWZBLUZdKykqLyxcbiAgcmVnZXhwY3RsOiAvWygpe31cXFtcXF1cXCRcXF58XFwtKis/XFwuXS8sXG4gIHJlZ2V4cGVzYzogL1xcXFwoPzpbYkJkRGZucnN0dndXbjBcXFxcXFwvXXxAcmVnZXhwY3RsfGNbQS1aXXx4WzAtOWEtZkEtRl17Mn18dVswLTlhLWZBLUZdezR9KS8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtbL1t7fV0vLCBcImRlbGltaXRlci5icmFja2V0XCJdLCB7IGluY2x1ZGU6IFwiY29tbW9uXCIgfV0sXG4gICAgY29tbW9uOiBbXG4gICAgICBbXG4gICAgICAgIC8jP1thLXpfJF1bXFx3JF0qLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBrZXl3b3Jkc1wiOiBcImtleXdvcmRcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJpZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1tBLVpdW1xcd1xcJF0qLywgXCJ0eXBlLmlkZW50aWZpZXJcIl0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgW1xuICAgICAgICAvXFwvKD89KFteXFxcXFxcL118XFxcXC4pK1xcLyhbZGdpbXN1eV0qKShcXHMqKShcXC58O3wsfFxcKXxcXF18XFx9fCQpKS8sXG4gICAgICAgIHsgdG9rZW46IFwicmVnZXhwXCIsIGJyYWNrZXQ6IFwiQG9wZW5cIiwgbmV4dDogXCJAcmVnZXhwXCIgfVxuICAgICAgXSxcbiAgICAgIFsvWygpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9bPD5dKD8hQHN5bWJvbHMpLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbLyEoPz0oW149XXwkKSkvLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFtcbiAgICAgICAgL0BzeW1ib2xzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBvcGVyYXRvcnNcIjogXCJkZWxpbWl0ZXJcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvKEBkaWdpdHMpW2VFXShbXFwtK10/KEBkaWdpdHMpKT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvKEBkaWdpdHMpXFwuKEBkaWdpdHMpKFtlRV1bXFwtK10/KEBkaWdpdHMpKT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvMFt4WF0oQGhleGRpZ2l0cyluPy8sIFwibnVtYmVyLmhleFwiXSxcbiAgICAgIFsvMFtvT10/KEBvY3RhbGRpZ2l0cyluPy8sIFwibnVtYmVyLm9jdGFsXCJdLFxuICAgICAgWy8wW2JCXShAYmluYXJ5ZGlnaXRzKW4/LywgXCJudW1iZXIuYmluYXJ5XCJdLFxuICAgICAgWy8oQGRpZ2l0cyluPy8sIFwibnVtYmVyXCJdLFxuICAgICAgWy9bOywuXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cIihbXlwiXFxcXF18XFxcXC4pKiQvLCBcInN0cmluZy5pbnZhbGlkXCJdLFxuICAgICAgWy8nKFteJ1xcXFxdfFxcXFwuKSokLywgXCJzdHJpbmcuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiLCBcIkBzdHJpbmdfZG91YmxlXCJdLFxuICAgICAgWy8nLywgXCJzdHJpbmdcIiwgXCJAc3RyaW5nX3NpbmdsZVwiXSxcbiAgICAgIFsvYC8sIFwic3RyaW5nXCIsIFwiQHN0cmluZ19iYWNrdGlja1wiXVxuICAgIF0sXG4gICAgd2hpdGVzcGFjZTogW1xuICAgICAgWy9bIFxcdFxcclxcbl0rLywgXCJcIl0sXG4gICAgICBbL1xcL1xcKlxcKig/IVxcLykvLCBcImNvbW1lbnQuZG9jXCIsIFwiQGpzZG9jXCJdLFxuICAgICAgWy9cXC9cXCovLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwvLiokLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1teXFwvKl0rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXFwvKl0vLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIGpzZG9jOiBbXG4gICAgICBbL1teXFwvKl0rLywgXCJjb21tZW50LmRvY1wiXSxcbiAgICAgIFsvXFwqXFwvLywgXCJjb21tZW50LmRvY1wiLCBcIkBwb3BcIl0sXG4gICAgICBbL1tcXC8qXS8sIFwiY29tbWVudC5kb2NcIl1cbiAgICBdLFxuICAgIHJlZ2V4cDogW1xuICAgICAgW1xuICAgICAgICAvKFxceykoXFxkKyg/OixcXGQqKT8pKFxcfSkvLFxuICAgICAgICBbXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIiwgXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIiwgXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIl1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8oXFxbKShcXF4/KSg/PSg/OlteXFxdXFxcXFxcL118XFxcXC4pKykvLFxuICAgICAgICBbXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIiwgeyB0b2tlbjogXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIiwgbmV4dDogXCJAcmVnZXhyYW5nZVwiIH1dXG4gICAgICBdLFxuICAgICAgWy8oXFwoKShcXD86fFxcPz18XFw/ISkvLCBbXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIiwgXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIl1dLFxuICAgICAgWy9bKCldLywgXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIl0sXG4gICAgICBbL0ByZWdleHBjdGwvLCBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiXSxcbiAgICAgIFsvW15cXFxcXFwvXS8sIFwicmVnZXhwXCJdLFxuICAgICAgWy9AcmVnZXhwZXNjLywgXCJyZWdleHAuZXNjYXBlXCJdLFxuICAgICAgWy9cXFxcXFwuLywgXCJyZWdleHAuaW52YWxpZFwiXSxcbiAgICAgIFsvKFxcLykoW2RnaW1zdXldKikvLCBbeyB0b2tlbjogXCJyZWdleHBcIiwgYnJhY2tldDogXCJAY2xvc2VcIiwgbmV4dDogXCJAcG9wXCIgfSwgXCJrZXl3b3JkLm90aGVyXCJdXVxuICAgIF0sXG4gICAgcmVnZXhyYW5nZTogW1xuICAgICAgWy8tLywgXCJyZWdleHAuZXNjYXBlLmNvbnRyb2xcIl0sXG4gICAgICBbL1xcXi8sIFwicmVnZXhwLmludmFsaWRcIl0sXG4gICAgICBbL0ByZWdleHBlc2MvLCBcInJlZ2V4cC5lc2NhcGVcIl0sXG4gICAgICBbL1teXFxdXS8sIFwicmVnZXhwXCJdLFxuICAgICAgW1xuICAgICAgICAvXFxdLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcInJlZ2V4cC5lc2NhcGUuY29udHJvbFwiLFxuICAgICAgICAgIG5leHQ6IFwiQHBvcFwiLFxuICAgICAgICAgIGJyYWNrZXQ6IFwiQGNsb3NlXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIF0sXG4gICAgc3RyaW5nX2RvdWJsZTogW1xuICAgICAgWy9bXlxcXFxcIl0rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nXCIsIFwiQHBvcFwiXVxuICAgIF0sXG4gICAgc3RyaW5nX3NpbmdsZTogW1xuICAgICAgWy9bXlxcXFwnXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIl0sXG4gICAgICBbLycvLCBcInN0cmluZ1wiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIHN0cmluZ19iYWNrdGljazogW1xuICAgICAgWy9cXCRcXHsvLCB7IHRva2VuOiBcImRlbGltaXRlci5icmFja2V0XCIsIG5leHQ6IFwiQGJyYWNrZXRDb3VudGluZ1wiIH1dLFxuICAgICAgWy9bXlxcXFxgJF0rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgWy9gLywgXCJzdHJpbmdcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBicmFja2V0Q291bnRpbmc6IFtcbiAgICAgIFsvXFx7LywgXCJkZWxpbWl0ZXIuYnJhY2tldFwiLCBcIkBicmFja2V0Q291bnRpbmdcIl0sXG4gICAgICBbL1xcfS8sIFwiZGVsaW1pdGVyLmJyYWNrZXRcIiwgXCJAcG9wXCJdLFxuICAgICAgeyBpbmNsdWRlOiBcImNvbW1vblwiIH1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT0EsSUFBSSxZQUFZLE9BQU87QUFDdkIsSUFBSSxtQkFBbUIsT0FBTztBQUM5QixJQUFJLG9CQUFvQixPQUFPO0FBQy9CLElBQUksZUFBZSxPQUFPLFVBQVU7QUFDcEMsSUFBSSxjQUFjLENBQUMsSUFBSSxNQUFNLFFBQVEsU0FBUztBQUM1QyxNQUFJLFFBQVEsT0FBTyxTQUFTLFlBQVksT0FBTyxTQUFTLFlBQVk7QUFDbEUsYUFBUyxPQUFPLGtCQUFrQixJQUFJO0FBQ3BDLFVBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxH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QUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsV0FBVztBQUFBLElBQ1Q7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJ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
