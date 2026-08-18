"use strict";var lib;(lib||={}).api=(()=>{var S=Object.defineProperty;var z=Object.getOwnPropertyDescriptor;var B=Object.getOwnPropertyNames;var G=Object.prototype.hasOwnProperty;var J=(n,e)=>{for(var i in e)S(n,i,{get:e[i],enumerable:!0})},U=(n,e,i,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of B(e))!G.call(n,o)&&o!==i&&S(n,o,{get:()=>e[o],enumerable:!(s=z(e,o))||s.enumerable});return n};var X=n=>U(S({},"__esModule",{value:!0}),n);var nt={};J(nt,{memorySizeOf:()=>Z,transmute:()=>N,unTransmute:()=>tt});var d="#",k="Transmute",W="",Y="_";var R=n=>typeof n=="object"&&n!=null&&"getMetaInfo"in n,P=(n,e)=>typeof n=="object"&&n!=null&&e in n,q=function(n=9,e=2){return Math.random().toFixed(n).substring(e)},g=function(n){let e=Object.prototype.toString.call(n);return e.substring(1,e.length-1).split(/\s/)[1].toLowerCase()},Q=function(n,e,i,s,o,p,C,l){if(n.rules!=null){let c=e!=null&&e.trim().length>0?`${e}.${i}`:void 0,h=i,x=e==="root"?i:c??i;c!=null&&n.rules[c]!=null?(o=o??n.rules[c],h=c):n.rules[i]!=null&&(o=o??n.rules[i],h=i);let M=(E,I)=>{if(o!=null){let _=I??l??p?.getIndex?.(),y=o(E,{key:i,path:x,value:E,parentObject:p,rootObject:C,index:_,getParent:()=>p,getRoot:()=>C});if(y!==!0){if(typeof y=="string"){let w=I??l??p?.getIndex?.();throw w!=null?new Error(`Validation error at index ${w} [${h}]: ${y}`):new Error(`Validation error [${h}]: ${y}`)}throw new Error(`Validation failed for property ${h} with value ${E}`)}}};if(o!=null&&g(o)==="function"&&s!=null){if(Array.isArray(s)){s.forEach((E,I)=>M(E,I));return}M(s)}}},r=function(n){return isNaN(Number(n[0]))||(n="_"+n),n.toString().replace(/-/g,Y).replace(/\s|\./g,W)},a=function(n){return n[0].toUpperCase()+n.slice(1)},b=function(n,e=",",i=",",s=" COMMA_PLACEHOLDER"){return n.join(e).replaceAll(i,"").replaceAll(s,",")},F=function(n){return{validateInput:n?.validateInput??!1,cloneable:n?.cloneable??!0,rules:{...n?.rules??{}}}},Z=function(n){let e=function(s){return s<1024?s+" bytes":s<Math.pow(1024,2)?(s/1024).toFixed(6)+" KiB":s<Math.pow(1024,3)?(s/Math.pow(1024,2)).toFixed(6)+" MiB":(s/Math.pow(1024,3)).toFixed(6)+" GiB"},i=JSON.stringify(n);return e(encodeURI(i).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},j=function(n,e,i="root",s,o,p,C){let l=C??F(),c=Object.keys(e),h=c.filter(t=>g(e[t])!=="object"&&g(e[t])!=="array"),x=c.filter(t=>g(e[t])==="object"),M=c.filter(t=>g(e[t])==="array"),E=b(c.map(t=>`${d}${r(t)};`)),I=b(c.map(t=>`
                            initialize${a(r(t))}(v) {
                                this.${d}${r(t)} = v;
                                return this;
                            }
                        `)),_=b(c.map(t=>`
              get${a(r(t))}() {
                return this.${d}${r(t)};
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
                this.${d}${r(t)} = v;
                return this;
              }
            `)),H=b(c.map(t=>{let u=g(e[t]);return`
              get${a(r(t))}() {
                return this.${d}${r(t)};
              }
              set${a(r(t))}(v COMMA_PLACEHOLDER validator) {
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
                    this.${d}${r(t)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${u} expected but got ' + typeOfValue + ' instead';
              }
            `})),y=b(M.map(t=>`
              get${a(r(t))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${d}${r(t)}.length) {
                        return this.${d}${r(t)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(r(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${d}${r(t)}) && i != null) {
                    if (i >= 0 && i < this.${d}${r(t)}.length) {
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${t}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i
                        );
                        this.${d}${r(t)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),w=b(M.map(t=>`
              get${a(r(t))}At(i) {
                const value = this.${d}${r(t)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${a(r(t))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${d}${r(t)};
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
          ${E}
          #nameSpace = ${i.trim().length>0?`'${i.trim()}'`:"undefined"};
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

          ${l.validateInput?H:_}
          ${l.validateInput?w:y}
        }
      `,$=new Function("",V)();$.prototype!=null&&($.prototype.toJson=function(){return R(this)?m(this,this.getMetaInfo()):{}},l.cloneable&&($.prototype.clone=function(){return N(this.toJson(),l)}),$.prototype.getMetaInfo=function(){let t={};return h.length>0&&(t={...t,primitiveKeys:h.toString()}),x.length>0&&(t={...t,objectKeys:x.toString()}),M.length>0&&(t={...t,arrayKeys:M.toString()}),t},$.prototype.utility={getTypeOfObject:g,validateRule:(t,u,A,D,O,L,T)=>Q(l,t,u,A,D,O,L,T)});let f=new $,v=s||f,K=o||f;return f.setInternalReferences(v,K,p),h.forEach(t=>{let u=`initialize${a(r(t))}`;u in f&&typeof f[u]=="function"&&f[u](e[t])}),x.forEach(t=>{let u=`initialize${a(r(t))}`;if(u in f&&typeof f[u]=="function"){let A=j(a(r(t)),e[t],i.trim().length>0?`${i}_${t}`:t,v,f,void 0,l);f[u](A)}}),M.forEach(t=>{let u=`initialize${a(r(t))}`;if(u in f&&typeof f[u]=="function"){let A=e[t];if(Array.isArray(A)){A.some(O=>g(O)==="object")&&f[u]([]);let D=A.map((O,L)=>{if(g(O)==="object")return j(a(r(`${t}${L}`)),O,i.trim().length>0?`${i}_${t}`:t,v,f,L,l);if(g(O)==="array")throw"Multidimensional array not supported. Yet!";return O});f[u](D)}}}),f};function N(n,e,i){if(g(n)!=="object")throw"Expecting a JavaScript Object notation!";let s=F(e),o=j(a(r(i??`${k}${q()}`)),n,"root",void 0,void 0,void 0,s);return o.setInternalReferences(o,o,void 0),o}var m=function(n,e){let i={};return e.primitiveKeys!=null&&e.primitiveKeys.length>0&&e.primitiveKeys.split(",").forEach(s=>{let o=`get${a(r(s))}`;P(n,o)&&(i={...i,[s]:n[o]()})}),e.objectKeys!=null&&e.objectKeys.length>0&&e.objectKeys.split(",").forEach(s=>{let o=`get${a(r(s))}`;if(P(n,o)){let p=n[o]();R(p)&&(i={...i,[s]:m(p,p.getMetaInfo())})}}),e.arrayKeys!=null&&e.arrayKeys.length>0&&e.arrayKeys.split(",").forEach(s=>{let o=`get${a(r(s))}`;if(P(n,o)){let C=n[o]().map(l=>{let c=g(l);return c==="array"?[]:c==="object"&&R(l)?m(l,l.getMetaInfo()):l});i={...i,[s]:C}}}),i};function tt(n){if(Array.isArray(n)&&n.length>0)return n.map(e=>{if(R(e))return m(e,e.getMetaInfo());throw"Meta info is missing in the object!"});if(g(n)==="object"){if(R(n))return m(n,n.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}return X(nt);})();
//# sourceMappingURL=index.global.js.map
