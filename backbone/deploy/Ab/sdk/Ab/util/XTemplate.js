/*!
 * Ab
 */
Ab.XTemplate = function(){
    Ab.XTemplate.superclass.constructor.apply(this, arguments);

    var me = this,
        s = me.html,
        re = /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/,
        nameRe = /^<tpl\b[^>]*?for="(.*?)"/,
        ifRe = /^<tpl\b[^>]*?if="(.*?)"/,
        execRe = /^<tpl\b[^>]*?exec="(.*?)"/,
        m,
        id = 0,
        tpls = [],
        VALUES = 'values',
        PARENT = 'parent',
        XINDEX = 'xindex',
        XCOUNT = 'xcount',
        RETURN = 'return ',
        WITHVALUES = 'with(values){ ';

    s = ['<tpl>', s, '</tpl>'].join('');

    while((m = s.match(re))){
        var m2 = m[0].match(nameRe),
            m3 = m[0].match(ifRe),
            m4 = m[0].match(execRe),
            exp = null,
            fn = null,
            exec = null,
            name = m2 && m2[1] ? m2[1] : '';

       if (m3) {
           exp = m3 && m3[1] ? m3[1] : null;
           if(exp){
               fn = new Function(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES + RETURN +(Ab.util.Format.htmlDecode(exp))+'; }');
           }
       }
       if (m4) {
           exp = m4 && m4[1] ? m4[1] : null;
           if(exp){
               exec = new Function(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES +(Ab.util.Format.htmlDecode(exp))+'; }');
           }
       }
       if(name){
           switch(name){
               case '.': name = new Function(VALUES, PARENT, WITHVALUES + RETURN + VALUES + '; }'); break;
               case '..': name = new Function(VALUES, PARENT, WITHVALUES + RETURN + PARENT + '; }'); break;
               default: name = new Function(VALUES, PARENT, WITHVALUES + RETURN + name + '; }');
           }
       }
       tpls.push({
            id: id,
            target: name,
            exec: exec,
            test: fn,
            body: m[1]||''
        });
       s = s.replace(m[0], '{xtpl'+ id + '}');
       ++id;
    }
    for(var i = tpls.length-1; i >= 0; --i){
        me.compileTpl(tpls[i]);
    }
    me.master = tpls[tpls.length-1];
    me.tpls = tpls;
};
Ab.extend(Ab.XTemplate, Ab.Template, {
    // private
    re : /\{([\w\-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\\]\s?[\d\.\+\-\*\\\(\)]+)?\}/g,
    // private
    codeRe : /\{\[((?:\\\]|.|\n)*?)\]\}/g,

    // private
    applySubTemplate : function(id, values, parent, xindex, xcount){
        var me = this,
            len,
            t = me.tpls[id],
            vs,
            buf = [];
        if ((t.test && !t.test.call(me, values, parent, xindex, xcount)) ||
            (t.exec && t.exec.call(me, values, parent, xindex, xcount))) {
            return '';
        }
        vs = t.target ? t.target.call(me, values, parent) : values;
        len = vs.length;
        parent = t.target ? values : parent;
        if(t.target && Ab.isArray(vs)){
            for(var i = 0, len = vs.length; i < len; i++){
                buf[buf.length] = t.compiled.call(me, vs[i], parent, i+1, len);
            }
            return buf.join('');
        }
        return t.compiled.call(me, vs, parent, xindex, xcount);
    },

    // private
    compileTpl : function(tpl){
        var fm = Ab.util.Format,
            useF = this.disableFormats !== true,
            sep = Ab.isGecko ? "+" : ",",
            body;

        function fn(m, name, format, args, math){
            if(name.substr(0, 4) == 'xtpl'){
                return "'"+ sep +'this.applySubTemplate('+name.substr(4)+', values, parent, xindex, xcount)'+sep+"'";
            }
            var v;
            if(name === '.'){
                v = 'values';
            }else if(name === '#'){
                v = 'xindex';
            }else if(name.indexOf('.') != -1){
                v = name;
            }else{
                v = "values['" + name + "']";
            }
            if(math){
                v = '(' + v + math + ')';
            }
            if (format && useF) {
                args = args ? ',' + args : "";
                if(format.substr(0, 5) != "this."){
                    format = "fm." + format + '(';
                }else{
                    format = 'this.call("'+ format.substr(5) + '", ';
                    args = ", values";
                }
            } else {
                args= ''; format = "("+v+" === undefined ? '' : ";
            }
            return "'"+ sep + format + v + args + ")"+sep+"'";
        }

        function codeFn(m, code){
            // Single quotes get escaped when the template is compiled, however we want to undo this when running code.
            return "'" + sep + '(' + code.replace(/\\'/g, "'") + ')' + sep + "'";
        }

        // branched to use + in gecko and [].join() in others
        if(Ab.isGecko){
            body = "tpl.compiled = function(values, parent, xindex, xcount){ return '" +
                   tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn) +
                    "';};";
        }else{
            body = ["tpl.compiled = function(values, parent, xindex, xcount){ return ['"];
            body.push(tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn));
            body.push("'].join('');};");
            body = body.join('');
        }
        eval(body);
        return this;
    },

    /**
     * Returns an HTML fragment of this template with the specified values applied.
     * @param {Object} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @return {String} The HTML fragment
     */
    applyTemplate : function(values){
        return this.master.compiled.call(this, values, {}, 1, 1);
    },

    /**
     * Compile the template to a function for optimized performance.  Recommended if the template will be used frequently.
     * @return {Function} The compiled function
     */
    compile : function(){return this;}

    /**
     * @property re
     * @hide
     */
    /**
     * @property disableFormats
     * @hide
     */
    /**
     * @method set
     * @hide
     */

});
/**
 * Alias for {@link #applyTemplate}
 * Returns an HTML fragment of this template with the specified values applied.
 * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
 * @return {String} The HTML fragment
 * @member Ab.XTemplate
 * @method apply
 */
Ab.XTemplate.prototype.apply = Ab.XTemplate.prototype.applyTemplate;

/**
 * Creates a template from the passed element's value (<i>display:none</i> textarea, preferred) or innerHTML.
 * @param {String/HTMLElement} el A DOM element or its id
 * @return {Ab.Template} The created template
 * @static
 */
Ab.XTemplate.from = function(el){
    el = Ab.getDom(el);
    return new Ab.XTemplate(el.value || el.innerHTML);
};
