var LanguageTag = require('./src/main');

 var tag = new LanguageTag('en-Latn-US');
 
 console.log(tag.language);   // en
 console.log(tag.script);     // Latn
 console.log(tag.region);     // US
 console.log(tag.variant);    // undefined
 console.log(tag.minimal.toString());  // en-US;
 console.log(tag == 'en-Latn-US'); // true
 console.log(tag.matches('en-*')); // true
 console.log(tag.minimal.suitableFor('en-US')); // true
 console.log(tag.truncate().toString()); //en-Latn-US
 console.log(tag.truncate({script:false}).toString()); // en-US

 tag.forEach(function(subtag) {
   console.log(subtag.toString());
 });