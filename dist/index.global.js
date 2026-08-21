"use strict";var lib;(lib||={}).api=(()=>{var H=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var Y=Object.getOwnPropertyNames;var Q=Object.prototype.hasOwnProperty;var Z=(t,e)=>{for(var o in e)H(t,o,{get:e[o],enumerable:!0})},tt=(t,e,o,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Y(e))!Q.call(t,n)&&n!==o&&H(t,n,{get:()=>e[n],enumerable:!(i=X(e,n))||i.enumerable});return t};var et=t=>tt(H({},"__esModule",{value:!0}),t);var mt={};Z(mt,{allOf:()=>it,anyOf:()=>st,memorySizeOf:()=>gt,transmute:()=>U,unTransmute:()=>ht});var I="#",nt="Transmute",ot="",rt="_";var it=function(...t){return(e,o)=>{for(let i of t){let n=i(e,o);if(n!==!0)return n}return!0}},st=function(...t){return(e,o)=>{let i=!1;for(let n of t){let s=n(e,o);if(s===!0)return!0;i=s}return i}},w=t=>typeof t=="object"&&t!=null&&"getMetaInfo"in t,N=(t,e)=>typeof t=="object"&&t!=null&&e in t,at=function(t=9,e=2){return Math.random().toFixed(t).substring(e)},O=function(t){let e=Object.prototype.toString.call(t);return e.substring(1,e.length-1).split(/\s/)[1].toLowerCase()},lt=function(t,e){let o=t.split("."),i=e.split(".");return o.length!==i.length?!1:o.every((n,s)=>n==="*"||n===i[s])},ut=function(t,e){return Object.keys(t).find(o=>o.includes("*")&&lt(o,e))},F=function(t,e,o,i=""){let n=e!=null&&e.trim().length>0?`${e}.${o}`:void 0,s=n!=null?`${n}${i}`:`${o}${i}`,a=n!=null?ut(t,`${n}${i}`):void 0;return n!=null&&t[`${n}${i}`]!=null?{rule:t[`${n}${i}`],usedKey:`${n}${i}`}:a!=null?{rule:t[a],usedKey:`${n}${i}`}:t[`${o}${i}`]!=null?{rule:t[`${o}${i}`],usedKey:`${o}${i}`}:{rule:void 0,usedKey:s}},B=t=>typeof t=="object"&&t!=null,z=t=>typeof t=="object"&&t!=null,ct=function(t,e,o,i,n,s,a,l,g=!1){if(t.rules!=null){let f=e!=null&&e.trim().length>0?`${e}.${o}`:void 0,h=F(t.rules,e,o),C=F(t.rules,e,o,"[]"),u=h.usedKey,R=h.rule,A=C.rule,$=e==="root"?o:f??o,v=B(R)?R:void 0;n=n??(typeof R=="function"?R:v?.validator);let D=B(A)?A:void 0,T=typeof A=="function"?A:D?.validator,L=(d,p)=>{throw p!=null?new Error(`Validation error at index ${p} [${u}]: ${d}`):new Error(`Validation error [${u}]: ${d}`)};if(v?.required===!0&&i==null&&L("Value is required",l),v?.immutable===!0&&g){let d=`get${m(c(o))}`,p=s!=null&&typeof s=="object"&&d in s?s[d]:void 0,E=typeof p=="function"?p.call(s):void 0,K=l!=null&&Array.isArray(E)?E[l]:E;Object.is(K,i)||L("Property is immutable",l)}let M=(d,p)=>{if(n!=null){let E=p??l??s?.getIndex?.(),r=n(d,{key:o,path:$,value:d,parentObject:s,rootObject:a,index:E,getParent:()=>s,getRoot:()=>a});if(r!==!0){if(typeof r=="string"){let y=p??l??s?.getIndex?.();throw y!=null?new Error(`Validation error at index ${y} [${u}]: ${r}`):new Error(`Validation error [${u}]: ${r}`)}throw new Error(`Validation failed for property ${u} with value ${d}`)}}},V=d=>{if(D?.required===!0&&d==null)throw new Error(`Validation error [${C.usedKey}]: Value is required`);if(T==null||d==null)return;let E=T(d,{key:o,path:$,value:d,parentObject:s,rootObject:a,getParent:()=>s,getRoot:()=>a});if(E!==!0)throw typeof E=="string"?new Error(`Validation error [${C.usedKey}]: ${E}`):new Error(`Validation failed for property ${C.usedKey} with value ${d}`)};if(A!=null){let d=i;if(l!=null&&s!=null&&typeof s=="object"){let p=`get${m(c(o))}`,E=s[p],K=typeof E=="function"?E.call(s):void 0;Array.isArray(K)&&(d=K.map((r,y)=>y===l?i:r))}V(d)}if(n!=null&&O(n)==="function"&&i!=null){if(Array.isArray(i)){i.forEach((d,p)=>M(d,p));return}M(i)}}},dt=async function(t,e,o,i,n,s,a){if(t.asyncRules==null)return;let l=e!=null&&e.trim().length>0?`${e}.${o}`:void 0,g=F(t.asyncRules,e,o),f=F(t.asyncRules,e,o,"[]"),h=g.usedKey,C=g.rule,u=f.rule,R=e==="root"?o:l??o,A=z(C)?C:void 0,$=typeof C=="function"?C:A?.validator,v=z(u)?u:void 0,D=typeof u=="function"?u:v?.validator;if(A?.required===!0&&i==null)throw new Error(`Validation error [${h}]: Value is required`);let T=async(M,V)=>{let d=V??a??n?.getIndex?.(),E=await $(M,{key:o,path:R,value:M,parentObject:n,rootObject:s,index:d,getParent:()=>n,getRoot:()=>s});if(E!==!0)throw typeof E=="string"?d!=null?new Error(`Validation error at index ${d} [${h}]: ${E}`):new Error(`Validation error [${h}]: ${E}`):new Error(`Validation failed for property ${h} with value ${M}`)},L=async M=>{if(v?.required===!0&&M==null)throw new Error(`Validation error [${f.usedKey}]: Value is required`);if(D==null||M==null)return;let d=await D(M,{key:o,path:R,value:M,parentObject:n,rootObject:s,getParent:()=>n,getRoot:()=>s});if(d!==!0)throw typeof d=="string"?new Error(`Validation error [${f.usedKey}]: ${d}`):new Error(`Validation failed for property ${f.usedKey} with value ${M}`)};if(u!=null&&await L(i),$!=null){if(Array.isArray(i)){for(let[M,V]of i.entries())await T(V,M);return}await T(i)}},c=function(t){return isNaN(Number(t[0]))||(t="_"+t),t.toString().replace(/-/g,rt).replace(/\s|\./g,ot)},m=function(t){return t[0].toUpperCase()+t.slice(1)},P=function(t,e=",",o=",",i=" COMMA_PLACEHOLDER"){return t.join(e).replaceAll(o,"").replaceAll(i,",")},q=function(t){return{validateInput:t?.validateInput??!1,validateOnCreate:t?.validateOnCreate??!1,cloneable:t?.cloneable??!0,rules:{...t?.rules??{}},asyncRules:{...t?.asyncRules??{}}}},J=function(t){let e=t.getMetaInfo();return[...e.primitiveKeys!=null&&e.primitiveKeys.length>0?e.primitiveKeys.split(","):[],...e.objectKeys!=null&&e.objectKeys.length>0?e.objectKeys.split(","):[],...e.arrayKeys!=null&&e.arrayKeys.length>0?e.arrayKeys.split(","):[]].filter(Boolean).forEach(i=>{let n=`get${m(c(i))}`;if(typeof t[n]!="function")return;let s=t,a=t[n](),l=s.utility.typeMap?.[i]??null,g=s.utility.getTypeOfObject(a);if(l!=null&&g!==l)throw new Error(`Type mismatch: argument of type ${l} expected but got ${g} instead`);if(s.utility.validateRule(s.getNameSpace(),i,a,void 0,s,s.getRoot()),Array.isArray(a)){let f=s.utility.elementTypeMap?.[i];a.forEach((h,C)=>{let u=f?.[C],R=s.utility.getTypeOfObject(h);if(u!=null&&R!==u)throw new Error(`Type mismatch at index ${C} [${i}]: argument of type ${u} expected but got ${R} instead`);h!=null&&typeof h=="object"&&w(h)&&h.validate()});return}a!=null&&typeof a=="object"&&w(a)&&a.validate()}),t},yt=async function(t){J(t);let e=t.getMetaInfo(),o=[...e.primitiveKeys!=null&&e.primitiveKeys.length>0?e.primitiveKeys.split(","):[],...e.objectKeys!=null&&e.objectKeys.length>0?e.objectKeys.split(","):[],...e.arrayKeys!=null&&e.arrayKeys.length>0?e.arrayKeys.split(","):[]].filter(Boolean);for(let i of o){let n=`get${m(c(i))}`;if(typeof t[n]!="function")continue;let s=t,a=t[n]();if(await s.utility.validateAsyncRule(s.getNameSpace(),i,a,s,s.getRoot()),Array.isArray(a)){for(let l of a)l!=null&&typeof l=="object"&&w(l)&&typeof l.validateAsync=="function"&&await l.validateAsync();continue}a!=null&&typeof a=="object"&&w(a)&&typeof a.validateAsync=="function"&&await a.validateAsync()}return t},ft=function(t){let e=[],o=t.getMetaInfo();return[...o.primitiveKeys!=null&&o.primitiveKeys.length>0?o.primitiveKeys.split(","):[],...o.objectKeys!=null&&o.objectKeys.length>0?o.objectKeys.split(","):[],...o.arrayKeys!=null&&o.arrayKeys.length>0?o.arrayKeys.split(","):[]].filter(Boolean).forEach(n=>{let s=`get${m(c(n))}`;if(typeof t[s]!="function")return;let a=t,l=a.getNameSpace(),g=l==="root"||l==null?n:`${l}.${n}`,f=t[s](),h=a.utility.typeMap?.[n]??null,C=a.utility.getTypeOfObject(f);h!=null&&C!==h&&e.push({path:g,key:n,message:`Type mismatch: argument of type ${h} expected but got ${C} instead`});try{a.utility.validateRule(l,n,f,void 0,a,a.getRoot())}catch(u){e.push({path:g,key:n,message:u instanceof Error?u.message:String(u)})}if(Array.isArray(f)){let u=a.utility.elementTypeMap?.[n];f.forEach((R,A)=>{let $=u?.[A],v=a.utility.getTypeOfObject(R);$!=null&&v!==$&&e.push({path:g,key:n,index:A,message:`Type mismatch at index ${A} [${n}]: argument of type ${$} expected but got ${v} instead`}),R!=null&&typeof R=="object"&&w(R)&&typeof R.validate=="function"&&e.push(...R.validate({collectErrors:!0}).errors)});return}f!=null&&typeof f=="object"&&w(f)&&typeof f.validate=="function"&&e.push(...f.validate({collectErrors:!0}).errors)}),e},pt=async function(t){let e=[],o=t.getMetaInfo(),i=[...o.primitiveKeys!=null&&o.primitiveKeys.length>0?o.primitiveKeys.split(","):[],...o.objectKeys!=null&&o.objectKeys.length>0?o.objectKeys.split(","):[],...o.arrayKeys!=null&&o.arrayKeys.length>0?o.arrayKeys.split(","):[]].filter(Boolean);for(let n of i){let s=`get${m(c(n))}`;if(typeof t[s]!="function")continue;let a=t,l=a.getNameSpace(),g=l==="root"||l==null?n:`${l}.${n}`,f=t[s](),h=a.utility.typeMap?.[n]??null,C=a.utility.getTypeOfObject(f);h!=null&&C!==h&&e.push({path:g,key:n,message:`Type mismatch: argument of type ${h} expected but got ${C} instead`});try{a.utility.validateRule(l,n,f,void 0,a,a.getRoot())}catch(u){e.push({path:g,key:n,message:u instanceof Error?u.message:String(u)})}try{await a.utility.validateAsyncRule(l,n,f,a,a.getRoot())}catch(u){e.push({path:g,key:n,message:u instanceof Error?u.message:String(u)})}if(Array.isArray(f)){let u=a.utility.elementTypeMap?.[n];for(let[R,A]of f.entries()){let $=u?.[R],v=a.utility.getTypeOfObject(A);if($!=null&&v!==$&&e.push({path:g,key:n,index:R,message:`Type mismatch at index ${R} [${n}]: argument of type ${$} expected but got ${v} instead`}),A!=null&&typeof A=="object"&&w(A)&&typeof A.validateAsync=="function"){let D=await A.validateAsync({collectErrors:!0});e.push(...D.errors)}}continue}if(f!=null&&typeof f=="object"&&w(f)&&typeof f.validateAsync=="function"){let u=await f.validateAsync({collectErrors:!0});e.push(...u.errors)}}return e},gt=function(t){let e=function(i){return i<1024?i+" bytes":i<Math.pow(1024,2)?(i/1024).toFixed(6)+" KiB":i<Math.pow(1024,3)?(i/Math.pow(1024,2)).toFixed(6)+" MiB":(i/Math.pow(1024,3)).toFixed(6)+" GiB"},o=JSON.stringify(t);return e(encodeURI(o).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},k=function(t,e,o="root",i,n,s,a){let l=a??q(),g=Object.keys(e),f=g.reduce((r,y)=>({...r,[y]:O(e[y])}),{}),h=g.filter(r=>O(e[r])!=="object"&&O(e[r])!=="array"),C=g.filter(r=>O(e[r])==="object"),u=g.filter(r=>O(e[r])==="array"),R=u.reduce((r,y)=>({...r,[y]:e[y].map(b=>O(b))}),{}),A=P(g.map(r=>`${I}${c(r)};`)),$=P(g.map(r=>`
                            initialize${m(c(r))}(v) {
                                this.${I}${c(r)} = v;
                                return this;
                            }
                        `)),v=P(g.map(r=>`
              get${m(c(r))}() {
                return this.${I}${c(r)};
              }
              set${m(c(r))}(v COMMA_PLACEHOLDER validator) {
                this.utility.validateRule(
                  this.getNameSpace() COMMA_PLACEHOLDER 
                  '${r}' COMMA_PLACEHOLDER 
                  v COMMA_PLACEHOLDER 
                  validator COMMA_PLACEHOLDER
                  this COMMA_PLACEHOLDER
                  this.getRoot() COMMA_PLACEHOLDER
                  undefined COMMA_PLACEHOLDER
                  true
                );
                this.${I}${c(r)} = v;
                return this;
              }
            `)),D=P(g.map(r=>{let y=O(e[r]);return`
              get${m(c(r))}() {
                return this.${I}${c(r)};
              }
              set${m(c(r))}(v COMMA_PLACEHOLDER validator) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${y}') {
                    this.utility.validateRule(
                      this.getNameSpace() COMMA_PLACEHOLDER 
                      '${r}' COMMA_PLACEHOLDER 
                      v COMMA_PLACEHOLDER 
                      validator COMMA_PLACEHOLDER
                      this COMMA_PLACEHOLDER
                      this.getRoot() COMMA_PLACEHOLDER
                      undefined COMMA_PLACEHOLDER
                      true
                    );
                    this.${I}${c(r)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${y} expected but got ' + typeOfValue + ' instead';
              }
            `})),T=P(u.map(r=>`
              get${m(c(r))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${I}${c(r)}.length) {
                        return this.${I}${c(r)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${m(c(r))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${I}${c(r)}) && i != null) {
                    if (i >= 0 && i < this.${I}${c(r)}.length) {
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${r}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i COMMA_PLACEHOLDER
                          true
                        );
                        this.${I}${c(r)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),L=P(u.map(r=>`
              get${m(c(r))}At(i) {
                const value = this.${I}${c(r)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${m(c(r))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${I}${c(r)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        // Compare against the type currently held at this index so heterogeneous arrays keep each slot's own contract.
                        const expectedType = this.utility.getTypeOfObject(value[i]);
                        const typeOfValue = this.utility.getTypeOfObject(v);
                        if (typeOfValue !== expectedType) {
                            throw 'Type mismatch: argument of type ' + expectedType + ' expected but got ' + typeOfValue + ' instead';
                        }
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${r}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i COMMA_PLACEHOLDER
                          true
                        );
                        value[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),M=`
        return class ${m(c(t))} {
          ${A}
          #modelConfig;
          #nameSpace = ${o.trim().length>0?`'${o.trim()}'`:"undefined"};
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

                    getRules() {
                        const rules = {};
                        Object.keys(this.#modelConfig.rules).forEach((key) => {
                                const rule = this.#modelConfig.rules[key];
                                rules[key] = rule != null && typeof rule === 'object' ? { ...rule } : rule;
                        });
                        return rules;
                    }

                    getAsyncRules() {
                        return { ...this.#modelConfig.asyncRules };
                    }

          updateRules(rules, options = {}) {
            const nextRules = options.mergeRules ? { ...this.#modelConfig.rules, ...rules } : { ...rules };
            if (Array.isArray(options.remove)) {
                options.remove.forEach((key) => delete nextRules[key]);
            }
            this.#modelConfig.rules = nextRules;
            return this.getRoot();
         }

          removeRules(...keys) {
            const nextRules = { ...this.#modelConfig.rules };
            keys.forEach((key) => delete nextRules[key]);
            this.#modelConfig.rules = nextRules;
            return this.getRoot();
          }

          updateAsyncRules(rules, options = {}) {
            const nextRules = options.mergeRules ? { ...this.#modelConfig.asyncRules, ...rules } : { ...rules };
            if (Array.isArray(options.remove)) {
                options.remove.forEach((key) => delete nextRules[key]);
            }
            this.#modelConfig.asyncRules = nextRules;
            return this.getRoot();
          }

          removeAsyncRules(...keys) {
            const nextRules = { ...this.#modelConfig.asyncRules };
            keys.forEach((key) => delete nextRules[key]);
            this.#modelConfig.asyncRules = nextRules;
            return this.getRoot();
          }

          ${$}

          ${l.validateInput?D:v}
          ${l.validateInput?L:T}
        }
      `,d=new Function("",M)();d.prototype!=null&&(d.prototype.toJson=function(){return w(this)?S(this,this.getMetaInfo()):{}},l.cloneable&&(d.prototype.clone=function(){return U(this.toJson(),l)}),d.prototype.validate=function(r){if(r?.collectErrors){let y=ft(this);return{valid:y.length===0,errors:y}}return J(this)},d.prototype.validateAsync=async function(r){if(r?.collectErrors){let y=await pt(this);return{valid:y.length===0,errors:y}}return yt(this)},d.prototype.getMetaInfo=function(){let r={};return h.length>0&&(r={...r,primitiveKeys:h.toString()}),C.length>0&&(r={...r,objectKeys:C.toString()}),u.length>0&&(r={...r,arrayKeys:u.toString()}),r},d.prototype.utility={typeMap:f,elementTypeMap:R,getTypeOfObject:O,validateRule:(r,y,b,_,x,j,G,W)=>ct(l,r,y,b,_,x,j,G,W),validateAsyncRule:(r,y,b,_,x,j)=>dt(l,r,y,b,_,x,j)});let p=new d(l),E=i||p,K=n||p;return p.setInternalReferences(E,K,s),h.forEach(r=>{let y=`initialize${m(c(r))}`;y in p&&typeof p[y]=="function"&&p[y](e[r])}),C.forEach(r=>{let y=`initialize${m(c(r))}`;if(y in p&&typeof p[y]=="function"){let b=k(m(c(r)),e[r],o.trim().length>0?`${o}_${r}`:r,E,p,void 0,l);p[y](b)}}),u.forEach(r=>{let y=`initialize${m(c(r))}`;if(y in p&&typeof p[y]=="function"){let b=e[r];if(Array.isArray(b)){b.some(x=>O(x)==="object")&&p[y]([]);let _=b.map((x,j)=>{if(O(x)==="object")return k(m(c(`${r}${j}`)),x,o.trim().length>0?`${o}_${r}`:r,E,p,j,l);if(O(x)==="array")throw"Multidimensional array not supported. Yet!";return x});p[y](_)}}}),p};function U(t,e,o){if(O(t)!=="object")throw"Expecting a JavaScript Object notation!";let i=q(e),n=k(m(c(o??`${nt}${at()}`)),t,"root",void 0,void 0,void 0,i);return n.setInternalReferences(n,n,void 0),i.validateOnCreate&&n.validate(),n}var S=function(t,e){let o={};return e.primitiveKeys!=null&&e.primitiveKeys.length>0&&e.primitiveKeys.split(",").forEach(i=>{let n=`get${m(c(i))}`;N(t,n)&&(o={...o,[i]:t[n]()})}),e.objectKeys!=null&&e.objectKeys.length>0&&e.objectKeys.split(",").forEach(i=>{let n=`get${m(c(i))}`;if(N(t,n)){let s=t[n]();w(s)&&(o={...o,[i]:S(s,s.getMetaInfo())})}}),e.arrayKeys!=null&&e.arrayKeys.length>0&&e.arrayKeys.split(",").forEach(i=>{let n=`get${m(c(i))}`;if(N(t,n)){let a=t[n]().map(l=>{let g=O(l);return g==="array"?[]:g==="object"&&w(l)?S(l,l.getMetaInfo()):l});o={...o,[i]:a}}}),o};function ht(t){if(Array.isArray(t)&&t.length>0)return t.map(e=>{if(w(e))return S(e,e.getMetaInfo());throw"Meta info is missing in the object!"});if(O(t)==="object"){if(w(t))return S(t,t.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}return et(mt);})();
//# sourceMappingURL=index.global.js.map
