---
---


<!-- tsGuideRenderComment {"guide":{"id":"dBt7JN1vt", "path":"/TestOptionsFolder/Holder/TestOptions", "fragmentFolderPath":"/TestOptionsFolder/Holder/TestOptions_frags"},"fragment":{"id":"dBt7JN1vt","topLevelMapKey":"cv1TRl01rf","mapKeyChain":"cv1TRl01rf","guideID":"dBt7JN1He","guidePath":"c:/GitHub/HAL.Documentation/tsmapsTest/TestOptionsFolder/Holder/TestOptions.tsmap","parentFragmentID":null,"chartKey":"cv1TRl01rf","options":[{"id":"dBt7KZ1AN","option":"Option 1","isAncillary":false,"order":1},{"id":"dBt7KZ1Rb","option":"Option 2","isAncillary":false,"order":2},{"id":"dBt7KZ24B","option":"Option 3","isAncillary":false,"order":3}]}} -->
<div id="tsConfig" data-page-perma="{{ page.permalink }}" data-site-perma="{{ page.permalink }}" data-collection-perma="{{ collection.permalink }}"></div>

<div>
# Is This URL Pretty?

{% assign url = page.url_to_check %}

{% if url %}
  {% assign url_length = url | size %}
  {% assign has_query = url | contains: '?' %}
  {% assign has_hash = url | contains: '#' %}
  {% assign has_special = url | matches: '[!@#$%^&*()+]' %}

  ## Result for: `{{ url }}`

  {% if url_length < 50 and has_query == false and has_hash == false and has_special == false %}
    ✅ This URL is **pretty**!  
    It’s short, clean, and easy to read.
  {% else %}
    ❌ This URL is **not pretty**.  
    ### Reasons:
    - **Length**: {{ url_length }} characters {% if url_length >= 50 %}(too long, > 50){% endif %}
    - **Query Params**: {% if has_query %}Yes{% else %}No{% endif %}
    - **Hash**: {% if has_hash %}Yes{% else %}No{% endif %}
    - **Special Characters**: {% if has_special %}Yes{% else %}No{% endif %}
  {% endif %}
{% else %}
  ⚠️ No URL provided to check. Please set `url_to_check` in the front matter.
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

