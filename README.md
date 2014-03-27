# RFC 5646 Language Tag Implementation

## Installation

```bash
npm install rfc5646
```

or.. using bower
``` bash
bower install rfc5646
```

```html
<html>
<head>
  <script src="dist/rfc5646.min.js"></script>
</head>
</html>
```

## Use

If using node, first do...

```javascript
var LanguageTag = require('rfc5646');
```

In HTML or Node...

```javascript
var tag = new LanguageTag('en-US');
console.log(tag.language);
console.log(tag.region);
console.log(tag.script);
console.log(tag.variant);
```

See docs/index.html for more detail.