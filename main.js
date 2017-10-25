/**
 * @overview
 * RFC 5646 Language Tags Implementation
 * @author James M Snell (jasnell@gmail.com)
 * @license Public Domain
 * @description An implementation of the RFC 5646 Language Tag
 *              syntax that works in browser and server environments
 *              and does not require Language Tag registry knowledge.
 * @example
 * var tag = new LanguageTag('en-Latn-US');
 * console.log(tag.language);   // en
 * console.log(tag.script);     // Latn
 * console.log(tag.region);     // US
 * console.log(tag.variant);    // undefined
 * console.log(tag.minimal;  // en-US;
 * console.log(tag == 'en-US'); // true
 * console.log(tag.matches('en-*')); // true
 * console.log(tag.minimal.suitableFor('en-US')); // true
 * console.log(tag.truncate().toString()); //en-Latn-US
 * console.log(tag.truncate({script:false}).toString()); // en-US
 * var i = tag.iterator;
 * var n
 * while(!(n=i.next()).done) {
 *  console.log(n.value.toString());
 * }
 **/
'use strict'

const kInspect = typeof require === 'function'
  ? require('util').inspect.custom : 'inspect'

const Types = {}
Object.defineProperties(Types, {
  Wildcard: { configurable: false, enumerable: true, value: undefined },
  Other: { configurable: false, enumerable: true, value: 0x0 },
  Language: { configurable: false, enumerable: true, value: 0x1 },
  ExtLang: { configurable: false, enumerable: true, value: 0x2 },
  Script: { configurable: false, enumerable: true, value: 0x4 },
  Region: { configurable: false, enumerable: true, value: 0x8 },
  Variant: { configurable: false, enumerable: true, value: 0x10 },
  Singleton: { configurable: false, enumerable: true, value: 0x20 },
  Extension: { configurable: false, enumerable: true, value: 0x40 },
  PrivateUse: { configurable: false, enumerable: true, value: 0x80 },
  Invalid: { configurable: false, enumerable: true, value: 0xFF }
})

const _wild = { r: /^\*$/i, v: Types.Wildcard }
const _pvt = { r: /^x$/i, v: Types.PrivateUse | Types.Singleton }
const _ext = { r: /^[a-wy-z]$/i, v: Types.Extension | Types.Singleton }
const _lang = { r: /^[a-z]{2,3}$/i, v: Types.Language }
const _extlang = { r: /^[a-z]{3}$/i, v: Types.ExtLang }
const _script = { r: /^[a-z]{4}$/i, v: Types.Script }
const _region = { r: /^[a-z]{2}|[0-9]{3}$/i, v: Types.Region }
const _variant = { r: /^[a-z0-9]{5,8}|[0-9][a-z0-9]{3}$/i, v: Types.Variant }
const _other = { r: /^[a-z0-9]{2,8}$/i, v: Types.Other }

const kInner = Symbol('inner')

function flag (a, b) {
  return (a & b) === b
}

function countext (previous) {
  let c = 1
  let p = previous
  while (p) {
    if (p.type === Types.ExtLang) c++
    else break
    p = p.previous
  }
  return c
}

function extpvtchk (v, previous) {
  if (previous) {
    if (!flag(v, Types.Singleton) && flag(previous.type, Types.Extension)) { v |= Types.Extension } else if (!flag(v, Types.Singleton) && flag(previous.type, Types.PrivateUse)) { v |= Types.PrivateUse }
  }
  return v
}

function classify (token, previous) {
  var ret
  function _test (t) {
    return t.r.test(token)
  };
  if (token.length === 0) { return Types.Invalid }
  if (previous === undefined) {
    ret = [_wild, _pvt, _lang].find(_test)
    return ret ? ret.v : Types.Invalid
  } else {
    switch (previous.type) {
      case Types.Language:
      case Types.ExtLang:
        ret = [_wild, _pvt, _ext, _extlang, _script, _region, _variant, _other]
          .find(_test)
        if (!ret) return Types.Invalid
        return ret.v === Types.ExtLang
          ? (countext(previous) <= 3 ? ret.v : Types.Invalid)
          : extpvtchk(ret.v, previous)
      case Types.Script:
        ret = [_wild, _pvt, _ext, _region, _variant, _other].find(_test)
        return ret ? extpvtchk(ret.v, previous) : Types.Invalid
      case Types.Region:
        ret = [_wild, _pvt, _ext, _variant, _other].find(_test)
        return ret ? extpvtchk(ret.v, previous) : Types.Invalid
      default:
        ret = [_wild, _pvt, _ext, _other].find(_test)
        return ret ? extpvtchk(ret.v, previous) : Types.Invalid
    }
  }
}

class Subtag {
  constructor (token, previous) {
    token = token.toLowerCase()

    if (previous !== undefined) {
      if (previous[kInner] === undefined) { throw new TypeError('The "previous" argument must be a Subtag') }
      previous[kInner].next = this
    }

    const type = classify(token, previous)

    this[kInner] = {
      token,
      previous,
      type,
      wild: type === undefined,
      singleton: (type & Types.Singleton) === Types.Singleton,
      extension: (type & Types.Extension) === Types.Extension,
      privateuse: (type & Types.PrivateUse) === Types.PrivateUse
    }
  }

  get token () {
    return this[kInner].token
  }

  get next () {
    return this[kInner].next
  }

  get previous () {
    return this[kInner].previous
  }

  get type () {
    return this[kInner].type
  }

  get wild () {
    return this[kInner].wild
  }

  get singleton () {
    return this[kInner].singleton
  }

  get extension () {
    return this[kInner].extension
  }

  get privateuse () {
    return this[kInner].privateuse
  }

  [kInspect] () {
    return this[kInner]
  }

  toString () {
    const token = this[kInner].token
    switch (this[kInner].type) {
      case Types.Script:
        return token[0].toUpperCase() + token.slice(1)
      case Types.Region:
        return token.toUpperCase()
      default:
        if (this[kInner].singleton) {
          let ret = token
          let next = this.next
          while (next && !next[kInner].singleton) {
            ret += `-${next[kInner].token}`
            next = next[kInner].next
          }
          return ret
        } else {
          return token
        }
    }
  }

  valueOf () {
    return this.toString()
  }
}

class LanguageTag {
  constructor (tag) {
    let language
    let region
    let script
    let variant
    let invalid
    let privateuse
    let extensions
    let first
    let p
    let wild = false
    let length = 0
    const tokens = String(tag).split(/[-_]/)
    for (; length < tokens.length; length++) {
      p = new Subtag(tokens[length], p)
      switch (p.type) {
        case Types.Language:
          language = p.toString()
          break
        case Types.Region:
          region = p.toString()
          break
        case Types.Script:
          script = p.toString()
          break
        case Types.Variant:
          variant = p.toString()
          break
        case Types.Invalid:
          invalid = true
          break
        default:
          if (p.singleton) {
            if (p.privateuse && !privateuse) {
              privateuse = p
            } else if (p.extension) {
              extensions = extensions || {}
              extensions[p.token] = p
            }
          } else if (p.wild) {
            wild = true
          }
      }
      first = first || p
    }

    this[kInner] = {
      language,
      region,
      script,
      variant,
      invalid,
      privateuse,
      extensions,
      wild,
      length,
      first
    }
  }

  get language () {
    return this[kInner].language
  }

  get region () {
    return this[kInner].region
  }

  get script () {
    return this[kInner].script
  }

  get variant () {
    return this[kInner].variant
  }

  get invalid () {
    return this[kInner].invalid
  }

  get privateuse () {
    return this[kInner].privateuse
  }

  get extensions () {
    return this[kInner].extensions
  }

  get wild () {
    return this[kInner].wild
  }

  get length () {
    return this[kInner].length
  }

  get first () {
    return this[kInner].first
  }

  [kInspect] () {
    return this[kInner]
  }

  suitableFor (other) {
    const inner = this[kInner]
    if (inner.wild) return true
    const _other = new LanguageTag(other)
    const otherInner = _other[kInner]
    if (inner.language !== otherInner.language) return false
    if (inner.region && inner.region !== otherInner.region) return false
    if (inner.script && inner.script !== otherInner.script) return false
    if (inner.variant && inner.variant !== otherInner.variant) return false
    return true
  }

  matches (other) {
    const inner = this[kInner]
    const wild = inner.wild
    let a = wild ? this : other
    const b = wild ? other : this
    if (a === '*') a = '(?:[a-z0-9]{1,8})(?:-[a-z0-9]{1,8})*'
    const pattern = a.toString().replace(/-\*/g, '(?:-[a-z0-9]{1,8})*')
    const reg = new RegExp(`^${pattern}$`, 'i')
    return reg.test(b.toString())
  }

  truncate (options) {
    const tags = []
    const inner = this[kInner]
    let n = inner.first
    if (n[kInner].privateuse) { return this } // don't truncate if tag is a privateuse
    while (n !== undefined) {
      let t = n
      n = n.next
      if (t.type < 0x10) {
        if (options) {
          if ((options.extlang === false && t.type === Types.ExtLang) ||
              (options.script === false && t.type === Types.Script) ||
              (options.variant === false && t.type === Types.Variant)) {
            continue
          }
        }
        tags.push(t.toString())
      }
    }
    return new LanguageTag(tags.join('-'))
  }

  get minimal () {
    return this.truncate({ extlang: false, script: false, variant: false })
  }

  valueOf () {
    return this.toString()
  }

  toString () {
    return Array.from(this).join('-')
  }

  * [Symbol.iterator] () {
    let n = this.first
    while (n !== undefined) {
      yield n
      n = n.next
    }
  }

  forEach (callback) {
    if (typeof callback !== 'function') { throw new TypeError('A callback function must be provided') }
    for (const tag of this) { callback.call(this, tag) }
  }
}

LanguageTag.Types = Types

module.exports = LanguageTag
