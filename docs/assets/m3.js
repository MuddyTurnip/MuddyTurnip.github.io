/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  comments: {
    blockComment: ["(*", "*)"]
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
    { open: "(*", close: "*)" },
    { open: "<*", close: "*>" },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["string", "comment"] }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".m3",
  brackets: [
    { token: "delimiter.curly", open: "{", close: "}" },
    { token: "delimiter.parenthesis", open: "(", close: ")" },
    { token: "delimiter.square", open: "[", close: "]" }
  ],
  keywords: [
    "AND",
    "ANY",
    "ARRAY",
    "AS",
    "BEGIN",
    "BITS",
    "BRANDED",
    "BY",
    "CASE",
    "CONST",
    "DIV",
    "DO",
    "ELSE",
    "ELSIF",
    "END",
    "EVAL",
    "EXCEPT",
    "EXCEPTION",
    "EXIT",
    "EXPORTS",
    "FINALLY",
    "FOR",
    "FROM",
    "GENERIC",
    "IF",
    "IMPORT",
    "IN",
    "INTERFACE",
    "LOCK",
    "LOOP",
    "METHODS",
    "MOD",
    "MODULE",
    "NOT",
    "OBJECT",
    "OF",
    "OR",
    "OVERRIDES",
    "PROCEDURE",
    "RAISE",
    "RAISES",
    "READONLY",
    "RECORD",
    "REF",
    "REPEAT",
    "RETURN",
    "REVEAL",
    "SET",
    "THEN",
    "TO",
    "TRY",
    "TYPE",
    "TYPECASE",
    "UNSAFE",
    "UNTIL",
    "UNTRACED",
    "VALUE",
    "VAR",
    "WHILE",
    "WITH"
  ],
  reservedConstNames: [
    "ABS",
    "ADR",
    "ADRSIZE",
    "BITSIZE",
    "BYTESIZE",
    "CEILING",
    "DEC",
    "DISPOSE",
    "FALSE",
    "FIRST",
    "FLOAT",
    "FLOOR",
    "INC",
    "ISTYPE",
    "LAST",
    "LOOPHOLE",
    "MAX",
    "MIN",
    "NARROW",
    "NEW",
    "NIL",
    "NUMBER",
    "ORD",
    "ROUND",
    "SUBARRAY",
    "TRUE",
    "TRUNC",
    "TYPECODE",
    "VAL"
  ],
  reservedTypeNames: [
    "ADDRESS",
    "ANY",
    "BOOLEAN",
    "CARDINAL",
    "CHAR",
    "EXTENDED",
    "INTEGER",
    "LONGCARD",
    "LONGINT",
    "LONGREAL",
    "MUTEX",
    "NULL",
    "REAL",
    "REFANY",
    "ROOT",
    "TEXT"
  ],
  operators: ["+", "-", "*", "/", "&", "^", "."],
  relations: ["=", "#", "<", "<=", ">", ">=", "<:", ":"],
  delimiters: ["|", "..", "=>", ",", ";", ":="],
  symbols: /[>=<#.,:;+\-*/&^]+/,
  escapes: /\\(?:[\\fnrt"']|[0-7]{3})/,
  tokenizer: {
    root: [
      [/_\w*/, "invalid"],
      [
        /[a-zA-Z][a-zA-Z0-9_]*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@reservedConstNames": { token: "constant.reserved.$0" },
            "@reservedTypeNames": { token: "type.reserved.$0" },
            "@default": "identifier"
          }
        }
      ],
      { include: "@whitespace" },
      [/[{}()\[\]]/, "@brackets"],
      [/[0-9]+\.[0-9]+(?:[DdEeXx][\+\-]?[0-9]+)?/, "number.float"],
      [/[0-9]+(?:\_[0-9a-fA-F]+)?L?/, "number"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operators",
            "@relations": "operators",
            "@delimiters": "delimiter",
            "@default": "invalid"
          }
        }
      ],
      [/'[^\\']'/, "string.char"],
      [/(')(@escapes)(')/, ["string.char", "string.escape", "string.char"]],
      [/'/, "invalid"],
      [/"([^"\\]|\\.)*$/, "invalid"],
      [/"/, "string.text", "@text"]
    ],
    text: [
      [/[^\\"]+/, "string.text"],
      [/@escapes/, "string.escape"],
      [/\\./, "invalid"],
      [/"/, "string.text", "@pop"]
    ],
    comment: [
      [/\(\*/, "comment", "@push"],
      [/\*\)/, "comment", "@pop"],
      [/./, "comment"]
    ],
    pragma: [
      [/<\*/, "keyword.pragma", "@push"],
      [/\*>/, "keyword.pragma", "@pop"],
      [/./, "keyword.pragma"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\(\*/, "comment", "@comment"],
      [/<\*/, "keyword.pragma", "@pragma"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibTMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvbTMvbTMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL20zL20zLnRzXG52YXIgY29uZiA9IHtcbiAgY29tbWVudHM6IHtcbiAgICBibG9ja0NvbW1lbnQ6IFtcIigqXCIsIFwiKilcIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiBcIigqXCIsIGNsb3NlOiBcIiopXCIgfSxcbiAgICB7IG9wZW46IFwiPCpcIiwgY2xvc2U6IFwiKj5cIiB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiwgbm90SW46IFtcInN0cmluZ1wiLCBcImNvbW1lbnRcIl0gfSxcbiAgICB7IG9wZW46ICdcIicsIGNsb3NlOiAnXCInLCBub3RJbjogW1wic3RyaW5nXCIsIFwiY29tbWVudFwiXSB9XG4gIF1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5tM1wiLFxuICBicmFja2V0czogW1xuICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmN1cmx5XCIsIG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiLCBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIsIG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfVxuICBdLFxuICBrZXl3b3JkczogW1xuICAgIFwiQU5EXCIsXG4gICAgXCJBTllcIixcbiAgICBcIkFSUkFZXCIsXG4gICAgXCJBU1wiLFxuICAgIFwiQkVHSU5cIixcbiAgICBcIkJJVFNcIixcbiAgICBcIkJSQU5ERURcIixcbiAgICBcIkJZXCIsXG4gICAgXCJDQVNFXCIsXG4gICAgXCJDT05TVFwiLFxuICAgIFwiRElWXCIsXG4gICAgXCJET1wiLFxuICAgIFwiRUxTRVwiLFxuICAgIFwiRUxTSUZcIixcbiAgICBcIkVORFwiLFxuICAgIFwiRVZBTFwiLFxuICAgIFwiRVhDRVBUXCIsXG4gICAgXCJFWENFUFRJT05cIixcbiAgICBcIkVYSVRcIixcbiAgICBcIkVYUE9SVFNcIixcbiAgICBcIkZJTkFMTFlcIixcbiAgICBcIkZPUlwiLFxuICAgIFwiRlJPTVwiLFxuICAgIFwiR0VORVJJQ1wiLFxuICAgIFwiSUZcIixcbiAgICBcIklNUE9SVFwiLFxuICAgIFwiSU5cIixcbiAgICBcIklOVEVSRkFDRVwiLFxuICAgIFwiTE9DS1wiLFxuICAgIFwiTE9PUFwiLFxuICAgIFwiTUVUSE9EU1wiLFxuICAgIFwiTU9EXCIsXG4gICAgXCJNT0RVTEVcIixcbiAgICBcIk5PVFwiLFxuICAgIFwiT0JKRUNUXCIsXG4gICAgXCJPRlwiLFxuICAgIFwiT1JcIixcbiAgICBcIk9WRVJSSURFU1wiLFxuICAgIFwiUFJPQ0VEVVJFXCIsXG4gICAgXCJSQUlTRVwiLFxuICAgIFwiUkFJU0VTXCIsXG4gICAgXCJSRUFET05MWVwiLFxuICAgIFwiUkVDT1JEXCIsXG4gICAgXCJSRUZcIixcbiAgICBcIlJFUEVBVFwiLFxuICAgIFwiUkVUVVJOXCIsXG4gICAgXCJSRVZFQUxcIixcbiAgICBcIlNFVFwiLFxuICAgIFwiVEhFTlwiLFxuICAgIFwiVE9cIixcbiAgICBcIlRSWVwiLFxuICAgIFwiVFlQRVwiLFxuICAgIFwiVFlQRUNBU0VcIixcbiAgICBcIlVOU0FGRVwiLFxuICAgIFwiVU5USUxcIixcbiAgICBcIlVOVFJBQ0VEXCIsXG4gICAgXCJWQUxVRVwiLFxuICAgIFwiVkFSXCIsXG4gICAgXCJXSElMRVwiLFxuICAgIFwiV0lUSFwiXG4gIF0sXG4gIHJlc2VydmVkQ29uc3ROYW1lczogW1xuICAgIFwiQUJTXCIsXG4gICAgXCJBRFJcIixcbiAgICBcIkFEUlNJWkVcIixcbiAgICBcIkJJVFNJWkVcIixcbiAgICBcIkJZVEVTSVpFXCIsXG4gICAgXCJDRUlMSU5HXCIsXG4gICAgXCJERUNcIixcbiAgICBcIkRJU1BPU0VcIixcbiAgICBcIkZBTFNFXCIsXG4gICAgXCJGSVJTVFwiLFxuICAgIFwiRkxPQVRcIixcbiAgICBcIkZMT09SXCIsXG4gICAgXCJJTkNcIixcbiAgICBcIklTVFlQRVwiLFxuICAgIFwiTEFTVFwiLFxuICAgIFwiTE9PUEhPTEVcIixcbiAgICBcIk1BWFwiLFxuICAgIFwiTUlOXCIsXG4gICAgXCJOQVJST1dcIixcbiAgICBcIk5FV1wiLFxuICAgIFwiTklMXCIsXG4gICAgXCJOVU1CRVJcIixcbiAgICBcIk9SRFwiLFxuICAgIFwiUk9VTkRcIixcbiAgICBcIlNVQkFSUkFZXCIsXG4gICAgXCJUUlVFXCIsXG4gICAgXCJUUlVOQ1wiLFxuICAgIFwiVFlQRUNPREVcIixcbiAgICBcIlZBTFwiXG4gIF0sXG4gIHJlc2VydmVkVHlwZU5hbWVzOiBbXG4gICAgXCJBRERSRVNTXCIsXG4gICAgXCJBTllcIixcbiAgICBcIkJPT0xFQU5cIixcbiAgICBcIkNBUkRJTkFMXCIsXG4gICAgXCJDSEFSXCIsXG4gICAgXCJFWFRFTkRFRFwiLFxuICAgIFwiSU5URUdFUlwiLFxuICAgIFwiTE9OR0NBUkRcIixcbiAgICBcIkxPTkdJTlRcIixcbiAgICBcIkxPTkdSRUFMXCIsXG4gICAgXCJNVVRFWFwiLFxuICAgIFwiTlVMTFwiLFxuICAgIFwiUkVBTFwiLFxuICAgIFwiUkVGQU5ZXCIsXG4gICAgXCJST09UXCIsXG4gICAgXCJURVhUXCJcbiAgXSxcbiAgb3BlcmF0b3JzOiBbXCIrXCIsIFwiLVwiLCBcIipcIiwgXCIvXCIsIFwiJlwiLCBcIl5cIiwgXCIuXCJdLFxuICByZWxhdGlvbnM6IFtcIj1cIiwgXCIjXCIsIFwiPFwiLCBcIjw9XCIsIFwiPlwiLCBcIj49XCIsIFwiPDpcIiwgXCI6XCJdLFxuICBkZWxpbWl0ZXJzOiBbXCJ8XCIsIFwiLi5cIiwgXCI9PlwiLCBcIixcIiwgXCI7XCIsIFwiOj1cIl0sXG4gIHN5bWJvbHM6IC9bPj08Iy4sOjsrXFwtKi8mXl0rLyxcbiAgZXNjYXBlczogL1xcXFwoPzpbXFxcXGZucnRcIiddfFswLTddezN9KS8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIFsvX1xcdyovLCBcImludmFsaWRcIl0sXG4gICAgICBbXG4gICAgICAgIC9bYS16QS1aXVthLXpBLVowLTlfXSovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IHsgdG9rZW46IFwia2V5d29yZC4kMFwiIH0sXG4gICAgICAgICAgICBcIkByZXNlcnZlZENvbnN0TmFtZXNcIjogeyB0b2tlbjogXCJjb25zdGFudC5yZXNlcnZlZC4kMFwiIH0sXG4gICAgICAgICAgICBcIkByZXNlcnZlZFR5cGVOYW1lc1wiOiB7IHRva2VuOiBcInR5cGUucmVzZXJ2ZWQuJDBcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImlkZW50aWZpZXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgWy9bMC05XStcXC5bMC05XSsoPzpbRGRFZVh4XVtcXCtcXC1dP1swLTldKyk/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbL1swLTldKyg/OlxcX1swLTlhLWZBLUZdKyk/TD8vLCBcIm51bWJlclwiXSxcbiAgICAgIFtcbiAgICAgICAgL0BzeW1ib2xzLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBvcGVyYXRvcnNcIjogXCJvcGVyYXRvcnNcIixcbiAgICAgICAgICAgIFwiQHJlbGF0aW9uc1wiOiBcIm9wZXJhdG9yc1wiLFxuICAgICAgICAgICAgXCJAZGVsaW1pdGVyc1wiOiBcImRlbGltaXRlclwiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcImludmFsaWRcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvJ1teXFxcXCddJy8sIFwic3RyaW5nLmNoYXJcIl0sXG4gICAgICBbLygnKShAZXNjYXBlcykoJykvLCBbXCJzdHJpbmcuY2hhclwiLCBcInN0cmluZy5lc2NhcGVcIiwgXCJzdHJpbmcuY2hhclwiXV0sXG4gICAgICBbLycvLCBcImludmFsaWRcIl0sXG4gICAgICBbL1wiKFteXCJcXFxcXXxcXFxcLikqJC8sIFwiaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZy50ZXh0XCIsIFwiQHRleHRcIl1cbiAgICBdLFxuICAgIHRleHQ6IFtcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwic3RyaW5nLnRleHRcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9cXFxcLi8sIFwiaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCBcInN0cmluZy50ZXh0XCIsIFwiQHBvcFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9cXChcXCovLCBcImNvbW1lbnRcIiwgXCJAcHVzaFwiXSxcbiAgICAgIFsvXFwqXFwpLywgXCJjb21tZW50XCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvLi8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgcHJhZ21hOiBbXG4gICAgICBbLzxcXCovLCBcImtleXdvcmQucHJhZ21hXCIsIFwiQHB1c2hcIl0sXG4gICAgICBbL1xcKj4vLCBcImtleXdvcmQucHJhZ21hXCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvLi8sIFwia2V5d29yZC5wcmFnbWFcIl1cbiAgICBdLFxuICAgIHdoaXRlc3BhY2U6IFtcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwid2hpdGVcIl0sXG4gICAgICBbL1xcKFxcKi8sIFwiY29tbWVudFwiLCBcIkBjb21tZW50XCJdLFxuICAgICAgWy88XFwqLywgXCJrZXl3b3JkLnByYWdtYVwiLCBcIkBwcmFnbWFcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGNBQWMsQ0FBQyxNQUFNLElBQUk7QUFBQSxFQUMxQjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxNQUFNLE9BQU8sS0FBTTtBQUFBLElBQzNCLEVBQUUsTUFBTSxNQUFNLE9BQU8sS0FBTTtBQUFBLElBQzNCLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsVUFBVSxTQUFTLEVBQUc7QUFBQSxJQUN2RCxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFVBQVUsU0FBUyxFQUFHO0FBQUEsRUFDeEQ7QUFDSDtBQUNHLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsVUFBVTtBQUFBLElBQ1IsRUFBRSxPQUFPLG1CQUFtQixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDbkQsRUFBRSxPQUFPLHlCQUF5QixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsSUFDekQsRUFBRSxPQUFPLG9CQUFvQixNQUFNLEtBQUssT0FBTyxJQUFLO0FBQUEsRUFDckQ7QUFBQSxFQUNELFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxvQkFBb0I7QUFBQSxJQUNsQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDRCxtQkFBbUI7QUFBQSxJQUNqQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFBQSxFQUNELFdBQVcsQ0FBQyxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxHQUFHO0FBQUEsRUFDN0MsV0FBVyxDQUFDLEtBQUssS0FBSyxLQUFLLE1BQU0sS0FBSyxNQUFNLE1BQU0sR0FBRztBQUFBLEVBQ3JELFlBQVksQ0FBQyxLQUFLLE1BQU0sTUFBTSxLQUFLLEtBQUssSUFBSTtBQUFBLEVBQzVDLFNBQVM7QUFBQSxFQUNULFNBQVM7QUFBQSxFQUNULFdBQVc7QUFBQSxJQUNULE1BQU07QUFBQSxNQUNKLENBQUMsUUFBUSxTQUFTO0FBQUEsTUFDbEI7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFlBQ0wsYUFBYSxFQUFFLE9BQU8sYUFBYztBQUFBLFlBQ3BDLHVCQUF1QixFQUFFLE9BQU8sdUJBQXdCO0FBQUEsWUFDeEQsc0JBQXNCLEVBQUUsT0FBTyxtQkFBb0I7QUFBQSxZQUNuRCxZQUFZO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxFQUFFLFNBQVMsY0FBZTtBQUFBLE1BQzFCLENBQUMsY0FBYyxXQUFXO0FBQUEsTUFDMUIsQ0FBQyw0Q0FBNEMsY0FBYztBQUFBLE1BQzNELENBQUMsK0JBQStCLFFBQVE7QUFBQSxNQUN4QztBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxjQUFjO0FBQUEsWUFDZCxjQUFjO0FBQUEsWUFDZCxlQUFlO0FBQUEsWUFDZixZQUFZO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDRCxDQUFDLFlBQVksYUFBYTtBQUFBLE1BQzFCLENBQUMsb0JBQW9CLENBQUMsZUFBZSxpQkFBaUIsYUFBYSxDQUFDO0FBQUEsTUFDcEUsQ0FBQyxLQUFLLFNBQVM7QUFBQSxNQUNmLENBQUMsbUJBQW1CLFNBQVM7QUFBQSxNQUM3QixDQUFDLEtBQUssZUFBZSxPQUFPO0FBQUEsSUFDN0I7QUFBQSxJQUNELE1BQU07QUFBQSxNQUNKLENBQUMsV0FBVyxhQUFhO0FBQUEsTUFDekIsQ0FBQyxZQUFZLGVBQWU7QUFBQSxNQUM1QixDQUFDLE9BQU8sU0FBUztBQUFBLE1BQ2pCLENBQUMsS0FBSyxlQUFlLE1BQU07QUFBQSxJQUM1QjtBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1AsQ0FBQyxRQUFRLFdBQVcsT0FBTztBQUFBLE1BQzNCLENBQUMsUUFBUSxXQUFXLE1BQU07QUFBQSxNQUMxQixDQUFDLEtBQUssU0FBUztBQUFBLElBQ2hCO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTixDQUFDLE9BQU8sa0JBQWtCLE9BQU87QUFBQSxNQUNqQyxDQUFDLE9BQU8sa0JBQWtCLE1BQU07QUFBQSxNQUNoQyxDQUFDLEtBQUssZ0JBQWdCO0FBQUEsSUFDdkI7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNWLENBQUMsY0FBYyxPQUFPO0FBQUEsTUFDdEIsQ0FBQyxRQUFRLFdBQVcsVUFBVTtBQUFBLE1BQzlCLENBQUMsT0FBTyxrQkFBa0IsU0FBUztBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUNIOyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=