/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#%\^\&\*\(\)\=\$\-\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    blockComment: ["###", "###"],
    lineComment: "#"
  },
  folding: {
    markers: {
      start: new RegExp("^\\s*#region\\b"),
      end: new RegExp("^\\s*#endregion\\b")
    }
  }
};
var language = {
  defaultToken: "",
  ignoreCase: false,
  tokenPostfix: ".mips",
  regEx: /\/(?!\/\/)(?:[^\/\\]|\\.)*\/[igm]*/,
  keywords: [
    ".data",
    ".text",
    "syscall",
    "trap",
    "add",
    "addu",
    "addi",
    "addiu",
    "and",
    "andi",
    "div",
    "divu",
    "mult",
    "multu",
    "nor",
    "or",
    "ori",
    "sll",
    "slv",
    "sra",
    "srav",
    "srl",
    "srlv",
    "sub",
    "subu",
    "xor",
    "xori",
    "lhi",
    "lho",
    "lhi",
    "llo",
    "slt",
    "slti",
    "sltu",
    "sltiu",
    "beq",
    "bgtz",
    "blez",
    "bne",
    "j",
    "jal",
    "jalr",
    "jr",
    "lb",
    "lbu",
    "lh",
    "lhu",
    "lw",
    "li",
    "la",
    "sb",
    "sh",
    "sw",
    "mfhi",
    "mflo",
    "mthi",
    "mtlo",
    "move"
  ],
  symbols: /[\.,\:]+/,
  escapes: /\\(?:[abfnrtv\\"'$]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      [/\$[a-zA-Z_]\w*/, "variable.predefined"],
      [
        /[.a-zA-Z_]\w*/,
        {
          cases: {
            this: "variable.predefined",
            "@keywords": { token: "keyword.$0" },
            "@default": ""
          }
        }
      ],
      [/[ \t\r\n]+/, ""],
      [/#.*$/, "comment"],
      ["///", { token: "regexp", next: "@hereregexp" }],
      [/^(\s*)(@regEx)/, ["", "regexp"]],
      [/(\,)(\s*)(@regEx)/, ["delimiter", "", "regexp"]],
      [/(\:)(\s*)(@regEx)/, ["delimiter", "", "regexp"]],
      [/@symbols/, "delimiter"],
      [/\d+[eE]([\-+]?\d+)?/, "number.float"],
      [/\d+\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/0[0-7]+(?!\d)/, "number.octal"],
      [/\d+/, "number"],
      [/[,.]/, "delimiter"],
      [/"""/, "string", '@herestring."""'],
      [/'''/, "string", "@herestring.'''"],
      [
        /"/,
        {
          cases: {
            "@eos": "string",
            "@default": { token: "string", next: '@string."' }
          }
        }
      ],
      [
        /'/,
        {
          cases: {
            "@eos": "string",
            "@default": { token: "string", next: "@string.'" }
          }
        }
      ]
    ],
    string: [
      [/[^"'\#\\]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\./, "string.escape.invalid"],
      [/\./, "string.escape.invalid"],
      [
        /#{/,
        {
          cases: {
            '$S2=="': {
              token: "string",
              next: "root.interpolatedstring"
            },
            "@default": "string"
          }
        }
      ],
      [
        /["']/,
        {
          cases: {
            "$#==$S2": { token: "string", next: "@pop" },
            "@default": "string"
          }
        }
      ],
      [/#/, "string"]
    ],
    herestring: [
      [
        /("""|''')/,
        {
          cases: {
            "$1==$S2": { token: "string", next: "@pop" },
            "@default": "string"
          }
        }
      ],
      [/[^#\\'"]+/, "string"],
      [/['"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\./, "string.escape.invalid"],
      [/#{/, { token: "string.quote", next: "root.interpolatedstring" }],
      [/#/, "string"]
    ],
    comment: [
      [/[^#]+/, "comment"],
      [/#/, "comment"]
    ],
    hereregexp: [
      [/[^\\\/#]+/, "regexp"],
      [/\\./, "regexp"],
      [/#.*$/, "comment"],
      ["///[igm]*", { token: "regexp", next: "@pop" }],
      [/\//, "regexp"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlwcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9taXBzL21pcHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL21pcHMvbWlwcy50c1xudmFyIGNvbmYgPSB7XG4gIHdvcmRQYXR0ZXJuOiAvKC0/XFxkKlxcLlxcZFxcdyopfChbXlxcYFxcflxcIVxcQFxcIyVcXF5cXCZcXCpcXChcXClcXD1cXCRcXC1cXCtcXFtcXHtcXF1cXH1cXFxcXFx8XFw7XFw6XFwnXFxcIlxcLFxcLlxcPFxcPlxcL1xcP1xcc10rKS9nLFxuICBjb21tZW50czoge1xuICAgIGJsb2NrQ29tbWVudDogW1wiIyMjXCIsIFwiIyMjXCJdLFxuICAgIGxpbmVDb21tZW50OiBcIiNcIlxuICB9LFxuICBmb2xkaW5nOiB7XG4gICAgbWFya2Vyczoge1xuICAgICAgc3RhcnQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3JlZ2lvblxcXFxiXCIpLFxuICAgICAgZW5kOiBuZXcgUmVnRXhwKFwiXlxcXFxzKiNlbmRyZWdpb25cXFxcYlwiKVxuICAgIH1cbiAgfVxufTtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcIlwiLFxuICBpZ25vcmVDYXNlOiBmYWxzZSxcbiAgdG9rZW5Qb3N0Zml4OiBcIi5taXBzXCIsXG4gIHJlZ0V4OiAvXFwvKD8hXFwvXFwvKSg/OlteXFwvXFxcXF18XFxcXC4pKlxcL1tpZ21dKi8sXG4gIGtleXdvcmRzOiBbXG4gICAgXCIuZGF0YVwiLFxuICAgIFwiLnRleHRcIixcbiAgICBcInN5c2NhbGxcIixcbiAgICBcInRyYXBcIixcbiAgICBcImFkZFwiLFxuICAgIFwiYWRkdVwiLFxuICAgIFwiYWRkaVwiLFxuICAgIFwiYWRkaXVcIixcbiAgICBcImFuZFwiLFxuICAgIFwiYW5kaVwiLFxuICAgIFwiZGl2XCIsXG4gICAgXCJkaXZ1XCIsXG4gICAgXCJtdWx0XCIsXG4gICAgXCJtdWx0dVwiLFxuICAgIFwibm9yXCIsXG4gICAgXCJvclwiLFxuICAgIFwib3JpXCIsXG4gICAgXCJzbGxcIixcbiAgICBcInNsdlwiLFxuICAgIFwic3JhXCIsXG4gICAgXCJzcmF2XCIsXG4gICAgXCJzcmxcIixcbiAgICBcInNybHZcIixcbiAgICBcInN1YlwiLFxuICAgIFwic3VidVwiLFxuICAgIFwieG9yXCIsXG4gICAgXCJ4b3JpXCIsXG4gICAgXCJsaGlcIixcbiAgICBcImxob1wiLFxuICAgIFwibGhpXCIsXG4gICAgXCJsbG9cIixcbiAgICBcInNsdFwiLFxuICAgIFwic2x0aVwiLFxuICAgIFwic2x0dVwiLFxuICAgIFwic2x0aXVcIixcbiAgICBcImJlcVwiLFxuICAgIFwiYmd0elwiLFxuICAgIFwiYmxlelwiLFxuICAgIFwiYm5lXCIsXG4gICAgXCJqXCIsXG4gICAgXCJqYWxcIixcbiAgICBcImphbHJcIixcbiAgICBcImpyXCIsXG4gICAgXCJsYlwiLFxuICAgIFwibGJ1XCIsXG4gICAgXCJsaFwiLFxuICAgIFwibGh1XCIsXG4gICAgXCJsd1wiLFxuICAgIFwibGlcIixcbiAgICBcImxhXCIsXG4gICAgXCJzYlwiLFxuICAgIFwic2hcIixcbiAgICBcInN3XCIsXG4gICAgXCJtZmhpXCIsXG4gICAgXCJtZmxvXCIsXG4gICAgXCJtdGhpXCIsXG4gICAgXCJtdGxvXCIsXG4gICAgXCJtb3ZlXCJcbiAgXSxcbiAgc3ltYm9sczogL1tcXC4sXFw6XSsvLFxuICBlc2NhcGVzOiAvXFxcXCg/OlthYmZucnR2XFxcXFwiJyRdfHhbMC05QS1GYS1mXXsxLDR9fHVbMC05QS1GYS1mXXs0fXxVWzAtOUEtRmEtZl17OH0pLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy9cXCRbYS16QS1aX11cXHcqLywgXCJ2YXJpYWJsZS5wcmVkZWZpbmVkXCJdLFxuICAgICAgW1xuICAgICAgICAvWy5hLXpBLVpfXVxcdyovLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIHRoaXM6IFwidmFyaWFibGUucHJlZGVmaW5lZFwiLFxuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogeyB0b2tlbjogXCJrZXl3b3JkLiQwXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvWyBcXHRcXHJcXG5dKy8sIFwiXCJdLFxuICAgICAgWy8jLiokLywgXCJjb21tZW50XCJdLFxuICAgICAgW1wiLy8vXCIsIHsgdG9rZW46IFwicmVnZXhwXCIsIG5leHQ6IFwiQGhlcmVyZWdleHBcIiB9XSxcbiAgICAgIFsvXihcXHMqKShAcmVnRXgpLywgW1wiXCIsIFwicmVnZXhwXCJdXSxcbiAgICAgIFsvKFxcLCkoXFxzKikoQHJlZ0V4KS8sIFtcImRlbGltaXRlclwiLCBcIlwiLCBcInJlZ2V4cFwiXV0sXG4gICAgICBbLyhcXDopKFxccyopKEByZWdFeCkvLCBbXCJkZWxpbWl0ZXJcIiwgXCJcIiwgXCJyZWdleHBcIl1dLFxuICAgICAgWy9Ac3ltYm9scy8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cXGQrW2VFXShbXFwtK10/XFxkKyk/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbL1xcZCtcXC5cXGQrKFtlRV1bXFwtK10/XFxkKyk/LywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbLzBbeFhdWzAtOWEtZkEtRl0rLywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgWy8wWzAtN10rKD8hXFxkKS8sIFwibnVtYmVyLm9jdGFsXCJdLFxuICAgICAgWy9cXGQrLywgXCJudW1iZXJcIl0sXG4gICAgICBbL1ssLl0vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvXCJcIlwiLywgXCJzdHJpbmdcIiwgJ0BoZXJlc3RyaW5nLlwiXCJcIiddLFxuICAgICAgWy8nJycvLCBcInN0cmluZ1wiLCBcIkBoZXJlc3RyaW5nLicnJ1wiXSxcbiAgICAgIFtcbiAgICAgICAgL1wiLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogJ0BzdHJpbmcuXCInIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIC8nLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBlb3NcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAc3RyaW5nLidcIiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgXSxcbiAgICBzdHJpbmc6IFtcbiAgICAgIFsvW15cIidcXCNcXFxcXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgWy9cXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFtcbiAgICAgICAgLyN7LyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICAnJFMyPT1cIic6IHtcbiAgICAgICAgICAgICAgdG9rZW46IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgIG5leHQ6IFwicm9vdC5pbnRlcnBvbGF0ZWRzdHJpbmdcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJzdHJpbmdcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgL1tcIiddLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIiQjPT0kUzJcIjogeyB0b2tlbjogXCJzdHJpbmdcIiwgbmV4dDogXCJAcG9wXCIgfSxcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJzdHJpbmdcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFsvIy8sIFwic3RyaW5nXCJdXG4gICAgXSxcbiAgICBoZXJlc3RyaW5nOiBbXG4gICAgICBbXG4gICAgICAgIC8oXCJcIlwifCcnJykvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiJDE9PSRTMlwiOiB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bXiNcXFxcJ1wiXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvWydcIl0rLywgXCJzdHJpbmdcIl0sXG4gICAgICBbL0Blc2NhcGVzLywgXCJzdHJpbmcuZXNjYXBlXCJdLFxuICAgICAgWy9cXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvI3svLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBuZXh0OiBcInJvb3QuaW50ZXJwb2xhdGVkc3RyaW5nXCIgfV0sXG4gICAgICBbLyMvLCBcInN0cmluZ1wiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXiNdKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvIy8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgaGVyZXJlZ2V4cDogW1xuICAgICAgWy9bXlxcXFxcXC8jXSsvLCBcInJlZ2V4cFwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInJlZ2V4cFwiXSxcbiAgICAgIFsvIy4qJC8sIFwiY29tbWVudFwiXSxcbiAgICAgIFtcIi8vL1tpZ21dKlwiLCB7IHRva2VuOiBcInJlZ2V4cFwiLCBuZXh0OiBcIkBwb3BcIiB9XSxcbiAgICAgIFsvXFwvLywgXCJyZWdleHBcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULGFBQWE7QUFBQSxFQUNiLFVBQVU7QUFBQSxJQUNSLGNBQWMsQ0FBQyxPQUFPLEtBQUs7QUFBQSxJQUMzQixhQUFhO0FBQUEsRUFDZDtBQUFBLEVBQ0QsU0FBUztBQUFBLElBQ1AsU0FBUztBQUFBLE1BQ1AsT0FBTyxJQUFJLE9BQU8saUJBQWlCO0FBQUEsTUFDbkMsS0FBSyxJQUFJLE9BQU8sb0JBQW9CO0FBQUEsSUFDckM7QUFBQSxFQUNGO0FBQ0g7QUFDRyxJQUFDLFdBQVc7QUFBQSxFQUNiLGNBQWM7QUFBQSxFQUNkLFlBQVk7QUFBQSxFQUNaLGNBQWM7QUFBQSxFQUNkLE9BQU87QUFBQSxFQUNQLFVBQVU7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7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
