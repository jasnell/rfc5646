# RFC 5646 Language Tag Implementation

Basic Language Tag handling. Does not attempt to do validation against 
the registry. If you need a more complete implementation, look at 
https://www.npmjs.com/package/language-tags by https://www.npmjs.com/~mcg

## Installation

```bash
npm install rfc5646
```

## Use

```javascript
var LanguageTag = require('rfc5646');

var tag = LanguageTag('en-Latn-US');

console.log(tag.language);                            // en
console.log(tag.script);                              // Latn
console.log(tag.region);                              // US
console.log(tag.variant);                             // undefined
console.log(tag.minimal.toString());                  // en-US;
console.log(tag == 'en-Latn-US');                     // true
console.log(tag.matches('en-*'));                     // true
console.log(tag.minimal.suitableFor('en-US'));        // true
console.log(tag.truncate().toString());               // en-Latn-US
console.log(tag.truncate({script:false}).toString()); // en-US

tag.forEach(function(subtag) {
 console.log(subtag.toString());
});

tag = LanguageTag('en-US-a-abc-b-xyz-x-123');

console.log(tag.extensions.a.toString()); // a-abc
console.log(tag.extensions.b.toString()); // b-xyz
console.log(tag.privateuse.toString());   // x-123

```
