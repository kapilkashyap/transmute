var f="#",V="Transmute",K="",z="_";var x=n=>typeof n=="object"&&n!=null&&"getMetaInfo"in n,S=(n,e)=>typeof n=="object"&&n!=null&&e in n,B=function(n=9,e=2){return Math.random().toFixed(n).substring(e)},g=function(n){let e=Object.prototype.toString.call(n);return e.substring(1,e.length-1).split(/\s/)[1].toLowerCase()},G=function(n,e,r,o,s,p,A,u){if(n.rules!=null){let c=e!=null&&e.trim().length>0?`${e}.${r}`:void 0,h=r,$=e==="root"?r:c??r;c!=null&&n.rules[c]!=null?(s=s??n.rules[c],h=c):n.rules[r]!=null&&(s=s??n.rules[r],h=r);let M=(O,I)=>{if(s!=null){let _=I??u??p?.getIndex?.(),y=s(O,{key:r,path:$,value:O,parentObject:p,rootObject:A,index:_,getParent:()=>p,getRoot:()=>A});if(y!==!0){if(typeof y=="string"){let w=I??u??p?.getIndex?.();throw w!=null?new Error(`Validation error at index ${w} [${h}]: ${y}`):new Error(`Validation error [${h}]: ${y}`)}throw new Error(`Validation failed for property ${h} with value ${O}`)}}};if(s!=null&&g(s)==="function"&&o!=null){if(Array.isArray(o)){o.forEach((O,I)=>M(O,I));return}M(o)}}},i=function(n){return isNaN(Number(n[0]))||(n="_"+n),n.toString().replace(/-/g,z).replace(/\s|\./g,K)},a=function(n){return n[0].toUpperCase()+n.slice(1)},m=function(n,e=",",r=",",o=" COMMA_PLACEHOLDER"){return n.join(e).replaceAll(r,"").replaceAll(o,",")},F=function(n){return{validateInput:n?.validateInput??!1,cloneable:n?.cloneable??!0,rules:{...n?.rules??{}}}},X=function(n){let e=function(o){return o<1024?o+" bytes":o<Math.pow(1024,2)?(o/1024).toFixed(6)+" KiB":o<Math.pow(1024,3)?(o/Math.pow(1024,2)).toFixed(6)+" MiB":(o/Math.pow(1024,3)).toFixed(6)+" GiB"},r=JSON.stringify(n);return e(encodeURI(r).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},P=function(n,e,r="root",o,s,p,A){let u=A??F(),c=Object.keys(e),h=c.filter(t=>g(e[t])!=="object"&&g(e[t])!=="array"),$=c.filter(t=>g(e[t])==="object"),M=c.filter(t=>g(e[t])==="array"),O=m(c.map(t=>`${f}${i(t)};`)),I=m(c.map(t=>`
                            initialize${a(i(t))}(v) {
                                this.${f}${i(t)} = v;
                                return this;
                            }
                        `)),_=m(c.map(t=>`
              get${a(i(t))}() {
                return this.${f}${i(t)};
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
                this.${f}${i(t)} = v;
                return this;
              }
            `)),j=m(c.map(t=>{let l=g(e[t]);return`
              get${a(i(t))}() {
                return this.${f}${i(t)};
              }
              set${a(i(t))}(v COMMA_PLACEHOLDER validator) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${l}') {
                    this.utility.validateRule(
                      this.getNameSpace() COMMA_PLACEHOLDER 
                      '${t}' COMMA_PLACEHOLDER 
                      v COMMA_PLACEHOLDER 
                      validator COMMA_PLACEHOLDER
                      this COMMA_PLACEHOLDER
                      this.getRoot()
                    );
                    this.${f}${i(t)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${l} expected but got ' + typeOfValue + ' instead';
              }
            `})),y=m(M.map(t=>`
              get${a(i(t))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${f}${i(t)}.length) {
                        return this.${f}${i(t)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(i(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${f}${i(t)}) && i != null) {
                    if (i >= 0 && i < this.${f}${i(t)}.length) {
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${t}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i
                        );
                        this.${f}${i(t)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),w=m(M.map(t=>`
              get${a(i(t))}At(i) {
                const value = this.${f}${i(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(i(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${f}${i(t)};
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
            `)),T=`
        return class ${a(i(n))} {
          ${O}
          #modelConfig;
          #nameSpace = ${r.trim().length>0?`'${r.trim()}'`:"undefined"};
          #root = undefined;
          #parent = undefined;
          #index = undefined;

          constructor(modelConfig) {
                this.#modelConfig = modelConfig;
        }

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

          updateRules(rules, options = {}) {
            const nextRules = options.mergeRules ? { ...this.#modelConfig.rules, ...rules } : { ...rules };
            this.#modelConfig.rules = nextRules;
            return this.getRoot();
         }

          ${I}

          ${u.validateInput?j:_}
          ${u.validateInput?w:y}
        }
      `,R=new Function("",T)();R.prototype!=null&&(R.prototype.toJson=function(){return x(this)?b(this,this.getMetaInfo()):{}},u.cloneable&&(R.prototype.clone=function(){return J(this.toJson(),u)}),R.prototype.getMetaInfo=function(){let t={};return h.length>0&&(t={...t,primitiveKeys:h.toString()}),$.length>0&&(t={...t,objectKeys:$.toString()}),M.length>0&&(t={...t,arrayKeys:M.toString()}),t},R.prototype.utility={getTypeOfObject:g,validateRule:(t,l,E,D,C,L,H)=>G(u,t,l,E,D,C,L,H)});let d=new R(u),v=o||d,N=s||d;return d.setInternalReferences(v,N,p),h.forEach(t=>{let l=`initialize${a(i(t))}`;l in d&&typeof d[l]=="function"&&d[l](e[t])}),$.forEach(t=>{let l=`initialize${a(i(t))}`;if(l in d&&typeof d[l]=="function"){let E=P(a(i(t)),e[t],r.trim().length>0?`${r}_${t}`:t,v,d,void 0,u);d[l](E)}}),M.forEach(t=>{let l=`initialize${a(i(t))}`;if(l in d&&typeof d[l]=="function"){let E=e[t];if(Array.isArray(E)){E.some(C=>g(C)==="object")&&d[l]([]);let D=E.map((C,L)=>{if(g(C)==="object")return P(a(i(`${t}${L}`)),C,r.trim().length>0?`${r}_${t}`:t,v,d,L,u);if(g(C)==="array")throw"Multidimensional array not supported. Yet!";return C});d[l](D)}}}),d};function J(n,e,r){if(g(n)!=="object")throw"Expecting a JavaScript Object notation!";let o=F(e),s=P(a(i(r??`${V}${B()}`)),n,"root",void 0,void 0,void 0,o);return s.setInternalReferences(s,s,void 0),s}var b=function(n,e){let r={};return e.primitiveKeys!=null&&e.primitiveKeys.length>0&&e.primitiveKeys.split(",").forEach(o=>{let s=`get${a(i(o))}`;S(n,s)&&(r={...r,[o]:n[s]()})}),e.objectKeys!=null&&e.objectKeys.length>0&&e.objectKeys.split(",").forEach(o=>{let s=`get${a(i(o))}`;if(S(n,s)){let p=n[s]();x(p)&&(r={...r,[o]:b(p,p.getMetaInfo())})}}),e.arrayKeys!=null&&e.arrayKeys.length>0&&e.arrayKeys.split(",").forEach(o=>{let s=`get${a(i(o))}`;if(S(n,s)){let A=n[s]().map(u=>{let c=g(u);return c==="array"?[]:c==="object"&&x(u)?b(u,u.getMetaInfo()):u});r={...r,[o]:A}}}),r};function k(n){if(Array.isArray(n)&&n.length>0)return n.map(e=>{if(x(e))return b(e,e.getMetaInfo());throw"Meta info is missing in the object!"});if(g(n)==="object"){if(x(n))return b(n,n.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}export{X as memorySizeOf,J as transmute,k as unTransmute};
//# sourceMappingURL=index.mjs.map
