"use strict";var lib;(lib||={}).api=(()=>{var V=Object.defineProperty;var J=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var W=Object.prototype.hasOwnProperty;var X=(t,e)=>{for(var s in e)V(t,s,{get:e[s],enumerable:!0})},Y=(t,e,s,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of U(e))!W.call(t,i)&&i!==s&&V(t,i,{get:()=>e[i],enumerable:!(o=J(e,i))||o.enumerable});return t};var q=t=>Y(V({},"__esModule",{value:!0}),t);var ut={};X(ut,{memorySizeOf:()=>lt,transmute:()=>k,unTransmute:()=>ct});var E="#",Q="Transmute",Z="",tt="_";var M=t=>typeof t=="object"&&t!=null&&"getMetaInfo"in t,S=(t,e)=>typeof t=="object"&&t!=null&&e in t,et=function(t=9,e=2){return Math.random().toFixed(t).substring(e)},C=function(t){let e=Object.prototype.toString.call(t);return e.substring(1,e.length-1).split(/\s/)[1].toLowerCase()},nt=function(t,e){let s=t.split("."),o=e.split(".");return s.length!==o.length?!1:s.every((i,u)=>i==="*"||i===o[u])},F=function(t,e){return Object.keys(t).find(s=>s.includes("*")&&nt(s,e))},st=function(t,e,s,o,i,u,a,r){if(t.rules!=null){let l=e!=null&&e.trim().length>0?`${e}.${s}`:void 0,c=s,h=e==="root"?s:l??s,R=l!=null?F(t.rules,l):void 0;l!=null&&t.rules[l]!=null?(i=i??t.rules[l],c=l):l!=null&&R!=null?(i=i??t.rules[R],c=l):t.rules[s]!=null&&(i=i??t.rules[s],c=s);let p=(f,m)=>{if(i!=null){let A=m??r??u?.getIndex?.(),I=i(f,{key:s,path:h,value:f,parentObject:u,rootObject:a,index:A,getParent:()=>u,getRoot:()=>a});if(I!==!0){if(typeof I=="string"){let K=m??r??u?.getIndex?.();throw K!=null?new Error(`Validation error at index ${K} [${c}]: ${I}`):new Error(`Validation error [${c}]: ${I}`)}throw new Error(`Validation failed for property ${c} with value ${f}`)}}};if(i!=null&&C(i)==="function"&&o!=null){if(Array.isArray(o)){o.forEach((f,m)=>p(f,m));return}p(o)}}},it=async function(t,e,s,o,i,u,a){if(t.asyncRules==null)return;let r=e!=null&&e.trim().length>0?`${e}.${s}`:void 0,l=s,c,h=e==="root"?s:r??s,R=r!=null?F(t.asyncRules,r):void 0;if(r!=null&&t.asyncRules[r]!=null?(c=t.asyncRules[r],l=r):r!=null&&R!=null?(c=t.asyncRules[R],l=r):t.asyncRules[s]!=null&&(c=t.asyncRules[s],l=s),c==null)return;let p=async(f,m)=>{let A=m??a??i?.getIndex?.(),I=await c(f,{key:s,path:h,value:f,parentObject:i,rootObject:u,index:A,getParent:()=>i,getRoot:()=>u});if(I!==!0)throw typeof I=="string"?A!=null?new Error(`Validation error at index ${A} [${l}]: ${I}`):new Error(`Validation error [${l}]: ${I}`):new Error(`Validation failed for property ${l} with value ${f}`)};if(Array.isArray(o)){for(let[f,m]of o.entries())await p(m,f);return}await p(o)},y=function(t){return isNaN(Number(t[0]))||(t="_"+t),t.toString().replace(/-/g,tt).replace(/\s|\./g,Z)},g=function(t){return t[0].toUpperCase()+t.slice(1)},T=function(t,e=",",s=",",o=" COMMA_PLACEHOLDER"){return t.join(e).replaceAll(s,"").replaceAll(o,",")},N=function(t){return{validateInput:t?.validateInput??!1,validateOnCreate:t?.validateOnCreate??!1,cloneable:t?.cloneable??!0,rules:{...t?.rules??{}},asyncRules:{...t?.asyncRules??{}}}},H=function(t){let e=t.getMetaInfo();return[...e.primitiveKeys!=null&&e.primitiveKeys.length>0?e.primitiveKeys.split(","):[],...e.objectKeys!=null&&e.objectKeys.length>0?e.objectKeys.split(","):[],...e.arrayKeys!=null&&e.arrayKeys.length>0?e.arrayKeys.split(","):[]].filter(Boolean).forEach(o=>{let i=`get${g(y(o))}`;if(typeof t[i]!="function")return;let u=t,a=t[i](),r=u.utility.typeMap?.[o]??null,l=u.utility.getTypeOfObject(a);if(r!=null&&l!==r)throw new Error(`Type mismatch: argument of type ${r} expected but got ${l} instead`);if(u.utility.validateRule(u.getNameSpace(),o,a,void 0,u,u.getRoot()),Array.isArray(a)){let c=u.utility.elementTypeMap?.[o];a.forEach((h,R)=>{let p=c?.[R],f=u.utility.getTypeOfObject(h);if(p!=null&&f!==p)throw new Error(`Type mismatch at index ${R} [${o}]: argument of type ${p} expected but got ${f} instead`);h!=null&&typeof h=="object"&&M(h)&&h.validate()});return}a!=null&&typeof a=="object"&&M(a)&&a.validate()}),t},ot=async function(t){H(t);let e=t.getMetaInfo(),s=[...e.primitiveKeys!=null&&e.primitiveKeys.length>0?e.primitiveKeys.split(","):[],...e.objectKeys!=null&&e.objectKeys.length>0?e.objectKeys.split(","):[],...e.arrayKeys!=null&&e.arrayKeys.length>0?e.arrayKeys.split(","):[]].filter(Boolean);for(let o of s){let i=`get${g(y(o))}`;if(typeof t[i]!="function")continue;let u=t,a=t[i]();if(await u.utility.validateAsyncRule(u.getNameSpace(),o,a,u,u.getRoot()),Array.isArray(a)){for(let r of a)r!=null&&typeof r=="object"&&M(r)&&typeof r.validateAsync=="function"&&await r.validateAsync();continue}a!=null&&typeof a=="object"&&M(a)&&typeof a.validateAsync=="function"&&await a.validateAsync()}return t},rt=function(t){let e=[],s=t.getMetaInfo();return[...s.primitiveKeys!=null&&s.primitiveKeys.length>0?s.primitiveKeys.split(","):[],...s.objectKeys!=null&&s.objectKeys.length>0?s.objectKeys.split(","):[],...s.arrayKeys!=null&&s.arrayKeys.length>0?s.arrayKeys.split(","):[]].filter(Boolean).forEach(i=>{let u=`get${g(y(i))}`;if(typeof t[u]!="function")return;let a=t,r=a.getNameSpace(),l=r==="root"||r==null?i:`${r}.${i}`,c=t[u](),h=a.utility.typeMap?.[i]??null,R=a.utility.getTypeOfObject(c);h!=null&&R!==h&&e.push({path:l,key:i,message:`Type mismatch: argument of type ${h} expected but got ${R} instead`});try{a.utility.validateRule(r,i,c,void 0,a,a.getRoot())}catch(p){e.push({path:l,key:i,message:p instanceof Error?p.message:String(p)})}if(Array.isArray(c)){let p=a.utility.elementTypeMap?.[i];c.forEach((f,m)=>{let A=p?.[m],x=a.utility.getTypeOfObject(f);A!=null&&x!==A&&e.push({path:l,key:i,index:m,message:`Type mismatch at index ${m} [${i}]: argument of type ${A} expected but got ${x} instead`}),f!=null&&typeof f=="object"&&M(f)&&typeof f.validate=="function"&&e.push(...f.validate({collectErrors:!0}).errors)});return}c!=null&&typeof c=="object"&&M(c)&&typeof c.validate=="function"&&e.push(...c.validate({collectErrors:!0}).errors)}),e},at=async function(t){let e=[],s=t.getMetaInfo(),o=[...s.primitiveKeys!=null&&s.primitiveKeys.length>0?s.primitiveKeys.split(","):[],...s.objectKeys!=null&&s.objectKeys.length>0?s.objectKeys.split(","):[],...s.arrayKeys!=null&&s.arrayKeys.length>0?s.arrayKeys.split(","):[]].filter(Boolean);for(let i of o){let u=`get${g(y(i))}`;if(typeof t[u]!="function")continue;let a=t,r=a.getNameSpace(),l=r==="root"||r==null?i:`${r}.${i}`,c=t[u](),h=a.utility.typeMap?.[i]??null,R=a.utility.getTypeOfObject(c);h!=null&&R!==h&&e.push({path:l,key:i,message:`Type mismatch: argument of type ${h} expected but got ${R} instead`});try{a.utility.validateRule(r,i,c,void 0,a,a.getRoot())}catch(p){e.push({path:l,key:i,message:p instanceof Error?p.message:String(p)})}try{await a.utility.validateAsyncRule(r,i,c,a,a.getRoot())}catch(p){e.push({path:l,key:i,message:p instanceof Error?p.message:String(p)})}if(Array.isArray(c)){let p=a.utility.elementTypeMap?.[i];for(let[f,m]of c.entries()){let A=p?.[f],x=a.utility.getTypeOfObject(m);if(A!=null&&x!==A&&e.push({path:l,key:i,index:f,message:`Type mismatch at index ${f} [${i}]: argument of type ${A} expected but got ${x} instead`}),m!=null&&typeof m=="object"&&M(m)&&typeof m.validateAsync=="function"){let I=await m.validateAsync({collectErrors:!0});e.push(...I.errors)}}continue}if(c!=null&&typeof c=="object"&&M(c)&&typeof c.validateAsync=="function"){let p=await c.validateAsync({collectErrors:!0});e.push(...p.errors)}}return e},lt=function(t){let e=function(o){return o<1024?o+" bytes":o<Math.pow(1024,2)?(o/1024).toFixed(6)+" KiB":o<Math.pow(1024,3)?(o/Math.pow(1024,2)).toFixed(6)+" MiB":(o/Math.pow(1024,3)).toFixed(6)+" GiB"},s=JSON.stringify(t);return e(encodeURI(s).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length-1)},P=function(t,e,s="root",o,i,u,a){let r=a??N(),l=Object.keys(e),c=l.reduce((n,d)=>({...n,[d]:C(e[d])}),{}),h=l.filter(n=>C(e[n])!=="object"&&C(e[n])!=="array"),R=l.filter(n=>C(e[n])==="object"),p=l.filter(n=>C(e[n])==="array"),f=p.reduce((n,d)=>({...n,[d]:e[d].map(b=>C(b))}),{}),m=T(l.map(n=>`${E}${y(n)};`)),A=T(l.map(n=>`
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
            `)),G=T(p.map(n=>`
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
            `)),B=`
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

          ${r.validateInput?I:x}
          ${r.validateInput?G:K}
        }
      `,$=new Function("",B)();$.prototype!=null&&($.prototype.toJson=function(){return M(this)?j(this,this.getMetaInfo()):{}},r.cloneable&&($.prototype.clone=function(){return k(this.toJson(),r)}),$.prototype.validate=function(n){if(n?.collectErrors){let d=rt(this);return{valid:d.length===0,errors:d}}return H(this)},$.prototype.validateAsync=async function(n){if(n?.collectErrors){let d=await at(this);return{valid:d.length===0,errors:d}}return ot(this)},$.prototype.getMetaInfo=function(){let n={};return h.length>0&&(n={...n,primitiveKeys:h.toString()}),R.length>0&&(n={...n,objectKeys:R.toString()}),p.length>0&&(n={...n,arrayKeys:p.toString()}),n},$.prototype.utility={typeMap:c,elementTypeMap:f,getTypeOfObject:C,validateRule:(n,d,b,D,v,w,_)=>st(r,n,d,b,D,v,w,_),validateAsyncRule:(n,d,b,D,v,w)=>it(r,n,d,b,D,v,w)});let O=new $(r),L=o||O,z=i||O;return O.setInternalReferences(L,z,u),h.forEach(n=>{let d=`initialize${g(y(n))}`;d in O&&typeof O[d]=="function"&&O[d](e[n])}),R.forEach(n=>{let d=`initialize${g(y(n))}`;if(d in O&&typeof O[d]=="function"){let b=P(g(y(n)),e[n],s.trim().length>0?`${s}_${n}`:n,L,O,void 0,r);O[d](b)}}),p.forEach(n=>{let d=`initialize${g(y(n))}`;if(d in O&&typeof O[d]=="function"){let b=e[n];if(Array.isArray(b)){b.some(v=>C(v)==="object")&&O[d]([]);let D=b.map((v,w)=>{if(C(v)==="object")return P(g(y(`${n}${w}`)),v,s.trim().length>0?`${s}_${n}`:n,L,O,w,r);if(C(v)==="array")throw"Multidimensional array not supported. Yet!";return v});O[d](D)}}}),O};function k(t,e,s){if(C(t)!=="object")throw"Expecting a JavaScript Object notation!";let o=N(e),i=P(g(y(s??`${Q}${et()}`)),t,"root",void 0,void 0,void 0,o);return i.setInternalReferences(i,i,void 0),o.validateOnCreate&&i.validate(),i}var j=function(t,e){let s={};return e.primitiveKeys!=null&&e.primitiveKeys.length>0&&e.primitiveKeys.split(",").forEach(o=>{let i=`get${g(y(o))}`;S(t,i)&&(s={...s,[o]:t[i]()})}),e.objectKeys!=null&&e.objectKeys.length>0&&e.objectKeys.split(",").forEach(o=>{let i=`get${g(y(o))}`;if(S(t,i)){let u=t[i]();M(u)&&(s={...s,[o]:j(u,u.getMetaInfo())})}}),e.arrayKeys!=null&&e.arrayKeys.length>0&&e.arrayKeys.split(",").forEach(o=>{let i=`get${g(y(o))}`;if(S(t,i)){let a=t[i]().map(r=>{let l=C(r);return l==="array"?[]:l==="object"&&M(r)?j(r,r.getMetaInfo()):r});s={...s,[o]:a}}}),s};function ct(t){if(Array.isArray(t)&&t.length>0)return t.map(e=>{if(M(e))return j(e,e.getMetaInfo());throw"Meta info is missing in the object!"});if(C(t)==="object"){if(M(t))return j(t,t.getMetaInfo());throw"Meta info is missing in the object!"}throw"Transmuted object or an array of transmuted object(s) expected!"}return q(ut);})();
//# sourceMappingURL=index.global.js.map
