var f="#",T="Transmute",N="",F="_";var m=n=>typeof n=="object"&&n!=null&&"getMetaInfo"in n,D=(n,e)=>typeof n=="object"&&n!=null&&e in n,K=function(n=9,e=2){return Math.random().toFixed(n).substring(e)},g=function(n){let e=Object.prototype.toString.call(n);return e.substring(1,e.length-1).split(/\s/)[1].toLowerCase()},V=function(n,e,o,i,a,M,d){if(p.rules!=null){let l=n!=null&&n.trim().length>0?`${n}.${e}`:void 0,h=e,E=n==="root"?e:l??e;l!=null&&p.rules[l]!=null?(i=i??p.rules[l],h=l):p.rules&&p.rules[e]!=null&&(i=i??p.rules[e],h=e);let b=(O,A)=>{if(i!=null){let w=A??d??a?.getIndex?.(),C=i(O,{key:e,path:E,value:O,parentObject:a,rootObject:M,index:w,getParent:()=>a,getRoot:()=>M});if(C!==!0){if(typeof C=="string"){let R=A??d??a?.getIndex?.();throw R!=null?new Error(`Validation error at index ${R} [${h}]: ${C}`):new Error(`Validation error [${h}]: ${C}`)}throw new Error(`Validation failed for property ${h} with value ${O}`)}}};if(i!=null&&g(i)==="function"&&o!=null){if(Array.isArray(o)){o.forEach((O,A)=>b(O,A));return}b(o)}}},r=function(n){return isNaN(Number(n[0]))||(n="_"+n),n.toString().replace(/-/g,F).replace(/\s|\./g,N)},s=function(n){return n[0].toUpperCase()+n.slice(1)},$=function(n,e=",",o=",",i=" COMMA_PLACEHOLDER"){return n.join(e).replaceAll(o,"").replaceAll(i,",")},p={validateInput:!1,cloneable:!0,rules:{}},B=function(n){p={...p,...n}},U=function(n){let e=function(i){return i<1024?i+" bytes":i<Math.pow(1024,2)?(i/1024).toFixed(6)+" KiB":i<Math.pow(1024,3)?(i/Math.pow(1024,2)).toFixed(6)+" MiB":(i/Math.pow(1024,3)).toFixed(6)+" GiB"},o=JSON.stringify(n);return e(encodeURI(o).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},S=function(n,e,o="root",i,a,M){let d=Object.keys(e),l=d.filter(t=>g(e[t])!=="object"&&g(e[t])!=="array"),h=d.filter(t=>g(e[t])==="object"),E=d.filter(t=>g(e[t])==="array"),b=$(d.map(t=>`${f}${r(t)};`)),O=$(d.map(t=>`
                            initialize${s(r(t))}(v) {
                                this.${f}${r(t)} = v;
                                return this;
                            }
                        `)),A=$(d.map(t=>`
              get${s(r(t))}() {
                return this.${f}${r(t)};
              }
              set${s(r(t))}(v COMMA_PLACEHOLDER validator) {
                this.utility.validateRule(
                  this.getNameSpace() COMMA_PLACEHOLDER 
                  '${t}' COMMA_PLACEHOLDER 
                  v COMMA_PLACEHOLDER 
                  validator COMMA_PLACEHOLDER
                  this COMMA_PLACEHOLDER
                  this.getRoot()
                );
                this.${f}${r(t)} = v;
                return this;
              }
            `)),w=$(d.map(t=>{let c=g(e[t]);return`
              get${s(r(t))}() {
                return this.${f}${r(t)};
              }
              set${s(r(t))}(v COMMA_PLACEHOLDER validator) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${c}') {
                    this.utility.validateRule(
                      this.getNameSpace() COMMA_PLACEHOLDER 
                      '${t}' COMMA_PLACEHOLDER 
                      v COMMA_PLACEHOLDER 
                      validator COMMA_PLACEHOLDER
                      this COMMA_PLACEHOLDER
                      this.getRoot()
                    );
                    this.${f}${r(t)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${c} expected but got ' + typeOfValue + ' instead';
              }
            `})),v=$(E.map(t=>`
              get${s(r(t))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${f}${r(t)}.length) {
                        return this.${f}${r(t)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${s(r(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${f}${r(t)}) && i != null) {
                    if (i >= 0 && i < this.${f}${r(t)}.length) {
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${t}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i
                        );
                        this.${f}${r(t)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),C=$(E.map(t=>`
              get${s(r(t))}At(i) {
                const value = this.${f}${r(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${s(r(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${f}${r(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${t}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i
                        );
                        value[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),R=`
        return class ${s(r(n))} {
          ${b}
          #nameSpace = ${o.trim().length>0?`'${o.trim()}'`:"undefined"};
          #root = undefined;
          #parent = undefined;
          #index = undefined;

          constructor() {}

          getNameSpace() {
            if (this.#nameSpace != null) {
                return this.#nameSpace.replace(/_/g, '.').trim();
            }
            return this.#nameSpace;
          }

          setInternalReferences(root, parent, index) {
            this.#root = root;
            this.#parent = parent;
            this.#index = index;
            return this;
          }

          getParent() {
            return this.#parent;
          }

          getRoot() {
            return this.#root;
          }

          getIndex() {
            return this.#index;
          }

          ${O}

          ${p.validateInput?w:A}
          ${p.validateInput?C:v}
        }
      `,I=new Function("",R)();I.prototype!=null&&(I.prototype.toJson=function(){return m(this)?L(this,this.getMetaInfo()):{}},p.cloneable&&(I.prototype.clone=function(){return z(this.toJson())}),I.prototype.getMetaInfo=function(){let t={};return l.length>0&&(t={...t,primitiveKeys:l.toString()}),h.length>0&&(t={...t,objectKeys:h.toString()}),E.length>0&&(t={...t,arrayKeys:E.toString()}),t},I.prototype.utility={getTypeOfObject:g,validateRule:V});let u=new I,_=i||u,j=a||u;return u.setInternalReferences(_,j,M),l.forEach(t=>{let c=`initialize${s(r(t))}`;c in u&&typeof u[c]=="function"&&u[c](e[t])}),h.forEach(t=>{let c=`initialize${s(r(t))}`;if(c in u&&typeof u[c]=="function"){let x=S(s(r(t)),e[t],o.trim().length>0?`${o}_${t}`:t,_,u);u[c](x)}}),E.forEach(t=>{let c=`initialize${s(r(t))}`;if(c in u&&typeof u[c]=="function"){let x=e[t];if(Array.isArray(x)){x.some(y=>g(y)==="object")&&u[c]([]);let H=x.map((y,P)=>{if(g(y)==="object")return S(s(r(`${t}${P}`)),y,o.trim().length>0?`${o}_${t}`:t,_,u,P);if(g(y)==="array")throw"Multidimensional array not supported. Yet!";return y});u[c](H)}}}),u};function z(n,e,o){if(g(n)!=="object")throw"Expecting a JavaScript Object notation!";e!=null&&B(e);let i=S(s(r(o??`${T}${K()}`)),n);return i.setInternalReferences(i,i,void 0),i}var L=function(n,e){let o={};return e.primitiveKeys!=null&&e.primitiveKeys.length>0&&e.primitiveKeys.split(",").forEach(i=>{let a=`get${s(r(i))}`;D(n,a)&&(o={...o,[i]:n[a]()})}),e.objectKeys!=null&&e.objectKeys.length>0&&e.objectKeys.split(",").forEach(i=>{let a=`get${s(r(i))}`;if(D(n,a)){let M=n[a]();m(M)&&(o={...o,[i]:L(M,M.getMetaInfo())})}}),e.arrayKeys!=null&&e.arrayKeys.length>0&&e.arrayKeys.split(",").forEach(i=>{let a=`get${s(r(i))}`;if(D(n,a)){let d=n[a]().map(l=>{let h=g(l);return h==="array"?[]:h==="object"&&m(l)?L(l,l.getMetaInfo()):l});o={...o,[i]:d}}}),o};function X(n){if(Array.isArray(n)&&n.length>0)return n.map(e=>{if(m(e))return L(e,e.getMetaInfo());throw"Meta info is missing in the object!"});if(g(n)==="object"){if(m(n))return L(n,n.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}export{U as memorySizeOf,z as transmute,X as unTransmute};
//# sourceMappingURL=index.mjs.map
