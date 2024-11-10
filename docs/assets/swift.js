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
    { open: "'", close: "'" },
    { open: "`", close: "`" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "`", close: "`" }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".swift",
  identifier: /[a-zA-Z_][\w$]*/,
  attributes: [
    "@GKInspectable",
    "@IBAction",
    "@IBDesignable",
    "@IBInspectable",
    "@IBOutlet",
    "@IBSegueAction",
    "@NSApplicationMain",
    "@NSCopying",
    "@NSManaged",
    "@Sendable",
    "@UIApplicationMain",
    "@autoclosure",
    "@actorIndependent",
    "@asyncHandler",
    "@available",
    "@convention",
    "@derivative",
    "@differentiable",
    "@discardableResult",
    "@dynamicCallable",
    "@dynamicMemberLookup",
    "@escaping",
    "@frozen",
    "@globalActor",
    "@inlinable",
    "@inline",
    "@main",
    "@noDerivative",
    "@nonobjc",
    "@noreturn",
    "@objc",
    "@objcMembers",
    "@preconcurrency",
    "@propertyWrapper",
    "@requires_stored_property_inits",
    "@resultBuilder",
    "@testable",
    "@unchecked",
    "@unknown",
    "@usableFromInline",
    "@warn_unqualified_access"
  ],
  accessmodifiers: ["open", "public", "internal", "fileprivate", "private"],
  keywords: [
    "#available",
    "#colorLiteral",
    "#column",
    "#dsohandle",
    "#else",
    "#elseif",
    "#endif",
    "#error",
    "#file",
    "#fileID",
    "#fileLiteral",
    "#filePath",
    "#function",
    "#if",
    "#imageLiteral",
    "#keyPath",
    "#line",
    "#selector",
    "#sourceLocation",
    "#warning",
    "Any",
    "Protocol",
    "Self",
    "Type",
    "actor",
    "as",
    "assignment",
    "associatedtype",
    "associativity",
    "async",
    "await",
    "break",
    "case",
    "catch",
    "class",
    "continue",
    "convenience",
    "default",
    "defer",
    "deinit",
    "didSet",
    "do",
    "dynamic",
    "dynamicType",
    "else",
    "enum",
    "extension",
    "fallthrough",
    "false",
    "fileprivate",
    "final",
    "for",
    "func",
    "get",
    "guard",
    "higherThan",
    "if",
    "import",
    "in",
    "indirect",
    "infix",
    "init",
    "inout",
    "internal",
    "is",
    "isolated",
    "lazy",
    "left",
    "let",
    "lowerThan",
    "mutating",
    "nil",
    "none",
    "nonisolated",
    "nonmutating",
    "open",
    "operator",
    "optional",
    "override",
    "postfix",
    "precedence",
    "precedencegroup",
    "prefix",
    "private",
    "protocol",
    "public",
    "repeat",
    "required",
    "rethrows",
    "return",
    "right",
    "safe",
    "self",
    "set",
    "some",
    "static",
    "struct",
    "subscript",
    "super",
    "switch",
    "throw",
    "throws",
    "true",
    "try",
    "typealias",
    "unowned",
    "unsafe",
    "var",
    "weak",
    "where",
    "while",
    "willSet",
    "__consuming",
    "__owned"
  ],
  symbols: /[=(){}\[\].,:;@#\_&\-<>`?!+*\\\/]/,
  operatorstart: /[\/=\-+!*%<>&|^~?\u00A1-\u00A7\u00A9\u00AB\u00AC\u00AE\u00B0-\u00B1\u00B6\u00BB\u00BF\u00D7\u00F7\u2016-\u2017\u2020-\u2027\u2030-\u203E\u2041-\u2053\u2055-\u205E\u2190-\u23FF\u2500-\u2775\u2794-\u2BFF\u2E00-\u2E7F\u3001-\u3003\u3008-\u3030]/,
  operatorend: /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE00-\uFE0F\uFE20-\uFE2F\uE0100-\uE01EF]/,
  operators: /(@operatorstart)((@operatorstart)|(@operatorend))*/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@comment" },
      { include: "@attribute" },
      { include: "@literal" },
      { include: "@keyword" },
      { include: "@invokedmethod" },
      { include: "@symbol" }
    ],
    whitespace: [
      [/\s+/, "white"],
      [/"""/, "string.quote", "@endDblDocString"]
    ],
    endDblDocString: [
      [/[^"]+/, "string"],
      [/\\"/, "string"],
      [/"""/, "string.quote", "@popall"],
      [/"/, "string"]
    ],
    symbol: [
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/[.]/, "delimiter"],
      [/@operators/, "operator"],
      [/@symbols/, "operator"]
    ],
    comment: [
      [/\/\/\/.*$/, "comment.doc"],
      [/\/\*\*/, "comment.doc", "@commentdocbody"],
      [/\/\/.*$/, "comment"],
      [/\/\*/, "comment", "@commentbody"]
    ],
    commentdocbody: [
      [/\/\*/, "comment", "@commentbody"],
      [/\*\//, "comment.doc", "@pop"],
      [/\:[a-zA-Z]+\:/, "comment.doc.param"],
      [/./, "comment.doc"]
    ],
    commentbody: [
      [/\/\*/, "comment", "@commentbody"],
      [/\*\//, "comment", "@pop"],
      [/./, "comment"]
    ],
    attribute: [
      [
        /@@@identifier/,
        {
          cases: {
            "@attributes": "keyword.control",
            "@default": ""
          }
        }
      ]
    ],
    literal: [
      [/"/, { token: "string.quote", next: "@stringlit" }],
      [/0[b]([01]_?)+/, "number.binary"],
      [/0[o]([0-7]_?)+/, "number.octal"],
      [/0[x]([0-9a-fA-F]_?)+([pP][\-+](\d_?)+)?/, "number.hex"],
      [/(\d_?)*\.(\d_?)+([eE][\-+]?(\d_?)+)?/, "number.float"],
      [/(\d_?)+/, "number"]
    ],
    stringlit: [
      [/\\\(/, { token: "operator", next: "@interpolatedexpression" }],
      [/@escapes/, "string"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", next: "@pop" }],
      [/./, "string"]
    ],
    interpolatedexpression: [
      [/\(/, { token: "operator", next: "@interpolatedexpression" }],
      [/\)/, { token: "operator", next: "@pop" }],
      { include: "@literal" },
      { include: "@keyword" },
      { include: "@symbol" }
    ],
    keyword: [
      [/`/, { token: "operator", next: "@escapedkeyword" }],
      [
        /@identifier/,
        {
          cases: {
            "@keywords": "keyword",
            "[A-Z][a-zA-Z0-9$]*": "type.identifier",
            "@default": "identifier"
          }
        }
      ]
    ],
    escapedkeyword: [
      [/`/, { token: "operator", next: "@pop" }],
      [/./, "identifier"]
    ],
    invokedmethod: [
      [
        /([.])(@identifier)/,
        {
          cases: {
            $2: ["delimeter", "type.identifier"],
            "@default": ""
          }
        }
      ]
    ]
  }
};
/*!---------------------------------------------------------------------------------------------
 *  Copyright (C) David Owens II, owensd.io. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpZnQuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvc3dpZnQvc3dpZnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3N3aWZ0L3N3aWZ0LnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBsaW5lQ29tbWVudDogXCIvL1wiLFxuICAgIGJsb2NrQ29tbWVudDogW1wiLypcIiwgXCIqL1wiXVxuICB9LFxuICBicmFja2V0czogW1xuICAgIFtcIntcIiwgXCJ9XCJdLFxuICAgIFtcIltcIiwgXCJdXCJdLFxuICAgIFtcIihcIiwgXCIpXCJdXG4gIF0sXG4gIGF1dG9DbG9zaW5nUGFpcnM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIgfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiIH0sXG4gICAgeyBvcGVuOiBcImBcIiwgY2xvc2U6IFwiYFwiIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46IFwiYFwiLCBjbG9zZTogXCJgXCIgfVxuICBdXG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCIuc3dpZnRcIixcbiAgaWRlbnRpZmllcjogL1thLXpBLVpfXVtcXHckXSovLFxuICBhdHRyaWJ1dGVzOiBbXG4gICAgXCJAR0tJbnNwZWN0YWJsZVwiLFxuICAgIFwiQElCQWN0aW9uXCIsXG4gICAgXCJASUJEZXNpZ25hYmxlXCIsXG4gICAgXCJASUJJbnNwZWN0YWJsZVwiLFxuICAgIFwiQElCT3V0bGV0XCIsXG4gICAgXCJASUJTZWd1ZUFjdGlvblwiLFxuICAgIFwiQE5TQXBwbGljYXRpb25NYWluXCIsXG4gICAgXCJATlNDb3B5aW5nXCIsXG4gICAgXCJATlNNYW5hZ2VkXCIsXG4gICAgXCJAU2VuZGFibGVcIixcbiAgICBcIkBVSUFwcGxpY2F0aW9uTWFpblwiLFxuICAgIFwiQGF1dG9jbG9zdXJlXCIsXG4gICAgXCJAYWN0b3JJbmRlcGVuZGVudFwiLFxuICAgIFwiQGFzeW5jSGFuZGxlclwiLFxuICAgIFwiQGF2YWlsYWJsZVwiLFxuICAgIFwiQGNvbnZlbnRpb25cIixcbiAgICBcIkBkZXJpdmF0aXZlXCIsXG4gICAgXCJAZGlmZmVyZW50aWFibGVcIixcbiAgICBcIkBkaXNjYXJkYWJsZVJlc3VsdFwiLFxuICAgIFwiQGR5bmFtaWNDYWxsYWJsZVwiLFxuICAgIFwiQGR5bmFtaWNNZW1iZXJMb29rdXBcIixcbiAgICBcIkBlc2NhcGluZ1wiLFxuICAgIFwiQGZyb3plblwiLFxuICAgIFwiQGdsb2JhbEFjdG9yXCIsXG4gICAgXCJAaW5saW5hYmxlXCIsXG4gICAgXCJAaW5saW5lXCIsXG4gICAgXCJAbWFpblwiLFxuICAgIFwiQG5vRGVyaXZhdGl2ZVwiLFxuICAgIFwiQG5vbm9iamNcIixcbiAgICBcIkBub3JldHVyblwiLFxuICAgIFwiQG9iamNcIixcbiAgICBcIkBvYmpjTWVtYmVyc1wiLFxuICAgIFwiQHByZWNvbmN1cnJlbmN5XCIsXG4gICAgXCJAcHJvcGVydHlXcmFwcGVyXCIsXG4gICAgXCJAcmVxdWlyZXNfc3RvcmVkX3Byb3BlcnR5X2luaXRzXCIsXG4gICAgXCJAcmVzdWx0QnVpbGRlclwiLFxuICAgIFwiQHRlc3RhYmxlXCIsXG4gICAgXCJAdW5jaGVja2VkXCIsXG4gICAgXCJAdW5rbm93blwiLFxuICAgIFwiQHVzYWJsZUZyb21JbmxpbmVcIixcbiAgICBcIkB3YXJuX3VucXVhbGlmaWVkX2FjY2Vzc1wiXG4gIF0sXG4gIGFjY2Vzc21vZGlmaWVyczogW1wib3BlblwiLCBcInB1YmxpY1wiLCBcImludGVybmFsXCIsIFwiZmlsZXByaXZhdGVcIiwgXCJwcml2YXRlXCJdLFxuICBrZXl3b3JkczogW1xuICAgIFwiI2F2YWlsYWJsZVwiLFxuICAgIFwiI2NvbG9yTGl0ZXJhbFwiLFxuICAgIFwiI2NvbHVtblwiLFxuICAgIFwiI2Rzb2hhbmRsZVwiLFxuICAgIFwiI2Vsc2VcIixcbiAgICBcIiNlbHNlaWZcIixcbiAgICBcIiNlbmRpZlwiLFxuICAgIFwiI2Vycm9yXCIsXG4gICAgXCIjZmlsZVwiLFxuICAgIFwiI2ZpbGVJRFwiLFxuICAgIFwiI2ZpbGVMaXRlcmFsXCIsXG4gICAgXCIjZmlsZVBhdGhcIixcbiAgICBcIiNmdW5jdGlvblwiLFxuICAgIFwiI2lmXCIsXG4gICAgXCIjaW1hZ2VMaXRlcmFsXCIsXG4gICAgXCIja2V5UGF0aFwiLFxuICAgIFwiI2xpbmVcIixcbiAgICBcIiNzZWxlY3RvclwiLFxuICAgIFwiI3NvdXJjZUxvY2F0aW9uXCIsXG4gICAgXCIjd2FybmluZ1wiLFxuICAgIFwiQW55XCIsXG4gICAgXCJQcm90b2NvbFwiLFxuICAgIFwiU2VsZlwiLFxuICAgIFwiVHlwZVwiLFxuICAgIFwiYWN0b3JcIixcbiAgICBcImFzXCIsXG4gICAgXCJhc3NpZ25tZW50XCIsXG4gICAgXCJhc3NvY2lhdGVkdHlwZVwiLFxuICAgIFwiYXNzb2NpYXRpdml0eVwiLFxuICAgIFwiYXN5bmNcIixcbiAgICBcImF3YWl0XCIsXG4gICAgXCJicmVha1wiLFxuICAgIFwiY2FzZVwiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImNsYXNzXCIsXG4gICAgXCJjb250aW51ZVwiLFxuICAgIFwiY29udmVuaWVuY2VcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcImRlZmVyXCIsXG4gICAgXCJkZWluaXRcIixcbiAgICBcImRpZFNldFwiLFxuICAgIFwiZG9cIixcbiAgICBcImR5bmFtaWNcIixcbiAgICBcImR5bmFtaWNUeXBlXCIsXG4gICAgXCJlbHNlXCIsXG4gICAgXCJlbnVtXCIsXG4gICAgXCJleHRlbnNpb25cIixcbiAgICBcImZhbGx0aHJvdWdoXCIsXG4gICAgXCJmYWxzZVwiLFxuICAgIFwiZmlsZXByaXZhdGVcIixcbiAgICBcImZpbmFsXCIsXG4gICAgXCJmb3JcIixcbiAgICBcImZ1bmNcIixcbiAgICBcImdldFwiLFxuICAgIFwiZ3VhcmRcIixcbiAgICBcImhpZ2hlclRoYW5cIixcbiAgICBcImlmXCIsXG4gICAgXCJpbXBvcnRcIixcbiAgICBcImluXCIsXG4gICAgXCJpbmRpcmVjdFwiLFxuICAgIFwiaW5maXhcIixcbiAgICBcImluaXRcIixcbiAgICBcImlub3V0XCIsXG4gICAgXCJpbnRlcm5hbFwiLFxuICAgIFwiaXNcIixcbiAgICBcImlzb2xhdGVkXCIsXG4gICAgXCJsYXp5XCIsXG4gICAgXCJsZWZ0XCIsXG4gICAgXCJsZXRcIixcbiAgICBcImxvd2VyVGhhblwiLFxuICAgIFwibXV0YXRpbmdcIixcbiAgICBcIm5pbFwiLFxuICAgIFwibm9uZVwiLFxuICAgIFwibm9uaXNvbGF0ZWRcIixcbiAgICBcIm5vbm11dGF0aW5nXCIsXG4gICAgXCJvcGVuXCIsXG4gICAgXCJvcGVyYXRvclwiLFxuICAgIFwib3B0aW9uYWxcIixcbiAgICBcIm92ZXJyaWRlXCIsXG4gICAgXCJwb3N0Zml4XCIsXG4gICAgXCJwcmVjZWRlbmNlXCIsXG4gICAgXCJwcmVjZWRlbmNlZ3JvdXBcIixcbiAgICBcInByZWZpeFwiLFxuICAgIFwicHJpdmF0ZVwiLFxuICAgIFwicHJvdG9jb2xcIixcbiAgICBcInB1YmxpY1wiLFxuICAgIFwicmVwZWF0XCIsXG4gICAgXCJyZXF1aXJlZFwiLFxuICAgIFwicmV0aHJvd3NcIixcbiAgICBcInJldHVyblwiLFxuICAgIFwicmlnaHRcIixcbiAgICBcInNhZmVcIixcbiAgICBcInNlbGZcIixcbiAgICBcInNldFwiLFxuICAgIFwic29tZVwiLFxuICAgIFwic3RhdGljXCIsXG4gICAgXCJzdHJ1Y3RcIixcbiAgICBcInN1YnNjcmlwdFwiLFxuICAgIFwic3VwZXJcIixcbiAgICBcInN3aXRjaFwiLFxuICAgIFwidGhyb3dcIixcbiAgICBcInRocm93c1wiLFxuICAgIFwidHJ1ZVwiLFxuICAgIFwidHJ5XCIsXG4gICAgXCJ0eXBlYWxpYXNcIixcbiAgICBcInVub3duZWRcIixcbiAgICBcInVuc2FmZVwiLFxuICAgIFwidmFyXCIsXG4gICAgXCJ3ZWFrXCIsXG4gICAgXCJ3aGVyZVwiLFxuICAgIFwid2hpbGVcIixcbiAgICBcIndpbGxTZXRcIixcbiAgICBcIl9fY29uc3VtaW5nXCIsXG4gICAgXCJfX293bmVkXCJcbiAgXSxcbiAgc3ltYm9sczogL1s9KCl7fVxcW1xcXS4sOjtAI1xcXyZcXC08PmA/ISsqXFxcXFxcL10vLFxuICBvcGVyYXRvcnN0YXJ0OiAvW1xcLz1cXC0rISolPD4mfF5+P1xcdTAwQTEtXFx1MDBBN1xcdTAwQTlcXHUwMEFCXFx1MDBBQ1xcdTAwQUVcXHUwMEIwLVxcdTAwQjFcXHUwMEI2XFx1MDBCQlxcdTAwQkZcXHUwMEQ3XFx1MDBGN1xcdTIwMTYtXFx1MjAxN1xcdTIwMjAtXFx1MjAyN1xcdTIwMzAtXFx1MjAzRVxcdTIwNDEtXFx1MjA1M1xcdTIwNTUtXFx1MjA1RVxcdTIxOTAtXFx1MjNGRlxcdTI1MDAtXFx1Mjc3NVxcdTI3OTQtXFx1MkJGRlxcdTJFMDAtXFx1MkU3RlxcdTMwMDEtXFx1MzAwM1xcdTMwMDgtXFx1MzAzMF0vLFxuICBvcGVyYXRvcmVuZDogL1tcXHUwMzAwLVxcdTAzNkZcXHUxREMwLVxcdTFERkZcXHUyMEQwLVxcdTIwRkZcXHVGRTAwLVxcdUZFMEZcXHVGRTIwLVxcdUZFMkZcXHVFMDEwMC1cXHVFMDFFRl0vLFxuICBvcGVyYXRvcnM6IC8oQG9wZXJhdG9yc3RhcnQpKChAb3BlcmF0b3JzdGFydCl8KEBvcGVyYXRvcmVuZCkpKi8sXG4gIGVzY2FwZXM6IC9cXFxcKD86W2FiZm5ydHZcXFxcXCInXXx4WzAtOUEtRmEtZl17MSw0fXx1WzAtOUEtRmEtZl17NH18VVswLTlBLUZhLWZdezh9KS8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbW1lbnRcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBhdHRyaWJ1dGVcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBsaXRlcmFsXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAa2V5d29yZFwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGludm9rZWRtZXRob2RcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBzeW1ib2xcIiB9XG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1xccysvLCBcIndoaXRlXCJdLFxuICAgICAgWy9cIlwiXCIvLCBcInN0cmluZy5xdW90ZVwiLCBcIkBlbmREYmxEb2NTdHJpbmdcIl1cbiAgICBdLFxuICAgIGVuZERibERvY1N0cmluZzogW1xuICAgICAgWy9bXlwiXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvXFxcXFwiLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL1wiXCJcIi8sIFwic3RyaW5nLnF1b3RlXCIsIFwiQHBvcGFsbFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZ1wiXVxuICAgIF0sXG4gICAgc3ltYm9sOiBbXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9bPD5dKD8hQHN5bWJvbHMpLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbL1suXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9Ab3BlcmF0b3JzLywgXCJvcGVyYXRvclwiXSxcbiAgICAgIFsvQHN5bWJvbHMvLCBcIm9wZXJhdG9yXCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1xcL1xcL1xcLy4qJC8sIFwiY29tbWVudC5kb2NcIl0sXG4gICAgICBbL1xcL1xcKlxcKi8sIFwiY29tbWVudC5kb2NcIiwgXCJAY29tbWVudGRvY2JvZHlcIl0sXG4gICAgICBbL1xcL1xcLy4qJC8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50XCIsIFwiQGNvbW1lbnRib2R5XCJdXG4gICAgXSxcbiAgICBjb21tZW50ZG9jYm9keTogW1xuICAgICAgWy9cXC9cXCovLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudGJvZHlcIl0sXG4gICAgICBbL1xcKlxcLy8sIFwiY29tbWVudC5kb2NcIiwgXCJAcG9wXCJdLFxuICAgICAgWy9cXDpbYS16QS1aXStcXDovLCBcImNvbW1lbnQuZG9jLnBhcmFtXCJdLFxuICAgICAgWy8uLywgXCJjb21tZW50LmRvY1wiXVxuICAgIF0sXG4gICAgY29tbWVudGJvZHk6IFtcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50XCIsIFwiQGNvbW1lbnRib2R5XCJdLFxuICAgICAgWy9cXCpcXC8vLCBcImNvbW1lbnRcIiwgXCJAcG9wXCJdLFxuICAgICAgWy8uLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBhdHRyaWJ1dGU6IFtcbiAgICAgIFtcbiAgICAgICAgL0BAQGlkZW50aWZpZXIvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGF0dHJpYnV0ZXNcIjogXCJrZXl3b3JkLmNvbnRyb2xcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIF0sXG4gICAgbGl0ZXJhbDogW1xuICAgICAgWy9cIi8sIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIG5leHQ6IFwiQHN0cmluZ2xpdFwiIH1dLFxuICAgICAgWy8wW2JdKFswMV1fPykrLywgXCJudW1iZXIuYmluYXJ5XCJdLFxuICAgICAgWy8wW29dKFswLTddXz8pKy8sIFwibnVtYmVyLm9jdGFsXCJdLFxuICAgICAgWy8wW3hdKFswLTlhLWZBLUZdXz8pKyhbcFBdW1xcLStdKFxcZF8/KSspPy8sIFwibnVtYmVyLmhleFwiXSxcbiAgICAgIFsvKFxcZF8/KSpcXC4oXFxkXz8pKyhbZUVdW1xcLStdPyhcXGRfPykrKT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvKFxcZF8/KSsvLCBcIm51bWJlclwiXVxuICAgIF0sXG4gICAgc3RyaW5nbGl0OiBbXG4gICAgICBbL1xcXFxcXCgvLCB7IHRva2VuOiBcIm9wZXJhdG9yXCIsIG5leHQ6IFwiQGludGVycG9sYXRlZGV4cHJlc3Npb25cIiB9XSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvLi8sIFwic3RyaW5nXCJdXG4gICAgXSxcbiAgICBpbnRlcnBvbGF0ZWRleHByZXNzaW9uOiBbXG4gICAgICBbL1xcKC8sIHsgdG9rZW46IFwib3BlcmF0b3JcIiwgbmV4dDogXCJAaW50ZXJwb2xhdGVkZXhwcmVzc2lvblwiIH1dLFxuICAgICAgWy9cXCkvLCB7IHRva2VuOiBcIm9wZXJhdG9yXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgeyBpbmNsdWRlOiBcIkBsaXRlcmFsXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAa2V5d29yZFwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQHN5bWJvbFwiIH1cbiAgICBdLFxuICAgIGtleXdvcmQ6IFtcbiAgICAgIFsvYC8sIHsgdG9rZW46IFwib3BlcmF0b3JcIiwgbmV4dDogXCJAZXNjYXBlZGtleXdvcmRcIiB9XSxcbiAgICAgIFtcbiAgICAgICAgL0BpZGVudGlmaWVyLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBrZXl3b3Jkc1wiOiBcImtleXdvcmRcIixcbiAgICAgICAgICAgIFwiW0EtWl1bYS16QS1aMC05JF0qXCI6IFwidHlwZS5pZGVudGlmaWVyXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBlc2NhcGVka2V5d29yZDogW1xuICAgICAgWy9gLywgeyB0b2tlbjogXCJvcGVyYXRvclwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvLi8sIFwiaWRlbnRpZmllclwiXVxuICAgIF0sXG4gICAgaW52b2tlZG1ldGhvZDogW1xuICAgICAgW1xuICAgICAgICAvKFsuXSkoQGlkZW50aWZpZXIpLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICAkMjogW1wiZGVsaW1ldGVyXCIsIFwidHlwZS5pZGVudGlmaWVyXCJdLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4vKiEtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICBDb3B5cmlnaHQgKEMpIERhdmlkIE93ZW5zIElJLCBvd2Vuc2QuaW8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGNBQWMsQ0FBQyxNQUFNLElBQUk7QUFBQSxFQUMxQjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLEVBQzFCO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUNIO0FBQ0csSUFBQyxXQUFXO0FBQUEsRUFDYixjQUFjO0FBQUEsRUFDZCxjQUFjO0FBQUEsRUFDZCxZQUFZO0FBQUEsRUFDWixZQUFZO0FBQUEsSUFDVjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxpQkFBaUIsQ0FBQyxRQUFRLFVBQVUsWUFBWSxlQUFlLFNBQVM7QUFBQSxFQUN4RSxVQUFVO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsU0FBUztBQUFBLEVBQ1QsZUFBZTtBQUFBLEVBQ2YsYUFBYTtBQUFBLEVBQ2IsV0FBVztBQUFBLEVBQ1gsU0FBUztBQUFBLEVBQ1QsV0FBVztBQUFBLElBQ1QsTUFBTTtBQUFBLE1BQ0osRUFBRSxTQUFTLGNBQWU7QUFBQSxNQUMxQixFQUFFLFNBQVMsV0FBWTtBQUFBLE1BQ3ZCLEVBQUUsU0FBUyxhQUFjO0FBQUEsTUFDekIsRUFBRSxTQUFTLFdBQVk7QUFBQSxNQUN2QixFQUFFLFNBQVMsV0FBWTtBQUFBLE1BQ3ZCLEVBQUUsU0FBUyxpQkFBa0I7QUFBQSxNQUM3QixFQUFFLFNBQVMsVUFBVztBQUFBLElBQ3ZCO0FBQUEsSUFDRCxZQUFZO0FBQUEsTUFDVixDQUFDLE9BQU8sT0FBTztBQUFBLE1BQ2YsQ0FBQyxPQUFPLGdCQUFnQixrQkFBa0I7QUFBQSxJQUMzQztBQUFBLElBQ0QsaUJBQWlCO0FBQUEsTUFDZixDQUFDLFNBQVMsUUFBUTtBQUFBLE1BQ2xCLENBQUMsT0FBTyxRQUFRO0FBQUEsTUFDaEIsQ0FBQyxPQUFPLGdCQUFnQixTQUFTO0FBQUEsTUFDakMsQ0FBQyxLQUFLLFFBQVE7QUFBQSxJQUNmO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTixDQUFDLGNBQWMsV0FBVztBQUFBLE1BQzFCLENBQUMsb0JBQW9CLFdBQVc7QUFBQSxNQUNoQyxDQUFDLE9BQU8sV0FBVztBQUFBLE1BQ25CLENBQUMsY0FBYyxVQUFVO0FBQUEsTUFDekIsQ0FBQyxZQUFZLFVBQVU7QUFBQSxJQUN4QjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxhQUFhLGFBQWE7QUFBQSxNQUMzQixDQUFDLFVBQVUsZUFBZSxpQkFBaUI7QUFBQSxNQUMzQyxDQUFDLFdBQVcsU0FBUztBQUFBLE1BQ3JCLENBQUMsUUFBUSxXQUFXLGNBQWM7QUFBQSxJQUNuQztBQUFBLElBQ0QsZ0JBQWdCO0FBQUEsTUFDZCxDQUFDLFFBQVEsV0FBVyxjQUFjO0FBQUEsTUFDbEMsQ0FBQyxRQUFRLGVBQWUsTUFBTTtBQUFBLE1BQzlCLENBQUMsaUJBQWlCLG1CQUFtQjtBQUFBLE1BQ3JDLENBQUMsS0FBSyxhQUFhO0FBQUEsSUFDcEI7QUFBQSxJQUNELGFBQWE7QUFBQSxNQUNYLENBQUMsUUFBUSxXQUFXLGNBQWM7QUFBQSxNQUNsQyxDQUFDLFFBQVEsV0FBVyxNQUFNO0FBQUEsTUFDMUIsQ0FBQyxLQUFLLFNBQVM7QUFBQSxJQUNoQjtBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1Q7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFlBQ0wsZUFBZTtBQUFBLFlBQ2YsWUFBWTtBQUFBLFVBQ2I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNELFNBQVM7QUFBQSxNQUNQLENBQUMsS0FBSyxFQUFFLE9BQU8sZ0JBQWdCLE1BQU0sYUFBWSxDQUFFO0FBQUEsTUFDbkQsQ0FBQyxpQkFBaUIsZUFBZTtBQUFBLE1BQ2pDLENBQUMsa0JBQWtCLGNBQWM7QUFBQSxNQUNqQyxDQUFDLDJDQUEyQyxZQUFZO0FBQUEsTUFDeEQsQ0FBQyx3Q0FBd0MsY0FBYztBQUFBLE1BQ3ZELENBQUMsV0FBVyxRQUFRO0FBQUEsSUFDckI7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULENBQUMsUUFBUSxFQUFFLE9BQU8sWUFBWSxNQUFNLDBCQUF5QixDQUFFO0FBQUEsTUFDL0QsQ0FBQyxZQUFZLFFBQVE7QUFBQSxNQUNyQixDQUFDLE9BQU8sdUJBQXVCO0FBQUEsTUFDL0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxnQkFBZ0IsTUFBTSxPQUFNLENBQUU7QUFBQSxNQUM3QyxDQUFDLEtBQUssUUFBUTtBQUFBLElBQ2Y7QUFBQSxJQUNELHdCQUF3QjtBQUFBLE1BQ3RCLENBQUMsTUFBTSxFQUFFLE9BQU8sWUFBWSxNQUFNLDBCQUF5QixDQUFFO0FBQUEsTUFDN0QsQ0FBQyxNQUFNLEVBQUUsT0FBTyxZQUFZLE1BQU0sT0FBTSxDQUFFO0FBQUEsTUFDMUMsRUFBRSxTQUFTLFdBQVk7QUFBQSxNQUN2QixFQUFFLFNBQVMsV0FBWTtBQUFBLE1BQ3ZCLEVBQUUsU0FBUyxVQUFXO0FBQUEsSUFDdkI7QUFBQSxJQUNELFNBQVM7QUFBQSxNQUNQLENBQUMsS0FBSyxFQUFFLE9BQU8sWUFBWSxNQUFNLGtCQUFpQixDQUFFO0FBQUEsTUFDcEQ7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFlBQ0wsYUFBYTtBQUFBLFlBQ2Isc0JBQXNCO0FBQUEsWUFDdEIsWUFBWTtBQUFBLFVBQ2I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNELGdCQUFnQjtBQUFBLE1BQ2QsQ0FBQyxLQUFLLEVBQUUsT0FBTyxZQUFZLE1BQU0sT0FBTSxDQUFFO0FBQUEsTUFDekMsQ0FBQyxLQUFLLFlBQVk7QUFBQSxJQUNuQjtBQUFBLElBQ0QsZUFBZTtBQUFBLE1BQ2I7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFlBQ0wsSUFBSSxDQUFDLGFBQWEsaUJBQWlCO0FBQUEsWUFDbkMsWUFBWTtBQUFBLFVBQ2I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0g7QUFLQTtBQUFBO0FBQUE7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
