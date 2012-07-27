/**
 * 
 * @type 
 */
Ab = {

	/**
	 * The version of the framework
	 * 
	 * @type String
	 */
	version : '1.0.0',
	versionDetail : {
		major : 0,
		minor : 0,
		patch : 0
	}
};


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
		
		isGecko : isGecko,
		
		/**
         * 复制一个对象，包括 array, object , Date，原来引用不再指向新对象
         * @param {Object} item The variable to clone
         * @return {Object} clone
         */
		clone : function(item) {
			if (item === null || item === undefined) {
				return item;
			}

			var type = toString.call(item);

			// Date
			if (type === '[object Date]') {
				return new Date(item.getTime());
			}

			var i, j, k, clone, key;

			// Array
			if (type === '[object Array]') {
				i = item.length;

				clone = [];

				while (i--) {
					clone[i] = Ab.clone(item[i]);
				}
			}
			// Object
			else if (type === '[object Object]' && item.constructor === Object) {
				clone = {};

				for (key in item) {
					clone[key] = Ab.clone(item[key]);
				}

				if (enumerables) {
					for (j = enumerables.length; j--;) {
						k = enumerables[j];
						clone[k] = item[k];
					}
				}
			}

			return clone || item;
		},
		
		/**
		 * 创建一个命名空间，等同于Yx.ns('xx')
		 */
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
        
		isDefined : function(v) {
			return typeof v !== 'undefined';
		},
		 /**
         * Returns true if the passed value is a number. Returns false for non-finite numbers.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isNumber : function(v){
            return typeof v === 'number' && isFinite(v);
        },

        /**
         * Returns true if the passed value is a string.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
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
        /**
         * <p>Returns true if the passed value is empty.</p>
         * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
         * <li>null</li>
         * <li>undefined</li>
         * <li>an empty array</li>
         * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
         * </ul></div>
         * @param {Mixed} value The value to test
         * @param {Boolean} allowBlank (optional) true to allow empty strings (defaults to false)
         * @return {Boolean}
         */
        isEmpty : function(v, allowBlank){
            return v === null || v === undefined || ((Ab.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
        },
        
        /**
         * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isPrimitive : function(v){
            return Ab.isString(v) || Ab.isNumber(v) || Ab.isBoolean(v);
        },
        
        isDate : function(v){
            return toString.apply(v) === '[object Date]';
        },
		
		/**
         * Returns true if the passed value is a JavaScript array, otherwise false.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isArray : function(v){
            return toString.apply(v) === '[object Array]';
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
        
         hasClass : function(dom,className){
            return className && (' '+dom.className+' ').indexOf(' '+className+' ') != -1;
        },

        
         addClass : function(dom,className){
            var dom,
                i,
                len,
                v,
                cls = [];
            // Separate case is for speed
            if (!Ab.isArray(className)) {
                if (typeof className == 'string' && !Ab.hasClass(dom,className)) {
                    dom.className += " " + className;
                }
            }
            else {
                for (i = 0, len = className.length; i < len; i++) {
                    v = className[i];
                    if (typeof v == 'string' && (' ' + dom.className + ' ').indexOf(' ' + v + ' ') == -1) {
                        cls.push(v);
                    }
                }
                if (cls.length) {
                    dom.className += " " + cls.join(" ");
                }
            }
            return dom;
        },
        
        removeClass : function(dom,className){
            var i,
                idx,
                len,
                cls,
                 trimRe = /^\s+|\s+$/g,
                spacesRe = /\s+/,
                elClasses;
            if (!Ab.isArray(className)){
                className = [className];
            }
            if (dom && dom.className) {
                elClasses = dom.className.replace(trimRe, '').split(spacesRe);
                for (i = 0, len = className.length; i < len; i++) {
                    cls = className[i];
                    if (typeof cls == 'string') {
                        cls = cls.replace(trimRe, '');
                        idx = elClasses.indexOf(cls);
                        if (idx != -1) {
                            elClasses.splice(idx, 1);
                        }
                    }
                }
                dom.className = elClasses.join(" ");
            }
            return dom;
        },
        
        replaceClass : function(dom,oldClassName, newClassName){
            return Ab.addClass(Ab.removeClass(dom,oldClassName),newClassName);
        },
        
        
        /**
         * Iterates an array calling the supplied function.
         * @param {Array/NodeList/Mixed} array The array to be iterated. If this
         * argument is not really an array, the supplied function is called once.
         * @param {Function} fn The function to be called with each item. If the
         * supplied function returns false, iteration stops and this method returns
         * the current <code>index</code>. This function is called with
         * the following arguments:
         * <div class="mdetail-params"><ul>
         * <li><code>item</code> : <i>Mixed</i>
         * <div class="sub-desc">The item at the current <code>index</code>
         * in the passed <code>array</code></div></li>
         * <li><code>index</code> : <i>Number</i>
         * <div class="sub-desc">The current index within the array</div></li>
         * <li><code>allItems</code> : <i>Array</i>
         * <div class="sub-desc">The <code>array</code> passed as the first
         * argument to <code>Ext.each</code>.</div></li>
         * </ul></div>
         * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed.
         * Defaults to the <code>item</code> at the current <code>index</code>
         * within the passed <code>array</code>.
         * @return See description for the fn parameter.
         */
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
        }
	});
	
	Ab.ns = Ab.namespace;

})();

Ab.ns('Ab.util');

Ab.apply(Function.prototype,{
	
	/**
	 * createCallback() : Function
	Creates a callback that passes arguments[0], arguments[1], arguments[2], ... Call directly on any function. Example: myFunction.createCallback(arg1, arg2) Will create a function that is bound to those 2 args. If a specific scope is required in the callback, use createDelegate instead. The function returned by createCallback always executes in the window scope.
	This method is required when you want to pass arguments to a callback function. If no arguments are needed, you can simply pass a reference to the function as a callback (e.g., callback: myFn). However, if you tried to pass a function with arguments (e.g., callback: myFn(arg1, arg2)) the function would simply execute immediately when the code is parsed. Example usage:
	var sayHi = function(name){
	    alert('Hi, ' + name);
	}
	
	// clicking the button alerts "Hi, Fred"
	new Ext.Button({
	    text: 'Say Hi',
	    renderTo: Ext.getBody(),
	    handler: sayHi.createCallback('Fred')
	});
	Parameters:
	None.
	Returns:
	Function
	The new function
	 */
	createCallback: function(){
		var args = arguments;
			method = this;
		return function(){
			return method.apply(window,args);
		}
	},
	
	/**
	 * createDelegate( [Object scope], [Array args], [Boolean/Number appendArgs] ) : Function
	Creates a delegate (callback) that sets the scope to obj. Call directly on any function. Example: this.myFunction.createDelegate(this, [arg1, arg2]) Will create a function that is automatically scoped to obj so that the this variable inside the callback points to obj. Example usage:
	var sayHi = function(name){
	    // Note this use of "this.text" here.  This function expects to
	    // execute within a scope that contains a text property.  In this
	    // example, the "this" variable is pointing to the btn object that
	    // was passed in createDelegate below.
	    alert('Hi, ' + name + '. You clicked the "' + this.text + '" button.');
	}
	
	var btn = new Ext.Button({
	    text: 'Say Hi',
	    renderTo: Ext.getBody()
	});
	
	// This callback will execute in the scope of the
	// button instance. Clicking the button alerts
	// "Hi, Fred. You clicked the "Say Hi" button."
	btn.on('click', sayHi.createDelegate(btn, ['Fred']));
	Parameters:
	scope : Object
	(optional) The scope (this reference) in which the function is executed. If omitted, defaults to the browser window.
	args : Array
	(optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
	appendArgs : Boolean/Number
	(optional) if True args are appended to call args instead of overriding, if a number the args are inserted at the specified position
	Returns:
	Function
	The new function
	 */
	createDelegate:function(obj, args, appendArgs){
	    var method = this;
	    return function() {
	        var callArgs = args || arguments;
	        if (appendArgs === true){
	            callArgs = Array.prototype.slice.call(arguments, 0);
	            callArgs = callArgs.concat(args);
	        }else if (typeof appendArgs === 'number' && isFinite(appendArgs)){
	            callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
	            var applyArgs = [appendArgs, 0].concat(args); // create method call params
	            Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
	        }
	        return method.apply(obj || window, callArgs);
	    };
	}
});

Ab.apply(Date.prototype,{
	format : function(format){ 
		var o = { 
			"M+" : this.getMonth()+1, //month 
			"d+" : this.getDate(), //day 
			"h+" : this.getHours(), //hour 
			"m+" : this.getMinutes(), //minute 
			"s+" : this.getSeconds(), //second 
			"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
			"S" : this.getMilliseconds() //millisecond 
		} 
	
		if(/(y+)/.test(format)) { 
			format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 
	
		for(var k in o) { 
			if(new RegExp("("+ k +")").test(format)) { 
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
			} 
		} 
		return format; 
	} 	
});