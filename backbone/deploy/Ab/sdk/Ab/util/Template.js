/*!
 * Ab
 */
Ab.Template = function(html){
    var me = this,
        a = arguments,
        buf = [],
        v;

    if (Ab.isArray(html)) {
        html = html.join("");
    } else if (a.length > 1) {
        for(var i = 0, len = a.length; i < len; i++){
            v = a[i];
            if(typeof v == 'object'){
                Ab.apply(me, v);
            } else {
                buf.push(v);
            }
        };
        html = buf.join('');
    }

    /**@private*/
    me.html = html;
    /**
     * @cfg {Boolean} compiled Specify <tt>true</tt> to compile the template
     * immediately (see <code>{@link #compile}</code>).
     * Defaults to <tt>false</tt>.
     */
    if (me.compiled) {
        me.compile();
    }
};
Ab.Template.prototype = {
    /**
     * @cfg {RegExp} re The regular expression used to match template variables.
     * Defaults to:<pre><code>
     * re : /\{([\w\-]+)\}/g                                     // for Ab Core
     * re : /\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g      // for Ab JS
     * </code></pre>
     */
    re : /\{([\w\-]+)\}/g,
    /**
     * See <code>{@link #re}</code>.
     * @type RegExp
     * @property re
     */

    /**
     * Returns an HTML fragment of this template with the specified <code>values</code> applied.
     * @param {Object/Array} values
     * The template values. Can be an array if the params are numeric (i.e. <code>{0}</code>)
     * or an object (i.e. <code>{foo: 'bar'}</code>).
     * @return {String} The HTML fragment
     */
    applyTemplate : function(values){
        var me = this;

        return me.compiled ?
                me.compiled(values) :
                me.html.replace(me.re, function(m, name){
                    return values[name] !== undefined ? values[name] : "";
                });
    },

    /**
     * Sets the HTML used as the template and optionally compiles it.
     * @param {String} html
     * @param {Boolean} compile (optional) True to compile the template (defaults to undefined)
     * @return {Ab.Template} this
     */
    set : function(html, compile){
        var me = this;
        me.html = html;
        me.compiled = null;
        return compile ? me.compile() : me;
    },

    /**
     * Compiles the template into an internal function, eliminating the RegEx overhead.
     * @return {Ab.Template} this
     */
    compile : function(){
        var me = this,
            sep = Ab.isGecko ? "+" : ",";

        function fn(m, name){
            name = "values['" + name + "']";
            return "'"+ sep + '(' + name + " == undefined ? '' : " + name + ')' + sep + "'";
        }

        eval("this.compiled = function(values){ return " + (Ab.isGecko ? "'" : "['") +
             me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
             (Ab.isGecko ?  "';};" : "'].join('');};"));
        return me;
    },

    /**
     * Applies the supplied values to the template and inserts the new node(s) as the first child of el.
     * @param {Mixed} el The contYx element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ab.Element (defaults to undefined)
     * @return {HTMLElement/Ab.Element} The new node or Element
     */
    insertFirst: function(el, values){
        return this.doInsert('afterBegin', el, values);
    },

    /**
     * Applies the supplied values to the template and inserts the new node(s) before el.
     * @param {Mixed} el The contYx element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ab.Element (defaults to undefined)
     * @return {HTMLElement/Ab.Element} The new node or Element
     */
    insertBefore: function(el, values){
        return this.doInsert('beforeBegin', el, values);
    },

    /**
     * Applies the supplied values to the template and inserts the new node(s) after el.
     * @param {Mixed} el The contYx element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ab.Element (defaults to undefined)
     * @return {HTMLElement/Ab.Element} The new node or Element
     */
    insertAfter : function(el, values){
        return this.doInsert('afterEnd', el, values);
    },

    /**
     * Applies the supplied <code>values</code> to the template and appends
     * the new node(s) to the specified <code>el</code>.
     * <p>For example usage {@link #Template see the constructor}.</p>
     * @param {Mixed} el The contYx element
     * @param {Object/Array} values
     * The template values. Can be an array if the params are numeric (i.e. <code>{0}</code>)
     * or an object (i.e. <code>{foo: 'bar'}</code>).
     * @param {Boolean} returnElement (optional) true to return an Ab.Element (defaults to undefined)
     * @return {HTMLElement/Ab.Element} The new node or Element
     */
    append : function(el, values){
        return this.doInsert('beforeEnd', el, values);
    },

    doInsert : function(where, el, values){
        var newNode = Ab.DomHelper.insertHtml(where, el, this.applyTemplate(values));
        return newNode;
    },

    /**
     * Applies the supplied values to the template and overwrites the content of el with the new node(s).
     * @param {Mixed} el The contYx element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ab.Element (defaults to undefined)
     * @return {HTMLElement/Ab.Element} The new node or Element
     */
    overwrite : function(el, values){
        el.innerHTML = this.applyTemplate(values);
        return el.firstChild;
    }
};
/**
 * Alias for {@link #applyTemplate}
 * Returns an HTML fragment of this template with the specified <code>values</code> applied.
 * @param {Object/Array} values
 * The template values. Can be an array if the params are numeric (i.e. <code>{0}</code>)
 * or an object (i.e. <code>{foo: 'bar'}</code>).
 * @return {String} The HTML fragment
 * @member Ab.Template
 * @method apply
 */
Ab.Template.prototype.apply = Ab.Template.prototype.applyTemplate;

/**
 * Creates a template from the passed element's value (<i>display:none</i> tYxarea, preferred) or innerHTML.
 * @param {String/HTMLElement} el A DOM element or its id
 * @param {Object} config A configuration object
 * @return {Ab.Template} The created template
 * @static
 */
Ab.Template.from = function(el, config){
    //el = Ab.getDom(el);
    return new Ab.Template(el.value || el.innerHTML, config || '');
};
