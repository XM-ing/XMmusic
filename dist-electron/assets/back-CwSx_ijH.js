import{d as P,r as p,o as c,c as u,a as e,t as f,u as I,F as m,b as v,e as w,i as d,f as D,w as O,_ as B}from"./index-f0yOn2YS.js";const J={class:"back-con"},z={class:"ul-1"},R={class:"item","data-name":"opacity"},V={class:"slider"},$=["src"],h={key:0,class:"ul-3"},A={class:"item","data-name":"image"},E={class:"ul-2","data-name":"image-see"},U=["data-index"],j=["alt","data-index"],q={class:"item","data-name":"filter"},G={class:"slider"},H=["src"],K={key:0,class:"ul-3"},M=P({__name:"back",setup(Q){const r=p({action:{opacity:!1,filter:!1}});function k(i,...t){const s=t[0];s?r.value[s][i]=!r.value[s][i]:r.value[i]=!r.value[i]}const _=p(localStorage.getItem("opacity")||"0.5");function F(i){i.stopPropagation();const t=i.target;if(t){const s=t.innerText;localStorage.setItem("opacity",s),_.value=s}r.value.action.opacity=!1}const l=p([d.back.back1,d.back.back2,d.back.back3,d.back.back4]);localStorage.getItem("imageList")&&(l.value=JSON.parse(localStorage.getItem("imageList")));function T(i){i.stopPropagation();const t=i.target;if(t){const s=parseInt(t.dataset.index||"-1");if(s===-1)return;let a="",o=l.value[s];for(let n=0;n<=s;n++)a=l.value[n],l.value[n]=o,o=a;localStorage.setItem("back",l.value[0]),localStorage.setItem("imageList",JSON.stringify(l.value))}}const y=p();function C(i){i.stopPropagation(),y.value.click()}function L(i){i.stopPropagation();const t=i.target;if(t&&t.files){const s=t.files[0];if(!s)return;const a=new FileReader;a.readAsDataURL(s),a.onload=o=>{if(o.target){const n=o.target.result;let b="",S=n;for(let g=0;g<=3;g++)l.value[g]!==n&&(b=l.value[g],l.value[g]=S,S=b);localStorage.setItem("back",n),localStorage.setItem("imageList",JSON.stringify(l.value))}}}}const x=p("0.0");function N(i){i.stopPropagation();const t=i.target;if(t){const s=t.innerText;localStorage.setItem("filter",String(parseFloat(t.innerText)*20)),x.value=s}}return(i,t)=>{const s=D("lazy");return c(),u("div",J,[e("ul",z,[e("li",R,[t[7]||(t[7]=e("div",{class:"title"},"背景透明度",-1)),e("div",{class:"action",onClick:t[1]||(t[1]=a=>k("opacity","action"))},[e("span",null,f(_.value),1),e("div",V,[e("img",{src:I(d).dark.up_down},null,8,$)]),r.value.action.opacity?(c(),u("ul",h,[(c(),u(m,null,v(10,a=>e("li",{onClick:t[0]||(t[0]=o=>F(o))},f(((a-1)*.1).toFixed(1)),1)),64))])):w("",!0)])]),e("li",A,[t[9]||(t[9]=e("div",{class:"title"},"背景图片",-1)),e("div",{class:"action",onClick:t[3]||(t[3]=a=>C(a))},[t[8]||(t[8]=e("span",null,"预览",-1)),e("input",{type:"file",style:{display:"none"},onChange:t[2]||(t[2]=a=>L(a)),accept:"image/*",ref_key:"imageFileInput",ref:y},null,544)])]),e("ul",E,[(c(),u(m,null,v(4,a=>e("li",{onClick:t[4]||(t[4]=o=>T(o)),"data-index":a-1},[O(e("img",{alt:l.value[a-1],"data-index":a-1},null,8,j),[[s,l.value[a-1]]])],8,U)),64))]),e("li",q,[t[10]||(t[10]=e("div",{class:"title"},"背景模糊程度",-1)),e("div",{class:"action",onClick:t[6]||(t[6]=a=>k("filter","action"))},[e("span",null,f(x.value),1),e("div",G,[e("img",{src:I(d).dark.up_down},null,8,H)]),r.value.action.filter?(c(),u("ul",K,[(c(),u(m,null,v(6,a=>e("li",{onClick:t[5]||(t[5]=o=>N(o))},f(((a-1)*.1).toFixed(1)),1)),64))])):w("",!0)])])])])}}}),X=B(M,[["__scopeId","data-v-df8eaba4"]]);export{X as default};
