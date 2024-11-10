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
    { open: "[", close: "]" },
    { open: "{", close: "}" },
    { open: "(", close: ")" },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["string"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*#pragma\\s+region\\b"),
      end: new RegExp("^\\s*#pragma\\s+endregion\\b")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".cpp",
  brackets: [
    { token: "delimiter.curly", open: "{", close: "}" },
    { token: "delimiter.parenthesis", open: "(", close: ")" },
    { token: "delimiter.square", open: "[", close: "]" },
    { token: "delimiter.angle", open: "<", close: ">" }
  ],
  keywords: [
    "abstract",
    "amp",
    "array",
    "auto",
    "bool",
    "break",
    "case",
    "catch",
    "char",
    "class",
    "const",
    "constexpr",
    "const_cast",
    "continue",
    "cpu",
    "decltype",
    "default",
    "delegate",
    "delete",
    "do",
    "double",
    "dynamic_cast",
    "each",
    "else",
    "enum",
    "event",
    "explicit",
    "export",
    "extern",
    "false",
    "final",
    "finally",
    "float",
    "for",
    "friend",
    "gcnew",
    "generic",
    "goto",
    "if",
    "in",
    "initonly",
    "inline",
    "int",
    "interface",
    "interior_ptr",
    "internal",
    "literal",
    "long",
    "mutable",
    "namespace",
    "new",
    "noexcept",
    "nullptr",
    "__nullptr",
    "operator",
    "override",
    "partial",
    "pascal",
    "pin_ptr",
    "private",
    "property",
    "protected",
    "public",
    "ref",
    "register",
    "reinterpret_cast",
    "restrict",
    "return",
    "safe_cast",
    "sealed",
    "short",
    "signed",
    "sizeof",
    "static",
    "static_assert",
    "static_cast",
    "struct",
    "switch",
    "template",
    "this",
    "thread_local",
    "throw",
    "tile_static",
    "true",
    "try",
    "typedef",
    "typeid",
    "typename",
    "union",
    "unsigned",
    "using",
    "virtual",
    "void",
    "volatile",
    "wchar_t",
    "where",
    "while",
    "_asm",
    "_based",
    "_cdecl",
    "_declspec",
    "_fastcall",
    "_if_exists",
    "_if_not_exists",
    "_inline",
    "_multiple_inheritance",
    "_pascal",
    "_single_inheritance",
    "_stdcall",
    "_virtual_inheritance",
    "_w64",
    "__abstract",
    "__alignof",
    "__asm",
    "__assume",
    "__based",
    "__box",
    "__builtin_alignof",
    "__cdecl",
    "__clrcall",
    "__declspec",
    "__delegate",
    "__event",
    "__except",
    "__fastcall",
    "__finally",
    "__forceinline",
    "__gc",
    "__hook",
    "__identifier",
    "__if_exists",
    "__if_not_exists",
    "__inline",
    "__int128",
    "__int16",
    "__int32",
    "__int64",
    "__int8",
    "__interface",
    "__leave",
    "__m128",
    "__m128d",
    "__m128i",
    "__m256",
    "__m256d",
    "__m256i",
    "__m512",
    "__m512d",
    "__m512i",
    "__m64",
    "__multiple_inheritance",
    "__newslot",
    "__nogc",
    "__noop",
    "__nounwind",
    "__novtordisp",
    "__pascal",
    "__pin",
    "__pragma",
    "__property",
    "__ptr32",
    "__ptr64",
    "__raise",
    "__restrict",
    "__resume",
    "__sealed",
    "__single_inheritance",
    "__stdcall",
    "__super",
    "__thiscall",
    "__try",
    "__try_cast",
    "__typeof",
    "__unaligned",
    "__unhook",
    "__uuidof",
    "__value",
    "__virtual_inheritance",
    "__w64",
    "__wchar_t"
  ],
  operators: [
    "=",
    ">",
    "<",
    "!",
    "~",
    "?",
    ":",
    "==",
    "<=",
    ">=",
    "!=",
    "&&",
    "||",
    "++",
    "--",
    "+",
    "-",
    "*",
    "/",
    "&",
    "|",
    "^",
    "%",
    "<<",
    ">>",
    ">>>",
    "+=",
    "-=",
    "*=",
    "/=",
    "&=",
    "|=",
    "^=",
    "%=",
    "<<=",
    ">>=",
    ">>>="
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[0abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  integersuffix: /([uU](ll|LL|l|L)|(ll|LL|l|L)?[uU]?)/,
  floatsuffix: /[fFlL]?/,
  encoding: /u|u8|U|L/,
  tokenizer: {
    root: [
      [/@encoding?R\"(?:([^ ()\\\t]*))\(/, { token: "string.raw.begin", next: "@raw.$1" }],
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@default": "identifier"
          }
        }
      ],
      [/^\s*#\s*include/, { token: "keyword.directive.include", next: "@include" }],
      [/^\s*#\s*\w+/, "keyword.directive"],
      { include: "@whitespace" },
      [/\[\s*\[/, { token: "annotation", next: "@annotation" }],
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": ""
          }
        }
      ],
      [/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, "number.float"],
      [/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, "number.float"],
      [/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, "number.hex"],
      [/0[0-7']*[0-7](@integersuffix)/, "number.octal"],
      [/0[bB][0-1']*[0-1](@integersuffix)/, "number.binary"],
      [/\d[\d']*\d(@integersuffix)/, "number"],
      [/\d(@integersuffix)/, "number"],
      [/[;,.]/, "delimiter"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string"],
      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@doccomment"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*\\$/, "comment", "@linecomment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    linecomment: [
      [/.*[^\\]$/, "comment", "@pop"],
      [/[^]+/, "comment"]
    ],
    doccomment: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"]
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ],
    raw: [
      [
        /(.*)(\))(?:([^ ()\\\t"]*))(\")/,
        {
          cases: {
            "$3==$S2": [
              "string.raw",
              "string.raw.end",
              "string.raw.end",
              { token: "string.raw.end", next: "@pop" }
            ],
            "@default": ["string.raw", "string.raw", "string.raw", "string.raw"]
          }
        }
      ],
      [/.*/, "string.raw"]
    ],
    annotation: [
      { include: "@whitespace" },
      [/using|alignas/, "keyword"],
      [/[a-zA-Z0-9_]+/, "annotation"],
      [/[,:]/, "delimiter"],
      [/[()]/, "@brackets"],
      [/\]\s*\]/, { token: "annotation", next: "@pop" }]
    ],
    include: [
      [
        /(\s*)(<)([^<>]*)(>)/,
        [
          "",
          "keyword.directive.include.begin",
          "string.include.identifier",
          { token: "keyword.directive.include.end", next: "@pop" }
        ]
      ],
      [
        /(\s*)(")([^"]*)(")/,
        [
          "",
          "keyword.directive.include.begin",
          "string.include.identifier",
          { token: "keyword.directive.include.end", next: "@pop" }
        ]
      ]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3BwLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2NwcC9jcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2NwcC9jcHAudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi8vXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCIvKlwiLCBcIiovXCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInLCBub3RJbjogW1wic3RyaW5nXCJdIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdLFxuICBmb2xkaW5nOiB7XG4gICAgbWFya2Vyczoge1xuICAgICAgc3RhcnQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3ByYWdtYVxcXFxzK3JlZ2lvblxcXFxiXCIpLFxuICAgICAgZW5kOiBuZXcgUmVnRXhwKFwiXlxcXFxzKiNwcmFnbWFcXFxccytlbmRyZWdpb25cXFxcYlwiKVxuICAgIH1cbiAgfVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICB0b2tlblBvc3RmaXg6IFwiLmNwcFwiLFxuICBicmFja2V0czogW1xuICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmN1cmx5XCIsIG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiLCBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIsIG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5hbmdsZVwiLCBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiIH1cbiAgXSxcbiAga2V5d29yZHM6IFtcbiAgICBcImFic3RyYWN0XCIsXG4gICAgXCJhbXBcIixcbiAgICBcImFycmF5XCIsXG4gICAgXCJhdXRvXCIsXG4gICAgXCJib29sXCIsXG4gICAgXCJicmVha1wiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImNoYXJcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJjb25zdFwiLFxuICAgIFwiY29uc3RleHByXCIsXG4gICAgXCJjb25zdF9jYXN0XCIsXG4gICAgXCJjb250aW51ZVwiLFxuICAgIFwiY3B1XCIsXG4gICAgXCJkZWNsdHlwZVwiLFxuICAgIFwiZGVmYXVsdFwiLFxuICAgIFwiZGVsZWdhdGVcIixcbiAgICBcImRlbGV0ZVwiLFxuICAgIFwiZG9cIixcbiAgICBcImRvdWJsZVwiLFxuICAgIFwiZHluYW1pY19jYXN0XCIsXG4gICAgXCJlYWNoXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJlbnVtXCIsXG4gICAgXCJldmVudFwiLFxuICAgIFwiZXhwbGljaXRcIixcbiAgICBcImV4cG9ydFwiLFxuICAgIFwiZXh0ZXJuXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwiZmluYWxcIixcbiAgICBcImZpbmFsbHlcIixcbiAgICBcImZsb2F0XCIsXG4gICAgXCJmb3JcIixcbiAgICBcImZyaWVuZFwiLFxuICAgIFwiZ2NuZXdcIixcbiAgICBcImdlbmVyaWNcIixcbiAgICBcImdvdG9cIixcbiAgICBcImlmXCIsXG4gICAgXCJpblwiLFxuICAgIFwiaW5pdG9ubHlcIixcbiAgICBcImlubGluZVwiLFxuICAgIFwiaW50XCIsXG4gICAgXCJpbnRlcmZhY2VcIixcbiAgICBcImludGVyaW9yX3B0clwiLFxuICAgIFwiaW50ZXJuYWxcIixcbiAgICBcImxpdGVyYWxcIixcbiAgICBcImxvbmdcIixcbiAgICBcIm11dGFibGVcIixcbiAgICBcIm5hbWVzcGFjZVwiLFxuICAgIFwibmV3XCIsXG4gICAgXCJub2V4Y2VwdFwiLFxuICAgIFwibnVsbHB0clwiLFxuICAgIFwiX19udWxscHRyXCIsXG4gICAgXCJvcGVyYXRvclwiLFxuICAgIFwib3ZlcnJpZGVcIixcbiAgICBcInBhcnRpYWxcIixcbiAgICBcInBhc2NhbFwiLFxuICAgIFwicGluX3B0clwiLFxuICAgIFwicHJpdmF0ZVwiLFxuICAgIFwicHJvcGVydHlcIixcbiAgICBcInByb3RlY3RlZFwiLFxuICAgIFwicHVibGljXCIsXG4gICAgXCJyZWZcIixcbiAgICBcInJlZ2lzdGVyXCIsXG4gICAgXCJyZWludGVycHJldF9jYXN0XCIsXG4gICAgXCJyZXN0cmljdFwiLFxuICAgIFwicmV0dXJuXCIsXG4gICAgXCJzYWZlX2Nhc3RcIixcbiAgICBcInNlYWxlZFwiLFxuICAgIFwic2hvcnRcIixcbiAgICBcInNpZ25lZFwiLFxuICAgIFwic2l6ZW9mXCIsXG4gICAgXCJzdGF0aWNcIixcbiAgICBcInN0YXRpY19hc3NlcnRcIixcbiAgICBcInN0YXRpY19jYXN0XCIsXG4gICAgXCJzdHJ1Y3RcIixcbiAgICBcInN3aXRjaFwiLFxuICAgIFwidGVtcGxhdGVcIixcbiAgICBcInRoaXNcIixcbiAgICBcInRocmVhZF9sb2NhbFwiLFxuICAgIFwidGhyb3dcIixcbiAgICBcInRpbGVfc3RhdGljXCIsXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJ0cnlcIixcbiAgICBcInR5cGVkZWZcIixcbiAgICBcInR5cGVpZFwiLFxuICAgIFwidHlwZW5hbWVcIixcbiAgICBcInVuaW9uXCIsXG4gICAgXCJ1bnNpZ25lZFwiLFxuICAgIFwidXNpbmdcIixcbiAgICBcInZpcnR1YWxcIixcbiAgICBcInZvaWRcIixcbiAgICBcInZvbGF0aWxlXCIsXG4gICAgXCJ3Y2hhcl90XCIsXG4gICAgXCJ3aGVyZVwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcIl9hc21cIixcbiAgICBcIl9iYXNlZFwiLFxuICAgIFwiX2NkZWNsXCIsXG4gICAgXCJfZGVjbHNwZWNcIixcbiAgICBcIl9mYXN0Y2FsbFwiLFxuICAgIFwiX2lmX2V4aXN0c1wiLFxuICAgIFwiX2lmX25vdF9leGlzdHNcIixcbiAgICBcIl9pbmxpbmVcIixcbiAgICBcIl9tdWx0aXBsZV9pbmhlcml0YW5jZVwiLFxuICAgIFwiX3Bhc2NhbFwiLFxuICAgIFwiX3NpbmdsZV9pbmhlcml0YW5jZVwiLFxuICAgIFwiX3N0ZGNhbGxcIixcbiAgICBcIl92aXJ0dWFsX2luaGVyaXRhbmNlXCIsXG4gICAgXCJfdzY0XCIsXG4gICAgXCJfX2Fic3RyYWN0XCIsXG4gICAgXCJfX2FsaWdub2ZcIixcbiAgICBcIl9fYXNtXCIsXG4gICAgXCJfX2Fzc3VtZVwiLFxuICAgIFwiX19iYXNlZFwiLFxuICAgIFwiX19ib3hcIixcbiAgICBcIl9fYnVpbHRpbl9hbGlnbm9mXCIsXG4gICAgXCJfX2NkZWNsXCIsXG4gICAgXCJfX2NscmNhbGxcIixcbiAgICBcIl9fZGVjbHNwZWNcIixcbiAgICBcIl9fZGVsZWdhdGVcIixcbiAgICBcIl9fZXZlbnRcIixcbiAgICBcIl9fZXhjZXB0XCIsXG4gICAgXCJfX2Zhc3RjYWxsXCIsXG4gICAgXCJfX2ZpbmFsbHlcIixcbiAgICBcIl9fZm9yY2VpbmxpbmVcIixcbiAgICBcIl9fZ2NcIixcbiAgICBcIl9faG9va1wiLFxuICAgIFwiX19pZGVudGlmaWVyXCIsXG4gICAgXCJfX2lmX2V4aXN0c1wiLFxuICAgIFwiX19pZl9ub3RfZXhpc3RzXCIsXG4gICAgXCJfX2lubGluZVwiLFxuICAgIFwiX19pbnQxMjhcIixcbiAgICBcIl9faW50MTZcIixcbiAgICBcIl9faW50MzJcIixcbiAgICBcIl9faW50NjRcIixcbiAgICBcIl9faW50OFwiLFxuICAgIFwiX19pbnRlcmZhY2VcIixcbiAgICBcIl9fbGVhdmVcIixcbiAgICBcIl9fbTEyOFwiLFxuICAgIFwiX19tMTI4ZFwiLFxuICAgIFwiX19tMTI4aVwiLFxuICAgIFwiX19tMjU2XCIsXG4gICAgXCJfX20yNTZkXCIsXG4gICAgXCJfX20yNTZpXCIsXG4gICAgXCJfX201MTJcIixcbiAgICBcIl9fbTUxMmRcIixcbiAgICBcIl9fbTUxMmlcIixcbiAgICBcIl9fbTY0XCIsXG4gICAgXCJfX211bHRpcGxlX2luaGVyaXRhbmNlXCIsXG4gICAgXCJfX25ld3Nsb3RcIixcbiAgICBcIl9fbm9nY1wiLFxuICAgIFwiX19ub29wXCIsXG4gICAgXCJfX25vdW53aW5kXCIsXG4gICAgXCJfX25vdnRvcmRpc3BcIixcbiAgICBcIl9fcGFzY2FsXCIsXG4gICAgXCJfX3BpblwiLFxuICAgIFwiX19wcmFnbWFcIixcbiAgICBcIl9fcHJvcGVydHlcIixcbiAgICBcIl9fcHRyMzJcIixcbiAgICBcIl9fcHRyNjRcIixcbiAgICBcIl9fcmFpc2VcIixcbiAgICBcIl9fcmVzdHJpY3RcIixcbiAgICBcIl9fcmVzdW1lXCIsXG4gICAgXCJfX3NlYWxlZFwiLFxuICAgIFwiX19zaW5nbGVfaW5oZXJpdGFuY2VcIixcbiAgICBcIl9fc3RkY2FsbFwiLFxuICAgIFwiX19zdXBlclwiLFxuICAgIFwiX190aGlzY2FsbFwiLFxuICAgIFwiX190cnlcIixcbiAgICBcIl9fdHJ5X2Nhc3RcIixcbiAgICBcIl9fdHlwZW9mXCIsXG4gICAgXCJfX3VuYWxpZ25lZFwiLFxuICAgIFwiX191bmhvb2tcIixcbiAgICBcIl9fdXVpZG9mXCIsXG4gICAgXCJfX3ZhbHVlXCIsXG4gICAgXCJfX3ZpcnR1YWxfaW5oZXJpdGFuY2VcIixcbiAgICBcIl9fdzY0XCIsXG4gICAgXCJfX3djaGFyX3RcIlxuICBdLFxuICBvcGVyYXRvcnM6IFtcbiAgICBcIj1cIixcbiAgICBcIj5cIixcbiAgICBcIjxcIixcbiAgICBcIiFcIixcbiAgICBcIn5cIixcbiAgICBcIj9cIixcbiAgICBcIjpcIixcbiAgICBcIj09XCIsXG4gICAgXCI8PVwiLFxuICAgIFwiPj1cIixcbiAgICBcIiE9XCIsXG4gICAgXCImJlwiLFxuICAgIFwifHxcIixcbiAgICBcIisrXCIsXG4gICAgXCItLVwiLFxuICAgIFwiK1wiLFxuICAgIFwiLVwiLFxuICAgIFwiKlwiLFxuICAgIFwiL1wiLFxuICAgIFwiJlwiLFxuICAgIFwifFwiLFxuICAgIFwiXlwiLFxuICAgIFwiJVwiLFxuICAgIFwiPDxcIixcbiAgICBcIj4+XCIsXG4gICAgXCI+Pj5cIixcbiAgICBcIis9XCIsXG4gICAgXCItPVwiLFxuICAgIFwiKj1cIixcbiAgICBcIi89XCIsXG4gICAgXCImPVwiLFxuICAgIFwifD1cIixcbiAgICBcIl49XCIsXG4gICAgXCIlPVwiLFxuICAgIFwiPDw9XCIsXG4gICAgXCI+Pj1cIixcbiAgICBcIj4+Pj1cIlxuICBdLFxuICBzeW1ib2xzOiAvWz0+PCF+PzomfCtcXC0qXFwvXFxeJV0rLyxcbiAgZXNjYXBlczogL1xcXFwoPzpbMGFiZm5ydHZcXFxcXCInXXx4WzAtOUEtRmEtZl17MSw0fXx1WzAtOUEtRmEtZl17NH18VVswLTlBLUZhLWZdezh9KS8sXG4gIGludGVnZXJzdWZmaXg6IC8oW3VVXShsbHxMTHxsfEwpfChsbHxMTHxsfEwpP1t1VV0/KS8sXG4gIGZsb2F0c3VmZml4OiAvW2ZGbExdPy8sXG4gIGVuY29kaW5nOiAvdXx1OHxVfEwvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbL0BlbmNvZGluZz9SXFxcIig/OihbXiAoKVxcXFxcXHRdKikpXFwoLywgeyB0b2tlbjogXCJzdHJpbmcucmF3LmJlZ2luXCIsIG5leHQ6IFwiQHJhdy4kMVwiIH1dLFxuICAgICAgW1xuICAgICAgICAvW2EtekEtWl9dXFx3Ki8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogeyB0b2tlbjogXCJrZXl3b3JkLiQwXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJpZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL15cXHMqI1xccyppbmNsdWRlLywgeyB0b2tlbjogXCJrZXl3b3JkLmRpcmVjdGl2ZS5pbmNsdWRlXCIsIG5leHQ6IFwiQGluY2x1ZGVcIiB9XSxcbiAgICAgIFsvXlxccyojXFxzKlxcdysvLCBcImtleXdvcmQuZGlyZWN0aXZlXCJdLFxuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIFsvXFxbXFxzKlxcWy8sIHsgdG9rZW46IFwiYW5ub3RhdGlvblwiLCBuZXh0OiBcIkBhbm5vdGF0aW9uXCIgfV0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9bPD5dKD8hQHN5bWJvbHMpLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbXG4gICAgICAgIC9Ac3ltYm9scy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAb3BlcmF0b3JzXCI6IFwiZGVsaW1pdGVyXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1xcZCpcXGQrW2VFXShbXFwtK10/XFxkKyk/KEBmbG9hdHN1ZmZpeCkvLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvXFxkKlxcLlxcZCsoW2VFXVtcXC0rXT9cXGQrKT8oQGZsb2F0c3VmZml4KS8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy8wW3hYXVswLTlhLWZBLUYnXSpbMC05YS1mQS1GXShAaW50ZWdlcnN1ZmZpeCkvLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbLzBbMC03J10qWzAtN10oQGludGVnZXJzdWZmaXgpLywgXCJudW1iZXIub2N0YWxcIl0sXG4gICAgICBbLzBbYkJdWzAtMSddKlswLTFdKEBpbnRlZ2Vyc3VmZml4KS8sIFwibnVtYmVyLmJpbmFyeVwiXSxcbiAgICAgIFsvXFxkW1xcZCddKlxcZChAaW50ZWdlcnN1ZmZpeCkvLCBcIm51bWJlclwiXSxcbiAgICAgIFsvXFxkKEBpbnRlZ2Vyc3VmZml4KS8sIFwibnVtYmVyXCJdLFxuICAgICAgWy9bOywuXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cIihbXlwiXFxcXF18XFxcXC4pKiQvLCBcInN0cmluZy5pbnZhbGlkXCJdLFxuICAgICAgWy9cIi8sIFwic3RyaW5nXCIsIFwiQHN0cmluZ1wiXSxcbiAgICAgIFsvJ1teXFxcXCddJy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy8oJykoQGVzY2FwZXMpKCcpLywgW1wic3RyaW5nXCIsIFwic3RyaW5nLmVzY2FwZVwiLCBcInN0cmluZ1wiXV0sXG4gICAgICBbLycvLCBcInN0cmluZy5pbnZhbGlkXCJdXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIlwiXSxcbiAgICAgIFsvXFwvXFwqXFwqKD8hXFwvKS8sIFwiY29tbWVudC5kb2NcIiwgXCJAZG9jY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50XCIsIFwiQGNvbW1lbnRcIl0sXG4gICAgICBbL1xcL1xcLy4qXFxcXCQvLCBcImNvbW1lbnRcIiwgXCJAbGluZWNvbW1lbnRcIl0sXG4gICAgICBbL1xcL1xcLy4qJC8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXlxcLypdKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXFwqXFwvLywgXCJjb21tZW50XCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW1xcLypdLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBsaW5lY29tbWVudDogW1xuICAgICAgWy8uKlteXFxcXF0kLywgXCJjb21tZW50XCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW15dKy8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgZG9jY29tbWVudDogW1xuICAgICAgWy9bXlxcLypdKy8sIFwiY29tbWVudC5kb2NcIl0sXG4gICAgICBbL1xcKlxcLy8sIFwiY29tbWVudC5kb2NcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXFwvKl0vLCBcImNvbW1lbnQuZG9jXCJdXG4gICAgXSxcbiAgICBzdHJpbmc6IFtcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIHJhdzogW1xuICAgICAgW1xuICAgICAgICAvKC4qKShcXCkpKD86KFteICgpXFxcXFxcdFwiXSopKShcXFwiKS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCIkMz09JFMyXCI6IFtcbiAgICAgICAgICAgICAgXCJzdHJpbmcucmF3XCIsXG4gICAgICAgICAgICAgIFwic3RyaW5nLnJhdy5lbmRcIixcbiAgICAgICAgICAgICAgXCJzdHJpbmcucmF3LmVuZFwiLFxuICAgICAgICAgICAgICB7IHRva2VuOiBcInN0cmluZy5yYXcuZW5kXCIsIG5leHQ6IFwiQHBvcFwiIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFtcInN0cmluZy5yYXdcIiwgXCJzdHJpbmcucmF3XCIsIFwic3RyaW5nLnJhd1wiLCBcInN0cmluZy5yYXdcIl1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLy4qLywgXCJzdHJpbmcucmF3XCJdXG4gICAgXSxcbiAgICBhbm5vdGF0aW9uOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy91c2luZ3xhbGlnbmFzLywgXCJrZXl3b3JkXCJdLFxuICAgICAgWy9bYS16QS1aMC05X10rLywgXCJhbm5vdGF0aW9uXCJdLFxuICAgICAgWy9bLDpdLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1soKV0vLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFsvXFxdXFxzKlxcXS8sIHsgdG9rZW46IFwiYW5ub3RhdGlvblwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgaW5jbHVkZTogW1xuICAgICAgW1xuICAgICAgICAvKFxccyopKDwpKFtePD5dKikoPikvLFxuICAgICAgICBbXG4gICAgICAgICAgXCJcIixcbiAgICAgICAgICBcImtleXdvcmQuZGlyZWN0aXZlLmluY2x1ZGUuYmVnaW5cIixcbiAgICAgICAgICBcInN0cmluZy5pbmNsdWRlLmlkZW50aWZpZXJcIixcbiAgICAgICAgICB7IHRva2VuOiBcImtleXdvcmQuZGlyZWN0aXZlLmluY2x1ZGUuZW5kXCIsIG5leHQ6IFwiQHBvcFwiIH1cbiAgICAgICAgXVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLyhcXHMqKShcIikoW15cIl0qKShcIikvLFxuICAgICAgICBbXG4gICAgICAgICAgXCJcIixcbiAgICAgICAgICBcImtleXdvcmQuZGlyZWN0aXZlLmluY2x1ZGUuYmVnaW5cIixcbiAgICAgICAgICBcInN0cmluZy5pbmNsdWRlLmlkZW50aWZpZXJcIixcbiAgICAgICAgICB7IHRva2VuOiBcImtleXdvcmQuZGlyZWN0aXZlLmluY2x1ZGUuZW5kXCIsIG5leHQ6IFwiQHBvcFwiIH1cbiAgICAgICAgXVxuICAgICAgXVxuICAgIF1cbiAgfVxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFHLElBQUMsT0FBTztBQUFBLEVBQ1QsVUFBVTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsY0FBYyxDQUFDLE1BQU0sSUFBSTtBQUFBLEVBQzFCO0FBQUEsRUFDRCxVQUFVO0FBQUEsSUFDUixDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsRUFDVjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sQ0FBQyxVQUFVLFNBQVMsRUFBRztBQUFBLElBQ3ZELEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsUUFBUSxFQUFHO0FBQUEsRUFDN0M7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFCO0FBQUEsRUFDRCxTQUFTO0FBQUEsSUFDUCxTQUFTO0FBQUEsTUFDUCxPQUFPLElBQUksT0FBTywyQkFBMkI7QUFBQSxNQUM3QyxLQUFLLElBQUksT0FBTyw4QkFBOEI7QUFBQSxJQUMvQztBQUFBLEVBQ0Y7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsVUFBVTtBQUFBLElBQ1IsRUFBRSxPQUFPLG1CQUFtQixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDbkQsRUFBRSxPQUFPLHlCQUF5QixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekQsRUFBRSxPQUFPLG9CQUFvQixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDcEQsRUFBRSxPQUFPLG1CQUFtQixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDcEQ7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxXQUFXO0FBQUEsSUFDVDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEs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
