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
  "assign",
  "flush",
  "ftl",
  "return",
  "global",
  "import",
  "include",
  "break",
  "continue",
  "local",
  "nested",
  "nt",
  "setting",
  "stop",
  "t",
  "lt",
  "rt",
  "fallback"
];
var BLOCK_ELEMENTS = [
  "attempt",
  "autoesc",
  "autoEsc",
  "compress",
  "comment",
  "escape",
  "noescape",
  "function",
  "if",
  "list",
  "items",
  "sep",
  "macro",
  "noparse",
  "noParse",
  "noautoesc",
  "noAutoEsc",
  "outputformat",
  "switch",
  "visit",
  "recurse"
];
var TagSyntaxAngle = {
  close: ">",
  id: "angle",
  open: "<"
};
var TagSyntaxBracket = {
  close: "\\]",
  id: "bracket",
  open: "\\["
};
var TagSyntaxAuto = {
  close: "[>\\]]",
  id: "auto",
  open: "[<\\[]"
};
var InterpolationSyntaxDollar = {
  close: "\\}",
  id: "dollar",
  open1: "\\$",
  open2: "\\{"
};
var InterpolationSyntaxBracket = {
  close: "\\]",
  id: "bracket",
  open1: "\\[",
  open2: "="
};
function createLangConfiguration(ts) {
  return {
    brackets: [
      ["<", ">"],
      ["[", "]"],
      ["(", ")"],
      ["{", "}"]
    ],
    comments: {
      blockComment: [`${ts.open}--`, `--${ts.close}`]
    },
    autoCloseBefore: "\n\r	 }]),.:;=",
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "'", close: "'", notIn: ["string"] }
    ],
    surroundingPairs: [
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "<", close: ">" }
    ],
    folding: {
      markers: {
        start: new RegExp(`${ts.open}#(?:${BLOCK_ELEMENTS.join("|")})([^/${ts.close}]*(?!/)${ts.close})[^${ts.open}]*$`),
        end: new RegExp(`${ts.open}/#(?:${BLOCK_ELEMENTS.join("|")})[\\r\\n\\t ]*>`)
      }
    },
    onEnterRules: [
      {
        beforeText: new RegExp(`${ts.open}#(?!(?:${EMPTY_ELEMENTS.join("|")}))([a-zA-Z_]+)([^/${ts.close}]*(?!/)${ts.close})[^${ts.open}]*$`),
        afterText: new RegExp(`^${ts.open}/#([a-zA-Z_]+)[\\r\\n\\t ]*${ts.close}$`),
        action: {
          indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent
        }
      },
      {
        beforeText: new RegExp(`${ts.open}#(?!(?:${EMPTY_ELEMENTS.join("|")}))([a-zA-Z_]+)([^/${ts.close}]*(?!/)${ts.close})[^${ts.open}]*$`),
        action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
      }
    ]
  };
}
function createLangConfigurationAuto() {
  return {
    brackets: [
      ["<", ">"],
      ["[", "]"],
      ["(", ")"],
      ["{", "}"]
    ],
    autoCloseBefore: "\n\r	 }]),.:;=",
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "'", close: "'", notIn: ["string"] }
    ],
    surroundingPairs: [
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "<", close: ">" }
    ],
    folding: {
      markers: {
        start: new RegExp(`[<\\[]#(?:${BLOCK_ELEMENTS.join("|")})([^/>\\]]*(?!/)[>\\]])[^<\\[]*$`),
        end: new RegExp(`[<\\[]/#(?:${BLOCK_ELEMENTS.join("|")})[\\r\\n\\t ]*>`)
      }
    },
    onEnterRules: [
      {
        beforeText: new RegExp(`[<\\[]#(?!(?:${EMPTY_ELEMENTS.join("|")}))([a-zA-Z_]+)([^/>\\]]*(?!/)[>\\]])[^[<\\[]]*$`),
        afterText: new RegExp(`^[<\\[]/#([a-zA-Z_]+)[\\r\\n\\t ]*[>\\]]$`),
        action: {
          indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent
        }
      },
      {
        beforeText: new RegExp(`[<\\[]#(?!(?:${EMPTY_ELEMENTS.join("|")}))([a-zA-Z_]+)([^/>\\]]*(?!/)[>\\]])[^[<\\[]]*$`),
        action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
      }
    ]
  };
}
function createMonarchLanguage(ts, is) {
  const id = `_${ts.id}_${is.id}`;
  const s = (name) => name.replace(/__id__/g, id);
  const r = (regexp) => {
    const source = regexp.source.replace(/__id__/g, id);
    return new RegExp(source, regexp.flags);
  };
  return {
    unicode: true,
    includeLF: false,
    start: s("default__id__"),
    ignoreCase: false,
    defaultToken: "invalid",
    tokenPostfix: `.freemarker2`,
    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" },
      { open: "(", close: ")", token: "delimiter.parenthesis" },
      { open: "<", close: ">", token: "delimiter.angle" }
    ],
    [s("open__id__")]: new RegExp(ts.open),
    [s("close__id__")]: new RegExp(ts.close),
    [s("iOpen1__id__")]: new RegExp(is.open1),
    [s("iOpen2__id__")]: new RegExp(is.open2),
    [s("iClose__id__")]: new RegExp(is.close),
    [s("startTag__id__")]: r(/(@open__id__)(#)/),
    [s("endTag__id__")]: r(/(@open__id__)(\/#)/),
    [s("startOrEndTag__id__")]: r(/(@open__id__)(\/?#)/),
    [s("closeTag1__id__")]: r(/((?:@blank)*)(@close__id__)/),
    [s("closeTag2__id__")]: r(/((?:@blank)*\/?)(@close__id__)/),
    blank: /[ \t\n\r]/,
    keywords: ["false", "true", "in", "as", "using"],
    directiveStartCloseTag1: /attempt|recover|sep|auto[eE]sc|no(?:autoe|AutoE)sc|compress|default|no[eE]scape|comment|no[pP]arse/,
    directiveStartCloseTag2: /else|break|continue|return|stop|flush|t|lt|rt|nt|nested|recurse|fallback|ftl/,
    directiveStartBlank: /if|else[iI]f|list|for[eE]ach|switch|case|assign|global|local|include|import|function|macro|transform|visit|stop|return|call|setting|output[fF]ormat|nested|recurse|escape|ftl|items/,
    directiveEndCloseTag1: /if|list|items|sep|recover|attempt|for[eE]ach|local|global|assign|function|macro|output[fF]ormat|auto[eE]sc|no(?:autoe|AutoE)sc|compress|transform|switch|escape|no[eE]scape/,
    escapedChar: /\\(?:[ntrfbgla\\'"\{=]|(?:x[0-9A-Fa-f]{1,4}))/,
    asciiDigit: /[0-9]/,
    integer: /[0-9]+/,
    nonEscapedIdStartChar: /[\$@-Z_a-z\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u1FFF\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183-\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3006\u3031-\u3035\u303B-\u303C\u3040-\u318F\u31A0-\u31BA\u31F0-\u31FF\u3300-\u337F\u3400-\u4DB5\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
    escapedIdChar: /\\[\-\.:#]/,
    idStartChar: /(?:@nonEscapedIdStartChar)|(?:@escapedIdChar)/,
    id: /(?:@idStartChar)(?:(?:@idStartChar)|(?:@asciiDigit))*/,
    specialHashKeys: /\*\*|\*|false|true|in|as|using/,
    namedSymbols: /&lt;=|&gt;=|\\lte|\\lt|&lt;|\\gte|\\gt|&gt;|&amp;&amp;|\\and|-&gt;|->|==|!=|\+=|-=|\*=|\/=|%=|\+\+|--|<=|&&|\|\||:|\.\.\.|\.\.\*|\.\.<|\.\.!|\?\?|=|<|\+|-|\*|\/|%|\||\.\.|\?|!|&|\.|,|;/,
    arrows: ["->", "-&gt;"],
    delimiters: [";", ":", ",", "."],
    stringOperators: ["lte", "lt", "gte", "gt"],
    noParseTags: ["noparse", "noParse", "comment"],
    tokenizer: {
      [s("default__id__")]: [
        { include: s("@directive_token__id__") },
        { include: s("@interpolation_and_text_token__id__") }
      ],
      [s("fmExpression__id__.directive")]: [
        { include: s("@blank_and_expression_comment_token__id__") },
        { include: s("@directive_end_token__id__") },
        { include: s("@expression_token__id__") }
      ],
      [s("fmExpression__id__.interpolation")]: [
        { include: s("@blank_and_expression_comment_token__id__") },
        { include: s("@expression_token__id__") },
        { include: s("@greater_operators_token__id__") }
      ],
      [s("inParen__id__.plain")]: [
        { include: s("@blank_and_expression_comment_token__id__") },
        { include: s("@directive_end_token__id__") },
        { include: s("@expression_token__id__") }
      ],
      [s("inParen__id__.gt")]: [
        { include: s("@blank_and_expression_comment_token__id__") },
        { include: s("@expression_token__id__") },
        { include: s("@greater_operators_token__id__") }
      ],
      [s("noSpaceExpression__id__")]: [
        { include: s("@no_space_expression_end_token__id__") },
        { include: s("@directive_end_token__id__") },
        { include: s("@expression_token__id__") }
      ],
      [s("unifiedCall__id__")]: [{ include: s("@unified_call_token__id__") }],
      [s("singleString__id__")]: [{ include: s("@string_single_token__id__") }],
      [s("doubleString__id__")]: [{ include: s("@string_double_token__id__") }],
      [s("rawSingleString__id__")]: [{ include: s("@string_single_raw_token__id__") }],
      [s("rawDoubleString__id__")]: [{ include: s("@string_double_raw_token__id__") }],
      [s("expressionComment__id__")]: [{ include: s("@expression_comment_token__id__") }],
      [s("noParse__id__")]: [{ include: s("@no_parse_token__id__") }],
      [s("terseComment__id__")]: [{ include: s("@terse_comment_token__id__") }],
      [s("directive_token__id__")]: [
        [
          r(/(?:@startTag__id__)(@directiveStartCloseTag1)(?:@closeTag1__id__)/),
          ts.id === "auto" ? {
            cases: {
              "$1==<": { token: "@rematch", switchTo: `@default_angle_${is.id}` },
              "$1==[": { token: "@rematch", switchTo: `@default_bracket_${is.id}` }
            }
          } : [
            { token: "@brackets.directive" },
            { token: "delimiter.directive" },
            {
              cases: {
                "@noParseTags": { token: "tag", next: s("@noParse__id__.$3") },
                "@default": { token: "tag" }
              }
            },
            { token: "delimiter.directive" },
            { token: "@brackets.directive" }
          ]
        ],
        [
          r(/(?:@startTag__id__)(@directiveStartCloseTag2)(?:@closeTag2__id__)/),
          ts.id === "auto" ? {
            cases: {
              "$1==<": { token: "@rematch", switchTo: `@default_angle_${is.id}` },
              "$1==[": { token: "@rematch", switchTo: `@default_bracket_${is.id}` }
            }
          } : [
            { token: "@brackets.directive" },
            { token: "delimiter.directive" },
            { token: "tag" },
            { token: "delimiter.directive" },
            { token: "@brackets.directive" }
          ]
        ],
        [
          r(/(?:@startTag__id__)(@directiveStartBlank)(@blank)/),
          ts.id === "auto" ? {
            cases: {
              "$1==<": { token: "@rematch", switchTo: `@default_angle_${is.id}` },
              "$1==[": { token: "@rematch", switchTo: `@default_bracket_${is.id}` }
            }
          } : [
            { token: "@brackets.directive" },
            { token: "delimiter.directive" },
            { token: "tag" },
            { token: "", next: s("@fmExpression__id__.directive") }
          ]
        ],
        [
          r(/(?:@endTag__id__)(@directiveEndCloseTag1)(?:@closeTag1__id__)/),
          ts.id === "auto" ? {
            cases: {
              "$1==<": { token: "@rematch", switchTo: `@default_angle_${is.id}` },
              "$1==[": { token: "@rematch", switchTo: `@default_bracket_${is.id}` }
            }
          } : [
            { token: "@brackets.directive" },
            { token: "delimiter.directive" },
            { token: "tag" },
            { token: "delimiter.directive" },
            { token: "@brackets.directive" }
          ]
        ],
        [
          r(/(@open__id__)(@)/),
          ts.id === "auto" ? {
            cases: {
              "$1==<": { token: "@rematch", switchTo: `@default_angle_${is.id}` },
              "$1==[": { token: "@rematch", switchTo: `@default_bracket_${is.id}` }
            }
          } : [
            { token: "@brackets.directive" },
            { token: "delimiter.directive", next: s("@unifiedCall__id__") }
          ]
        ],
        [
          r(/(@open__id__)(\/@)((?:(?:@id)(?:\.(?:@id))*)?)(?:@closeTag1__id__)/),
          [
            { token: "@brackets.directive" },
            { token: "delimiter.directive" },
            { token: "tag" },
            { token: "delimiter.directive" },
            { token: "@brackets.directive" }
          ]
        ],
        [
          r(/(@open__id__)#--/),
          ts.id === "auto" ? {
            cases: {
              "$1==<": { token: "@rematch", switchTo: `@default_angle_${is.id}` },
              "$1==[": { token: "@rematch", switchTo: `@default_bracket_${is.id}` }
            }
          } : { token: "comment", next: s("@terseComment__id__") }
        ],
        [
          r(/(?:@startOrEndTag__id__)([a-zA-Z_]+)/),
          ts.id === "auto" ? {
            cases: {
              "$1==<": { token: "@rematch", switchTo: `@default_angle_${is.id}` },
              "$1==[": { token: "@rematch", switchTo: `@default_bracket_${is.id}` }
            }
          } : [
            { token: "@brackets.directive" },
            { token: "delimiter.directive" },
            { token: "tag.invalid", next: s("@fmExpression__id__.directive") }
          ]
        ]
      ],
      [s("interpolation_and_text_token__id__")]: [
        [
          r(/(@iOpen1__id__)(@iOpen2__id__)/),
          [
            { token: is.id === "bracket" ? "@brackets.interpolation" : "delimiter.interpolation" },
            {
              token: is.id === "bracket" ? "delimiter.interpolation" : "@brackets.interpolation",
              next: s("@fmExpression__id__.interpolation")
            }
          ]
        ],
        [/[\$#<\[\{]|(?:@blank)+|[^\$<#\[\{\n\r\t ]+/, { token: "source" }]
      ],
      [s("string_single_token__id__")]: [
        [/[^'\\]/, { token: "string" }],
        [/@escapedChar/, { token: "string.escape" }],
        [/'/, { token: "string", next: "@pop" }]
      ],
      [s("string_double_token__id__")]: [
        [/[^"\\]/, { token: "string" }],
        [/@escapedChar/, { token: "string.escape" }],
        [/"/, { token: "string", next: "@pop" }]
      ],
      [s("string_single_raw_token__id__")]: [
        [/[^']+/, { token: "string.raw" }],
        [/'/, { token: "string.raw", next: "@pop" }]
      ],
      [s("string_double_raw_token__id__")]: [
        [/[^"]+/, { token: "string.raw" }],
        [/"/, { token: "string.raw", next: "@pop" }]
      ],
      [s("expression_token__id__")]: [
        [
          /(r?)(['"])/,
          {
            cases: {
              "r'": [
                { token: "keyword" },
                { token: "string.raw", next: s("@rawSingleString__id__") }
              ],
              'r"': [
                { token: "keyword" },
                { token: "string.raw", next: s("@rawDoubleString__id__") }
              ],
              "'": [{ token: "source" }, { token: "string", next: s("@singleString__id__") }],
              '"': [{ token: "source" }, { token: "string", next: s("@doubleString__id__") }]
            }
          }
        ],
        [
          /(?:@integer)(?:\.(?:@integer))?/,
          {
            cases: {
              "(?:@integer)": { token: "number" },
              "@default": { token: "number.float" }
            }
          }
        ],
        [
          /(\.)(@blank*)(@specialHashKeys)/,
          [{ token: "delimiter" }, { token: "" }, { token: "identifier" }]
        ],
        [
          /(?:@namedSymbols)/,
          {
            cases: {
              "@arrows": { token: "meta.arrow" },
              "@delimiters": { token: "delimiter" },
              "@default": { token: "operators" }
            }
          }
        ],
        [
          /@id/,
          {
            cases: {
              "@keywords": { token: "keyword.$0" },
              "@stringOperators": { token: "operators" },
              "@default": { token: "identifier" }
            }
          }
        ],
        [
          /[\[\]\(\)\{\}]/,
          {
            cases: {
              "\\[": {
                cases: {
                  "$S2==gt": { token: "@brackets", next: s("@inParen__id__.gt") },
                  "@default": { token: "@brackets", next: s("@inParen__id__.plain") }
                }
              },
              "\\]": {
                cases: {
                  ...is.id === "bracket" ? {
                    "$S2==interpolation": { token: "@brackets.interpolation", next: "@popall" }
                  } : {},
                  ...ts.id === "bracket" ? {
                    "$S2==directive": { token: "@brackets.directive", next: "@popall" }
                  } : {},
                  [s("$S1==inParen__id__")]: { token: "@brackets", next: "@pop" },
                  "@default": { token: "@brackets" }
                }
              },
              "\\(": { token: "@brackets", next: s("@inParen__id__.gt") },
              "\\)": {
                cases: {
                  [s("$S1==inParen__id__")]: { token: "@brackets", next: "@pop" },
                  "@default": { token: "@brackets" }
                }
              },
              "\\{": {
                cases: {
                  "$S2==gt": { token: "@brackets", next: s("@inParen__id__.gt") },
                  "@default": { token: "@brackets", next: s("@inParen__id__.plain") }
                }
              },
              "\\}": {
                cases: {
                  ...is.id === "bracket" ? {} : {
                    "$S2==interpolation": { token: "@brackets.interpolation", next: "@popall" }
                  },
                  [s("$S1==inParen__id__")]: { token: "@brackets", next: "@pop" },
                  "@default": { token: "@brackets" }
                }
              }
            }
          }
        ],
        [/\$\{/, { token: "delimiter.invalid" }]
      ],
      [s("blank_and_expression_comment_token__id__")]: [
        [/(?:@blank)+/, { token: "" }],
        [/[<\[][#!]--/, { token: "comment", next: s("@expressionComment__id__") }]
      ],
      [s("directive_end_token__id__")]: [
        [
          />/,
          ts.id === "bracket" ? { token: "operators" } : { token: "@brackets.directive", next: "@popall" }
        ],
        [
          r(/(\/)(@close__id__)/),
          [{ token: "delimiter.directive" }, { token: "@brackets.directive", next: "@popall" }]
        ]
      ],
      [s("greater_operators_token__id__")]: [
        [/>/, { token: "operators" }],
        [/>=/, { token: "operators" }]
      ],
      [s("no_space_expression_end_token__id__")]: [
        [/(?:@blank)+/, { token: "", switchTo: s("@fmExpression__id__.directive") }]
      ],
      [s("unified_call_token__id__")]: [
        [
          /(@id)((?:@blank)+)/,
          [{ token: "tag" }, { token: "", next: s("@fmExpression__id__.directive") }]
        ],
        [
          r(/(@id)(\/?)(@close__id__)/),
          [
            { token: "tag" },
            { token: "delimiter.directive" },
            { token: "@brackets.directive", next: "@popall" }
          ]
        ],
        [/./, { token: "@rematch", next: s("@noSpaceExpression__id__") }]
      ],
      [s("no_parse_token__id__")]: [
        [
          r(/(@open__id__)(\/#?)([a-zA-Z]+)((?:@blank)*)(@close__id__)/),
          {
            cases: {
              "$S2==$3": [
                { token: "@brackets.directive" },
                { token: "delimiter.directive" },
                { token: "tag" },
                { token: "" },
                { token: "@brackets.directive", next: "@popall" }
              ],
              "$S2==comment": [
                { token: "comment" },
                { token: "comment" },
                { token: "comment" },
                { token: "comment" },
                { token: "comment" }
              ],
              "@default": [
                { token: "source" },
                { token: "source" },
                { token: "source" },
                { token: "source" },
                { token: "source" }
              ]
            }
          }
        ],
        [
          /[^<\[\-]+|[<\[\-]/,
          {
            cases: {
              "$S2==comment": { token: "comment" },
              "@default": { token: "source" }
            }
          }
        ]
      ],
      [s("expression_comment_token__id__")]: [
        [
          /--[>\]]/,
          {
            token: "comment",
            next: "@pop"
          }
        ],
        [/[^\->\]]+|[>\]\-]/, { token: "comment" }]
      ],
      [s("terse_comment_token__id__")]: [
        [r(/--(?:@close__id__)/), { token: "comment", next: "@popall" }],
        [/[^<\[\-]+|[<\[\-]/, { token: "comment" }]
      ]
    }
  };
}
function createMonarchLanguageAuto(is) {
  const angle = createMonarchLanguage(TagSyntaxAngle, is);
  const bracket = createMonarchLanguage(TagSyntaxBracket, is);
  const auto = createMonarchLanguage(TagSyntaxAuto, is);
  return {
    ...angle,
    ...bracket,
    ...auto,
    unicode: true,
    includeLF: false,
    start: `default_auto_${is.id}`,
    ignoreCase: false,
    defaultToken: "invalid",
    tokenPostfix: `.freemarker2`,
    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" },
      { open: "(", close: ")", token: "delimiter.parenthesis" },
      { open: "<", close: ">", token: "delimiter.angle" }
    ],
    tokenizer: {
      ...angle.tokenizer,
      ...bracket.tokenizer,
      ...auto.tokenizer
    }
  };
}
var TagAngleInterpolationDollar = {
  conf: createLangConfiguration(TagSyntaxAngle),
  language: createMonarchLanguage(TagSyntaxAngle, InterpolationSyntaxDollar)
};
var TagBracketInterpolationDollar = {
  conf: createLangConfiguration(TagSyntaxBracket),
  language: createMonarchLanguage(TagSyntaxBracket, InterpolationSyntaxDollar)
};
var TagAngleInterpolationBracket = {
  conf: createLangConfiguration(TagSyntaxAngle),
  language: createMonarchLanguage(TagSyntaxAngle, InterpolationSyntaxBracket)
};
var TagBracketInterpolationBracket = {
  conf: createLangConfiguration(TagSyntaxBracket),
  language: createMonarchLanguage(TagSyntaxBracket, InterpolationSyntaxBracket)
};
var TagAutoInterpolationDollar = {
  conf: createLangConfigurationAuto(),
  language: createMonarchLanguageAuto(InterpolationSyntaxDollar)
};
var TagAutoInterpolationBracket = {
  conf: createLangConfigurationAuto(),
  language: createMonarchLanguageAuto(InterpolationSyntaxBracket)
};
export {
  TagAngleInterpolationBracket,
  TagAngleInterpolationDollar,
  TagAutoInterpolationBracket,
  TagAutoInterpolationDollar,
  TagBracketInterpolationBracket,
  TagBracketInterpolationDollar
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJlZW1hcmtlcjIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvZnJlZW1hcmtlcjIvZnJlZW1hcmtlcjIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3JlRXhwb3J0ID0gKHRhcmdldCwgbW9kLCBzZWNvbmRUYXJnZXQpID0+IChfX2NvcHlQcm9wcyh0YXJnZXQsIG1vZCwgXCJkZWZhdWx0XCIpLCBzZWNvbmRUYXJnZXQgJiYgX19jb3B5UHJvcHMoc2Vjb25kVGFyZ2V0LCBtb2QsIFwiZGVmYXVsdFwiKSk7XG5cbi8vIHNyYy9maWxsZXJzL21vbmFjby1lZGl0b3ItY29yZS50c1xudmFyIG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzID0ge307XG5fX3JlRXhwb3J0KG1vbmFjb19lZGl0b3JfY29yZV9leHBvcnRzLCBtb25hY29fZWRpdG9yX2NvcmVfc3Rhcik7XG5pbXBvcnQgKiBhcyBtb25hY29fZWRpdG9yX2NvcmVfc3RhciBmcm9tIFwiLi4vLi4vZWRpdG9yL2VkaXRvci5hcGkuanNcIjtcblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy9mcmVlbWFya2VyMi9mcmVlbWFya2VyMi50c1xudmFyIEVNUFRZX0VMRU1FTlRTID0gW1xuICBcImFzc2lnblwiLFxuICBcImZsdXNoXCIsXG4gIFwiZnRsXCIsXG4gIFwicmV0dXJuXCIsXG4gIFwiZ2xvYmFsXCIsXG4gIFwiaW1wb3J0XCIsXG4gIFwiaW5jbHVkZVwiLFxuICBcImJyZWFrXCIsXG4gIFwiY29udGludWVcIixcbiAgXCJsb2NhbFwiLFxuICBcIm5lc3RlZFwiLFxuICBcIm50XCIsXG4gIFwic2V0dGluZ1wiLFxuICBcInN0b3BcIixcbiAgXCJ0XCIsXG4gIFwibHRcIixcbiAgXCJydFwiLFxuICBcImZhbGxiYWNrXCJcbl07XG52YXIgQkxPQ0tfRUxFTUVOVFMgPSBbXG4gIFwiYXR0ZW1wdFwiLFxuICBcImF1dG9lc2NcIixcbiAgXCJhdXRvRXNjXCIsXG4gIFwiY29tcHJlc3NcIixcbiAgXCJjb21tZW50XCIsXG4gIFwiZXNjYXBlXCIsXG4gIFwibm9lc2NhcGVcIixcbiAgXCJmdW5jdGlvblwiLFxuICBcImlmXCIsXG4gIFwibGlzdFwiLFxuICBcIml0ZW1zXCIsXG4gIFwic2VwXCIsXG4gIFwibWFjcm9cIixcbiAgXCJub3BhcnNlXCIsXG4gIFwibm9QYXJzZVwiLFxuICBcIm5vYXV0b2VzY1wiLFxuICBcIm5vQXV0b0VzY1wiLFxuICBcIm91dHB1dGZvcm1hdFwiLFxuICBcInN3aXRjaFwiLFxuICBcInZpc2l0XCIsXG4gIFwicmVjdXJzZVwiXG5dO1xudmFyIFRhZ1N5bnRheEFuZ2xlID0ge1xuICBjbG9zZTogXCI+XCIsXG4gIGlkOiBcImFuZ2xlXCIsXG4gIG9wZW46IFwiPFwiXG59O1xudmFyIFRhZ1N5bnRheEJyYWNrZXQgPSB7XG4gIGNsb3NlOiBcIlxcXFxdXCIsXG4gIGlkOiBcImJyYWNrZXRcIixcbiAgb3BlbjogXCJcXFxcW1wiXG59O1xudmFyIFRhZ1N5bnRheEF1dG8gPSB7XG4gIGNsb3NlOiBcIls+XFxcXF1dXCIsXG4gIGlkOiBcImF1dG9cIixcbiAgb3BlbjogXCJbPFxcXFxbXVwiXG59O1xudmFyIEludGVycG9sYXRpb25TeW50YXhEb2xsYXIgPSB7XG4gIGNsb3NlOiBcIlxcXFx9XCIsXG4gIGlkOiBcImRvbGxhclwiLFxuICBvcGVuMTogXCJcXFxcJFwiLFxuICBvcGVuMjogXCJcXFxce1wiXG59O1xudmFyIEludGVycG9sYXRpb25TeW50YXhCcmFja2V0ID0ge1xuICBjbG9zZTogXCJcXFxcXVwiLFxuICBpZDogXCJicmFja2V0XCIsXG4gIG9wZW4xOiBcIlxcXFxbXCIsXG4gIG9wZW4yOiBcIj1cIlxufTtcbmZ1bmN0aW9uIGNyZWF0ZUxhbmdDb25maWd1cmF0aW9uKHRzKSB7XG4gIHJldHVybiB7XG4gICAgYnJhY2tldHM6IFtcbiAgICAgIFtcIjxcIiwgXCI+XCJdLFxuICAgICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgICBbXCIoXCIsIFwiKVwiXSxcbiAgICAgIFtcIntcIiwgXCJ9XCJdXG4gICAgXSxcbiAgICBjb21tZW50czoge1xuICAgICAgYmxvY2tDb21tZW50OiBbYCR7dHMub3Blbn0tLWAsIGAtLSR7dHMuY2xvc2V9YF1cbiAgICB9LFxuICAgIGF1dG9DbG9zZUJlZm9yZTogXCJcXG5cXHJcdCB9XSksLjo7PVwiLFxuICAgIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicsIG5vdEluOiBbXCJzdHJpbmdcIl0gfSxcbiAgICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiXSB9XG4gICAgXSxcbiAgICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiB9XG4gICAgXSxcbiAgICBmb2xkaW5nOiB7XG4gICAgICBtYXJrZXJzOiB7XG4gICAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKGAke3RzLm9wZW59Iyg/OiR7QkxPQ0tfRUxFTUVOVFMuam9pbihcInxcIil9KShbXi8ke3RzLmNsb3NlfV0qKD8hLykke3RzLmNsb3NlfSlbXiR7dHMub3Blbn1dKiRgKSxcbiAgICAgICAgZW5kOiBuZXcgUmVnRXhwKGAke3RzLm9wZW59LyMoPzoke0JMT0NLX0VMRU1FTlRTLmpvaW4oXCJ8XCIpfSlbXFxcXHJcXFxcblxcXFx0IF0qPmApXG4gICAgICB9XG4gICAgfSxcbiAgICBvbkVudGVyUnVsZXM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVmb3JlVGV4dDogbmV3IFJlZ0V4cChgJHt0cy5vcGVufSMoPyEoPzoke0VNUFRZX0VMRU1FTlRTLmpvaW4oXCJ8XCIpfSkpKFthLXpBLVpfXSspKFteLyR7dHMuY2xvc2V9XSooPyEvKSR7dHMuY2xvc2V9KVteJHt0cy5vcGVufV0qJGApLFxuICAgICAgICBhZnRlclRleHQ6IG5ldyBSZWdFeHAoYF4ke3RzLm9wZW59LyMoW2EtekEtWl9dKylbXFxcXHJcXFxcblxcXFx0IF0qJHt0cy5jbG9zZX0kYCksXG4gICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgIGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5JbmRlbnRPdXRkZW50XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZm9yZVRleHQ6IG5ldyBSZWdFeHAoYCR7dHMub3Blbn0jKD8hKD86JHtFTVBUWV9FTEVNRU5UUy5qb2luKFwifFwiKX0pKShbYS16QS1aX10rKShbXi8ke3RzLmNsb3NlfV0qKD8hLykke3RzLmNsb3NlfSlbXiR7dHMub3Blbn1dKiRgKSxcbiAgICAgICAgYWN0aW9uOiB7IGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5JbmRlbnQgfVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUxhbmdDb25maWd1cmF0aW9uQXV0bygpIHtcbiAgcmV0dXJuIHtcbiAgICBicmFja2V0czogW1xuICAgICAgW1wiPFwiLCBcIj5cIl0sXG4gICAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICAgIFtcIihcIiwgXCIpXCJdLFxuICAgICAgW1wie1wiLCBcIn1cIl1cbiAgICBdLFxuICAgIGF1dG9DbG9zZUJlZm9yZTogXCJcXG5cXHJcdCB9XSksLjo7PVwiLFxuICAgIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicsIG5vdEluOiBbXCJzdHJpbmdcIl0gfSxcbiAgICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiXSB9XG4gICAgXSxcbiAgICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiB9XG4gICAgXSxcbiAgICBmb2xkaW5nOiB7XG4gICAgICBtYXJrZXJzOiB7XG4gICAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKGBbPFxcXFxbXSMoPzoke0JMT0NLX0VMRU1FTlRTLmpvaW4oXCJ8XCIpfSkoW14vPlxcXFxdXSooPyEvKVs+XFxcXF1dKVtePFxcXFxbXSokYCksXG4gICAgICAgIGVuZDogbmV3IFJlZ0V4cChgWzxcXFxcW10vIyg/OiR7QkxPQ0tfRUxFTUVOVFMuam9pbihcInxcIil9KVtcXFxcclxcXFxuXFxcXHQgXSo+YClcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uRW50ZXJSdWxlczogW1xuICAgICAge1xuICAgICAgICBiZWZvcmVUZXh0OiBuZXcgUmVnRXhwKGBbPFxcXFxbXSMoPyEoPzoke0VNUFRZX0VMRU1FTlRTLmpvaW4oXCJ8XCIpfSkpKFthLXpBLVpfXSspKFteLz5cXFxcXV0qKD8hLylbPlxcXFxdXSlbXls8XFxcXFtdXSokYCksXG4gICAgICAgIGFmdGVyVGV4dDogbmV3IFJlZ0V4cChgXls8XFxcXFtdLyMoW2EtekEtWl9dKylbXFxcXHJcXFxcblxcXFx0IF0qWz5cXFxcXV0kYCksXG4gICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgIGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5JbmRlbnRPdXRkZW50XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZm9yZVRleHQ6IG5ldyBSZWdFeHAoYFs8XFxcXFtdIyg/ISg/OiR7RU1QVFlfRUxFTUVOVFMuam9pbihcInxcIil9KSkoW2EtekEtWl9dKykoW14vPlxcXFxdXSooPyEvKVs+XFxcXF1dKVteWzxcXFxcW11dKiRgKSxcbiAgICAgICAgYWN0aW9uOiB7IGluZGVudEFjdGlvbjogbW9uYWNvX2VkaXRvcl9jb3JlX2V4cG9ydHMubGFuZ3VhZ2VzLkluZGVudEFjdGlvbi5JbmRlbnQgfVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZU1vbmFyY2hMYW5ndWFnZSh0cywgaXMpIHtcbiAgY29uc3QgaWQgPSBgXyR7dHMuaWR9XyR7aXMuaWR9YDtcbiAgY29uc3QgcyA9IChuYW1lKSA9PiBuYW1lLnJlcGxhY2UoL19faWRfXy9nLCBpZCk7XG4gIGNvbnN0IHIgPSAocmVnZXhwKSA9PiB7XG4gICAgY29uc3Qgc291cmNlID0gcmVnZXhwLnNvdXJjZS5yZXBsYWNlKC9fX2lkX18vZywgaWQpO1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHNvdXJjZSwgcmVnZXhwLmZsYWdzKTtcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICB1bmljb2RlOiB0cnVlLFxuICAgIGluY2x1ZGVMRjogZmFsc2UsXG4gICAgc3RhcnQ6IHMoXCJkZWZhdWx0X19pZF9fXCIpLFxuICAgIGlnbm9yZUNhc2U6IGZhbHNlLFxuICAgIGRlZmF1bHRUb2tlbjogXCJpbnZhbGlkXCIsXG4gICAgdG9rZW5Qb3N0Zml4OiBgLmZyZWVtYXJrZXIyYCxcbiAgICBicmFja2V0czogW1xuICAgICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuY3VybHlcIiB9LFxuICAgICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIgfSxcbiAgICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmFuZ2xlXCIgfVxuICAgIF0sXG4gICAgW3MoXCJvcGVuX19pZF9fXCIpXTogbmV3IFJlZ0V4cCh0cy5vcGVuKSxcbiAgICBbcyhcImNsb3NlX19pZF9fXCIpXTogbmV3IFJlZ0V4cCh0cy5jbG9zZSksXG4gICAgW3MoXCJpT3BlbjFfX2lkX19cIildOiBuZXcgUmVnRXhwKGlzLm9wZW4xKSxcbiAgICBbcyhcImlPcGVuMl9faWRfX1wiKV06IG5ldyBSZWdFeHAoaXMub3BlbjIpLFxuICAgIFtzKFwiaUNsb3NlX19pZF9fXCIpXTogbmV3IFJlZ0V4cChpcy5jbG9zZSksXG4gICAgW3MoXCJzdGFydFRhZ19faWRfX1wiKV06IHIoLyhAb3Blbl9faWRfXykoIykvKSxcbiAgICBbcyhcImVuZFRhZ19faWRfX1wiKV06IHIoLyhAb3Blbl9faWRfXykoXFwvIykvKSxcbiAgICBbcyhcInN0YXJ0T3JFbmRUYWdfX2lkX19cIildOiByKC8oQG9wZW5fX2lkX18pKFxcLz8jKS8pLFxuICAgIFtzKFwiY2xvc2VUYWcxX19pZF9fXCIpXTogcigvKCg/OkBibGFuaykqKShAY2xvc2VfX2lkX18pLyksXG4gICAgW3MoXCJjbG9zZVRhZzJfX2lkX19cIildOiByKC8oKD86QGJsYW5rKSpcXC8/KShAY2xvc2VfX2lkX18pLyksXG4gICAgYmxhbms6IC9bIFxcdFxcblxccl0vLFxuICAgIGtleXdvcmRzOiBbXCJmYWxzZVwiLCBcInRydWVcIiwgXCJpblwiLCBcImFzXCIsIFwidXNpbmdcIl0sXG4gICAgZGlyZWN0aXZlU3RhcnRDbG9zZVRhZzE6IC9hdHRlbXB0fHJlY292ZXJ8c2VwfGF1dG9bZUVdc2N8bm8oPzphdXRvZXxBdXRvRSlzY3xjb21wcmVzc3xkZWZhdWx0fG5vW2VFXXNjYXBlfGNvbW1lbnR8bm9bcFBdYXJzZS8sXG4gICAgZGlyZWN0aXZlU3RhcnRDbG9zZVRhZzI6IC9lbHNlfGJyZWFrfGNvbnRpbnVlfHJldHVybnxzdG9wfGZsdXNofHR8bHR8cnR8bnR8bmVzdGVkfHJlY3Vyc2V8ZmFsbGJhY2t8ZnRsLyxcbiAgICBkaXJlY3RpdmVTdGFydEJsYW5rOiAvaWZ8ZWxzZVtpSV1mfGxpc3R8Zm9yW2VFXWFjaHxzd2l0Y2h8Y2FzZXxhc3NpZ258Z2xvYmFsfGxvY2FsfGluY2x1ZGV8aW1wb3J0fGZ1bmN0aW9ufG1hY3JvfHRyYW5zZm9ybXx2aXNpdHxzdG9wfHJldHVybnxjYWxsfHNldHRpbmd8b3V0cHV0W2ZGXW9ybWF0fG5lc3RlZHxyZWN1cnNlfGVzY2FwZXxmdGx8aXRlbXMvLFxuICAgIGRpcmVjdGl2ZUVuZENsb3NlVGFnMTogL2lmfGxpc3R8aXRlbXN8c2VwfHJlY292ZXJ8YXR0ZW1wdHxmb3JbZUVdYWNofGxvY2FsfGdsb2JhbHxhc3NpZ258ZnVuY3Rpb258bWFjcm98b3V0cHV0W2ZGXW9ybWF0fGF1dG9bZUVdc2N8bm8oPzphdXRvZXxBdXRvRSlzY3xjb21wcmVzc3x0cmFuc2Zvcm18c3dpdGNofGVzY2FwZXxub1tlRV1zY2FwZS8sXG4gICAgZXNjYXBlZENoYXI6IC9cXFxcKD86W250cmZiZ2xhXFxcXCdcIlxcez1dfCg/OnhbMC05QS1GYS1mXXsxLDR9KSkvLFxuICAgIGFzY2lpRGlnaXQ6IC9bMC05XS8sXG4gICAgaW50ZWdlcjogL1swLTldKy8sXG4gICAgbm9uRXNjYXBlZElkU3RhcnRDaGFyOiAvW1xcJEAtWl9hLXpcXHUwMEFBXFx1MDBCNVxcdTAwQkFcXHUwMEMwLVxcdTAwRDZcXHUwMEQ4LVxcdTAwRjZcXHUwMEY4LVxcdTFGRkZcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTIxMDJcXHUyMTA3XFx1MjEwQS1cXHUyMTEzXFx1MjExNVxcdTIxMTktXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEyRFxcdTIxMkYtXFx1MjEzOVxcdTIxM0MtXFx1MjEzRlxcdTIxNDUtXFx1MjE0OVxcdTIxNEVcXHUyMTgzLVxcdTIxODRcXHUyQzAwLVxcdTJDMkVcXHUyQzMwLVxcdTJDNUVcXHUyQzYwLVxcdTJDRTRcXHUyQ0VCLVxcdTJDRUVcXHUyQ0YyLVxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdTJEMzAtXFx1MkQ2N1xcdTJENkZcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUyRTJGXFx1MzAwNS1cXHUzMDA2XFx1MzAzMS1cXHUzMDM1XFx1MzAzQi1cXHUzMDNDXFx1MzA0MC1cXHUzMThGXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzMwMC1cXHUzMzdGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHVBNDhDXFx1QTREMC1cXHVBNEZEXFx1QTUwMC1cXHVBNjBDXFx1QTYxMC1cXHVBNjJCXFx1QTY0MC1cXHVBNjZFXFx1QTY3Ri1cXHVBNjk3XFx1QTZBMC1cXHVBNkU1XFx1QTcxNy1cXHVBNzFGXFx1QTcyMi1cXHVBNzg4XFx1QTc4Qi1cXHVBNzhFXFx1QTc5MC1cXHVBNzkzXFx1QTdBMC1cXHVBN0FBXFx1QTdGOC1cXHVBODAxXFx1QTgwMy1cXHVBODA1XFx1QTgwNy1cXHVBODBBXFx1QTgwQy1cXHVBODIyXFx1QTg0MC1cXHVBODczXFx1QTg4Mi1cXHVBOEIzXFx1QThEMC1cXHVBOEQ5XFx1QThGMi1cXHVBOEY3XFx1QThGQlxcdUE5MDAtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5Q0YtXFx1QTlEOVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNTAtXFx1QUE1OVxcdUFBNjAtXFx1QUE3NlxcdUFBN0FcXHVBQTgwLVxcdUFBQUZcXHVBQUIxXFx1QUFCNS1cXHVBQUI2XFx1QUFCOS1cXHVBQUJEXFx1QUFDMFxcdUFBQzJcXHVBQURCLVxcdUFBRERcXHVBQUUwLVxcdUFBRUFcXHVBQUYyLVxcdUFBRjRcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQkMwLVxcdUFCRTJcXHVBQkYwLVxcdUFCRjlcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDAtXFx1RkI0MVxcdUZCNDMtXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGMTAtXFx1RkYxOVxcdUZGMjEtXFx1RkYzQVxcdUZGNDEtXFx1RkY1QVxcdUZGNjYtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ10vLFxuICAgIGVzY2FwZWRJZENoYXI6IC9cXFxcW1xcLVxcLjojXS8sXG4gICAgaWRTdGFydENoYXI6IC8oPzpAbm9uRXNjYXBlZElkU3RhcnRDaGFyKXwoPzpAZXNjYXBlZElkQ2hhcikvLFxuICAgIGlkOiAvKD86QGlkU3RhcnRDaGFyKSg/Oig/OkBpZFN0YXJ0Q2hhcil8KD86QGFzY2lpRGlnaXQpKSovLFxuICAgIHNwZWNpYWxIYXNoS2V5czogL1xcKlxcKnxcXCp8ZmFsc2V8dHJ1ZXxpbnxhc3x1c2luZy8sXG4gICAgbmFtZWRTeW1ib2xzOiAvJmx0Oz18Jmd0Oz18XFxcXGx0ZXxcXFxcbHR8Jmx0O3xcXFxcZ3RlfFxcXFxndHwmZ3Q7fCZhbXA7JmFtcDt8XFxcXGFuZHwtJmd0O3wtPnw9PXwhPXxcXCs9fC09fFxcKj18XFwvPXwlPXxcXCtcXCt8LS18PD18JiZ8XFx8XFx8fDp8XFwuXFwuXFwufFxcLlxcLlxcKnxcXC5cXC48fFxcLlxcLiF8XFw/XFw/fD18PHxcXCt8LXxcXCp8XFwvfCV8XFx8fFxcLlxcLnxcXD98IXwmfFxcLnwsfDsvLFxuICAgIGFycm93czogW1wiLT5cIiwgXCItJmd0O1wiXSxcbiAgICBkZWxpbWl0ZXJzOiBbXCI7XCIsIFwiOlwiLCBcIixcIiwgXCIuXCJdLFxuICAgIHN0cmluZ09wZXJhdG9yczogW1wibHRlXCIsIFwibHRcIiwgXCJndGVcIiwgXCJndFwiXSxcbiAgICBub1BhcnNlVGFnczogW1wibm9wYXJzZVwiLCBcIm5vUGFyc2VcIiwgXCJjb21tZW50XCJdLFxuICAgIHRva2VuaXplcjoge1xuICAgICAgW3MoXCJkZWZhdWx0X19pZF9fXCIpXTogW1xuICAgICAgICB7IGluY2x1ZGU6IHMoXCJAZGlyZWN0aXZlX3Rva2VuX19pZF9fXCIpIH0sXG4gICAgICAgIHsgaW5jbHVkZTogcyhcIkBpbnRlcnBvbGF0aW9uX2FuZF90ZXh0X3Rva2VuX19pZF9fXCIpIH1cbiAgICAgIF0sXG4gICAgICBbcyhcImZtRXhwcmVzc2lvbl9faWRfXy5kaXJlY3RpdmVcIildOiBbXG4gICAgICAgIHsgaW5jbHVkZTogcyhcIkBibGFua19hbmRfZXhwcmVzc2lvbl9jb21tZW50X3Rva2VuX19pZF9fXCIpIH0sXG4gICAgICAgIHsgaW5jbHVkZTogcyhcIkBkaXJlY3RpdmVfZW5kX3Rva2VuX19pZF9fXCIpIH0sXG4gICAgICAgIHsgaW5jbHVkZTogcyhcIkBleHByZXNzaW9uX3Rva2VuX19pZF9fXCIpIH1cbiAgICAgIF0sXG4gICAgICBbcyhcImZtRXhwcmVzc2lvbl9faWRfXy5pbnRlcnBvbGF0aW9uXCIpXTogW1xuICAgICAgICB7IGluY2x1ZGU6IHMoXCJAYmxhbmtfYW5kX2V4cHJlc3Npb25fY29tbWVudF90b2tlbl9faWRfX1wiKSB9LFxuICAgICAgICB7IGluY2x1ZGU6IHMoXCJAZXhwcmVzc2lvbl90b2tlbl9faWRfX1wiKSB9LFxuICAgICAgICB7IGluY2x1ZGU6IHMoXCJAZ3JlYXRlcl9vcGVyYXRvcnNfdG9rZW5fX2lkX19cIikgfVxuICAgICAgXSxcbiAgICAgIFtzKFwiaW5QYXJlbl9faWRfXy5wbGFpblwiKV06IFtcbiAgICAgICAgeyBpbmNsdWRlOiBzKFwiQGJsYW5rX2FuZF9leHByZXNzaW9uX2NvbW1lbnRfdG9rZW5fX2lkX19cIikgfSxcbiAgICAgICAgeyBpbmNsdWRlOiBzKFwiQGRpcmVjdGl2ZV9lbmRfdG9rZW5fX2lkX19cIikgfSxcbiAgICAgICAgeyBpbmNsdWRlOiBzKFwiQGV4cHJlc3Npb25fdG9rZW5fX2lkX19cIikgfVxuICAgICAgXSxcbiAgICAgIFtzKFwiaW5QYXJlbl9faWRfXy5ndFwiKV06IFtcbiAgICAgICAgeyBpbmNsdWRlOiBzKFwiQGJsYW5rX2FuZF9leHByZXNzaW9uX2NvbW1lbnRfdG9rZW5fX2lkX19cIikgfSxcbiAgICAgICAgeyBpbmNsdWRlOiBzKFwiQGV4cHJlc3Npb25fdG9rZW5fX2lkX19cIikgfSxcbiAgICAgICAgeyBpbmNsdWRlOiBzKFwiQGdyZWF0ZXJfb3BlcmF0b3JzX3Rva2VuX19pZF9fXCIpIH1cbiAgICAgIF0sXG4gICAgICBbcyhcIm5vU3BhY2VFeHByZXNzaW9uX19pZF9fXCIpXTogW1xuICAgICAgICB7IGluY2x1ZGU6IHMoXCJAbm9fc3BhY2VfZXhwcmVzc2lvbl9lbmRfdG9rZW5fX2lkX19cIikgfSxcbiAgICAgICAgeyBpbmNsdWRlOiBzKFwiQGRpcmVjdGl2ZV9lbmRfdG9rZW5fX2lkX19cIikgfSxcbiAgICAgICAgeyBpbmNsdWRlOiBzKFwiQGV4cHJlc3Npb25fdG9rZW5fX2lkX19cIikgfVxuICAgICAgXSxcbiAgICAgIFtzKFwidW5pZmllZENhbGxfX2lkX19cIildOiBbeyBpbmNsdWRlOiBzKFwiQHVuaWZpZWRfY2FsbF90b2tlbl9faWRfX1wiKSB9XSxcbiAgICAgIFtzKFwic2luZ2xlU3RyaW5nX19pZF9fXCIpXTogW3sgaW5jbHVkZTogcyhcIkBzdHJpbmdfc2luZ2xlX3Rva2VuX19pZF9fXCIpIH1dLFxuICAgICAgW3MoXCJkb3VibGVTdHJpbmdfX2lkX19cIildOiBbeyBpbmNsdWRlOiBzKFwiQHN0cmluZ19kb3VibGVfdG9rZW5fX2lkX19cIikgfV0sXG4gICAgICBbcyhcInJhd1NpbmdsZVN0cmluZ19faWRfX1wiKV06IFt7IGluY2x1ZGU6IHMoXCJAc3RyaW5nX3NpbmdsZV9yYXdfdG9rZW5fX2lkX19cIikgfV0sXG4gICAgICBbcyhcInJhd0RvdWJsZVN0cmluZ19faWRfX1wiKV06IFt7IGluY2x1ZGU6IHMoXCJAc3RyaW5nX2RvdWJsZV9yYXdfdG9rZW5fX2lkX19cIikgfV0sXG4gICAgICBbcyhcImV4cHJlc3Npb25Db21tZW50X19pZF9fXCIpXTogW3sgaW5jbHVkZTogcyhcIkBleHByZXNzaW9uX2NvbW1lbnRfdG9rZW5fX2lkX19cIikgfV0sXG4gICAgICBbcyhcIm5vUGFyc2VfX2lkX19cIildOiBbeyBpbmNsdWRlOiBzKFwiQG5vX3BhcnNlX3Rva2VuX19pZF9fXCIpIH1dLFxuICAgICAgW3MoXCJ0ZXJzZUNvbW1lbnRfX2lkX19cIildOiBbeyBpbmNsdWRlOiBzKFwiQHRlcnNlX2NvbW1lbnRfdG9rZW5fX2lkX19cIikgfV0sXG4gICAgICBbcyhcImRpcmVjdGl2ZV90b2tlbl9faWRfX1wiKV06IFtcbiAgICAgICAgW1xuICAgICAgICAgIHIoLyg/OkBzdGFydFRhZ19faWRfXykoQGRpcmVjdGl2ZVN0YXJ0Q2xvc2VUYWcxKSg/OkBjbG9zZVRhZzFfX2lkX18pLyksXG4gICAgICAgICAgdHMuaWQgPT09IFwiYXV0b1wiID8ge1xuICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgXCIkMT09PFwiOiB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBgQGRlZmF1bHRfYW5nbGVfJHtpcy5pZH1gIH0sXG4gICAgICAgICAgICAgIFwiJDE9PVtcIjogeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogYEBkZWZhdWx0X2JyYWNrZXRfJHtpcy5pZH1gIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IDogW1xuICAgICAgICAgICAgeyB0b2tlbjogXCJAYnJhY2tldHMuZGlyZWN0aXZlXCIgfSxcbiAgICAgICAgICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmRpcmVjdGl2ZVwiIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICAgICAgXCJAbm9QYXJzZVRhZ3NcIjogeyB0b2tlbjogXCJ0YWdcIiwgbmV4dDogcyhcIkBub1BhcnNlX19pZF9fLiQzXCIpIH0sXG4gICAgICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcInRhZ1wiIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmRpcmVjdGl2ZVwiIH0sXG4gICAgICAgICAgICB7IHRva2VuOiBcIkBicmFja2V0cy5kaXJlY3RpdmVcIiB9XG4gICAgICAgICAgXVxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgcigvKD86QHN0YXJ0VGFnX19pZF9fKShAZGlyZWN0aXZlU3RhcnRDbG9zZVRhZzIpKD86QGNsb3NlVGFnMl9faWRfXykvKSxcbiAgICAgICAgICB0cy5pZCA9PT0gXCJhdXRvXCIgPyB7XG4gICAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgICBcIiQxPT08XCI6IHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgc3dpdGNoVG86IGBAZGVmYXVsdF9hbmdsZV8ke2lzLmlkfWAgfSxcbiAgICAgICAgICAgICAgXCIkMT09W1wiOiB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBgQGRlZmF1bHRfYnJhY2tldF8ke2lzLmlkfWAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gOiBbXG4gICAgICAgICAgICB7IHRva2VuOiBcIkBicmFja2V0cy5kaXJlY3RpdmVcIiB9LFxuICAgICAgICAgICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIuZGlyZWN0aXZlXCIgfSxcbiAgICAgICAgICAgIHsgdG9rZW46IFwidGFnXCIgfSxcbiAgICAgICAgICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmRpcmVjdGl2ZVwiIH0sXG4gICAgICAgICAgICB7IHRva2VuOiBcIkBicmFja2V0cy5kaXJlY3RpdmVcIiB9XG4gICAgICAgICAgXVxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgcigvKD86QHN0YXJ0VGFnX19pZF9fKShAZGlyZWN0aXZlU3RhcnRCbGFuaykoQGJsYW5rKS8pLFxuICAgICAgICAgIHRzLmlkID09PSBcImF1dG9cIiA/IHtcbiAgICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICAgIFwiJDE9PTxcIjogeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogYEBkZWZhdWx0X2FuZ2xlXyR7aXMuaWR9YCB9LFxuICAgICAgICAgICAgICBcIiQxPT1bXCI6IHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgc3dpdGNoVG86IGBAZGVmYXVsdF9icmFja2V0XyR7aXMuaWR9YCB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSA6IFtcbiAgICAgICAgICAgIHsgdG9rZW46IFwiQGJyYWNrZXRzLmRpcmVjdGl2ZVwiIH0sXG4gICAgICAgICAgICB7IHRva2VuOiBcImRlbGltaXRlci5kaXJlY3RpdmVcIiB9LFxuICAgICAgICAgICAgeyB0b2tlbjogXCJ0YWdcIiB9LFxuICAgICAgICAgICAgeyB0b2tlbjogXCJcIiwgbmV4dDogcyhcIkBmbUV4cHJlc3Npb25fX2lkX18uZGlyZWN0aXZlXCIpIH1cbiAgICAgICAgICBdXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICByKC8oPzpAZW5kVGFnX19pZF9fKShAZGlyZWN0aXZlRW5kQ2xvc2VUYWcxKSg/OkBjbG9zZVRhZzFfX2lkX18pLyksXG4gICAgICAgICAgdHMuaWQgPT09IFwiYXV0b1wiID8ge1xuICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgXCIkMT09PFwiOiB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBgQGRlZmF1bHRfYW5nbGVfJHtpcy5pZH1gIH0sXG4gICAgICAgICAgICAgIFwiJDE9PVtcIjogeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogYEBkZWZhdWx0X2JyYWNrZXRfJHtpcy5pZH1gIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IDogW1xuICAgICAgICAgICAgeyB0b2tlbjogXCJAYnJhY2tldHMuZGlyZWN0aXZlXCIgfSxcbiAgICAgICAgICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmRpcmVjdGl2ZVwiIH0sXG4gICAgICAgICAgICB7IHRva2VuOiBcInRhZ1wiIH0sXG4gICAgICAgICAgICB7IHRva2VuOiBcImRlbGltaXRlci5kaXJlY3RpdmVcIiB9LFxuICAgICAgICAgICAgeyB0b2tlbjogXCJAYnJhY2tldHMuZGlyZWN0aXZlXCIgfVxuICAgICAgICAgIF1cbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIHIoLyhAb3Blbl9faWRfXykoQCkvKSxcbiAgICAgICAgICB0cy5pZCA9PT0gXCJhdXRvXCIgPyB7XG4gICAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgICBcIiQxPT08XCI6IHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgc3dpdGNoVG86IGBAZGVmYXVsdF9hbmdsZV8ke2lzLmlkfWAgfSxcbiAgICAgICAgICAgICAgXCIkMT09W1wiOiB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBgQGRlZmF1bHRfYnJhY2tldF8ke2lzLmlkfWAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gOiBbXG4gICAgICAgICAgICB7IHRva2VuOiBcIkBicmFja2V0cy5kaXJlY3RpdmVcIiB9LFxuICAgICAgICAgICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIuZGlyZWN0aXZlXCIsIG5leHQ6IHMoXCJAdW5pZmllZENhbGxfX2lkX19cIikgfVxuICAgICAgICAgIF1cbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIHIoLyhAb3Blbl9faWRfXykoXFwvQCkoKD86KD86QGlkKSg/OlxcLig/OkBpZCkpKik/KSg/OkBjbG9zZVRhZzFfX2lkX18pLyksXG4gICAgICAgICAgW1xuICAgICAgICAgICAgeyB0b2tlbjogXCJAYnJhY2tldHMuZGlyZWN0aXZlXCIgfSxcbiAgICAgICAgICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmRpcmVjdGl2ZVwiIH0sXG4gICAgICAgICAgICB7IHRva2VuOiBcInRhZ1wiIH0sXG4gICAgICAgICAgICB7IHRva2VuOiBcImRlbGltaXRlci5kaXJlY3RpdmVcIiB9LFxuICAgICAgICAgICAgeyB0b2tlbjogXCJAYnJhY2tldHMuZGlyZWN0aXZlXCIgfVxuICAgICAgICAgIF1cbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIHIoLyhAb3Blbl9faWRfXykjLS0vKSxcbiAgICAgICAgICB0cy5pZCA9PT0gXCJhdXRvXCIgPyB7XG4gICAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgICBcIiQxPT08XCI6IHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgc3dpdGNoVG86IGBAZGVmYXVsdF9hbmdsZV8ke2lzLmlkfWAgfSxcbiAgICAgICAgICAgICAgXCIkMT09W1wiOiB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBgQGRlZmF1bHRfYnJhY2tldF8ke2lzLmlkfWAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gOiB7IHRva2VuOiBcImNvbW1lbnRcIiwgbmV4dDogcyhcIkB0ZXJzZUNvbW1lbnRfX2lkX19cIikgfVxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgcigvKD86QHN0YXJ0T3JFbmRUYWdfX2lkX18pKFthLXpBLVpfXSspLyksXG4gICAgICAgICAgdHMuaWQgPT09IFwiYXV0b1wiID8ge1xuICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgXCIkMT09PFwiOiB7IHRva2VuOiBcIkByZW1hdGNoXCIsIHN3aXRjaFRvOiBgQGRlZmF1bHRfYW5nbGVfJHtpcy5pZH1gIH0sXG4gICAgICAgICAgICAgIFwiJDE9PVtcIjogeyB0b2tlbjogXCJAcmVtYXRjaFwiLCBzd2l0Y2hUbzogYEBkZWZhdWx0X2JyYWNrZXRfJHtpcy5pZH1gIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IDogW1xuICAgICAgICAgICAgeyB0b2tlbjogXCJAYnJhY2tldHMuZGlyZWN0aXZlXCIgfSxcbiAgICAgICAgICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmRpcmVjdGl2ZVwiIH0sXG4gICAgICAgICAgICB7IHRva2VuOiBcInRhZy5pbnZhbGlkXCIsIG5leHQ6IHMoXCJAZm1FeHByZXNzaW9uX19pZF9fLmRpcmVjdGl2ZVwiKSB9XG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICBdLFxuICAgICAgW3MoXCJpbnRlcnBvbGF0aW9uX2FuZF90ZXh0X3Rva2VuX19pZF9fXCIpXTogW1xuICAgICAgICBbXG4gICAgICAgICAgcigvKEBpT3BlbjFfX2lkX18pKEBpT3BlbjJfX2lkX18pLyksXG4gICAgICAgICAgW1xuICAgICAgICAgICAgeyB0b2tlbjogaXMuaWQgPT09IFwiYnJhY2tldFwiID8gXCJAYnJhY2tldHMuaW50ZXJwb2xhdGlvblwiIDogXCJkZWxpbWl0ZXIuaW50ZXJwb2xhdGlvblwiIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRva2VuOiBpcy5pZCA9PT0gXCJicmFja2V0XCIgPyBcImRlbGltaXRlci5pbnRlcnBvbGF0aW9uXCIgOiBcIkBicmFja2V0cy5pbnRlcnBvbGF0aW9uXCIsXG4gICAgICAgICAgICAgIG5leHQ6IHMoXCJAZm1FeHByZXNzaW9uX19pZF9fLmludGVycG9sYXRpb25cIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIF0sXG4gICAgICAgIFsvW1xcJCM8XFxbXFx7XXwoPzpAYmxhbmspK3xbXlxcJDwjXFxbXFx7XFxuXFxyXFx0IF0rLywgeyB0b2tlbjogXCJzb3VyY2VcIiB9XVxuICAgICAgXSxcbiAgICAgIFtzKFwic3RyaW5nX3NpbmdsZV90b2tlbl9faWRfX1wiKV06IFtcbiAgICAgICAgWy9bXidcXFxcXS8sIHsgdG9rZW46IFwic3RyaW5nXCIgfV0sXG4gICAgICAgIFsvQGVzY2FwZWRDaGFyLywgeyB0b2tlbjogXCJzdHJpbmcuZXNjYXBlXCIgfV0sXG4gICAgICAgIFsvJy8sIHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgICBdLFxuICAgICAgW3MoXCJzdHJpbmdfZG91YmxlX3Rva2VuX19pZF9fXCIpXTogW1xuICAgICAgICBbL1teXCJcXFxcXS8sIHsgdG9rZW46IFwic3RyaW5nXCIgfV0sXG4gICAgICAgIFsvQGVzY2FwZWRDaGFyLywgeyB0b2tlbjogXCJzdHJpbmcuZXNjYXBlXCIgfV0sXG4gICAgICAgIFsvXCIvLCB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgICAgXSxcbiAgICAgIFtzKFwic3RyaW5nX3NpbmdsZV9yYXdfdG9rZW5fX2lkX19cIildOiBbXG4gICAgICAgIFsvW14nXSsvLCB7IHRva2VuOiBcInN0cmluZy5yYXdcIiB9XSxcbiAgICAgICAgWy8nLywgeyB0b2tlbjogXCJzdHJpbmcucmF3XCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgICBdLFxuICAgICAgW3MoXCJzdHJpbmdfZG91YmxlX3Jhd190b2tlbl9faWRfX1wiKV06IFtcbiAgICAgICAgWy9bXlwiXSsvLCB7IHRva2VuOiBcInN0cmluZy5yYXdcIiB9XSxcbiAgICAgICAgWy9cIi8sIHsgdG9rZW46IFwic3RyaW5nLnJhd1wiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgICAgXSxcbiAgICAgIFtzKFwiZXhwcmVzc2lvbl90b2tlbl9faWRfX1wiKV06IFtcbiAgICAgICAgW1xuICAgICAgICAgIC8ocj8pKFsnXCJdKS8sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgXCJyJ1wiOiBbXG4gICAgICAgICAgICAgICAgeyB0b2tlbjogXCJrZXl3b3JkXCIgfSxcbiAgICAgICAgICAgICAgICB7IHRva2VuOiBcInN0cmluZy5yYXdcIiwgbmV4dDogcyhcIkByYXdTaW5nbGVTdHJpbmdfX2lkX19cIikgfVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnclwiJzogW1xuICAgICAgICAgICAgICAgIHsgdG9rZW46IFwia2V5d29yZFwiIH0sXG4gICAgICAgICAgICAgICAgeyB0b2tlbjogXCJzdHJpbmcucmF3XCIsIG5leHQ6IHMoXCJAcmF3RG91YmxlU3RyaW5nX19pZF9fXCIpIH1cbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXCInXCI6IFt7IHRva2VuOiBcInNvdXJjZVwiIH0sIHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IHMoXCJAc2luZ2xlU3RyaW5nX19pZF9fXCIpIH1dLFxuICAgICAgICAgICAgICAnXCInOiBbeyB0b2tlbjogXCJzb3VyY2VcIiB9LCB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBzKFwiQGRvdWJsZVN0cmluZ19faWRfX1wiKSB9XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIC8oPzpAaW50ZWdlcikoPzpcXC4oPzpAaW50ZWdlcikpPy8sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgXCIoPzpAaW50ZWdlcilcIjogeyB0b2tlbjogXCJudW1iZXJcIiB9LFxuICAgICAgICAgICAgICBcIkBkZWZhdWx0XCI6IHsgdG9rZW46IFwibnVtYmVyLmZsb2F0XCIgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIC8oXFwuKShAYmxhbmsqKShAc3BlY2lhbEhhc2hLZXlzKS8sXG4gICAgICAgICAgW3sgdG9rZW46IFwiZGVsaW1pdGVyXCIgfSwgeyB0b2tlbjogXCJcIiB9LCB7IHRva2VuOiBcImlkZW50aWZpZXJcIiB9XVxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgLyg/OkBuYW1lZFN5bWJvbHMpLyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgICBcIkBhcnJvd3NcIjogeyB0b2tlbjogXCJtZXRhLmFycm93XCIgfSxcbiAgICAgICAgICAgICAgXCJAZGVsaW1pdGVyc1wiOiB7IHRva2VuOiBcImRlbGltaXRlclwiIH0sXG4gICAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJvcGVyYXRvcnNcIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgL0BpZC8sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogeyB0b2tlbjogXCJrZXl3b3JkLiQwXCIgfSxcbiAgICAgICAgICAgICAgXCJAc3RyaW5nT3BlcmF0b3JzXCI6IHsgdG9rZW46IFwib3BlcmF0b3JzXCIgfSxcbiAgICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcImlkZW50aWZpZXJcIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgL1tcXFtcXF1cXChcXClcXHtcXH1dLyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgICBcIlxcXFxbXCI6IHtcbiAgICAgICAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgICAgICAgXCIkUzI9PWd0XCI6IHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIG5leHQ6IHMoXCJAaW5QYXJlbl9faWRfXy5ndFwiKSB9LFxuICAgICAgICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcIkBicmFja2V0c1wiLCBuZXh0OiBzKFwiQGluUGFyZW5fX2lkX18ucGxhaW5cIikgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJcXFxcXVwiOiB7XG4gICAgICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgICAgIC4uLmlzLmlkID09PSBcImJyYWNrZXRcIiA/IHtcbiAgICAgICAgICAgICAgICAgICAgXCIkUzI9PWludGVycG9sYXRpb25cIjogeyB0b2tlbjogXCJAYnJhY2tldHMuaW50ZXJwb2xhdGlvblwiLCBuZXh0OiBcIkBwb3BhbGxcIiB9XG4gICAgICAgICAgICAgICAgICB9IDoge30sXG4gICAgICAgICAgICAgICAgICAuLi50cy5pZCA9PT0gXCJicmFja2V0XCIgPyB7XG4gICAgICAgICAgICAgICAgICAgIFwiJFMyPT1kaXJlY3RpdmVcIjogeyB0b2tlbjogXCJAYnJhY2tldHMuZGlyZWN0aXZlXCIsIG5leHQ6IFwiQHBvcGFsbFwiIH1cbiAgICAgICAgICAgICAgICAgIH0gOiB7fSxcbiAgICAgICAgICAgICAgICAgIFtzKFwiJFMxPT1pblBhcmVuX19pZF9fXCIpXTogeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJAYnJhY2tldHNcIiB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIlxcXFwoXCI6IHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIG5leHQ6IHMoXCJAaW5QYXJlbl9faWRfXy5ndFwiKSB9LFxuICAgICAgICAgICAgICBcIlxcXFwpXCI6IHtcbiAgICAgICAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgICAgICAgW3MoXCIkUzE9PWluUGFyZW5fX2lkX19cIildOiB7IHRva2VuOiBcIkBicmFja2V0c1wiLCBuZXh0OiBcIkBwb3BcIiB9LFxuICAgICAgICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcIkBicmFja2V0c1wiIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiXFxcXHtcIjoge1xuICAgICAgICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICAgICAgICBcIiRTMj09Z3RcIjogeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgbmV4dDogcyhcIkBpblBhcmVuX19pZF9fLmd0XCIpIH0sXG4gICAgICAgICAgICAgICAgICBcIkBkZWZhdWx0XCI6IHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIG5leHQ6IHMoXCJAaW5QYXJlbl9faWRfXy5wbGFpblwiKSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIlxcXFx9XCI6IHtcbiAgICAgICAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgICAgICAgLi4uaXMuaWQgPT09IFwiYnJhY2tldFwiID8ge30gOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiJFMyPT1pbnRlcnBvbGF0aW9uXCI6IHsgdG9rZW46IFwiQGJyYWNrZXRzLmludGVycG9sYXRpb25cIiwgbmV4dDogXCJAcG9wYWxsXCIgfVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFtzKFwiJFMxPT1pblBhcmVuX19pZF9fXCIpXTogeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJAYnJhY2tldHNcIiB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBbL1xcJFxcey8sIHsgdG9rZW46IFwiZGVsaW1pdGVyLmludmFsaWRcIiB9XVxuICAgICAgXSxcbiAgICAgIFtzKFwiYmxhbmtfYW5kX2V4cHJlc3Npb25fY29tbWVudF90b2tlbl9faWRfX1wiKV06IFtcbiAgICAgICAgWy8oPzpAYmxhbmspKy8sIHsgdG9rZW46IFwiXCIgfV0sXG4gICAgICAgIFsvWzxcXFtdWyMhXS0tLywgeyB0b2tlbjogXCJjb21tZW50XCIsIG5leHQ6IHMoXCJAZXhwcmVzc2lvbkNvbW1lbnRfX2lkX19cIikgfV1cbiAgICAgIF0sXG4gICAgICBbcyhcImRpcmVjdGl2ZV9lbmRfdG9rZW5fX2lkX19cIildOiBbXG4gICAgICAgIFtcbiAgICAgICAgICAvPi8sXG4gICAgICAgICAgdHMuaWQgPT09IFwiYnJhY2tldFwiID8geyB0b2tlbjogXCJvcGVyYXRvcnNcIiB9IDogeyB0b2tlbjogXCJAYnJhY2tldHMuZGlyZWN0aXZlXCIsIG5leHQ6IFwiQHBvcGFsbFwiIH1cbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIHIoLyhcXC8pKEBjbG9zZV9faWRfXykvKSxcbiAgICAgICAgICBbeyB0b2tlbjogXCJkZWxpbWl0ZXIuZGlyZWN0aXZlXCIgfSwgeyB0b2tlbjogXCJAYnJhY2tldHMuZGlyZWN0aXZlXCIsIG5leHQ6IFwiQHBvcGFsbFwiIH1dXG4gICAgICAgIF1cbiAgICAgIF0sXG4gICAgICBbcyhcImdyZWF0ZXJfb3BlcmF0b3JzX3Rva2VuX19pZF9fXCIpXTogW1xuICAgICAgICBbLz4vLCB7IHRva2VuOiBcIm9wZXJhdG9yc1wiIH1dLFxuICAgICAgICBbLz49LywgeyB0b2tlbjogXCJvcGVyYXRvcnNcIiB9XVxuICAgICAgXSxcbiAgICAgIFtzKFwibm9fc3BhY2VfZXhwcmVzc2lvbl9lbmRfdG9rZW5fX2lkX19cIildOiBbXG4gICAgICAgIFsvKD86QGJsYW5rKSsvLCB7IHRva2VuOiBcIlwiLCBzd2l0Y2hUbzogcyhcIkBmbUV4cHJlc3Npb25fX2lkX18uZGlyZWN0aXZlXCIpIH1dXG4gICAgICBdLFxuICAgICAgW3MoXCJ1bmlmaWVkX2NhbGxfdG9rZW5fX2lkX19cIildOiBbXG4gICAgICAgIFtcbiAgICAgICAgICAvKEBpZCkoKD86QGJsYW5rKSspLyxcbiAgICAgICAgICBbeyB0b2tlbjogXCJ0YWdcIiB9LCB7IHRva2VuOiBcIlwiLCBuZXh0OiBzKFwiQGZtRXhwcmVzc2lvbl9faWRfXy5kaXJlY3RpdmVcIikgfV1cbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIHIoLyhAaWQpKFxcLz8pKEBjbG9zZV9faWRfXykvKSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7IHRva2VuOiBcInRhZ1wiIH0sXG4gICAgICAgICAgICB7IHRva2VuOiBcImRlbGltaXRlci5kaXJlY3RpdmVcIiB9LFxuICAgICAgICAgICAgeyB0b2tlbjogXCJAYnJhY2tldHMuZGlyZWN0aXZlXCIsIG5leHQ6IFwiQHBvcGFsbFwiIH1cbiAgICAgICAgICBdXG4gICAgICAgIF0sXG4gICAgICAgIFsvLi8sIHsgdG9rZW46IFwiQHJlbWF0Y2hcIiwgbmV4dDogcyhcIkBub1NwYWNlRXhwcmVzc2lvbl9faWRfX1wiKSB9XVxuICAgICAgXSxcbiAgICAgIFtzKFwibm9fcGFyc2VfdG9rZW5fX2lkX19cIildOiBbXG4gICAgICAgIFtcbiAgICAgICAgICByKC8oQG9wZW5fX2lkX18pKFxcLyM/KShbYS16QS1aXSspKCg/OkBibGFuaykqKShAY2xvc2VfX2lkX18pLyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgXCIkUzI9PSQzXCI6IFtcbiAgICAgICAgICAgICAgICB7IHRva2VuOiBcIkBicmFja2V0cy5kaXJlY3RpdmVcIiB9LFxuICAgICAgICAgICAgICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmRpcmVjdGl2ZVwiIH0sXG4gICAgICAgICAgICAgICAgeyB0b2tlbjogXCJ0YWdcIiB9LFxuICAgICAgICAgICAgICAgIHsgdG9rZW46IFwiXCIgfSxcbiAgICAgICAgICAgICAgICB7IHRva2VuOiBcIkBicmFja2V0cy5kaXJlY3RpdmVcIiwgbmV4dDogXCJAcG9wYWxsXCIgfVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBcIiRTMj09Y29tbWVudFwiOiBbXG4gICAgICAgICAgICAgICAgeyB0b2tlbjogXCJjb21tZW50XCIgfSxcbiAgICAgICAgICAgICAgICB7IHRva2VuOiBcImNvbW1lbnRcIiB9LFxuICAgICAgICAgICAgICAgIHsgdG9rZW46IFwiY29tbWVudFwiIH0sXG4gICAgICAgICAgICAgICAgeyB0b2tlbjogXCJjb21tZW50XCIgfSxcbiAgICAgICAgICAgICAgICB7IHRva2VuOiBcImNvbW1lbnRcIiB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogW1xuICAgICAgICAgICAgICAgIHsgdG9rZW46IFwic291cmNlXCIgfSxcbiAgICAgICAgICAgICAgICB7IHRva2VuOiBcInNvdXJjZVwiIH0sXG4gICAgICAgICAgICAgICAgeyB0b2tlbjogXCJzb3VyY2VcIiB9LFxuICAgICAgICAgICAgICAgIHsgdG9rZW46IFwic291cmNlXCIgfSxcbiAgICAgICAgICAgICAgICB7IHRva2VuOiBcInNvdXJjZVwiIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIC9bXjxcXFtcXC1dK3xbPFxcW1xcLV0vLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICAgIFwiJFMyPT1jb21tZW50XCI6IHsgdG9rZW46IFwiY29tbWVudFwiIH0sXG4gICAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJzb3VyY2VcIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICBdLFxuICAgICAgW3MoXCJleHByZXNzaW9uX2NvbW1lbnRfdG9rZW5fX2lkX19cIildOiBbXG4gICAgICAgIFtcbiAgICAgICAgICAvLS1bPlxcXV0vLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcImNvbW1lbnRcIixcbiAgICAgICAgICAgIG5leHQ6IFwiQHBvcFwiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBbL1teXFwtPlxcXV0rfFs+XFxdXFwtXS8sIHsgdG9rZW46IFwiY29tbWVudFwiIH1dXG4gICAgICBdLFxuICAgICAgW3MoXCJ0ZXJzZV9jb21tZW50X3Rva2VuX19pZF9fXCIpXTogW1xuICAgICAgICBbcigvLS0oPzpAY2xvc2VfX2lkX18pLyksIHsgdG9rZW46IFwiY29tbWVudFwiLCBuZXh0OiBcIkBwb3BhbGxcIiB9XSxcbiAgICAgICAgWy9bXjxcXFtcXC1dK3xbPFxcW1xcLV0vLCB7IHRva2VuOiBcImNvbW1lbnRcIiB9XVxuICAgICAgXVxuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZU1vbmFyY2hMYW5ndWFnZUF1dG8oaXMpIHtcbiAgY29uc3QgYW5nbGUgPSBjcmVhdGVNb25hcmNoTGFuZ3VhZ2UoVGFnU3ludGF4QW5nbGUsIGlzKTtcbiAgY29uc3QgYnJhY2tldCA9IGNyZWF0ZU1vbmFyY2hMYW5ndWFnZShUYWdTeW50YXhCcmFja2V0LCBpcyk7XG4gIGNvbnN0IGF1dG8gPSBjcmVhdGVNb25hcmNoTGFuZ3VhZ2UoVGFnU3ludGF4QXV0bywgaXMpO1xuICByZXR1cm4ge1xuICAgIC4uLmFuZ2xlLFxuICAgIC4uLmJyYWNrZXQsXG4gICAgLi4uYXV0byxcbiAgICB1bmljb2RlOiB0cnVlLFxuICAgIGluY2x1ZGVMRjogZmFsc2UsXG4gICAgc3RhcnQ6IGBkZWZhdWx0X2F1dG9fJHtpcy5pZH1gLFxuICAgIGlnbm9yZUNhc2U6IGZhbHNlLFxuICAgIGRlZmF1bHRUb2tlbjogXCJpbnZhbGlkXCIsXG4gICAgdG9rZW5Qb3N0Zml4OiBgLmZyZWVtYXJrZXIyYCxcbiAgICBicmFja2V0czogW1xuICAgICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuY3VybHlcIiB9LFxuICAgICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIgfSxcbiAgICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiwgdG9rZW46IFwiZGVsaW1pdGVyLnBhcmVudGhlc2lzXCIgfSxcbiAgICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiwgdG9rZW46IFwiZGVsaW1pdGVyLmFuZ2xlXCIgfVxuICAgIF0sXG4gICAgdG9rZW5pemVyOiB7XG4gICAgICAuLi5hbmdsZS50b2tlbml6ZXIsXG4gICAgICAuLi5icmFja2V0LnRva2VuaXplcixcbiAgICAgIC4uLmF1dG8udG9rZW5pemVyXG4gICAgfVxuICB9O1xufVxudmFyIFRhZ0FuZ2xlSW50ZXJwb2xhdGlvbkRvbGxhciA9IHtcbiAgY29uZjogY3JlYXRlTGFuZ0NvbmZpZ3VyYXRpb24oVGFnU3ludGF4QW5nbGUpLFxuICBsYW5ndWFnZTogY3JlYXRlTW9uYXJjaExhbmd1YWdlKFRhZ1N5bnRheEFuZ2xlLCBJbnRlcnBvbGF0aW9uU3ludGF4RG9sbGFyKVxufTtcbnZhciBUYWdCcmFja2V0SW50ZXJwb2xhdGlvbkRvbGxhciA9IHtcbiAgY29uZjogY3JlYXRlTGFuZ0NvbmZpZ3VyYXRpb24oVGFnU3ludGF4QnJhY2tldCksXG4gIGxhbmd1YWdlOiBjcmVhdGVNb25hcmNoTGFuZ3VhZ2UoVGFnU3ludGF4QnJhY2tldCwgSW50ZXJwb2xhdGlvblN5bnRheERvbGxhcilcbn07XG52YXIgVGFnQW5nbGVJbnRlcnBvbGF0aW9uQnJhY2tldCA9IHtcbiAgY29uZjogY3JlYXRlTGFuZ0NvbmZpZ3VyYXRpb24oVGFnU3ludGF4QW5nbGUpLFxuICBsYW5ndWFnZTogY3JlYXRlTW9uYXJjaExhbmd1YWdlKFRhZ1N5bnRheEFuZ2xlLCBJbnRlcnBvbGF0aW9uU3ludGF4QnJhY2tldClcbn07XG52YXIgVGFnQnJhY2tldEludGVycG9sYXRpb25CcmFja2V0ID0ge1xuICBjb25mOiBjcmVhdGVMYW5nQ29uZmlndXJhdGlvbihUYWdTeW50YXhCcmFja2V0KSxcbiAgbGFuZ3VhZ2U6IGNyZWF0ZU1vbmFyY2hMYW5ndWFnZShUYWdTeW50YXhCcmFja2V0LCBJbnRlcnBvbGF0aW9uU3ludGF4QnJhY2tldClcbn07XG52YXIgVGFnQXV0b0ludGVycG9sYXRpb25Eb2xsYXIgPSB7XG4gIGNvbmY6IGNyZWF0ZUxhbmdDb25maWd1cmF0aW9uQXV0bygpLFxuICBsYW5ndWFnZTogY3JlYXRlTW9uYXJjaExhbmd1YWdlQXV0byhJbnRlcnBvbGF0aW9uU3ludGF4RG9sbGFyKVxufTtcbnZhciBUYWdBdXRvSW50ZXJwb2xhdGlvbkJyYWNrZXQgPSB7XG4gIGNvbmY6IGNyZWF0ZUxhbmdDb25maWd1cmF0aW9uQXV0bygpLFxuICBsYW5ndWFnZTogY3JlYXRlTW9uYXJjaExhbmd1YWdlQXV0byhJbnRlcnBvbGF0aW9uU3ludGF4QnJhY2tldClcbn07XG5leHBvcnQge1xuICBUYWdBbmdsZUludGVycG9sYXRpb25CcmFja2V0LFxuICBUYWdBbmdsZUludGVycG9sYXRpb25Eb2xsYXIsXG4gIFRhZ0F1dG9JbnRlcnBvbGF0aW9uQnJhY2tldCxcbiAgVGFnQXV0b0ludGVycG9sYXRpb25Eb2xsYXIsXG4gIFRhZ0JyYWNrZXRJbnRlcnBvbGF0aW9uQnJhY2tldCxcbiAgVGFnQnJhY2tldEludGVycG9sYXRpb25Eb2xsYXJcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9BLElBQUksWUFBWSxPQUFPO0FBQ3ZCLElBQUksbUJBQW1CLE9BQU87QUFDOUIsSUFBSSxvQkFBb0IsT0FBTztBQUMvQixJQUFJLGVBQWUsT0FBTyxVQUFVO0FBQ3BDLElBQUksY0FBYyxDQUFDLElBQUksTUFBTSxRQUFRLFNBQVM7QUFDNUMsTUFBSSxRQUFRLE9BQU8sU0FBUyxZQUFZLE9BQU8sU0FBUyxZQUFZO0FBQ2xFLGFBQVMsT0FBTyxrQkFBa0IsSUFBSTtBQUNwQyxVQUFJLENBQUMsYUFBYSxLQUFLLElBQUksR0FBRyxLQUFLLFFBQVE7QUFDekMsa0JBQVUsSUFBSSxLQUFLLEVBQUUsS0FBSyxNQUFNLEtBQUssR0FBRyxHQUFHLFlBQVksRUFBRSxPQUFPLGlCQUFpQixNQUFNLEdBQUcsTUFBTSxLQUFLLFdBQVUsQ0FBRTtBQUFBLEVBQ3RIO0FBQ0QsU0FBTztBQUNUO0FBQ0EsSUFBSSxhQUFhLENBQUMsUUFBUSxLQUFLLGtCQUFrQixZQUFZLFFBQVEsS0FBSyxTQUFTLEdBQUc7QUFHdEYsSUFBSSw2QkFBNkIsQ0FBQTtBQUNqQyxXQUFXLDRCQUE0Qix1QkFBdUI7QUFJOUQsSUFBSSxpQkFBaUI7QUFBQSxFQUNuQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFB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QUNBLFNBQVMsMEJBQTBCLElBQUk7QUFDckMsUUFBTSxRQUFRLHNCQUFzQixnQkFBZ0IsRUFBRTtBQUN0RCxRQUFNLFVBQVUsc0JBQXNCLGtCQUFrQixFQUFFO0FBQzFELFFBQU0sT0FBTyxzQkFBc0IsZUFBZSxFQUFFO0FBQ3BELFNBQU87QUFBQSxJQUNMLEdBQUc7QUFBQSxJQUNILEdBQUc7QUFBQSxJQUNILEdBQUc7QUFBQSxJQUNILFNBQVM7QUFBQSxJQUNULFdBQVc7QUFBQSxJQUNYLE9BQU8sZ0JBQWdCLEdBQUcsRUFBRTtBQUFBLElBQzVCLFlBQVk7QUFBQSxJQUNaLGNBQWM7QUFBQSxJQUNkLGNBQWM7QUFBQSxJQUNkLFVBQVU7QUFBQSxNQUNSLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLGtCQUFtQjtBQUFBLE1BQ25ELEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLG1CQUFvQjtBQUFBLE1BQ3BELEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLHdCQUF5QjtBQUFBLE1BQ3pELEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLGtCQUFtQjtBQUFBLElBQ3BEO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxHQUFHLE1BQU07QUFBQSxNQUNULEdBQUcsUUFBUTtBQUFBLE1BQ1gsR0FBRyxLQUFLO0FBQUEsSUFDVDtBQUFBLEVBQ0w7QUFDQTtBQUNHLElBQUMsOEJBQThCO0FBQUEsRUFDaEMsTUFBTSx3QkFBd0IsY0FBYztBQUFBLEVBQzVDLFVBQVUsc0JBQXNCLGdCQUFnQix5QkFBeUI7QUFDM0U7QUFDRyxJQUFDLGdDQUFnQztBQUFBLEVBQ2xDLE1BQU0sd0JBQXdCLGdCQUFnQjtBQUFBLEVBQzlDLFVBQVUsc0JBQXNCLGtCQUFrQix5QkFBeUI7QUFDN0U7QUFDRyxJQUFDLCtCQUErQjtBQUFBLEVBQ2pDLE1BQU0sd0JBQXdCLGNBQWM7QUFBQSxFQUM1QyxVQUFVLHNCQUFzQixnQkFBZ0IsMEJBQTBCO0FBQzVFO0FBQ0csSUFBQyxpQ0FBaUM7QUFBQSxFQUNuQyxNQUFNLHdCQUF3QixnQkFBZ0I7QUFBQSxFQUM5QyxVQUFVLHNCQUFzQixrQkFBa0IsMEJBQTBCO0FBQzlFO0FBQ0csSUFBQyw2QkFBNkI7QUFBQSxFQUMvQixNQUFNLDRCQUE2QjtBQUFBLEVBQ25DLFVBQVUsMEJBQTBCLHlCQUF5QjtBQUMvRDtBQUNHLElBQUMsOEJBQThCO0FBQUEsRUFDaEMsTUFBTSw0QkFBNkI7QUFBQSxFQUNuQyxVQUFVLDBCQUEwQiwwQkFBMEI7QUFDaEU7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
