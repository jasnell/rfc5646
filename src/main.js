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

var nativeFind = Array.prototype.find;

function find(obj, predicate) {
  if (obj === undefined || obj === null) {
    return obj;
  }
  if (nativeFind && obj.find === nativeFind) {
    return obj.find(predicate, context);
  } else {
    for (var n = 0, l = obj.length; n < l; n++) {
      if (predicate(obj[n], n, obj)) {
        return obj[n];
      }
    }
  }
}

function def(prop,value) {
  Object.defineProperty(
    this, prop,{
    enumerable: true,
    value: value
  });
}
 
 /** 
  * @enum {number}
  * @memberOf LanguageTag
  * @description The Subtag Type
  **/
 var Types = {
   /** Subtag is equal to '*' (value 0x0) **/
   Wildcard: undefined,
   Other : 0x0,
   /** Language Subtag (value 0x1) **/
   Language : 0x1,
   /** Ext-Lang Subtag (value 0x2) **/
   ExtLang : 0x2,
   /** Script Subtag (value 0x4) **/
   Script : 0x4,
   /** Region Subtag (value 0x8) **/
   Region : 0x8,
   /** Variant Subtag (value 0x10) **/
   Variant : 0x10,
   /** Singleton Subtag (value 0x20) **/
   Singleton: 0x20,
   /** Extension Subtag (value 0x40) **/
   Extension: 0x40,
   /** Private Use Subtag (value 0x80) **/
   PrivateUse: 0x80,
   /** Invalid Subtag (value 0xFF) **/
   Invalid: 0xFF
};

var _wild    = {r:/^\*$/i,v:Types.Wildcard},
    _pvt     = {r:/^x$/i,v:Types.PrivateUse|Types.Singleton},
    _ext     = {r:/^[a-wy-z]$/i,v:Types.Extension|Types.Singleton},
    _lang    = {r:/^[a-z]{2,3}$/i,v:Types.Language},
    _extlang = {r:/^[a-z]{3}$/i,v:Types.ExtLang},
    _script  = {r:/^[a-z]{4}$/i,v:Types.Script},
    _region  = {r:/^[a-z]{2}|[0-9]{3}$/i,v:Types.Region},
    _variant = {r:/^[a-z0-9]{5,8}|[0-9][a-z0-9]{3}$/i,v:Types.Variant},
    _other   = {r:/^[a-z0-9]{2,8}$/i,v:Types.Other}
    ;

function flag(a,b) {
  return (a&b)==b;
}

function test(t) {
  return t.r.test(this);
}

function countext(previous) {
  var c = 1, p = previous;
  while(p) {
    if (p.type == Types.ExtLang) c++;
    else break;
    p = p.previous;
  }
  return c;
}

function extpvtchk(v,previous) {
  if (previous) {
    if (!flag(v,Types.Singleton) && flag(previous.type,Types.Extension))
      v |= Types.Extension;
    else if (!flag(v,Types.Singleton) && flag(previous.type,Types.PrivateUse))
      v |= Types.PrivateUse;
  }
  return v;
}

function classify(token, previous) {
  var ret;
  var _test = test.bind(token);
  if (token.length === 0)
    return Types.Invalid;
  if (!previous) {
    ret = find([_wild, _pvt, _lang],_test);
    return ret ? ret.v : Types.Invalid;
  } else {
    switch(previous.type) {
      case Types.Language:
      case Types.ExtLang:
        ret = find([_wild,_pvt,_ext,_extlang,_script,_region,_variant,_other],_test);
        if (!ret) return Types.Invalid;
        return ret.v == Types.ExtLang ?
          (countext(previous) <= 3 ? ret.v : Types.Invalid) :
          extpvtchk(ret.v,previous);
      case Types.Script:
        ret = find([_wild,_pvt,_ext,_region,_variant,_other],_test);
        return ret ? extpvtchk(ret.v,previous): Types.Invalid;
      case Types.Region:
        ret = find([_wild,_pvt,_ext,_variant,_other],_test);
        return ret ? extpvtchk(ret.v,previous) : Types.Invalid;
      default:
        ret = find([_wild,_pvt,_ext,_other],_test);
        return ret ? extpvtchk(ret.v,previous) : Types.Invalid;
    }
  }
}

function Subtag(token, previous) {
  if (!(this instanceof Subtag))
    return new Subtag(token, previous);
  def.call(this,'token',token.toLowerCase());
  if (previous) {
    def.call(previous,'next',this);
    def.call(this,'previous',previous);
  }
  def.call(this,'type',classify(token,previous));
  def.call(this,'wild',this.type === undefined);
  def.call(this,'singleton',flag(this.type,Types.Singleton));
  def.call(this,'extension',flag(this.type,Types.Extension));
  def.call(this,'privateUse',flag(this.type,Types.PrivateUse));
}
Subtag.prototype = {
  toString: function() {
    switch(this.type) {
      case Types.Script:
        return this.token[0].toUpperCase() + this.token.substr(1);
      case Types.Region:
        return this.token.toUpperCase();
      default:
        if (this.singleton) {
          var ret = this.token;
          var next = this.next;
          while(next && !next.singleton) {
            ret += '-' + next.token;
            next = next.next;
          }
          return ret;
        } else {
          return this.token;
        }
    }
  },
  valueOf: function() {
    return this.toString();
  }
};

function LanguageTag(_tag) {
  if (!(this instanceof LanguageTag))
    return new LanguageTag(_tag.toString());
  else if (_tag instanceof LanguageTag)
    return _tag;
  // check for grandfathered here...
  var f, p;
  var splits = _tag.split(/[-_]/);
  var exts;
  var wild = false;
  for (var n = 0, l = splits.length; n < l; n++) {
    p = Subtag(splits[n], p);
    switch(p.type) {
      case Types.Language:
        def.call(this,'language',p.toString());
        break;
      case Types.Region:
        def.call(this,'region',p.toString());
        break;
      case Types.Script:
        def.call(this,'script',p.toString());
        break;
      case Types.Variant:
        def.call(this,'variant',p.toString());
        break;
      case Types.Invalid:
        def.call(this,'invalid',true);
        break;
      default:
        if (p.singleton) {
          if (p.privateUse) {
            def.call(this,'privateuse',p);
          } else if (p.extension) {
            if (!exts) exts = {};
            exts[p.token] = p;
          }
        } else if (p.wild) {
          this.wild = true;
        }
    }
    f = f||p;
  }
  if (exts) def.call(this,'extensions',exts);
  def.call(this,'wild', wild);
  def.call(this,'length',splits.length);
  def.call(this,'first',f);
}
LanguageTag.prototype = {
  suitableFor : function(other) {
    if (this.wild) return true;
    var _other = LanguageTag(other);
    if (this.language !== _other.language) return false;
    if (this.region && this.region !== _other.region) return false;
    if (this.script && this.script !== _other.script) return false;
    if (this.variant && this.variant !== _other.variant) return false;
    return true;
  },
  valueOf : function() {
    return this.toString();
  },
  toString : function() {
    var tags = [], n = this.first;
    this.forEach(function(tag) {
      tags.push(tag.toString());
    });
    return tags.join('-');
  },
  matches : function(other) {
    var wild = this.wild;
    var a = wild?this:other;
    var b = wild?other:this;
    if (a === '*') a = '(?:[a-z0-9]{1,8})(?:-[a-z0-9]{1,8})*';
    var pattern = a.toString().replace(/-\*/g,'(?:-[a-z0-9]{1,8})*');
    var reg = new RegExp('^'+pattern+'$', 'i');
    return reg.test(b.toString());
  },
  truncate : function(options) {
    var tags = [], n = this.first;
    if (n.privateUse) return this; // don't truncate if tag is a private use
    while(n) {
      var t = n;
      n = n.next;
      if (t.type < 0x10) {
        if (options) {
          if ((options.extlang === false && t.type === Types.ExtLang) ||
              (options.script === false && t.type === Types.Script) ||
              (options.variant === false && t.type === Types.Variant)) {
            continue;
          }
        }
        tags.push(t.toString());
      }
    }
    return new LanguageTag(tags.join('-'));
  },
  get minimal() {
    return this.truncate({extlang:false,script:false,variant:false});
  },
  get iterator() {
    var current = this.first;
    var ret = {
      next: function() {
        if (this.done) return {done:true};
        var ret = current;
        if (current.singleton) {
          do {
            current = current.next;
          } while(current && !current.singleton);
        } else {
          current = current.next;
        }
        return {done:false,value:ret};
      },
      get done() {
        return current === undefined;
      }
    };
    return ret;
  },
  forEach : function(callback) {
    if (typeof callback !== 'function')
      throw new Error('A callback function must be provided');
    var i = this.iterator;
    while(!i.done) { 
      callback(i.next().value); 
    }
  }
};

LanguageTag.Types = Types;

module.exports = LanguageTag;
