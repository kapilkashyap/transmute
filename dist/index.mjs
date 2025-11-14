var u="#",T="Klass",K="",C="_";var y=e=>typeof e=="object"&&e!=null&&"getMetaInfo"in e,M=(e,n)=>typeof e=="object"&&e!=null&&n in e,N=function(e=9,n=2){return Math.random().toFixed(e).substring(n)},l=function(e){let n=Object.prototype.toString.call(e);return n.substring(1,n.length-1).split(/\s/)[1].toLowerCase()},r=function(e){return isNaN(Number(e[0]))||(e="_"+e),e.toString().replace(/-/g,C).replace(/\s|\./g,K)},s=function(e){return e[0].toUpperCase()+e.slice(1)},d={validateInput:!1,cloneable:!0},_=function(e){d={...d,...e}},B=function(e){let n=function(i){return i<1024?i+" bytes":i<Math.pow(1024,2)?(i/1024).toFixed(6)+" KiB":i<Math.pow(1024,3)?(i/Math.pow(1024,2)).toFixed(6)+" MiB":(i/Math.pow(1024,3)).toFixed(6)+" GiB"},o=JSON.stringify(e);return n(encodeURI(o).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},x=function(e,n){let o=Object.keys(n),i=o.filter(t=>l(n[t])!=="object"&&l(n[t])!=="array"),c=o.filter(t=>l(n[t])==="object"),f=o.filter(t=>l(n[t])==="array"),m=o.map(t=>`${u}${r(t)};`).join(",").replaceAll(",",""),g=o.map(t=>`
              get${s(r(t))}() {
                return this.${u}${r(t)};
              }
              set${s(r(t))}(v) {
                this.${u}${r(t)} = v;
                return this;
              }
            `).join(",").replaceAll(",",""),b=o.map(t=>{let a=l(n[t]);return`
              get${s(r(t))}() {
                return this.${u}${r(t)};
              }
              set${s(r(t))}(v) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${a}') {
                    this.${u}${r(t)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${a} expected but got ' + typeOfValue + ' instead';
              }
            `}).join(",").replaceAll(",",""),j=f.map(t=>`
              get${s(r(t))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${u}${r(t)}.length) {
                        return this.${u}${r(t)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${s(r(t))}At(i parameter_separator v) {
                if (Array.isArray(this.${u}${r(t)}) && i != null) {
                    if (i >= 0 && i < this.${u}${r(t)}.length) {
                        this.${u}${r(t)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `).join(",").replaceAll(",","").replaceAll("parameter_separator",","),A=f.map(t=>`
              get${s(r(t))}At(i) {
                const value = this.${u}${r(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${s(r(t))}At(i parameter_separator v) {
                const value = this.${u}${r(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        value[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `).join(",").replaceAll(",","").replaceAll("parameter_separator",","),w=`
        return class ${s(r(e))} {
          ${m}
          constructor() {}
          ${d.validateInput?b:g}
          ${d.validateInput?A:j}
        }
      `,E=new Function("",w),h=new E;h.prototype!=null&&(h.prototype.toJson=function(){return y(this)?I(this,this.getMetaInfo()):{}},d.cloneable&&(h.prototype.clone=function(){return F(this.toJson())}),h.prototype.getMetaInfo=function(){let t={};return i.length>0&&(t={...t,primitiveKeys:i.toString()}),c.length>0&&(t={...t,objectKeys:c.toString()}),f.length>0&&(t={...t,arrayKeys:f.toString()}),t},h.prototype.utility={getTypeOfObject:l});let p=new h;return i.forEach(t=>{let a=`set${s(r(t))}`;a in p&&typeof p[a]=="function"&&p[a](n[t])}),c.forEach(t=>{let a=`set${s(r(t))}`;a in p&&typeof p[a]=="function"&&p[a](x(s(r(t)),n[t]))}),f.forEach(t=>{let a=`set${s(r(t))}`;if(a in p&&typeof p[a]=="function"){let S=n[t];if(Array.isArray(S)){let O=S.map(($,v)=>{if(l($)==="object")return x(s(r(`${t}${v}`)),$);if(l($)==="array")throw"Multidimensional array not supported. Yet!";return $});p[a](O)}}}),p};function F(e,n,o){if(l(e)!=="object")throw"Expecting a JavaScript Object notation!";return n!=null&&_(n),x(s(r(o??`${T}${N()}`)),e)}var I=function(e,n){let o={};return n.primitiveKeys!=null&&n.primitiveKeys.length>0&&n.primitiveKeys.split(",").forEach(i=>{let c=`get${s(r(i))}`;M(e,c)&&(o={...o,[i]:e[c]()})}),n.objectKeys!=null&&n.objectKeys.length>0&&n.objectKeys.split(",").forEach(i=>{let c=`get${s(r(i))}`;if(M(e,c)){let f=e[c]();y(f)&&(o={...o,[i]:I(f,f.getMetaInfo())})}}),n.arrayKeys!=null&&n.arrayKeys.length>0&&n.arrayKeys.split(",").forEach(i=>{let c=`get${s(r(i))}`;if(M(e,c)){let m=e[c]().map(g=>{let b=l(g);return b==="array"?[]:b==="object"&&y(g)?I(g,g.getMetaInfo()):g});o={...o,[i]:m}}}),o};function G(e){if(Array.isArray(e)&&e.length>0)return e.map(n=>{if(y(n))return I(n,n.getMetaInfo());throw"Meta info is missing in the object!"});if(l(e)==="object"){if(y(e))return I(e,e.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}export{B as memorySizeOf,F as transmute,G as unTransmute};
//# sourceMappingURL=index.mjs.map
