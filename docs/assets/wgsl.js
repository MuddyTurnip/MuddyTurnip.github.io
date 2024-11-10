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
    { open: "(", close: ")" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" }
  ]
};
function qw(str) {
  let result = [];
  const words = str.split(/\t+|\r+|\n+| +/);
  for (let i = 0; i < words.length; ++i) {
    if (words[i].length > 0) {
      result.push(words[i]);
    }
  }
  return result;
}
var atoms = qw("true false");
var keywords = qw(`
			  alias
			  break
			  case
			  const
			  const_assert
			  continue
			  continuing
			  default
			  diagnostic
			  discard
			  else
			  enable
			  fn
			  for
			  if
			  let
			  loop
			  override
			  requires
			  return
			  struct
			  switch
			  var
			  while
			  `);
var reserved = qw(`
			  NULL
			  Self
			  abstract
			  active
			  alignas
			  alignof
			  as
			  asm
			  asm_fragment
			  async
			  attribute
			  auto
			  await
			  become
			  binding_array
			  cast
			  catch
			  class
			  co_await
			  co_return
			  co_yield
			  coherent
			  column_major
			  common
			  compile
			  compile_fragment
			  concept
			  const_cast
			  consteval
			  constexpr
			  constinit
			  crate
			  debugger
			  decltype
			  delete
			  demote
			  demote_to_helper
			  do
			  dynamic_cast
			  enum
			  explicit
			  export
			  extends
			  extern
			  external
			  fallthrough
			  filter
			  final
			  finally
			  friend
			  from
			  fxgroup
			  get
			  goto
			  groupshared
			  highp
			  impl
			  implements
			  import
			  inline
			  instanceof
			  interface
			  layout
			  lowp
			  macro
			  macro_rules
			  match
			  mediump
			  meta
			  mod
			  module
			  move
			  mut
			  mutable
			  namespace
			  new
			  nil
			  noexcept
			  noinline
			  nointerpolation
			  noperspective
			  null
			  nullptr
			  of
			  operator
			  package
			  packoffset
			  partition
			  pass
			  patch
			  pixelfragment
			  precise
			  precision
			  premerge
			  priv
			  protected
			  pub
			  public
			  readonly
			  ref
			  regardless
			  register
			  reinterpret_cast
			  require
			  resource
			  restrict
			  self
			  set
			  shared
			  sizeof
			  smooth
			  snorm
			  static
			  static_assert
			  static_cast
			  std
			  subroutine
			  super
			  target
			  template
			  this
			  thread_local
			  throw
			  trait
			  try
			  type
			  typedef
			  typeid
			  typename
			  typeof
			  union
			  unless
			  unorm
			  unsafe
			  unsized
			  use
			  using
			  varying
			  virtual
			  volatile
			  wgsl
			  where
			  with
			  writeonly
			  yield
			  `);
var predeclared_enums = qw(`
		read write read_write
		function private workgroup uniform storage
		perspective linear flat
		center centroid sample
		vertex_index instance_index position front_facing frag_depth
			local_invocation_id local_invocation_index
			global_invocation_id workgroup_id num_workgroups
			sample_index sample_mask
		rgba8unorm
		rgba8snorm
		rgba8uint
		rgba8sint
		rgba16uint
		rgba16sint
		rgba16float
		r32uint
		r32sint
		r32float
		rg32uint
		rg32sint
		rg32float
		rgba32uint
		rgba32sint
		rgba32float
		bgra8unorm
`);
var predeclared_types = qw(`
		bool
		f16
		f32
		i32
		sampler sampler_comparison
		texture_depth_2d
		texture_depth_2d_array
		texture_depth_cube
		texture_depth_cube_array
		texture_depth_multisampled_2d
		texture_external
		texture_external
		u32
		`);
var predeclared_type_generators = qw(`
		array
		atomic
		mat2x2
		mat2x3
		mat2x4
		mat3x2
		mat3x3
		mat3x4
		mat4x2
		mat4x3
		mat4x4
		ptr
		texture_1d
		texture_2d
		texture_2d_array
		texture_3d
		texture_cube
		texture_cube_array
		texture_multisampled_2d
		texture_storage_1d
		texture_storage_2d
		texture_storage_2d_array
		texture_storage_3d
		vec2
		vec3
		vec4
		`);
var predeclared_type_aliases = qw(`
		vec2i vec3i vec4i
		vec2u vec3u vec4u
		vec2f vec3f vec4f
		vec2h vec3h vec4h
		mat2x2f mat2x3f mat2x4f
		mat3x2f mat3x3f mat3x4f
		mat4x2f mat4x3f mat4x4f
		mat2x2h mat2x3h mat2x4h
		mat3x2h mat3x3h mat3x4h
		mat4x2h mat4x3h mat4x4h
		`);
var predeclared_intrinsics = qw(`
  bitcast all any select arrayLength abs acos acosh asin asinh atan atanh atan2
  ceil clamp cos cosh countLeadingZeros countOneBits countTrailingZeros cross
  degrees determinant distance dot exp exp2 extractBits faceForward firstLeadingBit
  firstTrailingBit floor fma fract frexp inverseBits inverseSqrt ldexp length
  log log2 max min mix modf normalize pow quantizeToF16 radians reflect refract
  reverseBits round saturate sign sin sinh smoothstep sqrt step tan tanh transpose
  trunc dpdx dpdxCoarse dpdxFine dpdy dpdyCoarse dpdyFine fwidth fwidthCoarse fwidthFine
  textureDimensions textureGather textureGatherCompare textureLoad textureNumLayers
  textureNumLevels textureNumSamples textureSample textureSampleBias textureSampleCompare
  textureSampleCompareLevel textureSampleGrad textureSampleLevel textureSampleBaseClampToEdge
  textureStore atomicLoad atomicStore atomicAdd atomicSub atomicMax atomicMin
  atomicAnd atomicOr atomicXor atomicExchange atomicCompareExchangeWeak pack4x8snorm
  pack4x8unorm pack2x16snorm pack2x16unorm pack2x16float unpack4x8snorm unpack4x8unorm
  unpack2x16snorm unpack2x16unorm unpack2x16float storageBarrier workgroupBarrier
  workgroupUniformLoad
`);
var operators = qw(`
					 &
					 &&
					 ->
					 /
					 =
					 ==
					 !=
					 >
					 >=
					 <
					 <=
					 %
					 -
					 --
					 +
					 ++
					 |
					 ||
					 *
					 <<
					 >>
					 +=
					 -=
					 *=
					 /=
					 %=
					 &=
					 |=
					 ^=
					 >>=
					 <<=
					 `);
var directive_re = /enable|requires|diagnostic/;
var ident_re = new RegExp("[_\\p{XID_Start}]\\p{XID_Continue}*", "u");
var predefined_token = "variable.predefined";
var language = {
  tokenPostfix: ".wgsl",
  defaultToken: "invalid",
  unicode: true,
  atoms,
  keywords,
  reserved,
  predeclared_enums,
  predeclared_types,
  predeclared_type_generators,
  predeclared_type_aliases,
  predeclared_intrinsics,
  operators,
  symbols: /[!%&*+\-\.\/:;<=>^|_~,]+/,
  tokenizer: {
    root: [
      [directive_re, "keyword", "@directive"],
      [
        ident_re,
        {
          cases: {
            "@atoms": predefined_token,
            "@keywords": "keyword",
            "@reserved": "invalid",
            "@predeclared_enums": predefined_token,
            "@predeclared_types": predefined_token,
            "@predeclared_type_generators": predefined_token,
            "@predeclared_type_aliases": predefined_token,
            "@predeclared_intrinsics": predefined_token,
            "@default": "identifier"
          }
        }
      ],
      { include: "@commentOrSpace" },
      { include: "@numbers" },
      [/[{}()\[\]]/, "@brackets"],
      ["@", "annotation", "@attribute"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": "delimiter"
          }
        }
      ],
      [/./, "invalid"]
    ],
    commentOrSpace: [
      [/\s+/, "white"],
      [/\/\*/, "comment", "@blockComment"],
      [/\/\/.*$/, "comment"]
    ],
    blockComment: [
      [/[^\/*]+/, "comment"],
      [/\/\*/, "comment", "@push"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    attribute: [
      { include: "@commentOrSpace" },
      [/\w+/, "annotation", "@pop"]
    ],
    directive: [
      { include: "@commentOrSpace" },
      [/[()]/, "@brackets"],
      [/,/, "delimiter"],
      [ident_re, "meta.content"],
      [/;/, "delimiter", "@pop"]
    ],
    numbers: [
      [/0[fh]/, "number.float"],
      [/[1-9][0-9]*[fh]/, "number.float"],
      [/[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/, "number.float"],
      [/[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/, "number.float"],
      [/[0-9]+[eE][+-]?[0-9]+[fh]?/, "number.float"],
      [/0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+(?:[pP][+-]?[0-9]+[fh]?)?/, "number.hex"],
      [/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*(?:[pP][+-]?[0-9]+[fh]?)?/, "number.hex"],
      [/0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/, "number.hex"],
      [/0[xX][0-9a-fA-F]+[iu]?/, "number.hex"],
      [/[1-9][0-9]*[iu]?/, "number"],
      [/0[iu]?/, "number"]
    ]
  }
};
export {
  conf,
  language
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2dzbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL21vbmFjby1lZGl0b3IvZXNtL3ZzL2Jhc2ljLWxhbmd1YWdlcy93Z3NsL3dnc2wuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVmVyc2lvbjogMC40NS4wKDVlNWFmMDEzZjhkMjk1NTU1YTcyMTBkZjBkNWYyY2VhMGJmNWRkNTYpXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvbW9uYWNvLWVkaXRvci9ibG9iL21haW4vTElDRU5TRS50eHRcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vLyBzcmMvYmFzaWMtbGFuZ3VhZ2VzL3dnc2wvd2dzbC50c1xudmFyIGNvbmYgPSB7XG4gIGNvbW1lbnRzOiB7XG4gICAgbGluZUNvbW1lbnQ6IFwiLy9cIixcbiAgICBibG9ja0NvbW1lbnQ6IFtcIi8qXCIsIFwiKi9cIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXVxuICBdLFxuICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9XG4gIF1cbn07XG5mdW5jdGlvbiBxdyhzdHIpIHtcbiAgbGV0IHJlc3VsdCA9IFtdO1xuICBjb25zdCB3b3JkcyA9IHN0ci5zcGxpdCgvXFx0K3xcXHIrfFxcbit8ICsvKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7ICsraSkge1xuICAgIGlmICh3b3Jkc1tpXS5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQucHVzaCh3b3Jkc1tpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG52YXIgYXRvbXMgPSBxdyhcInRydWUgZmFsc2VcIik7XG52YXIga2V5d29yZHMgPSBxdyhgXG5cdFx0XHQgIGFsaWFzXG5cdFx0XHQgIGJyZWFrXG5cdFx0XHQgIGNhc2Vcblx0XHRcdCAgY29uc3Rcblx0XHRcdCAgY29uc3RfYXNzZXJ0XG5cdFx0XHQgIGNvbnRpbnVlXG5cdFx0XHQgIGNvbnRpbnVpbmdcblx0XHRcdCAgZGVmYXVsdFxuXHRcdFx0ICBkaWFnbm9zdGljXG5cdFx0XHQgIGRpc2NhcmRcblx0XHRcdCAgZWxzZVxuXHRcdFx0ICBlbmFibGVcblx0XHRcdCAgZm5cblx0XHRcdCAgZm9yXG5cdFx0XHQgIGlmXG5cdFx0XHQgIGxldFxuXHRcdFx0ICBsb29wXG5cdFx0XHQgIG92ZXJyaWRlXG5cdFx0XHQgIHJlcXVpcmVzXG5cdFx0XHQgIHJldHVyblxuXHRcdFx0ICBzdHJ1Y3Rcblx0XHRcdCAgc3dpdGNoXG5cdFx0XHQgIHZhclxuXHRcdFx0ICB3aGlsZVxuXHRcdFx0ICBgKTtcbnZhciByZXNlcnZlZCA9IHF3KGBcblx0XHRcdCAgTlVMTFxuXHRcdFx0ICBTZWxmXG5cdFx0XHQgIGFic3RyYWN0XG5cdFx0XHQgIGFjdGl2ZVxuXHRcdFx0ICBhbGlnbmFzXG5cdFx0XHQgIGFsaWdub2Zcblx0XHRcdCAgYXNcblx0XHRcdCAgYXNtXG5cdFx0XHQgIGFzbV9mcmFnbWVudFxuXHRcdFx0ICBhc3luY1xuXHRcdFx0ICBhdHRyaWJ1dGVcblx0XHRcdCAgYXV0b1xuXHRcdFx0ICBhd2FpdFxuXHRcdFx0ICBiZWNvbWVcblx0XHRcdCAgYmluZGluZ19hcnJheVxuXHRcdFx0ICBjYXN0XG5cdFx0XHQgIGNhdGNoXG5cdFx0XHQgIGNsYXNzXG5cdFx0XHQgIGNvX2F3YWl0XG5cdFx0XHQgIGNvX3JldHVyblxuXHRcdFx0ICBjb195aWVsZFxuXHRcdFx0ICBjb2hlcmVudFxuXHRcdFx0ICBjb2x1bW5fbWFqb3Jcblx0XHRcdCAgY29tbW9uXG5cdFx0XHQgIGNvbXBpbGVcblx0XHRcdCAgY29tcGlsZV9mcmFnbWVudFxuXHRcdFx0ICBjb25jZXB0XG5cdFx0XHQgIGNvbnN0X2Nhc3Rcblx0XHRcdCAgY29uc3RldmFsXG5cdFx0XHQgIGNvbnN0ZXhwclxuXHRcdFx0ICBjb25zdGluaXRcblx0XHRcdCAgY3JhdGVcblx0XHRcdCAgZGVidWdnZXJcblx0XHRcdCAgZGVjbHR5cGVcblx0XHRcdCAgZGVsZXRlXG5cdFx0XHQgIGRlbW90ZVxuXHRcdFx0ICBkZW1vdGVfdG9faGVscGVyXG5cdFx0XHQgIGRvXG5cdFx0XHQgIGR5bmFtaWNfY2FzdFxuXHRcdFx0ICBlbnVtXG5cdFx0XHQgIGV4cGxpY2l0XG5cdFx0XHQgIGV4cG9ydFxuXHRcdFx0ICBleHRlbmRzXG5cdFx0XHQgIGV4dGVyblxuXHRcdFx0ICBleHRlcm5hbFxuXHRcdFx0ICBmYWxsdGhyb3VnaFxuXHRcdFx0ICBmaWx0ZXJcblx0XHRcdCAgZmluYWxcblx0XHRcdCAgZmluYWxseVxuXHRcdFx0ICBmcmllbmRcblx0XHRcdCAgZnJvbVxuXHRcdFx0ICBmeGdyb3VwXG5cdFx0XHQgIGdldFxuXHRcdFx0ICBnb3RvXG5cdFx0XHQgIGdyb3Vwc2hhcmVkXG5cdFx0XHQgIGhpZ2hwXG5cdFx0XHQgIGltcGxcblx0XHRcdCAgaW1wbGVtZW50c1xuXHRcdFx0ICBpbXBvcnRcblx0XHRcdCAgaW5saW5lXG5cdFx0XHQgIGluc3RhbmNlb2Zcblx0XHRcdCAgaW50ZXJmYWNlXG5cdFx0XHQgIGxheW91dFxuXHRcdFx0ICBsb3dwXG5cdFx0XHQgIG1hY3JvXG5cdFx0XHQgIG1hY3JvX3J1bGVzXG5cdFx0XHQgIG1hdGNoXG5cdFx0XHQgIG1lZGl1bXBcblx0XHRcdCAgbWV0YVxuXHRcdFx0ICBtb2Rcblx0XHRcdCAgbW9kdWxlXG5cdFx0XHQgIG1vdmVcblx0XHRcdCAgbXV0XG5cdFx0XHQgIG11dGFibGVcblx0XHRcdCAgbmFtZXNwYWNlXG5cdFx0XHQgIG5ld1xuXHRcdFx0ICBuaWxcblx0XHRcdCAgbm9leGNlcHRcblx0XHRcdCAgbm9pbmxpbmVcblx0XHRcdCAgbm9pbnRlcnBvbGF0aW9uXG5cdFx0XHQgIG5vcGVyc3BlY3RpdmVcblx0XHRcdCAgbnVsbFxuXHRcdFx0ICBudWxscHRyXG5cdFx0XHQgIG9mXG5cdFx0XHQgIG9wZXJhdG9yXG5cdFx0XHQgIHBhY2thZ2Vcblx0XHRcdCAgcGFja29mZnNldFxuXHRcdFx0ICBwYXJ0aXRpb25cblx0XHRcdCAgcGFzc1xuXHRcdFx0ICBwYXRjaFxuXHRcdFx0ICBwaXhlbGZyYWdtZW50XG5cdFx0XHQgIHByZWNpc2Vcblx0XHRcdCAgcHJlY2lzaW9uXG5cdFx0XHQgIHByZW1lcmdlXG5cdFx0XHQgIHByaXZcblx0XHRcdCAgcHJvdGVjdGVkXG5cdFx0XHQgIHB1YlxuXHRcdFx0ICBwdWJsaWNcblx0XHRcdCAgcmVhZG9ubHlcblx0XHRcdCAgcmVmXG5cdFx0XHQgIHJlZ2FyZGxlc3Ncblx0XHRcdCAgcmVnaXN0ZXJcblx0XHRcdCAgcmVpbnRlcnByZXRfY2FzdFxuXHRcdFx0ICByZXF1aXJlXG5cdFx0XHQgIHJlc291cmNlXG5cdFx0XHQgIHJlc3RyaWN0XG5cdFx0XHQgIHNlbGZcblx0XHRcdCAgc2V0XG5cdFx0XHQgIHNoYXJlZFxuXHRcdFx0ICBzaXplb2Zcblx0XHRcdCAgc21vb3RoXG5cdFx0XHQgIHNub3JtXG5cdFx0XHQgIHN0YXRpY1xuXHRcdFx0ICBzdGF0aWNfYXNzZXJ0XG5cdFx0XHQgIHN0YXRpY19jYXN0XG5cdFx0XHQgIHN0ZFxuXHRcdFx0ICBzdWJyb3V0aW5lXG5cdFx0XHQgIHN1cGVyXG5cdFx0XHQgIHRhcmdldFxuXHRcdFx0ICB0ZW1wbGF0ZVxuXHRcdFx0ICB0aGlzXG5cdFx0XHQgIHRocmVhZF9sb2NhbFxuXHRcdFx0ICB0aHJvd1xuXHRcdFx0ICB0cmFpdFxuXHRcdFx0ICB0cnlcblx0XHRcdCAgdHlwZVxuXHRcdFx0ICB0eXBlZGVmXG5cdFx0XHQgIHR5cGVpZFxuXHRcdFx0ICB0eXBlbmFtZVxuXHRcdFx0ICB0eXBlb2Zcblx0XHRcdCAgdW5pb25cblx0XHRcdCAgdW5sZXNzXG5cdFx0XHQgIHVub3JtXG5cdFx0XHQgIHVuc2FmZVxuXHRcdFx0ICB1bnNpemVkXG5cdFx0XHQgIHVzZVxuXHRcdFx0ICB1c2luZ1xuXHRcdFx0ICB2YXJ5aW5nXG5cdFx0XHQgIHZpcnR1YWxcblx0XHRcdCAgdm9sYXRpbGVcblx0XHRcdCAgd2dzbFxuXHRcdFx0ICB3aGVyZVxuXHRcdFx0ICB3aXRoXG5cdFx0XHQgIHdyaXRlb25seVxuXHRcdFx0ICB5aWVsZFxuXHRcdFx0ICBgKTtcbnZhciBwcmVkZWNsYXJlZF9lbnVtcyA9IHF3KGBcblx0XHRyZWFkIHdyaXRlIHJlYWRfd3JpdGVcblx0XHRmdW5jdGlvbiBwcml2YXRlIHdvcmtncm91cCB1bmlmb3JtIHN0b3JhZ2Vcblx0XHRwZXJzcGVjdGl2ZSBsaW5lYXIgZmxhdFxuXHRcdGNlbnRlciBjZW50cm9pZCBzYW1wbGVcblx0XHR2ZXJ0ZXhfaW5kZXggaW5zdGFuY2VfaW5kZXggcG9zaXRpb24gZnJvbnRfZmFjaW5nIGZyYWdfZGVwdGhcblx0XHRcdGxvY2FsX2ludm9jYXRpb25faWQgbG9jYWxfaW52b2NhdGlvbl9pbmRleFxuXHRcdFx0Z2xvYmFsX2ludm9jYXRpb25faWQgd29ya2dyb3VwX2lkIG51bV93b3JrZ3JvdXBzXG5cdFx0XHRzYW1wbGVfaW5kZXggc2FtcGxlX21hc2tcblx0XHRyZ2JhOHVub3JtXG5cdFx0cmdiYThzbm9ybVxuXHRcdHJnYmE4dWludFxuXHRcdHJnYmE4c2ludFxuXHRcdHJnYmExNnVpbnRcblx0XHRyZ2JhMTZzaW50XG5cdFx0cmdiYTE2ZmxvYXRcblx0XHRyMzJ1aW50XG5cdFx0cjMyc2ludFxuXHRcdHIzMmZsb2F0XG5cdFx0cmczMnVpbnRcblx0XHRyZzMyc2ludFxuXHRcdHJnMzJmbG9hdFxuXHRcdHJnYmEzMnVpbnRcblx0XHRyZ2JhMzJzaW50XG5cdFx0cmdiYTMyZmxvYXRcblx0XHRiZ3JhOHVub3JtXG5gKTtcbnZhciBwcmVkZWNsYXJlZF90eXBlcyA9IHF3KGBcblx0XHRib29sXG5cdFx0ZjE2XG5cdFx0ZjMyXG5cdFx0aTMyXG5cdFx0c2FtcGxlciBzYW1wbGVyX2NvbXBhcmlzb25cblx0XHR0ZXh0dXJlX2RlcHRoXzJkXG5cdFx0dGV4dHVyZV9kZXB0aF8yZF9hcnJheVxuXHRcdHRleHR1cmVfZGVwdGhfY3ViZVxuXHRcdHRleHR1cmVfZGVwdGhfY3ViZV9hcnJheVxuXHRcdHRleHR1cmVfZGVwdGhfbXVsdGlzYW1wbGVkXzJkXG5cdFx0dGV4dHVyZV9leHRlcm5hbFxuXHRcdHRleHR1cmVfZXh0ZXJuYWxcblx0XHR1MzJcblx0XHRgKTtcbnZhciBwcmVkZWNsYXJlZF90eXBlX2dlbmVyYXRvcnMgPSBxdyhgXG5cdFx0YXJyYXlcblx0XHRhdG9taWNcblx0XHRtYXQyeDJcblx0XHRtYXQyeDNcblx0XHRtYXQyeDRcblx0XHRtYXQzeDJcblx0XHRtYXQzeDNcblx0XHRtYXQzeDRcblx0XHRtYXQ0eDJcblx0XHRtYXQ0eDNcblx0XHRtYXQ0eDRcblx0XHRwdHJcblx0XHR0ZXh0dXJlXzFkXG5cdFx0dGV4dHVyZV8yZFxuXHRcdHRleHR1cmVfMmRfYXJyYXlcblx0XHR0ZXh0dXJlXzNkXG5cdFx0dGV4dHVyZV9jdWJlXG5cdFx0dGV4dHVyZV9jdWJlX2FycmF5XG5cdFx0dGV4dHVyZV9tdWx0aXNhbXBsZWRfMmRcblx0XHR0ZXh0dXJlX3N0b3JhZ2VfMWRcblx0XHR0ZXh0dXJlX3N0b3JhZ2VfMmRcblx0XHR0ZXh0dXJlX3N0b3JhZ2VfMmRfYXJyYXlcblx0XHR0ZXh0dXJlX3N0b3JhZ2VfM2Rcblx0XHR2ZWMyXG5cdFx0dmVjM1xuXHRcdHZlYzRcblx0XHRgKTtcbnZhciBwcmVkZWNsYXJlZF90eXBlX2FsaWFzZXMgPSBxdyhgXG5cdFx0dmVjMmkgdmVjM2kgdmVjNGlcblx0XHR2ZWMydSB2ZWMzdSB2ZWM0dVxuXHRcdHZlYzJmIHZlYzNmIHZlYzRmXG5cdFx0dmVjMmggdmVjM2ggdmVjNGhcblx0XHRtYXQyeDJmIG1hdDJ4M2YgbWF0Mng0ZlxuXHRcdG1hdDN4MmYgbWF0M3gzZiBtYXQzeDRmXG5cdFx0bWF0NHgyZiBtYXQ0eDNmIG1hdDR4NGZcblx0XHRtYXQyeDJoIG1hdDJ4M2ggbWF0Mng0aFxuXHRcdG1hdDN4MmggbWF0M3gzaCBtYXQzeDRoXG5cdFx0bWF0NHgyaCBtYXQ0eDNoIG1hdDR4NGhcblx0XHRgKTtcbnZhciBwcmVkZWNsYXJlZF9pbnRyaW5zaWNzID0gcXcoYFxuICBiaXRjYXN0IGFsbCBhbnkgc2VsZWN0IGFycmF5TGVuZ3RoIGFicyBhY29zIGFjb3NoIGFzaW4gYXNpbmggYXRhbiBhdGFuaCBhdGFuMlxuICBjZWlsIGNsYW1wIGNvcyBjb3NoIGNvdW50TGVhZGluZ1plcm9zIGNvdW50T25lQml0cyBjb3VudFRyYWlsaW5nWmVyb3MgY3Jvc3NcbiAgZGVncmVlcyBkZXRlcm1pbmFudCBkaXN0YW5jZSBkb3QgZXhwIGV4cDIgZXh0cmFjdEJpdHMgZmFjZUZvcndhcmQgZmlyc3RMZWFkaW5nQml0XG4gIGZpcnN0VHJhaWxpbmdCaXQgZmxvb3IgZm1hIGZyYWN0IGZyZXhwIGludmVyc2VCaXRzIGludmVyc2VTcXJ0IGxkZXhwIGxlbmd0aFxuICBsb2cgbG9nMiBtYXggbWluIG1peCBtb2RmIG5vcm1hbGl6ZSBwb3cgcXVhbnRpemVUb0YxNiByYWRpYW5zIHJlZmxlY3QgcmVmcmFjdFxuICByZXZlcnNlQml0cyByb3VuZCBzYXR1cmF0ZSBzaWduIHNpbiBzaW5oIHNtb290aHN0ZXAgc3FydCBzdGVwIHRhbiB0YW5oIHRyYW5zcG9zZVxuICB0cnVuYyBkcGR4IGRwZHhDb2Fyc2UgZHBkeEZpbmUgZHBkeSBkcGR5Q29hcnNlIGRwZHlGaW5lIGZ3aWR0aCBmd2lkdGhDb2Fyc2UgZndpZHRoRmluZVxuICB0ZXh0dXJlRGltZW5zaW9ucyB0ZXh0dXJlR2F0aGVyIHRleHR1cmVHYXRoZXJDb21wYXJlIHRleHR1cmVMb2FkIHRleHR1cmVOdW1MYXllcnNcbiAgdGV4dHVyZU51bUxldmVscyB0ZXh0dXJlTnVtU2FtcGxlcyB0ZXh0dXJlU2FtcGxlIHRleHR1cmVTYW1wbGVCaWFzIHRleHR1cmVTYW1wbGVDb21wYXJlXG4gIHRleHR1cmVTYW1wbGVDb21wYXJlTGV2ZWwgdGV4dHVyZVNhbXBsZUdyYWQgdGV4dHVyZVNhbXBsZUxldmVsIHRleHR1cmVTYW1wbGVCYXNlQ2xhbXBUb0VkZ2VcbiAgdGV4dHVyZVN0b3JlIGF0b21pY0xvYWQgYXRvbWljU3RvcmUgYXRvbWljQWRkIGF0b21pY1N1YiBhdG9taWNNYXggYXRvbWljTWluXG4gIGF0b21pY0FuZCBhdG9taWNPciBhdG9taWNYb3IgYXRvbWljRXhjaGFuZ2UgYXRvbWljQ29tcGFyZUV4Y2hhbmdlV2VhayBwYWNrNHg4c25vcm1cbiAgcGFjazR4OHVub3JtIHBhY2syeDE2c25vcm0gcGFjazJ4MTZ1bm9ybSBwYWNrMngxNmZsb2F0IHVucGFjazR4OHNub3JtIHVucGFjazR4OHVub3JtXG4gIHVucGFjazJ4MTZzbm9ybSB1bnBhY2syeDE2dW5vcm0gdW5wYWNrMngxNmZsb2F0IHN0b3JhZ2VCYXJyaWVyIHdvcmtncm91cEJhcnJpZXJcbiAgd29ya2dyb3VwVW5pZm9ybUxvYWRcbmApO1xudmFyIG9wZXJhdG9ycyA9IHF3KGBcblx0XHRcdFx0XHQgJlxuXHRcdFx0XHRcdCAmJlxuXHRcdFx0XHRcdCAtPlxuXHRcdFx0XHRcdCAvXG5cdFx0XHRcdFx0ID1cblx0XHRcdFx0XHQgPT1cblx0XHRcdFx0XHQgIT1cblx0XHRcdFx0XHQgPlxuXHRcdFx0XHRcdCA+PVxuXHRcdFx0XHRcdCA8XG5cdFx0XHRcdFx0IDw9XG5cdFx0XHRcdFx0ICVcblx0XHRcdFx0XHQgLVxuXHRcdFx0XHRcdCAtLVxuXHRcdFx0XHRcdCArXG5cdFx0XHRcdFx0ICsrXG5cdFx0XHRcdFx0IHxcblx0XHRcdFx0XHQgfHxcblx0XHRcdFx0XHQgKlxuXHRcdFx0XHRcdCA8PFxuXHRcdFx0XHRcdCA+PlxuXHRcdFx0XHRcdCArPVxuXHRcdFx0XHRcdCAtPVxuXHRcdFx0XHRcdCAqPVxuXHRcdFx0XHRcdCAvPVxuXHRcdFx0XHRcdCAlPVxuXHRcdFx0XHRcdCAmPVxuXHRcdFx0XHRcdCB8PVxuXHRcdFx0XHRcdCBePVxuXHRcdFx0XHRcdCA+Pj1cblx0XHRcdFx0XHQgPDw9XG5cdFx0XHRcdFx0IGApO1xudmFyIGRpcmVjdGl2ZV9yZSA9IC9lbmFibGV8cmVxdWlyZXN8ZGlhZ25vc3RpYy87XG52YXIgaWRlbnRfcmUgPSAvW19cXHB7WElEX1N0YXJ0fV1cXHB7WElEX0NvbnRpbnVlfSovdTtcbnZhciBwcmVkZWZpbmVkX3Rva2VuID0gXCJ2YXJpYWJsZS5wcmVkZWZpbmVkXCI7XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIHRva2VuUG9zdGZpeDogXCIud2dzbFwiLFxuICBkZWZhdWx0VG9rZW46IFwiaW52YWxpZFwiLFxuICB1bmljb2RlOiB0cnVlLFxuICBhdG9tcyxcbiAga2V5d29yZHMsXG4gIHJlc2VydmVkLFxuICBwcmVkZWNsYXJlZF9lbnVtcyxcbiAgcHJlZGVjbGFyZWRfdHlwZXMsXG4gIHByZWRlY2xhcmVkX3R5cGVfZ2VuZXJhdG9ycyxcbiAgcHJlZGVjbGFyZWRfdHlwZV9hbGlhc2VzLFxuICBwcmVkZWNsYXJlZF9pbnRyaW5zaWNzLFxuICBvcGVyYXRvcnMsXG4gIHN5bWJvbHM6IC9bISUmKitcXC1cXC5cXC86Ozw9Pl58X34sXSsvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbZGlyZWN0aXZlX3JlLCBcImtleXdvcmRcIiwgXCJAZGlyZWN0aXZlXCJdLFxuICAgICAgW1xuICAgICAgICBpZGVudF9yZSxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBhdG9tc1wiOiBwcmVkZWZpbmVkX3Rva2VuLFxuICAgICAgICAgICAgXCJAa2V5d29yZHNcIjogXCJrZXl3b3JkXCIsXG4gICAgICAgICAgICBcIkByZXNlcnZlZFwiOiBcImludmFsaWRcIixcbiAgICAgICAgICAgIFwiQHByZWRlY2xhcmVkX2VudW1zXCI6IHByZWRlZmluZWRfdG9rZW4sXG4gICAgICAgICAgICBcIkBwcmVkZWNsYXJlZF90eXBlc1wiOiBwcmVkZWZpbmVkX3Rva2VuLFxuICAgICAgICAgICAgXCJAcHJlZGVjbGFyZWRfdHlwZV9nZW5lcmF0b3JzXCI6IHByZWRlZmluZWRfdG9rZW4sXG4gICAgICAgICAgICBcIkBwcmVkZWNsYXJlZF90eXBlX2FsaWFzZXNcIjogcHJlZGVmaW5lZF90b2tlbixcbiAgICAgICAgICAgIFwiQHByZWRlY2xhcmVkX2ludHJpbnNpY3NcIjogcHJlZGVmaW5lZF90b2tlbixcbiAgICAgICAgICAgIFwiQGRlZmF1bHRcIjogXCJpZGVudGlmaWVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbW1lbnRPclNwYWNlXCIgfSxcbiAgICAgIHsgaW5jbHVkZTogXCJAbnVtYmVyc1wiIH0sXG4gICAgICBbL1t7fSgpXFxbXFxdXS8sIFwiQGJyYWNrZXRzXCJdLFxuICAgICAgW1wiQFwiLCBcImFubm90YXRpb25cIiwgXCJAYXR0cmlidXRlXCJdLFxuICAgICAgW1xuICAgICAgICAvQHN5bWJvbHMvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQG9wZXJhdG9yc1wiOiBcIm9wZXJhdG9yXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiZGVsaW1pdGVyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbLy4vLCBcImludmFsaWRcIl1cbiAgICBdLFxuICAgIGNvbW1lbnRPclNwYWNlOiBbXG4gICAgICBbL1xccysvLCBcIndoaXRlXCJdLFxuICAgICAgWy9cXC9cXCovLCBcImNvbW1lbnRcIiwgXCJAYmxvY2tDb21tZW50XCJdLFxuICAgICAgWy9cXC9cXC8uKiQvLCBcImNvbW1lbnRcIl1cbiAgICBdLFxuICAgIGJsb2NrQ29tbWVudDogW1xuICAgICAgWy9bXlxcLypdKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50XCIsIFwiQHB1c2hcIl0sXG4gICAgICBbL1xcKlxcLy8sIFwiY29tbWVudFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1tcXC8qXS8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgYXR0cmlidXRlOiBbXG4gICAgICB7IGluY2x1ZGU6IFwiQGNvbW1lbnRPclNwYWNlXCIgfSxcbiAgICAgIFsvXFx3Ky8sIFwiYW5ub3RhdGlvblwiLCBcIkBwb3BcIl1cbiAgICBdLFxuICAgIGRpcmVjdGl2ZTogW1xuICAgICAgeyBpbmNsdWRlOiBcIkBjb21tZW50T3JTcGFjZVwiIH0sXG4gICAgICBbL1soKV0vLCBcIkBicmFja2V0c1wiXSxcbiAgICAgIFsvLC8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgW2lkZW50X3JlLCBcIm1ldGEuY29udGVudFwiXSxcbiAgICAgIFsvOy8sIFwiZGVsaW1pdGVyXCIsIFwiQHBvcFwiXVxuICAgIF0sXG4gICAgbnVtYmVyczogW1xuICAgICAgWy8wW2ZoXS8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy9bMS05XVswLTldKltmaF0vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvWzAtOV0qXFwuWzAtOV0rKFtlRV1bKy1dP1swLTldKyk/W2ZoXT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvWzAtOV0rXFwuWzAtOV0qKFtlRV1bKy1dP1swLTldKyk/W2ZoXT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvWzAtOV0rW2VFXVsrLV0/WzAtOV0rW2ZoXT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvMFt4WF1bMC05YS1mQS1GXSpcXC5bMC05YS1mQS1GXSsoPzpbcFBdWystXT9bMC05XStbZmhdPyk/LywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgWy8wW3hYXVswLTlhLWZBLUZdK1xcLlswLTlhLWZBLUZdKig/OltwUF1bKy1dP1swLTldK1tmaF0/KT8vLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbLzBbeFhdWzAtOWEtZkEtRl0rW3BQXVsrLV0/WzAtOV0rW2ZoXT8vLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbLzBbeFhdWzAtOWEtZkEtRl0rW2l1XT8vLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbL1sxLTldWzAtOV0qW2l1XT8vLCBcIm51bWJlclwiXSxcbiAgICAgIFsvMFtpdV0/LywgXCJudW1iZXJcIl1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRyxJQUFDLE9BQU87QUFBQSxFQUNULFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGNBQWMsQ0FBQyxNQUFNLElBQUk7QUFBQSxFQUMxQjtBQUFBLEVBQ0QsVUFBVTtBQUFBLElBQ1IsQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLEtBQUssR0FBRztBQUFBLEVBQ1Y7QUFBQSxFQUNELGtCQUFrQjtBQUFBLElBQ2hCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9BQU8sSUFBSztBQUFBLElBQ3pCLEVBQUUsTUFBTSxLQUFLLE9B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
