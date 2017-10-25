/* global describe it */
'use strict'

// source: http://www.langtag.net/test-suites.html
const valid = require('./valid.json')
const invalid = require('./invalid.json')
const wellformed = require('./wellformed.json')

const LanguageTag = require('../')
const async = require('async')
const assert = require('assert')

function testParse (tag) {
  return () => {
    it(tag, (done) => {
      try {
        const t = new LanguageTag(tag)
        if (!t.invalid) {
          // if it's valid, it has to at least have a language or privateuse
          assert(t.language || t.privateuse)
        }
        done()
      } catch (err) {
        done(err)
      }
    })
  }
}

describe('Liberal Parsing Tests', () => {
  // everything should parse, even invalid tags,
  // that doesn't make the tags valid tho
  async.parallel(valid.map(testParse), () => {})
  async.parallel(invalid.map(testParse), () => {})
  async.parallel(wellformed.map(testParse), () => {})
})

describe('Minimal Valid Example', () => {
  it('All asserts should pass', () => {
    const tag = new LanguageTag('en-Latn-US')
    assert.equal(tag.language, 'en')
    assert.equal(tag.script, 'Latn')
    assert.equal(tag.region, 'US')
    assert.equal(tag.variant, undefined)
    assert.equal(tag.minimal, 'en-US')
    assert(tag.matches('en-*'))
    assert(tag.minimal.suitableFor('en-US'))
    assert.equal(tag.truncate().toString(), 'en-Latn-US')
    assert.equal(tag.truncate({script: false}).toString(), 'en-US')
  })
})
