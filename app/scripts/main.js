(function() {
  'use strict';
  var CharParticle, isHover, mX, mY, transformProp, transitionEnd, transitionEnds, walk, wrapChars, _ref;

  _ref = [null, null], mX = _ref[0], mY = _ref[1];

  isHover = false;

  transitionEnds = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'transition': 'transitionend'
  };

  transitionEnd = transitionEnds[Modernizr.prefixed('transition')];

  transformProp = Modernizr.prefixed('transform');

  walk = function(node, func) {
    var child, _i, _len, _ref1;
    _ref1 = node.childNodes;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      child = _ref1[_i];
      if (child.nodeType === 1) {
        walk(child, func);
      }
    }
    return func(node);
  };

  wrapChars = function(node) {
    var char, chars, child, textNode, textNodes, word, words, wrappedChars, wrappedWords;
    textNodes = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = node.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        if (child.nodeType === 3) {
          _results.push(child);
        }
      }
      return _results;
    })();
    words = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = textNodes.length; _i < _len; _i++) {
        textNode = textNodes[_i];
        _results.push(textNode.nodeValue);
      }
      return _results;
    })()).join('').split(' ');
    wrappedWords = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        word = words[_i];
        chars = word.split('');
        wrappedChars = (function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = chars.length; _j < _len1; _j++) {
            char = chars[_j];
            _results1.push("<span class='char'>" + char + "</span>");
          }
          return _results1;
        })();
        _results.push("<span class='word'>" + (wrappedChars.join('')) + "</span>");
      }
      return _results;
    })();
    node.firstChild.remove();
    return node.insertAdjacentHTML('afterbegin', wrappedWords.join(''));
  };

  CharParticle = (function() {
    function CharParticle(el) {
      this.el = el;
      this.time = 0;
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

    CharParticle.prototype.update = function(time) {
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
      this.render();
      return this.time = time;
    };

    CharParticle.prototype.render = function() {
      return this.el.style[transformProp] = this.isSettled ? "translateZ(0)" : "translate3d(" + this.x + "px, " + this.y + "px, 0)";
    };

    return CharParticle;

  })();

  $(function() {
    var animate, charParticles, el, fsm, isTouch, loaded, node, nodes, onMouseMove, pointerdown, pointerup, _i, _len;
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
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      node = nodes[_i];
      walk(node, wrapChars);
    }
    charParticles = (function() {
      var _j, _len1, _ref1, _results;
      _ref1 = document.querySelectorAll('.char');
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        el = _ref1[_j];
        _results.push(new CharParticle(el));
      }
      return _results;
    })();
    animate = function() {
      var p, _j, _len1;
      for (_j = 0, _len1 = charParticles.length; _j < _len1; _j++) {
        p = charParticles[_j];
        if (!p.isSettled) {
          p.update();
        }
      }
      return requestAnimationFrame(animate);
    };
    animate();
    isTouch = 'createTouch' in document;
    pointerdown = isTouch ? 'touchstart' : 'mousedown';
    pointerup = isTouch ? 'touchend' : 'mouseup';
    onMouseMove = function(e) {
      if (isTouch) {
        mX = parseInt(e.touches[0].pageX, 10);
        return mY = parseInt(e.touches[0].pageY, 10);
      } else {
        mX = parseInt(e.pageX, 10);
        return mY = parseInt(e.pageY, 10);
      }
    };
    if (isTouch) {
      document.addEventListener('touchstart', onMouseMove, false);
    } else {
      document.addEventListener('mousemove', onMouseMove, false);
    }
    if (!isTouch) {
      $('.nav li').hover(function() {
        var p, _j, _len1;
        for (_j = 0, _len1 = charParticles.length; _j < _len1; _j++) {
          p = charParticles[_j];
          p.isSettled = false;
        }
        return isHover = true;
      }, function() {
        return isHover = false;
      });
    }
    $('.nav li').on(pointerdown, function() {
      var p, _j, _len1;
      for (_j = 0, _len1 = charParticles.length; _j < _len1; _j++) {
        p = charParticles[_j];
        p.isSettled = false;
      }
      return isHover = true;
    });
    $('.nav li').on(pointerup, function() {
      if (isTouch) {
        return setTimeout((function() {
          return isHover = false;
        }), 200);
      } else {
        return isHover = false;
      }
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
              return $('.logo .icon-gnu').html('A');
            case 'skills':
              return $('.logo .icon-gnu').html('S');
            case 'work':
              return $('.logo .icon-gnu').html('W');
            case 'contact':
              return $('.logo .icon-gnu').html('C');
          }
        }
      }
    });
    return fsm.startup();
  });

}).call(this);
