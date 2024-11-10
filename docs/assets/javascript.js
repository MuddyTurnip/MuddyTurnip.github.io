import { conf as conf$1, language as language$1 } from "./typescript.js";
import "./index.js";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.45.0(5e5af013f8d295555a7210df0d5f2cea0bf5dd56)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var conf = conf$1;
var language = {
  defaultToken: "invalid",
  tokenPostfix: ".js",
  keywords: [
    "break",
    "case",
    "catch",
    "class",
    "continue",
    "const",
    "constructor",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "get",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "null",
    "return",
    "set",
    "static",
    "super",
    "switch",
    "symbol",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "undefined",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "async",
    "await",
    "of"
  ],
  typeKeywords: [],
  operators: language$1.operators,
  symbols: language$1.symbols,
  escapes: language$1.escapes,
  digits: language$1.digits,
  octaldigits: language$1.octaldigits,
  binarydigits: language$1.binarydigits,
  hexdigits: language$1.hexdigits,
  regexpctl: language$1.regexpctl,
  regexpesc: language$1.regexpesc,
  tokenizer: language$1.tokenizer
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy9qYXZhc2NyaXB0L2phdmFzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL2phdmFzY3JpcHQvamF2YXNjcmlwdC50c1xuaW1wb3J0IHsgY29uZiBhcyB0c0NvbmYsIGxhbmd1YWdlIGFzIHRzTGFuZ3VhZ2UgfSBmcm9tIFwiLi4vdHlwZXNjcmlwdC90eXBlc2NyaXB0LmpzXCI7XG52YXIgY29uZiA9IHRzQ29uZjtcbnZhciBsYW5ndWFnZSA9IHtcbiAgZGVmYXVsdFRva2VuOiBcImludmFsaWRcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5qc1wiLFxuICBrZXl3b3JkczogW1xuICAgIFwiYnJlYWtcIixcbiAgICBcImNhc2VcIixcbiAgICBcImNhdGNoXCIsXG4gICAgXCJjbGFzc1wiLFxuICAgIFwiY29udGludWVcIixcbiAgICBcImNvbnN0XCIsXG4gICAgXCJjb25zdHJ1Y3RvclwiLFxuICAgIFwiZGVidWdnZXJcIixcbiAgICBcImRlZmF1bHRcIixcbiAgICBcImRlbGV0ZVwiLFxuICAgIFwiZG9cIixcbiAgICBcImVsc2VcIixcbiAgICBcImV4cG9ydFwiLFxuICAgIFwiZXh0ZW5kc1wiLFxuICAgIFwiZmFsc2VcIixcbiAgICBcImZpbmFsbHlcIixcbiAgICBcImZvclwiLFxuICAgIFwiZnJvbVwiLFxuICAgIFwiZnVuY3Rpb25cIixcbiAgICBcImdldFwiLFxuICAgIFwiaWZcIixcbiAgICBcImltcG9ydFwiLFxuICAgIFwiaW5cIixcbiAgICBcImluc3RhbmNlb2ZcIixcbiAgICBcImxldFwiLFxuICAgIFwibmV3XCIsXG4gICAgXCJudWxsXCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcInNldFwiLFxuICAgIFwic3RhdGljXCIsXG4gICAgXCJzdXBlclwiLFxuICAgIFwic3dpdGNoXCIsXG4gICAgXCJzeW1ib2xcIixcbiAgICBcInRoaXNcIixcbiAgICBcInRocm93XCIsXG4gICAgXCJ0cnVlXCIsXG4gICAgXCJ0cnlcIixcbiAgICBcInR5cGVvZlwiLFxuICAgIFwidW5kZWZpbmVkXCIsXG4gICAgXCJ2YXJcIixcbiAgICBcInZvaWRcIixcbiAgICBcIndoaWxlXCIsXG4gICAgXCJ3aXRoXCIsXG4gICAgXCJ5aWVsZFwiLFxuICAgIFwiYXN5bmNcIixcbiAgICBcImF3YWl0XCIsXG4gICAgXCJvZlwiXG4gIF0sXG4gIHR5cGVLZXl3b3JkczogW10sXG4gIG9wZXJhdG9yczogdHNMYW5ndWFnZS5vcGVyYXRvcnMsXG4gIHN5bWJvbHM6IHRzTGFuZ3VhZ2Uuc3ltYm9scyxcbiAgZXNjYXBlczogdHNMYW5ndWFnZS5lc2NhcGVzLFxuICBkaWdpdHM6IHRzTGFuZ3VhZ2UuZGlnaXRzLFxuICBvY3RhbGRpZ2l0czogdHNMYW5ndWFnZS5vY3RhbGRpZ2l0cyxcbiAgYmluYXJ5ZGlnaXRzOiB0c0xhbmd1YWdlLmJpbmFyeWRpZ2l0cyxcbiAgaGV4ZGlnaXRzOiB0c0xhbmd1YWdlLmhleGRpZ2l0cyxcbiAgcmVnZXhwY3RsOiB0c0xhbmd1YWdlLnJlZ2V4cGN0bCxcbiAgcmVnZXhwZXNjOiB0c0xhbmd1YWdlLnJlZ2V4cGVzYyxcbiAgdG9rZW5pemVyOiB0c0xhbmd1YWdlLnRva2VuaXplclxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59O1xuIl0sIm5hbWVzIjpbInRzQ29uZiIsInRzTGFuZ3VhZ2UiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU0csSUFBQyxPQUFPQTtBQUNSLElBQUMsV0FBVztBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsVUFBVTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUFBLEVBQ0QsY0FBYyxDQUFFO0FBQUEsRUFDaEIsV0FBV0MsV0FBVztBQUFBLEVBQ3RCLFNBQVNBLFdBQVc7QUFBQSxFQUNwQixTQUFTQSxXQUFXO0FBQUEsRUFDcEIsUUFBUUEsV0FBVztBQUFBLEVBQ25CLGFBQWFBLFdBQVc7QUFBQSxFQUN4QixjQUFjQSxXQUFXO0FBQUEsRUFDekIsV0FBV0EsV0FBVztBQUFBLEVBQ3RCLFdBQVdBLFdBQVc7QUFBQSxFQUN0QixXQUFXQSxXQUFXO0FBQUEsRUFDdEIsV0FBV0EsV0FBVztBQUN4QjsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMF19
