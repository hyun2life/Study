(function(){"use strict";function $0(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var ic={exports:{}},Ss={};var zd;function H0(){if(zd)return Ss;zd=1;var s=Symbol.for("react.transitional.element"),r=Symbol.for("react.fragment");function c(u,_,f){var b=null;if(f!==void 0&&(b=""+f),_.key!==void 0&&(b=""+_.key),"key"in _){f={};for(var R in _)R!=="key"&&(f[R]=_[R])}else f=_;return _=f.ref,{$$typeof:s,type:u,key:b,ref:_!==void 0?_:null,props:f}}return Ss.Fragment=r,Ss.jsx=c,Ss.jsxs=c,Ss}var Rd;function U0(){return Rd||(Rd=1,ic.exports=H0()),ic.exports}var o=U0(),rc={exports:{}},ks={},cc={exports:{}},uc={};var Dd;function Y0(){return Dd||(Dd=1,(function(s){function r(T,ae){var X=T.length;T.push(ae);e:for(;0<X;){var de=X-1>>>1,je=T[de];if(0<_(je,ae))T[de]=ae,T[X]=je,X=de;else break e}}function c(T){return T.length===0?null:T[0]}function u(T){if(T.length===0)return null;var ae=T[0],X=T.pop();if(X!==ae){T[0]=X;e:for(var de=0,je=T.length,w=je>>>1;de<w;){var I=2*(de+1)-1,ie=T[I],fe=I+1,Ne=T[fe];if(0>_(ie,X))fe<je&&0>_(Ne,ie)?(T[de]=Ne,T[fe]=X,de=fe):(T[de]=ie,T[I]=X,de=I);else if(fe<je&&0>_(Ne,X))T[de]=Ne,T[fe]=X,de=fe;else break e}}return ae}function _(T,ae){var X=T.sortIndex-ae.sortIndex;return X!==0?X:T.id-ae.id}if(s.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var f=performance;s.unstable_now=function(){return f.now()}}else{var b=Date,R=b.now();s.unstable_now=function(){return b.now()-R}}var x=[],M=[],E=1,$=null,D=3,ue=!1,H=!1,ne=!1,U=!1,G=typeof setTimeout=="function"?setTimeout:null,_e=typeof clearTimeout=="function"?clearTimeout:null,ve=typeof setImmediate<"u"?setImmediate:null;function we(T){for(var ae=c(M);ae!==null;){if(ae.callback===null)u(M);else if(ae.startTime<=T)u(M),ae.sortIndex=ae.expirationTime,r(x,ae);else break;ae=c(M)}}function _t(T){if(ne=!1,we(T),!H)if(c(x)!==null)H=!0,nt||(nt=!0,tt());else{var ae=c(M);ae!==null&&Qe(_t,ae.startTime-T)}}var nt=!1,oe=-1,ot=5,rt=-1;function at(){return U?!0:!(s.unstable_now()-rt<ot)}function $e(){if(U=!1,nt){var T=s.unstable_now();rt=T;var ae=!0;try{e:{H=!1,ne&&(ne=!1,_e(oe),oe=-1),ue=!0;var X=D;try{t:{for(we(T),$=c(x);$!==null&&!($.expirationTime>T&&at());){var de=$.callback;if(typeof de=="function"){$.callback=null,D=$.priorityLevel;var je=de($.expirationTime<=T);if(T=s.unstable_now(),typeof je=="function"){$.callback=je,we(T),ae=!0;break t}$===c(x)&&u(x),we(T)}else u(x);$=c(x)}if($!==null)ae=!0;else{var w=c(M);w!==null&&Qe(_t,w.startTime-T),ae=!1}}break e}finally{$=null,D=X,ue=!1}ae=void 0}}finally{ae?tt():nt=!1}}}var tt;if(typeof ve=="function")tt=function(){ve($e)};else if(typeof MessageChannel<"u"){var xt=new MessageChannel,Ye=xt.port2;xt.port1.onmessage=$e,tt=function(){Ye.postMessage(null)}}else tt=function(){G($e,0)};function Qe(T,ae){oe=G(function(){T(s.unstable_now())},ae)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(T){T.callback=null},s.unstable_forceFrameRate=function(T){0>T||125<T?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ot=0<T?Math.floor(1e3/T):5},s.unstable_getCurrentPriorityLevel=function(){return D},s.unstable_next=function(T){switch(D){case 1:case 2:case 3:var ae=3;break;default:ae=D}var X=D;D=ae;try{return T()}finally{D=X}},s.unstable_requestPaint=function(){U=!0},s.unstable_runWithPriority=function(T,ae){switch(T){case 1:case 2:case 3:case 4:case 5:break;default:T=3}var X=D;D=T;try{return ae()}finally{D=X}},s.unstable_scheduleCallback=function(T,ae,X){var de=s.unstable_now();switch(typeof X=="object"&&X!==null?(X=X.delay,X=typeof X=="number"&&0<X?de+X:de):X=de,T){case 1:var je=-1;break;case 2:je=250;break;case 5:je=1073741823;break;case 4:je=1e4;break;default:je=5e3}return je=X+je,T={id:E++,callback:ae,priorityLevel:T,startTime:X,expirationTime:je,sortIndex:-1},X>de?(T.sortIndex=X,r(M,T),c(x)===null&&T===c(M)&&(ne?(_e(oe),oe=-1):ne=!0,Qe(_t,X-de))):(T.sortIndex=je,r(x,T),H||ue||(H=!0,nt||(nt=!0,tt()))),T},s.unstable_shouldYield=at,s.unstable_wrapCallback=function(T){var ae=D;return function(){var X=D;D=ae;try{return T.apply(this,arguments)}finally{D=X}}}})(uc)),uc}var Nd;function X0(){return Nd||(Nd=1,cc.exports=Y0()),cc.exports}var dc={exports:{}},et={};var Ad;function I0(){if(Ad)return et;Ad=1;var s=Symbol.for("react.transitional.element"),r=Symbol.for("react.portal"),c=Symbol.for("react.fragment"),u=Symbol.for("react.strict_mode"),_=Symbol.for("react.profiler"),f=Symbol.for("react.consumer"),b=Symbol.for("react.context"),R=Symbol.for("react.forward_ref"),x=Symbol.for("react.suspense"),M=Symbol.for("react.memo"),E=Symbol.for("react.lazy"),$=Symbol.for("react.activity"),D=Symbol.iterator;function ue(w){return w===null||typeof w!="object"?null:(w=D&&w[D]||w["@@iterator"],typeof w=="function"?w:null)}var H={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ne=Object.assign,U={};function G(w,I,ie){this.props=w,this.context=I,this.refs=U,this.updater=ie||H}G.prototype.isReactComponent={},G.prototype.setState=function(w,I){if(typeof w!="object"&&typeof w!="function"&&w!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,w,I,"setState")},G.prototype.forceUpdate=function(w){this.updater.enqueueForceUpdate(this,w,"forceUpdate")};function _e(){}_e.prototype=G.prototype;function ve(w,I,ie){this.props=w,this.context=I,this.refs=U,this.updater=ie||H}var we=ve.prototype=new _e;we.constructor=ve,ne(we,G.prototype),we.isPureReactComponent=!0;var _t=Array.isArray;function nt(){}var oe={H:null,A:null,T:null,S:null},ot=Object.prototype.hasOwnProperty;function rt(w,I,ie){var fe=ie.ref;return{$$typeof:s,type:w,key:I,ref:fe!==void 0?fe:null,props:ie}}function at(w,I){return rt(w.type,I,w.props)}function $e(w){return typeof w=="object"&&w!==null&&w.$$typeof===s}function tt(w){var I={"=":"=0",":":"=2"};return"$"+w.replace(/[=:]/g,function(ie){return I[ie]})}var xt=/\/+/g;function Ye(w,I){return typeof w=="object"&&w!==null&&w.key!=null?tt(""+w.key):I.toString(36)}function Qe(w){switch(w.status){case"fulfilled":return w.value;case"rejected":throw w.reason;default:switch(typeof w.status=="string"?w.then(nt,nt):(w.status="pending",w.then(function(I){w.status==="pending"&&(w.status="fulfilled",w.value=I)},function(I){w.status==="pending"&&(w.status="rejected",w.reason=I)})),w.status){case"fulfilled":return w.value;case"rejected":throw w.reason}}throw w}function T(w,I,ie,fe,Ne){var Ze=typeof w;(Ze==="undefined"||Ze==="boolean")&&(w=null);var st=!1;if(w===null)st=!0;else switch(Ze){case"bigint":case"string":case"number":st=!0;break;case"object":switch(w.$$typeof){case s:case r:st=!0;break;case E:return st=w._init,T(st(w._payload),I,ie,fe,Ne)}}if(st)return Ne=Ne(w),st=fe===""?"."+Ye(w,0):fe,_t(Ne)?(ie="",st!=null&&(ie=st.replace(xt,"$&/")+"/"),T(Ne,I,ie,"",function(Zn){return Zn})):Ne!=null&&($e(Ne)&&(Ne=at(Ne,ie+(Ne.key==null||w&&w.key===Ne.key?"":(""+Ne.key).replace(xt,"$&/")+"/")+st)),I.push(Ne)),1;st=0;var Zt=fe===""?".":fe+":";if(_t(w))for(var Nt=0;Nt<w.length;Nt++)fe=w[Nt],Ze=Zt+Ye(fe,Nt),st+=T(fe,I,ie,Ze,Ne);else if(Nt=ue(w),typeof Nt=="function")for(w=Nt.call(w),Nt=0;!(fe=w.next()).done;)fe=fe.value,Ze=Zt+Ye(fe,Nt++),st+=T(fe,I,ie,Ze,Ne);else if(Ze==="object"){if(typeof w.then=="function")return T(Qe(w),I,ie,fe,Ne);throw I=String(w),Error("Objects are not valid as a React child (found: "+(I==="[object Object]"?"object with keys {"+Object.keys(w).join(", ")+"}":I)+"). If you meant to render a collection of children, use an array instead.")}return st}function ae(w,I,ie){if(w==null)return w;var fe=[],Ne=0;return T(w,fe,"","",function(Ze){return I.call(ie,Ze,Ne++)}),fe}function X(w){if(w._status===-1){var I=w._result;I=I(),I.then(function(ie){(w._status===0||w._status===-1)&&(w._status=1,w._result=ie)},function(ie){(w._status===0||w._status===-1)&&(w._status=2,w._result=ie)}),w._status===-1&&(w._status=0,w._result=I)}if(w._status===1)return w._result.default;throw w._result}var de=typeof reportError=="function"?reportError:function(w){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var I=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof w=="object"&&w!==null&&typeof w.message=="string"?String(w.message):String(w),error:w});if(!window.dispatchEvent(I))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",w);return}console.error(w)},je={map:ae,forEach:function(w,I,ie){ae(w,function(){I.apply(this,arguments)},ie)},count:function(w){var I=0;return ae(w,function(){I++}),I},toArray:function(w){return ae(w,function(I){return I})||[]},only:function(w){if(!$e(w))throw Error("React.Children.only expected to receive a single React element child.");return w}};return et.Activity=$,et.Children=je,et.Component=G,et.Fragment=c,et.Profiler=_,et.PureComponent=ve,et.StrictMode=u,et.Suspense=x,et.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=oe,et.__COMPILER_RUNTIME={__proto__:null,c:function(w){return oe.H.useMemoCache(w)}},et.cache=function(w){return function(){return w.apply(null,arguments)}},et.cacheSignal=function(){return null},et.cloneElement=function(w,I,ie){if(w==null)throw Error("The argument must be a React element, but you passed "+w+".");var fe=ne({},w.props),Ne=w.key;if(I!=null)for(Ze in I.key!==void 0&&(Ne=""+I.key),I)!ot.call(I,Ze)||Ze==="key"||Ze==="__self"||Ze==="__source"||Ze==="ref"&&I.ref===void 0||(fe[Ze]=I[Ze]);var Ze=arguments.length-2;if(Ze===1)fe.children=ie;else if(1<Ze){for(var st=Array(Ze),Zt=0;Zt<Ze;Zt++)st[Zt]=arguments[Zt+2];fe.children=st}return rt(w.type,Ne,fe)},et.createContext=function(w){return w={$$typeof:b,_currentValue:w,_currentValue2:w,_threadCount:0,Provider:null,Consumer:null},w.Provider=w,w.Consumer={$$typeof:f,_context:w},w},et.createElement=function(w,I,ie){var fe,Ne={},Ze=null;if(I!=null)for(fe in I.key!==void 0&&(Ze=""+I.key),I)ot.call(I,fe)&&fe!=="key"&&fe!=="__self"&&fe!=="__source"&&(Ne[fe]=I[fe]);var st=arguments.length-2;if(st===1)Ne.children=ie;else if(1<st){for(var Zt=Array(st),Nt=0;Nt<st;Nt++)Zt[Nt]=arguments[Nt+2];Ne.children=Zt}if(w&&w.defaultProps)for(fe in st=w.defaultProps,st)Ne[fe]===void 0&&(Ne[fe]=st[fe]);return rt(w,Ze,Ne)},et.createRef=function(){return{current:null}},et.forwardRef=function(w){return{$$typeof:R,render:w}},et.isValidElement=$e,et.lazy=function(w){return{$$typeof:E,_payload:{_status:-1,_result:w},_init:X}},et.memo=function(w,I){return{$$typeof:M,type:w,compare:I===void 0?null:I}},et.startTransition=function(w){var I=oe.T,ie={};oe.T=ie;try{var fe=w(),Ne=oe.S;Ne!==null&&Ne(ie,fe),typeof fe=="object"&&fe!==null&&typeof fe.then=="function"&&fe.then(nt,de)}catch(Ze){de(Ze)}finally{I!==null&&ie.types!==null&&(I.types=ie.types),oe.T=I}},et.unstable_useCacheRefresh=function(){return oe.H.useCacheRefresh()},et.use=function(w){return oe.H.use(w)},et.useActionState=function(w,I,ie){return oe.H.useActionState(w,I,ie)},et.useCallback=function(w,I){return oe.H.useCallback(w,I)},et.useContext=function(w){return oe.H.useContext(w)},et.useDebugValue=function(){},et.useDeferredValue=function(w,I){return oe.H.useDeferredValue(w,I)},et.useEffect=function(w,I){return oe.H.useEffect(w,I)},et.useEffectEvent=function(w){return oe.H.useEffectEvent(w)},et.useId=function(){return oe.H.useId()},et.useImperativeHandle=function(w,I,ie){return oe.H.useImperativeHandle(w,I,ie)},et.useInsertionEffect=function(w,I){return oe.H.useInsertionEffect(w,I)},et.useLayoutEffect=function(w,I){return oe.H.useLayoutEffect(w,I)},et.useMemo=function(w,I){return oe.H.useMemo(w,I)},et.useOptimistic=function(w,I){return oe.H.useOptimistic(w,I)},et.useReducer=function(w,I,ie){return oe.H.useReducer(w,I,ie)},et.useRef=function(w){return oe.H.useRef(w)},et.useState=function(w){return oe.H.useState(w)},et.useSyncExternalStore=function(w,I,ie){return oe.H.useSyncExternalStore(w,I,ie)},et.useTransition=function(){return oe.H.useTransition()},et.version="19.2.6",et}var Bd;function _c(){return Bd||(Bd=1,dc.exports=I0()),dc.exports}var fc={exports:{}},An={};var Od;function q0(){if(Od)return An;Od=1;var s=_c();function r(x){var M="https://react.dev/errors/"+x;if(1<arguments.length){M+="?args[]="+encodeURIComponent(arguments[1]);for(var E=2;E<arguments.length;E++)M+="&args[]="+encodeURIComponent(arguments[E])}return"Minified React error #"+x+"; visit "+M+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function c(){}var u={d:{f:c,r:function(){throw Error(r(522))},D:c,C:c,L:c,m:c,X:c,S:c,M:c},p:0,findDOMNode:null},_=Symbol.for("react.portal");function f(x,M,E){var $=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:_,key:$==null?null:""+$,children:x,containerInfo:M,implementation:E}}var b=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function R(x,M){if(x==="font")return"";if(typeof M=="string")return M==="use-credentials"?M:""}return An.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=u,An.createPortal=function(x,M){var E=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!M||M.nodeType!==1&&M.nodeType!==9&&M.nodeType!==11)throw Error(r(299));return f(x,M,null,E)},An.flushSync=function(x){var M=b.T,E=u.p;try{if(b.T=null,u.p=2,x)return x()}finally{b.T=M,u.p=E,u.d.f()}},An.preconnect=function(x,M){typeof x=="string"&&(M?(M=M.crossOrigin,M=typeof M=="string"?M==="use-credentials"?M:"":void 0):M=null,u.d.C(x,M))},An.prefetchDNS=function(x){typeof x=="string"&&u.d.D(x)},An.preinit=function(x,M){if(typeof x=="string"&&M&&typeof M.as=="string"){var E=M.as,$=R(E,M.crossOrigin),D=typeof M.integrity=="string"?M.integrity:void 0,ue=typeof M.fetchPriority=="string"?M.fetchPriority:void 0;E==="style"?u.d.S(x,typeof M.precedence=="string"?M.precedence:void 0,{crossOrigin:$,integrity:D,fetchPriority:ue}):E==="script"&&u.d.X(x,{crossOrigin:$,integrity:D,fetchPriority:ue,nonce:typeof M.nonce=="string"?M.nonce:void 0})}},An.preinitModule=function(x,M){if(typeof x=="string")if(typeof M=="object"&&M!==null){if(M.as==null||M.as==="script"){var E=R(M.as,M.crossOrigin);u.d.M(x,{crossOrigin:E,integrity:typeof M.integrity=="string"?M.integrity:void 0,nonce:typeof M.nonce=="string"?M.nonce:void 0})}}else M==null&&u.d.M(x)},An.preload=function(x,M){if(typeof x=="string"&&typeof M=="object"&&M!==null&&typeof M.as=="string"){var E=M.as,$=R(E,M.crossOrigin);u.d.L(x,E,{crossOrigin:$,integrity:typeof M.integrity=="string"?M.integrity:void 0,nonce:typeof M.nonce=="string"?M.nonce:void 0,type:typeof M.type=="string"?M.type:void 0,fetchPriority:typeof M.fetchPriority=="string"?M.fetchPriority:void 0,referrerPolicy:typeof M.referrerPolicy=="string"?M.referrerPolicy:void 0,imageSrcSet:typeof M.imageSrcSet=="string"?M.imageSrcSet:void 0,imageSizes:typeof M.imageSizes=="string"?M.imageSizes:void 0,media:typeof M.media=="string"?M.media:void 0})}},An.preloadModule=function(x,M){if(typeof x=="string")if(M){var E=R(M.as,M.crossOrigin);u.d.m(x,{as:typeof M.as=="string"&&M.as!=="script"?M.as:void 0,crossOrigin:E,integrity:typeof M.integrity=="string"?M.integrity:void 0})}else u.d.m(x)},An.requestFormReset=function(x){u.d.r(x)},An.unstable_batchedUpdates=function(x,M){return x(M)},An.useFormState=function(x,M,E){return b.H.useFormState(x,M,E)},An.useFormStatus=function(){return b.H.useHostTransitionStatus()},An.version="19.2.6",An}var Ld;function $d(){if(Ld)return fc.exports;Ld=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(r){console.error(r)}}return s(),fc.exports=q0(),fc.exports}var Hd;function Q0(){if(Hd)return ks;Hd=1;var s=X0(),r=_c(),c=$d();function u(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function _(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function f(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function b(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function R(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function x(e){if(f(e)!==e)throw Error(u(188))}function M(e){var t=e.alternate;if(!t){if(t=f(e),t===null)throw Error(u(188));return t!==e?null:e}for(var n=e,l=t;;){var a=n.return;if(a===null)break;var i=a.alternate;if(i===null){if(l=a.return,l!==null){n=l;continue}break}if(a.child===i.child){for(i=a.child;i;){if(i===n)return x(a),e;if(i===l)return x(a),t;i=i.sibling}throw Error(u(188))}if(n.return!==l.return)n=a,l=i;else{for(var d=!1,h=a.child;h;){if(h===n){d=!0,n=a,l=i;break}if(h===l){d=!0,l=a,n=i;break}h=h.sibling}if(!d){for(h=i.child;h;){if(h===n){d=!0,n=i,l=a;break}if(h===l){d=!0,l=i,n=a;break}h=h.sibling}if(!d)throw Error(u(189))}}if(n.alternate!==l)throw Error(u(190))}if(n.tag!==3)throw Error(u(188));return n.stateNode.current===n?e:t}function E(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=E(e),t!==null)return t;e=e.sibling}return null}var $=Object.assign,D=Symbol.for("react.element"),ue=Symbol.for("react.transitional.element"),H=Symbol.for("react.portal"),ne=Symbol.for("react.fragment"),U=Symbol.for("react.strict_mode"),G=Symbol.for("react.profiler"),_e=Symbol.for("react.consumer"),ve=Symbol.for("react.context"),we=Symbol.for("react.forward_ref"),_t=Symbol.for("react.suspense"),nt=Symbol.for("react.suspense_list"),oe=Symbol.for("react.memo"),ot=Symbol.for("react.lazy"),rt=Symbol.for("react.activity"),at=Symbol.for("react.memo_cache_sentinel"),$e=Symbol.iterator;function tt(e){return e===null||typeof e!="object"?null:(e=$e&&e[$e]||e["@@iterator"],typeof e=="function"?e:null)}var xt=Symbol.for("react.client.reference");function Ye(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===xt?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ne:return"Fragment";case G:return"Profiler";case U:return"StrictMode";case _t:return"Suspense";case nt:return"SuspenseList";case rt:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case H:return"Portal";case ve:return e.displayName||"Context";case _e:return(e._context.displayName||"Context")+".Consumer";case we:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case oe:return t=e.displayName||null,t!==null?t:Ye(e.type)||"Memo";case ot:t=e._payload,e=e._init;try{return Ye(e(t))}catch{}}return null}var Qe=Array.isArray,T=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ae=c.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,X={pending:!1,data:null,method:null,action:null},de=[],je=-1;function w(e){return{current:e}}function I(e){0>je||(e.current=de[je],de[je]=null,je--)}function ie(e,t){je++,de[je]=e.current,e.current=t}var fe=w(null),Ne=w(null),Ze=w(null),st=w(null);function Zt(e,t){switch(ie(Ze,t),ie(Ne,e),ie(fe,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?i0(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=i0(t),e=r0(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}I(fe),ie(fe,e)}function Nt(){I(fe),I(Ne),I(Ze)}function Zn(e){e.memoizedState!==null&&ie(st,e);var t=fe.current,n=r0(t,e.type);t!==n&&(ie(Ne,e),ie(fe,n))}function Sn(e){Ne.current===e&&(I(fe),I(Ne)),st.current===e&&(I(st),Si._currentValue=X)}var kn,In;function bn(e){if(kn===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);kn=t&&t[1]||"",In=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+kn+e+In}var gl=!1;function al(e,t){if(!e||gl)return"";gl=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var J=function(){throw Error()};if(Object.defineProperty(J.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(J,[])}catch(Y){var L=Y}Reflect.construct(e,[],J)}else{try{J.call()}catch(Y){L=Y}e.call(J.prototype)}}else{try{throw Error()}catch(Y){L=Y}(J=e())&&typeof J.catch=="function"&&J.catch(function(){})}}catch(Y){if(Y&&L&&typeof Y.stack=="string")return[Y.stack,L.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var i=l.DetermineComponentFrameRoot(),d=i[0],h=i[1];if(d&&h){var v=d.split(`
`),B=h.split(`
`);for(a=l=0;l<v.length&&!v[l].includes("DetermineComponentFrameRoot");)l++;for(;a<B.length&&!B[a].includes("DetermineComponentFrameRoot");)a++;if(l===v.length||a===B.length)for(l=v.length-1,a=B.length-1;1<=l&&0<=a&&v[l]!==B[a];)a--;for(;1<=l&&0<=a;l--,a--)if(v[l]!==B[a]){if(l!==1||a!==1)do if(l--,a--,0>a||v[l]!==B[a]){var q=`
`+v[l].replace(" at new "," at ");return e.displayName&&q.includes("<anonymous>")&&(q=q.replace("<anonymous>",e.displayName)),q}while(1<=l&&0<=a);break}}}finally{gl=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?bn(n):""}function Ul(e,t){switch(e.tag){case 26:case 27:case 5:return bn(e.type);case 16:return bn("Lazy");case 13:return e.child!==t&&t!==null?bn("Suspense Fallback"):bn("Suspense");case 19:return bn("SuspenseList");case 0:case 15:return al(e.type,!1);case 11:return al(e.type.render,!1);case 1:return al(e.type,!0);case 31:return bn("Activity");default:return""}}function Z(e){try{var t="",n=null;do t+=Ul(e,n),n=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var Ce=Object.prototype.hasOwnProperty,We=s.unstable_scheduleCallback,He=s.unstable_cancelCallback,Ke=s.unstable_shouldYield,jt=s.unstable_requestPaint,Ge=s.unstable_now,lt=s.unstable_getCurrentPriorityLevel,Ct=s.unstable_ImmediatePriority,Qt=s.unstable_UserBlockingPriority,Te=s.unstable_NormalPriority,N=s.unstable_LowPriority,O=s.unstable_IdlePriority,F=s.log,ee=s.unstable_setDisableYieldValue,pe=null,se=null;function le(e){if(typeof F=="function"&&ee(e),se&&typeof se.setStrictMode=="function")try{se.setStrictMode(pe,e)}catch{}}var Re=Math.clz32?Math.clz32:Mt,Ve=Math.log,gt=Math.LN2;function Mt(e){return e>>>=0,e===0?32:31-(Ve(e)/gt|0)|0}var Se=256,ft=262144,ut=4194304;function Fe(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function xe(e,t,n){var l=e.pendingLanes;if(l===0)return 0;var a=0,i=e.suspendedLanes,d=e.pingedLanes;e=e.warmLanes;var h=l&134217727;return h!==0?(l=h&~i,l!==0?a=Fe(l):(d&=h,d!==0?a=Fe(d):n||(n=h&~e,n!==0&&(a=Fe(n))))):(h=l&~i,h!==0?a=Fe(h):d!==0?a=Fe(d):n||(n=l&~e,n!==0&&(a=Fe(n)))),a===0?0:t!==0&&t!==a&&(t&i)===0&&(i=a&-a,n=t&-t,i>=n||i===32&&(n&4194048)!==0)?t:a}function bt(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Je(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Be(){var e=ut;return ut<<=1,(ut&62914560)===0&&(ut=4194304),e}function St(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Pe(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Kn(e,t,n,l,a,i){var d=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var h=e.entanglements,v=e.expirationTimes,B=e.hiddenUpdates;for(n=d&~n;0<n;){var q=31-Re(n),J=1<<q;h[q]=0,v[q]=-1;var L=B[q];if(L!==null)for(B[q]=null,q=0;q<L.length;q++){var Y=L[q];Y!==null&&(Y.lane&=-536870913)}n&=~J}l!==0&&En(e,l,0),i!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=i&~(d&~t))}function En(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-Re(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|n&261930}function Bn(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var l=31-Re(n),a=1<<l;a&t|e[l]&t&&(e[l]|=t),n&=~a}}function sl(e,t){var n=t&-t;return n=(n&42)!==0?1:On(n),(n&(e.suspendedLanes|t))!==0?0:n}function On(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Yl(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function ra(){var e=ae.p;return e!==0?e:(e=window.event,e===void 0?32:R0(e.type))}function en(e,t){var n=ae.p;try{return ae.p=e,t()}finally{ae.p=n}}var jn=Math.random().toString(36).slice(2),an="__reactFiber$"+jn,Ln="__reactProps$"+jn,Oe="__reactContainer$"+jn,$n="__reactEvents$"+jn,Ns="__reactListeners$"+jn,As="__reactHandles$"+jn,Xl="__reactResources$"+jn,ca="__reactMarker$"+jn;function $a(e){delete e[an],delete e[Ln],delete e[$n],delete e[Ns],delete e[As]}function ko(e){var t=e[an];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Oe]||n[an]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=m0(e);e!==null;){if(n=e[an])return n;e=m0(e)}return t}e=n,n=e.parentNode}return null}function jo(e){if(e=e[an]||e[Oe]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function ua(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(u(33))}function Il(e){var t=e[Xl];return t||(t=e[Xl]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function hn(e){e[ca]=!0}var Bs=new Set,Co={};function yl(e,t){Cn(e,t),Cn(e+"Capture",t)}function Cn(e,t){for(Co[e]=t,e=0;e<t.length;e++)Bs.add(t[e])}var Ha=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Os={},Mo={};function da(e){return Ce.call(Mo,e)?!0:Ce.call(Os,e)?!1:Ha.test(e)?Mo[e]=!0:(Os[e]=!0,!1)}function ql(e,t,n){if(da(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Hn(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function il(e,t,n,l){if(l===null)e.removeAttribute(n);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+l)}}function Kt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Xi(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Oc(e,t,n){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var a=l.get,i=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(d){n=""+d,i.call(this,d)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return n},setValue:function(d){n=""+d},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ua(e){if(!e._valueTracker){var t=Xi(e)?"checked":"value";e._valueTracker=Oc(e,t,""+e[t])}}function Lc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),l="";return e&&(l=Xi(e)?e.checked?"true":"false":e.value),e=l,e!==n?(t.setValue(e),!0):!1}function Eo(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Ii=/[\n"\\]/g;function qn(e){return e.replace(Ii,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Ql(e,t,n,l,a,i,d,h){e.name="",d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"?e.type=d:e.removeAttribute("type"),t!=null?d==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Kt(t)):e.value!==""+Kt(t)&&(e.value=""+Kt(t)):d!=="submit"&&d!=="reset"||e.removeAttribute("value"),t!=null?Wl(e,d,Kt(t)):n!=null?Wl(e,d,Kt(n)):l!=null&&e.removeAttribute("value"),a==null&&i!=null&&(e.defaultChecked=!!i),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),h!=null&&typeof h!="function"&&typeof h!="symbol"&&typeof h!="boolean"?e.name=""+Kt(h):e.removeAttribute("name")}function nn(e,t,n,l,a,i,d,h){if(i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"&&(e.type=i),t!=null||n!=null){if(!(i!=="submit"&&i!=="reset"||t!=null)){Ua(e);return}n=n!=null?""+Kt(n):"",t=t!=null?""+Kt(t):n,h||t===e.value||(e.value=t),e.defaultValue=t}l=l??a,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=h?e.checked:!!l,e.defaultChecked=!!l,d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"&&(e.name=d),Ua(e)}function Wl(e,t,n){t==="number"&&Eo(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function Tn(e,t,n,l){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&l&&(e[n].defaultSelected=!0)}else{for(n=""+Kt(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,l&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function vn(e,t,n){if(t!=null&&(t=""+Kt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Kt(n):""}function qi(e,t,n,l){if(t==null){if(l!=null){if(n!=null)throw Error(u(92));if(Qe(l)){if(1<l.length)throw Error(u(93));l=l[0]}n=l}n==null&&(n=""),t=n}n=Kt(t),e.defaultValue=n,l=e.textContent,l===n&&l!==""&&l!==null&&(e.value=l),Ua(e)}function To(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var $c=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function ht(e,t,n){var l=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,n):typeof n!="number"||n===0||$c.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function Qi(e,t,n){if(t!=null&&typeof t!="object")throw Error(u(62));if(e=e.style,n!=null){for(var l in n)!n.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var a in t)l=t[a],t.hasOwnProperty(a)&&n[a]!==l&&ht(e,a,l)}else for(var i in t)t.hasOwnProperty(i)&&ht(e,i,t[i])}function Fn(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Wi=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Gi=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function _a(e){return Gi.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Dl(){}var Ls=null;function Nl(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Wt=null,Gl=null;function $s(e){var t=jo(e);if(t&&(e=t.stateNode)){var n=e[Ln]||null;e:switch(e=t.stateNode,t.type){case"input":if(Ql(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+qn(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var l=n[t];if(l!==e&&l.form===e.form){var a=l[Ln]||null;if(!a)throw Error(u(90));Ql(l,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)l=n[t],l.form===e.form&&Lc(l)}break e;case"textarea":vn(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&Tn(e,!!n.multiple,t,!1)}}}var Qn=!1;function Vl(e,t,n){if(Qn)return e(t,n);Qn=!0;try{var l=e(t);return l}finally{if(Qn=!1,(Wt!==null||Gl!==null)&&(Hr(),Wt&&(t=Wt,e=Gl,Gl=Wt=null,$s(t),e)))for(t=0;t<e.length;t++)$s(e[t])}}function Ot(e,t){var n=e.stateNode;if(n===null)return null;var l=n[Ln]||null;if(l===null)return null;n=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(u(231,t,typeof n));return n}var rl=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Al=!1;if(rl)try{var zo={};Object.defineProperty(zo,"passive",{get:function(){Al=!0}}),window.addEventListener("test",zo,zo),window.removeEventListener("test",zo,zo)}catch{Al=!1}var Wn=null,Ya=null,Ro=null;function Hs(){if(Ro)return Ro;var e,t=Ya,n=t.length,l,a="value"in Wn?Wn.value:Wn.textContent,i=a.length;for(e=0;e<n&&t[e]===a[e];e++);var d=n-e;for(l=1;l<=d&&t[n-l]===a[i-l];l++);return Ro=a.slice(e,1<l?1-l:void 0)}function Zl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function fa(){return!0}function ha(){return!1}function mn(e){function t(n,l,a,i,d){this._reactName=n,this._targetInst=a,this.type=l,this.nativeEvent=i,this.target=d,this.currentTarget=null;for(var h in e)e.hasOwnProperty(h)&&(n=e[h],this[h]=n?n(i):i[h]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?fa:ha,this.isPropagationStopped=ha,this}return $(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=fa)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=fa)},persist:function(){},isPersistent:fa}),t}var pl={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Xa=mn(pl),xl=$({},pl,{view:0,detail:0}),Bl=mn(xl),Ia,Kl,Un,Fl=$({},xl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Jl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Un&&(Un&&e.type==="mousemove"?(Ia=e.screenX-Un.screenX,Kl=e.screenY-Un.screenY):Kl=Ia=0,Un=e),Ia)},movementY:function(e){return"movementY"in e?e.movementY:Kl}}),Do=mn(Fl),qa=$({},Fl,{dataTransfer:0}),Vi=mn(qa),Qa=$({},xl,{relatedTarget:0}),Wa=mn(Qa),Us=$({},pl,{animationName:0,elapsedTime:0,pseudoElement:0}),Hc=mn(Us),Zi=$({},pl,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Ki=mn(Zi),ma=$({},pl,{data:0}),Ue=mn(ma),Ys={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Fi={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Uc={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Xs(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Uc[e])?!!t[e]:!1}function Jl(){return Xs}var Ga=$({},xl,{key:function(e){if(e.key){var t=Ys[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Zl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Fi[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Jl,charCode:function(e){return e.type==="keypress"?Zl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Zl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Ji=mn(Ga),Pi=$({},Fl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ga=mn(Pi),Is=$({},xl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Jl}),er=mn(Is),Va=$({},pl,{propertyName:0,elapsedTime:0,pseudoElement:0}),bl=mn(Va),Yc=$({},Fl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),qs=mn(Yc),Qs=$({},pl,{newState:0,oldState:0}),Za=mn(Qs),Xc=[9,13,27,32],Ws=rl&&"CompositionEvent"in window,cl=null;rl&&"documentMode"in document&&(cl=document.documentMode);var Gs=rl&&"TextEvent"in window&&!cl,Ka=rl&&(!Ws||cl&&8<cl&&11>=cl),tr=" ",No=!1;function oo(e,t){switch(e){case"keyup":return Xc.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function nr(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var ao=!1;function lr(e,t){switch(e){case"compositionend":return nr(t);case"keypress":return t.which!==32?null:(No=!0,tr);case"textInput":return e=t.data,e===tr&&No?null:e;default:return null}}function m(e,t){if(ao)return e==="compositionend"||!Ws&&oo(e,t)?(e=Hs(),Ro=Ya=Wn=null,ao=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Ka&&t.locale!=="ko"?null:t.data;default:return null}}var p={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function S(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!p[e.type]:t==="textarea"}function k(e,t,n,l){Wt?Gl?Gl.push(l):Gl=[l]:Wt=l,t=Wr(t,"onChange"),0<t.length&&(n=new Xa("onChange","change",null,n,l),e.push({event:n,listeners:t}))}var j=null,W=null;function re(e){t0(e,0)}function ce(e){var t=ua(e);if(Lc(t))return e}function ge(e,t){if(e==="change")return t}var Me=!1;if(rl){var ze;if(rl){var Ie="oninput"in document;if(!Ie){var dt=document.createElement("div");dt.setAttribute("oninput","return;"),Ie=typeof dt.oninput=="function"}ze=Ie}else ze=!1;Me=ze&&(!document.documentMode||9<document.documentMode)}function De(){j&&(j.detachEvent("onpropertychange",he),W=j=null)}function he(e){if(e.propertyName==="value"&&ce(W)){var t=[];k(t,W,e,Nl(e)),Vl(re,t)}}function ln(e,t,n){e==="focusin"?(De(),j=t,W=n,j.attachEvent("onpropertychange",he)):e==="focusout"&&De()}function At(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ce(W)}function un(e,t){if(e==="click")return ce(t)}function Rt(e,t){if(e==="input"||e==="change")return ce(t)}function on(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var ke=typeof Object.is=="function"?Object.is:on;function qe(e,t){if(ke(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),l=Object.keys(t);if(n.length!==l.length)return!1;for(l=0;l<n.length;l++){var a=n[l];if(!Ce.call(t,a)||!ke(e[a],t[a]))return!1}return!0}function Gt(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ft(e,t){var n=Gt(e);e=0;for(var l;n;){if(n.nodeType===3){if(l=e+n.textContent.length,e<=t&&l>=t)return{node:n,offset:t-e};e=l}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Gt(n)}}function Jn(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Jn(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Gn(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Eo(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Eo(e.document)}return t}function dn(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var ya=rl&&"documentMode"in document&&11>=document.documentMode,Pn=null,vl=null,Vt=null,wl=!1;function Pl(e,t,n){var l=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;wl||Pn==null||Pn!==Eo(l)||(l=Pn,"selectionStart"in l&&dn(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Vt&&qe(Vt,l)||(Vt=l,l=Wr(vl,"onSelect"),0<l.length&&(t=new Xa("onSelect","select",null,t,n),e.push({event:t,listeners:l}),t.target=Pn)))}function so(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ao={animationend:so("Animation","AnimationEnd"),animationiteration:so("Animation","AnimationIteration"),animationstart:so("Animation","AnimationStart"),transitionrun:so("Transition","TransitionRun"),transitionstart:so("Transition","TransitionStart"),transitioncancel:so("Transition","TransitionCancel"),transitionend:so("Transition","TransitionEnd")},Vs={},or={};rl&&(or=document.createElement("div").style,"AnimationEvent"in window||(delete Ao.animationend.animation,delete Ao.animationiteration.animation,delete Ao.animationstart.animation),"TransitionEvent"in window||delete Ao.transitionend.transition);function pa(e){if(Vs[e])return Vs[e];if(!Ao[e])return e;var t=Ao[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in or)return Vs[e]=t[n];return e}var z_=pa("animationend"),R_=pa("animationiteration"),D_=pa("animationstart"),fp=pa("transitionrun"),hp=pa("transitionstart"),mp=pa("transitioncancel"),N_=pa("transitionend"),A_=new Map,Ic="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Ic.push("scrollEnd");function Ol(e,t){A_.set(e,t),yl(t,[e])}var ar=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Sl=[],Fa=0,qc=0;function sr(){for(var e=Fa,t=qc=Fa=0;t<e;){var n=Sl[t];Sl[t++]=null;var l=Sl[t];Sl[t++]=null;var a=Sl[t];Sl[t++]=null;var i=Sl[t];if(Sl[t++]=null,l!==null&&a!==null){var d=l.pending;d===null?a.next=a:(a.next=d.next,d.next=a),l.pending=a}i!==0&&B_(n,a,i)}}function ir(e,t,n,l){Sl[Fa++]=e,Sl[Fa++]=t,Sl[Fa++]=n,Sl[Fa++]=l,qc|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function Qc(e,t,n,l){return ir(e,t,n,l),rr(e)}function xa(e,t){return ir(e,null,null,t),rr(e)}function B_(e,t,n){e.lanes|=n;var l=e.alternate;l!==null&&(l.lanes|=n);for(var a=!1,i=e.return;i!==null;)i.childLanes|=n,l=i.alternate,l!==null&&(l.childLanes|=n),i.tag===22&&(e=i.stateNode,e===null||e._visibility&1||(a=!0)),e=i,i=i.return;return e.tag===3?(i=e.stateNode,a&&t!==null&&(a=31-Re(n),e=i.hiddenUpdates,l=e[a],l===null?e[a]=[t]:l.push(t),t.lane=n|536870912),i):null}function rr(e){if(50<gi)throw gi=0,ed=null,Error(u(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Ja={};function gp(e,t,n,l){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ul(e,t,n,l){return new gp(e,t,n,l)}function Wc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function io(e,t){var n=e.alternate;return n===null?(n=ul(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function O_(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function cr(e,t,n,l,a,i){var d=0;if(l=e,typeof e=="function")Wc(e)&&(d=1);else if(typeof e=="string")d=v1(e,n,fe.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case rt:return e=ul(31,n,t,a),e.elementType=rt,e.lanes=i,e;case ne:return ba(n.children,a,i,t);case U:d=8,a|=24;break;case G:return e=ul(12,n,t,a|2),e.elementType=G,e.lanes=i,e;case _t:return e=ul(13,n,t,a),e.elementType=_t,e.lanes=i,e;case nt:return e=ul(19,n,t,a),e.elementType=nt,e.lanes=i,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case ve:d=10;break e;case _e:d=9;break e;case we:d=11;break e;case oe:d=14;break e;case ot:d=16,l=null;break e}d=29,n=Error(u(130,e===null?"null":typeof e,"")),l=null}return t=ul(d,n,t,a),t.elementType=e,t.type=l,t.lanes=i,t}function ba(e,t,n,l){return e=ul(7,e,l,t),e.lanes=n,e}function Gc(e,t,n){return e=ul(6,e,null,t),e.lanes=n,e}function L_(e){var t=ul(18,null,null,0);return t.stateNode=e,t}function Vc(e,t,n){return t=ul(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var $_=new WeakMap;function kl(e,t){if(typeof e=="object"&&e!==null){var n=$_.get(e);return n!==void 0?n:(t={value:e,source:t,stack:Z(t)},$_.set(e,t),t)}return{value:e,source:t,stack:Z(t)}}var Pa=[],es=0,ur=null,Zs=0,jl=[],Cl=0,Bo=null,eo=1,to="";function ro(e,t){Pa[es++]=Zs,Pa[es++]=ur,ur=e,Zs=t}function H_(e,t,n){jl[Cl++]=eo,jl[Cl++]=to,jl[Cl++]=Bo,Bo=e;var l=eo;e=to;var a=32-Re(l)-1;l&=~(1<<a),n+=1;var i=32-Re(t)+a;if(30<i){var d=a-a%5;i=(l&(1<<d)-1).toString(32),l>>=d,a-=d,eo=1<<32-Re(t)+a|n<<a|l,to=i+e}else eo=1<<i|n<<a|l,to=e}function Zc(e){e.return!==null&&(ro(e,1),H_(e,1,0))}function Kc(e){for(;e===ur;)ur=Pa[--es],Pa[es]=null,Zs=Pa[--es],Pa[es]=null;for(;e===Bo;)Bo=jl[--Cl],jl[Cl]=null,to=jl[--Cl],jl[Cl]=null,eo=jl[--Cl],jl[Cl]=null}function U_(e,t){jl[Cl++]=eo,jl[Cl++]=to,jl[Cl++]=Bo,eo=t.id,to=t.overflow,Bo=e}var zn=null,Jt=null,kt=!1,Oo=null,Ml=!1,Fc=Error(u(519));function Lo(e){var t=Error(u(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ks(kl(t,e)),Fc}function Y_(e){var t=e.stateNode,n=e.type,l=e.memoizedProps;switch(t[an]=e,t[Ln]=l,n){case"dialog":pt("cancel",t),pt("close",t);break;case"iframe":case"object":case"embed":pt("load",t);break;case"video":case"audio":for(n=0;n<pi.length;n++)pt(pi[n],t);break;case"source":pt("error",t);break;case"img":case"image":case"link":pt("error",t),pt("load",t);break;case"details":pt("toggle",t);break;case"input":pt("invalid",t),nn(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":pt("invalid",t);break;case"textarea":pt("invalid",t),qi(t,l.value,l.defaultValue,l.children)}n=l.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||l.suppressHydrationWarning===!0||a0(t.textContent,n)?(l.popover!=null&&(pt("beforetoggle",t),pt("toggle",t)),l.onScroll!=null&&pt("scroll",t),l.onScrollEnd!=null&&pt("scrollend",t),l.onClick!=null&&(t.onclick=Dl),t=!0):t=!1,t||Lo(e,!0)}function X_(e){for(zn=e.return;zn;)switch(zn.tag){case 5:case 31:case 13:Ml=!1;return;case 27:case 3:Ml=!0;return;default:zn=zn.return}}function ts(e){if(e!==zn)return!1;if(!kt)return X_(e),kt=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||md(e.type,e.memoizedProps)),n=!n),n&&Jt&&Lo(e),X_(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(317));Jt=h0(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(317));Jt=h0(e)}else t===27?(t=Jt,Fo(e.type)?(e=bd,bd=null,Jt=e):Jt=t):Jt=zn?Tl(e.stateNode.nextSibling):null;return!0}function va(){Jt=zn=null,kt=!1}function Jc(){var e=Oo;return e!==null&&(ll===null?ll=e:ll.push.apply(ll,e),Oo=null),e}function Ks(e){Oo===null?Oo=[e]:Oo.push(e)}var Pc=w(null),wa=null,co=null;function $o(e,t,n){ie(Pc,t._currentValue),t._currentValue=n}function uo(e){e._currentValue=Pc.current,I(Pc)}function eu(e,t,n){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===n)break;e=e.return}}function tu(e,t,n,l){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var i=a.dependencies;if(i!==null){var d=a.child;i=i.firstContext;e:for(;i!==null;){var h=i;i=a;for(var v=0;v<t.length;v++)if(h.context===t[v]){i.lanes|=n,h=i.alternate,h!==null&&(h.lanes|=n),eu(i.return,n,e),l||(d=null);break e}i=h.next}}else if(a.tag===18){if(d=a.return,d===null)throw Error(u(341));d.lanes|=n,i=d.alternate,i!==null&&(i.lanes|=n),eu(d,n,e),d=null}else d=a.child;if(d!==null)d.return=a;else for(d=a;d!==null;){if(d===e){d=null;break}if(a=d.sibling,a!==null){a.return=d.return,d=a;break}d=d.return}a=d}}function ns(e,t,n,l){e=null;for(var a=t,i=!1;a!==null;){if(!i){if((a.flags&524288)!==0)i=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var d=a.alternate;if(d===null)throw Error(u(387));if(d=d.memoizedProps,d!==null){var h=a.type;ke(a.pendingProps.value,d.value)||(e!==null?e.push(h):e=[h])}}else if(a===st.current){if(d=a.alternate,d===null)throw Error(u(387));d.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(Si):e=[Si])}a=a.return}e!==null&&tu(t,e,n,l),t.flags|=262144}function dr(e){for(e=e.firstContext;e!==null;){if(!ke(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Sa(e){wa=e,co=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Rn(e){return I_(wa,e)}function _r(e,t){return wa===null&&Sa(e),I_(e,t)}function I_(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},co===null){if(e===null)throw Error(u(308));co=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else co=co.next=t;return n}var yp=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},pp=s.unstable_scheduleCallback,xp=s.unstable_NormalPriority,gn={$$typeof:ve,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function nu(){return{controller:new yp,data:new Map,refCount:0}}function Fs(e){e.refCount--,e.refCount===0&&pp(xp,function(){e.controller.abort()})}var Js=null,lu=0,ls=0,os=null;function bp(e,t){if(Js===null){var n=Js=[];lu=0,ls=sd(),os={status:"pending",value:void 0,then:function(l){n.push(l)}}}return lu++,t.then(q_,q_),t}function q_(){if(--lu===0&&Js!==null){os!==null&&(os.status="fulfilled");var e=Js;Js=null,ls=0,os=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function vp(e,t){var n=[],l={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(l.status="rejected",l.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),l}var Q_=T.S;T.S=function(e,t){Th=Ge(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&bp(e,t),Q_!==null&&Q_(e,t)};var ka=w(null);function ou(){var e=ka.current;return e!==null?e:qt.pooledCache}function fr(e,t){t===null?ie(ka,ka.current):ie(ka,t.pool)}function W_(){var e=ou();return e===null?null:{parent:gn._currentValue,pool:e}}var as=Error(u(460)),au=Error(u(474)),hr=Error(u(542)),mr={then:function(){}};function G_(e){return e=e.status,e==="fulfilled"||e==="rejected"}function V_(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(Dl,Dl),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,K_(e),e;default:if(typeof t.status=="string")t.then(Dl,Dl);else{if(e=qt,e!==null&&100<e.shellSuspendCounter)throw Error(u(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=l}},function(l){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,K_(e),e}throw Ca=t,as}}function ja(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Ca=n,as):n}}var Ca=null;function Z_(){if(Ca===null)throw Error(u(459));var e=Ca;return Ca=null,e}function K_(e){if(e===as||e===hr)throw Error(u(483))}var ss=null,Ps=0;function gr(e){var t=Ps;return Ps+=1,ss===null&&(ss=[]),V_(ss,e,t)}function ei(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function yr(e,t){throw t.$$typeof===D?Error(u(525)):(e=Object.prototype.toString.call(t),Error(u(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function F_(e){function t(z,C){if(e){var A=z.deletions;A===null?(z.deletions=[C],z.flags|=16):A.push(C)}}function n(z,C){if(!e)return null;for(;C!==null;)t(z,C),C=C.sibling;return null}function l(z){for(var C=new Map;z!==null;)z.key!==null?C.set(z.key,z):C.set(z.index,z),z=z.sibling;return C}function a(z,C){return z=io(z,C),z.index=0,z.sibling=null,z}function i(z,C,A){return z.index=A,e?(A=z.alternate,A!==null?(A=A.index,A<C?(z.flags|=67108866,C):A):(z.flags|=67108866,C)):(z.flags|=1048576,C)}function d(z){return e&&z.alternate===null&&(z.flags|=67108866),z}function h(z,C,A,K){return C===null||C.tag!==6?(C=Gc(A,z.mode,K),C.return=z,C):(C=a(C,A),C.return=z,C)}function v(z,C,A,K){var Ae=A.type;return Ae===ne?q(z,C,A.props.children,K,A.key):C!==null&&(C.elementType===Ae||typeof Ae=="object"&&Ae!==null&&Ae.$$typeof===ot&&ja(Ae)===C.type)?(C=a(C,A.props),ei(C,A),C.return=z,C):(C=cr(A.type,A.key,A.props,null,z.mode,K),ei(C,A),C.return=z,C)}function B(z,C,A,K){return C===null||C.tag!==4||C.stateNode.containerInfo!==A.containerInfo||C.stateNode.implementation!==A.implementation?(C=Vc(A,z.mode,K),C.return=z,C):(C=a(C,A.children||[]),C.return=z,C)}function q(z,C,A,K,Ae){return C===null||C.tag!==7?(C=ba(A,z.mode,K,Ae),C.return=z,C):(C=a(C,A),C.return=z,C)}function J(z,C,A){if(typeof C=="string"&&C!==""||typeof C=="number"||typeof C=="bigint")return C=Gc(""+C,z.mode,A),C.return=z,C;if(typeof C=="object"&&C!==null){switch(C.$$typeof){case ue:return A=cr(C.type,C.key,C.props,null,z.mode,A),ei(A,C),A.return=z,A;case H:return C=Vc(C,z.mode,A),C.return=z,C;case ot:return C=ja(C),J(z,C,A)}if(Qe(C)||tt(C))return C=ba(C,z.mode,A,null),C.return=z,C;if(typeof C.then=="function")return J(z,gr(C),A);if(C.$$typeof===ve)return J(z,_r(z,C),A);yr(z,C)}return null}function L(z,C,A,K){var Ae=C!==null?C.key:null;if(typeof A=="string"&&A!==""||typeof A=="number"||typeof A=="bigint")return Ae!==null?null:h(z,C,""+A,K);if(typeof A=="object"&&A!==null){switch(A.$$typeof){case ue:return A.key===Ae?v(z,C,A,K):null;case H:return A.key===Ae?B(z,C,A,K):null;case ot:return A=ja(A),L(z,C,A,K)}if(Qe(A)||tt(A))return Ae!==null?null:q(z,C,A,K,null);if(typeof A.then=="function")return L(z,C,gr(A),K);if(A.$$typeof===ve)return L(z,C,_r(z,A),K);yr(z,A)}return null}function Y(z,C,A,K,Ae){if(typeof K=="string"&&K!==""||typeof K=="number"||typeof K=="bigint")return z=z.get(A)||null,h(C,z,""+K,Ae);if(typeof K=="object"&&K!==null){switch(K.$$typeof){case ue:return z=z.get(K.key===null?A:K.key)||null,v(C,z,K,Ae);case H:return z=z.get(K.key===null?A:K.key)||null,B(C,z,K,Ae);case ot:return K=ja(K),Y(z,C,A,K,Ae)}if(Qe(K)||tt(K))return z=z.get(A)||null,q(C,z,K,Ae,null);if(typeof K.then=="function")return Y(z,C,A,gr(K),Ae);if(K.$$typeof===ve)return Y(z,C,A,_r(C,K),Ae);yr(C,K)}return null}function be(z,C,A,K){for(var Ae=null,Et=null,Ee=C,ct=C=0,wt=null;Ee!==null&&ct<A.length;ct++){Ee.index>ct?(wt=Ee,Ee=null):wt=Ee.sibling;var Tt=L(z,Ee,A[ct],K);if(Tt===null){Ee===null&&(Ee=wt);break}e&&Ee&&Tt.alternate===null&&t(z,Ee),C=i(Tt,C,ct),Et===null?Ae=Tt:Et.sibling=Tt,Et=Tt,Ee=wt}if(ct===A.length)return n(z,Ee),kt&&ro(z,ct),Ae;if(Ee===null){for(;ct<A.length;ct++)Ee=J(z,A[ct],K),Ee!==null&&(C=i(Ee,C,ct),Et===null?Ae=Ee:Et.sibling=Ee,Et=Ee);return kt&&ro(z,ct),Ae}for(Ee=l(Ee);ct<A.length;ct++)wt=Y(Ee,z,ct,A[ct],K),wt!==null&&(e&&wt.alternate!==null&&Ee.delete(wt.key===null?ct:wt.key),C=i(wt,C,ct),Et===null?Ae=wt:Et.sibling=wt,Et=wt);return e&&Ee.forEach(function(na){return t(z,na)}),kt&&ro(z,ct),Ae}function Xe(z,C,A,K){if(A==null)throw Error(u(151));for(var Ae=null,Et=null,Ee=C,ct=C=0,wt=null,Tt=A.next();Ee!==null&&!Tt.done;ct++,Tt=A.next()){Ee.index>ct?(wt=Ee,Ee=null):wt=Ee.sibling;var na=L(z,Ee,Tt.value,K);if(na===null){Ee===null&&(Ee=wt);break}e&&Ee&&na.alternate===null&&t(z,Ee),C=i(na,C,ct),Et===null?Ae=na:Et.sibling=na,Et=na,Ee=wt}if(Tt.done)return n(z,Ee),kt&&ro(z,ct),Ae;if(Ee===null){for(;!Tt.done;ct++,Tt=A.next())Tt=J(z,Tt.value,K),Tt!==null&&(C=i(Tt,C,ct),Et===null?Ae=Tt:Et.sibling=Tt,Et=Tt);return kt&&ro(z,ct),Ae}for(Ee=l(Ee);!Tt.done;ct++,Tt=A.next())Tt=Y(Ee,z,ct,Tt.value,K),Tt!==null&&(e&&Tt.alternate!==null&&Ee.delete(Tt.key===null?ct:Tt.key),C=i(Tt,C,ct),Et===null?Ae=Tt:Et.sibling=Tt,Et=Tt);return e&&Ee.forEach(function(D1){return t(z,D1)}),kt&&ro(z,ct),Ae}function Xt(z,C,A,K){if(typeof A=="object"&&A!==null&&A.type===ne&&A.key===null&&(A=A.props.children),typeof A=="object"&&A!==null){switch(A.$$typeof){case ue:e:{for(var Ae=A.key;C!==null;){if(C.key===Ae){if(Ae=A.type,Ae===ne){if(C.tag===7){n(z,C.sibling),K=a(C,A.props.children),K.return=z,z=K;break e}}else if(C.elementType===Ae||typeof Ae=="object"&&Ae!==null&&Ae.$$typeof===ot&&ja(Ae)===C.type){n(z,C.sibling),K=a(C,A.props),ei(K,A),K.return=z,z=K;break e}n(z,C);break}else t(z,C);C=C.sibling}A.type===ne?(K=ba(A.props.children,z.mode,K,A.key),K.return=z,z=K):(K=cr(A.type,A.key,A.props,null,z.mode,K),ei(K,A),K.return=z,z=K)}return d(z);case H:e:{for(Ae=A.key;C!==null;){if(C.key===Ae)if(C.tag===4&&C.stateNode.containerInfo===A.containerInfo&&C.stateNode.implementation===A.implementation){n(z,C.sibling),K=a(C,A.children||[]),K.return=z,z=K;break e}else{n(z,C);break}else t(z,C);C=C.sibling}K=Vc(A,z.mode,K),K.return=z,z=K}return d(z);case ot:return A=ja(A),Xt(z,C,A,K)}if(Qe(A))return be(z,C,A,K);if(tt(A)){if(Ae=tt(A),typeof Ae!="function")throw Error(u(150));return A=Ae.call(A),Xe(z,C,A,K)}if(typeof A.then=="function")return Xt(z,C,gr(A),K);if(A.$$typeof===ve)return Xt(z,C,_r(z,A),K);yr(z,A)}return typeof A=="string"&&A!==""||typeof A=="number"||typeof A=="bigint"?(A=""+A,C!==null&&C.tag===6?(n(z,C.sibling),K=a(C,A),K.return=z,z=K):(n(z,C),K=Gc(A,z.mode,K),K.return=z,z=K),d(z)):n(z,C)}return function(z,C,A,K){try{Ps=0;var Ae=Xt(z,C,A,K);return ss=null,Ae}catch(Ee){if(Ee===as||Ee===hr)throw Ee;var Et=ul(29,Ee,null,z.mode);return Et.lanes=K,Et.return=z,Et}}}var Ma=F_(!0),J_=F_(!1),Ho=!1;function su(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function iu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Uo(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Yo(e,t,n){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(Dt&2)!==0){var a=l.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),l.pending=t,t=rr(e),B_(e,null,n),t}return ir(e,l,t,n),rr(e)}function ti(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,Bn(e,n)}}function ru(e,t){var n=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,n===l)){var a=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var d={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};i===null?a=i=d:i=i.next=d,n=n.next}while(n!==null);i===null?a=i=t:i=i.next=t}else a=i=t;n={baseState:l.baseState,firstBaseUpdate:a,lastBaseUpdate:i,shared:l.shared,callbacks:l.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var cu=!1;function ni(){if(cu){var e=os;if(e!==null)throw e}}function li(e,t,n,l){cu=!1;var a=e.updateQueue;Ho=!1;var i=a.firstBaseUpdate,d=a.lastBaseUpdate,h=a.shared.pending;if(h!==null){a.shared.pending=null;var v=h,B=v.next;v.next=null,d===null?i=B:d.next=B,d=v;var q=e.alternate;q!==null&&(q=q.updateQueue,h=q.lastBaseUpdate,h!==d&&(h===null?q.firstBaseUpdate=B:h.next=B,q.lastBaseUpdate=v))}if(i!==null){var J=a.baseState;d=0,q=B=v=null,h=i;do{var L=h.lane&-536870913,Y=L!==h.lane;if(Y?(vt&L)===L:(l&L)===L){L!==0&&L===ls&&(cu=!0),q!==null&&(q=q.next={lane:0,tag:h.tag,payload:h.payload,callback:null,next:null});e:{var be=e,Xe=h;L=t;var Xt=n;switch(Xe.tag){case 1:if(be=Xe.payload,typeof be=="function"){J=be.call(Xt,J,L);break e}J=be;break e;case 3:be.flags=be.flags&-65537|128;case 0:if(be=Xe.payload,L=typeof be=="function"?be.call(Xt,J,L):be,L==null)break e;J=$({},J,L);break e;case 2:Ho=!0}}L=h.callback,L!==null&&(e.flags|=64,Y&&(e.flags|=8192),Y=a.callbacks,Y===null?a.callbacks=[L]:Y.push(L))}else Y={lane:L,tag:h.tag,payload:h.payload,callback:h.callback,next:null},q===null?(B=q=Y,v=J):q=q.next=Y,d|=L;if(h=h.next,h===null){if(h=a.shared.pending,h===null)break;Y=h,h=Y.next,Y.next=null,a.lastBaseUpdate=Y,a.shared.pending=null}}while(!0);q===null&&(v=J),a.baseState=v,a.firstBaseUpdate=B,a.lastBaseUpdate=q,i===null&&(a.shared.lanes=0),Wo|=d,e.lanes=d,e.memoizedState=J}}function P_(e,t){if(typeof e!="function")throw Error(u(191,e));e.call(t)}function ef(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)P_(n[e],t)}var is=w(null),pr=w(0);function tf(e,t){e=bo,ie(pr,e),ie(is,t),bo=e|t.baseLanes}function uu(){ie(pr,bo),ie(is,is.current)}function du(){bo=pr.current,I(is),I(pr)}var dl=w(null),El=null;function Xo(e){var t=e.alternate;ie(_n,_n.current&1),ie(dl,e),El===null&&(t===null||is.current!==null||t.memoizedState!==null)&&(El=e)}function _u(e){ie(_n,_n.current),ie(dl,e),El===null&&(El=e)}function nf(e){e.tag===22?(ie(_n,_n.current),ie(dl,e),El===null&&(El=e)):Io()}function Io(){ie(_n,_n.current),ie(dl,dl.current)}function _l(e){I(dl),El===e&&(El=null),I(_n)}var _n=w(0);function xr(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||pd(n)||xd(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var _o=0,it=null,Ut=null,yn=null,br=!1,rs=!1,Ea=!1,vr=0,oi=0,cs=null,wp=0;function sn(){throw Error(u(321))}function fu(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!ke(e[n],t[n]))return!1;return!0}function hu(e,t,n,l,a,i){return _o=i,it=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,T.H=e===null||e.memoizedState===null?Uf:Tu,Ea=!1,i=n(l,a),Ea=!1,rs&&(i=of(t,n,l,a)),lf(e),i}function lf(e){T.H=ii;var t=Ut!==null&&Ut.next!==null;if(_o=0,yn=Ut=it=null,br=!1,oi=0,cs=null,t)throw Error(u(300));e===null||pn||(e=e.dependencies,e!==null&&dr(e)&&(pn=!0))}function of(e,t,n,l){it=e;var a=0;do{if(rs&&(cs=null),oi=0,rs=!1,25<=a)throw Error(u(301));if(a+=1,yn=Ut=null,e.updateQueue!=null){var i=e.updateQueue;i.lastEffect=null,i.events=null,i.stores=null,i.memoCache!=null&&(i.memoCache.index=0)}T.H=Yf,i=t(n,l)}while(rs);return i}function Sp(){var e=T.H,t=e.useState()[0];return t=typeof t.then=="function"?ai(t):t,e=e.useState()[0],(Ut!==null?Ut.memoizedState:null)!==e&&(it.flags|=1024),t}function mu(){var e=vr!==0;return vr=0,e}function gu(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function yu(e){if(br){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}br=!1}_o=0,yn=Ut=it=null,rs=!1,oi=vr=0,cs=null}function Vn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return yn===null?it.memoizedState=yn=e:yn=yn.next=e,yn}function fn(){if(Ut===null){var e=it.alternate;e=e!==null?e.memoizedState:null}else e=Ut.next;var t=yn===null?it.memoizedState:yn.next;if(t!==null)yn=t,Ut=e;else{if(e===null)throw it.alternate===null?Error(u(467)):Error(u(310));Ut=e,e={memoizedState:Ut.memoizedState,baseState:Ut.baseState,baseQueue:Ut.baseQueue,queue:Ut.queue,next:null},yn===null?it.memoizedState=yn=e:yn=yn.next=e}return yn}function wr(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ai(e){var t=oi;return oi+=1,cs===null&&(cs=[]),e=V_(cs,e,t),t=it,(yn===null?t.memoizedState:yn.next)===null&&(t=t.alternate,T.H=t===null||t.memoizedState===null?Uf:Tu),e}function Sr(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return ai(e);if(e.$$typeof===ve)return Rn(e)}throw Error(u(438,String(e)))}function pu(e){var t=null,n=it.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var l=it.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=wr(),it.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),l=0;l<e;l++)n[l]=at;return t.index++,n}function fo(e,t){return typeof t=="function"?t(e):t}function kr(e){var t=fn();return xu(t,Ut,e)}function xu(e,t,n){var l=e.queue;if(l===null)throw Error(u(311));l.lastRenderedReducer=n;var a=e.baseQueue,i=l.pending;if(i!==null){if(a!==null){var d=a.next;a.next=i.next,i.next=d}t.baseQueue=a=i,l.pending=null}if(i=e.baseState,a===null)e.memoizedState=i;else{t=a.next;var h=d=null,v=null,B=t,q=!1;do{var J=B.lane&-536870913;if(J!==B.lane?(vt&J)===J:(_o&J)===J){var L=B.revertLane;if(L===0)v!==null&&(v=v.next={lane:0,revertLane:0,gesture:null,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null}),J===ls&&(q=!0);else if((_o&L)===L){B=B.next,L===ls&&(q=!0);continue}else J={lane:0,revertLane:B.revertLane,gesture:null,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null},v===null?(h=v=J,d=i):v=v.next=J,it.lanes|=L,Wo|=L;J=B.action,Ea&&n(i,J),i=B.hasEagerState?B.eagerState:n(i,J)}else L={lane:J,revertLane:B.revertLane,gesture:B.gesture,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null},v===null?(h=v=L,d=i):v=v.next=L,it.lanes|=J,Wo|=J;B=B.next}while(B!==null&&B!==t);if(v===null?d=i:v.next=h,!ke(i,e.memoizedState)&&(pn=!0,q&&(n=os,n!==null)))throw n;e.memoizedState=i,e.baseState=d,e.baseQueue=v,l.lastRenderedState=i}return a===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function bu(e){var t=fn(),n=t.queue;if(n===null)throw Error(u(311));n.lastRenderedReducer=e;var l=n.dispatch,a=n.pending,i=t.memoizedState;if(a!==null){n.pending=null;var d=a=a.next;do i=e(i,d.action),d=d.next;while(d!==a);ke(i,t.memoizedState)||(pn=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,l]}function af(e,t,n){var l=it,a=fn(),i=kt;if(i){if(n===void 0)throw Error(u(407));n=n()}else n=t();var d=!ke((Ut||a).memoizedState,n);if(d&&(a.memoizedState=n,pn=!0),a=a.queue,Su(cf.bind(null,l,a,e),[e]),a.getSnapshot!==t||d||yn!==null&&yn.memoizedState.tag&1){if(l.flags|=2048,us(9,{destroy:void 0},rf.bind(null,l,a,n,t),null),qt===null)throw Error(u(349));i||(_o&127)!==0||sf(l,t,n)}return n}function sf(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=it.updateQueue,t===null?(t=wr(),it.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function rf(e,t,n,l){t.value=n,t.getSnapshot=l,uf(t)&&df(e)}function cf(e,t,n){return n(function(){uf(t)&&df(e)})}function uf(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!ke(e,n)}catch{return!0}}function df(e){var t=xa(e,2);t!==null&&ol(t,e,2)}function vu(e){var t=Vn();if(typeof e=="function"){var n=e;if(e=n(),Ea){le(!0);try{n()}finally{le(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:fo,lastRenderedState:e},t}function _f(e,t,n,l){return e.baseState=n,xu(e,Ut,typeof l=="function"?l:fo)}function kp(e,t,n,l,a){if(Mr(e))throw Error(u(485));if(e=t.action,e!==null){var i={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(d){i.listeners.push(d)}};T.T!==null?n(!0):i.isTransition=!1,l(i),n=t.pending,n===null?(i.next=t.pending=i,ff(t,i)):(i.next=n.next,t.pending=n.next=i)}}function ff(e,t){var n=t.action,l=t.payload,a=e.state;if(t.isTransition){var i=T.T,d={};T.T=d;try{var h=n(a,l),v=T.S;v!==null&&v(d,h),hf(e,t,h)}catch(B){wu(e,t,B)}finally{i!==null&&d.types!==null&&(i.types=d.types),T.T=i}}else try{i=n(a,l),hf(e,t,i)}catch(B){wu(e,t,B)}}function hf(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(l){mf(e,t,l)},function(l){return wu(e,t,l)}):mf(e,t,n)}function mf(e,t,n){t.status="fulfilled",t.value=n,gf(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,ff(e,n)))}function wu(e,t,n){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=n,gf(t),t=t.next;while(t!==l)}e.action=null}function gf(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function yf(e,t){return t}function pf(e,t){if(kt){var n=qt.formState;if(n!==null){e:{var l=it;if(kt){if(Jt){t:{for(var a=Jt,i=Ml;a.nodeType!==8;){if(!i){a=null;break t}if(a=Tl(a.nextSibling),a===null){a=null;break t}}i=a.data,a=i==="F!"||i==="F"?a:null}if(a){Jt=Tl(a.nextSibling),l=a.data==="F!";break e}}Lo(l)}l=!1}l&&(t=n[0])}}return n=Vn(),n.memoizedState=n.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:yf,lastRenderedState:t},n.queue=l,n=Lf.bind(null,it,l),l.dispatch=n,l=vu(!1),i=Eu.bind(null,it,!1,l.queue),l=Vn(),a={state:t,dispatch:null,action:e,pending:null},l.queue=a,n=kp.bind(null,it,a,i,n),a.dispatch=n,l.memoizedState=e,[t,n,!1]}function xf(e){var t=fn();return bf(t,Ut,e)}function bf(e,t,n){if(t=xu(e,t,yf)[0],e=kr(fo)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=ai(t)}catch(d){throw d===as?hr:d}else l=t;t=fn();var a=t.queue,i=a.dispatch;return n!==t.memoizedState&&(it.flags|=2048,us(9,{destroy:void 0},jp.bind(null,a,n),null)),[l,i,e]}function jp(e,t){e.action=t}function vf(e){var t=fn(),n=Ut;if(n!==null)return bf(t,n,e);fn(),t=t.memoizedState,n=fn();var l=n.queue.dispatch;return n.memoizedState=e,[t,l,!1]}function us(e,t,n,l){return e={tag:e,create:n,deps:l,inst:t,next:null},t=it.updateQueue,t===null&&(t=wr(),it.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(l=n.next,n.next=e,e.next=l,t.lastEffect=e),e}function wf(){return fn().memoizedState}function jr(e,t,n,l){var a=Vn();it.flags|=e,a.memoizedState=us(1|t,{destroy:void 0},n,l===void 0?null:l)}function Cr(e,t,n,l){var a=fn();l=l===void 0?null:l;var i=a.memoizedState.inst;Ut!==null&&l!==null&&fu(l,Ut.memoizedState.deps)?a.memoizedState=us(t,i,n,l):(it.flags|=e,a.memoizedState=us(1|t,i,n,l))}function Sf(e,t){jr(8390656,8,e,t)}function Su(e,t){Cr(2048,8,e,t)}function Cp(e){it.flags|=4;var t=it.updateQueue;if(t===null)t=wr(),it.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function kf(e){var t=fn().memoizedState;return Cp({ref:t,nextImpl:e}),function(){if((Dt&2)!==0)throw Error(u(440));return t.impl.apply(void 0,arguments)}}function jf(e,t){return Cr(4,2,e,t)}function Cf(e,t){return Cr(4,4,e,t)}function Mf(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ef(e,t,n){n=n!=null?n.concat([e]):null,Cr(4,4,Mf.bind(null,t,e),n)}function ku(){}function Tf(e,t){var n=fn();t=t===void 0?null:t;var l=n.memoizedState;return t!==null&&fu(t,l[1])?l[0]:(n.memoizedState=[e,t],e)}function zf(e,t){var n=fn();t=t===void 0?null:t;var l=n.memoizedState;if(t!==null&&fu(t,l[1]))return l[0];if(l=e(),Ea){le(!0);try{e()}finally{le(!1)}}return n.memoizedState=[l,t],l}function ju(e,t,n){return n===void 0||(_o&1073741824)!==0&&(vt&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Rh(),it.lanes|=e,Wo|=e,n)}function Rf(e,t,n,l){return ke(n,t)?n:is.current!==null?(e=ju(e,n,l),ke(e,t)||(pn=!0),e):(_o&42)===0||(_o&1073741824)!==0&&(vt&261930)===0?(pn=!0,e.memoizedState=n):(e=Rh(),it.lanes|=e,Wo|=e,t)}function Df(e,t,n,l,a){var i=ae.p;ae.p=i!==0&&8>i?i:8;var d=T.T,h={};T.T=h,Eu(e,!1,t,n);try{var v=a(),B=T.S;if(B!==null&&B(h,v),v!==null&&typeof v=="object"&&typeof v.then=="function"){var q=vp(v,l);si(e,t,q,ml(e))}else si(e,t,l,ml(e))}catch(J){si(e,t,{then:function(){},status:"rejected",reason:J},ml())}finally{ae.p=i,d!==null&&h.types!==null&&(d.types=h.types),T.T=d}}function Mp(){}function Cu(e,t,n,l){if(e.tag!==5)throw Error(u(476));var a=Nf(e).queue;Df(e,a,t,X,n===null?Mp:function(){return Af(e),n(l)})}function Nf(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:X,baseState:X,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:fo,lastRenderedState:X},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:fo,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Af(e){var t=Nf(e);t.next===null&&(t=e.alternate.memoizedState),si(e,t.next.queue,{},ml())}function Mu(){return Rn(Si)}function Bf(){return fn().memoizedState}function Of(){return fn().memoizedState}function Ep(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=ml();e=Uo(n);var l=Yo(t,e,n);l!==null&&(ol(l,t,n),ti(l,t,n)),t={cache:nu()},e.payload=t;return}t=t.return}}function Tp(e,t,n){var l=ml();n={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Mr(e)?$f(t,n):(n=Qc(e,t,n,l),n!==null&&(ol(n,e,l),Hf(n,t,l)))}function Lf(e,t,n){var l=ml();si(e,t,n,l)}function si(e,t,n,l){var a={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Mr(e))$f(t,a);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var d=t.lastRenderedState,h=i(d,n);if(a.hasEagerState=!0,a.eagerState=h,ke(h,d))return ir(e,t,a,0),qt===null&&sr(),!1}catch{}if(n=Qc(e,t,a,l),n!==null)return ol(n,e,l),Hf(n,t,l),!0}return!1}function Eu(e,t,n,l){if(l={lane:2,revertLane:sd(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Mr(e)){if(t)throw Error(u(479))}else t=Qc(e,n,l,2),t!==null&&ol(t,e,2)}function Mr(e){var t=e.alternate;return e===it||t!==null&&t===it}function $f(e,t){rs=br=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Hf(e,t,n){if((n&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,Bn(e,n)}}var ii={readContext:Rn,use:Sr,useCallback:sn,useContext:sn,useEffect:sn,useImperativeHandle:sn,useLayoutEffect:sn,useInsertionEffect:sn,useMemo:sn,useReducer:sn,useRef:sn,useState:sn,useDebugValue:sn,useDeferredValue:sn,useTransition:sn,useSyncExternalStore:sn,useId:sn,useHostTransitionStatus:sn,useFormState:sn,useActionState:sn,useOptimistic:sn,useMemoCache:sn,useCacheRefresh:sn};ii.useEffectEvent=sn;var Uf={readContext:Rn,use:Sr,useCallback:function(e,t){return Vn().memoizedState=[e,t===void 0?null:t],e},useContext:Rn,useEffect:Sf,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,jr(4194308,4,Mf.bind(null,t,e),n)},useLayoutEffect:function(e,t){return jr(4194308,4,e,t)},useInsertionEffect:function(e,t){jr(4,2,e,t)},useMemo:function(e,t){var n=Vn();t=t===void 0?null:t;var l=e();if(Ea){le(!0);try{e()}finally{le(!1)}}return n.memoizedState=[l,t],l},useReducer:function(e,t,n){var l=Vn();if(n!==void 0){var a=n(t);if(Ea){le(!0);try{n(t)}finally{le(!1)}}}else a=t;return l.memoizedState=l.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},l.queue=e,e=e.dispatch=Tp.bind(null,it,e),[l.memoizedState,e]},useRef:function(e){var t=Vn();return e={current:e},t.memoizedState=e},useState:function(e){e=vu(e);var t=e.queue,n=Lf.bind(null,it,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:ku,useDeferredValue:function(e,t){var n=Vn();return ju(n,e,t)},useTransition:function(){var e=vu(!1);return e=Df.bind(null,it,e.queue,!0,!1),Vn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var l=it,a=Vn();if(kt){if(n===void 0)throw Error(u(407));n=n()}else{if(n=t(),qt===null)throw Error(u(349));(vt&127)!==0||sf(l,t,n)}a.memoizedState=n;var i={value:n,getSnapshot:t};return a.queue=i,Sf(cf.bind(null,l,i,e),[e]),l.flags|=2048,us(9,{destroy:void 0},rf.bind(null,l,i,n,t),null),n},useId:function(){var e=Vn(),t=qt.identifierPrefix;if(kt){var n=to,l=eo;n=(l&~(1<<32-Re(l)-1)).toString(32)+n,t="_"+t+"R_"+n,n=vr++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=wp++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Mu,useFormState:pf,useActionState:pf,useOptimistic:function(e){var t=Vn();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Eu.bind(null,it,!0,n),n.dispatch=t,[e,t]},useMemoCache:pu,useCacheRefresh:function(){return Vn().memoizedState=Ep.bind(null,it)},useEffectEvent:function(e){var t=Vn(),n={impl:e};return t.memoizedState=n,function(){if((Dt&2)!==0)throw Error(u(440));return n.impl.apply(void 0,arguments)}}},Tu={readContext:Rn,use:Sr,useCallback:Tf,useContext:Rn,useEffect:Su,useImperativeHandle:Ef,useInsertionEffect:jf,useLayoutEffect:Cf,useMemo:zf,useReducer:kr,useRef:wf,useState:function(){return kr(fo)},useDebugValue:ku,useDeferredValue:function(e,t){var n=fn();return Rf(n,Ut.memoizedState,e,t)},useTransition:function(){var e=kr(fo)[0],t=fn().memoizedState;return[typeof e=="boolean"?e:ai(e),t]},useSyncExternalStore:af,useId:Bf,useHostTransitionStatus:Mu,useFormState:xf,useActionState:xf,useOptimistic:function(e,t){var n=fn();return _f(n,Ut,e,t)},useMemoCache:pu,useCacheRefresh:Of};Tu.useEffectEvent=kf;var Yf={readContext:Rn,use:Sr,useCallback:Tf,useContext:Rn,useEffect:Su,useImperativeHandle:Ef,useInsertionEffect:jf,useLayoutEffect:Cf,useMemo:zf,useReducer:bu,useRef:wf,useState:function(){return bu(fo)},useDebugValue:ku,useDeferredValue:function(e,t){var n=fn();return Ut===null?ju(n,e,t):Rf(n,Ut.memoizedState,e,t)},useTransition:function(){var e=bu(fo)[0],t=fn().memoizedState;return[typeof e=="boolean"?e:ai(e),t]},useSyncExternalStore:af,useId:Bf,useHostTransitionStatus:Mu,useFormState:vf,useActionState:vf,useOptimistic:function(e,t){var n=fn();return Ut!==null?_f(n,Ut,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:pu,useCacheRefresh:Of};Yf.useEffectEvent=kf;function zu(e,t,n,l){t=e.memoizedState,n=n(l,t),n=n==null?t:$({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ru={enqueueSetState:function(e,t,n){e=e._reactInternals;var l=ml(),a=Uo(l);a.payload=t,n!=null&&(a.callback=n),t=Yo(e,a,l),t!==null&&(ol(t,e,l),ti(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var l=ml(),a=Uo(l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=Yo(e,a,l),t!==null&&(ol(t,e,l),ti(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ml(),l=Uo(n);l.tag=2,t!=null&&(l.callback=t),t=Yo(e,l,n),t!==null&&(ol(t,e,n),ti(t,e,n))}};function Xf(e,t,n,l,a,i,d){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,i,d):t.prototype&&t.prototype.isPureReactComponent?!qe(n,l)||!qe(a,i):!0}function If(e,t,n,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,l),t.state!==e&&Ru.enqueueReplaceState(t,t.state,null)}function Ta(e,t){var n=t;if("ref"in t){n={};for(var l in t)l!=="ref"&&(n[l]=t[l])}if(e=e.defaultProps){n===t&&(n=$({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function qf(e){ar(e)}function Qf(e){console.error(e)}function Wf(e){ar(e)}function Er(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function Gf(e,t,n){try{var l=e.onCaughtError;l(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function Du(e,t,n){return n=Uo(n),n.tag=3,n.payload={element:null},n.callback=function(){Er(e,t)},n}function Vf(e){return e=Uo(e),e.tag=3,e}function Zf(e,t,n,l){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var i=l.value;e.payload=function(){return a(i)},e.callback=function(){Gf(t,n,l)}}var d=n.stateNode;d!==null&&typeof d.componentDidCatch=="function"&&(e.callback=function(){Gf(t,n,l),typeof a!="function"&&(Go===null?Go=new Set([this]):Go.add(this));var h=l.stack;this.componentDidCatch(l.value,{componentStack:h!==null?h:""})})}function zp(e,t,n,l,a){if(n.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=n.alternate,t!==null&&ns(t,n,a,!0),n=dl.current,n!==null){switch(n.tag){case 31:case 13:return El===null?Ur():n.alternate===null&&rn===0&&(rn=3),n.flags&=-257,n.flags|=65536,n.lanes=a,l===mr?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([l]):t.add(l),ld(e,l,a)),!1;case 22:return n.flags|=65536,l===mr?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([l]):n.add(l)),ld(e,l,a)),!1}throw Error(u(435,n.tag))}return ld(e,l,a),Ur(),!1}if(kt)return t=dl.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,l!==Fc&&(e=Error(u(422),{cause:l}),Ks(kl(e,n)))):(l!==Fc&&(t=Error(u(423),{cause:l}),Ks(kl(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,l=kl(l,n),a=Du(e.stateNode,l,a),ru(e,a),rn!==4&&(rn=2)),!1;var i=Error(u(520),{cause:l});if(i=kl(i,n),mi===null?mi=[i]:mi.push(i),rn!==4&&(rn=2),t===null)return!0;l=kl(l,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Du(n.stateNode,l,e),ru(n,e),!1;case 1:if(t=n.type,i=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||i!==null&&typeof i.componentDidCatch=="function"&&(Go===null||!Go.has(i))))return n.flags|=65536,a&=-a,n.lanes|=a,a=Vf(a),Zf(a,e,n,l),ru(n,a),!1}n=n.return}while(n!==null);return!1}var Nu=Error(u(461)),pn=!1;function Dn(e,t,n,l){t.child=e===null?J_(t,null,n,l):Ma(t,e.child,n,l)}function Kf(e,t,n,l,a){n=n.render;var i=t.ref;if("ref"in l){var d={};for(var h in l)h!=="ref"&&(d[h]=l[h])}else d=l;return Sa(t),l=hu(e,t,n,d,i,a),h=mu(),e!==null&&!pn?(gu(e,t,a),ho(e,t,a)):(kt&&h&&Zc(t),t.flags|=1,Dn(e,t,l,a),t.child)}function Ff(e,t,n,l,a){if(e===null){var i=n.type;return typeof i=="function"&&!Wc(i)&&i.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=i,Jf(e,t,i,l,a)):(e=cr(n.type,null,l,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!Yu(e,a)){var d=i.memoizedProps;if(n=n.compare,n=n!==null?n:qe,n(d,l)&&e.ref===t.ref)return ho(e,t,a)}return t.flags|=1,e=io(i,l),e.ref=t.ref,e.return=t,t.child=e}function Jf(e,t,n,l,a){if(e!==null){var i=e.memoizedProps;if(qe(i,l)&&e.ref===t.ref)if(pn=!1,t.pendingProps=l=i,Yu(e,a))(e.flags&131072)!==0&&(pn=!0);else return t.lanes=e.lanes,ho(e,t,a)}return Au(e,t,n,l,a)}function Pf(e,t,n,l){var a=l.children,i=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(i=i!==null?i.baseLanes|n:n,e!==null){for(l=t.child=e.child,a=0;l!==null;)a=a|l.lanes|l.childLanes,l=l.sibling;l=a&~i}else l=0,t.child=null;return eh(e,t,i,n,l)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&fr(t,i!==null?i.cachePool:null),i!==null?tf(t,i):uu(),nf(t);else return l=t.lanes=536870912,eh(e,t,i!==null?i.baseLanes|n:n,n,l)}else i!==null?(fr(t,i.cachePool),tf(t,i),Io(),t.memoizedState=null):(e!==null&&fr(t,null),uu(),Io());return Dn(e,t,a,n),t.child}function ri(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function eh(e,t,n,l,a){var i=ou();return i=i===null?null:{parent:gn._currentValue,pool:i},t.memoizedState={baseLanes:n,cachePool:i},e!==null&&fr(t,null),uu(),nf(t),e!==null&&ns(e,t,l,!0),t.childLanes=a,null}function Tr(e,t){return t=Rr({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function th(e,t,n){return Ma(t,e.child,null,n),e=Tr(t,t.pendingProps),e.flags|=2,_l(t),t.memoizedState=null,e}function Rp(e,t,n){var l=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(kt){if(l.mode==="hidden")return e=Tr(t,l),t.lanes=536870912,ri(null,e);if(_u(t),(e=Jt)?(e=f0(e,Ml),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Bo!==null?{id:eo,overflow:to}:null,retryLane:536870912,hydrationErrors:null},n=L_(e),n.return=t,t.child=n,zn=t,Jt=null)):e=null,e===null)throw Lo(t);return t.lanes=536870912,null}return Tr(t,l)}var i=e.memoizedState;if(i!==null){var d=i.dehydrated;if(_u(t),a)if(t.flags&256)t.flags&=-257,t=th(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(u(558));else if(pn||ns(e,t,n,!1),a=(n&e.childLanes)!==0,pn||a){if(l=qt,l!==null&&(d=sl(l,n),d!==0&&d!==i.retryLane))throw i.retryLane=d,xa(e,d),ol(l,e,d),Nu;Ur(),t=th(e,t,n)}else e=i.treeContext,Jt=Tl(d.nextSibling),zn=t,kt=!0,Oo=null,Ml=!1,e!==null&&U_(t,e),t=Tr(t,l),t.flags|=4096;return t}return e=io(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function zr(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(u(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Au(e,t,n,l,a){return Sa(t),n=hu(e,t,n,l,void 0,a),l=mu(),e!==null&&!pn?(gu(e,t,a),ho(e,t,a)):(kt&&l&&Zc(t),t.flags|=1,Dn(e,t,n,a),t.child)}function nh(e,t,n,l,a,i){return Sa(t),t.updateQueue=null,n=of(t,l,n,a),lf(e),l=mu(),e!==null&&!pn?(gu(e,t,i),ho(e,t,i)):(kt&&l&&Zc(t),t.flags|=1,Dn(e,t,n,i),t.child)}function lh(e,t,n,l,a){if(Sa(t),t.stateNode===null){var i=Ja,d=n.contextType;typeof d=="object"&&d!==null&&(i=Rn(d)),i=new n(l,i),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Ru,t.stateNode=i,i._reactInternals=t,i=t.stateNode,i.props=l,i.state=t.memoizedState,i.refs={},su(t),d=n.contextType,i.context=typeof d=="object"&&d!==null?Rn(d):Ja,i.state=t.memoizedState,d=n.getDerivedStateFromProps,typeof d=="function"&&(zu(t,n,d,l),i.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(d=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),d!==i.state&&Ru.enqueueReplaceState(i,i.state,null),li(t,l,i,a),ni(),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){i=t.stateNode;var h=t.memoizedProps,v=Ta(n,h);i.props=v;var B=i.context,q=n.contextType;d=Ja,typeof q=="object"&&q!==null&&(d=Rn(q));var J=n.getDerivedStateFromProps;q=typeof J=="function"||typeof i.getSnapshotBeforeUpdate=="function",h=t.pendingProps!==h,q||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(h||B!==d)&&If(t,i,l,d),Ho=!1;var L=t.memoizedState;i.state=L,li(t,l,i,a),ni(),B=t.memoizedState,h||L!==B||Ho?(typeof J=="function"&&(zu(t,n,J,l),B=t.memoizedState),(v=Ho||Xf(t,n,v,l,L,B,d))?(q||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=B),i.props=l,i.state=B,i.context=d,l=v):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{i=t.stateNode,iu(e,t),d=t.memoizedProps,q=Ta(n,d),i.props=q,J=t.pendingProps,L=i.context,B=n.contextType,v=Ja,typeof B=="object"&&B!==null&&(v=Rn(B)),h=n.getDerivedStateFromProps,(B=typeof h=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(d!==J||L!==v)&&If(t,i,l,v),Ho=!1,L=t.memoizedState,i.state=L,li(t,l,i,a),ni();var Y=t.memoizedState;d!==J||L!==Y||Ho||e!==null&&e.dependencies!==null&&dr(e.dependencies)?(typeof h=="function"&&(zu(t,n,h,l),Y=t.memoizedState),(q=Ho||Xf(t,n,q,l,L,Y,v)||e!==null&&e.dependencies!==null&&dr(e.dependencies))?(B||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(l,Y,v),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(l,Y,v)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||d===e.memoizedProps&&L===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&L===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=Y),i.props=l,i.state=Y,i.context=v,l=q):(typeof i.componentDidUpdate!="function"||d===e.memoizedProps&&L===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&L===e.memoizedState||(t.flags|=1024),l=!1)}return i=l,zr(e,t),l=(t.flags&128)!==0,i||l?(i=t.stateNode,n=l&&typeof n.getDerivedStateFromError!="function"?null:i.render(),t.flags|=1,e!==null&&l?(t.child=Ma(t,e.child,null,a),t.child=Ma(t,null,n,a)):Dn(e,t,n,a),t.memoizedState=i.state,e=t.child):e=ho(e,t,a),e}function oh(e,t,n,l){return va(),t.flags|=256,Dn(e,t,n,l),t.child}var Bu={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Ou(e){return{baseLanes:e,cachePool:W_()}}function Lu(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=hl),e}function ah(e,t,n){var l=t.pendingProps,a=!1,i=(t.flags&128)!==0,d;if((d=i)||(d=e!==null&&e.memoizedState===null?!1:(_n.current&2)!==0),d&&(a=!0,t.flags&=-129),d=(t.flags&32)!==0,t.flags&=-33,e===null){if(kt){if(a?Xo(t):Io(),(e=Jt)?(e=f0(e,Ml),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Bo!==null?{id:eo,overflow:to}:null,retryLane:536870912,hydrationErrors:null},n=L_(e),n.return=t,t.child=n,zn=t,Jt=null)):e=null,e===null)throw Lo(t);return xd(e)?t.lanes=32:t.lanes=536870912,null}var h=l.children;return l=l.fallback,a?(Io(),a=t.mode,h=Rr({mode:"hidden",children:h},a),l=ba(l,a,n,null),h.return=t,l.return=t,h.sibling=l,t.child=h,l=t.child,l.memoizedState=Ou(n),l.childLanes=Lu(e,d,n),t.memoizedState=Bu,ri(null,l)):(Xo(t),$u(t,h))}var v=e.memoizedState;if(v!==null&&(h=v.dehydrated,h!==null)){if(i)t.flags&256?(Xo(t),t.flags&=-257,t=Hu(e,t,n)):t.memoizedState!==null?(Io(),t.child=e.child,t.flags|=128,t=null):(Io(),h=l.fallback,a=t.mode,l=Rr({mode:"visible",children:l.children},a),h=ba(h,a,n,null),h.flags|=2,l.return=t,h.return=t,l.sibling=h,t.child=l,Ma(t,e.child,null,n),l=t.child,l.memoizedState=Ou(n),l.childLanes=Lu(e,d,n),t.memoizedState=Bu,t=ri(null,l));else if(Xo(t),xd(h)){if(d=h.nextSibling&&h.nextSibling.dataset,d)var B=d.dgst;d=B,l=Error(u(419)),l.stack="",l.digest=d,Ks({value:l,source:null,stack:null}),t=Hu(e,t,n)}else if(pn||ns(e,t,n,!1),d=(n&e.childLanes)!==0,pn||d){if(d=qt,d!==null&&(l=sl(d,n),l!==0&&l!==v.retryLane))throw v.retryLane=l,xa(e,l),ol(d,e,l),Nu;pd(h)||Ur(),t=Hu(e,t,n)}else pd(h)?(t.flags|=192,t.child=e.child,t=null):(e=v.treeContext,Jt=Tl(h.nextSibling),zn=t,kt=!0,Oo=null,Ml=!1,e!==null&&U_(t,e),t=$u(t,l.children),t.flags|=4096);return t}return a?(Io(),h=l.fallback,a=t.mode,v=e.child,B=v.sibling,l=io(v,{mode:"hidden",children:l.children}),l.subtreeFlags=v.subtreeFlags&65011712,B!==null?h=io(B,h):(h=ba(h,a,n,null),h.flags|=2),h.return=t,l.return=t,l.sibling=h,t.child=l,ri(null,l),l=t.child,h=e.child.memoizedState,h===null?h=Ou(n):(a=h.cachePool,a!==null?(v=gn._currentValue,a=a.parent!==v?{parent:v,pool:v}:a):a=W_(),h={baseLanes:h.baseLanes|n,cachePool:a}),l.memoizedState=h,l.childLanes=Lu(e,d,n),t.memoizedState=Bu,ri(e.child,l)):(Xo(t),n=e.child,e=n.sibling,n=io(n,{mode:"visible",children:l.children}),n.return=t,n.sibling=null,e!==null&&(d=t.deletions,d===null?(t.deletions=[e],t.flags|=16):d.push(e)),t.child=n,t.memoizedState=null,n)}function $u(e,t){return t=Rr({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Rr(e,t){return e=ul(22,e,null,t),e.lanes=0,e}function Hu(e,t,n){return Ma(t,e.child,null,n),e=$u(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function sh(e,t,n){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),eu(e.return,t,n)}function Uu(e,t,n,l,a,i){var d=e.memoizedState;d===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:n,tailMode:a,treeForkCount:i}:(d.isBackwards=t,d.rendering=null,d.renderingStartTime=0,d.last=l,d.tail=n,d.tailMode=a,d.treeForkCount=i)}function ih(e,t,n){var l=t.pendingProps,a=l.revealOrder,i=l.tail;l=l.children;var d=_n.current,h=(d&2)!==0;if(h?(d=d&1|2,t.flags|=128):d&=1,ie(_n,d),Dn(e,t,l,n),l=kt?Zs:0,!h&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&sh(e,n,t);else if(e.tag===19)sh(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"forwards":for(n=t.child,a=null;n!==null;)e=n.alternate,e!==null&&xr(e)===null&&(a=n),n=n.sibling;n=a,n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),Uu(t,!1,a,n,i,l);break;case"backwards":case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&xr(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}Uu(t,!0,n,null,i,l);break;case"together":Uu(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function ho(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Wo|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(ns(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(u(153));if(t.child!==null){for(e=t.child,n=io(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=io(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Yu(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&dr(e)))}function Dp(e,t,n){switch(t.tag){case 3:Zt(t,t.stateNode.containerInfo),$o(t,gn,e.memoizedState.cache),va();break;case 27:case 5:Zn(t);break;case 4:Zt(t,t.stateNode.containerInfo);break;case 10:$o(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,_u(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(Xo(t),t.flags|=128,null):(n&t.child.childLanes)!==0?ah(e,t,n):(Xo(t),e=ho(e,t,n),e!==null?e.sibling:null);Xo(t);break;case 19:var a=(e.flags&128)!==0;if(l=(n&t.childLanes)!==0,l||(ns(e,t,n,!1),l=(n&t.childLanes)!==0),a){if(l)return ih(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),ie(_n,_n.current),l)break;return null;case 22:return t.lanes=0,Pf(e,t,n,t.pendingProps);case 24:$o(t,gn,e.memoizedState.cache)}return ho(e,t,n)}function rh(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)pn=!0;else{if(!Yu(e,n)&&(t.flags&128)===0)return pn=!1,Dp(e,t,n);pn=(e.flags&131072)!==0}else pn=!1,kt&&(t.flags&1048576)!==0&&H_(t,Zs,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=ja(t.elementType),t.type=e,typeof e=="function")Wc(e)?(l=Ta(e,l),t.tag=1,t=lh(null,t,e,l,n)):(t.tag=0,t=Au(null,t,e,l,n));else{if(e!=null){var a=e.$$typeof;if(a===we){t.tag=11,t=Kf(null,t,e,l,n);break e}else if(a===oe){t.tag=14,t=Ff(null,t,e,l,n);break e}}throw t=Ye(e)||e,Error(u(306,t,""))}}return t;case 0:return Au(e,t,t.type,t.pendingProps,n);case 1:return l=t.type,a=Ta(l,t.pendingProps),lh(e,t,l,a,n);case 3:e:{if(Zt(t,t.stateNode.containerInfo),e===null)throw Error(u(387));l=t.pendingProps;var i=t.memoizedState;a=i.element,iu(e,t),li(t,l,null,n);var d=t.memoizedState;if(l=d.cache,$o(t,gn,l),l!==i.cache&&tu(t,[gn],n,!0),ni(),l=d.element,i.isDehydrated)if(i={element:l,isDehydrated:!1,cache:d.cache},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){t=oh(e,t,l,n);break e}else if(l!==a){a=kl(Error(u(424)),t),Ks(a),t=oh(e,t,l,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Jt=Tl(e.firstChild),zn=t,kt=!0,Oo=null,Ml=!0,n=J_(t,null,l,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(va(),l===a){t=ho(e,t,n);break e}Dn(e,t,l,n)}t=t.child}return t;case 26:return zr(e,t),e===null?(n=x0(t.type,null,t.pendingProps,null))?t.memoizedState=n:kt||(n=t.type,e=t.pendingProps,l=Gr(Ze.current).createElement(n),l[an]=t,l[Ln]=e,Nn(l,n,e),hn(l),t.stateNode=l):t.memoizedState=x0(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Zn(t),e===null&&kt&&(l=t.stateNode=g0(t.type,t.pendingProps,Ze.current),zn=t,Ml=!0,a=Jt,Fo(t.type)?(bd=a,Jt=Tl(l.firstChild)):Jt=a),Dn(e,t,t.pendingProps.children,n),zr(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&kt&&((a=l=Jt)&&(l=r1(l,t.type,t.pendingProps,Ml),l!==null?(t.stateNode=l,zn=t,Jt=Tl(l.firstChild),Ml=!1,a=!0):a=!1),a||Lo(t)),Zn(t),a=t.type,i=t.pendingProps,d=e!==null?e.memoizedProps:null,l=i.children,md(a,i)?l=null:d!==null&&md(a,d)&&(t.flags|=32),t.memoizedState!==null&&(a=hu(e,t,Sp,null,null,n),Si._currentValue=a),zr(e,t),Dn(e,t,l,n),t.child;case 6:return e===null&&kt&&((e=n=Jt)&&(n=c1(n,t.pendingProps,Ml),n!==null?(t.stateNode=n,zn=t,Jt=null,e=!0):e=!1),e||Lo(t)),null;case 13:return ah(e,t,n);case 4:return Zt(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=Ma(t,null,l,n):Dn(e,t,l,n),t.child;case 11:return Kf(e,t,t.type,t.pendingProps,n);case 7:return Dn(e,t,t.pendingProps,n),t.child;case 8:return Dn(e,t,t.pendingProps.children,n),t.child;case 12:return Dn(e,t,t.pendingProps.children,n),t.child;case 10:return l=t.pendingProps,$o(t,t.type,l.value),Dn(e,t,l.children,n),t.child;case 9:return a=t.type._context,l=t.pendingProps.children,Sa(t),a=Rn(a),l=l(a),t.flags|=1,Dn(e,t,l,n),t.child;case 14:return Ff(e,t,t.type,t.pendingProps,n);case 15:return Jf(e,t,t.type,t.pendingProps,n);case 19:return ih(e,t,n);case 31:return Rp(e,t,n);case 22:return Pf(e,t,n,t.pendingProps);case 24:return Sa(t),l=Rn(gn),e===null?(a=ou(),a===null&&(a=qt,i=nu(),a.pooledCache=i,i.refCount++,i!==null&&(a.pooledCacheLanes|=n),a=i),t.memoizedState={parent:l,cache:a},su(t),$o(t,gn,a)):((e.lanes&n)!==0&&(iu(e,t),li(t,null,null,n),ni()),a=e.memoizedState,i=t.memoizedState,a.parent!==l?(a={parent:l,cache:l},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),$o(t,gn,l)):(l=i.cache,$o(t,gn,l),l!==a.cache&&tu(t,[gn],n,!0))),Dn(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(u(156,t.tag))}function mo(e){e.flags|=4}function Xu(e,t,n,l,a){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(Bh())e.flags|=8192;else throw Ca=mr,au}else e.flags&=-16777217}function ch(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!k0(t))if(Bh())e.flags|=8192;else throw Ca=mr,au}function Dr(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Be():536870912,e.lanes|=t,hs|=t)}function ci(e,t){if(!kt)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var l=null;n!==null;)n.alternate!==null&&(l=n),n=n.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Pt(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,l=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,l|=a.subtreeFlags&65011712,l|=a.flags&65011712,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,l|=a.subtreeFlags,l|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=l,e.childLanes=n,t}function Np(e,t,n){var l=t.pendingProps;switch(Kc(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Pt(t),null;case 1:return Pt(t),null;case 3:return n=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),uo(gn),Nt(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(ts(t)?mo(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Jc())),Pt(t),null;case 26:var a=t.type,i=t.memoizedState;return e===null?(mo(t),i!==null?(Pt(t),ch(t,i)):(Pt(t),Xu(t,a,null,l,n))):i?i!==e.memoizedState?(mo(t),Pt(t),ch(t,i)):(Pt(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&mo(t),Pt(t),Xu(t,a,e,l,n)),null;case 27:if(Sn(t),n=Ze.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&mo(t);else{if(!l){if(t.stateNode===null)throw Error(u(166));return Pt(t),null}e=fe.current,ts(t)?Y_(t):(e=g0(a,l,n),t.stateNode=e,mo(t))}return Pt(t),null;case 5:if(Sn(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&mo(t);else{if(!l){if(t.stateNode===null)throw Error(u(166));return Pt(t),null}if(i=fe.current,ts(t))Y_(t);else{var d=Gr(Ze.current);switch(i){case 1:i=d.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:i=d.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":i=d.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":i=d.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":i=d.createElement("div"),i.innerHTML="<script><\/script>",i=i.removeChild(i.firstChild);break;case"select":i=typeof l.is=="string"?d.createElement("select",{is:l.is}):d.createElement("select"),l.multiple?i.multiple=!0:l.size&&(i.size=l.size);break;default:i=typeof l.is=="string"?d.createElement(a,{is:l.is}):d.createElement(a)}}i[an]=t,i[Ln]=l;e:for(d=t.child;d!==null;){if(d.tag===5||d.tag===6)i.appendChild(d.stateNode);else if(d.tag!==4&&d.tag!==27&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===t)break e;for(;d.sibling===null;){if(d.return===null||d.return===t)break e;d=d.return}d.sibling.return=d.return,d=d.sibling}t.stateNode=i;e:switch(Nn(i,a,l),a){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&mo(t)}}return Pt(t),Xu(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&mo(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(u(166));if(e=Ze.current,ts(t)){if(e=t.stateNode,n=t.memoizedProps,l=null,a=zn,a!==null)switch(a.tag){case 27:case 5:l=a.memoizedProps}e[an]=t,e=!!(e.nodeValue===n||l!==null&&l.suppressHydrationWarning===!0||a0(e.nodeValue,n)),e||Lo(t,!0)}else e=Gr(e).createTextNode(l),e[an]=t,t.stateNode=e}return Pt(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(l=ts(t),n!==null){if(e===null){if(!l)throw Error(u(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(557));e[an]=t}else va(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Pt(t),e=!1}else n=Jc(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(_l(t),t):(_l(t),null);if((t.flags&128)!==0)throw Error(u(558))}return Pt(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=ts(t),l!==null&&l.dehydrated!==null){if(e===null){if(!a)throw Error(u(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(u(317));a[an]=t}else va(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Pt(t),a=!1}else a=Jc(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(_l(t),t):(_l(t),null)}return _l(t),(t.flags&128)!==0?(t.lanes=n,t):(n=l!==null,e=e!==null&&e.memoizedState!==null,n&&(l=t.child,a=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(a=l.alternate.memoizedState.cachePool.pool),i=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(i=l.memoizedState.cachePool.pool),i!==a&&(l.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Dr(t,t.updateQueue),Pt(t),null);case 4:return Nt(),e===null&&ud(t.stateNode.containerInfo),Pt(t),null;case 10:return uo(t.type),Pt(t),null;case 19:if(I(_n),l=t.memoizedState,l===null)return Pt(t),null;if(a=(t.flags&128)!==0,i=l.rendering,i===null)if(a)ci(l,!1);else{if(rn!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=xr(e),i!==null){for(t.flags|=128,ci(l,!1),e=i.updateQueue,t.updateQueue=e,Dr(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)O_(n,e),n=n.sibling;return ie(_n,_n.current&1|2),kt&&ro(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&Ge()>Lr&&(t.flags|=128,a=!0,ci(l,!1),t.lanes=4194304)}else{if(!a)if(e=xr(i),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,Dr(t,e),ci(l,!0),l.tail===null&&l.tailMode==="hidden"&&!i.alternate&&!kt)return Pt(t),null}else 2*Ge()-l.renderingStartTime>Lr&&n!==536870912&&(t.flags|=128,a=!0,ci(l,!1),t.lanes=4194304);l.isBackwards?(i.sibling=t.child,t.child=i):(e=l.last,e!==null?e.sibling=i:t.child=i,l.last=i)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Ge(),e.sibling=null,n=_n.current,ie(_n,a?n&1|2:n&1),kt&&ro(t,l.treeForkCount),e):(Pt(t),null);case 22:case 23:return _l(t),du(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(n&536870912)!==0&&(t.flags&128)===0&&(Pt(t),t.subtreeFlags&6&&(t.flags|=8192)):Pt(t),n=t.updateQueue,n!==null&&Dr(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==n&&(t.flags|=2048),e!==null&&I(ka),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),uo(gn),Pt(t),null;case 25:return null;case 30:return null}throw Error(u(156,t.tag))}function Ap(e,t){switch(Kc(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return uo(gn),Nt(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Sn(t),null;case 31:if(t.memoizedState!==null){if(_l(t),t.alternate===null)throw Error(u(340));va()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(_l(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(u(340));va()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return I(_n),null;case 4:return Nt(),null;case 10:return uo(t.type),null;case 22:case 23:return _l(t),du(),e!==null&&I(ka),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return uo(gn),null;case 25:return null;default:return null}}function uh(e,t){switch(Kc(t),t.tag){case 3:uo(gn),Nt();break;case 26:case 27:case 5:Sn(t);break;case 4:Nt();break;case 31:t.memoizedState!==null&&_l(t);break;case 13:_l(t);break;case 19:I(_n);break;case 10:uo(t.type);break;case 22:case 23:_l(t),du(),e!==null&&I(ka);break;case 24:uo(gn)}}function ui(e,t){try{var n=t.updateQueue,l=n!==null?n.lastEffect:null;if(l!==null){var a=l.next;n=a;do{if((n.tag&e)===e){l=void 0;var i=n.create,d=n.inst;l=i(),d.destroy=l}n=n.next}while(n!==a)}}catch(h){$t(t,t.return,h)}}function qo(e,t,n){try{var l=t.updateQueue,a=l!==null?l.lastEffect:null;if(a!==null){var i=a.next;l=i;do{if((l.tag&e)===e){var d=l.inst,h=d.destroy;if(h!==void 0){d.destroy=void 0,a=t;var v=n,B=h;try{B()}catch(q){$t(a,v,q)}}}l=l.next}while(l!==i)}}catch(q){$t(t,t.return,q)}}function dh(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{ef(t,n)}catch(l){$t(e,e.return,l)}}}function _h(e,t,n){n.props=Ta(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(l){$t(e,t,l)}}function di(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof n=="function"?e.refCleanup=n(l):n.current=l}}catch(a){$t(e,t,a)}}function no(e,t){var n=e.ref,l=e.refCleanup;if(n!==null)if(typeof l=="function")try{l()}catch(a){$t(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){$t(e,t,a)}else n.current=null}function fh(e){var t=e.type,n=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&l.focus();break e;case"img":n.src?l.src=n.src:n.srcSet&&(l.srcset=n.srcSet)}}catch(a){$t(e,e.return,a)}}function Iu(e,t,n){try{var l=e.stateNode;n1(l,e.type,n,t),l[Ln]=t}catch(a){$t(e,e.return,a)}}function hh(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Fo(e.type)||e.tag===4}function qu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||hh(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Fo(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Qu(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Dl));else if(l!==4&&(l===27&&Fo(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Qu(e,t,n),e=e.sibling;e!==null;)Qu(e,t,n),e=e.sibling}function Nr(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(l!==4&&(l===27&&Fo(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Nr(e,t,n),e=e.sibling;e!==null;)Nr(e,t,n),e=e.sibling}function mh(e){var t=e.stateNode,n=e.memoizedProps;try{for(var l=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);Nn(t,l,n),t[an]=e,t[Ln]=n}catch(i){$t(e,e.return,i)}}var go=!1,xn=!1,Wu=!1,gh=typeof WeakSet=="function"?WeakSet:Set,Mn=null;function Bp(e,t){if(e=e.containerInfo,fd=ec,e=Gn(e),dn(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var l=n.getSelection&&n.getSelection();if(l&&l.rangeCount!==0){n=l.anchorNode;var a=l.anchorOffset,i=l.focusNode;l=l.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var d=0,h=-1,v=-1,B=0,q=0,J=e,L=null;t:for(;;){for(var Y;J!==n||a!==0&&J.nodeType!==3||(h=d+a),J!==i||l!==0&&J.nodeType!==3||(v=d+l),J.nodeType===3&&(d+=J.nodeValue.length),(Y=J.firstChild)!==null;)L=J,J=Y;for(;;){if(J===e)break t;if(L===n&&++B===a&&(h=d),L===i&&++q===l&&(v=d),(Y=J.nextSibling)!==null)break;J=L,L=J.parentNode}J=Y}n=h===-1||v===-1?null:{start:h,end:v}}else n=null}n=n||{start:0,end:0}}else n=null;for(hd={focusedElem:e,selectionRange:n},ec=!1,Mn=t;Mn!==null;)if(t=Mn,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Mn=e;else for(;Mn!==null;){switch(t=Mn,i=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&i!==null){e=void 0,n=t,a=i.memoizedProps,i=i.memoizedState,l=n.stateNode;try{var be=Ta(n.type,a);e=l.getSnapshotBeforeUpdate(be,i),l.__reactInternalSnapshotBeforeUpdate=e}catch(Xe){$t(n,n.return,Xe)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)yd(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":yd(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(u(163))}if(e=t.sibling,e!==null){e.return=t.return,Mn=e;break}Mn=t.return}}function yh(e,t,n){var l=n.flags;switch(n.tag){case 0:case 11:case 15:po(e,n),l&4&&ui(5,n);break;case 1:if(po(e,n),l&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(d){$t(n,n.return,d)}else{var a=Ta(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(d){$t(n,n.return,d)}}l&64&&dh(n),l&512&&di(n,n.return);break;case 3:if(po(e,n),l&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{ef(e,t)}catch(d){$t(n,n.return,d)}}break;case 27:t===null&&l&4&&mh(n);case 26:case 5:po(e,n),t===null&&l&4&&fh(n),l&512&&di(n,n.return);break;case 12:po(e,n);break;case 31:po(e,n),l&4&&bh(e,n);break;case 13:po(e,n),l&4&&vh(e,n),l&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=qp.bind(null,n),u1(e,n))));break;case 22:if(l=n.memoizedState!==null||go,!l){t=t!==null&&t.memoizedState!==null||xn,a=go;var i=xn;go=l,(xn=t)&&!i?xo(e,n,(n.subtreeFlags&8772)!==0):po(e,n),go=a,xn=i}break;case 30:break;default:po(e,n)}}function ph(e){var t=e.alternate;t!==null&&(e.alternate=null,ph(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&$a(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var tn=null,el=!1;function yo(e,t,n){for(n=n.child;n!==null;)xh(e,t,n),n=n.sibling}function xh(e,t,n){if(se&&typeof se.onCommitFiberUnmount=="function")try{se.onCommitFiberUnmount(pe,n)}catch{}switch(n.tag){case 26:xn||no(n,t),yo(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:xn||no(n,t);var l=tn,a=el;Fo(n.type)&&(tn=n.stateNode,el=!1),yo(e,t,n),bi(n.stateNode),tn=l,el=a;break;case 5:xn||no(n,t);case 6:if(l=tn,a=el,tn=null,yo(e,t,n),tn=l,el=a,tn!==null)if(el)try{(tn.nodeType===9?tn.body:tn.nodeName==="HTML"?tn.ownerDocument.body:tn).removeChild(n.stateNode)}catch(i){$t(n,t,i)}else try{tn.removeChild(n.stateNode)}catch(i){$t(n,t,i)}break;case 18:tn!==null&&(el?(e=tn,d0(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),ws(e)):d0(tn,n.stateNode));break;case 4:l=tn,a=el,tn=n.stateNode.containerInfo,el=!0,yo(e,t,n),tn=l,el=a;break;case 0:case 11:case 14:case 15:qo(2,n,t),xn||qo(4,n,t),yo(e,t,n);break;case 1:xn||(no(n,t),l=n.stateNode,typeof l.componentWillUnmount=="function"&&_h(n,t,l)),yo(e,t,n);break;case 21:yo(e,t,n);break;case 22:xn=(l=xn)||n.memoizedState!==null,yo(e,t,n),xn=l;break;default:yo(e,t,n)}}function bh(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{ws(e)}catch(n){$t(t,t.return,n)}}}function vh(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{ws(e)}catch(n){$t(t,t.return,n)}}function Op(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new gh),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new gh),t;default:throw Error(u(435,e.tag))}}function Ar(e,t){var n=Op(e);t.forEach(function(l){if(!n.has(l)){n.add(l);var a=Qp.bind(null,e,l);l.then(a,a)}})}function tl(e,t){var n=t.deletions;if(n!==null)for(var l=0;l<n.length;l++){var a=n[l],i=e,d=t,h=d;e:for(;h!==null;){switch(h.tag){case 27:if(Fo(h.type)){tn=h.stateNode,el=!1;break e}break;case 5:tn=h.stateNode,el=!1;break e;case 3:case 4:tn=h.stateNode.containerInfo,el=!0;break e}h=h.return}if(tn===null)throw Error(u(160));xh(i,d,a),tn=null,el=!1,i=a.alternate,i!==null&&(i.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)wh(t,e),t=t.sibling}var Ll=null;function wh(e,t){var n=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:tl(t,e),nl(e),l&4&&(qo(3,e,e.return),ui(3,e),qo(5,e,e.return));break;case 1:tl(t,e),nl(e),l&512&&(xn||n===null||no(n,n.return)),l&64&&go&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?l:n.concat(l))));break;case 26:var a=Ll;if(tl(t,e),nl(e),l&512&&(xn||n===null||no(n,n.return)),l&4){var i=n!==null?n.memoizedState:null;if(l=e.memoizedState,n===null)if(l===null)if(e.stateNode===null){e:{l=e.type,n=e.memoizedProps,a=a.ownerDocument||a;t:switch(l){case"title":i=a.getElementsByTagName("title")[0],(!i||i[ca]||i[an]||i.namespaceURI==="http://www.w3.org/2000/svg"||i.hasAttribute("itemprop"))&&(i=a.createElement(l),a.head.insertBefore(i,a.querySelector("head > title"))),Nn(i,l,n),i[an]=e,hn(i),l=i;break e;case"link":var d=w0("link","href",a).get(l+(n.href||""));if(d){for(var h=0;h<d.length;h++)if(i=d[h],i.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&i.getAttribute("rel")===(n.rel==null?null:n.rel)&&i.getAttribute("title")===(n.title==null?null:n.title)&&i.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){d.splice(h,1);break t}}i=a.createElement(l),Nn(i,l,n),a.head.appendChild(i);break;case"meta":if(d=w0("meta","content",a).get(l+(n.content||""))){for(h=0;h<d.length;h++)if(i=d[h],i.getAttribute("content")===(n.content==null?null:""+n.content)&&i.getAttribute("name")===(n.name==null?null:n.name)&&i.getAttribute("property")===(n.property==null?null:n.property)&&i.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&i.getAttribute("charset")===(n.charSet==null?null:n.charSet)){d.splice(h,1);break t}}i=a.createElement(l),Nn(i,l,n),a.head.appendChild(i);break;default:throw Error(u(468,l))}i[an]=e,hn(i),l=i}e.stateNode=l}else S0(a,e.type,e.stateNode);else e.stateNode=v0(a,l,e.memoizedProps);else i!==l?(i===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):i.count--,l===null?S0(a,e.type,e.stateNode):v0(a,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Iu(e,e.memoizedProps,n.memoizedProps)}break;case 27:tl(t,e),nl(e),l&512&&(xn||n===null||no(n,n.return)),n!==null&&l&4&&Iu(e,e.memoizedProps,n.memoizedProps);break;case 5:if(tl(t,e),nl(e),l&512&&(xn||n===null||no(n,n.return)),e.flags&32){a=e.stateNode;try{To(a,"")}catch(be){$t(e,e.return,be)}}l&4&&e.stateNode!=null&&(a=e.memoizedProps,Iu(e,a,n!==null?n.memoizedProps:a)),l&1024&&(Wu=!0);break;case 6:if(tl(t,e),nl(e),l&4){if(e.stateNode===null)throw Error(u(162));l=e.memoizedProps,n=e.stateNode;try{n.nodeValue=l}catch(be){$t(e,e.return,be)}}break;case 3:if(Kr=null,a=Ll,Ll=Vr(t.containerInfo),tl(t,e),Ll=a,nl(e),l&4&&n!==null&&n.memoizedState.isDehydrated)try{ws(t.containerInfo)}catch(be){$t(e,e.return,be)}Wu&&(Wu=!1,Sh(e));break;case 4:l=Ll,Ll=Vr(e.stateNode.containerInfo),tl(t,e),nl(e),Ll=l;break;case 12:tl(t,e),nl(e);break;case 31:tl(t,e),nl(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Ar(e,l)));break;case 13:tl(t,e),nl(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(Or=Ge()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Ar(e,l)));break;case 22:a=e.memoizedState!==null;var v=n!==null&&n.memoizedState!==null,B=go,q=xn;if(go=B||a,xn=q||v,tl(t,e),xn=q,go=B,nl(e),l&8192)e:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||v||go||xn||za(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){v=n=t;try{if(i=v.stateNode,a)d=i.style,typeof d.setProperty=="function"?d.setProperty("display","none","important"):d.display="none";else{h=v.stateNode;var J=v.memoizedProps.style,L=J!=null&&J.hasOwnProperty("display")?J.display:null;h.style.display=L==null||typeof L=="boolean"?"":(""+L).trim()}}catch(be){$t(v,v.return,be)}}}else if(t.tag===6){if(n===null){v=t;try{v.stateNode.nodeValue=a?"":v.memoizedProps}catch(be){$t(v,v.return,be)}}}else if(t.tag===18){if(n===null){v=t;try{var Y=v.stateNode;a?_0(Y,!0):_0(v.stateNode,!1)}catch(be){$t(v,v.return,be)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(n=l.retryQueue,n!==null&&(l.retryQueue=null,Ar(e,n))));break;case 19:tl(t,e),nl(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Ar(e,l)));break;case 30:break;case 21:break;default:tl(t,e),nl(e)}}function nl(e){var t=e.flags;if(t&2){try{for(var n,l=e.return;l!==null;){if(hh(l)){n=l;break}l=l.return}if(n==null)throw Error(u(160));switch(n.tag){case 27:var a=n.stateNode,i=qu(e);Nr(e,i,a);break;case 5:var d=n.stateNode;n.flags&32&&(To(d,""),n.flags&=-33);var h=qu(e);Nr(e,h,d);break;case 3:case 4:var v=n.stateNode.containerInfo,B=qu(e);Qu(e,B,v);break;default:throw Error(u(161))}}catch(q){$t(e,e.return,q)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Sh(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Sh(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function po(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)yh(e,t.alternate,t),t=t.sibling}function za(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:qo(4,t,t.return),za(t);break;case 1:no(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&_h(t,t.return,n),za(t);break;case 27:bi(t.stateNode);case 26:case 5:no(t,t.return),za(t);break;case 22:t.memoizedState===null&&za(t);break;case 30:za(t);break;default:za(t)}e=e.sibling}}function xo(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,a=e,i=t,d=i.flags;switch(i.tag){case 0:case 11:case 15:xo(a,i,n),ui(4,i);break;case 1:if(xo(a,i,n),l=i,a=l.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(B){$t(l,l.return,B)}if(l=i,a=l.updateQueue,a!==null){var h=l.stateNode;try{var v=a.shared.hiddenCallbacks;if(v!==null)for(a.shared.hiddenCallbacks=null,a=0;a<v.length;a++)P_(v[a],h)}catch(B){$t(l,l.return,B)}}n&&d&64&&dh(i),di(i,i.return);break;case 27:mh(i);case 26:case 5:xo(a,i,n),n&&l===null&&d&4&&fh(i),di(i,i.return);break;case 12:xo(a,i,n);break;case 31:xo(a,i,n),n&&d&4&&bh(a,i);break;case 13:xo(a,i,n),n&&d&4&&vh(a,i);break;case 22:i.memoizedState===null&&xo(a,i,n),di(i,i.return);break;case 30:break;default:xo(a,i,n)}t=t.sibling}}function Gu(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Fs(n))}function Vu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Fs(e))}function $l(e,t,n,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)kh(e,t,n,l),t=t.sibling}function kh(e,t,n,l){var a=t.flags;switch(t.tag){case 0:case 11:case 15:$l(e,t,n,l),a&2048&&ui(9,t);break;case 1:$l(e,t,n,l);break;case 3:$l(e,t,n,l),a&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Fs(e)));break;case 12:if(a&2048){$l(e,t,n,l),e=t.stateNode;try{var i=t.memoizedProps,d=i.id,h=i.onPostCommit;typeof h=="function"&&h(d,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(v){$t(t,t.return,v)}}else $l(e,t,n,l);break;case 31:$l(e,t,n,l);break;case 13:$l(e,t,n,l);break;case 23:break;case 22:i=t.stateNode,d=t.alternate,t.memoizedState!==null?i._visibility&2?$l(e,t,n,l):_i(e,t):i._visibility&2?$l(e,t,n,l):(i._visibility|=2,ds(e,t,n,l,(t.subtreeFlags&10256)!==0||!1)),a&2048&&Gu(d,t);break;case 24:$l(e,t,n,l),a&2048&&Vu(t.alternate,t);break;default:$l(e,t,n,l)}}function ds(e,t,n,l,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var i=e,d=t,h=n,v=l,B=d.flags;switch(d.tag){case 0:case 11:case 15:ds(i,d,h,v,a),ui(8,d);break;case 23:break;case 22:var q=d.stateNode;d.memoizedState!==null?q._visibility&2?ds(i,d,h,v,a):_i(i,d):(q._visibility|=2,ds(i,d,h,v,a)),a&&B&2048&&Gu(d.alternate,d);break;case 24:ds(i,d,h,v,a),a&&B&2048&&Vu(d.alternate,d);break;default:ds(i,d,h,v,a)}t=t.sibling}}function _i(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,l=t,a=l.flags;switch(l.tag){case 22:_i(n,l),a&2048&&Gu(l.alternate,l);break;case 24:_i(n,l),a&2048&&Vu(l.alternate,l);break;default:_i(n,l)}t=t.sibling}}var fi=8192;function _s(e,t,n){if(e.subtreeFlags&fi)for(e=e.child;e!==null;)jh(e,t,n),e=e.sibling}function jh(e,t,n){switch(e.tag){case 26:_s(e,t,n),e.flags&fi&&e.memoizedState!==null&&w1(n,Ll,e.memoizedState,e.memoizedProps);break;case 5:_s(e,t,n);break;case 3:case 4:var l=Ll;Ll=Vr(e.stateNode.containerInfo),_s(e,t,n),Ll=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=fi,fi=16777216,_s(e,t,n),fi=l):_s(e,t,n));break;default:_s(e,t,n)}}function Ch(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function hi(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];Mn=l,Eh(l,e)}Ch(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Mh(e),e=e.sibling}function Mh(e){switch(e.tag){case 0:case 11:case 15:hi(e),e.flags&2048&&qo(9,e,e.return);break;case 3:hi(e);break;case 12:hi(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Br(e)):hi(e);break;default:hi(e)}}function Br(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];Mn=l,Eh(l,e)}Ch(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:qo(8,t,t.return),Br(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Br(t));break;default:Br(t)}e=e.sibling}}function Eh(e,t){for(;Mn!==null;){var n=Mn;switch(n.tag){case 0:case 11:case 15:qo(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var l=n.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Fs(n.memoizedState.cache)}if(l=n.child,l!==null)l.return=n,Mn=l;else e:for(n=e;Mn!==null;){l=Mn;var a=l.sibling,i=l.return;if(ph(l),l===n){Mn=null;break e}if(a!==null){a.return=i,Mn=a;break e}Mn=i}}}var Lp={getCacheForType:function(e){var t=Rn(gn),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Rn(gn).controller.signal}},$p=typeof WeakMap=="function"?WeakMap:Map,Dt=0,qt=null,yt=null,vt=0,Lt=0,fl=null,Qo=!1,fs=!1,Zu=!1,bo=0,rn=0,Wo=0,Ra=0,Ku=0,hl=0,hs=0,mi=null,ll=null,Fu=!1,Or=0,Th=0,Lr=1/0,$r=null,Go=null,wn=0,Vo=null,ms=null,vo=0,Ju=0,Pu=null,zh=null,gi=0,ed=null;function ml(){return(Dt&2)!==0&&vt!==0?vt&-vt:T.T!==null?sd():ra()}function Rh(){if(hl===0)if((vt&536870912)===0||kt){var e=ft;ft<<=1,(ft&3932160)===0&&(ft=262144),hl=e}else hl=536870912;return e=dl.current,e!==null&&(e.flags|=32),hl}function ol(e,t,n){(e===qt&&(Lt===2||Lt===9)||e.cancelPendingCommit!==null)&&(gs(e,0),Zo(e,vt,hl,!1)),Pe(e,n),((Dt&2)===0||e!==qt)&&(e===qt&&((Dt&2)===0&&(Ra|=n),rn===4&&Zo(e,vt,hl,!1)),lo(e))}function Dh(e,t,n){if((Dt&6)!==0)throw Error(u(327));var l=!n&&(t&127)===0&&(t&e.expiredLanes)===0||bt(e,t),a=l?Yp(e,t):nd(e,t,!0),i=l;do{if(a===0){fs&&!l&&Zo(e,t,0,!1);break}else{if(n=e.current.alternate,i&&!Hp(n)){a=nd(e,t,!1),i=!1;continue}if(a===2){if(i=t,e.errorRecoveryDisabledLanes&i)var d=0;else d=e.pendingLanes&-536870913,d=d!==0?d:d&536870912?536870912:0;if(d!==0){t=d;e:{var h=e;a=mi;var v=h.current.memoizedState.isDehydrated;if(v&&(gs(h,d).flags|=256),d=nd(h,d,!1),d!==2){if(Zu&&!v){h.errorRecoveryDisabledLanes|=i,Ra|=i,a=4;break e}i=ll,ll=a,i!==null&&(ll===null?ll=i:ll.push.apply(ll,i))}a=d}if(i=!1,a!==2)continue}}if(a===1){gs(e,0),Zo(e,t,0,!0);break}e:{switch(l=e,i=a,i){case 0:case 1:throw Error(u(345));case 4:if((t&4194048)!==t)break;case 6:Zo(l,t,hl,!Qo);break e;case 2:ll=null;break;case 3:case 5:break;default:throw Error(u(329))}if((t&62914560)===t&&(a=Or+300-Ge(),10<a)){if(Zo(l,t,hl,!Qo),xe(l,0,!0)!==0)break e;vo=t,l.timeoutHandle=c0(Nh.bind(null,l,n,ll,$r,Fu,t,hl,Ra,hs,Qo,i,"Throttled",-0,0),a);break e}Nh(l,n,ll,$r,Fu,t,hl,Ra,hs,Qo,i,null,-0,0)}}break}while(!0);lo(e)}function Nh(e,t,n,l,a,i,d,h,v,B,q,J,L,Y){if(e.timeoutHandle=-1,J=t.subtreeFlags,J&8192||(J&16785408)===16785408){J={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Dl},jh(t,i,J);var be=(i&62914560)===i?Or-Ge():(i&4194048)===i?Th-Ge():0;if(be=S1(J,be),be!==null){vo=i,e.cancelPendingCommit=be(Yh.bind(null,e,t,i,n,l,a,d,h,v,q,J,null,L,Y)),Zo(e,i,d,!B);return}}Yh(e,t,i,n,l,a,d,h,v)}function Hp(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var l=0;l<n.length;l++){var a=n[l],i=a.getSnapshot;a=a.value;try{if(!ke(i(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Zo(e,t,n,l){t&=~Ku,t&=~Ra,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var a=t;0<a;){var i=31-Re(a),d=1<<i;l[i]=-1,a&=~d}n!==0&&En(e,n,t)}function Hr(){return(Dt&6)===0?(yi(0),!1):!0}function td(){if(yt!==null){if(Lt===0)var e=yt.return;else e=yt,co=wa=null,yu(e),ss=null,Ps=0,e=yt;for(;e!==null;)uh(e.alternate,e),e=e.return;yt=null}}function gs(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,a1(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),vo=0,td(),qt=e,yt=n=io(e.current,null),vt=t,Lt=0,fl=null,Qo=!1,fs=bt(e,t),Zu=!1,hs=hl=Ku=Ra=Wo=rn=0,ll=mi=null,Fu=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var a=31-Re(l),i=1<<a;t|=e[a],l&=~i}return bo=t,sr(),n}function Ah(e,t){it=null,T.H=ii,t===as||t===hr?(t=Z_(),Lt=3):t===au?(t=Z_(),Lt=4):Lt=t===Nu?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,fl=t,yt===null&&(rn=1,Er(e,kl(t,e.current)))}function Bh(){var e=dl.current;return e===null?!0:(vt&4194048)===vt?El===null:(vt&62914560)===vt||(vt&536870912)!==0?e===El:!1}function Oh(){var e=T.H;return T.H=ii,e===null?ii:e}function Lh(){var e=T.A;return T.A=Lp,e}function Ur(){rn=4,Qo||(vt&4194048)!==vt&&dl.current!==null||(fs=!0),(Wo&134217727)===0&&(Ra&134217727)===0||qt===null||Zo(qt,vt,hl,!1)}function nd(e,t,n){var l=Dt;Dt|=2;var a=Oh(),i=Lh();(qt!==e||vt!==t)&&($r=null,gs(e,t)),t=!1;var d=rn;e:do try{if(Lt!==0&&yt!==null){var h=yt,v=fl;switch(Lt){case 8:td(),d=6;break e;case 3:case 2:case 9:case 6:dl.current===null&&(t=!0);var B=Lt;if(Lt=0,fl=null,ys(e,h,v,B),n&&fs){d=0;break e}break;default:B=Lt,Lt=0,fl=null,ys(e,h,v,B)}}Up(),d=rn;break}catch(q){Ah(e,q)}while(!0);return t&&e.shellSuspendCounter++,co=wa=null,Dt=l,T.H=a,T.A=i,yt===null&&(qt=null,vt=0,sr()),d}function Up(){for(;yt!==null;)$h(yt)}function Yp(e,t){var n=Dt;Dt|=2;var l=Oh(),a=Lh();qt!==e||vt!==t?($r=null,Lr=Ge()+500,gs(e,t)):fs=bt(e,t);e:do try{if(Lt!==0&&yt!==null){t=yt;var i=fl;t:switch(Lt){case 1:Lt=0,fl=null,ys(e,t,i,1);break;case 2:case 9:if(G_(i)){Lt=0,fl=null,Hh(t);break}t=function(){Lt!==2&&Lt!==9||qt!==e||(Lt=7),lo(e)},i.then(t,t);break e;case 3:Lt=7;break e;case 4:Lt=5;break e;case 7:G_(i)?(Lt=0,fl=null,Hh(t)):(Lt=0,fl=null,ys(e,t,i,7));break;case 5:var d=null;switch(yt.tag){case 26:d=yt.memoizedState;case 5:case 27:var h=yt;if(d?k0(d):h.stateNode.complete){Lt=0,fl=null;var v=h.sibling;if(v!==null)yt=v;else{var B=h.return;B!==null?(yt=B,Yr(B)):yt=null}break t}}Lt=0,fl=null,ys(e,t,i,5);break;case 6:Lt=0,fl=null,ys(e,t,i,6);break;case 8:td(),rn=6;break e;default:throw Error(u(462))}}Xp();break}catch(q){Ah(e,q)}while(!0);return co=wa=null,T.H=l,T.A=a,Dt=n,yt!==null?0:(qt=null,vt=0,sr(),rn)}function Xp(){for(;yt!==null&&!Ke();)$h(yt)}function $h(e){var t=rh(e.alternate,e,bo);e.memoizedProps=e.pendingProps,t===null?Yr(e):yt=t}function Hh(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=nh(n,t,t.pendingProps,t.type,void 0,vt);break;case 11:t=nh(n,t,t.pendingProps,t.type.render,t.ref,vt);break;case 5:yu(t);default:uh(n,t),t=yt=O_(t,bo),t=rh(n,t,bo)}e.memoizedProps=e.pendingProps,t===null?Yr(e):yt=t}function ys(e,t,n,l){co=wa=null,yu(t),ss=null,Ps=0;var a=t.return;try{if(zp(e,a,t,n,vt)){rn=1,Er(e,kl(n,e.current)),yt=null;return}}catch(i){if(a!==null)throw yt=a,i;rn=1,Er(e,kl(n,e.current)),yt=null;return}t.flags&32768?(kt||l===1?e=!0:fs||(vt&536870912)!==0?e=!1:(Qo=e=!0,(l===2||l===9||l===3||l===6)&&(l=dl.current,l!==null&&l.tag===13&&(l.flags|=16384))),Uh(t,e)):Yr(t)}function Yr(e){var t=e;do{if((t.flags&32768)!==0){Uh(t,Qo);return}e=t.return;var n=Np(t.alternate,t,bo);if(n!==null){yt=n;return}if(t=t.sibling,t!==null){yt=t;return}yt=t=e}while(t!==null);rn===0&&(rn=5)}function Uh(e,t){do{var n=Ap(e.alternate,e);if(n!==null){n.flags&=32767,yt=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){yt=e;return}yt=e=n}while(e!==null);rn=6,yt=null}function Yh(e,t,n,l,a,i,d,h,v){e.cancelPendingCommit=null;do Xr();while(wn!==0);if((Dt&6)!==0)throw Error(u(327));if(t!==null){if(t===e.current)throw Error(u(177));if(i=t.lanes|t.childLanes,i|=qc,Kn(e,n,i,d,h,v),e===qt&&(yt=qt=null,vt=0),ms=t,Vo=e,vo=n,Ju=i,Pu=a,zh=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,Wp(Te,function(){return Wh(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=T.T,T.T=null,a=ae.p,ae.p=2,d=Dt,Dt|=4;try{Bp(e,t,n)}finally{Dt=d,ae.p=a,T.T=l}}wn=1,Xh(),Ih(),qh()}}function Xh(){if(wn===1){wn=0;var e=Vo,t=ms,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=T.T,T.T=null;var l=ae.p;ae.p=2;var a=Dt;Dt|=4;try{wh(t,e);var i=hd,d=Gn(e.containerInfo),h=i.focusedElem,v=i.selectionRange;if(d!==h&&h&&h.ownerDocument&&Jn(h.ownerDocument.documentElement,h)){if(v!==null&&dn(h)){var B=v.start,q=v.end;if(q===void 0&&(q=B),"selectionStart"in h)h.selectionStart=B,h.selectionEnd=Math.min(q,h.value.length);else{var J=h.ownerDocument||document,L=J&&J.defaultView||window;if(L.getSelection){var Y=L.getSelection(),be=h.textContent.length,Xe=Math.min(v.start,be),Xt=v.end===void 0?Xe:Math.min(v.end,be);!Y.extend&&Xe>Xt&&(d=Xt,Xt=Xe,Xe=d);var z=Ft(h,Xe),C=Ft(h,Xt);if(z&&C&&(Y.rangeCount!==1||Y.anchorNode!==z.node||Y.anchorOffset!==z.offset||Y.focusNode!==C.node||Y.focusOffset!==C.offset)){var A=J.createRange();A.setStart(z.node,z.offset),Y.removeAllRanges(),Xe>Xt?(Y.addRange(A),Y.extend(C.node,C.offset)):(A.setEnd(C.node,C.offset),Y.addRange(A))}}}}for(J=[],Y=h;Y=Y.parentNode;)Y.nodeType===1&&J.push({element:Y,left:Y.scrollLeft,top:Y.scrollTop});for(typeof h.focus=="function"&&h.focus(),h=0;h<J.length;h++){var K=J[h];K.element.scrollLeft=K.left,K.element.scrollTop=K.top}}ec=!!fd,hd=fd=null}finally{Dt=a,ae.p=l,T.T=n}}e.current=t,wn=2}}function Ih(){if(wn===2){wn=0;var e=Vo,t=ms,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=T.T,T.T=null;var l=ae.p;ae.p=2;var a=Dt;Dt|=4;try{yh(e,t.alternate,t)}finally{Dt=a,ae.p=l,T.T=n}}wn=3}}function qh(){if(wn===4||wn===3){wn=0,jt();var e=Vo,t=ms,n=vo,l=zh;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?wn=5:(wn=0,ms=Vo=null,Qh(e,e.pendingLanes));var a=e.pendingLanes;if(a===0&&(Go=null),Yl(n),t=t.stateNode,se&&typeof se.onCommitFiberRoot=="function")try{se.onCommitFiberRoot(pe,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=T.T,a=ae.p,ae.p=2,T.T=null;try{for(var i=e.onRecoverableError,d=0;d<l.length;d++){var h=l[d];i(h.value,{componentStack:h.stack})}}finally{T.T=t,ae.p=a}}(vo&3)!==0&&Xr(),lo(e),a=e.pendingLanes,(n&261930)!==0&&(a&42)!==0?e===ed?gi++:(gi=0,ed=e):gi=0,yi(0)}}function Qh(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Fs(t)))}function Xr(){return Xh(),Ih(),qh(),Wh()}function Wh(){if(wn!==5)return!1;var e=Vo,t=Ju;Ju=0;var n=Yl(vo),l=T.T,a=ae.p;try{ae.p=32>n?32:n,T.T=null,n=Pu,Pu=null;var i=Vo,d=vo;if(wn=0,ms=Vo=null,vo=0,(Dt&6)!==0)throw Error(u(331));var h=Dt;if(Dt|=4,Mh(i.current),kh(i,i.current,d,n),Dt=h,yi(0,!1),se&&typeof se.onPostCommitFiberRoot=="function")try{se.onPostCommitFiberRoot(pe,i)}catch{}return!0}finally{ae.p=a,T.T=l,Qh(e,t)}}function Gh(e,t,n){t=kl(n,t),t=Du(e.stateNode,t,2),e=Yo(e,t,2),e!==null&&(Pe(e,2),lo(e))}function $t(e,t,n){if(e.tag===3)Gh(e,e,n);else for(;t!==null;){if(t.tag===3){Gh(t,e,n);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Go===null||!Go.has(l))){e=kl(n,e),n=Vf(2),l=Yo(t,n,2),l!==null&&(Zf(n,l,t,e),Pe(l,2),lo(l));break}}t=t.return}}function ld(e,t,n){var l=e.pingCache;if(l===null){l=e.pingCache=new $p;var a=new Set;l.set(t,a)}else a=l.get(t),a===void 0&&(a=new Set,l.set(t,a));a.has(n)||(Zu=!0,a.add(n),e=Ip.bind(null,e,t,n),t.then(e,e))}function Ip(e,t,n){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,qt===e&&(vt&n)===n&&(rn===4||rn===3&&(vt&62914560)===vt&&300>Ge()-Or?(Dt&2)===0&&gs(e,0):Ku|=n,hs===vt&&(hs=0)),lo(e)}function Vh(e,t){t===0&&(t=Be()),e=xa(e,t),e!==null&&(Pe(e,t),lo(e))}function qp(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Vh(e,n)}function Qp(e,t){var n=0;switch(e.tag){case 31:case 13:var l=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(u(314))}l!==null&&l.delete(t),Vh(e,n)}function Wp(e,t){return We(e,t)}var Ir=null,ps=null,od=!1,qr=!1,ad=!1,Ko=0;function lo(e){e!==ps&&e.next===null&&(ps===null?Ir=ps=e:ps=ps.next=e),qr=!0,od||(od=!0,Vp())}function yi(e,t){if(!ad&&qr){ad=!0;do for(var n=!1,l=Ir;l!==null;){if(e!==0){var a=l.pendingLanes;if(a===0)var i=0;else{var d=l.suspendedLanes,h=l.pingedLanes;i=(1<<31-Re(42|e)+1)-1,i&=a&~(d&~h),i=i&201326741?i&201326741|1:i?i|2:0}i!==0&&(n=!0,Jh(l,i))}else i=vt,i=xe(l,l===qt?i:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(i&3)===0||bt(l,i)||(n=!0,Jh(l,i));l=l.next}while(n);ad=!1}}function Gp(){Zh()}function Zh(){qr=od=!1;var e=0;Ko!==0&&o1()&&(e=Ko);for(var t=Ge(),n=null,l=Ir;l!==null;){var a=l.next,i=Kh(l,t);i===0?(l.next=null,n===null?Ir=a:n.next=a,a===null&&(ps=n)):(n=l,(e!==0||(i&3)!==0)&&(qr=!0)),l=a}wn!==0&&wn!==5||yi(e),Ko!==0&&(Ko=0)}function Kh(e,t){for(var n=e.suspendedLanes,l=e.pingedLanes,a=e.expirationTimes,i=e.pendingLanes&-62914561;0<i;){var d=31-Re(i),h=1<<d,v=a[d];v===-1?((h&n)===0||(h&l)!==0)&&(a[d]=Je(h,t)):v<=t&&(e.expiredLanes|=h),i&=~h}if(t=qt,n=vt,n=xe(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,n===0||e===t&&(Lt===2||Lt===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&He(l),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||bt(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(l!==null&&He(l),Yl(n)){case 2:case 8:n=Qt;break;case 32:n=Te;break;case 268435456:n=O;break;default:n=Te}return l=Fh.bind(null,e),n=We(n,l),e.callbackPriority=t,e.callbackNode=n,t}return l!==null&&l!==null&&He(l),e.callbackPriority=2,e.callbackNode=null,2}function Fh(e,t){if(wn!==0&&wn!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Xr()&&e.callbackNode!==n)return null;var l=vt;return l=xe(e,e===qt?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(Dh(e,l,t),Kh(e,Ge()),e.callbackNode!=null&&e.callbackNode===n?Fh.bind(null,e):null)}function Jh(e,t){if(Xr())return null;Dh(e,t,!0)}function Vp(){s1(function(){(Dt&6)!==0?We(Ct,Gp):Zh()})}function sd(){if(Ko===0){var e=ls;e===0&&(e=Se,Se<<=1,(Se&261888)===0&&(Se=256)),Ko=e}return Ko}function Ph(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:_a(""+e)}function e0(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function Zp(e,t,n,l,a){if(t==="submit"&&n&&n.stateNode===a){var i=Ph((a[Ln]||null).action),d=l.submitter;d&&(t=(t=d[Ln]||null)?Ph(t.formAction):d.getAttribute("formAction"),t!==null&&(i=t,d=null));var h=new Xa("action","action",null,l,a);e.push({event:h,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Ko!==0){var v=d?e0(a,d):new FormData(a);Cu(n,{pending:!0,data:v,method:a.method,action:i},null,v)}}else typeof i=="function"&&(h.preventDefault(),v=d?e0(a,d):new FormData(a),Cu(n,{pending:!0,data:v,method:a.method,action:i},i,v))},currentTarget:a}]})}}for(var id=0;id<Ic.length;id++){var rd=Ic[id],Kp=rd.toLowerCase(),Fp=rd[0].toUpperCase()+rd.slice(1);Ol(Kp,"on"+Fp)}Ol(z_,"onAnimationEnd"),Ol(R_,"onAnimationIteration"),Ol(D_,"onAnimationStart"),Ol("dblclick","onDoubleClick"),Ol("focusin","onFocus"),Ol("focusout","onBlur"),Ol(fp,"onTransitionRun"),Ol(hp,"onTransitionStart"),Ol(mp,"onTransitionCancel"),Ol(N_,"onTransitionEnd"),Cn("onMouseEnter",["mouseout","mouseover"]),Cn("onMouseLeave",["mouseout","mouseover"]),Cn("onPointerEnter",["pointerout","pointerover"]),Cn("onPointerLeave",["pointerout","pointerover"]),yl("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),yl("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),yl("onBeforeInput",["compositionend","keypress","textInput","paste"]),yl("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),yl("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),yl("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var pi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Jp=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(pi));function t0(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var l=e[n],a=l.event;l=l.listeners;e:{var i=void 0;if(t)for(var d=l.length-1;0<=d;d--){var h=l[d],v=h.instance,B=h.currentTarget;if(h=h.listener,v!==i&&a.isPropagationStopped())break e;i=h,a.currentTarget=B;try{i(a)}catch(q){ar(q)}a.currentTarget=null,i=v}else for(d=0;d<l.length;d++){if(h=l[d],v=h.instance,B=h.currentTarget,h=h.listener,v!==i&&a.isPropagationStopped())break e;i=h,a.currentTarget=B;try{i(a)}catch(q){ar(q)}a.currentTarget=null,i=v}}}}function pt(e,t){var n=t[$n];n===void 0&&(n=t[$n]=new Set);var l=e+"__bubble";n.has(l)||(n0(t,e,2,!1),n.add(l))}function cd(e,t,n){var l=0;t&&(l|=4),n0(n,e,l,t)}var Qr="_reactListening"+Math.random().toString(36).slice(2);function ud(e){if(!e[Qr]){e[Qr]=!0,Bs.forEach(function(n){n!=="selectionchange"&&(Jp.has(n)||cd(n,!1,e),cd(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Qr]||(t[Qr]=!0,cd("selectionchange",!1,t))}}function n0(e,t,n,l){switch(R0(t)){case 2:var a=C1;break;case 8:a=M1;break;default:a=jd}n=a.bind(null,t,n,e),a=void 0,!Al||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),l?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function dd(e,t,n,l,a){var i=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var d=l.tag;if(d===3||d===4){var h=l.stateNode.containerInfo;if(h===a)break;if(d===4)for(d=l.return;d!==null;){var v=d.tag;if((v===3||v===4)&&d.stateNode.containerInfo===a)return;d=d.return}for(;h!==null;){if(d=ko(h),d===null)return;if(v=d.tag,v===5||v===6||v===26||v===27){l=i=d;continue e}h=h.parentNode}}l=l.return}Vl(function(){var B=i,q=Nl(n),J=[];e:{var L=A_.get(e);if(L!==void 0){var Y=Xa,be=e;switch(e){case"keypress":if(Zl(n)===0)break e;case"keydown":case"keyup":Y=Ji;break;case"focusin":be="focus",Y=Wa;break;case"focusout":be="blur",Y=Wa;break;case"beforeblur":case"afterblur":Y=Wa;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Y=Do;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Y=Vi;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Y=er;break;case z_:case R_:case D_:Y=Hc;break;case N_:Y=bl;break;case"scroll":case"scrollend":Y=Bl;break;case"wheel":Y=qs;break;case"copy":case"cut":case"paste":Y=Ki;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Y=ga;break;case"toggle":case"beforetoggle":Y=Za}var Xe=(t&4)!==0,Xt=!Xe&&(e==="scroll"||e==="scrollend"),z=Xe?L!==null?L+"Capture":null:L;Xe=[];for(var C=B,A;C!==null;){var K=C;if(A=K.stateNode,K=K.tag,K!==5&&K!==26&&K!==27||A===null||z===null||(K=Ot(C,z),K!=null&&Xe.push(xi(C,K,A))),Xt)break;C=C.return}0<Xe.length&&(L=new Y(L,be,null,n,q),J.push({event:L,listeners:Xe}))}}if((t&7)===0){e:{if(L=e==="mouseover"||e==="pointerover",Y=e==="mouseout"||e==="pointerout",L&&n!==Ls&&(be=n.relatedTarget||n.fromElement)&&(ko(be)||be[Oe]))break e;if((Y||L)&&(L=q.window===q?q:(L=q.ownerDocument)?L.defaultView||L.parentWindow:window,Y?(be=n.relatedTarget||n.toElement,Y=B,be=be?ko(be):null,be!==null&&(Xt=f(be),Xe=be.tag,be!==Xt||Xe!==5&&Xe!==27&&Xe!==6)&&(be=null)):(Y=null,be=B),Y!==be)){if(Xe=Do,K="onMouseLeave",z="onMouseEnter",C="mouse",(e==="pointerout"||e==="pointerover")&&(Xe=ga,K="onPointerLeave",z="onPointerEnter",C="pointer"),Xt=Y==null?L:ua(Y),A=be==null?L:ua(be),L=new Xe(K,C+"leave",Y,n,q),L.target=Xt,L.relatedTarget=A,K=null,ko(q)===B&&(Xe=new Xe(z,C+"enter",be,n,q),Xe.target=A,Xe.relatedTarget=Xt,K=Xe),Xt=K,Y&&be)t:{for(Xe=Pp,z=Y,C=be,A=0,K=z;K;K=Xe(K))A++;K=0;for(var Ae=C;Ae;Ae=Xe(Ae))K++;for(;0<A-K;)z=Xe(z),A--;for(;0<K-A;)C=Xe(C),K--;for(;A--;){if(z===C||C!==null&&z===C.alternate){Xe=z;break t}z=Xe(z),C=Xe(C)}Xe=null}else Xe=null;Y!==null&&l0(J,L,Y,Xe,!1),be!==null&&Xt!==null&&l0(J,Xt,be,Xe,!0)}}e:{if(L=B?ua(B):window,Y=L.nodeName&&L.nodeName.toLowerCase(),Y==="select"||Y==="input"&&L.type==="file")var Et=ge;else if(S(L))if(Me)Et=Rt;else{Et=At;var Ee=ln}else Y=L.nodeName,!Y||Y.toLowerCase()!=="input"||L.type!=="checkbox"&&L.type!=="radio"?B&&Fn(B.elementType)&&(Et=ge):Et=un;if(Et&&(Et=Et(e,B))){k(J,Et,n,q);break e}Ee&&Ee(e,L,B),e==="focusout"&&B&&L.type==="number"&&B.memoizedProps.value!=null&&Wl(L,"number",L.value)}switch(Ee=B?ua(B):window,e){case"focusin":(S(Ee)||Ee.contentEditable==="true")&&(Pn=Ee,vl=B,Vt=null);break;case"focusout":Vt=vl=Pn=null;break;case"mousedown":wl=!0;break;case"contextmenu":case"mouseup":case"dragend":wl=!1,Pl(J,n,q);break;case"selectionchange":if(ya)break;case"keydown":case"keyup":Pl(J,n,q)}var ct;if(Ws)e:{switch(e){case"compositionstart":var wt="onCompositionStart";break e;case"compositionend":wt="onCompositionEnd";break e;case"compositionupdate":wt="onCompositionUpdate";break e}wt=void 0}else ao?oo(e,n)&&(wt="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(wt="onCompositionStart");wt&&(Ka&&n.locale!=="ko"&&(ao||wt!=="onCompositionStart"?wt==="onCompositionEnd"&&ao&&(ct=Hs()):(Wn=q,Ya="value"in Wn?Wn.value:Wn.textContent,ao=!0)),Ee=Wr(B,wt),0<Ee.length&&(wt=new Ue(wt,e,null,n,q),J.push({event:wt,listeners:Ee}),ct?wt.data=ct:(ct=nr(n),ct!==null&&(wt.data=ct)))),(ct=Gs?lr(e,n):m(e,n))&&(wt=Wr(B,"onBeforeInput"),0<wt.length&&(Ee=new Ue("onBeforeInput","beforeinput",null,n,q),J.push({event:Ee,listeners:wt}),Ee.data=ct)),Zp(J,e,B,n,q)}t0(J,t)})}function xi(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Wr(e,t){for(var n=t+"Capture",l=[];e!==null;){var a=e,i=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||i===null||(a=Ot(e,n),a!=null&&l.unshift(xi(e,a,i)),a=Ot(e,t),a!=null&&l.push(xi(e,a,i))),e.tag===3)return l;e=e.return}return[]}function Pp(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function l0(e,t,n,l,a){for(var i=t._reactName,d=[];n!==null&&n!==l;){var h=n,v=h.alternate,B=h.stateNode;if(h=h.tag,v!==null&&v===l)break;h!==5&&h!==26&&h!==27||B===null||(v=B,a?(B=Ot(n,i),B!=null&&d.unshift(xi(n,B,v))):a||(B=Ot(n,i),B!=null&&d.push(xi(n,B,v)))),n=n.return}d.length!==0&&e.push({event:t,listeners:d})}var e1=/\r\n?/g,t1=/\u0000|\uFFFD/g;function o0(e){return(typeof e=="string"?e:""+e).replace(e1,`
`).replace(t1,"")}function a0(e,t){return t=o0(t),o0(e)===t}function Yt(e,t,n,l,a,i){switch(n){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||To(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&To(e,""+l);break;case"className":Hn(e,"class",l);break;case"tabIndex":Hn(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Hn(e,n,l);break;case"style":Qi(e,l,i);break;case"data":if(t!=="object"){Hn(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=_a(""+l),e.setAttribute(n,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof i=="function"&&(n==="formAction"?(t!=="input"&&Yt(e,t,"name",a.name,a,null),Yt(e,t,"formEncType",a.formEncType,a,null),Yt(e,t,"formMethod",a.formMethod,a,null),Yt(e,t,"formTarget",a.formTarget,a,null)):(Yt(e,t,"encType",a.encType,a,null),Yt(e,t,"method",a.method,a,null),Yt(e,t,"target",a.target,a,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=_a(""+l),e.setAttribute(n,l);break;case"onClick":l!=null&&(e.onclick=Dl);break;case"onScroll":l!=null&&pt("scroll",e);break;case"onScrollEnd":l!=null&&pt("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(u(61));if(n=l.__html,n!=null){if(a.children!=null)throw Error(u(60));e.innerHTML=n}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}n=_a(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""+l):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":l===!0?e.setAttribute(n,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,l):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(n,l):e.removeAttribute(n);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(n):e.setAttribute(n,l);break;case"popover":pt("beforetoggle",e),pt("toggle",e),ql(e,"popover",l);break;case"xlinkActuate":il(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":il(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":il(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":il(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":il(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":il(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":il(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":il(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":il(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":ql(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=Wi.get(n)||n,ql(e,n,l))}}function _d(e,t,n,l,a,i){switch(n){case"style":Qi(e,l,i);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(u(61));if(n=l.__html,n!=null){if(a.children!=null)throw Error(u(60));e.innerHTML=n}}break;case"children":typeof l=="string"?To(e,l):(typeof l=="number"||typeof l=="bigint")&&To(e,""+l);break;case"onScroll":l!=null&&pt("scroll",e);break;case"onScrollEnd":l!=null&&pt("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Dl);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Co.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),t=n.slice(2,a?n.length-7:void 0),i=e[Ln]||null,i=i!=null?i[n]:null,typeof i=="function"&&e.removeEventListener(t,i,a),typeof l=="function")){typeof i!="function"&&i!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,l,a);break e}n in e?e[n]=l:l===!0?e.setAttribute(n,""):ql(e,n,l)}}}function Nn(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":pt("error",e),pt("load",e);var l=!1,a=!1,i;for(i in n)if(n.hasOwnProperty(i)){var d=n[i];if(d!=null)switch(i){case"src":l=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(u(137,t));default:Yt(e,t,i,d,n,null)}}a&&Yt(e,t,"srcSet",n.srcSet,n,null),l&&Yt(e,t,"src",n.src,n,null);return;case"input":pt("invalid",e);var h=i=d=a=null,v=null,B=null;for(l in n)if(n.hasOwnProperty(l)){var q=n[l];if(q!=null)switch(l){case"name":a=q;break;case"type":d=q;break;case"checked":v=q;break;case"defaultChecked":B=q;break;case"value":i=q;break;case"defaultValue":h=q;break;case"children":case"dangerouslySetInnerHTML":if(q!=null)throw Error(u(137,t));break;default:Yt(e,t,l,q,n,null)}}nn(e,i,h,v,B,d,a,!1);return;case"select":pt("invalid",e),l=d=i=null;for(a in n)if(n.hasOwnProperty(a)&&(h=n[a],h!=null))switch(a){case"value":i=h;break;case"defaultValue":d=h;break;case"multiple":l=h;default:Yt(e,t,a,h,n,null)}t=i,n=d,e.multiple=!!l,t!=null?Tn(e,!!l,t,!1):n!=null&&Tn(e,!!l,n,!0);return;case"textarea":pt("invalid",e),i=a=l=null;for(d in n)if(n.hasOwnProperty(d)&&(h=n[d],h!=null))switch(d){case"value":l=h;break;case"defaultValue":a=h;break;case"children":i=h;break;case"dangerouslySetInnerHTML":if(h!=null)throw Error(u(91));break;default:Yt(e,t,d,h,n,null)}qi(e,l,a,i);return;case"option":for(v in n)n.hasOwnProperty(v)&&(l=n[v],l!=null)&&(v==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":Yt(e,t,v,l,n,null));return;case"dialog":pt("beforetoggle",e),pt("toggle",e),pt("cancel",e),pt("close",e);break;case"iframe":case"object":pt("load",e);break;case"video":case"audio":for(l=0;l<pi.length;l++)pt(pi[l],e);break;case"image":pt("error",e),pt("load",e);break;case"details":pt("toggle",e);break;case"embed":case"source":case"link":pt("error",e),pt("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(B in n)if(n.hasOwnProperty(B)&&(l=n[B],l!=null))switch(B){case"children":case"dangerouslySetInnerHTML":throw Error(u(137,t));default:Yt(e,t,B,l,n,null)}return;default:if(Fn(t)){for(q in n)n.hasOwnProperty(q)&&(l=n[q],l!==void 0&&_d(e,t,q,l,n,void 0));return}}for(h in n)n.hasOwnProperty(h)&&(l=n[h],l!=null&&Yt(e,t,h,l,n,null))}function n1(e,t,n,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,i=null,d=null,h=null,v=null,B=null,q=null;for(Y in n){var J=n[Y];if(n.hasOwnProperty(Y)&&J!=null)switch(Y){case"checked":break;case"value":break;case"defaultValue":v=J;default:l.hasOwnProperty(Y)||Yt(e,t,Y,null,l,J)}}for(var L in l){var Y=l[L];if(J=n[L],l.hasOwnProperty(L)&&(Y!=null||J!=null))switch(L){case"type":i=Y;break;case"name":a=Y;break;case"checked":B=Y;break;case"defaultChecked":q=Y;break;case"value":d=Y;break;case"defaultValue":h=Y;break;case"children":case"dangerouslySetInnerHTML":if(Y!=null)throw Error(u(137,t));break;default:Y!==J&&Yt(e,t,L,Y,l,J)}}Ql(e,d,h,v,B,q,i,a);return;case"select":Y=d=h=L=null;for(i in n)if(v=n[i],n.hasOwnProperty(i)&&v!=null)switch(i){case"value":break;case"multiple":Y=v;default:l.hasOwnProperty(i)||Yt(e,t,i,null,l,v)}for(a in l)if(i=l[a],v=n[a],l.hasOwnProperty(a)&&(i!=null||v!=null))switch(a){case"value":L=i;break;case"defaultValue":h=i;break;case"multiple":d=i;default:i!==v&&Yt(e,t,a,i,l,v)}t=h,n=d,l=Y,L!=null?Tn(e,!!n,L,!1):!!l!=!!n&&(t!=null?Tn(e,!!n,t,!0):Tn(e,!!n,n?[]:"",!1));return;case"textarea":Y=L=null;for(h in n)if(a=n[h],n.hasOwnProperty(h)&&a!=null&&!l.hasOwnProperty(h))switch(h){case"value":break;case"children":break;default:Yt(e,t,h,null,l,a)}for(d in l)if(a=l[d],i=n[d],l.hasOwnProperty(d)&&(a!=null||i!=null))switch(d){case"value":L=a;break;case"defaultValue":Y=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(u(91));break;default:a!==i&&Yt(e,t,d,a,l,i)}vn(e,L,Y);return;case"option":for(var be in n)L=n[be],n.hasOwnProperty(be)&&L!=null&&!l.hasOwnProperty(be)&&(be==="selected"?e.selected=!1:Yt(e,t,be,null,l,L));for(v in l)L=l[v],Y=n[v],l.hasOwnProperty(v)&&L!==Y&&(L!=null||Y!=null)&&(v==="selected"?e.selected=L&&typeof L!="function"&&typeof L!="symbol":Yt(e,t,v,L,l,Y));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var Xe in n)L=n[Xe],n.hasOwnProperty(Xe)&&L!=null&&!l.hasOwnProperty(Xe)&&Yt(e,t,Xe,null,l,L);for(B in l)if(L=l[B],Y=n[B],l.hasOwnProperty(B)&&L!==Y&&(L!=null||Y!=null))switch(B){case"children":case"dangerouslySetInnerHTML":if(L!=null)throw Error(u(137,t));break;default:Yt(e,t,B,L,l,Y)}return;default:if(Fn(t)){for(var Xt in n)L=n[Xt],n.hasOwnProperty(Xt)&&L!==void 0&&!l.hasOwnProperty(Xt)&&_d(e,t,Xt,void 0,l,L);for(q in l)L=l[q],Y=n[q],!l.hasOwnProperty(q)||L===Y||L===void 0&&Y===void 0||_d(e,t,q,L,l,Y);return}}for(var z in n)L=n[z],n.hasOwnProperty(z)&&L!=null&&!l.hasOwnProperty(z)&&Yt(e,t,z,null,l,L);for(J in l)L=l[J],Y=n[J],!l.hasOwnProperty(J)||L===Y||L==null&&Y==null||Yt(e,t,J,L,l,Y)}function s0(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function l1(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),l=0;l<n.length;l++){var a=n[l],i=a.transferSize,d=a.initiatorType,h=a.duration;if(i&&h&&s0(d)){for(d=0,h=a.responseEnd,l+=1;l<n.length;l++){var v=n[l],B=v.startTime;if(B>h)break;var q=v.transferSize,J=v.initiatorType;q&&s0(J)&&(v=v.responseEnd,d+=q*(v<h?1:(h-B)/(v-B)))}if(--l,t+=8*(i+d)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var fd=null,hd=null;function Gr(e){return e.nodeType===9?e:e.ownerDocument}function i0(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function r0(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function md(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var gd=null;function o1(){var e=window.event;return e&&e.type==="popstate"?e===gd?!1:(gd=e,!0):(gd=null,!1)}var c0=typeof setTimeout=="function"?setTimeout:void 0,a1=typeof clearTimeout=="function"?clearTimeout:void 0,u0=typeof Promise=="function"?Promise:void 0,s1=typeof queueMicrotask=="function"?queueMicrotask:typeof u0<"u"?function(e){return u0.resolve(null).then(e).catch(i1)}:c0;function i1(e){setTimeout(function(){throw e})}function Fo(e){return e==="head"}function d0(e,t){var n=t,l=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(l===0){e.removeChild(a),ws(t);return}l--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")l++;else if(n==="html")bi(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,bi(n);for(var i=n.firstChild;i;){var d=i.nextSibling,h=i.nodeName;i[ca]||h==="SCRIPT"||h==="STYLE"||h==="LINK"&&i.rel.toLowerCase()==="stylesheet"||n.removeChild(i),i=d}}else n==="body"&&bi(e.ownerDocument.body);n=a}while(n);ws(t)}function _0(e,t){var n=e;e=0;do{var l=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=l}while(n)}function yd(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":yd(n),$a(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function r1(e,t,n,l){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[ca])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(i=e.getAttribute("rel"),i==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(i!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(i=e.getAttribute("src"),(i!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&i&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var i=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===i)return e}else return e;if(e=Tl(e.nextSibling),e===null)break}return null}function c1(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Tl(e.nextSibling),e===null))return null;return e}function f0(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Tl(e.nextSibling),e===null))return null;return e}function pd(e){return e.data==="$?"||e.data==="$~"}function xd(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function u1(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var l=function(){t(),n.removeEventListener("DOMContentLoaded",l)};n.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Tl(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var bd=null;function h0(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return Tl(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function m0(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function g0(e,t,n){switch(t=Gr(n),e){case"html":if(e=t.documentElement,!e)throw Error(u(452));return e;case"head":if(e=t.head,!e)throw Error(u(453));return e;case"body":if(e=t.body,!e)throw Error(u(454));return e;default:throw Error(u(451))}}function bi(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);$a(e)}var zl=new Map,y0=new Set;function Vr(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var wo=ae.d;ae.d={f:d1,r:_1,D:f1,C:h1,L:m1,m:g1,X:p1,S:y1,M:x1};function d1(){var e=wo.f(),t=Hr();return e||t}function _1(e){var t=jo(e);t!==null&&t.tag===5&&t.type==="form"?Af(t):wo.r(e)}var xs=typeof document>"u"?null:document;function p0(e,t,n){var l=xs;if(l&&typeof t=="string"&&t){var a=qn(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),y0.has(a)||(y0.add(a),e={rel:e,crossOrigin:n,href:t},l.querySelector(a)===null&&(t=l.createElement("link"),Nn(t,"link",e),hn(t),l.head.appendChild(t)))}}function f1(e){wo.D(e),p0("dns-prefetch",e,null)}function h1(e,t){wo.C(e,t),p0("preconnect",e,t)}function m1(e,t,n){wo.L(e,t,n);var l=xs;if(l&&e&&t){var a='link[rel="preload"][as="'+qn(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+qn(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+qn(n.imageSizes)+'"]')):a+='[href="'+qn(e)+'"]';var i=a;switch(t){case"style":i=bs(e);break;case"script":i=vs(e)}zl.has(i)||(e=$({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),zl.set(i,e),l.querySelector(a)!==null||t==="style"&&l.querySelector(vi(i))||t==="script"&&l.querySelector(wi(i))||(t=l.createElement("link"),Nn(t,"link",e),hn(t),l.head.appendChild(t)))}}function g1(e,t){wo.m(e,t);var n=xs;if(n&&e){var l=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+qn(l)+'"][href="'+qn(e)+'"]',i=a;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":i=vs(e)}if(!zl.has(i)&&(e=$({rel:"modulepreload",href:e},t),zl.set(i,e),n.querySelector(a)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(wi(i)))return}l=n.createElement("link"),Nn(l,"link",e),hn(l),n.head.appendChild(l)}}}function y1(e,t,n){wo.S(e,t,n);var l=xs;if(l&&e){var a=Il(l).hoistableStyles,i=bs(e);t=t||"default";var d=a.get(i);if(!d){var h={loading:0,preload:null};if(d=l.querySelector(vi(i)))h.loading=5;else{e=$({rel:"stylesheet",href:e,"data-precedence":t},n),(n=zl.get(i))&&vd(e,n);var v=d=l.createElement("link");hn(v),Nn(v,"link",e),v._p=new Promise(function(B,q){v.onload=B,v.onerror=q}),v.addEventListener("load",function(){h.loading|=1}),v.addEventListener("error",function(){h.loading|=2}),h.loading|=4,Zr(d,t,l)}d={type:"stylesheet",instance:d,count:1,state:h},a.set(i,d)}}}function p1(e,t){wo.X(e,t);var n=xs;if(n&&e){var l=Il(n).hoistableScripts,a=vs(e),i=l.get(a);i||(i=n.querySelector(wi(a)),i||(e=$({src:e,async:!0},t),(t=zl.get(a))&&wd(e,t),i=n.createElement("script"),hn(i),Nn(i,"link",e),n.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(a,i))}}function x1(e,t){wo.M(e,t);var n=xs;if(n&&e){var l=Il(n).hoistableScripts,a=vs(e),i=l.get(a);i||(i=n.querySelector(wi(a)),i||(e=$({src:e,async:!0,type:"module"},t),(t=zl.get(a))&&wd(e,t),i=n.createElement("script"),hn(i),Nn(i,"link",e),n.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(a,i))}}function x0(e,t,n,l){var a=(a=Ze.current)?Vr(a):null;if(!a)throw Error(u(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=bs(n.href),n=Il(a).hoistableStyles,l=n.get(t),l||(l={type:"style",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=bs(n.href);var i=Il(a).hoistableStyles,d=i.get(e);if(d||(a=a.ownerDocument||a,d={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},i.set(e,d),(i=a.querySelector(vi(e)))&&!i._p&&(d.instance=i,d.state.loading=5),zl.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},zl.set(e,n),i||b1(a,e,n,d.state))),t&&l===null)throw Error(u(528,""));return d}if(t&&l!==null)throw Error(u(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=vs(n),n=Il(a).hoistableScripts,l=n.get(t),l||(l={type:"script",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(u(444,e))}}function bs(e){return'href="'+qn(e)+'"'}function vi(e){return'link[rel="stylesheet"]['+e+"]"}function b0(e){return $({},e,{"data-precedence":e.precedence,precedence:null})}function b1(e,t,n,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),Nn(t,"link",n),hn(t),e.head.appendChild(t))}function vs(e){return'[src="'+qn(e)+'"]'}function wi(e){return"script[async]"+e}function v0(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+qn(n.href)+'"]');if(l)return t.instance=l,hn(l),l;var a=$({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),hn(l),Nn(l,"style",a),Zr(l,n.precedence,e),t.instance=l;case"stylesheet":a=bs(n.href);var i=e.querySelector(vi(a));if(i)return t.state.loading|=4,t.instance=i,hn(i),i;l=b0(n),(a=zl.get(a))&&vd(l,a),i=(e.ownerDocument||e).createElement("link"),hn(i);var d=i;return d._p=new Promise(function(h,v){d.onload=h,d.onerror=v}),Nn(i,"link",l),t.state.loading|=4,Zr(i,n.precedence,e),t.instance=i;case"script":return i=vs(n.src),(a=e.querySelector(wi(i)))?(t.instance=a,hn(a),a):(l=n,(a=zl.get(i))&&(l=$({},n),wd(l,a)),e=e.ownerDocument||e,a=e.createElement("script"),hn(a),Nn(a,"link",l),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(u(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,Zr(l,n.precedence,e));return t.instance}function Zr(e,t,n){for(var l=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=l.length?l[l.length-1]:null,i=a,d=0;d<l.length;d++){var h=l[d];if(h.dataset.precedence===t)i=h;else if(i!==a)break}i?i.parentNode.insertBefore(e,i.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function vd(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function wd(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Kr=null;function w0(e,t,n){if(Kr===null){var l=new Map,a=Kr=new Map;a.set(n,l)}else a=Kr,l=a.get(n),l||(l=new Map,a.set(n,l));if(l.has(e))return l;for(l.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var i=n[a];if(!(i[ca]||i[an]||e==="link"&&i.getAttribute("rel")==="stylesheet")&&i.namespaceURI!=="http://www.w3.org/2000/svg"){var d=i.getAttribute(t)||"";d=e+d;var h=l.get(d);h?h.push(i):l.set(d,[i])}}return l}function S0(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function v1(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function k0(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function w1(e,t,n,l){if(n.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=bs(l.href),i=t.querySelector(vi(a));if(i){t=i._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Fr.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=i,hn(i);return}i=t.ownerDocument||t,l=b0(l),(a=zl.get(a))&&vd(l,a),i=i.createElement("link"),hn(i);var d=i;d._p=new Promise(function(h,v){d.onload=h,d.onerror=v}),Nn(i,"link",l),n.instance=i}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Fr.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Sd=0;function S1(e,t){return e.stylesheets&&e.count===0&&Pr(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var l=setTimeout(function(){if(e.stylesheets&&Pr(e,e.stylesheets),e.unsuspend){var i=e.unsuspend;e.unsuspend=null,i()}},6e4+t);0<e.imgBytes&&Sd===0&&(Sd=62500*l1());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Pr(e,e.stylesheets),e.unsuspend)){var i=e.unsuspend;e.unsuspend=null,i()}},(e.imgBytes>Sd?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(a)}}:null}function Fr(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Pr(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Jr=null;function Pr(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Jr=new Map,t.forEach(k1,e),Jr=null,Fr.call(e))}function k1(e,t){if(!(t.state.loading&4)){var n=Jr.get(e);if(n)var l=n.get(null);else{n=new Map,Jr.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),i=0;i<a.length;i++){var d=a[i];(d.nodeName==="LINK"||d.getAttribute("media")!=="not all")&&(n.set(d.dataset.precedence,d),l=d)}l&&n.set(null,l)}a=t.instance,d=a.getAttribute("data-precedence"),i=n.get(d)||l,i===l&&n.set(null,a),n.set(d,a),this.count++,l=Fr.bind(this),a.addEventListener("load",l),a.addEventListener("error",l),i?i.parentNode.insertBefore(a,i.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var Si={$$typeof:ve,Provider:null,Consumer:null,_currentValue:X,_currentValue2:X,_threadCount:0};function j1(e,t,n,l,a,i,d,h,v){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=St(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=St(0),this.hiddenUpdates=St(null),this.identifierPrefix=l,this.onUncaughtError=a,this.onCaughtError=i,this.onRecoverableError=d,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=v,this.incompleteTransitions=new Map}function j0(e,t,n,l,a,i,d,h,v,B,q,J){return e=new j1(e,t,n,d,v,B,q,J,h),t=1,i===!0&&(t|=24),i=ul(3,null,null,t),e.current=i,i.stateNode=e,t=nu(),t.refCount++,e.pooledCache=t,t.refCount++,i.memoizedState={element:l,isDehydrated:n,cache:t},su(i),e}function C0(e){return e?(e=Ja,e):Ja}function M0(e,t,n,l,a,i){a=C0(a),l.context===null?l.context=a:l.pendingContext=a,l=Uo(t),l.payload={element:n},i=i===void 0?null:i,i!==null&&(l.callback=i),n=Yo(e,l,t),n!==null&&(ol(n,e,t),ti(n,e,t))}function E0(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function kd(e,t){E0(e,t),(e=e.alternate)&&E0(e,t)}function T0(e){if(e.tag===13||e.tag===31){var t=xa(e,67108864);t!==null&&ol(t,e,67108864),kd(e,67108864)}}function z0(e){if(e.tag===13||e.tag===31){var t=ml();t=On(t);var n=xa(e,t);n!==null&&ol(n,e,t),kd(e,t)}}var ec=!0;function C1(e,t,n,l){var a=T.T;T.T=null;var i=ae.p;try{ae.p=2,jd(e,t,n,l)}finally{ae.p=i,T.T=a}}function M1(e,t,n,l){var a=T.T;T.T=null;var i=ae.p;try{ae.p=8,jd(e,t,n,l)}finally{ae.p=i,T.T=a}}function jd(e,t,n,l){if(ec){var a=Cd(l);if(a===null)dd(e,t,l,tc,n),D0(e,l);else if(T1(a,e,t,n,l))l.stopPropagation();else if(D0(e,l),t&4&&-1<E1.indexOf(e)){for(;a!==null;){var i=jo(a);if(i!==null)switch(i.tag){case 3:if(i=i.stateNode,i.current.memoizedState.isDehydrated){var d=Fe(i.pendingLanes);if(d!==0){var h=i;for(h.pendingLanes|=2,h.entangledLanes|=2;d;){var v=1<<31-Re(d);h.entanglements[1]|=v,d&=~v}lo(i),(Dt&6)===0&&(Lr=Ge()+500,yi(0))}}break;case 31:case 13:h=xa(i,2),h!==null&&ol(h,i,2),Hr(),kd(i,2)}if(i=Cd(l),i===null&&dd(e,t,l,tc,n),i===a)break;a=i}a!==null&&l.stopPropagation()}else dd(e,t,l,null,n)}}function Cd(e){return e=Nl(e),Md(e)}var tc=null;function Md(e){if(tc=null,e=ko(e),e!==null){var t=f(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=b(t),e!==null)return e;e=null}else if(n===31){if(e=R(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return tc=e,null}function R0(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(lt()){case Ct:return 2;case Qt:return 8;case Te:case N:return 32;case O:return 268435456;default:return 32}default:return 32}}var Ed=!1,Jo=null,Po=null,ea=null,ki=new Map,ji=new Map,ta=[],E1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function D0(e,t){switch(e){case"focusin":case"focusout":Jo=null;break;case"dragenter":case"dragleave":Po=null;break;case"mouseover":case"mouseout":ea=null;break;case"pointerover":case"pointerout":ki.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":ji.delete(t.pointerId)}}function Ci(e,t,n,l,a,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:l,nativeEvent:i,targetContainers:[a]},t!==null&&(t=jo(t),t!==null&&T0(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function T1(e,t,n,l,a){switch(t){case"focusin":return Jo=Ci(Jo,e,t,n,l,a),!0;case"dragenter":return Po=Ci(Po,e,t,n,l,a),!0;case"mouseover":return ea=Ci(ea,e,t,n,l,a),!0;case"pointerover":var i=a.pointerId;return ki.set(i,Ci(ki.get(i)||null,e,t,n,l,a)),!0;case"gotpointercapture":return i=a.pointerId,ji.set(i,Ci(ji.get(i)||null,e,t,n,l,a)),!0}return!1}function N0(e){var t=ko(e.target);if(t!==null){var n=f(t);if(n!==null){if(t=n.tag,t===13){if(t=b(n),t!==null){e.blockedOn=t,en(e.priority,function(){z0(n)});return}}else if(t===31){if(t=R(n),t!==null){e.blockedOn=t,en(e.priority,function(){z0(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function nc(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Cd(e.nativeEvent);if(n===null){n=e.nativeEvent;var l=new n.constructor(n.type,n);Ls=l,n.target.dispatchEvent(l),Ls=null}else return t=jo(n),t!==null&&T0(t),e.blockedOn=n,!1;t.shift()}return!0}function A0(e,t,n){nc(e)&&n.delete(t)}function z1(){Ed=!1,Jo!==null&&nc(Jo)&&(Jo=null),Po!==null&&nc(Po)&&(Po=null),ea!==null&&nc(ea)&&(ea=null),ki.forEach(A0),ji.forEach(A0)}function lc(e,t){e.blockedOn===t&&(e.blockedOn=null,Ed||(Ed=!0,s.unstable_scheduleCallback(s.unstable_NormalPriority,z1)))}var oc=null;function B0(e){oc!==e&&(oc=e,s.unstable_scheduleCallback(s.unstable_NormalPriority,function(){oc===e&&(oc=null);for(var t=0;t<e.length;t+=3){var n=e[t],l=e[t+1],a=e[t+2];if(typeof l!="function"){if(Md(l||n)===null)continue;break}var i=jo(n);i!==null&&(e.splice(t,3),t-=3,Cu(i,{pending:!0,data:a,method:n.method,action:l},l,a))}}))}function ws(e){function t(v){return lc(v,e)}Jo!==null&&lc(Jo,e),Po!==null&&lc(Po,e),ea!==null&&lc(ea,e),ki.forEach(t),ji.forEach(t);for(var n=0;n<ta.length;n++){var l=ta[n];l.blockedOn===e&&(l.blockedOn=null)}for(;0<ta.length&&(n=ta[0],n.blockedOn===null);)N0(n),n.blockedOn===null&&ta.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(l=0;l<n.length;l+=3){var a=n[l],i=n[l+1],d=a[Ln]||null;if(typeof i=="function")d||B0(n);else if(d){var h=null;if(i&&i.hasAttribute("formAction")){if(a=i,d=i[Ln]||null)h=d.formAction;else if(Md(a)!==null)continue}else h=d.action;typeof h=="function"?n[l+1]=h:(n.splice(l,3),l-=3),B0(n)}}}function O0(){function e(i){i.canIntercept&&i.info==="react-transition"&&i.intercept({handler:function(){return new Promise(function(d){return a=d})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),l||setTimeout(n,20)}function n(){if(!l&&!navigation.transition){var i=navigation.currentEntry;i&&i.url!=null&&navigation.navigate(i.url,{state:i.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function Td(e){this._internalRoot=e}ac.prototype.render=Td.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(u(409));var n=t.current,l=ml();M0(n,l,e,t,null,null)},ac.prototype.unmount=Td.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;M0(e.current,2,null,e,null,null),Hr(),t[Oe]=null}};function ac(e){this._internalRoot=e}ac.prototype.unstable_scheduleHydration=function(e){if(e){var t=ra();e={blockedOn:null,target:e,priority:t};for(var n=0;n<ta.length&&t!==0&&t<ta[n].priority;n++);ta.splice(n,0,e),n===0&&N0(e)}};var L0=r.version;if(L0!=="19.2.6")throw Error(u(527,L0,"19.2.6"));ae.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(u(188)):(e=Object.keys(e).join(","),Error(u(268,e)));return e=M(t),e=e!==null?E(e):null,e=e===null?null:e.stateNode,e};var R1={bundleType:0,version:"19.2.6",rendererPackageName:"react-dom",currentDispatcherRef:T,reconcilerVersion:"19.2.6"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var sc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!sc.isDisabled&&sc.supportsFiber)try{pe=sc.inject(R1),se=sc}catch{}}return ks.createRoot=function(e,t){if(!_(e))throw Error(u(299));var n=!1,l="",a=qf,i=Qf,d=Wf;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(i=t.onCaughtError),t.onRecoverableError!==void 0&&(d=t.onRecoverableError)),t=j0(e,1,!1,null,null,n,l,null,a,i,d,O0),e[Oe]=t.current,ud(e),new Td(t)},ks.hydrateRoot=function(e,t,n){if(!_(e))throw Error(u(299));var l=!1,a="",i=qf,d=Qf,h=Wf,v=null;return n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(i=n.onUncaughtError),n.onCaughtError!==void 0&&(d=n.onCaughtError),n.onRecoverableError!==void 0&&(h=n.onRecoverableError),n.formState!==void 0&&(v=n.formState)),t=j0(e,1,!0,t,n??null,l,a,v,i,d,h,O0),t.context=C0(null),n=t.current,l=ml(),l=On(l),a=Uo(l),a.callback=null,Yo(n,a,l),n=l,t.current.lanes=n,Pe(t,n),lo(t),e[Oe]=t.current,ud(e),new ac(t)},ks.version="19.2.6",ks}var Ud;function W0(){if(Ud)return rc.exports;Ud=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(r){console.error(r)}}return s(),rc.exports=Q0(),rc.exports}var G0=W0(),y=_c();const V0=$0(y);var Yd=$d(),Z0=`.styles-module__popup___IhzrD svg[fill=none] {
  fill: none !important;
}
.styles-module__popup___IhzrD svg[fill=none] :not([fill]) {
  fill: none !important;
}

@keyframes styles-module__popupEnter___AuQDN {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
}
@keyframes styles-module__popupExit___JJKQX {
  from {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
}
@keyframes styles-module__shake___jdbWe {
  0%, 100% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(0);
  }
  20% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-3px);
  }
  40% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(3px);
  }
  60% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-2px);
  }
  80% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(2px);
  }
}
.styles-module__popup___IhzrD {
  position: fixed;
  transform: translateX(-50%);
  width: 280px;
  padding: 0.75rem 1rem 14px;
  background: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  z-index: 100001;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  will-change: transform, opacity;
  opacity: 0;
}
.styles-module__popup___IhzrD.styles-module__enter___L7U7N {
  animation: styles-module__popupEnter___AuQDN 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w {
  opacity: 1;
  transform: translateX(-50%) scale(1) translateY(0);
}
.styles-module__popup___IhzrD.styles-module__exit___5eGjE {
  animation: styles-module__popupExit___JJKQX 0.15s ease-in forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w.styles-module__shake___jdbWe {
  animation: styles-module__shake___jdbWe 0.25s ease-out;
}

.styles-module__header___wWsSi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5625rem;
}

.styles-module__element___fTV2z {
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.styles-module__headerToggle___WpW0b {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  flex: 1;
  min-width: 0;
  text-align: left;
}
.styles-module__headerToggle___WpW0b .styles-module__element___fTV2z {
  flex: 1;
}

.styles-module__chevron___ZZJlR {
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}
.styles-module__chevron___ZZJlR.styles-module__expanded___2Hxgv {
  transform: rotate(90deg);
}

.styles-module__stylesWrapper___pnHgy {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.styles-module__stylesWrapper___pnHgy.styles-module__expanded___2Hxgv {
  grid-template-rows: 1fr;
}

.styles-module__stylesInner___YYZe2 {
  overflow: hidden;
}

.styles-module__stylesBlock___VfQKn {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.375rem;
  padding: 0.5rem 0.625rem;
  margin-bottom: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.6875rem;
  line-height: 1.5;
}

.styles-module__styleLine___1YQiD {
  color: rgba(255, 255, 255, 0.85);
  word-break: break-word;
}

.styles-module__styleProperty___84L1i {
  color: #c792ea;
}

.styles-module__styleValue___q51-h {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__timestamp___Dtpsv {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  font-variant-numeric: tabular-nums;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.styles-module__quote___mcMmQ {
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  line-height: 1.45;
}

.styles-module__textarea___jrSae {
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
}
.styles-module__textarea___jrSae:focus {
  border-color: var(--agentation-color-blue);
}
.styles-module__textarea___jrSae.styles-module__green___99l3h:focus {
  border-color: var(--agentation-color-green);
}
.styles-module__textarea___jrSae::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
.styles-module__textarea___jrSae::-webkit-scrollbar {
  width: 6px;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-track {
  background: transparent;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.styles-module__actions___D6x3f {
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.styles-module__cancel___hRjnL,
.styles-module__submit___K-mIR {
  padding: 0.4rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.styles-module__cancel___hRjnL {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__cancel___hRjnL:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.styles-module__submit___K-mIR {
  color: white;
}
.styles-module__submit___K-mIR:hover:not(:disabled) {
  filter: brightness(0.9);
}
.styles-module__submit___K-mIR:disabled {
  cursor: not-allowed;
}

.styles-module__deleteWrapper___oSjdo {
  margin-right: auto;
}

.styles-module__deleteButton___4VuAE {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.styles-module__deleteButton___4VuAE:hover {
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
  color: var(--agentation-color-red);
}
.styles-module__deleteButton___4VuAE:active {
  transform: scale(0.92);
}

.styles-module__light___6AaSQ.styles-module__popup___IhzrD {
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.styles-module__light___6AaSQ .styles-module__element___fTV2z {
  color: rgba(0, 0, 0, 0.6);
}
.styles-module__light___6AaSQ .styles-module__timestamp___Dtpsv {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__chevron___ZZJlR {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__stylesBlock___VfQKn {
  background: rgba(0, 0, 0, 0.03);
}
.styles-module__light___6AaSQ .styles-module__styleLine___1YQiD {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__styleProperty___84L1i {
  color: #7c3aed;
}
.styles-module__light___6AaSQ .styles-module__styleValue___q51-h {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__quote___mcMmQ {
  color: rgba(0, 0, 0, 0.55);
  background: rgba(0, 0, 0, 0.04);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae {
  background: rgba(0, 0, 0, 0.03);
  color: #1a1a1a;
  border-color: rgba(0, 0, 0, 0.12);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE:hover {
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
  color: var(--agentation-color-red);
}`,K0={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let s=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");s||(s=document.createElement("style"),s.id="feedback-tool-styles-annotation-popup-css-styles",document.head.appendChild(s)),s.textContent=Z0}var It=K0,F0=`.icon-transitions-module__iconState___uqK9J {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: center;
}

.icon-transitions-module__iconStateFast___HxlMm {
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform-origin: center;
}

.icon-transitions-module__iconFade___nPwXg {
  transition: opacity 0.2s ease;
}

.icon-transitions-module__iconFadeFast___Ofb2t {
  transition: opacity 0.15s ease;
}

.icon-transitions-module__visible___PlHsU {
  opacity: 1 !important;
}

.icon-transitions-module__visibleScaled___8Qog- {
  opacity: 1 !important;
  transform: scale(1);
}

.icon-transitions-module__hidden___ETykt {
  opacity: 0 !important;
}

.icon-transitions-module__hiddenScaled___JXn-m {
  opacity: 0 !important;
  transform: scale(0.8);
}

.icon-transitions-module__sending___uaLN- {
  opacity: 0.5 !important;
  transform: scale(0.8);
}`,J0={iconState:"icon-transitions-module__iconState___uqK9J",iconStateFast:"icon-transitions-module__iconStateFast___HxlMm",iconFade:"icon-transitions-module__iconFade___nPwXg",iconFadeFast:"icon-transitions-module__iconFadeFast___Ofb2t",visible:"icon-transitions-module__visible___PlHsU",visibleScaled:"icon-transitions-module__visibleScaled___8Qog-",hidden:"icon-transitions-module__hidden___ETykt",hiddenScaled:"icon-transitions-module__hiddenScaled___JXn-m",sending:"icon-transitions-module__sending___uaLN-"};if(typeof document<"u"){let s=document.getElementById("feedback-tool-styles-components-icon-transitions");s||(s=document.createElement("style"),s.id="feedback-tool-styles-components-icon-transitions",document.head.appendChild(s)),s.textContent=F0}var Ht=J0,P0=({size:s=16})=>o.jsx("svg",{width:s,height:s,viewBox:"0 0 16 16",fill:"none",children:o.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),em=({size:s=24,style:r={}})=>o.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",style:r,children:[o.jsxs("g",{clipPath:"url(#clip0_list_sparkle)",children:[o.jsx("path",{d:"M11.5 12L5.5 12",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M18.5 6.75L5.5 6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M9.25 17.25L5.5 17.25",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})]}),o.jsx("defs",{children:o.jsx("clipPath",{id:"clip0_list_sparkle",children:o.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),tm=({size:s=20,...r})=>o.jsxs("svg",{width:s,height:s,viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",...r,children:[o.jsx("circle",{cx:"10",cy:"10",r:"5.375",stroke:"currentColor",strokeWidth:"1.25"}),o.jsx("path",{d:"M8.5 8.5C8.73 7.85 9.31 7.49 10 7.5C10.86 7.51 11.5 8.13 11.5 9C11.5 10.08 10 10.5 10 10.5V10.75",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("circle",{cx:"10",cy:"12.625",r:"0.625",fill:"currentColor"})]}),nm=({size:s=24,copied:r=!1,tint:c})=>o.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",style:c?{color:c,transition:"color 0.3s ease"}:void 0,children:[o.jsxs("g",{className:`${Ht.iconState} ${r?Ht.hiddenScaled:Ht.visibleScaled}`,children:[o.jsx("path",{d:"M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",stroke:"currentColor",strokeWidth:"1.5"}),o.jsx("path",{d:"M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),o.jsxs("g",{className:`${Ht.iconState} ${r?Ht.visibleScaled:Ht.hiddenScaled}`,children:[o.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"var(--agentation-color-green)",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"var(--agentation-color-green)",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})]}),lm=({size:s=24,state:r="idle"})=>{const c=r==="idle",u=r==="sent",_=r==="failed",f=r==="sending";return o.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",children:[o.jsx("g",{className:`${Ht.iconStateFast} ${c?Ht.visibleScaled:f?Ht.sending:Ht.hiddenScaled}`,children:o.jsx("path",{d:"M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),o.jsxs("g",{className:`${Ht.iconStateFast} ${u?Ht.visibleScaled:Ht.hiddenScaled}`,children:[o.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"var(--agentation-color-green)",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"var(--agentation-color-green)",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),o.jsxs("g",{className:`${Ht.iconStateFast} ${_?Ht.visibleScaled:Ht.hiddenScaled}`,children:[o.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"var(--agentation-color-red)",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M12 8V12",stroke:"var(--agentation-color-red)",strokeWidth:"1.5",strokeLinecap:"round"}),o.jsx("circle",{cx:"12",cy:"15",r:"0.5",fill:"var(--agentation-color-red)",stroke:"var(--agentation-color-red)",strokeWidth:"1"})]})]})},om=({size:s=24,isOpen:r=!0})=>o.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",children:[o.jsxs("g",{className:`${Ht.iconFade} ${r?Ht.visible:Ht.hidden}`,children:[o.jsx("path",{d:"M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),o.jsxs("g",{className:`${Ht.iconFade} ${r?Ht.hidden:Ht.visible}`,children:[o.jsx("path",{d:"M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",fill:"currentColor"}),o.jsx("path",{d:"M5 19L19 5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})]}),am=({size:s=24,isPaused:r=!1})=>o.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",children:[o.jsxs("g",{className:`${Ht.iconFadeFast} ${r?Ht.hidden:Ht.visible}`,children:[o.jsx("path",{d:"M8 6L8 18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),o.jsx("path",{d:"M16 18L16 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),o.jsx("path",{className:`${Ht.iconFadeFast} ${r?Ht.visible:Ht.hidden}`,d:"M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",stroke:"currentColor",strokeWidth:"1.5"})]}),sm=({size:s=16})=>o.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",children:[o.jsx("path",{d:"M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("circle",{cx:"12",cy:"12",r:"2.5",stroke:"currentColor",strokeWidth:"1.5"})]}),im=({size:s=16})=>o.jsx("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",children:o.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Xd=({size:s=16})=>o.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",children:[o.jsxs("g",{clipPath:"url(#clip0_2_53)",children:[o.jsx("path",{d:"M16.25 16.25L7.75 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M7.75 16.25L16.25 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),o.jsx("defs",{children:o.jsx("clipPath",{id:"clip0_2_53",children:o.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),rm=({size:s=24})=>o.jsx("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",children:o.jsx("path",{d:"M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z",fill:"currentColor"})}),cm=({size:s=16})=>o.jsxs("svg",{width:s,height:s,viewBox:"0 0 20 20",fill:"none",children:[o.jsx("path",{d:"M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M10 3.9585V5.05698",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M10 14.9429V16.0414",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M5.7269 5.72656L6.50682 6.50649",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M13.4932 13.4932L14.2731 14.2731",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M3.95834 10H5.05683",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M14.9432 10H16.0417",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M5.7269 14.2731L6.50682 13.4932",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),o.jsx("path",{d:"M13.4932 6.50649L14.2731 5.72656",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"})]}),um=({size:s=16})=>o.jsx("svg",{width:s,height:s,viewBox:"0 0 20 20",fill:"none",children:o.jsx("path",{d:"M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z",stroke:"currentColor",strokeWidth:"1.13793",strokeLinecap:"round",strokeLinejoin:"round"})}),dm=({size:s=16})=>o.jsx("svg",{width:s,height:s,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:o.jsx("path",{d:"M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375",stroke:"currentColor",strokeWidth:"0.9",strokeLinecap:"round",strokeLinejoin:"round"})}),_m=({size:s=24})=>o.jsx("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:o.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),fm=({size:s=16})=>o.jsx("svg",{width:s,height:s,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:o.jsx("path",{d:"M8.5 3.5L4 8L8.5 12.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),hm=({size:s=24})=>o.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",children:[o.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",stroke:"currentColor",strokeWidth:"1.5"}),o.jsx("line",{x1:"3",y1:"9",x2:"21",y2:"9",stroke:"currentColor",strokeWidth:"1.5"}),o.jsx("line",{x1:"9",y1:"9",x2:"9",y2:"21",stroke:"currentColor",strokeWidth:"1.5"})]}),Id=["data-feedback-toolbar","data-annotation-popup","data-annotation-marker"],hc=Id.flatMap(s=>[`:not([${s}])`,`:not([${s}] *)`]).join(""),mc="feedback-freeze-styles",gc="__agentation_freeze";function mm(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:r=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const s=window;return s[gc]||(s[gc]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),s[gc]}var mt=mm();typeof window<"u"&&!mt.installed&&(mt.origSetTimeout=window.setTimeout.bind(window),mt.origSetInterval=window.setInterval.bind(window),mt.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(s,r,...c)=>typeof s=="string"?mt.origSetTimeout(s,r):mt.origSetTimeout((...u)=>{mt.frozen?mt.frozenTimeoutQueue.push(()=>s(...u)):s(...u)},r,...c),window.setInterval=(s,r,...c)=>typeof s=="string"?mt.origSetInterval(s,r):mt.origSetInterval((...u)=>{mt.frozen||s(...u)},r,...c),window.requestAnimationFrame=s=>mt.origRAF(r=>{mt.frozen?mt.frozenRAFQueue.push(s):s(r)}),mt.installed=!0);var Le=mt.origSetTimeout,gm=mt.origSetInterval,Da=mt.origRAF;function ym(s){return s?Id.some(r=>!!s.closest?.(`[${r}]`)):!1}function pm(){if(typeof document>"u"||mt.frozen)return;mt.frozen=!0,mt.frozenTimeoutQueue=[],mt.frozenRAFQueue=[];let s=document.getElementById(mc);s||(s=document.createElement("style"),s.id=mc),s.textContent=`
    *${hc},
    *${hc}::before,
    *${hc}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `,document.head.appendChild(s),mt.pausedAnimations=[];try{document.getAnimations().forEach(r=>{if(r.playState!=="running")return;const c=r.effect?.target;ym(c)||(r.pause(),mt.pausedAnimations.push(r))})}catch{}document.querySelectorAll("video").forEach(r=>{r.paused||(r.dataset.wasPaused="false",r.pause())})}function qd(){if(typeof document>"u"||!mt.frozen)return;mt.frozen=!1;const s=mt.frozenTimeoutQueue;mt.frozenTimeoutQueue=[];for(const c of s)mt.origSetTimeout(()=>{if(mt.frozen){mt.frozenTimeoutQueue.push(c);return}try{c()}catch(u){console.warn("[agentation] Error replaying queued timeout:",u)}},0);const r=mt.frozenRAFQueue;mt.frozenRAFQueue=[];for(const c of r)mt.origRAF(u=>{if(mt.frozen){mt.frozenRAFQueue.push(c);return}c(u)});for(const c of mt.pausedAnimations)try{c.play()}catch(u){console.warn("[agentation] Error resuming animation:",u)}mt.pausedAnimations=[],document.getElementById(mc)?.remove(),document.querySelectorAll("video").forEach(c=>{c.dataset.wasPaused==="false"&&(c.play().catch(()=>{}),delete c.dataset.wasPaused)})}function yc(s){if(!s)return;const r=c=>c.stopImmediatePropagation();document.addEventListener("focusin",r,!0),document.addEventListener("focusout",r,!0);try{s.focus()}finally{document.removeEventListener("focusin",r,!0),document.removeEventListener("focusout",r,!0)}}var Mi=y.forwardRef(function({element:r,timestamp:c,selectedText:u,placeholder:_="What should change?",initialValue:f="",submitLabel:b="Add",onSubmit:R,onCancel:x,onDelete:M,style:E,accentColor:$="#3c82f7",isExiting:D=!1,lightMode:ue=!1,computedStyles:H},ne){const[U,G]=y.useState(f),[_e,ve]=y.useState(!1),[we,_t]=y.useState("initial"),[nt,oe]=y.useState(!1),[ot,rt]=y.useState(!1),at=y.useRef(null),$e=y.useRef(null),tt=y.useRef(null),xt=y.useRef(null);y.useEffect(()=>{D&&we!=="exit"&&_t("exit")},[D,we]),y.useEffect(()=>{Le(()=>{_t("enter")},0);const de=Le(()=>{_t("entered")},200),je=Le(()=>{const w=at.current;w&&(yc(w),w.selectionStart=w.selectionEnd=w.value.length,w.scrollTop=w.scrollHeight)},50);return()=>{clearTimeout(de),clearTimeout(je),tt.current&&clearTimeout(tt.current),xt.current&&clearTimeout(xt.current)}},[]);const Ye=y.useCallback(()=>{xt.current&&clearTimeout(xt.current),ve(!0),xt.current=Le(()=>{ve(!1),yc(at.current)},250)},[]);y.useImperativeHandle(ne,()=>({shake:Ye}),[Ye]);const Qe=y.useCallback(()=>{_t("exit"),tt.current=Le(()=>{x()},150)},[x]),T=y.useCallback(()=>{U.trim()&&R(U.trim())},[U,R]),ae=y.useCallback(de=>{de.stopPropagation(),!de.nativeEvent.isComposing&&(de.key==="Enter"&&!de.shiftKey&&(de.preventDefault(),T()),de.key==="Escape"&&Qe())},[T,Qe]),X=[It.popup,ue?It.light:"",we==="enter"?It.enter:"",we==="entered"?It.entered:"",we==="exit"?It.exit:"",_e?It.shake:""].filter(Boolean).join(" ");return o.jsxs("div",{ref:$e,className:X,"data-annotation-popup":!0,style:E,onClick:de=>de.stopPropagation(),children:[o.jsxs("div",{className:It.header,children:[H&&Object.keys(H).length>0?o.jsxs("button",{className:It.headerToggle,onClick:()=>{const de=ot;rt(!ot),de&&Le(()=>yc(at.current),0)},type:"button",children:[o.jsx("svg",{className:`${It.chevron} ${ot?It.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:o.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),o.jsx("span",{className:It.element,children:r})]}):o.jsx("span",{className:It.element,children:r}),c&&o.jsx("span",{className:It.timestamp,children:c})]}),H&&Object.keys(H).length>0&&o.jsx("div",{className:`${It.stylesWrapper} ${ot?It.expanded:""}`,children:o.jsx("div",{className:It.stylesInner,children:o.jsx("div",{className:It.stylesBlock,children:Object.entries(H).map(([de,je])=>o.jsxs("div",{className:It.styleLine,children:[o.jsx("span",{className:It.styleProperty,children:de.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",o.jsx("span",{className:It.styleValue,children:je}),";"]},de))})})}),u&&o.jsxs("div",{className:It.quote,children:["“",u.slice(0,80),u.length>80?"...":"","”"]}),o.jsx("textarea",{ref:at,className:It.textarea,style:{borderColor:nt?$:void 0},placeholder:_,value:U,onChange:de=>G(de.target.value),onFocus:()=>oe(!0),onBlur:()=>oe(!1),rows:2,onKeyDown:ae}),o.jsxs("div",{className:It.actions,children:[M&&o.jsx("div",{className:It.deleteWrapper,children:o.jsx("button",{className:It.deleteButton,onClick:M,type:"button",children:o.jsx(_m,{size:22})})}),o.jsx("button",{className:It.cancel,onClick:Qe,children:"Cancel"}),o.jsx("button",{className:It.submit,style:{backgroundColor:$,opacity:U.trim()?1:.4},onClick:T,disabled:!U.trim(),children:b})]})]})}),xm=({content:s,children:r,...c})=>{const[u,_]=y.useState(!1),[f,b]=y.useState(!1),[R,x]=y.useState({top:0,right:0}),M=y.useRef(null),E=y.useRef(null),$=y.useRef(null),D=()=>{if(M.current){const ne=M.current.getBoundingClientRect();x({top:ne.top+ne.height/2,right:window.innerWidth-ne.left+8})}},ue=()=>{b(!0),$.current&&(clearTimeout($.current),$.current=null),D(),E.current=Le(()=>{_(!0)},500)},H=()=>{E.current&&(clearTimeout(E.current),E.current=null),_(!1),$.current=Le(()=>{b(!1)},150)};return y.useEffect(()=>()=>{E.current&&clearTimeout(E.current),$.current&&clearTimeout($.current)},[]),o.jsxs(o.Fragment,{children:[o.jsx("span",{ref:M,onMouseEnter:ue,onMouseLeave:H,...c,children:r}),f&&Yd.createPortal(o.jsx("div",{"data-feedback-toolbar":!0,style:{position:"fixed",top:R.top,right:R.right,transform:"translateY(-50%)",padding:"6px 10px",background:"#383838",color:"rgba(255, 255, 255, 0.7)",fontSize:"11px",fontWeight:400,lineHeight:"14px",borderRadius:"10px",width:"180px",textAlign:"left",zIndex:100020,pointerEvents:"none",boxShadow:"0px 1px 8px rgba(0, 0, 0, 0.28)",opacity:u?1:0,transition:"opacity 0.15s ease"},children:s}),document.body)]})},bm=`.styles-module__tooltip___mcXL2 {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: help;
}

.styles-module__tooltipIcon___Nq2nD {
  transform: translateY(0.5px);
  color: #fff;
  opacity: 0.2;
  transition: opacity 0.15s ease;
  will-change: transform;
}
.styles-module__tooltip___mcXL2:hover .styles-module__tooltipIcon___Nq2nD {
  opacity: 0.5;
}
[data-agentation-theme=light] .styles-module__tooltipIcon___Nq2nD {
  color: #000;
}`,vm={tooltip:"styles-module__tooltip___mcXL2",tooltipIcon:"styles-module__tooltipIcon___Nq2nD"};if(typeof document<"u"){let s=document.getElementById("feedback-tool-styles-help-tooltip-styles");s||(s=document.createElement("style"),s.id="feedback-tool-styles-help-tooltip-styles",document.head.appendChild(s)),s.textContent=bm}var Qd=vm,la=({content:s})=>o.jsx(xm,{className:Qd.tooltip,content:s,children:o.jsx(tm,{className:Qd.tooltipIcon})}),me={navigation:{width:800,height:56},hero:{width:800,height:320},header:{width:800,height:80},section:{width:800,height:400},sidebar:{width:240,height:400},footer:{width:800,height:160},modal:{width:480,height:300},card:{width:280,height:240},text:{width:400,height:120},image:{width:320,height:200},video:{width:480,height:270},table:{width:560,height:220},grid:{width:600,height:300},list:{width:300,height:180},chart:{width:400,height:240},button:{width:140,height:40},input:{width:280,height:56},form:{width:360,height:320},tabs:{width:480,height:240},dropdown:{width:200,height:200},toggle:{width:44,height:24},search:{width:320,height:44},avatar:{width:48,height:48},badge:{width:80,height:28},breadcrumb:{width:300,height:24},pagination:{width:300,height:36},progress:{width:240,height:8},divider:{width:600,height:1},accordion:{width:400,height:200},carousel:{width:600,height:300},toast:{width:320,height:64},tooltip:{width:180,height:40},pricing:{width:300,height:360},testimonial:{width:360,height:200},cta:{width:600,height:160},alert:{width:400,height:56},banner:{width:800,height:48},stat:{width:200,height:120},stepper:{width:480,height:48},tag:{width:72,height:28},rating:{width:160,height:28},map:{width:480,height:300},timeline:{width:360,height:320},fileUpload:{width:360,height:180},codeBlock:{width:480,height:200},calendar:{width:300,height:300},notification:{width:360,height:72},productCard:{width:280,height:360},profile:{width:280,height:200},drawer:{width:320,height:400},popover:{width:240,height:160},logo:{width:120,height:40},faq:{width:560,height:320},gallery:{width:560,height:360},checkbox:{width:20,height:20},radio:{width:20,height:20},slider:{width:240,height:32},datePicker:{width:300,height:320},skeleton:{width:320,height:120},chip:{width:96,height:32},icon:{width:24,height:24},spinner:{width:32,height:32},feature:{width:360,height:200},team:{width:560,height:280},login:{width:360,height:360},contact:{width:400,height:320}},Wd=[{section:"Layout",items:[{type:"navigation",label:"Navigation",...me.navigation},{type:"header",label:"Header",...me.header},{type:"hero",label:"Hero",...me.hero},{type:"section",label:"Section",...me.section},{type:"sidebar",label:"Sidebar",...me.sidebar},{type:"footer",label:"Footer",...me.footer},{type:"modal",label:"Modal",...me.modal},{type:"banner",label:"Banner",...me.banner},{type:"drawer",label:"Drawer",...me.drawer},{type:"popover",label:"Popover",...me.popover},{type:"divider",label:"Divider",...me.divider}]},{section:"Content",items:[{type:"card",label:"Card",...me.card},{type:"text",label:"Text",...me.text},{type:"image",label:"Image",...me.image},{type:"video",label:"Video",...me.video},{type:"table",label:"Table",...me.table},{type:"grid",label:"Grid",...me.grid},{type:"list",label:"List",...me.list},{type:"chart",label:"Chart",...me.chart},{type:"codeBlock",label:"Code Block",...me.codeBlock},{type:"map",label:"Map",...me.map},{type:"timeline",label:"Timeline",...me.timeline},{type:"calendar",label:"Calendar",...me.calendar},{type:"accordion",label:"Accordion",...me.accordion},{type:"carousel",label:"Carousel",...me.carousel},{type:"logo",label:"Logo",...me.logo},{type:"faq",label:"FAQ",...me.faq},{type:"gallery",label:"Gallery",...me.gallery}]},{section:"Controls",items:[{type:"button",label:"Button",...me.button},{type:"input",label:"Input",...me.input},{type:"search",label:"Search",...me.search},{type:"form",label:"Form",...me.form},{type:"tabs",label:"Tabs",...me.tabs},{type:"dropdown",label:"Dropdown",...me.dropdown},{type:"toggle",label:"Toggle",...me.toggle},{type:"stepper",label:"Stepper",...me.stepper},{type:"rating",label:"Rating",...me.rating},{type:"fileUpload",label:"File Upload",...me.fileUpload},{type:"checkbox",label:"Checkbox",...me.checkbox},{type:"radio",label:"Radio",...me.radio},{type:"slider",label:"Slider",...me.slider},{type:"datePicker",label:"Date Picker",...me.datePicker}]},{section:"Elements",items:[{type:"avatar",label:"Avatar",...me.avatar},{type:"badge",label:"Badge",...me.badge},{type:"tag",label:"Tag",...me.tag},{type:"breadcrumb",label:"Breadcrumb",...me.breadcrumb},{type:"pagination",label:"Pagination",...me.pagination},{type:"progress",label:"Progress",...me.progress},{type:"alert",label:"Alert",...me.alert},{type:"toast",label:"Toast",...me.toast},{type:"notification",label:"Notification",...me.notification},{type:"tooltip",label:"Tooltip",...me.tooltip},{type:"stat",label:"Stat",...me.stat},{type:"skeleton",label:"Skeleton",...me.skeleton},{type:"chip",label:"Chip",...me.chip},{type:"icon",label:"Icon",...me.icon},{type:"spinner",label:"Spinner",...me.spinner}]},{section:"Blocks",items:[{type:"pricing",label:"Pricing",...me.pricing},{type:"testimonial",label:"Testimonial",...me.testimonial},{type:"cta",label:"CTA",...me.cta},{type:"productCard",label:"Product Card",...me.productCard},{type:"profile",label:"Profile",...me.profile},{type:"feature",label:"Feature",...me.feature},{type:"team",label:"Team",...me.team},{type:"login",label:"Login",...me.login},{type:"contact",label:"Contact",...me.contact}]}],Rl={};for(const s of Wd)for(const r of s.items)Rl[r.type]=r;function P({w:s,h:r=3,strong:c}){return o.jsx("div",{style:{width:typeof s=="number"?`${s}px`:s,height:r,borderRadius:2,background:c?"var(--agd-bar-strong)":"var(--agd-bar)",flexShrink:0}})}function Bt({w:s,h:r,radius:c=3,style:u}){return o.jsx("div",{style:{width:typeof s=="number"?`${s}px`:s,height:typeof r=="number"?`${r}px`:r,borderRadius:c,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",flexShrink:0,...u}})}function Yn({size:s}){return o.jsx("div",{style:{width:s,height:s,borderRadius:"50%",border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",flexShrink:0}})}function wm({width:s,height:r}){const c=Math.max(8,r*.2);return o.jsxs("div",{style:{display:"flex",alignItems:"center",height:"100%",padding:`0 ${c}px`,gap:s*.02},children:[o.jsx(Bt,{w:Math.max(20,r*.5),h:Math.max(12,r*.4),radius:2}),o.jsxs("div",{style:{flex:1,display:"flex",gap:s*.03,marginLeft:s*.04},children:[o.jsx(P,{w:s*.06}),o.jsx(P,{w:s*.07}),o.jsx(P,{w:s*.05}),o.jsx(P,{w:s*.06})]}),o.jsx(Bt,{w:s*.1,h:Math.min(28,r*.5),radius:4})]})}function Sm({width:s,height:r,text:c}){return o.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:r*.05},children:[c?o.jsx("span",{style:{fontSize:Math.min(20,r*.08),fontWeight:600,color:"var(--agd-text-3)",textAlign:"center",maxWidth:"80%"},children:c}):o.jsx(P,{w:s*.5,h:Math.max(6,r*.04),strong:!0}),o.jsx(P,{w:s*.6}),o.jsx(P,{w:s*.4}),o.jsx(Bt,{w:Math.min(140,s*.2),h:Math.min(36,r*.12),radius:6,style:{marginTop:r*.06}})]})}function km({width:s,height:r}){const c=Math.max(3,Math.floor(r/36));return o.jsxs("div",{style:{padding:s*.08,display:"flex",flexDirection:"column",gap:r*.03},children:[o.jsx(P,{w:s*.6,h:4,strong:!0}),Array.from({length:c},(u,_)=>o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[o.jsx(Bt,{w:10,h:10,radius:2}),o.jsx(P,{w:s*(.4+_*17%30/100)})]},_))]})}function jm({width:s,height:r}){const c=Math.max(2,Math.min(4,Math.floor(s/160)));return o.jsx("div",{style:{display:"flex",padding:`${r*.12}px ${s*.03}px`,gap:s*.05},children:Array.from({length:c},(u,_)=>o.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:4},children:[o.jsx(P,{w:"60%",h:3,strong:!0}),o.jsx(P,{w:"80%",h:2}),o.jsx(P,{w:"70%",h:2}),o.jsx(P,{w:"60%",h:2})]},_))})}function Cm({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[o.jsxs("div",{style:{padding:"10px 12px",borderBottom:"1px solid var(--agd-stroke)",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[o.jsx(P,{w:s*.3,h:4,strong:!0}),o.jsx("div",{style:{width:14,height:14,border:"1px solid var(--agd-stroke)",borderRadius:3}})]}),o.jsxs("div",{style:{flex:1,padding:12,display:"flex",flexDirection:"column",gap:6},children:[o.jsx(P,{w:"90%"}),o.jsx(P,{w:"70%"}),o.jsx(P,{w:"80%"})]}),o.jsxs("div",{style:{padding:"10px 12px",borderTop:"1px solid var(--agd-stroke)",display:"flex",justifyContent:"flex-end",gap:8},children:[o.jsx(Bt,{w:70,h:26,radius:4}),o.jsx(Bt,{w:70,h:26,radius:4,style:{background:"var(--agd-bar)"}})]})]})}function Mm({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[o.jsx("div",{style:{height:"40%",background:"var(--agd-fill)",borderBottom:"1px dashed var(--agd-stroke)"}}),o.jsxs("div",{style:{flex:1,padding:10,display:"flex",flexDirection:"column",gap:5},children:[o.jsx(P,{w:"70%",h:4,strong:!0}),o.jsx(P,{w:"95%",h:2}),o.jsx(P,{w:"85%",h:2}),o.jsx(P,{w:"50%",h:2})]})]})}function Em({width:s,height:r,text:c}){if(c)return o.jsx("div",{style:{padding:4,fontSize:Math.min(14,r*.3),lineHeight:1.5,color:"var(--agd-text-3)",wordBreak:"break-word",overflow:"hidden"},children:c});const u=Math.max(2,Math.floor(r/18));return o.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6,padding:4},children:[o.jsx(P,{w:s*.6,h:5,strong:!0}),Array.from({length:u},(_,f)=>o.jsx(P,{w:`${70+f*13%25}%`,h:2},f))]})}function Tm({width:s,height:r}){return o.jsx("div",{style:{height:"100%",position:"relative"},children:o.jsxs("svg",{width:"100%",height:"100%",viewBox:`0 0 ${s} ${r}`,preserveAspectRatio:"none",fill:"none",children:[o.jsx("line",{x1:"0",y1:"0",x2:s,y2:r,stroke:"var(--agd-stroke)",strokeWidth:"1"}),o.jsx("line",{x1:s,y1:"0",x2:"0",y2:r,stroke:"var(--agd-stroke)",strokeWidth:"1"}),o.jsx("circle",{cx:s*.3,cy:r*.3,r:Math.min(s,r)*.08,fill:"var(--agd-fill)",stroke:"var(--agd-stroke)",strokeWidth:"0.8"})]})})}function zm({width:s,height:r}){const c=Math.max(2,Math.min(5,Math.floor(s/100))),u=Math.max(2,Math.min(6,Math.floor(r/32)));return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[o.jsx("div",{style:{display:"flex",borderBottom:"1px solid var(--agd-stroke)",padding:"6px 0"},children:Array.from({length:c},(_,f)=>o.jsx("div",{style:{flex:1,padding:"0 8px"},children:o.jsx(P,{w:"70%",h:3,strong:!0})},f))}),Array.from({length:u},(_,f)=>o.jsx("div",{style:{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.03)",padding:"6px 0"},children:Array.from({length:c},(b,R)=>o.jsx("div",{style:{flex:1,padding:"0 8px"},children:o.jsx(P,{w:`${50+(f*7+R*13)%40}%`,h:2})},R))},f))]})}function Rm({width:s,height:r}){const c=Math.max(2,Math.floor(r/28));return o.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4,padding:4},children:Array.from({length:c},(u,_)=>o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,padding:"4px 0"},children:[o.jsx(Yn,{size:8}),o.jsx(P,{w:`${55+_*17%35}%`,h:2})]},_))})}function Dm({width:s,height:r,text:c}){return o.jsx("div",{style:{height:"100%",borderRadius:Math.min(8,r/3),border:"1px solid var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",justifyContent:"center"},children:c?o.jsx("span",{style:{fontSize:Math.min(13,r*.4),fontWeight:500,color:"var(--agd-text-3)",letterSpacing:"-0.01em"},children:c}):o.jsx(P,{w:Math.max(20,s*.5),h:3,strong:!0})})}function Nm({width:s,height:r}){return o.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4,height:"100%",justifyContent:"center"},children:[o.jsx(P,{w:Math.min(80,s*.3),h:2}),o.jsx("div",{style:{height:Math.min(36,r*.6),borderRadius:4,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",paddingLeft:8},children:o.jsx(P,{w:"40%",h:2})})]})}function Am({width:s,height:r}){const c=Math.max(2,Math.min(5,Math.floor(r/56)));return o.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:r*.04,padding:8},children:[Array.from({length:c},(u,_)=>o.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[o.jsx(P,{w:60+_*17%30,h:2}),o.jsx(Bt,{w:"100%",h:28,radius:4})]},_)),o.jsx(Bt,{w:Math.min(120,s*.35),h:30,radius:6,style:{marginTop:8,alignSelf:"flex-end",background:"var(--agd-bar)"}})]})}function Bm({width:s,height:r}){const c=Math.max(2,Math.min(4,Math.floor(s/120)));return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[o.jsx("div",{style:{display:"flex",gap:2,borderBottom:"1px solid var(--agd-stroke)"},children:Array.from({length:c},(u,_)=>o.jsx("div",{style:{padding:"8px 12px",borderBottom:_===0?"2px solid var(--agd-bar-strong)":"none"},children:o.jsx(P,{w:60,h:3,strong:_===0})},_))}),o.jsxs("div",{style:{flex:1,padding:12,display:"flex",flexDirection:"column",gap:6},children:[o.jsx(P,{w:"80%",h:2}),o.jsx(P,{w:"65%",h:2}),o.jsx(P,{w:"75%",h:2})]})]})}function Om({width:s,height:r}){const c=Math.min(s,r)/2;return o.jsxs("svg",{width:"100%",height:"100%",viewBox:`0 0 ${s} ${r}`,fill:"none",children:[o.jsx("circle",{cx:s/2,cy:r/2,r:c-1,stroke:"var(--agd-stroke)",fill:"var(--agd-fill)",strokeWidth:"1.5",strokeDasharray:"3 2"}),o.jsx("circle",{cx:s/2,cy:r*.38,r:c*.28,stroke:"var(--agd-stroke)",fill:"var(--agd-fill)",strokeWidth:"0.8"}),o.jsx("path",{d:`M${s/2-c*.55} ${r*.78} C${s/2-c*.55} ${r*.55} ${s/2+c*.55} ${r*.55} ${s/2+c*.55} ${r*.78}`,stroke:"var(--agd-stroke)",fill:"var(--agd-fill)",strokeWidth:"0.8"})]})}function Lm({width:s,height:r}){return o.jsx("div",{style:{height:"100%",borderRadius:r/2,border:"1px solid var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",justifyContent:"center"},children:o.jsx(P,{w:Math.max(16,s*.5),h:2,strong:!0})})}function $m({width:s,height:r}){return o.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:r*.08},children:[o.jsx(P,{w:s*.5,h:Math.max(5,r*.06),strong:!0}),o.jsx(P,{w:s*.35})]})}function Hm({width:s,height:r}){return o.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",gap:r*.04,padding:s*.04},children:[o.jsx(P,{w:s*.3,h:4,strong:!0}),o.jsx(P,{w:s*.7}),o.jsx(P,{w:s*.5}),o.jsxs("div",{style:{flex:1,display:"flex",gap:s*.03,marginTop:r*.06},children:[o.jsx(Bt,{w:"33%",h:"100%",radius:4}),o.jsx(Bt,{w:"33%",h:"100%",radius:4}),o.jsx(Bt,{w:"33%",h:"100%",radius:4})]})]})}function Um({width:s,height:r}){const c=Math.max(2,Math.min(4,Math.floor(s/140))),u=Math.max(1,Math.min(3,Math.floor(r/120)));return o.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${c}, 1fr)`,gridTemplateRows:`repeat(${u}, 1fr)`,gap:6,height:"100%"},children:Array.from({length:c*u},(_,f)=>o.jsx(Bt,{w:"100%",h:"100%",radius:4},f))})}function Ym({width:s,height:r}){const c=Math.max(2,Math.floor((r-32)/28));return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[o.jsx("div",{style:{padding:"6px 8px",borderBottom:"1px solid var(--agd-stroke)"},children:o.jsx(P,{w:s*.5,h:3,strong:!0})}),o.jsx("div",{style:{flex:1,padding:4,display:"flex",flexDirection:"column",gap:2},children:Array.from({length:c},(u,_)=>o.jsx("div",{style:{padding:"4px 6px",borderRadius:3,background:_===0?"var(--agd-fill)":"transparent"},children:o.jsx(P,{w:`${50+_*17%35}%`,h:2,strong:_===0})},_))})]})}function Xm({width:s,height:r}){const c=Math.min(s,r)/2;return o.jsxs("svg",{width:"100%",height:"100%",viewBox:`0 0 ${s} ${r}`,fill:"none",children:[o.jsx("rect",{x:"1",y:"1",width:s-2,height:r-2,rx:c,stroke:"var(--agd-stroke)",strokeWidth:"1"}),o.jsx("circle",{cx:s-c,cy:r/2,r:c*.7,fill:"var(--agd-bar)"})]})}function Im({width:s,height:r}){const c=Math.min(r/2,20);return o.jsxs("div",{style:{height:"100%",borderRadius:c,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",padding:`0 ${c*.6}px`,gap:6},children:[o.jsx(Yn,{size:Math.min(14,r*.4)}),o.jsx(P,{w:"50%",h:2})]})}function qm({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",borderRadius:8,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",padding:"0 10px",gap:8},children:[o.jsx(Yn,{size:Math.min(20,r*.5)}),o.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:3},children:[o.jsx(P,{w:"60%",h:3,strong:!0}),o.jsx(P,{w:"80%",h:2})]}),o.jsx("div",{style:{width:14,height:14,border:"1px solid var(--agd-stroke)",borderRadius:3,flexShrink:0}})]})}function Qm({width:s,height:r}){return o.jsxs("svg",{width:"100%",height:"100%",viewBox:`0 0 ${s} ${r}`,fill:"none",children:[o.jsx("rect",{x:"0",y:"0",width:s,height:r,rx:r/2,stroke:"var(--agd-stroke)",strokeWidth:"0.8"}),o.jsx("rect",{x:"1",y:"1",width:s*.65,height:r-2,rx:(r-2)/2,fill:"var(--agd-bar)"})]})}function Wm({width:s,height:r}){const c=Math.max(3,Math.min(7,Math.floor(s/50))),u=s/(c*2);return o.jsx("div",{style:{height:"100%",display:"flex",alignItems:"flex-end",justifyContent:"space-around",padding:"0 4px",borderBottom:"1px solid var(--agd-stroke)"},children:Array.from({length:c},(_,f)=>{const b=30+(f*37+17)%55;return o.jsx(Bt,{w:u,h:`${b}%`,radius:2},f)})})}function Gm({width:s,height:r}){const c=Math.min(s,r)*.12;return o.jsxs("div",{style:{height:"100%",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"},children:[o.jsx(Bt,{w:"100%",h:"100%",radius:4}),o.jsx("div",{style:{position:"absolute",width:c*2,height:c*2,borderRadius:"50%",border:"1.5px solid var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",justifyContent:"center"},children:o.jsx("div",{style:{width:0,height:0,borderLeft:`${c*.6}px solid var(--agd-bar-strong)`,borderTop:`${c*.4}px solid transparent`,borderBottom:`${c*.4}px solid transparent`,marginLeft:c*.15}})})]})}function Vm({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",alignItems:"center"},children:[o.jsx("div",{style:{flex:1,width:"100%",borderRadius:6,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",justifyContent:"center"},children:o.jsx(P,{w:"60%",h:2})}),o.jsx("div",{style:{width:8,height:8,background:"var(--agd-fill)",border:"1px dashed var(--agd-stroke)",borderTop:"none",borderLeft:"none",transform:"rotate(45deg)",marginTop:-5}})]})}function Zm({width:s,height:r}){const c=Math.max(2,Math.min(4,Math.floor(s/80)));return o.jsx("div",{style:{display:"flex",alignItems:"center",height:"100%",gap:4},children:Array.from({length:c},(u,_)=>o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4},children:[_>0&&o.jsx("span",{style:{color:"var(--agd-stroke)",fontSize:10},children:"/"}),o.jsx(P,{w:40+_*13%20,h:2,strong:_===c-1})]},_))})}function Km({width:s,height:r}){const c=Math.max(3,Math.min(5,Math.floor(s/40))),u=Math.min(28,r*.8);return o.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",gap:4},children:Array.from({length:c},(_,f)=>o.jsx(Bt,{w:u,h:u,radius:4,style:f===1?{background:"var(--agd-bar)"}:void 0},f))})}function Fm({width:s}){return o.jsx("div",{style:{display:"flex",alignItems:"center",height:"100%"},children:o.jsx("div",{style:{width:"100%",height:1,background:"var(--agd-stroke)"}})})}function Jm({width:s,height:r}){const c=Math.max(2,Math.min(4,Math.floor(r/40)));return o.jsx("div",{style:{display:"flex",flexDirection:"column",height:"100%"},children:Array.from({length:c},(u,_)=>o.jsxs("div",{style:{borderBottom:"1px solid var(--agd-stroke)",padding:"8px 6px",display:"flex",alignItems:"center",justifyContent:"space-between",flex:_===0?2:1},children:[o.jsx(P,{w:`${40+_*17%25}%`,h:3,strong:!0}),o.jsx("span",{style:{fontSize:8,color:"var(--agd-stroke)"},children:_===0?"▼":"▶"})]},_))})}function Pm({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",gap:6},children:[o.jsxs("div",{style:{flex:1,display:"flex",gap:6,alignItems:"center"},children:[o.jsx("span",{style:{fontSize:12,color:"var(--agd-stroke)"},children:"‹"}),o.jsx(Bt,{w:"100%",h:"100%",radius:4}),o.jsx("span",{style:{fontSize:12,color:"var(--agd-stroke)"},children:"›"})]}),o.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:4},children:[o.jsx(Yn,{size:5}),o.jsx(Yn,{size:5}),o.jsx(Yn,{size:5})]})]})}function eg({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:10,gap:r*.04},children:[o.jsx(P,{w:s*.4,h:3,strong:!0}),o.jsx(P,{w:s*.3,h:6,strong:!0}),o.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:4,width:"100%",padding:"8px 0"},children:Array.from({length:4},(c,u)=>o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4},children:[o.jsx(Yn,{size:5}),o.jsx(P,{w:`${50+u*17%35}%`,h:2})]},u))}),o.jsx(Bt,{w:s*.7,h:Math.min(32,r*.1),radius:6,style:{background:"var(--agd-bar)"}})]})}function tg({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",padding:10,gap:8},children:[o.jsx("span",{style:{fontSize:18,lineHeight:1,color:"var(--agd-stroke)",fontFamily:"serif"},children:"“"}),o.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:4},children:[o.jsx(P,{w:"90%",h:2}),o.jsx(P,{w:"75%",h:2}),o.jsx(P,{w:"60%",h:2})]}),o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[o.jsx(Yn,{size:20}),o.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:2},children:[o.jsx(P,{w:60,h:3,strong:!0}),o.jsx(P,{w:40,h:2})]})]})]})}function ng({width:s,height:r}){return o.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:r*.08},children:[o.jsx(P,{w:s*.5,h:Math.max(4,r*.05),strong:!0}),o.jsx(P,{w:s*.35}),o.jsx(Bt,{w:Math.min(140,s*.25),h:Math.min(32,r*.15),radius:6,style:{marginTop:r*.04,background:"var(--agd-bar)"}})]})}function lg({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",borderRadius:6,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",padding:"0 10px",gap:8},children:[o.jsx("div",{style:{width:16,height:16,borderRadius:"50%",border:"1.5px solid var(--agd-bar-strong)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:o.jsx("div",{style:{width:2,height:6,background:"var(--agd-bar-strong)",borderRadius:1}})}),o.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:3},children:[o.jsx(P,{w:"40%",h:3,strong:!0}),o.jsx(P,{w:"70%",h:2})]})]})}function og({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",background:"var(--agd-fill)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"0 12px"},children:[o.jsx(P,{w:s*.4,h:3,strong:!0}),o.jsx(Bt,{w:60,h:Math.min(24,r*.6),radius:4})]})}function ag({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:r*.06},children:[o.jsx(P,{w:s*.5,h:2}),o.jsx(P,{w:s*.4,h:Math.max(8,r*.18),strong:!0}),o.jsx(P,{w:s*.3,h:2})]})}function sg({width:s,height:r}){const c=Math.max(3,Math.min(5,Math.floor(s/100))),u=Math.min(12,r*.35);return o.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",height:"100%",padding:"0 8px"},children:Array.from({length:c},(_,f)=>o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:0,flex:1},children:[o.jsx("div",{style:{width:u,height:u,borderRadius:"50%",border:"1.5px solid var(--agd-stroke)",background:f===0?"var(--agd-bar)":"transparent",flexShrink:0}}),f<c-1&&o.jsx("div",{style:{flex:1,height:1,background:"var(--agd-stroke)",margin:"0 4px"}})]},f))})}function ig({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",borderRadius:4,border:"1px solid var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"0 6px"},children:[o.jsx(P,{w:Math.max(16,s*.5),h:2,strong:!0}),o.jsx("div",{style:{width:8,height:8,borderRadius:"50%",border:"1px solid var(--agd-stroke)",flexShrink:0}})]})}function rg({width:s,height:r}){const u=Math.min(r*.7,s/7.5);return o.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",gap:u*.2},children:Array.from({length:5},(_,f)=>o.jsx("svg",{width:u,height:u,viewBox:"0 0 16 16",fill:"none",children:o.jsx("path",{d:"M8 1.5l2 4 4.5.7-3.25 3.1.75 4.5L8 11.4l-4 2.4.75-4.5L1.5 6.2 6 5.5z",stroke:"var(--agd-stroke)",strokeWidth:"0.8",fill:f<3?"var(--agd-bar)":"none"})},f))})}function cg({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",position:"relative",borderRadius:4,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",overflow:"hidden"},children:[o.jsxs("svg",{width:"100%",height:"100%",viewBox:`0 0 ${s} ${r}`,fill:"none",style:{position:"absolute",inset:0},children:[o.jsx("line",{x1:0,y1:r*.3,x2:s,y2:r*.7,stroke:"var(--agd-stroke)",strokeWidth:"0.5",opacity:".2"}),o.jsx("line",{x1:0,y1:r*.6,x2:s,y2:r*.2,stroke:"var(--agd-stroke)",strokeWidth:"0.5",opacity:".15"}),o.jsx("line",{x1:s*.4,y1:0,x2:s*.6,y2:r,stroke:"var(--agd-stroke)",strokeWidth:"0.5",opacity:".15"})]}),o.jsx("div",{style:{position:"absolute",left:"50%",top:"40%",transform:"translate(-50%, -100%)"},children:o.jsxs("svg",{width:"16",height:"22",viewBox:"0 0 16 22",fill:"none",children:[o.jsx("path",{d:"M8 0C3.6 0 0 3.6 0 8c0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z",fill:"var(--agd-bar)",opacity:".4"}),o.jsx("circle",{cx:"8",cy:"8",r:"3",fill:"var(--agd-fill)"})]})})]})}function ug({width:s,height:r}){const c=Math.max(3,Math.min(5,Math.floor(r/60)));return o.jsxs("div",{style:{display:"flex",height:"100%",padding:"8px 0"},children:[o.jsx("div",{style:{width:16,display:"flex",flexDirection:"column",alignItems:"center"},children:Array.from({length:c},(u,_)=>o.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",flex:1},children:[o.jsx(Yn,{size:8}),_<c-1&&o.jsx("div",{style:{flex:1,width:1,background:"var(--agd-stroke)"}})]},_))}),o.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-around",paddingLeft:8},children:Array.from({length:c},(u,_)=>o.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:3},children:[o.jsx(P,{w:`${35+_*13%25}%`,h:3,strong:!0}),o.jsx(P,{w:`${50+_*17%30}%`,h:2})]},_))})]})}function dg({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",borderRadius:8,border:"2px dashed var(--agd-stroke)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:r*.06},children:[o.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",children:[o.jsx("path",{d:"M12 16V4m0 0l-4 4m4-4l4 4",stroke:"var(--agd-stroke)",strokeWidth:"1.5"}),o.jsx("path",{d:"M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2",stroke:"var(--agd-stroke)",strokeWidth:"1.5"})]}),o.jsx(P,{w:s*.4,h:2}),o.jsx(P,{w:s*.25,h:2})]})}function _g({width:s,height:r}){const c=Math.max(3,Math.min(8,Math.floor(r/20)));return o.jsxs("div",{style:{height:"100%",borderRadius:6,background:"var(--agd-fill)",border:"1px solid var(--agd-stroke)",padding:8,display:"flex",flexDirection:"column",gap:4},children:[o.jsxs("div",{style:{display:"flex",gap:3,marginBottom:4},children:[o.jsx(Yn,{size:6}),o.jsx(Yn,{size:6}),o.jsx(Yn,{size:6})]}),Array.from({length:c},(u,_)=>o.jsx("div",{style:{display:"flex",gap:6,paddingLeft:_>0&&_<c-1?12:0},children:o.jsx(P,{w:`${25+_*23%50}%`,h:2,strong:_===0})},_))]})}function fg({width:s,height:r}){const _=Math.min((s-16)/7,(r-40)/6);return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 8px"},children:[o.jsx("span",{style:{fontSize:8,color:"var(--agd-stroke)"},children:"‹"}),o.jsx(P,{w:s*.3,h:3,strong:!0}),o.jsx("span",{style:{fontSize:8,color:"var(--agd-stroke)"},children:"›"})]}),o.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(7, 1fr)",gap:2,padding:"0 4px",flex:1},children:[Array.from({length:7},(f,b)=>o.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:_*.6},children:o.jsx(P,{w:_*.5,h:2})},`h${b}`)),Array.from({length:35},(f,b)=>o.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:_},children:o.jsx("div",{style:{width:_*.6,height:_*.6,borderRadius:"50%",background:b===12?"var(--agd-bar)":"transparent",display:"flex",alignItems:"center",justifyContent:"center"},children:o.jsx("div",{style:{width:2,height:2,borderRadius:1,background:"var(--agd-bar-strong)",opacity:b===12?1:.3}})})},b))]})]})}function hg({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",borderRadius:8,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",padding:"0 10px",gap:8},children:[o.jsx(Yn,{size:Math.min(32,r*.55)}),o.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:3},children:[o.jsx(P,{w:"50%",h:3,strong:!0}),o.jsx(P,{w:"75%",h:2})]}),o.jsx(P,{w:30,h:2})]})}function mg({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[o.jsx("div",{style:{height:"50%",background:"var(--agd-fill)",borderBottom:"1px dashed var(--agd-stroke)"}}),o.jsxs("div",{style:{flex:1,padding:10,display:"flex",flexDirection:"column",gap:5},children:[o.jsx(P,{w:"65%",h:4,strong:!0}),o.jsx(P,{w:"40%",h:3}),o.jsx("div",{style:{flex:1}}),o.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[o.jsx(P,{w:"30%",h:5,strong:!0}),o.jsx(Bt,{w:Math.min(70,s*.3),h:26,radius:4,style:{background:"var(--agd-bar)"}})]})]})]})}function gg({width:s,height:r}){const c=Math.min(48,r*.3);return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:r*.06},children:[o.jsx(Yn,{size:c}),o.jsx(P,{w:s*.45,h:4,strong:!0}),o.jsx(P,{w:s*.3,h:2}),o.jsxs("div",{style:{display:"flex",gap:s*.08,marginTop:r*.04},children:[o.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:2},children:[o.jsx(P,{w:20,h:3,strong:!0}),o.jsx(P,{w:28,h:2})]}),o.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:2},children:[o.jsx(P,{w:20,h:3,strong:!0}),o.jsx(P,{w:28,h:2})]}),o.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:2},children:[o.jsx(P,{w:20,h:3,strong:!0}),o.jsx(P,{w:28,h:2})]})]})]})}function yg({width:s,height:r}){const c=Math.max(s*.6,80),u=Math.max(3,Math.floor(r/40));return o.jsxs("div",{style:{height:"100%",display:"flex"},children:[o.jsx("div",{style:{width:s-c,background:"var(--agd-fill)",opacity:.3}}),o.jsxs("div",{style:{flex:1,borderLeft:"1px solid var(--agd-stroke)",display:"flex",flexDirection:"column",padding:s*.04},children:[o.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:r*.06},children:[o.jsx(P,{w:c*.4,h:4,strong:!0}),o.jsx("div",{style:{width:12,height:12,border:"1px solid var(--agd-stroke)",borderRadius:3}})]}),Array.from({length:u},(_,f)=>o.jsx("div",{style:{padding:"6px 0"},children:o.jsx(P,{w:`${50+f*17%35}%`,h:2,strong:f===0})},f))]})]})}function pg({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",alignItems:"center"},children:[o.jsxs("div",{style:{flex:1,width:"100%",borderRadius:8,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",padding:10,display:"flex",flexDirection:"column",gap:5},children:[o.jsx(P,{w:"70%",h:3,strong:!0}),o.jsx(P,{w:"90%",h:2}),o.jsx(P,{w:"60%",h:2})]}),o.jsx("div",{style:{width:10,height:10,background:"var(--agd-fill)",border:"1px dashed var(--agd-stroke)",borderTop:"none",borderLeft:"none",transform:"rotate(45deg)",marginTop:-6}})]})}function xg({width:s,height:r}){const c=Math.min(r*.7,s*.3);return o.jsxs("div",{style:{height:"100%",display:"flex",alignItems:"center",gap:s*.08},children:[o.jsx(Bt,{w:c,h:c,radius:c*.25}),o.jsx(P,{w:s*.45,h:Math.max(4,r*.2),strong:!0})]})}function bg({width:s,height:r}){const c=Math.max(2,Math.min(5,Math.floor(r/56)));return o.jsx("div",{style:{display:"flex",flexDirection:"column",height:"100%"},children:Array.from({length:c},(u,_)=>o.jsxs("div",{style:{borderBottom:"1px solid var(--agd-stroke)",padding:"8px 6px",display:"flex",alignItems:"center",justifyContent:"space-between",flex:_===0?2:1},children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[o.jsx("span",{style:{fontSize:9,fontWeight:700,color:"var(--agd-stroke)"},children:"Q"}),o.jsx(P,{w:s*(.3+_*13%25/100),h:3,strong:!0})]}),o.jsx("span",{style:{fontSize:8,color:"var(--agd-stroke)"},children:_===0?"▼":"▶"})]},_))})}function vg({width:s,height:r}){const c=Math.max(2,Math.min(4,Math.floor(s/120))),u=Math.max(1,Math.min(3,Math.floor(r/120)));return o.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${c}, 1fr)`,gridTemplateRows:`repeat(${u}, 1fr)`,gap:4,height:"100%"},children:Array.from({length:c*u},(_,f)=>o.jsx("div",{style:{borderRadius:4,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",position:"relative",overflow:"hidden"},children:o.jsxs("svg",{width:"100%",height:"100%",viewBox:"0 0 100 100",preserveAspectRatio:"none",fill:"none",children:[o.jsx("line",{x1:"0",y1:"0",x2:"100",y2:"100",stroke:"var(--agd-stroke)",strokeWidth:"0.5"}),o.jsx("line",{x1:"100",y1:"0",x2:"0",y2:"100",stroke:"var(--agd-stroke)",strokeWidth:"0.5"})]})},f))})}function wg({width:s,height:r}){const c=Math.min(s,r);return o.jsxs("svg",{width:"100%",height:"100%",viewBox:`0 0 ${s} ${r}`,fill:"none",children:[o.jsx("rect",{x:"1",y:(r-c+2)/2,width:c-2,height:c-2,rx:c*.15,stroke:"var(--agd-stroke)",strokeWidth:"1.5"}),o.jsx("path",{d:`M${c*.25} ${r/2}l${c*.2} ${c*.2} ${c*.3}-${c*.35}`,stroke:"var(--agd-bar)",strokeWidth:"1.5",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})]})}function Sg({width:s,height:r}){const c=Math.min(s,r)/2-1;return o.jsxs("svg",{width:"100%",height:"100%",viewBox:`0 0 ${s} ${r}`,fill:"none",children:[o.jsx("circle",{cx:s/2,cy:r/2,r:c,stroke:"var(--agd-stroke)",strokeWidth:"1.5"}),o.jsx("circle",{cx:s/2,cy:r/2,r:c*.45,fill:"var(--agd-bar)"})]})}function kg({width:s,height:r}){const c=Math.max(2,r*.12),u=Math.min(r*.35,10),_=s*.55;return o.jsxs("div",{style:{height:"100%",display:"flex",alignItems:"center",position:"relative"},children:[o.jsx("div",{style:{width:"100%",height:c,borderRadius:c/2,background:"var(--agd-fill)",border:"1px solid var(--agd-stroke)",position:"relative"},children:o.jsx("div",{style:{width:_,height:"100%",borderRadius:c/2,background:"var(--agd-bar)"}})}),o.jsx("div",{style:{position:"absolute",left:_-u,width:u*2,height:u*2,borderRadius:"50%",border:"1.5px solid var(--agd-stroke)",background:"var(--agd-fill)"}})]})}function jg({width:s,height:r}){const c=Math.min(36,r*.15),u=7,_=4,f=Math.min((s-16)/u,(r-c-40)/(_+1));return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",gap:4},children:[o.jsxs("div",{style:{height:c,borderRadius:4,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",padding:"0 8px",justifyContent:"space-between"},children:[o.jsx(P,{w:"40%",h:2}),o.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",children:[o.jsx("rect",{x:"2",y:"3",width:"12",height:"11",rx:"1",stroke:"var(--agd-stroke)",strokeWidth:"1"}),o.jsx("line",{x1:"2",y1:"6",x2:"14",y2:"6",stroke:"var(--agd-stroke)",strokeWidth:"0.5"})]})]}),o.jsxs("div",{style:{flex:1,borderRadius:6,border:"1px dashed var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",flexDirection:"column"},children:[o.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 6px"},children:[o.jsx("span",{style:{fontSize:7,color:"var(--agd-stroke)"},children:"‹"}),o.jsx(P,{w:s*.25,h:2,strong:!0}),o.jsx("span",{style:{fontSize:7,color:"var(--agd-stroke)"},children:"›"})]}),o.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${u}, 1fr)`,gap:1,padding:"0 4px",flex:1},children:Array.from({length:u*_},(b,R)=>o.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:f},children:o.jsx("div",{style:{width:f*.5,height:f*.5,borderRadius:"50%",background:R===10?"var(--agd-bar)":"transparent"},children:o.jsx("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"},children:o.jsx("div",{style:{width:1.5,height:1.5,borderRadius:1,background:"var(--agd-bar-strong)",opacity:R===10?1:.25}})})})},R))})]})]})}function Cg({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",gap:r*.08,padding:4},children:[o.jsx("div",{style:{width:"100%",height:r*.2,borderRadius:4,background:"var(--agd-fill)"}}),o.jsx("div",{style:{width:"70%",height:Math.max(6,r*.1),borderRadius:3,background:"var(--agd-fill)"}}),o.jsx("div",{style:{width:"90%",height:Math.max(4,r*.06),borderRadius:3,background:"var(--agd-fill)"}}),o.jsx("div",{style:{width:"50%",height:Math.max(4,r*.06),borderRadius:3,background:"var(--agd-fill)"}})]})}function Mg({width:s,height:r}){return o.jsx("div",{style:{height:"100%",display:"flex",alignItems:"center",gap:6},children:o.jsxs("div",{style:{height:"100%",flex:1,borderRadius:r/2,border:"1px solid var(--agd-stroke)",background:"var(--agd-fill)",display:"flex",alignItems:"center",padding:`0 ${r*.3}px`,gap:4},children:[o.jsx(P,{w:"60%",h:2,strong:!0}),o.jsx("div",{style:{width:Math.max(6,r*.3),height:Math.max(6,r*.3),borderRadius:"50%",border:"1px solid var(--agd-stroke)",flexShrink:0,marginLeft:"auto"}})]})})}function Eg({width:s,height:r}){const c=Math.min(s,r);return o.jsx("svg",{width:"100%",height:"100%",viewBox:`0 0 ${s} ${r}`,fill:"none",children:o.jsx("path",{d:`M${s/2} ${(r-c)/2+c*.1}l${c*.12} ${c*.25} ${c*.28} ${c*.04}-${c*.2} ${c*.2} ${c*.05} ${c*.28}-${c*.25}-${c*.12}-${c*.25} ${c*.12} ${c*.05}-${c*.28}-${c*.2}-${c*.2} ${c*.28}-${c*.04}z`,stroke:"var(--agd-stroke)",strokeWidth:"1",fill:"var(--agd-fill)"})})}function Tg({width:s,height:r}){const c=Math.min(s,r)/2-2;return o.jsxs("svg",{width:"100%",height:"100%",viewBox:`0 0 ${s} ${r}`,fill:"none",children:[o.jsx("circle",{cx:s/2,cy:r/2,r:c,stroke:"var(--agd-stroke)",strokeWidth:"1.5",opacity:".2"}),o.jsx("path",{d:`M${s/2} ${r/2-c}a${c} ${c} 0 0 1 ${c} ${c}`,stroke:"var(--agd-bar-strong)",strokeWidth:"1.5",strokeLinecap:"round"})]})}function zg({width:s,height:r}){const c=Math.min(36,r*.25,s*.12),u=Math.max(1,Math.min(3,Math.floor(r/80)));return o.jsx("div",{style:{display:"flex",flexDirection:"column",height:"100%",justifyContent:"space-around",padding:8},children:Array.from({length:u},(_,f)=>o.jsxs("div",{style:{display:"flex",gap:s*.04,alignItems:"flex-start"},children:[o.jsx(Bt,{w:c,h:c,radius:c*.25}),o.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:4},children:[o.jsx(P,{w:`${40+f*13%20}%`,h:3,strong:!0}),o.jsx(P,{w:`${60+f*17%25}%`,h:2})]})]},f))})}function Rg({width:s,height:r}){const c=Math.max(2,Math.min(4,Math.floor(s/120))),u=Math.min(36,r*.25);return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:r*.06,padding:r*.06},children:[o.jsx(P,{w:s*.3,h:4,strong:!0}),o.jsx("div",{style:{display:"flex",gap:s*.06,justifyContent:"center",flex:1,alignItems:"center"},children:Array.from({length:c},(_,f)=>o.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:6},children:[o.jsx(Yn,{size:u}),o.jsx(P,{w:s*.12,h:3,strong:!0}),o.jsx(P,{w:s*.08,h:2})]},f))})]})}function Dg({width:s,height:r}){const c=Math.max(2,Math.min(3,Math.floor(r/80)));return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:s*.06,gap:r*.04},children:[o.jsx(P,{w:s*.5,h:Math.max(5,r*.04),strong:!0}),o.jsx(P,{w:s*.35,h:2}),o.jsx("div",{style:{width:"100%",display:"flex",flexDirection:"column",gap:r*.03,marginTop:r*.04},children:Array.from({length:c},(u,_)=>o.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:3},children:[o.jsx(P,{w:Math.min(60,s*.2),h:2}),o.jsx(Bt,{w:"100%",h:Math.min(32,r*.1),radius:4})]},_))}),o.jsx(Bt,{w:"100%",h:Math.min(36,r*.12),radius:6,style:{marginTop:r*.03,background:"var(--agd-bar)"}}),o.jsx(P,{w:s*.4,h:2})]})}function Ng({width:s,height:r}){return o.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",padding:s*.04,gap:r*.03},children:[o.jsx(P,{w:s*.4,h:4,strong:!0}),o.jsx(P,{w:s*.6,h:2}),o.jsxs("div",{style:{display:"flex",gap:6,marginTop:r*.03},children:[o.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:3},children:[o.jsx(P,{w:50,h:2}),o.jsx(Bt,{w:"100%",h:Math.min(28,r*.1),radius:4})]}),o.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:3},children:[o.jsx(P,{w:40,h:2}),o.jsx(Bt,{w:"100%",h:Math.min(28,r*.1),radius:4})]})]}),o.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:3},children:[o.jsx(P,{w:50,h:2}),o.jsx(Bt,{w:"100%",h:Math.min(28,r*.1),radius:4})]}),o.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:3,flex:1},children:[o.jsx(P,{w:60,h:2}),o.jsx(Bt,{w:"100%",h:"100%",radius:4})]}),o.jsx(Bt,{w:Math.min(120,s*.3),h:Math.min(30,r*.1),radius:6,style:{alignSelf:"flex-end",background:"var(--agd-bar)"}})]})}var Ag={navigation:wm,hero:Sm,sidebar:km,footer:jm,modal:Cm,card:Mm,text:Em,image:Tm,table:zm,list:Rm,button:Dm,input:Nm,form:Am,tabs:Bm,avatar:Om,badge:Lm,header:$m,section:Hm,grid:Um,dropdown:Ym,toggle:Xm,search:Im,toast:qm,progress:Qm,chart:Wm,video:Gm,tooltip:Vm,breadcrumb:Zm,pagination:Km,divider:Fm,accordion:Jm,carousel:Pm,pricing:eg,testimonial:tg,cta:ng,alert:lg,banner:og,stat:ag,stepper:sg,tag:ig,rating:rg,map:cg,timeline:ug,fileUpload:dg,codeBlock:_g,calendar:fg,notification:hg,productCard:mg,profile:gg,drawer:yg,popover:pg,logo:xg,faq:bg,gallery:vg,checkbox:wg,radio:Sg,slider:kg,datePicker:jg,skeleton:Cg,chip:Mg,icon:Eg,spinner:Tg,feature:zg,team:Rg,login:Dg,contact:Ng};function Bg({type:s,width:r,height:c,text:u}){const _=Ag[s];return _?o.jsx("div",{style:{width:"100%",height:"100%",padding:8,position:"relative",pointerEvents:"none"},children:o.jsx(_,{width:r,height:c,text:u})}):o.jsx("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"},children:o.jsx("span",{style:{fontSize:10,fontWeight:600,color:"var(--agd-text-3)",textTransform:"uppercase",letterSpacing:"0.06em",opacity:.5},children:s})})}var Og=`svg[fill=none] {
  fill: none !important;
}

.styles-module__overlayExiting___iEmYr {
  opacity: 0 !important;
  transition: opacity 0.25s ease !important;
  pointer-events: none !important;
}

.styles-module__overlay___aWh-q {
  position: fixed;
  inset: 0;
  z-index: 99995;
  pointer-events: auto;
  cursor: default;
  animation: styles-module__overlayFadeIn___aECVy 0.15s ease;
  --agd-stroke: rgba(59, 130, 246, 0.35);
  --agd-fill: rgba(59, 130, 246, 0.06);
  --agd-bar: rgba(59, 130, 246, 0.18);
  --agd-bar-strong: rgba(59, 130, 246, 0.28);
  --agd-text-3: rgba(255, 255, 255, 0.6);
  --agd-surface: #fff;
}
.styles-module__overlay___aWh-q.styles-module__light___ORIft {
  --agd-surface: #fff;
}
.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) {
  --agd-surface: #141414;
}
.styles-module__overlay___aWh-q.styles-module__wireframe___itvQU {
  --agd-stroke: rgba(249, 115, 22, 0.35);
  --agd-fill: rgba(249, 115, 22, 0.06);
  --agd-bar: rgba(249, 115, 22, 0.18);
  --agd-bar-strong: rgba(249, 115, 22, 0.28);
}
.styles-module__overlay___aWh-q.styles-module__placing___45yD8 {
  cursor: crosshair;
}
.styles-module__overlay___aWh-q.styles-module__passthrough___xaFeE {
  pointer-events: none;
}

.styles-module__blankCanvas___t2Eue {
  position: fixed;
  inset: 0;
  z-index: 99994;
  background: #fff;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.styles-module__blankCanvas___t2Eue.styles-module__visible___OKKqX {
  opacity: var(--canvas-opacity, 1);
  pointer-events: auto;
}
.styles-module__blankCanvas___t2Eue::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: 12px 12px;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.styles-module__blankCanvas___t2Eue.styles-module__gridActive___OZ-cf::after {
  opacity: 1;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.22) 1px, transparent 1px);
}

.styles-module__paletteHeader___-Q5gQ {
  padding: 0 1rem 0.375rem;
}

.styles-module__paletteHeaderTitle___oHqZC {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.0094em;
}
.styles-module__light___ORIft .styles-module__paletteHeaderTitle___oHqZC {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__paletteHeaderDesc___6i74T {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 2px;
  line-height: 14px;
}
.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T {
  color: rgba(0, 0, 0, 0.45);
}
.styles-module__paletteHeaderDesc___6i74T a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__paletteHeaderDesc___6i74T a:hover {
  color: #fff;
}
.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T a {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T a:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__wireframePurposeWrap___To-tS {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.2s ease, opacity 0.15s ease;
  opacity: 1;
}
.styles-module__wireframePurposeWrap___To-tS.styles-module__collapsed___Ms9vS {
  grid-template-rows: 0fr;
  opacity: 0;
}

.styles-module__wireframePurposeInner___Lrahs {
  overflow: hidden;
}

.styles-module__wireframePurposeInput___7EtBN {
  display: block;
  width: calc(100% - 2rem);
  margin: 0.25rem 1rem 0.375rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__wireframePurposeInput___7EtBN::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__wireframePurposeInput___7EtBN:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}
.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN {
  color: rgba(0, 0, 0, 0.7);
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.1);
}
.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__canvasToggle___-QqSy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin: 0.25rem 1rem 0.25rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  background: transparent;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.styles-module__canvasToggle___-QqSy:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
}
.styles-module__canvasToggle___-QqSy.styles-module__active___hosp7 {
  background: #f97316;
  border-color: transparent;
  border-style: solid;
  box-shadow: none;
}
.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy {
  border-color: rgba(0, 0, 0, 0.08);
}
.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy:hover {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.12);
}
.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy.styles-module__active___hosp7 {
  background: #f97316;
  border-color: transparent;
  border-style: solid;
  box-shadow: none;
}

.styles-module__canvasToggleIcon___7pJ82 {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.35);
}
.styles-module__active___hosp7 .styles-module__canvasToggleIcon___7pJ82 {
  color: rgba(255, 255, 255, 0.85);
}
.styles-module__light___ORIft .styles-module__canvasToggleIcon___7pJ82 {
  color: rgba(0, 0, 0, 0.25);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__canvasToggleIcon___7pJ82 {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__canvasToggleLabel___OanpY {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: -0.0094em;
}
.styles-module__active___hosp7 .styles-module__canvasToggleLabel___OanpY {
  color: #fff;
}
.styles-module__light___ORIft .styles-module__canvasToggleLabel___OanpY {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__canvasToggleLabel___OanpY {
  color: #fff;
}

.styles-module__canvasPurposeWrap___hj6zk {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.2s ease, opacity 0.15s ease;
  opacity: 1;
}
.styles-module__canvasPurposeWrap___hj6zk.styles-module__collapsed___Ms9vS {
  grid-template-rows: 0fr;
  opacity: 0;
}

.styles-module__canvasPurposeInner___VWiyu {
  overflow: hidden;
}

.styles-module__canvasPurposeToggle___byDH2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin: 0.375rem 1rem 0.375rem 1.1875rem;
}
.styles-module__canvasPurposeToggle___byDH2 input[type=checkbox] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.styles-module__canvasPurposeCheck___xqd7l {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.styles-module__canvasPurposeCheck___xqd7l svg {
  color: #1a1a1a;
  opacity: 1;
  transition: opacity 0.15s ease;
}
.styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgb(255, 255, 255);
}
.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH svg {
  color: #fff;
}

.styles-module__canvasPurposeLabel___Zu-tD {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.styles-module__light___ORIft .styles-module__canvasPurposeLabel___Zu-tD {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__canvasPurposeHelp___jijwR {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
}
.styles-module__canvasPurposeHelp___jijwR svg {
  color: rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
  transition: color 0.15s ease;
}
.styles-module__canvasPurposeHelp___jijwR:hover svg {
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__light___ORIft .styles-module__canvasPurposeHelp___jijwR svg {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__light___ORIft .styles-module__canvasPurposeHelp___jijwR:hover svg {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__placement___zcxv8 {
  position: absolute;
  border: 1.5px dashed rgba(59, 130, 246, 0.4);
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.08);
  cursor: grab;
  transition: box-shadow 0.15s, border-color 0.15s, opacity 0.15s ease, transform 0.15s ease;
  user-select: none;
  pointer-events: auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  animation: styles-module__placementEnter___TdRhf 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.styles-module__placement___zcxv8:active {
  cursor: grabbing;
}
.styles-module__placement___zcxv8:hover {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.12);
}
.styles-module__placement___zcxv8.styles-module__selected___6yrp6 {
  border-color: #3c82f7;
  border-style: solid;
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__placement___zcxv8.styles-module__selected___6yrp6:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8 {
  border-color: rgba(249, 115, 22, 0.4);
  background: rgba(249, 115, 22, 0.08);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8:hover {
  border-color: rgba(249, 115, 22, 0.5);
  background: rgba(249, 115, 22, 0.1);
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.12);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8.styles-module__selected___6yrp6 {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.1);
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15), 0 2px 8px rgba(249, 115, 22, 0.15);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8.styles-module__selected___6yrp6:hover {
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15), 0 2px 8px rgba(249, 115, 22, 0.15);
}
.styles-module__placement___zcxv8.styles-module__dragging___le6KZ {
  opacity: 0.85;
  z-index: 50;
}
.styles-module__placement___zcxv8.styles-module__exiting___YrM8F {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
  animation: none;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.styles-module__placementContent___f64A4 {
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.styles-module__placementLabel___0KvWl {
  position: absolute;
  top: -18px;
  left: 0;
  font-size: 10px;
  font-weight: 600;
  color: rgba(59, 130, 246, 0.7);
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.5);
}
.styles-module__selected___6yrp6 .styles-module__placementLabel___0KvWl {
  color: #3c82f7;
}
.styles-module__wireframe___itvQU .styles-module__placementLabel___0KvWl {
  color: rgba(249, 115, 22, 0.7);
}
.styles-module__wireframe___itvQU .styles-module__selected___6yrp6 .styles-module__placementLabel___0KvWl {
  color: #f97316;
}

.styles-module__placementAnnotation___78pTr {
  position: absolute;
  bottom: -18px;
  left: 0;
  right: 0;
  font-weight: 450;
  color: rgba(0, 0, 0, 0.5);
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.6);
  opacity: 0;
  transform: translateY(-2px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.styles-module__placementAnnotation___78pTr.styles-module__annotationVisible___mrUyA {
  opacity: 1;
  transform: translateY(0);
}

.styles-module__sectionAnnotation___aUIs0 {
  position: absolute;
  bottom: -18px;
  left: 0;
  right: 0;
  font-weight: 450;
  color: rgba(59, 130, 246, 0.6);
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.6);
  opacity: 0;
  transform: translateY(-2px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.styles-module__sectionAnnotation___aUIs0.styles-module__annotationVisible___mrUyA {
  opacity: 1;
  transform: translateY(0);
}

.styles-module__handle___Ikbxm {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 1.5px solid #3c82f7;
  border-radius: 2px;
  z-index: 12;
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.12);
  opacity: 0;
  transform: scale(0.3);
  pointer-events: none;
  will-change: opacity, transform;
  transition: opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.styles-module__placement___zcxv8:hover .styles-module__handle___Ikbxm, .styles-module__sectionOutline___s0hy-:hover .styles-module__handle___Ikbxm, .styles-module__ghostOutline___po-kO:hover .styles-module__handle___Ikbxm, .styles-module__placement___zcxv8:active .styles-module__handle___Ikbxm, .styles-module__sectionOutline___s0hy-:active .styles-module__handle___Ikbxm, .styles-module__ghostOutline___po-kO:active .styles-module__handle___Ikbxm, .styles-module__selected___6yrp6 .styles-module__handle___Ikbxm {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.styles-module__sectionOutline___s0hy- .styles-module__handle___Ikbxm {
  border-color: inherit;
}
.styles-module__wireframe___itvQU .styles-module__handle___Ikbxm {
  border-color: #f97316;
}

.styles-module__handleNw___4TMIj {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.styles-module__handleNe___mnsTh {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.styles-module__handleSe___oSFnk {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.styles-module__handleSw___pi--Z {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.styles-module__handleN___aBA-Q, .styles-module__handleE___0hM5u, .styles-module__handleS___JjDRv, .styles-module__handleW___ERWGQ {
  opacity: 0 !important;
  pointer-events: none !important;
}

.styles-module__edgeHandle___XxXdT {
  position: absolute;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
}
.styles-module__edgeHandle___XxXdT::after {
  content: "";
  position: absolute;
  border-radius: 4px;
  background: #3c82f7;
}
.styles-module__wireframe___itvQU .styles-module__edgeHandle___XxXdT::after {
  background: #f97316;
}
.styles-module__edgeHandle___XxXdT::after {
  opacity: 0;
  transition: opacity 0.1s ease, transform 0.1s ease;
  transform: scale(0.8);
}
.styles-module__edgeHandle___XxXdT:hover::after {
  opacity: 0.85;
  transform: scale(1);
}
.styles-module__edgeHandle___XxXdT svg {
  position: relative;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.1s ease;
  filter: drop-shadow(0 0 2px var(--agd-surface));
}
.styles-module__edgeHandle___XxXdT:hover svg {
  opacity: 1;
}

.styles-module__edgeN___-JJDj, .styles-module__edgeS___66lMX {
  left: 12px;
  right: 12px;
  height: 12px;
  cursor: n-resize;
}
.styles-module__edgeN___-JJDj::after, .styles-module__edgeS___66lMX::after {
  width: 24px;
  height: 4px;
}

.styles-module__edgeN___-JJDj {
  top: -6px;
}

.styles-module__edgeS___66lMX {
  bottom: -6px;
  cursor: s-resize;
}

.styles-module__edgeE___1bGDa, .styles-module__edgeW___lHQNo {
  top: 12px;
  bottom: 12px;
  width: 12px;
  cursor: e-resize;
}
.styles-module__edgeE___1bGDa::after, .styles-module__edgeW___lHQNo::after {
  width: 4px;
  height: 24px;
}

.styles-module__edgeE___1bGDa {
  right: -6px;
}

.styles-module__edgeW___lHQNo {
  left: -6px;
  cursor: w-resize;
}

.styles-module__deleteButton___LkGCb {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 1;
  z-index: 15;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.8);
  will-change: opacity, transform;
  transition: opacity 0.2s ease-out, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.12s ease, color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
}
.styles-module__placement___zcxv8:hover .styles-module__deleteButton___LkGCb, .styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb, .styles-module__sectionOutline___s0hy-:hover .styles-module__deleteButton___LkGCb, .styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb, .styles-module__ghostOutline___po-kO:hover .styles-module__deleteButton___LkGCb, .styles-module__ghostOutline___po-kO.styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.styles-module__deleteButton___LkGCb:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
  box-shadow: 0 1px 4px rgba(239, 68, 68, 0.3);
  transform: scale(1.1);
}
.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb, .styles-module__rearrangeOverlay___-3R3t:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb {
  background: rgba(40, 40, 40, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}
.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb:hover, .styles-module__rearrangeOverlay___-3R3t:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

.styles-module__drawBox___BrVAa {
  position: fixed;
  pointer-events: none;
  z-index: 99996;
  border: 2px solid #3c82f7;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.15);
}

.styles-module__selectBox___Iu8kB {
  position: fixed;
  pointer-events: none;
  z-index: 99996;
  border: 1px dashed #3c82f7;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 2px;
}

.styles-module__sizeIndicator___7zJ4y {
  position: fixed;
  pointer-events: none;
  z-index: 100001;
  font-size: 10px;
  color: #fff;
  background: #3c82f7;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.styles-module__guideLine___DUQY2 {
  pointer-events: none;
  z-index: 100001;
  background: #f0f;
  opacity: 0.5;
}

.styles-module__dragPreview___onPbU {
  position: fixed;
  z-index: 100002;
  pointer-events: none;
  border: 1.5px dashed #3c82f7;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  color: #3c82f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
  transition: width 0.08s ease, height 0.08s ease, opacity 0.08s ease;
}

.styles-module__dragPreviewWireframe___jsg0G {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.15);
}

.styles-module__palette___C7iSH {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  width: 256px;
  overflow: hidden;
  background: #1c1c1c;
  border: none;
  border-radius: 1rem;
  padding: 13px 0 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  z-index: 100001;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  cursor: default;
  opacity: 0;
  filter: blur(5px);
}
.styles-module__palette___C7iSH .styles-module__paletteItem___6TlnA,
.styles-module__palette___C7iSH .styles-module__paletteItemLabel___6ncO4,
.styles-module__palette___C7iSH .styles-module__paletteSectionTitle___PqnjX,
.styles-module__palette___C7iSH .styles-module__paletteFooter___QYnAG {
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__palette___C7iSH.styles-module__enter___6LYk5 {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__palette___C7iSH.styles-module__exit___iSGRw {
  opacity: 0;
  transform: translateY(6px);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
.styles-module__palette___C7iSH.styles-module__light___ORIft {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.styles-module__paletteSection___V8DEA {
  padding: 0 1rem;
}
.styles-module__paletteSection___V8DEA + .styles-module__paletteSection___V8DEA {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__light___ORIft .styles-module__paletteSection___V8DEA + .styles-module__paletteSection___V8DEA {
  border-top-color: rgba(0, 0, 0, 0.07);
}

.styles-module__paletteSectionTitle___PqnjX {
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  padding: 0 0 3px 3px;
}
.styles-module__light___ORIft .styles-module__paletteSectionTitle___PqnjX {
  color: rgba(0, 0, 0, 0.4);
}

.styles-module__paletteItem___6TlnA {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.25rem;
  margin-bottom: 1px;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  border: 1px solid transparent;
  user-select: none;
  min-height: 24px;
}
.styles-module__paletteItem___6TlnA:hover {
  background: rgba(255, 255, 255, 0.1);
}
.styles-module__paletteItem___6TlnA.styles-module__active___hosp7 {
  background: #3c82f7;
  border-color: transparent;
}
.styles-module__paletteItem___6TlnA.styles-module__wireframe___itvQU.styles-module__active___hosp7 {
  background: #f97316;
}
.styles-module__light___ORIft .styles-module__paletteItem___6TlnA:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__light___ORIft .styles-module__paletteItem___6TlnA.styles-module__active___hosp7 {
  background: #3c82f7;
  border-color: transparent;
}
.styles-module__light___ORIft .styles-module__paletteItem___6TlnA.styles-module__wireframe___itvQU.styles-module__active___hosp7 {
  background: #f97316;
}

.styles-module__paletteItemIcon___0NPQK {
  width: 20px;
  height: 16px;
  border-radius: 2px;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.45);
}
.styles-module__paletteItemIcon___0NPQK svg {
  display: block;
  width: 20px;
  height: 16px;
}
.styles-module__active___hosp7 .styles-module__paletteItemIcon___0NPQK {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.styles-module__light___ORIft .styles-module__paletteItemIcon___0NPQK {
  border-color: rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__paletteItemIcon___0NPQK {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.styles-module__paletteItemLabel___6ncO4 {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: -0.0094em;
  line-height: 1;
  min-width: 0;
}
.styles-module__active___hosp7 .styles-module__paletteItemLabel___6ncO4 {
  color: #fff;
  font-weight: 600;
}
.styles-module__light___ORIft .styles-module__paletteItemLabel___6ncO4 {
  color: rgba(0, 0, 0, 0.7);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__paletteItemLabel___6ncO4 {
  color: #fff;
  font-weight: 600;
}

.styles-module__placeScroll___7sClM {
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 0.25rem;
}
.styles-module__placeScroll___7sClM.styles-module__fadeTop___KT9tF {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 32px);
  mask-image: linear-gradient(to bottom, transparent 0, black 32px);
}
.styles-module__placeScroll___7sClM.styles-module__fadeBottom___x3ShT {
  -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 32px), transparent 100%);
  mask-image: linear-gradient(to bottom, black calc(100% - 32px), transparent 100%);
}
.styles-module__placeScroll___7sClM.styles-module__fadeTop___KT9tF.styles-module__fadeBottom___x3ShT {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 32px), transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 32px), transparent 100%);
}
.styles-module__placeScroll___7sClM::-webkit-scrollbar {
  width: 3px;
}
.styles-module__placeScroll___7sClM::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
}
.styles-module__light___ORIft .styles-module__placeScroll___7sClM::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.styles-module__paletteFooterWrap___71-fI {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__paletteFooterWrap___71-fI.styles-module__footerHidden___fJUik {
  grid-template-rows: 0fr;
}

.styles-module__paletteFooterInnerContent___VC26h {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.styles-module__footerHidden___fJUik .styles-module__paletteFooterInnerContent___VC26h {
  opacity: 0;
  transform: translateY(4px);
}

.styles-module__paletteFooterInner___dfylY {
  overflow: hidden;
}

.styles-module__paletteFooter___QYnAG {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  padding: 0 1rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__light___ORIft .styles-module__paletteFooter___QYnAG {
  border-top-color: rgba(0, 0, 0, 0.07);
}

.styles-module__paletteFooterCount___D3Fia {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__light___ORIft .styles-module__paletteFooterCount___D3Fia {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__paletteFooterClear___ybBoa {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: color 0.15s ease;
}
.styles-module__paletteFooterClear___ybBoa:hover {
  color: rgba(255, 255, 255, 0.7);
}
.styles-module__light___ORIft .styles-module__paletteFooterClear___ybBoa {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___ORIft .styles-module__paletteFooterClear___ybBoa:hover {
  color: rgba(0, 0, 0, 0.6);
}

.styles-module__paletteFooterActions___fLzv8 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.styles-module__rollingWrap___S75jM {
  display: inline-block;
  overflow: hidden;
  height: 1.15em;
  position: relative;
  vertical-align: bottom;
}

.styles-module__rollingNum___1RKDx {
  position: absolute;
  left: 0;
  top: 0;
}

.styles-module__exitUp___AFDRW {
  animation: styles-module__numExitUp___FRQqx 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.styles-module__enterUp___CPlXb {
  animation: styles-module__numEnterUp___2Yd-w 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.styles-module__exitDown___-1yAy {
  animation: styles-module__numExitDown___xm5by 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.styles-module__enterDown___DDuFR {
  animation: styles-module__numEnterDown___hpxBk 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes styles-module__numExitUp___FRQqx {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-110%);
    opacity: 0;
  }
}
@keyframes styles-module__numEnterUp___2Yd-w {
  from {
    transform: translateY(110%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes styles-module__numExitDown___xm5by {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(110%);
    opacity: 0;
  }
}
@keyframes styles-module__numEnterDown___hpxBk {
  from {
    transform: translateY(-110%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.styles-module__rearrangeOverlay___-3R3t {
  position: fixed;
  inset: 0;
  z-index: 99995;
  pointer-events: none;
  cursor: default;
  user-select: none;
  animation: styles-module__overlayFadeIn___aECVy 0.15s ease;
}

.styles-module__hoverHighlight___8eT-v {
  position: fixed;
  pointer-events: none;
  z-index: 99994;
  border: 2px dashed rgba(59, 130, 246, 0.5);
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.06);
  animation: styles-module__highlightFadeIn___Lg7KY 0.12s ease;
}

.styles-module__sectionOutline___s0hy- {
  position: fixed;
  border: 2px solid;
  border-radius: 4px;
  cursor: grab;
}
.styles-module__sectionOutline___s0hy-:active {
  cursor: grabbing;
}
.styles-module__sectionOutline___s0hy- {
  transition: box-shadow 0.15s, border-color 0.3s, background-color 0.3s, border-style 0s;
  user-select: none;
  pointer-events: auto;
  animation: styles-module__sectionEnter___-8BXT 0.2s ease;
}
.styles-module__sectionOutline___s0hy-:hover {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
}
.styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6 {
  border-style: solid;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) {
  border: 1.5px dashed rgba(150, 150, 150, 0.35);
  background-color: transparent !important;
  box-shadow: none;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover {
  border-color: rgba(150, 150, 150, 0.6);
  box-shadow: none;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__sectionLabel___F80HQ {
  opacity: 0;
  transition: opacity 0.15s ease;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover .styles-module__sectionLabel___F80HQ {
  opacity: 1;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__movedBadge___s8z-q,
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__sectionDimensions___RcJSL {
  opacity: 0;
  transition: opacity 0.15s ease;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover .styles-module__sectionDimensions___RcJSL {
  opacity: 1;
}
.styles-module__sectionOutline___s0hy-.styles-module__exiting___YrM8F {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
  animation: none;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.styles-module__sectionLabel___F80HQ {
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  max-width: calc(100% - 8px);
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__movedBadge___s8z-q {
  position: absolute;
  bottom: 22px;
  right: 4px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: #22c55e;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.styles-module__movedBadge___s8z-q.styles-module__badgeVisible___npbdS {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.2s cubic-bezier(0.34, 1.2, 0.64, 1), transform 0.2s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.styles-module__resizedBadge___u51V8 {
  background: #3c82f7;
  bottom: 40px;
}

.styles-module__sectionDimensions___RcJSL {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 9px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.styles-module__light___ORIft .styles-module__sectionDimensions___RcJSL {
  color: rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.7);
}

.styles-module__wireframeNotice___4GJyB {
  position: fixed;
  bottom: 16px;
  left: 24px;
  z-index: 99995;
  font-size: 9.5px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: auto;
  animation: styles-module__overlayFadeIn___aECVy 0.3s ease;
  line-height: 1.5;
  max-width: 280px;
}

.styles-module__wireframeOpacityRow___CJXzi {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.styles-module__wireframeOpacityLabel___afkfT {
  font-size: 9px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.32);
  letter-spacing: 0.02em;
  white-space: nowrap;
  user-select: none;
}

.styles-module__wireframeOpacitySlider___YcoEs {
  -webkit-appearance: none;
  appearance: none;
  width: 56px;
  height: 4px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease;
}
.styles-module__wireframeOpacitySlider___YcoEs:hover {
  background: rgba(0, 0, 0, 0.13);
}
.styles-module__wireframeOpacitySlider___YcoEs::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f97316;
  cursor: pointer;
  transition: background 0.15s ease;
}
.styles-module__wireframeOpacitySlider___YcoEs::-webkit-slider-thumb:hover {
  background: rgb(224.4209205021, 95.3548117155, 5.7790794979);
}
.styles-module__wireframeOpacitySlider___YcoEs::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f97316;
  border: none;
  cursor: pointer;
}
.styles-module__wireframeOpacitySlider___YcoEs::-moz-range-track {
  background: rgba(0, 0, 0, 0.08);
  height: 4px;
  border-radius: 2px;
}

.styles-module__wireframeNoticeTitleRow___PJqyG {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 2px;
}

.styles-module__wireframeNoticeTitle___okr08 {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.55);
}

.styles-module__wireframeNoticeDivider___PNKQ6 {
  width: 1px;
  height: 8px;
  background: rgba(0, 0, 0, 0.12);
  margin: 0 8px;
  flex-shrink: 0;
}

.styles-module__wireframeStartOver___YFk-I {
  font-size: 9.5px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  text-decoration: none;
  transition: color 0.12s ease;
  white-space: nowrap;
}
.styles-module__wireframeStartOver___YFk-I:hover {
  color: rgba(0, 0, 0, 0.6);
}

.styles-module__ghostOutline___po-kO {
  position: fixed;
  border: 1.5px dashed rgba(59, 130, 246, 0.4);
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.04);
  cursor: grab;
  opacity: 0.5;
  user-select: none;
  pointer-events: auto;
  animation: styles-module__ghostEnter___EC3Mb 0.25s ease;
  transition: box-shadow 0.15s, border-color 0.3s, opacity 0.25s;
}
.styles-module__ghostOutline___po-kO:active {
  cursor: grabbing;
}
.styles-module__ghostOutline___po-kO:hover {
  opacity: 0.7;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08);
}
.styles-module__ghostOutline___po-kO.styles-module__selected___6yrp6 {
  opacity: 1;
  border-style: solid;
  border-width: 2px;
  border-color: #3c82f7;
  background: rgba(59, 130, 246, 0.08);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__ghostOutline___po-kO.styles-module__exiting___YrM8F {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
  animation: none;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.styles-module__ghostBadge___tsQUK {
  position: absolute;
  bottom: calc(100% + 4px);
  left: -1px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(59, 130, 246, 0.9);
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  letter-spacing: 0.02em;
  line-height: 1.2;
  animation: styles-module__badgeSlideIn___typJ7 0.2s ease both;
}

@keyframes styles-module__badgeSlideIn___typJ7 {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.styles-module__ghostBadgeExtra___6CVoD {
  display: inline;
  animation: styles-module__badgeExtraIn___i4W8F 0.2s ease both;
}

@keyframes styles-module__badgeExtraIn___i4W8F {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.styles-module__originalOutline___Y6DD1 {
  position: fixed;
  border: 1.5px dashed rgba(150, 150, 150, 0.3);
  border-radius: 4px;
  background: transparent;
  pointer-events: none;
  user-select: none;
  animation: styles-module__sectionEnter___-8BXT 0.2s ease;
}

.styles-module__originalLabel___HqI9g {
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 9px;
  font-weight: 500;
  color: rgba(150, 150, 150, 0.5);
  padding: 1px 6px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: rgba(150, 150, 150, 0.08);
}

.styles-module__connectorSvg___Lovld {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 99996;
}

.styles-module__connectorLine___XeWh- {
  transition: opacity 0.2s ease;
  animation: styles-module__connectorDraw___8sK5I 0.3s ease both;
}

.styles-module__connectorDot___yvf7C {
  transform-box: fill-box;
  transform-origin: center;
  animation: styles-module__connectorDotIn___NwTUq 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
}

@keyframes styles-module__connectorDraw___8sK5I {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__connectorDotIn___NwTUq {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.styles-module__connectorExiting___2lLOs {
  animation: styles-module__connectorOut___5QoPl 0.2s ease forwards;
}
.styles-module__connectorExiting___2lLOs .styles-module__connectorDot___yvf7C {
  animation: styles-module__connectorDotOut___FEq7e 0.2s ease forwards;
}

@keyframes styles-module__connectorOut___5QoPl {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes styles-module__connectorDotOut___FEq7e {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
}
@keyframes styles-module__placementEnter___TdRhf {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__sectionEnter___-8BXT {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__highlightFadeIn___Lg7KY {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__overlayFadeIn___aECVy {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__ghostEnter___EC3Mb {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 0.6;
    transform: scale(1);
  }
}`,Lg={overlayExiting:"styles-module__overlayExiting___iEmYr",overlay:"styles-module__overlay___aWh-q",overlayFadeIn:"styles-module__overlayFadeIn___aECVy",light:"styles-module__light___ORIft",wireframe:"styles-module__wireframe___itvQU",placing:"styles-module__placing___45yD8",passthrough:"styles-module__passthrough___xaFeE",blankCanvas:"styles-module__blankCanvas___t2Eue",visible:"styles-module__visible___OKKqX",gridActive:"styles-module__gridActive___OZ-cf",paletteHeader:"styles-module__paletteHeader___-Q5gQ",paletteHeaderTitle:"styles-module__paletteHeaderTitle___oHqZC",paletteHeaderDesc:"styles-module__paletteHeaderDesc___6i74T",wireframePurposeWrap:"styles-module__wireframePurposeWrap___To-tS",collapsed:"styles-module__collapsed___Ms9vS",wireframePurposeInner:"styles-module__wireframePurposeInner___Lrahs",wireframePurposeInput:"styles-module__wireframePurposeInput___7EtBN",canvasToggle:"styles-module__canvasToggle___-QqSy",active:"styles-module__active___hosp7",canvasToggleIcon:"styles-module__canvasToggleIcon___7pJ82",canvasToggleLabel:"styles-module__canvasToggleLabel___OanpY",canvasPurposeWrap:"styles-module__canvasPurposeWrap___hj6zk",canvasPurposeInner:"styles-module__canvasPurposeInner___VWiyu",canvasPurposeToggle:"styles-module__canvasPurposeToggle___byDH2",canvasPurposeCheck:"styles-module__canvasPurposeCheck___xqd7l",checked:"styles-module__checked___-1JGH",canvasPurposeLabel:"styles-module__canvasPurposeLabel___Zu-tD",canvasPurposeHelp:"styles-module__canvasPurposeHelp___jijwR",placement:"styles-module__placement___zcxv8",placementEnter:"styles-module__placementEnter___TdRhf",selected:"styles-module__selected___6yrp6",dragging:"styles-module__dragging___le6KZ",exiting:"styles-module__exiting___YrM8F",placementContent:"styles-module__placementContent___f64A4",placementLabel:"styles-module__placementLabel___0KvWl",placementAnnotation:"styles-module__placementAnnotation___78pTr",annotationVisible:"styles-module__annotationVisible___mrUyA",sectionAnnotation:"styles-module__sectionAnnotation___aUIs0",handle:"styles-module__handle___Ikbxm",sectionOutline:"styles-module__sectionOutline___s0hy-",ghostOutline:"styles-module__ghostOutline___po-kO",handleNw:"styles-module__handleNw___4TMIj",handleNe:"styles-module__handleNe___mnsTh",handleSe:"styles-module__handleSe___oSFnk",handleSw:"styles-module__handleSw___pi--Z",handleN:"styles-module__handleN___aBA-Q",handleE:"styles-module__handleE___0hM5u",handleS:"styles-module__handleS___JjDRv",handleW:"styles-module__handleW___ERWGQ",edgeHandle:"styles-module__edgeHandle___XxXdT",edgeN:"styles-module__edgeN___-JJDj",edgeS:"styles-module__edgeS___66lMX",edgeE:"styles-module__edgeE___1bGDa",edgeW:"styles-module__edgeW___lHQNo",deleteButton:"styles-module__deleteButton___LkGCb",rearrangeOverlay:"styles-module__rearrangeOverlay___-3R3t",drawBox:"styles-module__drawBox___BrVAa",selectBox:"styles-module__selectBox___Iu8kB",sizeIndicator:"styles-module__sizeIndicator___7zJ4y",guideLine:"styles-module__guideLine___DUQY2",dragPreview:"styles-module__dragPreview___onPbU",dragPreviewWireframe:"styles-module__dragPreviewWireframe___jsg0G",palette:"styles-module__palette___C7iSH",paletteItem:"styles-module__paletteItem___6TlnA",paletteItemLabel:"styles-module__paletteItemLabel___6ncO4",paletteSectionTitle:"styles-module__paletteSectionTitle___PqnjX",paletteFooter:"styles-module__paletteFooter___QYnAG",enter:"styles-module__enter___6LYk5",exit:"styles-module__exit___iSGRw",paletteSection:"styles-module__paletteSection___V8DEA",paletteItemIcon:"styles-module__paletteItemIcon___0NPQK",placeScroll:"styles-module__placeScroll___7sClM",fadeTop:"styles-module__fadeTop___KT9tF",fadeBottom:"styles-module__fadeBottom___x3ShT",paletteFooterWrap:"styles-module__paletteFooterWrap___71-fI",footerHidden:"styles-module__footerHidden___fJUik",paletteFooterInnerContent:"styles-module__paletteFooterInnerContent___VC26h",paletteFooterInner:"styles-module__paletteFooterInner___dfylY",paletteFooterCount:"styles-module__paletteFooterCount___D3Fia",paletteFooterClear:"styles-module__paletteFooterClear___ybBoa",paletteFooterActions:"styles-module__paletteFooterActions___fLzv8",rollingWrap:"styles-module__rollingWrap___S75jM",rollingNum:"styles-module__rollingNum___1RKDx",exitUp:"styles-module__exitUp___AFDRW",numExitUp:"styles-module__numExitUp___FRQqx",enterUp:"styles-module__enterUp___CPlXb",numEnterUp:"styles-module__numEnterUp___2Yd-w",exitDown:"styles-module__exitDown___-1yAy",numExitDown:"styles-module__numExitDown___xm5by",enterDown:"styles-module__enterDown___DDuFR",numEnterDown:"styles-module__numEnterDown___hpxBk",hoverHighlight:"styles-module__hoverHighlight___8eT-v",highlightFadeIn:"styles-module__highlightFadeIn___Lg7KY",sectionEnter:"styles-module__sectionEnter___-8BXT",settled:"styles-module__settled___b5U5o",sectionLabel:"styles-module__sectionLabel___F80HQ",movedBadge:"styles-module__movedBadge___s8z-q",sectionDimensions:"styles-module__sectionDimensions___RcJSL",badgeVisible:"styles-module__badgeVisible___npbdS",resizedBadge:"styles-module__resizedBadge___u51V8",wireframeNotice:"styles-module__wireframeNotice___4GJyB",wireframeOpacityRow:"styles-module__wireframeOpacityRow___CJXzi",wireframeOpacityLabel:"styles-module__wireframeOpacityLabel___afkfT",wireframeOpacitySlider:"styles-module__wireframeOpacitySlider___YcoEs",wireframeNoticeTitleRow:"styles-module__wireframeNoticeTitleRow___PJqyG",wireframeNoticeTitle:"styles-module__wireframeNoticeTitle___okr08",wireframeNoticeDivider:"styles-module__wireframeNoticeDivider___PNKQ6",wireframeStartOver:"styles-module__wireframeStartOver___YFk-I",ghostEnter:"styles-module__ghostEnter___EC3Mb",ghostBadge:"styles-module__ghostBadge___tsQUK",badgeSlideIn:"styles-module__badgeSlideIn___typJ7",ghostBadgeExtra:"styles-module__ghostBadgeExtra___6CVoD",badgeExtraIn:"styles-module__badgeExtraIn___i4W8F",originalOutline:"styles-module__originalOutline___Y6DD1",originalLabel:"styles-module__originalLabel___HqI9g",connectorSvg:"styles-module__connectorSvg___Lovld",connectorLine:"styles-module__connectorLine___XeWh-",connectorDraw:"styles-module__connectorDraw___8sK5I",connectorDot:"styles-module__connectorDot___yvf7C",connectorDotIn:"styles-module__connectorDotIn___NwTUq",connectorExiting:"styles-module__connectorExiting___2lLOs",connectorOut:"styles-module__connectorOut___5QoPl",connectorDotOut:"styles-module__connectorDotOut___FEq7e"};if(typeof document<"u"){let s=document.getElementById("feedback-tool-styles-design-mode-styles");s||(s=document.createElement("style"),s.id="feedback-tool-styles-design-mode-styles",document.head.appendChild(s)),s.textContent=Og}var V=Lg,Na=24,Ei=5;function Gd(s,r,c,u,_){let f=1/0,b=1/0;const R=s.x,x=s.x+s.width,M=s.x+s.width/2,E=s.y,$=s.y+s.height,D=s.y+s.height/2,ue=!u,H=ue?[R,x,M]:[...u.left?[R]:[],...u.right?[x]:[]],ne=ue?[E,$,D]:[...u.top?[E]:[],...u.bottom?[$]:[]],U=[];for(const $e of r)c.has($e.id)||U.push($e);_&&U.push(..._);for(const $e of U){const tt=$e.x,xt=$e.x+$e.width,Ye=$e.x+$e.width/2,Qe=$e.y,T=$e.y+$e.height,ae=$e.y+$e.height/2;for(const X of H)for(const de of[tt,xt,Ye]){const je=de-X;Math.abs(je)<Ei&&Math.abs(je)<Math.abs(f)&&(f=je)}for(const X of ne)for(const de of[Qe,T,ae]){const je=de-X;Math.abs(je)<Ei&&Math.abs(je)<Math.abs(b)&&(b=je)}}const G=Math.abs(f)<Ei?f:0,_e=Math.abs(b)<Ei?b:0,ve=[],we=new Set,_t=R+G,nt=x+G,oe=M+G,ot=E+_e,rt=$+_e,at=D+_e;for(const $e of U){const tt=$e.x,xt=$e.x+$e.width,Ye=$e.x+$e.width/2,Qe=$e.y,T=$e.y+$e.height,ae=$e.y+$e.height/2;for(const X of[tt,Ye,xt])for(const de of[_t,oe,nt])if(Math.abs(de-X)<.5){const je=`x:${Math.round(X)}`;we.has(je)||(we.add(je),ve.push({axis:"x",pos:X}))}for(const X of[Qe,ae,T])for(const de of[ot,at,rt])if(Math.abs(de-X)<.5){const je=`y:${Math.round(X)}`;we.has(je)||(we.add(je),ve.push({axis:"y",pos:X}))}}return{dx:G,dy:_e,guides:ve}}function Vd(){return`dp-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}function $g({placements:s,onChange:r,activeComponent:c,onActiveComponentChange:u,isDarkMode:_,exiting:f,onInteractionChange:b,className:R,passthrough:x,extraSnapRects:M,onSelectionChange:E,deselectSignal:$,onDragMove:D,onDragEnd:ue,clearSignal:H,wireframe:ne}){const[U,G]=y.useState(new Set),[_e,ve]=y.useState(null),[we,_t]=y.useState(null),[nt,oe]=y.useState(null),[ot,rt]=y.useState([]),[at,$e]=y.useState(null),[tt,xt]=y.useState(!1),Ye=y.useRef(!1),[Qe,T]=y.useState(new Set),ae=y.useRef(new Map),X=y.useRef(null),de=y.useRef(null),je=y.useRef(s);je.current=s;const w=y.useRef(E);w.current=E;const I=y.useRef(D);I.current=D;const ie=y.useRef(ue);ie.current=ue;const fe=y.useRef($);y.useEffect(()=>{$!==fe.current&&(fe.current=$,G(new Set))},[$]);const Ne=y.useRef(H);y.useEffect(()=>{if(H!==void 0&&H!==Ne.current){Ne.current=H;const Z=new Set(je.current.map(Ce=>Ce.id));Z.size>0&&(T(Z),G(new Set),de.current=null,Le(()=>{r([]),T(new Set)},180))}},[H,r]),y.useEffect(()=>{const Z=Ce=>{const We=Ce.target;if(!(We.tagName==="INPUT"||We.tagName==="TEXTAREA"||We.isContentEditable)){if((Ce.key==="Backspace"||Ce.key==="Delete")&&U.size>0){Ce.preventDefault();const Ke=new Set(U);T(Ke),G(new Set),Le(()=>{r(je.current.filter(jt=>!Ke.has(jt.id))),T(new Set)},180);return}if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(Ce.key)&&U.size>0){Ce.preventDefault();const Ke=Ce.shiftKey?20:1,jt=Ce.key==="ArrowLeft"?-Ke:Ce.key==="ArrowRight"?Ke:0,Ge=Ce.key==="ArrowUp"?-Ke:Ce.key==="ArrowDown"?Ke:0;r(s.map(lt=>U.has(lt.id)?{...lt,x:Math.max(0,lt.x+jt),y:Math.max(0,lt.y+Ge)}:lt));return}if(Ce.key==="Escape"){c?u(null):U.size>0&&G(new Set);return}}};return document.addEventListener("keydown",Z),()=>document.removeEventListener("keydown",Z)},[U,c,s,r,u]);const Ze=y.useCallback(Z=>{if(Z.button!==0||x||Z.target.closest(`.${V.placement}`))return;Z.preventDefault(),Z.stopPropagation();const We=window.scrollY,He=Z.clientX,Ke=Z.clientY;if(c){de.current="place",b?.(!0);let jt=!1,Ge=He,lt=Ke;const Ct=Te=>{Ge=Te.clientX,lt=Te.clientY;const N=Math.abs(Ge-He),O=Math.abs(lt-Ke);if((N>5||O>5)&&(jt=!0),jt){const F=Math.min(He,Ge),ee=Math.min(Ke,lt),pe=Math.abs(Ge-He),se=Math.abs(lt-Ke);ve({x:F,y:ee,w:pe,h:se}),oe({x:Te.clientX+12,y:Te.clientY+12,text:`${Math.round(pe)} × ${Math.round(se)}`})}},Qt=Te=>{window.removeEventListener("mousemove",Ct),window.removeEventListener("mouseup",Qt),ve(null),oe(null),de.current=null,b?.(!1);const N=me[c];let O,F,ee,pe;jt?(O=Math.min(He,Ge),F=Math.min(Ke,lt)+We,ee=Math.max(Na,Math.abs(Ge-He)),pe=Math.max(Na,Math.abs(lt-Ke))):(ee=N.width,pe=N.height,O=He-ee/2,F=Ke+We-pe/2),O=Math.max(0,O),F=Math.max(0,F);const se={id:Vd(),type:c,x:O,y:F,width:ee,height:pe,scrollY:We,timestamp:Date.now()},le=[...s,se];r(le),G(new Set([se.id])),u(null)};window.addEventListener("mousemove",Ct),window.addEventListener("mouseup",Qt)}else{Z.shiftKey||G(new Set),de.current="select";let jt=!1;const Ge=Ct=>{const Qt=Math.abs(Ct.clientX-He),Te=Math.abs(Ct.clientY-Ke);if((Qt>4||Te>4)&&(jt=!0),jt){const N=Math.min(He,Ct.clientX),O=Math.min(Ke,Ct.clientY);_t({x:N,y:O,w:Math.abs(Ct.clientX-He),h:Math.abs(Ct.clientY-Ke)})}},lt=Ct=>{if(window.removeEventListener("mousemove",Ge),window.removeEventListener("mouseup",lt),de.current=null,jt){const Qt=Math.min(He,Ct.clientX),Te=Math.min(Ke,Ct.clientY)+We,N=Math.abs(Ct.clientX-He),O=Math.abs(Ct.clientY-Ke),F=new Set(Z.shiftKey?U:new Set);for(const ee of s)ee.y-We,ee.x+ee.width>Qt&&ee.x<Qt+N&&ee.y+ee.height>Te&&ee.y<Te+O&&F.add(ee.id);G(F)}_t(null)};window.addEventListener("mousemove",Ge),window.addEventListener("mouseup",lt)}},[c,x,s,r,U]),st=y.useCallback((Z,Ce)=>{if(Z.button!==0)return;const We=Z.target;if(We.closest(`.${V.handle}`)||We.closest(`.${V.deleteButton}`))return;Z.preventDefault(),Z.stopPropagation();let He;Z.shiftKey?(He=new Set(U),He.has(Ce)?He.delete(Ce):He.add(Ce)):U.has(Ce)?He=new Set(U):He=new Set([Ce]),G(He),(He.size!==U.size||[...He].some(se=>!U.has(se)))&&w.current?.(He,Z.shiftKey);const jt=Z.clientX,Ge=Z.clientY,lt=new Map;for(const se of s)He.has(se.id)&&lt.set(se.id,{x:se.x,y:se.y});de.current="move",b?.(!0);let Ct=!1,Qt=!1,Te=s,N=0,O=0;const F=new Map;for(const se of s)lt.has(se.id)&&F.set(se.id,{w:se.width,h:se.height});const ee=se=>{const le=se.clientX-jt,Re=se.clientY-Ge;if((Math.abs(le)>2||Math.abs(Re)>2)&&(Ct=!0),!Ct)return;if(se.altKey&&!Qt){Qt=!0;const Be=[];for(const St of s)lt.has(St.id)&&Be.push({...St,id:Vd(),timestamp:Date.now()});Te=[...s,...Be]}let Ve=1/0,gt=1/0,Mt=-1/0,Se=-1/0;for(const[Be,St]of lt){const Pe=F.get(Be);Pe&&(Ve=Math.min(Ve,St.x+le),gt=Math.min(gt,St.y+Re),Mt=Math.max(Mt,St.x+le+Pe.w),Se=Math.max(Se,St.y+Re+Pe.h))}const ft={x:Ve,y:gt,width:Mt-Ve,height:Se-gt},{dx:ut,dy:Fe,guides:xe}=Gd(ft,Te,new Set(lt.keys()),void 0,M);rt(xe);const bt=le+ut,Je=Re+Fe;N=bt,O=Je,r(Te.map(Be=>{const St=lt.get(Be.id);return St?{...Be,x:Math.max(0,St.x+bt),y:Math.max(0,St.y+Je)}:Be})),I.current?.(bt,Je)},pe=()=>{window.removeEventListener("mousemove",ee),window.removeEventListener("mouseup",pe),de.current=null,b?.(!1),rt([]),ie.current?.(N,O,Ct)};window.addEventListener("mousemove",ee),window.addEventListener("mouseup",pe)},[U,s,r,b]),Zt=y.useCallback((Z,Ce,We)=>{Z.preventDefault(),Z.stopPropagation();const He=s.find(F=>F.id===Ce);if(!He)return;G(new Set([Ce])),de.current="resize",b?.(!0);const Ke=Z.clientX,jt=Z.clientY,Ge=He.width,lt=He.height,Ct=He.x,Qt=He.y,Te={left:We.includes("w"),right:We.includes("e"),top:We.includes("n"),bottom:We.includes("s")},N=F=>{const ee=F.clientX-Ke,pe=F.clientY-jt;let se=Ge,le=lt,Re=Ct,Ve=Qt;We.includes("e")&&(se=Math.max(Na,Ge+ee)),We.includes("w")&&(se=Math.max(Na,Ge-ee),Re=Ct+Ge-se),We.includes("s")&&(le=Math.max(Na,lt+pe)),We.includes("n")&&(le=Math.max(Na,lt-pe),Ve=Qt+lt-le);const gt={x:Re,y:Ve,width:se,height:le},{dx:Mt,dy:Se,guides:ft}=Gd(gt,je.current,new Set([Ce]),Te,M);rt(ft),Mt!==0&&(Te.right?se+=Mt:Te.left&&(Re+=Mt,se-=Mt)),Se!==0&&(Te.bottom?le+=Se:Te.top&&(Ve+=Se,le-=Se)),r(je.current.map(ut=>ut.id===Ce?{...ut,x:Re,y:Ve,width:se,height:le}:ut)),oe({x:F.clientX+12,y:F.clientY+12,text:`${Math.round(se)} × ${Math.round(le)}`})},O=()=>{window.removeEventListener("mousemove",N),window.removeEventListener("mouseup",O),oe(null),de.current=null,b?.(!1),rt([])};window.addEventListener("mousemove",N),window.addEventListener("mouseup",O)},[s,r,b]),Nt=y.useCallback(Z=>{de.current=null,T(Ce=>{const We=new Set(Ce);return We.add(Z),We}),G(Ce=>{const We=new Set(Ce);return We.delete(Z),We}),Le(()=>{r(je.current.filter(Ce=>Ce.id!==Z)),T(Ce=>{const We=new Set(Ce);return We.delete(Z),We})},180)},[r]),Zn={hero:"Headline text",button:"Button label",badge:"Badge label",cta:"Call to action text",toast:"Notification message",modal:"Dialog title",card:"Card title",navigation:"Brand / nav items",tabs:"Tab labels",input:"Placeholder text",search:"Search placeholder",pricing:"Plan name or price",testimonial:"Quote text",alert:"Alert message",banner:"Banner text",tag:"Tag label",notification:"Notification message",stat:"Metric value",productCard:"Product name"},Sn=y.useCallback(Z=>{const Ce=s.find(We=>We.id===Z);Ce&&(Ye.current=!!Ce.text,$e(Z),xt(!1))},[s]),kn=y.useCallback(()=>{at&&(xt(!0),Le(()=>{$e(null),xt(!1)},150))},[at]);y.useEffect(()=>{f&&at&&kn()},[f]);const In=y.useCallback(Z=>{at&&(r(s.map(Ce=>Ce.id===at?{...Ce,text:Z.trim()||void 0}:Ce)),kn())},[at,s,r,kn]),bn=typeof window<"u"?window.scrollY:0,gl=["nw","ne","se","sw"],al=ne?"#f97316":"#3c82f7",Ul=[{dir:"n",cls:V.edgeN,arrow:o.jsx("svg",{width:"8",height:"6",viewBox:"0 0 8 6",fill:"none",children:o.jsx("path",{d:"M4 0.5L1 4.5h6z",fill:al})})},{dir:"e",cls:V.edgeE,arrow:o.jsx("svg",{width:"6",height:"8",viewBox:"0 0 6 8",fill:"none",children:o.jsx("path",{d:"M5.5 4L1.5 1v6z",fill:al})})},{dir:"s",cls:V.edgeS,arrow:o.jsx("svg",{width:"8",height:"6",viewBox:"0 0 8 6",fill:"none",children:o.jsx("path",{d:"M4 5.5L1 1.5h6z",fill:al})})},{dir:"w",cls:V.edgeW,arrow:o.jsx("svg",{width:"6",height:"8",viewBox:"0 0 6 8",fill:"none",children:o.jsx("path",{d:"M0.5 4L4.5 1v6z",fill:al})})}];return o.jsxs(o.Fragment,{children:[o.jsx("div",{ref:X,className:`${V.overlay} ${_?"":V.light} ${c?V.placing:""} ${x?V.passthrough:""} ${f?V.overlayExiting:""} ${ne?V.wireframe:""}${R?` ${R}`:""}`,"data-feedback-toolbar":!0,onMouseDown:Ze,children:s.map(Z=>{const Ce=U.has(Z.id),We=Rl[Z.type]?.label||Z.type,He=Z.y-bn;return o.jsxs("div",{"data-design-placement":Z.id,className:`${V.placement} ${Ce?V.selected:""} ${Qe.has(Z.id)?V.exiting:""}`,style:{left:Z.x,top:He,width:Z.width,height:Z.height,position:"fixed"},onMouseDown:Ke=>st(Ke,Z.id),onDoubleClick:()=>Sn(Z.id),children:[o.jsx("span",{className:V.placementLabel,children:We}),o.jsx("span",{className:`${V.placementAnnotation} ${Z.text?V.annotationVisible:""}`,children:(Z.text&&ae.current.set(Z.id,Z.text),Z.text||ae.current.get(Z.id)||"")}),o.jsx("div",{className:V.placementContent,children:o.jsx(Bg,{type:Z.type,width:Z.width,height:Z.height,text:Z.text})}),o.jsx("div",{className:V.deleteButton,onMouseDown:Ke=>Ke.stopPropagation(),onClick:()=>Nt(Z.id),children:"✕"}),gl.map(Ke=>o.jsx("div",{className:`${V.handle} ${V[`handle${Ke.charAt(0).toUpperCase()}${Ke.slice(1)}`]}`,onMouseDown:jt=>Zt(jt,Z.id,Ke)},Ke)),Ul.map(({dir:Ke,cls:jt,arrow:Ge})=>o.jsx("div",{className:`${V.edgeHandle} ${jt}`,onMouseDown:lt=>Zt(lt,Z.id,Ke),children:Ge},Ke))]},Z.id)})}),at&&(()=>{const Z=s.find(Qt=>Qt.id===at);if(!Z)return null;const Ce=Z.y-bn,We=Z.x+Z.width/2,He=Ce-8,Ke=Ce+Z.height+8,jt=He>200,Ge=Ke<window.innerHeight-100,lt=Math.max(160,Math.min(window.innerWidth-160,We));let Ct;return jt?Ct={left:lt,bottom:window.innerHeight-He}:Ge?Ct={left:lt,top:Ke}:Ct={left:lt,top:Math.max(80,window.innerHeight/2-80)},o.jsx(Mi,{element:Rl[Z.type]?.label||Z.type,placeholder:Zn[Z.type]||"Label or content text",initialValue:Z.text??"",submitLabel:Ye.current?"Save":"Set",onSubmit:In,onCancel:kn,onDelete:Ye.current?()=>{In("")}:void 0,isExiting:tt,lightMode:!_,style:Ct})})(),_e&&o.jsx("div",{className:V.drawBox,style:{left:_e.x,top:_e.y,width:_e.w,height:_e.h},"data-feedback-toolbar":!0}),we&&o.jsx("div",{className:V.selectBox,style:{left:we.x,top:we.y,width:we.w,height:we.h},"data-feedback-toolbar":!0}),nt&&o.jsx("div",{className:V.sizeIndicator,style:{left:nt.x,top:nt.y},"data-feedback-toolbar":!0,children:nt.text}),ot.map((Z,Ce)=>o.jsx("div",{className:V.guideLine,style:Z.axis==="x"?{position:"fixed",left:Z.pos,top:0,width:1,bottom:0}:{position:"fixed",left:0,top:Z.pos-bn,right:0,height:1},"data-feedback-toolbar":!0},`${Z.axis}-${Z.pos}-${Ce}`))]})}function Hg(s){if(!s)return"";const r=s.scrollTop>2,c=s.scrollTop+s.clientHeight<s.scrollHeight-2;return`${r?V.fadeTop:""} ${c?V.fadeBottom:""}`}var g="currentColor",Q="0.5";function Ug({type:s}){switch(s){case"navigation":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1",y:"4",width:"18",height:"8",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"2.5",y:"7",width:"3",height:"1.5",rx:".5",fill:g,opacity:".4"}),o.jsx("rect",{x:"7",y:"7",width:"2.5",height:"1.5",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"11",y:"7",width:"2.5",height:"1.5",rx:".5",fill:g,opacity:".25"})]});case"header":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1",y:"2",width:"18",height:"12",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"3",y:"5.5",width:"8",height:"2",rx:".5",fill:g,opacity:".35"}),o.jsx("rect",{x:"3",y:"9",width:"12",height:"1",rx:".5",fill:g,opacity:".15"})]});case"hero":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1",y:"1",width:"18",height:"14",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"5",y:"5",width:"10",height:"1.5",rx:".5",fill:g,opacity:".35"}),o.jsx("rect",{x:"7",y:"8",width:"6",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"7.5",y:"10.5",width:"5",height:"2.5",rx:"1",stroke:g,strokeWidth:Q})]});case"section":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1",y:"1",width:"18",height:"14",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"3",y:"4",width:"6",height:"1",rx:".5",fill:g,opacity:".3"}),o.jsx("rect",{x:"3",y:"6.5",width:"14",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"3",y:"9",width:"10",height:"1",rx:".5",fill:g,opacity:".15"})]});case"sidebar":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1",y:"1",width:"7",height:"14",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"2.5",y:"4",width:"4",height:"1",rx:".5",fill:g,opacity:".3"}),o.jsx("rect",{x:"2.5",y:"6.5",width:"3.5",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"2.5",y:"9",width:"4",height:"1",rx:".5",fill:g,opacity:".15"})]});case"footer":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1",y:"7",width:"18",height:"8",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"3",y:"9.5",width:"4",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"9",y:"9.5",width:"4",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"15",y:"9.5",width:"3",height:"1",rx:".5",fill:g,opacity:".2"})]});case"modal":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"2",width:"14",height:"12",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"5",y:"4.5",width:"7",height:"1",rx:".5",fill:g,opacity:".3"}),o.jsx("rect",{x:"5",y:"7",width:"10",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"11",y:"11",width:"5",height:"2",rx:".75",stroke:g,strokeWidth:Q})]});case"divider":return o.jsx("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:o.jsx("line",{x1:"2",y1:"8",x2:"18",y2:"8",stroke:g,strokeWidth:"0.5",opacity:".3"})});case"card":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"1",width:"16",height:"14",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"2",y:"1",width:"16",height:"5.5",rx:"1",fill:g,opacity:".04"}),o.jsx("rect",{x:"4",y:"8.5",width:"8",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"4",y:"11",width:"11",height:"1",rx:".5",fill:g,opacity:".12"})]});case"text":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"4",width:"14",height:"1.5",rx:".5",fill:g,opacity:".3"}),o.jsx("rect",{x:"2",y:"7",width:"11",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"2",y:"9.5",width:"13",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"2",y:"12",width:"8",height:"1",rx:".5",fill:g,opacity:".12"})]});case"image":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"2",width:"16",height:"12",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("line",{x1:"2",y1:"2",x2:"18",y2:"14",stroke:g,strokeWidth:".3",opacity:".25"}),o.jsx("line",{x1:"18",y1:"2",x2:"2",y2:"14",stroke:g,strokeWidth:".3",opacity:".25"})]});case"video":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"2",width:"16",height:"12",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("path",{d:"M8.5 5.5v5l4.5-2.5z",stroke:g,strokeWidth:Q,fill:g,opacity:".15"})]});case"table":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1",y:"2",width:"18",height:"12",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("line",{x1:"1",y1:"5.5",x2:"19",y2:"5.5",stroke:g,strokeWidth:".3",opacity:".25"}),o.jsx("line",{x1:"1",y1:"9",x2:"19",y2:"9",stroke:g,strokeWidth:".3",opacity:".25"}),o.jsx("line",{x1:"7",y1:"2",x2:"7",y2:"14",stroke:g,strokeWidth:".3",opacity:".25"}),o.jsx("line",{x1:"13",y1:"2",x2:"13",y2:"14",stroke:g,strokeWidth:".3",opacity:".25"})]});case"grid":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1.5",y:"2",width:"7",height:"5.5",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"11.5",y:"2",width:"7",height:"5.5",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"1.5",y:"9.5",width:"7",height:"5.5",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"11.5",y:"9.5",width:"7",height:"5.5",rx:"1",stroke:g,strokeWidth:Q})]});case"list":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("circle",{cx:"3.5",cy:"4.5",r:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"6.5",y:"4",width:"10",height:"1",rx:".5",fill:g,opacity:".2"}),o.jsx("circle",{cx:"3.5",cy:"8",r:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"6.5",y:"7.5",width:"8",height:"1",rx:".5",fill:g,opacity:".2"}),o.jsx("circle",{cx:"3.5",cy:"11.5",r:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"6.5",y:"11",width:"11",height:"1",rx:".5",fill:g,opacity:".2"})]});case"chart":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"9",width:"2.5",height:"4",rx:".5",fill:g,opacity:".2"}),o.jsx("rect",{x:"7",y:"6",width:"2.5",height:"7",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"11",y:"3",width:"2.5",height:"10",rx:".5",fill:g,opacity:".3"}),o.jsx("rect",{x:"15",y:"5",width:"2.5",height:"8",rx:".5",fill:g,opacity:".2"})]});case"accordion":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1.5",y:"2",width:"17",height:"4",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"3",y:"3.5",width:"6",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"1.5",y:"7.5",width:"17",height:"3",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"1.5",y:"12",width:"17",height:"3",rx:"1",stroke:g,strokeWidth:Q})]});case"carousel":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"2",width:"14",height:"10",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("path",{d:"M1.5 7L3 8.5 1.5 10",stroke:g,strokeWidth:Q,opacity:".35"}),o.jsx("path",{d:"M18.5 7L17 8.5 18.5 10",stroke:g,strokeWidth:Q,opacity:".35"}),o.jsx("circle",{cx:"8.5",cy:"14",r:".6",fill:g,opacity:".35"}),o.jsx("circle",{cx:"10",cy:"14",r:".6",fill:g,opacity:".15"}),o.jsx("circle",{cx:"11.5",cy:"14",r:".6",fill:g,opacity:".15"})]});case"button":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"5",width:"14",height:"6",rx:"2",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"6.5",y:"7.5",width:"7",height:"1",rx:".5",fill:g,opacity:".25"})]});case"input":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"4",width:"5.5",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"2",y:"6.5",width:"16",height:"5.5",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"3.5",y:"8.5",width:"7",height:"1",rx:".5",fill:g,opacity:".12"})]});case"search":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"4.5",width:"16",height:"7",rx:"3.5",stroke:g,strokeWidth:Q}),o.jsx("circle",{cx:"6",cy:"8",r:"2",stroke:g,strokeWidth:Q,opacity:".3"}),o.jsx("line",{x1:"7.5",y1:"9.5",x2:"9",y2:"11",stroke:g,strokeWidth:Q,opacity:".3"}),o.jsx("rect",{x:"9.5",y:"7.5",width:"6",height:"1",rx:".5",fill:g,opacity:".12"})]});case"form":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"1.5",width:"5.5",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"2",y:"3.5",width:"16",height:"3",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"2",y:"8",width:"7",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"2",y:"10",width:"16",height:"3",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"12",y:"14",width:"6",height:"2",rx:".75",stroke:g,strokeWidth:Q})]});case"tabs":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1",y:"5",width:"18",height:"10",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"1",y:"2",width:"6",height:"3.5",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"2.5",y:"3.25",width:"3",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"7",y:"2",width:"6",height:"3.5",rx:".75",stroke:g,strokeWidth:Q})]});case"dropdown":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"2",width:"16",height:"4",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"3.5",y:"3.5",width:"7",height:"1",rx:".5",fill:g,opacity:".2"}),o.jsx("path",{d:"M15 3.5l1.5 1.5L18 3.5",stroke:g,strokeWidth:Q,opacity:".3"}),o.jsx("rect",{x:"2",y:"7",width:"16",height:"7",rx:"1",stroke:g,strokeWidth:Q,strokeDasharray:"2 1",opacity:".3"})]});case"toggle":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"4",y:"5",width:"12",height:"6",rx:"3",stroke:g,strokeWidth:Q}),o.jsx("circle",{cx:"13",cy:"8",r:"2",fill:g,opacity:".3"})]});case"avatar":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("circle",{cx:"10",cy:"8",r:"6",stroke:g,strokeWidth:Q}),o.jsx("circle",{cx:"10",cy:"6.5",r:"2",stroke:g,strokeWidth:Q}),o.jsx("path",{d:"M6.5 13c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5",stroke:g,strokeWidth:Q})]});case"badge":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"5",width:"14",height:"6",rx:"3",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"6",y:"7.5",width:"8",height:"1",rx:".5",fill:g,opacity:".25"})]});case"breadcrumb":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1.5",y:"7",width:"3.5",height:"1",rx:".5",fill:g,opacity:".3"}),o.jsx("path",{d:"M6.5 7l1 1-1 1",stroke:g,strokeWidth:Q,opacity:".2"}),o.jsx("rect",{x:"9",y:"7",width:"3.5",height:"1",rx:".5",fill:g,opacity:".2"}),o.jsx("path",{d:"M14 7l1 1-1 1",stroke:g,strokeWidth:Q,opacity:".2"}),o.jsx("rect",{x:"16.5",y:"7",width:"2",height:"1",rx:".5",fill:g,opacity:".15"})]});case"pagination":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"5.5",width:"3.5",height:"5",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"6.5",y:"5.5",width:"3.5",height:"5",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"11",y:"5.5",width:"3.5",height:"5",rx:"1",fill:g,opacity:".15",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"15.5",y:"5.5",width:"3.5",height:"5",rx:"1",stroke:g,strokeWidth:Q})]});case"progress":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"7",width:"16",height:"2",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"2",y:"7",width:"10",height:"2",rx:"1",fill:g,opacity:".2"})]});case"toast":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"4",width:"16",height:"8",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("circle",{cx:"5",cy:"8",r:"1.5",stroke:g,strokeWidth:Q,opacity:".3"}),o.jsx("rect",{x:"8",y:"6.5",width:"7",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"8",y:"9",width:"5",height:"1",rx:".5",fill:g,opacity:".12"})]});case"tooltip":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"3",width:"14",height:"7",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"5.5",y:"5.5",width:"9",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("path",{d:"M9 10l1 2.5 1-2.5",stroke:g,strokeWidth:Q})]});case"pricing":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"1",width:"16",height:"14",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"6",y:"3",width:"8",height:"1.5",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"7",y:"5.5",width:"6",height:"2",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"5",y:"9",width:"10",height:"1",rx:".5",fill:g,opacity:".1"}),o.jsx("rect",{x:"5",y:"11",width:"10",height:"1",rx:".5",fill:g,opacity:".1"}),o.jsx("rect",{x:"6",y:"13",width:"8",height:"1.5",rx:".5",fill:g,opacity:".2"})]});case"testimonial":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"1",width:"16",height:"14",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("text",{x:"4",y:"5.5",fontSize:"4",fill:g,opacity:".2",fontFamily:"serif",children:"“"}),o.jsx("rect",{x:"4",y:"7",width:"12",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"4",y:"9",width:"9",height:"1",rx:".5",fill:g,opacity:".12"}),o.jsx("circle",{cx:"5.5",cy:"12.5",r:"1.5",stroke:g,strokeWidth:Q,opacity:".25"}),o.jsx("rect",{x:"8",y:"12",width:"5",height:"1",rx:".5",fill:g,opacity:".15"})]});case"cta":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1",y:"2",width:"18",height:"12",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"5",y:"4.5",width:"10",height:"1.5",rx:".5",fill:g,opacity:".3"}),o.jsx("rect",{x:"6",y:"7.5",width:"8",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"7",y:"10",width:"6",height:"2.5",rx:"1",stroke:g,strokeWidth:Q})]});case"alert":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"4",width:"16",height:"8",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("circle",{cx:"6",cy:"8",r:"2",stroke:g,strokeWidth:Q,opacity:".3"}),o.jsx("line",{x1:"6",y1:"7",x2:"6",y2:"8.5",stroke:g,strokeWidth:"0.6",opacity:".5"}),o.jsx("circle",{cx:"6",cy:"9.3",r:".3",fill:g,opacity:".5"}),o.jsx("rect",{x:"9.5",y:"7",width:"6",height:"1",rx:".5",fill:g,opacity:".2"})]});case"banner":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1",y:"5",width:"18",height:"6",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"4",y:"7.5",width:"8",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"14",y:"7",width:"3.5",height:"2",rx:".75",stroke:g,strokeWidth:Q})]});case"stat":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"2",width:"14",height:"12",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"6",y:"4.5",width:"8",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"5",y:"7",width:"10",height:"2.5",rx:".5",fill:g,opacity:".3"}),o.jsx("rect",{x:"7",y:"11",width:"6",height:"1",rx:".5",fill:g,opacity:".12"})]});case"stepper":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("circle",{cx:"4",cy:"8",r:"2",fill:g,opacity:".2",stroke:g,strokeWidth:Q}),o.jsx("line",{x1:"6",y1:"8",x2:"8",y2:"8",stroke:g,strokeWidth:".4",opacity:".3"}),o.jsx("circle",{cx:"10",cy:"8",r:"2",stroke:g,strokeWidth:Q}),o.jsx("line",{x1:"12",y1:"8",x2:"14",y2:"8",stroke:g,strokeWidth:".4",opacity:".3"}),o.jsx("circle",{cx:"16",cy:"8",r:"2",stroke:g,strokeWidth:Q})]});case"tag":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"5",width:"14",height:"6",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"5.5",y:"7.5",width:"6",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("line",{x1:"14",y1:"6.5",x2:"15.5",y2:"9.5",stroke:g,strokeWidth:Q,opacity:".2"}),o.jsx("line",{x1:"15.5",y1:"6.5",x2:"14",y2:"9.5",stroke:g,strokeWidth:Q,opacity:".2"})]});case"rating":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("path",{d:"M4 5.5l1 2 2.2.3-1.6 1.5.4 2.2L4 10.3l-2 1.2.4-2.2L.8 7.8 3 7.5z",fill:g,opacity:".25"}),o.jsx("path",{d:"M10 5.5l1 2 2.2.3-1.6 1.5.4 2.2L10 10.3l-2 1.2.4-2.2L6.8 7.8 9 7.5z",fill:g,opacity:".25"}),o.jsx("path",{d:"M16 5.5l1 2 2.2.3-1.6 1.5.4 2.2L16 10.3l-2 1.2.4-2.2-1.6-1.5 2.2-.3z",stroke:g,strokeWidth:Q,opacity:".25"})]});case"map":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"2",width:"16",height:"12",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("line",{x1:"2",y1:"6",x2:"18",y2:"10",stroke:g,strokeWidth:".3",opacity:".15"}),o.jsx("line",{x1:"7",y1:"2",x2:"11",y2:"14",stroke:g,strokeWidth:".3",opacity:".15"}),o.jsx("path",{d:"M10 5c-1.7 0-3 1.3-3 3 0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z",fill:g,opacity:".15",stroke:g,strokeWidth:Q})]});case"timeline":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("line",{x1:"5",y1:"2",x2:"5",y2:"14",stroke:g,strokeWidth:".4",opacity:".25"}),o.jsx("circle",{cx:"5",cy:"4",r:"1.5",fill:g,opacity:".2",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"8",y:"3",width:"8",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("circle",{cx:"5",cy:"8.5",r:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"8",y:"7.5",width:"6",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("circle",{cx:"5",cy:"13",r:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"8",y:"12",width:"7",height:"1",rx:".5",fill:g,opacity:".15"})]});case"fileUpload":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"2",width:"14",height:"12",rx:"1.5",stroke:g,strokeWidth:Q,strokeDasharray:"2 1"}),o.jsx("path",{d:"M10 10V5.5m0 0L7.5 8m2.5-2.5L12.5 8",stroke:g,strokeWidth:Q,opacity:".3"}),o.jsx("rect",{x:"7",y:"11.5",width:"6",height:"1",rx:".5",fill:g,opacity:".15"})]});case"codeBlock":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"2",width:"16",height:"12",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("circle",{cx:"4",cy:"4",r:".6",fill:g,opacity:".3"}),o.jsx("circle",{cx:"5.5",cy:"4",r:".6",fill:g,opacity:".3"}),o.jsx("circle",{cx:"7",cy:"4",r:".6",fill:g,opacity:".3"}),o.jsx("rect",{x:"4",y:"7",width:"7",height:"1",rx:".5",fill:g,opacity:".2"}),o.jsx("rect",{x:"6",y:"9",width:"5",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"4",y:"11",width:"8",height:"1",rx:".5",fill:g,opacity:".12"})]});case"calendar":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"3",width:"16",height:"12",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("line",{x1:"2",y1:"6.5",x2:"18",y2:"6.5",stroke:g,strokeWidth:".4",opacity:".25"}),o.jsx("rect",{x:"5",y:"4",width:"1",height:"1.5",rx:".3",fill:g,opacity:".2"}),o.jsx("rect",{x:"14",y:"4",width:"1",height:"1.5",rx:".3",fill:g,opacity:".2"}),o.jsx("circle",{cx:"7",cy:"9",r:".6",fill:g,opacity:".2"}),o.jsx("circle",{cx:"10",cy:"9",r:".6",fill:g,opacity:".2"}),o.jsx("circle",{cx:"13",cy:"9",r:".6",fill:g,opacity:".3"}),o.jsx("circle",{cx:"7",cy:"12",r:".6",fill:g,opacity:".2"}),o.jsx("circle",{cx:"10",cy:"12",r:".6",fill:g,opacity:".2"})]});case"notification":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"3",width:"16",height:"10",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("circle",{cx:"5.5",cy:"8",r:"2",stroke:g,strokeWidth:Q,opacity:".25"}),o.jsx("rect",{x:"9",y:"6",width:"6",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"9",y:"8.5",width:"4.5",height:"1",rx:".5",fill:g,opacity:".12"}),o.jsx("circle",{cx:"16.5",cy:"4.5",r:"1.5",fill:g,opacity:".25"})]});case"productCard":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"1",width:"14",height:"14",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"3",y:"1",width:"14",height:"6",rx:"1",fill:g,opacity:".04"}),o.jsx("rect",{x:"5",y:"8.5",width:"7",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"5",y:"10.5",width:"4",height:"1.5",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"12",y:"12",width:"4",height:"2",rx:".75",stroke:g,strokeWidth:Q})]});case"profile":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("circle",{cx:"10",cy:"5",r:"3",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"5",y:"10",width:"10",height:"1.5",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"7",y:"12.5",width:"6",height:"1",rx:".5",fill:g,opacity:".12"})]});case"drawer":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"9",y:"1",width:"10",height:"14",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"10.5",y:"4",width:"5",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"10.5",y:"6.5",width:"7",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"10.5",y:"9",width:"6",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"1",y:"1",width:"7",height:"14",rx:"1",stroke:g,strokeWidth:Q,opacity:".15"})]});case"popover":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"2",width:"14",height:"9",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"5",y:"4.5",width:"8",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"5",y:"7",width:"6",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("path",{d:"M9 11l1 2.5 1-2.5",stroke:g,strokeWidth:Q})]});case"logo":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"3",width:"10",height:"10",rx:"2",stroke:g,strokeWidth:Q}),o.jsx("path",{d:"M5 9.5l2-4 2 4",stroke:g,strokeWidth:Q,opacity:".3"}),o.jsx("rect",{x:"14",y:"6",width:"4",height:"1",rx:".5",fill:g,opacity:".2"}),o.jsx("rect",{x:"14",y:"8.5",width:"3",height:"1",rx:".5",fill:g,opacity:".12"})]});case"faq":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("text",{x:"2.5",y:"5.5",fontSize:"4",fill:g,opacity:".3",fontWeight:"bold",children:"?"}),o.jsx("rect",{x:"7",y:"3",width:"10",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"7",y:"5.5",width:"8",height:"1",rx:".5",fill:g,opacity:".12"}),o.jsx("text",{x:"2.5",y:"11.5",fontSize:"4",fill:g,opacity:".3",fontWeight:"bold",children:"?"}),o.jsx("rect",{x:"7",y:"9",width:"9",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"7",y:"11.5",width:"7",height:"1",rx:".5",fill:g,opacity:".12"})]});case"gallery":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1.5",y:"1.5",width:"5",height:"5",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"7.5",y:"1.5",width:"5",height:"5",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"13.5",y:"1.5",width:"5",height:"5",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"1.5",y:"9.5",width:"5",height:"5",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"7.5",y:"9.5",width:"5",height:"5",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"13.5",y:"9.5",width:"5",height:"5",rx:".75",stroke:g,strokeWidth:Q})]});case"checkbox":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"5",y:"4",width:"8",height:"8",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("path",{d:"M7.5 8l1.5 1.5 3-3",stroke:g,strokeWidth:Q,opacity:".35"})]});case"radio":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("circle",{cx:"10",cy:"8",r:"4",stroke:g,strokeWidth:Q}),o.jsx("circle",{cx:"10",cy:"8",r:"2",fill:g,opacity:".3"})]});case"slider":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"7.5",width:"16",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"2",y:"7.5",width:"10",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("circle",{cx:"12",cy:"8",r:"2.5",stroke:g,strokeWidth:Q})]});case"datePicker":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"1",width:"16",height:"5",rx:"1",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"3.5",y:"3",width:"5",height:"1",rx:".5",fill:g,opacity:".2"}),o.jsx("rect",{x:"14",y:"2.5",width:"2.5",height:"2",rx:".5",fill:g,opacity:".12"}),o.jsx("rect",{x:"2",y:"7",width:"16",height:"8",rx:"1",stroke:g,strokeWidth:Q,strokeDasharray:"2 1",opacity:".3"}),o.jsx("circle",{cx:"6",cy:"10",r:".6",fill:g,opacity:".2"}),o.jsx("circle",{cx:"10",cy:"10",r:".6",fill:g,opacity:".3"}),o.jsx("circle",{cx:"14",cy:"10",r:".6",fill:g,opacity:".2"}),o.jsx("circle",{cx:"6",cy:"13",r:".6",fill:g,opacity:".2"}),o.jsx("circle",{cx:"10",cy:"13",r:".6",fill:g,opacity:".2"})]});case"skeleton":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"2",width:"16",height:"3",rx:"1",fill:g,opacity:".08"}),o.jsx("rect",{x:"2",y:"7",width:"10",height:"2",rx:".75",fill:g,opacity:".08"}),o.jsx("rect",{x:"2",y:"11",width:"13",height:"2",rx:".75",fill:g,opacity:".08"})]});case"chip":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"1.5",y:"5",width:"10",height:"6",rx:"3",fill:g,opacity:".08",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"4",y:"7.5",width:"4",height:"1",rx:".5",fill:g,opacity:".25"}),o.jsx("line",{x1:"9.5",y1:"6.5",x2:"10.5",y2:"9.5",stroke:g,strokeWidth:Q,opacity:".2"}),o.jsx("line",{x1:"10.5",y1:"6.5",x2:"9.5",y2:"9.5",stroke:g,strokeWidth:Q,opacity:".2"}),o.jsx("rect",{x:"13",y:"5",width:"5.5",height:"6",rx:"3",stroke:g,strokeWidth:Q,opacity:".25"})]});case"icon":return o.jsx("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:o.jsx("path",{d:"M10 3l1.5 3 3.5.5-2.5 2.5.5 3.5L10 11l-3 1.5.5-3.5L5 6.5l3.5-.5z",stroke:g,strokeWidth:Q,opacity:".3"})});case"spinner":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("circle",{cx:"10",cy:"8",r:"5",stroke:g,strokeWidth:Q,opacity:".12"}),o.jsx("path",{d:"M10 3a5 5 0 0 1 5 5",stroke:g,strokeWidth:Q,opacity:".35",strokeLinecap:"round"})]});case"feature":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"2",width:"5",height:"5",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("path",{d:"M4.5 3.5v3m-1.5-1.5h3",stroke:g,strokeWidth:Q,opacity:".25"}),o.jsx("rect",{x:"9",y:"2.5",width:"8",height:"1.5",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"9",y:"5.5",width:"6",height:"1",rx:".5",fill:g,opacity:".12"}),o.jsx("rect",{x:"2",y:"10",width:"5",height:"5",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"9",y:"10.5",width:"7",height:"1.5",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"9",y:"13.5",width:"5",height:"1",rx:".5",fill:g,opacity:".12"})]});case"team":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("circle",{cx:"5",cy:"5",r:"2.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"2.5",y:"9",width:"5",height:"1",rx:".5",fill:g,opacity:".2"}),o.jsx("circle",{cx:"15",cy:"5",r:"2.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"12.5",y:"9",width:"5",height:"1",rx:".5",fill:g,opacity:".2"}),o.jsx("circle",{cx:"10",cy:"5",r:"2.5",stroke:g,strokeWidth:Q,opacity:".5"}),o.jsx("rect",{x:"7.5",y:"9",width:"5",height:"1",rx:".5",fill:g,opacity:".15"}),o.jsx("rect",{x:"4",y:"12",width:"12",height:"1",rx:".5",fill:g,opacity:".1"})]});case"login":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"3",y:"1",width:"14",height:"14",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"6",y:"3",width:"8",height:"1.5",rx:".5",fill:g,opacity:".25"}),o.jsx("rect",{x:"5",y:"5.5",width:"10",height:"3",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"5",y:"9.5",width:"10",height:"3",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"6.5",y:"13.5",width:"7",height:"2",rx:".75",fill:g,opacity:".2"})]});case"contact":return o.jsxs("svg",{viewBox:"0 0 20 16",width:"20",height:"16",fill:"none",children:[o.jsx("rect",{x:"2",y:"1",width:"16",height:"14",rx:"1.5",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"4",y:"3",width:"5",height:"1",rx:".5",fill:g,opacity:".2"}),o.jsx("rect",{x:"4",y:"5",width:"12",height:"2.5",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"4",y:"8.5",width:"12",height:"4",rx:".75",stroke:g,strokeWidth:Q}),o.jsx("rect",{x:"11",y:"13.5",width:"5",height:"1.5",rx:".5",fill:g,opacity:".2"})]});default:return null}}function Yg({activeType:s,onSelect:r,onDragStart:c,scrollRef:u,fadeClass:_,blankCanvas:f}){return o.jsx("div",{ref:u,className:`${V.placeScroll} ${_||""}`,children:Wd.map(b=>o.jsxs("div",{className:V.paletteSection,children:[o.jsx("div",{className:V.paletteSectionTitle,children:b.section}),b.items.map(R=>o.jsxs("div",{className:`${V.paletteItem} ${s===R.type?V.active:""} ${f?V.wireframe:""}`,onClick:()=>r(R.type),onMouseDown:x=>{x.button===0&&c(R.type,x)},children:[o.jsx("div",{className:V.paletteItemIcon,children:o.jsx(Ug,{type:R.type})}),o.jsx("span",{className:V.paletteItemLabel,children:R.label})]},R.type))]},b.section))})}function Xg({value:s,suffix:r}){const[c,u]=y.useState(null),[_,f]=y.useState(r),[b,R]=y.useState("up"),x=y.useRef(s),M=y.useRef(r),E=y.useRef(),$=c!==null&&_!==r;return y.useEffect(()=>{if(s!==x.current){if(s===0){x.current=s,M.current=r,u(null);return}R(s>x.current?"up":"down"),u(x.current),f(M.current),x.current=s,M.current=r,clearTimeout(E.current),E.current=Le(()=>u(null),250)}else M.current=r},[s,r]),c===null?o.jsxs(o.Fragment,{children:[s,r?` ${r}`:""]}):$?o.jsxs("span",{className:V.rollingWrap,children:[o.jsxs("span",{style:{visibility:"hidden"},children:[s," ",r]}),o.jsxs("span",{className:`${V.rollingNum} ${b==="up"?V.exitUp:V.exitDown}`,children:[c," ",_]},`o${c}-${s}`),o.jsxs("span",{className:`${V.rollingNum} ${b==="up"?V.enterUp:V.enterDown}`,children:[s," ",r]},`n${s}`)]}):o.jsxs(o.Fragment,{children:[o.jsxs("span",{className:V.rollingWrap,children:[o.jsx("span",{style:{visibility:"hidden"},children:s}),o.jsx("span",{className:`${V.rollingNum} ${b==="up"?V.exitUp:V.exitDown}`,children:c},`o${c}-${s}`),o.jsx("span",{className:`${V.rollingNum} ${b==="up"?V.enterUp:V.enterDown}`,children:s},`n${s}`)]}),r?` ${r}`:""]})}function Ig({activeType:s,onSelect:r,isDarkMode:c,sectionCount:u,onDetectSections:_,visible:f,onExited:b,placementCount:R,onClearPlacements:x,onDragStart:M,blankCanvas:E,onBlankCanvasChange:$,wireframePurpose:D,onWireframePurposeChange:ue,Tooltip:H}){const[ne,U]=y.useState(!1),[G,_e]=y.useState("exit"),[ve,we]=y.useState(!1),[_t,nt]=y.useState(!0),oe=y.useRef(0),ot=y.useRef(""),rt=y.useRef(0),at=y.useRef(),$e=y.useRef(null),[tt,xt]=y.useState("");y.useEffect(()=>(f?(U(!0),clearTimeout(at.current),cancelAnimationFrame(rt.current),rt.current=Da(()=>{rt.current=Da(()=>{_e("enter")})})):(cancelAnimationFrame(rt.current),_e("exit"),clearTimeout(at.current),at.current=Le(()=>{U(!1),b?.()},200)),()=>cancelAnimationFrame(rt.current)),[f]);const Ye=R>0||u>0,Qe=R+u;return Qe>0&&(oe.current=Qe,ot.current=E?Qe===1?"Component":"Components":Qe===1?"Change":"Changes"),y.useEffect(()=>{if(Ye)ve?nt(!1):(nt(!0),we(!0),Da(()=>{Da(()=>{nt(!1)})}));else{nt(!0);const T=Le(()=>we(!1),300);return()=>clearTimeout(T)}},[Ye]),y.useEffect(()=>{if(!ne)return;const T=$e.current;if(!T)return;const ae=()=>xt(Hg(T));ae(),T.addEventListener("scroll",ae,{passive:!0});const X=new ResizeObserver(ae);return X.observe(T),()=>{T.removeEventListener("scroll",ae),X.disconnect()}},[ne]),ne?o.jsxs("div",{className:`${V.palette} ${V[G]} ${c?"":V.light}`,"data-feedback-toolbar":!0,"data-agentation-palette":!0,onClick:T=>T.stopPropagation(),onMouseDown:T=>T.stopPropagation(),onTransitionEnd:T=>{T.target===T.currentTarget&&(f||(clearTimeout(at.current),U(!1),_e("exit"),b?.()))},children:[o.jsxs("div",{className:V.paletteHeader,children:[o.jsx("div",{className:V.paletteHeaderTitle,children:"Layout Mode"}),o.jsxs("div",{className:V.paletteHeaderDesc,children:["Rearrange and resize existing elements, add new components, and explore layout ideas. Agent results may vary."," ",o.jsx("a",{href:"https://agentation.dev/features#layout-mode",target:"_blank",rel:"noopener noreferrer",children:"Learn more."})]})]}),o.jsxs("div",{className:`${V.canvasToggle} ${E?V.active:""}`,onClick:()=>$(!E),children:[o.jsx("span",{className:V.canvasToggleIcon,children:o.jsxs("svg",{viewBox:"0 0 14 14",width:"14",height:"14",fill:"none",children:[o.jsx("rect",{x:"1",y:"1",width:"12",height:"12",rx:"2",stroke:"currentColor",strokeWidth:"1"}),o.jsx("circle",{cx:"4.5",cy:"4.5",r:"0.8",fill:"currentColor",opacity:".6"}),o.jsx("circle",{cx:"7",cy:"4.5",r:"0.8",fill:"currentColor",opacity:".6"}),o.jsx("circle",{cx:"9.5",cy:"4.5",r:"0.8",fill:"currentColor",opacity:".6"}),o.jsx("circle",{cx:"4.5",cy:"7",r:"0.8",fill:"currentColor",opacity:".6"}),o.jsx("circle",{cx:"7",cy:"7",r:"0.8",fill:"currentColor",opacity:".6"}),o.jsx("circle",{cx:"9.5",cy:"7",r:"0.8",fill:"currentColor",opacity:".6"}),o.jsx("circle",{cx:"4.5",cy:"9.5",r:"0.8",fill:"currentColor",opacity:".6"}),o.jsx("circle",{cx:"7",cy:"9.5",r:"0.8",fill:"currentColor",opacity:".6"}),o.jsx("circle",{cx:"9.5",cy:"9.5",r:"0.8",fill:"currentColor",opacity:".6"})]})}),o.jsx("span",{className:V.canvasToggleLabel,children:"Wireframe New Page"})]}),o.jsx("div",{className:`${V.wireframePurposeWrap} ${E?"":V.collapsed}`,children:o.jsx("div",{className:V.wireframePurposeInner,children:o.jsx("textarea",{className:V.wireframePurposeInput,placeholder:"Describe this page to provide additional context for your agent.",value:D,onChange:T=>ue(T.target.value),rows:2})})}),o.jsx(Yg,{activeType:s,onSelect:r,onDragStart:M,scrollRef:$e,fadeClass:tt,blankCanvas:E}),ve&&o.jsx("div",{className:`${V.paletteFooterWrap} ${_t?V.footerHidden:""}`,children:o.jsx("div",{className:V.paletteFooterInner,children:o.jsx("div",{className:V.paletteFooterInnerContent,children:o.jsxs("div",{className:V.paletteFooter,children:[o.jsx("span",{className:V.paletteFooterCount,children:o.jsx(Xg,{value:oe.current,suffix:ot.current})}),o.jsx("button",{className:V.paletteFooterClear,onClick:x,children:"Clear"})]})})})})]}):null}function Aa(s){if(s.parentElement)return s.parentElement;const r=s.getRootNode();return r instanceof ShadowRoot?r.host:null}function Xn(s,r){let c=s;for(;c;){if(c.matches(r))return c;c=Aa(c)}return null}function qg(s,r=4){const c=[];let u=s,_=0;for(;u&&_<r;){const f=u.tagName.toLowerCase();if(f==="html"||f==="body")break;let b=f;if(u.id)b=`#${u.id}`;else if(u.className&&typeof u.className=="string"){const x=u.className.split(/\s+/).find(M=>M.length>2&&!M.match(/^[a-z]{1,2}$/)&&!M.match(/[A-Z0-9]{5,}/));x&&(b=`.${x.split("_")[0]}`)}const R=Aa(u);!u.parentElement&&R&&(b=`⟨shadow⟩ ${b}`),c.unshift(b),u=R,_++}return c.join(" > ")}function Ba(s){const r=qg(s);if(s.dataset.element)return{name:s.dataset.element,path:r};const c=s.tagName.toLowerCase();if(["path","circle","rect","line","g"].includes(c)){const u=Xn(s,"svg");if(u){const _=Aa(u);if(_ instanceof HTMLElement)return{name:`graphic in ${Ba(_).name}`,path:r}}return{name:"graphic element",path:r}}if(c==="svg"){const u=Aa(s);if(u?.tagName.toLowerCase()==="button"){const _=u.textContent?.trim();return{name:_?`icon in "${_}" button`:"button icon",path:r}}return{name:"icon",path:r}}if(c==="button"){const u=s.textContent?.trim(),_=s.getAttribute("aria-label");return _?{name:`button [${_}]`,path:r}:{name:u?`button "${u.slice(0,25)}"`:"button",path:r}}if(c==="a"){const u=s.textContent?.trim(),_=s.getAttribute("href");return u?{name:`link "${u.slice(0,25)}"`,path:r}:_?{name:`link to ${_.slice(0,30)}`,path:r}:{name:"link",path:r}}if(c==="input"){const u=s.getAttribute("type")||"text",_=s.getAttribute("placeholder"),f=s.getAttribute("name");return _?{name:`input "${_}"`,path:r}:f?{name:`input [${f}]`,path:r}:{name:`${u} input`,path:r}}if(["h1","h2","h3","h4","h5","h6"].includes(c)){const u=s.textContent?.trim();return{name:u?`${c} "${u.slice(0,35)}"`:c,path:r}}if(c==="p"){const u=s.textContent?.trim();return u?{name:`paragraph: "${u.slice(0,40)}${u.length>40?"...":""}"`,path:r}:{name:"paragraph",path:r}}if(c==="span"||c==="label"){const u=s.textContent?.trim();return u&&u.length<40?{name:`"${u}"`,path:r}:{name:c,path:r}}if(c==="li"){const u=s.textContent?.trim();return u&&u.length<40?{name:`list item: "${u.slice(0,35)}"`,path:r}:{name:"list item",path:r}}if(c==="blockquote")return{name:"blockquote",path:r};if(c==="code"){const u=s.textContent?.trim();return u&&u.length<30?{name:`code: \`${u}\``,path:r}:{name:"code",path:r}}if(c==="pre")return{name:"code block",path:r};if(c==="img"){const u=s.getAttribute("alt");return{name:u?`image "${u.slice(0,30)}"`:"image",path:r}}if(c==="video")return{name:"video",path:r};if(["div","section","article","nav","header","footer","aside","main"].includes(c)){const u=s.className,_=s.getAttribute("role"),f=s.getAttribute("aria-label");if(f)return{name:`${c} [${f}]`,path:r};if(_)return{name:`${_}`,path:r};if(typeof u=="string"&&u){const b=u.split(/[\s_-]+/).map(R=>R.replace(/[A-Z0-9]{5,}.*$/,"")).filter(R=>R.length>2&&!/^[a-z]{1,2}$/.test(R)).slice(0,2);if(b.length>0)return{name:b.join(" "),path:r}}return{name:c==="div"?"container":c,path:r}}return{name:c,path:r}}function js(s){const r=[],c=s.textContent?.trim();c&&c.length<100&&r.push(c);const u=s.previousElementSibling;if(u){const f=u.textContent?.trim();f&&f.length<50&&r.unshift(`[before: "${f.slice(0,40)}"]`)}const _=s.nextElementSibling;if(_){const f=_.textContent?.trim();f&&f.length<50&&r.push(`[after: "${f.slice(0,40)}"]`)}return r.join(" ")}function Ti(s){const r=Aa(s);if(!r)return"";const _=(s.getRootNode()instanceof ShadowRoot&&s.parentElement?Array.from(s.parentElement.children):Array.from(r.children)).filter(E=>E!==s&&E instanceof HTMLElement);if(_.length===0)return"";const f=_.slice(0,4).map(E=>{const $=E.tagName.toLowerCase(),D=E.className;let ue="";if(typeof D=="string"&&D){const H=D.split(/\s+/).map(ne=>ne.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(ne=>ne.length>2&&!/^[a-z]{1,2}$/.test(ne));H&&(ue=`.${H}`)}if($==="button"||$==="a"){const H=E.textContent?.trim().slice(0,15);if(H)return`${$}${ue} "${H}"`}return`${$}${ue}`});let R=r.tagName.toLowerCase();if(typeof r.className=="string"&&r.className){const E=r.className.split(/\s+/).map($=>$.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find($=>$.length>2&&!/^[a-z]{1,2}$/.test($));E&&(R=`.${E}`)}const x=r.children.length,M=x>f.length+1?` (${x} total in ${R})`:"";return f.join(", ")+M}function Cs(s){const r=s.className;return typeof r!="string"||!r?"":r.split(/\s+/).filter(u=>u.length>0).map(u=>{const _=u.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);return _?_[1]:u}).filter((u,_,f)=>f.indexOf(u)===_).join(", ")}var Zd=new Set(["none","normal","auto","0px","rgba(0, 0, 0, 0)","transparent","static","visible"]),Qg=new Set(["p","span","h1","h2","h3","h4","h5","h6","label","li","td","th","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","a","time","cite","q"]),Wg=new Set(["input","textarea","select"]),Gg=new Set(["img","video","canvas","svg"]),Vg=new Set(["div","section","article","nav","header","footer","aside","main","ul","ol","form","fieldset"]);function zi(s){if(typeof window>"u")return{};const r=window.getComputedStyle(s),c={},u=s.tagName.toLowerCase();let _;Qg.has(u)?_=["color","fontSize","fontWeight","fontFamily","lineHeight"]:u==="button"||u==="a"&&s.getAttribute("role")==="button"?_=["backgroundColor","color","padding","borderRadius","fontSize"]:Wg.has(u)?_=["backgroundColor","color","padding","borderRadius","fontSize"]:Gg.has(u)?_=["width","height","objectFit","borderRadius"]:Vg.has(u)?_=["display","padding","margin","gap","backgroundColor"]:_=["color","fontSize","margin","padding","backgroundColor"];for(const f of _){const b=f.replace(/([A-Z])/g,"-$1").toLowerCase(),R=r.getPropertyValue(b);R&&!Zd.has(R)&&(c[f]=R)}return c}var Zg=["color","backgroundColor","borderColor","fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","textAlign","width","height","padding","margin","border","borderRadius","display","position","top","right","bottom","left","zIndex","flexDirection","justifyContent","alignItems","gap","opacity","visibility","overflow","boxShadow","transform"];function Ri(s){if(typeof window>"u")return"";const r=window.getComputedStyle(s),c=[];for(const u of Zg){const _=u.replace(/([A-Z])/g,"-$1").toLowerCase(),f=r.getPropertyValue(_);f&&!Zd.has(f)&&c.push(`${_}: ${f}`)}return c.join("; ")}function Kg(s){if(!s)return;const r={},c=s.split(";").map(u=>u.trim()).filter(Boolean);for(const u of c){const _=u.indexOf(":");if(_>0){const f=u.slice(0,_).trim(),b=u.slice(_+1).trim();f&&b&&(r[f]=b)}}return Object.keys(r).length>0?r:void 0}function Di(s){const r=[],c=s.getAttribute("role"),u=s.getAttribute("aria-label"),_=s.getAttribute("aria-describedby"),f=s.getAttribute("tabindex"),b=s.getAttribute("aria-hidden");return c&&r.push(`role="${c}"`),u&&r.push(`aria-label="${u}"`),_&&r.push(`aria-describedby="${_}"`),f&&r.push(`tabindex=${f}`),b==="true"&&r.push("aria-hidden"),s.matches("a, button, input, select, textarea, [tabindex]")&&r.push("focusable"),r.join(", ")}function Ni(s){const r=[];let c=s;for(;c&&c.tagName.toLowerCase()!=="html";){const u=c.tagName.toLowerCase();let _=u;if(c.id)_=`${u}#${c.id}`;else if(c.className&&typeof c.className=="string"){const b=c.className.split(/\s+/).map(R=>R.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(R=>R.length>2);b&&(_=`${u}.${b}`)}const f=Aa(c);!c.parentElement&&f&&(_=`⟨shadow⟩ ${_}`),r.unshift(_),c=f}return r.join(" > ")}var Fg=new Set(["nav","header","main","section","article","footer","aside"]),pc={banner:"Header",navigation:"Navigation",main:"Main Content",contentinfo:"Footer",complementary:"Sidebar",region:"Section"},Kd={nav:"Navigation",header:"Header",main:"Main Content",section:"Section",article:"Article",footer:"Footer",aside:"Sidebar"},Jg=new Set(["script","style","noscript","link","meta"]),Pg=40;function Fd(s){let r=s;for(;r&&r!==document.body&&r!==document.documentElement;){const c=window.getComputedStyle(r).position;if(c==="fixed"||c==="sticky")return!0;r=r.parentElement}return!1}function oa(s){const r=s.tagName.toLowerCase();if(["nav","header","footer","main"].includes(r)&&document.querySelectorAll(r).length===1)return r;if(s.id)return`#${CSS.escape(s.id)}`;if(s.className&&typeof s.className=="string"){const _=s.className.split(/\s+/).filter(f=>f.length>0).find(f=>f.length>2&&!/^[a-zA-Z0-9]{6,}$/.test(f)&&!/^[a-z]{1,2}$/.test(f));if(_){const f=`${r}.${CSS.escape(_)}`;if(document.querySelectorAll(f).length===1)return f}}const c=s.parentElement;if(c){const _=Array.from(c.children).indexOf(s)+1;return`${c===document.body?"body":oa(c)} > ${r}:nth-child(${_})`}return r}function Ai(s){const r=s.tagName.toLowerCase(),c=s.getAttribute("aria-label");if(c)return c;const u=s.getAttribute("role");if(u&&pc[u])return pc[u];if(Kd[r])return Kd[r];const _=s.querySelector("h1, h2, h3, h4, h5, h6");if(_){const b=_.textContent?.trim();if(b&&b.length<=50)return b;if(b)return b.slice(0,47)+"..."}const{name:f}=Ba(s);return f.charAt(0).toUpperCase()+f.slice(1)}function Jd(s){const r=s.className;return typeof r!="string"||!r?null:r.split(/\s+/).map(u=>u.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(u=>u.length>2&&!/^[a-z]{1,2}$/.test(u))||null}function Pd(s){const r=s.textContent?.trim();if(!r)return null;const c=r.replace(/\s+/g," ");return c.length<=30?c:c.slice(0,30)+"…"}function ey(){const s=document.querySelector("main")||document.body,r=Array.from(s.children);let c=r;s!==document.body&&r.length<3&&(c=Array.from(document.body.children));const u=[];return c.forEach((_,f)=>{if(!(_ instanceof HTMLElement))return;const b=_.tagName.toLowerCase();if(Jg.has(b)||_.hasAttribute("data-feedback-toolbar")||_.closest("[data-feedback-toolbar]"))return;const R=window.getComputedStyle(_);if(R.display==="none"||R.visibility==="hidden")return;const x=_.getBoundingClientRect();if(x.height<Pg)return;const M=Fg.has(b),E=_.getAttribute("role")&&pc[_.getAttribute("role")],$=b==="div"&&x.height>=60;if(!M&&!E&&!$)return;const D=window.scrollY,ue=Fd(_),H={x:x.x,y:ue?x.y:x.y+D,width:x.width,height:x.height};u.push({id:`rs-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,label:Ai(_),tagName:b,selector:oa(_),role:_.getAttribute("role"),className:Jd(_),textSnippet:Pd(_),originalRect:H,currentRect:{...H},originalIndex:f,isFixed:ue})}),u}function ty(s){const r=window.scrollY,c=s.getBoundingClientRect(),u=Fd(s),_={x:c.x,y:u?c.y:c.y+r,width:c.width,height:c.height},f=s.parentElement;let b=0;return f&&(b=Array.from(f.children).indexOf(s)),{id:`rs-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,label:Ai(s),tagName:s.tagName.toLowerCase(),selector:oa(s),role:s.getAttribute("role"),className:Jd(s),textSnippet:Pd(s),originalRect:_,currentRect:{..._},originalIndex:b,isFixed:u}}var e_={bg:"rgba(59, 130, 246, 0.08)",border:"rgba(59, 130, 246, 0.5)",pill:"#3b82f6"},t_=["nw","n","ne","e","se","s","sw","w"],Bi=24,n_=16,Oi=5;function l_(s,r,c,u){let _=1/0,f=1/0;const b=s.x,R=s.x+s.width,x=s.x+s.width/2,M=s.y,E=s.y+s.height,$=s.y+s.height/2,D=[];for(const oe of r)c.has(oe.id)||D.push(oe.currentRect);u&&D.push(...u);for(const oe of D){const ot=oe.x,rt=oe.x+oe.width,at=oe.x+oe.width/2,$e=oe.y,tt=oe.y+oe.height,xt=oe.y+oe.height/2;for(const Ye of[b,R,x])for(const Qe of[ot,rt,at]){const T=Qe-Ye;Math.abs(T)<Oi&&Math.abs(T)<Math.abs(_)&&(_=T)}for(const Ye of[M,E,$])for(const Qe of[$e,tt,xt]){const T=Qe-Ye;Math.abs(T)<Oi&&Math.abs(T)<Math.abs(f)&&(f=T)}}const ue=Math.abs(_)<Oi?_:0,H=Math.abs(f)<Oi?f:0,ne=[],U=new Set,G=b+ue,_e=R+ue,ve=x+ue,we=M+H,_t=E+H,nt=$+H;for(const oe of D){const ot=oe.x,rt=oe.x+oe.width,at=oe.x+oe.width/2,$e=oe.y,tt=oe.y+oe.height,xt=oe.y+oe.height/2;for(const Ye of[ot,at,rt])for(const Qe of[G,ve,_e])if(Math.abs(Qe-Ye)<.5){const T=`x:${Math.round(Ye)}`;U.has(T)||(U.add(T),ne.push({axis:"x",pos:Ye}))}for(const Ye of[$e,xt,tt])for(const Qe of[we,nt,_t])if(Math.abs(Qe-Ye)<.5){const T=`y:${Math.round(Ye)}`;U.has(T)||(U.add(T),ne.push({axis:"y",pos:Ye}))}}return{dx:ue,dy:H,guides:ne}}var ny=new Set(["script","style","noscript","link","meta","br","hr"]);function o_(s){let r=s;for(;r&&r!==document.body&&r!==document.documentElement;){if(r.closest("[data-feedback-toolbar]"))return null;if(ny.has(r.tagName.toLowerCase())){r=r.parentElement;continue}const c=r.getBoundingClientRect();if(c.width>=n_&&c.height>=n_)return r;r=r.parentElement}return null}function ly({rearrangeState:s,onChange:r,isDarkMode:c,exiting:u,className:_,blankCanvas:f,extraSnapRects:b,onSelectionChange:R,deselectSignal:x,onDragMove:M,onDragEnd:E,clearSignal:$}){const{sections:D}=s,ue=y.useRef(s);ue.current=s;const[H,ne]=y.useState(new Set),[U,G]=y.useState(!1),_e=y.useRef($);y.useEffect(()=>{$!==void 0&&$!==_e.current&&(_e.current=$,D.length>0&&G(!0))},[$,D.length]);const ve=y.useRef(x);y.useEffect(()=>{x!==ve.current&&(ve.current=x,ne(new Set))},[x]);const[we,_t]=y.useState(null),[nt,oe]=y.useState(!1),ot=y.useRef(!1),rt=y.useCallback(N=>{const O=D.find(F=>F.id===N);O&&(ot.current=!!O.note,_t(N),oe(!1))},[D]),at=y.useCallback(()=>{we&&(oe(!0),Le(()=>{_t(null),oe(!1)},150))},[we]),$e=y.useCallback(N=>{we&&(r({...s,sections:D.map(O=>O.id===we?{...O,note:N.trim()||void 0}:O)}),at())},[we,D,s,r,at]);y.useEffect(()=>{u&&we&&at()},[u]);const[tt,xt]=y.useState(new Set),Ye=y.useRef(new Map),[Qe,T]=y.useState(null),[ae,X]=y.useState(null),[de,je]=y.useState([]),[w,I]=y.useState(0),ie=y.useRef(null),fe=y.useRef(new Set),Ne=y.useRef(new Map),[Ze,st]=y.useState(new Map),[Zt,Nt]=y.useState(new Map),Zn=y.useRef(new Set),Sn=y.useRef(new Map),kn=y.useRef(R);kn.current=R;const In=y.useRef(M);In.current=M;const bn=y.useRef(E);bn.current=E,y.useEffect(()=>{f&&ne(new Set)},[f]);const[gl,al]=y.useState(()=>!s.sections.some(N=>{const O=N.originalRect,F=N.currentRect;return Math.abs(O.x-F.x)>1||Math.abs(O.y-F.y)>1||Math.abs(O.width-F.width)>1||Math.abs(O.height-F.height)>1}));y.useEffect(()=>{if(!gl){const N=Le(()=>al(!0),380);return()=>clearTimeout(N)}},[]);const Ul=y.useRef(new Set);y.useEffect(()=>{Ul.current=new Set(D.map(N=>N.selector))},[D]),y.useEffect(()=>{const N=()=>I(window.scrollY);return N(),window.addEventListener("scroll",N,{passive:!0}),window.addEventListener("resize",N,{passive:!0}),()=>{window.removeEventListener("scroll",N),window.removeEventListener("resize",N)}},[]),y.useEffect(()=>{const N=O=>{if(ie.current){T(null);return}const F=document.elementFromPoint(O.clientX,O.clientY);if(!F){T(null);return}if(F.closest("[data-feedback-toolbar]")){T(null);return}if(F.closest("[data-design-placement]")){T(null);return}if(F.closest("[data-annotation-popup]")){T(null);return}const ee=o_(F);if(!ee){T(null);return}for(const se of Ul.current)try{const le=document.querySelector(se);if(le&&(le===ee||ee.contains(le))){T(null);return}}catch{}const pe=ee.getBoundingClientRect();T({x:pe.x,y:pe.y,w:pe.width,h:pe.height})};return document.addEventListener("mousemove",N,{passive:!0}),()=>document.removeEventListener("mousemove",N)},[D]),y.useEffect(()=>{const N=document.body.style.userSelect;return document.body.style.userSelect="none",()=>{document.body.style.userSelect=N}},[]),y.useEffect(()=>{const N=O=>{if(ie.current||O.button!==0)return;const F=O.target;if(!F||F.closest("[data-feedback-toolbar]")||F.closest("[data-design-placement]")||F.closest("[data-annotation-popup]"))return;const ee=o_(F);let pe=!1;if(ee)for(const le of Ul.current)try{const Re=document.querySelector(le);if(Re&&(Re===ee||ee.contains(Re))){pe=!0;break}}catch{}const se=!!(O.shiftKey||O.metaKey||O.ctrlKey);if(ee&&!pe){O.preventDefault(),O.stopPropagation();const le=ty(ee),Re=[...D,le],Ve=[...s.originalOrder,le.id];r({...s,sections:Re,originalOrder:Ve});const gt=new Set([le.id]);ne(gt),kn.current?.(gt,se),T(null);const Mt=O.clientX,Se=O.clientY,ft={x:le.currentRect.x,y:le.currentRect.y};le.originalRect;let ut=!1,Fe=0,xe=0;ie.current="move";const bt=Be=>{const St=Be.clientX-Mt,Pe=Be.clientY-Se;if(!ut&&(Math.abs(St)>2||Math.abs(Pe)>2)&&(ut=!0),!ut)return;const Kn={x:ft.x+St,y:ft.y+Pe,width:le.currentRect.width,height:le.currentRect.height},En=l_(Kn,Re,new Set([le.id]),b);je(En.guides);const Bn=St+En.dx,sl=Pe+En.dy;Fe=Bn,xe=sl;const On=document.querySelector(`[data-rearrange-section="${le.id}"]`);On&&(On.style.transform=`translate(${Bn}px, ${sl}px)`),st(new Map([[le.id,{x:ft.x+Bn,y:ft.y+sl,width:le.currentRect.width,height:le.currentRect.height}]])),In.current?.(Bn,sl)},Je=()=>{window.removeEventListener("mousemove",bt),window.removeEventListener("mouseup",Je),ie.current=null,je([]),st(new Map);const Be=document.querySelector(`[data-rearrange-section="${le.id}"]`);Be&&(Be.style.transform=""),ut&&r({...s,sections:Re.map(St=>St.id===le.id?{...St,currentRect:{...St.currentRect,x:Math.max(0,ft.x+Fe),y:Math.max(0,ft.y+xe)}}:St),originalOrder:Ve}),bn.current?.(Fe,xe,ut)};window.addEventListener("mousemove",bt),window.addEventListener("mouseup",Je)}else if(pe&&ee){O.preventDefault();for(const le of D)try{const Re=document.querySelector(le.selector);if(Re&&Re===ee){const Ve=new Set([le.id]);ne(Ve),kn.current?.(Ve,se);return}}catch{}se||(ne(new Set),kn.current?.(new Set,!1))}else se||(ne(new Set),kn.current?.(new Set,!1))};return document.addEventListener("mousedown",N,!0),()=>document.removeEventListener("mousedown",N,!0)},[D,s,r]),y.useEffect(()=>{const N=O=>{const F=O.target;if(!(F.tagName==="INPUT"||F.tagName==="TEXTAREA"||F.isContentEditable)){if((O.key==="Backspace"||O.key==="Delete")&&H.size>0){O.preventDefault();const ee=new Set(H);xt(pe=>{const se=new Set(pe);for(const le of ee)se.add(le);return se}),ne(new Set),Le(()=>{const pe=ue.current;r({...pe,sections:pe.sections.filter(se=>!ee.has(se.id)),originalOrder:pe.originalOrder.filter(se=>!ee.has(se))}),xt(se=>{const le=new Set(se);for(const Re of ee)le.delete(Re);return le})},180);return}if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(O.key)&&H.size>0){O.preventDefault();const ee=O.shiftKey?20:1,pe=O.key==="ArrowLeft"?-ee:O.key==="ArrowRight"?ee:0,se=O.key==="ArrowUp"?-ee:O.key==="ArrowDown"?ee:0;r({...s,sections:D.map(le=>H.has(le.id)?{...le,currentRect:{...le.currentRect,x:Math.max(0,le.currentRect.x+pe),y:Math.max(0,le.currentRect.y+se)}}:le)});return}O.key==="Escape"&&H.size>0&&ne(new Set)}};return document.addEventListener("keydown",N),()=>document.removeEventListener("keydown",N)},[H,D,s,r]);const Z=y.useCallback((N,O)=>{if(N.button!==0)return;const F=N.target;if(F.closest(`.${V.handle}`)||F.closest(`.${V.deleteButton}`))return;N.preventDefault(),N.stopPropagation();let ee;N.shiftKey||N.metaKey||N.ctrlKey?(ee=new Set(H),ee.has(O)?ee.delete(O):ee.add(O)):H.has(O)?ee=new Set(H):ee=new Set([O]),ne(ee),(ee.size!==H.size||[...ee].some(Fe=>!H.has(Fe)))&&kn.current?.(ee,!!(N.shiftKey||N.metaKey||N.ctrlKey));const se=N.clientX,le=N.clientY,Re=new Map;for(const Fe of D)ee.has(Fe.id)&&Re.set(Fe.id,{x:Fe.currentRect.x,y:Fe.currentRect.y});ie.current="move";let Ve=!1,gt=0,Mt=0;const Se=new Map;for(const Fe of D)if(ee.has(Fe.id)){const xe=document.querySelector(`[data-rearrange-section="${Fe.id}"]`);Se.set(Fe.id,{outlineEl:xe,curW:Fe.currentRect.width,curH:Fe.currentRect.height})}const ft=Fe=>{const xe=Fe.clientX-se,bt=Fe.clientY-le;if(xe===0&&bt===0)return;Ve=!0;let Je=1/0,Be=1/0,St=-1/0,Pe=-1/0;for(const[On,{curW:Yl,curH:ra}]of Se){const en=Re.get(On);if(!en)continue;const jn=en.x+xe,an=en.y+bt;Je=Math.min(Je,jn),Be=Math.min(Be,an),St=Math.max(St,jn+Yl),Pe=Math.max(Pe,an+ra)}const Kn=l_({x:Je,y:Be,width:St-Je,height:Pe-Be},D,ee,b),En=xe+Kn.dx,Bn=bt+Kn.dy;gt=En,Mt=Bn,je(Kn.guides);for(const[,{outlineEl:On}]of Se)On&&(On.style.transform=`translate(${En}px, ${Bn}px)`);const sl=new Map;for(const[On,{curW:Yl,curH:ra}]of Se){const en=Re.get(On);if(en){const jn={x:Math.max(0,en.x+En),y:Math.max(0,en.y+Bn),width:Yl,height:ra};sl.set(On,jn)}}st(sl),In.current?.(En,Bn)},ut=Fe=>{window.removeEventListener("mousemove",ft),window.removeEventListener("mouseup",ut),ie.current=null,je([]),st(new Map);for(const[,{outlineEl:xe}]of Se)xe&&(xe.style.transform="");if(Ve){const xe=Fe.clientX-se,bt=Fe.clientY-le;if(Math.abs(xe)<5&&Math.abs(bt)<5)r({...s,sections:D.map(Je=>{const Be=Re.get(Je.id);return Be?{...Je,currentRect:{...Je.currentRect,x:Be.x,y:Be.y}}:Je})});else{r({...s,sections:D.map(Je=>{const Be=Re.get(Je.id);return Be?{...Je,currentRect:{...Je.currentRect,x:Math.max(0,Be.x+gt),y:Math.max(0,Be.y+Mt)}}:Je})}),bn.current?.(gt,Mt,!0);return}}bn.current?.(0,0,!1)};window.addEventListener("mousemove",ft),window.addEventListener("mouseup",ut)},[H,D,s,r]),Ce=y.useCallback((N,O,F)=>{N.preventDefault(),N.stopPropagation();const ee=D.find(ft=>ft.id===O);if(!ee)return;ne(new Set([O])),ie.current="resize";const pe=N.clientX,se=N.clientY,le={...ee.currentRect};ee.originalRect;const Re=le.width/le.height;let Ve={...le};const gt=document.querySelector(`[data-rearrange-section="${O}"]`),Mt=ft=>{const ut=ft.clientX-pe,Fe=ft.clientY-se;let xe=le.x,bt=le.y,Je=le.width,Be=le.height;if(F.includes("e")&&(Je=Math.max(Bi,le.width+ut)),F.includes("w")&&(Je=Math.max(Bi,le.width-ut),xe=le.x+le.width-Je),F.includes("s")&&(Be=Math.max(Bi,le.height+Fe)),F.includes("n")&&(Be=Math.max(Bi,le.height-Fe),bt=le.y+le.height-Be),ft.shiftKey)if(F.length===2){const Pe=Math.abs(Je-le.width),Kn=Math.abs(Be-le.height);Pe>Kn?Be=Je/Re:Je=Be*Re,F.includes("w")&&(xe=le.x+le.width-Je),F.includes("n")&&(bt=le.y+le.height-Be)}else F==="e"||F==="w"?Be=Je/Re:Je=Be*Re,F==="w"&&(xe=le.x+le.width-Je),F==="n"&&(bt=le.y+le.height-Be);Ve={x:xe,y:bt,width:Je,height:Be},gt&&(gt.style.left=`${xe}px`,gt.style.top=`${bt-w}px`,gt.style.width=`${Je}px`,gt.style.height=`${Be}px`),X({x:ft.clientX+12,y:ft.clientY+12,text:`${Math.round(Je)} × ${Math.round(Be)}`}),st(new Map([[O,Ve]]))},Se=()=>{window.removeEventListener("mousemove",Mt),window.removeEventListener("mouseup",Se),X(null),ie.current=null,st(new Map),r({...s,sections:D.map(ft=>ft.id===O?{...ft,currentRect:Ve}:ft)})};window.addEventListener("mousemove",Mt),window.addEventListener("mouseup",Se)},[D,s,r,w]),We=y.useCallback(N=>{xt(O=>{const F=new Set(O);return F.add(N),F}),ne(O=>{const F=new Set(O);return F.delete(N),F}),Le(()=>{const O=ue.current;r({...O,sections:O.sections.filter(F=>F.id!==N),originalOrder:O.originalOrder.filter(F=>F!==N)}),xt(F=>{const ee=new Set(F);return ee.delete(N),ee})},180)},[r]),He=N=>{const O=N.originalRect,F=N.currentRect;return Math.abs(O.x-F.x)>1||Math.abs(O.y-F.y)>1||Math.abs(O.width-F.width)>1||Math.abs(O.height-F.height)>1},Ke=N=>{const O=N.originalRect,F=N.currentRect;return Math.abs(O.x-F.x)>1||Math.abs(O.y-F.y)>1},jt=N=>{const O=N.originalRect,F=N.currentRect;return Math.abs(O.width-F.width)>1||Math.abs(O.height-F.height)>1};for(const N of D)Ne.current.has(N.id)||(Ke(N)?Ne.current.set(N.id,"move"):jt(N)&&Ne.current.set(N.id,"resize"));for(const N of Ne.current.keys())D.some(O=>O.id===N)||Ne.current.delete(N);const Ge=D.filter(N=>{try{if(tt.has(N.id)||H.has(N.id))return!0;const O=document.querySelector(N.selector);if(!O)return!1;const F=O.getBoundingClientRect(),ee=N.originalRect;return Math.abs(F.width-ee.width)+Math.abs(F.height-ee.height)<200}catch{return!1}}),lt=Ge.filter(N=>He(N)),Ct=Ge.filter(N=>!He(N)),Qt=new Set(lt.map(N=>N.id));for(const N of fe.current)Qt.has(N)||fe.current.delete(N);const Te=[...Qt].sort().join(",");for(const N of lt)Sn.current.set(N.id,{currentRect:N.currentRect,originalRect:N.originalRect,isFixed:N.isFixed});return y.useEffect(()=>{const N=Zn.current;Zn.current=Qt;const O=new Map;for(const F of N)if(!Qt.has(F)){if(!D.some(pe=>pe.id===F))continue;const ee=Sn.current.get(F);ee&&(O.set(F,{orig:ee.originalRect,target:ee.currentRect,isFixed:ee.isFixed}),Sn.current.delete(F))}if(O.size>0){Nt(ee=>{const pe=new Map(ee);for(const[se,le]of O)pe.set(se,le);return pe});const F=Le(()=>{Nt(ee=>{const pe=new Map(ee);for(const se of O.keys())pe.delete(se);return pe})},250);return()=>clearTimeout(F)}},[Te,D]),o.jsxs(o.Fragment,{children:[o.jsxs("div",{className:`${V.rearrangeOverlay} ${c?"":V.light} ${u?V.overlayExiting:""}${_?` ${_}`:""}`,"data-feedback-toolbar":!0,children:[Qe&&o.jsx("div",{className:V.hoverHighlight,style:{left:Qe.x,top:Qe.y,width:Qe.w,height:Qe.h}}),Ct.map(N=>{const O=N.currentRect,F=N.isFixed?O.y:O.y-w,ee=e_,pe=H.has(N.id);return o.jsxs("div",{"data-rearrange-section":N.id,className:`${V.sectionOutline} ${pe?V.selected:""} ${U||u||tt.has(N.id)?V.exiting:""}`,style:{left:O.x,top:F,width:O.width,height:O.height,borderColor:ee.border,backgroundColor:ee.bg,...gl?{}:{opacity:0,animation:"none",transition:"none"}},onMouseDown:se=>Z(se,N.id),onDoubleClick:()=>rt(N.id),children:[o.jsx("span",{className:V.sectionLabel,style:{backgroundColor:ee.pill},children:N.label}),o.jsx("span",{className:`${V.sectionAnnotation} ${N.note?V.annotationVisible:""}`,children:(N.note&&Ye.current.set(N.id,N.note),N.note||Ye.current.get(N.id)||"")}),o.jsxs("span",{className:V.sectionDimensions,children:[Math.round(O.width)," × ",Math.round(O.height)]}),o.jsx("div",{className:V.deleteButton,onMouseDown:se=>se.stopPropagation(),onClick:()=>We(N.id),children:"✕"}),t_.map(se=>o.jsx("div",{className:`${V.handle} ${V[`handle${se.charAt(0).toUpperCase()}${se.slice(1)}`]}`,onMouseDown:le=>Ce(le,N.id,se)},se))]},N.id)}),lt.map(N=>{const O=N.currentRect,F=N.isFixed?O.y:O.y-w,ee=H.has(N.id),pe=Ke(N),se=jt(N);if(f&&!ee)return null;const Re=!fe.current.has(N.id);return Re&&fe.current.add(N.id),o.jsxs("div",{"data-rearrange-section":N.id,className:`${V.ghostOutline} ${ee?V.selected:""} ${U||u||tt.has(N.id)?V.exiting:""}`,style:{left:O.x,top:F,width:O.width,height:O.height,...gl?{}:{opacity:0,animation:"none",transition:"none"},...Re?{}:{animation:"none"}},onMouseDown:Ve=>Z(Ve,N.id),onDoubleClick:()=>rt(N.id),children:[o.jsx("span",{className:V.sectionLabel,style:{backgroundColor:e_.pill},children:N.label}),o.jsx("span",{className:`${V.sectionAnnotation} ${N.note?V.annotationVisible:""}`,children:(N.note&&Ye.current.set(N.id,N.note),N.note||Ye.current.get(N.id)||"")}),o.jsxs("span",{className:V.sectionDimensions,children:[Math.round(O.width)," × ",Math.round(O.height)]}),o.jsx("div",{className:V.deleteButton,onMouseDown:Ve=>Ve.stopPropagation(),onClick:()=>We(N.id),children:"✕"}),t_.map(Ve=>o.jsx("div",{className:`${V.handle} ${V[`handle${Ve.charAt(0).toUpperCase()}${Ve.slice(1)}`]}`,onMouseDown:gt=>Ce(gt,N.id,Ve)},Ve)),o.jsx("span",{className:V.ghostBadge,children:(()=>{const Ve=Ne.current.get(N.id);if(pe&&se){const[gt,Mt]=Ve==="resize"?["Resize","Move"]:["Move","Resize"];return o.jsxs(o.Fragment,{children:["Suggested ",gt," ",o.jsxs("span",{className:V.ghostBadgeExtra,children:["& ",Mt]})]})}return`Suggested ${se?"Resize":"Move"}`})()})]},N.id)})]}),!f&&(()=>{const N=[];for(const O of lt){const F=Ze.get(O.id);N.push({id:O.id,orig:O.originalRect,target:F||O.currentRect,isFixed:O.isFixed,isSelected:H.has(O.id),isExiting:tt.has(O.id)})}for(const[O,F]of Ze)if(!N.some(ee=>ee.id===O)){const ee=D.find(pe=>pe.id===O);ee&&N.push({id:O,orig:ee.originalRect,target:F,isFixed:ee.isFixed,isSelected:H.has(O)})}for(const[O,F]of Zt)N.some(ee=>ee.id===O)||N.push({id:O,orig:F.orig,target:F.target,isFixed:F.isFixed,isSelected:!1,isExiting:!0});return N.length===0?null:o.jsxs("svg",{className:`${V.connectorSvg} ${U||u?V.connectorExiting:""}`,children:[N.map(({id:O,orig:F,target:ee,isFixed:pe,isSelected:se,isExiting:le})=>{const Re=F.x+F.width/2,Ve=(pe?F.y:F.y-w)+F.height/2,gt=ee.x+ee.width/2,Mt=(pe?ee.y:ee.y-w)+ee.height/2,Se=gt-Re,ft=Mt-Ve,ut=Math.sqrt(Se*Se+ft*ft);if(ut<2)return null;const Fe=Math.min(1,ut/40),xe=Math.min(ut*.3,60),bt=ut>0?-ft/ut:0,Je=ut>0?Se/ut:0,Be=(Re+gt)/2+bt*xe,St=(Ve+Mt)/2+Je*xe,Pe=Ze.has(O),Kn=Pe||se?1:.4,En=Pe||se?1:.5;return o.jsxs("g",{className:le?V.connectorExiting:"",children:[o.jsx("path",{className:V.connectorLine,d:`M ${Re} ${Ve} Q ${Be} ${St} ${gt} ${Mt}`,fill:"none",stroke:"rgba(59, 130, 246, 0.45)",strokeWidth:"1.5",opacity:Kn*Fe}),o.jsx("circle",{className:V.connectorDot,cx:Re,cy:Ve,r:4*Fe,fill:"rgba(59, 130, 246, 0.8)",stroke:"#fff",strokeWidth:"1.5",opacity:En*Fe,filter:"url(#connDotShadow)"}),o.jsx("circle",{className:V.connectorDot,cx:gt,cy:Mt,r:4*Fe,fill:"rgba(59, 130, 246, 0.8)",stroke:"#fff",strokeWidth:"1.5",opacity:En*Fe,filter:"url(#connDotShadow)"})]},`conn-${O}`)}),o.jsx("defs",{children:o.jsx("filter",{id:"connDotShadow",x:"-50%",y:"-50%",width:"200%",height:"200%",children:o.jsx("feDropShadow",{dx:"0",dy:"0.5",stdDeviation:"1",floodOpacity:"0.15"})})})]})})(),we&&(()=>{const N=D.find(Mt=>Mt.id===we);if(!N)return null;const O=N.currentRect,F=N.isFixed?O.y:O.y-w,ee=O.x+O.width/2,pe=F-8,se=F+O.height+8,le=pe>200,Re=se<window.innerHeight-100,Ve=Math.max(160,Math.min(window.innerWidth-160,ee));let gt;return le?gt={left:Ve,bottom:window.innerHeight-pe}:Re?gt={left:Ve,top:se}:gt={left:Ve,top:Math.max(80,window.innerHeight/2-80)},o.jsx(Mi,{element:N.label,placeholder:"Add a note about this section",initialValue:N.note??"",submitLabel:ot.current?"Save":"Set",onSubmit:$e,onCancel:at,onDelete:ot.current?()=>{$e("")}:void 0,isExiting:nt,lightMode:!c,style:gt})})(),ae&&o.jsx("div",{className:V.sizeIndicator,style:{left:ae.x,top:ae.y},"data-feedback-toolbar":!0,children:ae.text}),de.map((N,O)=>o.jsx("div",{className:V.guideLine,style:N.axis==="x"?{position:"fixed",left:N.pos,top:0,width:1,height:"100vh"}:{position:"fixed",left:0,top:N.pos-w,width:"100vw",height:1}},`${N.axis}-${N.pos}-${O}`))]})}var xc=new Set(["script","style","noscript","link","meta","br","hr"]);function oy(){const s=document.querySelector("main")||document.body,r=[],c=Array.from(s.children),u=s!==document.body&&c.length<3?Array.from(document.body.children):c;for(const _ of u){if(!(_ instanceof HTMLElement)||xc.has(_.tagName.toLowerCase())||_.hasAttribute("data-feedback-toolbar"))continue;const f=window.getComputedStyle(_);if(f.display==="none"||f.visibility==="hidden")continue;const b=_.getBoundingClientRect();if(!(b.height<10||b.width<10)){r.push({label:Ai(_),selector:oa(_),top:b.top,bottom:b.bottom,left:b.left,right:b.right,area:b.width*b.height});for(const R of Array.from(_.children)){if(!(R instanceof HTMLElement)||xc.has(R.tagName.toLowerCase())||R.hasAttribute("data-feedback-toolbar"))continue;const x=window.getComputedStyle(R);if(x.display==="none"||x.visibility==="hidden")continue;const M=R.getBoundingClientRect();M.height<10||M.width<10||r.push({label:Ai(R),selector:oa(R),top:M.top,bottom:M.bottom,left:M.left,right:M.right,area:M.width*M.height})}}}return r}function ay(s){const r=window.scrollY;return s.map(({label:c,selector:u,rect:_})=>{const f=_.y-r;return{label:c,selector:u,top:f,bottom:f+_.height,left:_.x,right:_.x+_.width,area:_.width*_.height}})}function sy(s){const r=window.scrollY,c=s.y-r,u=s.x;return{top:c,bottom:c+s.height,left:u,right:u+s.width,area:s.width*s.height}}function bc(s,r){const c=r?ay(r):oy(),u=sy(s);let _=null,f=null,b=null,R=null,x=null;for(const H of c){if(Math.abs(H.left-u.left)<2&&Math.abs(H.top-u.top)<2&&Math.abs(H.right-H.left-s.width)<2&&Math.abs(H.bottom-H.top-s.height)<2)continue;H.left<=u.left+2&&H.right>=u.right-2&&H.top<=u.top+2&&H.bottom>=u.bottom-2&&H.area>u.area*1.5&&(!x||H.area<x._area)&&(x={label:H.label,selector:H.selector,_area:H.area});const ne=u.right>H.left+5&&u.left<H.right-5,U=u.bottom>H.top+5&&u.top<H.bottom-5;if(ne&&H.bottom<=u.top+5){const G=Math.round(u.top-H.bottom);(!_||G<_._dist)&&(_={label:H.label,selector:H.selector,gap:Math.max(0,G),_dist:G})}if(ne&&H.top>=u.bottom-5){const G=Math.round(H.top-u.bottom);(!f||G<f._dist)&&(f={label:H.label,selector:H.selector,gap:Math.max(0,G),_dist:G})}if(U&&H.right<=u.left+5){const G=Math.round(u.left-H.right);(!b||G<b._dist)&&(b={label:H.label,selector:H.selector,gap:Math.max(0,G),_dist:G})}if(U&&H.left>=u.right-5){const G=Math.round(H.left-u.right);(!R||G<R._dist)&&(R={label:H.label,selector:H.selector,gap:Math.max(0,G),_dist:G})}}const M=window.innerWidth,E=window.innerHeight,$=ry(s,M),D=H=>H?{label:H.label,selector:H.selector,gap:H.gap}:null,ue=iy(u,s,M,E,x?{label:x.label,selector:x.selector,_area:x._area}:null,c);return{above:D(_),below:D(f),left:D(b),right:D(R),alignment:$,containedIn:x?{label:x.label,selector:x.selector}:null,outOfBounds:ue}}function iy(s,r,c,u,_,f){const b={};let R=!1;const x=[];if(s.left<-2&&x.push("left"),s.right>c+2&&x.push("right"),s.top<-2&&x.push("top"),s.bottom>u+2&&x.push("bottom"),x.length>0&&(b.viewport=x,R=!0),_){const M=f.find(E=>E.label===_.label&&E.selector===_.selector&&Math.abs(E.area-_._area)<10);if(M){const E=[];s.left<M.left-2&&E.push("left"),s.right>M.right+2&&E.push("right"),s.top<M.top-2&&E.push("top"),s.bottom>M.bottom+2&&E.push("bottom"),E.length>0&&(b.container={label:_.label,edges:E},R=!0)}}return R?b:null}function ry(s,r){if(s.width/r>.85)return"full-width";const u=s.x+s.width/2,_=r/2,f=u-_,b=r*.08;return Math.abs(f)<b?"center":f<0?"left":"right"}function a_(s){switch(s){case"full-width":return"full-width";case"center":return"centered";case"left":return"left-aligned";case"right":return"right-aligned"}}function s_(s,r={}){const c=[];s.above&&c.push(`Below \`${s.above.label}\`${s.above.gap>0?` (${s.above.gap}px gap)`:""}`),s.below&&c.push(`Above \`${s.below.label}\`${s.below.gap>0?` (${s.below.gap}px gap)`:""}`),r.includeLeftRight&&(s.left&&c.push(`Right of \`${s.left.label}\`${s.left.gap>0?` (${s.left.gap}px gap)`:""}`),s.right&&c.push(`Left of \`${s.right.label}\`${s.right.gap>0?` (${s.right.gap}px gap)`:""}`));const u=a_(s.alignment);return s.containedIn?c.push(`${u.charAt(0).toUpperCase()+u.slice(1)} in \`${s.containedIn.label}\``):c.push(`${u.charAt(0).toUpperCase()+u.slice(1)} in page`),r.includePixelRef&&r.pixelRef&&c.push(`Pixel ref: \`${r.pixelRef}\``),s.outOfBounds&&(s.outOfBounds.viewport&&c.push(`**Outside viewport** (${s.outOfBounds.viewport.join(", ")} edge${s.outOfBounds.viewport.length>1?"s":""})`),s.outOfBounds.container&&c.push(`**Outside \`${s.outOfBounds.container.label}\`** (${s.outOfBounds.container.edges.join(", ")} edge${s.outOfBounds.container.edges.length>1?"s":""})`)),c}function cy(s,r,c){const u=[];s.above&&u.push(`below \`${s.above.label}\``),s.below&&u.push(`above \`${s.below.label}\``),s.left&&u.push(`right of \`${s.left.label}\``),s.right&&u.push(`left of \`${s.right.label}\``),s.containedIn&&u.push(`inside \`${s.containedIn.label}\``),u.push(a_(s.alignment)),s.outOfBounds?.viewport&&u.push(`**outside viewport** (${s.outOfBounds.viewport.join(", ")})`),s.outOfBounds?.container&&u.push(`**outside \`${s.outOfBounds.container.label}\`** (${s.outOfBounds.container.edges.join(", ")})`);const _=c?`, ${Math.round(c.width)}×${Math.round(c.height)}px`:"";return`at (${Math.round(r.x)}, ${Math.round(r.y)})${_}: ${u.join(", ")}`}var i_=15;function r_(s){if(s.length<2)return[];const r=[],c=new Set;for(let u=0;u<s.length;u++){if(c.has(u))continue;const _=[u];for(let f=u+1;f<s.length;f++)c.has(f)||Math.abs(s[u].rect.y-s[f].rect.y)<i_&&_.push(f);if(_.length>=2){const f=_.map(x=>s[x]);f.sort((x,M)=>x.rect.x-M.rect.x);const b=[];for(let x=0;x<f.length-1;x++)b.push(Math.round(f[x+1].rect.x-(f[x].rect.x+f[x].rect.width)));const R=Math.round(f.reduce((x,M)=>x+M.rect.y,0)/f.length);r.push({labels:f.map(x=>x.label),type:"row",sharedEdge:R,gaps:b,avgGap:b.length?Math.round(b.reduce((x,M)=>x+M,0)/b.length):0}),_.forEach(x=>c.add(x))}}for(let u=0;u<s.length;u++){if(c.has(u))continue;const _=[u];for(let f=u+1;f<s.length;f++)c.has(f)||Math.abs(s[u].rect.x-s[f].rect.x)<i_&&_.push(f);if(_.length>=2){const f=_.map(x=>s[x]);f.sort((x,M)=>x.rect.y-M.rect.y);const b=[];for(let x=0;x<f.length-1;x++)b.push(Math.round(f[x+1].rect.y-(f[x].rect.y+f[x].rect.height)));const R=Math.round(f.reduce((x,M)=>x+M.rect.x,0)/f.length);r.push({labels:f.map(x=>x.label),type:"column",sharedEdge:R,gaps:b,avgGap:b.length?Math.round(b.reduce((x,M)=>x+M,0)/b.length):0}),_.forEach(x=>c.add(x))}}return r}function uy(s){if(s.length<2)return[];const r=r_(s.map(b=>({label:b.label,rect:b.originalRect}))),c=r_(s.map(b=>({label:b.label,rect:b.currentRect}))),u=[],_=new Set;for(const b of r){const R=new Set(b.labels);let x=null,M=0;for(const E of c){const $=E.labels.filter(D=>R.has(D)).length;$>=2&&$>M&&(x=E,M=$)}if(x){const E=x.labels.filter(D=>R.has(D)),$=E.join(", ");if(x.type!==b.type){const D=b.type==="row"?"y":"x",ue=x.type==="row"?"y":"x";u.push(`**${$}**: ${b.type} (${D}≈${b.sharedEdge}, ${b.avgGap}px gaps) → ${x.type} (${ue}≈${x.sharedEdge}, ${x.avgGap}px gaps)`)}else if(Math.abs(b.sharedEdge-x.sharedEdge)>20||Math.abs(b.avgGap-x.avgGap)>5){const D=b.type==="row"?"y":"x",ue=Math.abs(b.sharedEdge-x.sharedEdge)>20?` ${D}: ${b.sharedEdge} → ${x.sharedEdge}`:"",H=Math.abs(b.avgGap-x.avgGap)>5?` gaps: ${b.avgGap}px → ${x.avgGap}px`:"";u.push(`**${$}**: ${b.type} shifted —${ue}${H}`)}E.forEach(D=>_.add(D))}else{const E=b.labels.join(", "),$=b.type==="row"?"y":"x";u.push(`**${E}**: ${b.type} (${$}≈${b.sharedEdge}) dissolved`),b.labels.forEach(D=>_.add(D))}}for(const b of c){if(b.labels.every(M=>_.has(M))||b.labels.filter(M=>!_.has(M)).length<2)continue;if(!r.some(M=>M.labels.filter($=>b.labels.includes($)).length>=2)){const M=b.type==="row"?"y":"x";u.push(`**${b.labels.join(", ")}**: new ${b.type} (${M}≈${b.sharedEdge}, ${b.avgGap}px gaps)`),b.labels.forEach(E=>_.add(E))}}const f=s.filter(b=>!_.has(b.label));if(f.length>=2){const b={};for(const R of f){const x=Math.round(R.currentRect.x/5)*5;(b[x]??(b[x]=[])).push(R.label)}for(const[R,x]of Object.entries(b))x.length>=2&&u.push(`**${x.join(", ")}**: shared left edge at x≈${R}`)}return u}function c_(s){if(typeof document>"u")return{viewport:s,contentArea:null};const r=[],c=new Set,u=R=>{c.has(R)||R instanceof HTMLElement&&(R.hasAttribute("data-feedback-toolbar")||xc.has(R.tagName.toLowerCase())||(c.add(R),r.push(R)))},_=document.querySelector("main");_&&u(_);const f=document.querySelector("[role='main']");f&&u(f);for(const R of Array.from(document.body.children))if(u(R),R.children){for(const x of Array.from(R.children))if(u(x),x.children)for(const M of Array.from(x.children))u(M)}let b=null;for(const R of r){const x=R.getBoundingClientRect();if(x.height<50)continue;const M=getComputedStyle(R);if(M.maxWidth&&M.maxWidth!=="none"&&M.maxWidth!=="0px"){(!b||x.width<b.rect.width)&&(b={el:R,rect:x});continue}!b&&x.width<s.width-20&&x.width>100&&(b={el:R,rect:x})}if(b){const{el:R,rect:x}=b;return{viewport:s,contentArea:{width:Math.round(x.width),left:Math.round(x.left),right:Math.round(x.right),centerX:Math.round(x.left+x.width/2),selector:oa(R)}}}return{viewport:s,contentArea:null}}function dy(s){if(typeof document>"u")return null;const r=document.querySelector(s);if(!r?.parentElement)return null;const c=getComputedStyle(r.parentElement),u={parentDisplay:c.display,parentSelector:oa(r.parentElement)};return c.display.includes("flex")&&(u.flexDirection=c.flexDirection),c.display.includes("grid")&&c.gridTemplateColumns!=="none"&&(u.gridCols=c.gridTemplateColumns),c.gap&&c.gap!=="normal"&&c.gap!=="0px"&&(u.gap=c.gap),u}function u_(s,r){const c=r.contentArea,u=c?c.width:r.viewport.width,_=c?c.left:0,f=c?c.centerX:Math.round(r.viewport.width/2),b=Math.round(s.x-_),R=Math.round(_+u-(s.x+s.width)),x=(s.width/u*100).toFixed(1),M=s.x+s.width/2,E=Math.abs(M-f)<20,$=s.width/u>.95,D=[];return $?D.push("`width: 100%` of container"):D.push(`left \`${b}px\` in container, right \`${R}px\`, width \`${x}%\` (\`${Math.round(s.width)}px\`)`),E&&!$&&D.push("centered — `margin-inline: auto`"),D.join(" — ")}function d_(s){const{viewport:r,contentArea:c}=s;let u=`### Reference Frame
`;if(u+=`- Viewport: \`${r.width}×${r.height}px\`
`,c){const _=c;u+=`- Content area: \`${_.width}px\` wide, left edge at \`x=${_.left}\`, right at \`x=${_.right}\` (\`${_.selector}\`)
`,u+=`- Pixel → CSS translation:
`,u+=`  - **Horizontal position in container**: \`element.x - ${_.left}\` → use as \`margin-left\` or \`left\`
`,u+=`  - **Width as % of container**: \`element.width / ${_.width} × 100\` → use as \`width: X%\`
`,u+="  - **Vertical gap between elements**: `nextElement.y - (prevElement.y + prevElement.height)` → use as `margin-top` or `gap`\n",u+=`  - **Centered**: if \`|element.centerX - ${_.centerX}| < 20px\` → use \`margin-inline: auto\`
`}else u+=`- No distinct content container — elements positioned relative to full viewport
`,u+=`- Pixel → CSS translation:
`,u+=`  - **Width as % of viewport**: \`element.width / ${r.width} × 100\` → use as \`width: X%\`
`,u+=`  - **Centered**: if \`|(element.x + element.width/2) - ${Math.round(r.width/2)}| < 20px\` → use \`margin-inline: auto\`
`;return u+=`
`,u}function _y(s){const r=dy(s);if(!r)return null;let c=`\`${r.parentDisplay}\``;return r.flexDirection&&(c+=`, flex-direction: \`${r.flexDirection}\``),r.gridCols&&(c+=`, grid-template-columns: \`${r.gridCols}\``),r.gap&&(c+=`, gap: \`${r.gap}\``),`Parent: ${c} (\`${r.parentSelector}\`)`}function __(s,r,c,u="standard"){if(s.length===0)return"";const _=[...s].sort((U,G)=>Math.abs(U.y-G.y)<20?U.x-G.x:U.y-G.y);let f="";if(c?.blankCanvas?(f+=`## Wireframe: New Page

`,c.wireframePurpose&&(f+=`> **Purpose:** ${c.wireframePurpose}
>
`),f+=`> ${s.length} component${s.length!==1?"s":""} placed — this is a standalone wireframe, not related to the current page.
>
> This wireframe is a rough sketch for exploring ideas.

`):f+=`## Design Layout

> ${s.length} component${s.length!==1?"s":""} placed

`,u==="compact")return f+=`### Components
`,_.forEach((U,G)=>{const _e=Rl[U.type]?.label||U.type;f+=`${G+1}. **${_e}** — \`${Math.round(U.width)}×${Math.round(U.height)}px\` at \`(${Math.round(U.x)}, ${Math.round(U.y)})\`
`}),f;const b=c_(r);f+=d_(b),f+=`### Components
`,_.forEach((U,G)=>{const _e=Rl[U.type]?.label||U.type,ve={x:U.x,y:U.y,width:U.width,height:U.height};f+=`${G+1}. **${_e}** — \`${Math.round(U.width)}×${Math.round(U.height)}px\` at \`(${Math.round(U.x)}, ${Math.round(U.y)})\`
`;const we=bc(ve),nt=s_(we,{includeLeftRight:u==="detailed"||u==="forensic"});for(const ot of nt)f+=`   - ${ot}
`;const oe=u_(ve,b);oe&&(f+=`   - CSS: ${oe}
`)}),f+=`
### Layout Analysis
`;const R=[];for(const U of _){const G=R.find(_e=>Math.abs(_e.y-U.y)<30);G?G.items.push(U):R.push({y:U.y,items:[U]})}if(R.sort((U,G)=>U.y-G.y),R.forEach((U,G)=>{U.items.sort((ve,we)=>ve.x-we.x);const _e=U.items.map(ve=>Rl[ve.type]?.label||ve.type);if(U.items.length===1){const we=U.items[0].width>r.width*.8;f+=`- Row ${G+1} (y≈${Math.round(U.y)}): ${_e[0]}${we?" — full width":""}
`}else f+=`- Row ${G+1} (y≈${Math.round(U.y)}): ${_e.join(" | ")} — ${U.items.length} items side by side
`}),u==="detailed"||u==="forensic"){f+=`
### Spacing & Gaps
`;for(let U=0;U<_.length-1;U++){const G=_[U],_e=_[U+1],ve=Rl[G.type]?.label||G.type,we=Rl[_e.type]?.label||_e.type,_t=Math.round(_e.y-(G.y+G.height)),nt=Math.round(_e.x-(G.x+G.width));Math.abs(G.y-_e.y)<30?f+=`- ${ve} → ${we}: \`${nt}px\` horizontal gap
`:f+=`- ${ve} → ${we}: \`${_t}px\` vertical gap
`}if(u==="forensic"&&_.length>2){f+=`
### All Pairwise Gaps
`;for(let U=0;U<_.length;U++)for(let G=U+1;G<_.length;G++){const _e=_[U],ve=_[G],we=Rl[_e.type]?.label||_e.type,_t=Rl[ve.type]?.label||ve.type,nt=Math.round(ve.y-(_e.y+_e.height)),oe=Math.round(ve.x-(_e.x+_e.width));f+=`- ${we} ↔ ${_t}: h=\`${oe}px\` v=\`${nt}px\`
`}}u==="forensic"&&(f+=`
### Z-Order (placement order)
`,s.forEach((U,G)=>{const _e=Rl[U.type]?.label||U.type;f+=`${G}. ${_e} at \`(${Math.round(U.x)}, ${Math.round(U.y)})\`
`}))}f+=`
### Suggested Implementation
`;const x=_.some(U=>U.type==="navigation"),M=_.some(U=>U.type==="hero"),E=_.some(U=>U.type==="sidebar"),$=_.some(U=>U.type==="footer"),D=_.filter(U=>U.type==="card"),ue=_.filter(U=>U.type==="form"),H=_.filter(U=>U.type==="table"),ne=_.filter(U=>U.type==="modal");if(x&&(f+=`- Top navigation bar with logo + nav links + CTA
`),M&&(f+=`- Hero section with heading, subtext, and call-to-action
`),E&&(f+=`- Sidebar layout — use CSS Grid with sidebar + main content area
`),D.length>1?f+=`- ${D.length}-column card grid — use CSS Grid or Flexbox
`:D.length===1&&(f+=`- Card component with image + content area
`),ue.length>0&&(f+=`- ${ue.length} form${ue.length>1?"s":""} — add proper labels, validation, and submit handling
`),H.length>0&&(f+=`- Data table — consider sortable columns and pagination
`),ne.length>0&&(f+=`- Modal dialog — add overlay backdrop and focus trapping
`),$&&(f+=`- Multi-column footer with links
`),u==="detailed"||u==="forensic"){if(f+=`
### CSS Suggestions
`,E){const U=_.find(G=>G.type==="sidebar");f+=`- \`display: grid; grid-template-columns: ${Math.round(U.width)}px 1fr;\`
`}if(D.length>1){const U=Math.round(D[0].width);f+=`- \`display: grid; grid-template-columns: repeat(${D.length}, ${U}px); gap: 16px;\`
`}x&&(f+="- Navigation: `position: sticky; top: 0; z-index: 50;`\n")}return f}function f_(s,r="standard",c){const{sections:u}=s,_=[];for(const E of u){const $=E.originalRect,D=E.currentRect,ue=Math.abs($.x-D.x)>1||Math.abs($.y-D.y)>1,H=Math.abs($.width-D.width)>1||Math.abs($.height-D.height)>1;if(!ue&&!H){r==="forensic"&&_.push({section:E,posMoved:!1,sizeChanged:!1});continue}_.push({section:E,posMoved:ue,sizeChanged:H})}if(_.length===0||r!=="forensic"&&_.every(E=>!E.posMoved&&!E.sizeChanged))return"";let f=`## Suggested Layout Changes

`;const b=c?c.width:typeof window<"u"?window.innerWidth:0,R=c?c.height:typeof window<"u"?window.innerHeight:0,x=c_({width:b,height:R});r!=="compact"&&(f+=d_(x)),r==="forensic"&&(f+=`> Detected at: \`${new Date(s.detectedAt).toISOString()}\`
`,f+=`> Total sections: ${u.length}

`);const M=E=>u.map($=>({label:$.label,selector:$.selector,rect:E==="original"?$.originalRect:$.currentRect}));f+=`**Changes:**
`;for(const{section:E,posMoved:$,sizeChanged:D}of _){const ue=E.originalRect,H=E.currentRect;if(!$&&!D){f+=`- ${E.label} — unchanged at (${Math.round(H.x)}, ${Math.round(H.y)}) ${Math.round(H.width)}×${Math.round(H.height)}px
`;continue}if(r==="compact"){$&&D?f+=`- Suggested: move **${E.label}** to (${Math.round(H.x)}, ${Math.round(H.y)}) ${Math.round(H.width)}×${Math.round(H.height)}px
`:$?f+=`- Suggested: move **${E.label}** to (${Math.round(H.x)}, ${Math.round(H.y)})
`:f+=`- Suggested: resize **${E.label}** to ${Math.round(H.width)}×${Math.round(H.height)}px
`;continue}if($&&D?f+=`- Suggested: move and resize **${E.label}**
`:$?f+=`- Suggested: move **${E.label}**
`:f+=`- Suggested: resize **${E.label}** from ${Math.round(ue.width)}×${Math.round(ue.height)}px to ${Math.round(H.width)}×${Math.round(H.height)}px
`,$){const U=bc(ue,M("original")),G=bc(H,M("current")),_e=D?{width:ue.width,height:ue.height}:void 0;f+=`  - Currently ${cy(U,{x:ue.x,y:ue.y},_e)}
`;const ve=D?{width:H.width,height:H.height}:void 0,we=`at (${Math.round(H.x)}, ${Math.round(H.y)})`,_t=ve?`, ${Math.round(ve.width)}×${Math.round(ve.height)}px`:"",oe=s_(G,{includeLeftRight:r==="detailed"||r==="forensic"});if(oe.length>0){f+=`  - Suggested position ${we}${_t}: ${oe[0]}
`;for(let rt=1;rt<oe.length;rt++)f+=`    ${oe[rt]}
`}else f+=`  - Suggested position ${we}${_t}
`;const ot=u_(H,x);ot&&(f+=`  - CSS: ${ot}
`)}const ne=_y(E.selector);if(ne&&(f+=`  - ${ne}
`),f+=`  - Selector: \`${E.selector}\`
`,r==="detailed"||r==="forensic"){const U=E.className?`${E.tagName}.${E.className.split(" ")[0]}`:E.tagName;U!==E.selector&&(f+=`  - Element: \`${U}\`
`),E.role&&(f+=`  - Role: \`${E.role}\`
`),r==="forensic"&&E.textSnippet&&(f+=`  - Text: "${E.textSnippet}"
`)}r==="forensic"&&(f+=`  - Original rect: \`{ x: ${Math.round(ue.x)}, y: ${Math.round(ue.y)}, w: ${Math.round(ue.width)}, h: ${Math.round(ue.height)} }\`
`,f+=`  - Current rect: \`{ x: ${Math.round(H.x)}, y: ${Math.round(H.y)}, w: ${Math.round(H.width)}, h: ${Math.round(H.height)} }\`
`)}if(r!=="compact"){const E=_.filter(D=>D.posMoved).map(D=>({label:D.section.label,originalRect:D.section.originalRect,currentRect:D.section.currentRect})),$=uy(E);if($.length>0){f+=`
### Layout Summary
`;for(const D of $)f+=`- ${D}
`}}if(r!=="compact"&&u.length>1){f+=`
### All Sections (current positions)
`;const E=[...u].sort(($,D)=>Math.abs($.currentRect.y-D.currentRect.y)<20?$.currentRect.x-D.currentRect.x:$.currentRect.y-D.currentRect.y);for(const $ of E){const D=$.currentRect,ue=Math.abs(D.x-$.originalRect.x)>1||Math.abs(D.y-$.originalRect.y)>1||Math.abs(D.width-$.originalRect.width)>1||Math.abs(D.height-$.originalRect.height)>1;f+=`- ${$.label}: \`${Math.round(D.width)}×${Math.round(D.height)}px\` at \`(${Math.round(D.x)}, ${Math.round(D.y)})\`${ue?" ← suggested":""}
`}}return f}var vc="feedback-annotations-",h_=7;function Li(s){return`${vc}${s}`}function wc(s){if(typeof window>"u")return[];try{const r=localStorage.getItem(Li(s));if(!r)return[];const c=JSON.parse(r),u=Date.now()-h_*24*60*60*1e3;return c.filter(_=>!_.timestamp||_.timestamp>u)}catch{return[]}}function m_(s,r){if(!(typeof window>"u"))try{localStorage.setItem(Li(s),JSON.stringify(r))}catch{}}function fy(){const s=new Map;if(typeof window>"u")return s;try{const r=Date.now()-h_*24*60*60*1e3;for(let c=0;c<localStorage.length;c++){const u=localStorage.key(c);if(u?.startsWith(vc)){const _=u.slice(vc.length),f=localStorage.getItem(u);if(f){const R=JSON.parse(f).filter(x=>!x.timestamp||x.timestamp>r);R.length>0&&s.set(_,R)}}}}catch{}return s}function Ms(s,r,c){const u=r.map(_=>({..._,_syncedTo:c}));m_(s,u)}var Sc="agentation-design-";function hy(s){if(typeof window>"u")return[];try{const r=localStorage.getItem(`${Sc}${s}`);return r?JSON.parse(r):[]}catch{return[]}}function my(s,r){if(!(typeof window>"u"))try{localStorage.setItem(`${Sc}${s}`,JSON.stringify(r))}catch{}}function gy(s){if(!(typeof window>"u"))try{localStorage.removeItem(`${Sc}${s}`)}catch{}}var kc="agentation-rearrange-";function yy(s){if(typeof window>"u")return null;try{const r=localStorage.getItem(`${kc}${s}`);return r?JSON.parse(r):null}catch{return null}}function py(s,r){if(!(typeof window>"u"))try{localStorage.setItem(`${kc}${s}`,JSON.stringify(r))}catch{}}function xy(s){if(!(typeof window>"u"))try{localStorage.removeItem(`${kc}${s}`)}catch{}}var jc="agentation-wireframe-";function by(s){if(typeof window>"u")return null;try{const r=localStorage.getItem(`${jc}${s}`);return r?JSON.parse(r):null}catch{return null}}function g_(s,r){if(!(typeof window>"u"))try{localStorage.setItem(`${jc}${s}`,JSON.stringify(r))}catch{}}function $i(s){if(!(typeof window>"u"))try{localStorage.removeItem(`${jc}${s}`)}catch{}}var y_="agentation-session-";function Cc(s){return`${y_}${s}`}function vy(s){if(typeof window>"u")return null;try{return localStorage.getItem(Cc(s))}catch{return null}}function Mc(s,r){if(!(typeof window>"u"))try{localStorage.setItem(Cc(s),r)}catch{}}function wy(s){if(!(typeof window>"u"))try{localStorage.removeItem(Cc(s))}catch{}}var p_=`${y_}toolbar-hidden`;function Sy(){if(typeof window>"u")return!1;try{return sessionStorage.getItem(p_)==="1"}catch{return!1}}function ky(s){if(!(typeof window>"u"))try{s&&sessionStorage.setItem(p_,"1")}catch{}}async function Ec(s,r){const c=await fetch(`${s}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:r})});if(!c.ok)throw new Error(`Failed to create session: ${c.status}`);return c.json()}async function x_(s,r){const c=await fetch(`${s}/sessions/${r}`);if(!c.ok)throw new Error(`Failed to get session: ${c.status}`);return c.json()}async function Oa(s,r,c){const u=await fetch(`${s}/sessions/${r}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});if(!u.ok)throw new Error(`Failed to sync annotation: ${u.status}`);return u.json()}async function b_(s,r,c){const u=await fetch(`${s}/annotations/${r}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});if(!u.ok)throw new Error(`Failed to update annotation: ${u.status}`);return u.json()}async function So(s,r){const c=await fetch(`${s}/annotations/${r}`,{method:"DELETE"});if(!c.ok)throw new Error(`Failed to delete annotation: ${c.status}`)}var zt={FunctionComponent:0,ClassComponent:1,IndeterminateComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,Fragment:7,Mode:8,ContextConsumer:9,ContextProvider:10,ForwardRef:11,Profiler:12,SuspenseComponent:13,MemoComponent:14,SimpleMemoComponent:15,LazyComponent:16,IncompleteClassComponent:17,DehydratedFragment:18,SuspenseListComponent:19,ScopeComponent:21,OffscreenComponent:22,LegacyHiddenComponent:23,CacheComponent:24,TracingMarkerComponent:25,HostHoistable:26,HostSingleton:27,IncompleteFunctionComponent:28,Throw:29,ViewTransitionComponent:30,ActivityComponent:31},v_=new Set(["Component","PureComponent","Fragment","Suspense","Profiler","StrictMode","Routes","Route","Outlet","Root","ErrorBoundaryHandler","HotReload","Hot"]),w_=[/Boundary$/,/BoundaryHandler$/,/Provider$/,/Consumer$/,/^(Inner|Outer)/,/Router$/,/^Client(Page|Segment|Root)/,/^Segment(ViewNode|Node)$/,/^LayoutSegment/,/^Server(Root|Component|Render)/,/^RSC/,/Context$/,/^Hot(Reload)?$/,/^(Dev|React)(Overlay|Tools|Root)/,/Overlay$/,/Handler$/,/^With[A-Z]/,/Wrapper$/,/^Root$/],jy=[/Page$/,/View$/,/Screen$/,/Section$/,/Card$/,/List$/,/Item$/,/Form$/,/Modal$/,/Dialog$/,/Button$/,/Nav$/,/Header$/,/Footer$/,/Layout$/,/Panel$/,/Tab$/,/Menu$/];function Cy(s){const r=s?.mode??"filtered";let c=v_;if(s?.skipExact){const u=s.skipExact instanceof Set?s.skipExact:new Set(s.skipExact);c=new Set([...v_,...u])}return{maxComponents:s?.maxComponents??6,maxDepth:s?.maxDepth??30,mode:r,skipExact:c,skipPatterns:s?.skipPatterns?[...w_,...s.skipPatterns]:w_,userPatterns:s?.userPatterns??jy,filter:s?.filter}}function My(s){return s.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/([A-Z])([A-Z][a-z])/g,"$1-$2").toLowerCase()}function Ey(s,r=10){const c=new Set;let u=s,_=0;for(;u&&_<r;)u.className&&typeof u.className=="string"&&u.className.split(/\s+/).forEach(f=>{if(f.length>1){const b=f.replace(/[_][a-zA-Z0-9]{5,}.*$/,"").toLowerCase();b.length>1&&c.add(b)}}),u=u.parentElement,_++;return c}function Ty(s,r){const c=My(s);for(const u of r){if(u===c)return!0;const _=c.split("-").filter(b=>b.length>2),f=u.split("-").filter(b=>b.length>2);for(const b of _)for(const R of f)if(b===R||b.includes(R)||R.includes(b))return!0}return!1}function zy(s,r,c,u){if(c.filter)return c.filter(s,r);switch(c.mode){case"all":return!0;case"filtered":return!(c.skipExact.has(s)||c.skipPatterns.some(_=>_.test(s)));case"smart":return c.skipExact.has(s)||c.skipPatterns.some(_=>_.test(s))?!1:!!(u&&Ty(s,u)||c.userPatterns.some(_=>_.test(s)));default:return!0}}var La=null,Ry=new WeakMap;function Tc(s){return Object.keys(s).some(r=>r.startsWith("__reactFiber$")||r.startsWith("__reactInternalInstance$")||r.startsWith("__reactProps$"))}function Dy(){if(La!==null)return La;if(typeof document>"u")return!1;if(document.body&&Tc(document.body))return La=!0,!0;const s=["#root","#app","#__next","[data-reactroot]"];for(const r of s){const c=document.querySelector(r);if(c&&Tc(c))return La=!0,!0}if(document.body){for(const r of document.body.children)if(Tc(r))return La=!0,!0}return La=!1,!1}var Es={map:Ry};function Ny(s){return Object.keys(s).find(c=>c.startsWith("__reactFiber$")||c.startsWith("__reactInternalInstance$"))||null}function Ay(s){const r=Ny(s);return r?s[r]:null}function aa(s){return s?s.displayName?s.displayName:s.name?s.name:null:null}function By(s){const{tag:r,type:c,elementType:u}=s;if(r===zt.HostComponent||r===zt.HostText||r===zt.HostHoistable||r===zt.HostSingleton||r===zt.Fragment||r===zt.Mode||r===zt.Profiler||r===zt.DehydratedFragment||r===zt.HostRoot||r===zt.HostPortal||r===zt.ScopeComponent||r===zt.OffscreenComponent||r===zt.LegacyHiddenComponent||r===zt.CacheComponent||r===zt.TracingMarkerComponent||r===zt.Throw||r===zt.ViewTransitionComponent||r===zt.ActivityComponent)return null;if(r===zt.ForwardRef){const _=u;if(_?.render){const f=aa(_.render);if(f)return f}return _?.displayName?_.displayName:aa(c)}if(r===zt.MemoComponent||r===zt.SimpleMemoComponent){const _=u;if(_?.type){const f=aa(_.type);if(f)return f}return _?.displayName?_.displayName:aa(c)}if(r===zt.ContextProvider){const _=c;return _?._context?.displayName?`${_._context.displayName}.Provider`:null}if(r===zt.ContextConsumer){const _=c;return _?.displayName?`${_.displayName}.Consumer`:null}if(r===zt.LazyComponent){const _=u;return _?._status===1&&_._result?aa(_._result):null}return r===zt.SuspenseComponent||r===zt.SuspenseListComponent?null:r===zt.IncompleteClassComponent||r===zt.IncompleteFunctionComponent||r===zt.FunctionComponent||r===zt.ClassComponent||r===zt.IndeterminateComponent?aa(c):null}function Oy(s){return s.length<=2||s.length<=3&&s===s.toLowerCase()}function Ly(s,r){const c=Cy(r),u=c.mode==="all";if(u){const x=Es.map.get(s);if(x!==void 0)return x}if(!Dy()){const x={path:null,components:[]};return u&&Es.map.set(s,x),x}const _=c.mode==="smart"?Ey(s):void 0,f=[];try{let x=Ay(s),M=0;for(;x&&M<c.maxDepth&&f.length<c.maxComponents;){const E=By(x);E&&!Oy(E)&&zy(E,M,c,_)&&f.push(E),x=x.return,M++}}catch{const x={path:null,components:[]};return u&&Es.map.set(s,x),x}if(f.length===0){const x={path:null,components:[]};return u&&Es.map.set(s,x),x}const R={path:f.slice().reverse().map(x=>`<${x}>`).join(" "),components:f};return u&&Es.map.set(s,R),R}var Ts={FunctionComponent:0,IndeterminateComponent:2,ForwardRef:11,MemoComponent:14,SimpleMemoComponent:15};function $y(s){if(!s||typeof s!="object")return null;const r=Object.keys(s),c=r.find(f=>f.startsWith("__reactFiber$"));if(c)return s[c]||null;const u=r.find(f=>f.startsWith("__reactInternalInstance$"));if(u)return s[u]||null;const _=r.find(f=>{if(!f.startsWith("__react"))return!1;const b=s[f];return b&&typeof b=="object"&&"_debugSource"in b});return _&&s[_]||null}function zs(s){if(!s.type||typeof s.type=="string")return null;if(typeof s.type=="object"||typeof s.type=="function"){const r=s.type;if(r.displayName)return r.displayName;if(r.name)return r.name}return null}function Hy(s,r=50){let c=s,u=0;for(;c&&u<r;){if(c._debugSource)return{source:c._debugSource,componentName:zs(c)};if(c._debugOwner?._debugSource)return{source:c._debugOwner._debugSource,componentName:zs(c._debugOwner)};c=c.return,u++}return null}function Uy(s){let r=s,c=0;const u=50;for(;r&&c<u;){const _=r,f=["_debugSource","__source","_source","debugSource"];for(const b of f){const R=_[b];if(R&&typeof R=="object"&&"fileName"in R)return{source:R,componentName:zs(r)}}if(r.memoizedProps){const b=r.memoizedProps;if(b.__source&&typeof b.__source=="object"){const R=b.__source;if(R.fileName&&R.lineNumber)return{source:{fileName:R.fileName,lineNumber:R.lineNumber,columnNumber:R.columnNumber},componentName:zs(r)}}}r=r.return,c++}return null}var Hi=new Map;function Yy(s){const r=s.tag,c=s.type,u=s.elementType;if(typeof c=="string"||c==null||typeof c=="function"&&c.prototype?.isReactComponent)return null;if((r===Ts.FunctionComponent||r===Ts.IndeterminateComponent)&&typeof c=="function")return c;if(r===Ts.ForwardRef&&u){const _=u.render;if(typeof _=="function")return _}if((r===Ts.MemoComponent||r===Ts.SimpleMemoComponent)&&u){const _=u.type;if(typeof _=="function")return _}return typeof c=="function"?c:null}function Xy(){const s=V0,r=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;if(r&&"H"in r)return{get:()=>r.H,set:u=>{r.H=u}};const c=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;if(c){const u=c.ReactCurrentDispatcher;if(u&&"current"in u)return{get:()=>u.current,set:_=>{u.current=_}}}return null}function Iy(s){const r=s.split(`
`),c=[/source-location/,/\/dist\/index\./,/node_modules\//,/react-dom/,/react\.development/,/react\.production/,/chunk-[A-Z0-9]+/i,/react-stack-bottom-frame/,/react-reconciler/,/scheduler/,/<anonymous>/],u=/^\s*at\s+(?:.*?\s+\()?(.+?):(\d+):(\d+)\)?$/,_=/^[^@]*@(.+?):(\d+):(\d+)$/;for(const f of r){const b=f.trim();if(!b||c.some(x=>x.test(b)))continue;const R=u.exec(b)||_.exec(b);if(R)return{fileName:R[1],line:parseInt(R[2],10),column:parseInt(R[3],10)}}return null}function qy(s){let r=s;return r=r.replace(/[?#].*$/,""),r=r.replace(/^turbopack:\/\/\/\[project\]\//,""),r=r.replace(/^webpack-internal:\/\/\/\.\//,""),r=r.replace(/^webpack-internal:\/\/\//,""),r=r.replace(/^webpack:\/\/\/\.\//,""),r=r.replace(/^webpack:\/\/\//,""),r=r.replace(/^turbopack:\/\/\//,""),r=r.replace(/^https?:\/\/[^/]+\//,""),r=r.replace(/^file:\/\/\//,"/"),r=r.replace(/^\([^)]+\)\/\.\//,""),r=r.replace(/^\.\//,""),r}function Qy(s){const r=Yy(s);if(!r)return null;if(Hi.has(r))return Hi.get(r);const c=Xy();if(!c)return Hi.set(r,null),null;const u=c.get();let _=null;try{const f=new Proxy({},{get(){throw new Error("probe")}});c.set(f);try{r({})}catch(b){if(b instanceof Error&&b.message==="probe"&&b.stack){const R=Iy(b.stack);R&&(_={fileName:qy(R.fileName),lineNumber:R.line,columnNumber:R.column,componentName:zs(s)||void 0})}}}finally{c.set(u)}return Hi.set(r,_),_}function Wy(s,r=15){let c=s,u=0;for(;c&&u<r;){const _=Qy(c);if(_)return _;c=c.return,u++}return null}function zc(s){const r=$y(s);if(!r)return{found:!1,reason:"no-fiber",isReactApp:!1,isProduction:!1};let c=Hy(r);if(c||(c=Uy(r)),c?.source)return{found:!0,source:{fileName:c.source.fileName,lineNumber:c.source.lineNumber,columnNumber:c.source.columnNumber,componentName:c.componentName||void 0},isReactApp:!0,isProduction:!1};const u=Wy(r);return u?{found:!0,source:u,isReactApp:!0,isProduction:!1}:{found:!1,reason:"no-debug-source",isReactApp:!0,isProduction:!1}}function Gy(s,r="path"){const{fileName:c,lineNumber:u,columnNumber:_}=s;let f=`${c}:${u}`;return _!==void 0&&(f+=`:${_}`),r==="vscode"?`vscode://file${c.startsWith("/")?"":"/"}${f}`:f}function Vy(s,r=10){let c=s,u=0;for(;c&&u<r;){const _=zc(c);if(_.found)return _;c=c.parentElement,u++}return zc(s)}var Zy=`.styles-module__toolbar___wNsdK svg[fill=none],
.styles-module__markersLayer___-25j1 svg[fill=none],
.styles-module__fixedMarkersLayer___ffyX6 svg[fill=none] {
  fill: none !important;
}
.styles-module__toolbar___wNsdK svg[fill=none] :not([fill]),
.styles-module__markersLayer___-25j1 svg[fill=none] :not([fill]),
.styles-module__fixedMarkersLayer___ffyX6 svg[fill=none] :not([fill]) {
  fill: none !important;
}

.styles-module__controlsContent___9GJWU :where(button, input, select, textarea, label) {
  background: unset;
  border: unset;
  border-radius: unset;
  padding: unset;
  margin: unset;
  color: unset;
  font-family: unset;
  font-weight: unset;
  font-style: unset;
  line-height: unset;
  letter-spacing: unset;
  text-transform: unset;
  text-decoration: unset;
  box-shadow: unset;
  outline: unset;
}

@keyframes styles-module__toolbarEnter___u8RRu {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
@keyframes styles-module__toolbarHide___y8kaT {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}
@keyframes styles-module__badgeEnter___mVQLj {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleIn___c-r1K {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleOut___Wctwz {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
@keyframes styles-module__slideUp___kgD36 {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes styles-module__slideDown___zcdje {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
}
@keyframes styles-module__fadeIn___b9qmf {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__fadeOut___6Ut6- {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes styles-module__hoverHighlightIn___6WYHY {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__hoverTooltipIn___FYGQx {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.styles-module__disableTransitions___EopxO :is(*, *::before, *::after) {
  transition: none !important;
}

.styles-module__toolbar___wNsdK {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  width: 337px;
  z-index: 100000;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: none;
  transition: left 0s, top 0s, right 0s, bottom 0s;
}

:where(.styles-module__toolbar___wNsdK) {
  bottom: 1.25rem;
  right: 1.25rem;
}

.styles-module__toolbarContainer___dIhma {
  position: relative;
  user-select: none;
  margin-left: auto;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toolbarContainer___dIhma.styles-module__entrance___sgHd8 {
  animation: styles-module__toolbarEnter___u8RRu 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
}
.styles-module__toolbarContainer___dIhma.styles-module__hiding___1td44 {
  animation: styles-module__toolbarHide___y8kaT 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
  pointer-events: none;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  padding: 0;
  cursor: pointer;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn svg {
  margin-top: -1px;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #2a2a2a;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:active {
  transform: scale(0.95);
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx {
  height: 44px;
  border-radius: 1.5rem;
  padding: 0.375rem;
  width: 297px;
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx.styles-module__serverConnected___Gfbou {
  width: 337px;
}

.styles-module__toggleContent___0yfyP {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.1s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toggleContent___0yfyP.styles-module__visible___KHwEW {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.styles-module__toggleContent___0yfyP.styles-module__hidden___Ae8H4 {
  opacity: 0;
  pointer-events: none;
}

.styles-module__controlsContent___9GJWU {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: filter 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__controlsContent___9GJWU.styles-module__visible___KHwEW {
  opacity: 1;
  filter: blur(0px);
  transform: scale(1);
  visibility: visible;
  pointer-events: auto;
}
.styles-module__controlsContent___9GJWU.styles-module__hidden___Ae8H4 {
  pointer-events: none;
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.4);
}

.styles-module__badge___2XsgF {
  position: absolute;
  top: -13px;
  right: -13px;
  user-select: none;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background-color: var(--agentation-color-accent);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.2s ease;
  transform: scale(1);
}
.styles-module__badge___2XsgF.styles-module__fadeOut___6Ut6- {
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}
.styles-module__badge___2XsgF.styles-module__entrance___sgHd8 {
  animation: styles-module__badgeEnter___mVQLj 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) 0.4s both;
}

.styles-module__controlButton___8Q0jc {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease, opacity 0.2s ease;
}
.styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.styles-module__controlButton___8Q0jc:active:not(:disabled) {
  transform: scale(0.92);
}
.styles-module__controlButton___8Q0jc:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.styles-module__controlButton___8Q0jc[data-active=true] {
  color: var(--agentation-color-blue);
  background-color: color-mix(in srgb, var(--agentation-color-blue) 25%, transparent);
}
.styles-module__controlButton___8Q0jc[data-error=true] {
  color: var(--agentation-color-red);
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
}
.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
  color: var(--agentation-color-red);
}
.styles-module__controlButton___8Q0jc[data-no-hover=true], .styles-module__controlButton___8Q0jc.styles-module__statusShowing___te6iu {
  cursor: default;
  pointer-events: none;
  background: transparent !important;
}
.styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: var(--agentation-color-green);
  background: transparent;
  cursor: default;
}
.styles-module__controlButton___8Q0jc[data-failed=true] {
  color: var(--agentation-color-red);
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
}

.styles-module__buttonBadge___NeFWb {
  position: absolute;
  top: 0px;
  right: 0px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background-color: var(--agentation-color-accent);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px #1a1a1a, 0 1px 3px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
[data-agentation-theme=light] .styles-module__buttonBadge___NeFWb {
  box-shadow: 0 0 0 2px #fff, 0 1px 3px rgba(0, 0, 0, 0.2);
}

@keyframes styles-module__mcpIndicatorPulseConnected___EDodZ {
  0%, 100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  }
  50% {
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
}
@keyframes styles-module__mcpIndicatorPulseConnecting___cCYte {
  0%, 100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-yellow) 50%, transparent);
  }
  50% {
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--agentation-color-yellow) 0%, transparent);
  }
}
.styles-module__mcpIndicator___zGJeL {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  transition: background-color 0.3s ease, opacity 0.15s ease, transform 0.15s ease;
  opacity: 1;
  transform: scale(1);
}
.styles-module__mcpIndicator___zGJeL.styles-module__connected___7c28g {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpIndicatorPulseConnected___EDodZ 2.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__connecting___uo-CW {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpIndicatorPulseConnecting___cCYte 1.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__hidden___Ae8H4 {
  opacity: 0;
  transform: scale(0);
  animation: none;
}

@keyframes styles-module__connectionPulse___-Zycw {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}
.styles-module__connectionIndicatorWrapper___L-e-3 {
  width: 8px;
  height: 34px;
  margin-left: 6px;
  margin-right: 6px;
}

.styles-module__connectionIndicator___afk9p {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease, background-color 0.3s ease;
  cursor: default;
}

.styles-module__connectionIndicatorVisible___C-i5B {
  opacity: 1;
}

.styles-module__connectionIndicatorConnected___IY8pR {
  background-color: var(--agentation-color-green);
  animation: styles-module__connectionPulse___-Zycw 2.5s ease-in-out infinite;
}

.styles-module__connectionIndicatorDisconnected___kmpaZ {
  background-color: var(--agentation-color-red);
  animation: none;
}

.styles-module__connectionIndicatorConnecting___QmSLH {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__connectionPulse___-Zycw 1s ease-in-out infinite;
}

.styles-module__buttonWrapper___rBcdv {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) scale(1);
  transition-delay: 0.85s;
}
.styles-module__buttonWrapper___rBcdv:has(.styles-module__controlButton___8Q0jc:disabled):hover .styles-module__buttonTooltip___Burd9 {
  opacity: 0;
  visibility: hidden;
}

.styles-module__tooltipsInSession___-0lHH .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  transition-delay: 0s;
}

.styles-module__sendButtonWrapper___UUxG6 {
  width: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  margin-left: -0.375rem;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1), margin 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6 .styles-module__controlButton___8Q0jc {
  transform: scale(0.8);
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU {
  width: 34px;
  opacity: 1;
  overflow: visible;
  pointer-events: auto;
  margin-left: 0;
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU .styles-module__controlButton___8Q0jc {
  transform: scale(1);
}

.styles-module__buttonTooltip___Burd9 {
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  padding: 6px 10px;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 100001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: opacity 0.135s ease, transform 0.135s ease, visibility 0.135s ease;
}
.styles-module__buttonTooltip___Burd9::after {
  content: "";
  position: absolute;
  top: calc(100% - 4px);
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: #1a1a1a;
  border-radius: 0 0 2px 0;
}

.styles-module__shortcut___lEAQk {
  margin-left: 4px;
  opacity: 0.5;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9 {
  bottom: auto;
  top: calc(100% + 14px);
  transform: translateX(-50%) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9::after {
  top: -4px;
  bottom: auto;
  border-radius: 2px 0 0 0;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-50%) scale(1);
}

.styles-module__tooltipsHidden___VtLJG .styles-module__buttonTooltip___Burd9 {
  opacity: 0 !important;
  visibility: hidden !important;
  transition: none !important;
}

.styles-module__tooltipVisible___0jcCv,
.styles-module__tooltipsHidden___VtLJG .styles-module__tooltipVisible___0jcCv {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) scale(1) !important;
  transition-delay: 0s !important;
}

.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(-12px) scale(0.95);
}
.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9::after {
  left: 16px;
}
.styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9::after {
  left: auto;
  right: 8px;
}
.styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__divider___c--s1 {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 0.125rem;
}

.styles-module__overlay___Q1O9y {
  position: fixed;
  inset: 0;
  z-index: 99997;
  pointer-events: none;
}
.styles-module__overlay___Q1O9y > * {
  pointer-events: auto;
}

.styles-module__hoverHighlight___ogakW {
  position: fixed;
  border: 2px solid color-mix(in srgb, var(--agentation-color-accent) 50%, transparent);
  border-radius: 4px;
  background-color: color-mix(in srgb, var(--agentation-color-accent) 4%, transparent);
  pointer-events: none !important;
  box-sizing: border-box;
  will-change: opacity;
  contain: layout style;
}
.styles-module__hoverHighlight___ogakW.styles-module__enter___WFIki {
  animation: styles-module__hoverHighlightIn___6WYHY 0.12s ease-out forwards;
}

.styles-module__multiSelectOutline___cSJ-m {
  position: fixed;
  border: 2px dashed color-mix(in srgb, var(--agentation-color-green) 60%, transparent);
  border-radius: 4px;
  pointer-events: none !important;
  background-color: color-mix(in srgb, var(--agentation-color-green) 5%, transparent);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__singleSelectOutline___QhX-O {
  position: fixed;
  border: 2px solid color-mix(in srgb, var(--agentation-color-blue) 60%, transparent);
  border-radius: 4px;
  pointer-events: none !important;
  background-color: color-mix(in srgb, var(--agentation-color-blue) 5%, transparent);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__hoverTooltip___bvLk7 {
  position: fixed;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.85);
  padding: 0.35rem 0.6rem;
  border-radius: 0.375rem;
  pointer-events: none !important;
  white-space: nowrap;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.styles-module__hoverTooltip___bvLk7.styles-module__enter___WFIki {
  animation: styles-module__hoverTooltipIn___FYGQx 0.1s ease-out forwards;
}

.styles-module__hoverReactPath___gx1IJ {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__hoverElementName___QMLMl {
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markersLayer___-25j1 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__markersLayer___-25j1 > * {
  pointer-events: auto;
}

.styles-module__fixedMarkersLayer___ffyX6 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__fixedMarkersLayer___ffyX6 > * {
  pointer-events: auto;
}

.styles-module__marker___6sQrs {
  position: absolute;
  width: 22px;
  height: 22px;
  background: var(--agentation-color-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  user-select: none;
  will-change: transform, opacity;
  contain: layout style;
  z-index: 1;
}
.styles-module__marker___6sQrs:hover {
  z-index: 2;
}
.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7) {
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.styles-module__marker___6sQrs.styles-module__enter___WFIki {
  animation: styles-module__markerIn___5FaAP 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.styles-module__marker___6sQrs.styles-module__exit___fyOJ0 {
  animation: styles-module__markerOut___GU5jX 0.2s ease-out both;
  pointer-events: none;
}
.styles-module__marker___6sQrs.styles-module__clearing___FQ--7 {
  animation: styles-module__markerOut___GU5jX 0.15s ease-out both;
  pointer-events: none;
}
.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7):hover {
  transform: translate(-50%, -50%) scale(1.1);
}
.styles-module__marker___6sQrs.styles-module__pending___2IHLC {
  position: fixed;
  background-color: var(--agentation-color-blue);
  cursor: default;
}
.styles-module__marker___6sQrs.styles-module__fixed___dBMHC {
  position: fixed;
}
.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz {
  background-color: var(--agentation-color-green);
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-size: 0.75rem;
}
.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz.styles-module__pending___2IHLC {
  background-color: var(--agentation-color-green);
}
.styles-module__marker___6sQrs.styles-module__hovered___ZgXIy {
  background-color: var(--agentation-color-red);
}

.styles-module__renumber___nCTxD {
  display: block;
  animation: styles-module__renumberRoll___Wgbq3 0.2s ease-out;
}

@keyframes styles-module__renumberRoll___Wgbq3 {
  0% {
    transform: translateX(-40%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.styles-module__markerTooltip___aLJID {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.909);
  z-index: 100002;
  background: #1a1a1a;
  padding: 8px 0.75rem;
  border-radius: 0.75rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 400;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  min-width: 120px;
  max-width: 200px;
  pointer-events: none;
  cursor: default;
}
.styles-module__markerTooltip___aLJID.styles-module__enter___WFIki {
  animation: styles-module__tooltipIn___0N31w 0.1s ease-out forwards;
}

.styles-module__markerQuote___FHmrz {
  display: block;
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.3125rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markerNote___QkrrS {
  display: block;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 2px;
}

.styles-module__markerHint___2iF-6 {
  display: block;
  font-size: 0.625rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.375rem;
  white-space: nowrap;
}

.styles-module__settingsPanel___OxX3Y {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  z-index: 1;
  overflow: hidden;
  background: #1c1c1c;
  border-radius: 1rem;
  padding: 13px 0 16px;
  min-width: 205px;
  cursor: default;
  opacity: 1;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}
.styles-module__settingsPanel___OxX3Y::before, .styles-module__settingsPanel___OxX3Y::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 2;
  pointer-events: none;
}
.styles-module__settingsPanel___OxX3Y::before {
  left: 0;
  background: linear-gradient(to right, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___OxX3Y::after {
  right: 0;
  background: linear-gradient(to left, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___OxX3Y .styles-module__settingsHeader___pwDY9,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrand___0gJeM,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrandSlash___uTG18,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsVersion___TUcFq,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsSection___m-YM2,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsLabel___8UjfX,
.styles-module__settingsPanel___OxX3Y .styles-module__cycleButton___FMKfw,
.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY,
.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz,
.styles-module__settingsPanel___OxX3Y .styles-module__toggleLabel___Xm8Aa,
.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax,
.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr,
.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp,
.styles-module__settingsPanel___OxX3Y .styles-module__themeToggle___2rUjA {
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__enter___WFIki {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__exit___fyOJ0 {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y {
  background: #1a1a1a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y .styles-module__settingsLabel___8UjfX {
  color: rgba(255, 255, 255, 0.6);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y .styles-module__settingsOption___UNa12 {
  color: rgba(255, 255, 255, 0.85);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y .styles-module__settingsOption___UNa12:hover {
  background: rgba(255, 255, 255, 0.1);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y .styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
[data-agentation-theme=dark] .styles-module__settingsPanel___OxX3Y .styles-module__toggleLabel___Xm8Aa {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__settingsPanelContainer___Xksv8 {
  overflow: visible;
  position: relative;
  display: flex;
  padding: 0 1rem;
}

.styles-module__settingsPage___6YfHH {
  min-width: 100%;
  flex-shrink: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
  transition-delay: 0s;
  opacity: 1;
}

.styles-module__settingsPage___6YfHH.styles-module__slideLeft___Ps01J {
  transform: translateX(-24px);
  opacity: 0;
  pointer-events: none;
}

.styles-module__automationsPage___uvCq6 {
  position: absolute;
  top: 0;
  left: 24px;
  width: 100%;
  height: 100%;
  padding: 3px 1rem 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0;
  pointer-events: none;
}

.styles-module__automationsPage___uvCq6.styles-module__slideIn___4-qXe {
  transform: translateX(-24px);
  opacity: 1;
  pointer-events: auto;
}

.styles-module__settingsNavLink___wCzJt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___wCzJt:hover {
  color: rgba(255, 255, 255, 0.9);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___wCzJt {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___wCzJt:hover {
  color: rgba(0, 0, 0, 0.8);
}
.styles-module__settingsNavLink___wCzJt svg {
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___wCzJt:hover svg {
  color: #fff;
}
[data-agentation-theme=light] .styles-module__settingsNavLink___wCzJt svg {
  color: rgba(0, 0, 0, 0.25);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___wCzJt:hover svg {
  color: rgba(0, 0, 0, 0.8);
}

.styles-module__settingsNavLinkRight___ZWwhj {
  display: flex;
  align-items: center;
  gap: 6px;
}

.styles-module__mcpNavIndicator___cl9pO {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpNavIndicator___cl9pO.styles-module__connected___7c28g {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpPulse___uNggr 2.5s ease-in-out infinite;
}
.styles-module__mcpNavIndicator___cl9pO.styles-module__connecting___uo-CW {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpPulse___uNggr 1.5s ease-in-out infinite;
}

.styles-module__settingsBackButton___bIe2j {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0 12px 0;
  margin: -6px 0 0.5rem 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.12s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___bIe2j svg {
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___bIe2j:hover {
  border-bottom-color: rgba(255, 255, 255, 0.07);
}
.styles-module__settingsBackButton___bIe2j:hover svg {
  opacity: 1;
}
[data-agentation-theme=light] .styles-module__settingsBackButton___bIe2j {
  color: rgba(0, 0, 0, 0.85);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}
[data-agentation-theme=light] .styles-module__settingsBackButton___bIe2j:hover {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.styles-module__automationHeader___InP0r {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #fff;
}
[data-agentation-theme=light] .styles-module__automationHeader___InP0r {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__automationDescription___NKlmo {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  line-height: 14px;
}
[data-agentation-theme=light] .styles-module__automationDescription___NKlmo {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__learnMoreLink___8xv-x {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__learnMoreLink___8xv-x:hover {
  color: #fff;
}
[data-agentation-theme=light] .styles-module__learnMoreLink___8xv-x {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__learnMoreLink___8xv-x:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__autoSendRow___UblX5 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.styles-module__autoSendLabel___icDc2 {
  font-size: 0.6875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__autoSendLabel___icDc2.styles-module__active___-zoN6 {
  color: #66b8ff;
  color: color(display-p3 0.4 0.72 1);
}
[data-agentation-theme=light] .styles-module__autoSendLabel___icDc2 {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__autoSendLabel___icDc2.styles-module__active___-zoN6 {
  color: var(--agentation-color-blue);
}

.styles-module__webhookUrlInput___2375C {
  display: block;
  width: 100%;
  flex: 1;
  min-height: 60px;
  box-sizing: border-box;
  margin-top: 11px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: #fff;
  outline: none;
  resize: none;
  user-select: text;
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}
.styles-module__webhookUrlInput___2375C::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__webhookUrlInput___2375C:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___2375C {
  border-color: rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___2375C::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___2375C:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__settingsHeader___pwDY9 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  margin-bottom: 0.5rem;
  padding-bottom: 9px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.styles-module__settingsBrand___0gJeM {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.0094em;
  color: #fff;
  text-decoration: none;
}

.styles-module__settingsBrandSlash___uTG18 {
  color: var(--agentation-color-accent);
  transition: color 0.2s ease;
}

.styles-module__settingsVersion___TUcFq {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin-left: auto;
  letter-spacing: -0.0094em;
}

.styles-module__settingsSection___m-YM2 + .styles-module__settingsSection___m-YM2 {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__settingsSection___m-YM2.styles-module__settingsSectionExtraPadding___jdhFV {
  padding-top: calc(0.5rem + 4px);
}

.styles-module__settingsSectionGrow___h-5HZ {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.styles-module__settingsRow___3sdhc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}
.styles-module__settingsRow___3sdhc.styles-module__settingsRowMarginTop___zA0Sp {
  margin-top: 8px;
}

.styles-module__dropdownContainer___BVnxe {
  position: relative;
}

.styles-module__dropdownButton___16NPz {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__dropdownButton___16NPz:hover {
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__dropdownButton___16NPz svg {
  opacity: 0.6;
}

.styles-module__cycleButton___FMKfw {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  letter-spacing: -0.0094em;
}
[data-agentation-theme=light] .styles-module__cycleButton___FMKfw {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__cycleButton___FMKfw:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.styles-module__settingsRowDisabled___EgS0V .styles-module__settingsLabel___8UjfX {
  color: rgba(255, 255, 255, 0.2);
}
[data-agentation-theme=light] .styles-module__settingsRowDisabled___EgS0V .styles-module__settingsLabel___8UjfX {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__settingsRowDisabled___EgS0V .styles-module__toggleSwitch___l4Ygm {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes styles-module__cycleTextIn___Q6zJf {
  0% {
    opacity: 0;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.styles-module__cycleButtonText___fD1LR {
  display: inline-block;
  animation: styles-module__cycleTextIn___Q6zJf 0.2s ease-out;
}

.styles-module__cycleDots___LWuoQ {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.styles-module__cycleDot___nPgLY {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.667);
  transition: background-color 0.25s ease-out, transform 0.25s ease-out;
}
.styles-module__cycleDot___nPgLY.styles-module__active___-zoN6 {
  background: #fff;
  transform: scale(1);
}
[data-agentation-theme=light] .styles-module__cycleDot___nPgLY {
  background: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__cycleDot___nPgLY.styles-module__active___-zoN6 {
  background: rgba(0, 0, 0, 0.7);
}

.styles-module__dropdownMenu___k73ER {
  position: absolute;
  right: 0;
  top: calc(100% + 0.25rem);
  background: #1a1a1a;
  border-radius: 0.5rem;
  padding: 0.25rem;
  min-width: 120px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 10;
  animation: styles-module__scaleIn___c-r1K 0.15s ease-out;
}

.styles-module__dropdownItem___ylsLj {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.625rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__dropdownItem___ylsLj:hover {
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__dropdownItem___ylsLj.styles-module__selected___OwRqP {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 600;
}

.styles-module__settingsLabel___8UjfX {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 0.125rem;
}
[data-agentation-theme=light] .styles-module__settingsLabel___8UjfX {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__settingsLabelMarker___ewdtV {
  padding-top: 3px;
  margin-bottom: 10px;
}

.styles-module__settingsOptions___LyrBA {
  display: flex;
  gap: 0.25rem;
}

.styles-module__settingsOption___UNa12 {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.styles-module__settingsOption___UNa12:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {
  background: color-mix(in srgb, var(--agentation-color-blue) 15%, transparent);
  color: var(--agentation-color-blue);
}

.styles-module__sliderContainer___ducXj {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.styles-module__slider___GLdxp {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.styles-module__slider___GLdxp::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.styles-module__slider___GLdxp::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.styles-module__slider___GLdxp:hover::-webkit-slider-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.styles-module__slider___GLdxp:hover::-moz-range-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.styles-module__sliderLabels___FhLDB {
  display: flex;
  justify-content: space-between;
}

.styles-module__sliderLabel___U8sPr {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: color 0.15s ease;
}
.styles-module__sliderLabel___U8sPr:hover {
  color: rgba(255, 255, 255, 0.7);
}
.styles-module__sliderLabel___U8sPr.styles-module__active___-zoN6 {
  color: rgba(255, 255, 255, 0.9);
}

.styles-module__colorOptions___iHCNX {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.375rem;
  margin-bottom: 1px;
}

.styles-module__colorOption___IodiY {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  background-color: var(--swatch);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
@supports (color: color(display-p3 0 0 0)) {
  .styles-module__colorOption___IodiY {
    background-color: var(--swatch-p3);
  }
}
.styles-module__colorOption___IodiY:hover {
  transform: scale(1.15);
}
.styles-module__colorOption___IodiY.styles-module__selected___OwRqP {
  transform: scale(0.83);
}

.styles-module__colorOptionRing___U2xpo {
  display: flex;
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: border-color 0.3s ease;
}
.styles-module__colorOptionRing___U2xpo.styles-module__selected___OwRqP {
  border-color: var(--swatch);
}
@supports (color: color(display-p3 0 0 0)) {
  .styles-module__colorOptionRing___U2xpo.styles-module__selected___OwRqP {
    border-color: var(--swatch-p3);
  }
}

.styles-module__settingsToggle___fBrFn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.styles-module__settingsToggle___fBrFn + .styles-module__settingsToggle___fBrFn {
  margin-top: calc(0.5rem + 6px);
}
.styles-module__settingsToggle___fBrFn input[type=checkbox] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.styles-module__settingsToggle___fBrFn.styles-module__settingsToggleMarginBottom___MZUyF {
  margin-bottom: calc(0.5rem + 6px);
}

.styles-module__customCheckbox___U39ax {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}
.styles-module__customCheckbox___U39ax svg {
  color: #1a1a1a;
  opacity: 1;
  transition: opacity 0.15s ease;
}
input[type=checkbox]:checked + .styles-module__customCheckbox___U39ax {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgb(255, 255, 255);
}
[data-agentation-theme=light] .styles-module__customCheckbox___U39ax {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
[data-agentation-theme=light] .styles-module__customCheckbox___U39ax.styles-module__checked___mnZLo {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
[data-agentation-theme=light] .styles-module__customCheckbox___U39ax.styles-module__checked___mnZLo svg {
  color: #fff;
}

.styles-module__toggleLabel___Xm8Aa {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
[data-agentation-theme=light] .styles-module__toggleLabel___Xm8Aa {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__toggleSwitch___l4Ygm {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 16px;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.styles-module__toggleSwitch___l4Ygm input {
  opacity: 0;
  width: 0;
  height: 0;
}
.styles-module__toggleSwitch___l4Ygm input:checked + .styles-module__toggleSlider___wprIn {
  background-color: var(--agentation-color-blue);
}
.styles-module__toggleSwitch___l4Ygm input:checked + .styles-module__toggleSlider___wprIn::before {
  transform: translateX(8px);
}
.styles-module__toggleSwitch___l4Ygm.styles-module__disabled___332Jw {
  opacity: 0.4;
}
.styles-module__toggleSwitch___l4Ygm.styles-module__disabled___332Jw .styles-module__toggleSlider___wprIn {
  cursor: not-allowed;
}

.styles-module__toggleSlider___wprIn {
  position: absolute;
  cursor: pointer;
  inset: 0;
  border-radius: 16px;
  background: #484848;
}
[data-agentation-theme=light] .styles-module__toggleSlider___wprIn {
  background: #dddddd;
}
.styles-module__toggleSlider___wprIn::before {
  content: "";
  position: absolute;
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes styles-module__mcpPulse___uNggr {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
}
@keyframes styles-module__mcpPulseError___fov9B {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 50%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-red) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 0%, transparent);
  }
}
.styles-module__mcpStatusDot___ibgkc {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__connecting___uo-CW {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpPulse___uNggr 1.5s infinite;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__connected___7c28g {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpPulse___uNggr 2.5s ease-in-out infinite;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__disconnected___cHPxR {
  background-color: var(--agentation-color-red);
  animation: styles-module__mcpPulseError___fov9B 2s infinite;
}

.styles-module__drawCanvas___7cG9U {
  position: fixed;
  inset: 0;
  z-index: 99996;
  pointer-events: none !important;
}
.styles-module__drawCanvas___7cG9U.styles-module__active___-zoN6 {
  pointer-events: auto !important;
  cursor: crosshair !important;
}
.styles-module__drawCanvas___7cG9U.styles-module__active___-zoN6[data-stroke-hover] {
  cursor: pointer !important;
}

.styles-module__dragSelection___kZLq2 {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid color-mix(in srgb, var(--agentation-color-green) 60%, transparent);
  border-radius: 4px;
  background-color: color-mix(in srgb, var(--agentation-color-green) 8%, transparent);
  pointer-events: none;
  z-index: 99997;
  will-change: transform, width, height;
  contain: layout style;
}

.styles-module__dragCount___KM90j {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--agentation-color-green);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
}

.styles-module__highlightsContainer___-0xzG {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99996;
}

.styles-module__selectedElementHighlight___fyVlI {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, var(--agentation-color-green) 6%, transparent);
  pointer-events: none;
  will-change: transform, width, height;
  contain: layout style;
}

[data-agentation-theme=light] .styles-module__toolbarContainer___dIhma {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
[data-agentation-theme=light] .styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #f5f5f5;
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-active=true] {
  color: var(--agentation-color-blue);
  background: color-mix(in srgb, var(--agentation-color-blue) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-error=true] {
  color: var(--agentation-color-red);
  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  color: var(--agentation-color-red);
  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: var(--agentation-color-green);
  background: transparent;
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-failed=true] {
  color: var(--agentation-color-red);
  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__buttonTooltip___Burd9 {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
[data-agentation-theme=light] .styles-module__buttonTooltip___Burd9::after {
  background: #fff;
}
[data-agentation-theme=light] .styles-module__divider___c--s1 {
  background: rgba(0, 0, 0, 0.1);
}`,Ky={toolbar:"styles-module__toolbar___wNsdK",markersLayer:"styles-module__markersLayer___-25j1",fixedMarkersLayer:"styles-module__fixedMarkersLayer___ffyX6",controlsContent:"styles-module__controlsContent___9GJWU",disableTransitions:"styles-module__disableTransitions___EopxO",toolbarContainer:"styles-module__toolbarContainer___dIhma",entrance:"styles-module__entrance___sgHd8",toolbarEnter:"styles-module__toolbarEnter___u8RRu",hiding:"styles-module__hiding___1td44",toolbarHide:"styles-module__toolbarHide___y8kaT",collapsed:"styles-module__collapsed___Rydsn",expanded:"styles-module__expanded___ofKPx",serverConnected:"styles-module__serverConnected___Gfbou",toggleContent:"styles-module__toggleContent___0yfyP",visible:"styles-module__visible___KHwEW",hidden:"styles-module__hidden___Ae8H4",badge:"styles-module__badge___2XsgF",fadeOut:"styles-module__fadeOut___6Ut6-",badgeEnter:"styles-module__badgeEnter___mVQLj",controlButton:"styles-module__controlButton___8Q0jc",statusShowing:"styles-module__statusShowing___te6iu",buttonBadge:"styles-module__buttonBadge___NeFWb",mcpIndicator:"styles-module__mcpIndicator___zGJeL",connected:"styles-module__connected___7c28g",mcpIndicatorPulseConnected:"styles-module__mcpIndicatorPulseConnected___EDodZ",connecting:"styles-module__connecting___uo-CW",mcpIndicatorPulseConnecting:"styles-module__mcpIndicatorPulseConnecting___cCYte",connectionIndicatorWrapper:"styles-module__connectionIndicatorWrapper___L-e-3",connectionIndicator:"styles-module__connectionIndicator___afk9p",connectionIndicatorVisible:"styles-module__connectionIndicatorVisible___C-i5B",connectionIndicatorConnected:"styles-module__connectionIndicatorConnected___IY8pR",connectionPulse:"styles-module__connectionPulse___-Zycw",connectionIndicatorDisconnected:"styles-module__connectionIndicatorDisconnected___kmpaZ",connectionIndicatorConnecting:"styles-module__connectionIndicatorConnecting___QmSLH",buttonWrapper:"styles-module__buttonWrapper___rBcdv",buttonTooltip:"styles-module__buttonTooltip___Burd9",tooltipsInSession:"styles-module__tooltipsInSession___-0lHH",sendButtonWrapper:"styles-module__sendButtonWrapper___UUxG6",sendButtonVisible:"styles-module__sendButtonVisible___WPSQU",shortcut:"styles-module__shortcut___lEAQk",tooltipBelow:"styles-module__tooltipBelow___m6ats",tooltipsHidden:"styles-module__tooltipsHidden___VtLJG",tooltipVisible:"styles-module__tooltipVisible___0jcCv",buttonWrapperAlignLeft:"styles-module__buttonWrapperAlignLeft___myzIp",buttonWrapperAlignRight:"styles-module__buttonWrapperAlignRight___HCQFR",divider:"styles-module__divider___c--s1",overlay:"styles-module__overlay___Q1O9y",hoverHighlight:"styles-module__hoverHighlight___ogakW",enter:"styles-module__enter___WFIki",hoverHighlightIn:"styles-module__hoverHighlightIn___6WYHY",multiSelectOutline:"styles-module__multiSelectOutline___cSJ-m",fadeIn:"styles-module__fadeIn___b9qmf",exit:"styles-module__exit___fyOJ0",singleSelectOutline:"styles-module__singleSelectOutline___QhX-O",hoverTooltip:"styles-module__hoverTooltip___bvLk7",hoverTooltipIn:"styles-module__hoverTooltipIn___FYGQx",hoverReactPath:"styles-module__hoverReactPath___gx1IJ",hoverElementName:"styles-module__hoverElementName___QMLMl",marker:"styles-module__marker___6sQrs",clearing:"styles-module__clearing___FQ--7",markerIn:"styles-module__markerIn___5FaAP",markerOut:"styles-module__markerOut___GU5jX",pending:"styles-module__pending___2IHLC",fixed:"styles-module__fixed___dBMHC",multiSelect:"styles-module__multiSelect___YWiuz",hovered:"styles-module__hovered___ZgXIy",renumber:"styles-module__renumber___nCTxD",renumberRoll:"styles-module__renumberRoll___Wgbq3",markerTooltip:"styles-module__markerTooltip___aLJID",tooltipIn:"styles-module__tooltipIn___0N31w",markerQuote:"styles-module__markerQuote___FHmrz",markerNote:"styles-module__markerNote___QkrrS",markerHint:"styles-module__markerHint___2iF-6",settingsPanel:"styles-module__settingsPanel___OxX3Y",settingsHeader:"styles-module__settingsHeader___pwDY9",settingsBrand:"styles-module__settingsBrand___0gJeM",settingsBrandSlash:"styles-module__settingsBrandSlash___uTG18",settingsVersion:"styles-module__settingsVersion___TUcFq",settingsSection:"styles-module__settingsSection___m-YM2",settingsLabel:"styles-module__settingsLabel___8UjfX",cycleButton:"styles-module__cycleButton___FMKfw",cycleDot:"styles-module__cycleDot___nPgLY",dropdownButton:"styles-module__dropdownButton___16NPz",toggleLabel:"styles-module__toggleLabel___Xm8Aa",customCheckbox:"styles-module__customCheckbox___U39ax",sliderLabel:"styles-module__sliderLabel___U8sPr",slider:"styles-module__slider___GLdxp",themeToggle:"styles-module__themeToggle___2rUjA",settingsOption:"styles-module__settingsOption___UNa12",selected:"styles-module__selected___OwRqP",settingsPanelContainer:"styles-module__settingsPanelContainer___Xksv8",settingsPage:"styles-module__settingsPage___6YfHH",slideLeft:"styles-module__slideLeft___Ps01J",automationsPage:"styles-module__automationsPage___uvCq6",slideIn:"styles-module__slideIn___4-qXe",settingsNavLink:"styles-module__settingsNavLink___wCzJt",settingsNavLinkRight:"styles-module__settingsNavLinkRight___ZWwhj",mcpNavIndicator:"styles-module__mcpNavIndicator___cl9pO",mcpPulse:"styles-module__mcpPulse___uNggr",settingsBackButton:"styles-module__settingsBackButton___bIe2j",automationHeader:"styles-module__automationHeader___InP0r",automationDescription:"styles-module__automationDescription___NKlmo",learnMoreLink:"styles-module__learnMoreLink___8xv-x",autoSendRow:"styles-module__autoSendRow___UblX5",autoSendLabel:"styles-module__autoSendLabel___icDc2",active:"styles-module__active___-zoN6",webhookUrlInput:"styles-module__webhookUrlInput___2375C",settingsSectionExtraPadding:"styles-module__settingsSectionExtraPadding___jdhFV",settingsSectionGrow:"styles-module__settingsSectionGrow___h-5HZ",settingsRow:"styles-module__settingsRow___3sdhc",settingsRowMarginTop:"styles-module__settingsRowMarginTop___zA0Sp",dropdownContainer:"styles-module__dropdownContainer___BVnxe",settingsRowDisabled:"styles-module__settingsRowDisabled___EgS0V",toggleSwitch:"styles-module__toggleSwitch___l4Ygm",cycleButtonText:"styles-module__cycleButtonText___fD1LR",cycleTextIn:"styles-module__cycleTextIn___Q6zJf",cycleDots:"styles-module__cycleDots___LWuoQ",dropdownMenu:"styles-module__dropdownMenu___k73ER",scaleIn:"styles-module__scaleIn___c-r1K",dropdownItem:"styles-module__dropdownItem___ylsLj",settingsLabelMarker:"styles-module__settingsLabelMarker___ewdtV",settingsOptions:"styles-module__settingsOptions___LyrBA",sliderContainer:"styles-module__sliderContainer___ducXj",sliderLabels:"styles-module__sliderLabels___FhLDB",colorOptions:"styles-module__colorOptions___iHCNX",colorOption:"styles-module__colorOption___IodiY",colorOptionRing:"styles-module__colorOptionRing___U2xpo",settingsToggle:"styles-module__settingsToggle___fBrFn",settingsToggleMarginBottom:"styles-module__settingsToggleMarginBottom___MZUyF",checked:"styles-module__checked___mnZLo",toggleSlider:"styles-module__toggleSlider___wprIn",disabled:"styles-module__disabled___332Jw",mcpStatusDot:"styles-module__mcpStatusDot___ibgkc",disconnected:"styles-module__disconnected___cHPxR",mcpPulseError:"styles-module__mcpPulseError___fov9B",drawCanvas:"styles-module__drawCanvas___7cG9U",dragSelection:"styles-module__dragSelection___kZLq2",dragCount:"styles-module__dragCount___KM90j",highlightsContainer:"styles-module__highlightsContainer___-0xzG",selectedElementHighlight:"styles-module__selectedElementHighlight___fyVlI",scaleOut:"styles-module__scaleOut___Wctwz",slideUp:"styles-module__slideUp___kgD36",slideDown:"styles-module__slideDown___zcdje"};if(typeof document<"u"){let s=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");s||(s=document.createElement("style"),s.id="feedback-tool-styles-page-toolbar-css-styles",document.head.appendChild(s)),s.textContent=Zy}var te=Ky,Rs=[{value:"compact",label:"Compact"},{value:"standard",label:"Standard"},{value:"detailed",label:"Detailed"},{value:"forensic",label:"Forensic"}];function S_(s,r,c="standard"){if(s.length===0)return"";const u=typeof window<"u"?`${window.innerWidth}×${window.innerHeight}`:"unknown";let _=`## Page Feedback: ${r}
`;return c==="forensic"?(_+=`
**Environment:**
`,_+=`- Viewport: ${u}
`,typeof window<"u"&&(_+=`- URL: ${window.location.href}
`,_+=`- User Agent: ${navigator.userAgent}
`,_+=`- Timestamp: ${new Date().toISOString()}
`,_+=`- Device Pixel Ratio: ${window.devicePixelRatio}
`),_+=`
---
`):c!=="compact"&&(_+=`**Viewport:** ${u}
`),_+=`
`,s.forEach((f,b)=>{c==="compact"?(_+=`${b+1}. **${f.element}**${f.sourceFile?` (${f.sourceFile})`:""}: ${f.comment}`,f.selectedText&&(_+=` (re: "${f.selectedText.slice(0,30)}${f.selectedText.length>30?"...":""}")`),_+=`
`):c==="forensic"?(_+=`### ${b+1}. ${f.element}
`,f.isMultiSelect&&f.fullPath&&(_+=`*Forensic data shown for first element of selection*
`),f.fullPath&&(_+=`**Full DOM Path:** ${f.fullPath}
`),f.cssClasses&&(_+=`**CSS Classes:** ${f.cssClasses}
`),f.boundingBox&&(_+=`**Position:** x:${Math.round(f.boundingBox.x)}, y:${Math.round(f.boundingBox.y)} (${Math.round(f.boundingBox.width)}×${Math.round(f.boundingBox.height)}px)
`),_+=`**Annotation at:** ${f.x.toFixed(1)}% from left, ${Math.round(f.y)}px from top
`,f.selectedText&&(_+=`**Selected text:** "${f.selectedText}"
`),f.nearbyText&&!f.selectedText&&(_+=`**Context:** ${f.nearbyText.slice(0,100)}
`),f.computedStyles&&(_+=`**Computed Styles:** ${f.computedStyles}
`),f.accessibility&&(_+=`**Accessibility:** ${f.accessibility}
`),f.nearbyElements&&(_+=`**Nearby Elements:** ${f.nearbyElements}
`),f.sourceFile&&(_+=`**Source:** ${f.sourceFile}
`),f.reactComponents&&(_+=`**React:** ${f.reactComponents}
`),_+=`**Feedback:** ${f.comment}

`):(_+=`### ${b+1}. ${f.element}
`,_+=`**Location:** ${f.elementPath}
`,f.sourceFile&&(_+=`**Source:** ${f.sourceFile}
`),f.reactComponents&&(_+=`**React:** ${f.reactComponents}
`),c==="detailed"&&(f.cssClasses&&(_+=`**Classes:** ${f.cssClasses}
`),f.boundingBox&&(_+=`**Position:** ${Math.round(f.boundingBox.x)}px, ${Math.round(f.boundingBox.y)}px (${Math.round(f.boundingBox.width)}×${Math.round(f.boundingBox.height)}px)
`)),f.selectedText&&(_+=`**Selected text:** "${f.selectedText}"
`),c==="detailed"&&f.nearbyText&&!f.selectedText&&(_+=`**Context:** ${f.nearbyText.slice(0,100)}
`),_+=`**Feedback:** ${f.comment}

`)}),_.trim()}var Fy=`@keyframes styles-module__markerIn___x4G8D {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes styles-module__markerOut___6VhQN {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
}
@keyframes styles-module__tooltipIn___aJslQ {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(2px) scale(0.891);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(0.909);
  }
}
@keyframes styles-module__renumberRoll___akV9B {
  0% {
    transform: translateX(-40%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.styles-module__marker___9CKF7 {
  position: absolute;
  width: 22px;
  height: 22px;
  background: var(--agentation-color-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  user-select: none;
  will-change: transform, opacity;
  contain: layout style;
  z-index: 1;
}
.styles-module__marker___9CKF7:hover {
  z-index: 2;
}
.styles-module__marker___9CKF7:not(.styles-module__enter___8kI3q):not(.styles-module__exit___KBdR3):not(.styles-module__clearing___8rM7K) {
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.styles-module__marker___9CKF7.styles-module__enter___8kI3q {
  animation: styles-module__markerIn___x4G8D 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.styles-module__marker___9CKF7.styles-module__exit___KBdR3 {
  animation: styles-module__markerOut___6VhQN 0.2s ease-out both;
  pointer-events: none;
}
.styles-module__marker___9CKF7.styles-module__clearing___8rM7K {
  animation: styles-module__markerOut___6VhQN 0.15s ease-out both;
  pointer-events: none;
}
.styles-module__marker___9CKF7:not(.styles-module__enter___8kI3q):not(.styles-module__exit___KBdR3):not(.styles-module__clearing___8rM7K):hover {
  transform: translate(-50%, -50%) scale(1.1);
}
.styles-module__marker___9CKF7.styles-module__pending___BiY-U {
  position: fixed;
  background-color: var(--agentation-color-blue);
  cursor: default;
}
.styles-module__marker___9CKF7.styles-module__fixed___aKrQO {
  position: fixed;
}
.styles-module__marker___9CKF7.styles-module__multiSelect___CPfTC {
  background-color: var(--agentation-color-green);
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-size: 0.75rem;
}
.styles-module__marker___9CKF7.styles-module__multiSelect___CPfTC.styles-module__pending___BiY-U {
  background-color: var(--agentation-color-green);
}
.styles-module__marker___9CKF7.styles-module__hovered___-mg2N {
  background-color: var(--agentation-color-red);
}

.styles-module__renumber___16lvD {
  display: block;
  animation: styles-module__renumberRoll___akV9B 0.2s ease-out;
}

.styles-module__markerTooltip___-VUm- {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.909);
  z-index: 100002;
  background: #1a1a1a;
  padding: 8px 0.75rem;
  border-radius: 0.75rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 400;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  min-width: 120px;
  max-width: 200px;
  pointer-events: none;
  cursor: default;
}
.styles-module__markerTooltip___-VUm-.styles-module__enter___8kI3q {
  animation: styles-module__tooltipIn___aJslQ 0.1s ease-out forwards;
}

.styles-module__markerQuote___tQake {
  display: block;
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.3125rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markerNote___Rh4eI {
  display: block;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 2px;
}

[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- {
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- .styles-module__markerQuote___tQake {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- .styles-module__markerNote___Rh4eI {
  color: rgba(0, 0, 0, 0.85);
}`,Jy={marker:"styles-module__marker___9CKF7",enter:"styles-module__enter___8kI3q",exit:"styles-module__exit___KBdR3",clearing:"styles-module__clearing___8rM7K",pending:"styles-module__pending___BiY-U",fixed:"styles-module__fixed___aKrQO",multiSelect:"styles-module__multiSelect___CPfTC",hovered:"styles-module__hovered___-mg2N",renumber:"styles-module__renumber___16lvD",markerTooltip:"styles-module__markerTooltip___-VUm-",markerQuote:"styles-module__markerQuote___tQake",markerNote:"styles-module__markerNote___Rh4eI"};if(typeof document<"u"){let s=document.getElementById("feedback-tool-styles-annotation-marker-styles");s||(s=document.createElement("style"),s.id="feedback-tool-styles-annotation-marker-styles",document.head.appendChild(s)),s.textContent=Fy}var cn=Jy;function k_({annotation:s,globalIndex:r,layerIndex:c,layerSize:u,isExiting:_,isClearing:f,isAnimated:b,isHovered:R,isDeleting:x,isEditingAny:M,renumberFrom:E,markerClickBehavior:$,tooltipStyle:D,onHoverEnter:ue,onHoverLeave:H,onClick:ne,onContextMenu:U}){const G=(R||x)&&!M,_e=G&&$==="delete",ve=s.isMultiSelect,we=ve?"var(--agentation-color-green)":"var(--agentation-color-accent)",_t=_?cn.exit:f?cn.clearing:b?"":cn.enter,nt=_?`${(u-1-c)*20}ms`:`${c*20}ms`;return o.jsxs("div",{className:`${cn.marker} ${ve?cn.multiSelect:""} ${_t} ${_e?cn.hovered:""}`,"data-annotation-marker":!0,style:{left:`${s.x}%`,top:s.y,backgroundColor:_e?void 0:we,animationDelay:nt},onMouseEnter:()=>ue(s),onMouseLeave:H,onClick:oe=>{oe.stopPropagation(),_||ne(s)},onContextMenu:U?oe=>{$==="delete"&&(oe.preventDefault(),oe.stopPropagation(),_||U(s))}:void 0,children:[G?_e?o.jsx(Xd,{size:ve?18:16}):o.jsx(dm,{size:16}):o.jsx("span",{className:E!==null&&r>=E?cn.renumber:void 0,children:r+1}),R&&!M&&o.jsxs("div",{className:`${cn.markerTooltip} ${cn.enter}`,style:D,children:[o.jsxs("span",{className:cn.markerQuote,children:[s.element,s.selectedText&&` "${s.selectedText.slice(0,30)}${s.selectedText.length>30?"...":""}"`]}),o.jsx("span",{className:cn.markerNote,children:s.comment})]})]})}function Py({x:s,y:r,isMultiSelect:c,isExiting:u}){return o.jsx("div",{className:`${cn.marker} ${cn.pending} ${c?cn.multiSelect:""} ${u?cn.exit:cn.enter}`,style:{left:`${s}%`,top:r,backgroundColor:c?"var(--agentation-color-green)":"var(--agentation-color-accent)"},children:o.jsx(P0,{size:12})})}function j_({annotation:s,fixed:r}){const c=s.isMultiSelect;return o.jsx("div",{className:`${cn.marker} ${r?cn.fixed:""} ${cn.hovered} ${c?cn.multiSelect:""} ${cn.exit}`,"data-annotation-marker":!0,style:{left:`${s.x}%`,top:s.y},children:o.jsx(Xd,{size:c?12:10})})}var ep=`.styles-module__switchContainer___Ka-AB {
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px;
  width: 24px;
  height: 16px;
  border-radius: 8px;
  background-color: #cdcdcd;
  transition: background-color 0.15s, opacity 0.15s;
}
[data-agentation-theme=dark] .styles-module__switchContainer___Ka-AB {
  background-color: #484848;
}
.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:checked) {
  background-color: var(--agentation-color-blue);
}
.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:disabled) {
  opacity: 0.3;
}

.styles-module__switchInput___kYDSD {
  position: absolute;
  z-index: 1;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  cursor: pointer;
}
.styles-module__switchInput___kYDSD:disabled {
  cursor: not-allowed;
}

.styles-module__switchThumb___4sCPH {
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background-color: #fff;
  transition: transform 0.15s;
}
.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:checked) .styles-module__switchThumb___4sCPH {
  transform: translateX(8px);
}`,tp={switchContainer:"styles-module__switchContainer___Ka-AB",switchInput:"styles-module__switchInput___kYDSD",switchThumb:"styles-module__switchThumb___4sCPH"};if(typeof document<"u"){let s=document.getElementById("feedback-tool-styles-switch-styles");s||(s=document.createElement("style"),s.id="feedback-tool-styles-switch-styles",document.head.appendChild(s)),s.textContent=ep}var Rc=tp,Dc=({className:s="",...r})=>o.jsxs("div",{className:`${Rc.switchContainer} ${s}`,children:[o.jsx("input",{className:Rc.switchInput,type:"checkbox",...r}),o.jsx("div",{className:Rc.switchThumb})]}),np=`.styles-module__checkboxContainer___joqZk {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid rgba(26, 26, 26, 0.2);
  border-radius: 4px;
  width: 14px;
  height: 14px;
  background-color: #fff;
  transition: background-color 0.2s ease;
}
[data-agentation-theme=dark] .styles-module__checkboxContainer___joqZk {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: #252525;
}
.styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) {
  background-color: #1a1a1a;
}
[data-agentation-theme=dark] .styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) {
  background-color: #fff;
}

.styles-module__checkboxInput___ECzzO {
  position: absolute;
  z-index: 1;
  inset: -1px;
  border-radius: inherit;
  opacity: 0;
  cursor: pointer;
}

.styles-module__checkboxCheck___fUXpr {
  color: #fafafa;
}
[data-agentation-theme=dark] .styles-module__checkboxCheck___fUXpr {
  color: #1a1a1a;
}

.styles-module__checkboxCheckPath___cDyh8 {
  stroke-dasharray: 9.29px;
  stroke-dashoffset: 9.29px;
  color: #fafafa;
  transition: stroke-dashoffset 0.1s ease;
}
[data-agentation-theme=dark] .styles-module__checkboxCheckPath___cDyh8 {
  color: #1a1a1a;
}
.styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) .styles-module__checkboxCheckPath___cDyh8 {
  transition-duration: 0.2s;
  stroke-dashoffset: 0;
}`,lp={checkboxContainer:"styles-module__checkboxContainer___joqZk",checkboxInput:"styles-module__checkboxInput___ECzzO",checkboxCheck:"styles-module__checkboxCheck___fUXpr",checkboxCheckPath:"styles-module__checkboxCheckPath___cDyh8"};if(typeof document<"u"){let s=document.getElementById("feedback-tool-styles-checkbox-styles");s||(s=document.createElement("style"),s.id="feedback-tool-styles-checkbox-styles",document.head.appendChild(s)),s.textContent=np}var Ui=lp,op=({className:s="",...r})=>o.jsxs("div",{className:`${Ui.checkboxContainer} ${s}`,children:[o.jsx("input",{className:Ui.checkboxInput,type:"checkbox",...r}),o.jsx("svg",{className:Ui.checkboxCheck,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:o.jsx("path",{className:Ui.checkboxCheckPath,d:"M3.94 7L6.13 9.19L10.5 4.81",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),ap=`.styles-module__container___w8eAF {
  display: flex;
  align-items: center;
  height: 24px;
}

.styles-module__label___J5mxE {
  padding-inline: 8px 2px;
  line-height: 20px;
  font-size: 13px;
  letter-spacing: -0.15px;
  color: rgba(26, 26, 26, 0.5);
  cursor: pointer;
}
[data-agentation-theme=dark] .styles-module__label___J5mxE {
  color: rgba(255, 255, 255, 0.5);
}`,sp={container:"styles-module__container___w8eAF",label:"styles-module__label___J5mxE"};if(typeof document<"u"){let s=document.getElementById("feedback-tool-styles-checkbox-field-styles");s||(s=document.createElement("style"),s.id="feedback-tool-styles-checkbox-field-styles",document.head.appendChild(s)),s.textContent=ap}var C_=sp,M_=({className:s="",label:r,tooltip:c,checked:u,onChange:_,...f})=>{const b=y.useId();return o.jsxs("div",{className:`${C_.container} ${s}`,...f,children:[o.jsx(op,{id:b,onChange:_,checked:u}),o.jsx("label",{className:C_.label,htmlFor:b,children:r}),c&&o.jsx(la,{content:c})]})},ip=`@keyframes styles-module__cycleTextIn___VBNTi {
  0% {
    opacity: 0;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes styles-module__scaleIn___QpQ8E {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__mcpPulse___5Q3Jj {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
}
@keyframes styles-module__mcpPulseError___VHxhx {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 50%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-red) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 0%, transparent);
  }
}
@keyframes styles-module__themeIconIn___qUWMV {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-30deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
.styles-module__settingsPanel___qNkn- {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  z-index: 1;
  overflow: hidden;
  background: #1c1c1c;
  border-radius: 16px;
  padding: 12px 0;
  width: 100%;
  max-width: 253px;
  min-width: 205px;
  cursor: default;
  opacity: 1;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}
.styles-module__settingsPanel___qNkn-::before, .styles-module__settingsPanel___qNkn-::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 2;
  pointer-events: none;
}
.styles-module__settingsPanel___qNkn-::before {
  left: 0;
  background: linear-gradient(to right, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___qNkn-::after {
  right: 0;
  background: linear-gradient(to left, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___qNkn- .styles-module__settingsHeader___Fn1DP,
.styles-module__settingsPanel___qNkn- .styles-module__settingsBrand___OoKlM,
.styles-module__settingsPanel___qNkn- .styles-module__settingsBrandSlash___Q-AU9,
.styles-module__settingsPanel___qNkn- .styles-module__settingsVersion___rXmL9,
.styles-module__settingsPanel___qNkn- .styles-module__settingsSection___n5V-4,
.styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ,
.styles-module__settingsPanel___qNkn- .styles-module__cycleButton___XMBx3,
.styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY,
.styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8,
.styles-module__settingsPanel___qNkn- .styles-module__sliderLabel___6K5v1,
.styles-module__settingsPanel___qNkn- .styles-module__slider___v5z-c,
.styles-module__settingsPanel___qNkn- .styles-module__themeToggle___3imlT {
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__settingsPanel___qNkn-.styles-module__enter___wginS {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__settingsPanel___qNkn-.styles-module__exit___A4iJc {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- {
  background: #1a1a1a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ {
  color: rgba(255, 255, 255, 0.6);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH- {
  color: rgba(255, 255, 255, 0.85);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH-:hover {
  background: rgba(255, 255, 255, 0.1);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH-.styles-module__selected___k1-Vq {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.styles-module__settingsPanelContainer___5it-H {
  overflow: visible;
  position: relative;
  display: flex;
  padding: 0 16px;
}

.styles-module__settingsPage___BMn-3 {
  min-width: 100%;
  flex-basis: 0;
  flex-shrink: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
  transition-delay: 0s;
  opacity: 1;
}

.styles-module__settingsPage___BMn-3.styles-module__slideLeft___qUvW4 {
  transform: translateX(-24px);
  opacity: 0;
  pointer-events: none;
}

.styles-module__automationsPage___N7By0 {
  position: absolute;
  top: 0;
  left: 24px;
  width: 100%;
  height: 100%;
  padding: 0 16px 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0;
  pointer-events: none;
}

.styles-module__automationsPage___N7By0.styles-module__slideIn___uXDSu {
  transform: translateX(-24px);
  opacity: 1;
  pointer-events: auto;
}

.styles-module__settingsHeader___Fn1DP {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
}

.styles-module__settingsBrand___OoKlM {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.0094em;
  color: #fff;
  text-decoration: none;
}

.styles-module__settingsBrandSlash___Q-AU9 {
  color: var(--agentation-color-accent);
  transition: color 0.2s ease;
}

.styles-module__settingsVersion___rXmL9 {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin-left: auto;
  letter-spacing: -0.0094em;
}

.styles-module__themeToggle___3imlT {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  transition: background-color 0.15s ease, color 0.15s ease;
  cursor: pointer;
}
.styles-module__themeToggle___3imlT:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}
[data-agentation-theme=light] .styles-module__themeToggle___3imlT {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__themeToggle___3imlT:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.7);
}

.styles-module__themeIconWrapper___pyaYa {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 20px;
  height: 20px;
}

.styles-module__themeIcon___w7lAm {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: styles-module__themeIconIn___qUWMV 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.styles-module__settingsSectionGrow___eZTRw {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.styles-module__settingsRow___y-tDE {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}
.styles-module__settingsRow___y-tDE.styles-module__settingsRowMarginTop___uLpGb {
  margin-top: 8px;
}

.styles-module__settingsRowDisabled___ydl3Q .styles-module__settingsLabel___VCVOQ {
  color: rgba(255, 255, 255, 0.2);
}
[data-agentation-theme=light] .styles-module__settingsRowDisabled___ydl3Q .styles-module__settingsLabel___VCVOQ {
  color: rgba(0, 0, 0, 0.2);
}

.styles-module__settingsLabel___VCVOQ {
  display: flex;
  align-items: center;
  column-gap: 2px;
  line-height: 20px;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.15px;
  color: rgba(255, 255, 255, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsLabel___VCVOQ {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__cycleButton___XMBx3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  letter-spacing: -0.0094em;
}
[data-agentation-theme=light] .styles-module__cycleButton___XMBx3 {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__cycleButton___XMBx3:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.styles-module__cycleButtonText___mbbnD {
  display: inline-block;
  animation: styles-module__cycleTextIn___VBNTi 0.2s ease-out;
}

.styles-module__cycleDots___ehp6i {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.styles-module__cycleDot___zgSXY {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.667);
  transition: background-color 0.25s ease-out, transform 0.25s ease-out;
}
.styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {
  background: #fff;
  transform: scale(1);
}
[data-agentation-theme=light] .styles-module__cycleDot___zgSXY {
  background: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {
  background: rgba(0, 0, 0, 0.7);
}

.styles-module__colorOptions___pbxZx {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  height: 26px;
}

.styles-module__colorOption___Co955 {
  padding: 0;
  position: relative;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: #fff;
  cursor: pointer;
}
[data-agentation-theme=dark] .styles-module__colorOption___Co955 {
  background-color: #1a1a1a;
}
.styles-module__colorOption___Co955::before, .styles-module__colorOption___Co955::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: var(--swatch);
  transition: opacity 0.2s, transform 0.2s;
}
@supports (color: color(display-p3 0 0 0)) {
  .styles-module__colorOption___Co955::before, .styles-module__colorOption___Co955::after {
    --color: var(--swatch-p3);
  }
}
.styles-module__colorOption___Co955::after {
  z-index: -1;
  transform: scale(1.2);
  opacity: 0;
}
.styles-module__colorOption___Co955.styles-module__selected___k1-Vq::before {
  transform: scale(0.8);
}
.styles-module__colorOption___Co955.styles-module__selected___k1-Vq::after {
  opacity: 1;
}

.styles-module__settingsNavLink___uYIwM {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  line-height: 20px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.15s ease;
  cursor: pointer;
}
.styles-module__settingsNavLink___uYIwM:hover {
  color: rgba(255, 255, 255, 0.9);
}
.styles-module__settingsNavLink___uYIwM svg {
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___uYIwM:hover svg {
  color: #fff;
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM:hover {
  color: rgba(0, 0, 0, 0.8);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM svg {
  color: rgba(0, 0, 0, 0.25);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM:hover svg {
  color: rgba(0, 0, 0, 0.8);
}

.styles-module__settingsNavLinkRight___XBUzC {
  display: flex;
  align-items: center;
  gap: 6px;
}

.styles-module__settingsBackButton___fflll {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  background: transparent;
  font-family: inherit;
  line-height: 20px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.12s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___fflll svg {
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___fflll:hover svg {
  opacity: 1;
}
[data-agentation-theme=light] .styles-module__settingsBackButton___fflll {
  color: rgba(0, 0, 0, 0.85);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.styles-module__automationHeader___Avra9 {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #fff;
}
[data-agentation-theme=light] .styles-module__automationHeader___Avra9 {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__automationDescription___vFTmJ {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  line-height: 14px;
}
[data-agentation-theme=light] .styles-module__automationDescription___vFTmJ {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__learnMoreLink___cG7OI {
  color: rgba(255, 255, 255, 0.8);
  text-decoration-line: underline;
  text-decoration-style: dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__learnMoreLink___cG7OI:hover {
  color: #fff;
}
[data-agentation-theme=light] .styles-module__learnMoreLink___cG7OI {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__learnMoreLink___cG7OI:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__autoSendContainer___VpkXk {
  display: flex;
  align-items: center;
}

.styles-module__autoSendLabel___ngNdC {
  padding-inline-end: 8px;
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s, opacity 0.15s;
  cursor: pointer;
}
.styles-module__autoSendLabel___ngNdC.styles-module__active___dpAhM {
  color: #66b8ff;
  color: color(display-p3 0.4 0.72 1);
}
[data-agentation-theme=light] .styles-module__autoSendLabel___ngNdC {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__autoSendLabel___ngNdC.styles-module__active___dpAhM {
  color: var(--agentation-color-blue);
}
.styles-module__autoSendLabel___ngNdC.styles-module__disabled___9AZYS {
  opacity: 0.3;
  cursor: not-allowed;
}

.styles-module__mcpStatusDot___8AMxP {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpStatusDot___8AMxP.styles-module__connecting___QEO1r {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpPulse___5Q3Jj 1.5s infinite;
}
.styles-module__mcpStatusDot___8AMxP.styles-module__connected___WyFkx {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpPulse___5Q3Jj 2.5s ease-in-out infinite;
}
.styles-module__mcpStatusDot___8AMxP.styles-module__disconnected___mvmvQ {
  background-color: var(--agentation-color-red);
  animation: styles-module__mcpPulseError___VHxhx 2s infinite;
}

.styles-module__mcpNavIndicator___auBHI {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpNavIndicator___auBHI.styles-module__connected___WyFkx {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpPulse___5Q3Jj 2.5s ease-in-out infinite;
}
.styles-module__mcpNavIndicator___auBHI.styles-module__connecting___QEO1r {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpPulse___5Q3Jj 1.5s ease-in-out infinite;
}

.styles-module__webhookUrlInput___WDDDC {
  display: block;
  width: 100%;
  flex: 1;
  min-height: 60px;
  box-sizing: border-box;
  margin-top: 11px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: #fff;
  outline: none;
  resize: none;
  user-select: text;
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}
.styles-module__webhookUrlInput___WDDDC::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__webhookUrlInput___WDDDC:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC {
  border-color: rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn-::before {
  background: linear-gradient(to right, #fff 0%, transparent 100%);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn-::after {
  background: linear-gradient(to left, #fff 0%, transparent 100%);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsHeader___Fn1DP {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsBrand___OoKlM {
  color: #E5484D;
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsVersion___rXmL9 {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsSection___n5V-4 {
  border-top-color: rgba(0, 0, 0, 0.08);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleButton___XMBx3 {
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY {
  background: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {
  background: rgba(0, 0, 0, 0.7);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8 {
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8:hover {
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__checkboxField___ZrSqv:not(:first-child) {
  margin-top: 8px;
}

.styles-module__divider___h6Yux {
  margin-block: 8px;
  width: 100%;
  height: 1px;
  background-color: rgba(26, 26, 26, 0.07);
}
[data-agentation-theme=dark] .styles-module__divider___h6Yux {
  background-color: rgba(255, 255, 255, 0.07);
}`,rp={settingsPanel:"styles-module__settingsPanel___qNkn-",settingsHeader:"styles-module__settingsHeader___Fn1DP",settingsBrand:"styles-module__settingsBrand___OoKlM",settingsBrandSlash:"styles-module__settingsBrandSlash___Q-AU9",settingsVersion:"styles-module__settingsVersion___rXmL9",settingsSection:"styles-module__settingsSection___n5V-4",settingsLabel:"styles-module__settingsLabel___VCVOQ",cycleButton:"styles-module__cycleButton___XMBx3",cycleDot:"styles-module__cycleDot___zgSXY",dropdownButton:"styles-module__dropdownButton___mKHe8",sliderLabel:"styles-module__sliderLabel___6K5v1",slider:"styles-module__slider___v5z-c",themeToggle:"styles-module__themeToggle___3imlT",enter:"styles-module__enter___wginS",exit:"styles-module__exit___A4iJc",settingsOption:"styles-module__settingsOption___JoyH-",selected:"styles-module__selected___k1-Vq",settingsPanelContainer:"styles-module__settingsPanelContainer___5it-H",settingsPage:"styles-module__settingsPage___BMn-3",slideLeft:"styles-module__slideLeft___qUvW4",automationsPage:"styles-module__automationsPage___N7By0",slideIn:"styles-module__slideIn___uXDSu",themeIconWrapper:"styles-module__themeIconWrapper___pyaYa",themeIcon:"styles-module__themeIcon___w7lAm",themeIconIn:"styles-module__themeIconIn___qUWMV",settingsSectionGrow:"styles-module__settingsSectionGrow___eZTRw",settingsRow:"styles-module__settingsRow___y-tDE",settingsRowMarginTop:"styles-module__settingsRowMarginTop___uLpGb",settingsRowDisabled:"styles-module__settingsRowDisabled___ydl3Q",cycleButtonText:"styles-module__cycleButtonText___mbbnD",cycleTextIn:"styles-module__cycleTextIn___VBNTi",cycleDots:"styles-module__cycleDots___ehp6i",active:"styles-module__active___dpAhM",colorOptions:"styles-module__colorOptions___pbxZx",colorOption:"styles-module__colorOption___Co955",settingsNavLink:"styles-module__settingsNavLink___uYIwM",settingsNavLinkRight:"styles-module__settingsNavLinkRight___XBUzC",settingsBackButton:"styles-module__settingsBackButton___fflll",automationHeader:"styles-module__automationHeader___Avra9",automationDescription:"styles-module__automationDescription___vFTmJ",learnMoreLink:"styles-module__learnMoreLink___cG7OI",autoSendContainer:"styles-module__autoSendContainer___VpkXk",autoSendLabel:"styles-module__autoSendLabel___ngNdC",disabled:"styles-module__disabled___9AZYS",mcpStatusDot:"styles-module__mcpStatusDot___8AMxP",connecting:"styles-module__connecting___QEO1r",mcpPulse:"styles-module__mcpPulse___5Q3Jj",connected:"styles-module__connected___WyFkx",disconnected:"styles-module__disconnected___mvmvQ",mcpPulseError:"styles-module__mcpPulseError___VHxhx",mcpNavIndicator:"styles-module__mcpNavIndicator___auBHI",webhookUrlInput:"styles-module__webhookUrlInput___WDDDC",checkboxField:"styles-module__checkboxField___ZrSqv",divider:"styles-module__divider___h6Yux",scaleIn:"styles-module__scaleIn___QpQ8E"};if(typeof document<"u"){let s=document.getElementById("feedback-tool-styles-settings-panel-styles");s||(s=document.createElement("style"),s.id="feedback-tool-styles-settings-panel-styles",document.head.appendChild(s)),s.textContent=ip}var ye=rp;function cp({settings:s,onSettingsChange:r,isDarkMode:c,onToggleTheme:u,isDevMode:_,connectionStatus:f,endpoint:b,isVisible:R,toolbarNearBottom:x,settingsPage:M,onSettingsPageChange:E,onHideToolbar:$}){return o.jsx("div",{className:`${ye.settingsPanel} ${R?ye.enter:ye.exit}`,style:x?{bottom:"auto",top:"calc(100% + 0.5rem)"}:void 0,"data-agentation-settings-panel":!0,children:o.jsxs("div",{className:ye.settingsPanelContainer,children:[o.jsxs("div",{className:`${ye.settingsPage} ${M==="automations"?ye.slideLeft:""}`,children:[o.jsxs("div",{className:ye.settingsHeader,children:[o.jsx("a",{className:ye.settingsBrand,href:"https://agentation.com",target:"_blank",rel:"noopener noreferrer",children:o.jsx("svg",{width:"72",height:"16",viewBox:"0 0 676 151",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:o.jsx("path",{d:"M79.6666 100.561L104.863 15.5213C107.828 4.03448 99.1201 -3.00582 88.7449 1.25541L3.52015 39.6065C1.48217 40.5329 0 42.7562 0 45.1647C0 48.6848 2.77907 51.4639 6.29922 51.4639C7.22558 51.4639 8.15193 51.2786 9.07829 50.9081L93.7472 12.7422C97.2674 11.0748 93.7472 8.29572 92.6356 12.1864L67.624 97.2259C66.5123 100.931 69.4767 105.193 73.7379 105.193C76.517 105.193 79.1108 103.155 79.6666 100.561ZM663.641 100.005C665.679 107.231 677.537 104.081 675.499 96.8553L666.05 66.2856C663.456 57.7631 655.489 55.7251 648.82 61.098L618.991 86.6654C617.324 87.9623 621.029 89.815 621.214 88.1476L625.846 61.6538C626.958 55.3546 624.179 50.5375 615.841 50.5375L579.158 51.0934C576.008 51.0934 578.417 53.8724 578.417 57.022C578.417 60.1716 580.825 61.6538 583.975 61.6538L616.212 60.9127C616.397 60.9127 614.544 59.6158 614.544 59.8011L609.727 88.7034C607.875 99.6344 617.694 102.784 626.031 95.7437L655.86 70.1763L654.192 69.6205L663.641 100.005ZM571.191 89.0739C555.443 88.7034 562.298 61.4685 578.787 61.8391C594.72 62.0243 587.124 89.2592 571.191 89.0739ZM571.006 100.375C601.575 100.931 611.024 51.6492 579.158 51.0934C547.847 50.5375 540.065 99.8197 571.006 100.375ZM521.909 46.4616C525.985 46.4616 529.505 42.9414 529.505 38.6802C529.505 34.4189 525.985 31.0841 521.909 31.0841C517.833 31.0841 514.127 34.6042 514.127 38.6802C514.127 42.7562 517.648 46.4616 521.909 46.4616ZM472.256 103.525C493.192 103.71 515.98 73.3259 519.13 62.3949L509.866 60.9127C505.234 73.3259 497.638 101.672 519.871 102.043C536.545 102.228 552.479 85.3685 563.595 70.1763C564.151 69.2499 564.706 68.1383 564.706 66.8414C564.706 63.6918 563.965 61.098 560.816 61.098C558.963 61.098 557.296 62.0243 556.184 63.5065C546.365 77.0313 530.802 90.9266 522.094 90.7414C511.904 90.5561 517.462 71.4732 519.871 64.9887C523.391 55.7251 512.831 53.5019 509.681 60.9127C506.531 68.6941 488.19 92.4088 475.035 92.2235C467.439 92.0383 464.29 83.8863 472.441 59.9864L486.707 17.7445C487.634 14.4097 485.41 10.519 481.334 10.519C478.741 10.519 476.517 12.1864 475.962 14.4097L461.696 56.4662C451.506 86.4801 455.211 103.155 472.256 103.525ZM447.43 42.5709L496.527 41.4593C499.306 41.4593 501.529 39.0507 501.529 36.2717C501.529 33.3073 499.306 31.0841 496.341 31.0841L447.245 32.1957C444.466 32.1957 442.242 34.4189 442.242 37.3833C442.242 40.1624 444.466 42.5709 447.43 42.5709ZM422.974 106.304C435.387 106.489 457.249 94.8173 472.441 53.8724C473.553 50.7228 472.071 48.3143 468.365 48.3143C466.142 48.3143 464.29 49.6112 463.548 51.6492C450.394 87.2212 431.682 96.1142 424.456 95.929C419.454 95.929 417.972 93.3352 418.713 85.5538C419.454 78.1429 410.376 74.9933 406.114 81.1073C401.297 87.777 394.442 94.2615 385.549 94.0763C370.172 93.891 376.471 67.0267 399.815 67.3972C408.338 67.5825 414.452 71.4732 417.045 76.6608C417.786 78.3282 419.454 79.6251 421.492 79.6251C424.271 79.6251 426.679 77.2166 426.679 74.4375C426.679 73.6964 426.494 72.9553 426.124 72.2143C421.862 63.6918 412.414 57.3926 400 57.2073C363.502 56.6515 353.497 104.451 383.326 104.822C397.036 105.193 410.005 94.0763 413.34 85.9243C412.599 86.8507 408.338 86.6654 408.523 84.4422C407.411 97.4111 410.931 106.119 422.974 106.304ZM335.897 104.266C335.897 115.012 347.569 117.606 347.569 103.34C347.569 89.0739 358.5 54.4282 361.464 45.1647L396.666 43.6825C405.929 43.1267 404.262 33.1221 397.036 33.3073L364.984 34.4189L368.875 22.7469C369.801 20.1531 370.542 17.9298 370.542 16.2624C370.542 13.4833 368.504 11.8159 365.911 11.8159C362.946 11.8159 360.352 12.7422 357.573 21.0794L352.942 35.16L330.153 36.0864C326.263 36.4569 323.483 38.1244 323.483 41.6445C323.483 45.5352 326.448 47.0174 330.709 46.8321L349.421 45.9058C345.901 56.6515 335.897 90.7414 335.897 104.266ZM186.939 78.6988C193.979 56.4662 212.877 54.984 212.877 62.9507C212.877 68.3236 203.984 77.0313 186.939 78.6988ZM113.942 150.955C142.844 152.437 159.704 111.492 160.63 80.5515C161.556 73.3259 153.96 70.3616 148.773 75.7344C141.918 83.1453 129.505 93.1499 119.685 93.1499C103.011 93.1499 116.165 59.8011 143.956 59.8011C149.514 59.8011 153.59 61.6538 156.184 64.0623C160.815 68.3236 170.82 62.0243 165.818 56.0957C161.927 51.4639 155.072 48.129 144.882 48.129C102.455 48.129 83.7426 105.007 116.721 105.007C134.692 105.007 151.367 88.3329 155.257 82.7747C154.516 83.5158 149.329 81.2925 149.699 79.4398L149.143 83.5158C148.958 107.045 134.322 141.506 116.536 139.838C113.386 139.468 112.089 137.43 112.089 134.836C112.089 128.907 122.094 119.273 145.067 113.53C159.518 109.824 152.293 101.487 143.4 104.081C111.163 113.53 99.6759 127.425 99.6759 137.8C99.6759 145.026 105.605 150.584 113.942 150.955ZM194.72 109.454C214.359 109.454 239 95.3732 251.228 77.9577C250.301 82.96 246.596 96.8553 246.596 101.487C246.596 110.01 254.748 109.454 261.232 102.784L288.097 75.5491L290.32 85.7391C293.284 99.4491 299.213 104.822 308.847 104.822C326.263 104.822 342.196 85.7391 349.421 74.8081L344.049 63.6918C339.787 74.8081 321.631 92.5941 311.626 92.5941C306.994 92.5941 304.771 89.815 303.289 83.7011L300.325 71.2879C297.916 60.7275 289.023 58.3189 279.018 68.1383L261.788 84.8127L264.382 69.991C266.235 59.2453 255.674 58.1337 250.116 65.915C241.779 77.0313 216.767 97.7817 196.387 97.7817C187.865 97.7817 185.456 93.7057 185.456 88.3329C230.848 84.998 239.185 47.2027 208.986 47.2027C172.858 47.2027 157.11 109.454 194.72 109.454Z",fill:"currentColor"})})}),o.jsxs("p",{className:ye.settingsVersion,children:["v","3.0.2"]}),o.jsx("button",{className:ye.themeToggle,onClick:u,title:c?"Switch to light mode":"Switch to dark mode",children:o.jsx("span",{className:ye.themeIconWrapper,children:o.jsx("span",{className:ye.themeIcon,children:c?o.jsx(cm,{size:20}):o.jsx(um,{size:20})},c?"sun":"moon")})})]}),o.jsx("div",{className:ye.divider}),o.jsxs("div",{className:ye.settingsSection,children:[o.jsxs("div",{className:ye.settingsRow,children:[o.jsxs("div",{className:ye.settingsLabel,children:["Output Detail",o.jsx(la,{content:"Controls how much detail is included in the copied output"})]}),o.jsxs("button",{className:ye.cycleButton,onClick:()=>{const ue=(Rs.findIndex(H=>H.value===s.outputDetail)+1)%Rs.length;r({outputDetail:Rs[ue].value})},children:[o.jsx("span",{className:ye.cycleButtonText,children:Rs.find(D=>D.value===s.outputDetail)?.label},s.outputDetail),o.jsx("span",{className:ye.cycleDots,children:Rs.map(D=>o.jsx("span",{className:`${ye.cycleDot} ${s.outputDetail===D.value?ye.active:""}`},D.value))})]})]}),o.jsxs("div",{className:`${ye.settingsRow} ${ye.settingsRowMarginTop} ${_?"":ye.settingsRowDisabled}`,children:[o.jsxs("div",{className:ye.settingsLabel,children:["React Components",o.jsx(la,{content:_?"Include React component names in annotations":"Disabled — production builds minify component names, making detection unreliable. Use in development mode."})]}),o.jsx(Dc,{checked:_&&s.reactEnabled,onChange:D=>r({reactEnabled:D.target.checked}),disabled:!_})]}),o.jsxs("div",{className:`${ye.settingsRow} ${ye.settingsRowMarginTop}`,children:[o.jsxs("div",{className:ye.settingsLabel,children:["Hide Until Restart",o.jsx(la,{content:"Hides the toolbar until you open a new tab"})]}),o.jsx(Dc,{checked:!1,onChange:D=>{D.target.checked&&$()}})]})]}),o.jsx("div",{className:ye.divider}),o.jsxs("div",{className:ye.settingsSection,children:[o.jsx("div",{className:`${ye.settingsLabel} ${ye.settingsLabelMarker}`,children:"Marker Color"}),o.jsx("div",{className:ye.colorOptions,children:Ds.map(D=>o.jsx("button",{className:`${ye.colorOption} ${s.annotationColorId===D.id?ye.selected:""}`,style:{"--swatch":D.srgb,"--swatch-p3":D.p3},onClick:()=>r({annotationColorId:D.id}),title:D.label,type:"button"},D.id))})]}),o.jsx("div",{className:ye.divider}),o.jsxs("div",{className:ye.settingsSection,children:[o.jsx(M_,{className:"checkbox-field",label:"Clear on copy/send",checked:s.autoClearAfterCopy,onChange:D=>r({autoClearAfterCopy:D.target.checked}),tooltip:"Automatically clear annotations after copying"}),o.jsx(M_,{className:ye.checkboxField,label:"Block page interactions",checked:s.blockInteractions,onChange:D=>r({blockInteractions:D.target.checked})})]}),o.jsx("div",{className:ye.divider}),o.jsxs("button",{className:ye.settingsNavLink,onClick:()=>E("automations"),children:[o.jsx("span",{children:"Manage MCP & Webhooks"}),o.jsxs("span",{className:ye.settingsNavLinkRight,children:[b&&f!=="disconnected"&&o.jsx("span",{className:`${ye.mcpNavIndicator} ${ye[f]}`}),o.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:o.jsx("path",{d:"M7.5 12.5L12 8L7.5 3.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]})]})]}),o.jsxs("div",{className:`${ye.settingsPage} ${ye.automationsPage} ${M==="automations"?ye.slideIn:""}`,children:[o.jsxs("button",{className:ye.settingsBackButton,onClick:()=>E("main"),children:[o.jsx(fm,{size:16}),o.jsx("span",{children:"Manage MCP & Webhooks"})]}),o.jsx("div",{className:ye.divider}),o.jsxs("div",{className:ye.settingsSection,children:[o.jsxs("div",{className:ye.settingsRow,children:[o.jsxs("span",{className:ye.automationHeader,children:["MCP Connection",o.jsx(la,{content:"Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time."})]}),b&&o.jsx("div",{className:`${ye.mcpStatusDot} ${ye[f]}`,title:f==="connected"?"Connected":f==="connecting"?"Connecting...":"Disconnected"})]}),o.jsxs("p",{className:ye.automationDescription,style:{paddingBottom:6},children:["MCP connection allows agents to receive and act on annotations."," ",o.jsx("a",{href:"https://agentation.dev/mcp",target:"_blank",rel:"noopener noreferrer",className:ye.learnMoreLink,children:"Learn more"})]})]}),o.jsx("div",{className:ye.divider}),o.jsxs("div",{className:`${ye.settingsSection} ${ye.settingsSectionGrow}`,children:[o.jsxs("div",{className:ye.settingsRow,children:[o.jsxs("span",{className:ye.automationHeader,children:["Webhooks",o.jsx(la,{content:"Send annotation data to any URL endpoint when annotations change. Useful for custom integrations."})]}),o.jsxs("div",{className:ye.autoSendContainer,children:[o.jsx("label",{htmlFor:"agentation-auto-send",className:`${ye.autoSendLabel} ${s.webhooksEnabled?ye.active:""} ${s.webhookUrl?"":ye.disabled}`,children:"Auto-Send"}),o.jsx(Dc,{id:"agentation-auto-send",checked:s.webhooksEnabled,onChange:D=>r({webhooksEnabled:D.target.checked}),disabled:!s.webhookUrl})]})]}),o.jsx("p",{className:ye.automationDescription,children:"The webhook URL will receive live annotation changes and annotation data."}),o.jsx("textarea",{className:ye.webhookUrlInput,placeholder:"Webhook URL",value:s.webhookUrl,onKeyDown:D=>D.stopPropagation(),onChange:D=>r({webhookUrl:D.target.value})})]})]})]})})}function Nc(s,r="filtered"){const{name:c,path:u}=Ba(s);if(r==="off")return{name:c,elementName:c,path:u,reactComponents:null};const _=Ly(s,{mode:r});return{name:_.path?`${_.path} ${c}`:c,elementName:c,path:u,reactComponents:_.path}}var E_=!1,Ac={outputDetail:"standard",autoClearAfterCopy:!1,annotationColorId:"blue",blockInteractions:!0,reactEnabled:!0,markerClickBehavior:"edit",webhookUrl:"",webhooksEnabled:!0},Hl=s=>{if(!s||!s.trim())return!1;try{const r=new URL(s.trim());return r.protocol==="http:"||r.protocol==="https:"}catch{return!1}},Ds=[{id:"indigo",label:"Indigo",srgb:"#6155F5",p3:"color(display-p3 0.38 0.33 0.96)"},{id:"blue",label:"Blue",srgb:"#0088FF",p3:"color(display-p3 0.00 0.53 1.00)"},{id:"cyan",label:"Cyan",srgb:"#00C3D0",p3:"color(display-p3 0.00 0.76 0.82)"},{id:"green",label:"Green",srgb:"#34C759",p3:"color(display-p3 0.20 0.78 0.35)"},{id:"yellow",label:"Yellow",srgb:"#FFCC00",p3:"color(display-p3 1.00 0.80 0.00)"},{id:"orange",label:"Orange",srgb:"#FF8D28",p3:"color(display-p3 1.00 0.55 0.16)"},{id:"red",label:"Red",srgb:"#FF383C",p3:"color(display-p3 1.00 0.22 0.24)"}],up=()=>{if(typeof document>"u"||document.getElementById("agentation-color-tokens"))return;const s=document.createElement("style");s.id="agentation-color-tokens",s.textContent=[...Ds.map(r=>`
      [data-agentation-accent="${r.id}"] {
        --agentation-color-accent: ${r.srgb};
      }

      @supports (color: color(display-p3 0 0 0)) {
        [data-agentation-accent="${r.id}"] {
          --agentation-color-accent: ${r.p3};
        }
      }
    `),`:root {
      ${Ds.map(r=>`--agentation-color-${r.id}: ${r.srgb};`).join(`
`)}
    }`,`@supports (color: color(display-p3 0 0 0)) {
      :root {
        ${Ds.map(r=>`--agentation-color-${r.id}: ${r.p3};`).join(`
`)}
      }
    }`].join(""),document.head.appendChild(s)};up();function sa(s,r){let c=document.elementFromPoint(s,r);if(!c)return null;for(;c?.shadowRoot;){const u=c.shadowRoot.elementFromPoint(s,r);if(!u||u===c)break;c=u}return c}function Bc(s){let r=s;for(;r&&r!==document.body;){const u=window.getComputedStyle(r).position;if(u==="fixed"||u==="sticky")return!0;r=r.parentElement}return!1}function ia(s){return s.status!=="resolved"&&s.status!=="dismissed"}function Yi(s){const r=zc(s),c=r.found?r:Vy(s);if(c.found&&c.source)return Gy(c.source,"path")}function dp({demoAnnotations:s,demoDelay:r=1e3,enableDemoMode:c=!1,onAnnotationAdd:u,onAnnotationDelete:_,onAnnotationUpdate:f,onAnnotationsClear:b,onCopy:R,onSubmit:x,copyToClipboard:M=!0,endpoint:E,sessionId:$,onSessionCreated:D,webhookUrl:ue,className:H}={}){const[ne,U]=y.useState(!1),[G,_e]=y.useState([]),[ve,we]=y.useState(!0),[_t,nt]=y.useState(()=>Sy()),[oe,ot]=y.useState(!1),rt=y.useRef(null);y.useEffect(()=>{const m=S=>{const k=rt.current;k&&k.contains(S.target)&&S.stopPropagation()},p=["mousedown","click","pointerdown"];return p.forEach(S=>document.body.addEventListener(S,m)),()=>{p.forEach(S=>document.body.removeEventListener(S,m))}},[]);const[at,$e]=y.useState(!1),[tt,xt]=y.useState(!1),[Ye,Qe]=y.useState(null),[T,ae]=y.useState({x:0,y:0}),[X,de]=y.useState(null),[je,w]=y.useState(!1),[I,ie]=y.useState("idle"),[fe,Ne]=y.useState(!1),[Ze,st]=y.useState(!1),[Zt,Nt]=y.useState(null),[Zn,Sn]=y.useState(null),[kn,In]=y.useState([]),[bn,gl]=y.useState(null),[al,Ul]=y.useState(null),[Z,Ce]=y.useState(null),[We,He]=y.useState(null),[Ke,jt]=y.useState([]),[Ge,lt]=y.useState(0),[Ct,Qt]=y.useState(!1),[Te,N]=y.useState(!1),[O,F]=y.useState(!1),[ee,pe]=y.useState(!1),[se,le]=y.useState(!1),[Re,Ve]=y.useState("main"),[gt,Mt]=y.useState(!1),[Se,ft]=y.useState(!1),[ut,Fe]=y.useState(!1),[xe,bt]=y.useState([]),[Je,Be]=y.useState(null),St=y.useRef(!1),[Pe,Kn]=y.useState(!1),[En,Bn]=y.useState(!1),[sl,On]=y.useState(1),[Yl,ra]=y.useState("new-page"),[en,jn]=y.useState(""),[an,Ln]=y.useState(!1),[Oe,$n]=y.useState(null),Ns=y.useRef(!1),As=y.useRef({rearrange:null,placements:[]}),Xl=y.useRef({rearrange:null,placements:[]}),[ca,$a]=y.useState(0),[ko,jo]=y.useState(0),[ua,Il]=y.useState(0),[hn,Bs]=y.useState(0),Co=y.useRef(new Set),yl=y.useRef(new Set),Cn=y.useRef(null),Ha=y.useRef(),Os=Se&&ne&&!ut&&Pe;y.useEffect(()=>{if(Os){Bn(!1);const m=Da(()=>{Bn(!0)});return()=>cancelAnimationFrame(m)}else Bn(!1)},[Os]);const Mo=y.useRef(new Map),da=y.useRef(new Map),ql=y.useRef(),[Hn,il]=y.useState(!1),[Kt,Xi]=y.useState([]),Oc=y.useRef(Kt);Oc.current=Kt;const[Ua,Lc]=y.useState(null),Eo=y.useRef(null);y.useRef(!1),y.useRef([]),y.useRef(0),y.useRef(null),y.useRef(null),y.useRef(1);const[Ii,qn]=y.useState(!1),Ql=y.useRef(null),[nn,Wl]=y.useState([]),Tn=y.useRef({cmd:!1,shift:!1}),vn=()=>{Mt(!0)},qi=()=>{Mt(!1)},To=()=>{Ii||(Ql.current=Le(()=>qn(!0),850))},$c=()=>{Ql.current&&(clearTimeout(Ql.current),Ql.current=null),qn(!1),qi()};y.useEffect(()=>()=>{Ql.current&&clearTimeout(Ql.current)},[]);const[ht,Qi]=y.useState(()=>{try{const m=JSON.parse(localStorage.getItem("feedback-toolbar-settings")??"");return{...Ac,...m,annotationColorId:Ds.find(p=>p.id===m.annotationColorId)?m.annotationColorId:Ac.annotationColorId}}catch{return Ac}}),[Fn,Wi]=y.useState(!0),[Gi,_a]=y.useState(!1),Dl=()=>{rt.current?.classList.add(te.disableTransitions),Wi(m=>!m),Da(()=>{rt.current?.classList.remove(te.disableTransitions)})},Ls=!1,Nl="off",[Wt,Gl]=y.useState($??null),$s=y.useRef(!1),[Qn,Vl]=y.useState(E?"connecting":"disconnected"),[Ot,rl]=y.useState(null),[Al,zo]=y.useState(!1),[Wn,Ya]=y.useState(null),Ro=y.useRef(!1),[Hs,Zl]=y.useState(new Set),[fa,ha]=y.useState(new Set),[mn,pl]=y.useState(!1),[Xa,xl]=y.useState(!1),[Bl,Ia]=y.useState(!1),Kl=y.useRef(null),Un=y.useRef(null),Fl=y.useRef(null),Do=y.useRef(null),qa=y.useRef(!1),Vi=y.useRef(0),Qa=y.useRef(null),Wa=y.useRef(null),Us=8,Hc=50,Zi=y.useRef(null),Ki=y.useRef(null),ma=y.useRef(null),Ue=typeof window<"u"?window.location.pathname:"/";y.useEffect(()=>{if(ee)le(!0);else{Mt(!1),Ve("main");const m=Le(()=>le(!1),0);return()=>clearTimeout(m)}},[ee]);const Ys=ne&&ve&&!Se;y.useEffect(()=>{if(Ys){xt(!1),$e(!0),Zl(new Set);const m=Le(()=>{Zl(p=>{const S=new Set(p);return G.forEach(k=>S.add(k.id)),S})},350);return()=>clearTimeout(m)}else if(at){xt(!0);const m=Le(()=>{$e(!1),xt(!1)},250);return()=>clearTimeout(m)}},[Ys]),y.useEffect(()=>{N(!0),lt(window.scrollY);const m=wc(Ue);_e(m.filter(ia)),E_||(_a(!0),E_=!0,Le(()=>_a(!1),750));try{const p=localStorage.getItem("feedback-toolbar-theme");p!==null&&Wi(p==="dark")}catch{}try{const p=localStorage.getItem("feedback-toolbar-position");if(p){const S=JSON.parse(p);typeof S.x=="number"&&typeof S.y=="number"&&rl(S)}}catch{}},[Ue]),y.useEffect(()=>{Te&&localStorage.setItem("feedback-toolbar-settings",JSON.stringify(ht))},[ht,Te]),y.useEffect(()=>{Te&&localStorage.setItem("feedback-toolbar-theme",Fn?"dark":"light")},[Fn,Te]);const Fi=y.useRef(!1);y.useEffect(()=>{const m=Fi.current;Fi.current=Al,m&&!Al&&Ot&&Te&&localStorage.setItem("feedback-toolbar-position",JSON.stringify(Ot))},[Al,Ot,Te]),y.useEffect(()=>{if(!E||!Te||$s.current)return;$s.current=!0,Vl("connecting"),(async()=>{try{const p=vy(Ue),S=$||p;let k=!1;if(S)try{const j=await x_(E,S);Gl(j.id),Vl("connected"),Mc(Ue,j.id),k=!0;const W=wc(Ue),re=new Set(j.annotations.map(ge=>ge.id)),ce=W.filter(ge=>!re.has(ge.id));if(ce.length>0){const Me=`${typeof window<"u"?window.location.origin:""}${Ue}`,Ie=(await Promise.allSettled(ce.map(De=>Oa(E,j.id,{...De,sessionId:j.id,url:Me})))).map((De,he)=>De.status==="fulfilled"?De.value:(console.warn("[Agentation] Failed to sync annotation:",De.reason),ce[he])),dt=[...j.annotations,...Ie];_e(dt.filter(ia)),Ms(Ue,dt.filter(ia),j.id)}else _e(j.annotations.filter(ia)),Ms(Ue,j.annotations.filter(ia),j.id)}catch(j){console.warn("[Agentation] Could not join session, creating new:",j),wy(Ue)}if(!k){const j=typeof window<"u"?window.location.href:"/",W=await Ec(E,j);Gl(W.id),Vl("connected"),Mc(Ue,W.id),D?.(W.id);const re=fy(),ce=typeof window<"u"?window.location.origin:"",ge=[];for(const[Me,ze]of re){const Ie=ze.filter(he=>!he._syncedTo);if(Ie.length===0)continue;const dt=`${ce}${Me}`,De=Me===Ue;ge.push((async()=>{try{const he=De?W:await Ec(E,dt),un=(await Promise.allSettled(Ie.map(Rt=>Oa(E,he.id,{...Rt,sessionId:he.id,url:dt})))).map((Rt,on)=>Rt.status==="fulfilled"?Rt.value:(console.warn("[Agentation] Failed to sync annotation:",Rt.reason),Ie[on])).filter(ia);if(Ms(Me,un,he.id),De){const Rt=new Set(Ie.map(on=>on.id));_e(on=>{const ke=on.filter(qe=>!Rt.has(qe.id));return[...un,...ke]})}}catch(he){console.warn(`[Agentation] Failed to sync annotations for ${Me}:`,he)}})())}await Promise.allSettled(ge)}}catch(p){Vl("disconnected"),console.warn("[Agentation] Failed to initialize session, using local storage:",p)}})()},[E,$,Te,D,Ue]),y.useEffect(()=>{if(!E||!Te)return;const m=async()=>{try{(await fetch(`${E}/health`)).ok?Vl("connected"):Vl("disconnected")}catch{Vl("disconnected")}};m();const p=gm(m,1e4);return()=>clearInterval(p)},[E,Te]),y.useEffect(()=>{if(!E||!Te||!Wt)return;const m=new EventSource(`${E}/sessions/${Wt}/events`),p=["resolved","dismissed"],S=k=>{try{const j=JSON.parse(k.data);if(p.includes(j.payload?.status)){const W=j.payload.id,re=j.payload.kind;if(re==="placement"){for(const[ce,ge]of Mo.current)if(ge===W){Mo.current.delete(ce),bt(Me=>Me.filter(ze=>ze.id!==ce));break}}else if(re==="rearrange"){for(const[ce,ge]of da.current)if(ge===W){da.current.delete(ce),$n(Me=>{if(!Me)return null;const ze=Me.sections.filter(Ie=>Ie.id!==ce);return ze.length===0?null:{...Me,sections:ze}});break}}else ha(ce=>new Set(ce).add(W)),Le(()=>{_e(ce=>ce.filter(ge=>ge.id!==W)),ha(ce=>{const ge=new Set(ce);return ge.delete(W),ge})},150)}}catch{}};return m.addEventListener("annotation.updated",S),()=>{m.removeEventListener("annotation.updated",S),m.close()}},[E,Te,Wt]),y.useEffect(()=>{if(!E||!Te)return;const m=Wa.current==="disconnected",p=Qn==="connected";Wa.current=Qn,m&&p&&(async()=>{try{const k=wc(Ue);if(k.length===0)return;const W=`${typeof window<"u"?window.location.origin:""}${Ue}`;let re=Wt,ce=[];if(re)try{ce=(await x_(E,re)).annotations}catch{re=null}re||(re=(await Ec(E,W)).id,Gl(re),Mc(Ue,re));const ge=new Set(ce.map(ze=>ze.id)),Me=k.filter(ze=>!ge.has(ze.id));if(Me.length>0){const Ie=(await Promise.allSettled(Me.map(he=>Oa(E,re,{...he,sessionId:re,url:W})))).map((he,ln)=>he.status==="fulfilled"?he.value:(console.warn("[Agentation] Failed to sync annotation on reconnect:",he.reason),Me[ln])),De=[...ce,...Ie].filter(ia);_e(De),Ms(Ue,De,re)}}catch(k){console.warn("[Agentation] Failed to sync on reconnect:",k)}})()},[Qn,E,Te,Wt,Ue]);const Uc=y.useCallback(()=>{oe||(ot(!0),pe(!1),U(!1),Le(()=>{ky(!0),nt(!0),ot(!1)},400))},[oe]);y.useEffect(()=>{if(!c||!Te||!s||s.length===0||G.length>0)return;const m=[];return m.push(Le(()=>{U(!0)},r-200)),s.forEach((p,S)=>{const k=r+S*300;m.push(Le(()=>{const j=document.querySelector(p.selector);if(!j)return;const W=j.getBoundingClientRect(),{name:re,path:ce}=Ba(j),ge={id:`demo-${Date.now()}-${S}`,x:(W.left+W.width/2)/window.innerWidth*100,y:W.top+W.height/2+window.scrollY,comment:p.comment,element:re,elementPath:ce,timestamp:Date.now(),selectedText:p.selectedText,boundingBox:{x:W.left,y:W.top+window.scrollY,width:W.width,height:W.height},nearbyText:js(j),cssClasses:Cs(j)};_e(Me=>[...Me,ge])},k))}),()=>{m.forEach(clearTimeout)}},[c,Te,s,r]),y.useEffect(()=>{const m=()=>{lt(window.scrollY),Qt(!0),ma.current&&clearTimeout(ma.current),ma.current=Le(()=>{Qt(!1)},150)};return window.addEventListener("scroll",m,{passive:!0}),()=>{window.removeEventListener("scroll",m),ma.current&&clearTimeout(ma.current)}},[]),y.useEffect(()=>{Te&&G.length>0?Wt?Ms(Ue,G,Wt):m_(Ue,G):Te&&G.length===0&&localStorage.removeItem(Li(Ue))},[G,Ue,Te,Wt]),y.useEffect(()=>{if(Te&&!St.current){St.current=!0;const m=hy(Ue);m.length>0&&bt(m)}},[Te,Ue]),y.useEffect(()=>{Te&&St.current&&!Pe&&(xe.length>0?my(Ue,xe):gy(Ue))},[xe,Ue,Te,Pe]),y.useEffect(()=>{if(Te&&!Ns.current){Ns.current=!0;const m=yy(Ue);if(m){const p={...m,sections:m.sections.map(S=>({...S,currentRect:S.currentRect??{...S.originalRect}}))};$n(p)}}},[Te,Ue]),y.useEffect(()=>{Te&&Ns.current&&!Pe&&(Oe?py(Ue,Oe):xy(Ue))},[Oe,Ue,Te,Pe]);const Xs=y.useRef(!1);y.useEffect(()=>{if(Te&&!Xs.current){Xs.current=!0;const m=by(Ue);m&&(Xl.current={rearrange:m.rearrange,placements:m.placements||[]},m.purpose&&jn(m.purpose))}},[Te,Ue]),y.useEffect(()=>{if(!Te||!Xs.current)return;const m=Xl.current;Pe?(Oe?.sections?.length??0)>0||xe.length>0||en?g_(Ue,{rearrange:Oe,placements:xe,purpose:en}):$i(Ue):(m.rearrange?.sections?.length??0)>0||m.placements.length>0||en?g_(Ue,{rearrange:m.rearrange,placements:m.placements,purpose:en}):$i(Ue)},[Oe,xe,en,Pe,Ue,Te]),y.useEffect(()=>{Se&&!Oe&&$n({sections:[],originalOrder:[],detectedAt:Date.now()})},[Se,Oe]),y.useEffect(()=>{if(!E||!Wt)return;const m=Mo.current,p=new Set(xe.map(S=>S.id));for(const S of xe){if(m.has(S.id))continue;m.set(S.id,"");const k=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Ue;Oa(E,Wt,{id:S.id,x:S.x/window.innerWidth*100,y:S.y,comment:`Place ${S.type} at (${Math.round(S.x)}, ${Math.round(S.y)}), ${S.width}×${S.height}px${S.text?` — "${S.text}"`:""}`,element:`[design:${S.type}]`,elementPath:"[placement]",timestamp:S.timestamp,url:k,intent:"change",severity:"important",kind:"placement",placement:{componentType:S.type,width:S.width,height:S.height,scrollY:S.scrollY,text:S.text}}).then(j=>{m.has(S.id)&&m.set(S.id,j.id)}).catch(j=>{console.warn("[Agentation] Failed to sync placement annotation:",j),m.delete(S.id)})}for(const[S,k]of m)p.has(S)||(m.delete(S),k&&So(E,k).catch(()=>{}))},[xe,E,Wt,Ue]),y.useEffect(()=>{if(!(!E||!Wt))return ql.current&&clearTimeout(ql.current),ql.current=Le(()=>{const m=da.current;if(!Oe||Oe.sections.length===0){for(const[,k]of m)k&&So(E,k).catch(()=>{});m.clear();return}const p=new Set(Oe.sections.map(k=>k.id)),S=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Ue;for(const k of Oe.sections){const j=k.originalRect,W=k.currentRect;if(!(Math.abs(j.x-W.x)>1||Math.abs(j.y-W.y)>1||Math.abs(j.width-W.width)>1||Math.abs(j.height-W.height)>1)){const ge=m.get(k.id);ge&&(m.delete(k.id),So(E,ge).catch(()=>{}));continue}const ce=m.get(k.id);ce?b_(E,ce,{comment:`Move ${k.label} section (${k.tagName}) — from (${Math.round(j.x)},${Math.round(j.y)}) ${Math.round(j.width)}×${Math.round(j.height)} to (${Math.round(W.x)},${Math.round(W.y)}) ${Math.round(W.width)}×${Math.round(W.height)}`}).catch(ge=>{console.warn("[Agentation] Failed to update rearrange annotation:",ge)}):(m.set(k.id,""),Oa(E,Wt,{id:k.id,x:W.x/window.innerWidth*100,y:W.y,comment:`Move ${k.label} section (${k.tagName}) — from (${Math.round(j.x)},${Math.round(j.y)}) ${Math.round(j.width)}×${Math.round(j.height)} to (${Math.round(W.x)},${Math.round(W.y)}) ${Math.round(W.width)}×${Math.round(W.height)}`,element:k.selector,elementPath:"[rearrange]",timestamp:Date.now(),url:S,intent:"change",severity:"important",kind:"rearrange",rearrange:{selector:k.selector,label:k.label,tagName:k.tagName,originalRect:j,currentRect:W}}).then(ge=>{m.has(k.id)&&m.set(k.id,ge.id)}).catch(ge=>{console.warn("[Agentation] Failed to sync rearrange annotation:",ge),m.delete(k.id)}))}for(const[k,j]of m)p.has(k)||(m.delete(k),j&&So(E,j).catch(()=>{}))},300),()=>{ql.current&&clearTimeout(ql.current)}},[Oe,E,Wt,Ue]);const Jl=y.useRef(new Map);y.useLayoutEffect(()=>{const m=Oe?.sections??[],p=new Set;if((Se||ut)&&ne)for(const S of m){p.add(S.id);try{const k=document.querySelector(S.selector);if(!k)continue;if(!Jl.current.has(S.id)){const j={transform:k.style.transform,transformOrigin:k.style.transformOrigin,opacity:k.style.opacity,position:k.style.position,zIndex:k.style.zIndex,display:k.style.display},W=[];let re=k.parentElement;for(;re&&re!==document.body;){const ge=getComputedStyle(re);(ge.overflow!=="visible"||ge.overflowX!=="visible"||ge.overflowY!=="visible")&&(W.push({el:re,overflow:re.style.overflow}),re.style.overflow="visible"),re=re.parentElement}getComputedStyle(k).display==="inline"&&(k.style.display="inline-block"),Jl.current.set(S.id,{el:k,origStyles:j,ancestors:W}),k.style.transformOrigin="top left",k.style.zIndex="9999"}}catch{}}for(const[S,k]of Jl.current)if(!p.has(S)){const{el:j,origStyles:W,ancestors:re}=k;j.style.transition="transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)",j.style.transform=W.transform,j.style.transformOrigin=W.transformOrigin,j.style.opacity=W.opacity,j.style.position=W.position,j.style.zIndex=W.zIndex,Jl.current.delete(S),Le(()=>{j.style.transition="",j.style.display=W.display;for(const ce of re)ce.el.style.overflow=ce.overflow},450)}},[Oe,Se,ut,ne]),y.useEffect(()=>()=>{for(const[,m]of Jl.current){const{el:p,origStyles:S,ancestors:k}=m;p.style.transition="transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)",p.style.transform=S.transform,p.style.transformOrigin=S.transformOrigin,p.style.opacity=S.opacity,p.style.position=S.position,p.style.zIndex=S.zIndex,Le(()=>{p.style.transition="",p.style.display=S.display;for(const j of k)j.el.style.overflow=j.overflow},450)}Jl.current.clear()},[]);const Ga=y.useCallback(()=>{Fe(!0),ft(!1),Be(null),clearTimeout(Ha.current),Ha.current=Le(()=>{Fe(!1)},300)},[]),Ji=y.useCallback(()=>{Se&&(Fe(!0),ft(!1),Be(null),clearTimeout(Ha.current),Ha.current=Le(()=>{Fe(!1)},300)),U(!1)},[Se]),Pi=y.useCallback(()=>{O||(pm(),F(!0))},[O]),ga=y.useCallback(()=>{O&&(qd(),F(!1))},[O]),Is=y.useCallback(()=>{O?ga():Pi()},[O,Pi,ga]),er=y.useCallback(()=>{if(nn.length===0)return;const m=nn[0],p=m.element,S=nn.length>1,k=nn.map(j=>j.element.getBoundingClientRect());if(S){const j={left:Math.min(...k.map(he=>he.left)),top:Math.min(...k.map(he=>he.top)),right:Math.max(...k.map(he=>he.right)),bottom:Math.max(...k.map(he=>he.bottom))},W=nn.slice(0,5).map(he=>he.name).join(", "),re=nn.length>5?` +${nn.length-5} more`:"",ce=k.map(he=>({x:he.left,y:he.top+window.scrollY,width:he.width,height:he.height})),Me=nn[nn.length-1].element,ze=k[k.length-1],Ie=ze.left+ze.width/2,dt=ze.top+ze.height/2,De=Bc(Me);de({x:Ie/window.innerWidth*100,y:De?dt:dt+window.scrollY,clientY:dt,element:`${nn.length} elements: ${W}${re}`,elementPath:"multi-select",boundingBox:{x:j.left,y:j.top+window.scrollY,width:j.right-j.left,height:j.bottom-j.top},isMultiSelect:!0,isFixed:De,elementBoundingBoxes:ce,multiSelectElements:nn.map(he=>he.element),targetElement:Me,fullPath:Ni(p),accessibility:Di(p),computedStyles:Ri(p),computedStylesObj:zi(p),nearbyElements:Ti(p),cssClasses:Cs(p),nearbyText:js(p),sourceFile:Yi(p)})}else{const j=k[0],W=Bc(p);de({x:j.left/window.innerWidth*100,y:W?j.top:j.top+window.scrollY,clientY:j.top,element:m.name,elementPath:m.path,boundingBox:{x:j.left,y:W?j.top:j.top+window.scrollY,width:j.width,height:j.height},isFixed:W,fullPath:Ni(p),accessibility:Di(p),computedStyles:Ri(p),computedStylesObj:zi(p),nearbyElements:Ti(p),cssClasses:Cs(p),nearbyText:js(p),reactComponents:m.reactComponents,sourceFile:Yi(p)})}Wl([]),Qe(null)},[nn]);y.useEffect(()=>{ne||(de(null),Ce(null),He(null),jt([]),Qe(null),pe(!1),Wl([]),Tn.current={cmd:!1,shift:!1},O&&ga())},[ne,O,ga]),y.useEffect(()=>()=>{qd()},[]),y.useEffect(()=>{if(!ne)return;const m=["p","span","h1","h2","h3","h4","h5","h6","li","td","th","label","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","u","s","a","time","address","cite","q","abbr","dfn","mark","small","sub","sup","[contenteditable]"].join(", "),p=":not([data-agentation-root]):not([data-agentation-root] *)",S=document.createElement("style");return S.id="feedback-cursor-styles",S.textContent=`
      body ${p} {
        cursor: crosshair !important;
      }

      body :is(${m})${p} {
        cursor: text !important;
      }
    `,document.head.appendChild(S),()=>{const k=document.getElementById("feedback-cursor-styles");k&&k.remove()}},[ne]),y.useEffect(()=>{if(Ua!==null&&ne)return document.documentElement.setAttribute("data-drawing-hover",""),()=>document.documentElement.removeAttribute("data-drawing-hover")},[Ua,ne]),y.useEffect(()=>{if(!ne||X||Hn||Se)return;const m=p=>{const S=p.composedPath()[0]||p.target;if(Xn(S,"[data-feedback-toolbar]")){Qe(null);return}const k=sa(p.clientX,p.clientY);if(!k||Xn(k,"[data-feedback-toolbar]")){Qe(null);return}const{name:j,elementName:W,path:re,reactComponents:ce}=Nc(k,Nl),ge=k.getBoundingClientRect();Qe({element:j,elementName:W,elementPath:re,rect:ge,reactComponents:ce}),ae({x:p.clientX,y:p.clientY})};return document.addEventListener("mousemove",m),()=>document.removeEventListener("mousemove",m)},[ne,X,Hn,Se,Nl,Kt]);const Va=y.useCallback(m=>{if(Ce(m),Nt(null),Sn(null),In([]),m.elementBoundingBoxes?.length){const p=[];for(const S of m.elementBoundingBoxes){const k=S.x+S.width/2,j=S.y+S.height/2-window.scrollY,W=sa(k,j);W&&p.push(W)}jt(p),He(null)}else if(m.boundingBox){const p=m.boundingBox,S=p.x+p.width/2,k=m.isFixed?p.y+p.height/2:p.y+p.height/2-window.scrollY,j=sa(S,k);if(j){const W=j.getBoundingClientRect(),re=W.width/p.width,ce=W.height/p.height;re<.5||ce<.5?He(null):He(j)}else He(null);jt([])}else He(null),jt([])},[]);y.useEffect(()=>{if(!ne||Hn||Se)return;const m=p=>{if(qa.current){qa.current=!1;return}const S=p.composedPath()[0]||p.target;if(Xn(S,"[data-feedback-toolbar]")||Xn(S,"[data-annotation-popup]")||Xn(S,"[data-annotation-marker]"))return;if(p.metaKey&&p.shiftKey&&!X&&!Z){p.preventDefault(),p.stopPropagation();const At=sa(p.clientX,p.clientY);if(!At)return;const un=At.getBoundingClientRect(),{name:Rt,path:on,reactComponents:ke}=Nc(At,Nl),qe=nn.findIndex(Gt=>Gt.element===At);qe>=0?Wl(Gt=>Gt.filter((Ft,Jn)=>Jn!==qe)):Wl(Gt=>[...Gt,{element:At,rect:un,name:Rt,path:on,reactComponents:ke??void 0}]);return}const k=Xn(S,"button, a, input, select, textarea, [role='button'], [onclick]");if(ht.blockInteractions&&k&&(p.preventDefault(),p.stopPropagation()),X){if(k&&!ht.blockInteractions)return;p.preventDefault(),Zi.current?.shake();return}if(Z){if(k&&!ht.blockInteractions)return;p.preventDefault(),Ki.current?.shake();return}p.preventDefault();const j=sa(p.clientX,p.clientY);if(!j)return;const{name:W,path:re,reactComponents:ce}=Nc(j,Nl),ge=j.getBoundingClientRect(),Me=p.clientX/window.innerWidth*100,ze=Bc(j),Ie=ze?p.clientY:p.clientY+window.scrollY,dt=window.getSelection();let De;dt&&dt.toString().trim().length>0&&(De=dt.toString().trim().slice(0,500));const he=zi(j),ln=Ri(j);de({x:Me,y:Ie,clientY:p.clientY,element:W,elementPath:re,selectedText:De,boundingBox:{x:ge.left,y:ze?ge.top:ge.top+window.scrollY,width:ge.width,height:ge.height},nearbyText:js(j),cssClasses:Cs(j),isFixed:ze,fullPath:Ni(j),accessibility:Di(j),computedStyles:ln,computedStylesObj:he,nearbyElements:Ti(j),reactComponents:ce??void 0,sourceFile:Yi(j),targetElement:j}),Qe(null)};return document.addEventListener("click",m,!0),()=>document.removeEventListener("click",m,!0)},[ne,Hn,Se,X,Z,ht.blockInteractions,Nl,nn]),y.useEffect(()=>{if(!ne)return;const m=k=>{k.key==="Meta"&&(Tn.current.cmd=!0),k.key==="Shift"&&(Tn.current.shift=!0)},p=k=>{const j=Tn.current.cmd&&Tn.current.shift;k.key==="Meta"&&(Tn.current.cmd=!1),k.key==="Shift"&&(Tn.current.shift=!1);const W=Tn.current.cmd&&Tn.current.shift;j&&!W&&nn.length>0&&er()},S=()=>{Tn.current={cmd:!1,shift:!1},Wl([])};return document.addEventListener("keydown",m),document.addEventListener("keyup",p),window.addEventListener("blur",S),()=>{document.removeEventListener("keydown",m),document.removeEventListener("keyup",p),window.removeEventListener("blur",S)}},[ne,nn,er]),y.useEffect(()=>{if(!ne||X||Hn||Se)return;const m=p=>{const S=p.composedPath()[0]||p.target;Xn(S,"[data-feedback-toolbar]")||Xn(S,"[data-annotation-marker]")||Xn(S,"[data-annotation-popup]")||new Set(["P","SPAN","H1","H2","H3","H4","H5","H6","LI","TD","TH","LABEL","BLOCKQUOTE","FIGCAPTION","CAPTION","LEGEND","DT","DD","PRE","CODE","EM","STRONG","B","I","U","S","A","TIME","ADDRESS","CITE","Q","ABBR","DFN","MARK","SMALL","SUB","SUP"]).has(S.tagName)||S.isContentEditable||(p.preventDefault(),Kl.current={x:p.clientX,y:p.clientY})};return document.addEventListener("mousedown",m),()=>document.removeEventListener("mousedown",m)},[ne,X,Hn,Se]),y.useEffect(()=>{if(!ne||X)return;const m=p=>{if(!Kl.current)return;const S=p.clientX-Kl.current.x,k=p.clientY-Kl.current.y,j=S*S+k*k,W=Us*Us;if(!Bl&&j>=W&&(Un.current=Kl.current,Ia(!0),p.preventDefault()),(Bl||j>=W)&&Un.current){if(Fl.current){const ke=Math.min(Un.current.x,p.clientX),qe=Math.min(Un.current.y,p.clientY),Gt=Math.abs(p.clientX-Un.current.x),Ft=Math.abs(p.clientY-Un.current.y);Fl.current.style.transform=`translate(${ke}px, ${qe}px)`,Fl.current.style.width=`${Gt}px`,Fl.current.style.height=`${Ft}px`}const re=Date.now();if(re-Vi.current<Hc)return;Vi.current=re;const ce=Un.current.x,ge=Un.current.y,Me=Math.min(ce,p.clientX),ze=Math.min(ge,p.clientY),Ie=Math.max(ce,p.clientX),dt=Math.max(ge,p.clientY),De=(Me+Ie)/2,he=(ze+dt)/2,ln=new Set,At=[[Me,ze],[Ie,ze],[Me,dt],[Ie,dt],[De,he],[De,ze],[De,dt],[Me,he],[Ie,he]];for(const[ke,qe]of At){const Gt=document.elementsFromPoint(ke,qe);for(const Ft of Gt)Ft instanceof HTMLElement&&ln.add(Ft)}const un=document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav");for(const ke of un)if(ke instanceof HTMLElement){const qe=ke.getBoundingClientRect(),Gt=qe.left+qe.width/2,Ft=qe.top+qe.height/2,Jn=Gt>=Me&&Gt<=Ie&&Ft>=ze&&Ft<=dt,Gn=Math.min(qe.right,Ie)-Math.max(qe.left,Me),dn=Math.min(qe.bottom,dt)-Math.max(qe.top,ze),ya=Gn>0&&dn>0?Gn*dn:0,Pn=qe.width*qe.height,vl=Pn>0?ya/Pn:0;(Jn||vl>.5)&&ln.add(ke)}const Rt=[],on=new Set(["BUTTON","A","INPUT","IMG","P","H1","H2","H3","H4","H5","H6","LI","LABEL","TD","TH","SECTION","ARTICLE","ASIDE","NAV"]);for(const ke of ln){if(Xn(ke,"[data-feedback-toolbar]")||Xn(ke,"[data-annotation-marker]"))continue;const qe=ke.getBoundingClientRect();if(!(qe.width>window.innerWidth*.8&&qe.height>window.innerHeight*.5)&&!(qe.width<10||qe.height<10)&&qe.left<Ie&&qe.right>Me&&qe.top<dt&&qe.bottom>ze){const Gt=ke.tagName;let Ft=on.has(Gt);if(!Ft&&(Gt==="DIV"||Gt==="SPAN")){const Jn=ke.textContent&&ke.textContent.trim().length>0,Gn=ke.onclick!==null||ke.getAttribute("role")==="button"||ke.getAttribute("role")==="link"||ke.classList.contains("clickable")||ke.hasAttribute("data-clickable");(Jn||Gn)&&!ke.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")&&(Ft=!0)}if(Ft){let Jn=!1;for(const Gn of Rt)if(Gn.left<=qe.left&&Gn.right>=qe.right&&Gn.top<=qe.top&&Gn.bottom>=qe.bottom){Jn=!0;break}Jn||Rt.push(qe)}}}if(Do.current){const ke=Do.current;for(;ke.children.length>Rt.length;)ke.removeChild(ke.lastChild);Rt.forEach((qe,Gt)=>{let Ft=ke.children[Gt];Ft||(Ft=document.createElement("div"),Ft.className=te.selectedElementHighlight,ke.appendChild(Ft)),Ft.style.transform=`translate(${qe.left}px, ${qe.top}px)`,Ft.style.width=`${qe.width}px`,Ft.style.height=`${qe.height}px`})}}};return document.addEventListener("mousemove",m,{passive:!0}),()=>document.removeEventListener("mousemove",m)},[ne,X,Bl,Us]),y.useEffect(()=>{if(!ne)return;const m=p=>{const S=Bl,k=Un.current;if(Bl&&k){qa.current=!0;const j=Math.min(k.x,p.clientX),W=Math.min(k.y,p.clientY),re=Math.max(k.x,p.clientX),ce=Math.max(k.y,p.clientY),ge=[];document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th").forEach(De=>{if(!(De instanceof HTMLElement)||Xn(De,"[data-feedback-toolbar]")||Xn(De,"[data-annotation-marker]"))return;const he=De.getBoundingClientRect();he.width>window.innerWidth*.8&&he.height>window.innerHeight*.5||he.width<10||he.height<10||he.left<re&&he.right>j&&he.top<ce&&he.bottom>W&&ge.push({element:De,rect:he})});const ze=ge.filter(({element:De})=>!ge.some(({element:he})=>he!==De&&De.contains(he))),Ie=p.clientX/window.innerWidth*100,dt=p.clientY+window.scrollY;if(ze.length>0){const De=ze.reduce((on,{rect:ke})=>({left:Math.min(on.left,ke.left),top:Math.min(on.top,ke.top),right:Math.max(on.right,ke.right),bottom:Math.max(on.bottom,ke.bottom)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0}),he=ze.slice(0,5).map(({element:on})=>Ba(on).name).join(", "),ln=ze.length>5?` +${ze.length-5} more`:"",At=ze[0].element,un=zi(At),Rt=Ri(At);de({x:Ie,y:dt,clientY:p.clientY,element:`${ze.length} elements: ${he}${ln}`,elementPath:"multi-select",boundingBox:{x:De.left,y:De.top+window.scrollY,width:De.right-De.left,height:De.bottom-De.top},isMultiSelect:!0,fullPath:Ni(At),accessibility:Di(At),computedStyles:Rt,computedStylesObj:un,nearbyElements:Ti(At),cssClasses:Cs(At),nearbyText:js(At),sourceFile:Yi(At)})}else{const De=Math.abs(re-j),he=Math.abs(ce-W);De>20&&he>20&&de({x:Ie,y:dt,clientY:p.clientY,element:"Area selection",elementPath:`region at (${Math.round(j)}, ${Math.round(W)})`,boundingBox:{x:j,y:W+window.scrollY,width:De,height:he},isMultiSelect:!0})}Qe(null)}else S&&(qa.current=!0);Kl.current=null,Un.current=null,Ia(!1),Do.current&&(Do.current.innerHTML="")};return document.addEventListener("mouseup",m),()=>document.removeEventListener("mouseup",m)},[ne,Bl]);const bl=y.useCallback(async(m,p,S)=>{const k=ht.webhookUrl||ue;if(!k||!ht.webhooksEnabled&&!S)return!1;try{return(await fetch(k,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:m,timestamp:Date.now(),url:typeof window<"u"?window.location.href:void 0,...p})})).ok}catch(j){return console.warn("[Agentation] Webhook failed:",j),!1}},[ue,ht.webhookUrl,ht.webhooksEnabled]),Yc=y.useCallback(m=>{if(!X)return;const p={id:Date.now().toString(),x:X.x,y:X.y,comment:m,element:X.element,elementPath:X.elementPath,timestamp:Date.now(),selectedText:X.selectedText,boundingBox:X.boundingBox,nearbyText:X.nearbyText,cssClasses:X.cssClasses,isMultiSelect:X.isMultiSelect,isFixed:X.isFixed,fullPath:X.fullPath,accessibility:X.accessibility,computedStyles:X.computedStyles,nearbyElements:X.nearbyElements,reactComponents:X.reactComponents,sourceFile:X.sourceFile,elementBoundingBoxes:X.elementBoundingBoxes,...E&&Wt?{sessionId:Wt,url:typeof window<"u"?window.location.href:void 0,status:"pending"}:{}};_e(S=>[...S,p]),Qa.current=p.id,Le(()=>{Qa.current=null},300),Le(()=>{Zl(S=>new Set(S).add(p.id))},250),u?.(p),bl("annotation.add",{annotation:p}),pl(!0),Le(()=>{de(null),pl(!1)},150),window.getSelection()?.removeAllRanges(),E&&Wt&&Oa(E,Wt,p).then(S=>{S.id!==p.id&&(_e(k=>k.map(j=>j.id===p.id?{...j,id:S.id}:j)),Zl(k=>{const j=new Set(k);return j.delete(p.id),j.add(S.id),j}))}).catch(S=>{console.warn("[Agentation] Failed to sync annotation:",S)})},[X,u,bl,E,Wt]),qs=y.useCallback(()=>{pl(!0),Le(()=>{de(null),pl(!1)},150)},[]),Qs=y.useCallback(m=>{const p=G.findIndex(k=>k.id===m),S=G[p];Z?.id===m&&(xl(!0),Le(()=>{Ce(null),He(null),jt([]),xl(!1)},150)),gl(m),ha(k=>new Set(k).add(m)),S&&(_?.(S),bl("annotation.delete",{annotation:S})),E&&So(E,m).catch(k=>{console.warn("[Agentation] Failed to delete annotation from server:",k)}),Le(()=>{_e(k=>k.filter(j=>j.id!==m)),ha(k=>{const j=new Set(k);return j.delete(m),j}),gl(null),p<G.length-1&&(Ul(p),Le(()=>Ul(null),200))},150)},[G,Z,_,bl,E]),Za=y.useCallback(m=>{if(!m){Nt(null),Sn(null),In([]);return}if(Nt(m.id),m.elementBoundingBoxes?.length){const p=[];for(const S of m.elementBoundingBoxes){const k=S.x+S.width/2,j=S.y+S.height/2-window.scrollY,re=document.elementsFromPoint(k,j).find(ce=>!ce.closest("[data-annotation-marker]")&&!ce.closest("[data-agentation-root]"));re&&p.push(re)}In(p),Sn(null)}else if(m.boundingBox){const p=m.boundingBox,S=p.x+p.width/2,k=m.isFixed?p.y+p.height/2:p.y+p.height/2-window.scrollY,j=sa(S,k);if(j){const W=j.getBoundingClientRect(),re=W.width/p.width,ce=W.height/p.height;re<.5||ce<.5?Sn(null):Sn(j)}else Sn(null);In([])}else Sn(null),In([])},[]),Xc=y.useCallback(m=>{if(!Z)return;const p={...Z,comment:m};_e(S=>S.map(k=>k.id===Z.id?p:k)),f?.(p),bl("annotation.update",{annotation:p}),E&&b_(E,Z.id,{comment:m}).catch(S=>{console.warn("[Agentation] Failed to update annotation on server:",S)}),xl(!0),Le(()=>{Ce(null),He(null),jt([]),xl(!1)},150)},[Z,f,bl,E]),Ws=y.useCallback(()=>{xl(!0),Le(()=>{Ce(null),He(null),jt([]),xl(!1)},150)},[]),cl=y.useCallback(()=>{const m=G.length,p=xe.length>0||!!Oe;if(m===0&&Kt.length===0&&!p)return;if(b?.(G),bl("annotations.clear",{annotations:G}),E){Promise.all(G.map(j=>So(E,j.id).catch(W=>{console.warn("[Agentation] Failed to delete annotation from server:",W)})));for(const[,j]of Mo.current)j&&So(E,j).catch(()=>{});Mo.current.clear();for(const[,j]of da.current)j&&So(E,j).catch(()=>{});da.current.clear()}st(!0),Ne(!0),Xi([]);const S=Eo.current;if(S){const j=S.getContext("2d");j&&j.clearRect(0,0,S.width,S.height)}(xe.length>0||Oe)&&(Il(j=>j+1),Bs(j=>j+1),Le(()=>{bt([]),$n(null)},200)),Pe&&Kn(!1),en&&jn(""),Xl.current={rearrange:null,placements:[]},$i(Ue);const k=m*30+200;Le(()=>{_e([]),Zl(new Set),localStorage.removeItem(Li(Ue)),st(!1)},k),Le(()=>Ne(!1),1500)},[Ue,G,Kt,xe,Oe,Pe,en,b,bl,E]),Gs=y.useCallback(async()=>{const m=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Ue,p=Se&&Pe;let S;if(p){if(xe.length===0&&!Oe&&!en)return;S=""}else{if(S=S_(G,m,ht.outputDetail),!S&&Kt.length===0&&xe.length===0&&!Oe)return;S||(S=`## Page Feedback: ${m}
`)}if(!p&&Kt.length>0){const k=new Set;for(const ce of G)ce.drawingIndex!=null&&k.add(ce.drawingIndex);const j=Eo.current;j&&(j.style.visibility="hidden");const W=[],re=window.scrollY;for(let ce=0;ce<Kt.length;ce++){if(k.has(ce))continue;const ge=Kt[ce];if(ge.points.length<2)continue;const Me=ge.fixed?ge.points:ge.points.map(Vt=>({x:Vt.x,y:Vt.y-re}));let ze=1/0,Ie=1/0,dt=-1/0,De=-1/0;for(const Vt of Me)ze=Math.min(ze,Vt.x),Ie=Math.min(Ie,Vt.y),dt=Math.max(dt,Vt.x),De=Math.max(De,Vt.y);const he=dt-ze,ln=De-Ie,At=Math.hypot(he,ln),un=Me[0],Rt=Me[Me.length-1],on=Math.hypot(Rt.x-un.x,Rt.y-un.y);let ke;const qe=on<At*.35,Gt=he/Math.max(ln,1);if(qe&&At>20){const Vt=Math.max(he,ln)*.15;let wl=0;for(const Pl of Me){const so=Pl.x-ze<Vt,Ao=dt-Pl.x<Vt,Vs=Pl.y-Ie<Vt,or=De-Pl.y<Vt;(so||Ao)&&(Vs||or)&&wl++}ke=wl>Me.length*.15?"box":"circle"}else Gt>3&&ln<40?ke="underline":on>At*.5?ke="arrow":ke="drawing";const Ft=Math.min(10,Me.length),Jn=Math.max(1,Math.floor(Me.length/Ft)),Gn=new Set,dn=[],ya=[un];for(let Vt=Jn;Vt<Me.length-1;Vt+=Jn)ya.push(Me[Vt]);ya.push(Rt);for(const Vt of ya){const wl=sa(Vt.x,Vt.y);if(!wl||Gn.has(wl)||Xn(wl,"[data-feedback-toolbar]"))continue;Gn.add(wl);const{name:Pl}=Ba(wl);dn.includes(Pl)||dn.push(Pl)}const Pn=`${Math.round(ze)},${Math.round(Ie)} → ${Math.round(dt)},${Math.round(De)}`;let vl;(ke==="circle"||ke==="box")&&dn.length>0?vl=`${ke==="box"?"Boxed":"Circled"} **${dn[0]}**${dn.length>1?` (and ${dn.slice(1).join(", ")})`:""} (region: ${Pn})`:ke==="underline"&&dn.length>0?vl=`Underlined **${dn[0]}** (${Pn})`:ke==="arrow"&&dn.length>=2?vl=`Arrow from **${dn[0]}** to **${dn[dn.length-1]}** (${Math.round(un.x)},${Math.round(un.y)} → ${Math.round(Rt.x)},${Math.round(Rt.y)})`:dn.length>0?vl=`${ke==="arrow"?"Arrow":"Drawing"} near **${dn.join("**, **")}** (region: ${Pn})`:vl=`Drawing at ${Pn}`,W.push(vl)}j&&(j.style.visibility=""),W.length>0&&(S+=`
**Drawings:**
`,W.forEach((ce,ge)=>{S+=`${ge+1}. ${ce}
`}))}if((xe.length>0||p&&en)&&(S+=`
`+__(xe,{width:window.innerWidth,height:window.innerHeight},{blankCanvas:Pe,wireframePurpose:en||void 0},ht.outputDetail)),Oe){const k=f_(Oe,ht.outputDetail,{width:window.innerWidth,height:window.innerHeight});k&&(S+=`
`+k)}if(M)try{await navigator.clipboard.writeText(S)}catch{}R?.(S),w(!0),Le(()=>w(!1),2e3),ht.autoClearAfterCopy&&Le(()=>cl(),500)},[G,Kt,xe,Oe,Pe,Se,Yl,en,Ue,ht.outputDetail,Nl,ht.autoClearAfterCopy,cl,M,R]),Ka=y.useCallback(async()=>{const m=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Ue;let p=S_(G,m,ht.outputDetail);if(!p&&xe.length===0&&!Oe)return;if(p||(p=`## Page Feedback: ${m}
`),xe.length>0&&(p+=`
`+__(xe,{width:window.innerWidth,height:window.innerHeight},{blankCanvas:Pe,wireframePurpose:en||void 0},ht.outputDetail)),Oe){const k=f_(Oe,ht.outputDetail,{width:window.innerWidth,height:window.innerHeight});k&&(p+=`
`+k)}x&&x(p,G),ie("sending"),await new Promise(k=>Le(k,150));const S=await bl("submit",{output:p,annotations:G},!0);ie(S?"sent":"failed"),Le(()=>ie("idle"),2500),S&&ht.autoClearAfterCopy&&Le(()=>cl(),500)},[x,bl,G,xe,Oe,Pe,Yl,Ue,ht.outputDetail,Nl,ht.autoClearAfterCopy,cl]);y.useEffect(()=>{if(!Wn)return;const m=10,p=k=>{const j=k.clientX-Wn.x,W=k.clientY-Wn.y,re=Math.sqrt(j*j+W*W);if(!Al&&re>m&&zo(!0),Al||re>m){let ce=Wn.toolbarX+j,ge=Wn.toolbarY+W;const Me=20,ze=337,Ie=44,De=ze-(ne?Qn==="connected"?297:257:44),he=Me-De,ln=window.innerWidth-Me-ze;ce=Math.max(he,Math.min(ln,ce)),ge=Math.max(Me,Math.min(window.innerHeight-Ie-Me,ge)),rl({x:ce,y:ge})}},S=()=>{Al&&(Ro.current=!0),zo(!1),Ya(null)};return document.addEventListener("mousemove",p),document.addEventListener("mouseup",S),()=>{document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",S)}},[Wn,Al,ne,Qn]);const tr=y.useCallback(m=>{if(m.target.closest("button")||m.target.closest("[data-agentation-settings-panel]"))return;const p=m.currentTarget.parentElement;if(!p)return;const S=p.getBoundingClientRect(),k=Ot?.x??S.left,j=Ot?.y??S.top;Ya({x:m.clientX,y:m.clientY,toolbarX:k,toolbarY:j})},[Ot]);if(y.useEffect(()=>{if(!Ot)return;const m=()=>{let j=Ot.x,W=Ot.y;const ge=20-(337-(ne?Qn==="connected"?297:257:44)),Me=window.innerWidth-20-337;j=Math.max(ge,Math.min(Me,j)),W=Math.max(20,Math.min(window.innerHeight-44-20,W)),(j!==Ot.x||W!==Ot.y)&&rl({x:j,y:W})};return m(),window.addEventListener("resize",m),()=>window.removeEventListener("resize",m)},[Ot,ne,Qn]),y.useEffect(()=>{const m=p=>{const S=p.target,k=S.tagName==="INPUT"||S.tagName==="TEXTAREA"||S.isContentEditable;if(p.key==="Escape"){if(Se){Je?Be(null):Ga();return}if(Hn){il(!1);return}if(nn.length>0){Wl([]);return}X||ne&&(vn(),U(!1))}if((p.metaKey||p.ctrlKey)&&p.shiftKey&&(p.key==="f"||p.key==="F")){p.preventDefault(),vn(),ne?Ji():U(!0);return}if(!(k||p.metaKey||p.ctrlKey)&&((p.key==="p"||p.key==="P")&&(p.preventDefault(),vn(),Is()),(p.key==="l"||p.key==="L")&&(p.preventDefault(),vn(),Hn&&il(!1),ee&&pe(!1),X&&qs(),Se?Ga():ft(!0)),(p.key==="h"||p.key==="H")&&G.length>0&&(p.preventDefault(),vn(),we(j=>!j)),(p.key==="c"||p.key==="C")&&(G.length>0||xe.length>0||Oe)&&(p.preventDefault(),vn(),Gs()),(p.key==="x"||p.key==="X")&&(G.length>0||xe.length>0||Oe)&&(p.preventDefault(),vn(),cl(),xe.length>0&&bt([]),Oe&&$n(null)),p.key==="s"||p.key==="S")){const j=Hl(ht.webhookUrl)||Hl(ue||"");G.length>0&&j&&I==="idle"&&(p.preventDefault(),vn(),Ka())}};return document.addEventListener("keydown",m),()=>document.removeEventListener("keydown",m)},[ne,Hn,Se,Je,xe,Oe,X,G.length,ht.webhookUrl,ue,I,Ka,Is,Gs,cl,nn]),!Te||_t)return null;const No=G.length>0,oo=G.filter(m=>!fa.has(m.id)&&m.kind!=="placement"&&m.kind!=="rearrange"),nr=oo.length>0,ao=G.filter(m=>fa.has(m.id)),lr=m=>{const W=m.x/100*window.innerWidth,re=typeof m.y=="string"?parseFloat(m.y):m.y,ce={};window.innerHeight-re-22-10<80&&(ce.top="auto",ce.bottom="calc(100% + 10px)");const Me=W-200/2,ze=10;if(Me<ze){const Ie=ze-Me;ce.left=`calc(50% + ${Ie}px)`}else if(Me+200>window.innerWidth-ze){const Ie=Me+200-(window.innerWidth-ze);ce.left=`calc(50% - ${Ie}px)`}return ce};return Yd.createPortal(o.jsxs("div",{ref:rt,style:{display:"contents"},"data-agentation-theme":Fn?"dark":"light","data-agentation-accent":ht.annotationColorId,"data-agentation-root":"",children:[o.jsx("div",{className:`${te.toolbar}${H?` ${H}`:""}`,"data-feedback-toolbar":!0,"data-agentation-toolbar":!0,style:Ot?{left:Ot.x,top:Ot.y,right:"auto",bottom:"auto"}:void 0,children:o.jsxs("div",{className:`${te.toolbarContainer} ${ne?te.expanded:te.collapsed} ${Gi?te.entrance:""} ${oe?te.hiding:""} ${!ht.webhooksEnabled&&(Hl(ht.webhookUrl)||Hl(ue||""))?te.serverConnected:""}`,onClick:ne?void 0:m=>{if(Ro.current){Ro.current=!1,m.preventDefault();return}U(!0)},onMouseDown:tr,role:ne?void 0:"button",tabIndex:ne?-1:0,title:ne?void 0:"Start feedback mode",children:[o.jsxs("div",{className:`${te.toggleContent} ${ne?te.hidden:te.visible}`,children:[o.jsx(em,{size:24}),nr&&o.jsx("span",{className:`${te.badge} ${ne?te.fadeOut:""} ${Gi?te.entrance:""}`,children:oo.length})]}),o.jsxs("div",{className:`${te.controlsContent} ${ne?te.visible:te.hidden} ${Ot&&Ot.y<100?te.tooltipBelow:""} ${gt||ee?te.tooltipsHidden:""} ${Ii?te.tooltipsInSession:""}`,onMouseEnter:To,onMouseLeave:$c,children:[o.jsxs("div",{className:`${te.buttonWrapper} ${Ot&&Ot.x<120?te.buttonWrapperAlignLeft:""}`,children:[o.jsx("button",{className:te.controlButton,onClick:m=>{m.stopPropagation(),vn(),Is()},"data-active":O,children:o.jsx(am,{size:24,isPaused:O})}),o.jsxs("span",{className:te.buttonTooltip,children:[O?"Resume animations":"Pause animations",o.jsx("span",{className:te.shortcut,children:"P"})]})]}),o.jsxs("div",{className:te.buttonWrapper,children:[o.jsx("button",{className:`${te.controlButton} ${Fn?"":te.light}`,onClick:m=>{m.stopPropagation(),vn(),Hn&&il(!1),ee&&pe(!1),X&&qs(),Se?Ga():ft(!0)},"data-active":Se,style:Se&&Pe?{color:"#f97316",background:"rgba(249, 115, 22, 0.25)"}:void 0,children:o.jsx(hm,{size:21})}),o.jsxs("span",{className:te.buttonTooltip,children:[Se?"Exit layout mode":"Layout mode",o.jsx("span",{className:te.shortcut,children:"L"})]})]}),o.jsxs("div",{className:te.buttonWrapper,children:[o.jsx("button",{className:te.controlButton,onClick:m=>{m.stopPropagation(),vn(),we(!ve)},disabled:!No||Se,children:o.jsx(om,{size:24,isOpen:ve})}),o.jsxs("span",{className:te.buttonTooltip,children:[ve?"Hide markers":"Show markers",o.jsx("span",{className:te.shortcut,children:"H"})]})]}),o.jsxs("div",{className:te.buttonWrapper,children:[o.jsx("button",{className:`${te.controlButton} ${je?te.statusShowing:""}`,onClick:m=>{m.stopPropagation(),vn(),Gs()},disabled:Se&&Pe?xe.length===0&&!Oe?.sections?.length:!No&&Kt.length===0&&xe.length===0&&!Oe?.sections?.length,"data-active":je,children:o.jsx(nm,{size:24,copied:je,tint:Se&&Pe&&(xe.length>0||Oe?.sections?.length)?"#f97316":void 0})}),o.jsxs("span",{className:te.buttonTooltip,children:[Se&&Pe?"Copy layout":"Copy feedback",o.jsx("span",{className:te.shortcut,children:"C"})]})]}),o.jsxs("div",{className:`${te.buttonWrapper} ${te.sendButtonWrapper} ${ne&&!ht.webhooksEnabled&&(Hl(ht.webhookUrl)||Hl(ue||""))?te.sendButtonVisible:""}`,children:[o.jsxs("button",{className:`${te.controlButton} ${I==="sent"||I==="failed"?te.statusShowing:""}`,onClick:m=>{m.stopPropagation(),vn(),Ka()},disabled:!No||!Hl(ht.webhookUrl)&&!Hl(ue||"")||I==="sending","data-no-hover":I==="sent"||I==="failed",tabIndex:Hl(ht.webhookUrl)||Hl(ue||"")?0:-1,children:[o.jsx(lm,{size:24,state:I}),No&&I==="idle"&&o.jsx("span",{className:te.buttonBadge,children:G.length})]}),o.jsxs("span",{className:te.buttonTooltip,children:["Send Annotations",o.jsx("span",{className:te.shortcut,children:"S"})]})]}),o.jsxs("div",{className:te.buttonWrapper,children:[o.jsx("button",{className:te.controlButton,onClick:m=>{m.stopPropagation(),vn(),cl()},disabled:!No&&Kt.length===0&&xe.length===0&&!Oe?.sections?.length,"data-danger":!0,children:o.jsx(im,{size:24})}),o.jsxs("span",{className:te.buttonTooltip,children:["Clear all",o.jsx("span",{className:te.shortcut,children:"X"})]})]}),o.jsxs("div",{className:te.buttonWrapper,children:[o.jsx("button",{className:te.controlButton,onClick:m=>{m.stopPropagation(),vn(),Se&&Ga(),pe(!ee)},children:o.jsx(sm,{size:24})}),E&&Qn!=="disconnected"&&o.jsx("span",{className:`${te.mcpIndicator} ${te[Qn]} ${ee?te.hidden:""}`,title:Qn==="connected"?"MCP Connected":"MCP Connecting..."}),o.jsx("span",{className:te.buttonTooltip,children:"Settings"})]}),o.jsx("div",{className:te.divider}),o.jsxs("div",{className:`${te.buttonWrapper} ${Ot&&typeof window<"u"&&Ot.x>window.innerWidth-120?te.buttonWrapperAlignRight:""}`,children:[o.jsx("button",{className:te.controlButton,onClick:m=>{m.stopPropagation(),vn(),Ji()},children:o.jsx(rm,{size:24})}),o.jsxs("span",{className:te.buttonTooltip,children:["Exit",o.jsx("span",{className:te.shortcut,children:"Esc"})]})]})]}),o.jsx(Ig,{visible:Se&&ne,activeType:Je,onSelect:m=>{Be(Je===m?null:m)},isDarkMode:Fn,sectionCount:Oe?.sections.length??0,onDetectSections:()=>{const m=ey(),p=Oe?.sections??[],S=new Set(p.map(re=>re.selector)),k=m.filter(re=>!S.has(re.selector)),j=[...p,...k],W=[...Oe?.originalOrder??[],...k.map(re=>re.id)];$n({sections:j,originalOrder:W,detectedAt:Date.now()})},placementCount:xe.length,onClearPlacements:()=>{Il(m=>m+1),Bs(m=>m+1),Le(()=>{$n({sections:[],originalOrder:[],detectedAt:Date.now()})},200)},blankCanvas:Pe,onBlankCanvasChange:m=>{const p={sections:[],originalOrder:[],detectedAt:Date.now()};m?(As.current={rearrange:Oe,placements:xe},$n(Xl.current.rearrange||p),bt(Xl.current.placements),Be(null)):(Xl.current={rearrange:Oe,placements:xe},$n(As.current.rearrange||p),bt(As.current.placements)),Kn(m)},wireframePurpose:en,onWireframePurposeChange:jn,Tooltip:la,onDragStart:(m,p)=>{p.preventDefault();const S=me[m];let k=null,j=!1;const W=p.clientX,re=p.clientY,ge=p.target.closest("[data-feedback-toolbar]")?.getBoundingClientRect().top??window.innerHeight,Me=Ie=>{const dt=Ie.clientX-W,De=Ie.clientY-re;if(!j&&(Math.abs(dt)>4||Math.abs(De)>4)&&(j=!0,k=document.createElement("div"),k.className=`${V.dragPreview}${Pe?` ${V.dragPreviewWireframe}`:""}`,document.body.appendChild(k)),!k)return;const he=Math.max(0,ge-Ie.clientY),ln=Math.min(1,he/180),At=1-Math.pow(1-ln,2),un=28,Rt=20,on=Math.min(140,S.width*.18),ke=Math.min(90,S.height*.18),qe=un+(on-un)*At,Gt=Rt+(ke-Rt)*At;k.style.width=`${qe}px`,k.style.height=`${Gt}px`,k.style.left=`${Ie.clientX-qe/2}px`,k.style.top=`${Ie.clientY-Gt/2}px`,k.style.opacity=`${.5+.5*At}`,k.textContent=At>.25?m:""},ze=Ie=>{if(window.removeEventListener("mousemove",Me),window.removeEventListener("mouseup",ze),k&&document.body.removeChild(k),j){const dt=S.width,De=S.height,he=window.scrollY,ln=Math.max(0,Ie.clientX-dt/2),At=Math.max(0,Ie.clientY+he-De/2),un={id:`dp-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type:m,x:ln,y:At,width:dt,height:De,scrollY:he,timestamp:Date.now()};bt(Rt=>[...Rt,un]),Be(null),Co.current=new Set,$a(Rt=>Rt+1)}};window.addEventListener("mousemove",Me),window.addEventListener("mouseup",ze)}}),o.jsx(cp,{settings:ht,onSettingsChange:m=>Qi(p=>({...p,...m})),isDarkMode:Fn,onToggleTheme:Dl,isDevMode:Ls,connectionStatus:Qn,endpoint:E,isVisible:se,toolbarNearBottom:!!Ot&&Ot.y<230,settingsPage:Re,onSettingsPageChange:Ve,onHideToolbar:Uc})]})}),(Se||ut)&&o.jsx("div",{className:`${V.blankCanvas} ${En?V.visible:""} ${an?V.gridActive:""}`,style:{"--canvas-opacity":sl},"data-feedback-toolbar":!0}),Se&&Pe&&En&&o.jsxs("div",{className:V.wireframeNotice,"data-feedback-toolbar":!0,children:[o.jsxs("div",{className:V.wireframeOpacityRow,children:[o.jsx("span",{className:V.wireframeOpacityLabel,children:"Toggle Opacity"}),o.jsx("input",{type:"range",className:V.wireframeOpacitySlider,min:0,max:1,step:.01,value:sl,onChange:m=>On(Number(m.target.value))})]}),o.jsxs("div",{className:V.wireframeNoticeTitleRow,children:[o.jsx("span",{className:V.wireframeNoticeTitle,children:"Wireframe Mode"}),o.jsx("span",{className:V.wireframeNoticeDivider}),o.jsx("button",{className:V.wireframeStartOver,onClick:()=>{Il(m=>m+1),$n({sections:[],originalOrder:[],detectedAt:Date.now()}),Xl.current={rearrange:null,placements:[]},jn(""),$i(Ue)},children:"Start Over"})]}),"Drag components onto the canvas.",o.jsx("br",{}),"Copied output will only include the wireframed layout."]}),(Se||ut)&&o.jsx($g,{placements:xe,onChange:bt,activeComponent:ut?null:Je,onActiveComponentChange:Be,isDarkMode:Fn,exiting:ut,onInteractionChange:Ln,passthrough:!Je,extraSnapRects:Oe?.sections.map(m=>m.currentRect),deselectSignal:ca,clearSignal:ua,wireframe:Pe,onSelectionChange:(m,p)=>{Co.current=m,p||(yl.current=new Set,jo(S=>S+1))},onDragMove:(m,p)=>{const S=yl.current;if(!(!S.size||!Oe)){if(!Cn.current){Cn.current=new Map;for(const k of Oe.sections)S.has(k.id)&&Cn.current.set(k.id,{x:k.currentRect.x,y:k.currentRect.y})}for(const k of Oe.sections){if(!S.has(k.id)||!Cn.current.get(k.id))continue;const W=document.querySelector(`[data-rearrange-section="${k.id}"]`);W&&(W.style.transform=`translate(${m}px, ${p}px)`)}}},onDragEnd:(m,p,S)=>{const k=yl.current,j=Cn.current;if(Cn.current=null,!(!k.size||!Oe||!j)){for(const W of k){const re=document.querySelector(`[data-rearrange-section="${W}"]`);re&&(re.style.transform="")}S&&$n(W=>W&&{...W,sections:W.sections.map(re=>{const ce=j.get(re.id);return ce?{...re,currentRect:{...re.currentRect,x:Math.max(0,ce.x+m),y:Math.max(0,ce.y+p)}}:re})})}}}),(Se||ut)&&Oe&&o.jsx(ly,{rearrangeState:Oe,onChange:$n,isDarkMode:Fn,exiting:ut,blankCanvas:Pe,extraSnapRects:xe.map(m=>({x:m.x,y:m.y,width:m.width,height:m.height})),clearSignal:hn,deselectSignal:ko,onSelectionChange:(m,p)=>{yl.current=m,p||(Co.current=new Set,$a(S=>S+1))},onDragMove:(m,p)=>{const S=Co.current;if(S.size){if(!Cn.current){Cn.current=new Map;for(const k of xe)S.has(k.id)&&Cn.current.set(k.id,{x:k.x,y:k.y})}for(const k of S){const j=document.querySelector(`[data-design-placement="${k}"]`);j&&(j.style.transform=`translate(${m}px, ${p}px)`)}}},onDragEnd:(m,p,S)=>{const k=Co.current,j=Cn.current;if(Cn.current=null,!(!k.size||!j)){for(const W of k){const re=document.querySelector(`[data-design-placement="${W}"]`);re&&(re.style.transform="")}S&&bt(W=>W.map(re=>{const ce=j.get(re.id);return ce?{...re,x:Math.max(0,ce.x+m),y:Math.max(0,ce.y+p)}:re}))}}}),o.jsx("canvas",{ref:Eo,className:`${te.drawCanvas} ${Hn?te.active:""}`,style:{opacity:Ys?1:0,transition:"opacity 0.15s ease"},"data-feedback-toolbar":!0}),o.jsxs("div",{className:te.markersLayer,"data-feedback-toolbar":!0,children:[at&&oo.filter(m=>!m.isFixed).map((m,p,S)=>o.jsx(k_,{annotation:m,globalIndex:oo.findIndex(k=>k.id===m.id),layerIndex:p,layerSize:S.length,isExiting:tt,isClearing:Ze,isAnimated:Hs.has(m.id),isHovered:!tt&&Zt===m.id,isDeleting:bn===m.id,isEditingAny:!!Z,renumberFrom:al,markerClickBehavior:ht.markerClickBehavior,tooltipStyle:lr(m),onHoverEnter:k=>!tt&&k.id!==Qa.current&&Za(k),onHoverLeave:()=>Za(null),onClick:k=>ht.markerClickBehavior==="delete"?Qs(k.id):Va(k),onContextMenu:Va},m.id)),at&&!tt&&ao.filter(m=>!m.isFixed).map(m=>o.jsx(j_,{annotation:m},m.id))]}),o.jsxs("div",{className:te.fixedMarkersLayer,"data-feedback-toolbar":!0,children:[at&&oo.filter(m=>m.isFixed).map((m,p,S)=>o.jsx(k_,{annotation:m,globalIndex:oo.findIndex(k=>k.id===m.id),layerIndex:p,layerSize:S.length,isExiting:tt,isClearing:Ze,isAnimated:Hs.has(m.id),isHovered:!tt&&Zt===m.id,isDeleting:bn===m.id,isEditingAny:!!Z,renumberFrom:al,markerClickBehavior:ht.markerClickBehavior,tooltipStyle:lr(m),onHoverEnter:k=>!tt&&k.id!==Qa.current&&Za(k),onHoverLeave:()=>Za(null),onClick:k=>ht.markerClickBehavior==="delete"?Qs(k.id):Va(k),onContextMenu:Va},m.id)),at&&!tt&&ao.filter(m=>m.isFixed).map(m=>o.jsx(j_,{annotation:m,fixed:!0},m.id))]}),ne&&o.jsxs("div",{className:te.overlay,"data-feedback-toolbar":!0,style:X||Z?{zIndex:99999}:void 0,children:[Ye?.rect&&!X&&!Ct&&!Bl&&o.jsx("div",{className:`${te.hoverHighlight} ${te.enter}`,style:{left:Ye.rect.left,top:Ye.rect.top,width:Ye.rect.width,height:Ye.rect.height,borderColor:"color-mix(in srgb, var(--agentation-color-accent) 50%, transparent)",backgroundColor:"color-mix(in srgb, var(--agentation-color-accent) 4%, transparent)"}}),nn.filter(m=>document.contains(m.element)).map((m,p)=>{const S=m.element.getBoundingClientRect(),k=nn.length>1;return o.jsx("div",{className:k?te.multiSelectOutline:te.singleSelectOutline,style:{position:"fixed",left:S.left,top:S.top,width:S.width,height:S.height,...k?{}:{borderColor:"color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",backgroundColor:"color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)"}}},p)}),Zt&&!X&&(()=>{const m=G.find(j=>j.id===Zt);if(!m?.boundingBox)return null;if(m.elementBoundingBoxes?.length)return kn.length>0?kn.filter(j=>document.contains(j)).map((j,W)=>{const re=j.getBoundingClientRect();return o.jsx("div",{className:`${te.multiSelectOutline} ${te.enter}`,style:{left:re.left,top:re.top,width:re.width,height:re.height}},`hover-outline-live-${W}`)}):m.elementBoundingBoxes.map((j,W)=>o.jsx("div",{className:`${te.multiSelectOutline} ${te.enter}`,style:{left:j.x,top:j.y-Ge,width:j.width,height:j.height}},`hover-outline-${W}`));const p=Zn&&document.contains(Zn)?Zn.getBoundingClientRect():null,S=p?{x:p.left,y:p.top,width:p.width,height:p.height}:{x:m.boundingBox.x,y:m.isFixed?m.boundingBox.y:m.boundingBox.y-Ge,width:m.boundingBox.width,height:m.boundingBox.height},k=m.isMultiSelect;return o.jsx("div",{className:`${k?te.multiSelectOutline:te.singleSelectOutline} ${te.enter}`,style:{left:S.x,top:S.y,width:S.width,height:S.height,...k?{}:{borderColor:"color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",backgroundColor:"color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)"}}})})(),Ye&&!X&&!Ct&&!Bl&&o.jsxs("div",{className:`${te.hoverTooltip} ${te.enter}`,style:{left:Math.max(8,Math.min(T.x,window.innerWidth-100)),top:Math.max(T.y-(Ye.reactComponents?48:32),8)},children:[Ye.reactComponents&&o.jsx("div",{className:te.hoverReactPath,children:Ye.reactComponents}),o.jsx("div",{className:te.hoverElementName,children:Ye.elementName})]}),X&&o.jsxs(o.Fragment,{children:[X.multiSelectElements?.length?X.multiSelectElements.filter(m=>document.contains(m)).map((m,p)=>{const S=m.getBoundingClientRect();return o.jsx("div",{className:`${te.multiSelectOutline} ${mn?te.exit:te.enter}`,style:{left:S.left,top:S.top,width:S.width,height:S.height}},`pending-multi-${p}`)}):X.targetElement&&document.contains(X.targetElement)?(()=>{const m=X.targetElement.getBoundingClientRect();return o.jsx("div",{className:`${te.singleSelectOutline} ${mn?te.exit:te.enter}`,style:{left:m.left,top:m.top,width:m.width,height:m.height,borderColor:"color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",backgroundColor:"color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)"}})})():X.boundingBox&&o.jsx("div",{className:`${X.isMultiSelect?te.multiSelectOutline:te.singleSelectOutline} ${mn?te.exit:te.enter}`,style:{left:X.boundingBox.x,top:X.boundingBox.y-Ge,width:X.boundingBox.width,height:X.boundingBox.height,...X.isMultiSelect?{}:{borderColor:"color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",backgroundColor:"color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)"}}}),(()=>{const m=X.x,p=X.isFixed?X.y:X.y-Ge;return o.jsxs(o.Fragment,{children:[o.jsx(Py,{x:m,y:p,isMultiSelect:X.isMultiSelect,isExiting:mn}),o.jsx(Mi,{ref:Zi,element:X.element,selectedText:X.selectedText,computedStyles:X.computedStylesObj,placeholder:X.element==="Area selection"?"What should change in this area?":X.isMultiSelect?"Feedback for this group of elements...":"What should change?",onSubmit:Yc,onCancel:qs,isExiting:mn,lightMode:!Fn,accentColor:X.isMultiSelect?"var(--agentation-color-green)":"var(--agentation-color-accent)",style:{left:Math.max(160,Math.min(window.innerWidth-160,m/100*window.innerWidth)),...p>window.innerHeight-290?{bottom:window.innerHeight-p+20}:{top:p+20}}})]})})()]}),Z&&o.jsxs(o.Fragment,{children:[Z.elementBoundingBoxes?.length?Ke.length>0?Ke.filter(m=>document.contains(m)).map((m,p)=>{const S=m.getBoundingClientRect();return o.jsx("div",{className:`${te.multiSelectOutline} ${te.enter}`,style:{left:S.left,top:S.top,width:S.width,height:S.height}},`edit-multi-live-${p}`)}):Z.elementBoundingBoxes.map((m,p)=>o.jsx("div",{className:`${te.multiSelectOutline} ${te.enter}`,style:{left:m.x,top:m.y-Ge,width:m.width,height:m.height}},`edit-multi-${p}`)):(()=>{const m=We&&document.contains(We)?We.getBoundingClientRect():null,p=m?{x:m.left,y:m.top,width:m.width,height:m.height}:Z.boundingBox?{x:Z.boundingBox.x,y:Z.isFixed?Z.boundingBox.y:Z.boundingBox.y-Ge,width:Z.boundingBox.width,height:Z.boundingBox.height}:null;return p?o.jsx("div",{className:`${Z.isMultiSelect?te.multiSelectOutline:te.singleSelectOutline} ${te.enter}`,style:{left:p.x,top:p.y,width:p.width,height:p.height,...Z.isMultiSelect?{}:{borderColor:"color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",backgroundColor:"color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)"}}}):null})(),o.jsx(Mi,{ref:Ki,element:Z.element,selectedText:Z.selectedText,computedStyles:Kg(Z.computedStyles),placeholder:"Edit your feedback...",initialValue:Z.comment,submitLabel:"Save",onSubmit:Xc,onCancel:Ws,onDelete:()=>Qs(Z.id),isExiting:Xa,lightMode:!Fn,accentColor:Z.isMultiSelect?"var(--agentation-color-green)":"var(--agentation-color-accent)",style:(()=>{const m=Z.isFixed?Z.y:Z.y-Ge;return{left:Math.max(160,Math.min(window.innerWidth-160,Z.x/100*window.innerWidth)),...m>window.innerHeight-290?{bottom:window.innerHeight-m+20}:{top:m+20}}})()})]}),Bl&&o.jsxs(o.Fragment,{children:[o.jsx("div",{ref:Fl,className:te.dragSelection}),o.jsx("div",{ref:Do,className:te.highlightsContainer})]})]})]}),document.body)}function T_(){const s="agentation-extension-root";let r=document.getElementById(s);if(r){console.log("[Agentation Extension] Already mounted.");return}r=document.createElement("div"),r.id=s,r.style.position="relative",r.style.zIndex="9999999",document.body.appendChild(r);const c=G0.createRoot(r);c.render(o.jsx(dp,{})),window.__agdExtensionRoot=c,window.__agdExtensionContainer=r,window.__agdExtensionUnmount=()=>{c.unmount(),r&&r.parentNode&&r.parentNode.removeChild(r),delete window.__agdExtensionRoot,delete window.__agdExtensionContainer,delete window.__agdExtensionUnmount,console.log("[Agentation Extension] Unmounted successfully.")},console.log("[Agentation Extension] Mounted successfully.")}function _p(){T_(),chrome.runtime.onMessage.addListener((s,r,c)=>(s.action==="PING"?c({status:"PONG"}):s.action==="UNMOUNT_FEEDBACK"?(window.__agdExtensionUnmount&&window.__agdExtensionUnmount(),c({status:"UNMOUNTED"})):s.action==="START_FEEDBACK"&&(T_(),c({status:"MOUNTED"})),!0))}_p()})();
