(function(){"use strict";var a,b,c,d,e,f,g,h,i,j;f=Modernizr.prefixed("transform"),e=[null,null],c=e[0],d=e[1],b=!1,a=function(){function a(a){this.el=a,this.x=0,this.y=0,this.velocityX=0,this.velocityY=0,this.updatePosition(),this.isSettled=!0}return a.prototype.updatePosition=function(){return this.width=this.el.getBoundingClientRect().width,this.height=this.el.getBoundingClientRect().height,this.originX=this.el.getBoundingClientRect().left+this.width/2,this.originY=this.el.getBoundingClientRect().top+this.height/2-125},a.prototype.update=function(){var a,e,f,g,h;return f=c-(this.originX+this.x),g=d-(this.originY+this.y),e=Math.sqrt(f*f+g*g),a=Math.atan2(g,f),b&&(h=1-e/1e3,h*=5*h,this.velocityX+=Math.cos(a)*h,this.velocityY+=Math.sin(a)*h),this.x+=this.velocityX,this.y+=this.velocityY,this.velocityX+=.005*(0-this.x),this.velocityY+=.005*(0-this.y),this.velocityX*=.9,this.velocityY*=.9,this.isSettled=Math.abs(this.x)<.03&&Math.abs(this.y)<.03&&!b?!0:!1,this.render()},a.prototype.render=function(){return this.el.style[f]="translate3d("+this.x+"px, "+this.y+"px, 0) rotate("+this.x+"deg)"},a}(),h={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",transition:"transitionend"},g=h[Modernizr.prefixed("transition")],i=function(a,b){var c,d,e,f;for(f=a.childNodes,d=0,e=f.length;e>d;d++)c=f[d],1===c.nodeType&&i(c,b);return b(a)},j=function(a){var b,c,d,e,f,g,h,i,j;return f=function(){var b,c,e,f;for(e=a.childNodes,f=[],b=0,c=e.length;c>b;b++)d=e[b],3===d.nodeType&&f.push(d);return f}(),h=function(){var a,b,c;for(c=[],a=0,b=f.length;b>a;a++)e=f[a],c.push(e.nodeValue);return c}().join("").split(" "),j=function(){var a,d,e;for(e=[],a=0,d=h.length;d>a;a++)g=h[a],c=g.split(""),i=function(){var a,d,e;for(e=[],a=0,d=c.length;d>a;a++)b=c[a],e.push("<div class='char'>"+b+"</div>");return e}(),e.push("<div class='word'>"+i.join("")+"</div>");return e}(),a.firstChild.remove(),a.insertAdjacentHTML("afterbegin",j.join(""))},$(function(){var e,f,h,k,l,m,n,o,p,q,r,s,t;for(setTimeout(function(){return $(window).scrollTop(0)},0),n=[],WebFont.load({custom:{families:["Vollkorn:i4","Montserrat:n4,n7"]},fontactive:function(a,b){return n.push(b),3===n.length?$("body").css({opacity:1}):void 0}}),p=document.querySelectorAll(".split"),l=0,m=p.length;m>l;l++)o=p[l],i(o,j);return f=[],h=function(){var b,c,d,e,g,h,i,j;for(f=function(){var c,d,e,f;for(e=document.querySelectorAll(".char"),f=[],c=0,d=e.length;d>c;c++)b=e[c],f.push(new a(b));return f}(),h=document.querySelectorAll(".dot"),c=0,e=h.length;e>c;c++)b=h[c],f.push(new a(b));for(i=document.querySelectorAll(".divider"),j=[],d=0,g=i.length;g>d;d++)b=i[d],j.push(f.push(new a(b)));return j},h(),e=function(){var a,b,c;for(a=0,b=f.length;b>a;a++)c=f[a],c.isSettled||c.update();return requestAnimationFrame(e)},e(),r="touchstart mousedown",s="touchend mouseup",q=function(a){return a.touches?(c=a.touches[0].pageX,d=a.touches[0].pageY):(c=a.pageX,d=a.pageY)},document.addEventListener("touchstart",q,!1),document.addEventListener("mousemove",q,!1),$(".nav li").hover(function(){var a,c,d;for(a=0,c=f.length;c>a;a++)d=f[a],d.isSettled=!1;return b=!0},function(){return b=!1}),$(".nav li").on(r,function(){var a,c,d;for(a=0,c=f.length;c>a;a++)d=f[a],d.isSettled=!1;return b=!0}),$(".nav li").on(s,function(){return b=!1}),$(".nav li").on(s,function(a){return $(a.currentTarget).hasClass("btn-intro")&&k.showIntro(),$(a.currentTarget).hasClass("btn-skills")&&k.showSkills(),$(a.currentTarget).hasClass("btn-work")&&k.showWork(),$(a.currentTarget).hasClass("btn-contact")?k.showContact():void 0}),k=StateMachine.create({events:[{name:"startup",from:"none",to:"intro"},{name:"showIntro",from:["intro","skills","work","contact"],to:"intro"},{name:"showSkills",from:["intro","skills","work","contact"],to:"skills"},{name:"showWork",from:["intro","skills","work","contact"],to:"work"},{name:"showContact",from:["intro","skills","work","contact"],to:"contact"}],callbacks:{onstartup:function(a,b,c){return $(".page").not(".page-"+c).css({opacity:0,display:"none"}),$(".title").not(".title-"+c).css({opacity:0,display:"none"})},onleavestate:function(a,b,c){return"none"!==b?($(".page-"+b).css({opacity:0}).one(g,function(){return $(this).css({display:"none"})}),$(".title-"+b).css({opacity:0}).css({display:"none"})):void 0},onenterstate:function(a,b,c){return"none"!==b?($(".page-"+c).css({display:"block",opacity:1}),$(".title-"+c).css({display:"block",opacity:1})):void 0}}}),k.startup(),t=function(){return $(".page").not(".page-"+k.current).css({opacity:0,display:"block"}),$(".title").not(".title-"+k.current).css({opacity:0,display:"block"}),h(),$(".page").not(".page-"+k.current).css({opacity:0,display:"none"}),$(".title").not(".title-"+k.current).css({opacity:0,display:"none"})},window.addEventListener("resize",t),window.addEventListener("pageshow",t)})}).call(this);