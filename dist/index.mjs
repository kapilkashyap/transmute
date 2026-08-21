var I="#",U="Transmute",W="",X="_";var st=function(...t){return(e,r)=>{for(let i of t){let o=i(e,r);if(o!==!0)return o}return!0}},at=function(...t){return(e,r)=>{let i=!1;for(let o of t){let s=o(e,r);if(s===!0)return!0;i=s}return i}},w=t=>typeof t=="object"&&t!=null&&"getMetaInfo"in t,H=(t,e)=>typeof t=="object"&&t!=null&&e in t,Y=function(t=9,e=2){return Math.random().toFixed(t).substring(e)},O=function(t){let e=Object.prototype.toString.call(t);return e.substring(1,e.length-1).split(/\s/)[1].toLowerCase()},Q=function(t,e){let r=t.split("."),i=e.split(".");return r.length!==i.length?!1:r.every((o,s)=>o==="*"||o===i[s])},Z=function(t,e){return Object.keys(t).find(r=>r.includes("*")&&Q(r,e))},F=function(t,e,r,i=""){let o=e!=null&&e.trim().length>0?`${e}.${r}`:void 0,s=o!=null?`${o}${i}`:`${r}${i}`,a=o!=null?Z(t,`${o}${i}`):void 0;return o!=null&&t[`${o}${i}`]!=null?{rule:t[`${o}${i}`],usedKey:`${o}${i}`}:a!=null?{rule:t[a],usedKey:`${o}${i}`}:t[`${r}${i}`]!=null?{rule:t[`${r}${i}`],usedKey:`${r}${i}`}:{rule:void 0,usedKey:s}},G=t=>typeof t=="object"&&t!=null,B=t=>typeof t=="object"&&t!=null,tt=function(t,e,r,i,o,s,a,l,g=!1){if(t.rules!=null){let f=e!=null&&e.trim().length>0?`${e}.${r}`:void 0,h=F(t.rules,e,r),C=F(t.rules,e,r,"[]"),u=h.usedKey,R=h.rule,A=C.rule,$=e==="root"?r:f??r,v=G(R)?R:void 0;o=o??(typeof R=="function"?R:v?.validator);let D=G(A)?A:void 0,T=typeof A=="function"?A:D?.validator,L=(d,p)=>{throw p!=null?new Error(`Validation error at index ${p} [${u}]: ${d}`):new Error(`Validation error [${u}]: ${d}`)};if(v?.required===!0&&i==null&&L("Value is required",l),v?.immutable===!0&&g){let d=`get${m(c(r))}`,p=s!=null&&typeof s=="object"&&d in s?s[d]:void 0,E=typeof p=="function"?p.call(s):void 0,K=l!=null&&Array.isArray(E)?E[l]:E;Object.is(K,i)||L("Property is immutable",l)}let M=(d,p)=>{if(o!=null){let E=p??l??s?.getIndex?.(),n=o(d,{key:r,path:$,value:d,parentObject:s,rootObject:a,index:E,getParent:()=>s,getRoot:()=>a});if(n!==!0){if(typeof n=="string"){let y=p??l??s?.getIndex?.();throw y!=null?new Error(`Validation error at index ${y} [${u}]: ${n}`):new Error(`Validation error [${u}]: ${n}`)}throw new Error(`Validation failed for property ${u} with value ${d}`)}}},V=d=>{if(D?.required===!0&&d==null)throw new Error(`Validation error [${C.usedKey}]: Value is required`);if(T==null||d==null)return;let E=T(d,{key:r,path:$,value:d,parentObject:s,rootObject:a,getParent:()=>s,getRoot:()=>a});if(E!==!0)throw typeof E=="string"?new Error(`Validation error [${C.usedKey}]: ${E}`):new Error(`Validation failed for property ${C.usedKey} with value ${d}`)};if(A!=null){let d=i;if(l!=null&&s!=null&&typeof s=="object"){let p=`get${m(c(r))}`,E=s[p],K=typeof E=="function"?E.call(s):void 0;Array.isArray(K)&&(d=K.map((n,y)=>y===l?i:n))}V(d)}if(o!=null&&O(o)==="function"&&i!=null){if(Array.isArray(i)){i.forEach((d,p)=>M(d,p));return}M(i)}}},et=async function(t,e,r,i,o,s,a){if(t.asyncRules==null)return;let l=e!=null&&e.trim().length>0?`${e}.${r}`:void 0,g=F(t.asyncRules,e,r),f=F(t.asyncRules,e,r,"[]"),h=g.usedKey,C=g.rule,u=f.rule,R=e==="root"?r:l??r,A=B(C)?C:void 0,$=typeof C=="function"?C:A?.validator,v=B(u)?u:void 0,D=typeof u=="function"?u:v?.validator;if(A?.required===!0&&i==null)throw new Error(`Validation error [${h}]: Value is required`);let T=async(M,V)=>{let d=V??a??o?.getIndex?.(),E=await $(M,{key:r,path:R,value:M,parentObject:o,rootObject:s,index:d,getParent:()=>o,getRoot:()=>s});if(E!==!0)throw typeof E=="string"?d!=null?new Error(`Validation error at index ${d} [${h}]: ${E}`):new Error(`Validation error [${h}]: ${E}`):new Error(`Validation failed for property ${h} with value ${M}`)},L=async M=>{if(v?.required===!0&&M==null)throw new Error(`Validation error [${f.usedKey}]: Value is required`);if(D==null||M==null)return;let d=await D(M,{key:r,path:R,value:M,parentObject:o,rootObject:s,getParent:()=>o,getRoot:()=>s});if(d!==!0)throw typeof d=="string"?new Error(`Validation error [${f.usedKey}]: ${d}`):new Error(`Validation failed for property ${f.usedKey} with value ${M}`)};if(u!=null&&await L(i),$!=null){if(Array.isArray(i)){for(let[M,V]of i.entries())await T(V,M);return}await T(i)}},c=function(t){return isNaN(Number(t[0]))||(t="_"+t),t.toString().replace(/-/g,X).replace(/\s|\./g,W)},m=function(t){return t[0].toUpperCase()+t.slice(1)},P=function(t,e=",",r=",",i=" COMMA_PLACEHOLDER"){return t.join(e).replaceAll(r,"").replaceAll(i,",")},z=function(t){return{validateInput:t?.validateInput??!1,validateOnCreate:t?.validateOnCreate??!1,cloneable:t?.cloneable??!0,rules:{...t?.rules??{}},asyncRules:{...t?.asyncRules??{}}}},q=function(t){let e=t.getMetaInfo();return[...e.primitiveKeys!=null&&e.primitiveKeys.length>0?e.primitiveKeys.split(","):[],...e.objectKeys!=null&&e.objectKeys.length>0?e.objectKeys.split(","):[],...e.arrayKeys!=null&&e.arrayKeys.length>0?e.arrayKeys.split(","):[]].filter(Boolean).forEach(i=>{let o=`get${m(c(i))}`;if(typeof t[o]!="function")return;let s=t,a=t[o](),l=s.utility.typeMap?.[i]??null,g=s.utility.getTypeOfObject(a);if(l!=null&&g!==l)throw new Error(`Type mismatch: argument of type ${l} expected but got ${g} instead`);if(s.utility.validateRule(s.getNameSpace(),i,a,void 0,s,s.getRoot()),Array.isArray(a)){let f=s.utility.elementTypeMap?.[i];a.forEach((h,C)=>{let u=f?.[C],R=s.utility.getTypeOfObject(h);if(u!=null&&R!==u)throw new Error(`Type mismatch at index ${C} [${i}]: argument of type ${u} expected but got ${R} instead`);h!=null&&typeof h=="object"&&w(h)&&h.validate()});return}a!=null&&typeof a=="object"&&w(a)&&a.validate()}),t},nt=async function(t){q(t);let e=t.getMetaInfo(),r=[...e.primitiveKeys!=null&&e.primitiveKeys.length>0?e.primitiveKeys.split(","):[],...e.objectKeys!=null&&e.objectKeys.length>0?e.objectKeys.split(","):[],...e.arrayKeys!=null&&e.arrayKeys.length>0?e.arrayKeys.split(","):[]].filter(Boolean);for(let i of r){let o=`get${m(c(i))}`;if(typeof t[o]!="function")continue;let s=t,a=t[o]();if(await s.utility.validateAsyncRule(s.getNameSpace(),i,a,s,s.getRoot()),Array.isArray(a)){for(let l of a)l!=null&&typeof l=="object"&&w(l)&&typeof l.validateAsync=="function"&&await l.validateAsync();continue}a!=null&&typeof a=="object"&&w(a)&&typeof a.validateAsync=="function"&&await a.validateAsync()}return t},ot=function(t){let e=[],r=t.getMetaInfo();return[...r.primitiveKeys!=null&&r.primitiveKeys.length>0?r.primitiveKeys.split(","):[],...r.objectKeys!=null&&r.objectKeys.length>0?r.objectKeys.split(","):[],...r.arrayKeys!=null&&r.arrayKeys.length>0?r.arrayKeys.split(","):[]].filter(Boolean).forEach(o=>{let s=`get${m(c(o))}`;if(typeof t[s]!="function")return;let a=t,l=a.getNameSpace(),g=l==="root"||l==null?o:`${l}.${o}`,f=t[s](),h=a.utility.typeMap?.[o]??null,C=a.utility.getTypeOfObject(f);h!=null&&C!==h&&e.push({path:g,key:o,message:`Type mismatch: argument of type ${h} expected but got ${C} instead`});try{a.utility.validateRule(l,o,f,void 0,a,a.getRoot())}catch(u){e.push({path:g,key:o,message:u instanceof Error?u.message:String(u)})}if(Array.isArray(f)){let u=a.utility.elementTypeMap?.[o];f.forEach((R,A)=>{let $=u?.[A],v=a.utility.getTypeOfObject(R);$!=null&&v!==$&&e.push({path:g,key:o,index:A,message:`Type mismatch at index ${A} [${o}]: argument of type ${$} expected but got ${v} instead`}),R!=null&&typeof R=="object"&&w(R)&&typeof R.validate=="function"&&e.push(...R.validate({collectErrors:!0}).errors)});return}f!=null&&typeof f=="object"&&w(f)&&typeof f.validate=="function"&&e.push(...f.validate({collectErrors:!0}).errors)}),e},rt=async function(t){let e=[],r=t.getMetaInfo(),i=[...r.primitiveKeys!=null&&r.primitiveKeys.length>0?r.primitiveKeys.split(","):[],...r.objectKeys!=null&&r.objectKeys.length>0?r.objectKeys.split(","):[],...r.arrayKeys!=null&&r.arrayKeys.length>0?r.arrayKeys.split(","):[]].filter(Boolean);for(let o of i){let s=`get${m(c(o))}`;if(typeof t[s]!="function")continue;let a=t,l=a.getNameSpace(),g=l==="root"||l==null?o:`${l}.${o}`,f=t[s](),h=a.utility.typeMap?.[o]??null,C=a.utility.getTypeOfObject(f);h!=null&&C!==h&&e.push({path:g,key:o,message:`Type mismatch: argument of type ${h} expected but got ${C} instead`});try{a.utility.validateRule(l,o,f,void 0,a,a.getRoot())}catch(u){e.push({path:g,key:o,message:u instanceof Error?u.message:String(u)})}try{await a.utility.validateAsyncRule(l,o,f,a,a.getRoot())}catch(u){e.push({path:g,key:o,message:u instanceof Error?u.message:String(u)})}if(Array.isArray(f)){let u=a.utility.elementTypeMap?.[o];for(let[R,A]of f.entries()){let $=u?.[R],v=a.utility.getTypeOfObject(A);if($!=null&&v!==$&&e.push({path:g,key:o,index:R,message:`Type mismatch at index ${R} [${o}]: argument of type ${$} expected but got ${v} instead`}),A!=null&&typeof A=="object"&&w(A)&&typeof A.validateAsync=="function"){let D=await A.validateAsync({collectErrors:!0});e.push(...D.errors)}}continue}if(f!=null&&typeof f=="object"&&w(f)&&typeof f.validateAsync=="function"){let u=await f.validateAsync({collectErrors:!0});e.push(...u.errors)}}return e},lt=function(t){let e=function(i){return i<1024?i+" bytes":i<Math.pow(1024,2)?(i/1024).toFixed(6)+" KiB":i<Math.pow(1024,3)?(i/Math.pow(1024,2)).toFixed(6)+" MiB":(i/Math.pow(1024,3)).toFixed(6)+" GiB"},r=JSON.stringify(t);return e(encodeURI(r).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},N=function(t,e,r="root",i,o,s,a){let l=a??z(),g=Object.keys(e),f=g.reduce((n,y)=>({...n,[y]:O(e[y])}),{}),h=g.filter(n=>O(e[n])!=="object"&&O(e[n])!=="array"),C=g.filter(n=>O(e[n])==="object"),u=g.filter(n=>O(e[n])==="array"),R=u.reduce((n,y)=>({...n,[y]:e[y].map(b=>O(b))}),{}),A=P(g.map(n=>`${I}${c(n)};`)),$=P(g.map(n=>`
                            initialize${m(c(n))}(v) {
                                this.${I}${c(n)} = v;
                                return this;
                            }
                        `)),v=P(g.map(n=>`
              get${m(c(n))}() {
                return this.${I}${c(n)};
              }
              set${m(c(n))}(v COMMA_PLACEHOLDER validator) {
                this.utility.validateRule(
                  this.getNameSpace() COMMA_PLACEHOLDER 
                  '${n}' COMMA_PLACEHOLDER 
                  v COMMA_PLACEHOLDER 
                  validator COMMA_PLACEHOLDER
                  this COMMA_PLACEHOLDER
                  this.getRoot() COMMA_PLACEHOLDER
                  undefined COMMA_PLACEHOLDER
                  true
                );
                this.${I}${c(n)} = v;
                return this;
              }
            `)),D=P(g.map(n=>{let y=O(e[n]);return`
              get${m(c(n))}() {
                return this.${I}${c(n)};
              }
              set${m(c(n))}(v COMMA_PLACEHOLDER validator) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${y}') {
                    this.utility.validateRule(
                      this.getNameSpace() COMMA_PLACEHOLDER 
                      '${n}' COMMA_PLACEHOLDER 
                      v COMMA_PLACEHOLDER 
                      validator COMMA_PLACEHOLDER
                      this COMMA_PLACEHOLDER
                      this.getRoot() COMMA_PLACEHOLDER
                      undefined COMMA_PLACEHOLDER
                      true
                    );
                    this.${I}${c(n)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${y} expected but got ' + typeOfValue + ' instead';
              }
            `})),T=P(u.map(n=>`
              get${m(c(n))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${I}${c(n)}.length) {
                        return this.${I}${c(n)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${m(c(n))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${I}${c(n)}) && i != null) {
                    if (i >= 0 && i < this.${I}${c(n)}.length) {
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${n}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i COMMA_PLACEHOLDER
                          true
                        );
                        this.${I}${c(n)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),L=P(u.map(n=>`
              get${m(c(n))}At(i) {
                const value = this.${I}${c(n)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${m(c(n))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${I}${c(n)};
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
                          '${n}' COMMA_PLACEHOLDER 
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
      `,d=new Function("",M)();d.prototype!=null&&(d.prototype.toJson=function(){return w(this)?S(this,this.getMetaInfo()):{}},l.cloneable&&(d.prototype.clone=function(){return it(this.toJson(),l)}),d.prototype.validate=function(n){if(n?.collectErrors){let y=ot(this);return{valid:y.length===0,errors:y}}return q(this)},d.prototype.validateAsync=async function(n){if(n?.collectErrors){let y=await rt(this);return{valid:y.length===0,errors:y}}return nt(this)},d.prototype.getMetaInfo=function(){let n={};return h.length>0&&(n={...n,primitiveKeys:h.toString()}),C.length>0&&(n={...n,objectKeys:C.toString()}),u.length>0&&(n={...n,arrayKeys:u.toString()}),n},d.prototype.utility={typeMap:f,elementTypeMap:R,getTypeOfObject:O,validateRule:(n,y,b,_,x,j,k,J)=>tt(l,n,y,b,_,x,j,k,J),validateAsyncRule:(n,y,b,_,x,j)=>et(l,n,y,b,_,x,j)});let p=new d(l),E=i||p,K=o||p;return p.setInternalReferences(E,K,s),h.forEach(n=>{let y=`initialize${m(c(n))}`;y in p&&typeof p[y]=="function"&&p[y](e[n])}),C.forEach(n=>{let y=`initialize${m(c(n))}`;if(y in p&&typeof p[y]=="function"){let b=N(m(c(n)),e[n],r.trim().length>0?`${r}_${n}`:n,E,p,void 0,l);p[y](b)}}),u.forEach(n=>{let y=`initialize${m(c(n))}`;if(y in p&&typeof p[y]=="function"){let b=e[n];if(Array.isArray(b)){b.some(x=>O(x)==="object")&&p[y]([]);let _=b.map((x,j)=>{if(O(x)==="object")return N(m(c(`${n}${j}`)),x,r.trim().length>0?`${r}_${n}`:n,E,p,j,l);if(O(x)==="array")throw"Multidimensional array not supported. Yet!";return x});p[y](_)}}}),p};function it(t,e,r){if(O(t)!=="object")throw"Expecting a JavaScript Object notation!";let i=z(e),o=N(m(c(r??`${U}${Y()}`)),t,"root",void 0,void 0,void 0,i);return o.setInternalReferences(o,o,void 0),i.validateOnCreate&&o.validate(),o}var S=function(t,e){let r={};return e.primitiveKeys!=null&&e.primitiveKeys.length>0&&e.primitiveKeys.split(",").forEach(i=>{let o=`get${m(c(i))}`;H(t,o)&&(r={...r,[i]:t[o]()})}),e.objectKeys!=null&&e.objectKeys.length>0&&e.objectKeys.split(",").forEach(i=>{let o=`get${m(c(i))}`;if(H(t,o)){let s=t[o]();w(s)&&(r={...r,[i]:S(s,s.getMetaInfo())})}}),e.arrayKeys!=null&&e.arrayKeys.length>0&&e.arrayKeys.split(",").forEach(i=>{let o=`get${m(c(i))}`;if(H(t,o)){let a=t[o]().map(l=>{let g=O(l);return g==="array"?[]:g==="object"&&w(l)?S(l,l.getMetaInfo()):l});r={...r,[i]:a}}}),r};function ut(t){if(Array.isArray(t)&&t.length>0)return t.map(e=>{if(w(e))return S(e,e.getMetaInfo());throw"Meta info is missing in the object!"});if(O(t)==="object"){if(w(t))return S(t,t.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}export{st as allOf,at as anyOf,lt as memorySizeOf,it as transmute,ut as unTransmute};
//# sourceMappingURL=index.mjs.map
