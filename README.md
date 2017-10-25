# RFC 5646 Language Tag Implementation

Basic Language Tag handling. Does not attempt to do validation against
the registry.

License: Public Domain

## Installation

```bash
yarn add rfc5646
```

```bash
npm install rfc5646
```

## Use

```js
const LanguageTag = require('rfc5646');

// (The new keyword is required)
const tag = new LanguageTag('en-Latn-US');

// Immutable properties
console.log(tag.language);                            // en
console.log(tag.script);                              // Latn
console.log(tag.region);                              // US
console.log(tag.variant);                             // undefined
console.log(tag.minimal.toString());                  // en-US;
console.log(tag == 'en-Latn-US');                     // true
console.log(tag.matches('en-*'));                     // true
console.log(tag.suitableFor('en-US'));                // true
console.log(tag.minimal.suitableFor('en-US'));        // true
console.log(tag.truncate().toString());               // en-Latn-US
console.log(tag.truncate({script:false}).toString()); // en-US

// ES6 Iteration...
tag.forEach((subtag) => console.log(subtag.toString()));

// Extensions and Private Use Tags
tag = new LanguageTag('en-US-a-abc-b-xyz-x-123');

console.log(tag.extensions.a.toString()); // a-abc
console.log(tag.extensions.b.toString()); // b-xyz
console.log(tag.privateuse.toString());   // x-123
```
