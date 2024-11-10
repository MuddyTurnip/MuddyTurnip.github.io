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
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "'", close: "'" },
    { open: '"', close: '"' }
  ],
  autoClosingPairs: [
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["comment"] },
    { open: '"""', close: '"""' },
    { open: "`", close: "`", notIn: ["string", "comment"] },
    { open: "(", close: ")" },
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "<<", close: ">>" }
  ],
  indentationRules: {
    increaseIndentPattern: /^\s*(after|else|catch|rescue|fn|[^#]*(do|<\-|\->|\{|\[|\=))\s*$/,
    decreaseIndentPattern: /^\s*((\}|\])\s*$|(after|else|catch|rescue|end)\b)/
  }
};
var language = {
  defaultToken: "source",
  tokenPostfix: ".elixir",
  brackets: [
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "<<", close: ">>", token: "delimiter.angle.special" }
  ],
  declarationKeywords: [
    "def",
    "defp",
    "defn",
    "defnp",
    "defguard",
    "defguardp",
    "defmacro",
    "defmacrop",
    "defdelegate",
    "defcallback",
    "defmacrocallback",
    "defmodule",
    "defprotocol",
    "defexception",
    "defimpl",
    "defstruct"
  ],
  operatorKeywords: ["and", "in", "not", "or", "when"],
  namespaceKeywords: ["alias", "import", "require", "use"],
  otherKeywords: [
    "after",
    "case",
    "catch",
    "cond",
    "do",
    "else",
    "end",
    "fn",
    "for",
    "if",
    "quote",
    "raise",
    "receive",
    "rescue",
    "super",
    "throw",
    "try",
    "unless",
    "unquote_splicing",
    "unquote",
    "with"
  ],
  constants: ["true", "false", "nil"],
  nameBuiltin: ["__MODULE__", "__DIR__", "__ENV__", "__CALLER__", "__STACKTRACE__"],
  operator: /-[->]?|!={0,2}|\*{1,2}|\/|\\\\|&{1,3}|\.\.?|\^(?:\^\^)?|\+\+?|<(?:-|<<|=|>|\|>|~>?)?|=~|={1,3}|>(?:=|>>)?|\|~>|\|>|\|{1,3}|~>>?|~~~|::/,
  variableName: /[a-z_][a-zA-Z0-9_]*[?!]?/,
  atomName: /[a-zA-Z_][a-zA-Z0-9_@]*[?!]?|@specialAtomName|@operator/,
  specialAtomName: /\.\.\.|<<>>|%\{\}|%|\{\}/,
  aliasPart: /[A-Z][a-zA-Z0-9_]*/,
  moduleName: /@aliasPart(?:\.@aliasPart)*/,
  sigilSymmetricDelimiter: /"""|'''|"|'|\/|\|/,
  sigilStartDelimiter: /@sigilSymmetricDelimiter|<|\{|\[|\(/,
  sigilEndDelimiter: /@sigilSymmetricDelimiter|>|\}|\]|\)/,
  sigilModifiers: /[a-zA-Z0-9]*/,
  decimal: /\d(?:_?\d)*/,
  hex: /[0-9a-fA-F](_?[0-9a-fA-F])*/,
  octal: /[0-7](_?[0-7])*/,
  binary: /[01](_?[01])*/,
  escape: /\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}|\\./,
  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@comments" },
      { include: "@keywordsShorthand" },
      { include: "@numbers" },
      { include: "@identifiers" },
      { include: "@strings" },
      { include: "@atoms" },
      { include: "@sigils" },
      { include: "@attributes" },
      { include: "@symbols" }
    ],
    whitespace: [[/\s+/, "white"]],
    comments: [[/(#)(.*)/, ["comment.punctuation", "comment"]]],
    keywordsShorthand: [
      [/(@atomName)(:)(\s+)/, ["constant", "constant.punctuation", "white"]],
      [
        /"(?=([^"]|#\{.*?\}|\\")*":)/,
        { token: "constant.delimiter", next: "@doubleQuotedStringKeyword" }
      ],
      [
        /'(?=([^']|#\{.*?\}|\\')*':)/,
        { token: "constant.delimiter", next: "@singleQuotedStringKeyword" }
      ]
    ],
    doubleQuotedStringKeyword: [
      [/":/, { token: "constant.delimiter", next: "@pop" }],
      { include: "@stringConstantContentInterpol" }
    ],
    singleQuotedStringKeyword: [
      [/':/, { token: "constant.delimiter", next: "@pop" }],
      { include: "@stringConstantContentInterpol" }
    ],
    numbers: [
      [/0b@binary/, "number.binary"],
      [/0o@octal/, "number.octal"],
      [/0x@hex/, "number.hex"],
      [/@decimal\.@decimal([eE]-?@decimal)?/, "number.float"],
      [/@decimal/, "number"]
    ],
    identifiers: [
      [
        /\b(defp?|defnp?|defmacrop?|defguardp?|defdelegate)(\s+)(@variableName)(?!\s+@operator)/,
        [
          "keyword.declaration",
          "white",
          {
            cases: {
              unquote: "keyword",
              "@default": "function"
            }
          }
        ]
      ],
      [
        /(@variableName)(?=\s*\.?\s*\()/,
        {
          cases: {
            "@declarationKeywords": "keyword.declaration",
            "@namespaceKeywords": "keyword",
            "@otherKeywords": "keyword",
            "@default": "function.call"
          }
        }
      ],
      [
        /(@moduleName)(\s*)(\.)(\s*)(@variableName)/,
        ["type.identifier", "white", "operator", "white", "function.call"]
      ],
      [
        /(:)(@atomName)(\s*)(\.)(\s*)(@variableName)/,
        ["constant.punctuation", "constant", "white", "operator", "white", "function.call"]
      ],
      [
        /(\|>)(\s*)(@variableName)/,
        [
          "operator",
          "white",
          {
            cases: {
              "@otherKeywords": "keyword",
              "@default": "function.call"
            }
          }
        ]
      ],
      [
        /(&)(\s*)(@variableName)/,
        ["operator", "white", "function.call"]
      ],
      [
        /@variableName/,
        {
          cases: {
            "@declarationKeywords": "keyword.declaration",
            "@operatorKeywords": "keyword.operator",
            "@namespaceKeywords": "keyword",
            "@otherKeywords": "keyword",
            "@constants": "constant.language",
            "@nameBuiltin": "variable.language",
            "_.*": "comment.unused",
            "@default": "identifier"
          }
        }
      ],
      [/@moduleName/, "type.identifier"]
    ],
    strings: [
      [/"""/, { token: "string.delimiter", next: "@doubleQuotedHeredoc" }],
      [/'''/, { token: "string.delimiter", next: "@singleQuotedHeredoc" }],
      [/"/, { token: "string.delimiter", next: "@doubleQuotedString" }],
      [/'/, { token: "string.delimiter", next: "@singleQuotedString" }]
    ],
    doubleQuotedHeredoc: [
      [/"""/, { token: "string.delimiter", next: "@pop" }],
      { include: "@stringContentInterpol" }
    ],
    singleQuotedHeredoc: [
      [/'''/, { token: "string.delimiter", next: "@pop" }],
      { include: "@stringContentInterpol" }
    ],
    doubleQuotedString: [
      [/"/, { token: "string.delimiter", next: "@pop" }],
      { include: "@stringContentInterpol" }
    ],
    singleQuotedString: [
      [/'/, { token: "string.delimiter", next: "@pop" }],
      { include: "@stringContentInterpol" }
    ],
    atoms: [
      [/(:)(@atomName)/, ["constant.punctuation", "constant"]],
      [/:"/, { token: "constant.delimiter", next: "@doubleQuotedStringAtom" }],
      [/:'/, { token: "constant.delimiter", next: "@singleQuotedStringAtom" }]
    ],
    doubleQuotedStringAtom: [
      [/"/, { token: "constant.delimiter", next: "@pop" }],
      { include: "@stringConstantContentInterpol" }
    ],
    singleQuotedStringAtom: [
      [/'/, { token: "constant.delimiter", next: "@pop" }],
      { include: "@stringConstantContentInterpol" }
    ],
    sigils: [
      [/~[a-z]@sigilStartDelimiter/, { token: "@rematch", next: "@sigil.interpol" }],
      [/~([A-Z]+)@sigilStartDelimiter/, { token: "@rematch", next: "@sigil.noInterpol" }]
    ],
    sigil: [
      [/~([a-z]|[A-Z]+)\{/, { token: "@rematch", switchTo: "@sigilStart.$S2.$1.{.}" }],
      [/~([a-z]|[A-Z]+)\[/, { token: "@rematch", switchTo: "@sigilStart.$S2.$1.[.]" }],
      [/~([a-z]|[A-Z]+)\(/, { token: "@rematch", switchTo: "@sigilStart.$S2.$1.(.)" }],
      [/~([a-z]|[A-Z]+)\</, { token: "@rematch", switchTo: "@sigilStart.$S2.$1.<.>" }],
      [
        /~([a-z]|[A-Z]+)(@sigilSymmetricDelimiter)/,
        { token: "@rematch", switchTo: "@sigilStart.$S2.$1.$2.$2" }
      ]
    ],
    "sigilStart.interpol.s": [
      [
        /~s@sigilStartDelimiter/,
        {
          token: "string.delimiter",
          switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
        }
      ]
    ],
    "sigilContinue.interpol.s": [
      [
        /(@sigilEndDelimiter)@sigilModifiers/,
        {
          cases: {
            "$1==$S5": { token: "string.delimiter", next: "@pop" },
            "@default": "string"
          }
        }
      ],
      { include: "@stringContentInterpol" }
    ],
    "sigilStart.noInterpol.S": [
      [
        /~S@sigilStartDelimiter/,
        {
          token: "string.delimiter",
          switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
        }
      ]
    ],
    "sigilContinue.noInterpol.S": [
      [/(^|[^\\])\\@sigilEndDelimiter/, "string"],
      [
        /(@sigilEndDelimiter)@sigilModifiers/,
        {
          cases: {
            "$1==$S5": { token: "string.delimiter", next: "@pop" },
            "@default": "string"
          }
        }
      ],
      { include: "@stringContent" }
    ],
    "sigilStart.interpol.r": [
      [
        /~r@sigilStartDelimiter/,
        {
          token: "regexp.delimiter",
          switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
        }
      ]
    ],
    "sigilContinue.interpol.r": [
      [
        /(@sigilEndDelimiter)@sigilModifiers/,
        {
          cases: {
            "$1==$S5": { token: "regexp.delimiter", next: "@pop" },
            "@default": "regexp"
          }
        }
      ],
      { include: "@regexpContentInterpol" }
    ],
    "sigilStart.noInterpol.R": [
      [
        /~R@sigilStartDelimiter/,
        {
          token: "regexp.delimiter",
          switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
        }
      ]
    ],
    "sigilContinue.noInterpol.R": [
      [/(^|[^\\])\\@sigilEndDelimiter/, "regexp"],
      [
        /(@sigilEndDelimiter)@sigilModifiers/,
        {
          cases: {
            "$1==$S5": { token: "regexp.delimiter", next: "@pop" },
            "@default": "regexp"
          }
        }
      ],
      { include: "@regexpContent" }
    ],
    "sigilStart.interpol": [
      [
        /~([a-z]|[A-Z]+)@sigilStartDelimiter/,
        {
          token: "sigil.delimiter",
          switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
        }
      ]
    ],
    "sigilContinue.interpol": [
      [
        /(@sigilEndDelimiter)@sigilModifiers/,
        {
          cases: {
            "$1==$S5": { token: "sigil.delimiter", next: "@pop" },
            "@default": "sigil"
          }
        }
      ],
      { include: "@sigilContentInterpol" }
    ],
    "sigilStart.noInterpol": [
      [
        /~([a-z]|[A-Z]+)@sigilStartDelimiter/,
        {
          token: "sigil.delimiter",
          switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
        }
      ]
    ],
    "sigilContinue.noInterpol": [
      [/(^|[^\\])\\@sigilEndDelimiter/, "sigil"],
      [
        /(@sigilEndDelimiter)@sigilModifiers/,
        {
          cases: {
            "$1==$S5": { token: "sigil.delimiter", next: "@pop" },
            "@default": "sigil"
          }
        }
      ],
      { include: "@sigilContent" }
    ],
    attributes: [
      [
        /\@(module|type)?doc (~[sS])?"""/,
        {
          token: "comment.block.documentation",
          next: "@doubleQuotedHeredocDocstring"
        }
      ],
      [
        /\@(module|type)?doc (~[sS])?'''/,
        {
          token: "comment.block.documentation",
          next: "@singleQuotedHeredocDocstring"
        }
      ],
      [
        /\@(module|type)?doc (~[sS])?"/,
        {
          token: "comment.block.documentation",
          next: "@doubleQuotedStringDocstring"
        }
      ],
      [
        /\@(module|type)?doc (~[sS])?'/,
        {
          token: "comment.block.documentation",
          next: "@singleQuotedStringDocstring"
        }
      ],
      [/\@(module|type)?doc false/, "comment.block.documentation"],
      [/\@(@variableName)/, "variable"]
    ],
    doubleQuotedHeredocDocstring: [
      [/"""/, { token: "comment.block.documentation", next: "@pop" }],
      { include: "@docstringContent" }
    ],
    singleQuotedHeredocDocstring: [
      [/'''/, { token: "comment.block.documentation", next: "@pop" }],
      { include: "@docstringContent" }
    ],
    doubleQuotedStringDocstring: [
      [/"/, { token: "comment.block.documentation", next: "@pop" }],
      { include: "@docstringContent" }
    ],
    singleQuotedStringDocstring: [
      [/'/, { token: "comment.block.documentation", next: "@pop" }],
      { include: "@docstringContent" }
    ],
    symbols: [
      [/\?(\\.|[^\\\s])/, "number.constant"],
      [/&\d+/, "operator"],
      [/<<<|>>>/, "operator"],
      [/[()\[\]\{\}]|<<|>>/, "@brackets"],
      [/\.\.\./, "identifier"],
      [/=>/, "punctuation"],
      [/@operator/, "operator"],
      [/[:;,.%]/, "punctuation"]
    ],
    stringContentInterpol: [
      { include: "@interpolation" },
      { include: "@escapeChar" },
      { include: "@stringContent" }
    ],
    stringContent: [[/./, "string"]],
    stringConstantContentInterpol: [
      { include: "@interpolation" },
      { include: "@escapeChar" },
      { include: "@stringConstantContent" }
    ],
    stringConstantContent: [[/./, "constant"]],
    regexpContentInterpol: [
      { include: "@interpolation" },
      { include: "@escapeChar" },
      { include: "@regexpContent" }
    ],
    regexpContent: [
      [/(\s)(#)(\s.*)$/, ["white", "comment.punctuation", "comment"]],
      [/./, "regexp"]
    ],
    sigilContentInterpol: [
      { include: "@interpolation" },
      { include: "@escapeChar" },
      { include: "@sigilContent" }
    ],
    sigilContent: [[/./, "sigil"]],
    docstringContent: [[/./, "comment.block.documentation"]],
    escapeChar: [[/@escape/, "constant.character.escape"]],
    interpolation: [[/#{/, { token: "delimiter.bracket.embed", next: "@interpolationContinue" }]],
    interpolationContinue: [
      [/}/, { token: "delimiter.bracket.embed", next: "@pop" }],
      { include: "@root" }
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxpeGlyLmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL2VsaXhpci9lbGl4aXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2VsaXhpci9lbGl4aXIudHNcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIiNcIlxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdXG4gIF0sXG4gIHN1cnJvdW5kaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInLCBub3RJbjogW1wiY29tbWVudFwiXSB9LFxuICAgIHsgb3BlbjogJ1wiXCJcIicsIGNsb3NlOiAnXCJcIlwiJyB9LFxuICAgIHsgb3BlbjogXCJgXCIsIGNsb3NlOiBcImBcIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiPDxcIiwgY2xvc2U6IFwiPj5cIiB9XG4gIF0sXG4gIGluZGVudGF0aW9uUnVsZXM6IHtcbiAgICBpbmNyZWFzZUluZGVudFBhdHRlcm46IC9eXFxzKihhZnRlcnxlbHNlfGNhdGNofHJlc2N1ZXxmbnxbXiNdKihkb3w8XFwtfFxcLT58XFx7fFxcW3xcXD0pKVxccyokLyxcbiAgICBkZWNyZWFzZUluZGVudFBhdHRlcm46IC9eXFxzKigoXFx9fFxcXSlcXHMqJHwoYWZ0ZXJ8ZWxzZXxjYXRjaHxyZXNjdWV8ZW5kKVxcYikvXG4gIH1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJzb3VyY2VcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5lbGl4aXJcIixcbiAgYnJhY2tldHM6IFtcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIsIHRva2VuOiBcImRlbGltaXRlci5zcXVhcmVcIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIsIHRva2VuOiBcImRlbGltaXRlci5jdXJseVwiIH0sXG4gICAgeyBvcGVuOiBcIjw8XCIsIGNsb3NlOiBcIj4+XCIsIHRva2VuOiBcImRlbGltaXRlci5hbmdsZS5zcGVjaWFsXCIgfVxuICBdLFxuICBkZWNsYXJhdGlvbktleXdvcmRzOiBbXG4gICAgXCJkZWZcIixcbiAgICBcImRlZnBcIixcbiAgICBcImRlZm5cIixcbiAgICBcImRlZm5wXCIsXG4gICAgXCJkZWZndWFyZFwiLFxuICAgIFwiZGVmZ3VhcmRwXCIsXG4gICAgXCJkZWZtYWNyb1wiLFxuICAgIFwiZGVmbWFjcm9wXCIsXG4gICAgXCJkZWZkZWxlZ2F0ZVwiLFxuICAgIFwiZGVmY2FsbGJhY2tcIixcbiAgICBcImRlZm1hY3JvY2FsbGJhY2tcIixcbiAgICBcImRlZm1vZHVsZVwiLFxuICAgIFwiZGVmcHJvdG9jb2xcIixcbiAgICBcImRlZmV4Y2VwdGlvblwiLFxuICAgIFwiZGVmaW1wbFwiLFxuICAgIFwiZGVmc3RydWN0XCJcbiAgXSxcbiAgb3BlcmF0b3JLZXl3b3JkczogW1wiYW5kXCIsIFwiaW5cIiwgXCJub3RcIiwgXCJvclwiLCBcIndoZW5cIl0sXG4gIG5hbWVzcGFjZUtleXdvcmRzOiBbXCJhbGlhc1wiLCBcImltcG9ydFwiLCBcInJlcXVpcmVcIiwgXCJ1c2VcIl0sXG4gIG90aGVyS2V5d29yZHM6IFtcbiAgICBcImFmdGVyXCIsXG4gICAgXCJjYXNlXCIsXG4gICAgXCJjYXRjaFwiLFxuICAgIFwiY29uZFwiLFxuICAgIFwiZG9cIixcbiAgICBcImVsc2VcIixcbiAgICBcImVuZFwiLFxuICAgIFwiZm5cIixcbiAgICBcImZvclwiLFxuICAgIFwiaWZcIixcbiAgICBcInF1b3RlXCIsXG4gICAgXCJyYWlzZVwiLFxuICAgIFwicmVjZWl2ZVwiLFxuICAgIFwicmVzY3VlXCIsXG4gICAgXCJzdXBlclwiLFxuICAgIFwidGhyb3dcIixcbiAgICBcInRyeVwiLFxuICAgIFwidW5sZXNzXCIsXG4gICAgXCJ1bnF1b3RlX3NwbGljaW5nXCIsXG4gICAgXCJ1bnF1b3RlXCIsXG4gICAgXCJ3aXRoXCJcbiAgXSxcbiAgY29uc3RhbnRzOiBbXCJ0cnVlXCIsIFwiZmFsc2VcIiwgXCJuaWxcIl0sXG4gIG5hbWVCdWlsdGluOiBbXCJfX01PRFVMRV9fXCIsIFwiX19ESVJfX1wiLCBcIl9fRU5WX19cIiwgXCJfX0NBTExFUl9fXCIsIFwiX19TVEFDS1RSQUNFX19cIl0sXG4gIG9wZXJhdG9yOiAvLVstPl0/fCE9ezAsMn18XFwqezEsMn18XFwvfFxcXFxcXFxcfCZ7MSwzfXxcXC5cXC4/fFxcXig/OlxcXlxcXik/fFxcK1xcKz98PCg/Oi18PDx8PXw+fFxcfD58fj4/KT98PX58PXsxLDN9fD4oPzo9fD4+KT98XFx8fj58XFx8PnxcXHx7MSwzfXx+Pj4/fH5+fnw6Oi8sXG4gIHZhcmlhYmxlTmFtZTogL1thLXpfXVthLXpBLVowLTlfXSpbPyFdPy8sXG4gIGF0b21OYW1lOiAvW2EtekEtWl9dW2EtekEtWjAtOV9AXSpbPyFdP3xAc3BlY2lhbEF0b21OYW1lfEBvcGVyYXRvci8sXG4gIHNwZWNpYWxBdG9tTmFtZTogL1xcLlxcLlxcLnw8PD4+fCVcXHtcXH18JXxcXHtcXH0vLFxuICBhbGlhc1BhcnQ6IC9bQS1aXVthLXpBLVowLTlfXSovLFxuICBtb2R1bGVOYW1lOiAvQGFsaWFzUGFydCg/OlxcLkBhbGlhc1BhcnQpKi8sXG4gIHNpZ2lsU3ltbWV0cmljRGVsaW1pdGVyOiAvXCJcIlwifCcnJ3xcInwnfFxcL3xcXHwvLFxuICBzaWdpbFN0YXJ0RGVsaW1pdGVyOiAvQHNpZ2lsU3ltbWV0cmljRGVsaW1pdGVyfDx8XFx7fFxcW3xcXCgvLFxuICBzaWdpbEVuZERlbGltaXRlcjogL0BzaWdpbFN5bW1ldHJpY0RlbGltaXRlcnw+fFxcfXxcXF18XFwpLyxcbiAgc2lnaWxNb2RpZmllcnM6IC9bYS16QS1aMC05XSovLFxuICBkZWNpbWFsOiAvXFxkKD86Xz9cXGQpKi8sXG4gIGhleDogL1swLTlhLWZBLUZdKF8/WzAtOWEtZkEtRl0pKi8sXG4gIG9jdGFsOiAvWzAtN10oXz9bMC03XSkqLyxcbiAgYmluYXJ5OiAvWzAxXShfP1swMV0pKi8sXG4gIGVzY2FwZTogL1xcXFx1WzAtOWEtZkEtRl17NH18XFxcXHhbMC05YS1mQS1GXXsyfXxcXFxcLi8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbW1lbnRzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAa2V5d29yZHNTaG9ydGhhbmRcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBudW1iZXJzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAaWRlbnRpZmllcnNcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBzdHJpbmdzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAYXRvbXNcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBzaWdpbHNcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBhdHRyaWJ1dGVzXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAc3ltYm9sc1wiIH1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtbL1xccysvLCBcIndoaXRlXCJdXSxcbiAgICBjb21tZW50czogW1svKCMpKC4qKS8sIFtcImNvbW1lbnQucHVuY3R1YXRpb25cIiwgXCJjb21tZW50XCJdXV0sXG4gICAga2V5d29yZHNTaG9ydGhhbmQ6IFtcbiAgICAgIFsvKEBhdG9tTmFtZSkoOikoXFxzKykvLCBbXCJjb25zdGFudFwiLCBcImNvbnN0YW50LnB1bmN0dWF0aW9uXCIsIFwid2hpdGVcIl1dLFxuICAgICAgW1xuICAgICAgICAvXCIoPz0oW15cIl18I1xcey4qP1xcfXxcXFxcXCIpKlwiOikvLFxuICAgICAgICB7IHRva2VuOiBcImNvbnN0YW50LmRlbGltaXRlclwiLCBuZXh0OiBcIkBkb3VibGVRdW90ZWRTdHJpbmdLZXl3b3JkXCIgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLycoPz0oW14nXXwjXFx7Lio/XFx9fFxcXFwnKSonOikvLFxuICAgICAgICB7IHRva2VuOiBcImNvbnN0YW50LmRlbGltaXRlclwiLCBuZXh0OiBcIkBzaW5nbGVRdW90ZWRTdHJpbmdLZXl3b3JkXCIgfVxuICAgICAgXVxuICAgIF0sXG4gICAgZG91YmxlUXVvdGVkU3RyaW5nS2V5d29yZDogW1xuICAgICAgWy9cIjovLCB7IHRva2VuOiBcImNvbnN0YW50LmRlbGltaXRlclwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIHsgaW5jbHVkZTogXCJAc3RyaW5nQ29uc3RhbnRDb250ZW50SW50ZXJwb2xcIiB9XG4gICAgXSxcbiAgICBzaW5nbGVRdW90ZWRTdHJpbmdLZXl3b3JkOiBbXG4gICAgICBbLyc6LywgeyB0b2tlbjogXCJjb25zdGFudC5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ0NvbnN0YW50Q29udGVudEludGVycG9sXCIgfVxuICAgIF0sXG4gICAgbnVtYmVyczogW1xuICAgICAgWy8wYkBiaW5hcnkvLCBcIm51bWJlci5iaW5hcnlcIl0sXG4gICAgICBbLzBvQG9jdGFsLywgXCJudW1iZXIub2N0YWxcIl0sXG4gICAgICBbLzB4QGhleC8sIFwibnVtYmVyLmhleFwiXSxcbiAgICAgIFsvQGRlY2ltYWxcXC5AZGVjaW1hbChbZUVdLT9AZGVjaW1hbCk/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbL0BkZWNpbWFsLywgXCJudW1iZXJcIl1cbiAgICBdLFxuICAgIGlkZW50aWZpZXJzOiBbXG4gICAgICBbXG4gICAgICAgIC9cXGIoZGVmcD98ZGVmbnA/fGRlZm1hY3JvcD98ZGVmZ3VhcmRwP3xkZWZkZWxlZ2F0ZSkoXFxzKykoQHZhcmlhYmxlTmFtZSkoPyFcXHMrQG9wZXJhdG9yKS8sXG4gICAgICAgIFtcbiAgICAgICAgICBcImtleXdvcmQuZGVjbGFyYXRpb25cIixcbiAgICAgICAgICBcIndoaXRlXCIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgdW5xdW90ZTogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJmdW5jdGlvblwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvKEB2YXJpYWJsZU5hbWUpKD89XFxzKlxcLj9cXHMqXFwoKS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAZGVjbGFyYXRpb25LZXl3b3Jkc1wiOiBcImtleXdvcmQuZGVjbGFyYXRpb25cIixcbiAgICAgICAgICAgIFwiQG5hbWVzcGFjZUtleXdvcmRzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAb3RoZXJLZXl3b3Jkc1wiOiBcImtleXdvcmRcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJmdW5jdGlvbi5jYWxsXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8oQG1vZHVsZU5hbWUpKFxccyopKFxcLikoXFxzKikoQHZhcmlhYmxlTmFtZSkvLFxuICAgICAgICBbXCJ0eXBlLmlkZW50aWZpZXJcIiwgXCJ3aGl0ZVwiLCBcIm9wZXJhdG9yXCIsIFwid2hpdGVcIiwgXCJmdW5jdGlvbi5jYWxsXCJdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvKDopKEBhdG9tTmFtZSkoXFxzKikoXFwuKShcXHMqKShAdmFyaWFibGVOYW1lKS8sXG4gICAgICAgIFtcImNvbnN0YW50LnB1bmN0dWF0aW9uXCIsIFwiY29uc3RhbnRcIiwgXCJ3aGl0ZVwiLCBcIm9wZXJhdG9yXCIsIFwid2hpdGVcIiwgXCJmdW5jdGlvbi5jYWxsXCJdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvKFxcfD4pKFxccyopKEB2YXJpYWJsZU5hbWUpLyxcbiAgICAgICAgW1xuICAgICAgICAgIFwib3BlcmF0b3JcIixcbiAgICAgICAgICBcIndoaXRlXCIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgXCJAb3RoZXJLZXl3b3Jkc1wiOiBcImtleXdvcmRcIixcbiAgICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImZ1bmN0aW9uLmNhbGxcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLygmKShcXHMqKShAdmFyaWFibGVOYW1lKS8sXG4gICAgICAgIFtcIm9wZXJhdG9yXCIsIFwid2hpdGVcIiwgXCJmdW5jdGlvbi5jYWxsXCJdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvQHZhcmlhYmxlTmFtZS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAZGVjbGFyYXRpb25LZXl3b3Jkc1wiOiBcImtleXdvcmQuZGVjbGFyYXRpb25cIixcbiAgICAgICAgICAgIFwiQG9wZXJhdG9yS2V5d29yZHNcIjogXCJrZXl3b3JkLm9wZXJhdG9yXCIsXG4gICAgICAgICAgICBcIkBuYW1lc3BhY2VLZXl3b3Jkc1wiOiBcImtleXdvcmRcIixcbiAgICAgICAgICAgIFwiQG90aGVyS2V5d29yZHNcIjogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgICBcIkBjb25zdGFudHNcIjogXCJjb25zdGFudC5sYW5ndWFnZVwiLFxuICAgICAgICAgICAgXCJAbmFtZUJ1aWx0aW5cIjogXCJ2YXJpYWJsZS5sYW5ndWFnZVwiLFxuICAgICAgICAgICAgXCJfLipcIjogXCJjb21tZW50LnVudXNlZFwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvQG1vZHVsZU5hbWUvLCBcInR5cGUuaWRlbnRpZmllclwiXVxuICAgIF0sXG4gICAgc3RyaW5nczogW1xuICAgICAgWy9cIlwiXCIvLCB7IHRva2VuOiBcInN0cmluZy5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAZG91YmxlUXVvdGVkSGVyZWRvY1wiIH1dLFxuICAgICAgWy8nJycvLCB7IHRva2VuOiBcInN0cmluZy5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAc2luZ2xlUXVvdGVkSGVyZWRvY1wiIH1dLFxuICAgICAgWy9cIi8sIHsgdG9rZW46IFwic3RyaW5nLmRlbGltaXRlclwiLCBuZXh0OiBcIkBkb3VibGVRdW90ZWRTdHJpbmdcIiB9XSxcbiAgICAgIFsvJy8sIHsgdG9rZW46IFwic3RyaW5nLmRlbGltaXRlclwiLCBuZXh0OiBcIkBzaW5nbGVRdW90ZWRTdHJpbmdcIiB9XVxuICAgIF0sXG4gICAgZG91YmxlUXVvdGVkSGVyZWRvYzogW1xuICAgICAgWy9cIlwiXCIvLCB7IHRva2VuOiBcInN0cmluZy5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ0NvbnRlbnRJbnRlcnBvbFwiIH1cbiAgICBdLFxuICAgIHNpbmdsZVF1b3RlZEhlcmVkb2M6IFtcbiAgICAgIFsvJycnLywgeyB0b2tlbjogXCJzdHJpbmcuZGVsaW1pdGVyXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgeyBpbmNsdWRlOiBcIkBzdHJpbmdDb250ZW50SW50ZXJwb2xcIiB9XG4gICAgXSxcbiAgICBkb3VibGVRdW90ZWRTdHJpbmc6IFtcbiAgICAgIFsvXCIvLCB7IHRva2VuOiBcInN0cmluZy5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ0NvbnRlbnRJbnRlcnBvbFwiIH1cbiAgICBdLFxuICAgIHNpbmdsZVF1b3RlZFN0cmluZzogW1xuICAgICAgWy8nLywgeyB0b2tlbjogXCJzdHJpbmcuZGVsaW1pdGVyXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgeyBpbmNsdWRlOiBcIkBzdHJpbmdDb250ZW50SW50ZXJwb2xcIiB9XG4gICAgXSxcbiAgICBhdG9tczogW1xuICAgICAgWy8oOikoQGF0b21OYW1lKS8sIFtcImNvbnN0YW50LnB1bmN0dWF0aW9uXCIsIFwiY29uc3RhbnRcIl1dLFxuICAgICAgWy86XCIvLCB7IHRva2VuOiBcImNvbnN0YW50LmRlbGltaXRlclwiLCBuZXh0OiBcIkBkb3VibGVRdW90ZWRTdHJpbmdBdG9tXCIgfV0sXG4gICAgICBbLzonLywgeyB0b2tlbjogXCJjb25zdGFudC5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAc2luZ2xlUXVvdGVkU3RyaW5nQXRvbVwiIH1dXG4gICAgXSxcbiAgICBkb3VibGVRdW90ZWRTdHJpbmdBdG9tOiBbXG4gICAgICBbL1wiLywgeyB0b2tlbjogXCJjb25zdGFudC5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ0NvbnN0YW50Q29udGVudEludGVycG9sXCIgfVxuICAgIF0sXG4gICAgc2luZ2xlUXVvdGVkU3RyaW5nQXRvbTogW1xuICAgICAgWy8nLywgeyB0b2tlbjogXCJjb25zdGFudC5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ0NvbnN0YW50Q29udGVudEludGVycG9sXCIgfVxuICAgIF0sXG4gICAgc2lnaWxzOiBbXG4gICAgICBbL35bYS16XUBzaWdpbFN0YXJ0RGVsaW1pdGVyLywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBuZXh0OiBcIkBzaWdpbC5pbnRlcnBvbFwiIH1dLFxuICAgICAgWy9+KFtBLVpdKylAc2lnaWxTdGFydERlbGltaXRlci8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogXCJAc2lnaWwubm9JbnRlcnBvbFwiIH1dXG4gICAgXSxcbiAgICBzaWdpbDogW1xuICAgICAgWy9+KFthLXpdfFtBLVpdKylcXHsvLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBcIkBzaWdpbFN0YXJ0LiRTMi4kMS57Ln1cIiB9XSxcbiAgICAgIFsvfihbYS16XXxbQS1aXSspXFxbLywgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogXCJAc2lnaWxTdGFydC4kUzIuJDEuWy5dXCIgfV0sXG4gICAgICBbL34oW2Etel18W0EtWl0rKVxcKC8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgc3dpdGNoVG86IFwiQHNpZ2lsU3RhcnQuJFMyLiQxLiguKVwiIH1dLFxuICAgICAgWy9+KFthLXpdfFtBLVpdKylcXDwvLCB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBcIkBzaWdpbFN0YXJ0LiRTMi4kMS48Lj5cIiB9XSxcbiAgICAgIFtcbiAgICAgICAgL34oW2Etel18W0EtWl0rKShAc2lnaWxTeW1tZXRyaWNEZWxpbWl0ZXIpLyxcbiAgICAgICAgeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogXCJAc2lnaWxTdGFydC4kUzIuJDEuJDIuJDJcIiB9XG4gICAgICBdXG4gICAgXSxcbiAgICBcInNpZ2lsU3RhcnQuaW50ZXJwb2wuc1wiOiBbXG4gICAgICBbXG4gICAgICAgIC9+c0BzaWdpbFN0YXJ0RGVsaW1pdGVyLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcInN0cmluZy5kZWxpbWl0ZXJcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc2lnaWxDb250aW51ZS4kUzIuJFMzLiRTNC4kUzVcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBcInNpZ2lsQ29udGludWUuaW50ZXJwb2wuc1wiOiBbXG4gICAgICBbXG4gICAgICAgIC8oQHNpZ2lsRW5kRGVsaW1pdGVyKUBzaWdpbE1vZGlmaWVycy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCIkMT09JFM1XCI6IHsgdG9rZW46IFwic3RyaW5nLmRlbGltaXRlclwiLCBuZXh0OiBcIkBwb3BcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkBzdHJpbmdDb250ZW50SW50ZXJwb2xcIiB9XG4gICAgXSxcbiAgICBcInNpZ2lsU3RhcnQubm9JbnRlcnBvbC5TXCI6IFtcbiAgICAgIFtcbiAgICAgICAgL35TQHNpZ2lsU3RhcnREZWxpbWl0ZXIvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwic3RyaW5nLmRlbGltaXRlclwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBzaWdpbENvbnRpbnVlLiRTMi4kUzMuJFM0LiRTNVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIFwic2lnaWxDb250aW51ZS5ub0ludGVycG9sLlNcIjogW1xuICAgICAgWy8oXnxbXlxcXFxdKVxcXFxAc2lnaWxFbmREZWxpbWl0ZXIvLCBcInN0cmluZ1wiXSxcbiAgICAgIFtcbiAgICAgICAgLyhAc2lnaWxFbmREZWxpbWl0ZXIpQHNpZ2lsTW9kaWZpZXJzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQxPT0kUzVcIjogeyB0b2tlbjogXCJzdHJpbmcuZGVsaW1pdGVyXCIsIG5leHQ6IFwiQHBvcFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwic3RyaW5nXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ0NvbnRlbnRcIiB9XG4gICAgXSxcbiAgICBcInNpZ2lsU3RhcnQuaW50ZXJwb2wuclwiOiBbXG4gICAgICBbXG4gICAgICAgIC9+ckBzaWdpbFN0YXJ0RGVsaW1pdGVyLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcInJlZ2V4cC5kZWxpbWl0ZXJcIixcbiAgICAgICAgICBzd2l0Y2hUbzogXCJAc2lnaWxDb250aW51ZS4kUzIuJFMzLiRTNC4kUzVcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBcInNpZ2lsQ29udGludWUuaW50ZXJwb2wuclwiOiBbXG4gICAgICBbXG4gICAgICAgIC8oQHNpZ2lsRW5kRGVsaW1pdGVyKUBzaWdpbE1vZGlmaWVycy8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCIkMT09JFM1XCI6IHsgdG9rZW46IFwicmVnZXhwLmRlbGltaXRlclwiLCBuZXh0OiBcIkBwb3BcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInJlZ2V4cFwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkByZWdleHBDb250ZW50SW50ZXJwb2xcIiB9XG4gICAgXSxcbiAgICBcInNpZ2lsU3RhcnQubm9JbnRlcnBvbC5SXCI6IFtcbiAgICAgIFtcbiAgICAgICAgL35SQHNpZ2lsU3RhcnREZWxpbWl0ZXIvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwicmVnZXhwLmRlbGltaXRlclwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBzaWdpbENvbnRpbnVlLiRTMi4kUzMuJFM0LiRTNVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIFwic2lnaWxDb250aW51ZS5ub0ludGVycG9sLlJcIjogW1xuICAgICAgWy8oXnxbXlxcXFxdKVxcXFxAc2lnaWxFbmREZWxpbWl0ZXIvLCBcInJlZ2V4cFwiXSxcbiAgICAgIFtcbiAgICAgICAgLyhAc2lnaWxFbmREZWxpbWl0ZXIpQHNpZ2lsTW9kaWZpZXJzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQxPT0kUzVcIjogeyB0b2tlbjogXCJyZWdleHAuZGVsaW1pdGVyXCIsIG5leHQ6IFwiQHBvcFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwicmVnZXhwXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHJlZ2V4cENvbnRlbnRcIiB9XG4gICAgXSxcbiAgICBcInNpZ2lsU3RhcnQuaW50ZXJwb2xcIjogW1xuICAgICAgW1xuICAgICAgICAvfihbYS16XXxbQS1aXSspQHNpZ2lsU3RhcnREZWxpbWl0ZXIvLFxuICAgICAgICB7XG4gICAgICAgICAgdG9rZW46IFwic2lnaWwuZGVsaW1pdGVyXCIsXG4gICAgICAgICAgc3dpdGNoVG86IFwiQHNpZ2lsQ29udGludWUuJFMyLiRTMy4kUzQuJFM1XCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIF0sXG4gICAgXCJzaWdpbENvbnRpbnVlLmludGVycG9sXCI6IFtcbiAgICAgIFtcbiAgICAgICAgLyhAc2lnaWxFbmREZWxpbWl0ZXIpQHNpZ2lsTW9kaWZpZXJzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQxPT0kUzVcIjogeyB0b2tlbjogXCJzaWdpbC5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJzaWdpbFwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkBzaWdpbENvbnRlbnRJbnRlcnBvbFwiIH1cbiAgICBdLFxuICAgIFwic2lnaWxTdGFydC5ub0ludGVycG9sXCI6IFtcbiAgICAgIFtcbiAgICAgICAgL34oW2Etel18W0EtWl0rKUBzaWdpbFN0YXJ0RGVsaW1pdGVyLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcInNpZ2lsLmRlbGltaXRlclwiLFxuICAgICAgICAgIHN3aXRjaFRvOiBcIkBzaWdpbENvbnRpbnVlLiRTMi4kUzMuJFM0LiRTNVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIFwic2lnaWxDb250aW51ZS5ub0ludGVycG9sXCI6IFtcbiAgICAgIFsvKF58W15cXFxcXSlcXFxcQHNpZ2lsRW5kRGVsaW1pdGVyLywgXCJzaWdpbFwiXSxcbiAgICAgIFtcbiAgICAgICAgLyhAc2lnaWxFbmREZWxpbWl0ZXIpQHNpZ2lsTW9kaWZpZXJzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQxPT0kUzVcIjogeyB0b2tlbjogXCJzaWdpbC5kZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJzaWdpbFwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkBzaWdpbENvbnRlbnRcIiB9XG4gICAgXSxcbiAgICBhdHRyaWJ1dGVzOiBbXG4gICAgICBbXG4gICAgICAgIC9cXEAobW9kdWxlfHR5cGUpP2RvYyAofltzU10pP1wiXCJcIi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb25cIixcbiAgICAgICAgICBuZXh0OiBcIkBkb3VibGVRdW90ZWRIZXJlZG9jRG9jc3RyaW5nXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1xcQChtb2R1bGV8dHlwZSk/ZG9jICh+W3NTXSk/JycnLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImNvbW1lbnQuYmxvY2suZG9jdW1lbnRhdGlvblwiLFxuICAgICAgICAgIG5leHQ6IFwiQHNpbmdsZVF1b3RlZEhlcmVkb2NEb2NzdHJpbmdcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvXFxAKG1vZHVsZXx0eXBlKT9kb2MgKH5bc1NdKT9cIi8sXG4gICAgICAgIHtcbiAgICAgICAgICB0b2tlbjogXCJjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb25cIixcbiAgICAgICAgICBuZXh0OiBcIkBkb3VibGVRdW90ZWRTdHJpbmdEb2NzdHJpbmdcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvXFxAKG1vZHVsZXx0eXBlKT9kb2MgKH5bc1NdKT8nLyxcbiAgICAgICAge1xuICAgICAgICAgIHRva2VuOiBcImNvbW1lbnQuYmxvY2suZG9jdW1lbnRhdGlvblwiLFxuICAgICAgICAgIG5leHQ6IFwiQHNpbmdsZVF1b3RlZFN0cmluZ0RvY3N0cmluZ1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1xcQChtb2R1bGV8dHlwZSk/ZG9jIGZhbHNlLywgXCJjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb25cIl0sXG4gICAgICBbL1xcQChAdmFyaWFibGVOYW1lKS8sIFwidmFyaWFibGVcIl1cbiAgICBdLFxuICAgIGRvdWJsZVF1b3RlZEhlcmVkb2NEb2NzdHJpbmc6IFtcbiAgICAgIFsvXCJcIlwiLywgeyB0b2tlbjogXCJjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb25cIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGRvY3N0cmluZ0NvbnRlbnRcIiB9XG4gICAgXSxcbiAgICBzaW5nbGVRdW90ZWRIZXJlZG9jRG9jc3RyaW5nOiBbXG4gICAgICBbLycnJy8sIHsgdG9rZW46IFwiY29tbWVudC5ibG9jay5kb2N1bWVudGF0aW9uXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgeyBpbmNsdWRlOiBcIkBkb2NzdHJpbmdDb250ZW50XCIgfVxuICAgIF0sXG4gICAgZG91YmxlUXVvdGVkU3RyaW5nRG9jc3RyaW5nOiBbXG4gICAgICBbL1wiLywgeyB0b2tlbjogXCJjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb25cIiwgbmV4dDogXCJAcG9wXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGRvY3N0cmluZ0NvbnRlbnRcIiB9XG4gICAgXSxcbiAgICBzaW5nbGVRdW90ZWRTdHJpbmdEb2NzdHJpbmc6IFtcbiAgICAgIFsvJy8sIHsgdG9rZW46IFwiY29tbWVudC5ibG9jay5kb2N1bWVudGF0aW9uXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgeyBpbmNsdWRlOiBcIkBkb2NzdHJpbmdDb250ZW50XCIgfVxuICAgIF0sXG4gICAgc3ltYm9sczogW1xuICAgICAgWy9cXD8oXFxcXC58W15cXFxcXFxzXSkvLCBcIm51bWJlci5jb25zdGFudFwiXSxcbiAgICAgIFsvJlxcZCsvLCBcIm9wZXJhdG9yXCJdLFxuICAgICAgWy88PDx8Pj4+LywgXCJvcGVyYXRvclwiXSxcbiAgICAgIFsvWygpXFxbXFxdXFx7XFx9XXw8PHw+Pi8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9cXC5cXC5cXC4vLCBcImlkZW50aWZpZXJcIl0sXG4gICAgICBbLz0+LywgXCJwdW5jdHVhdGlvblwiXSxcbiAgICAgIFsvQG9wZXJhdG9yLywgXCJvcGVyYXRvclwiXSxcbiAgICAgIFsvWzo7LC4lXS8sIFwicHVuY3R1YXRpb25cIl1cbiAgICBdLFxuICAgIHN0cmluZ0NvbnRlbnRJbnRlcnBvbDogW1xuICAgICAgeyBpbmNsdWRlOiBcIkBpbnRlcnBvbGF0aW9uXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAZXNjYXBlQ2hhclwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN0cmluZ0NvbnRlbnRcIiB9XG4gICAgXSxcbiAgICBzdHJpbmdDb250ZW50OiBbWy8uLywgXCJzdHJpbmdcIl1dLFxuICAgIHN0cmluZ0NvbnN0YW50Q29udGVudEludGVycG9sOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQGludGVycG9sYXRpb25cIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBlc2NhcGVDaGFyXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAc3RyaW5nQ29uc3RhbnRDb250ZW50XCIgfVxuICAgIF0sXG4gICAgc3RyaW5nQ29uc3RhbnRDb250ZW50OiBbWy8uLywgXCJjb25zdGFudFwiXV0sXG4gICAgcmVnZXhwQ29udGVudEludGVycG9sOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQGludGVycG9sYXRpb25cIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBlc2NhcGVDaGFyXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAcmVnZXhwQ29udGVudFwiIH1cbiAgICBdLFxuICAgIHJlZ2V4cENvbnRlbnQ6IFtcbiAgICAgIFsvKFxccykoIykoXFxzLiopJC8sIFtcIndoaXRlXCIsIFwiY29tbWVudC5wdW5jdHVhdGlvblwiLCBcImNvbW1lbnRcIl1dLFxuICAgICAgWy8uLywgXCJyZWdleHBcIl1cbiAgICBdLFxuICAgIHNpZ2lsQ29udGVudEludGVycG9sOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQGludGVycG9sYXRpb25cIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBlc2NhcGVDaGFyXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAc2lnaWxDb250ZW50XCIgfVxuICAgIF0sXG4gICAgc2lnaWxDb250ZW50OiBbWy8uLywgXCJzaWdpbFwiXV0sXG4gICAgZG9jc3RyaW5nQ29udGVudDogW1svLi8sIFwiY29tbWVudC5ibG9jay5kb2N1bWVudGF0aW9uXCJdXSxcbiAgICBlc2NhcGVDaGFyOiBbWy9AZXNjYXBlLywgXCJjb25zdGFudC5jaGFyYWN0ZXIuZXNjYXBlXCJdXSxcbiAgICBpbnRlcnBvbGF0aW9uOiBbWy8jey8sIHsgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXQuZW1iZWRcIiwgbmV4dDogXCJAaW50ZXJwb2xhdGlvbkNvbnRpbnVlXCIgfV1dLFxuICAgIGludGVycG9sYXRpb25Db250aW51ZTogW1xuICAgICAgWy99LywgeyB0b2tlbjogXCJkZWxpbWl0ZXIuYnJhY2tldC5lbWJlZFwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIHsgaW5jbHVkZTogXCJAcm9vdFwiIH1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxFQUNkO0FBQUEsRUFDRCxVQUFVO0FBQUEs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LFdBQVc7QUFBQSxNQUNsQyxDQUFDLFVBQVUsWUFBWTtBQUFBLE1BQ3ZCLENBQUMsTUFBTSxhQUFhO0FBQUEsTUFDcEIsQ0FBQyxhQUFhLFVBQVU7QUFBQSxNQUN4QixDQUFDLFdBQVcsYUFBYTtBQUFBLElBQzFCO0FBQUEsSUFDRCx1QkFBdUI7QUFBQSxNQUNyQixFQUFFLFNBQVMsaUJBQWtCO0FBQUEsTUFDN0IsRUFBRSxTQUFTLGNBQWU7QUFBQSxNQUMxQixFQUFFLFNBQVMsaUJBQWtCO0FBQUEsSUFDOUI7QUFBQSxJQUNELGVBQWUsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDO0FBQUEsSUFDL0IsK0JBQStCO0FBQUEsTUFDN0IsRUFBRSxTQUFTLGlCQUFrQjtBQUFBLE1BQzdCLEVBQUUsU0FBUyxjQUFlO0FBQUEsTUFDMUIsRUFBRSxTQUFTLHlCQUEwQjtBQUFBLElBQ3RDO0FBQUEsSUFDRCx1QkFBdUIsQ0FBQyxDQUFDLEtBQUssVUFBVSxDQUFDO0FBQUEsSUFDekMsdUJBQXVCO0FBQUEsTUFDckIsRUFBRSxTQUFTLGlCQUFrQjtBQUFBLE1BQzdCLEVBQUUsU0FBUyxjQUFlO0FBQUEsTUFDMUIsRUFBRSxTQUFTLGlCQUFrQjtBQUFBLElBQzlCO0FBQUEsSUFDRCxlQUFlO0FBQUEsTUFDYixDQUFDLGtCQUFrQixDQUFDLFNBQVMsdUJBQXVCLFNBQVMsQ0FBQztBQUFBLE1BQzlELENBQUMsS0FBSyxRQUFRO0FBQUEsSUFDZjtBQUFBLElBQ0Qsc0JBQXNCO0FBQUEsTUFDcEIsRUFBRSxTQUFTLGlCQUFrQjtBQUFBLE1BQzdCLEVBQUUsU0FBUyxjQUFlO0FBQUEsTUFDMUIsRUFBRSxTQUFTLGdCQUFpQjtBQUFBLElBQzdCO0FBQUEsSUFDRCxjQUFjLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQztBQUFBLElBQzdCLGtCQUFrQixDQUFDLENBQUMsS0FBSyw2QkFBNkIsQ0FBQztBQUFBLElBQ3ZELFlBQVksQ0FBQyxDQUFDLFdBQVcsMkJBQTJCLENBQUM7QUFBQSxJQUNyRCxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTywyQkFBMkIsTUFBTSx5QkFBd0IsQ0FBRSxDQUFDO0FBQUEsSUFDNUYsdUJBQXVCO0FBQUEsTUFDckIsQ0FBQyxLQUFLLEVBQUUsT0FBTywyQkFBMkIsTUFBTSxPQUFNLENBQUU7QUFBQSxNQUN4RCxFQUFFLFNBQVMsUUFBUztBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUNIOyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
