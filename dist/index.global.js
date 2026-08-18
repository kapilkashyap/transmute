"use strict";var lib;(lib||={}).api=(()=>{var S=Object.defineProperty;var z=Object.getOwnPropertyDescriptor;var B=Object.getOwnPropertyNames;var G=Object.prototype.hasOwnProperty;var J=(n,e)=>{for(var i in e)S(n,i,{get:e[i],enumerable:!0})},U=(n,e,i,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of B(e))!G.call(n,o)&&o!==i&&S(n,o,{get:()=>e[o],enumerable:!(s=z(e,o))||s.enumerable});return n};var X=n=>U(S({},"__esModule",{value:!0}),n);var nt={};J(nt,{memorySizeOf:()=>Z,transmute:()=>N,unTransmute:()=>tt});var f="#",k="Transmute",W="",Y="_";var x=n=>typeof n=="object"&&n!=null&&"getMetaInfo"in n,P=(n,e)=>typeof n=="object"&&n!=null&&e in n,q=function(n=9,e=2){return Math.random().toFixed(n).substring(e)},g=function(n){let e=Object.prototype.toString.call(n);return e.substring(1,e.length-1).split(/\s/)[1].toLowerCase()},Q=function(n,e,i,s,o,p,A,u){if(n.rules!=null){let c=e!=null&&e.trim().length>0?`${e}.${i}`:void 0,h=i,$=e==="root"?i:c??i;c!=null&&n.rules[c]!=null?(o=o??n.rules[c],h=c):n.rules[i]!=null&&(o=o??n.rules[i],h=i);let M=(O,I)=>{if(o!=null){let _=I??u??p?.getIndex?.(),y=o(O,{key:i,path:$,value:O,parentObject:p,rootObject:A,index:_,getParent:()=>p,getRoot:()=>A});if(y!==!0){if(typeof y=="string"){let w=I??u??p?.getIndex?.();throw w!=null?new Error(`Validation error at index ${w} [${h}]: ${y}`):new Error(`Validation error [${h}]: ${y}`)}throw new Error(`Validation failed for property ${h} with value ${O}`)}}};if(o!=null&&g(o)==="function"&&s!=null){if(Array.isArray(s)){s.forEach((O,I)=>M(O,I));return}M(s)}}},r=function(n){return isNaN(Number(n[0]))||(n="_"+n),n.toString().replace(/-/g,Y).replace(/\s|\./g,W)},a=function(n){return n[0].toUpperCase()+n.slice(1)},m=function(n,e=",",i=",",s=" COMMA_PLACEHOLDER"){return n.join(e).replaceAll(i,"").replaceAll(s,",")},T=function(n){return{validateInput:n?.validateInput??!1,cloneable:n?.cloneable??!0,rules:{...n?.rules??{}}}},Z=function(n){let e=function(s){return s<1024?s+" bytes":s<Math.pow(1024,2)?(s/1024).toFixed(6)+" KiB":s<Math.pow(1024,3)?(s/Math.pow(1024,2)).toFixed(6)+" MiB":(s/Math.pow(1024,3)).toFixed(6)+" GiB"},i=JSON.stringify(n);return e(encodeURI(i).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},j=function(n,e,i="root",s,o,p,A){let u=A??T(),c=Object.keys(e),h=c.filter(t=>g(e[t])!=="object"&&g(e[t])!=="array"),$=c.filter(t=>g(e[t])==="object"),M=c.filter(t=>g(e[t])==="array"),O=m(c.map(t=>`${f}${r(t)};`)),I=m(c.map(t=>`
                            initialize${a(r(t))}(v) {
                                this.${f}${r(t)} = v;
                                return this;
                            }
                        `)),_=m(c.map(t=>`
              get${a(r(t))}() {
                return this.${f}${r(t)};
              }
              set${a(r(t))}(v COMMA_PLACEHOLDER validator) {
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
            `)),H=m(c.map(t=>{let l=g(e[t]);return`
              get${a(r(t))}() {
                return this.${f}${r(t)};
              }
              set${a(r(t))}(v COMMA_PLACEHOLDER validator) {
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
                    this.${f}${r(t)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${l} expected but got ' + typeOfValue + ' instead';
              }
            `})),y=m(M.map(t=>`
              get${a(r(t))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${f}${r(t)}.length) {
                        return this.${f}${r(t)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(r(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
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
            `)),w=m(M.map(t=>`
              get${a(r(t))}At(i) {
                const value = this.${f}${r(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(r(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
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
            `)),V=`
        return class ${a(r(n))} {
          ${O}
          #modelConfig;
          #nameSpace = ${i.trim().length>0?`'${i.trim()}'`:"undefined"};
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

          ${u.validateInput?H:_}
          ${u.validateInput?w:y}
        }
      `,R=new Function("",V)();R.prototype!=null&&(R.prototype.toJson=function(){return x(this)?b(this,this.getMetaInfo()):{}},u.cloneable&&(R.prototype.clone=function(){return N(this.toJson(),u)}),R.prototype.getMetaInfo=function(){let t={};return h.length>0&&(t={...t,primitiveKeys:h.toString()}),$.length>0&&(t={...t,objectKeys:$.toString()}),M.length>0&&(t={...t,arrayKeys:M.toString()}),t},R.prototype.utility={getTypeOfObject:g,validateRule:(t,l,E,D,C,L,F)=>Q(u,t,l,E,D,C,L,F)});let d=new R(u),v=s||d,K=o||d;return d.setInternalReferences(v,K,p),h.forEach(t=>{let l=`initialize${a(r(t))}`;l in d&&typeof d[l]=="function"&&d[l](e[t])}),$.forEach(t=>{let l=`initialize${a(r(t))}`;if(l in d&&typeof d[l]=="function"){let E=j(a(r(t)),e[t],i.trim().length>0?`${i}_${t}`:t,v,d,void 0,u);d[l](E)}}),M.forEach(t=>{let l=`initialize${a(r(t))}`;if(l in d&&typeof d[l]=="function"){let E=e[t];if(Array.isArray(E)){E.some(C=>g(C)==="object")&&d[l]([]);let D=E.map((C,L)=>{if(g(C)==="object")return j(a(r(`${t}${L}`)),C,i.trim().length>0?`${i}_${t}`:t,v,d,L,u);if(g(C)==="array")throw"Multidimensional array not supported. Yet!";return C});d[l](D)}}}),d};function N(n,e,i){if(g(n)!=="object")throw"Expecting a JavaScript Object notation!";let s=T(e),o=j(a(r(i??`${k}${q()}`)),n,"root",void 0,void 0,void 0,s);return o.setInternalReferences(o,o,void 0),o}var b=function(n,e){let i={};return e.primitiveKeys!=null&&e.primitiveKeys.length>0&&e.primitiveKeys.split(",").forEach(s=>{let o=`get${a(r(s))}`;P(n,o)&&(i={...i,[s]:n[o]()})}),e.objectKeys!=null&&e.objectKeys.length>0&&e.objectKeys.split(",").forEach(s=>{let o=`get${a(r(s))}`;if(P(n,o)){let p=n[o]();x(p)&&(i={...i,[s]:b(p,p.getMetaInfo())})}}),e.arrayKeys!=null&&e.arrayKeys.length>0&&e.arrayKeys.split(",").forEach(s=>{let o=`get${a(r(s))}`;if(P(n,o)){let A=n[o]().map(u=>{let c=g(u);return c==="array"?[]:c==="object"&&x(u)?b(u,u.getMetaInfo()):u});i={...i,[s]:A}}}),i};function tt(n){if(Array.isArray(n)&&n.length>0)return n.map(e=>{if(x(e))return b(e,e.getMetaInfo());throw"Meta info is missing in the object!"});if(g(n)==="object"){if(x(n))return b(n,n.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}return X(nt);})();
//# sourceMappingURL=index.global.js.map
