"use strict";var lib;(lib||={}).api=(()=>{var C=Object.defineProperty;var D=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames;var T=Object.prototype.hasOwnProperty;var N=(e,n)=>{for(var i in n)C(e,i,{get:n[i],enumerable:!0})},H=(e,n,i,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let s of P(n))!T.call(e,s)&&s!==i&&C(e,s,{get:()=>n[s],enumerable:!(r=D(n,s))||r.enumerable});return e};var K=e=>H(C({},"__esModule",{value:!0}),e);var W={};N(W,{memorySizeOf:()=>z,transmute:()=>w,unTransmute:()=>X});var l="#",F="Transmute",V="",B="_";var O=e=>typeof e=="object"&&e!=null&&"getMetaInfo"in e,I=(e,n)=>typeof e=="object"&&e!=null&&n in e,G=function(e=9,n=2){return Math.random().toFixed(e).substring(n)},c=function(e){let n=Object.prototype.toString.call(e);return n.substring(1,n.length-1).split(/\s/)[1].toLowerCase()},J=function(e,n,i,r){if(M.rules!=null){let s=e!=null&&e.trim().length>0?`${e}.${n}`:void 0;r=r??(s!=null&&M.rules[s]!=null?M.rules[s]:M.rules[n]);let f=(g,p)=>{if(r!=null){let d=r(g);if(d!==!0)throw typeof d=="string"?p!=null?new Error(`Validation error at index ${p} [${s}]: ${d}`):new Error(`Validation error [${s}]: ${d}`):new Error(`Validation failed for property ${s} with value ${g}`)}};if(r!=null&&c(r)==="function"&&i!=null){if(Array.isArray(i)){i.forEach(f);return}f(i)}}},o=function(e){return isNaN(Number(e[0]))||(e="_"+e),e.toString().replace(/-/g,B).replace(/\s|\./g,V)},a=function(e){return e[0].toUpperCase()+e.slice(1)},A=function(e,n=",",i=",",r=" COMMA_PLACEHOLDER"){return e.join(n).replaceAll(i,"").replaceAll(r,",")},M={validateInput:!1,cloneable:!0,rules:{}},U=function(e){M={...M,...e}},z=function(e){let n=function(r){return r<1024?r+" bytes":r<Math.pow(1024,2)?(r/1024).toFixed(6)+" KiB":r<Math.pow(1024,3)?(r/Math.pow(1024,2)).toFixed(6)+" MiB":(r/Math.pow(1024,3)).toFixed(6)+" GiB"},i=JSON.stringify(e);return n(encodeURI(i).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},b=function(e,n,i="root"){let r=Object.keys(n),s=r.filter(t=>c(n[t])!=="object"&&c(n[t])!=="array"),f=r.filter(t=>c(n[t])==="object"),g=r.filter(t=>c(n[t])==="array"),p=A(r.map(t=>`${l}${o(t)};`)),d=A(r.map(t=>`
              get${a(o(t))}() {
                return this.${l}${o(t)};
              }
              set${a(o(t))}(v COMMA_PLACEHOLDER validator) {
                this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${t}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
                this.${l}${o(t)} = v;
                return this;
              }
            `)),L=A(r.map(t=>{let u=c(n[t]);return`
              get${a(o(t))}() {
                return this.${l}${o(t)};
              }
              set${a(o(t))}(v COMMA_PLACEHOLDER validator) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${u}') {
                    this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${t}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
                    this.${l}${o(t)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${u} expected but got ' + typeOfValue + ' instead';
              }
            `})),S=A(g.map(t=>`
              get${a(o(t))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${l}${o(t)}.length) {
                        return this.${l}${o(t)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(o(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${l}${o(t)}) && i != null) {
                    if (i >= 0 && i < this.${l}${o(t)}.length) {
                        this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${t}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
                        this.${l}${o(t)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),x=A(g.map(t=>`
              get${a(o(t))}At(i) {
                const value = this.${l}${o(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(o(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${l}${o(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${t}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
                        value[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),v=`
        return class ${a(o(e))} {
          ${p}
          #nameSpace = ${i.trim().length>0?`'${i.trim()}'`:"undefined"};

          constructor() {}

          getNameSpace() {
            if (this.#nameSpace != null) {
                return this.#nameSpace.replace(/_/g, '.').trim();
            }
            return this.#nameSpace;
          }
          ${M.validateInput?L:d}
          ${M.validateInput?x:S}
        }
      `,_=new Function("",v),E=new _;E.prototype!=null&&(E.prototype.toJson=function(){return O(this)?$(this,this.getMetaInfo()):{}},M.cloneable&&(E.prototype.clone=function(){return w(this.toJson())}),E.prototype.getMetaInfo=function(){let t={};return s.length>0&&(t={...t,primitiveKeys:s.toString()}),f.length>0&&(t={...t,objectKeys:f.toString()}),g.length>0&&(t={...t,arrayKeys:g.toString()}),t},E.prototype.utility={getTypeOfObject:c,validateRule:J});let h=new E;return s.forEach(t=>{let u=`set${a(o(t))}`;u in h&&typeof h[u]=="function"&&h[u](n[t])}),f.forEach(t=>{let u=`set${a(o(t))}`;u in h&&typeof h[u]=="function"&&h[u](b(a(o(t)),n[t],i.trim().length>0?`${i}_${t}`:t))}),g.forEach(t=>{let u=`set${a(o(t))}`;if(u in h&&typeof h[u]=="function"){let m=n[t];if(Array.isArray(m)){let R=m.map((y,j)=>{if(c(y)==="object")return b(a(o(`${t}${j}`)),y,i.trim().length>0?`${i}_${t}`:t);if(c(y)==="array")throw"Multidimensional array not supported. Yet!";return y});h[u](R)}}}),h};function w(e,n,i){if(c(e)!=="object")throw"Expecting a JavaScript Object notation!";return n!=null&&U(n),b(a(o(i??`${F}${G()}`)),e)}var $=function(e,n){let i={};return n.primitiveKeys!=null&&n.primitiveKeys.length>0&&n.primitiveKeys.split(",").forEach(r=>{let s=`get${a(o(r))}`;I(e,s)&&(i={...i,[r]:e[s]()})}),n.objectKeys!=null&&n.objectKeys.length>0&&n.objectKeys.split(",").forEach(r=>{let s=`get${a(o(r))}`;if(I(e,s)){let f=e[s]();O(f)&&(i={...i,[r]:$(f,f.getMetaInfo())})}}),n.arrayKeys!=null&&n.arrayKeys.length>0&&n.arrayKeys.split(",").forEach(r=>{let s=`get${a(o(r))}`;if(I(e,s)){let g=e[s]().map(p=>{let d=c(p);return d==="array"?[]:d==="object"&&O(p)?$(p,p.getMetaInfo()):p});i={...i,[r]:g}}}),i};function X(e){if(Array.isArray(e)&&e.length>0)return e.map(n=>{if(O(n))return $(n,n.getMetaInfo());throw"Meta info is missing in the object!"});if(c(e)==="object"){if(O(e))return $(e,e.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}return K(W);})();
//# sourceMappingURL=index.global.js.map
