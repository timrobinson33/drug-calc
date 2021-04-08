(this["webpackJsonpdrug-calc"]=this["webpackJsonpdrug-calc"]||[]).push([[0],{11:function(e,t,n){},15:function(e,t,n){"use strict";n.r(t);var u=n(1),a=n.n(u),o=n(5),c=n.n(o),s=n(2),r=(n(10),n(11),n(4)),l=n.n(r),m=n(0),i=[{drugName:"",units:"mg"},{drugName:"Morphine 1st Line",units:"mg",strengths:[{amount:0},{amount:10,volume:1},{amount:15,volume:1},{amount:20,volume:1},{amount:30,volume:1},{amount:10,volume:2},{amount:15,volume:2},{amount:20,volume:2},{amount:30,volume:2}]},{drugName:"Diamorphine",units:"mg",strengths:[{amount:0},{amount:10,volume:1},{amount:15,volume:1},{amount:30,volume:1},{amount:100,volume:1},{amount:10,volume:2},{amount:15,volume:2},{amount:30,volume:2},{amount:100,volume:2}]},{drugName:"Oxycodone",units:"mg",strengths:[{amount:0},{amount:10,volume:1},{amount:20,volume:2},{amount:50,volume:1}]},{drugName:"Fentanyl",units:"mcg",strengths:[{amount:0},{amount:50,volume:1},{amount:100,volume:2},{amount:500,volume:5}]},{drugName:"Haloperidol",units:"mg",strengths:[{amount:0},{amount:5,volume:1}]},{drugName:"Metoclopramide",units:"mg",strengths:[{amount:0},{amount:10,volume:2}]},{drugName:"Cyclizine",units:"mg",strengths:[{amount:0},{amount:50,volume:1}]},{drugName:"Levomepromazine",units:"mg",strengths:[{amount:0},{amount:25,volume:1}]},{drugName:"Midazolam",units:"mg",strengths:[{amount:0},{amount:10,volume:2}]},{drugName:"Hyoscine Butylbromide",units:"mg",strengths:[{amount:0},{amount:20,volume:1}]},{drugName:"Hyoscine Hydrobromide",units:"mcg",strengths:[{amount:0},{amount:400,volume:1}]}];function d(e){return parseFloat(e.toFixed(2))}function j(e){var t=e.drugIdx,n=e.strengthIdx,u=e.prescribedDose,a=e.numStatDoses,o=e.statDoseStrength,c=i[t].units,s=i[t].strengths[n],r=u+a*o,j=r/s.amount*s.volume,b=l.a.ceil(j/s.volume),h=b*s.amount-r,g=b*s.volume-j;return Object(m.jsxs)("div",{class:"box",children:[Object(m.jsx)("label",{children:"Results:"}),Object(m.jsx)("p",{children:Object(m.jsxs)("span",{children:["Total dose (",c,"): ",u," + (",a," x ",o,") = ",r,c]})}),Object(m.jsx)("p",{children:Object(m.jsxs)("span",{children:["Total dose (ml): ",r," ","\xf7"," ",s.amount," x ",s.volume," = ",d(j),"ml"]})}),Object(m.jsx)("p",{children:Object(m.jsxs)("span",{children:["Number of vials: ",b]})}),Object(m.jsx)("p",{children:Object(m.jsxs)("span",{children:["Waste: ",d(h),c," (= ",d(g),"ml)"]})})]})}function b(){var e=Object(u.useState)(0),t=Object(s.a)(e,2),n=t[0],a=t[1],o=Object(u.useState)(0),c=Object(s.a)(o,2),r=c[0],d=c[1],b=Object(u.useState)(""),h=Object(s.a)(b,2),g=h[0],O=h[1],v=Object(u.useState)(0),x=Object(s.a)(v,2),p=x[0],f=x[1],N=Object(u.useState)(""),y=Object(s.a)(N,2),S=y[0],C=y[1],D=Object(u.useState)(!1),k=Object(s.a)(D,2),I=k[0],T=k[1],F=Number(g),H=Number(S),M=i[n].units,z=!I&&!!(F||H&&p);function R(e){"mg"!==i[e].units&&alert("NOTE: ".concat(i[e].drugName," is measured in micrograms (mcg or \u03bcg), not milligrams (mg).\nThere are 1000mcg in 1mg")),a(e),w(0)}function w(e){d(e),O(""),B(0),T(!1)}function B(e){f(e),e||C("")}return Object(m.jsxs)("form",{children:[Object(m.jsxs)("div",{children:[Object(m.jsx)("label",{children:"Drug: "}),Object(m.jsx)("select",{value:n,disabled:I,onChange:function(e){return R(Number(e.target.value))},children:i.map((function(e,t){return Object(m.jsx)("option",{value:t,children:e.drugName},t)}))})]}),!!n&&Object(m.jsxs)("div",{children:[Object(m.jsx)("label",{children:"Strength: "}),Object(m.jsx)("select",{value:r,disabled:I,onChange:function(e){return w(parseInt(e.target.value))},children:i[n].strengths.map((function(e,t){return Object(m.jsx)("option",{value:t,children:e.amount?"".concat(e.amount).concat(M,"/").concat(e.volume,"ml"):""},t)}))})]}),!!r&&Object(m.jsxs)(m.Fragment,{children:[Object(m.jsxs)("div",{children:[Object(m.jsx)("label",{children:"Prescribed dose: "}),Object(m.jsx)("input",{type:"number",disabled:I,min:0,value:g,onChange:function(e){return O(e.target.value)}}),Object(m.jsxs)("span",{children:[" ",M]})]}),Object(m.jsxs)("div",{children:[Object(m.jsx)("label",{children:"+ Stat/PRN doses: "}),Object(m.jsx)("select",{value:p,disabled:I,onChange:function(e){return B(parseInt(e.target.value))},children:l.a.range(7).map((function(e){return Object(m.jsx)("option",{value:e,children:e},e)}))}),Object(m.jsx)("span",{children:" x "}),Object(m.jsx)("input",{type:"number",min:0,disabled:I||!p,value:S,onChange:function(e){return C(e.target.value)}}),Object(m.jsxs)("span",{children:[" ",M]})]}),I&&Object(m.jsx)(j,{drugIdx:n,strengthIdx:r,prescribedDose:F,numStatDoses:p,statDoseStrength:H}),Object(m.jsx)("button",{onClick:function(){R(0)},children:"Reset"}),z&&Object(m.jsx)("button",{onClick:function(){T(!0)},children:"Calculate"})]})]})}function h(e){var t=e.callback;return Object(m.jsxs)("div",{children:[Object(m.jsx)("h3",{children:"Disclaimer"}),Object(m.jsx)("p",{children:"This application is intended to be used only to cross-check manual drug calculations."}),Object(m.jsx)("p",{children:"It is not approved by NHS or any other healthcare body and you should not rely on it to perform drug calculations."}),Object(m.jsx)("p",{children:"The authors accept no liability for any errors in the application."}),Object(m.jsx)("button",{onClick:t,children:"OK"})]})}function g(){var e=Object(u.useState)(!1),t=Object(s.a)(e,2),n=t[0],a=t[1];return Object(m.jsxs)(m.Fragment,{children:[Object(m.jsx)("h2",{children:"Drug calculation checker"}),n?Object(m.jsx)(b,{}):Object(m.jsx)(h,{callback:function(){return a(!0)}})]})}c.a.render(Object(m.jsx)(a.a.StrictMode,{children:Object(m.jsx)(g,{})}),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.41a91e7f.chunk.js.map