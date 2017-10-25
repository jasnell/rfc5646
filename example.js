var LanguageTag = require('./src/main')

var tag = new LanguageTag('en-Latn-US')

console.log(tag.language)
console.log(tag.script)
console.log(tag.region)
console.log(tag.variant)
console.log(tag.minimal.toString())
console.log(tag == 'en-Latn-US') // eslint-disable-line eqeqeq
console.log(tag.matches('en-*'))
console.log(tag.minimal.suitableFor('en-US'))
console.log(tag.truncate().toString())
console.log(tag.truncate({script: false}).toString())

tag.forEach((subtag) => console.log(subtag.toString()))
