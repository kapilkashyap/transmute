"use strict";var lib;(lib||={}).api=(()=>{var q=Object.defineProperty;var yt=Object.getOwnPropertyDescriptor;var gt=Object.getOwnPropertyNames;var mt=Object.prototype.hasOwnProperty;var ht=(e,t)=>{for(var o in t)q(e,o,{get:t[o],enumerable:!0})},Ct=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of gt(t))!mt.call(e,i)&&i!==o&&q(e,i,{get:()=>t[i],enumerable:!(n=yt(t,i))||n.enumerable});return e};var At=e=>Ct(q({},"__esModule",{value:!0}),e);var wt={};ht(wt,{allOf:()=>dt,anyOf:()=>ft,memorySizeOf:()=>tt,transmute:()=>It,unTransmute:()=>xt});var I="#",Rt="",Et="_";var O=e=>typeof e=="object"&&e!=null&&"getMetaInfo"in e,z=(e,t)=>typeof e=="object"&&e!=null&&t in e,B=function(e=9,t=2){return Math.random().toFixed(e).substring(t)},M=function(e){let t=Object.prototype.toString.call(e);return t.substring(1,t.length-1).split(/\s/)[1].toLowerCase()},l=function(e){return isNaN(Number(e[0]))||(e="_"+e),e.toString().replace(/-/g,Et).replace(/\s|\./g,Rt)},m=function(e){return e[0].toUpperCase()+e.slice(1)},P=function(e,t=",",o=",",n=" COMMA_PLACEHOLDER"){return e.join(t).replaceAll(o,"").replaceAll(n,",")},H=function(e){return{validateInput:e?.validateInput??!1,validateOnCreate:e?.validateOnCreate??!1,cloneable:e?.cloneable??!0,rules:{...e?.rules??{}},asyncRules:{...e?.asyncRules??{}},plugins:[...e?.plugins??[]]}},tt=function(e){let t=function(n){return n<1024?n+" bytes":n<Math.pow(1024,2)?(n/1024).toFixed(6)+" KiB":n<Math.pow(1024,3)?(n/Math.pow(1024,2)).toFixed(6)+" MiB":(n/Math.pow(1024,3)).toFixed(6)+" GiB"},o=JSON.stringify(e);return t(encodeURI(o).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)};var U=function(e){let t=e.getMetaInfo();return[...t.primitiveKeys!=null&&t.primitiveKeys.length>0?t.primitiveKeys.split(","):[],...t.objectKeys!=null&&t.objectKeys.length>0?t.objectKeys.split(","):[],...t.arrayKeys!=null&&t.arrayKeys.length>0?t.arrayKeys.split(","):[]].filter(Boolean)},J=function(e){return U(e).forEach(o=>{let n=`get${m(l(o))}`;if(typeof e[n]!="function")return;let i=e,s=e[n](),d=i.utility.typeMap?.[o]??null,a=i.utility.getTypeOfObject(s);if(d!=null&&a!==d)throw new Error(`Type mismatch: argument of type ${d} expected but got ${a} instead`);if(i.utility.validateRule(i.getNameSpace(),o,s,void 0,i,i.getRoot()),Array.isArray(s)){let u=i.utility.elementTypeMap?.[o];s.forEach((h,C)=>{let c=u?.[C],y=i.utility.getTypeOfObject(h);if(c!=null&&y!==c)throw new Error(`Type mismatch at index ${C} [${o}]: argument of type ${c} expected but got ${y} instead`);h!=null&&typeof h=="object"&&O(h)&&h.validate()});return}s!=null&&typeof s=="object"&&O(s)&&s.validate()}),e},et=async function(e){J(e);let t=U(e);for(let o of t){let n=`get${m(l(o))}`;if(typeof e[n]!="function")continue;let i=e,s=e[n]();if(await i.utility.validateAsyncRule(i.getNameSpace(),o,s,i,i.getRoot()),Array.isArray(s)){for(let d of s)d!=null&&typeof d=="object"&&O(d)&&typeof d.validateAsync=="function"&&await d.validateAsync();continue}s!=null&&typeof s=="object"&&O(s)&&typeof s.validateAsync=="function"&&await s.validateAsync()}return e},nt=function(e){let t=[];return U(e).forEach(n=>{let i=`get${m(l(n))}`;if(typeof e[i]!="function")return;let s=e,d=s.getNameSpace(),a=d==="root"||d==null?n:`${d}.${n}`,u=e[i](),h=s.utility.typeMap?.[n]??null,C=s.utility.getTypeOfObject(u);h!=null&&C!==h&&t.push({path:a,key:n,message:`Type mismatch: argument of type ${h} expected but got ${C} instead`});try{s.utility.validateRule(d,n,u,void 0,s,s.getRoot())}catch(c){t.push({path:a,key:n,message:c instanceof Error?c.message:String(c)})}if(Array.isArray(u)){let c=s.utility.elementTypeMap?.[n];u.forEach((y,R)=>{let E=c?.[R],x=s.utility.getTypeOfObject(y);E!=null&&x!==E&&t.push({path:a,key:n,index:R,message:`Type mismatch at index ${R} [${n}]: argument of type ${E} expected but got ${x} instead`}),y!=null&&typeof y=="object"&&O(y)&&typeof y.validate=="function"&&t.push(...y.validate({collectErrors:!0}).errors)});return}u!=null&&typeof u=="object"&&O(u)&&typeof u.validate=="function"&&t.push(...u.validate({collectErrors:!0}).errors)}),t},ot=async function(e){let t=[],o=U(e);for(let n of o){let i=`get${m(l(n))}`;if(typeof e[i]!="function")continue;let s=e,d=s.getNameSpace(),a=d==="root"||d==null?n:`${d}.${n}`,u=e[i](),h=s.utility.typeMap?.[n]??null,C=s.utility.getTypeOfObject(u);h!=null&&C!==h&&t.push({path:a,key:n,message:`Type mismatch: argument of type ${h} expected but got ${C} instead`});try{s.utility.validateRule(d,n,u,void 0,s,s.getRoot())}catch(c){t.push({path:a,key:n,message:c instanceof Error?c.message:String(c)})}try{await s.utility.validateAsyncRule(d,n,u,s,s.getRoot())}catch(c){t.push({path:a,key:n,message:c instanceof Error?c.message:String(c)})}if(Array.isArray(u)){let c=s.utility.elementTypeMap?.[n];for(let[y,R]of u.entries()){let E=c?.[y],x=s.utility.getTypeOfObject(R);if(E!=null&&x!==E&&t.push({path:a,key:n,index:y,message:`Type mismatch at index ${y} [${n}]: argument of type ${E} expected but got ${x} instead`}),R!=null&&typeof R=="object"&&O(R)&&typeof R.validateAsync=="function"){let v=await R.validateAsync({collectErrors:!0});t.push(...v.errors)}}continue}if(u!=null&&typeof u=="object"&&O(u)&&typeof u.validateAsync=="function"){let c=await u.validateAsync({collectErrors:!0});t.push(...c.errors)}}return t};var Mt=function(e,t){let o=e.split("."),n=t.split(".");return o.length!==n.length?!1:o.every((i,s)=>i==="*"||i===n[s])},$t=function(e,t){return Object.keys(e).find(o=>o.includes("*")&&Mt(o,t))},F=function(e,t,o,n=""){let i=t!=null&&t.trim().length>0?`${t}.${o}`:void 0,s=i!=null?`${i}${n}`:`${o}${n}`,d=i!=null?$t(e,`${i}${n}`):void 0;return i!=null&&e[`${i}${n}`]!=null?{rule:e[`${i}${n}`],usedKey:`${i}${n}`}:d!=null?{rule:e[d],usedKey:`${i}${n}`}:e[`${o}${n}`]!=null?{rule:e[`${o}${n}`],usedKey:`${o}${n}`}:{rule:void 0,usedKey:s}},k=e=>typeof e=="object"&&e!=null,W=e=>typeof e=="object"&&e!=null;var rt=function(e,t,o,n,i,s,d,a,u=!1){if(e.rules!=null){let h=t!=null&&t.trim().length>0?`${t}.${o}`:void 0,C=F(e.rules,t,o),c=F(e.rules,t,o,"[]"),y=C.usedKey,R=C.rule,E=c.rule,x=t==="root"?o:h??o,v=k(R)?R:void 0;i=i??(typeof R=="function"?R:v?.validator);let D=k(E)?E:void 0,V=typeof E=="function"?E:D?.validator,_=(f,g)=>{throw g!=null?new Error(`Validation error at index ${g} [${y}]: ${f}`):new Error(`Validation error [${y}]: ${f}`)};if(v?.required===!0&&n==null&&_("Value is required",a),v?.immutable===!0&&u){let f=`get${m(l(o))}`,g=s!=null&&typeof s=="object"&&f in s?s[f]:void 0,A=typeof g=="function"?g.call(s):void 0,L=a!=null&&Array.isArray(A)?A[a]:A;Object.is(L,n)||_("Property is immutable",a)}let $=(f,g)=>{if(i!=null){let A=g??a??s?.getIndex?.(),r=i(f,{key:o,path:x,value:f,parentObject:s,rootObject:d,index:A,getParent:()=>s,getRoot:()=>d});if(r!==!0){if(typeof r=="string"){let p=g??a??s?.getIndex?.();throw p!=null?new Error(`Validation error at index ${p} [${y}]: ${r}`):new Error(`Validation error [${y}]: ${r}`)}throw new Error(`Validation failed for property ${y} with value ${f}`)}}},T=f=>{if(D?.required===!0&&f==null)throw new Error(`Validation error [${c.usedKey}]: Value is required`);if(V==null||f==null)return;let A=V(f,{key:o,path:x,value:f,parentObject:s,rootObject:d,getParent:()=>s,getRoot:()=>d});if(A!==!0)throw typeof A=="string"?new Error(`Validation error [${c.usedKey}]: ${A}`):new Error(`Validation failed for property ${c.usedKey} with value ${f}`)};if(E!=null){let f=n;if(a!=null&&s!=null&&typeof s=="object"){let g=`get${m(l(o))}`,A=s[g],L=typeof A=="function"?A.call(s):void 0;Array.isArray(L)&&(f=L.map((r,p)=>p===a?n:r))}T(f)}if(i!=null&&typeof i=="function"&&n!=null){if(Array.isArray(n)){n.forEach((f,g)=>$(f,g));return}$(n)}}};var X="transmute.validation",N=function(e){return{name:X,onSet:t=>{rt(e,t.nameSpace,t.key,t.value,t.validatorOverride,t.parentObject,t.rootObject,t.index,t.isUpdate)},onValidate:t=>{J(t)},onValidateAsync:async t=>{await et(t)},onCollectErrors:t=>nt(t),onCollectErrorsAsync:t=>ot(t)}};var Y=function(e){let t=new Set;e.forEach(o=>{if(o.name===X||t.has(o.name))throw new Error(`Duplicate or reserved plugin name detected: ${o.name}`);t.add(o.name)})},it=function(e,t,o,n,i,s,d,a,u){let h=t!=null&&t.trim().length>0?`${t}.${o}`:void 0,c={key:o,path:t==="root"?o:h??o,value:n,parentObject:s,rootObject:d,index:a,nameSpace:t,isUpdate:u,validatorOverride:i,getParent:()=>s,getRoot:()=>d};N(e).onSet?.(c,void 0),e.plugins.forEach(y=>{y.onSet?.(c,y.getConfig?.())})},st=function(e,t){return N(t).onValidate?.(e,void 0),t.plugins.forEach(o=>o.onValidate?.(e,o.getConfig?.())),e},at=async function(e,t){await N(t).onValidateAsync?.(e,void 0);for(let o of t.plugins)await o.onValidateAsync?.(e,o.getConfig?.());return e},lt=function(e,t){let o=N(t).onCollectErrors?.(e,void 0)??[];return t.plugins.forEach(n=>{n.onCollectErrors&&o.push(...n.onCollectErrors(e,n.getConfig?.()))}),o},ut=async function(e,t){let o=await N(t).onCollectErrorsAsync?.(e,void 0)??[];for(let n of t.plugins)n.onCollectErrorsAsync&&o.push(...await n.onCollectErrorsAsync(e,n.getConfig?.()));return o};var ct=async function(e,t,o,n,i,s,d){if(e.asyncRules==null)return;let a=t!=null&&t.trim().length>0?`${t}.${o}`:void 0,u=F(e.asyncRules,t,o),h=F(e.asyncRules,t,o,"[]"),C=u.usedKey,c=u.rule,y=h.rule,R=t==="root"?o:a??o,E=W(c)?c:void 0,x=typeof c=="function"?c:E?.validator,v=W(y)?y:void 0,D=typeof y=="function"?y:v?.validator;if(E?.required===!0&&n==null)throw new Error(`Validation error [${C}]: Value is required`);let V=async($,T)=>{let f=T??d??i?.getIndex?.(),A=await x($,{key:o,path:R,value:$,parentObject:i,rootObject:s,index:f,getParent:()=>i,getRoot:()=>s});if(A!==!0)throw typeof A=="string"?f!=null?new Error(`Validation error at index ${f} [${C}]: ${A}`):new Error(`Validation error [${C}]: ${A}`):new Error(`Validation failed for property ${C} with value ${$}`)},_=async $=>{if(v?.required===!0&&$==null)throw new Error(`Validation error [${h.usedKey}]: Value is required`);if(D==null||$==null)return;let f=await D($,{key:o,path:R,value:$,parentObject:i,rootObject:s,getParent:()=>i,getRoot:()=>s});if(f!==!0)throw typeof f=="string"?new Error(`Validation error [${h.usedKey}]: ${f}`):new Error(`Validation failed for property ${h.usedKey} with value ${$}`)};if(y!=null&&await _(n),x!=null){if(Array.isArray(n)){for(let[$,T]of n.entries())await V(T,$);return}await V(n)}};var S=function(e,t){let o={};return t.primitiveKeys!=null&&t.primitiveKeys.length>0&&t.primitiveKeys.split(",").forEach(n=>{let i=`get${m(l(n))}`;z(e,i)&&(o={...o,[n]:e[i]()})}),t.objectKeys!=null&&t.objectKeys.length>0&&t.objectKeys.split(",").forEach(n=>{let i=`get${m(l(n))}`;if(z(e,i)){let s=e[i]();O(s)&&(o={...o,[n]:S(s,s.getMetaInfo())})}}),t.arrayKeys!=null&&t.arrayKeys.length>0&&t.arrayKeys.split(",").forEach(n=>{let i=`get${m(l(n))}`;if(z(e,i)){let d=e[i]().map(a=>{let u=M(a);return u==="array"?[]:u==="object"&&O(a)?S(a,a.getMetaInfo()):a});o={...o,[n]:d}}}),o};var Q="Transmute",G=function(e,t,o="root",n,i,s,d){let a=d??H(),u=Object.keys(t),h=u.reduce((r,p)=>({...r,[p]:M(t[p])}),{}),C=u.filter(r=>M(t[r])!=="object"&&M(t[r])!=="array"),c=u.filter(r=>M(t[r])==="object"),y=u.filter(r=>M(t[r])==="array"),R=y.reduce((r,p)=>({...r,[p]:t[p].map(w=>M(w))}),{}),E=P(u.map(r=>`${I}${l(r)};`)),x=P(u.map(r=>`
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
      `,f=new Function("",$)();f.prototype!=null&&(f.prototype.toJson=function(){return typeof this.getMetaInfo=="function"?S(this,this.getMetaInfo()):{}},a.cloneable&&(f.prototype.clone=function(){return Ot(this.toJson(),a)}),f.prototype.validate=function(r){if(r?.collectErrors){let p=lt(this,a);return{valid:p.length===0,errors:p}}return st(this,a)},f.prototype.validateAsync=async function(r){if(r?.collectErrors){let p=await ut(this,a);return{valid:p.length===0,errors:p}}return at(this,a)},f.prototype.getMetaInfo=function(){let r={};return C.length>0&&(r={...r,primitiveKeys:C.toString()}),c.length>0&&(r={...r,objectKeys:c.toString()}),y.length>0&&(r={...r,arrayKeys:y.toString()}),r},f.prototype.utility={typeMap:h,elementTypeMap:R,getTypeOfObject:M,validateRule:(r,p,w,K,b,j,Z,pt)=>it(a,r,p,w,K,b,j,Z,pt??!1),validateAsyncRule:(r,p,w,K,b,j)=>ct(a,r,p,w,K,b,j)});let g=new f(a),A=n||g,L=i||g;return g.setInternalReferences(A,L,s),C.forEach(r=>{let p=`initialize${m(l(r))}`;p in g&&typeof g[p]=="function"&&g[p](t[r])}),c.forEach(r=>{let p=`initialize${m(l(r))}`;if(p in g&&typeof g[p]=="function"){let w=G(m(l(r)),t[r],o.trim().length>0?`${o}_${r}`:r,A,g,void 0,a);g[p](w)}}),y.forEach(r=>{let p=`initialize${m(l(r))}`;if(p in g&&typeof g[p]=="function"){let w=t[r];if(Array.isArray(w)){w.some(b=>M(b)==="object")&&g[p]([]);let K=w.map((b,j)=>{if(M(b)==="object")return G(m(l(`${r}${j}`)),b,o.trim().length>0?`${o}_${r}`:r,A,g,j,a);if(M(b)==="array")throw"Multidimensional array not supported. Yet!";return b});g[p](K)}}}),g},Ot=function(e,t){let o=G(m(l(`${Q}${B()}`)),e,"root",void 0,void 0,void 0,H(t));return o.setInternalReferences(o,o,void 0),t.validateOnCreate&&o.validate(),o};var dt=function(...e){return(t,o)=>{for(let n of e){let i=n(t,o);if(i!==!0)return i}return!0}},ft=function(...e){return(t,o)=>{let n=!1;for(let i of e){let s=i(t,o);if(s===!0)return!0;n=s}return n}};function It(e,t,o){if(M(e)!=="object")throw"Expecting a JavaScript Object notation!";let n=H(t);Y(n.plugins);let i=G(m(l(o??`${Q}${B()}`)),e,"root",void 0,void 0,void 0,n);return i.setInternalReferences(i,i,void 0),n.validateOnCreate&&i.validate(),i}function xt(e){if(Array.isArray(e)&&e.length>0)return e.map(t=>{if(O(t))return S(t,t.getMetaInfo());throw"Meta info is missing in the object!"});if(M(e)==="object"){if(O(e))return S(e,e.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}return At(wt);})();
//# sourceMappingURL=index.global.js.map
