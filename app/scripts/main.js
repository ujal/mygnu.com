(function(){"use strict";var a,b,c,d,e,f,g,h,i,j;j=[null,null],c=j[0],d=j[1],b=!1,g={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",transition:"transitionend"},f=g[Modernizr.prefixed("transition")],e=Modernizr.prefixed("transform"),h=function(a,b){var c,d,e,f;for(f=a.childNodes,d=0,e=f.length;e>d;d++)c=f[d],1===c.nodeType&&h(c,b);return b(a)},i=function(a){var b,c,d,e,f,g,h,i,j;return f=function(){var b,c,e,f;for(e=a.childNodes,f=[],b=0,c=e.length;c>b;b++)d=e[b],3===d.nodeType&&f.push(d);return f}(),h=function(){var a,b,c;for(c=[],a=0,b=f.length;b>a;a++)e=f[a],c.push(e.nodeValue);return c}().join("").split(" "),j=function(){var a,d,e;for(e=[],a=0,d=h.length;d>a;a++)g=h[a],c=g.split(""),i=function(){var a,d,e;for(e=[],a=0,d=c.length;d>a;a++)b=c[a],e.push("<span class='char'>"+b+"</span>");return e}(),e.push("<span class='word'>"+i.join("")+"</span>");return e}(),a.firstChild.remove(),a.insertAdjacentHTML("afterbegin",j.join(""))},a=function(){function a(a){this.el=a,this.time=0,this.x=0,this.y=0,this.velocityX=0,this.velocityY=0,this.updatePosition(),this.isSettled=!0}return a.prototype.updatePosition=function(){return this.width=this.el.offsetWidth,this.height=this.el.offsetHeight,this.originX=this.el.getBoundingClientRect().left+this.width/2,this.originY=this.el.getBoundingClientRect().top+this.height/2-150},a.prototype.update=function(a){var e,f,g,h,i;return g=c-(this.originX+this.x),h=d-(this.originY+this.y),f=Math.sqrt(g*g+h*h),e=Math.atan2(h,g),b&&(i=1-f/1e3,i*=5*i,this.velocityX+=Math.cos(e)*i,this.velocityY+=Math.sin(e)*i),this.x+=this.velocityX,this.y+=this.velocityY,this.velocityX+=.005*(0-this.x),this.velocityY+=.005*(0-this.y),this.velocityX*=.9,this.velocityY*=.9,this.isSettled=Math.abs(this.x)<.03&&Math.abs(this.y)<.03&&!b?!0:!1,this.render(),this.time=a},a.prototype.render=function(){return this.el.style[e]=this.isSettled?"translateZ(0)":"translate3d("+this.x+"px, "+this.y+"px, 0)"},a}(),$(function(){var e,g,j,k,l,m,n,o,p,q,r,s,t;for(l=[],WebFont.load({custom:{families:["Vollkorn:i4","Montserrat:n4,n7"]},fontactive:function(a,b){return l.push(b),3===l.length?$("body").css({opacity:1}):void 0}}),n=document.querySelectorAll(".split"),s=0,t=n.length;t>s;s++)m=n[s],h(m,i);return g=function(){var b,c,d,e;for(d=document.querySelectorAll(".char"),e=[],b=0,c=d.length;c>b;b++)j=d[b],e.push(new a(j));return e}(),e=function(){var a,b,c;for(b=0,c=g.length;c>b;b++)a=g[b],a.isSettled||a.update();return requestAnimationFrame(e)},e(),p="touchstart mousedown",q="touchend mouseup",o=function(a){return a.touches?(c=parseInt(a.touches[0].pageX,10),d=parseInt(a.touches[0].pageY,10)):(c=parseInt(a.pageX,10),d=parseInt(a.pageY,10))},document.addEventListener("touchstart",o,!1),document.addEventListener("mousemove",o,!1),$(".nav li").hover(function(){var a,c,d;for(c=0,d=g.length;d>c;c++)a=g[c],a.isSettled=!1;return b=!0},function(){return b=!1}),$(".nav li").on(p,function(){var a,c,d;for(c=0,d=g.length;d>c;c++)a=g[c],a.isSettled=!1;return b=!0}),$(".nav li").on(q,function(){return b=!1}),$(".nav li").on(q,function(a){return $(a.target).hasClass("btn-intro")&&k.showIntro(),$(a.target).hasClass("btn-skills")&&k.showSkills(),$(a.target).hasClass("btn-work")&&k.showWork(),$(a.target).hasClass("btn-contact")?k.showContact():void 0}),r=function(a){return $(".logo .icon-gnu").html(a)},k=StateMachine.create({events:[{name:"startup",from:"none",to:"intro"},{name:"showIntro",from:["intro","skills","work","contact"],to:"intro"},{name:"showSkills",from:["intro","skills","work","contact"],to:"skills"},{name:"showWork",from:["intro","skills","work","contact"],to:"work"},{name:"showContact",from:["intro","skills","work","contact"],to:"contact"}],callbacks:{onstartup:function(a,b,c){return $(".page").not(".page-"+c).css({opacity:0,display:"none"}),$(".logo").css({opacity:1})},onleavestate:function(a,b,c){return"none"!==b?$(".page-"+b).css({opacity:0}).one(f,function(){return $(this).css({display:"none"})}):void 0},onenterstate:function(a,b,c){if("none"!==b)switch($(".page-"+c).css({display:"block",opacity:1}),c){case"intro":return r("A");case"skills":return r("S");case"work":return r("W");case"contact":return r("C")}}}}),k.startup()})}).call(this);