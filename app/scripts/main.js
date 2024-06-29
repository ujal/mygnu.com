(function() {
  'use strict';
  var CharParticle, animate, bindEvents, charParticles, createParticles, delay, fsm, init, isHover, mX, mY, nodes, onPointer, onPointerDown, onPointerEnter, onPointerLeave, onPointerUp, ref, resetParticles, startIntroAnimation, timeSincePointerDown, transformProp, transitionEnd, transitionEnds, walk, wrapChars;

  CharParticle = (function() {
    function CharParticle(el1) {
      this.el = el1;
      this.x = 0;
      this.y = 0;
      this.velocityX = 0;
      this.velocityY = 0;
      this.updatePosition();
      this.isSettled = false;
    }

    CharParticle.prototype.updatePosition = function() {
      this.width = this.el.getBoundingClientRect().width;
      this.height = this.el.getBoundingClientRect().height;
      this.originX = this.el.getBoundingClientRect().left + this.width / 2;
      return this.originY = this.el.getBoundingClientRect().top + this.height / 2 - 100;
    };

    CharParticle.prototype.update = function() {
      var angle, d, dx, dy, force;
      dx = mX - (this.originX + this.x);
      dy = mY - (this.originY + this.y);
      d = Math.sqrt(dx * dx + dy * dy);
      angle = Math.atan2(dy, dx);
      if (isHover) {
        force = 1 - d / 1000;
        force *= force * 5;
        this.velocityX += Math.cos(angle) * force;
        this.velocityY += Math.sin(angle) * force;
      }
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.velocityX += (0 - this.x) * 0.005;
      this.velocityY += (0 - this.y) * 0.005;
      this.velocityX *= 0.90;
      this.velocityY *= 0.90;
      this.isSettled = (Math.abs(this.x) < 0.03 && Math.abs(this.y) < 0.03) && !isHover ? true : false;
      return this.render();
    };

    CharParticle.prototype.render = function() {
      return this.el.style[transformProp] = "translate3d(" + this.x + "px, " + this.y + "px, 0) rotate(" + this.x + "deg)";
    };

    return CharParticle;

  })();

  transitionEnds = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'transition': 'transitionend'
  };

  transitionEnd = transitionEnds[Modernizr.prefixed('transition')];

  walk = function(node, func) {
    var child, i, len, ref;
    ref = node.childNodes;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      if (child.nodeType === 1) {
        walk(child, func);
      }
    }
    return func(node);
  };

  wrapChars = function(node) {
    var char, chars, child, textNode, textNodes, word, words, wrappedChars, wrappedWords;
    textNodes = (function() {
      var i, len, ref, results;
      ref = node.childNodes;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        if (child.nodeType === 3) {
          results.push(child);
        }
      }
      return results;
    })();
    words = ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = textNodes.length; i < len; i++) {
        textNode = textNodes[i];
        results.push(textNode.nodeValue);
      }
      return results;
    })()).join('').split(' ');
    wrappedWords = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        chars = word.split('');
        wrappedChars = (function() {
          var j, len1, results1;
          results1 = [];
          for (j = 0, len1 = chars.length; j < len1; j++) {
            char = chars[j];
            results1.push("<div class='char'>" + char + "</div>");
          }
          return results1;
        })();
        results.push("<div class='word'>" + (wrappedChars.join('')) + "</div>");
      }
      return results;
    })();
    node.firstChild.remove();
    return node.insertAdjacentHTML('afterbegin', wrappedWords.join(''));
  };

  nodes = document.querySelectorAll('.split');

  transformProp = Modernizr.prefixed('transform');

  ref = [window.innerWidth / 2, window.innerHeight / 3], mX = ref[0], mY = ref[1];

  isHover = true;

  charParticles = [];

  createParticles = function() {
    var el, i, j, len, len1, ref1, ref2, results;
    charParticles = (function() {
      var i, len, ref1, results;
      ref1 = document.querySelectorAll('.char');
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        el = ref1[i];
        results.push(new CharParticle(el));
      }
      return results;
    })();
    ref1 = document.querySelectorAll('.dot');
    for (i = 0, len = ref1.length; i < len; i++) {
      el = ref1[i];
      charParticles.push(new CharParticle(el));
    }
    ref2 = document.querySelectorAll('.divider');
    results = [];
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      el = ref2[j];
      results.push(charParticles.push(new CharParticle(el)));
    }
    return results;
  };

  animate = function() {
    var i, len, p;
    for (i = 0, len = charParticles.length; i < len; i++) {
      p = charParticles[i];
      if (!p.isSettled) {
        p.update();
      }
    }
    return requestAnimationFrame(animate);
  };

  fsm = StateMachine.create({
    events: [
      {
        name: 'startup',
        from: 'none',
        to: 'about'
      }, {
        name: 'showAbout',
        from: ['about', 'skills', 'work', 'contact'],
        to: 'about'
      }, {
        name: 'showSkills',
        from: ['about', 'skills', 'work', 'contact'],
        to: 'skills'
      }, {
        name: 'showWork',
        from: ['about', 'skills', 'work', 'contact'],
        to: 'work'
      }, {
        name: 'showContact',
        from: ['about', 'skills', 'work', 'contact'],
        to: 'contact'
      }
    ],
    callbacks: {
      onbeforeevent: function(e, from, to) {
        if (from === to) {
          $(".title-" + to).css({
            opacity: 0,
            transform: 'scale(0)'
          });
          return delay(100).then(function() {
            return $(".title-" + to).css({
              opacity: 1,
              transform: 'scale(1)'
            });
          });
        }
      },
      onstartup: function(e, from, to) {
        $('.page').not(".page-" + to).css({
          opacity: 0,
          display: 'none'
        });
        return $('.title').css({
          opacity: 0,
          transform: 'scale(0)'
        });
      },
      onleavestate: function(e, from, to) {
        if (from === 'none') {
          return;
        }
        $(".page-" + from).css({
          opacity: 0
        }).one(transitionEnd, function() {
          return $(this).css({
            display: 'none'
          });
        });
        return $(".title-" + from).css({
          opacity: 0,
          transform: 'scale(0)'
        });
      },
      onenterstate: function(e, from, to) {
        $(".page-" + to).css({
          display: 'block',
          opacity: 1
        });
        return $(".title-" + to).css({
          opacity: 1,
          transform: 'scale(1)'
        });
      }
    }
  });

  resetParticles = function() {
    $('.page').not(".page-" + fsm.current).css({
      opacity: 0,
      display: 'block'
    });
    $('.title').not(".title-" + fsm.current).css({
      opacity: 0
    });
    createParticles();
    $('.page').not(".page-" + fsm.current).css({
      opacity: 0,
      display: 'none'
    });
    return $('.title').not(".title-" + fsm.current).css({
      opacity: 0
    });
  };

  onPointer = function(e) {
    mX = e.pageX;
    return mY = e.pageY;
  };

  timeSincePointerDown = 0;

  onPointerDown = function(e) {
    var i, len, p;
    for (i = 0, len = charParticles.length; i < len; i++) {
      p = charParticles[i];
      p.isSettled = false;
    }
    isHover = true;
    return timeSincePointerDown = +(new Date);
  };

  onPointerUp = function(e) {
    e.preventDefault();
    if ($(e.currentTarget).hasClass('btn-about')) {
      fsm.showAbout();
    }
    if ($(e.currentTarget).hasClass('btn-skills')) {
      fsm.showSkills();
    }
    if ($(e.currentTarget).hasClass('btn-work')) {
      fsm.showWork();
    }
    if ($(e.currentTarget).hasClass('btn-contact')) {
      fsm.showContact();
    }
    if (e.type === 'touchend') {
      if (+(new Date) - timeSincePointerDown < 500) {
        return setTimeout(function() {
          return isHover = false;
        }, 500);
      } else {
        return isHover = false;
      }
    } else {
      return isHover = false;
    }
  };

  onPointerEnter = function() {
    var i, len, p;
    for (i = 0, len = charParticles.length; i < len; i++) {
      p = charParticles[i];
      p.isSettled = false;
    }
    return isHover = true;
  };

  onPointerLeave = function() {
    return isHover = false;
  };

  bindEvents = function() {
    var pointerdown, pointerup;
    pointerdown = 'touchstart mousedown';
    pointerup = 'touchend mouseup';
    window.addEventListener('resize', resetParticles);
    window.addEventListener('pageshow', resetParticles);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('mousemove', onPointer);
    $('.nav li').on(pointerdown, onPointerDown);
    $('.nav li').on(pointerup, onPointerUp);
    return $('.nav li').hover(onPointerEnter, onPointerLeave);
  };

  delay = function(t) {
    return new Promise(function(resolve) {
      return setTimeout(resolve, t);
    });
  };

  startIntroAnimation = function() {
    $('body').css({
      opacity: 1
    });
    return delay(1000).then(function() {
      var i, len, p;
      isHover = false;
      for (i = 0, len = charParticles.length; i < len; i++) {
        p = charParticles[i];
        p.isSettled = false;
      }
      return delay(50);
    }).then(function() {
      $('.btn-about').css({
        opacity: 1,
        transform: 'scale(1)'
      });
      return delay(50);
    }).then(function() {
      $('.btn-skills').css({
        opacity: 1,
        transform: 'scale(1)'
      });
      return delay(50);
    }).then(function() {
      $('.btn-work').css({
        opacity: 1,
        transform: 'scale(1)'
      });
      return delay(50);
    }).then(function() {
      $('.btn-contact').css({
        opacity: 1,
        transform: 'scale(1)'
      });
      return delay(50);
    }).then(function() {
      return $('.title-about').css({
        opacity: 1,
        transform: 'scale(1)'
      });
    });
  };

  init = function() {
    var i, len, node;
    for (i = 0, len = nodes.length; i < len; i++) {
      node = nodes[i];
      walk(node, wrapChars);
    }
    createParticles();
    animate();
    return fsm.startup();
  };

  $(function() {
    var loaded;
    setTimeout(function() {
      return $(window).scrollTop(0);
    }, 0);
    loaded = [];
    return WebFont.load({
      custom: {
        families: ['Vollkorn:i4', 'Montserrat:n4,n7']
      },
      fontactive: function(familyName, fvd) {
        loaded.push(fvd);
        if (loaded.length === 3) {
          init();
          return startIntroAnimation().then(function() {
            return bindEvents();
          });
        }
      }
    });
  });

}).call(this);
