(this["webpackJsonpgenshin-optimizer"]=this["webpackJsonpgenshin-optimizer"]||[]).push([[1],{330:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var o=n(1),r=n(350);function a(){return o.useContext(r.a)}},331:function(e,t,n){"use strict";function o(e){var t=e.props,n=e.states,o=e.muiFormControl;return n.reduce((function(e,n){return e[n]=t[n],o&&"undefined"===typeof t[n]&&(e[n]=o[n]),e}),{})}n.d(t,"a",(function(){return o}))},350:function(e,t,n){"use strict";var o=n(1),r=o.createContext();t.a=r},351:function(e,t,n){"use strict";function o(e){return null!=e&&!(Array.isArray(e)&&0===e.length)}function r(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return e&&(o(e.value)&&""!==e.value||t&&o(e.defaultValue)&&""!==e.defaultValue)}function a(e){return e.startAdornment}n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return a}))},391:function(e,t,n){"use strict";n.d(t,"e",(function(){return W})),n.d(t,"d",(function(){return B})),n.d(t,"b",(function(){return H})),n.d(t,"a",(function(){return I}));var o=n(3),r=n(7),a=n(9),i=n(2),l=n(106),u=n(1),c=(n(4),n(8)),d=n(109),s=n(100),p=n(331),f=n(350),m=n(330),b=n(10),h=n(12),v=n(37),j=n(13),O=n(34),y=n(98),w=n(63),g=n(148),x=n(0),S=["onChange","maxRows","minRows","style","value"];function C(e,t){return parseInt(e[t],10)||0}var z={visibility:"hidden",position:"absolute",overflow:"hidden",height:0,top:0,left:0,transform:"translateZ(0)"},A=u.forwardRef((function(e,t){var n=e.onChange,r=e.maxRows,l=e.minRows,c=void 0===l?1:l,d=e.style,s=e.value,p=Object(a.a)(e,S),f=u.useRef(null!=s).current,m=u.useRef(null),b=Object(O.a)(t,m),h=u.useRef(null),v=u.useRef(0),j=u.useState({}),A=Object(o.a)(j,2),R=A[0],k=A[1],F=u.useCallback((function(){var t=m.current,n=Object(g.a)(t).getComputedStyle(t);if("0px"!==n.width){var o=h.current;o.style.width=n.width,o.value=t.value||e.placeholder||"x","\n"===o.value.slice(-1)&&(o.value+=" ");var a=n["box-sizing"],i=C(n,"padding-bottom")+C(n,"padding-top"),l=C(n,"border-bottom-width")+C(n,"border-top-width"),u=o.scrollHeight;o.value="x";var d=o.scrollHeight,s=u;c&&(s=Math.max(Number(c)*d,s)),r&&(s=Math.min(Number(r)*d,s));var p=(s=Math.max(s,d))+("border-box"===a?i+l:0),f=Math.abs(s-u)<=1;k((function(e){return v.current<20&&(p>0&&Math.abs((e.outerHeightStyle||0)-p)>1||e.overflow!==f)?(v.current+=1,{overflow:f,outerHeightStyle:p}):e}))}}),[r,c,e.placeholder]);u.useEffect((function(){var e,t=Object(w.a)((function(){v.current=0,F()})),n=Object(g.a)(m.current);return n.addEventListener("resize",t),"undefined"!==typeof ResizeObserver&&(e=new ResizeObserver(t)).observe(m.current),function(){t.clear(),n.removeEventListener("resize",t),e&&e.disconnect()}}),[F]),Object(y.a)((function(){F()})),u.useEffect((function(){v.current=0}),[s]);return Object(x.jsxs)(u.Fragment,{children:[Object(x.jsx)("textarea",Object(i.a)({value:s,onChange:function(e){v.current=0,f||F(),n&&n(e)},ref:b,rows:c,style:Object(i.a)({height:R.outerHeightStyle,overflow:R.overflow?"hidden":null},d)},p)),Object(x.jsx)("textarea",{"aria-hidden":!0,className:e.className,readOnly:!0,ref:h,tabIndex:-1,style:Object(i.a)({},z,d,{padding:0})})]})})),R=n(215),k=n(351),F=n(93),E=n(110);function L(e){return Object(F.a)("MuiInputBase",e)}var M=Object(E.a)("MuiInputBase",["root","formControl","focused","disabled","adornedStart","adornedEnd","error","sizeSmall","multiline","colorSecondary","fullWidth","hiddenLabel","input","inputSizeSmall","inputMultiline","inputTypeSearch","inputAdornedStart","inputAdornedEnd","inputHiddenLabel"]),N=["aria-describedby","autoComplete","autoFocus","className","color","components","componentsProps","defaultValue","disabled","endAdornment","error","fullWidth","id","inputComponent","inputProps","inputRef","margin","maxRows","minRows","multiline","name","onBlur","onChange","onClick","onFocus","onKeyDown","onKeyUp","placeholder","readOnly","renderSuffix","rows","size","startAdornment","type","value"],W=function(e,t){var n=e.ownerState;return[t.root,n.formControl&&t.formControl,n.startAdornment&&t.adornedStart,n.endAdornment&&t.adornedEnd,n.error&&t.error,"small"===n.size&&t.sizeSmall,n.multiline&&t.multiline,n.color&&t["color".concat(Object(j.a)(n.color))],n.fullWidth&&t.fullWidth,n.hiddenLabel&&t.hiddenLabel]},B=function(e,t){var n=e.ownerState;return[t.input,"small"===n.size&&t.inputSizeSmall,n.multiline&&t.inputMultiline,"search"===n.type&&t.inputTypeSearch,n.startAdornment&&t.inputAdornedStart,n.endAdornment&&t.inputAdornedEnd,n.hiddenLabel&&t.inputHiddenLabel]},H=Object(b.a)("div",{name:"MuiInputBase",slot:"Root",overridesResolver:W})((function(e){var t=e.theme,n=e.ownerState;return Object(i.a)({},t.typography.body1,Object(r.a)({color:t.palette.text.primary,lineHeight:"1.4375em",boxSizing:"border-box",position:"relative",cursor:"text",display:"inline-flex",alignItems:"center"},"&.".concat(M.disabled),{color:t.palette.text.disabled,cursor:"default"}),n.multiline&&Object(i.a)({padding:"4px 0 5px"},"small"===n.size&&{paddingTop:1}),n.fullWidth&&{width:"100%"})})),I=Object(b.a)("input",{name:"MuiInputBase",slot:"Input",overridesResolver:B})((function(e){var t,n=e.theme,o=e.ownerState,a="light"===n.palette.mode,l={color:"currentColor",opacity:a?.42:.5,transition:n.transitions.create("opacity",{duration:n.transitions.duration.shorter})},u={opacity:"0 !important"},c={opacity:a?.42:.5};return Object(i.a)((t={font:"inherit",letterSpacing:"inherit",color:"currentColor",padding:"4px 0 5px",border:0,boxSizing:"content-box",background:"none",height:"1.4375em",margin:0,WebkitTapHighlightColor:"transparent",display:"block",minWidth:0,width:"100%",animationName:"mui-auto-fill-cancel",animationDuration:"10ms","&::-webkit-input-placeholder":l,"&::-moz-placeholder":l,"&:-ms-input-placeholder":l,"&::-ms-input-placeholder":l,"&:focus":{outline:0},"&:invalid":{boxShadow:"none"},"&::-webkit-search-decoration":{WebkitAppearance:"none"}},Object(r.a)(t,"label[data-shrink=false] + .".concat(M.formControl," &"),{"&::-webkit-input-placeholder":u,"&::-moz-placeholder":u,"&:-ms-input-placeholder":u,"&::-ms-input-placeholder":u,"&:focus::-webkit-input-placeholder":c,"&:focus::-moz-placeholder":c,"&:focus:-ms-input-placeholder":c,"&:focus::-ms-input-placeholder":c}),Object(r.a)(t,"&.".concat(M.disabled),{opacity:1,WebkitTextFillColor:n.palette.text.disabled}),Object(r.a)(t,"&:-webkit-autofill",{animationDuration:"5000s",animationName:"mui-auto-fill"}),t),"small"===o.size&&{paddingTop:1},o.multiline&&{height:"auto",resize:"none",padding:0,paddingTop:0},"search"===o.type&&{MozAppearance:"textfield",WebkitAppearance:"textfield"})})),T=Object(x.jsx)(R.a,{styles:{"@keyframes mui-auto-fill":{from:{display:"block"}},"@keyframes mui-auto-fill-cancel":{from:{display:"block"}}}}),K=u.forwardRef((function(e,t){var n=Object(h.a)({props:e,name:"MuiInputBase"}),r=n["aria-describedby"],b=n.autoComplete,w=n.autoFocus,g=n.className,S=n.components,C=void 0===S?{}:S,z=n.componentsProps,R=void 0===z?{}:z,F=n.defaultValue,E=n.disabled,M=n.endAdornment,W=n.fullWidth,B=void 0!==W&&W,K=n.id,P=n.inputComponent,D=void 0===P?"input":P,V=n.inputProps,q=void 0===V?{}:V,U=n.inputRef,J=n.maxRows,Z=n.minRows,G=n.multiline,Q=void 0!==G&&G,X=n.name,Y=n.onBlur,$=n.onChange,_=n.onClick,ee=n.onFocus,te=n.onKeyDown,ne=n.onKeyUp,oe=n.placeholder,re=n.readOnly,ae=n.renderSuffix,ie=n.rows,le=n.startAdornment,ue=n.type,ce=void 0===ue?"text":ue,de=n.value,se=Object(a.a)(n,N),pe=Object(v.a)(),fe=null!=q.value?q.value:de,me=u.useRef(null!=fe).current,be=u.useRef(),he=u.useCallback((function(e){0}),[]),ve=Object(O.a)(q.ref,he),je=Object(O.a)(U,ve),Oe=Object(O.a)(be,je),ye=u.useState(!1),we=Object(o.a)(ye,2),ge=we[0],xe=we[1],Se=Object(m.a)();var Ce=Object(p.a)({props:n,muiFormControl:Se,states:["color","disabled","error","hiddenLabel","size","required","filled"]});Ce.focused=Se?Se.focused:ge,u.useEffect((function(){!Se&&E&&ge&&(xe(!1),Y&&Y())}),[Se,E,ge,Y]);var ze=Se&&Se.onFilled,Ae=Se&&Se.onEmpty,Re=u.useCallback((function(e){Object(k.b)(e)?ze&&ze():Ae&&Ae()}),[ze,Ae]);Object(y.a)((function(){me&&Re({value:fe})}),[fe,Re,me]);u.useEffect((function(){Re(be.current)}),[]);var ke=D,Fe=q;Q&&"input"===ke&&(Fe=ie?Object(i.a)({type:void 0,minRows:ie,maxRows:ie},Fe):Object(i.a)({type:void 0,maxRows:J,minRows:Z},Fe),ke=A);u.useEffect((function(){Se&&Se.setAdornedStart(Boolean(le))}),[Se,le]);var Ee=Object(i.a)({},n,{color:Ce.color||"primary",disabled:Ce.disabled,endAdornment:M,error:Ce.error,focused:Ce.focused,formControl:Se,fullWidth:B,hiddenLabel:Ce.hiddenLabel,multiline:Q,size:Ce.size,startAdornment:le,type:ce}),Le=function(e){var t=e.classes,n=e.color,o=e.disabled,r=e.error,a=e.endAdornment,i=e.focused,l=e.formControl,u=e.fullWidth,c=e.hiddenLabel,s=e.multiline,p=e.size,f=e.startAdornment,m=e.type,b={root:["root","color".concat(Object(j.a)(n)),o&&"disabled",r&&"error",u&&"fullWidth",i&&"focused",l&&"formControl","small"===p&&"sizeSmall",s&&"multiline",f&&"adornedStart",a&&"adornedEnd",c&&"hiddenLabel"],input:["input",o&&"disabled","search"===m&&"inputTypeSearch",s&&"inputMultiline","small"===p&&"inputSizeSmall",c&&"inputHiddenLabel",f&&"inputAdornedStart",a&&"inputAdornedEnd"]};return Object(d.a)(b,L,t)}(Ee),Me=C.Root||H,Ne=R.root||{},We=C.Input||I;return Fe=Object(i.a)({},Fe,R.input),Object(x.jsxs)(u.Fragment,{children:[T,Object(x.jsxs)(Me,Object(i.a)({},Ne,!Object(s.a)(Me)&&{ownerState:Object(i.a)({},Ee,Ne.ownerState),theme:pe},{ref:t,onClick:function(e){be.current&&e.currentTarget===e.target&&be.current.focus(),_&&_(e)}},se,{className:Object(c.a)(Le.root,Ne.className,g),children:[le,Object(x.jsx)(f.a.Provider,{value:null,children:Object(x.jsx)(We,Object(i.a)({ownerState:Ee,"aria-invalid":Ce.error,"aria-describedby":r,autoComplete:b,autoFocus:w,defaultValue:F,disabled:Ce.disabled,id:K,onAnimationStart:function(e){Re("mui-auto-fill-cancel"===e.animationName?be.current:{value:"x"})},name:X,placeholder:oe,readOnly:re,required:Ce.required,rows:ie,value:fe,onKeyDown:te,onKeyUp:ne,type:ce},Fe,!Object(s.a)(We)&&{as:ke,ownerState:Object(i.a)({},Ee,Fe.ownerState),theme:pe},{ref:Oe,className:Object(c.a)(Le.input,Fe.className,q.className),onBlur:function(e){Y&&Y(e),q.onBlur&&q.onBlur(e),Se&&Se.onBlur?Se.onBlur(e):xe(!1)},onChange:function(e){if(!me){var t=e.target||be.current;if(null==t)throw new Error(Object(l.a)(1));Re({value:t.value})}for(var n=arguments.length,o=new Array(n>1?n-1:0),r=1;r<n;r++)o[r-1]=arguments[r];q.onChange&&q.onChange.apply(q,[e].concat(o)),$&&$.apply(void 0,[e].concat(o))},onFocus:function(e){Ce.disabled?e.stopPropagation():(ee&&ee(e),q.onFocus&&q.onFocus(e),Se&&Se.onFocus?Se.onFocus(e):xe(!0))}}))}),M,ae?ae(Object(i.a)({},Ce,{startAdornment:le})):null]}))]})}));t.c=K}}]);
//# sourceMappingURL=1.856d7a20.chunk.js.map