/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var namedLiterals = ["true", "false"];
var conf = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["<", ">"]
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "<", close: ">" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "<", close: ">" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string"] }
  ],
  autoCloseBefore: ".,=}])>' \n	",
  indentationRules: {
    increaseIndentPattern: new RegExp("^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$"),
    decreaseIndentPattern: new RegExp("^((?!.*?\\/\\*).*\\*/)?\\s*[\\}\\]].*$")
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".proto",
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" },
    { open: "<", close: ">", token: "delimiter.angle" }
  ],
  symbols: /[=><!~?:&|+\-*/^%]+/,
  keywords: [
    "syntax",
    "import",
    "weak",
    "public",
    "package",
    "option",
    "repeated",
    "oneof",
    "map",
    "reserved",
    "to",
    "max",
    "enum",
    "message",
    "service",
    "rpc",
    "stream",
    "returns",
    "package",
    "optional",
    "true",
    "false"
  ],
  builtinTypes: [
    "double",
    "float",
    "int32",
    "int64",
    "uint32",
    "uint64",
    "sint32",
    "sint64",
    "fixed32",
    "fixed64",
    "sfixed32",
    "sfixed64",
    "bool",
    "string",
    "bytes"
  ],
  operators: ["=", "+", "-"],
  namedLiterals,
  escapes: `\\\\(u{[0-9A-Fa-f]+}|n|r|t|\\\\|'|\\\${)`,
  identifier: /[a-zA-Z]\w*/,
  fullIdentifier: /@identifier(?:\s*\.\s*@identifier)*/,
  optionName: /(?:@identifier|\(\s*@fullIdentifier\s*\))(?:\s*\.\s*@identifier)*/,
  messageName: /@identifier/,
  enumName: /@identifier/,
  messageType: /\.?\s*(?:@identifier\s*\.\s*)*@messageName/,
  enumType: /\.?\s*(?:@identifier\s*\.\s*)*@enumName/,
  floatLit: /[0-9]+\s*\.\s*[0-9]*(?:@exponent)?|[0-9]+@exponent|\.[0-9]+(?:@exponent)?/,
  exponent: /[eE]\s*[+-]?\s*[0-9]+/,
  boolLit: /true\b|false\b/,
  decimalLit: /[1-9][0-9]*/,
  octalLit: /0[0-7]*/,
  hexLit: /0[xX][0-9a-fA-F]+/,
  type: /double|float|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string|bytes|@messageType|@enumType/,
  keyType: /int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string/,
  tokenizer: {
    root: [
      { include: "@whitespace" },
      [/syntax/, "keyword"],
      [/=/, "operators"],
      [/;/, "delimiter"],
      [
        /(")(proto3)(")/,
        ["string.quote", "string", { token: "string.quote", switchTo: "@topLevel.proto3" }]
      ],
      [
        /(")(proto2)(")/,
        ["string.quote", "string", { token: "string.quote", switchTo: "@topLevel.proto2" }]
      ],
      [
        /.*?/,
        { token: "", switchTo: "@topLevel.proto2" }
      ]
    ],
    topLevel: [
      { include: "@whitespace" },
      { include: "@constant" },
      [/=/, "operators"],
      [/[;.]/, "delimiter"],
      [
        /@fullIdentifier/,
        {
          cases: {
            option: { token: "keyword", next: "@option.$S2" },
            enum: { token: "keyword", next: "@enumDecl.$S2" },
            message: { token: "keyword", next: "@messageDecl.$S2" },
            service: { token: "keyword", next: "@serviceDecl.$S2" },
            extend: {
              cases: {
                "$S2==proto2": { token: "keyword", next: "@extendDecl.$S2" }
              }
            },
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ]
    ],
    enumDecl: [
      { include: "@whitespace" },
      [/@identifier/, "type.identifier"],
      [/{/, { token: "@brackets", bracket: "@open", switchTo: "@enumBody.$S2" }]
    ],
    enumBody: [
      { include: "@whitespace" },
      { include: "@constant" },
      [/=/, "operators"],
      [/;/, "delimiter"],
      [/option\b/, "keyword", "@option.$S2"],
      [/@identifier/, "identifier"],
      [/\[/, { token: "@brackets", bracket: "@open", next: "@options.$S2" }],
      [/}/, { token: "@brackets", bracket: "@close", next: "@pop" }]
    ],
    messageDecl: [
      { include: "@whitespace" },
      [/@identifier/, "type.identifier"],
      [/{/, { token: "@brackets", bracket: "@open", switchTo: "@messageBody.$S2" }]
    ],
    messageBody: [
      { include: "@whitespace" },
      { include: "@constant" },
      [/=/, "operators"],
      [/;/, "delimiter"],
      [
        "(map)(s*)(<)",
        ["keyword", "white", { token: "@brackets", bracket: "@open", next: "@map.$S2" }]
      ],
      [
        /@identifier/,
        {
          cases: {
            option: { token: "keyword", next: "@option.$S2" },
            enum: { token: "keyword", next: "@enumDecl.$S2" },
            message: { token: "keyword", next: "@messageDecl.$S2" },
            oneof: { token: "keyword", next: "@oneofDecl.$S2" },
            extensions: {
              cases: {
                "$S2==proto2": { token: "keyword", next: "@reserved.$S2" }
              }
            },
            reserved: { token: "keyword", next: "@reserved.$S2" },
            "(?:repeated|optional)": { token: "keyword", next: "@field.$S2" },
            required: {
              cases: {
                "$S2==proto2": { token: "keyword", next: "@field.$S2" }
              }
            },
            "$S2==proto3": { token: "@rematch", next: "@field.$S2" }
          }
        }
      ],
      [/\[/, { token: "@brackets", bracket: "@open", next: "@options.$S2" }],
      [/}/, { token: "@brackets", bracket: "@close", next: "@pop" }]
    ],
    extendDecl: [
      { include: "@whitespace" },
      [/@identifier/, "type.identifier"],
      [/{/, { token: "@brackets", bracket: "@open", switchTo: "@extendBody.$S2" }]
    ],
    extendBody: [
      { include: "@whitespace" },
      { include: "@constant" },
      [/;/, "delimiter"],
      [/(?:repeated|optional|required)/, "keyword", "@field.$S2"],
      [/\[/, { token: "@brackets", bracket: "@open", next: "@options.$S2" }],
      [/}/, { token: "@brackets", bracket: "@close", next: "@pop" }]
    ],
    options: [
      { include: "@whitespace" },
      { include: "@constant" },
      [/;/, "delimiter"],
      [/@optionName/, "annotation"],
      [/[()]/, "annotation.brackets"],
      [/=/, "operator"],
      [/\]/, { token: "@brackets", bracket: "@close", next: "@pop" }]
    ],
    option: [
      { include: "@whitespace" },
      [/@optionName/, "annotation"],
      [/[()]/, "annotation.brackets"],
      [/=/, "operator", "@pop"]
    ],
    oneofDecl: [
      { include: "@whitespace" },
      [/@identifier/, "identifier"],
      [/{/, { token: "@brackets", bracket: "@open", switchTo: "@oneofBody.$S2" }]
    ],
    oneofBody: [
      { include: "@whitespace" },
      { include: "@constant" },
      [/;/, "delimiter"],
      [/(@identifier)(\s*)(=)/, ["identifier", "white", "delimiter"]],
      [
        /@fullIdentifier|\./,
        {
          cases: {
            "@builtinTypes": "keyword",
            "@default": "type.identifier"
          }
        }
      ],
      [/\[/, { token: "@brackets", bracket: "@open", next: "@options.$S2" }],
      [/}/, { token: "@brackets", bracket: "@close", next: "@pop" }]
    ],
    reserved: [
      { include: "@whitespace" },
      [/,/, "delimiter"],
      [/;/, "delimiter", "@pop"],
      { include: "@constant" },
      [/to\b|max\b/, "keyword"]
    ],
    map: [
      { include: "@whitespace" },
      [
        /@fullIdentifier|\./,
        {
          cases: {
            "@builtinTypes": "keyword",
            "@default": "type.identifier"
          }
        }
      ],
      [/,/, "delimiter"],
      [/>/, { token: "@brackets", bracket: "@close", switchTo: "identifier" }]
    ],
    field: [
      { include: "@whitespace" },
      [
        "group",
        {
          cases: {
            "$S2==proto2": { token: "keyword", switchTo: "@groupDecl.$S2" }
          }
        }
      ],
      [/(@identifier)(\s*)(=)/, ["identifier", "white", { token: "delimiter", next: "@pop" }]],
      [
        /@fullIdentifier|\./,
        {
          cases: {
            "@builtinTypes": "keyword",
            "@default": "type.identifier"
          }
        }
      ]
    ],
    groupDecl: [
      { include: "@whitespace" },
      [/@identifier/, "identifier"],
      ["=", "operator"],
      [/{/, { token: "@brackets", bracket: "@open", switchTo: "@messageBody.$S2" }],
      { include: "@constant" }
    ],
    type: [
      { include: "@whitespace" },
      [/@identifier/, "type.identifier", "@pop"],
      [/./, "delimiter"]
    ],
    identifier: [{ include: "@whitespace" }, [/@identifier/, "identifier", "@pop"]],
    serviceDecl: [
      { include: "@whitespace" },
      [/@identifier/, "identifier"],
      [/{/, { token: "@brackets", bracket: "@open", switchTo: "@serviceBody.$S2" }]
    ],
    serviceBody: [
      { include: "@whitespace" },
      { include: "@constant" },
      [/;/, "delimiter"],
      [/option\b/, "keyword", "@option.$S2"],
      [/rpc\b/, "keyword", "@rpc.$S2"],
      [/\[/, { token: "@brackets", bracket: "@open", next: "@options.$S2" }],
      [/}/, { token: "@brackets", bracket: "@close", next: "@pop" }]
    ],
    rpc: [
      { include: "@whitespace" },
      [/@identifier/, "identifier"],
      [/\(/, { token: "@brackets", bracket: "@open", switchTo: "@request.$S2" }],
      [/{/, { token: "@brackets", bracket: "@open", next: "@methodOptions.$S2" }],
      [/;/, "delimiter", "@pop"]
    ],
    request: [
      { include: "@whitespace" },
      [
        /@messageType/,
        {
          cases: {
            stream: { token: "keyword", next: "@type.$S2" },
            "@default": "type.identifier"
          }
        }
      ],
      [/\)/, { token: "@brackets", bracket: "@close", switchTo: "@returns.$S2" }]
    ],
    returns: [
      { include: "@whitespace" },
      [/returns\b/, "keyword"],
      [/\(/, { token: "@brackets", bracket: "@open", switchTo: "@response.$S2" }]
    ],
    response: [
      { include: "@whitespace" },
      [
        /@messageType/,
        {
          cases: {
            stream: { token: "keyword", next: "@type.$S2" },
            "@default": "type.identifier"
          }
        }
      ],
      [/\)/, { token: "@brackets", bracket: "@close", switchTo: "@rpc.$S2" }]
    ],
    methodOptions: [
      { include: "@whitespace" },
      { include: "@constant" },
      [/;/, "delimiter"],
      ["option", "keyword"],
      [/@optionName/, "annotation"],
      [/[()]/, "annotation.brackets"],
      [/=/, "operator"],
      [/}/, { token: "@brackets", bracket: "@close", next: "@pop" }]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\/\*/, "comment", "@push"],
      ["\\*/", "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    stringSingle: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    constant: [
      ["@boolLit", "keyword.constant"],
      ["@hexLit", "number.hex"],
      ["@octalLit", "number.octal"],
      ["@decimalLit", "number"],
      ["@floatLit", "number.float"],
      [/("([^"\\]|\\.)*|'([^'\\]|\\.)*)$/, "string.invalid"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
      [/'/, { token: "string.quote", bracket: "@open", next: "@stringSingle" }],
      [/{/, { token: "@brackets", bracket: "@open", next: "@prototext" }],
      [/identifier/, "identifier"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    prototext: [
      { include: "@whitespace" },
      { include: "@constant" },
      [/@identifier/, "identifier"],
      [/[:;]/, "delimiter"],
      [/}/, { token: "@brackets", bracket: "@close", next: "@pop" }]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9idWYuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvcHJvdG9idWYvcHJvdG9idWYuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3Byb3RvYnVmL3Byb3RvYnVmLnRzXG52YXIgbmFtZWRMaXRlcmFscyA9IFtcInRydWVcIiwgXCJmYWxzZVwiXTtcbnZhciBjb25mID0ge1xuICBjb21tZW50czoge1xuICAgIGxpbmVDb21tZW50OiBcIi8vXCIsXG4gICAgYmxvY2tDb21tZW50OiBbXCIvKlwiLCBcIiovXCJdXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl0sXG4gICAgW1wiPFwiLCBcIj5cIl1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogXCI8XCIsIGNsb3NlOiBcIj5cIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJywgbm90SW46IFtcInN0cmluZ1wiXSB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiXSB9XG4gIF0sXG4gIGF1dG9DbG9zZUJlZm9yZTogXCIuLD19XSk+JyBcXG5cdFwiLFxuICBpbmRlbnRhdGlvblJ1bGVzOiB7XG4gICAgaW5jcmVhc2VJbmRlbnRQYXR0ZXJuOiBuZXcgUmVnRXhwKFwiXigoPyFcXFxcL1xcXFwvKS4pKihcXFxce1tefVxcXCInYF0qfFxcXFwoW14pXFxcIidgXSp8XFxcXFtbXlxcXFxdXFxcIidgXSopJFwiKSxcbiAgICBkZWNyZWFzZUluZGVudFBhdHRlcm46IG5ldyBSZWdFeHAoXCJeKCg/IS4qP1xcXFwvXFxcXCopLipcXFxcKi8pP1xcXFxzKltcXFxcfVxcXFxdXS4qJFwiKVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIHRva2VuUG9zdGZpeDogXCIucHJvdG9cIixcbiAgYnJhY2tldHM6IFtcbiAgICB7IG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIsIHRva2VuOiBcImRlbGltaXRlci5jdXJseVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIgfSxcbiAgICB7IG9wZW46IFwiKFwiLCBjbG9zZTogXCIpXCIsIHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiIH0sXG4gICAgeyBvcGVuOiBcIjxcIiwgY2xvc2U6IFwiPlwiLCB0b2tlbjogXCJkZWxpbWl0ZXIuYW5nbGVcIiB9XG4gIF0sXG4gIHN5bWJvbHM6IC9bPT48IX4/OiZ8K1xcLSovXiVdKy8sXG4gIGtleXdvcmRzOiBbXG4gICAgXCJzeW50YXhcIixcbiAgICBcImltcG9ydFwiLFxuICAgIFwid2Vha1wiLFxuICAgIFwicHVibGljXCIsXG4gICAgXCJwYWNrYWdlXCIsXG4gICAgXCJvcHRpb25cIixcbiAgICBcInJlcGVhdGVkXCIsXG4gICAgXCJvbmVvZlwiLFxuICAgIFwibWFwXCIsXG4gICAgXCJyZXNlcnZlZFwiLFxuICAgIFwidG9cIixcbiAgICBcIm1heFwiLFxuICAgIFwiZW51bVwiLFxuICAgIFwibWVzc2FnZVwiLFxuICAgIFwic2VydmljZVwiLFxuICAgIFwicnBjXCIsXG4gICAgXCJzdHJlYW1cIixcbiAgICBcInJldHVybnNcIixcbiAgICBcInBhY2thZ2VcIixcbiAgICBcIm9wdGlvbmFsXCIsXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJmYWxzZVwiXG4gIF0sXG4gIGJ1aWx0aW5UeXBlczogW1xuICAgIFwiZG91YmxlXCIsXG4gICAgXCJmbG9hdFwiLFxuICAgIFwiaW50MzJcIixcbiAgICBcImludDY0XCIsXG4gICAgXCJ1aW50MzJcIixcbiAgICBcInVpbnQ2NFwiLFxuICAgIFwic2ludDMyXCIsXG4gICAgXCJzaW50NjRcIixcbiAgICBcImZpeGVkMzJcIixcbiAgICBcImZpeGVkNjRcIixcbiAgICBcInNmaXhlZDMyXCIsXG4gICAgXCJzZml4ZWQ2NFwiLFxuICAgIFwiYm9vbFwiLFxuICAgIFwic3RyaW5nXCIsXG4gICAgXCJieXRlc1wiXG4gIF0sXG4gIG9wZXJhdG9yczogW1wiPVwiLCBcIitcIiwgXCItXCJdLFxuICBuYW1lZExpdGVyYWxzLFxuICBlc2NhcGVzOiBgXFxcXFxcXFwodXtbMC05QS1GYS1mXSt9fG58cnx0fFxcXFxcXFxcfCd8XFxcXFxcJHspYCxcbiAgaWRlbnRpZmllcjogL1thLXpBLVpdXFx3Ki8sXG4gIGZ1bGxJZGVudGlmaWVyOiAvQGlkZW50aWZpZXIoPzpcXHMqXFwuXFxzKkBpZGVudGlmaWVyKSovLFxuICBvcHRpb25OYW1lOiAvKD86QGlkZW50aWZpZXJ8XFwoXFxzKkBmdWxsSWRlbnRpZmllclxccypcXCkpKD86XFxzKlxcLlxccypAaWRlbnRpZmllcikqLyxcbiAgbWVzc2FnZU5hbWU6IC9AaWRlbnRpZmllci8sXG4gIGVudW1OYW1lOiAvQGlkZW50aWZpZXIvLFxuICBtZXNzYWdlVHlwZTogL1xcLj9cXHMqKD86QGlkZW50aWZpZXJcXHMqXFwuXFxzKikqQG1lc3NhZ2VOYW1lLyxcbiAgZW51bVR5cGU6IC9cXC4/XFxzKig/OkBpZGVudGlmaWVyXFxzKlxcLlxccyopKkBlbnVtTmFtZS8sXG4gIGZsb2F0TGl0OiAvWzAtOV0rXFxzKlxcLlxccypbMC05XSooPzpAZXhwb25lbnQpP3xbMC05XStAZXhwb25lbnR8XFwuWzAtOV0rKD86QGV4cG9uZW50KT8vLFxuICBleHBvbmVudDogL1tlRV1cXHMqWystXT9cXHMqWzAtOV0rLyxcbiAgYm9vbExpdDogL3RydWVcXGJ8ZmFsc2VcXGIvLFxuICBkZWNpbWFsTGl0OiAvWzEtOV1bMC05XSovLFxuICBvY3RhbExpdDogLzBbMC03XSovLFxuICBoZXhMaXQ6IC8wW3hYXVswLTlhLWZBLUZdKy8sXG4gIHR5cGU6IC9kb3VibGV8ZmxvYXR8aW50MzJ8aW50NjR8dWludDMyfHVpbnQ2NHxzaW50MzJ8c2ludDY0fGZpeGVkMzJ8Zml4ZWQ2NHxzZml4ZWQzMnxzZml4ZWQ2NHxib29sfHN0cmluZ3xieXRlc3xAbWVzc2FnZVR5cGV8QGVudW1UeXBlLyxcbiAga2V5VHlwZTogL2ludDMyfGludDY0fHVpbnQzMnx1aW50NjR8c2ludDMyfHNpbnQ2NHxmaXhlZDMyfGZpeGVkNjR8c2ZpeGVkMzJ8c2ZpeGVkNjR8Ym9vbHxzdHJpbmcvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy9zeW50YXgvLCBcImtleXdvcmRcIl0sXG4gICAgICBbLz0vLCBcIm9wZXJhdG9yc1wiXSxcbiAgICAgIFsvOy8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW1xuICAgICAgICAvKFwiKShwcm90bzMpKFwiKS8sXG4gICAgICAgIFtcInN0cmluZy5xdW90ZVwiLCBcInN0cmluZ1wiLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBzd2l0Y2hUbzogXCJAdG9wTGV2ZWwucHJvdG8zXCIgfV1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8oXCIpKHByb3RvMikoXCIpLyxcbiAgICAgICAgW1wic3RyaW5nLnF1b3RlXCIsIFwic3RyaW5nXCIsIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIHN3aXRjaFRvOiBcIkB0b3BMZXZlbC5wcm90bzJcIiB9XVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLy4qPy8sXG4gICAgICAgIHsgdG9rZW46IFwiXCIsIHN3aXRjaFRvOiBcIkB0b3BMZXZlbC5wcm90bzJcIiB9XG4gICAgICBdXG4gICAgXSxcbiAgICB0b3BMZXZlbDogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAY29uc3RhbnRcIiB9LFxuICAgICAgWy89LywgXCJvcGVyYXRvcnNcIl0sXG4gICAgICBbL1s7Ll0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFtcbiAgICAgICAgL0BmdWxsSWRlbnRpZmllci8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgb3B0aW9uOiB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAb3B0aW9uLiRTMlwiIH0sXG4gICAgICAgICAgICBlbnVtOiB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAZW51bURlY2wuJFMyXCIgfSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHsgdG9rZW46IFwia2V5d29yZFwiLCBuZXh0OiBcIkBtZXNzYWdlRGVjbC4kUzJcIiB9LFxuICAgICAgICAgICAgc2VydmljZTogeyB0b2tlbjogXCJrZXl3b3JkXCIsIG5leHQ6IFwiQHNlcnZpY2VEZWNsLiRTMlwiIH0sXG4gICAgICAgICAgICBleHRlbmQ6IHtcbiAgICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgICBcIiRTMj09cHJvdG8yXCI6IHsgdG9rZW46IFwia2V5d29yZFwiLCBuZXh0OiBcIkBleHRlbmREZWNsLiRTMlwiIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIF0sXG4gICAgZW51bURlY2w6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbL0BpZGVudGlmaWVyLywgXCJ0eXBlLmlkZW50aWZpZXJcIl0sXG4gICAgICBbL3svLCB7IHRva2VuOiBcIkBicmFja2V0c1wiLCBicmFja2V0OiBcIkBvcGVuXCIsIHN3aXRjaFRvOiBcIkBlbnVtQm9keS4kUzJcIiB9XVxuICAgIF0sXG4gICAgZW51bUJvZHk6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbnN0YW50XCIgfSxcbiAgICAgIFsvPS8sIFwib3BlcmF0b3JzXCJdLFxuICAgICAgWy87LywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL29wdGlvblxcYi8sIFwia2V5d29yZFwiLCBcIkBvcHRpb24uJFMyXCJdLFxuICAgICAgWy9AaWRlbnRpZmllci8sIFwiaWRlbnRpZmllclwiXSxcbiAgICAgIFsvXFxbLywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAb3BlblwiLCBuZXh0OiBcIkBvcHRpb25zLiRTMlwiIH1dLFxuICAgICAgWy99LywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAY2xvc2VcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIG1lc3NhZ2VEZWNsOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy9AaWRlbnRpZmllci8sIFwidHlwZS5pZGVudGlmaWVyXCJdLFxuICAgICAgWy97LywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAb3BlblwiLCBzd2l0Y2hUbzogXCJAbWVzc2FnZUJvZHkuJFMyXCIgfV1cbiAgICBdLFxuICAgIG1lc3NhZ2VCb2R5OiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBjb25zdGFudFwiIH0sXG4gICAgICBbLz0vLCBcIm9wZXJhdG9yc1wiXSxcbiAgICAgIFsvOy8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW1xuICAgICAgICBcIihtYXApKHMqKSg8KVwiLFxuICAgICAgICBbXCJrZXl3b3JkXCIsIFwid2hpdGVcIiwgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAb3BlblwiLCBuZXh0OiBcIkBtYXAuJFMyXCIgfV1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC9AaWRlbnRpZmllci8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgb3B0aW9uOiB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAb3B0aW9uLiRTMlwiIH0sXG4gICAgICAgICAgICBlbnVtOiB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAZW51bURlY2wuJFMyXCIgfSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHsgdG9rZW46IFwia2V5d29yZFwiLCBuZXh0OiBcIkBtZXNzYWdlRGVjbC4kUzJcIiB9LFxuICAgICAgICAgICAgb25lb2Y6IHsgdG9rZW46IFwia2V5d29yZFwiLCBuZXh0OiBcIkBvbmVvZkRlY2wuJFMyXCIgfSxcbiAgICAgICAgICAgIGV4dGVuc2lvbnM6IHtcbiAgICAgICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICAgICBcIiRTMj09cHJvdG8yXCI6IHsgdG9rZW46IFwia2V5d29yZFwiLCBuZXh0OiBcIkByZXNlcnZlZC4kUzJcIiB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNlcnZlZDogeyB0b2tlbjogXCJrZXl3b3JkXCIsIG5leHQ6IFwiQHJlc2VydmVkLiRTMlwiIH0sXG4gICAgICAgICAgICBcIig/OnJlcGVhdGVkfG9wdGlvbmFsKVwiOiB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAZmllbGQuJFMyXCIgfSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB7XG4gICAgICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICAgICAgXCIkUzI9PXByb3RvMlwiOiB7IHRva2VuOiBcImtleXdvcmRcIiwgbmV4dDogXCJAZmllbGQuJFMyXCIgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkUzI9PXByb3RvM1wiOiB7IHRva2VuOiBcIkByZW1hdGNoXCIsIG5leHQ6IFwiQGZpZWxkLiRTMlwiIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1xcWy8sIHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIGJyYWNrZXQ6IFwiQG9wZW5cIiwgbmV4dDogXCJAb3B0aW9ucy4kUzJcIiB9XSxcbiAgICAgIFsvfS8sIHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBleHRlbmREZWNsOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy9AaWRlbnRpZmllci8sIFwidHlwZS5pZGVudGlmaWVyXCJdLFxuICAgICAgWy97LywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAb3BlblwiLCBzd2l0Y2hUbzogXCJAZXh0ZW5kQm9keS4kUzJcIiB9XVxuICAgIF0sXG4gICAgZXh0ZW5kQm9keTogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAY29uc3RhbnRcIiB9LFxuICAgICAgWy87LywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbLyg/OnJlcGVhdGVkfG9wdGlvbmFsfHJlcXVpcmVkKS8sIFwia2V5d29yZFwiLCBcIkBmaWVsZC4kUzJcIl0sXG4gICAgICBbL1xcWy8sIHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIGJyYWNrZXQ6IFwiQG9wZW5cIiwgbmV4dDogXCJAb3B0aW9ucy4kUzJcIiB9XSxcbiAgICAgIFsvfS8sIHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBvcHRpb25zOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgeyBpbmNsdWRlOiBcIkBjb25zdGFudFwiIH0sXG4gICAgICBbLzsvLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvQG9wdGlvbk5hbWUvLCBcImFubm90YXRpb25cIl0sXG4gICAgICBbL1soKV0vLCBcImFubm90YXRpb24uYnJhY2tldHNcIl0sXG4gICAgICBbLz0vLCBcIm9wZXJhdG9yXCJdLFxuICAgICAgWy9cXF0vLCB7IHRva2VuOiBcIkBicmFja2V0c1wiLCBicmFja2V0OiBcIkBjbG9zZVwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgb3B0aW9uOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy9Ab3B0aW9uTmFtZS8sIFwiYW5ub3RhdGlvblwiXSxcbiAgICAgIFsvWygpXS8sIFwiYW5ub3RhdGlvbi5icmFja2V0c1wiXSxcbiAgICAgIFsvPS8sIFwib3BlcmF0b3JcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICBvbmVvZkRlY2w6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbL0BpZGVudGlmaWVyLywgXCJpZGVudGlmaWVyXCJdLFxuICAgICAgWy97LywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAb3BlblwiLCBzd2l0Y2hUbzogXCJAb25lb2ZCb2R5LiRTMlwiIH1dXG4gICAgXSxcbiAgICBvbmVvZkJvZHk6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbnN0YW50XCIgfSxcbiAgICAgIFsvOy8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy8oQGlkZW50aWZpZXIpKFxccyopKD0pLywgW1wiaWRlbnRpZmllclwiLCBcIndoaXRlXCIsIFwiZGVsaW1pdGVyXCJdXSxcbiAgICAgIFtcbiAgICAgICAgL0BmdWxsSWRlbnRpZmllcnxcXC4vLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGJ1aWx0aW5UeXBlc1wiOiBcImtleXdvcmRcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJ0eXBlLmlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXFxbLywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAb3BlblwiLCBuZXh0OiBcIkBvcHRpb25zLiRTMlwiIH1dLFxuICAgICAgWy99LywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAY2xvc2VcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdLFxuICAgIHJlc2VydmVkOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy8sLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbLzsvLCBcImRlbGltaXRlclwiLCBcIkBwb3BcIl0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbnN0YW50XCIgfSxcbiAgICAgIFsvdG9cXGJ8bWF4XFxiLywgXCJrZXl3b3JkXCJdXG4gICAgXSxcbiAgICBtYXA6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbXG4gICAgICAgIC9AZnVsbElkZW50aWZpZXJ8XFwuLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBidWlsdGluVHlwZXNcIjogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwidHlwZS5pZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLywvLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvPi8sIHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIHN3aXRjaFRvOiBcImlkZW50aWZpZXJcIiB9XVxuICAgIF0sXG4gICAgZmllbGQ6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbXG4gICAgICAgIFwiZ3JvdXBcIixcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiRTMj09cHJvdG8yXCI6IHsgdG9rZW46IFwia2V5d29yZFwiLCBzd2l0Y2hUbzogXCJAZ3JvdXBEZWNsLiRTMlwiIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLyhAaWRlbnRpZmllcikoXFxzKikoPSkvLCBbXCJpZGVudGlmaWVyXCIsIFwid2hpdGVcIiwgeyB0b2tlbjogXCJkZWxpbWl0ZXJcIiwgbmV4dDogXCJAcG9wXCIgfV1dLFxuICAgICAgW1xuICAgICAgICAvQGZ1bGxJZGVudGlmaWVyfFxcLi8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCJAYnVpbHRpblR5cGVzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInR5cGUuaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBncm91cERlY2w6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbL0BpZGVudGlmaWVyLywgXCJpZGVudGlmaWVyXCJdLFxuICAgICAgW1wiPVwiLCBcIm9wZXJhdG9yXCJdLFxuICAgICAgWy97LywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAb3BlblwiLCBzd2l0Y2hUbzogXCJAbWVzc2FnZUJvZHkuJFMyXCIgfV0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbnN0YW50XCIgfVxuICAgIF0sXG4gICAgdHlwZTogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIFsvQGlkZW50aWZpZXIvLCBcInR5cGUuaWRlbnRpZmllclwiLCBcIkBwb3BcIl0sXG4gICAgICBbLy4vLCBcImRlbGltaXRlclwiXVxuICAgIF0sXG4gICAgaWRlbnRpZmllcjogW3sgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sIFsvQGlkZW50aWZpZXIvLCBcImlkZW50aWZpZXJcIiwgXCJAcG9wXCJdXSxcbiAgICBzZXJ2aWNlRGVjbDogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIFsvQGlkZW50aWZpZXIvLCBcImlkZW50aWZpZXJcIl0sXG4gICAgICBbL3svLCB7IHRva2VuOiBcIkBicmFja2V0c1wiLCBicmFja2V0OiBcIkBvcGVuXCIsIHN3aXRjaFRvOiBcIkBzZXJ2aWNlQm9keS4kUzJcIiB9XVxuICAgIF0sXG4gICAgc2VydmljZUJvZHk6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbnN0YW50XCIgfSxcbiAgICAgIFsvOy8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9vcHRpb25cXGIvLCBcImtleXdvcmRcIiwgXCJAb3B0aW9uLiRTMlwiXSxcbiAgICAgIFsvcnBjXFxiLywgXCJrZXl3b3JkXCIsIFwiQHJwYy4kUzJcIl0sXG4gICAgICBbL1xcWy8sIHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIGJyYWNrZXQ6IFwiQG9wZW5cIiwgbmV4dDogXCJAb3B0aW9ucy4kUzJcIiB9XSxcbiAgICAgIFsvfS8sIHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBycGM6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbL0BpZGVudGlmaWVyLywgXCJpZGVudGlmaWVyXCJdLFxuICAgICAgWy9cXCgvLCB7IHRva2VuOiBcIkBicmFja2V0c1wiLCBicmFja2V0OiBcIkBvcGVuXCIsIHN3aXRjaFRvOiBcIkByZXF1ZXN0LiRTMlwiIH1dLFxuICAgICAgWy97LywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAb3BlblwiLCBuZXh0OiBcIkBtZXRob2RPcHRpb25zLiRTMlwiIH1dLFxuICAgICAgWy87LywgXCJkZWxpbWl0ZXJcIiwgXCJAcG9wXCJdXG4gICAgXSxcbiAgICByZXF1ZXN0OiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgW1xuICAgICAgICAvQG1lc3NhZ2VUeXBlLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBzdHJlYW06IHsgdG9rZW46IFwia2V5d29yZFwiLCBuZXh0OiBcIkB0eXBlLiRTMlwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwidHlwZS5pZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1xcKS8sIHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIHN3aXRjaFRvOiBcIkByZXR1cm5zLiRTMlwiIH1dXG4gICAgXSxcbiAgICByZXR1cm5zOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQHdoaXRlc3BhY2VcIiB9LFxuICAgICAgWy9yZXR1cm5zXFxiLywgXCJrZXl3b3JkXCJdLFxuICAgICAgWy9cXCgvLCB7IHRva2VuOiBcIkBicmFja2V0c1wiLCBicmFja2V0OiBcIkBvcGVuXCIsIHN3aXRjaFRvOiBcIkByZXNwb25zZS4kUzJcIiB9XVxuICAgIF0sXG4gICAgcmVzcG9uc2U6IFtcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbXG4gICAgICAgIC9AbWVzc2FnZVR5cGUvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIHN0cmVhbTogeyB0b2tlbjogXCJrZXl3b3JkXCIsIG5leHQ6IFwiQHR5cGUuJFMyXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJ0eXBlLmlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvXFwpLywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAY2xvc2VcIiwgc3dpdGNoVG86IFwiQHJwYy4kUzJcIiB9XVxuICAgIF0sXG4gICAgbWV0aG9kT3B0aW9uczogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAY29uc3RhbnRcIiB9LFxuICAgICAgWy87LywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbXCJvcHRpb25cIiwgXCJrZXl3b3JkXCJdLFxuICAgICAgWy9Ab3B0aW9uTmFtZS8sIFwiYW5ub3RhdGlvblwiXSxcbiAgICAgIFsvWygpXS8sIFwiYW5ub3RhdGlvbi5icmFja2V0c1wiXSxcbiAgICAgIFsvPS8sIFwib3BlcmF0b3JcIl0sXG4gICAgICBbL30vLCB7IHRva2VuOiBcIkBicmFja2V0c1wiLCBicmFja2V0OiBcIkBjbG9zZVwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXlxcLypdKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50XCIsIFwiQHB1c2hcIl0sXG4gICAgICBbXCJcXFxcKi9cIiwgXCJjb21tZW50XCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW1xcLypdLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBzdHJpbmc6IFtcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBicmFja2V0OiBcIkBjbG9zZVwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc3RyaW5nU2luZ2xlOiBbXG4gICAgICBbL1teXFxcXCddKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvJy8sIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXSxcbiAgICBjb25zdGFudDogW1xuICAgICAgW1wiQGJvb2xMaXRcIiwgXCJrZXl3b3JkLmNvbnN0YW50XCJdLFxuICAgICAgW1wiQGhleExpdFwiLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbXCJAb2N0YWxMaXRcIiwgXCJudW1iZXIub2N0YWxcIl0sXG4gICAgICBbXCJAZGVjaW1hbExpdFwiLCBcIm51bWJlclwiXSxcbiAgICAgIFtcIkBmbG9hdExpdFwiLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvKFwiKFteXCJcXFxcXXxcXFxcLikqfCcoW14nXFxcXF18XFxcXC4pKikkLywgXCJzdHJpbmcuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBicmFja2V0OiBcIkBvcGVuXCIsIG5leHQ6IFwiQHN0cmluZ1wiIH1dLFxuICAgICAgWy8nLywgeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgYnJhY2tldDogXCJAb3BlblwiLCBuZXh0OiBcIkBzdHJpbmdTaW5nbGVcIiB9XSxcbiAgICAgIFsvey8sIHsgdG9rZW46IFwiQGJyYWNrZXRzXCIsIGJyYWNrZXQ6IFwiQG9wZW5cIiwgbmV4dDogXCJAcHJvdG90ZXh0XCIgfV0sXG4gICAgICBbL2lkZW50aWZpZXIvLCBcImlkZW50aWZpZXJcIl1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwid2hpdGVcIl0sXG4gICAgICBbL1xcL1xcKi8sIFwiY29tbWVudFwiLCBcIkBjb21tZW50XCJdLFxuICAgICAgWy9cXC9cXC8uKiQvLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIHByb3RvdGV4dDogW1xuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAY29uc3RhbnRcIiB9LFxuICAgICAgWy9AaWRlbnRpZmllci8sIFwiaWRlbnRpZmllclwiXSxcbiAgICAgIFsvWzo7XS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy99LywgeyB0b2tlbjogXCJAYnJhY2tldHNcIiwgYnJhY2tldDogXCJAY2xvc2VcIiwgbmV4dDogXCJAcG9wXCIgfV1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRQSxJQUFJLGdCQUFnQixDQUFDLFFBQVEsT0FBTztBQUNqQyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGNBQWMsQ0FBQyxNQUFNLElBQUk7QUFBQSxFQUMxQjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxLQUFLLEdBQUc7QUFBQSxFQUNWO0FBQUEsRUFDRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxJQUN6QixFQUFFLE1BQU0sS0FBSyxPQUFPLElBQUs7QUFBQSxFQUMxQjtBQUFBLEVBQ0Qsa0JBQWtCO0FBQUEsSUFDaEIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekIsRUFBRSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sQ0FBQyxRQUFRLEVBQUc7QUFBQSxJQUM1QyxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFFBQVEsRUFBRztBQUFBLEVBQzdDO0FBQUEsRUFD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
