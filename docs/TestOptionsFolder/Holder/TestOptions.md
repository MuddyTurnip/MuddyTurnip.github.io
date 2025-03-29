---
---


<!-- tsGuideRenderComment {"guide":{"id":"dBt7JN1vt", "path":"/TestOptionsFolder/Holder/TestOptions", "fragmentFolderPath":"/TestOptionsFolder/Holder/TestOptions_frags"},"fragment":{"id":"dBt7JN1vt","topLevelMapKey":"cv1TRl01rf","mapKeyChain":"cv1TRl01rf","guideID":"dBt7JN1He","guidePath":"c:/GitHub/HAL.Documentation/tsmapsTest/TestOptionsFolder/Holder/TestOptions.tsmap","parentFragmentID":null,"chartKey":"cv1TRl01rf","options":[{"id":"dBt7KZ1AN","option":"Option 1","isAncillary":false,"order":1},{"id":"dBt7KZ1Rb","option":"Option 2","isAncillary":false,"order":2},{"id":"dBt7KZ24B","option":"Option 3","isAncillary":false,"order":3}]}} -->
<div id="tsConfig" data-page-perma="{{ page.permalink }}" data-site-perma="{{ page.permalink }}" data-collection-perma="{{ collection.permalink }}"></div>

<div>
{% assign url = page.url | default: post.url %}
{% if url ends_with '/' %}
  ✅ Pretty URL (trailing slash).
{% elsif url contains '.html' %}
  ❌ Non-pretty URL (.html).
{% elsif page.permalink or post.permalink %}
  {% if page.permalink ends_with '/' or post.permalink ends_with '/' %}
    ✅ Pretty URL (custom permalink with trailing slash).
  {% elsif page.permalink contains '.html' or post.permalink contains '.html' %}
    ❌ Non-pretty URL (custom permalink with .html).
  {% else %}
    🔍 Custom permalink (check manually: {{ page.permalink | default: post.permalink }}).
  {% endif %}
{% else %}
  🤔 Likely pretty (Jekyll defaults to `/about/` for `/about.md`).
{% endif %}
  </div>

### Root
Root

### Root child
root child

### Root grandchild
Root grand child

### Root great grand child - options
Root great grand child - options

