import{g as J,aq as N,ax as H,a as S,b2 as O,b3 as d,b4 as $}from"./index-8b8f1f38.js";function h(e){return JSON.parse(JSON.stringify(e))}function D(e=N(!1)){const o=d(),a=d(),r=d();let l=$;const c=t=>(r.trigger(t),e.value=!0,new Promise(g=>{l=g})),u=t=>{e.value=!1,o.trigger(t),l({data:t,isCanceled:!1})},s=t=>{e.value=!1,a.trigger(t),l({data:t,isCanceled:!0})};return{isRevealed:S(()=>e.value),reveal:c,confirm:u,cancel:s,onReveal:r.on,onConfirm:o.on,onCancel:a.on}}function F(e,o,a,r={}){var l,c,u;const{clone:s=!1,passive:t=!1,eventName:g,deep:b=!1,defaultValue:E,shouldEmit:p}=r,i=J(),C=a||(i==null?void 0:i.emit)||((l=i==null?void 0:i.$emit)==null?void 0:l.bind(i))||((u=(c=i==null?void 0:i.proxy)==null?void 0:c.$emit)==null?void 0:u.bind(i==null?void 0:i.proxy));let f=g;o||(o="modelValue"),f=f||`update:${o.toString()}`;const x=n=>s?typeof s=="function"?s(n):h(n):n,V=()=>O(e[o])?x(e[o]):E,_=n=>{p?p(n)&&C(f,n):C(f,n)};if(t){const n=V(),v=N(n);return H(()=>e[o],m=>v.value=x(m)),H(v,m=>{(m!==e[o]||b)&&_(m)},{deep:b}),v}else return S({get(){return V()},set(n){_(n)}})}export{D as a,F as u};
