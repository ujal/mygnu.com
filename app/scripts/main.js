(function() {
  'use strict';
  var CharParticle, isHover, mX, mY, ref, transformProp, transitionEnd, transitionEnds, walk, wrapChars;

  transformProp = Modernizr.prefixed('transform');

  ref = [null, null], mX = ref[0], mY = ref[1];

  isHover = false;

  CharParticle = (function() {
    function CharParticle(el1) {
      this.el = el1;
      this.x = 0;
      this.y = 0;
      this.velocityX = 0;
      this.velocityY = 0;
      this.updatePosition();
      this.isSettled = true;
    }

    CharParticle.prototype.updatePosition = function() {
      this.width = this.el.offsetWidth;
      this.height = this.el.offsetHeight;
      this.originX = this.el.getBoundingClientRect().left + this.width / 2;
      return this.originY = this.el.getBoundingClientRect().top + this.height / 2 - 150;
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
      return this.el.style[transformProp] = this.isSettled ? "translateZ(0)" : "translate3d(" + this.x + "px, " + this.y + "px, 0)";
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
    var child, i, len, ref1;
    ref1 = node.childNodes;
    for (i = 0, len = ref1.length; i < len; i++) {
      child = ref1[i];
      if (child.nodeType === 1) {
        walk(child, func);
      }
    }
    return func(node);
  };

  wrapChars = function(node) {
    var char, chars, child, textNode, textNodes, word, words, wrappedChars, wrappedWords;
    textNodes = (function() {
      var i, len, ref1, results;
      ref1 = node.childNodes;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        child = ref1[i];
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
            results1.push("<span class='char'>" + char + "</span>");
          }
          return results1;
        })();
        results.push("<span class='word'>" + (wrappedChars.join('')) + "</span>");
      }
      return results;
    })();
    node.firstChild.remove();
    return node.insertAdjacentHTML('afterbegin', wrappedWords.join(''));
  };

  $(function() {
    var animate, charParticles, el, fsm, i, len, loaded, node, nodes, onPointer, pointerdown, pointerup, setLogo;
    loaded = [];
    WebFont.load({
      custom: {
        families: ['Vollkorn:i4', 'Montserrat:n4,n7']
      },
      fontactive: function(familyName, fvd) {
        loaded.push(fvd);
        if (loaded.length === 3) {
          return $('body').css({
            opacity: 1
          });
        }
      }
    });
    nodes = document.querySelectorAll('.split');
    for (i = 0, len = nodes.length; i < len; i++) {
      node = nodes[i];
      walk(node, wrapChars);
    }
    charParticles = (function() {
      var j, len1, ref1, results;
      ref1 = document.querySelectorAll('.char');
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        el = ref1[j];
        results.push(new CharParticle(el));
      }
      return results;
    })();
    animate = function() {
      var j, len1, p;
      for (j = 0, len1 = charParticles.length; j < len1; j++) {
        p = charParticles[j];
        if (!p.isSettled) {
          p.update();
        }
      }
      return requestAnimationFrame(animate);
    };
    animate();
    pointerdown = 'touchstart mousedown';
    pointerup = 'touchend mouseup';
    onPointer = function(e) {
      if (e.touches) {
        mX = parseInt(e.touches[0].pageX, 10);
        return mY = parseInt(e.touches[0].pageY, 10);
      } else {
        mX = parseInt(e.pageX, 10);
        return mY = parseInt(e.pageY, 10);
      }
    };
    document.addEventListener('touchstart', onPointer, false);
    document.addEventListener('mousemove', onPointer, false);
    $('.nav li').hover(function() {
      var j, len1, p;
      for (j = 0, len1 = charParticles.length; j < len1; j++) {
        p = charParticles[j];
        p.isSettled = false;
      }
      return isHover = true;
    }, function() {
      return isHover = false;
    });
    $('.nav li').on(pointerdown, function() {
      var j, len1, p;
      for (j = 0, len1 = charParticles.length; j < len1; j++) {
        p = charParticles[j];
        p.isSettled = false;
      }
      return isHover = true;
    });
    $('.nav li').on(pointerup, function() {
      return isHover = false;
    });
    $('.nav li').on(pointerup, function(e) {
      if ($(e.target).hasClass('btn-intro')) {
        fsm.showIntro();
      }
      if ($(e.target).hasClass('btn-skills')) {
        fsm.showSkills();
      }
      if ($(e.target).hasClass('btn-work')) {
        fsm.showWork();
      }
      if ($(e.target).hasClass('btn-contact')) {
        return fsm.showContact();
      }
    });
    setLogo = function(c) {
      return $('.logo .icon-gnu').html(c);
    };
    fsm = StateMachine.create({
      events: [
        {
          name: 'startup',
          from: 'none',
          to: 'intro'
        }, {
          name: 'showIntro',
          from: ['intro', 'skills', 'work', 'contact'],
          to: 'intro'
        }, {
          name: 'showSkills',
          from: ['intro', 'skills', 'work', 'contact'],
          to: 'skills'
        }, {
          name: 'showWork',
          from: ['intro', 'skills', 'work', 'contact'],
          to: 'work'
        }, {
          name: 'showContact',
          from: ['intro', 'skills', 'work', 'contact'],
          to: 'contact'
        }
      ],
      callbacks: {
        onstartup: function(e, from, to) {
          $('.page').not(".page-" + to).css({
            opacity: 0,
            display: 'none'
          });
          return $('.logo').css({
            opacity: 1
          });
        },
        onleavestate: function(e, from, to) {
          if (from === 'none') {
            return;
          }
          return $(".page-" + from).css({
            opacity: 0
          }).one(transitionEnd, function() {
            return $(this).css({
              display: 'none'
            });
          });
        },
        onenterstate: function(e, from, to) {
          if (from === 'none') {
            return;
          }
          $(".page-" + to).css({
            display: 'block',
            opacity: 1
          });
          switch (to) {
            case 'intro':
              return setLogo('A');
            case 'skills':
              return setLogo('S');
            case 'work':
              return setLogo('W');
            case 'contact':
              return setLogo('C');
          }
        }
      }
    });
    return fsm.startup();
  });

}).call(this);
