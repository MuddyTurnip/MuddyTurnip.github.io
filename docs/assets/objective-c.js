/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
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
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".objective-c",
  keywords: [
    "#import",
    "#include",
    "#define",
    "#else",
    "#endif",
    "#if",
    "#ifdef",
    "#ifndef",
    "#ident",
    "#undef",
    "@class",
    "@defs",
    "@dynamic",
    "@encode",
    "@end",
    "@implementation",
    "@interface",
    "@package",
    "@private",
    "@protected",
    "@property",
    "@protocol",
    "@public",
    "@selector",
    "@synthesize",
    "__declspec",
    "assign",
    "auto",
    "BOOL",
    "break",
    "bycopy",
    "byref",
    "case",
    "char",
    "Class",
    "const",
    "copy",
    "continue",
    "default",
    "do",
    "double",
    "else",
    "enum",
    "extern",
    "FALSE",
    "false",
    "float",
    "for",
    "goto",
    "if",
    "in",
    "int",
    "id",
    "inout",
    "IMP",
    "long",
    "nil",
    "nonatomic",
    "NULL",
    "oneway",
    "out",
    "private",
    "public",
    "protected",
    "readwrite",
    "readonly",
    "register",
    "return",
    "SEL",
    "self",
    "short",
    "signed",
    "sizeof",
    "static",
    "struct",
    "super",
    "switch",
    "typedef",
    "TRUE",
    "true",
    "union",
    "unsigned",
    "volatile",
    "void",
    "while"
  ],
  decpart: /\d(_?\d)*/,
  decimal: /0|@decpart/,
  tokenizer: {
    root: [
      { include: "@comments" },
      { include: "@whitespace" },
      { include: "@numbers" },
      { include: "@strings" },
      [/[,:;]/, "delimiter"],
      [/[{}\[\]()<>]/, "@brackets"],
      [
        /[a-zA-Z@#]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ],
      [/[<>=\\+\\-\\*\\/\\^\\|\\~,]|and\\b|or\\b|not\\b]/, "operator"]
    ],
    whitespace: [[/\s+/, "white"]],
    comments: [
      ["\\/\\*", "comment", "@comment"],
      ["\\/\\/+.*", "comment"]
    ],
    comment: [
      ["\\*\\/", "comment", "@pop"],
      [".", "comment"]
    ],
    numbers: [
      [/0[xX][0-9a-fA-F]*(_?[0-9a-fA-F])*/, "number.hex"],
      [
        /@decimal((\.@decpart)?([eE][\-+]?@decpart)?)[fF]*/,
        {
          cases: {
            "(\\d)*": "number",
            $0: "number.float"
          }
        }
      ]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0aXZlLWMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvb2JqZWN0aXZlLWMvb2JqZWN0aXZlLWMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL29iamVjdGl2ZS1jL29iamVjdGl2ZS1jLnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBsaW5lQ29tbWVudDogXCIvL1wiLFxuICAgIGJsb2NrQ29tbWVudDogW1wiLypcIiwgXCIqL1wiXVxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdXG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCIub2JqZWN0aXZlLWNcIixcbiAga2V5d29yZHM6IFtcbiAgICBcIiNpbXBvcnRcIixcbiAgICBcIiNpbmNsdWRlXCIsXG4gICAgXCIjZGVmaW5lXCIsXG4gICAgXCIjZWxzZVwiLFxuICAgIFwiI2VuZGlmXCIsXG4gICAgXCIjaWZcIixcbiAgICBcIiNpZmRlZlwiLFxuICAgIFwiI2lmbmRlZlwiLFxuICAgIFwiI2lkZW50XCIsXG4gICAgXCIjdW5kZWZcIixcbiAgICBcIkBjbGFzc1wiLFxuICAgIFwiQGRlZnNcIixcbiAgICBcIkBkeW5hbWljXCIsXG4gICAgXCJAZW5jb2RlXCIsXG4gICAgXCJAZW5kXCIsXG4gICAgXCJAaW1wbGVtZW50YXRpb25cIixcbiAgICBcIkBpbnRlcmZhY2VcIixcbiAgICBcIkBwYWNrYWdlXCIsXG4gICAgXCJAcHJpdmF0ZVwiLFxuICAgIFwiQHByb3RlY3RlZFwiLFxuICAgIFwiQHByb3BlcnR5XCIsXG4gICAgXCJAcHJvdG9jb2xcIixcbiAgICBcIkBwdWJsaWNcIixcbiAgICBcIkBzZWxlY3RvclwiLFxuICAgIFwiQHN5bnRoZXNpemVcIixcbiAgICBcIl9fZGVjbHNwZWNcIixcbiAgICBcImFzc2lnblwiLFxuICAgIFwiYXV0b1wiLFxuICAgIFwiQk9PTFwiLFxuICAgIFwiYnJlYWtcIixcbiAgICBcImJ5Y29weVwiLFxuICAgIFwiYnlyZWZcIixcbiAgICBcImNhc2VcIixcbiAgICBcImNoYXJcIixcbiAgICBcIkNsYXNzXCIsXG4gICAgXCJjb25zdFwiLFxuICAgIFwiY29weVwiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcImRvXCIsXG4gICAgXCJkb3VibGVcIixcbiAgICBcImVsc2VcIixcbiAgICBcImVudW1cIixcbiAgICBcImV4dGVyblwiLFxuICAgIFwiRkFMU0VcIixcbiAgICBcImZhbHNlXCIsXG4gICAgXCJmbG9hdFwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJnb3RvXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW5cIixcbiAgICBcImludFwiLFxuICAgIFwiaWRcIixcbiAgICBcImlub3V0XCIsXG4gICAgXCJJTVBcIixcbiAgICBcImxvbmdcIixcbiAgICBcIm5pbFwiLFxuICAgIFwibm9uYXRvbWljXCIsXG4gICAgXCJOVUxMXCIsXG4gICAgXCJvbmV3YXlcIixcbiAgICBcIm91dFwiLFxuICAgIFwicHJpdmF0ZVwiLFxuICAgIFwicHVibGljXCIsXG4gICAgXCJwcm90ZWN0ZWRcIixcbiAgICBcInJlYWR3cml0ZVwiLFxuICAgIFwicmVhZG9ubHlcIixcbiAgICBcInJlZ2lzdGVyXCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcIlNFTFwiLFxuICAgIFwic2VsZlwiLFxuICAgIFwic2hvcnRcIixcbiAgICBcInNpZ25lZFwiLFxuICAgIFwic2l6ZW9mXCIsXG4gICAgXCJzdGF0aWNcIixcbiAgICBcInN0cnVjdFwiLFxuICAgIFwic3VwZXJcIixcbiAgICBcInN3aXRjaFwiLFxuICAgIFwidHlwZWRlZlwiLFxuICAgIFwiVFJVRVwiLFxuICAgIFwidHJ1ZVwiLFxuICAgIFwidW5pb25cIixcbiAgICBcInVuc2lnbmVkXCIsXG4gICAgXCJ2b2xhdGlsZVwiLFxuICAgIFwidm9pZFwiLFxuICAgIFwid2hpbGVcIlxuICBdLFxuICBkZWNwYXJ0OiAvXFxkKF8/XFxkKSovLFxuICBkZWNpbWFsOiAvMHxAZGVjcGFydC8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAY29tbWVudHNcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAbnVtYmVyc1wiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ3NcIiB9LFxuICAgICAgWy9bLDo7XS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9be31cXFtcXF0oKTw+XS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgW1xuICAgICAgICAvW2EtekEtWkAjXVxcdyovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWzw+PVxcXFwrXFxcXC1cXFxcKlxcXFwvXFxcXF5cXFxcfFxcXFx+LF18YW5kXFxcXGJ8b3JcXFxcYnxub3RcXFxcYl0vLCBcIm9wZXJhdG9yXCJdXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbWy9cXHMrLywgXCJ3aGl0ZVwiXV0sXG4gICAgY29tbWVudHM6IFtcbiAgICAgIFtcIlxcXFwvXFxcXCpcIiwgXCJjb21tZW50XCIsIFwiQGNvbW1lbnRcIl0sXG4gICAgICBbXCJcXFxcL1xcXFwvKy4qXCIsIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgW1wiXFxcXCpcXFxcL1wiLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgW1wiLlwiLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIG51bWJlcnM6IFtcbiAgICAgIFsvMFt4WF1bMC05YS1mQS1GXSooXz9bMC05YS1mQS1GXSkqLywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgW1xuICAgICAgICAvQGRlY2ltYWwoKFxcLkBkZWNwYXJ0KT8oW2VFXVtcXC0rXT9AZGVjcGFydCk/KVtmRl0qLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIihcXFxcZCkqXCI6IFwibnVtYmVyXCIsXG4gICAgICAgICAgICAkMDogXCJudW1iZXIuZmxvYXRcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIF0sXG4gICAgc3RyaW5nczogW1xuICAgICAgWy8nJC8sIFwic3RyaW5nLmVzY2FwZVwiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbLycvLCBcInN0cmluZy5lc2NhcGVcIiwgXCJAc3RyaW5nQm9keVwiXSxcbiAgICAgIFsvXCIkLywgXCJzdHJpbmcuZXNjYXBlXCIsIFwiQHBvcGFsbFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZy5lc2NhcGVcIiwgXCJAZGJsU3RyaW5nQm9keVwiXVxuICAgIF0sXG4gICAgc3RyaW5nQm9keTogW1xuICAgICAgWy9bXlxcXFwnXSskLywgXCJzdHJpbmdcIiwgXCJAcG9wYWxsXCJdLFxuICAgICAgWy9bXlxcXFwnXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nLmVzY2FwZVwiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbL1xcXFwkLywgXCJzdHJpbmdcIl1cbiAgICBdLFxuICAgIGRibFN0cmluZ0JvZHk6IFtcbiAgICAgIFsvW15cXFxcXCJdKyQvLCBcInN0cmluZ1wiLCBcIkBwb3BhbGxcIl0sXG4gICAgICBbL1teXFxcXFwiXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZy5lc2NhcGVcIiwgXCJAcG9wYWxsXCJdLFxuICAgICAgWy9cXFxcJC8sIFwic3RyaW5nXCJdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUcsSUFBQyxPQUFPO0FBQUEsRUFDVCxVQUFVO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixjQUFjLENBQUMsTUFBTSxJQUFJO0FBQUEsRUFDMUI7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxFQUNWO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsVUFBVTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxTQUFTO0FBQUEsRUFDVCxTQUFTO0FBQUEsRUFDVCxXQUFXO0FBQUEsSUFDVCxNQUFNO0FBQUEsTUFDSixFQUFFLFNBQVMsWUFBYTtBQUFBLE1BQ3hCLEVBQUUsU0FBUyxjQUFlO0FBQUEsTUFDMUIsRUFBRSxTQUFTLFdBQVk7QUFBQSxNQUN2QixFQUFFLFNBQVMsV0FBWTtBQUFBLE1BQ3ZCLENBQUMsU0FBUyxXQUFXO0FBQUEsTUFDckIsQ0FBQyxnQkFBZ0IsV0FBVztBQUFBLE1BQzVCO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE9BQU87QUFBQSxZQUNMLGFBQWE7QUFBQSxZQUNiLFlBQVk7QUFBQSxVQUNiO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNELENBQUMsb0RBQW9ELFVBQVU7QUFBQSxJQUNoRTtBQUFBLElBQ0QsWUFBWSxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUM7QUFBQSxJQUM3QixVQUFVO0FBQUEsTUFDUixDQUFDLFVBQVUsV0FBVyxVQUFVO0FBQUEsTUFDaEMsQ0FBQyxhQUFhLFNBQVM7QUFBQSxJQUN4QjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxVQUFVLFdBQVcsTUFBTTtBQUFBLE1BQzVCLENBQUMsS0FBSyxTQUFTO0FBQUEsSUFDaEI7QUFBQSxJQUNELFNBQVM7QUFBQSxNQUNQLENBQUMscUNBQXFDLFlBQVk7QUFBQSxNQUNsRDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxVQUFVO0FBQUEsWUFDVixJQUFJO0FBQUEsVUFDTDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxNQUFNLGlCQUFpQixTQUFTO0FBQUEsTUFDakMsQ0FBQyxLQUFLLGlCQUFpQixhQUFhO0FBQUEsTUFDcEMsQ0FBQyxNQUFNLGlCQUFpQixTQUFTO0FBQUEsTUFDakMsQ0FBQyxLQUFLLGlCQUFpQixnQkFBZ0I7QUFBQSxJQUN4QztBQUFBLElBQ0QsWUFBWTtBQUFBLE1BQ1YsQ0FBQyxZQUFZLFVBQVUsU0FBUztBQUFBLE1BQ2hDLENBQUMsV0FBVyxRQUFRO0FBQUEsTUFDcEIsQ0FBQyxPQUFPLFFBQVE7QUFBQSxNQUNoQixDQUFDLEtBQUssaUJBQWlCLFNBQVM7QUFBQSxNQUNoQyxDQUFDLE9BQU8sUUFBUTtBQUFBLElBQ2pCO0FBQUEsSUFDRCxlQUFlO0FBQUEsTUFDYixDQUFDLFlBQVksVUFBVSxTQUFTO0FBQUEsTUFDaEMsQ0FBQyxXQUFXLFFBQVE7QUFBQSxNQUNwQixDQUFDLE9BQU8sUUFBUTtBQUFBLE1BQ2hCLENBQUMsS0FBSyxpQkFBaUIsU0FBUztBQUFBLE1BQ2hDLENBQUMsT0FBTyxRQUFRO0FBQUEsSUFDakI7QUFBQSxFQUNGO0FBQ0g7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
