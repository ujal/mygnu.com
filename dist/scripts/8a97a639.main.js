/* Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms-csstransforms3d-csstransitions-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.7.1",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.csstransforms=function(){return!!F("transform")},q.csstransforms3d=function(){var a=!!F("perspective");return a&&"webkitPerspective"in g.style&&w("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},q.csstransitions=function(){return F("transition")};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e.prefixed=function(a,b,c){return b?F(a,b,c):F(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document);
(function(b){var a={VERSION:"2.2.0",Result:{SUCCEEDED:1,NOTRANSITION:2,CANCELLED:3,PENDING:4},Error:{INVALID_TRANSITION:100,PENDING_TRANSITION:200,INVALID_CALLBACK:300},WILDCARD:"*",ASYNC:"async",create:function(h,i){var k=(typeof h.initial=="string")?{state:h.initial}:h.initial;var g=h.terminal||h["final"];var f=i||h.target||{};var m=h.events||[];var j=h.callbacks||{};var d={};var l=function(o){var q=(o.from instanceof Array)?o.from:(o.from?[o.from]:[a.WILDCARD]);d[o.name]=d[o.name]||{};for(var p=0;p<q.length;p++){d[o.name][q[p]]=o.to||q[p]}};if(k){k.event=k.event||"startup";l({name:k.event,from:"none",to:k.state})}for(var e=0;e<m.length;e++){l(m[e])}for(var c in d){if(d.hasOwnProperty(c)){f[c]=a.buildEvent(c,d[c])}}for(var c in j){if(j.hasOwnProperty(c)){f[c]=j[c]}}f.current="none";f.is=function(n){return(n instanceof Array)?(n.indexOf(this.current)>=0):(this.current===n)};f.can=function(n){return !this.transition&&(d[n].hasOwnProperty(this.current)||d[n].hasOwnProperty(a.WILDCARD))};f.cannot=function(n){return !this.can(n)};f.error=h.error||function(p,t,s,o,n,r,q){throw q||r};f.isFinished=function(){return this.is(g)};if(k&&!k.defer){f[k.event]()}return f},doCallback:function(h,f,d,j,i,c){if(f){try{return f.apply(h,[d,j,i].concat(c))}catch(g){return h.error(d,j,i,c,a.Error.INVALID_CALLBACK,"an exception occurred in a caller-provided callback function",g)}}},beforeAnyEvent:function(e,d,g,f,c){return a.doCallback(e,e.onbeforeevent,d,g,f,c)},afterAnyEvent:function(e,d,g,f,c){return a.doCallback(e,e.onafterevent||e.onevent,d,g,f,c)},leaveAnyState:function(e,d,g,f,c){return a.doCallback(e,e.onleavestate,d,g,f,c)},enterAnyState:function(e,d,g,f,c){return a.doCallback(e,e.onenterstate||e.onstate,d,g,f,c)},changeState:function(e,d,g,f,c){return a.doCallback(e,e.onchangestate,d,g,f,c)},beforeThisEvent:function(e,d,g,f,c){return a.doCallback(e,e["onbefore"+d],d,g,f,c)},afterThisEvent:function(e,d,g,f,c){return a.doCallback(e,e["onafter"+d]||e["on"+d],d,g,f,c)},leaveThisState:function(e,d,g,f,c){return a.doCallback(e,e["onleave"+g],d,g,f,c)},enterThisState:function(e,d,g,f,c){return a.doCallback(e,e["onenter"+f]||e["on"+f],d,g,f,c)},beforeEvent:function(e,d,g,f,c){if((false===a.beforeThisEvent(e,d,g,f,c))||(false===a.beforeAnyEvent(e,d,g,f,c))){return false}},afterEvent:function(e,d,g,f,c){a.afterThisEvent(e,d,g,f,c);a.afterAnyEvent(e,d,g,f,c)},leaveState:function(g,f,i,h,e){var d=a.leaveThisState(g,f,i,h,e),c=a.leaveAnyState(g,f,i,h,e);if((false===d)||(false===c)){return false}else{if((a.ASYNC===d)||(a.ASYNC===c)){return a.ASYNC}}},enterState:function(e,d,g,f,c){a.enterThisState(e,d,g,f,c);a.enterAnyState(e,d,g,f,c)},buildEvent:function(c,d){return function(){var i=this.current;var h=d[i]||d[a.WILDCARD]||i;var f=Array.prototype.slice.call(arguments);if(this.transition){return this.error(c,i,h,f,a.Error.PENDING_TRANSITION,"event "+c+" inappropriate because previous transition did not complete")}if(this.cannot(c)){return this.error(c,i,h,f,a.Error.INVALID_TRANSITION,"event "+c+" inappropriate in current state "+this.current)}if(false===a.beforeEvent(this,c,i,h,f)){return a.Result.CANCELLED}if(i===h){a.afterEvent(this,c,i,h,f);return a.Result.NOTRANSITION}var g=this;this.transition=function(){g.transition=null;g.current=h;a.enterState(g,c,i,h,f);a.changeState(g,c,i,h,f);a.afterEvent(g,c,i,h,f);return a.Result.SUCCEEDED};this.transition.cancel=function(){g.transition=null;a.afterEvent(g,c,i,h,f)};var e=a.leaveState(this,c,i,h,f);if(false===e){this.transition=null;return a.Result.CANCELLED}else{if(a.ASYNC===e){return a.Result.PENDING}else{if(this.transition){return this.transition()}}}}}};if("function"===typeof define){define(function(c){return a})}else{b.StateMachine=a}}(this));
(function(){"use strict";var a,b,c,d,e,f,g,h,i,j;f=Modernizr.prefixed("transform"),e=[null,null],c=e[0],d=e[1],b=!1,a=function(){function a(a){this.el=a,this.x=0,this.y=0,this.velocityX=0,this.velocityY=0,this.updatePosition(),this.isSettled=!0}return a.prototype.updatePosition=function(){return this.width=this.el.getBoundingClientRect().width,this.height=this.el.getBoundingClientRect().height,this.originX=this.el.getBoundingClientRect().left+this.width/2,this.originY=this.el.getBoundingClientRect().top+this.height/2-100},a.prototype.update=function(){var a,e,f,g,h;return f=c-(this.originX+this.x),g=d-(this.originY+this.y),e=Math.sqrt(f*f+g*g),a=Math.atan2(g,f),b&&(h=1-e/1e3,h*=5*h,this.velocityX+=Math.cos(a)*h,this.velocityY+=Math.sin(a)*h),this.x+=this.velocityX,this.y+=this.velocityY,this.velocityX+=.005*(0-this.x),this.velocityY+=.005*(0-this.y),this.velocityX*=.9,this.velocityY*=.9,this.isSettled=Math.abs(this.x)<.03&&Math.abs(this.y)<.03&&!b?!0:!1,this.render()},a.prototype.render=function(){return this.el.style[f]="translate3d("+this.x+"px, "+this.y+"px, 0) rotate("+this.x+"deg)"},a}(),h={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",transition:"transitionend"},g=h[Modernizr.prefixed("transition")],i=function(a,b){var c,d,e,f;for(f=a.childNodes,d=0,e=f.length;e>d;d++)c=f[d],1===c.nodeType&&i(c,b);return b(a)},j=function(a){var b,c,d,e,f,g,h,i,j;return f=function(){var b,c,e,f;for(e=a.childNodes,f=[],b=0,c=e.length;c>b;b++)d=e[b],3===d.nodeType&&f.push(d);return f}(),h=function(){var a,b,c;for(c=[],a=0,b=f.length;b>a;a++)e=f[a],c.push(e.nodeValue);return c}().join("").split(" "),j=function(){var a,d,e;for(e=[],a=0,d=h.length;d>a;a++)g=h[a],c=g.split(""),i=function(){var a,d,e;for(e=[],a=0,d=c.length;d>a;a++)b=c[a],e.push("<div class='char'>"+b+"</div>");return e}(),e.push("<div class='word'>"+i.join("")+"</div>");return e}(),a.firstChild.remove(),a.insertAdjacentHTML("afterbegin",j.join(""))},$(function(){var e,f,h,k,l,m,n,o,p,q,r,s,t,u;for(setTimeout(function(){return $(window).scrollTop(0)},0),n=[],WebFont.load({custom:{families:["Vollkorn:i4","Montserrat:n4,n7"]},fontactive:function(a,b){return n.push(b),3===n.length?$("body").css({opacity:1}):void 0}}),p=document.querySelectorAll(".split"),l=0,m=p.length;m>l;l++)o=p[l],i(o,j);return f=[],h=function(){var b,c,d,e,g,h,i,j;for(f=function(){var c,d,e,f;for(e=document.querySelectorAll(".char"),f=[],c=0,d=e.length;d>c;c++)b=e[c],f.push(new a(b));return f}(),h=document.querySelectorAll(".dot"),c=0,e=h.length;e>c;c++)b=h[c],f.push(new a(b));for(i=document.querySelectorAll(".divider"),j=[],d=0,g=i.length;g>d;d++)b=i[d],j.push(f.push(new a(b)));return j},h(),e=function(){var a,b,c;for(a=0,b=f.length;b>a;a++)c=f[a],c.isSettled||c.update();return requestAnimationFrame(e)},e(),r="touchstart mousedown",s="touchend mouseup",q=function(a){return c=a.pageX,d=a.pageY},document.addEventListener("touchstart",q),document.addEventListener("mousemove",q),$(".nav li").hover(function(){var a,c,d;for(a=0,c=f.length;c>a;a++)d=f[a],d.isSettled=!1;return b=!0},function(){return b=!1}),u=0,$(".nav li").on(r,function(a){var c,d,e;for(c=0,d=f.length;d>c;c++)e=f[c],e.isSettled=!1;return b=!0,u=+new Date}),$(".nav li").on(s,function(a){return a.preventDefault(),"touchend"===a.type&&+new Date-u<500?setTimeout(function(){return b=!1},500):b=!1}),$(".nav li").on(s,function(a){return $(a.currentTarget).hasClass("btn-intro")&&k.showIntro(),$(a.currentTarget).hasClass("btn-skills")&&k.showSkills(),$(a.currentTarget).hasClass("btn-work")&&k.showWork(),$(a.currentTarget).hasClass("btn-contact")?k.showContact():void 0}),k=StateMachine.create({events:[{name:"startup",from:"none",to:"intro"},{name:"showIntro",from:["intro","skills","work","contact"],to:"intro"},{name:"showSkills",from:["intro","skills","work","contact"],to:"skills"},{name:"showWork",from:["intro","skills","work","contact"],to:"work"},{name:"showContact",from:["intro","skills","work","contact"],to:"contact"}],callbacks:{onstartup:function(a,b,c){return $(".page").not(".page-"+c).css({opacity:0,display:"none"}),$(".title").not(".title-"+c).css({opacity:0,display:"none"})},onleavestate:function(a,b,c){return"none"!==b?($(".page-"+b).css({opacity:0}).one(g,function(){return $(this).css({display:"none"})}),$(".title-"+b).css({opacity:0}).css({display:"none"})):void 0},onenterstate:function(a,b,c){return"none"!==b?($(".page-"+c).css({display:"block",opacity:1}),$(".title-"+c).css({display:"block",opacity:1})):void 0}}}),k.startup(),t=function(){return $(".page").not(".page-"+k.current).css({opacity:0,display:"block"}),$(".title").not(".title-"+k.current).css({opacity:0,display:"block"}),h(),$(".page").not(".page-"+k.current).css({opacity:0,display:"none"}),$(".title").not(".title-"+k.current).css({opacity:0,display:"none"})},window.addEventListener("resize",t),window.addEventListener("pageshow",t)})}).call(this);