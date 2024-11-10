/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
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
    { open: "'", close: "'", notIn: ["string"] },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".rq",
  brackets: [
    { token: "delimiter.curly", open: "{", close: "}" },
    { token: "delimiter.parenthesis", open: "(", close: ")" },
    { token: "delimiter.square", open: "[", close: "]" },
    { token: "delimiter.angle", open: "<", close: ">" }
  ],
  keywords: [
    "add",
    "as",
    "asc",
    "ask",
    "base",
    "by",
    "clear",
    "construct",
    "copy",
    "create",
    "data",
    "delete",
    "desc",
    "describe",
    "distinct",
    "drop",
    "false",
    "filter",
    "from",
    "graph",
    "group",
    "having",
    "in",
    "insert",
    "limit",
    "load",
    "minus",
    "move",
    "named",
    "not",
    "offset",
    "optional",
    "order",
    "prefix",
    "reduced",
    "select",
    "service",
    "silent",
    "to",
    "true",
    "undef",
    "union",
    "using",
    "values",
    "where",
    "with"
  ],
  builtinFunctions: [
    "a",
    "abs",
    "avg",
    "bind",
    "bnode",
    "bound",
    "ceil",
    "coalesce",
    "concat",
    "contains",
    "count",
    "datatype",
    "day",
    "encode_for_uri",
    "exists",
    "floor",
    "group_concat",
    "hours",
    "if",
    "iri",
    "isblank",
    "isiri",
    "isliteral",
    "isnumeric",
    "isuri",
    "lang",
    "langmatches",
    "lcase",
    "max",
    "md5",
    "min",
    "minutes",
    "month",
    "now",
    "rand",
    "regex",
    "replace",
    "round",
    "sameterm",
    "sample",
    "seconds",
    "sha1",
    "sha256",
    "sha384",
    "sha512",
    "str",
    "strafter",
    "strbefore",
    "strdt",
    "strends",
    "strlang",
    "strlen",
    "strstarts",
    "struuid",
    "substr",
    "sum",
    "timezone",
    "tz",
    "ucase",
    "uri",
    "uuid",
    "year"
  ],
  ignoreCase: true,
  tokenizer: {
    root: [
      [/<[^\s\u00a0>]*>?/, "tag"],
      { include: "@strings" },
      [/#.*/, "comment"],
      [/[{}()\[\]]/, "@brackets"],
      [/[;,.]/, "delimiter"],
      [/[_\w\d]+:(\.(?=[\w_\-\\%])|[:\w_-]|\\[-\\_~.!$&'()*+,;=/?#@%]|%[a-f\d][a-f\d])*/, "tag"],
      [/:(\.(?=[\w_\-\\%])|[:\w_-]|\\[-\\_~.!$&'()*+,;=/?#@%]|%[a-f\d][a-f\d])+/, "tag"],
      [
        /[$?]?[_\w\d]+/,
        {
          cases: {
            "@keywords": { token: "keyword" },
            "@builtinFunctions": { token: "predefined.sql" },
            "@default": "identifier"
          }
        }
      ],
      [/\^\^/, "operator.sql"],
      [/\^[*+\-<>=&|^\/!?]*/, "operator.sql"],
      [/[*+\-<>=&|\/!?]/, "operator.sql"],
      [/@[a-z\d\-]*/, "metatag.html"],
      [/\s+/, "white"]
    ],
    strings: [
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/'$/, "string.sql", "@pop"],
      [/'/, "string.sql", "@stringBody"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"$/, "string.sql", "@pop"],
      [/"/, "string.sql", "@dblStringBody"]
    ],
    stringBody: [
      [/[^\\']+/, "string.sql"],
      [/\\./, "string.escape"],
      [/'/, "string.sql", "@pop"]
    ],
    dblStringBody: [
      [/[^\\"]+/, "string.sql"],
      [/\\./, "string.escape"],
      [/"/, "string.sql", "@pop"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhcnFsLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL3NwYXJxbC9zcGFycWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3NwYXJxbC9zcGFycWwudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIiNcIlxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIsIG5vdEluOiBbXCJzdHJpbmdcIl0gfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInLCBub3RJbjogW1wic3RyaW5nXCJdIH0sXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH1cbiAgXVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiLnJxXCIsXG4gIGJyYWNrZXRzOiBbXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIuY3VybHlcIiwgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIsIG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5zcXVhcmVcIiwgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmFuZ2xlXCIsIG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIgfVxuICBdLFxuICBrZXl3b3JkczogW1xuICAgIFwiYWRkXCIsXG4gICAgXCJhc1wiLFxuICAgIFwiYXNjXCIsXG4gICAgXCJhc2tcIixcbiAgICBcImJhc2VcIixcbiAgICBcImJ5XCIsXG4gICAgXCJjbGVhclwiLFxuICAgIFwiY29uc3RydWN0XCIsXG4gICAgXCJjb3B5XCIsXG4gICAgXCJjcmVhdGVcIixcbiAgICBcImRhdGFcIixcbiAgICBcImRlbGV0ZVwiLFxuICAgIFwiZGVzY1wiLFxuICAgIFwiZGVzY3JpYmVcIixcbiAgICBcImRpc3RpbmN0XCIsXG4gICAgXCJkcm9wXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJmcm9tXCIsXG4gICAgXCJncmFwaFwiLFxuICAgIFwiZ3JvdXBcIixcbiAgICBcImhhdmluZ1wiLFxuICAgIFwiaW5cIixcbiAgICBcImluc2VydFwiLFxuICAgIFwibGltaXRcIixcbiAgICBcImxvYWRcIixcbiAgICBcIm1pbnVzXCIsXG4gICAgXCJtb3ZlXCIsXG4gICAgXCJuYW1lZFwiLFxuICAgIFwibm90XCIsXG4gICAgXCJvZmZzZXRcIixcbiAgICBcIm9wdGlvbmFsXCIsXG4gICAgXCJvcmRlclwiLFxuICAgIFwicHJlZml4XCIsXG4gICAgXCJyZWR1Y2VkXCIsXG4gICAgXCJzZWxlY3RcIixcbiAgICBcInNlcnZpY2VcIixcbiAgICBcInNpbGVudFwiLFxuICAgIFwidG9cIixcbiAgICBcInRydWVcIixcbiAgICBcInVuZGVmXCIsXG4gICAgXCJ1bmlvblwiLFxuICAgIFwidXNpbmdcIixcbiAgICBcInZhbHVlc1wiLFxuICAgIFwid2hlcmVcIixcbiAgICBcIndpdGhcIlxuICBdLFxuICBidWlsdGluRnVuY3Rpb25zOiBbXG4gICAgXCJhXCIsXG4gICAgXCJhYnNcIixcbiAgICBcImF2Z1wiLFxuICAgIFwiYmluZFwiLFxuICAgIFwiYm5vZGVcIixcbiAgICBcImJvdW5kXCIsXG4gICAgXCJjZWlsXCIsXG4gICAgXCJjb2FsZXNjZVwiLFxuICAgIFwiY29uY2F0XCIsXG4gICAgXCJjb250YWluc1wiLFxuICAgIFwiY291bnRcIixcbiAgICBcImRhdGF0eXBlXCIsXG4gICAgXCJkYXlcIixcbiAgICBcImVuY29kZV9mb3JfdXJpXCIsXG4gICAgXCJleGlzdHNcIixcbiAgICBcImZsb29yXCIsXG4gICAgXCJncm91cF9jb25jYXRcIixcbiAgICBcImhvdXJzXCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaXJpXCIsXG4gICAgXCJpc2JsYW5rXCIsXG4gICAgXCJpc2lyaVwiLFxuICAgIFwiaXNsaXRlcmFsXCIsXG4gICAgXCJpc251bWVyaWNcIixcbiAgICBcImlzdXJpXCIsXG4gICAgXCJsYW5nXCIsXG4gICAgXCJsYW5nbWF0Y2hlc1wiLFxuICAgIFwibGNhc2VcIixcbiAgICBcIm1heFwiLFxuICAgIFwibWQ1XCIsXG4gICAgXCJtaW5cIixcbiAgICBcIm1pbnV0ZXNcIixcbiAgICBcIm1vbnRoXCIsXG4gICAgXCJub3dcIixcbiAgICBcInJhbmRcIixcbiAgICBcInJlZ2V4XCIsXG4gICAgXCJyZXBsYWNlXCIsXG4gICAgXCJyb3VuZFwiLFxuICAgIFwic2FtZXRlcm1cIixcbiAgICBcInNhbXBsZVwiLFxuICAgIFwic2Vjb25kc1wiLFxuICAgIFwic2hhMVwiLFxuICAgIFwic2hhMjU2XCIsXG4gICAgXCJzaGEzODRcIixcbiAgICBcInNoYTUxMlwiLFxuICAgIFwic3RyXCIsXG4gICAgXCJzdHJhZnRlclwiLFxuICAgIFwic3RyYmVmb3JlXCIsXG4gICAgXCJzdHJkdFwiLFxuICAgIFwic3RyZW5kc1wiLFxuICAgIFwic3RybGFuZ1wiLFxuICAgIFwic3RybGVuXCIsXG4gICAgXCJzdHJzdGFydHNcIixcbiAgICBcInN0cnV1aWRcIixcbiAgICBcInN1YnN0clwiLFxuICAgIFwic3VtXCIsXG4gICAgXCJ0aW1lem9uZVwiLFxuICAgIFwidHpcIixcbiAgICBcInVjYXNlXCIsXG4gICAgXCJ1cmlcIixcbiAgICBcInV1aWRcIixcbiAgICBcInllYXJcIlxuICBdLFxuICBpZ25vcmVDYXNlOiB0cnVlLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbLzxbXlxcc1xcdTAwYTA+XSo+Py8sIFwidGFnXCJdLFxuICAgICAgeyBpbmNsdWRlOiBcIkBzdHJpbmdzXCIgfSxcbiAgICAgIFsvIy4qLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9be30oKVxcW1xcXV0vLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFsvWzssLl0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvW19cXHdcXGRdKzooXFwuKD89W1xcd19cXC1cXFxcJV0pfFs6XFx3Xy1dfFxcXFxbLVxcXFxffi4hJCYnKCkqKyw7PS8/I0AlXXwlW2EtZlxcZF1bYS1mXFxkXSkqLywgXCJ0YWdcIl0sXG4gICAgICBbLzooXFwuKD89W1xcd19cXC1cXFxcJV0pfFs6XFx3Xy1dfFxcXFxbLVxcXFxffi4hJCYnKCkqKyw7PS8/I0AlXXwlW2EtZlxcZF1bYS1mXFxkXSkrLywgXCJ0YWdcIl0sXG4gICAgICBbXG4gICAgICAgIC9bJD9dP1tfXFx3XFxkXSsvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZFwiIH0sXG4gICAgICAgICAgICBcIkBidWlsdGluRnVuY3Rpb25zXCI6IHsgdG9rZW46IFwicHJlZGVmaW5lZC5zcWxcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXFxeXFxeLywgXCJvcGVyYXRvci5zcWxcIl0sXG4gICAgICBbL1xcXlsqK1xcLTw+PSZ8XlxcLyE/XSovLCBcIm9wZXJhdG9yLnNxbFwiXSxcbiAgICAgIFsvWyorXFwtPD49JnxcXC8hP10vLCBcIm9wZXJhdG9yLnNxbFwiXSxcbiAgICAgIFsvQFthLXpcXGRcXC1dKi8sIFwibWV0YXRhZy5odG1sXCJdLFxuICAgICAgWy9cXHMrLywgXCJ3aGl0ZVwiXVxuICAgIF0sXG4gICAgc3RyaW5nczogW1xuICAgICAgWy8nKFteJ1xcXFxdfFxcXFwuKSokLywgXCJzdHJpbmcuaW52YWxpZFwiXSxcbiAgICAgIFsvJyQvLCBcInN0cmluZy5zcWxcIiwgXCJAcG9wXCJdLFxuICAgICAgWy8nLywgXCJzdHJpbmcuc3FsXCIsIFwiQHN0cmluZ0JvZHlcIl0sXG4gICAgICBbL1wiKFteXCJcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbL1wiJC8sIFwic3RyaW5nLnNxbFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmcuc3FsXCIsIFwiQGRibFN0cmluZ0JvZHlcIl1cbiAgICBdLFxuICAgIHN0cmluZ0JvZHk6IFtcbiAgICAgIFsvW15cXFxcJ10rLywgXCJzdHJpbmcuc3FsXCJdLFxuICAgICAgWy9cXFxcLi8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nLnNxbFwiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIGRibFN0cmluZ0JvZHk6IFtcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwic3RyaW5nLnNxbFwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmcuc3FsXCIsIFwiQHBvcFwiXVxuICAgIF1cbiAgfVxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFHLElBQUMsT0FBTztBQUFBLEVBQ1QsVUFBVTtBQUFBLElBQ1IsYUFBYTtBQUFBLEVBQ2Q7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxFQUNWO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFFBQVEsRUFBRztBQUFBLElBQzVDLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsUUFBUSxFQUFHO0FBQUEsSUFDNUMsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDMUI7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsVUFBVTtBQUFBLElBQ1IsRUFBRSxPQUFPLG1CQUFtQixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDbkQsRUFBRSxPQUFPLHlCQUF5QixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekQsRUFBRSxPQUFPLG9CQUFvQixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDcEQsRUFBRSxPQUFPLG1CQUFtQixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDcEQ7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLElBQ1QsTUFBTTtBQUFBLE1BQ0osQ0FBQyxvQkFBb0IsS0FBSztBQUFBLE1BQzFCLEVBQUUsU0FBUyxXQUFZO0FBQUEsTUFDdkIsQ0FBQyxPQUFPLFNBQVM7QUFBQSxNQUNqQixDQUFDLGNBQWMsV0FBVztBQUFBLE1BQzFCLENBQUMsU0FBUyxXQUFXO0FBQUEsTUFDckIsQ0FBQyxtRkFBbUYsS0FBSztBQUFBLE1BQ3pGLENBQUMsMkVBQTJFLEtBQUs7QUFBQSxNQUNqRjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxhQUFhLEVBQUUsT0FBTyxVQUFXO0FBQUEsWUFDakMscUJBQXFCLEVBQUUsT0FBTyxpQkFBa0I7QUFBQSxZQUNoRCxZQUFZO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxDQUFDLFFBQVEsY0FBYztBQUFBLE1BQ3ZCLENBQUMsdUJBQXVCLGNBQWM7QUFBQSxNQUN0QyxDQUFDLG1CQUFtQixjQUFjO0FBQUEsTUFDbEMsQ0FBQyxlQUFlLGNBQWM7QUFBQSxNQUM5QixDQUFDLE9BQU8sT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFDRCxTQUFTO0FBQUEsTUFDUCxDQUFDLG1CQUFtQixnQkFBZ0I7QUFBQSxNQUNwQyxDQUFDLE1BQU0sY0FBYyxNQUFNO0FBQUEsTUFDM0IsQ0FBQyxLQUFLLGNBQWMsYUFBYTtBQUFBLE1BQ2pDLENBQUMsbUJBQW1CLGdCQUFnQjtBQUFBLE1BQ3BDLENBQUMsTUFBTSxjQUFjLE1BQU07QUFBQSxNQUMzQixDQUFDLEtBQUssY0FBYyxnQkFBZ0I7QUFBQSxJQUNyQztBQUFBLElBQ0QsWUFBWTtBQUFBLE1BQ1YsQ0FBQyxXQUFXLFlBQVk7QUFBQSxNQUN4QixDQUFDLE9BQU8sZUFBZTtBQUFBLE1BQ3ZCLENBQUMsS0FBSyxjQUFjLE1BQU07QUFBQSxJQUMzQjtBQUFBLElBQ0QsZUFBZTtBQUFBLE1BQ2IsQ0FBQyxXQUFXLFlBQVk7QUFBQSxNQUN4QixDQUFDLE9BQU8sZUFBZTtBQUFBLE1BQ3ZCLENBQUMsS0FBSyxjQUFjLE1BQU07QUFBQSxJQUMzQjtBQUFBLEVBQ0Y7QUFDSDsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMF19
