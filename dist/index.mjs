var d="#",V="Transmute",K="",z="_";var R=n=>typeof n=="object"&&n!=null&&"getMetaInfo"in n,S=(n,e)=>typeof n=="object"&&n!=null&&e in n,B=function(n=9,e=2){return Math.random().toFixed(n).substring(e)},g=function(n){let e=Object.prototype.toString.call(n);return e.substring(1,e.length-1).split(/\s/)[1].toLowerCase()},G=function(n,e,r,o,s,p,C,l){if(n.rules!=null){let c=e!=null&&e.trim().length>0?`${e}.${r}`:void 0,h=r,x=e==="root"?r:c??r;c!=null&&n.rules[c]!=null?(s=s??n.rules[c],h=c):n.rules[r]!=null&&(s=s??n.rules[r],h=r);let M=(E,I)=>{if(s!=null){let _=I??l??p?.getIndex?.(),y=s(E,{key:r,path:x,value:E,parentObject:p,rootObject:C,index:_,getParent:()=>p,getRoot:()=>C});if(y!==!0){if(typeof y=="string"){let w=I??l??p?.getIndex?.();throw w!=null?new Error(`Validation error at index ${w} [${h}]: ${y}`):new Error(`Validation error [${h}]: ${y}`)}throw new Error(`Validation failed for property ${h} with value ${E}`)}}};if(s!=null&&g(s)==="function"&&o!=null){if(Array.isArray(o)){o.forEach((E,I)=>M(E,I));return}M(o)}}},i=function(n){return isNaN(Number(n[0]))||(n="_"+n),n.toString().replace(/-/g,z).replace(/\s|\./g,K)},a=function(n){return n[0].toUpperCase()+n.slice(1)},b=function(n,e=",",r=",",o=" COMMA_PLACEHOLDER"){return n.join(e).replaceAll(r,"").replaceAll(o,",")},T=function(n){return{validateInput:n?.validateInput??!1,cloneable:n?.cloneable??!0,rules:{...n?.rules??{}}}},X=function(n){let e=function(o){return o<1024?o+" bytes":o<Math.pow(1024,2)?(o/1024).toFixed(6)+" KiB":o<Math.pow(1024,3)?(o/Math.pow(1024,2)).toFixed(6)+" MiB":(o/Math.pow(1024,3)).toFixed(6)+" GiB"},r=JSON.stringify(n);return e(encodeURI(r).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},P=function(n,e,r="root",o,s,p,C){let l=C??T(),c=Object.keys(e),h=c.filter(t=>g(e[t])!=="object"&&g(e[t])!=="array"),x=c.filter(t=>g(e[t])==="object"),M=c.filter(t=>g(e[t])==="array"),E=b(c.map(t=>`${d}${i(t)};`)),I=b(c.map(t=>`
                            initialize${a(i(t))}(v) {
                                this.${d}${i(t)} = v;
                                return this;
                            }
                        `)),_=b(c.map(t=>`
              get${a(i(t))}() {
                return this.${d}${i(t)};
              }
              set${a(i(t))}(v COMMA_PLACEHOLDER validator) {
                this.utility.validateRule(
                  this.getNameSpace() COMMA_PLACEHOLDER 
                  '${t}' COMMA_PLACEHOLDER 
                  v COMMA_PLACEHOLDER 
                  validator COMMA_PLACEHOLDER
                  this COMMA_PLACEHOLDER
                  this.getRoot()
                );
                this.${d}${i(t)} = v;
                return this;
              }
            `)),j=b(c.map(t=>{let u=g(e[t]);return`
              get${a(i(t))}() {
                return this.${d}${i(t)};
              }
              set${a(i(t))}(v COMMA_PLACEHOLDER validator) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${u}') {
                    this.utility.validateRule(
                      this.getNameSpace() COMMA_PLACEHOLDER 
                      '${t}' COMMA_PLACEHOLDER 
                      v COMMA_PLACEHOLDER 
                      validator COMMA_PLACEHOLDER
                      this COMMA_PLACEHOLDER
                      this.getRoot()
                    );
                    this.${d}${i(t)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${u} expected but got ' + typeOfValue + ' instead';
              }
            `})),y=b(M.map(t=>`
              get${a(i(t))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${d}${i(t)}.length) {
                        return this.${d}${i(t)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(i(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${d}${i(t)}) && i != null) {
                    if (i >= 0 && i < this.${d}${i(t)}.length) {
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${t}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i
                        );
                        this.${d}${i(t)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),w=b(M.map(t=>`
              get${a(i(t))}At(i) {
                const value = this.${d}${i(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(i(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${d}${i(t)};
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
            `)),F=`
        return class ${a(i(n))} {
          ${E}
          #nameSpace = ${r.trim().length>0?`'${r.trim()}'`:"undefined"};
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

          ${I}

          ${l.validateInput?j:_}
          ${l.validateInput?w:y}
        }
      `,$=new Function("",F)();$.prototype!=null&&($.prototype.toJson=function(){return R(this)?m(this,this.getMetaInfo()):{}},l.cloneable&&($.prototype.clone=function(){return J(this.toJson(),l)}),$.prototype.getMetaInfo=function(){let t={};return h.length>0&&(t={...t,primitiveKeys:h.toString()}),x.length>0&&(t={...t,objectKeys:x.toString()}),M.length>0&&(t={...t,arrayKeys:M.toString()}),t},$.prototype.utility={getTypeOfObject:g,validateRule:(t,u,A,D,O,L,H)=>G(l,t,u,A,D,O,L,H)});let f=new $,v=o||f,N=s||f;return f.setInternalReferences(v,N,p),h.forEach(t=>{let u=`initialize${a(i(t))}`;u in f&&typeof f[u]=="function"&&f[u](e[t])}),x.forEach(t=>{let u=`initialize${a(i(t))}`;if(u in f&&typeof f[u]=="function"){let A=P(a(i(t)),e[t],r.trim().length>0?`${r}_${t}`:t,v,f,void 0,l);f[u](A)}}),M.forEach(t=>{let u=`initialize${a(i(t))}`;if(u in f&&typeof f[u]=="function"){let A=e[t];if(Array.isArray(A)){A.some(O=>g(O)==="object")&&f[u]([]);let D=A.map((O,L)=>{if(g(O)==="object")return P(a(i(`${t}${L}`)),O,r.trim().length>0?`${r}_${t}`:t,v,f,L,l);if(g(O)==="array")throw"Multidimensional array not supported. Yet!";return O});f[u](D)}}}),f};function J(n,e,r){if(g(n)!=="object")throw"Expecting a JavaScript Object notation!";let o=T(e),s=P(a(i(r??`${V}${B()}`)),n,"root",void 0,void 0,void 0,o);return s.setInternalReferences(s,s,void 0),s}var m=function(n,e){let r={};return e.primitiveKeys!=null&&e.primitiveKeys.length>0&&e.primitiveKeys.split(",").forEach(o=>{let s=`get${a(i(o))}`;S(n,s)&&(r={...r,[o]:n[s]()})}),e.objectKeys!=null&&e.objectKeys.length>0&&e.objectKeys.split(",").forEach(o=>{let s=`get${a(i(o))}`;if(S(n,s)){let p=n[s]();R(p)&&(r={...r,[o]:m(p,p.getMetaInfo())})}}),e.arrayKeys!=null&&e.arrayKeys.length>0&&e.arrayKeys.split(",").forEach(o=>{let s=`get${a(i(o))}`;if(S(n,s)){let C=n[s]().map(l=>{let c=g(l);return c==="array"?[]:c==="object"&&R(l)?m(l,l.getMetaInfo()):l});r={...r,[o]:C}}}),r};function k(n){if(Array.isArray(n)&&n.length>0)return n.map(e=>{if(R(e))return m(e,e.getMetaInfo());throw"Meta info is missing in the object!"});if(g(n)==="object"){if(R(n))return m(n,n.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}export{X as memorySizeOf,J as transmute,k as unTransmute};
//# sourceMappingURL=index.mjs.map
