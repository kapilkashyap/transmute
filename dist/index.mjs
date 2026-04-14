var l="#",R="Transmute",j="",D="_";var O=e=>typeof e=="object"&&e!=null&&"getMetaInfo"in e,C=(e,n)=>typeof e=="object"&&e!=null&&n in e,P=function(e=9,n=2){return Math.random().toFixed(e).substring(n)},c=function(e){let n=Object.prototype.toString.call(e);return n.substring(1,n.length-1).split(/\s/)[1].toLowerCase()},T=function(e,n,o,r){if(M.rules!=null){let s=e!=null&&e.trim().length>0?`${e}.${n}`:void 0;r=r??(s!=null&&M.rules[s]!=null?M.rules[s]:M.rules[n]);let f=(g,p)=>{if(r!=null){let d=r(g);if(d!==!0)throw typeof d=="string"?p!=null?new Error(`Validation error at index ${p} [${s}]: ${d}`):new Error(`Validation error [${s}]: ${d}`):new Error(`Validation failed for property ${s} with value ${g}`)}};if(r!=null&&c(r)==="function"&&o!=null){if(Array.isArray(o)){o.forEach(f);return}f(o)}}},i=function(e){return isNaN(Number(e[0]))||(e="_"+e),e.toString().replace(/-/g,D).replace(/\s|\./g,j)},a=function(e){return e[0].toUpperCase()+e.slice(1)},A=function(e,n=",",o=",",r=" COMMA_PLACEHOLDER"){return e.join(n).replaceAll(o,"").replaceAll(r,",")},M={validateInput:!1,cloneable:!0,rules:{}},N=function(e){M={...M,...e}},K=function(e){let n=function(r){return r<1024?r+" bytes":r<Math.pow(1024,2)?(r/1024).toFixed(6)+" KiB":r<Math.pow(1024,3)?(r/Math.pow(1024,2)).toFixed(6)+" MiB":(r/Math.pow(1024,3)).toFixed(6)+" GiB"},o=JSON.stringify(e);return n(encodeURI(o).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},I=function(e,n,o=""){let r=Object.keys(n),s=r.filter(t=>c(n[t])!=="object"&&c(n[t])!=="array"),f=r.filter(t=>c(n[t])==="object"),g=r.filter(t=>c(n[t])==="array"),p=A(r.map(t=>`${l}${i(t)};`)),d=A(r.map(t=>`
              get${a(i(t))}() {
                return this.${l}${i(t)};
              }
              set${a(i(t))}(v COMMA_PLACEHOLDER validator) {
                this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${t}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
                this.${l}${i(t)} = v;
                return this;
              }
            `)),m=A(r.map(t=>{let u=c(n[t]);return`
              get${a(i(t))}() {
                return this.${l}${i(t)};
              }
              set${a(i(t))}(v COMMA_PLACEHOLDER validator) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${u}') {
                    this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${t}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
                    this.${l}${i(t)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${u} expected but got ' + typeOfValue + ' instead';
              }
            `})),w=A(g.map(t=>`
              get${a(i(t))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${l}${i(t)}.length) {
                        return this.${l}${i(t)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(i(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${l}${i(t)}) && i != null) {
                    if (i >= 0 && i < this.${l}${i(t)}.length) {
                        this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${t}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
                        this.${l}${i(t)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),L=A(g.map(t=>`
              get${a(i(t))}At(i) {
                const value = this.${l}${i(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(i(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${l}${i(t)};
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
            `)),S=`
        return class ${a(i(e))} {
          ${p}
          #nameSpace = ${o.trim().length>0?`'${o.trim()}'`:"undefined"};

          constructor() {}

          getNameSpace() {
            if (this.#nameSpace != null) {
                return this.#nameSpace.replace(/_/g, '.').trim();
            }
            return this.#nameSpace;
          }
          ${M.validateInput?m:d}
          ${M.validateInput?L:w}
        }
      `,x=new Function("",S),E=new x;E.prototype!=null&&(E.prototype.toJson=function(){return O(this)?$(this,this.getMetaInfo()):{}},M.cloneable&&(E.prototype.clone=function(){return H(this.toJson())}),E.prototype.getMetaInfo=function(){let t={};return s.length>0&&(t={...t,primitiveKeys:s.toString()}),f.length>0&&(t={...t,objectKeys:f.toString()}),g.length>0&&(t={...t,arrayKeys:g.toString()}),t},E.prototype.utility={getTypeOfObject:c,validateRule:T});let h=new E;return s.forEach(t=>{let u=`set${a(i(t))}`;u in h&&typeof h[u]=="function"&&h[u](n[t])}),f.forEach(t=>{let u=`set${a(i(t))}`;u in h&&typeof h[u]=="function"&&h[u](I(a(i(t)),n[t],o.trim().length>0?`${o}_${t}`:t))}),g.forEach(t=>{let u=`set${a(i(t))}`;if(u in h&&typeof h[u]=="function"){let b=n[t];if(Array.isArray(b)){let v=b.map((y,_)=>{if(c(y)==="object")return I(a(i(`${t}${_}`)),y,o.trim().length>0?`${o}_${t}`:t);if(c(y)==="array")throw"Multidimensional array not supported. Yet!";return y});h[u](v)}}}),h};function H(e,n,o){if(c(e)!=="object")throw"Expecting a JavaScript Object notation!";return n!=null&&N(n),I(a(i(o??`${R}${P()}`)),e)}var $=function(e,n){let o={};return n.primitiveKeys!=null&&n.primitiveKeys.length>0&&n.primitiveKeys.split(",").forEach(r=>{let s=`get${a(i(r))}`;C(e,s)&&(o={...o,[r]:e[s]()})}),n.objectKeys!=null&&n.objectKeys.length>0&&n.objectKeys.split(",").forEach(r=>{let s=`get${a(i(r))}`;if(C(e,s)){let f=e[s]();O(f)&&(o={...o,[r]:$(f,f.getMetaInfo())})}}),n.arrayKeys!=null&&n.arrayKeys.length>0&&n.arrayKeys.split(",").forEach(r=>{let s=`get${a(i(r))}`;if(C(e,s)){let g=e[s]().map(p=>{let d=c(p);return d==="array"?[]:d==="object"&&O(p)?$(p,p.getMetaInfo()):p});o={...o,[r]:g}}}),o};function F(e){if(Array.isArray(e)&&e.length>0)return e.map(n=>{if(O(n))return $(n,n.getMetaInfo());throw"Meta info is missing in the object!"});if(c(e)==="object"){if(O(e))return $(e,e.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}export{K as memorySizeOf,H as transmute,F as unTransmute};
//# sourceMappingURL=index.mjs.map
