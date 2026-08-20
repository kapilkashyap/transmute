var E="#",B="Transmute",z="",J="_";var M=t=>typeof t=="object"&&t!=null&&"getMetaInfo"in t,V=(t,e)=>typeof t=="object"&&t!=null&&e in t,U=function(t=9,e=2){return Math.random().toFixed(t).substring(e)},C=function(t){let e=Object.prototype.toString.call(t);return e.substring(1,e.length-1).split(/\s/)[1].toLowerCase()},W=function(t,e){let s=t.split("."),r=e.split(".");return s.length!==r.length?!1:s.every((i,u)=>i==="*"||i===r[u])},_=function(t,e){return Object.keys(t).find(s=>s.includes("*")&&W(s,e))},X=function(t,e,s,r,i,u,a,o){if(t.rules!=null){let l=e!=null&&e.trim().length>0?`${e}.${s}`:void 0,c=s,h=e==="root"?s:l??s,R=l!=null?_(t.rules,l):void 0;l!=null&&t.rules[l]!=null?(i=i??t.rules[l],c=l):l!=null&&R!=null?(i=i??t.rules[R],c=l):t.rules[s]!=null&&(i=i??t.rules[s],c=s);let p=(f,m)=>{if(i!=null){let A=m??o??u?.getIndex?.(),I=i(f,{key:s,path:h,value:f,parentObject:u,rootObject:a,index:A,getParent:()=>u,getRoot:()=>a});if(I!==!0){if(typeof I=="string"){let K=m??o??u?.getIndex?.();throw K!=null?new Error(`Validation error at index ${K} [${c}]: ${I}`):new Error(`Validation error [${c}]: ${I}`)}throw new Error(`Validation failed for property ${c} with value ${f}`)}}};if(i!=null&&C(i)==="function"&&r!=null){if(Array.isArray(r)){r.forEach((f,m)=>p(f,m));return}p(r)}}},Y=async function(t,e,s,r,i,u,a){if(t.asyncRules==null)return;let o=e!=null&&e.trim().length>0?`${e}.${s}`:void 0,l=s,c,h=e==="root"?s:o??s,R=o!=null?_(t.asyncRules,o):void 0;if(o!=null&&t.asyncRules[o]!=null?(c=t.asyncRules[o],l=o):o!=null&&R!=null?(c=t.asyncRules[R],l=o):t.asyncRules[s]!=null&&(c=t.asyncRules[s],l=s),c==null)return;let p=async(f,m)=>{let A=m??a??i?.getIndex?.(),I=await c(f,{key:s,path:h,value:f,parentObject:i,rootObject:u,index:A,getParent:()=>i,getRoot:()=>u});if(I!==!0)throw typeof I=="string"?A!=null?new Error(`Validation error at index ${A} [${l}]: ${I}`):new Error(`Validation error [${l}]: ${I}`):new Error(`Validation failed for property ${l} with value ${f}`)};if(Array.isArray(r)){for(let[f,m]of r.entries())await p(m,f);return}await p(r)},y=function(t){return isNaN(Number(t[0]))||(t="_"+t),t.toString().replace(/-/g,J).replace(/\s|\./g,z)},g=function(t){return t[0].toUpperCase()+t.slice(1)},T=function(t,e=",",s=",",r=" COMMA_PLACEHOLDER"){return t.join(e).replaceAll(s,"").replaceAll(r,",")},F=function(t){return{validateInput:t?.validateInput??!1,validateOnCreate:t?.validateOnCreate??!1,cloneable:t?.cloneable??!0,rules:{...t?.rules??{}},asyncRules:{...t?.asyncRules??{}}}},N=function(t){let e=t.getMetaInfo();return[...e.primitiveKeys!=null&&e.primitiveKeys.length>0?e.primitiveKeys.split(","):[],...e.objectKeys!=null&&e.objectKeys.length>0?e.objectKeys.split(","):[],...e.arrayKeys!=null&&e.arrayKeys.length>0?e.arrayKeys.split(","):[]].filter(Boolean).forEach(r=>{let i=`get${g(y(r))}`;if(typeof t[i]!="function")return;let u=t,a=t[i](),o=u.utility.typeMap?.[r]??null,l=u.utility.getTypeOfObject(a);if(o!=null&&l!==o)throw new Error(`Type mismatch: argument of type ${o} expected but got ${l} instead`);if(u.utility.validateRule(u.getNameSpace(),r,a,void 0,u,u.getRoot()),Array.isArray(a)){let c=u.utility.elementTypeMap?.[r];a.forEach((h,R)=>{let p=c?.[R],f=u.utility.getTypeOfObject(h);if(p!=null&&f!==p)throw new Error(`Type mismatch at index ${R} [${r}]: argument of type ${p} expected but got ${f} instead`);h!=null&&typeof h=="object"&&M(h)&&h.validate()});return}a!=null&&typeof a=="object"&&M(a)&&a.validate()}),t},q=async function(t){N(t);let e=t.getMetaInfo(),s=[...e.primitiveKeys!=null&&e.primitiveKeys.length>0?e.primitiveKeys.split(","):[],...e.objectKeys!=null&&e.objectKeys.length>0?e.objectKeys.split(","):[],...e.arrayKeys!=null&&e.arrayKeys.length>0?e.arrayKeys.split(","):[]].filter(Boolean);for(let r of s){let i=`get${g(y(r))}`;if(typeof t[i]!="function")continue;let u=t,a=t[i]();if(await u.utility.validateAsyncRule(u.getNameSpace(),r,a,u,u.getRoot()),Array.isArray(a)){for(let o of a)o!=null&&typeof o=="object"&&M(o)&&typeof o.validateAsync=="function"&&await o.validateAsync();continue}a!=null&&typeof a=="object"&&M(a)&&typeof a.validateAsync=="function"&&await a.validateAsync()}return t},Q=function(t){let e=[],s=t.getMetaInfo();return[...s.primitiveKeys!=null&&s.primitiveKeys.length>0?s.primitiveKeys.split(","):[],...s.objectKeys!=null&&s.objectKeys.length>0?s.objectKeys.split(","):[],...s.arrayKeys!=null&&s.arrayKeys.length>0?s.arrayKeys.split(","):[]].filter(Boolean).forEach(i=>{let u=`get${g(y(i))}`;if(typeof t[u]!="function")return;let a=t,o=a.getNameSpace(),l=o==="root"||o==null?i:`${o}.${i}`,c=t[u](),h=a.utility.typeMap?.[i]??null,R=a.utility.getTypeOfObject(c);h!=null&&R!==h&&e.push({path:l,key:i,message:`Type mismatch: argument of type ${h} expected but got ${R} instead`});try{a.utility.validateRule(o,i,c,void 0,a,a.getRoot())}catch(p){e.push({path:l,key:i,message:p instanceof Error?p.message:String(p)})}if(Array.isArray(c)){let p=a.utility.elementTypeMap?.[i];c.forEach((f,m)=>{let A=p?.[m],x=a.utility.getTypeOfObject(f);A!=null&&x!==A&&e.push({path:l,key:i,index:m,message:`Type mismatch at index ${m} [${i}]: argument of type ${A} expected but got ${x} instead`}),f!=null&&typeof f=="object"&&M(f)&&typeof f.validate=="function"&&e.push(...f.validate({collectErrors:!0}).errors)});return}c!=null&&typeof c=="object"&&M(c)&&typeof c.validate=="function"&&e.push(...c.validate({collectErrors:!0}).errors)}),e},Z=async function(t){let e=[],s=t.getMetaInfo(),r=[...s.primitiveKeys!=null&&s.primitiveKeys.length>0?s.primitiveKeys.split(","):[],...s.objectKeys!=null&&s.objectKeys.length>0?s.objectKeys.split(","):[],...s.arrayKeys!=null&&s.arrayKeys.length>0?s.arrayKeys.split(","):[]].filter(Boolean);for(let i of r){let u=`get${g(y(i))}`;if(typeof t[u]!="function")continue;let a=t,o=a.getNameSpace(),l=o==="root"||o==null?i:`${o}.${i}`,c=t[u](),h=a.utility.typeMap?.[i]??null,R=a.utility.getTypeOfObject(c);h!=null&&R!==h&&e.push({path:l,key:i,message:`Type mismatch: argument of type ${h} expected but got ${R} instead`});try{a.utility.validateRule(o,i,c,void 0,a,a.getRoot())}catch(p){e.push({path:l,key:i,message:p instanceof Error?p.message:String(p)})}try{await a.utility.validateAsyncRule(o,i,c,a,a.getRoot())}catch(p){e.push({path:l,key:i,message:p instanceof Error?p.message:String(p)})}if(Array.isArray(c)){let p=a.utility.elementTypeMap?.[i];for(let[f,m]of c.entries()){let A=p?.[f],x=a.utility.getTypeOfObject(m);if(A!=null&&x!==A&&e.push({path:l,key:i,index:f,message:`Type mismatch at index ${f} [${i}]: argument of type ${A} expected but got ${x} instead`}),m!=null&&typeof m=="object"&&M(m)&&typeof m.validateAsync=="function"){let I=await m.validateAsync({collectErrors:!0});e.push(...I.errors)}}continue}if(c!=null&&typeof c=="object"&&M(c)&&typeof c.validateAsync=="function"){let p=await c.validateAsync({collectErrors:!0});e.push(...p.errors)}}return e},nt=function(t){let e=function(r){return r<1024?r+" bytes":r<Math.pow(1024,2)?(r/1024).toFixed(6)+" KiB":r<Math.pow(1024,3)?(r/Math.pow(1024,2)).toFixed(6)+" MiB":(r/Math.pow(1024,3)).toFixed(6)+" GiB"},s=JSON.stringify(t);return e(encodeURI(s).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},S=function(t,e,s="root",r,i,u,a){let o=a??F(),l=Object.keys(e),c=l.reduce((n,d)=>({...n,[d]:C(e[d])}),{}),h=l.filter(n=>C(e[n])!=="object"&&C(e[n])!=="array"),R=l.filter(n=>C(e[n])==="object"),p=l.filter(n=>C(e[n])==="array"),f=p.reduce((n,d)=>({...n,[d]:e[d].map(b=>C(b))}),{}),m=T(l.map(n=>`${E}${y(n)};`)),A=T(l.map(n=>`
                            initialize${g(y(n))}(v) {
                                this.${E}${y(n)} = v;
                                return this;
                            }
                        `)),x=T(l.map(n=>`
              get${g(y(n))}() {
                return this.${E}${y(n)};
              }
              set${g(y(n))}(v COMMA_PLACEHOLDER validator) {
                this.utility.validateRule(
                  this.getNameSpace() COMMA_PLACEHOLDER 
                  '${n}' COMMA_PLACEHOLDER 
                  v COMMA_PLACEHOLDER 
                  validator COMMA_PLACEHOLDER
                  this COMMA_PLACEHOLDER
                  this.getRoot()
                );
                this.${E}${y(n)} = v;
                return this;
              }
            `)),I=T(l.map(n=>{let d=C(e[n]);return`
              get${g(y(n))}() {
                return this.${E}${y(n)};
              }
              set${g(y(n))}(v COMMA_PLACEHOLDER validator) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${d}') {
                    this.utility.validateRule(
                      this.getNameSpace() COMMA_PLACEHOLDER 
                      '${n}' COMMA_PLACEHOLDER 
                      v COMMA_PLACEHOLDER 
                      validator COMMA_PLACEHOLDER
                      this COMMA_PLACEHOLDER
                      this.getRoot()
                    );
                    this.${E}${y(n)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${d} expected but got ' + typeOfValue + ' instead';
              }
            `})),K=T(p.map(n=>`
              get${g(y(n))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${E}${y(n)}.length) {
                        return this.${E}${y(n)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${g(y(n))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${E}${y(n)}) && i != null) {
                    if (i >= 0 && i < this.${E}${y(n)}.length) {
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${n}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i
                        );
                        this.${E}${y(n)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),H=T(p.map(n=>`
              get${g(y(n))}At(i) {
                const value = this.${E}${y(n)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${g(y(n))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${E}${y(n)};
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
                          i
                        );
                        value[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),k=`
        return class ${g(y(t))} {
          ${m}
          #modelConfig;
          #nameSpace = ${s.trim().length>0?`'${s.trim()}'`:"undefined"};
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

          ${A}

          ${o.validateInput?I:x}
          ${o.validateInput?H:K}
        }
      `,$=new Function("",k)();$.prototype!=null&&($.prototype.toJson=function(){return M(this)?j(this,this.getMetaInfo()):{}},o.cloneable&&($.prototype.clone=function(){return tt(this.toJson(),o)}),$.prototype.validate=function(n){if(n?.collectErrors){let d=Q(this);return{valid:d.length===0,errors:d}}return N(this)},$.prototype.validateAsync=async function(n){if(n?.collectErrors){let d=await Z(this);return{valid:d.length===0,errors:d}}return q(this)},$.prototype.getMetaInfo=function(){let n={};return h.length>0&&(n={...n,primitiveKeys:h.toString()}),R.length>0&&(n={...n,objectKeys:R.toString()}),p.length>0&&(n={...n,arrayKeys:p.toString()}),n},$.prototype.utility={typeMap:c,elementTypeMap:f,getTypeOfObject:C,validateRule:(n,d,b,D,v,w,P)=>X(o,n,d,b,D,v,w,P),validateAsyncRule:(n,d,b,D,v,w)=>Y(o,n,d,b,D,v,w)});let O=new $(o),L=r||O,G=i||O;return O.setInternalReferences(L,G,u),h.forEach(n=>{let d=`initialize${g(y(n))}`;d in O&&typeof O[d]=="function"&&O[d](e[n])}),R.forEach(n=>{let d=`initialize${g(y(n))}`;if(d in O&&typeof O[d]=="function"){let b=S(g(y(n)),e[n],s.trim().length>0?`${s}_${n}`:n,L,O,void 0,o);O[d](b)}}),p.forEach(n=>{let d=`initialize${g(y(n))}`;if(d in O&&typeof O[d]=="function"){let b=e[n];if(Array.isArray(b)){b.some(v=>C(v)==="object")&&O[d]([]);let D=b.map((v,w)=>{if(C(v)==="object")return S(g(y(`${n}${w}`)),v,s.trim().length>0?`${s}_${n}`:n,L,O,w,o);if(C(v)==="array")throw"Multidimensional array not supported. Yet!";return v});O[d](D)}}}),O};function tt(t,e,s){if(C(t)!=="object")throw"Expecting a JavaScript Object notation!";let r=F(e),i=S(g(y(s??`${B}${U()}`)),t,"root",void 0,void 0,void 0,r);return i.setInternalReferences(i,i,void 0),r.validateOnCreate&&i.validate(),i}var j=function(t,e){let s={};return e.primitiveKeys!=null&&e.primitiveKeys.length>0&&e.primitiveKeys.split(",").forEach(r=>{let i=`get${g(y(r))}`;V(t,i)&&(s={...s,[r]:t[i]()})}),e.objectKeys!=null&&e.objectKeys.length>0&&e.objectKeys.split(",").forEach(r=>{let i=`get${g(y(r))}`;if(V(t,i)){let u=t[i]();M(u)&&(s={...s,[r]:j(u,u.getMetaInfo())})}}),e.arrayKeys!=null&&e.arrayKeys.length>0&&e.arrayKeys.split(",").forEach(r=>{let i=`get${g(y(r))}`;if(V(t,i)){let a=t[i]().map(o=>{let l=C(o);return l==="array"?[]:l==="object"&&M(o)?j(o,o.getMetaInfo()):o});s={...s,[r]:a}}}),s};function st(t){if(Array.isArray(t)&&t.length>0)return t.map(e=>{if(M(e))return j(e,e.getMetaInfo());throw"Meta info is missing in the object!"});if(C(t)==="object"){if(M(t))return j(t,t.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}export{nt as memorySizeOf,tt as transmute,st as unTransmute};
//# sourceMappingURL=index.mjs.map
