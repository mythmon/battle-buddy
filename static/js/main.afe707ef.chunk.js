(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{185:function(e,t,a){e.exports=a(352)},190:function(e,t,a){},195:function(e,t,a){},338:function(e,t,a){},352:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(46),c=a.n(l),o=(a(190),a(35)),i=a(36),u=a(54),s=a(53),p=a(55),m=a(369),y=a(370),h=a(371),f=a(366),v=(a(192),a(195),a(171)),d=a(173),E=a(56),b=a.n(E),g=a(100),w=a(359),k=a(360),j=a(368),x=a(367),O=a(362),C=a(364),D=a(363),S=a(150);function T(e){return e.slice(0,1).toUpperCase()+e.slice(1)}var L=new(a(172).a)({protocol:"https"}),_=function(e){function t(){var e,a;Object(o.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(u.a)(this,(e=Object(s.a)(t)).call.apply(e,[this].concat(r)))).state={typeList:null,types:[null,null]},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=Object(g.a)(b.a.mark(function e(){var t;return b.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(null!==this.state.typeList){e.next=5;break}return e.next=3,L.getTypesList();case 3:t=e.sent,this.setState({typeList:t.results});case 5:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"handleTypes",value:function(e){var t=this;if(e<0||e>1)throw new Error("Invalid index ".concat(e));return function(a,n){var r=n.value;t.setState(function(t){t.types[e]=r;for(var a=t.types.filter(function(e){return!!e});a.length<2;)a.push(null);return{types:a}})}}},{key:"render",value:function(){var e=this.state,t=e.types,a=e.typeList;return null===a?r.a.createElement(w.a,{active:!0}):r.a.createElement(k.a,null,r.a.createElement(j.a,null,r.a.createElement(j.a.Row,null,r.a.createElement(j.a.Column,null,r.a.createElement(x.a,{as:"h2"},"Defender"))),r.a.createElement(j.a.Row,null,r.a.createElement(j.a.Column,{width:8},r.a.createElement(B,{onChange:this.handleTypes(0),typeList:a,value:t[0],placeholder:"First Type"})),r.a.createElement(j.a.Column,{width:8},r.a.createElement(B,{onChange:this.handleTypes(1),typeList:a,value:t[1],placeholder:"Second Type"}))),r.a.createElement(R,{types:t.filter(function(e){return!!e})})))}}]),t}(r.a.Component);function B(e){var t=e.value,a=e.typeList,n=e.onChange,l=e.placeholder,c=a.map(function(e){return{key:e.name,value:e.name,text:T(e.name)}});return r.a.createElement(O.a,{key:"first-type",compact:!0,fluid:!0,placeholder:l,search:!0,selection:!0,clearable:!0,options:c,onChange:n,value:t})}var R=function(e){function t(){var e,a;Object(o.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(u.a)(this,(e=Object(s.a)(t)).call.apply(e,[this].concat(r)))).state={typeData:{},loading:!1},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"fetchTypeData",value:function(){var e=Object(g.a)(b.a.mark(function e(){var t,a,n,r,l,c,o,i,u=arguments;return b.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t=u.length>0&&void 0!==u[0]?u[0]:this.props.types,a=!0,n=!1,r=void 0,e.prev=4,l=t[Symbol.iterator]();case 6:if(a=(c=l.next()).done){e.next=19;break}if(o=c.value,!this.state.typeData[o]){e.next=10;break}return e.abrupt("continue",16);case 10:return this.setState({loading:!0}),i=Object(d.a)({},this.state.typeData),e.next=14,L.getTypeByName(o);case 14:i[o]=e.sent,this.setState({typeData:i});case 16:a=!0,e.next=6;break;case 19:e.next=25;break;case 21:e.prev=21,e.t0=e.catch(4),n=!0,r=e.t0;case 25:e.prev=25,e.prev=26,a||null==l.return||l.return();case 28:if(e.prev=28,!n){e.next=31;break}throw r;case 31:return e.finish(28);case 32:return e.finish(25);case 33:this.setState({loading:!1});case 34:case"end":return e.stop()}},e,this,[[4,21,25,33],[26,,28,32]])}));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.fetchTypeData()}},{key:"componentWillReceiveProps",value:function(e){this.fetchTypeData(e.types)}},{key:"calcDamageMultipliers",value:function(){var e=Object(S.a)(),t=!0,a=!1,n=void 0;try{for(var r,l=this.props.types[Symbol.iterator]();!(t=(r=l.next()).done);t=!0){var c=r.value;if(this.state.typeData[c]){var o=this.state.typeData[c].damage_relations,i=!0,u=!1,s=void 0;try{for(var p,m=o.double_damage_from[Symbol.iterator]();!(i=(p=m.next()).done);i=!0){var y=p.value.name;e=e.update(y,1,function(e){return 2*e})}}catch(C){u=!0,s=C}finally{try{i||null==m.return||m.return()}finally{if(u)throw s}}var h=!0,f=!1,v=void 0;try{for(var d,E=o.half_damage_from[Symbol.iterator]();!(h=(d=E.next()).done);h=!0){var b=d.value.name;e=e.update(b,1,function(e){return e/2})}}catch(C){f=!0,v=C}finally{try{h||null==E.return||E.return()}finally{if(f)throw v}}var g=!0,w=!1,k=void 0;try{for(var j,x=o.no_damage_from[Symbol.iterator]();!(g=(j=x.next()).done);g=!0){var O=j.value.name;e=e.set(O,0)}}catch(C){w=!0,k=C}finally{try{g||null==x.return||x.return()}finally{if(w)throw k}}}}}catch(C){a=!0,n=C}finally{try{t||null==l.return||l.return()}finally{if(a)throw n}}return e}},{key:"render",value:function(){var e=this.props.types,t=this.state.loading,a=this.calcDamageMultipliers().entrySeq().map(function(e){var t=Object(v.a)(e,2);return{type:t[0],multiplier:t[1]}}).sort(function(e,t){return e.multiplier>t.multiplier?-1:e.multiplier<t.multiplier?1:e.type.localeCompare(t.type)}).toJS();return r.a.createElement(j.a.Row,null,r.a.createElement(j.a.Column,null,r.a.createElement(C.a,{fluid:!0},r.a.createElement(D.a,{active:t},r.a.createElement(w.a,{active:t})),r.a.createElement(C.a.Content,null,r.a.createElement(C.a.Header,null,e.length>0&&r.a.createElement(r.a.Fragment,null,T(e[0]),e.slice(1).map(function(e){return r.a.createElement("span",{key:e}," \xd7 ",T(e))})))),r.a.createElement(C.a.Content,null,r.a.createElement("ul",null,a.map(function(e){var t=e.type,a=e.multiplier;return r.a.createElement("li",{key:t},t,": ",a,"x")}))))))}}]),t}(r.a.Component),I=_,M=a(365),F=a(355),J=a(361);a(338);var N=function(){return r.a.createElement(M.a,{className:"top-nav",inverted:!0,borderless:!0,color:"red",style:{borderRadius:0}},r.a.createElement(k.a,null,r.a.createElement(M.a.Item,{as:J.a,to:"/"},r.a.createElement(F.a,{src:"/logo.svg",spaced:"right",className:"logo"}),"Battle Buddy"),r.a.createElement(M.a.Item,{as:J.a,to:"/type"},"Types")))},W=function(e){function t(){return Object(o.a)(this,t),Object(u.a)(this,Object(s.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return r.a.createElement(m.a,null,r.a.createElement(r.a.Fragment,null,r.a.createElement(N,null),r.a.createElement(y.a,null,r.a.createElement(h.a,{exact:!0,path:"/"},r.a.createElement(f.a,{to:"/types"})),r.a.createElement(h.a,{path:"/types",component:I}))))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(W,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[185,2,1]]]);
//# sourceMappingURL=main.afe707ef.chunk.js.map