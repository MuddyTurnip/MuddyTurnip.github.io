/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    lineComment: "//",
    blockComment: ["(*", "*)"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["<", ">"]
  ],
  autoClosingPairs: [
    { open: '"', close: '"', notIn: ["string", "comment"] },
    { open: "{", close: "}", notIn: ["string", "comment"] },
    { open: "[", close: "]", notIn: ["string", "comment"] },
    { open: "(", close: ")", notIn: ["string", "comment"] }
  ]
};
var language = {
  tokenPostfix: ".pats",
  defaultToken: "invalid",
  keywords: [
    "abstype",
    "abst0ype",
    "absprop",
    "absview",
    "absvtype",
    "absviewtype",
    "absvt0ype",
    "absviewt0ype",
    "as",
    "and",
    "assume",
    "begin",
    "classdec",
    "datasort",
    "datatype",
    "dataprop",
    "dataview",
    "datavtype",
    "dataviewtype",
    "do",
    "end",
    "extern",
    "extype",
    "extvar",
    "exception",
    "fn",
    "fnx",
    "fun",
    "prfn",
    "prfun",
    "praxi",
    "castfn",
    "if",
    "then",
    "else",
    "ifcase",
    "in",
    "infix",
    "infixl",
    "infixr",
    "prefix",
    "postfix",
    "implmnt",
    "implement",
    "primplmnt",
    "primplement",
    "import",
    "let",
    "local",
    "macdef",
    "macrodef",
    "nonfix",
    "symelim",
    "symintr",
    "overload",
    "of",
    "op",
    "rec",
    "sif",
    "scase",
    "sortdef",
    "sta",
    "stacst",
    "stadef",
    "static",
    "staload",
    "dynload",
    "try",
    "tkindef",
    "typedef",
    "propdef",
    "viewdef",
    "vtypedef",
    "viewtypedef",
    "prval",
    "var",
    "prvar",
    "when",
    "where",
    "with",
    "withtype",
    "withprop",
    "withview",
    "withvtype",
    "withviewtype"
  ],
  keywords_dlr: [
    "$delay",
    "$ldelay",
    "$arrpsz",
    "$arrptrsize",
    "$d2ctype",
    "$effmask",
    "$effmask_ntm",
    "$effmask_exn",
    "$effmask_ref",
    "$effmask_wrt",
    "$effmask_all",
    "$extern",
    "$extkind",
    "$extype",
    "$extype_struct",
    "$extval",
    "$extfcall",
    "$extmcall",
    "$literal",
    "$myfilename",
    "$mylocation",
    "$myfunction",
    "$lst",
    "$lst_t",
    "$lst_vt",
    "$list",
    "$list_t",
    "$list_vt",
    "$rec",
    "$rec_t",
    "$rec_vt",
    "$record",
    "$record_t",
    "$record_vt",
    "$tup",
    "$tup_t",
    "$tup_vt",
    "$tuple",
    "$tuple_t",
    "$tuple_vt",
    "$break",
    "$continue",
    "$raise",
    "$showtype",
    "$vcopyenv_v",
    "$vcopyenv_vt",
    "$tempenver",
    "$solver_assert",
    "$solver_verify"
  ],
  keywords_srp: [
    "#if",
    "#ifdef",
    "#ifndef",
    "#then",
    "#elif",
    "#elifdef",
    "#elifndef",
    "#else",
    "#endif",
    "#error",
    "#prerr",
    "#print",
    "#assert",
    "#undef",
    "#define",
    "#include",
    "#require",
    "#pragma",
    "#codegen2",
    "#codegen3"
  ],
  irregular_keyword_list: [
    "val+",
    "val-",
    "val",
    "case+",
    "case-",
    "case",
    "addr@",
    "addr",
    "fold@",
    "free@",
    "fix@",
    "fix",
    "lam@",
    "lam",
    "llam@",
    "llam",
    "viewt@ype+",
    "viewt@ype-",
    "viewt@ype",
    "viewtype+",
    "viewtype-",
    "viewtype",
    "view+",
    "view-",
    "view@",
    "view",
    "type+",
    "type-",
    "type",
    "vtype+",
    "vtype-",
    "vtype",
    "vt@ype+",
    "vt@ype-",
    "vt@ype",
    "viewt@ype+",
    "viewt@ype-",
    "viewt@ype",
    "viewtype+",
    "viewtype-",
    "viewtype",
    "prop+",
    "prop-",
    "prop",
    "type+",
    "type-",
    "type",
    "t@ype",
    "t@ype+",
    "t@ype-",
    "abst@ype",
    "abstype",
    "absviewt@ype",
    "absvt@ype",
    "for*",
    "for",
    "while*",
    "while"
  ],
  keywords_types: [
    "bool",
    "double",
    "byte",
    "int",
    "short",
    "char",
    "void",
    "unit",
    "long",
    "float",
    "string",
    "strptr"
  ],
  keywords_effects: [
    "0",
    "fun",
    "clo",
    "prf",
    "funclo",
    "cloptr",
    "cloref",
    "ref",
    "ntm",
    "1"
  ],
  operators: [
    "@",
    "!",
    "|",
    "`",
    ":",
    "$",
    ".",
    "=",
    "#",
    "~",
    "..",
    "...",
    "=>",
    "=<>",
    "=/=>",
    "=>>",
    "=/=>>",
    "<",
    ">",
    "><",
    ".<",
    ">.",
    ".<>.",
    "->",
    "-<>"
  ],
  brackets: [
    { open: ",(", close: ")", token: "delimiter.parenthesis" },
    { open: "`(", close: ")", token: "delimiter.parenthesis" },
    { open: "%(", close: ")", token: "delimiter.parenthesis" },
    { open: "'(", close: ")", token: "delimiter.parenthesis" },
    { open: "'{", close: "}", token: "delimiter.parenthesis" },
    { open: "@(", close: ")", token: "delimiter.parenthesis" },
    { open: "@{", close: "}", token: "delimiter.brace" },
    { open: "@[", close: "]", token: "delimiter.square" },
    { open: "#[", close: "]", token: "delimiter.square" },
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "<", close: ">", token: "delimiter.angle" }
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  IDENTFST: /[a-zA-Z_]/,
  IDENTRST: /[a-zA-Z0-9_'$]/,
  symbolic: /[%&+-./:=@~`^|*!$#?<>]/,
  digit: /[0-9]/,
  digitseq0: /@digit*/,
  xdigit: /[0-9A-Za-z]/,
  xdigitseq0: /@xdigit*/,
  INTSP: /[lLuU]/,
  FLOATSP: /[fFlL]/,
  fexponent: /[eE][+-]?[0-9]+/,
  fexponent_bin: /[pP][+-]?[0-9]+/,
  deciexp: /\.[0-9]*@fexponent?/,
  hexiexp: /\.[0-9a-zA-Z]*@fexponent_bin?/,
  irregular_keywords: /val[+-]?|case[+-]?|addr\@?|fold\@|free\@|fix\@?|lam\@?|llam\@?|prop[+-]?|type[+-]?|view[+-@]?|viewt@?ype[+-]?|t@?ype[+-]?|v(iew)?t@?ype[+-]?|abst@?ype|absv(iew)?t@?ype|for\*?|while\*?/,
  ESCHAR: /[ntvbrfa\\\?'"\(\[\{]/,
  start: "root",
  tokenizer: {
    root: [
      { regex: /[ \t\r\n]+/, action: { token: "" } },
      { regex: /\(\*\)/, action: { token: "invalid" } },
      {
        regex: /\(\*/,
        action: { token: "comment", next: "lexing_COMMENT_block_ml" }
      },
      {
        regex: /\(/,
        action: "@brackets"
      },
      {
        regex: /\)/,
        action: "@brackets"
      },
      {
        regex: /\[/,
        action: "@brackets"
      },
      {
        regex: /\]/,
        action: "@brackets"
      },
      {
        regex: /\{/,
        action: "@brackets"
      },
      {
        regex: /\}/,
        action: "@brackets"
      },
      {
        regex: /,\(/,
        action: "@brackets"
      },
      { regex: /,/, action: { token: "delimiter.comma" } },
      { regex: /;/, action: { token: "delimiter.semicolon" } },
      {
        regex: /@\(/,
        action: "@brackets"
      },
      {
        regex: /@\[/,
        action: "@brackets"
      },
      {
        regex: /@\{/,
        action: "@brackets"
      },
      {
        regex: /:</,
        action: { token: "keyword", next: "@lexing_EFFECT_commaseq0" }
      },
      { regex: /\.@symbolic+/, action: { token: "identifier.sym" } },
      {
        regex: /\.@digit*@fexponent@FLOATSP*/,
        action: { token: "number.float" }
      },
      { regex: /\.@digit+/, action: { token: "number.float" } },
      {
        regex: /\$@IDENTFST@IDENTRST*/,
        action: {
          cases: {
            "@keywords_dlr": { token: "keyword.dlr" },
            "@default": { token: "namespace" }
          }
        }
      },
      {
        regex: /\#@IDENTFST@IDENTRST*/,
        action: {
          cases: {
            "@keywords_srp": { token: "keyword.srp" },
            "@default": { token: "identifier" }
          }
        }
      },
      { regex: /%\(/, action: { token: "delimiter.parenthesis" } },
      {
        regex: /^%{(#|\^|\$)?/,
        action: {
          token: "keyword",
          next: "@lexing_EXTCODE",
          nextEmbedded: "text/javascript"
        }
      },
      { regex: /^%}/, action: { token: "keyword" } },
      { regex: /'\(/, action: { token: "delimiter.parenthesis" } },
      { regex: /'\[/, action: { token: "delimiter.bracket" } },
      { regex: /'\{/, action: { token: "delimiter.brace" } },
      [/(')(\\@ESCHAR|\\[xX]@xdigit+|\\@digit+)(')/, ["string", "string.escape", "string"]],
      [/'[^\\']'/, "string"],
      [/"/, "string.quote", "@lexing_DQUOTE"],
      {
        regex: /`\(/,
        action: "@brackets"
      },
      { regex: /\\/, action: { token: "punctuation" } },
      {
        regex: /@irregular_keywords(?!@IDENTRST)/,
        action: { token: "keyword" }
      },
      {
        regex: /@IDENTFST@IDENTRST*[<!\[]?/,
        action: {
          cases: {
            "@keywords": { token: "keyword" },
            "@keywords_types": { token: "type" },
            "@default": { token: "identifier" }
          }
        }
      },
      {
        regex: /\/\/\/\//,
        action: { token: "comment", next: "@lexing_COMMENT_rest" }
      },
      { regex: /\/\/.*$/, action: { token: "comment" } },
      {
        regex: /\/\*/,
        action: { token: "comment", next: "@lexing_COMMENT_block_c" }
      },
      {
        regex: /-<|=</,
        action: { token: "keyword", next: "@lexing_EFFECT_commaseq0" }
      },
      {
        regex: /@symbolic+/,
        action: {
          cases: {
            "@operators": "keyword",
            "@default": "operator"
          }
        }
      },
      {
        regex: /0[xX]@xdigit+(@hexiexp|@fexponent_bin)@FLOATSP*/,
        action: { token: "number.float" }
      },
      { regex: /0[xX]@xdigit+@INTSP*/, action: { token: "number.hex" } },
      {
        regex: /0[0-7]+(?![0-9])@INTSP*/,
        action: { token: "number.octal" }
      },
      {
        regex: /@digit+(@fexponent|@deciexp)@FLOATSP*/,
        action: { token: "number.float" }
      },
      {
        regex: /@digit@digitseq0@INTSP*/,
        action: { token: "number.decimal" }
      },
      { regex: /@digit+@INTSP*/, action: { token: "number" } }
    ],
    lexing_COMMENT_block_ml: [
      [/[^\(\*]+/, "comment"],
      [/\(\*/, "comment", "@push"],
      [/\(\*/, "comment.invalid"],
      [/\*\)/, "comment", "@pop"],
      [/\*/, "comment"]
    ],
    lexing_COMMENT_block_c: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    lexing_COMMENT_rest: [
      [/$/, "comment", "@pop"],
      [/.*/, "comment"]
    ],
    lexing_EFFECT_commaseq0: [
      {
        regex: /@IDENTFST@IDENTRST+|@digit+/,
        action: {
          cases: {
            "@keywords_effects": { token: "type.effect" },
            "@default": { token: "identifier" }
          }
        }
      },
      { regex: /,/, action: { token: "punctuation" } },
      { regex: />/, action: { token: "@rematch", next: "@pop" } }
    ],
    lexing_EXTCODE: [
      {
        regex: /^%}/,
        action: {
          token: "@rematch",
          next: "@pop",
          nextEmbedded: "@pop"
        }
      },
      { regex: /[^%]+/, action: "" }
    ],
    lexing_DQUOTE: [
      { regex: /"/, action: { token: "string.quote", next: "@pop" } },
      {
        regex: /(\{\$)(@IDENTFST@IDENTRST*)(\})/,
        action: [{ token: "string.escape" }, { token: "identifier" }, { token: "string.escape" }]
      },
      { regex: /\\$/, action: { token: "string.escape" } },
      {
        regex: /\\(@ESCHAR|[xX]@xdigit+|@digit+)/,
        action: { token: "string.escape" }
      },
      { regex: /[^\\"]+/, action: { token: "string" } }
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGlhdHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvcG9zdGlhdHMvcG9zdGlhdHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3Bvc3RpYXRzL3Bvc3RpYXRzLnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBsaW5lQ29tbWVudDogXCIvL1wiLFxuICAgIGJsb2NrQ29tbWVudDogW1wiKCpcIiwgXCIqKVwiXVxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdLFxuICAgIFtcIjxcIiwgXCI+XCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9LFxuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIsIG5vdEluOiBbXCJzdHJpbmdcIiwgXCJjb21tZW50XCJdIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9XG4gIF1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIHRva2VuUG9zdGZpeDogXCIucGF0c1wiLFxuICBkZWZhdWx0VG9rZW46IFwiaW52YWxpZFwiLFxuICBrZXl3b3JkczogW1xuICAgIFwiYWJzdHlwZVwiLFxuICAgIFwiYWJzdDB5cGVcIixcbiAgICBcImFic3Byb3BcIixcbiAgICBcImFic3ZpZXdcIixcbiAgICBcImFic3Z0eXBlXCIsXG4gICAgXCJhYnN2aWV3dHlwZVwiLFxuICAgIFwiYWJzdnQweXBlXCIsXG4gICAgXCJhYnN2aWV3dDB5cGVcIixcbiAgICBcImFzXCIsXG4gICAgXCJhbmRcIixcbiAgICBcImFzc3VtZVwiLFxuICAgIFwiYmVnaW5cIixcbiAgICBcImNsYXNzZGVjXCIsXG4gICAgXCJkYXRhc29ydFwiLFxuICAgIFwiZGF0YXR5cGVcIixcbiAgICBcImRhdGFwcm9wXCIsXG4gICAgXCJkYXRhdmlld1wiLFxuICAgIFwiZGF0YXZ0eXBlXCIsXG4gICAgXCJkYXRhdmlld3R5cGVcIixcbiAgICBcImRvXCIsXG4gICAgXCJlbmRcIixcbiAgICBcImV4dGVyblwiLFxuICAgIFwiZXh0eXBlXCIsXG4gICAgXCJleHR2YXJcIixcbiAgICBcImV4Y2VwdGlvblwiLFxuICAgIFwiZm5cIixcbiAgICBcImZueFwiLFxuICAgIFwiZnVuXCIsXG4gICAgXCJwcmZuXCIsXG4gICAgXCJwcmZ1blwiLFxuICAgIFwicHJheGlcIixcbiAgICBcImNhc3RmblwiLFxuICAgIFwiaWZcIixcbiAgICBcInRoZW5cIixcbiAgICBcImVsc2VcIixcbiAgICBcImlmY2FzZVwiLFxuICAgIFwiaW5cIixcbiAgICBcImluZml4XCIsXG4gICAgXCJpbmZpeGxcIixcbiAgICBcImluZml4clwiLFxuICAgIFwicHJlZml4XCIsXG4gICAgXCJwb3N0Zml4XCIsXG4gICAgXCJpbXBsbW50XCIsXG4gICAgXCJpbXBsZW1lbnRcIixcbiAgICBcInByaW1wbG1udFwiLFxuICAgIFwicHJpbXBsZW1lbnRcIixcbiAgICBcImltcG9ydFwiLFxuICAgIFwibGV0XCIsXG4gICAgXCJsb2NhbFwiLFxuICAgIFwibWFjZGVmXCIsXG4gICAgXCJtYWNyb2RlZlwiLFxuICAgIFwibm9uZml4XCIsXG4gICAgXCJzeW1lbGltXCIsXG4gICAgXCJzeW1pbnRyXCIsXG4gICAgXCJvdmVybG9hZFwiLFxuICAgIFwib2ZcIixcbiAgICBcIm9wXCIsXG4gICAgXCJyZWNcIixcbiAgICBcInNpZlwiLFxuICAgIFwic2Nhc2VcIixcbiAgICBcInNvcnRkZWZcIixcbiAgICBcInN0YVwiLFxuICAgIFwic3RhY3N0XCIsXG4gICAgXCJzdGFkZWZcIixcbiAgICBcInN0YXRpY1wiLFxuICAgIFwic3RhbG9hZFwiLFxuICAgIFwiZHlubG9hZFwiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJ0a2luZGVmXCIsXG4gICAgXCJ0eXBlZGVmXCIsXG4gICAgXCJwcm9wZGVmXCIsXG4gICAgXCJ2aWV3ZGVmXCIsXG4gICAgXCJ2dHlwZWRlZlwiLFxuICAgIFwidmlld3R5cGVkZWZcIixcbiAgICBcInBydmFsXCIsXG4gICAgXCJ2YXJcIixcbiAgICBcInBydmFyXCIsXG4gICAgXCJ3aGVuXCIsXG4gICAgXCJ3aGVyZVwiLFxuICAgIFwid2l0aFwiLFxuICAgIFwid2l0aHR5cGVcIixcbiAgICBcIndpdGhwcm9wXCIsXG4gICAgXCJ3aXRodmlld1wiLFxuICAgIFwid2l0aHZ0eXBlXCIsXG4gICAgXCJ3aXRodmlld3R5cGVcIlxuICBdLFxuICBrZXl3b3Jkc19kbHI6IFtcbiAgICBcIiRkZWxheVwiLFxuICAgIFwiJGxkZWxheVwiLFxuICAgIFwiJGFycnBzelwiLFxuICAgIFwiJGFycnB0cnNpemVcIixcbiAgICBcIiRkMmN0eXBlXCIsXG4gICAgXCIkZWZmbWFza1wiLFxuICAgIFwiJGVmZm1hc2tfbnRtXCIsXG4gICAgXCIkZWZmbWFza19leG5cIixcbiAgICBcIiRlZmZtYXNrX3JlZlwiLFxuICAgIFwiJGVmZm1hc2tfd3J0XCIsXG4gICAgXCIkZWZmbWFza19hbGxcIixcbiAgICBcIiRleHRlcm5cIixcbiAgICBcIiRleHRraW5kXCIsXG4gICAgXCIkZXh0eXBlXCIsXG4gICAgXCIkZXh0eXBlX3N0cnVjdFwiLFxuICAgIFwiJGV4dHZhbFwiLFxuICAgIFwiJGV4dGZjYWxsXCIsXG4gICAgXCIkZXh0bWNhbGxcIixcbiAgICBcIiRsaXRlcmFsXCIsXG4gICAgXCIkbXlmaWxlbmFtZVwiLFxuICAgIFwiJG15bG9jYXRpb25cIixcbiAgICBcIiRteWZ1bmN0aW9uXCIsXG4gICAgXCIkbHN0XCIsXG4gICAgXCIkbHN0X3RcIixcbiAgICBcIiRsc3RfdnRcIixcbiAgICBcIiRsaXN0XCIsXG4gICAgXCIkbGlzdF90XCIsXG4gICAgXCIkbGlzdF92dFwiLFxuICAgIFwiJHJlY1wiLFxuICAgIFwiJHJlY190XCIsXG4gICAgXCIkcmVjX3Z0XCIsXG4gICAgXCIkcmVjb3JkXCIsXG4gICAgXCIkcmVjb3JkX3RcIixcbiAgICBcIiRyZWNvcmRfdnRcIixcbiAgICBcIiR0dXBcIixcbiAgICBcIiR0dXBfdFwiLFxuICAgIFwiJHR1cF92dFwiLFxuICAgIFwiJHR1cGxlXCIsXG4gICAgXCIkdHVwbGVfdFwiLFxuICAgIFwiJHR1cGxlX3Z0XCIsXG4gICAgXCIkYnJlYWtcIixcbiAgICBcIiRjb250aW51ZVwiLFxuICAgIFwiJHJhaXNlXCIsXG4gICAgXCIkc2hvd3R5cGVcIixcbiAgICBcIiR2Y29weWVudl92XCIsXG4gICAgXCIkdmNvcHllbnZfdnRcIixcbiAgICBcIiR0ZW1wZW52ZXJcIixcbiAgICBcIiRzb2x2ZXJfYXNzZXJ0XCIsXG4gICAgXCIkc29sdmVyX3ZlcmlmeVwiXG4gIF0sXG4gIGtleXdvcmRzX3NycDogW1xuICAgIFwiI2lmXCIsXG4gICAgXCIjaWZkZWZcIixcbiAgICBcIiNpZm5kZWZcIixcbiAgICBcIiN0aGVuXCIsXG4gICAgXCIjZWxpZlwiLFxuICAgIFwiI2VsaWZkZWZcIixcbiAgICBcIiNlbGlmbmRlZlwiLFxuICAgIFwiI2Vsc2VcIixcbiAgICBcIiNlbmRpZlwiLFxuICAgIFwiI2Vycm9yXCIsXG4gICAgXCIjcHJlcnJcIixcbiAgICBcIiNwcmludFwiLFxuICAgIFwiI2Fzc2VydFwiLFxuICAgIFwiI3VuZGVmXCIsXG4gICAgXCIjZGVmaW5lXCIsXG4gICAgXCIjaW5jbHVkZVwiLFxuICAgIFwiI3JlcXVpcmVcIixcbiAgICBcIiNwcmFnbWFcIixcbiAgICBcIiNjb2RlZ2VuMlwiLFxuICAgIFwiI2NvZGVnZW4zXCJcbiAgXSxcbiAgaXJyZWd1bGFyX2tleXdvcmRfbGlzdDogW1xuICAgIFwidmFsK1wiLFxuICAgIFwidmFsLVwiLFxuICAgIFwidmFsXCIsXG4gICAgXCJjYXNlK1wiLFxuICAgIFwiY2FzZS1cIixcbiAgICBcImNhc2VcIixcbiAgICBcImFkZHJAXCIsXG4gICAgXCJhZGRyXCIsXG4gICAgXCJmb2xkQFwiLFxuICAgIFwiZnJlZUBcIixcbiAgICBcImZpeEBcIixcbiAgICBcImZpeFwiLFxuICAgIFwibGFtQFwiLFxuICAgIFwibGFtXCIsXG4gICAgXCJsbGFtQFwiLFxuICAgIFwibGxhbVwiLFxuICAgIFwidmlld3RAeXBlK1wiLFxuICAgIFwidmlld3RAeXBlLVwiLFxuICAgIFwidmlld3RAeXBlXCIsXG4gICAgXCJ2aWV3dHlwZStcIixcbiAgICBcInZpZXd0eXBlLVwiLFxuICAgIFwidmlld3R5cGVcIixcbiAgICBcInZpZXcrXCIsXG4gICAgXCJ2aWV3LVwiLFxuICAgIFwidmlld0BcIixcbiAgICBcInZpZXdcIixcbiAgICBcInR5cGUrXCIsXG4gICAgXCJ0eXBlLVwiLFxuICAgIFwidHlwZVwiLFxuICAgIFwidnR5cGUrXCIsXG4gICAgXCJ2dHlwZS1cIixcbiAgICBcInZ0eXBlXCIsXG4gICAgXCJ2dEB5cGUrXCIsXG4gICAgXCJ2dEB5cGUtXCIsXG4gICAgXCJ2dEB5cGVcIixcbiAgICBcInZpZXd0QHlwZStcIixcbiAgICBcInZpZXd0QHlwZS1cIixcbiAgICBcInZpZXd0QHlwZVwiLFxuICAgIFwidmlld3R5cGUrXCIsXG4gICAgXCJ2aWV3dHlwZS1cIixcbiAgICBcInZpZXd0eXBlXCIsXG4gICAgXCJwcm9wK1wiLFxuICAgIFwicHJvcC1cIixcbiAgICBcInByb3BcIixcbiAgICBcInR5cGUrXCIsXG4gICAgXCJ0eXBlLVwiLFxuICAgIFwidHlwZVwiLFxuICAgIFwidEB5cGVcIixcbiAgICBcInRAeXBlK1wiLFxuICAgIFwidEB5cGUtXCIsXG4gICAgXCJhYnN0QHlwZVwiLFxuICAgIFwiYWJzdHlwZVwiLFxuICAgIFwiYWJzdmlld3RAeXBlXCIsXG4gICAgXCJhYnN2dEB5cGVcIixcbiAgICBcImZvcipcIixcbiAgICBcImZvclwiLFxuICAgIFwid2hpbGUqXCIsXG4gICAgXCJ3aGlsZVwiXG4gIF0sXG4gIGtleXdvcmRzX3R5cGVzOiBbXG4gICAgXCJib29sXCIsXG4gICAgXCJkb3VibGVcIixcbiAgICBcImJ5dGVcIixcbiAgICBcImludFwiLFxuICAgIFwic2hvcnRcIixcbiAgICBcImNoYXJcIixcbiAgICBcInZvaWRcIixcbiAgICBcInVuaXRcIixcbiAgICBcImxvbmdcIixcbiAgICBcImZsb2F0XCIsXG4gICAgXCJzdHJpbmdcIixcbiAgICBcInN0cnB0clwiXG4gIF0sXG4gIGtleXdvcmRzX2VmZmVjdHM6IFtcbiAgICBcIjBcIixcbiAgICBcImZ1blwiLFxuICAgIFwiY2xvXCIsXG4gICAgXCJwcmZcIixcbiAgICBcImZ1bmNsb1wiLFxuICAgIFwiY2xvcHRyXCIsXG4gICAgXCJjbG9yZWZcIixcbiAgICBcInJlZlwiLFxuICAgIFwibnRtXCIsXG4gICAgXCIxXCJcbiAgXSxcbiAgb3BlcmF0b3JzOiBbXG4gICAgXCJAXCIsXG4gICAgXCIhXCIsXG4gICAgXCJ8XCIsXG4gICAgXCJgXCIsXG4gICAgXCI6XCIsXG4gICAgXCIkXCIsXG4gICAgXCIuXCIsXG4gICAgXCI9XCIsXG4gICAgXCIjXCIsXG4gICAgXCJ+XCIsXG4gICAgXCIuLlwiLFxuICAgIFwiLi4uXCIsXG4gICAgXCI9PlwiLFxuICAgIFwiPTw+XCIsXG4gICAgXCI9Lz0+XCIsXG4gICAgXCI9Pj5cIixcbiAgICBcIj0vPT4+XCIsXG4gICAgXCI8XCIsXG4gICAgXCI+XCIsXG4gICAgXCI+PFwiLFxuICAgIFwiLjxcIixcbiAgICBcIj4uXCIsXG4gICAgXCIuPD4uXCIsXG4gICAgXCItPlwiLFxuICAgIFwiLTw+XCJcbiAgXSxcbiAgYnJhY2tldHM6IFtcbiAgICB7IG9wZW46IFwiLChcIiwgY2xvc2U6IFwiKVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiB9LFxuICAgIHsgb3BlbjogXCJgKFwiLCBjbG9zZTogXCIpXCIsIHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiIH0sXG4gICAgeyBvcGVuOiBcIiUoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwiJyhcIiwgY2xvc2U6IFwiKVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIucGFyZW50aGVzaXNcIiB9LFxuICAgIHsgb3BlbjogXCIne1wiLCBjbG9zZTogXCJ9XCIsIHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiIH0sXG4gICAgeyBvcGVuOiBcIkAoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwiQHtcIiwgY2xvc2U6IFwifVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2VcIiB9LFxuICAgIHsgb3BlbjogXCJAW1wiLCBjbG9zZTogXCJdXCIsIHRva2VuOiBcImRlbGltaXRlci5zcXVhcmVcIiB9LFxuICAgIHsgb3BlbjogXCIjW1wiLCBjbG9zZTogXCJdXCIsIHRva2VuOiBcImRlbGltaXRlci5zcXVhcmVcIiB9LFxuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmN1cmx5XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIsIHRva2VuOiBcImRlbGltaXRlci5zcXVhcmVcIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwiPFwiLCBjbG9zZTogXCI+XCIsIHRva2VuOiBcImRlbGltaXRlci5hbmdsZVwiIH1cbiAgXSxcbiAgc3ltYm9sczogL1s9Pjwhfj86JnwrXFwtKlxcL1xcXiVdKy8sXG4gIElERU5URlNUOiAvW2EtekEtWl9dLyxcbiAgSURFTlRSU1Q6IC9bYS16QS1aMC05XyckXS8sXG4gIHN5bWJvbGljOiAvWyUmKy0uLzo9QH5gXnwqISQjPzw+XS8sXG4gIGRpZ2l0OiAvWzAtOV0vLFxuICBkaWdpdHNlcTA6IC9AZGlnaXQqLyxcbiAgeGRpZ2l0OiAvWzAtOUEtWmEtel0vLFxuICB4ZGlnaXRzZXEwOiAvQHhkaWdpdCovLFxuICBJTlRTUDogL1tsTHVVXS8sXG4gIEZMT0FUU1A6IC9bZkZsTF0vLFxuICBmZXhwb25lbnQ6IC9bZUVdWystXT9bMC05XSsvLFxuICBmZXhwb25lbnRfYmluOiAvW3BQXVsrLV0/WzAtOV0rLyxcbiAgZGVjaWV4cDogL1xcLlswLTldKkBmZXhwb25lbnQ/LyxcbiAgaGV4aWV4cDogL1xcLlswLTlhLXpBLVpdKkBmZXhwb25lbnRfYmluPy8sXG4gIGlycmVndWxhcl9rZXl3b3JkczogL3ZhbFsrLV0/fGNhc2VbKy1dP3xhZGRyXFxAP3xmb2xkXFxAfGZyZWVcXEB8Zml4XFxAP3xsYW1cXEA/fGxsYW1cXEA/fHByb3BbKy1dP3x0eXBlWystXT98dmlld1srLUBdP3x2aWV3dEA/eXBlWystXT98dEA/eXBlWystXT98dihpZXcpP3RAP3lwZVsrLV0/fGFic3RAP3lwZXxhYnN2KGlldyk/dEA/eXBlfGZvclxcKj98d2hpbGVcXCo/LyxcbiAgRVNDSEFSOiAvW250dmJyZmFcXFxcXFw/J1wiXFwoXFxbXFx7XS8sXG4gIHN0YXJ0OiBcInJvb3RcIixcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgeyByZWdleDogL1sgXFx0XFxyXFxuXSsvLCBhY3Rpb246IHsgdG9rZW46IFwiXCIgfSB9LFxuICAgICAgeyByZWdleDogL1xcKFxcKlxcKS8sIGFjdGlvbjogeyB0b2tlbjogXCJpbnZhbGlkXCIgfSB9LFxuICAgICAge1xuICAgICAgICByZWdleDogL1xcKFxcKi8sXG4gICAgICAgIGFjdGlvbjogeyB0b2tlbjogXCJjb21tZW50XCIsIG5leHQ6IFwibGV4aW5nX0NPTU1FTlRfYmxvY2tfbWxcIiB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByZWdleDogL1xcKC8sXG4gICAgICAgIGFjdGlvbjogXCJAYnJhY2tldHNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcmVnZXg6IC9cXCkvLFxuICAgICAgICBhY3Rpb246IFwiQGJyYWNrZXRzXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvXFxbLyxcbiAgICAgICAgYWN0aW9uOiBcIkBicmFja2V0c1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByZWdleDogL1xcXS8sXG4gICAgICAgIGFjdGlvbjogXCJAYnJhY2tldHNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcmVnZXg6IC9cXHsvLFxuICAgICAgICBhY3Rpb246IFwiQGJyYWNrZXRzXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvXFx9LyxcbiAgICAgICAgYWN0aW9uOiBcIkBicmFja2V0c1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByZWdleDogLyxcXCgvLFxuICAgICAgICBhY3Rpb246IFwiQGJyYWNrZXRzXCJcbiAgICAgIH0sXG4gICAgICB7IHJlZ2V4OiAvLC8sIGFjdGlvbjogeyB0b2tlbjogXCJkZWxpbWl0ZXIuY29tbWFcIiB9IH0sXG4gICAgICB7IHJlZ2V4OiAvOy8sIGFjdGlvbjogeyB0b2tlbjogXCJkZWxpbWl0ZXIuc2VtaWNvbG9uXCIgfSB9LFxuICAgICAge1xuICAgICAgICByZWdleDogL0BcXCgvLFxuICAgICAgICBhY3Rpb246IFwiQGJyYWNrZXRzXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvQFxcWy8sXG4gICAgICAgIGFjdGlvbjogXCJAYnJhY2tldHNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcmVnZXg6IC9AXFx7LyxcbiAgICAgICAgYWN0aW9uOiBcIkBicmFja2V0c1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByZWdleDogLzo8LyxcbiAgICAgICAgYWN0aW9uOiB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAbGV4aW5nX0VGRkVDVF9jb21tYXNlcTBcIiB9XG4gICAgICB9LFxuICAgICAgeyByZWdleDogL1xcLkBzeW1ib2xpYysvLCBhY3Rpb246IHsgdG9rZW46IFwiaWRlbnRpZmllci5zeW1cIiB9IH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvXFwuQGRpZ2l0KkBmZXhwb25lbnRARkxPQVRTUCovLFxuICAgICAgICBhY3Rpb246IHsgdG9rZW46IFwibnVtYmVyLmZsb2F0XCIgfVxuICAgICAgfSxcbiAgICAgIHsgcmVnZXg6IC9cXC5AZGlnaXQrLywgYWN0aW9uOiB7IHRva2VuOiBcIm51bWJlci5mbG9hdFwiIH0gfSxcbiAgICAgIHtcbiAgICAgICAgcmVnZXg6IC9cXCRASURFTlRGU1RASURFTlRSU1QqLyxcbiAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzX2RsclwiOiB7IHRva2VuOiBcImtleXdvcmQuZGxyXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJuYW1lc3BhY2VcIiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByZWdleDogL1xcI0BJREVOVEZTVEBJREVOVFJTVCovLFxuICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAa2V5d29yZHNfc3JwXCI6IHsgdG9rZW46IFwia2V5d29yZC5zcnBcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcImlkZW50aWZpZXJcIiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgeyByZWdleDogLyVcXCgvLCBhY3Rpb246IHsgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSB9LFxuICAgICAge1xuICAgICAgICByZWdleDogL14leygjfFxcXnxcXCQpPy8sXG4gICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgIHRva2VuOiBcImtleXdvcmRcIixcbiAgICAgICAgICBuZXh0OiBcIkBsZXhpbmdfRVhUQ09ERVwiLFxuICAgICAgICAgIG5leHRFbWJlZGRlZDogXCJ0ZXh0L2phdmFzY3JpcHRcIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgeyByZWdleDogL14lfS8sIGFjdGlvbjogeyB0b2tlbjogXCJrZXl3b3JkXCIgfSB9LFxuICAgICAgeyByZWdleDogLydcXCgvLCBhY3Rpb246IHsgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSB9LFxuICAgICAgeyByZWdleDogLydcXFsvLCBhY3Rpb246IHsgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXRcIiB9IH0sXG4gICAgICB7IHJlZ2V4OiAvJ1xcey8sIGFjdGlvbjogeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2VcIiB9IH0sXG4gICAgICBbLygnKShcXFxcQEVTQ0hBUnxcXFxcW3hYXUB4ZGlnaXQrfFxcXFxAZGlnaXQrKSgnKS8sIFtcInN0cmluZ1wiLCBcInN0cmluZy5lc2NhcGVcIiwgXCJzdHJpbmdcIl1dLFxuICAgICAgWy8nW15cXFxcJ10nLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmcucXVvdGVcIiwgXCJAbGV4aW5nX0RRVU9URVwiXSxcbiAgICAgIHtcbiAgICAgICAgcmVnZXg6IC9gXFwoLyxcbiAgICAgICAgYWN0aW9uOiBcIkBicmFja2V0c1wiXG4gICAgICB9LFxuICAgICAgeyByZWdleDogL1xcXFwvLCBhY3Rpb246IHsgdG9rZW46IFwicHVuY3R1YXRpb25cIiB9IH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvQGlycmVndWxhcl9rZXl3b3Jkcyg/IUBJREVOVFJTVCkvLFxuICAgICAgICBhY3Rpb246IHsgdG9rZW46IFwia2V5d29yZFwiIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvQElERU5URlNUQElERU5UUlNUKls8IVxcW10/LyxcbiAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZFwiIH0sXG4gICAgICAgICAgICBcIkBrZXl3b3Jkc190eXBlc1wiOiB7IHRva2VuOiBcInR5cGVcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcImlkZW50aWZpZXJcIiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByZWdleDogL1xcL1xcL1xcL1xcLy8sXG4gICAgICAgIGFjdGlvbjogeyB0b2tlbjogXCJjb21tZW50XCIsIG5leHQ6IFwiQGxleGluZ19DT01NRU5UX3Jlc3RcIiB9XG4gICAgICB9LFxuICAgICAgeyByZWdleDogL1xcL1xcLy4qJC8sIGFjdGlvbjogeyB0b2tlbjogXCJjb21tZW50XCIgfSB9LFxuICAgICAge1xuICAgICAgICByZWdleDogL1xcL1xcKi8sXG4gICAgICAgIGFjdGlvbjogeyB0b2tlbjogXCJjb21tZW50XCIsIG5leHQ6IFwiQGxleGluZ19DT01NRU5UX2Jsb2NrX2NcIiB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByZWdleDogLy08fD08LyxcbiAgICAgICAgYWN0aW9uOiB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAbGV4aW5nX0VGRkVDVF9jb21tYXNlcTBcIiB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByZWdleDogL0BzeW1ib2xpYysvLFxuICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAb3BlcmF0b3JzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcIm9wZXJhdG9yXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvMFt4WF1AeGRpZ2l0KyhAaGV4aWV4cHxAZmV4cG9uZW50X2JpbilARkxPQVRTUCovLFxuICAgICAgICBhY3Rpb246IHsgdG9rZW46IFwibnVtYmVyLmZsb2F0XCIgfVxuICAgICAgfSxcbiAgICAgIHsgcmVnZXg6IC8wW3hYXUB4ZGlnaXQrQElOVFNQKi8sIGFjdGlvbjogeyB0b2tlbjogXCJudW1iZXIuaGV4XCIgfSB9LFxuICAgICAge1xuICAgICAgICByZWdleDogLzBbMC03XSsoPyFbMC05XSlASU5UU1AqLyxcbiAgICAgICAgYWN0aW9uOiB7IHRva2VuOiBcIm51bWJlci5vY3RhbFwiIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvQGRpZ2l0KyhAZmV4cG9uZW50fEBkZWNpZXhwKUBGTE9BVFNQKi8sXG4gICAgICAgIGFjdGlvbjogeyB0b2tlbjogXCJudW1iZXIuZmxvYXRcIiB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByZWdleDogL0BkaWdpdEBkaWdpdHNlcTBASU5UU1AqLyxcbiAgICAgICAgYWN0aW9uOiB7IHRva2VuOiBcIm51bWJlci5kZWNpbWFsXCIgfVxuICAgICAgfSxcbiAgICAgIHsgcmVnZXg6IC9AZGlnaXQrQElOVFNQKi8sIGFjdGlvbjogeyB0b2tlbjogXCJudW1iZXJcIiB9IH1cbiAgICBdLFxuICAgIGxleGluZ19DT01NRU5UX2Jsb2NrX21sOiBbXG4gICAgICBbL1teXFwoXFwqXSsvLCBcImNvbW1lbnRcIl0sXG4gICAgICBbL1xcKFxcKi8sIFwiY29tbWVudFwiLCBcIkBwdXNoXCJdLFxuICAgICAgWy9cXChcXCovLCBcImNvbW1lbnQuaW52YWxpZFwiXSxcbiAgICAgIFsvXFwqXFwpLywgXCJjb21tZW50XCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvXFwqLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBsZXhpbmdfQ09NTUVOVF9ibG9ja19jOiBbXG4gICAgICBbL1teXFwvKl0rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9bXFwvKl0vLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIGxleGluZ19DT01NRU5UX3Jlc3Q6IFtcbiAgICAgIFsvJC8sIFwiY29tbWVudFwiLCBcIkBwb3BcIl0sXG4gICAgICBbLy4qLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBsZXhpbmdfRUZGRUNUX2NvbW1hc2VxMDogW1xuICAgICAge1xuICAgICAgICByZWdleDogL0BJREVOVEZTVEBJREVOVFJTVCt8QGRpZ2l0Ky8sXG4gICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBrZXl3b3Jkc19lZmZlY3RzXCI6IHsgdG9rZW46IFwidHlwZS5lZmZlY3RcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcImlkZW50aWZpZXJcIiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgeyByZWdleDogLywvLCBhY3Rpb246IHsgdG9rZW46IFwicHVuY3R1YXRpb25cIiB9IH0sXG4gICAgICB7IHJlZ2V4OiAvPi8sIGFjdGlvbjogeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBwb3BcIiB9IH1cbiAgICBdLFxuICAgIGxleGluZ19FWFRDT0RFOiBbXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvXiV9LyxcbiAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgdG9rZW46IFwiQHJlbWF0Y2hcIixcbiAgICAgICAgICBuZXh0OiBcIkBwb3BcIixcbiAgICAgICAgICBuZXh0RW1iZWRkZWQ6IFwiQHBvcFwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7IHJlZ2V4OiAvW14lXSsvLCBhY3Rpb246IFwiXCIgfVxuICAgIF0sXG4gICAgbGV4aW5nX0RRVU9URTogW1xuICAgICAgeyByZWdleDogL1wiLywgYWN0aW9uOiB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBuZXh0OiBcIkBwb3BcIiB9IH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvKFxce1xcJCkoQElERU5URlNUQElERU5UUlNUKikoXFx9KS8sXG4gICAgICAgIGFjdGlvbjogW3sgdG9rZW46IFwic3RyaW5nLmVzY2FwZVwiIH0sIHsgdG9rZW46IFwiaWRlbnRpZmllclwiIH0sIHsgdG9rZW46IFwic3RyaW5nLmVzY2FwZVwiIH1dXG4gICAgICB9LFxuICAgICAgeyByZWdleDogL1xcXFwkLywgYWN0aW9uOiB7IHRva2VuOiBcInN0cmluZy5lc2NhcGVcIiB9IH0sXG4gICAgICB7XG4gICAgICAgIHJlZ2V4OiAvXFxcXChARVNDSEFSfFt4WF1AeGRpZ2l0K3xAZGlnaXQrKS8sXG4gICAgICAgIGFjdGlvbjogeyB0b2tlbjogXCJzdHJpbmcuZXNjYXBlXCIgfVxuICAgICAgfSxcbiAgICAgIHsgcmVnZXg6IC9bXlxcXFxcIl0rLywgYWN0aW9uOiB7IHRva2VuOiBcInN0cmluZ1wiIH0gfVxuICAgIF1cbiAgfVxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFHLElBQUMsT0FBTztBQUFBLEVBQ1QsVUFBVTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsY0FBYyxDQUFDLE1BQU0sSUFBSTtBQUFBLEVBQzFCO0FBQUEsRUFDRCxVQUFVO0FBQUEsSUFDUixDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsVUFBVSxTQUFTLEVBQUc7QUFBQSxJQUN2RCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFVBQVUsU0FBUyxFQUFHO0FBQUEsSUFDdkQsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sQ0FBQyxVQUFVLFNBQVMsRUFBRztBQUFBLElBQ3ZELEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsVUFBVSxTQUFTLEVBQUc7QUFBQSxFQUN4RDtBQUNIO0FBQ0csSUFBQyxXQUFXO0FBQUEsRUFDYixjQUFjO0FBQUEsRUFDZCxjQUFjO0FBQUEsRUFDZCxVQUFVO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELGNBQWM7QUFBQSxJQUNaO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsY0FBYztBQUFBLElBQ1o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0Qsd0JBQXdCO0FBQUEsSUFDdEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxnQkFBZ0I7QUFBQSxJQUNkO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELFdBQVc7QUFBQSxJQUNUO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsRUFBRSxNQUFNLE1BQU0sT0FBTyxLQUFLLE9BQU8sd0JBQXlCO0FBQUEsSUFDMUQsRUFBRSxNQUFNLE1BQU0sT0FBTyxLQUFLLE9BQU8sd0JBQXlCO0FBQUEsSUFDMUQsRUFBRSxNQUFNLE1BQU0sT0FBTyxLQUFLLE9BQU8sd0JBQXlCO0FBQUEsSUFDMUQsRUFBRSxNQUFNLE1B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
