"use strict";var lib;(lib||={}).api=(()=>{var M=Object.defineProperty;var C=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames;var _=Object.prototype.hasOwnProperty;var F=(t,n)=>{for(var i in n)M(t,i,{get:n[i],enumerable:!0})},B=(t,n,i,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let s of N(n))!_.call(t,s)&&s!==i&&M(t,s,{get:()=>n[s],enumerable:!(o=C(n,s))||o.enumerable});return t};var G=t=>B(M({},"__esModule",{value:!0}),t);var X={};F(X,{memorySizeOf:()=>U,transmute:()=>A,unTransmute:()=>z});var u="#",R="Klass",D="",J="_";var y=t=>typeof t=="object"&&t!=null&&"getMetaInfo"in t,x=(t,n)=>typeof t=="object"&&t!=null&&n in t,V=function(t=9,n=2){return Math.random().toFixed(t).substring(n)},l=function(t){let n=Object.prototype.toString.call(t);return n.substring(1,n.length-1).split(/\s/)[1].toLowerCase()},r=function(t){return isNaN(Number(t[0]))||(t="_"+t),t.toString().replace(/-/g,J).replace(/\s|\./g,D)},a=function(t){return t[0].toUpperCase()+t.slice(1)},d={validateInput:!1,cloneable:!0},P=function(t){d={...d,...t}},U=function(t){let n=function(o){return o<1024?o+" bytes":o<Math.pow(1024,2)?(o/1024).toFixed(6)+" KiB":o<Math.pow(1024,3)?(o/Math.pow(1024,2)).toFixed(6)+" MiB":(o/Math.pow(1024,3)).toFixed(6)+" GiB"},i=JSON.stringify(t);return n(encodeURI(i).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},S=function(t,n){let i=Object.keys(n),o=i.filter(e=>l(n[e])!=="object"&&l(n[e])!=="array"),s=i.filter(e=>l(n[e])==="object"),f=i.filter(e=>l(n[e])==="array"),m=i.map(e=>`${u}${r(e)};`).join(",").replaceAll(",",""),g=i.map(e=>`
              get${a(r(e))}() {
                return this.${u}${r(e)};
              }
              set${a(r(e))}(v) {
                this.${u}${r(e)} = v;
                return this;
              }
            `).join(",").replaceAll(",",""),b=i.map(e=>{let c=l(n[e]);return`
              get${a(r(e))}() {
                return this.${u}${r(e)};
              }
              set${a(r(e))}(v) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${c}') {
                    this.${u}${r(e)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${c} expected but got ' + typeOfValue + ' instead';
              }
            `}).join(",").replaceAll(",",""),w=f.map(e=>`
              get${a(r(e))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${u}${r(e)}.length) {
                        return this.${u}${r(e)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(r(e))}At(i parameter_separator v) {
                if (Array.isArray(this.${u}${r(e)}) && i != null) {
                    if (i >= 0 && i < this.${u}${r(e)}.length) {
                        this.${u}${r(e)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `).join(",").replaceAll(",","").replaceAll("parameter_separator",","),E=f.map(e=>`
              get${a(r(e))}At(i) {
                const value = this.${u}${r(e)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(r(e))}At(i parameter_separator v) {
                const value = this.${u}${r(e)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        value[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `).join(",").replaceAll(",","").replaceAll("parameter_separator",","),O=`
        return class ${a(r(t))} {
          ${m}
          constructor() {}
          ${d.validateInput?b:g}
          ${d.validateInput?E:w}
        }
      `,v=new Function("",O),h=new v;h.prototype!=null&&(h.prototype.toJson=function(){return y(this)?I(this,this.getMetaInfo()):{}},d.cloneable&&(h.prototype.clone=function(){return A(this.toJson())}),h.prototype.getMetaInfo=function(){let e={};return o.length>0&&(e={...e,primitiveKeys:o.toString()}),s.length>0&&(e={...e,objectKeys:s.toString()}),f.length>0&&(e={...e,arrayKeys:f.toString()}),e},h.prototype.utility={getTypeOfObject:l});let p=new h;return o.forEach(e=>{let c=`set${a(r(e))}`;c in p&&typeof p[c]=="function"&&p[c](n[e])}),s.forEach(e=>{let c=`set${a(r(e))}`;c in p&&typeof p[c]=="function"&&p[c](S(a(r(e)),n[e]))}),f.forEach(e=>{let c=`set${a(r(e))}`;if(c in p&&typeof p[c]=="function"){let j=n[e];if(Array.isArray(j)){let T=j.map(($,K)=>{if(l($)==="object")return S(a(r(`${e}${K}`)),$);if(l($)==="array")throw"Multidimensional array not supported. Yet!";return $});p[c](T)}}}),p};function A(t,n,i){if(l(t)!=="object")throw"Expecting a JavaScript Object notation!";return n!=null&&P(n),S(a(r(i??`${R}${V()}`)),t)}var I=function(t,n){let i={};return n.primitiveKeys!=null&&n.primitiveKeys.length>0&&n.primitiveKeys.split(",").forEach(o=>{let s=`get${a(r(o))}`;x(t,s)&&(i={...i,[o]:t[s]()})}),n.objectKeys!=null&&n.objectKeys.length>0&&n.objectKeys.split(",").forEach(o=>{let s=`get${a(r(o))}`;if(x(t,s)){let f=t[s]();y(f)&&(i={...i,[o]:I(f,f.getMetaInfo())})}}),n.arrayKeys!=null&&n.arrayKeys.length>0&&n.arrayKeys.split(",").forEach(o=>{let s=`get${a(r(o))}`;if(x(t,s)){let m=t[s]().map(g=>{let b=l(g);return b==="array"?[]:b==="object"&&y(g)?I(g,g.getMetaInfo()):g});i={...i,[o]:m}}}),i};function z(t){if(Array.isArray(t)&&t.length>0)return t.map(n=>{if(y(n))return I(n,n.getMetaInfo());throw"Meta info is missing in the object!"});if(l(t)==="object"){if(y(t))return I(t,t.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}return G(X);})();
//# sourceMappingURL=index.global.js.map
