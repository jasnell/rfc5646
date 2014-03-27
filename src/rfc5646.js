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
 * console.log(tag.minimal());  // en-US;
 * console.log(tag == 'en-US'); // true
 * console.log(tag.matches('en-*')); // true
 * console.log(tag.minimal().suitableFor('en-US')); // true
 * console.log(tag.truncate().toString()); //en-Latn-US
 * console.log(tag.truncate({script:false}).toString()); // en-US
 * var i = tag.iterator;
 * var n
 * while(!(n=i.next()).done) {
 *  console.log(n.value.toString());
 * }
 **/
var module = module || undefined;
var define = define || undefined;
(function( global, factory ) {
  var exp = global.document ? factory(global) : factory();
  if ( typeof module === 'object' && typeof module.exports === 'object' )
    module.exports = exp;
  if ( typeof define === 'function' && define.amd )
    define( 'rfc5646', [], function() {
      return exp;
    });
}(typeof window !== 'undefined' ? window : this, function(_$) {

  var nativeForEach = Array.prototype.forEach,
      nativeFind = Array.prototype.find,
      nativeDef = Object.defineProperty;

  function each(obj, i, ctx) {
    if (obj === undefined || obj === null)
      return obj;
    if (nativeForEach && obj.forEach === nativeForEach)
      obj.forEach(i,ctx);
    else
      for (var n in obj) {
        var r = i.call(ctx,obj[n],n,obj);
        if (r === false)
          break; // break out
      }
  }

  function find(obj, predicate, context) {
    if (obj === undefined || obj === null)
      return obj;
    if (nativeFind && obj.find === nativeFind)
      return obj.find(predicate, context);
    else
      for (var n in obj) {
        if (predicate.call(context,obj[n],n,obj))
          return obj[n];
      }
  }

  function def(prop,value,getter) {
    if (nativeDef) {
      var pdef = {
        configurable: false,
        enumerable: false
      };
      if (getter)
        pdef.get = value;
      else
        pdef.value = value;
      Object.defineProperty(this,prop,pdef);
    } else {
      // not as good because the value is not
      // immutable and can be iterated, but 
      // it's an ok fallback.
      this[prop] = value;
    }
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
      _ext     = {r:/^[a-wy-z]$]/i,v:Types.Extension|Types.Singleton},
      _lang    = {r:/^[a-z]{2,3}$/i,v:Types.Language},
      _extlang = {r:/^[a-z]{3}$/i,v:Types.ExtLang},
      _script  = {r:/^[a-z]{4}$/i,v:Types.Script},
      _region  = {r:/^[a-z]{2}|[0-9]{3}$/i,v:Types.Region},
      _variant = {r:/^[a-z0-9]{5,8}|[0-9][a-z0-9]{3}$/i,v:Types.Variant},
      _other   = {r:/^[a-z0-9]{2,8}$/i,v:Types.Other}
      ;


  var flag = function(a,b) {
    return (a&b)==b;
  };

  function classify(token, previous) {
    
    var ret;

    var test = function(t) {
      return t.r.test(token);
    };

    var countext = function() {
      var c = 1, p = previous;
      while(p) {
        if (p.type == Types.ExtLang) c++;
        else break;
        p = p.previous;
      }
      return c;
    };

    var extpvtchk = function(v,previous) {
      if (previous) {
        if (!flag(v,Types.Singleton) && flag(previous.type,Types.Extension))
          v |= Types.Extension;
        else if (!flag(v,Types.Singleton) && flag(previous.type,Types.PrivateUse))
          v |= Types.PrivateUse;
      }
      return v;
    };

    if (token.length === 0)
      return Types.Invalid;

    if (!previous) {
      ret = find([_wild, _pvt,_lang],test);
      return ret ? ret.v : Types.Invalid;
    } else {
      switch(previous.type) {
        case Types.Language:
        case Types.ExtLang:
          ret = find([_wild,_pvt,_ext,_extlang,_script,_region,_variant,_other],test);
          if (!ret) return Types.Invalid;
          return ret.v == Types.ExtLang ?
            (countext() <= 3 ? ret.v : Types.Invalid) :
            extpvtchk(ret.v,previous);
        case Types.Script:
          ret = find([_wild,_pvt,_ext,_region,_variant,_other],test);
          return ret ? extpvtchk(ret.v,previous): Types.Invalid;
        case Types.Region:
          ret = find([_wild,_pvt,_ext,_variant,_other],test);
          return ret ? extpvtchk(ret.v,previous) : Types.Invalid;
        default:
          ret = find([_wild,_pvt,_ext,_other],test);
          return ret ? extpvtchk(ret.v,previous) : Types.Invalid;
      }

    }
  }

  var Subtag = function(token, previous) {
    def.call(this,'token',token.toLowerCase());
    if (previous) {
      def.call(previous,'next',this);
      def.call(this,'previous',previous);
    }
    def.call(this,'type',classify(token,previous));
    def.call(this,'isWildcard',this.type === undefined);
    def.call(this,'isSingleton',flag(this.type,Types.Singleton));
    def.call(this,'isExtension',flag(this.type,Types.Extension));
    def.call(this,'isPrivateUse',flag(this.type,Types.PrivateUse));
    def.call(this,'toString', function() {
      switch(this.type) {
        case Types.Script:
          return this.token[0].toUpperCase() + this.token.substr(1);
        case Types.Region:
          return this.token.toUpperCase();
        default:
          return this.token;
      }
    });
    def.call(this,'valueOf',this.toString);
  };

  var LanguageTag = function(_tag) {
    if (!(this instanceof LanguageTag))
      return new LanguageTag(_tag.toString());
    else if (tag instanceof LanguageTag)
      return tag;
    // check for grandfathered here...
    var f, p;
    var splits = _tag.split(/[-_]/);
    var tag = this;
    var exts;
    var wild = false;
    each(splits,function(token) {
      p = new Subtag(token, p);
      switch(p.type) {
        case Types.Language:
          def.call(tag,'language',p.toString());
          break;
        case Types.Region:
          def.call(tag,'region',p.toString());
          break;
        case Types.Script:
          def.call(tag,'script',p.toString());
          break;
        case Types.Variant:
          def.call(tag,'variant',p.toString());
          break;
        case Types.Invalid:
          def.call(tag,'invalid',true);
          break;
        default:
          if (p.isSingleton) {
            if (p.isPrivateUse)
              def.call(tag,'privateuse',p);
            else if (p.isExtension) {
              if (!exts) exts = {};
              exts[p.token] = p;
            }
          } else if (p.isWildcard)
            this.wild = true;
      }
      f = f||p;
    });
    if (exts) def.call(this,'extensions',exts);
    def.call(this,'isWildcard', wild);
    def.call(this,'length',splits.length);
    def.call(this,'first',f);
    def.call(this,'toString',function() {
      var tags = [], n = this.first;
      while(n) {
        tags.push(n.toString());
        n = n.next;
      }
      return tags.join('-');
    });
    def.call(this,'valueOf',this.toString);
    def.call(this,'matches',function(other) {
      var a = wild?this:other;
      var b = wild?other:this;
      var pattern = a.toString().replace(/-\*/g,'(?:-[a-z0-9]{1,8})*');
      var reg = new RegExp('^'+pattern+'$', 'i');
      return reg.test(b.toString());
    });
    if (!wild)
      def.call(this,'suitableFor',function(other) {
        other = LanguageTag(other);
        if (this.language !== other.language) return false;
        if (this.region && this.region !== other.region) return false;
        if (this.script && this.script !== other.script) return false;
        if (this.variant && this.variant !== other.variant) return false;
        return true;
      });
    def.call(this,'truncate', function(options) {
      var tags = [], n = this.first;
      if (n.isPrivateUse) return this; // don't truncate if tag is a private use
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
    });
    def.call(this,'minimal', function() {
      return this.truncate({extlang:false,script:false,variant:false});
    });
    def.call(this,'iterator',function() {
      var current = this.first;
      var ret = {
        next: function() {
          if (this.done) return {done:true};
          var ret = current;
          current = current.next;
          return {done:false,value:ret};
        }
      };
      def.call(
        ret,
        'done',
        function(){
          return current === undefined;
        },
        true);
      return ret;
    }, true);
    def.call(this,'forEach',function(cb) {
      var i = this.iterator;
      while(!i.done) { cb(i.next().value); }
    });
    Object.freeze(this);
  };

  LanguageTag.Types = Types;
  Object.freeze(LanguageTag.Types);
  Object.freeze(LanguageTag);
  if (_$ !== undefined)
    _$.LanguageTag = LanguageTag;
  return LanguageTag;
}));

// JsDoc detail

/**
 * @kind class
 * @name LanguageTag
 * @description An RFC 5646 Language Tag. Once created, LanguageTag instances are immutable
 *
 * @example
 * var tag = new LanguageTag('en-Latn-US');
 * console.log(tag.language);   // en
 * console.log(tag.script);     // Latn
 * console.log(tag.region);     // US
 * console.log(tag.variant);    // undefined
 * console.log(tag.minimal());  // en-US;
 * console.log(tag == 'en-US'); // true
 * console.log(tag.matches('en-*')); // true
 * console.log(tag.minimal().suitableFor('en-US')); // true
 * console.log(tag.truncate().toString()); //en-Latn-US
 * console.log(tag.truncate({script:false}).toString()); // en-US
 * var i = tag.iterator;
 * var n
 * while(!(n=i.next()).done) {
 *  console.log(n.value.toString());
 * }
 **/
/**
 * @kind member
 * @name language
 * @instance
 * @type {string}
 * @memberOf LanguageTag
 * @description The value of the language subtag
 **/
/**
 * @kind member
 * @name region
 * @instance
 * @type {string}
 * @memberOf LanguageTag
 * @description The value of the region subtag
 **/
/**
 * @kind member
 * @name variant
 * @instance
 * @type {string}
 * @memberOf LanguageTag
 * @description The value of the variant subtag
 **/
 /**
 * @kind member
 * @name script
 * @instance
 * @type {string}
 * @memberOf LanguageTag
 * @description The value of the script subtag
 **/
 /**
 * @kind member
 * @name invalid
 * @instance
 * @type {boolean}
 * @memberOf LanguageTag
 * @description True if the Language Tag contains any invalid subtags (otherwise undefined)
 **/
/**
 * @kind member
 * @name privateuse
 * @instance
 * @type {boolean}
 * @memberOf LanguageTag
 * @description True if the Language Tag starts with a private use subtag (otherwise undefined)
 **/
/**
 * @kind member
 * @name extensions
 * @instance
 * @type {LanguageTag~Subtag}
 * @memberOf LanguageTag
 * @description The first extension subtag (if any). Undefined if no extension subtags are included.
 **/
 /**
 * @kind member
 * @name isWildcard
 * @instance
 * @type {boolean}
 * @memberOf LanguageTag
 * @description True if this Language Tag contains any wildcard subtags
 **/
 /**
 * @kind member
 * @name length
 * @instance
 * @type {number}
 * @memberOf LanguageTag
 * @description The number of subtags
 **/
 /**
  * @kind member
  * @name iterator
  * @instance
  * @type {iterator}
  * @memberOf LanguageTag
  * @description Returns an EcmaScript 6 style Iterator object that enumerates the Subtags 
  *              (if you're not using an EcmaScript 6 enabled environent, it is recommended 
  *              that you use the {@link LanguageTag#forEach} method instead.)
  **/
/**
 * @kind function
 * @name valueOf
 * @instance
 * @type {string}
 * @memberOf LanguageTag
 * @description The string value of this language tag (properly formatted)
 **/
/**
 * @kind function
 * @name toString
 * @instance
 * @type {string}
 * @memberOf LanguageTag
 * @description The string value of this language tag (properly formatted)
 **/
 /**
 * @kind function
 * @name matches
 * @instance
 * @type {boolean}
 * @param {LanguageTag|string} other
 * @memberOf LanguageTag
 * @description Returns true if this Language Tag matches the given RFC 4647 Language Range
 * @example
 * var tag = new LanguageTag('en-US');
 * console.log(tag.matches('en-*')); // true
 **/
 /**
 * @kind function
 * @name suitableFor
 * @instance
 * @type {boolean}
 * @param {LanguageTag|string} other
 * @memberOf LanguageTag
 * @description Returns true if this Language Tag is a suitable match for the given Language Tag. 
 *              Suitability is determined by looking at the level of specificity in the language 
 *              tag. For instance, the tag 'en-Latn-US' is suitable for 'en-US' but 'en-US' is
 *              not suitable for 'en-Latn-US'. 
 **/
  /**
 * @kind function
 * @name truncate
 * @instance
 * @type {LanguageTag}
 * @param {LanguageTag~TruncateOptions} [options]
 * @memberOf LanguageTag
 * @description Returns a new Language Tag instance that omits Private Use and Extension Subtags. Script, Variant and Region 
 *              subtags can be optionally omitted as well using the optional options parameter
 **/
  /**
 * @kind function
 * @name minimal
 * @instance
 * @type {LanguageTag}
 * @memberOf LanguageTag
 * @description An alias for truncate that returns a minimal Language Tag with only Language and Region subtags
 *              (equivalent to calling "truncate({script:false;variant:false});")
 **/
 /**
  * @kind function
  * @name forEach
  * @instance
  * @memberOf LanguageTag
  * @param {LanguageTag~forEachCallback} callback - The callback function that receives the Subtags
  * @example
  * var tag = new LanguageTag('en-US');
  * tag.forEach(function(tag) {
  *   console.log(tag);
  * });
  **/

/**
 * @callback LanguageTag~forEachCallback
 * @param {LanguageTag~Subtag} subtag
 **/

/**
 * @typedef {Object} LanguageTag~TruncateOptions
 * @description Options used for the LanguageTag truncate function
 * @property {boolean} [script=undefined] - True if Script subtags should be omitted
 * @property {boolean} [region=undefined] - True if Region subtags should be omitted
 * @property {boolean} [variant=undefined] - True if Variant subtags should be omitted
 * @example
 * var tag = new LanguageTag('en-latn-us');
 * var short = tag.truncate({script:false});
 **/

/**
 * @kind class
 * @abstract
 * @name LanguageTag~Subtag
 * @description A Language Tag Subtag.
 **/
/**
 * @kind member
 * @name type
 * @instance
 * @type {LanguageTag.Types}
 * @memberOf LanguageTag~Subtag
 * @desription Identifies the Subtag Type
 **/
/**
 * @kind member
 * @name isWildcard
 * @instance
 * @type {boolean}
 * @memberOf LanguageTag~Subtag
 * @description True if the subtag token is equal to "*"
 **/
/**
 * @kind member
 * @name isSingleton
 * @instance
 * @type {boolean}
 * @memberOf LanguageTag~Subtag
 * @description True if the subtag is a singleton (the token is a single letter between a-z)
 **/
 /**
 * @kind member
 * @name isExtension
 * @instance
 * @type {boolean}
 * @memberOf LanguageTag~Subtag
 * @description True if the subtag is an extension subtag
 **/
 /**
 * @kind member
 * @name isPrivateUse
 * @instance
 * @type {boolean}
 * @memberOf LanguageTag~Subtag
 * @description True if the subtag is a private use subtag
 **/