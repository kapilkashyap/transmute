var I="#",ct="",dt="_";var O=e=>typeof e=="object"&&e!=null&&"getMetaInfo"in e,z=(e,t)=>typeof e=="object"&&e!=null&&t in e,B=function(e=9,t=2){return Math.random().toFixed(e).substring(t)},M=function(e){let t=Object.prototype.toString.call(e);return t.substring(1,t.length-1).split(/\s/)[1].toLowerCase()},l=function(e){return isNaN(Number(e[0]))||(e="_"+e),e.toString().replace(/-/g,dt).replace(/\s|\./g,ct)},m=function(e){return e[0].toUpperCase()+e.slice(1)},P=function(e,t=",",o=",",n=" COMMA_PLACEHOLDER"){return e.join(t).replaceAll(o,"").replaceAll(n,",")},H=function(e){return{validateInput:e?.validateInput??!1,validateOnCreate:e?.validateOnCreate??!1,cloneable:e?.cloneable??!0,rules:{...e?.rules??{}},asyncRules:{...e?.asyncRules??{}},plugins:[...e?.plugins??[]]}},ft=function(e){let t=function(n){return n<1024?n+" bytes":n<Math.pow(1024,2)?(n/1024).toFixed(6)+" KiB":n<Math.pow(1024,3)?(n/Math.pow(1024,2)).toFixed(6)+" MiB":(n/Math.pow(1024,3)).toFixed(6)+" GiB"},o=JSON.stringify(e);return t(encodeURI(o).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)};var U=function(e){let t=e.getMetaInfo();return[...t.primitiveKeys!=null&&t.primitiveKeys.length>0?t.primitiveKeys.split(","):[],...t.objectKeys!=null&&t.objectKeys.length>0?t.objectKeys.split(","):[],...t.arrayKeys!=null&&t.arrayKeys.length>0?t.arrayKeys.split(","):[]].filter(Boolean)},q=function(e){return U(e).forEach(o=>{let n=`get${m(l(o))}`;if(typeof e[n]!="function")return;let s=e,i=e[n](),d=s.utility.typeMap?.[o]??null,a=s.utility.getTypeOfObject(i);if(d!=null&&a!==d)throw new Error(`Type mismatch: argument of type ${d} expected but got ${a} instead`);if(s.utility.validateRule(s.getNameSpace(),o,i,void 0,s,s.getRoot()),Array.isArray(i)){let u=s.utility.elementTypeMap?.[o];i.forEach((h,C)=>{let c=u?.[C],y=s.utility.getTypeOfObject(h);if(c!=null&&y!==c)throw new Error(`Type mismatch at index ${C} [${o}]: argument of type ${c} expected but got ${y} instead`);h!=null&&typeof h=="object"&&O(h)&&h.validate()});return}i!=null&&typeof i=="object"&&O(i)&&i.validate()}),e},Z=async function(e){q(e);let t=U(e);for(let o of t){let n=`get${m(l(o))}`;if(typeof e[n]!="function")continue;let s=e,i=e[n]();if(await s.utility.validateAsyncRule(s.getNameSpace(),o,i,s,s.getRoot()),Array.isArray(i)){for(let d of i)d!=null&&typeof d=="object"&&O(d)&&typeof d.validateAsync=="function"&&await d.validateAsync();continue}i!=null&&typeof i=="object"&&O(i)&&typeof i.validateAsync=="function"&&await i.validateAsync()}return e},tt=function(e){let t=[];return U(e).forEach(n=>{let s=`get${m(l(n))}`;if(typeof e[s]!="function")return;let i=e,d=i.getNameSpace(),a=d==="root"||d==null?n:`${d}.${n}`,u=e[s](),h=i.utility.typeMap?.[n]??null,C=i.utility.getTypeOfObject(u);h!=null&&C!==h&&t.push({path:a,key:n,message:`Type mismatch: argument of type ${h} expected but got ${C} instead`});try{i.utility.validateRule(d,n,u,void 0,i,i.getRoot())}catch(c){t.push({path:a,key:n,message:c instanceof Error?c.message:String(c)})}if(Array.isArray(u)){let c=i.utility.elementTypeMap?.[n];u.forEach((y,R)=>{let E=c?.[R],x=i.utility.getTypeOfObject(y);E!=null&&x!==E&&t.push({path:a,key:n,index:R,message:`Type mismatch at index ${R} [${n}]: argument of type ${E} expected but got ${x} instead`}),y!=null&&typeof y=="object"&&O(y)&&typeof y.validate=="function"&&t.push(...y.validate({collectErrors:!0}).errors)});return}u!=null&&typeof u=="object"&&O(u)&&typeof u.validate=="function"&&t.push(...u.validate({collectErrors:!0}).errors)}),t},et=async function(e){let t=[],o=U(e);for(let n of o){let s=`get${m(l(n))}`;if(typeof e[s]!="function")continue;let i=e,d=i.getNameSpace(),a=d==="root"||d==null?n:`${d}.${n}`,u=e[s](),h=i.utility.typeMap?.[n]??null,C=i.utility.getTypeOfObject(u);h!=null&&C!==h&&t.push({path:a,key:n,message:`Type mismatch: argument of type ${h} expected but got ${C} instead`});try{i.utility.validateRule(d,n,u,void 0,i,i.getRoot())}catch(c){t.push({path:a,key:n,message:c instanceof Error?c.message:String(c)})}try{await i.utility.validateAsyncRule(d,n,u,i,i.getRoot())}catch(c){t.push({path:a,key:n,message:c instanceof Error?c.message:String(c)})}if(Array.isArray(u)){let c=i.utility.elementTypeMap?.[n];for(let[y,R]of u.entries()){let E=c?.[y],x=i.utility.getTypeOfObject(R);if(E!=null&&x!==E&&t.push({path:a,key:n,index:y,message:`Type mismatch at index ${y} [${n}]: argument of type ${E} expected but got ${x} instead`}),R!=null&&typeof R=="object"&&O(R)&&typeof R.validateAsync=="function"){let v=await R.validateAsync({collectErrors:!0});t.push(...v.errors)}}continue}if(u!=null&&typeof u=="object"&&O(u)&&typeof u.validateAsync=="function"){let c=await u.validateAsync({collectErrors:!0});t.push(...c.errors)}}return t};var pt=function(e,t){let o=e.split("."),n=t.split(".");return o.length!==n.length?!1:o.every((s,i)=>s==="*"||s===n[i])},yt=function(e,t){return Object.keys(e).find(o=>o.includes("*")&&pt(o,t))},F=function(e,t,o,n=""){let s=t!=null&&t.trim().length>0?`${t}.${o}`:void 0,i=s!=null?`${s}${n}`:`${o}${n}`,d=s!=null?yt(e,`${s}${n}`):void 0;return s!=null&&e[`${s}${n}`]!=null?{rule:e[`${s}${n}`],usedKey:`${s}${n}`}:d!=null?{rule:e[d],usedKey:`${s}${n}`}:e[`${o}${n}`]!=null?{rule:e[`${o}${n}`],usedKey:`${o}${n}`}:{rule:void 0,usedKey:i}},J=e=>typeof e=="object"&&e!=null,k=e=>typeof e=="object"&&e!=null;var nt=function(e,t,o,n,s,i,d,a,u=!1){if(e.rules!=null){let h=t!=null&&t.trim().length>0?`${t}.${o}`:void 0,C=F(e.rules,t,o),c=F(e.rules,t,o,"[]"),y=C.usedKey,R=C.rule,E=c.rule,x=t==="root"?o:h??o,v=J(R)?R:void 0;s=s??(typeof R=="function"?R:v?.validator);let D=J(E)?E:void 0,V=typeof E=="function"?E:D?.validator,_=(f,g)=>{throw g!=null?new Error(`Validation error at index ${g} [${y}]: ${f}`):new Error(`Validation error [${y}]: ${f}`)};if(v?.required===!0&&n==null&&_("Value is required",a),v?.immutable===!0&&u){let f=`get${m(l(o))}`,g=i!=null&&typeof i=="object"&&f in i?i[f]:void 0,A=typeof g=="function"?g.call(i):void 0,L=a!=null&&Array.isArray(A)?A[a]:A;Object.is(L,n)||_("Property is immutable",a)}let $=(f,g)=>{if(s!=null){let A=g??a??i?.getIndex?.(),r=s(f,{key:o,path:x,value:f,parentObject:i,rootObject:d,index:A,getParent:()=>i,getRoot:()=>d});if(r!==!0){if(typeof r=="string"){let p=g??a??i?.getIndex?.();throw p!=null?new Error(`Validation error at index ${p} [${y}]: ${r}`):new Error(`Validation error [${y}]: ${r}`)}throw new Error(`Validation failed for property ${y} with value ${f}`)}}},T=f=>{if(D?.required===!0&&f==null)throw new Error(`Validation error [${c.usedKey}]: Value is required`);if(V==null||f==null)return;let A=V(f,{key:o,path:x,value:f,parentObject:i,rootObject:d,getParent:()=>i,getRoot:()=>d});if(A!==!0)throw typeof A=="string"?new Error(`Validation error [${c.usedKey}]: ${A}`):new Error(`Validation failed for property ${c.usedKey} with value ${f}`)};if(E!=null){let f=n;if(a!=null&&i!=null&&typeof i=="object"){let g=`get${m(l(o))}`,A=i[g],L=typeof A=="function"?A.call(i):void 0;Array.isArray(L)&&(f=L.map((r,p)=>p===a?n:r))}T(f)}if(s!=null&&typeof s=="function"&&n!=null){if(Array.isArray(n)){n.forEach((f,g)=>$(f,g));return}$(n)}}};var W="transmute.validation",N=function(e){return{name:W,onSet:t=>{nt(e,t.nameSpace,t.key,t.value,t.validatorOverride,t.parentObject,t.rootObject,t.index,t.isUpdate)},onValidate:t=>{q(t)},onValidateAsync:async t=>{await Z(t)},onCollectErrors:t=>tt(t),onCollectErrorsAsync:t=>et(t)}};var X=function(e){let t=new Set;e.forEach(o=>{if(o.name===W||t.has(o.name))throw new Error(`Duplicate or reserved plugin name detected: ${o.name}`);t.add(o.name)})},ot=function(e,t,o,n,s,i,d,a,u){let h=t!=null&&t.trim().length>0?`${t}.${o}`:void 0,c={key:o,path:t==="root"?o:h??o,value:n,parentObject:i,rootObject:d,index:a,nameSpace:t,isUpdate:u,validatorOverride:s,getParent:()=>i,getRoot:()=>d};N(e).onSet?.(c,void 0),e.plugins.forEach(y=>{y.onSet?.(c,y.getConfig?.())})},rt=function(e,t){return N(t).onValidate?.(e,void 0),t.plugins.forEach(o=>o.onValidate?.(e,o.getConfig?.())),e},it=async function(e,t){await N(t).onValidateAsync?.(e,void 0);for(let o of t.plugins)await o.onValidateAsync?.(e,o.getConfig?.());return e},st=function(e,t){let o=N(t).onCollectErrors?.(e,void 0)??[];return t.plugins.forEach(n=>{n.onCollectErrors&&o.push(...n.onCollectErrors(e,n.getConfig?.()))}),o},at=async function(e,t){let o=await N(t).onCollectErrorsAsync?.(e,void 0)??[];for(let n of t.plugins)n.onCollectErrorsAsync&&o.push(...await n.onCollectErrorsAsync(e,n.getConfig?.()));return o};var lt=async function(e,t,o,n,s,i,d){if(e.asyncRules==null)return;let a=t!=null&&t.trim().length>0?`${t}.${o}`:void 0,u=F(e.asyncRules,t,o),h=F(e.asyncRules,t,o,"[]"),C=u.usedKey,c=u.rule,y=h.rule,R=t==="root"?o:a??o,E=k(c)?c:void 0,x=typeof c=="function"?c:E?.validator,v=k(y)?y:void 0,D=typeof y=="function"?y:v?.validator;if(E?.required===!0&&n==null)throw new Error(`Validation error [${C}]: Value is required`);let V=async($,T)=>{let f=T??d??s?.getIndex?.(),A=await x($,{key:o,path:R,value:$,parentObject:s,rootObject:i,index:f,getParent:()=>s,getRoot:()=>i});if(A!==!0)throw typeof A=="string"?f!=null?new Error(`Validation error at index ${f} [${C}]: ${A}`):new Error(`Validation error [${C}]: ${A}`):new Error(`Validation failed for property ${C} with value ${$}`)},_=async $=>{if(v?.required===!0&&$==null)throw new Error(`Validation error [${h.usedKey}]: Value is required`);if(D==null||$==null)return;let f=await D($,{key:o,path:R,value:$,parentObject:s,rootObject:i,getParent:()=>s,getRoot:()=>i});if(f!==!0)throw typeof f=="string"?new Error(`Validation error [${h.usedKey}]: ${f}`):new Error(`Validation failed for property ${h.usedKey} with value ${$}`)};if(y!=null&&await _(n),x!=null){if(Array.isArray(n)){for(let[$,T]of n.entries())await V(T,$);return}await V(n)}};var S=function(e,t){let o={};return t.primitiveKeys!=null&&t.primitiveKeys.length>0&&t.primitiveKeys.split(",").forEach(n=>{let s=`get${m(l(n))}`;z(e,s)&&(o={...o,[n]:e[s]()})}),t.objectKeys!=null&&t.objectKeys.length>0&&t.objectKeys.split(",").forEach(n=>{let s=`get${m(l(n))}`;if(z(e,s)){let i=e[s]();O(i)&&(o={...o,[n]:S(i,i.getMetaInfo())})}}),t.arrayKeys!=null&&t.arrayKeys.length>0&&t.arrayKeys.split(",").forEach(n=>{let s=`get${m(l(n))}`;if(z(e,s)){let d=e[s]().map(a=>{let u=M(a);return u==="array"?[]:u==="object"&&O(a)?S(a,a.getMetaInfo()):a});o={...o,[n]:d}}}),o};var Y="Transmute",G=function(e,t,o="root",n,s,i,d){let a=d??H(),u=Object.keys(t),h=u.reduce((r,p)=>({...r,[p]:M(t[p])}),{}),C=u.filter(r=>M(t[r])!=="object"&&M(t[r])!=="array"),c=u.filter(r=>M(t[r])==="object"),y=u.filter(r=>M(t[r])==="array"),R=y.reduce((r,p)=>({...r,[p]:t[p].map(w=>M(w))}),{}),E=P(u.map(r=>`${I}${l(r)};`)),x=P(u.map(r=>`
                            initialize${m(l(r))}(v) {
                                this.${I}${l(r)} = v;
                                return this;
                            }
                        `)),v=P(u.map(r=>`
              get${m(l(r))}() {
                return this.${I}${l(r)};
              }
              set${m(l(r))}(v COMMA_PLACEHOLDER validator) {
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
                this.${I}${l(r)} = v;
                return this;
              }
            `)),D=P(u.map(r=>{let p=M(t[r]);return`
              get${m(l(r))}() {
                return this.${I}${l(r)};
              }
              set${m(l(r))}(v COMMA_PLACEHOLDER validator) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${p}') {
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
                    this.${I}${l(r)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${p} expected but got ' + typeOfValue + ' instead';
              }
            `})),V=P(y.map(r=>`
              get${m(l(r))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${I}${l(r)}.length) {
                        return this.${I}${l(r)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${m(l(r))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${I}${l(r)}) && i != null) {
                    if (i >= 0 && i < this.${I}${l(r)}.length) {
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
                        this.${I}${l(r)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `)),_=P(y.map(r=>`
              get${m(l(r))}At(i) {
                const value = this.${I}${l(r)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${m(l(r))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${I}${l(r)};
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
            `)),$=`
        return class ${m(l(e))} {
          ${E}
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

          ${x}

          ${a.validateInput?D:v}
          ${a.validateInput?_:V}
        }
      `,f=new Function("",$)();f.prototype!=null&&(f.prototype.toJson=function(){return typeof this.getMetaInfo=="function"?S(this,this.getMetaInfo()):{}},a.cloneable&&(f.prototype.clone=function(){return gt(this.toJson(),a)}),f.prototype.validate=function(r){if(r?.collectErrors){let p=st(this,a);return{valid:p.length===0,errors:p}}return rt(this,a)},f.prototype.validateAsync=async function(r){if(r?.collectErrors){let p=await at(this,a);return{valid:p.length===0,errors:p}}return it(this,a)},f.prototype.getMetaInfo=function(){let r={};return C.length>0&&(r={...r,primitiveKeys:C.toString()}),c.length>0&&(r={...r,objectKeys:c.toString()}),y.length>0&&(r={...r,arrayKeys:y.toString()}),r},f.prototype.utility={typeMap:h,elementTypeMap:R,getTypeOfObject:M,validateRule:(r,p,w,K,b,j,Q,ut)=>ot(a,r,p,w,K,b,j,Q,ut??!1),validateAsyncRule:(r,p,w,K,b,j)=>lt(a,r,p,w,K,b,j)});let g=new f(a),A=n||g,L=s||g;return g.setInternalReferences(A,L,i),C.forEach(r=>{let p=`initialize${m(l(r))}`;p in g&&typeof g[p]=="function"&&g[p](t[r])}),c.forEach(r=>{let p=`initialize${m(l(r))}`;if(p in g&&typeof g[p]=="function"){let w=G(m(l(r)),t[r],o.trim().length>0?`${o}_${r}`:r,A,g,void 0,a);g[p](w)}}),y.forEach(r=>{let p=`initialize${m(l(r))}`;if(p in g&&typeof g[p]=="function"){let w=t[r];if(Array.isArray(w)){w.some(b=>M(b)==="object")&&g[p]([]);let K=w.map((b,j)=>{if(M(b)==="object")return G(m(l(`${r}${j}`)),b,o.trim().length>0?`${o}_${r}`:r,A,g,j,a);if(M(b)==="array")throw"Multidimensional array not supported. Yet!";return b});g[p](K)}}}),g},gt=function(e,t){let o=G(m(l(`${Y}${B()}`)),e,"root",void 0,void 0,void 0,H(t));return o.setInternalReferences(o,o,void 0),t.validateOnCreate&&o.validate(),o};var mt=function(...e){return(t,o)=>{for(let n of e){let s=n(t,o);if(s!==!0)return s}return!0}},ht=function(...e){return(t,o)=>{let n=!1;for(let s of e){let i=s(t,o);if(i===!0)return!0;n=i}return n}};function qt(e,t,o){if(M(e)!=="object")throw"Expecting a JavaScript Object notation!";let n=H(t);X(n.plugins);let s=G(m(l(o??`${Y}${B()}`)),e,"root",void 0,void 0,void 0,n);return s.setInternalReferences(s,s,void 0),n.validateOnCreate&&s.validate(),s}function Jt(e){if(Array.isArray(e)&&e.length>0)return e.map(t=>{if(O(t))return S(t,t.getMetaInfo());throw"Meta info is missing in the object!"});if(M(e)==="object"){if(O(e))return S(e,e.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}export{mt as allOf,ht as anyOf,ft as memorySizeOf,qt as transmute,Jt as unTransmute};
//# sourceMappingURL=index.mjs.map
