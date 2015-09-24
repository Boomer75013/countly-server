//     Underscore.js 1.4.0
//     http://underscorejs.org
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.
(function(){var e=this,t=e._,n={},r=Array.prototype,i=Object.prototype,s=Function.prototype,o=r.push,u=r.slice,a=r.concat,f=r.unshift,l=i.toString,c=i.hasOwnProperty,h=r.forEach,p=r.map,d=r.reduce,v=r.reduceRight,m=r.filter,g=r.every,y=r.some,b=r.indexOf,w=r.lastIndexOf,E=Array.isArray,S=Object.keys,x=s.bind,T=function(e){if(e instanceof T)return e;if(!(this instanceof T))return new T(e);this._wrapped=e};typeof exports!="undefined"?(typeof module!="undefined"&&module.exports&&(exports=module.exports=T),exports._=T):e._=T,T.VERSION="1.4.0";var N=T.each=T.forEach=function(e,t,r){if(h&&e.forEach===h)e.forEach(t,r);else if(e.length===+e.length){for(var i=0,s=e.length;i<s;i++)if(t.call(r,e[i],i,e)===n)return}else for(var o in e)if(T.has(e,o)&&t.call(r,e[o],o,e)===n)return};T.map=T.collect=function(e,t,n){var r=[];return p&&e.map===p?e.map(t,n):(N(e,function(e,i,s){r[r.length]=t.call(n,e,i,s)}),r)},T.reduce=T.foldl=T.inject=function(e,t,n,r){var i=arguments.length>2;if(d&&e.reduce===d)return r&&(t=T.bind(t,r)),i?e.reduce(t,n):e.reduce(t);N(e,function(e,s,o){i?n=t.call(r,n,e,s,o):(n=e,i=!0)});if(!i)throw new TypeError("Reduce of empty array with no initial value");return n},T.reduceRight=T.foldr=function(e,t,n,r){var i=arguments.length>2;if(v&&e.reduceRight===v)return r&&(t=T.bind(t,r)),arguments.length>2?e.reduceRight(t,n):e.reduceRight(t);var s=e.length;if(s!==+s){var o=T.keys(e);s=o.length}N(e,function(u,a,f){a=o?o[--s]:--s,i?n=t.call(r,n,e[a],a,f):(n=e[a],i=!0)});if(!i)throw new TypeError("Reduce of empty array with no initial value");return n},T.find=T.detect=function(e,t,n){var r;return C(e,function(e,i,s){if(t.call(n,e,i,s))return r=e,!0}),r},T.filter=T.select=function(e,t,n){var r=[];return m&&e.filter===m?e.filter(t,n):(N(e,function(e,i,s){t.call(n,e,i,s)&&(r[r.length]=e)}),r)},T.reject=function(e,t,n){var r=[];return N(e,function(e,i,s){t.call(n,e,i,s)||(r[r.length]=e)}),r},T.every=T.all=function(e,t,r){t||(t=T.identity);var i=!0;return g&&e.every===g?e.every(t,r):(N(e,function(e,s,o){if(!(i=i&&t.call(r,e,s,o)))return n}),!!i)};var C=T.some=T.any=function(e,t,r){t||(t=T.identity);var i=!1;return y&&e.some===y?e.some(t,r):(N(e,function(e,s,o){if(i||(i=t.call(r,e,s,o)))return n}),!!i)};T.contains=T.include=function(e,t){var n=!1;return b&&e.indexOf===b?e.indexOf(t)!=-1:(n=C(e,function(e){return e===t}),n)},T.invoke=function(e,t){var n=u.call(arguments,2);return T.map(e,function(e){return(T.isFunction(t)?t:e[t]).apply(e,n)})},T.pluck=function(e,t){return T.map(e,function(e){return e[t]})},T.where=function(e,t){return T.isEmpty(t)?[]:T.filter(e,function(e){for(var n in t)if(t[n]!==e[n])return!1;return!0})},T.max=function(e,t,n){if(!t&&T.isArray(e)&&e[0]===+e[0]&&e.length<65535)return Math.max.apply(Math,e);if(!t&&T.isEmpty(e))return-Infinity;var r={computed:-Infinity};return N(e,function(e,i,s){var o=t?t.call(n,e,i,s):e;o>=r.computed&&(r={value:e,computed:o})}),r.value},T.min=function(e,t,n){if(!t&&T.isArray(e)&&e[0]===+e[0]&&e.length<65535)return Math.min.apply(Math,e);if(!t&&T.isEmpty(e))return Infinity;var r={computed:Infinity};return N(e,function(e,i,s){var o=t?t.call(n,e,i,s):e;o<r.computed&&(r={value:e,computed:o})}),r.value},T.shuffle=function(e){var t,n=0,r=[];return N(e,function(e){t=T.random(n++),r[n-1]=r[t],r[t]=e}),r};var k=function(e){return T.isFunction(e)?e:function(t){return t[e]}};T.sortBy=function(e,t,n){var r=k(t);return T.pluck(T.map(e,function(e,t,i){return{value:e,index:t,criteria:r.call(n,e,t,i)}}).sort(function(e,t){var n=e.criteria,r=t.criteria;if(n!==r){if(n>r||n===void 0)return 1;if(n<r||r===void 0)return-1}return e.index<t.index?-1:1}),"value")};var L=function(e,t,n,r){var i={},s=k(t);return N(e,function(t,o){var u=s.call(n,t,o,e);r(i,u,t)}),i};T.groupBy=function(e,t,n){return L(e,t,n,function(e,t,n){(T.has(e,t)?e[t]:e[t]=[]).push(n)})},T.countBy=function(e,t,n){return L(e,t,n,function(e,t,n){T.has(e,t)||(e[t]=0),e[t]++})},T.sortedIndex=function(e,t,n,r){n=n==null?T.identity:k(n);var i=n.call(r,t),s=0,o=e.length;while(s<o){var u=s+o>>>1;n.call(r,e[u])<i?s=u+1:o=u}return s},T.toArray=function(e){return e?e.length===+e.length?u.call(e):T.values(e):[]},T.size=function(e){return e.length===+e.length?e.length:T.keys(e).length},T.first=T.head=T.take=function(e,t,n){return t!=null&&!n?u.call(e,0,t):e[0]},T.initial=function(e,t,n){return u.call(e,0,e.length-(t==null||n?1:t))},T.last=function(e,t,n){return t!=null&&!n?u.call(e,Math.max(e.length-t,0)):e[e.length-1]},T.rest=T.tail=T.drop=function(e,t,n){return u.call(e,t==null||n?1:t)},T.compact=function(e){return T.filter(e,function(e){return!!e})};var A=function(e,t,n){return N(e,function(e){T.isArray(e)?t?o.apply(n,e):A(e,t,n):n.push(e)}),n};T.flatten=function(e,t){return A(e,t,[])},T.without=function(e){return T.difference(e,u.call(arguments,1))},T.uniq=T.unique=function(e,t,n,r){var i=n?T.map(e,n,r):e,s=[],o=[];return N(i,function(n,r){if(t?!r||o[o.length-1]!==n:!T.contains(o,n))o.push(n),s.push(e[r])}),s},T.union=function(){return T.uniq(a.apply(r,arguments))},T.intersection=function(e){var t=u.call(arguments,1);return T.filter(T.uniq(e),function(e){return T.every(t,function(t){return T.indexOf(t,e)>=0})})},T.difference=function(e){var t=a.apply(r,u.call(arguments,1));return T.filter(e,function(e){return!T.contains(t,e)})},T.zip=function(){var e=u.call(arguments),t=T.max(T.pluck(e,"length")),n=new Array(t);for(var r=0;r<t;r++)n[r]=T.pluck(e,""+r);return n},T.object=function(e,t){var n={};for(var r=0,i=e.length;r<i;r++)t?n[e[r]]=t[r]:n[e[r][0]]=e[r][1];return n},T.indexOf=function(e,t,n){var r=0,i=e.length;if(n){if(typeof n!="number")return r=T.sortedIndex(e,t),e[r]===t?r:-1;r=n<0?Math.max(0,i+n):n}if(b&&e.indexOf===b)return e.indexOf(t,n);for(;r<i;r++)if(e[r]===t)return r;return-1},T.lastIndexOf=function(e,t,n){if(w&&e.lastIndexOf===w)return e.lastIndexOf(t,n);var r=n!=null?n:e.length;while(r--)if(e[r]===t)return r;return-1},T.range=function(e,t,n){arguments.length<=1&&(t=e||0,e=0),n=arguments[2]||1;var r=Math.max(Math.ceil((t-e)/n),0),i=0,s=new Array(r);while(i<r)s[i++]=e,e+=n;return s};var O=function(){};T.bind=function(t,n){var r,i;if(t.bind===x&&x)return x.apply(t,u.call(arguments,1));if(!T.isFunction(t))throw new TypeError;return i=u.call(arguments,2),r=function(){if(this instanceof r){O.prototype=t.prototype;var e=new O,s=t.apply(e,i.concat(u.call(arguments)));return Object(s)===s?s:e}return t.apply(n,i.concat(u.call(arguments)))}},T.bindAll=function(e){var t=u.call(arguments,1);return t.length==0&&(t=T.functions(e)),N(t,function(t){e[t]=T.bind(e[t],e)}),e},T.memoize=function(e,t){var n={};return t||(t=T.identity),function(){var r=t.apply(this,arguments);return T.has(n,r)?n[r]:n[r]=e.apply(this,arguments)}},T.delay=function(e,t){var n=u.call(arguments,2);return setTimeout(function(){return e.apply(null,n)},t)},T.defer=function(e){return T.delay.apply(T,[e,1].concat(u.call(arguments,1)))},T.throttle=function(e,t){var n,r,i,s,o,u,a=T.debounce(function(){o=s=!1},t);return function(){n=this,r=arguments;var f=function(){i=null,o&&(u=e.apply(n,r)),a()};return i||(i=setTimeout(f,t)),s?o=!0:(s=!0,u=e.apply(n,r)),a(),u}},T.debounce=function(e,t,n){var r,i;return function(){var s=this,o=arguments,u=function(){r=null,n||(i=e.apply(s,o))},a=n&&!r;return clearTimeout(r),r=setTimeout(u,t),a&&(i=e.apply(s,o)),i}},T.once=function(e){var t=!1,n;return function(){return t?n:(t=!0,n=e.apply(this,arguments),e=null,n)}},T.wrap=function(e,t){return function(){var n=[e];return o.apply(n,arguments),t.apply(this,n)}},T.compose=function(){var e=arguments;return function(){var t=arguments;for(var n=e.length-1;n>=0;n--)t=[e[n].apply(this,t)];return t[0]}},T.after=function(e,t){return e<=0?t():function(){if(--e<1)return t.apply(this,arguments)}},T.keys=S||function(e){if(e!==Object(e))throw new TypeError("Invalid object");var t=[];for(var n in e)T.has(e,n)&&(t[t.length]=n);return t},T.values=function(e){var t=[];for(var n in e)T.has(e,n)&&t.push(e[n]);return t},T.pairs=function(e){var t=[];for(var n in e)T.has(e,n)&&t.push([n,e[n]]);return t},T.invert=function(e){var t={};for(var n in e)T.has(e,n)&&(t[e[n]]=n);return t},T.functions=T.methods=function(e){var t=[];for(var n in e)T.isFunction(e[n])&&t.push(n);return t.sort()},T.extend=function(e){return N(u.call(arguments,1),function(t){for(var n in t)e[n]=t[n]}),e},T.pick=function(e){var t={},n=a.apply(r,u.call(arguments,1));return N(n,function(n){n in e&&(t[n]=e[n])}),t},T.omit=function(e){var t={},n=a.apply(r,u.call(arguments,1));for(var i in e)T.contains(n,i)||(t[i]=e[i]);return t},T.defaults=function(e){return N(u.call(arguments,1),function(t){for(var n in t)e[n]==null&&(e[n]=t[n])}),e},T.clone=function(e){return T.isObject(e)?T.isArray(e)?e.slice():T.extend({},e):e},T.tap=function(e,t){return t(e),e};var M=function(e,t,n,r){if(e===t)return e!==0||1/e==1/t;if(e==null||t==null)return e===t;e instanceof T&&(e=e._wrapped),t instanceof T&&(t=t._wrapped);var i=l.call(e);if(i!=l.call(t))return!1;switch(i){case"[object String]":return e==String(t);case"[object Number]":return e!=+e?t!=+t:e==0?1/e==1/t:e==+t;case"[object Date]":case"[object Boolean]":return+e==+t;case"[object RegExp]":return e.source==t.source&&e.global==t.global&&e.multiline==t.multiline&&e.ignoreCase==t.ignoreCase}if(typeof e!="object"||typeof t!="object")return!1;var s=n.length;while(s--)if(n[s]==e)return r[s]==t;n.push(e),r.push(t);var o=0,u=!0;if(i=="[object Array]"){o=e.length,u=o==t.length;if(u)while(o--)if(!(u=M(e[o],t[o],n,r)))break}else{var a=e.constructor,f=t.constructor;if(a!==f&&!(T.isFunction(a)&&a instanceof a&&T.isFunction(f)&&f instanceof f))return!1;for(var c in e)if(T.has(e,c)){o++;if(!(u=T.has(t,c)&&M(e[c],t[c],n,r)))break}if(u){for(c in t)if(T.has(t,c)&&!(o--))break;u=!o}}return n.pop(),r.pop(),u};T.isEqual=function(e,t){return M(e,t,[],[])},T.isEmpty=function(e){if(e==null)return!0;if(T.isArray(e)||T.isString(e))return e.length===0;for(var t in e)if(T.has(e,t))return!1;return!0},T.isElement=function(e){return!!e&&e.nodeType===1},T.isArray=E||function(e){return l.call(e)=="[object Array]"},T.isObject=function(e){return e===Object(e)},N(["Arguments","Function","String","Number","Date","RegExp"],function(e){T["is"+e]=function(t){return l.call(t)=="[object "+e+"]"}}),T.isArguments(arguments)||(T.isArguments=function(e){return!!e&&!!T.has(e,"callee")}),typeof /./!="function"&&(T.isFunction=function(e){return typeof e=="function"}),T.isFinite=function(e){return T.isNumber(e)&&isFinite(e)},T.isNaN=function(e){return T.isNumber(e)&&e!=+e},T.isBoolean=function(e){return e===!0||e===!1||l.call(e)=="[object Boolean]"},T.isNull=function(e){return e===null},T.isUndefined=function(e){return e===void 0},T.has=function(e,t){return c.call(e,t)},T.noConflict=function(){return e._=t,this},T.identity=function(e){return e},T.times=function(e,t,n){for(var r=0;r<e;r++)t.call(n,r)},T.random=function(e,t){return t==null&&(t=e,e=0),e+(0|Math.random()*(t-e+1))};var _={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};_.unescape=T.invert(_.escape);var D={escape:new RegExp("["+T.keys(_.escape).join("")+"]","g"),unescape:new RegExp("("+T.keys(_.unescape).join("|")+")","g")};T.each(["escape","unescape"],function(e){T[e]=function(t){return t==null?"":(""+t).replace(D[e],function(t){return _[e][t]})}}),T.result=function(e,t){if(e==null)return null;var n=e[t];return T.isFunction(n)?n.call(e):n},T.mixin=function(e){N(T.functions(e),function(t){var n=T[t]=e[t];T.prototype[t]=function(){var e=[this._wrapped];return o.apply(e,arguments),F.call(this,n.apply(T,e))}})};var P=0;T.uniqueId=function(e){var t=P++;return e?e+t:t},T.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var H=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},j=/\\|'|\r|\n|\t|\u2028|\u2029/g;T.template=function(e,t,n){n=T.defaults({},n,T.templateSettings);var r=new RegExp([(n.escape||H).source,(n.interpolate||H).source,(n.evaluate||H).source].join("|")+"|$","g"),i=0,s="__p+='";e.replace(r,function(t,n,r,o,u){s+=e.slice(i,u).replace(j,function(e){return"\\"+B[e]}),s+=n?"'+\n((__t=("+n+"))==null?'':_.escape(__t))+\n'":r?"'+\n((__t=("+r+"))==null?'':__t)+\n'":o?"';\n"+o+"\n__p+='":"",i=u+t.length}),s+="';\n",n.variable||(s="with(obj||{}){\n"+s+"}\n"),s="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+s+"return __p;\n";try{var o=new Function(n.variable||"obj","_",s)}catch(u){throw u.source=s,u}if(t)return o(t,T);var a=function(e){return o.call(this,e,T)};return a.source="function("+(n.variable||"obj")+"){\n"+s+"}",a},T.chain=function(e){return T(e).chain()};var F=function(e){return this._chain?T(e).chain():e};T.mixin(T),N(["pop","push","reverse","shift","sort","splice","unshift"],function(e){var t=r[e];T.prototype[e]=function(){var n=this._wrapped;return t.apply(n,arguments),(e=="shift"||e=="splice")&&n.length===0&&delete n[0],F.call(this,n)}}),N(["concat","join","slice"],function(e){var t=r[e];T.prototype[e]=function(){return F.call(this,t.apply(this._wrapped,arguments))}}),T.extend(T.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);;/**
 * StyleFix 1.0.3 & PrefixFree 1.0.7
 * @author Lea Verou
 * MIT license
 */(function(){function t(e,t){return[].slice.call((t||document).querySelectorAll(e))}if(!window.addEventListener)return;var e=window.StyleFix={link:function(t){try{if(t.rel!=="stylesheet"||t.hasAttribute("data-noprefix"))return}catch(n){return}var r=t.href||t.getAttribute("data-href"),i=r.replace(/[^\/]+$/,""),s=t.parentNode,o=new XMLHttpRequest,u;o.onreadystatechange=function(){o.readyState===4&&u()};u=function(){var n=o.responseText;if(n&&t.parentNode&&(!o.status||o.status<400||o.status>600)){n=e.fix(n,!0,t);if(i){n=n.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi,function(e,t,n){return/^([a-z]{3,10}:|\/|#)/i.test(n)?e:'url("'+i+n+'")'});var r=i.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1");n=n.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)"+r,"gi"),"$1")}var u=document.createElement("style");u.textContent=n;u.media=t.media;u.disabled=t.disabled;u.setAttribute("data-href",t.getAttribute("href"));s.insertBefore(u,t);s.removeChild(t);u.media=t.media}};try{o.open("GET",r);o.send(null)}catch(n){if(typeof XDomainRequest!="undefined"){o=new XDomainRequest;o.onerror=o.onprogress=function(){};o.onload=u;o.open("GET",r);o.send(null)}}t.setAttribute("data-inprogress","")},styleElement:function(t){if(t.hasAttribute("data-noprefix"))return;var n=t.disabled;t.textContent=e.fix(t.textContent,!0,t);t.disabled=n},styleAttribute:function(t){var n=t.getAttribute("style");n=e.fix(n,!1,t);t.setAttribute("style",n)},process:function(){t('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);t("style").forEach(StyleFix.styleElement);t("[style]").forEach(StyleFix.styleAttribute)},register:function(t,n){(e.fixers=e.fixers||[]).splice(n===undefined?e.fixers.length:n,0,t)},fix:function(t,n,r){for(var i=0;i<e.fixers.length;i++)t=e.fixers[i](t,n,r)||t;return t},camelCase:function(e){return e.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()}).replace("-","")},deCamelCase:function(e){return e.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()})}};(function(){setTimeout(function(){t('link[rel="stylesheet"]').forEach(StyleFix.link)},10);document.addEventListener("DOMContentLoaded",StyleFix.process,!1)})()})();(function(e){function t(e,t,r,i,s){e=n[e];if(e.length){var o=RegExp(t+"("+e.join("|")+")"+r,"gi");s=s.replace(o,i)}return s}if(!window.StyleFix||!window.getComputedStyle)return;var n=window.PrefixFree={prefixCSS:function(e,r,i){var s=n.prefix;n.functions.indexOf("linear-gradient")>-1&&(e=e.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig,function(e,t,n,r){return t+(n||"")+"linear-gradient("+(90-r)+"deg"}));e=t("functions","(\\s|:|,)","\\s*\\(","$1"+s+"$2(",e);e=t("keywords","(\\s|:)","(\\s|;|\\}|$)","$1"+s+"$2$3",e);e=t("properties","(^|\\{|\\s|;)","\\s*:","$1"+s+"$2:",e);if(n.properties.length){var o=RegExp("\\b("+n.properties.join("|")+")(?!:)","gi");e=t("valueProperties","\\b",":(.+?);",function(e){return e.replace(o,s+"$1")},e)}if(r){e=t("selectors","","\\b",n.prefixSelector,e);e=t("atrules","@","\\b","@"+s+"$1",e)}e=e.replace(RegExp("-"+s,"g"),"-");e=e.replace(/-\*-(?=[a-z]+)/gi,n.prefix);return e},property:function(e){return(n.properties.indexOf(e)?n.prefix:"")+e},value:function(e,r){e=t("functions","(^|\\s|,)","\\s*\\(","$1"+n.prefix+"$2(",e);e=t("keywords","(^|\\s)","(\\s|$)","$1"+n.prefix+"$2$3",e);return e},prefixSelector:function(e){return e.replace(/^:{1,2}/,function(e){return e+n.prefix})},prefixProperty:function(e,t){var r=n.prefix+e;return t?StyleFix.camelCase(r):r}};(function(){var e={},t=[],r={},i=getComputedStyle(document.documentElement,null),s=document.createElement("div").style,o=function(n){if(n.charAt(0)==="-"){t.push(n);var r=n.split("-"),i=r[1];e[i]=++e[i]||1;while(r.length>3){r.pop();var s=r.join("-");u(s)&&t.indexOf(s)===-1&&t.push(s)}}},u=function(e){return StyleFix.camelCase(e)in s};if(i.length>0)for(var a=0;a<i.length;a++)o(i[a]);else for(var f in i)o(StyleFix.deCamelCase(f));var l={uses:0};for(var c in e){var h=e[c];l.uses<h&&(l={prefix:c,uses:h})}n.prefix="-"+l.prefix+"-";n.Prefix=StyleFix.camelCase(n.prefix);n.properties=[];for(var a=0;a<t.length;a++){var f=t[a];if(f.indexOf(n.prefix)===0){var p=f.slice(n.prefix.length);u(p)||n.properties.push(p)}}n.Prefix=="Ms"&&!("transform"in s)&&!("MsTransform"in s)&&"msTransform"in s&&n.properties.push("transform","transform-origin");n.properties.sort()})();(function(){function i(e,t){r[t]="";r[t]=e;return!!r[t]}var e={"linear-gradient":{property:"backgroundImage",params:"red, teal"},calc:{property:"width",params:"1px + 5%"},element:{property:"backgroundImage",params:"#foo"},"cross-fade":{property:"backgroundImage",params:"url(a.png), url(b.png), 50%"}};e["repeating-linear-gradient"]=e["repeating-radial-gradient"]=e["radial-gradient"]=e["linear-gradient"];var t={initial:"color","zoom-in":"cursor","zoom-out":"cursor",box:"display",flexbox:"display","inline-flexbox":"display",flex:"display","inline-flex":"display"};n.functions=[];n.keywords=[];var r=document.createElement("div").style;for(var s in e){var o=e[s],u=o.property,a=s+"("+o.params+")";!i(a,u)&&i(n.prefix+a,u)&&n.functions.push(s)}for(var f in t){var u=t[f];!i(f,u)&&i(n.prefix+f,u)&&n.keywords.push(f)}})();(function(){function s(e){i.textContent=e+"{}";return!!i.sheet.cssRules.length}var t={":read-only":null,":read-write":null,":any-link":null,"::selection":null},r={keyframes:"name",viewport:null,document:'regexp(".")'};n.selectors=[];n.atrules=[];var i=e.appendChild(document.createElement("style"));for(var o in t){var u=o+(t[o]?"("+t[o]+")":"");!s(u)&&s(n.prefixSelector(u))&&n.selectors.push(o)}for(var a in r){var u=a+" "+(r[a]||"");!s("@"+u)&&s("@"+n.prefix+u)&&n.atrules.push(a)}e.removeChild(i)})();n.valueProperties=["transition","transition-property"];e.className+=" "+n.prefix;StyleFix.register(n.prefixCSS)})(document.documentElement);;// moment.js
// version : 1.7.0
// author : Tim Wood
// license : MIT
// momentjs.com
(function(a,b){function G(a,b,c){this._d=a,this._isUTC=!!b,this._a=a._a||null,a._a=null,this._lang=c||!1}function H(a){var b=this._data={},c=a.years||a.y||0,d=a.months||a.M||0,e=a.weeks||a.w||0,f=a.days||a.d||0,g=a.hours||a.h||0,h=a.minutes||a.m||0,i=a.seconds||a.s||0,j=a.milliseconds||a.ms||0;this._milliseconds=j+i*1e3+h*6e4+g*36e5,this._days=f+e*7,this._months=d+c*12,b.milliseconds=j%1e3,i+=I(j/1e3),b.seconds=i%60,h+=I(i/60),b.minutes=h%60,g+=I(h/60),b.hours=g%24,f+=I(g/24),f+=e*7,b.days=f%30,d+=I(f/30),b.months=d%12,c+=I(d/12),b.years=c,this._lang=!1}function I(a){return a<0?Math.ceil(a):Math.floor(a)}function J(a,b){var c=a+"";while(c.length<b)c="0"+c;return c}function K(a,b,c){var d=b._milliseconds,e=b._days,f=b._months,g;d&&a._d.setTime(+a+d*c),e&&a.date(a.date()+e*c),f&&(g=a.date(),a.date(1).month(a.month()+f*c).date(Math.min(g,a.daysInMonth())))}function L(a){return Object.prototype.toString.call(a)==="[object Array]"}function M(a,b){var c=Math.min(a.length,b.length),d=Math.abs(a.length-b.length),e=0,f;for(f=0;f<c;f++)~~a[f]!==~~b[f]&&e++;return e+d}function N(b,c){var d,e;for(d=1;d<7;d++)b[d]=b[d]==null?d===2?1:0:b[d];return b[7]=c,e=new a(0),c?(e.setUTCFullYear(b[0],b[1],b[2]),e.setUTCHours(b[3],b[4],b[5],b[6])):(e.setFullYear(b[0],b[1],b[2]),e.setHours(b[3],b[4],b[5],b[6])),e._a=b,e}function O(a,b){var d,e,f=[];!b&&i&&(b=require("./lang/"+a));for(d=0;d<j.length;d++)b[j[d]]=b[j[d]]||g.en[j[d]];for(d=0;d<12;d++)e=c([2e3,d]),f[d]=new RegExp("^"+(b.months[d]||b.months(e,""))+"|^"+(b.monthsShort[d]||b.monthsShort(e,"")).replace(".",""),"i");return b.monthsParse=b.monthsParse||f,g[a]=b,b}function P(a){var b=typeof a=="string"&&a||a&&a._lang||null;return b?g[b]||O(b):c}function Q(a){return D[a]?"'+("+D[a]+")+'":a.replace(n,"").replace(/\\?'/g,"\\'")}function R(a){return P().longDateFormat[a]||a}function S(a){var b="var a,b;return '"+a.replace(l,Q)+"';",c=Function;return new c("t","v","o","p","m",b)}function T(a){return C[a]||(C[a]=S(a)),C[a]}function U(a,b){function d(d,e){return c[d].call?c[d](a,b):c[d][e]}var c=P(a);while(m.test(b))b=b.replace(m,R);return C[b]||(C[b]=S(b)),C[b](a,d,c.ordinal,J,c.meridiem)}function V(a){switch(a){case"DDDD":return r;case"YYYY":return s;case"S":case"SS":case"SSS":case"DDD":return q;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":case"a":case"A":return t;case"Z":case"ZZ":return u;case"T":return v;case"MM":case"DD":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return p;default:return new RegExp(a.replace("\\",""))}}function W(a,b,c,d){var e;switch(a){case"M":case"MM":c[1]=b==null?0:~~b-1;break;case"MMM":case"MMMM":for(e=0;e<12;e++)if(P().monthsParse[e].test(b)){c[1]=e;break}break;case"D":case"DD":case"DDD":case"DDDD":b!=null&&(c[2]=~~b);break;case"YY":b=~~b,c[0]=b+(b>70?1900:2e3);break;case"YYYY":c[0]=~~Math.abs(b);break;case"a":case"A":d.isPm=(b+"").toLowerCase()==="pm";break;case"H":case"HH":case"h":case"hh":c[3]=~~b;break;case"m":case"mm":c[4]=~~b;break;case"s":case"ss":c[5]=~~b;break;case"S":case"SS":case"SSS":c[6]=~~(("0."+b)*1e3);break;case"Z":case"ZZ":d.isUTC=!0,e=(b+"").match(z),e&&e[1]&&(d.tzh=~~e[1]),e&&e[2]&&(d.tzm=~~e[2]),e&&e[0]==="+"&&(d.tzh=-d.tzh,d.tzm=-d.tzm)}}function X(a,b){var c=[0,0,1,0,0,0,0],d={tzh:0,tzm:0},e=b.match(l),f,g;for(f=0;f<e.length;f++)g=(V(e[f]).exec(a)||[])[0],a=a.replace(V(e[f]),""),W(e[f],g,c,d);return d.isPm&&c[3]<12&&(c[3]+=12),d.isPm===!1&&c[3]===12&&(c[3]=0),c[3]+=d.tzh,c[4]+=d.tzm,N(c,d.isUTC)}function Y(a,b){var c,d=a.match(o)||[],e,f=99,g,h,i;for(g=0;g<b.length;g++)h=X(a,b[g]),e=U(new G(h),b[g]).match(o)||[],i=M(d,e),i<f&&(f=i,c=h);return c}function Z(b){var c="YYYY-MM-DDT",d;if(w.exec(b)){for(d=0;d<4;d++)if(y[d][1].exec(b)){c+=y[d][0];break}return u.exec(b)?X(b,c+" Z"):X(b,c)}return new a(b)}function $(a,b,c,d,e){var f=e.relativeTime[a];return typeof f=="function"?f(b||1,!!c,a,d):f.replace(/%d/i,b||1)}function _(a,b,c){var d=e(Math.abs(a)/1e3),f=e(d/60),g=e(f/60),h=e(g/24),i=e(h/365),j=d<45&&["s",d]||f===1&&["m"]||f<45&&["mm",f]||g===1&&["h"]||g<22&&["hh",g]||h===1&&["d"]||h<=25&&["dd",h]||h<=45&&["M"]||h<345&&["MM",e(h/30)]||i===1&&["y"]||["yy",i];return j[2]=b,j[3]=a>0,j[4]=c,$.apply({},j)}function ab(a,b){c.fn[a]=function(a){var c=this._isUTC?"UTC":"";return a!=null?(this._d["set"+c+b](a),this):this._d["get"+c+b]()}}function bb(a){c.duration.fn[a]=function(){return this._data[a]}}function cb(a,b){c.duration.fn["as"+a]=function(){return+this/b}}var c,d="1.7.0",e=Math.round,f,g={},h="en",i=typeof module!="undefined"&&module.exports,j="months|monthsShort|weekdays|weekdaysShort|weekdaysMin|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"),k=/^\/?Date\((\-?\d+)/i,l=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?)/g,m=/(LT|LL?L?L?)/g,n=/(^\[)|(\\)|\]$/g,o=/([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,p=/\d\d?/,q=/\d{1,3}/,r=/\d{3}/,s=/\d{1,4}/,t=/[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i,u=/Z|[\+\-]\d\d:?\d\d/i,v=/T/i,w=/^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,x="YYYY-MM-DDTHH:mm:ssZ",y=[["HH:mm:ss.S",/T\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/T\d\d:\d\d:\d\d/],["HH:mm",/T\d\d:\d\d/],["HH",/T\d\d/]],z=/([\+\-]|\d\d)/gi,A="Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"),B={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},C={},D={M:"(a=t.month()+1)",MMM:'v("monthsShort",t.month())',MMMM:'v("months",t.month())',D:"(a=t.date())",DDD:"(a=new Date(t.year(),t.month(),t.date()),b=new Date(t.year(),0,1),a=~~(((a-b)/864e5)+1.5))",d:"(a=t.day())",dd:'v("weekdaysMin",t.day())',ddd:'v("weekdaysShort",t.day())',dddd:'v("weekdays",t.day())',w:"(a=new Date(t.year(),t.month(),t.date()-t.day()+5),b=new Date(a.getFullYear(),0,4),a=~~((a-b)/864e5/7+1.5))",YY:"p(t.year()%100,2)",YYYY:"p(t.year(),4)",a:"m(t.hours(),t.minutes(),!0)",A:"m(t.hours(),t.minutes(),!1)",H:"t.hours()",h:"t.hours()%12||12",m:"t.minutes()",s:"t.seconds()",S:"~~(t.milliseconds()/100)",SS:"p(~~(t.milliseconds()/10),2)",SSS:"p(t.milliseconds(),3)",Z:'((a=-t.zone())<0?((a=-a),"-"):"+")+p(~~(a/60),2)+":"+p(~~a%60,2)',ZZ:'((a=-t.zone())<0?((a=-a),"-"):"+")+p(~~(10*a/6),4)'},E="DDD w M D d".split(" "),F="M D H h m s w".split(" ");while(E.length)f=E.pop(),D[f+"o"]=D[f]+"+o(a)";while(F.length)f=F.pop(),D[f+f]="p("+D[f]+",2)";D.DDDD="p("+D.DDD+",3)",c=function(d,e){if(d===null||d==="")return null;var f,g;return c.isMoment(d)?new G(new a(+d._d),d._isUTC,d._lang):(e?L(e)?f=Y(d,e):f=X(d,e):(g=k.exec(d),f=d===b?new a:g?new a(+g[1]):d instanceof a?d:L(d)?N(d):typeof d=="string"?Z(d):new a(d)),new G(f))},c.utc=function(a,b){return L(a)?new G(N(a,!0),!0):(typeof a=="string"&&!u.exec(a)&&(a+=" +0000",b&&(b+=" Z")),c(a,b).utc())},c.unix=function(a){return c(a*1e3)},c.duration=function(a,b){var d=c.isDuration(a),e=typeof a=="number",f=d?a._data:e?{}:a,g;return e&&(b?f[b]=a:f.milliseconds=a),g=new H(f),d&&(g._lang=a._lang),g},c.humanizeDuration=function(a,b,d){return c.duration(a,b===!0?null:b).humanize(b===!0?!0:d)},c.version=d,c.defaultFormat=x,c.lang=function(a,b){var d;if(!a)return h;(b||!g[a])&&O(a,b);if(g[a]){for(d=0;d<j.length;d++)c[j[d]]=g[a][j[d]];c.monthsParse=g[a].monthsParse,h=a}},c.langData=P,c.isMoment=function(a){return a instanceof G},c.isDuration=function(a){return a instanceof H},c.lang("en",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinal:function(a){var b=a%10;return~~(a%100/10)===1?"th":b===1?"st":b===2?"nd":b===3?"rd":"th"}}),c.fn=G.prototype={clone:function(){return c(this)},valueOf:function(){return+this._d},unix:function(){return Math.floor(+this._d/1e3)},toString:function(){return this._d.toString()},toDate:function(){return this._d},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds(),!!this._isUTC]},isValid:function(){return this._a?!M(this._a,(this._a[7]?c.utc(this):this).toArray()):!isNaN(this._d.getTime())},utc:function(){return this._isUTC=!0,this},local:function(){return this._isUTC=!1,this},format:function(a){return U(this,a?a:c.defaultFormat)},add:function(a,b){var d=b?c.duration(+b,a):c.duration(a);return K(this,d,1),this},subtract:function(a,b){var d=b?c.duration(+b,a):c.duration(a);return K(this,d,-1),this},diff:function(a,b,d){var f=this._isUTC?c(a).utc():c(a).local(),g=(this.zone()-f.zone())*6e4,h=this._d-f._d-g,i=this.year()-f.year(),j=this.month()-f.month(),k=this.date()-f.date(),l;return b==="months"?l=i*12+j+k/30:b==="years"?l=i+(j+k/30)/12:l=b==="seconds"?h/1e3:b==="minutes"?h/6e4:b==="hours"?h/36e5:b==="days"?h/864e5:b==="weeks"?h/6048e5:h,d?l:e(l)},from:function(a,b){return c.duration(this.diff(a)).lang(this._lang).humanize(!b)},fromNow:function(a){return this.from(c(),a)},calendar:function(){var a=this.diff(c().sod(),"days",!0),b=this.lang().calendar,d=b.sameElse,e=a<-6?d:a<-1?b.lastWeek:a<0?b.lastDay:a<1?b.sameDay:a<2?b.nextDay:a<7?b.nextWeek:d;return this.format(typeof e=="function"?e.apply(this):e)},isLeapYear:function(){var a=this.year();return a%4===0&&a%100!==0||a%400===0},isDST:function(){return this.zone()<c([this.year()]).zone()||this.zone()<c([this.year(),5]).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return a==null?b:this.add({d:a-b})},startOf:function(a){switch(a.replace(/s$/,"")){case"year":this.month(0);case"month":this.date(1);case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return this},endOf:function(a){return this.startOf(a).add(a.replace(/s?$/,"s"),1).subtract("ms",1)},sod:function(){return this.clone().startOf("day")},eod:function(){return this.clone().endOf("day")},zone:function(){return this._isUTC?0:this._d.getTimezoneOffset()},daysInMonth:function(){return c.utc([this.year(),this.month()+1,0]).date()},lang:function(a){return a===b?P(this):(this._lang=a,this)}};for(f=0;f<A.length;f++)ab(A[f].toLowerCase(),A[f]);ab("year","FullYear"),c.duration.fn=H.prototype={weeks:function(){return I(this.days()/7)},valueOf:function(){return this._milliseconds+this._days*864e5+this._months*2592e6},humanize:function(a){var b=+this,c=this.lang().relativeTime,d=_(b,!a,this.lang());return a&&(d=(b<=0?c.past:c.future).replace(/%s/i,d)),d},lang:c.fn.lang};for(f in B)B.hasOwnProperty(f)&&(cb(f,B[f]),bb(f.toLowerCase()));cb("Weeks",6048e5),i&&(module.exports=c),typeof ender=="undefined"&&(this.moment=c),typeof define=="function"&&define.amd&&define("moment",[],function(){return c})}).call(this,Date);;"undefined"!==typeof require&&(moment=require("moment"));
(function(c){var f=function(a){var a=c([a]),b=a.day();0===b&&(b=7);4<b&&a.add("weeks",1);a.subtract("days",b-1);return a},g=["year","week","day","minute"],h=function(a){return function(b){if(b){var d=this.isocalendar();d[a]=b;this._d=c.fromIsocalendar(d).toDate();b=this}else b=this.isocalendar()[a];return b}};c.fn.isocalendar=function(){var a=this.year(),b=f(a),b=Math.floor(this.diff(b,"weeks",!0))+1,d=this.day(),e=60*this.hours()+this.minutes();53==b&&f(a+1)<=this?(a+=1,b=1):1>b&&(a-=1,b=c([a,11,
31,0,0]).isocalendar()[1]);0===d&&(d=7);return[a,b,d,e]};c.fromIsocalendar=function(a){return f(a[0]).add({weeks:a[1]-1,days:a[2]-1,minutes:a[3]})};for(var e=0,i=g.length;e<i;e++)c.fn["iso"+g[e]]=h(e)})(moment);;// moment.js language configuration
// language : bulgarian (bg)
// author : Krasen Borisov : https://github.com/kraz
(function(){var a={months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"h:mm",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},ordinal:function(a){return"."}};typeof module!="undefined"&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("bg",a)})(),function(){var a={months:"Gener_Febrer_Març_Abril_Maig_Juny_Juliol_Agost_Setembre_Octubre_Novembre_Desembre".split("_"),monthsShort:"Gen._Febr._Mar._Abr._Mai._Jun._Jul._Ag._Set._Oct._Nov._Des.".split("_"),weekdays:"Diumenge_Dilluns_Dimarts_Dimecres_Dijous_Divendres_Dissabte".split("_"),weekdaysShort:"Dg._Dl._Dt._Dc._Dj._Dv._Ds.".split("_"),weekdaysMin:"Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),longDateFormat:{LT:"H:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[avui a "+(this.hours()!==1?"les":"la")+"] LT"},nextDay:function(){return"[demà a "+(this.hours()!==1?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(this.hours()!==1?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(this.hours()!==1?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(this.hours()!==1?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"fa %s",s:"uns segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},ordinal:function(a){return"º"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("ca",a)}(),function(){var a={months:"кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав".split("_"),monthsShort:"кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кĕç_эрн_шăм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кç_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",L:"DD-MM-YYYY",LL:"YYYY çулхи MMMM уйăхĕн D-мĕшĕ",LLL:"YYYY çулхи MMMM уйăхĕн D-мĕшĕ, LT",LLLL:"dddd, YYYY çулхи MMMM уйăхĕн D-мĕшĕ, LT"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ĕнер] LT [сехетре]",nextWeek:"[Çитес] dddd LT [сехетре]",lastWeek:"[Иртнĕ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:"%sран",past:"%s каялла",s:"пĕр-ик çеккунт",m:"пĕр минут",mm:"%d минут",h:"пĕр сехет",hh:"%d сехет",d:"пĕр кун",dd:"%d кун",M:"пĕр уйăх",MM:"%d уйăх",y:"пĕр çул",yy:"%d çул"},ordinal:function(a){return"-мĕш"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("cv",a)}(),function(){var a={months:"Januar_Februar_Marts_April_Maj_Juni_Juli_August_September_Oktober_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Maj_Jun_Jul_Aug_Sep_Okt_Nov_Dec".split("_"),weekdays:"Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag".split("_"),weekdaysShort:"Søn_Man_Tir_Ons_Tor_Fre_Lør".split("_"),weekdaysMin:"Sø_Ma_Ti_On_To_Fr_Lø".split("_"),longDateFormat:{LT:"h:mm A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd D. MMMM, YYYY h:mm A"},calendar:{sameDay:"[I dag kl.] LT",nextDay:"[I morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[I går kl.] LT",lastWeek:"[sidste] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",m:"minut",mm:"%d minutter",h:"time",hh:"%d timer",d:"dag",dd:"%d dage",M:"månede",MM:"%d måneder",y:"år",yy:"%d år"},ordinal:function(a){return"."}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("da",a)}(),function(){var a={months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"H:mm U\\hr",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute um] LT",sameElse:"L",nextDay:"[Morgen um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gestern um] LT",lastWeek:"[letzten] dddd [um] LT"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:"einer Minute",mm:"%d Minuten",h:"einer Stunde",hh:"%d Stunden",d:"einem Tag",dd:"%d Tagen",M:"einem Monat",MM:"%d Monaten",y:"einem Jahr",yy:"%d Jahren"},ordinal:function(a){return"."}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("de",a)}(),function(){var a={months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",L:"YYYY-MM-DD",LL:"D MMMM, YYYY",LLL:"D MMMM, YYYY LT",LLLL:"dddd, D MMMM, YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinal:function(a){var b=a%10;return~~(a%100/10)===1?"th":b===1?"st":b===2?"nd":b===3?"rd":"th"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("en-ca",a)}(),function(){var a={months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinal:function(a){var b=a%10;return~~(a%100/10)===1?"th":b===1?"st":b===2?"nd":b===3?"rd":"th"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("en-gb",a)}(),function(){var a={months:"Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),monthsShort:"Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.".split("_"),weekdays:"Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mié._Jue._Vie._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),longDateFormat:{LT:"H:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[hoy a la"+(this.hours()!==1?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(this.hours()!==1?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(this.hours()!==1?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(this.hours()!==1?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(this.hours()!==1?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinal:function(a){return"º"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("es",a)}(),function(){var a={months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),longDateFormat:{LT:"HH:mm",L:"YYYY-MM-DD",LL:"YYYYko MMMMren D[a]",LLL:"YYYYko MMMMren D[a] LT",LLLL:"dddd, YYYYko MMMMren D[a] LT"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},ordinal:function(a){return"."}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("eu",a)}(),function(){function c(a,b,c,e){var f="";switch(c){case"s":return e?"muutaman sekunnin":"muutama sekunti";case"m":return e?"minuutin":"minuutti";case"mm":f=e?"minuutin":"minuuttia";break;case"h":return e?"tunnin":"tunti";case"hh":f=e?"tunnin":"tuntia";break;case"d":return e?"päivän":"päivä";case"dd":f=e?"päivän":"päivää";break;case"M":return e?"kuukauden":"kuukausi";case"MM":f=e?"kuukauden":"kuukautta";break;case"y":return e?"vuoden":"vuosi";case"yy":f=e?"vuoden":"vuotta"}return f=d(a,e)+" "+f,f}function d(c,d){return c<10?d?b[c]:a[c]:c}var a=["nolla","yksi","kaksi","kolme","neljä","viisi","kuusi","seitsemän","kahdeksan","yhdeksän"],b=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",a[7],a[8],a[9]],e={months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tam_hel_maa_huh_tou_kes_hei_elo_syy_lok_mar_jou".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",L:"DD.MM.YYYY",LL:"Do MMMMt\\a YYYY",LLL:"Do MMMMt\\a YYYY, klo LT",LLLL:"dddd, Do MMMMt\\a YYYY, klo LT"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:c,m:c,mm:c,h:c,hh:c,d:c,dd:c,M:c,MM:c,y:c,yy:c},ordinal:function(a){return"."}};typeof module!="undefined"&&module.exports&&(module.exports=e),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("fi",e)}(),function(){var a={months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"une année",yy:"%d années"},ordinal:function(a){return a===1?"er":"ème"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("fr-ca",a)}(),function(){var a={months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"une année",yy:"%d années"},ordinal:function(a){return a===1?"er":"ème"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("fr",a)}(),function(){var a={months:"Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Octubro_Novembro_Decembro".split("_"),monthsShort:"Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),weekdays:"Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),longDateFormat:{LT:"H:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[hoxe "+(this.hours()!==1?"ás":"a")+"] LT"},nextDay:function(){return"[mañá "+(this.hours()!==1?"ás":"a")+"] LT"},nextWeek:function(){return"dddd ["+(this.hours()!==1?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(this.hours()!==1?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(this.hours()!==1?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"fai %s",s:"uns segundo",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},ordinal:function(a){return"º"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("gl",a)}(),function(){function a(a,b,c,d){var e=a;switch(c){case"s":return d||b?"néhány másodperc":"néhány másodperce";case"m":e="egy";case"mm":return e+(d||b?" perc":" perce");case"h":e="egy";case"hh":return e+(d||b?" óra":" órája");case"d":e="egy";case"dd":return e+(d||b?" nap":" napja");case"M":e="egy";case"MM":return e+(d||b?" hónap":" hónapja");case"y":e="egy";case"yy":return e+(d||b?" év":" éve");default:}return""}function b(a){var b="";switch(this.day()){case 0:b="vasárnap";break;case 1:b="hétfőn";break;case 2:b="kedden";break;case 3:b="szerdán";break;case 4:b="csütörtökön";break;case 5:b="pénteken";break;case 6:b="szombaton"}return(a?"":"múlt ")+"["+b+"] LT[-kor]"}var c={months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D., LT",LLLL:"YYYY. MMMM D., dddd LT"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return b.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return b.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:a,m:a,mm:a,h:a,hh:a,d:a,dd:a,M:a,MM:a,y:a,yy:a},ordinal:function(a){return"."}};typeof module!="undefined"&&module.exports&&(module.exports=c),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("hu",c)}(),function(){var a=function(a){return a%100==11?!0:a%10==1?!1:!0},b=function(b,c,d,e){var f=b+" ";switch(d){case"s":return c||e?"nokkrar sekúndur":"nokkrum sekúndum";case"m":return c?"mínúta":"mínútu";case"mm":return a(b)?f+(c||e?"mínútur":"mínútum"):c?f+"mínúta":f+"mínútu";case"hh":return a(b)?f+(c||e?"klukkustundir":"klukkustundum"):f+"klukkustund";case"d":return c?"dagur":e?"dag":"degi";case"dd":return a(b)?c?f+"dagar":f+(e?"daga":"dögum"):c?f+"dagur":f+(e?"dag":"degi");case"M":return c?"mánuður":e?"mánuð":"mánuði";case"MM":return a(b)?c?f+"mánuðir":f+(e?"mánuði":"mánuðum"):c?f+"mánuður":f+(e?"mánuð":"mánuði");case"y":return c||e?"ár":"ári";case"yy":return a(b)?f+(c||e?"ár":"árum"):f+(c||e?"ár":"ári")}},c={months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY kl. LT",LLLL:"dddd, D. MMMM YYYY kl. LT"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:b,m:b,mm:b,h:"klukkustund",hh:b,d:b,dd:b,M:b,MM:b,y:b,yy:b},ordinal:function(a){return"."}};typeof module!="undefined"&&module.exports&&(module.exports=c),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("is",c)}(),function(){var a={months:"Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settebre_Ottobre_Novembre_Dicembre".split("_"),monthsShort:"Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic".split("_"),weekdays:"Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),weekdaysShort:"Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),weekdaysMin:"D_L_Ma_Me_G_V_S".split("_"),longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:"[lo scorso] dddd [alle] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s fa",s:"secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},ordinal:function(){return"º"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("it",a)}(),function(){var a={months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"Ah時m分",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日LT",LLLL:"YYYY年M月D日LT dddd"},meridiem:function(a,b,c){return a<12?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"},ordinal:function(a){return""}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("ja",a)}(),function(){var a={months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"Ah時m分",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日LT",LLLL:"YYYY年M月D日LT dddd"},meridiem:function(a,b,c){return a<12?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"},ordinal:function(a){return""}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("jp",a)}(),function(){var a={months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h시 mm분",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 LT",LLLL:"YYYY년 MMMM D일 dddd LT"},meridiem:function(a,b,c){return a<12?"오전":"오후"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇초",ss:"%d초",m:"일분",mm:"%d분",h:"한시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한달",MM:"%d달",y:"일년",yy:"%d년"},ordinal:function(a){return"일"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("ko",a)}(),function(){var a={months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h시 mm분",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 LT",LLLL:"YYYY년 MMMM D일 dddd LT"},meridiem:function(a,b,c){return a<12?"오전":"오후"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇초",ss:"%d초",m:"일분",mm:"%d분",h:"한시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한달",MM:"%d달",y:"일년",yy:"%d년"},ordinal:function(a){return"일"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("kr",a)}(),function(){var a={months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[I dag klokken] LT",nextDay:"[I morgen klokken] LT",nextWeek:"dddd [klokken] LT",lastDay:"[I går klokken] LT",lastWeek:"[Forrige] dddd [klokken] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s siden",s:"noen sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},ordinal:function(a){return"."}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("nb",a)}(),function(){var a="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),b="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),c={months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),longDateFormat:{LT:"HH:mm",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Vandaag om] LT",nextDay:"[Morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},ordinal:function(a){return a===1||a===8||a>=20?"ste":"de"}};typeof module!="undefined"&&module.exports&&(module.exports=c),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("nl",c)}(),function(){var a=function(a){return a%10<5&&a%10>1&&~~(a/10)!==1},b=function(b,c,d){var e=b+" ";switch(d){case"m":return c?"minuta":"minutę";case"mm":return e+(a(b)?"minuty":"minut");case"h":return c?"godzina":"godzinę";case"hh":return e+(a(b)?"godziny":"godzin");case"MM":return e+(a(b)?"miesiące":"miesięcy");case"yy":return e+(a(b)?"lata":"lat")}},c={months:"styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"nie_pon_wt_śr_czw_pt_sb".split("_"),weekdaysMin:"N_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:"[W] dddd [o] LT",lastDay:"[Wczoraj o] LT",lastWeek:"[W zeszły/łą] dddd [o] LT",sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:b,mm:b,h:b,hh:b,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:b,y:"rok",yy:b},ordinal:function(a){return"."}};typeof module!="undefined"&&module.exports&&(module.exports=c),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("pl",c)}(),function(){var a={months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D \\de MMMM \\de YYYY",LLL:"D \\de MMMM \\de YYYY LT",LLLL:"dddd, D \\de MMMM \\de YYYY LT"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return this.day()===0||this.day()===6?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinal:function(a){return"º"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("pt-br",a)}(),function(){var a={months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D \\de MMMM \\de YYYY",LLL:"D \\de MMMM \\de YYYY LT",LLLL:"dddd, D \\de MMMM \\de YYYY LT"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return this.day()===0||this.day()===6?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinal:function(a){return"º"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("pt",a)}(),function(){var a=[function(a){return a%10===1&&a%100!==11},function(a){return a%10>=2&&a%10<=4&&a%10%1===0&&(a%100<12||a%100>14)},function(a){return a%10===0||a%10>=5&&a%10<=9&&a%10%1===0||a%100>=11&&a%100<=14&&a%100%1===0},function(a){return!0}],b=function(b,c){var d=b.split("_"),e=Math.min(a.length,d.length),f=-1;while(++f<e)if(a[f](c))return d[f];return d[e-1]},c=function(a,c,d){var e={mm:"минута_минуты_минут_минуты",hh:"час_часа_часов_часа",dd:"день_дня_дней_дня",MM:"месяц_месяца_месяцев_месяца",yy:"год_года_лет_года"};return d==="m"?c?"минута":"минуту":a+" "+b(e[d],+a)},d=function(a,b){var c={nominative:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),accusative:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")},d=/D[oD]? *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]},e=function(a,b){var c={nominative:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),accusative:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")},d=/\[ ?[Вв] ?(?:прошлую|следующую)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]},f={months:d,monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:e,weekdaysShort:"вск_пнд_втр_срд_чтв_птн_сбт".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., LT",LLLL:"dddd, D MMMM YYYY г., LT"},calendar:{sameDay:"[Сегодня в] LT",nextDay:"[Завтра в] LT",lastDay:"[Вчера в] LT",nextWeek:function(){return this.day()===2?"[Во] dddd [в] LT":"[В] dddd [в] LT"},lastWeek:function(){switch(this.day()){case 0:return"[В прошлое] dddd [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:c,mm:c,h:"час",hh:c,d:"день",dd:c,M:"месяц",MM:c,y:"год",yy:c},ordinal:function(a){return"."}};typeof module!="undefined"&&module.exports&&(module.exports=f),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("ru",f)}(),function(){var a={months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Idag klockan] LT",nextDay:"[Imorgon klockan] LT",lastDay:"[Igår klockan] LT",nextWeek:"dddd [klockan] LT",lastWeek:"[Förra] dddd[en klockan] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sen",s:"några sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},ordinal:function(a){var b=a%10;return~~(a%100/10)===1?"e":b===1?"a":b===2?"a":b===3?"e":"e"}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("sv",a)}(),function(){var a={1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"},b={months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"
},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[haftaya] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen hafta] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},ordinal:function(b){if(b===0)return"'ıncı";var c=b%10,d=b%100-c,e=b>=100?100:null;return a[c]||a[d]||a[e]}};typeof module!="undefined"&&module.exports&&(module.exports=b),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("tr",b)}(),function(){var a={months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah点mm",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日LT",LLLL:"YYYY年MMMD日ddddLT"},meridiem:function(a,b,c){return a<9?"早上":a<11&&b<30?"上午":a<13&&b<30?"中午":a<18?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1分钟",mm:"%d分钟",h:"1小时",hh:"%d小时",d:"1天",dd:"%d天",M:"1个月",MM:"%d个月",y:"1年",yy:"%d年"},ordinal:function(a){return""}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("zh",a)}(),function(){var a={months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah點mm",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日LT",LLLL:"YYYY年MMMD日ddddLT"},meridiem:function(a,b,c){return a<9?"早上":a<11&&b<30?"上午":a<13&&b<30?"中午":a<18?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"一分鐘",mm:"%d分鐘",h:"一小時",hh:"%d小時",d:"一天",dd:"%d天",M:"一個月",MM:"%d個月",y:"一年",yy:"%d年"},ordinal:function(a){return""}};typeof module!="undefined"&&module.exports&&(module.exports=a),typeof window!="undefined"&&this.moment&&this.moment.lang&&this.moment.lang("zh-tw",a)}();;// lib/handlebars/base.js
var Handlebars = {};

Handlebars.VERSION = "1.0.beta.6";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
});

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"param":27,"STRING":28,"INTEGER":29,"BOOLEAN":30,"hashSegments":31,"hashSegment":32,"ID":33,"EQUALS":34,"pathSegments":35,"SEP":36,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",29:"INTEGER",30:"BOOLEAN",33:"ID",34:"EQUALS",36:"SEP"},
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[27,1],[27,1],[26,1],[31,2],[31,1],[32,3],[32,3],[32,3],[32,3],[21,1],[35,3],[35,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1] 
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]) 
break;
case 3: this.$ = new yy.ProgramNode($$[$0]) 
break;
case 4: this.$ = new yy.ProgramNode([]) 
break;
case 5: this.$ = [$$[$0]] 
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 7: this.$ = new yy.InverseNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 9: this.$ = $$[$0] 
break;
case 10: this.$ = $$[$0] 
break;
case 11: this.$ = new yy.ContentNode($$[$0]) 
break;
case 12: this.$ = new yy.CommentNode($$[$0]) 
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 15: this.$ = $$[$0-1] 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true) 
break;
case 18: this.$ = new yy.PartialNode($$[$0-1]) 
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]) 
break;
case 20: 
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]] 
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null] 
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]] 
break;
case 24: this.$ = [[$$[$0]], null] 
break;
case 25: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 26: this.$ = [$$[$0]] 
break;
case 27: this.$ = $$[$0] 
break;
case 28: this.$ = new yy.StringNode($$[$0]) 
break;
case 29: this.$ = new yy.IntegerNode($$[$0]) 
break;
case 30: this.$ = new yy.BooleanNode($$[$0]) 
break;
case 31: this.$ = new yy.HashNode($$[$0]) 
break;
case 32: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 33: this.$ = [$$[$0]] 
break;
case 34: this.$ = [$$[$0-2], $$[$0]] 
break;
case 35: this.$ = [$$[$0-2], new yy.StringNode($$[$0])] 
break;
case 36: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])] 
break;
case 37: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])] 
break;
case 38: this.$ = new yy.IdNode($$[$0]) 
break;
case 39: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 40: this.$ = [$$[$0]] 
break;
}
},
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,33:[1,25],35:24},{17:26,21:23,33:[1,25],35:24},{17:27,21:23,33:[1,25],35:24},{17:28,21:23,33:[1,25],35:24},{21:29,33:[1,25],35:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,33:[1,25],35:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,38],28:[2,38],29:[2,38],30:[2,38],33:[2,38],36:[1,46]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],36:[2,40]},{18:[1,47]},{18:[1,48]},{18:[1,49]},{18:[1,50],21:51,33:[1,25],35:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:52,33:[1,25],35:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:53,27:54,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,23]},{18:[2,26],28:[2,26],29:[2,26],30:[2,26],33:[2,26]},{18:[2,31],32:55,33:[1,56]},{18:[2,27],28:[2,27],29:[2,27],30:[2,27],33:[2,27]},{18:[2,28],28:[2,28],29:[2,28],30:[2,28],33:[2,28]},{18:[2,29],28:[2,29],29:[2,29],30:[2,29],33:[2,29]},{18:[2,30],28:[2,30],29:[2,30],30:[2,30],33:[2,30]},{18:[2,33],33:[2,33]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],34:[1,57],36:[2,40]},{33:[1,58]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,59]},{18:[1,60]},{18:[2,21]},{18:[2,25],28:[2,25],29:[2,25],30:[2,25],33:[2,25]},{18:[2,32],33:[2,32]},{34:[1,57]},{21:61,28:[1,62],29:[1,63],30:[1,64],33:[1,25],35:24},{18:[2,39],28:[2,39],29:[2,39],30:[2,39],33:[2,39],36:[2,39]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,34],33:[2,34]},{18:[2,35],33:[2,35]},{18:[2,36],33:[2,36]},{18:[2,37],33:[2,37]}],
defaultActions: {16:[2,1],37:[2,23],53:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                var errStr = "";
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + this.terminals_[symbol] + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;
                                 
break;
case 1: return 14; 
break;
case 2: this.popState(); return 14; 
break;
case 3: return 24; 
break;
case 4: return 16; 
break;
case 5: return 20; 
break;
case 6: return 19; 
break;
case 7: return 19; 
break;
case 8: return 23; 
break;
case 9: return 23; 
break;
case 10: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15; 
break;
case 11: return 22; 
break;
case 12: return 34; 
break;
case 13: return 33; 
break;
case 14: return 33; 
break;
case 15: return 36; 
break;
case 16: /*ignore whitespace*/ 
break;
case 17: this.popState(); return 18; 
break;
case 18: this.popState(); return 18; 
break;
case 19: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 28; 
break;
case 20: return 30; 
break;
case 21: return 30; 
break;
case 22: return 29; 
break;
case 23: return 33; 
break;
case 24: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 33; 
break;
case 25: return 'INVALID'; 
break;
case 26: return 5; 
break;
}
};
lexer.rules = [/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^[^\x00]{2,}?(?=(\{\{))/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[\/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^true(?=[}\s])/,/^false(?=[}\s])/,/^[0-9]+(?=[}\s])/,/^[a-zA-Z0-9_$-]+(?=[=}\s\/.])/,/^\[[^\]]*\]/,/^./,/^$/];
lexer.conditions = {"mu":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"INITIAL":{"rules":[0,1,26],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = handlebars;
exports.parse = function () { return handlebars.parse.apply(handlebars, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
};
;
// lib/handlebars/compiler/base.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {}
};

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); };
;
// lib/handlebars/compiler/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(params, hash, unescaped) {
    this.type = "mustache";
    this.id = params[0];
    this.params = params.slice(1);
    this.hash = hash;
    this.escaped = !unescaped;
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.InverseNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "inverse";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { this.isScoped = true; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;
    this.isSimple = (dig.length === 1) && (depth === 0);
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
  };

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }

  this.message = tmp.message;
};
Handlebars.Exception.prototype = new Error;

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /&(?!\w+;)|[<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler/compiler.js
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  Compiler.OPCODE_MAP = {
    appendContent: 1,
    getContext: 2,
    lookupWithHelpers: 3,
    lookup: 4,
    append: 5,
    invokeMustache: 6,
    appendEscaped: 7,
    pushString: 8,
    truthyOrFallback: 9,
    functionOrFallback: 10,
    invokeProgram: 11,
    invokePartial: 12,
    push: 13,
    assignToHash: 15,
    pushStringParam: 16
  };

  Compiler.MULTI_PARAM_OPCODES = {
    appendContent: 1,
    getContext: 1,
    lookupWithHelpers: 2,
    lookup: 1,
    invokeMustache: 3,
    pushString: 1,
    truthyOrFallback: 1,
    functionOrFallback: 1,
    invokeProgram: 3,
    invokePartial: 1,
    push: 1,
    assignToHash: 1,
    pushStringParam: 1
  };

  Compiler.DISASSEMBLE_MAP = {};

  for(var prop in Compiler.OPCODE_MAP) {
    var value = Compiler.OPCODE_MAP[prop];
    Compiler.DISASSEMBLE_MAP[value] = prop;
  }

  Compiler.multiParamSize = function(code) {
    return Compiler.MULTI_PARAM_OPCODES[Compiler.DISASSEMBLE_MAP[code]];
  };

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, nextCode;
      var out = [], str, name, value;

      for(var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if(opcode === 'DECLARE') {
          name = opcodes[++i];
          value = opcodes[++i];
          out.push("DECLARE " + name + " = " + value);
        } else {
          str = Compiler.DISASSEMBLE_MAP[opcode];

          var extraParams = Compiler.multiParamSize(opcode);
          var codes = [];

          for(var j=0; j<extraParams; j++) {
            nextCode = opcodes[++i];

            if(typeof nextCode === "string") {
              nextCode = "\"" + nextCode.replace("\n", "\\n") + "\"";
            }

            codes.push(nextCode);
          }

          str = str + " " + codes.join(" ");

          out.push(str);
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache;
      var depth, child, inverse, inverseGuid;

      var params = this.setupStackForMustache(mustache);

      var programGuid = this.compileProgram(block.program);

      if(block.program.inverse) {
        inverseGuid = this.compileProgram(block.program.inverse);
        this.declare('inverse', inverseGuid);
      }

      this.opcode('invokeProgram', programGuid, params.length, !!mustache.hash);
      this.declare('inverse', null);
      this.opcode('append');
    },

    inverse: function(block) {
      var params = this.setupStackForMustache(block.mustache);

      var programGuid = this.compileProgram(block.program);

      this.declare('inverse', programGuid);

      this.opcode('invokeProgram', null, params.length, !!block.mustache.hash);
      this.declare('inverse', null);
      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{}');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', id.original);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var params = this.setupStackForMustache(mustache);

      this.opcode('invokeMustache', params.length, mustache.id.original, !!mustache.hash);

      if(mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);

      this.opcode('getContext', id.depth);

      this.opcode('lookupWithHelpers', id.parts[0] || null, id.isScoped || false);

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('push', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('push', bool.bool);
    },

    comment: function() {},

    // HELPERS
    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
        } else {
          this[param.type](param);
        }
      }
    },

    opcode: function(name, val1, val2, val3) {
      this.opcodes.push(Compiler.OPCODE_MAP[name]);
      if(val1 !== undefined) { this.opcodes.push(val1); }
      if(val2 !== undefined) { this.opcodes.push(val2); }
      if(val3 !== undefined) { this.opcodes.push(val3); }
    },

    declare: function(name, value) {
      this.opcodes.push('DECLARE');
      this.opcodes.push(name);
      this.opcodes.push(value);
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    setupStackForMustache: function(mustache) {
      var params = mustache.params;

      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      }

      this.ID(mustache.id);

      return params;
    }
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
			if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
	    	return parent + "." + name;
			}
			else {
				return parent + "['" + name + "']";
      }
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return "buffer += " + string + ";";
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        aliases: { self: 'this' },
        registers: {list: []}
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = this.nextOpcode(0);

        if(opcode[0] === 'DECLARE') {
          this.i = this.i + 2;
          this[opcode[1]] = opcode[2];
        } else {
          this.i = this.i + opcode[1].length;
          this[opcode[0]].apply(this, opcode[1]);
        }
      }

      return this.createFunctionContext(asObject);
    },

    nextOpcode: function(n) {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + n], name, val;
      var extraParams, codes;

      if(opcode === 'DECLARE') {
        name = opcodes[this.i + 1];
        val  = opcodes[this.i + 2];
        return ['DECLARE', name, val];
      } else {
        name = Compiler.DISASSEMBLE_MAP[opcode];

        extraParams = Compiler.multiParamSize(opcode);
        codes = [];

        for(var j=0; j<extraParams; j++) {
          codes.push(opcodes[this.i + j + 1 + n]);
        }

        return [name, codes];
      }
    },

    eat: function(opcode) {
      this.i = this.i + opcode.length;
    },

    preamble: function() {
      var out = [];

      // this register will disambiguate helper lookup from finding a function in
      // a context. This is necessary for mustache compatibility, which requires
      // that context functions in blocks are evaluated by blockHelperMissing, and
      // then proceed as if the resulting value was provided to blockHelperMissing.
      this.useRegister('foundHelper');

      if (!this.isChild) {
        var namespace = this.namespace;
        var copies = "helpers = helpers || " + namespace + ".helpers;";
        if(this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars;
      if (!this.isChild) {
        locals = locals.concat(this.context.registers.list);
      }

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        var aliases = []
        for (var alias in this.context.aliases) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.source.push("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if (asObject) {
        params.push(this.source.join("\n  "));

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + this.source.join("\n  ") + '}';
        Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
        return functionSource;
      }
    },

    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.source.push("else { " + this.appendToBuffer("''") + " }");
      }
    },

    appendEscaped: function() {
      var opcode = this.nextOpcode(1), extra = "";
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      if(opcode[0] === 'appendContent') {
        extra = " + " + this.quotedString(opcode[1][0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
    },

    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    lookupWithHelpers: function(name, isScoped) {
      if(name) {
        var topStack = this.nextStack();

        this.usingKnownHelper = false;

        var toPush;
        if (!isScoped && this.options.knownHelpers[name]) {
          toPush = topStack + " = " + this.nameLookup('helpers', name, 'helper');
          this.usingKnownHelper = true;
        } else if (isScoped || this.options.knownHelpersOnly) {
          toPush = topStack + " = " + this.nameLookup('depth' + this.lastContext, name, 'context');
        } else {
          this.register('foundHelper', this.nameLookup('helpers', name, 'helper'));
          toPush = topStack + " = foundHelper || " + this.nameLookup('depth' + this.lastContext, name, 'context');
        }

        toPush += ';';
        this.source.push(toPush);
      } else {
        this.pushStack('depth' + this.lastContext);
      }
    },

    lookup: function(name) {
      var topStack = this.topStack();
      this.source.push(topStack + " = (" + topStack + " === null || " + topStack + " === undefined || " + topStack + " === false ? " +
 				topStack + " : " + this.nameLookup(topStack, name, 'context') + ");");
    },

    pushStringParam: function(string) {
      this.pushStack('depth' + this.lastContext);
      this.pushString(string);
    },

    pushString: function(string) {
      this.pushStack(this.quotedString(string));
    },

    push: function(name) {
      this.pushStack(name);
    },

    invokeMustache: function(paramSize, original, hasHash) {
      this.populateParams(paramSize, this.quotedString(original), "{}", null, hasHash, function(nextStack, helperMissingString, id) {
        if (!this.usingKnownHelper) {
          this.context.aliases.helperMissing = 'helpers.helperMissing';
          this.context.aliases.undef = 'void 0';
          this.source.push("else if(" + id + "=== undef) { " + nextStack + " = helperMissing.call(" + helperMissingString + "); }");
          if (nextStack !== id) {
            this.source.push("else { " + nextStack + " = " + id + "; }");
          }
        }
      });
    },

    invokeProgram: function(guid, paramSize, hasHash) {
      var inverse = this.programExpression(this.inverse);
      var mainProgram = this.programExpression(guid);

      this.populateParams(paramSize, null, mainProgram, inverse, hasHash, function(nextStack, helperMissingString, id) {
        if (!this.usingKnownHelper) {
          this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';
          this.source.push("else { " + nextStack + " = blockHelperMissing.call(" + helperMissingString + "); }");
        }
      });
    },

    populateParams: function(paramSize, helperId, program, inverse, hasHash, fn) {
      var needsRegister = hasHash || this.options.stringParams || inverse || this.options.data;
      var id = this.popStack(), nextStack;
      var params = [], param, stringParam, stringOptions;

      if (needsRegister) {
        this.register('tmp1', program);
        stringOptions = 'tmp1';
      } else {
        stringOptions = '{ hash: {} }';
      }

      if (needsRegister) {
        var hash = (hasHash ? this.popStack() : '{}');
        this.source.push('tmp1.hash = ' + hash + ';');
      }

      if(this.options.stringParams) {
        this.source.push('tmp1.contexts = [];');
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          this.source.push('tmp1.contexts.push(' + this.popStack() + ');');
        }
      }

      if(inverse) {
        this.source.push('tmp1.fn = tmp1;');
        this.source.push('tmp1.inverse = ' + inverse + ';');
      }

      if(this.options.data) {
        this.source.push('tmp1.data = data;');
      }

      params.push(stringOptions);

      this.populateCall(params, id, helperId || id, fn, program !== '{}');
    },

    populateCall: function(params, id, helperId, fn, program) {
      var paramString = ["depth0"].concat(params).join(", ");
      var helperMissingString = ["depth0"].concat(helperId).concat(params).join(", ");

      var nextStack = this.nextStack();

      if (this.usingKnownHelper) {
        this.source.push(nextStack + " = " + id + ".call(" + paramString + ");");
      } else {
        this.context.aliases.functionType = '"function"';
        var condition = program ? "foundHelper && " : ""
        this.source.push("if(" + condition + "typeof " + id + " === functionType) { " + nextStack + " = " + id + ".call(" + paramString + "); }");
      }
      fn.call(this, nextStack, helperMissingString, id);
      this.usingKnownHelper = false;
    },

    invokePartial: function(context) {
      params = [this.nameLookup('partials', context, 'partial'), "'" + context + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.pushStack("self.invokePartial(" + params.join(", ") + ");");
    },

    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        var index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
      }
    },

    programExpression: function(guid) {
      if(guid == null) { return "self.noop"; }

      var child = this.environment.children[guid],
          depths = child.depths.list;
      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(depths.length === 0) {
        return "self.program(" + programParams.join(", ") + ")";
      } else {
        programParams.shift();
        return "self.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.context.registers[name]) {
        this.context.registers[name] = true;
        this.context.registers.list.push(name);
      }
    },

    pushStack: function(item) {
      this.source.push(this.nextStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
    },

    nextStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      return "stack" + this.stackSlot--;
    },

    topStack: function() {
      return "stack" + this.stackSlot;
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

	JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
		if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
			return true;
		}
		return false;
	}

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.precompile = function(string, options) {
  options = options || {};

  var ast = Handlebars.parse(string);
  var environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(string, options) {
  options = options || {};

  var compiled;
  function compile() {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};
;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial);
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
;// Backbone.js 0.5.3
// (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
// Backbone may be freely distributed under the MIT license.
// For all details and documentation:
// http://documentcloud.github.com/backbone
(function(){var h=this,p=h.Backbone,e;e=typeof exports!=="undefined"?exports:h.Backbone={};e.VERSION="0.5.3";var f=h._;if(!f&&typeof require!=="undefined")f=require("underscore")._;var g=h.jQuery||h.Zepto;e.noConflict=function(){h.Backbone=p;return this};e.emulateHTTP=!1;e.emulateJSON=!1;e.Events={bind:function(a,b,c){var d=this._callbacks||(this._callbacks={});(d[a]||(d[a]=[])).push([b,c]);return this},unbind:function(a,b){var c;if(a){if(c=this._callbacks)if(b){c=c[a];if(!c)return this;for(var d=
0,e=c.length;d<e;d++)if(c[d]&&b===c[d][0]){c[d]=null;break}}else c[a]=[]}else this._callbacks={};return this},trigger:function(a){var b,c,d,e,f=2;if(!(c=this._callbacks))return this;for(;f--;)if(b=f?a:"all",b=c[b])for(var g=0,h=b.length;g<h;g++)(d=b[g])?(e=f?Array.prototype.slice.call(arguments,1):arguments,d[0].apply(d[1]||this,e)):(b.splice(g,1),g--,h--);return this}};e.Model=function(a,b){var c;a||(a={});if(c=this.defaults)f.isFunction(c)&&(c=c.call(this)),a=f.extend({},c,a);this.attributes={};
this._escapedAttributes={};this.cid=f.uniqueId("c");this.set(a,{silent:!0});this._changed=!1;this._previousAttributes=f.clone(this.attributes);if(b&&b.collection)this.collection=b.collection;this.initialize(a,b)};f.extend(e.Model.prototype,e.Events,{_previousAttributes:null,_changed:!1,idAttribute:"id",initialize:function(){},toJSON:function(){return f.clone(this.attributes)},get:function(a){return this.attributes[a]},escape:function(a){var b;if(b=this._escapedAttributes[a])return b;b=this.attributes[a];
return this._escapedAttributes[a]=(b==null?"":""+b).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")},has:function(a){return this.attributes[a]!=null},set:function(a,b){b||(b={});if(!a)return this;if(a.attributes)a=a.attributes;var c=this.attributes,d=this._escapedAttributes;if(!b.silent&&this.validate&&!this._performValidation(a,b))return!1;if(this.idAttribute in a)this.id=a[this.idAttribute];
var e=this._changing;this._changing=!0;for(var g in a){var h=a[g];if(!f.isEqual(c[g],h))c[g]=h,delete d[g],this._changed=!0,b.silent||this.trigger("change:"+g,this,h,b)}!e&&!b.silent&&this._changed&&this.change(b);this._changing=!1;return this},unset:function(a,b){if(!(a in this.attributes))return this;b||(b={});var c={};c[a]=void 0;if(!b.silent&&this.validate&&!this._performValidation(c,b))return!1;delete this.attributes[a];delete this._escapedAttributes[a];a==this.idAttribute&&delete this.id;this._changed=
!0;b.silent||(this.trigger("change:"+a,this,void 0,b),this.change(b));return this},clear:function(a){a||(a={});var b,c=this.attributes,d={};for(b in c)d[b]=void 0;if(!a.silent&&this.validate&&!this._performValidation(d,a))return!1;this.attributes={};this._escapedAttributes={};this._changed=!0;if(!a.silent){for(b in c)this.trigger("change:"+b,this,void 0,a);this.change(a)}return this},fetch:function(a){a||(a={});var b=this,c=a.success;a.success=function(d,e,f){if(!b.set(b.parse(d,f),a))return!1;c&&
c(b,d)};a.error=i(a.error,b,a);return(this.sync||e.sync).call(this,"read",this,a)},save:function(a,b){b||(b={});if(a&&!this.set(a,b))return!1;var c=this,d=b.success;b.success=function(a,e,f){if(!c.set(c.parse(a,f),b))return!1;d&&d(c,a,f)};b.error=i(b.error,c,b);var f=this.isNew()?"create":"update";return(this.sync||e.sync).call(this,f,this,b)},destroy:function(a){a||(a={});if(this.isNew())return this.trigger("destroy",this,this.collection,a);var b=this,c=a.success;a.success=function(d){b.trigger("destroy",
b,b.collection,a);c&&c(b,d)};a.error=i(a.error,b,a);return(this.sync||e.sync).call(this,"delete",this,a)},url:function(){var a=k(this.collection)||this.urlRoot||l();if(this.isNew())return a;return a+(a.charAt(a.length-1)=="/"?"":"/")+encodeURIComponent(this.id)},parse:function(a){return a},clone:function(){return new this.constructor(this)},isNew:function(){return this.id==null},change:function(a){this.trigger("change",this,a);this._previousAttributes=f.clone(this.attributes);this._changed=!1},hasChanged:function(a){if(a)return this._previousAttributes[a]!=
this.attributes[a];return this._changed},changedAttributes:function(a){a||(a=this.attributes);var b=this._previousAttributes,c=!1,d;for(d in a)f.isEqual(b[d],a[d])||(c=c||{},c[d]=a[d]);return c},previous:function(a){if(!a||!this._previousAttributes)return null;return this._previousAttributes[a]},previousAttributes:function(){return f.clone(this._previousAttributes)},_performValidation:function(a,b){var c=this.validate(a);if(c)return b.error?b.error(this,c,b):this.trigger("error",this,c,b),!1;return!0}});
e.Collection=function(a,b){b||(b={});if(b.comparator)this.comparator=b.comparator;f.bindAll(this,"_onModelEvent","_removeReference");this._reset();a&&this.reset(a,{silent:!0});this.initialize.apply(this,arguments)};f.extend(e.Collection.prototype,e.Events,{model:e.Model,initialize:function(){},toJSON:function(){return this.map(function(a){return a.toJSON()})},add:function(a,b){if(f.isArray(a))for(var c=0,d=a.length;c<d;c++)this._add(a[c],b);else this._add(a,b);return this},remove:function(a,b){if(f.isArray(a))for(var c=
0,d=a.length;c<d;c++)this._remove(a[c],b);else this._remove(a,b);return this},get:function(a){if(a==null)return null;return this._byId[a.id!=null?a.id:a]},getByCid:function(a){return a&&this._byCid[a.cid||a]},at:function(a){return this.models[a]},sort:function(a){a||(a={});if(!this.comparator)throw Error("Cannot sort a set without a comparator");this.models=this.sortBy(this.comparator);a.silent||this.trigger("reset",this,a);return this},pluck:function(a){return f.map(this.models,function(b){return b.get(a)})},
reset:function(a,b){a||(a=[]);b||(b={});this.each(this._removeReference);this._reset();this.add(a,{silent:!0});b.silent||this.trigger("reset",this,b);return this},fetch:function(a){a||(a={});var b=this,c=a.success;a.success=function(d,f,e){b[a.add?"add":"reset"](b.parse(d,e),a);c&&c(b,d)};a.error=i(a.error,b,a);return(this.sync||e.sync).call(this,"read",this,a)},create:function(a,b){var c=this;b||(b={});a=this._prepareModel(a,b);if(!a)return!1;var d=b.success;b.success=function(a,e,f){c.add(a,b);
d&&d(a,e,f)};a.save(null,b);return a},parse:function(a){return a},chain:function(){return f(this.models).chain()},_reset:function(){this.length=0;this.models=[];this._byId={};this._byCid={}},_prepareModel:function(a,b){if(a instanceof e.Model){if(!a.collection)a.collection=this}else{var c=a;a=new this.model(c,{collection:this});a.validate&&!a._performValidation(c,b)&&(a=!1)}return a},_add:function(a,b){b||(b={});a=this._prepareModel(a,b);if(!a)return!1;var c=this.getByCid(a);if(c)throw Error(["Can't add the same model to a set twice",
c.id]);this._byId[a.id]=a;this._byCid[a.cid]=a;this.models.splice(b.at!=null?b.at:this.comparator?this.sortedIndex(a,this.comparator):this.length,0,a);a.bind("all",this._onModelEvent);this.length++;b.silent||a.trigger("add",a,this,b);return a},_remove:function(a,b){b||(b={});a=this.getByCid(a)||this.get(a);if(!a)return null;delete this._byId[a.id];delete this._byCid[a.cid];this.models.splice(this.indexOf(a),1);this.length--;b.silent||a.trigger("remove",a,this,b);this._removeReference(a);return a},
_removeReference:function(a){this==a.collection&&delete a.collection;a.unbind("all",this._onModelEvent)},_onModelEvent:function(a,b,c,d){(a=="add"||a=="remove")&&c!=this||(a=="destroy"&&this._remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],this._byId[b.id]=b),this.trigger.apply(this,arguments))}});f.each(["forEach","each","map","reduce","reduceRight","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max",
"min","sortBy","sortedIndex","toArray","size","first","rest","last","without","indexOf","lastIndexOf","isEmpty","groupBy"],function(a){e.Collection.prototype[a]=function(){return f[a].apply(f,[this.models].concat(f.toArray(arguments)))}});e.Router=function(a){a||(a={});if(a.routes)this.routes=a.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var q=/:([\w\d]+)/g,r=/\*([\w\d]+)/g,s=/[-[\]{}()+?.,\\^$|#\s]/g;f.extend(e.Router.prototype,e.Events,{initialize:function(){},route:function(a,
b,c){e.history||(e.history=new e.History);f.isRegExp(a)||(a=this._routeToRegExp(a));e.history.route(a,f.bind(function(d){d=this._extractParameters(a,d);c.apply(this,d);this.trigger.apply(this,["route:"+b].concat(d))},this))},navigate:function(a,b){e.history.navigate(a,b)},_bindRoutes:function(){if(this.routes){var a=[],b;for(b in this.routes)a.unshift([b,this.routes[b]]);b=0;for(var c=a.length;b<c;b++)this.route(a[b][0],a[b][1],this[a[b][1]])}},_routeToRegExp:function(a){a=a.replace(s,"\\$&").replace(q,
"([^/]*)").replace(r,"(.*?)");return RegExp("^"+a+"$")},_extractParameters:function(a,b){return a.exec(b).slice(1)}});e.History=function(){this.handlers=[];f.bindAll(this,"checkUrl")};var j=/^#*/,t=/msie [\w.]+/,m=!1;f.extend(e.History.prototype,{interval:50,getFragment:function(a,b){if(a==null)if(this._hasPushState||b){a=window.location.pathname;var c=window.location.search;c&&(a+=c);a.indexOf(this.options.root)==0&&(a=a.substr(this.options.root.length))}else a=window.location.hash;return decodeURIComponent(a.replace(j,
""))},start:function(a){if(m)throw Error("Backbone.history has already been started");this.options=f.extend({},{root:"/"},this.options,a);this._wantsPushState=!!this.options.pushState;this._hasPushState=!(!this.options.pushState||!window.history||!window.history.pushState);a=this.getFragment();var b=document.documentMode;if(b=t.exec(navigator.userAgent.toLowerCase())&&(!b||b<=7))this.iframe=g('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(a);
this._hasPushState?g(window).bind("popstate",this.checkUrl):"onhashchange"in window&&!b?g(window).bind("hashchange",this.checkUrl):setInterval(this.checkUrl,this.interval);this.fragment=a;m=!0;a=window.location;b=a.pathname==this.options.root;if(this._wantsPushState&&!this._hasPushState&&!b)return this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment),!0;else if(this._wantsPushState&&this._hasPushState&&b&&a.hash)this.fragment=a.hash.replace(j,""),window.history.replaceState({},
document.title,a.protocol+"//"+a.host+this.options.root+this.fragment);if(!this.options.silent)return this.loadUrl()},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();a==this.fragment&&this.iframe&&(a=this.getFragment(this.iframe.location.hash));if(a==this.fragment||a==decodeURIComponent(this.fragment))return!1;this.iframe&&this.navigate(a);this.loadUrl()||this.loadUrl(window.location.hash)},loadUrl:function(a){var b=this.fragment=this.getFragment(a);
return f.any(this.handlers,function(a){if(a.route.test(b))return a.callback(b),!0})},navigate:function(a,b){var c=(a||"").replace(j,"");if(!(this.fragment==c||this.fragment==decodeURIComponent(c))){if(this._hasPushState){var d=window.location;c.indexOf(this.options.root)!=0&&(c=this.options.root+c);this.fragment=c;window.history.pushState({},document.title,d.protocol+"//"+d.host+c)}else if(window.location.hash=this.fragment=c,this.iframe&&c!=this.getFragment(this.iframe.location.hash))this.iframe.document.open().close(),
this.iframe.location.hash=c;b&&this.loadUrl(a)}}});e.View=function(a){this.cid=f.uniqueId("view");this._configure(a||{});this._ensureElement();this.delegateEvents();this.initialize.apply(this,arguments)};var u=/^(\S+)\s*(.*)$/,n=["model","collection","el","id","attributes","className","tagName"];f.extend(e.View.prototype,e.Events,{tagName:"div",$:function(a){return g(a,this.el)},initialize:function(){},render:function(){return this},remove:function(){g(this.el).remove();return this},make:function(a,
b,c){a=document.createElement(a);b&&g(a).attr(b);c&&g(a).html(c);return a},delegateEvents:function(a){if(a||(a=this.events))for(var b in f.isFunction(a)&&(a=a.call(this)),g(this.el).unbind(".delegateEvents"+this.cid),a){var c=this[a[b]];if(!c)throw Error('Event "'+a[b]+'" does not exist');var d=b.match(u),e=d[1];d=d[2];c=f.bind(c,this);e+=".delegateEvents"+this.cid;d===""?g(this.el).bind(e,c):g(this.el).delegate(d,e,c)}},_configure:function(a){this.options&&(a=f.extend({},this.options,a));for(var b=
0,c=n.length;b<c;b++){var d=n[b];a[d]&&(this[d]=a[d])}this.options=a},_ensureElement:function(){if(this.el){if(f.isString(this.el))this.el=g(this.el).get(0)}else{var a=this.attributes||{};if(this.id)a.id=this.id;if(this.className)a["class"]=this.className;this.el=this.make(this.tagName,a)}}});e.Model.extend=e.Collection.extend=e.Router.extend=e.View.extend=function(a,b){var c=v(this,a,b);c.extend=this.extend;return c};var w={create:"POST",update:"PUT","delete":"DELETE",read:"GET"};e.sync=function(a,
b,c){var d=w[a];c=f.extend({type:d,dataType:"json"},c);if(!c.url)c.url=k(b)||l();if(!c.data&&b&&(a=="create"||a=="update"))c.contentType="application/json",c.data=JSON.stringify(b.toJSON());if(e.emulateJSON)c.contentType="application/x-www-form-urlencoded",c.data=c.data?{model:c.data}:{};if(e.emulateHTTP&&(d==="PUT"||d==="DELETE")){if(e.emulateJSON)c.data._method=d;c.type="POST";c.beforeSend=function(a){a.setRequestHeader("X-HTTP-Method-Override",d)}}if(c.type!=="GET"&&!e.emulateJSON)c.processData=
!1;return g.ajax(c)};var o=function(){},v=function(a,b,c){var d;d=b&&b.hasOwnProperty("constructor")?b.constructor:function(){return a.apply(this,arguments)};f.extend(d,a);o.prototype=a.prototype;d.prototype=new o;b&&f.extend(d.prototype,b);c&&f.extend(d,c);d.prototype.constructor=d;d.__super__=a.prototype;return d},k=function(a){if(!a||!a.url)return null;return f.isFunction(a.url)?a.url():a.url},l=function(){throw Error('A "url" property or function must be specified');},i=function(a,b,c){return function(d){a?
a(b,d,c):b.trigger("error",b,d,c)}}}).call(this);
;(function(k){function n(c,a){k.ajax({url:c,async:!1,cache:a.cache,contentType:"text/plain;charset="+a.encoding,dataType:"text",success:function(b){r(b,a.mode)}})}function r(c,a){for(var b="",e=c.split(/\n/),d=/(\{\d+\})/g,q=/\{(\d+)\}/g,m=/(\\u.{4})/ig,f=0;f<e.length;f++)if(e[f]=e[f].replace(/^\s\s*/,"").replace(/\s\s*$/,""),e[f].length>0&&e[f].match("^#")!="#"){var g=e[f].split("=");if(g.length>0){for(var o=unescape(g[0]).replace(/^\s\s*/,"").replace(/\s\s*$/,""),h=g.length==1?"":g[1];h.match(/\\$/)==
"\\";)h=h.substring(0,h.length-1),h+=e[++f].replace(/\s\s*$/,"");for(var l=2;l<g.length;l++)h+="="+g[l];h=h.replace(/^\s\s*/,"").replace(/\s\s*$/,"").replace(/\\\!/g, '!').replace(/\\:/g, ':').replace(/\\=/g, '=');if(a=="map"||a=="both"){if(g=h.match(m))for(l=0;l<g.length;l++)h=h.replace(g[l],s(g[l]));k.i18n.map[o]=h}if(a=="vars"||a=="both")if(h=h.replace(/"/g,'\\"'),t(o),d.test(h)){for(var g=h.split(d),l=!0,j="",n=[],p=0;p<g.length;p++)if(d.test(g[p])&&(n.length==0||n.indexOf(g[p])==-1))l||(j+=","),j+=g[p].replace(q,"v$1"),n.push(g[p]),l=!1;b+=o+"=function("+
j+"){";o='"'+h.replace(q,'"+v$1+"')+'"';b+="return "+o+";};"}else b+=o+'="'+h+'";'}}eval(b)}function t(c){if(/\./.test(c))for(var a="",c=c.split(/\./),b=0;b<c.length;b++)b>0&&(a+="."),a+=c[b],eval("typeof "+a+' == "undefined"')&&eval(a+"={};")}function s(c){var a=[],c=parseInt(c.substr(2),16);c>=0&&c<Math.pow(2,16)&&a.push(c);for(var c="",b=0;b<a.length;++b)c+=String.fromCharCode(a[b]);return c}k.i18n={};k.i18n.map={};k.i18n.properties=function(c){c=k.extend({name:"Messages",language:"",path:[""],mode:"vars",
cache:!1,encoding:"UTF-8",callback:null},c);if(c.language===null||c.language=="")c.language=k.i18n.browserLang();if(c.language===null)c.language="";var a=c.name&&c.name.constructor==Array?c.name:[c.name];for(i=0;i<a.length;i++)n(c.path[i]+a[i]+".properties",c),c.language.length>=2&&n(c.path[i]+a[i]+"_"+c.language.substring(0,2)+".properties",c),c.language.length>=5&&n(c.path[i]+a[i]+"_"+c.language.substring(0,5)+".properties",c);c.callback&&c.callback()};k.i18n.prop=function(c){var a=k.i18n.map[c];if(a==null)return"["+
c+"]";var b;if(typeof a=="string"){for(b=0;(b=a.indexOf("\\",b))!=-1;)a=a[b+1]=="t"?a.substring(0,b)+"\t"+a.substring(b++ +2):a[b+1]=="r"?a.substring(0,b)+"\r"+a.substring(b++ +2):a[b+1]=="n"?a.substring(0,b)+"\n"+a.substring(b++ +2):a[b+1]=="f"?a.substring(0,b)+"\u000c"+a.substring(b++ +2):a[b+1]=="\\"?a.substring(0,b)+"\\"+a.substring(b++ +2):a.substring(0,b)+a.substring(b+1);var e=[],d,j;for(b=0;b<a.length;)if(a[b]=="'")if(b==a.length-1)a=a.substring(0,b);else if(a[b+1]=="'")a=a.substring(0,b)+
a.substring(++b);else{for(d=b+2;(d=a.indexOf("'",d))!=-1;)if(d==a.length-1||a[d+1]!="'"){a=a.substring(0,b)+a.substring(b+1,d)+a.substring(d+1);b=d-1;break}else a=a.substring(0,d)+a.substring(++d);d==-1&&(a=a.substring(0,b)+a.substring(b+1))}else if(a[b]=="{")if(d=a.indexOf("}",b+1),d==-1)b++;else if(j=parseInt(a.substring(b+1,d)),!isNaN(j)&&j>=0){var m=a.substring(0,b);m!=""&&e.push(m);e.push(j);b=0;a=a.substring(d+1)}else b=d+1;else b++;a!=""&&e.push(a);a=e;k.i18n.map[c]=e}if(a.length==0)return"";
if(a.lengh==1&&typeof a[0]=="string")return a[0];m="";for(b=0;b<a.length;b++)m+=typeof a[b]=="string"?a[b]:a[b]+1<arguments.length?arguments[a[b]+1]:"{"+a[b]+"}";return m};k.i18n.browserLang=function(){var c=navigator.language||navigator.userLanguage;if(c){c=c.toLowerCase();c.length>3&&(c=c.substring(0,3)+c.substring(3).toUpperCase())};return c};var j;if(!j)j=function(c,a,b){if(Object.prototype.toString.call(a)!=="[object RegExp]")return typeof j._nativeSplit=="undefined"?c.split(a,b):j._nativeSplit.call(c,
a,b);var e=[],d=0,k=(a.ignoreCase?"i":"")+(a.multiline?"m":"")+(a.sticky?"y":""),a=RegExp(a.source,k+"g"),m,f,g;c+="";j._compliantExecNpcg||(m=RegExp("^"+a.source+"$(?!\\s)",k));if(b===void 0||+b<0)b=Infinity;else if(b=Math.floor(+b),!b)return[];for(;f=a.exec(c);){k=f.index+f[0].length;if(k>d&&(e.push(c.slice(d,f.index)),!j._compliantExecNpcg&&f.length>1&&f[0].replace(m,function(){for(var a=1;a<arguments.length-2;a++)arguments[a]===void 0&&(f[a]=void 0)}),f.length>1&&f.index<c.length&&Array.prototype.push.apply(e,
f.slice(1)),g=f[0].length,d=k,e.length>=b))break;a.lastIndex===f.index&&a.lastIndex++}d===c.length?(g||!a.test(""))&&e.push(""):e.push(c.slice(d));return e.length>b?e.slice(0,b):e},j._compliantExecNpcg=/()??/.exec("")[1]===void 0,j._nativeSplit=String.prototype.split;String.prototype.split=function(c,a){return j(this,c,a)}})(jQuery);;var jstz=function(){var b=function(a){a=-a.getTimezoneOffset();return null!==a?a:0},c=function(){return b(new Date(2010,0,1,0,0,0,0))},f=function(){return b(new Date(2010,5,1,0,0,0,0))},e=function(){var a=c(),d=f(),b=c()-f();return new jstz.TimeZone(jstz.olson.timezones[0>b?a+",1":0<b?d+",1,s":a+",0"])};return{determine_timezone:function(){"undefined"!==typeof console&&console.log("jstz.determine_timezone() is deprecated and will be removed in an upcoming version. Please use jstz.determine() instead.");
return e()},determine:e,date_is_dst:function(a){var d=5<a.getMonth()?f():c(),a=b(a);return 0!==d-a}}}();jstz.TimeZone=function(b){var c=null,c=b;"undefined"!==typeof jstz.olson.ambiguity_list[c]&&function(){for(var b=jstz.olson.ambiguity_list[c],e=b.length,a=0,d=b[0];a<e;a+=1)if(d=b[a],jstz.date_is_dst(jstz.olson.dst_start_dates[d])){c=d;break}}();return{name:function(){return c}}};jstz.olson={};
jstz.olson.timezones={"-720,0":"Etc/GMT+12","-660,0":"Pacific/Pago_Pago","-600,1":"America/Adak","-600,0":"Pacific/Honolulu","-570,0":"Pacific/Marquesas","-540,0":"Pacific/Gambier","-540,1":"America/Anchorage","-480,1":"America/Los_Angeles","-480,0":"Pacific/Pitcairn","-420,0":"America/Phoenix","-420,1":"America/Denver","-360,0":"America/Guatemala","-360,1":"America/Chicago","-360,1,s":"Pacific/Easter","-300,0":"America/Bogota","-300,1":"America/New_York","-270,0":"America/Caracas","-240,1":"America/Halifax",
"-240,0":"America/Santo_Domingo","-240,1,s":"America/Asuncion","-210,1":"America/St_Johns","-180,1":"America/Godthab","-180,0":"America/Argentina/Buenos_Aires","-180,1,s":"America/Montevideo","-120,0":"America/Noronha","-120,1":"Etc/GMT+2","-60,1":"Atlantic/Azores","-60,0":"Atlantic/Cape_Verde","0,0":"Etc/UTC","0,1":"Europe/London","60,1":"Europe/Berlin","60,0":"Africa/Lagos","60,1,s":"Africa/Windhoek","120,1":"Asia/Beirut","120,0":"Africa/Johannesburg","180,1":"Europe/Moscow","180,0":"Asia/Baghdad",
"210,1":"Asia/Tehran","240,0":"Asia/Dubai","240,1":"Asia/Yerevan","270,0":"Asia/Kabul","300,1":"Asia/Yekaterinburg","300,0":"Asia/Karachi","330,0":"Asia/Kolkata","345,0":"Asia/Kathmandu","360,0":"Asia/Dhaka","360,1":"Asia/Omsk","390,0":"Asia/Rangoon","420,1":"Asia/Krasnoyarsk","420,0":"Asia/Jakarta","480,0":"Asia/Shanghai","480,1":"Asia/Irkutsk","525,0":"Australia/Eucla","525,1,s":"Australia/Eucla","540,1":"Asia/Yakutsk","540,0":"Asia/Tokyo","570,0":"Australia/Darwin","570,1,s":"Australia/Adelaide",
"600,0":"Australia/Brisbane","600,1":"Asia/Vladivostok","600,1,s":"Australia/Sydney","630,1,s":"Australia/Lord_Howe","660,1":"Asia/Kamchatka","660,0":"Pacific/Noumea","690,0":"Pacific/Norfolk","720,1,s":"Pacific/Auckland","720,0":"Pacific/Tarawa","765,1,s":"Pacific/Chatham","780,0":"Pacific/Tongatapu","780,1,s":"Pacific/Apia","840,0":"Pacific/Kiritimati"};
jstz.olson.dst_start_dates={"America/Denver":new Date(2011,2,13,3,0,0,0),"America/Mazatlan":new Date(2011,3,3,3,0,0,0),"America/Chicago":new Date(2011,2,13,3,0,0,0),"America/Mexico_City":new Date(2011,3,3,3,0,0,0),"Atlantic/Stanley":new Date(2011,8,4,7,0,0,0),"America/Asuncion":new Date(2011,9,2,3,0,0,0),"America/Santiago":new Date(2011,9,9,3,0,0,0),"America/Campo_Grande":new Date(2011,9,16,5,0,0,0),"America/Montevideo":new Date(2011,9,2,3,0,0,0),"America/Sao_Paulo":new Date(2011,9,16,5,0,0,0),"America/Los_Angeles":new Date(2011,
2,13,8,0,0,0),"America/Santa_Isabel":new Date(2011,3,5,8,0,0,0),"America/Havana":new Date(2011,2,13,2,0,0,0),"America/New_York":new Date(2011,2,13,7,0,0,0),"Asia/Gaza":new Date(2011,2,26,23,0,0,0),"Asia/Beirut":new Date(2011,2,27,1,0,0,0),"Europe/Minsk":new Date(2011,2,27,2,0,0,0),"Europe/Helsinki":new Date(2011,2,27,4,0,0,0),"Europe/Istanbul":new Date(2011,2,28,5,0,0,0),"Asia/Damascus":new Date(2011,3,1,2,0,0,0),"Asia/Jerusalem":new Date(2011,3,1,6,0,0,0),"Africa/Cairo":new Date(2010,3,30,4,0,0,
0),"Asia/Yerevan":new Date(2011,2,27,4,0,0,0),"Asia/Baku":new Date(2011,2,27,8,0,0,0),"Pacific/Auckland":new Date(2011,8,26,7,0,0,0),"Pacific/Fiji":new Date(2010,11,29,23,0,0,0),"America/Halifax":new Date(2011,2,13,6,0,0,0),"America/Goose_Bay":new Date(2011,2,13,2,1,0,0),"America/Miquelon":new Date(2011,2,13,5,0,0,0),"America/Godthab":new Date(2011,2,27,1,0,0,0)};
jstz.olson.ambiguity_list={"America/Denver":["America/Denver","America/Mazatlan"],"America/Chicago":["America/Chicago","America/Mexico_City"],"America/Asuncion":["Atlantic/Stanley","America/Asuncion","America/Santiago","America/Campo_Grande"],"America/Montevideo":["America/Montevideo","America/Sao_Paulo"],"Asia/Beirut":"Asia/Gaza Asia/Beirut Europe/Minsk Europe/Helsinki Europe/Istanbul Asia/Damascus Asia/Jerusalem Africa/Cairo".split(" "),"Asia/Yerevan":["Asia/Yerevan","Asia/Baku"],"Pacific/Auckland":["Pacific/Auckland",
"Pacific/Fiji"],"America/Los_Angeles":["America/Los_Angeles","America/Santa_Isabel"],"America/New_York":["America/Havana","America/New_York"],"America/Halifax":["America/Goose_Bay","America/Halifax"],"America/Godthab":["America/Miquelon","America/Godthab"]};;/* Copyright (c) 2010-2012 Marcus Westin */
this.JSON||(this.JSON={}),function(){function f(e){return e<10?"0"+e:e}function quote(e){return escapable.lastIndex=0,escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t=="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];a&&typeof a=="object"&&typeof a.toJSON=="function"&&(a=a.toJSON(e)),typeof rep=="function"&&(a=rep.call(t,e,a));switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a)return"null";gap+=indent,u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1)u[n]=str(n,a)||"null";return i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]",gap=o,i}if(rep&&typeof rep=="object"){s=rep.length;for(n=0;n<s;n+=1)r=rep[n],typeof r=="string"&&(i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i))}else for(r in a)Object.hasOwnProperty.call(a,r)&&(i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i));return i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}",gap=o,i}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(e,t,n){var r;gap="",indent="";if(typeof n=="number")for(r=0;r<n;r+=1)indent+=" ";else typeof n=="string"&&(indent=n);rep=t;if(!t||typeof t=="function"||typeof t=="object"&&typeof t.length=="number")return str("",{"":e});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i=="object")for(n in i)Object.hasOwnProperty.call(i,n)&&(r=walk(i,n),r!==undefined?i[n]=r:delete i[n]);return reviver.call(e,t,i)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),function(){function u(){try{return r in t&&t[r]}catch(e){return!1}}function a(){try{return i in t&&t[i]&&t[i][t.location.hostname]}catch(e){return!1}}var e={},t=window,n=t.document,r="localStorage",i="globalStorage",s="__storejs__",o;e.disabled=!1,e.set=function(e,t){},e.get=function(e){},e.remove=function(e){},e.clear=function(){},e.transact=function(t,n,r){var i=e.get(t);r==null&&(r=n,n=null),typeof i=="undefined"&&(i=n||{}),r(i),e.set(t,i)},e.getAll=function(){},e.serialize=function(e){return JSON.stringify(e)},e.deserialize=function(e){return typeof e!="string"?undefined:JSON.parse(e)};if(u())o=t[r],e.set=function(t,n){if(n===undefined)return e.remove(t);o.setItem(t,e.serialize(n))},e.get=function(t){return e.deserialize(o.getItem(t))},e.remove=function(e){o.removeItem(e)},e.clear=function(){o.clear()},e.getAll=function(){var t={};for(var n=0;n<o.length;++n){var r=o.key(n);t[r]=e.get(r)}return t};else if(a())o=t[i][t.location.hostname],e.set=function(t,n){if(n===undefined)return e.remove(t);o[t]=e.serialize(n)},e.get=function(t){return e.deserialize(o[t]&&o[t].value)},e.remove=function(e){delete o[e]},e.clear=function(){for(var e in o)delete o[e]},e.getAll=function(){var t={};for(var n=0;n<o.length;++n){var r=o.key(n);t[r]=e.get(r)}return t};else if(n.documentElement.addBehavior){var f,l;try{l=new ActiveXObject("htmlfile"),l.open(),l.write('<script>document.w=window</script><iframe src="/favicon.ico"></frame>'),l.close(),f=l.w.frames[0].document,o=f.createElement("div")}catch(c){o=n.createElement("div"),f=n.body}function h(t){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(o),f.appendChild(o),o.addBehavior("#default#userData"),o.load(r);var i=t.apply(e,n);return f.removeChild(o),i}}function p(e){return"_"+e}e.set=h(function(t,n,i){n=p(n);if(i===undefined)return e.remove(n);t.setAttribute(n,e.serialize(i)),t.save(r)}),e.get=h(function(t,n){return n=p(n),e.deserialize(t.getAttribute(n))}),e.remove=h(function(e,t){t=p(t),e.removeAttribute(t),e.save(r)}),e.clear=h(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(r);for(var n=0,i;i=t[n];n++)e.removeAttribute(i.name);e.save(r)}),e.getAll=h(function(t){var n=t.XMLDocument.documentElement.attributes;t.load(r);var i={};for(var s=0,o;o=n[s];++s)i[o]=e.get(o);return i})}try{e.set(s,s),e.get(s)!=s&&(e.disabled=!0),e.remove(s)}catch(c){e.disabled=!0}e.enabled=!e.disabled,typeof module!="undefined"&&typeof module!="function"?module.exports=e:typeof define=="function"&&define.amd?define(e):this.store=e}();/*!
 * jQuery idleTimer plugin
 * version 0.9.100511
 * by Paul Irish.
 *   http://github.com/paulirish/yui-misc/tree/
 * MIT license

 * adapted from YUI idle timer by nzakas:
 *   http://github.com/nzakas/yui-misc/
*/
/*
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* updated to fix Chrome setTimeout issue by Zaid Zawaideh */

 // API available in <= v0.8
 /*******************************

 // idleTimer() takes an optional argument that defines the idle timeout
 // timeout is in milliseconds; defaults to 30000
 $.idleTimer(10000);


 $(document).bind("idle.idleTimer", function(){
    // function you want to fire when the user goes idle
 });


 $(document).bind("active.idleTimer", function(){
  // function you want to fire when the user becomes active again
 });

 // pass the string 'destroy' to stop the timer
 $.idleTimer('destroy');

 // you can query if the user is idle or not with data()
 $.data(document,'idleTimer');  // 'idle'  or 'active'

 // you can get time elapsed since user when idle/active
 $.idleTimer('getElapsedTime'); // time since state change in ms

 ********/



 // API available in >= v0.9
 /*************************

 // bind to specific elements, allows for multiple timer instances
 $(elem).idleTimer(timeout|'destroy'|'getElapsedTime');
 $.data(elem,'idleTimer');  // 'idle'  or 'active'

 // if you're using the old $.idleTimer api, you should not do $(document).idleTimer(...)

 // element bound timers will only watch for events inside of them.
 // you may just want page-level activity, in which case you may set up
 //   your timers on document, document.documentElement, and document.body


 ********/

(function($){

$.idleTimer = function(newTimeout, elem){

    // defaults that are to be stored as instance props on the elem

    var idle    = false,        //indicates if the user is idle
        enabled = true,        //indicates if the idle timer is enabled
        timeout = 30000,        //the amount of time (ms) before the user is considered idle
        events  = 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove'; // activity is one of these events


    elem = elem || document;



    /* (intentionally not documented)
     * Toggles the idle state and fires an appropriate event.
     * @return {void}
     */
    var toggleIdleState = function(myelem){

        // curse you, mozilla setTimeout lateness bug!
        if (typeof myelem === 'number'){
            myelem = undefined;
        }

        var obj = $.data(myelem || elem,'idleTimerObj');

        //toggle the state
        obj.idle = !obj.idle;

        // reset timeout 
        var elapsed = (+new Date()) - obj.olddate;
        obj.olddate = +new Date();

        // handle Chrome always triggering idle after js alert or comfirm popup
        if (obj.idle && (elapsed < timeout)) {
                obj.idle = false;
                clearTimeout($.idleTimer.tId);
                if (enabled)
                  $.idleTimer.tId = setTimeout(toggleIdleState, timeout);
                return;
        }
        
        //fire appropriate event

        // create a custom event, but first, store the new state on the element
        // and then append that string to a namespace
        var event = jQuery.Event( $.data(elem,'idleTimer', obj.idle ? "idle" : "active" )  + '.idleTimer'   );

        // we do want this to bubble, at least as a temporary fix for jQuery 1.7
        // event.stopPropagation();
        $(elem).trigger(event);
    },

    /**
     * Stops the idle timer. This removes appropriate event handlers
     * and cancels any pending timeouts.
     * @return {void}
     * @method stop
     * @static
     */
    stop = function(elem){

        var obj = $.data(elem,'idleTimerObj') || {};

        //set to disabled
        obj.enabled = false;

        //clear any pending timeouts
        clearTimeout(obj.tId);

        //detach the event handlers
        $(elem).off('.idleTimer');
    },


    /* (intentionally not documented)
     * Handles a user event indicating that the user isn't idle.
     * @param {Event} event A DOM2-normalized event object.
     * @return {void}
     */
    handleUserEvent = function(){

        var obj = $.data(this,'idleTimerObj');

        //clear any existing timeout
        clearTimeout(obj.tId);



        //if the idle timer is enabled
        if (obj.enabled){


            //if it's idle, that means the user is no longer idle
            if (obj.idle){
                toggleIdleState(this);
            }

            //set a new timeout
            obj.tId = setTimeout(toggleIdleState, obj.timeout);

        }
     };


    /**
     * Starts the idle timer. This adds appropriate event handlers
     * and starts the first timeout.
     * @param {int} newTimeout (Optional) A new value for the timeout period in ms.
     * @return {void}
     * @method $.idleTimer
     * @static
     */


    var obj = $.data(elem,'idleTimerObj') || {};

    obj.olddate = obj.olddate || +new Date();

    //assign a new timeout if necessary
    if (typeof newTimeout === "number"){
        timeout = newTimeout;
    } else if (newTimeout === 'destroy') {
        stop(elem);
        return this;
    } else if (newTimeout === 'getElapsedTime'){
        return (+new Date()) - obj.olddate;
    }

    //assign appropriate event handlers
    $(elem).on($.trim((events+' ').split(' ').join('.idleTimer ')),handleUserEvent);


    obj.idle    = idle;
    obj.enabled = enabled;
    obj.timeout = timeout;


    //set a timeout to toggle state
    obj.tId = setTimeout(toggleIdleState, obj.timeout);

    // assume the user is active for the first x seconds.
    $.data(elem,'idleTimer',"active");

    // store our instance on the object
    $.data(elem,'idleTimerObj',obj);



}; // end of $.idleTimer()


// v0.9 API for defining multiple timers.
$.fn.idleTimer = function(newTimeout){
    if(this[0]){
        $.idleTimer(newTimeout,this[0]);
    }

    return this;
};


})(jQuery);
;/*!
* jQuery Text Counter Plugin v0.2.1
* https://github.com/ractoon/jQuery-Text-Counter
*
* Copyright 2014 ractoon
* Released under the MIT license
*/
;(function(a){a.textcounter=function(c,b){var d=this;d.$el=a(c);d.el=c;d.$el.data("textcounter",d);d.init=function(){d.options=a.extend({},a.textcounter.defaultOptions,b);var f=d.options.countDown?d.options.countDownText:d.options.counterText,e=d.options.countDown?d.options.max:0;d.$el.after("<"+d.options.countContainerElement+' class="'+d.options.countContainerClass+'">'+f+'<span class="text-count">'+e+"</span></"+d.options.countContainerElement+">");d.$el.bind("keyup.textcounter click.textcounter blur.textcounter focus.textcounter change.textcounter paste.textcounter",d.checkLimits).trigger("click.textcounter")};d.checkLimits=function(o){var p=d.$el,t=p.next("."+d.options.countContainerClass),r=p.val(),h=0,u=0,s=o.originalEvent===undefined?false:true;if(d.options.type=="word"){h=r.replace(/\s+/g," ").split(" ").length;if(p.val()===""){h=0}}else{if(d.options.countSpaces){h=r.replace(/\n/g,"\r\n").length}else{h=r.replace(/\s/g,"").length}if(d.options.countExtendedCharacters){var l=r.match(/[^\x00-\xff]/gi);if(l==null){h=r.length}else{h=r.length+l.length}}}if(d.options.max=="auto"){var q=d.$el.attr("maxlength");if(typeof q!=="undefined"&&q!==false){d.options.max=q}else{d.$el.next("."+d.options.countContainerClass).text("error: [maxlength] attribute not set")}}u=d.options.countDown?d.options.max-h:h;d.setCount(u);if(d.options.min>0&&s){if(h<d.options.min){d.setErrors("min")}else{if(h>=d.options.min){d.clearErrors("min")}}}if(d.options.max!==-1){if(h>d.options.max&&d.options.max!=0){if(d.options.stopInputAtMaximum){var k="";if(d.options.type=="word"){var m=r.split(/[\s\.\?]+/);for(var j=0;j<d.options.max;j++){k+=m[j]+" "}}else{if(d.options.countSpaces){k=r.substring(0,d.options.max)}else{var g=r.split(""),n=g.length,f=0,j=0;while(f<d.options.max&&j<n){if(g[j]!==" "){f++}k+=g[j++]}}}p.val(k);u=d.options.countDown?0:d.options.max;d.setCount(u)}else{d.setErrors("max")}}else{d.clearErrors("max")}}};d.setCount=function(f){var g=d.$el,e=g.next("."+d.options.countContainerClass);e.children(".text-count").text(f)};d.setErrors=function(e){var g=d.$el,f=g.next("."+d.options.countContainerClass);g.addClass(d.options.inputErrorClass);f.addClass(d.options.counterErrorClass);if(d.options.displayErrorText){switch(e){case"min":errorText=d.options.minimumErrorText;break;case"max":errorText=d.options.maximumErrorText;break}if(!f.children(".error-text-"+e).length){f.append("<"+d.options.errorTextElement+' class="error-text error-text-'+e+'">'+errorText+"</"+d.options.errorTextElement+">")}}};d.clearErrors=function(e){var g=d.$el,f=g.next("."+d.options.countContainerClass);f.children(".error-text-"+e).remove();if(f.children(".error-text").length==0){g.removeClass(d.options.inputErrorClass);f.removeClass(d.options.counterErrorClass)}};d.init()};a.textcounter.defaultOptions={type:"character",min:0,max:200,countContainerElement:"div",countContainerClass:"text-count-wrapper",inputErrorClass:"error",counterErrorClass:"error",counterText:"Total Count: ",errorTextElement:"div",minimumErrorText:"Minimum not met",maximumErrorText:"Maximum exceeded",displayErrorText:true,stopInputAtMaximum:true,countSpaces:false,countDown:false,countDownText:"Remaining: ",countExtendedCharacters:false};a.fn.textcounter=function(b){return this.each(function(){new a.textcounter(this,b)})}})(jQuery);;/*************************************************************
 * This script is developed by Arturs Sosins aka ar2rsawseen, http://webcodingeasy.com
 * Feel free to distribute and modify code, but keep reference to its creator
 *
 * White board class provides a way to draw on website. It is possible to set width and color of drawing line.
 * Main reason for this package is to save some notes on different pages of website, 
 * or share drawings with others using import/export function, for example, 
 * with webdesigners, to direct them to flaws, bugs or changes in design.
 *
 * For more information, examples and online documentation visit: 
 * http://webcodingeasy.com/JS-classes/Drawing-on-websites
**************************************************************/
var initialAvatar = function(name, config){
	
	var conf = {
		textColor: null,
		backgroundColor: null,
		font: "Arial", 
		width: 150,
		height: 150
	};
	
	var canvas;
	var ctx;
	var ob = this;
	this.name = name;
	
	this.construct = function(){
		//copying configuration
		for(var opt in config){
			conf[opt] = config[opt];
		}

		if(document.getElementById("ia_canvas"))
		{
			canvas = document.getElementById("ia_canvas");
			ctx = canvas.getContext("2d");
		}
		else
		{
			//create canvas for drawing
			canvas = document.createElement("canvas");
			canvas.style.position = "absolute";
			canvas.style.top = "0px";
			canvas.style.left = "0px";
			canvas.style.display = "none";
			canvas.id = "ia_canvas";
			ctx = canvas.getContext("2d");
			document.body.appendChild(canvas);
		}
	};
	
	this.draw = function(){
		canvas.setAttribute("width", conf.width + "px");
		canvas.setAttribute("height", conf.height + "px");
		
		var color = getColor(this.name);
		ctx.fillStyle = conf.backgroundColor || "#"+color;
		ctx.fillRect(0,0,conf.width,conf.height);
		
		var arr = this.name.split(" ");
		for(var i = 0, l = arr.length; i < l; i++){
			arr[i] = arr[i].charAt(0);
		}
		
		ctx.fillStyle = conf.textColor || "#"+('000000' + (('0xffffff' ^ '0x'+color).toString(16))).slice(-6);
		ctx.font = (conf.width/arr.length) + "px "+conf.font;
		ctx.textBaseline = 'middle';
		
		var str = arr.join("").toUpperCase();
		var dim = ctx.measureText(str);
		ctx.fillText(str, (conf.width-dim.width)/2, conf.height/2);
	};
	
	this.getData = function(){
		this.draw();
		return canvas.toDataURL();
	};
	
	this.applyToImage = function(id){
		this.draw();
		var elem = (typeof id == "string") ? document.getElementById(id) : id;
		elem.src = this.getData();
	};
	
	this.getImage = function(){
		this.draw();
		var elem = document.createElement("img");
		elem.src = this.getData();
		return elem;
	};
	
	var getColor = function(str){
		var stringHexNumber = (                       // 1
			parseInt(                                 // 2
				parseInt(str, 36)  // 3
					.toExponential()                  // 4
					.slice(2,-5)                      // 5
			, 10) & 0xFFFFFF                          // 6
		).toString(16).toUpperCase();
		return ('000000' + stringHexNumber).slice(-6);
	};
	
	this.construct();
};(function(){!function(t,i){var n,e;return n=function(i){var n;n={position:"bottom right",content:" ",delay:3e3,sticky:!1,inEffect:"fadeIn",outEffect:"fadeOut",theme:"default",themeTemplate:null,closeOnClick:!0,closeButton:!1,clearAll:!1,cssanimationIn:!1,cssanimationOut:!1,beforeStart:function(){},afterEnd:function(){},onClick:function(){},wrapper:".amaran-wrapper"},this.config=t.extend({},n,i),this.config.beforeStart(),this.init(),this.close()},n.prototype={init:function(){var i,n,o,a,s,c,h,r;h=null,r=null,o=this.config.position.split(" "),t(this.config.wrapper).length&&t(this.config.wrapper).hasClass(this.config.position)?(h=t(this.config.wrapper+"."+o[0]+"."+o[1]),s=h.find(".amaran-wrapper-inner")):(h=t("<div>",{"class":this.config.wrapper.substr(1,this.config.wrapper.length)+" "+this.config.position}).appendTo("body"),s=t("<div>",{"class":"amaran-wrapper-inner"}).appendTo(h)),"object"==typeof this.config.content?c=null!=this.config.themeTemplate?this.config.themeTemplate(this.config.content):e[this.config.theme.split(" ")[0]+"Theme"](this.config.content):(this.config.content={},this.config.content.message=this.config.message,this.config.content.color="#27ae60",c=e.defaultTheme(this.config.content)),i={"class":this.config.themeTemplate?"amaran "+this.config.content.themeName:this.config.theme&&!this.config.themeTemplate?"amaran "+this.config.theme:"amaran",html:this.config.closeButton?'<span class="amaran-close" data-amaran-close="true"></span>'+c:c},this.config.clearAll&&t(".amaran").remove(),a=t("<div>",i).appendTo(s),"center"===o[0]&&this.centerCalculate(h,s),this.animation(this.config.inEffect,a,"show"),this.config.onClick&&(n=this,t(a).on("click",function(i){return t(i.target).is(".amaran-close")?void i.preventDefault():void n.config.onClick()})),this.config.sticky!==!0&&this.hideDiv(a)},centerCalculate:function(t,i){var n,e,o;e=i.find(".amaran").length,o=i.height(),n=(t.height()-o)/2,i.find(".amaran:first-child").animate({"margin-top":n},200)},animation:function(t,i,n){return"fadeIn"===t||"fadeOut"===t?this.fade(i,n):"show"===t?this.cssanimate(i,n):this.slide(t,i,n)},fade:function(t,i){var n;return n=this,"show"===i?this.config.cssanimationIn?t.addClass("animated "+this.config.cssanimationIn).show():t.fadeIn():this.config.cssanimationOut?(t.addClass("animated "+this.config.cssanimationOut),t.css({"min-height":0,height:t.outerHeight()}),void t.animate({opacity:0},function(){t.animate({height:0},function(){n.removeIt(t)})})):(t.css({"min-height":0,height:t.outerHeight()}),void t.animate({opacity:0},function(){t.animate({height:0},function(){n.removeIt(t)})}))},removeIt:function(i){var n,e;clearTimeout(this.timeout),i.remove(),e=t(this.config.wrapper+"."+this.config.position.split(" ")[0]+"."+this.config.position.split(" ")[1]),n=e.find(".amaran-wrapper-inner"),"center"===this.config.position.split(" ")[0]&&this.centerCalculate(e,n),this.config.afterEnd()},getWidth:function(t){var i,n;return i=t.clone().hide().appendTo("body"),n=i.outerWidth()+i.outerWidth()/2,i.remove(),n},getInfo:function(i){var n,e;return n=i.offset(),e=t(this.config.wrapper).offset(),{t:n.top,l:n.left,h:i.height(),w:i.outerWidth(),wT:e.top,wL:e.left,wH:t(this.config.wrapper).outerHeight(),wW:t(this.config.wrapper).outerWidth()}},getPosition:function(n,e){var o,a,s;return o=this.getInfo(n),a=this.config.position.split(" ")[1],s={slideTop:{start:{top:-(o.wT+o.wH+2*o.h)},move:{top:0},hide:{top:-(o.t+2*o.h)},height:o.h},slideBottom:{start:{top:t(i).height()-o.wH+2*o.h},move:{top:0},hide:{top:t(i).height()-o.wH+2*o.h},height:o.h},slideLeft:{start:{left:"left"===a?1.5*-o.w:-t(i).width()},move:{left:0},hide:{left:"left"===a?1.5*-o.w:-t(i).width()},height:o.h},slideRight:{start:{left:"right"===a?1.5*o.w:t(i).width()},move:{left:0},hide:{left:"right"===a?1.5*o.w:t(i).width()},height:o.h}},s[e]?s[e]:0},slide:function(t,i,n){var e,o;return o=this.getPosition(i,t),"show"!==n?(e=this,i.animate(o.hide,function(){i.css({"min-height":0,height:o.height},function(){i.html(" ")})}).animate({height:0},function(){return e.removeIt(i)})):void i.show().css(o.start).animate(o.move)},close:function(){var i;return i=this,t("[data-amaran-close]").on("click",function(){i.animation(i.config.outEffect,t(this).closest("div.amaran"),"hide")}),!this.config.closeOnClick&&this.config.closeButton?void i.animation(i.config.outEffect,t(this).parent("div.amaran"),"hide"):void(this.config.closeOnClick&&t(".amaran").on("click",function(){i.animation(i.config.outEffect,t(this),"hide")}))},hideDiv:function(t){var i;i=this,i.timeout=setTimeout(function(){i.animation(i.config.outEffect,t,"hide")},i.config.delay)}},e={defaultTheme:function(t){var i;return i="","undefined"!=typeof t.color&&(i=t.color),"<div class='default-spinner'><span style='background-color:"+t.color+"'></span></div><div class='default-message'><span>"+t.message+"</span></div>"},awesomeTheme:function(t){return'<i class="icon '+t.icon+' icon-large"></i><p class="bold">'+t.title+"</p><p><span>"+t.message+'</span><span class="light">'+t.info+"</span></p>"},userTheme:function(t){return'<div class="icon"><img src="'+t.img+'" alt="" /></div><div class="info"><b>'+t.user+"</b>"+t.message+"</div>"},colorfulTheme:function(t){var i,n;return"undefined"!=typeof t.color&&(n=t.color),"undefined"!=typeof t.bgcolor&&(i=t.bgcolor),"<div class='colorful-inner' style='background-color:"+t.bgcolor+";color:"+t.color+"'>"+t.message+"</div>"},tumblrTheme:function(t){return'<div class="title">'+t.title+'</div><div class="content">'+t.message+"</div>"}},t.amaran=function(t){var i;return i=new n(t)},t.amaran.close=function(){return t(".amaran-wrapper").remove(),!1}}(jQuery,window,document)}).call(this);;/*!!
 * Title Alert 0.7
 * 
 * Copyright (c) 2009 ESN | http://esn.me
 * Jonatan Heyman | http://heyman.info
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 */
 
/* 
 * @name jQuery.titleAlert
 * @projectDescription Show alert message in the browser title bar
 * @author Jonatan Heyman | http://heyman.info
 * @version 0.7.0
 * @license MIT License
 * 
 * @id jQuery.titleAlert
 * @param {String} text The text that should be flashed in the browser title
 * @param {Object} settings Optional set of settings.
 *	 @option {Number} interval The flashing interval in milliseconds (default: 500).
 *	 @option {Number} originalTitleInterval Time in milliseconds that the original title is diplayed for. If null the time is the same as interval (default: null).
 *	 @option {Number} duration The total lenght of the flashing before it is automatically stopped. Zero means infinite (default: 0).
 *	 @option {Boolean} stopOnFocus If true, the flashing will stop when the window gets focus (default: true).
 *   @option {Boolean} stopOnMouseMove If true, the flashing will stop when the browser window recieves a mousemove event. (default:false).
 *	 @option {Boolean} requireBlur Experimental. If true, the call will be ignored unless the window is out of focus (default: false).
 *                                 Known issues: Firefox doesn't recognize tab switching as blur, and there are some minor IE problems as well.
 *
 * @example $.titleAlert("Hello World!", {requireBlur:true, stopOnFocus:true, duration:10000, interval:500});
 * @desc Flash title bar with text "Hello World!", if the window doesn't have focus, for 10 seconds or until window gets focused, with an interval of 500ms
 */
;(function($){	
	$.titleAlert = function(text, settings) {
		// check if it currently flashing something, if so reset it
		if ($.titleAlert._running)
			$.titleAlert.stop();
		
		// override default settings with specified settings
		$.titleAlert._settings = settings = $.extend( {}, $.titleAlert.defaults, settings);
		
		// if it's required that the window doesn't have focus, and it has, just return
		if (settings.requireBlur && $.titleAlert.hasFocus)
			return;
		
		// originalTitleInterval defaults to interval if not set
		settings.originalTitleInterval = settings.originalTitleInterval || settings.interval;
		
		$.titleAlert._running = true;
		$.titleAlert._initialText = document.title;
		document.title = text;
		var showingAlertTitle = true;
		var switchTitle = function() {
			// WTF! Sometimes Internet Explorer 6 calls the interval function an extra time!
			if (!$.titleAlert._running)
				return;
			
		    showingAlertTitle = !showingAlertTitle;
		    document.title = (showingAlertTitle ? text : $.titleAlert._initialText);
		    $.titleAlert._intervalToken = setTimeout(switchTitle, (showingAlertTitle ? settings.interval : settings.originalTitleInterval));
		}
		$.titleAlert._intervalToken = setTimeout(switchTitle, settings.interval);
		
		if (settings.stopOnMouseMove) {
			$(document).mousemove(function(event) {
				$(this).unbind(event);
				$.titleAlert.stop();
			});
		}
		
		// check if a duration is specified
		if (settings.duration > 0) {
			$.titleAlert._timeoutToken = setTimeout(function() {
				$.titleAlert.stop();
			}, settings.duration);
		}
	};
	
	// default settings
	$.titleAlert.defaults = {
		interval: 500,
		originalTitleInterval: null,
		duration:0,
		stopOnFocus: true,
		requireBlur: false,
		stopOnMouseMove: false
	};
	
	// stop current title flash
	$.titleAlert.stop = function() {
		if (!$.titleAlert._running)
			return;
		
		clearTimeout($.titleAlert._intervalToken);
		clearTimeout($.titleAlert._timeoutToken);
		document.title = $.titleAlert._initialText;
		
		$.titleAlert._timeoutToken = null;
		$.titleAlert._intervalToken = null;
		$.titleAlert._initialText = null;
		$.titleAlert._running = false;
		$.titleAlert._settings = null;
	}
	
	$.titleAlert.hasFocus = true;
	$.titleAlert._running = false;
	$.titleAlert._intervalToken = null;
	$.titleAlert._timeoutToken = null;
	$.titleAlert._initialText = null;
	$.titleAlert._settings = null;
	
	
	$.titleAlert._focus = function () {
		$.titleAlert.hasFocus = true;
		
		if ($.titleAlert._running && $.titleAlert._settings.stopOnFocus) {
			var initialText = $.titleAlert._initialText;
			$.titleAlert.stop();
			
			// ugly hack because of a bug in Chrome which causes a change of document.title immediately after tab switch
			// to have no effect on the browser title
			setTimeout(function() {
				if ($.titleAlert._running)
					return;
				document.title = ".";
				document.title = initialText;
			}, 1000);
		}
	};
	$.titleAlert._blur = function () {
		$.titleAlert.hasFocus = false;
	};
	
	// bind focus and blur event handlers
	$(window).bind("focus", $.titleAlert._focus);
	$(window).bind("blur", $.titleAlert._blur);
})(jQuery);;(function (countlyCommon, $, undefined) {

    // Private Properties
    var _period = (store.get("countly_date")) ? store.get("countly_date") : "30days";

    // Public Properties
    countlyCommon.ACTIVE_APP_KEY = 0;
    countlyCommon.ACTIVE_APP_ID = 0;
    countlyCommon.BROWSER_LANG = jQuery.i18n.browserLang() || "en-US";
    countlyCommon.BROWSER_LANG_SHORT = countlyCommon.BROWSER_LANG.split("-")[0];
    countlyCommon.periodObj = getPeriodObj();

    if (store.get("countly_active_app")) {
        if (countlyGlobal['apps'][store.get("countly_active_app")]) {
            countlyCommon.ACTIVE_APP_KEY = countlyGlobal['apps'][store.get("countly_active_app")].key;
            countlyCommon.ACTIVE_APP_ID = store.get("countly_active_app");
        }
    }

    if (store.get("countly_lang")) {
        var lang = store.get("countly_lang");
        countlyCommon.BROWSER_LANG_SHORT = lang;
        countlyCommon.BROWSER_LANG = lang;
    }

    // Public Methods

    countlyCommon.setPeriod = function (period) {
        _period = period;
        countlyCommon.periodObj = getPeriodObj();
        store.set("countly_date", period);
    };

    countlyCommon.getPeriod = function () {
        return _period;
    };

    countlyCommon.getPeriodForAjax = function () {
        if (Object.prototype.toString.call(_period) === '[object Array]'){
            return JSON.stringify(_period);
        } else {
            return _period;
        }
    };

    countlyCommon.setActiveApp = function (appId) {
        countlyCommon.ACTIVE_APP_KEY = countlyGlobal['apps'][appId].key;
        countlyCommon.ACTIVE_APP_ID = appId;
        store.set("countly_active_app", appId);
    };

    // Calculates the percent change between previous and current values.
    // Returns an object in the following format {"percent": "20%", "trend": "u"}
    countlyCommon.getPercentChange = function (previous, current) {
        var pChange = 0,
            trend = "";

        if (previous == 0) {
            pChange = "NA";
            trend = "u"; //upward
        } else if (current == 0) {
            pChange = "∞";
            trend = "d"; //downward
        } else {
            var change = (((current - previous) / previous) * 100).toFixed(1);
            pChange = countlyCommon.getShortNumber(change) + "%";

            if (change < 0) {
                trend = "d";
            } else {
                trend = "u";
            }
        }

        return {"percent":pChange, "trend":trend};
    };

    // Fetches nested property values from an obj.
    countlyCommon.getDescendantProp = function (obj, path, def) {
        for (var i = 0, path = (path + "").split('.'), len = path.length; i < len; i++) {
            if(!obj || typeof obj !== 'object') return def;
            obj = obj[path[i]];
        }

        if(obj === undefined) return def;
        return obj;
    };

    // Draws a graph with the given dataPoints to container. Used for drawing bar and pie charts.
    countlyCommon.drawGraph = function (dataPoints, container, graphType, inGraphProperties) {
        _.defer(function(){
            if ((!dataPoints.dp || !dataPoints.dp.length) || (graphType == "bar" && !dataPoints.dp[0].data[0][1] && !dataPoints.dp[0].data[1][1])) {
                $(container).hide();
                $(container).siblings(".no-data").show();
                return true;
            } else {
                $(container).show();
                $(container).siblings(".no-data").hide();
            }

            var graphProperties = {
                series:{
                    lines:{ show:true, fill:true },
                    points:{ show:true }
                },
                grid:{ hoverable:true, borderColor:"null", color:"#999", borderWidth:0, minBorderMargin:10},
                xaxis:{ minTickSize:1, tickDecimals:"number", tickLength:0},
                yaxis:{ min:0, minTickSize:1, tickDecimals:"number", position:"right" },
                legend:{ backgroundOpacity:0, margin:[20, -19] },
                colors:countlyCommon.GRAPH_COLORS
            };

            switch (graphType) {
                case "line":
                    graphProperties.series = {lines:{ show:true, fill:true }, points:{ show:true }};
                    break;
                case "bar":
                    if (dataPoints.ticks.length > 20) {
                        graphProperties.xaxis.rotateTicks = 45;
                    }

                    graphProperties.series = {stack:true, bars:{ show:true, align:"center", barWidth:0.6, tickLength:0 }};
                    graphProperties.xaxis.ticks = dataPoints.ticks;
                    break;
                case "separate-bar":
                    if (dataPoints.ticks.length > 20) {
                        graphProperties.xaxis.rotateTicks = 45;
                    }
                    graphProperties.series = {bars:{ show:true, align:"center", barWidth:0.6 }};
                    graphProperties.xaxis.ticks = dataPoints.ticks;
                    break;
                case "pie":
                    graphProperties.series = { pie:{
                        show:true,
                        lineWidth:0,
                        radius:115,
                        combine:{
                            color:'#999',
                            threshold:0.05
                        },
                        label:{
                            show:true,
                            radius:160
                        }
                    }};
                    graphProperties.legend.show = false;
                    break;
                default:
                    break;
            }

            if (inGraphProperties) {
                $.extend(true, graphProperties, inGraphProperties);
            }

            $.plot($(container), dataPoints.dp, graphProperties);

            if (graphType == "bar" || graphType == "separate-bar") {
                var previousBar;

                $(container).unbind("plothover");
                $(container).bind("plothover", function (event, pos, item) {
                    if (item) {
                        var x = item.datapoint[0].toFixed(1).replace(".0", ""),
                            y = item.datapoint[1].toFixed(1).replace(".0", "") - item.datapoint[2].toFixed(1).replace(".0", "");

                        if (previousBar != y) {
                            $("#graph-tooltip").remove();
                            showTooltip(item.pageX, item.pageY - 40, y);
                            previousBar = y;
                        }
                    } else {
                        $("#graph-tooltip").remove();
                        previousBar = null;
                    }
                });
            } else {
                $(container).unbind("plothover");
            }
        }, dataPoints, container, graphType, inGraphProperties);
    };

    // Draws a line graph with the given dataPoints to container.
    countlyCommon.drawTimeGraph = function (dataPoints, container, bucket) {
        _.defer(function(){
            if (!dataPoints.length) {
                $(container).hide();
                $(container).siblings(".no-data").show();
                return true;
            } else {
                $(container).show();
                $(container).siblings(".no-data").hide();
            }

            // Some data points start with [1, XXX] (should be [0, XXX]) and brakes the new tick logic
            // Below loops converts the old structures to the new one
            if (dataPoints[0].data[0][0] == 1) {
                for (var i = 0; i < dataPoints.length; i++) {
                    for (var j = 0; j < dataPoints[i].data.length; j++) {
                        dataPoints[i].data[j][0] -= 1;
                    }
                }
            }

            var graphProperties = {
                    series:{
                        lines:{ stack:false, show:true, fill:true, lineWidth:2, fillColor:{ colors:[
                            { opacity:0 },
                            { opacity:0.15 }
                        ] }, shadowSize:0 },
                        points:{ show:true, radius:4, shadowSize:0 },
                        shadowSize:0
                    },
                    grid:{ hoverable:true, borderColor:"null", color:"#BDBDBD", borderWidth:0, minBorderMargin:10, labelMargin:10},
                    xaxis:{ tickDecimals:"number", tickSize:0, tickLength:0 },
                    yaxis:{ min:0, minTickSize:1, tickDecimals:"number", ticks:3, position:"right" },
                    legend:{ show:false, margin:[-25, -44], noColumns:3, backgroundOpacity:0 },
                    colors:countlyCommon.GRAPH_COLORS
                };

            graphProperties.series.points.show = (dataPoints[0].data.length <= 90);

            var graphTicks = [],
                tickObj = {};

            if (_period == "month" && !bucket) {
                tickObj = countlyCommon.getTickObj("monthly");
            } else {
                tickObj = countlyCommon.getTickObj(bucket);
            }

            graphProperties.xaxis.max = tickObj.max;
            graphProperties.xaxis.min = tickObj.min;
            graphProperties.xaxis.ticks = tickObj.ticks;

            graphTicks = tickObj.tickTexts;

            var graphObj = $.plot($(container), dataPoints, graphProperties),
                keyEventCounter = "A",
                keyEvents = [],
                keyEventsIndex = 0;

            for (var k = 0; k < graphObj.getData().length; k++) {

                var tmpMax = 0,
                    tmpMaxIndex = 0,
                    tmpMin = 999999999999,
                    tmpMinIndex = 0,
                    label = (graphObj.getData()[k].label + "").toLowerCase();

                if (graphObj.getData()[k].mode === "ghost") {
                    keyEventsIndex += graphObj.getData()[k].data.length;
                    continue;
                }

                $.each(graphObj.getData()[k].data, function (i, el) {

                    //data point is null
                    //this workaround is used to start drawing graph with a certain padding
                    if (!el[1] && el[1] !== 0) {
                        return true;
                    }

                    el[1] = parseFloat(el[1]);

                    if (el[1] >= tmpMax) {
                        tmpMax = el[1];
                        tmpMaxIndex = el[0];
                    }

                    if (el[1] <= tmpMin) {
                        tmpMin = el[1];
                        tmpMinIndex = el[0];
                    }
                });

                if (tmpMax == tmpMin) {
                    continue;
                }

                keyEvents[k] = [];

                keyEvents[k][keyEvents[k].length] = {
                    data:[tmpMinIndex, tmpMin],
                    code:keyEventCounter,
                    color:graphObj.getData()[k].color,
                    event:"min",
                    desc:jQuery.i18n.prop('common.graph-min', tmpMin, label, graphTicks[tmpMinIndex])
                };

                keyEventCounter = String.fromCharCode(keyEventCounter.charCodeAt() + 1);

                keyEvents[k][keyEvents[k].length] = {
                    data:[tmpMaxIndex, tmpMax],
                    code:keyEventCounter,
                    color:graphObj.getData()[k].color,
                    event:"max",
                    desc:jQuery.i18n.prop('common.graph-max', tmpMax, label, graphTicks[tmpMaxIndex])
                };

                keyEventCounter = String.fromCharCode(keyEventCounter.charCodeAt() + 1);
            }

            var graphWidth = graphObj.width();

            for (var k = 0; k < keyEvents.length; k++) {
                var bgColor = graphObj.getData()[k].color;

                if (!keyEvents[k]) {
                    continue;
                }

                for (var l = 0; l < keyEvents[k].length; l++) {
                    var o = graphObj.pointOffset({x:keyEvents[k][l]["data"][0], y:keyEvents[k][l]["data"][1]});
                    var p = graphObj.pointOffset({x:keyEvents[k][l]["data"][0], y:keyEvents[k][l]["data"][1]});

                    if (o.left <= 15) {
                        o.left = 15;
                    }

                    if (o.left >= (graphWidth - 15)) {
                        o.left = (graphWidth - 15);
                    }

                    var keyEventLabel = $('<div class="graph-key-event-label">').text(keyEvents[k][l]["code"]);

                    keyEventLabel.attr({
                        "title":keyEvents[k][l]["desc"],
                        "data-points":"[" + keyEvents[k][l]["data"] + "]"
                    }).css({
                        "position":'absolute',
                        "left":o.left,
                        "top":o.top - 33,
                        "display":'none',
                        "background-color":bgColor
                    }).appendTo(graphObj.getPlaceholder()).show();

                    $(".tipsy").remove();
                    keyEventLabel.tipsy({gravity:$.fn.tipsy.autoWE, offset:3, html:true});
                }
            }

            // Add note labels to the graph
            if (!(bucket == "hourly" && dataPoints[0].data.length > 24) && bucket != "weekly") {
                var noteDateIds = countlyCommon.getNoteDateIds(bucket),
                    frontData = graphObj.getData()[graphObj.getData().length - 1],
                    startIndex = (!frontData.data[1] && frontData.data[1] !== 0)? 1 : 0;

                for (var k = 0, l = startIndex; k < frontData.data.length; k++, l++) {
					if(frontData.data[l]){
						var graphPoint = graphObj.pointOffset({x:frontData.data[l][0], y:frontData.data[l][1]});
	
						if (countlyCommon.getNotesForDateId(noteDateIds[k]).length) {
							$('<div class="graph-note-label"><div class="point"></div></div>').attr({
								"data-title":tickObj.tickTexts[k],
								"data-notes":countlyCommon.getNotesForDateId(noteDateIds[k]),
								"data-value":frontData.data[l][1].toFixed(1).replace(".0", "") + " " + frontData.label,
								"data-points":"[" + frontData.data[l] + "]"
							}).css({
								"position":'absolute',
								"left":graphPoint.left,
								"top":graphPoint.top,
								"display":'none',
								"border-color":frontData.color
							}).appendTo(graphObj.getPlaceholder()).show();
						}
					}
                }

                $(".graph-note-label").mouseenter(function() {
                    $("#graph-tooltip").remove();

                    var noteLines = ($(this).data("notes") + "").split("==="),
                        contents = "<div class='label-value'>" + '<span id="graph-tooltip-title">' + $(this).data("title") + '</span>' + $(this).data("value") + "</div><div class='separator'></div>";

                    for (var i = 0; i < noteLines.length; i++) {
                        contents += "<div class='note-line'>&#8226; " + noteLines[i] + "</div>";
                    }

                    var tooltip = '<div id="graph-tooltip">' + contents + '</div>',
                        x = $(this).offset().left,
                        y = $(this).offset().top,
                        widthVal,
                        heightVal;

                    $("#content").append("<div id='tooltip-calc'>" + tooltip + "</div>");
                    widthVal = $("#graph-tooltip").outerWidth();
                    heightVal = $("#graph-tooltip").outerHeight();
                    $("#tooltip-calc").remove();

                    var newLeft = x - widthVal,
                        xReach = x + widthVal;

                    if (xReach > $(window).width()) {
                        newLeft = x - widthVal - 10;
                    } else if (xReach < 800) {
                        newLeft = x + $(this).outerWidth() + 10;
                    } else {
                        newLeft -= 10;
                    }

                    $(tooltip).css({
                        top: y - (heightVal / 2) + ($(this).height() / 2),
                        left: newLeft
                    }).appendTo("body").fadeIn(200);
                });

                $(".graph-note-label").mouseleave(function() {
                    $("#graph-tooltip").remove();
                });
            }

            var previousPoint;

            $(container).unbind("plothover");
            $(container).bind("plothover", function (event, pos, item) {
                if (item) {
                    if (previousPoint != item.dataIndex) {
                        previousPoint = item.dataIndex;

                        $("#graph-tooltip").remove();
                        var x = item.datapoint[0].toFixed(1).replace(".0", ""),
                            y = item.datapoint[1].toFixed(1).replace(".0", "");

                        // If this is the "ghost" graph don't add the date
                        if (item.series.color === "#DDDDDD") {
                            showTooltip(item.pageX, item.pageY - 40, y + " " + item.series.label);
                        } else {
                            showTooltip(item.pageX, item.pageY - 40, y + " " + item.series.label, tickObj.tickTexts[item.dataIndex]);
                        }
                    }
                } else {
                    $("#graph-tooltip").remove();
                    previousPoint = null;
                }
            });
        }, dataPoints, container, bucket);
    };

    countlyCommon.drawGauge = function(targetEl, value, maxValue, gaugeColor, textField) {
        var opts = {
            lines:12,
            angle:0.15,
            lineWidth:0.44,
            pointer:{
                length:0.7,
                strokeWidth:0.05,
                color:'#000000'
            },
            colorStart:gaugeColor,
            colorStop:gaugeColor,
            strokeColor:'#E0E0E0',
            generateGradient:true
        };

        var gauge  = new Gauge($(targetEl)[0]).setOptions(opts);

        if (textField) {
            gauge.setTextField($(textField)[0]);
        }

        gauge.maxValue = maxValue;
        gauge.set(1);
        gauge.set(value);
    };

    countlyCommon.extractRangeData = function (db, propertyName, rangeArray, explainRange) {

        countlyCommon.periodObj = getPeriodObj();

        var dataArr = [],
            dataArrCounter = 0,
            rangeTotal,
            total = 0;

        if (!rangeArray) {
            return dataArr;
        }

        for (var j = 0; j < rangeArray.length; j++) {

            rangeTotal = 0;

            if (!countlyCommon.periodObj.isSpecialPeriod) {
                var tmp_x = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.activePeriod + "." + propertyName);

                if (tmp_x && tmp_x[rangeArray[j]]) {
                    rangeTotal += tmp_x[rangeArray[j]];
                }

                if (rangeTotal != 0) {
                    dataArr[dataArrCounter] = {};
                    dataArr[dataArrCounter][propertyName] = (explainRange) ? explainRange(rangeArray[j]) : rangeArray[j];
                    dataArr[dataArrCounter]["t"] = rangeTotal;

                    total += rangeTotal;
                    dataArrCounter++;
                }
            } else {
                var tmpRangeTotal = 0;

                for (var i = 0; i < (countlyCommon.periodObj.uniquePeriodArr.length); i++) {
                    var tmp_x = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.uniquePeriodArr[i] + "." + propertyName);

                    if (tmp_x && tmp_x[rangeArray[j]]) {
                        rangeTotal += tmp_x[rangeArray[j]];
                    }
                }

                for (var i = 0; i < (countlyCommon.periodObj.uniquePeriodCheckArr.length); i++) {
                    var tmp_x = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.uniquePeriodCheckArr[i] + "." + propertyName);

                    if (tmp_x && tmp_x[rangeArray[j]]) {
                        tmpRangeTotal += tmp_x[rangeArray[j]];
                    }
                }

                if (rangeTotal > tmpRangeTotal) {
                    rangeTotal = tmpRangeTotal;
                }

                if (rangeTotal != 0) {
                    dataArr[dataArrCounter] = {};
                    dataArr[dataArrCounter][propertyName] = (explainRange) ? explainRange(rangeArray[j]) : rangeArray[j];
                    dataArr[dataArrCounter]["t"] = rangeTotal;

                    total += rangeTotal;
                    dataArrCounter++;
                }
            }
        }

        for (var j = 0; j < dataArr.length; j++) {
            dataArr[j].percent = ((dataArr[j]["t"] / total) * 100).toFixed(1);
        }

        dataArr.sort(function (a, b) {
            return -(a["t"] - b["t"]);
        });

        return dataArr;
    };

    countlyCommon.extractChartData = function (db, clearFunction, chartData, dataProperties) {

        countlyCommon.periodObj = getPeriodObj();

        var periodMin = countlyCommon.periodObj.periodMin,
            periodMax = (countlyCommon.periodObj.periodMax + 1),
            dataObj = {},
            formattedDate = "",
            tableData = [],
            propertyNames = _.pluck(dataProperties, "name"),
            propertyFunctions = _.pluck(dataProperties, "func"),
            currOrPrevious = _.pluck(dataProperties, "period"),
            activeDate,
            activeDateArr;

        for (var j = 0; j < propertyNames.length; j++) {
            if (currOrPrevious[j] === "previous") {
                if (countlyCommon.periodObj.isSpecialPeriod) {
                    periodMin = 0;
                    periodMax = countlyCommon.periodObj.previousPeriodArr.length;
                    activeDateArr = countlyCommon.periodObj.previousPeriodArr;
                } else {
                    activeDate = countlyCommon.periodObj.previousPeriod;
                }
            } else {
                if (countlyCommon.periodObj.isSpecialPeriod) {
                    periodMin = 0;
                    periodMax = countlyCommon.periodObj.currentPeriodArr.length;
                    activeDateArr = countlyCommon.periodObj.currentPeriodArr;
                } else {
                    activeDate = countlyCommon.periodObj.activePeriod;
                }
            }

            for (var i = periodMin; i < periodMax; i++) {

                if (!countlyCommon.periodObj.isSpecialPeriod) {

                    if (countlyCommon.periodObj.periodMin == 0) {
                        formattedDate = moment((activeDate + " " + i + ":00:00").replace(/\./g, "/"));
                    } else if (("" + activeDate).indexOf(".") == -1) {
                        formattedDate = moment((activeDate + "/" + i + "/1").replace(/\./g, "/"));
                    } else {
                        formattedDate = moment((activeDate + "/" + i).replace(/\./g, "/"));
                    }

                    dataObj = countlyCommon.getDescendantProp(db, activeDate + "." + i);
                } else {
                    formattedDate = moment((activeDateArr[i]).replace(/\./g, "/"));
                    dataObj = countlyCommon.getDescendantProp(db, activeDateArr[i]);
                }

                dataObj = clearFunction(dataObj);

                if (!tableData[i]) {
                    tableData[i] = {};
                }

                tableData[i]["date"] = formattedDate.format(countlyCommon.periodObj.dateString);

                if (propertyFunctions[j]) {
                    propertyValue = propertyFunctions[j](dataObj);
                } else {
                    propertyValue = dataObj[propertyNames[j]];
                }

                chartData[j]["data"][chartData[j]["data"].length] = [i, propertyValue];
                tableData[i][propertyNames[j]] = propertyValue;
            }
        }

        var keyEvents = [];

        for (var k = 0; k < chartData.length; k++) {
            var flatChartData = _.flatten(chartData[k]["data"]);
            var chartVals = _.reject(flatChartData, function (context, value, index, list) {
                return value % 2 == 0;
            });
            var chartIndexes = _.filter(flatChartData, function (context, value, index, list) {
                return value % 2 == 0;
            });

            keyEvents[k] = {};
            keyEvents[k].min = _.min(chartVals);
            keyEvents[k].max = _.max(chartVals);
        }

        return {"chartDP":chartData, "chartData":_.compact(tableData), "keyEvents":keyEvents};
    };

    countlyCommon.extractTwoLevelData = function (db, rangeArray, clearFunction, dataProperties) {

        countlyCommon.periodObj = getPeriodObj();

        if (!rangeArray) {
            return {"chartData":tableData};
        }
        var periodMin = 0,
            periodMax = 0,
            dataObj = {},
            formattedDate = "",
            tableData = [],
            chartData = [],
            propertyNames = _.pluck(dataProperties, "name"),
            propertyFunctions = _.pluck(dataProperties, "func"),
            propertyValue = 0;

        if (!countlyCommon.periodObj.isSpecialPeriod) {
            periodMin = countlyCommon.periodObj.periodMin;
            periodMax = (countlyCommon.periodObj.periodMax + 1);
        } else {
            periodMin = 0;
            periodMax = countlyCommon.periodObj.currentPeriodArr.length;
        }

        var tableCounter = 0;

        if (!countlyCommon.periodObj.isSpecialPeriod) {
            for (var j = 0; j < rangeArray.length; j++) {
                dataObj = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.activePeriod + "." + rangeArray[j]);

                if (!dataObj) {
                    continue;
                }

                dataObj = clearFunction(dataObj);

                var propertySum = 0,
                    tmpPropertyObj = {};

                for (var k = 0; k < propertyNames.length; k++) {

                    if (propertyFunctions[k]) {
                        propertyValue = propertyFunctions[k](rangeArray[j], dataObj);
                    } else {
                        propertyValue = dataObj[propertyNames[k]];
                    }

                    if (typeof propertyValue !== 'string') {
                        propertySum += propertyValue;
                    }

                    tmpPropertyObj[propertyNames[k]] = propertyValue;
                }

                if (propertySum > 0) {
                    tableData[tableCounter] = {};
                    tableData[tableCounter] = tmpPropertyObj;
                    tableCounter++;
                }
            }
        } else {

            for (var j = 0; j < rangeArray.length; j++) {

                var propertySum = 0,
                    tmpPropertyObj = {},
                    tmp_x = {};

                for (var i = periodMin; i < periodMax; i++) {
                    dataObj = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.currentPeriodArr[i] + "." + rangeArray[j]);

                    if (!dataObj) {
                        continue;
                    }

                    dataObj = clearFunction(dataObj);

                    for (var k = 0; k < propertyNames.length; k++) {

                        if (propertyNames[k] == "u") {
                            propertyValue = 0;
                        } else if (propertyFunctions[k]) {
                            propertyValue = propertyFunctions[k](rangeArray[j], dataObj);
                        } else {
                            propertyValue = dataObj[propertyNames[k]];
                        }

                        if (!tmpPropertyObj[propertyNames[k]]) {
                            tmpPropertyObj[propertyNames[k]] = 0;
                        }

                        if (typeof propertyValue === 'string') {
                            tmpPropertyObj[propertyNames[k]] = propertyValue;
                        } else {
                            propertySum += propertyValue;
                            tmpPropertyObj[propertyNames[k]] += propertyValue;
                        }
                    }
                }

                if (propertyNames.indexOf("u") !== -1 && Object.keys(tmpPropertyObj).length) {
                    var tmpUniqVal = 0,
                        tmpUniqValCheck = 0,
                        tmpCheckVal = 0;

                    for (var l = 0; l < (countlyCommon.periodObj.uniquePeriodArr.length); l++) {
                        tmp_x = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.uniquePeriodArr[l] + "." + rangeArray[j]);
                        if (!tmp_x) {
                            continue;
                        }
                        tmp_x = clearFunction(tmp_x);
                        propertyValue = tmp_x["u"];

                        if (typeof propertyValue === 'string') {
                            tmpPropertyObj["u"] = propertyValue;
                        } else {
                            propertySum += propertyValue;
                            tmpUniqVal += propertyValue;
                            tmpPropertyObj["u"] += propertyValue;
                        }
                    }

                    for (var l = 0; l < (countlyCommon.periodObj.uniquePeriodCheckArr.length); l++) {
                        tmp_x = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.uniquePeriodCheckArr[l] + "." + rangeArray[j]);
                        if (!tmp_x) {
                            continue;
                        }
                        tmp_x = clearFunction(tmp_x);
                        tmpCheckVal = tmp_x["u"];

                        if (typeof tmpCheckVal !== 'string') {
                            propertySum += tmpCheckVal;
                            tmpUniqValCheck += tmpCheckVal;
                            tmpPropertyObj["u"] += tmpCheckVal;
                        }
                    }

                    if (tmpUniqVal > tmpUniqValCheck) {
                        tmpPropertyObj["u"] = tmpUniqValCheck;
                    }
                }

                //if (propertySum > 0)
                {
                    tableData[tableCounter] = {};
                    tableData[tableCounter] = tmpPropertyObj;
                    tableCounter++;
                }
            }
        }

        if (propertyNames.indexOf("u") !== -1) {
            tableData = _.sortBy(tableData, function (obj) {
                return -obj["u"];
            });
        } else if (propertyNames.indexOf("t") !== -1) {
            tableData = _.sortBy(tableData, function (obj) {
                return -obj["t"];
            });
        } else if (propertyNames.indexOf("c") !== -1) {
            tableData = _.sortBy(tableData, function (obj) {
                return -obj["c"];
            });
        }

        for (var i = 0; i < tableData.length; i++) {
            if (_.isEmpty(tableData[i])) {
                tableData[i] = null;
            }
        }

        return {"chartData":_.compact(tableData)};
    };
    
    countlyCommon.mergeMetricsByName = function(chartData, metric){
        var uniqueNames = {},
            data;
        for(var i = 0; i < chartData.length; i++){
            data = chartData[i];
            if(data[metric] && !uniqueNames[data[metric]]){
                uniqueNames[data[metric]] = data
            }
            else{
                for(var key in data){
                    if(typeof data[key] == "string")
                       uniqueNames[data[metric]][key] = data[key];
                    else if(typeof data[key] == "number"){
                        if(!uniqueNames[data[metric]][key])
                            uniqueNames[data[metric]][key] = 0;
                        uniqueNames[data[metric]][key] += data[key];
                    }
                }
            }
        }
        return _.values(uniqueNames);
    };

    // Extracts top three items (from rangeArray) that have the biggest total session counts from the db object.
    countlyCommon.extractBarData = function (db, rangeArray, clearFunction) {

        var rangeData = countlyCommon.extractTwoLevelData(db, rangeArray, clearFunction, [
            {
                name:"range",
                func:function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            { "name":"t" }
        ]);

        rangeData.chartData = _.sortBy(rangeData.chartData, function(obj) { return -obj.t; });

        var rangeNames = _.pluck(rangeData.chartData, 'range'),
            rangeTotal = _.pluck(rangeData.chartData, 't'),
            barData = [],
            sum = 0,
            maxItems = 3,
            totalPercent = 0;

        rangeTotal.sort(function (a, b) {
            if (a < b) return 1;
            if (b < a) return -1;
            return 0;
        });

        if (rangeNames.length < maxItems) {
            maxItems = rangeNames.length;
        }

        for (var i = 0; i < maxItems; i++) {
            sum += rangeTotal[i];
        }

        for (var i = 0; i < maxItems; i++) {
            var percent = Math.floor((rangeTotal[i] / sum) * 100);
            totalPercent += percent;

            if (i == (maxItems - 1)) {
                percent += 100 - totalPercent;
            }

            barData[i] = { "name":rangeNames[i], "percent":percent };
        }

        return barData;
    };
	
	countlyCommon.extractUserChartData = function (db, label, sec) {
		var ret = {"data":[],"label":label};
        countlyCommon.periodObj = getPeriodObj();
        var periodMin, periodMax, dateob;
			
		if(countlyCommon.periodObj.isSpecialPeriod){
			periodMin = 0;
            periodMax = (countlyCommon.periodObj.daysInPeriod);
			var dateob1 = countlyCommon.processPeriod(countlyCommon.periodObj.currentPeriodArr[0].toString());
			var dateob2 = countlyCommon.processPeriod(countlyCommon.periodObj.currentPeriodArr[countlyCommon.periodObj.currentPeriodArr.length-1].toString());
			dateob = {timestart:dateob1.timestart, timeend:dateob2.timeend, range:"d"};
		}
		else{
			periodMin = countlyCommon.periodObj.periodMin-1;
            periodMax = countlyCommon.periodObj.periodMax;
			dateob = countlyCommon.processPeriod(countlyCommon.periodObj.activePeriod.toString());
		}
		var res = [], 
			ts;
		//get all timestamps in that period
		for(var i = 0, l = db.length; i < l; i++){
			ts = db[i];
			if(sec)
				ts.ts = ts.ts*1000;
			if(ts.ts > dateob.timestart && ts.ts <= dateob.timeend){
				res.push(ts);
			}
		}
		var lastStart,
			lastEnd = dateob.timestart,
			total,
			ts,
			data = ret.data;
		for(var i = periodMin; i < periodMax; i++){
			total = 0;
			lastStart = lastEnd;
			lastEnd = moment(lastStart).add(moment.duration(1, dateob.range)).valueOf();
			for(var j = 0, l = res.length; j < l; j++){
				ts = res[j];
				if(ts.ts > lastStart && ts.ts <= lastEnd)
					if(ts.c)
						total += ts.c;
					else
						total++;
			}
			data.push([i, total]);
		}
        return ret;
    };
	
	countlyCommon.processPeriod = function(period){
		var date = period.split(".");
		var range,
			timestart,
			timeend;
		if(date.length == 1){
			range = "M";
			timestart = moment(period, "YYYY").valueOf();
			timeend = moment(period, "YYYY").add(moment.duration(1, "y")).valueOf();
		}
		else if(date.length == 2){
			range = "d";
			timestart = moment(period, "YYYY.MM").valueOf();
			timeend = moment(period, "YYYY.MM").add(moment.duration(1, "M")).valueOf();
		}
		else if(date.length == 3){
			range = "h";
			timestart = moment(period, "YYYY.MM.DD").valueOf();
			timeend = moment(period, "YYYY.MM.DD").add(moment.duration(1, "d")).valueOf();
		}
		return {timestart:timestart, timeend:timeend, range:range};
	}

    // Shortens the given number by adding K (thousand) or M (million) postfix.
    // K is added only if the number is bigger than 10000.
    countlyCommon.getShortNumber = function (number) {

        var tmpNumber = "";

        if (number >= 1000000 || number <= -1000000) {
            tmpNumber = ((number / 1000000).toFixed(1).replace(".0", "")) + "M";
        } else if (number >= 10000 || number <= -10000) {
            tmpNumber = ((number / 1000).toFixed(1).replace(".0", "")) + "K";
        } else {
            number += "";
            tmpNumber = number.replace(".0", "");
        }

        return tmpNumber;
    };

    // Function for getting the date range shown on the dashboard like 1 Aug - 30 Aug.
    // countlyCommon.periodObj holds a dateString property which holds the date format.
    countlyCommon.getDateRange = function () {

        countlyCommon.periodObj = getPeriodObj();

        if (!countlyCommon.periodObj.isSpecialPeriod) {
            if (countlyCommon.periodObj.dateString == "HH:mm") {
                formattedDateStart = moment(countlyCommon.periodObj.activePeriod + " " + countlyCommon.periodObj.periodMin + ":00", "YYYY.M.D HH:mm");
                formattedDateEnd = moment(countlyCommon.periodObj.activePeriod + " " + countlyCommon.periodObj.periodMax + ":00", "YYYY.M.D HH:mm");

                var nowMin = moment().format("mm");
                formattedDateEnd.add("minutes", nowMin);

            } else if (countlyCommon.periodObj.dateString == "D MMM, HH:mm") {
                formattedDateStart = moment(countlyCommon.periodObj.activePeriod, "YYYY.M.D");
                formattedDateEnd = moment(countlyCommon.periodObj.activePeriod, "YYYY.M.D").add("hours", 23).add("minutes", 59);
            } else {
                formattedDateStart = moment(countlyCommon.periodObj.activePeriod + "." + countlyCommon.periodObj.periodMin, "YYYY.M.D");
                formattedDateEnd = moment(countlyCommon.periodObj.activePeriod + "." + countlyCommon.periodObj.periodMax, "YYYY.M.D");
            }
        } else {
            formattedDateStart = moment(countlyCommon.periodObj.currentPeriodArr[0], "YYYY.M.D");
            formattedDateEnd = moment(countlyCommon.periodObj.currentPeriodArr[(countlyCommon.periodObj.currentPeriodArr.length - 1)], "YYYY.M.D");
        }

        var fromStr = formattedDateStart.format(countlyCommon.periodObj.dateString),
            toStr = formattedDateEnd.format(countlyCommon.periodObj.dateString);

        if (fromStr == toStr) {
            return fromStr;
        } else {
            return fromStr + " - " + toStr;
        }
    };

    // Function for merging updateObj object to dbObj.
    // Used for merging the received data for today to the existing data while updating the dashboard.
    countlyCommon.extendDbObj = function (dbObj, updateObj) {
        var now = moment(),
            year = now.year(),
            month = (now.month() + 1),
            day = now.date(),
            weekly = Math.ceil(now.format("DDD") / 7),
            intRegex = /^\d+$/,
            tmpUpdateObj = {},
            tmpOldObj = {};

        if (updateObj[year] && updateObj[year][month] && updateObj[year][month][day]) {
            if (!dbObj[year]) {
                dbObj[year] = {};
            }
            if (!dbObj[year][month]) {
                dbObj[year][month] = {};
            }
            if (!dbObj[year][month][day]) {
                dbObj[year][month][day] = {};
            }
            if (!dbObj[year]["w" + weekly]) {
                dbObj[year]["w" + weekly] = {};
            }

            tmpUpdateObj = updateObj[year][month][day];
            tmpOldObj = dbObj[year][month][day];

            dbObj[year][month][day] = updateObj[year][month][day];
        }

        if (updateObj["meta"]) {
            if (!dbObj["meta"]) {
                dbObj["meta"] = {};
            }

            dbObj["meta"] = updateObj["meta"];
        }

        for (var level1 in tmpUpdateObj) {
            if (!tmpUpdateObj.hasOwnProperty(level1)) {
                continue;
            }

            if (intRegex.test(level1)) {
                continue;
            }

            if (_.isObject(tmpUpdateObj[level1])) {
                if (!dbObj[year][level1]) {
                    dbObj[year][level1] = {};
                }

                if (!dbObj[year][month][level1]) {
                    dbObj[year][month][level1] = {};
                }

                if (!dbObj[year]["w" + weekly][level1]) {
                    dbObj[year]["w" + weekly][level1] = {};
                }
            } else {
                if (dbObj[year][level1]) {
                    if (tmpOldObj[level1]) {
                        dbObj[year][level1] += (tmpUpdateObj[level1] - tmpOldObj[level1]);
                    } else {
                        dbObj[year][level1] += tmpUpdateObj[level1];
                    }
                } else {
                    dbObj[year][level1] = tmpUpdateObj[level1];
                }

                if (dbObj[year][month][level1]) {
                    if (tmpOldObj[level1]) {
                        dbObj[year][month][level1] += (tmpUpdateObj[level1] - tmpOldObj[level1]);
                    } else {
                        dbObj[year][month][level1] += tmpUpdateObj[level1];
                    }
                } else {
                    dbObj[year][month][level1] = tmpUpdateObj[level1];
                }

                if (dbObj[year]["w" + weekly][level1]) {
                    if (tmpOldObj[level1]) {
                        dbObj[year]["w" + weekly][level1] += (tmpUpdateObj[level1] - tmpOldObj[level1]);
                    } else {
                        dbObj[year]["w" + weekly][level1] += tmpUpdateObj[level1];
                    }
                } else {
                    dbObj[year]["w" + weekly][level1] = tmpUpdateObj[level1];
                }
            }

            if (tmpUpdateObj[level1]) {
                for (var level2 in tmpUpdateObj[level1]) {
                    if (!tmpUpdateObj[level1].hasOwnProperty(level2)) {
                        continue;
                    }

                    if (dbObj[year][level1][level2]) {
                        if (tmpOldObj[level1] && tmpOldObj[level1][level2]) {
                            dbObj[year][level1][level2] += (tmpUpdateObj[level1][level2] - tmpOldObj[level1][level2]);
                        } else {
                            dbObj[year][level1][level2] += tmpUpdateObj[level1][level2];
                        }
                    } else {
                        dbObj[year][level1][level2] = tmpUpdateObj[level1][level2];
                    }

                    if (dbObj[year][month][level1][level2]) {
                        if (tmpOldObj[level1] && tmpOldObj[level1][level2]) {
                            dbObj[year][month][level1][level2] += (tmpUpdateObj[level1][level2] - tmpOldObj[level1][level2]);
                        } else {
                            dbObj[year][month][level1][level2] += tmpUpdateObj[level1][level2];
                        }
                    } else {
                        dbObj[year][month][level1][level2] = tmpUpdateObj[level1][level2];
                    }

                    if (dbObj[year]["w" + weekly][level1][level2]) {
                        if (tmpOldObj[level1] && tmpOldObj[level1][level2]) {
                            dbObj[year]["w" + weekly][level1][level2] += (tmpUpdateObj[level1][level2] - tmpOldObj[level1][level2]);
                        } else {
                            dbObj[year]["w" + weekly][level1][level2] += tmpUpdateObj[level1][level2];
                        }
                    } else {
                        dbObj[year]["w" + weekly][level1][level2] = tmpUpdateObj[level1][level2];
                    }
                }
            }
        }

        // Fix update of total user count

        if (updateObj[year]) {
            if (updateObj[year]["u"]) {
                if (!dbObj[year]) {
                    dbObj[year] = {};
                }

                dbObj[year]["u"] = updateObj[year]["u"];
            }

            if (updateObj[year][month] && updateObj[year][month]["u"]) {
                if (!dbObj[year]) {
                    dbObj[year] = {};
                }

                if (!dbObj[year][month]) {
                    dbObj[year][month] = {};
                }

                dbObj[year][month]["u"] = updateObj[year][month]["u"];
            }

            if (updateObj[year]["w" + weekly] && updateObj[year]["w" + weekly]["u"]) {
                if (!dbObj[year]) {
                    dbObj[year] = {};
                }

                if (!dbObj[year]["w" + weekly]) {
                    dbObj[year]["w" + weekly] = {};
                }

                dbObj[year]["w" + weekly]["u"] = updateObj[year]["w" + weekly]["u"];
            }
        }
    };

    countlyCommon.toFirstUpper = function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    countlyCommon.divide = function (val1, val2) {
        var temp = val1 / val2;
	
        if (!temp || temp == Number.POSITIVE_INFINITY) {
            temp = 0;
        }
	
        return temp;
    };

    countlyCommon.getTickObj = function(bucket) {
        var days = parseInt(countlyCommon.periodObj.numberOfDays, 10),
            ticks = [],
            tickTexts = [],
            skipReduction = false,
            limitAdjustment = 0;

        if ((days == 1 && _period != "month" && _period != "day") || (days == 1 && bucket == "hourly")) {
            for (var i = 0; i < 24; i++) {
                ticks.push([i, (i + ":00")]);
                tickTexts.push((i + ":00"));
            }

            skipReduction = true;
        } else {
            var start = moment().subtract('days', days);
            if (Object.prototype.toString.call(countlyCommon.getPeriod()) === '[object Array]'){
                start = moment(countlyCommon.periodObj.currentPeriodArr[countlyCommon.periodObj.currentPeriodArr.length - 1], "YYYY.MM.DD").subtract('days',days);
            }
            if (bucket == "monthly") {
                var allMonths = [];

                for (var i = 0; i < days; i++) {
                    start.add('days', 1);
                    allMonths.push(start.format("MMM"));
                }

                allMonths = _.uniq(allMonths);

                for (var i = 0; i < allMonths.length; i++) {
                    ticks.push([i, allMonths[i]]);
                    tickTexts[i] = allMonths[i];
                }
            } else if (bucket == "weekly") {
                var allWeeks = [];

                for (var i = 0; i < days; i++) {
                    start.add('days', 1);
                    allWeeks.push(start.isoweek());
                }

                allWeeks = _.uniq(allWeeks);

                for (var i = 0; i < allWeeks.length; i++) {
                    ticks.push([i, "W" + allWeeks[i]]);

                    var weekText = moment().isoweek(allWeeks[i]).isoday(1).format(", MMM D");
                    tickTexts[i] = "W" + allWeeks[i] + weekText;
                }
            } else if (bucket == "hourly") {
                for (var i = 0; i < days; i++) {
                    start.add('days', 1);

                    for (var j = 0; j < 24; j++) {
                        if (j == 0) {
                            ticks.push([((24 * i) + j), start.format("D MMM") + " 0:00"]);
                        }

                        tickTexts.push(start.format("D MMM, ") + j + ":00");
                    }
                }
            } else {
                for (var i = 0; i < days; i++) {
                    start.add('days', 1);
                    ticks.push([i, start.format("D MMM")]);
                    tickTexts[i] = start.format("D MMM");
                }
            }

            ticks = _.compact(ticks);
            tickTexts = _.compact(tickTexts);
        }

        if (ticks.length <= 2) {
            limitAdjustment = 0.02;
            var tmpTicks = [],
                tmpTickTexts = [];

            tmpTickTexts[0] = "";
            tmpTicks[0] = [-0.02, ""];

            for (var i = 0; i < ticks.length; i++) {
                tmpTicks[i + 1] = [i, ticks[i][1]];
                tmpTickTexts[i + 1] = tickTexts[i];
            }

            tmpTickTexts.push("");
            tmpTicks.push([tmpTicks.length - 1 - 0.98, ""]);

            ticks = tmpTicks;
            tickTexts = tmpTickTexts;
        } else if (!skipReduction && ticks.length > 10) {
            var reducedTicks = [],
                step = (Math.floor(ticks.length / 10) < 1)? 1 : Math.floor(ticks.length / 10),
                pickStartIndex = (Math.floor(ticks.length / 30) < 1)? 1 : Math.floor(ticks.length / 30);

            for (var i = pickStartIndex; i < (ticks.length - 1); i = i + step) {
                reducedTicks.push(ticks[i]);
            }

            ticks = reducedTicks;
        } else {
            ticks[0] = null;

            // Hourly ticks already contain 23 empty slots at the end
            if (!(bucket == "hourly" && days != 1)) {
                ticks[ticks.length - 1] = null;
            }
        }

        return {
            min: 0 - limitAdjustment,
            max: (limitAdjustment)? tickTexts.length - 3 + limitAdjustment : tickTexts.length - 1,
            tickTexts: tickTexts,
            ticks: _.compact(ticks)
        };
    };

    countlyCommon.union = function(x, y) {
        if (!x) {
            return y;
        } else if (!y) {
            return x;
        }

        var needUnion = false;

        for (var i = 0; i < y.length; i++) {
            if (x.indexOf(y[i]) === -1) {
                needUnion = true;
                break;
            }
        }

        if (!needUnion) {
            return x;
        }

        var obj = {};
        for (var i = x.length-1; i >= 0; -- i) {
            obj[x[i]] = x[i];
        }

        for (var i = y.length-1; i >= 0; -- i) {
            obj[y[i]] = y[i];
        }

        var res = [];

        for (var k in obj) {
            res.push(obj[k]);
        }

        return res;
    };

    countlyCommon.formatNumber = function(x) {
        x = parseFloat(parseFloat(x).toFixed(2));
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };
	
	countlyCommon.pad = function(n, width, z){
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	};

    countlyCommon.getNoteDateIds = function(bucket) {
        var _periodObj = countlyCommon.periodObj,
            dateIds = [],
            dotSplit = [],
            tmpDateStr = "";

        if (!_periodObj.isSpecialPeriod && !bucket) {
            for (var i = _periodObj.periodMin; i < (_periodObj.periodMax + 1); i++) {
                dotSplit = (_periodObj.activePeriod + "." + i).split(".");
                tmpDateStr = "";

                for (var j = 0; j < dotSplit.length; j++) {
                    if (dotSplit[j].length == 1) {
                        tmpDateStr += "0" + dotSplit[j];
                    } else {
                        tmpDateStr += dotSplit[j];
                    }
                }

                dateIds.push(tmpDateStr);
            }
        } else {
            if (!_periodObj.currentPeriodArr && bucket == "daily") {
                var tmpDate = new Date();
                _periodObj.currentPeriodArr = [];

                if (countlyCommon.getPeriod() == "month") {
                    for (var i = 0; i < (tmpDate.getMonth() + 1); i++) {
                        var daysInMonth = moment().month(i).daysInMonth();

                        for (var j = 0; j < daysInMonth; j++) {
                            _periodObj.currentPeriodArr.push(_periodObj.activePeriod + "." + (i + 1) + "." + (j + 1));

                            // If current day of current month, just break
                            if ((i == tmpDate.getMonth()) && (j == (tmpDate.getDate() - 1))) {
                                break;
                            }
                        }
                    }
                } else if(countlyCommon.getPeriod() == "day") {
                    for (var i = 0; i < tmpDate.getDate(); i++) {
                        _periodObj.currentPeriodArr.push(_periodObj.activePeriod + "." + (i + 1));
                    }
                } else{
                    _periodObj.currentPeriodArr.push(_periodObj.activePeriod);
                }
            }

            for (var i = 0; i < (_periodObj.currentPeriodArr.length); i++) {
                dotSplit = _periodObj.currentPeriodArr[i].split(".");
                tmpDateStr = "";

                for (var j = 0; j < dotSplit.length; j++) {
                    if (dotSplit[j].length == 1) {
                        tmpDateStr += "0" + dotSplit[j];
                    } else {
                        tmpDateStr += dotSplit[j];
                    }
                }

                dateIds.push(tmpDateStr);
            }
        }

        switch (bucket) {
            case "hourly":
                var tmpDateIds = [];

                for (var i = 0; i < 25; i++) {
                    tmpDateIds.push(dateIds[0] + ((i < 10)? "0" + i : i))
                }

                dateIds = tmpDateIds;
                break;
            case "monthly":
                var tmpDateIds = [];

                for (var i = 0; i < dateIds.length; i++) {
                    countlyCommon.arrayAddUniq(tmpDateIds, moment(dateIds[i], "YYYYMMDD").format("YYYYMM"))
                }

                dateIds = tmpDateIds;
                break;
        }

        return dateIds;
    };

    countlyCommon.getNotesForDateId = function(dateId) {
        var ret = [];

        if (countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID] && countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes) {
            for (var date in countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes) {
                if (date.indexOf(dateId) === 0) {
                    ret = ret.concat(countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes[date]);
                }
            }
        }

        return ret.join("===");
    };

    countlyCommon.arrayAddUniq = function (arr, item) {
        if (!arr) {
            arr = [];
        }

        if (toString.call(item) === "[object Array]") {
            for (var i = 0; i < item.length; i++) {
                if (arr.indexOf(item[i]) === -1) {
                    arr[arr.length] = item[i];
                }
            }
        } else {
            if (arr.indexOf(item) === -1) {
                arr[arr.length] = item;
            }
        }
    };
	
	countlyCommon.formatTimeAgo = function(timestamp) {
		var target = new Date(timestamp*1000);
		var now = new Date();
		var diff = Math.floor((now - target) / 1000);
		if (diff <= 1) {return "<span style='color:#50C354;'>just now</span>";}
		if (diff < 20) {return "<span style='color:#50C354;'>" + diff + " seconds ago</span>";}
		if (diff < 40) {return "<span style='color:#50C354;'>half a minute ago</span>";}
		if (diff < 60) {return "<span style='color:#50C354;'>less than a minute ago</span>";}
		if (diff <= 90) {return "one minute ago";}
		if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
		if (diff <= 5400) {return "1 hour ago";}
		if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
		if (diff <= 129600) {return "1 day ago";}
		if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
		if (diff <= 777600) {return "1 week ago";}
		return "on " + target.toString().split(" GMT")[0];
	};
	
	countlyCommon.formatTime = function(timestamp) {
		var str = "";
		var seconds = timestamp % 60;
		str = str+leadingZero(seconds);
		timestamp -= seconds;
		var minutes = timestamp % (60*60);
		str = leadingZero(minutes/60)+":"+str;
		timestamp -= minutes;
		var hours = timestamp % (60*60*24);
		str = leadingZero(hours/(60*60))+":"+str;
		timestamp -= hours;
		if(timestamp > 0){
			var days = timestamp % (60*60*24*365);
			str = (days/(60*60*24))+" day(s) "+str;
			timestamp -= days;
			if(timestamp > 0){
				str = (timestamp/(60*60*24*365))+" year(s) "+str;
			}
		}
		return str;
	};
    
    countlyCommon.timeString = function(timespent){
        var timeSpentString = (timespent.toFixed(1)) + " " + jQuery.i18n.map["common.minute.abrv"];

        if (timespent >= 142560) {
            timeSpentString = (timespent / 525600).toFixed(1) + " " + jQuery.i18n.map["common.year.abrv"];
        } else if (timespent >= 1440) {
            timeSpentString = (timespent / 1440).toFixed(1) + " " + jQuery.i18n.map["common.day.abrv"];
        } else if (timespent >= 60) {
            timeSpentString = (timespent / 60).toFixed(1) + " " + jQuery.i18n.map["common.hour.abrv"];
        }
        return timeSpentString;
        
        
        /*var timeSpentString = "";
        if(timespent > 1){
            timeSpentString = Math.floor(timespent) + " " + jQuery.i18n.map["common.minute.abrv"]+" ";
            var left = Math.floor((timespent - Math.floor(timespent))*60);
            if(left > 0)
                timeSpentString += left + " s";
        }
        else
            timeSpentString += Math.floor((timespent - Math.floor(timespent))*60) + " s";

        if (timespent >= 142560) {
            timeSpentString = Math.floor(timespent / 525600) + " " + jQuery.i18n.map["common.year.abrv"];
            var left = Math.floor((timespent - Math.floor(timespent / 525600)*525600)/1440);
            if(left > 0)
                timeSpentString += " "+left + " " + jQuery.i18n.map["common.day.abrv"];
        } else if (timespent >= 1440) {
            timeSpentString = Math.floor(timespent / 1440) + " " + jQuery.i18n.map["common.day.abrv"];
            var left = Math.floor((timespent - Math.floor(timespent / 1440)*1440)/60);
            if(left > 0)
                timeSpentString += " "+left + " " + jQuery.i18n.map["common.hour.abrv"];
        } else if (timespent >= 60) {
            timeSpentString = Math.floor(timespent / 60) + " " + jQuery.i18n.map["common.hour.abrv"];
            var left = Math.floor(timespent - Math.floor(timespent / 60)*60)
            if(left > 0)
                timeSpentString += " "+left + " " + jQuery.i18n.map["common.minute.abrv"];
        }
        return timeSpentString;*/
    };
	
	countlyCommon.getDate = function(timestamp) {
		var d = new Date(timestamp*1000);
		return leadingZero(d.getDate())+"."+leadingZero(d.getMonth()+1)+"."+d.getFullYear();
	}
	
	countlyCommon.getTime = function(timestamp) {
		var d = new Date(timestamp*1000);
		return leadingZero(d.getHours())+":"+leadingZero(d.getMinutes());
	}
	
	function leadingZero(value){
		if(value > 9)
			return value
		return "0"+value;
	}
    
    countlyCommon.round = function(num, digits) {
        digits = Math.pow(10, digits || 0);
        return Math.round(num * digits) / digits;
    };
    
    countlyCommon.getDashboardData = function(data, properties, _periodObj){
        function clearObject(obj){
            if (obj) {
                for(var i = 0; i < properties.length; i++){
                    if (!obj[properties[i]]) obj[properties[i]] = 0;
                }
            }
            else {
                obj = {}
                for(var i = 0; i < properties.length; i++){
                    obj[properties[i]] = 0;
                }
            }
    
            return obj;
        };

        var dataArr = {},
            tmp_x,
            tmp_y,
            current = {},
            previous = {},
            change = {};
            
            for(var i = 0; i < properties.length; i++){
                current[properties[i]] = 0;
                previous[properties[i]] = 0;
            }

        if (_periodObj.isSpecialPeriod) {

            for (var j = 0; j < (_periodObj.currentPeriodArr.length); j++) {
                tmp_x = countlyCommon.getDescendantProp(data, _periodObj.currentPeriodArr[j]);
                tmp_x = clearObject(tmp_x);
                for(var i = 0; i < properties.length; i++){
                    current[properties[i]] += tmp_x[properties[i]];
                }
            }

            for (var j = 0; j < (_periodObj.previousPeriodArr.length); j++) {
                tmp_y = countlyCommon.getDescendantProp(data, _periodObj.previousPeriodArr[j]);
                tmp_y = clearObject(tmp_y);
                for(var i = 0; i < properties.length; i++){
                    previous[properties[i]] += tmp_y[properties[i]];
                }
            }
        } else {
            tmp_x = countlyCommon.getDescendantProp(data, _periodObj.activePeriod);
            tmp_y = countlyCommon.getDescendantProp(data, _periodObj.previousPeriod);
            tmp_x = clearObject(tmp_x);
            tmp_y = clearObject(tmp_y);
            
            for(var i = 0; i < properties.length; i++){
                current[properties[i]] = tmp_x[properties[i]];
                previous[properties[i]] = tmp_y[properties[i]];
            }
        }

        for(var i = 0; i < properties.length; i++){
            change[properties[i]] = countlyCommon.getPercentChange(previous[properties[i]], current[properties[i]]);
            dataArr[properties[i]] = {
                "total":current[properties[i]],
                "change":change[properties[i]].percent,
                "trend":change[properties[i]].trend,
            };
        }

        return dataArr;
    }


    // Private Methods

    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function getDOY() {
        var onejan = new Date((new Date()).getFullYear(),0,1);
        return Math.ceil(((new Date()) - onejan) / 86400000);
    }

    // Returns a period object used by all time related data calculation functions.
    function getPeriodObj() {

        var now = moment(),
            year = now.year(),
            month = (now.month() + 1),
            day = now.date(),
            hour = (now.hours()),
            activePeriod,
            previousPeriod,
            periodMax,
            periodMin,
            periodObj = {},
            isSpecialPeriod = false,
            daysInPeriod = 0,
            numberOfDays = 0,
            rangeEndDay = null,
            dateString,
            uniquePeriodsCheck = [],
            previousUniquePeriodsCheck = [];

        switch (_period) {
            case "month":
                activePeriod = year;
                previousPeriod = year - 1;
                periodMax = month;
                periodMin = 1;
                dateString = "MMM";
                numberOfDays = getDOY();
                break;
            case "day":
                activePeriod = year + "." + month;

                var previousDate = moment().subtract('days', day),
                    previousYear = previousDate.year(),
                    previousMonth = (previousDate.month() + 1),
                    previousDay = previousDate.date();

                previousPeriod = previousYear + "." + previousMonth;
                periodMax = day;
                periodMin = 1;
                dateString = "D MMM";
                numberOfDays = moment().format("D");
                break;
            case "yesterday":
                var yesterday = moment().subtract('days', 1),
                    year = yesterday.year(),
                    month = (yesterday.month() + 1),
                    day = yesterday.date();

                activePeriod = year + "." + month + "." + day;
                var previousDate = moment().subtract('days', 2),
                    previousYear = previousDate.year(),
                    previousMonth = (previousDate.month() + 1),
                    previousDay = previousDate.date();

                previousPeriod = previousYear + "." + previousMonth + "." + previousDay;
                periodMax = 23;
                periodMin = 0;
                dateString = "D MMM, HH:mm";
                numberOfDays = 1;
                break;
            case "hour":
                activePeriod = year + "." + month + "." + day;
                var previousDate = moment().subtract('days', 1),
                    previousYear = previousDate.year(),
                    previousMonth = (previousDate.month() + 1),
                    previousDay = previousDate.date();

                previousPeriod = previousYear + "." + previousMonth + "." + previousDay;
                periodMax = hour;
                periodMin = 0;
                dateString = "HH:mm";
                numberOfDays = 1;
                break;
            case "7days":
                numberOfDays = daysInPeriod = 7;
                break;
            case "30days":
                numberOfDays = daysInPeriod = 30;
                break;
            case "60days":
                numberOfDays = daysInPeriod = 60;
                break;
            case "90days":
                numberOfDays = daysInPeriod = 90;
                break;
            default:
                break;
        }

        // Check whether period object is array
        if (Object.prototype.toString.call(_period) === '[object Array]' && _period.length == 2) {
            var tmpDate = new Date (_period[1]);
            tmpDate.setHours(0,0,0,0);
            _period[1]= tmpDate.getTime();
            // One day is selected from the datepicker
            if (_period[0] == _period[1]) {
                var selectedDate = moment(_period[0]),
                    selectedYear = selectedDate.year(),
                    selectedMonth = (selectedDate.month() + 1),
                    selectedDay = selectedDate.date(),
                    selectedHour = (selectedDate.hours());

                activePeriod = selectedYear + "." + selectedMonth + "." + selectedDay;

                var previousDate = selectedDate.subtract('days', 1),
                    previousYear = previousDate.year(),
                    previousMonth = (previousDate.month() + 1),
                    previousDay = previousDate.date();

                previousPeriod = previousYear + "." + previousMonth + "." + previousDay;
                periodMax = 23;
                periodMin = 0;
                dateString = "D MMM, HH:mm";
                numberOfDays = 1;
            } else {
                var a = moment(_period[0]),
                    b = moment(_period[1]);

                numberOfDays = daysInPeriod = b.diff(a, 'days') + 1;
                rangeEndDay = _period[1];
            }
        }

        if (daysInPeriod != 0) {
            var yearChanged = false,
                currentYear = 0,
                currWeeksArr = [],
                currWeekCounts = {},
                currMonthsArr = [],
                currMonthCounts = {},
                currPeriodArr = [],
                prevWeeksArr = [],
                prevWeekCounts = {},
                prevMonthsArr = [],
                prevMonthCounts = {},
                prevPeriodArr = [];

            for (var i = (daysInPeriod - 1); i > -1; i--) {
                var currIndex = (!rangeEndDay) ? moment().subtract('days', i) : moment(rangeEndDay).subtract('days', i),
                    currIndexYear = currIndex.year(),
                    prevIndex = (!rangeEndDay) ? moment().subtract('days', (daysInPeriod + i)) : moment(rangeEndDay).subtract('days', (daysInPeriod + i)),
                    prevYear = prevIndex.year();

                if (i != (daysInPeriod - 1) && currentYear != currIndexYear) {
                    yearChanged = true;
                }
                currentYear = currIndexYear;

                // Current period variables

                var currWeek = currentYear + "." + "w" + Math.ceil(currIndex.format("DDD") / 7);
                currWeeksArr[currWeeksArr.length] = currWeek;
                currWeekCounts[currWeek] = (currWeekCounts[currWeek]) ? (currWeekCounts[currWeek] + 1) : 1;

                var currMonth = currIndex.format("YYYY.M");
                currMonthsArr[currMonthsArr.length] = currMonth;
                currMonthCounts[currMonth] = (currMonthCounts[currMonth]) ? (currMonthCounts[currMonth] + 1) : 1;

                currPeriodArr[currPeriodArr.length] = currIndex.format("YYYY.M.D");

                // Previous period variables

                var prevWeek = prevYear + "." + "w" + Math.ceil(prevIndex.format("DDD") / 7);
                prevWeeksArr[prevWeeksArr.length] = prevWeek;
                prevWeekCounts[prevWeek] = (prevWeekCounts[prevWeek]) ? (prevWeekCounts[prevWeek] + 1) : 1;

                var prevMonth = prevIndex.format("YYYY.M");
                prevMonthsArr[prevMonthsArr.length] = prevMonth;
                prevMonthCounts[prevMonth] = (prevMonthCounts[prevMonth]) ? (prevMonthCounts[prevMonth] + 1) : 1;

                prevPeriodArr[prevPeriodArr.length] = prevIndex.format("YYYY.M.D");
            }

            dateString = (yearChanged) ? "D MMM, YYYY" : "D MMM";
            isSpecialPeriod = true;
        }

        periodObj = {
            "activePeriod":activePeriod,
            "periodMax":periodMax,
            "periodMin":periodMin,
            "previousPeriod":previousPeriod,
            "currentPeriodArr":currPeriodArr,
            "previousPeriodArr":prevPeriodArr,
            "isSpecialPeriod":isSpecialPeriod,
            "dateString":dateString,
            "daysInPeriod":daysInPeriod,
            "numberOfDays":numberOfDays,
            "uniquePeriodArr":getUniqArray(currWeeksArr, currWeekCounts, currMonthsArr, currMonthCounts, currPeriodArr),
            "uniquePeriodCheckArr":getUniqCheckArray(currWeeksArr, currWeekCounts, currMonthsArr, currMonthCounts),
            "previousUniquePeriodArr":getUniqArray(prevWeeksArr, prevWeekCounts, prevMonthsArr, prevMonthCounts, prevPeriodArr),
            "previousUniquePeriodCheckArr":getUniqCheckArray(prevWeeksArr, prevWeekCounts, prevMonthsArr, prevMonthCounts)
        };

        return periodObj;
    }

    function getUniqArray(weeksArray, weekCounts, monthsArray, monthCounts, periodArr) {

        if (_period == "month" || _period == "day" || _period == "yesterday" || _period == "hour") {
            return [];
        }

        if (Object.prototype.toString.call(_period) === '[object Array]' && _period.length == 2) {
            if (_period[0] == _period[1]) {
                return [];
            }
        }

        var weeksArray = clone(weeksArray),
            weekCounts = clone(weekCounts),
            monthsArray = clone(monthsArray),
            monthCounts = clone(monthCounts),
            periodArr = clone(periodArr);

        var uniquePeriods = [],
            tmpDaysInMonth = -1,
            tmpPrevKey = -1,
            rejectedWeeks = [],
            rejectedWeekDayCounts = {};

        for (var key in weekCounts) {

            // If this is the current week we can use it
            if (key === moment().format("YYYY.\\w w").replace(" ", "")) {
                continue;
            }

            if (weekCounts[key] < 7) {
                for (var i = 0; i < weeksArray.length; i++) {
                    weeksArray[i] = weeksArray[i].replace(key, 0);
                }
            }
        }

        for (var key in monthCounts) {
            if (tmpPrevKey != key) {
                if (moment().format("YYYY.M") === key) {
                    tmpDaysInMonth = moment().format("D");
                } else {
                    tmpDaysInMonth = moment(key, "YYYY.M").daysInMonth();
                }

                tmpPrevKey = key;
            }

            if (monthCounts[key] < tmpDaysInMonth) {
                for (var i = 0; i < monthsArray.length; i++) {
                    monthsArray[i] = monthsArray[i].replace(key, 0);
                }
            }
        }

        for (var i = 0; i < monthsArray.length; i++) {
            if (monthsArray[i] == 0) {
                if (weeksArray[i] == 0 || (rejectedWeeks.indexOf(weeksArray[i]) != -1)) {
                    uniquePeriods[i] = periodArr[i];
                } else {
                    uniquePeriods[i] = weeksArray[i];
                }
            } else {
                rejectedWeeks[rejectedWeeks.length] = weeksArray[i];
                uniquePeriods[i] = monthsArray[i];

                if (rejectedWeekDayCounts[weeksArray[i]]) {
                    rejectedWeekDayCounts[weeksArray[i]].count++;
                } else {
                    rejectedWeekDayCounts[weeksArray[i]] = {
                        count:1,
                        index:i
                    };
                }
            }
        }

        var totalWeekCounts = _.countBy(weeksArray, function (per) {
            return per;
        });

        for (var weekDayCount in rejectedWeekDayCounts) {

            // If the whole week is rejected continue
            if (rejectedWeekDayCounts[weekDayCount].count == 7) {
                continue;
            }

            // If its the current week continue
            if (moment().format("YYYY.\\w w").replace(" ", "") == weekDayCount && totalWeekCounts[weekDayCount] == rejectedWeekDayCounts[weekDayCount].count) {
                continue;
            }

            // If only some part of the week is rejected we should add back daily buckets

            var startIndex = rejectedWeekDayCounts[weekDayCount].index - (totalWeekCounts[weekDayCount] - rejectedWeekDayCounts[weekDayCount].count),
                limit = startIndex + (totalWeekCounts[weekDayCount] - rejectedWeekDayCounts[weekDayCount].count);

            for (var i = startIndex; i < limit; i++) {
                // If there isn't already a monthly bucket for that day
                if (monthsArray[i] == 0) {
                    uniquePeriods[i] = periodArr[i];
                }
            }
        }

        rejectedWeeks = _.uniq(rejectedWeeks);
        uniquePeriods = _.uniq(_.difference(uniquePeriods, rejectedWeeks));

        return uniquePeriods;
    }

    function getUniqCheckArray(weeksArray, weekCounts, monthsArray, monthCounts) {

        if (_period == "month" || _period == "day" || _period == "yesterday" || _period == "hour") {
            return [];
        }

        if (Object.prototype.toString.call(_period) === '[object Array]' && _period.length == 2) {
            if (_period[0] == _period[1]) {
                return [];
            }
        }

        var weeksArray = clone(weeksArray),
            weekCounts = clone(weekCounts),
            monthsArray = clone(monthsArray),
            monthCounts = clone(monthCounts);

        var uniquePeriods = [],
            tmpDaysInMonth = -1,
            tmpPrevKey = -1;

        for (var key in weekCounts) {
            if (key === moment().format("YYYY.\\w w").replace(" ", "")) {
                continue;
            }

            if (weekCounts[key] < 1) {
                for (var i = 0; i < weeksArray.length; i++) {
                    weeksArray[i] = weeksArray[i].replace(key, 0);
                }
            }
        }

        for (var key in monthCounts) {
            if (tmpPrevKey != key) {
                if (moment().format("YYYY.M") === key) {
                    tmpDaysInMonth = moment().format("D");
                } else {
                    tmpDaysInMonth = moment(key, "YYYY.M").daysInMonth();
                }

                tmpPrevKey = key;
            }

            if (monthCounts[key] < (tmpDaysInMonth * 0.5)) {
                for (var i = 0; i < monthsArray.length; i++) {
                    monthsArray[i] = monthsArray[i].replace(key, 0);
                }
            }
        }

        for (var i = 0; i < monthsArray.length; i++) {
            if (monthsArray[i] == 0) {
                if (weeksArray[i] == 0) {

                } else {
                    uniquePeriods[i] = weeksArray[i];
                }
            } else {
                uniquePeriods[i] = monthsArray[i];
            }
        }

        uniquePeriods = _.uniq(uniquePeriods);

        return uniquePeriods;
    }

    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;

        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
    }

    // Function to show the tooltip when any data point in the graph is hovered on.
    function showTooltip(x, y, contents, title) {
        var tooltip = "";

        if (title) {
            var tooltipTitle = '<span id="graph-tooltip-title">' + title + '</span>';
            tooltip = '<div id="graph-tooltip">' + tooltipTitle + contents + '</div>'
        } else {
            tooltip = '<div id="graph-tooltip">' + contents + '</div>'
        }

        $("#content").append("<div id='tooltip-calc'>" + tooltip + "</div>");
        var widthVal = $("#graph-tooltip").outerWidth();
        $("#tooltip-calc").remove();

        var newLeft = (x - (widthVal / 2)),
            xReach = (x + (widthVal / 2));

        if (xReach > $(window).width()) {
            newLeft = (x - widthVal);
        } else if (xReach < 340) {
            newLeft = x;
        }

        $(tooltip).css({
            top:y,
            left:newLeft
        }).appendTo("body").fadeIn(200);
    }

    function flattenObjUntilLastProp(ob) {
        var toReturn = flattenObj(ob);

        for (var i in toReturn) {
            var n = i.lastIndexOf('.');

            if (n !== -1) {
                toReturn[i.substring(0, n)] = toReturn[i];
                delete toReturn[i];
            }
        }

        return toReturn
    }

    function flattenObj(ob) {
        var toReturn = {};

        for (var i in ob) {
            if ((typeof ob[i]) == 'object') {
                var flatObject = flattenObj(ob[i]);
                for (var x in flatObject) {
                    toReturn[i + '.' + x] = flatObject[x];
                }
            } else {
                toReturn[i] = ob;
            }
        }

        return toReturn;
    }

}(window.countlyCommon = window.countlyCommon || {}, jQuery));