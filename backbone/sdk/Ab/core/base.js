/**
 * @author gp
 * @datetime 2012-4-26
 * @description base.js
 */

/**
 * 对dom的简单封装
 * @param {String} id , dom id
 * @return {HTMLDOCUMENT} dom 
 * 
 * var tt =Dom('btn' );
 *	tt.on('click' ,function(e){
 *	     var ss = this;
 *	     alert(tt.value);
 *	     alert(this.value);
 *	});
 * 
 */
var Dom = function (id){
     var dom = document.getElementById(id);
     if(dom){
           dom.on = function( type,fn,flag){
                 if( this.addEventListener){
                      this.addEventListener( type,fn,flag||false);
                } else if( this.attachEvent){
                      this.attachEvent( 'on'+ type,function(){fn.apply( dom, arguments );});
                } else{
                      this[ 'on'+ type]=fn;
                }
           };
           dom.un = function( type,fn,flag){
                 if( this.removeEventListener){
                      this.removeEventListener( type,fn,flag||false);
                } else if( this.detachEvent){
                      this.detachEvent( 'on'+ type,function(){fn.apply( dom, arguments );});
                } else{
                      this[ 'on'+ type]=null;
                }
           };
     }
     return dom;
};


Ab = {};

/**
 * 将config中的所有属性复制到obj中
 * 
 * @param {Object}
 *            obj The receiver of the properties
 * @param {Object}
 *            config The source of the properties
 * @param {Object}
 *            defaults A different object that will also be applied for default
 *            values
 * @return {Object} returns obj
 * @member Ab apply
 */
Ab.apply = function(o, c, defaults) {
	// no "this" reference for friendly out of scope calls
	if (defaults) {
		Ab.apply(o, defaults);
	}
	if (o && c && typeof c == 'object') {
		for (var p in c) {
			o[p] = c[p];
		}
	}
	return o;
};

(function() {
	var idSeed = 0,
        toString = Object.prototype.toString,
        ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        },
        DOC = document,
        docMode = DOC.documentMode,
        isStrict = DOC.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && (check(/msie 7/) || docMode == 7),
        isIE8 = isIE && (check(/msie 8/) && docMode != 7),
        isIE9 = isIE && check(/msie 9/),
        isIE6 = isIE && !isIE7 && !isIE8 && !isIE9,
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol);

    // remove css image flicker
    if(isIE6){
        try{
            DOC.execCommand("BackgroundImageCache", false, true);
        }catch(e){}
    }
	Ab.apply(Ab, {

		/**
		 * 把config中在obj中不存在的属性，如果obj中存在相同属性则不复制
		 * 
		 * @param {Object}
		 *            obj The receiver of the properties
		 * @param {Object}
		 *            config The source of the properties
		 * @return {Object} returns obj
		 */
		applyIf : function(o, c) {
			if (o) {
				for (var p in c) {
					if (!Ab.isDefined(o[p])) {
						o[p] = c[p];
					}
				}
			}
			return o;
		},
		isObject : function(v){
            return !!v && Object.prototype.toString.call(v) === '[object Object]';
        },
		 isString : function(v){
            return typeof v === 'string';
        },

        /**
         * Returns true if the passed value is a boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isBoolean : function(v){
            return typeof v === 'boolean';
        },

		isDefined : function(v) {
			return typeof v !== 'undefined';
		},
		
		isArray : function(v){
            return toString.apply(v) === '[object Array]';
        },
        
        isEmpty : function(v, allowBlank){
            return v === null || v === undefined || (!allowBlank ? v === '' : false);
        },
        
        
        
        isNumber : function(v){
            return typeof v === 'number' && isFinite(v);
        },
        isDate : function(v){
            return toString.apply(v) === '[object Date]';
        },
        
         isPrimitive : function(v){
            return Ab.isString(v) || Ab.isNumber(v) || Ab.isBoolean(v);
        },
        namespace : function(){
            var len1 = arguments.length,
                i = 0,
                len2,
                j,
                main,
                ns,
                sub,
                current;
                
            for(; i < len1; ++i) {
                main = arguments[i];
                ns = arguments[i].split('.');
                current = window[ns[0]];
                if (current === undefined) {
                    current = window[ns[0]] = {};
                }
                sub = ns.slice(1);
                len2 = sub.length;
                for(j = 0; j < len2; ++j) {
                    current = current[sub[j]] = current[sub[j]] || {};
                }
            }
            return current;
        },
         /**
         * 继承一个父类来创建一个子类
         * for example
         * var Panel = Ab.extend(Ab.util.Observable,{
				constructor: function(config){
					this.color = config.color;
					this.addEvents('fired');
					Panel.superclass.constructor.call(this,config);
					this.bindListeners();
				},
				
				bindListeners: function(){
					this.on('fired',this.onFired,this);
				},
				
				onFired: function(){
					alert(this.color);
				}
			});
         */
        extend : function(){
            // inline overrides
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(typeof sp == 'object'){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Ab.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                Ab.override(sb, overrides);
                sb.extend = function(o){return Ab.extend(sb, o);};
                return sb;
            };
        }(),
        
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                Ab.apply(p, overrides);
               
            }
        },
         isIterable : function(v){
            //check for array or arguments
            if(Ab.isArray(v) || v.callee){
                return true;
            }
            //check for node list type
            if(/NodeList|HTMLCollection/.test(toString.call(v))){
                return true;
            }
            //NodeList has an item and length property
            //IXMLDOMNodeList has nextNode method, needs to be checked first.
            return ((typeof v.nextNode != 'undefined' || v.item) && Ab.isNumber(v.length));
        },
        
         each : function(array, fn, scope){
            if(Ab.isEmpty(array, true)){
                return;
            }
            if(!Ab.isIterable(array) || Ab.isPrimitive(array)){
                array = [array];
            }
            for(var i = 0, len = array.length; i < len; i++){
                if(fn.call(scope || array[i], array[i], i, array) === false){
                    return i;
                };
            }
        },
        
        iterate : function(obj, fn, scope){
            if(Ab.isEmpty(obj)){
                return;
            }
            if(Ab.isIterable(obj)){
                Ab.each(obj, fn, scope);
                return;
            }else if(typeof obj == 'object'){
                for(var prop in obj){
                    if(obj.hasOwnProperty(prop)){
                        if(fn.call(scope || obj, prop, obj[prop], obj) === false){
                            return;
                        };
                    }
                }
            }
        },

       
		
        /**
         * 将表单中数据序列化成url连接符格式
         */
		serializeForm : function(form) {
			var fElements = form.elements || document.forms[form].elements;
			var hasSubmit = false, encoder = encodeURIComponent, name, data = '', type, hasValue;
			for (var i = 0, len = fElements.length; i < len; i++) {
				var element = fElements[i];
				name = element.name;
				type = element.type;

				if (name) {
					if (/select-(one|multiple)/i.test(type)) {
						var opts = element.options;
						var resetFlag = false;
						var getData=function(opt){
							if(!opt){return '';}
							hasValue = opt.hasAttribute ? opt
										.hasAttribute('value') : opt
										.getAttributeNode('value').specified;
								data += encoder(name)
										+ "="
										+ encoder(hasValue
												? opt.value
												: opt.text) + "&";
						};
						for (var j = 0, olen = opts.length; j < olen; j++) {
							var opt = opts[j];
							if (opt.selected) {
								resetFlag=true;
								getData(opt);
							}
						}
						//解决IE下重置表单后，select默认项selected 为false
						if(!resetFlag){
							var opt = opts[0];
							getData(opt);
						}
					} else if (!(/file|undefined|reset|button/i.test(type))) {
						if (!(/radio|checkbox/i.test(type) && !element.checked)
								&& !(type == 'submit' && hasSubmit)) {
							data += encoder(name) + '='
									+ encoder(element.value) + '&';
							hasSubmit = /submit/i.test(type);
						}
					}
				}
			}

			return data.substr(0, data.length - 1);
		},
		
		urlAppend : function(url, s){
            if(!Ab.isEmpty(s)){
                return url + (url.indexOf('?') === -1 ? '?' : '&') + s;
            }
            return url;
        },

		
		/**
		 * 
		 */
		 urlDecode : function(string, overwrite){
            if(Ab.isEmpty(string)){
                return {};
            }
            var obj = {},
                pairs = string.split('&'),
                d = decodeURIComponent,
                name,
                value;
                
            for(var i=0,len=pairs.length;i<len;i++){
            	var pair = pairs[i];
            	pair = pair.split('=');
                name = d(pair[0]);
                value = d(pair[1]);
                obj[name] = overwrite || !obj[name] ? value :
                            [].concat(obj[name]).concat(value);
            }
            
            return obj;
        },
        
        urlEncode : function(o, pre){
            var empty,
                buf = [],
                e = encodeURIComponent;

            Ab.iterate(o, function(key, item){
                empty = Ab.isEmpty(item);
                Ab.each(empty ? key : item, function(val){
                    buf.push('&', e(key), '=', (!Ab.isEmpty(val) && (val != key || !empty)) ? (Ab.isDate(val) ? Ab.encode(val).replace(/"/g, '') : e(val)) : '');
                });
            });
            if(!pre){
                buf.shift();
                pre = '';
            }
            return pre + buf.join('');
        }


	});

})();


Ab.apply(Function.prototype,{
	createDelegate : function(obj, args, appendArgs){
        var method = this;
        return function() {
            var callArgs = args || arguments;
            if (appendArgs === true){
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }else if (Ab.isNumber(appendArgs)){
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                var applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }
            return method.apply(obj || window, callArgs);
        };
    }
});


/////////////////////////
		//类库//
////////////////////////
Ab.ns = Ab.namespace;
Ab.ns('Ab.util');

/**
 * 操作json 
 */
Ab.JSON = new (function(){
    var useHasOwn = !!{}.hasOwnProperty,
        isNative = function() {
             return false;
           
        }(),
        pad = function(n) {
            return n < 10 ? "0" + n : n;
        },
        doDecode = function(json){
            return json ? eval("(" + json + ")") : "";   
        },
        doEncode = function(o){
            if(!Ab.isDefined(o) || o === null){
                return "null";
            }else if(Ab.isArray(o)){
                return encodeArray(o);
            }else if(Ab.isDate(o)){
                return Ab.JSON.encodeDate(o);
            }else if(Ab.isString(o)){
                return encodeString(o);
            }else if(typeof o == "number"){
                //don't use isNumber here, since finite checks happen inside isNumber
                return isFinite(o) ? String(o) : "null";
            }else if(Ab.isBoolean(o)){
                return String(o);
            }else {
                var a = ["{"], b, i, v;
                for (i in o) {
                    // don't encode DOM objects
                    if(!o.getElementsByTagName){
                        if(!useHasOwn || o.hasOwnProperty(i)) {
                            v = o[i];
                            switch (typeof v) {
                            case "undefined":
                            case "function":
                            case "unknown":
                                break;
                            default:
                                if(b){
                                    a.push(',');
                                }
                                a.push(doEncode(i), ":",
                                        v === null ? "null" : doEncode(v));
                                b = true;
                            }
                        }
                    }
                }
                a.push("}");
                return a.join("");
            }   
        },
        m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"' : '\\"',
            "\\": '\\\\'
        },
        encodeString = function(s){
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                    var c = m[b];
                    if(c){
                        return c;
                    }
                    c = b.charCodeAt();
                    return "\\u00" +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }) + '"';
            }
            return '"' + s + '"';
        },
        encodeArray = function(o){
            var a = ["["], b, i, l = o.length, v;
                for (i = 0; i < l; i += 1) {
                    v = o[i];
                    switch (typeof v) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            if (b) {
                                a.push(',');
                            }
                            a.push(v === null ? "null" : Ab.JSON.encode(v));
                            b = true;
                    }
                }
                a.push("]");
                return a.join("");
        };

    /**
     * <p>Encodes a Date. This returns the actual string which is inserted into the JSON string as the literal expression.
     * <b>The returned value includes enclosing double quotation marks.</b></p>
     * <p>The default return format is "yyyy-mm-ddThh:mm:ss".</p>
     * <p>To override this:</p><pre><code>
Ext.util.JSON.encodeDate = function(d) {
    return d.format('"Y-m-d"');
};
</code></pre>
     * @param {Date} d The Date to encode
     * @return {String} The string literal to use in a JSON string.
     */
    this.encodeDate = function(o){
        return '"' + o.getFullYear() + "-" +
                pad(o.getMonth() + 1) + "-" +
                pad(o.getDate()) + "T" +
                pad(o.getHours()) + ":" +
                pad(o.getMinutes()) + ":" +
                pad(o.getSeconds()) + '"';
    };

    /**
     * Encodes an Object, Array or other value
     * @param {Mixed} o The variable to encode
     * @return {String} The JSON string
     */
    this.encode = function() {
        var ec;
        return function(o) {
            if (!ec) {
                // setup encoding function on first access
                ec = isNative ? JSON.stringify : doEncode;
            }
            return ec(o);
        };
    }();


    /**
     * Decodes (parses) a JSON string to an object. If the JSON is invalid, this function throws a SyntaxError unless the safe option is set.
     * @param {String} json The JSON string
     * @return {Object} The resulting object
     */
    this.decode = function() {
        var dc;
        return function(json) {
            if (!dc) {
                // setup decoding function on first access
                dc = isNative ? JSON.parse : doDecode;
            }
            return dc(json);
        };
    }();

})();
/**
* Shorthand for {@link Ext.util.JSON#encode}
* @param {Mixed} o The variable to encode
* @return {String} The JSON string
* @member Ext
* @method encode
*/
Ab.encode = Ab.JSON.encode;
/**
* Shorthand for {@link Ext.util.JSON#decode}
* @param {String} json The JSON string
* @param {Boolean} safe (optional) Whether to return null or throw an exception if the JSON is invalid.
* @return {Object} The resulting object
* @member Ext
* @method decode
*/
Ab.decode = Ab.JSON.decode;

