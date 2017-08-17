'use strict'


transformProp = Modernizr.prefixed 'transform'

[mX, mY] = [null, null]
isHover  = false

class CharParticle
    constructor: (@el) ->
        @x = 0
        @y = 0
        @velocityX = 0
        @velocityY = 0

        @updatePosition()
        @isSettled = true

    updatePosition: () ->
        @width   = @el.getBoundingClientRect().width
        @height  = @el.getBoundingClientRect().height
        @originX = @el.getBoundingClientRect().left + @width / 2
        @originY = @el.getBoundingClientRect().top + @height / 2 - 125

    update: () ->
        # ATTRACTED TO POINTER
        dx = mX - (@originX + @x)
        dy = mY - (@originY + @y)

        # DISTANCE TO POINTER
        d = Math.sqrt(dx * dx + dy * dy)

        # ANGLE TO POINTER
        angle = Math.atan2(dy, dx)

        if isHover
            force = 1 - d / 1000
            force *= force * 5
            @velocityX += Math.cos(angle) * force
            @velocityY += Math.sin(angle) * force

        # INTEGRATE VELOCITY
        @x += @velocityX
        @y += @velocityY

        # ATTRACTED TO START POSITION
        @velocityX += (0 - @x) * 0.005
        @velocityY += (0 - @y) * 0.005

        # APPLY FRICTION
        @velocityX *= 0.90
        @velocityY *= 0.90

        @isSettled = if (Math.abs(@x) < 0.03 and Math.abs(@y) < 0.03) and not isHover then true else false

        @render()

    render: () ->
        @el.style[transformProp] = "translate3d(#{ @x }px, #{ @y }px, 0) rotate(#{@x}deg)"


# TRANSITION NORMALIZATION
transitionEnds =
    'WebkitTransition' : 'webkitTransitionEnd'
    'MozTransition'    : 'transitionend'
    'transition'       : 'transitionend'

transitionEnd = transitionEnds[Modernizr.prefixed 'transition']


# WALK THE DOM
walk = (node, func) ->
    walk(child, func) for child in node.childNodes when child.nodeType is 1
    func(node)


wrapChars = (node) ->
    # TODO: SUPPORT MORE TYPES
    textNodes    = (child for child in node.childNodes when child.nodeType is 3)
    words        = (textNode.nodeValue for textNode in textNodes).join('').split(' ')
    wrappedWords = (for word in words
                        chars = word.split('')
                        wrappedChars = ("<div class='char'>#{char}</div>" for char in chars)
                        "<div class='word'>#{wrappedChars.join('')}</div>")

    node.firstChild.remove()
    node.insertAdjacentHTML 'afterbegin', wrappedWords.join ''


$ ->
  setTimeout ->
      $(window).scrollTop 0
  , 0 # Chrome e.pageY bug on scrolled reload

  # WAIT FOR FONTS
  loaded = []
  WebFont.load
      custom:
          families: ['Vollkorn:i4', 'Montserrat:n4,n7']

      fontactive: (familyName, fvd) ->
          loaded.push(fvd)

          if loaded.length == 3
              $('body').css opacity: 1


  # PARSE, SPLIT AND WRAP
  nodes = document.querySelectorAll('.split')
  walk(node, wrapChars) for node in nodes

  # CREATE PARTICLES
  charParticles = []
  createParticles = ->
      charParticles = (new CharParticle el for el in document.querySelectorAll('.char'))
      charParticles.push new CharParticle el for el in document.querySelectorAll('.dot')
      charParticles.push new CharParticle el for el in document.querySelectorAll('.divider')
  createParticles()

  # ANIMATION LOOP
  animate = ->
      for p in charParticles
          p.update() if not p.isSettled
      requestAnimationFrame animate
  animate()


  # EVENTS
  pointerdown = 'touchstart mousedown'
  pointerup   = 'touchend mouseup'

  onPointer = (e) ->
      if e.touches
          mX = e.touches[0].pageX
          mY = e.touches[0].pageY
      else
          mX = e.pageX
          mY = e.pageY

  document.addEventListener 'touchstart', onPointer, false
  document.addEventListener 'mousemove', onPointer, false

  $('.nav li').hover(
      ->
        (p.isSettled = false) for p in charParticles
        isHover = true
      ->
        isHover = false
  )

  $('.nav li').on pointerdown, ->
      (p.isSettled = false) for p in charParticles
      isHover = true

  $('.nav li').on pointerup, ->
      isHover = false


  # STATE TRANSITIONS
  $('.nav li').on pointerup, (e) ->
      fsm.showIntro()   if $(e.target).hasClass 'btn-intro'
      fsm.showSkills()  if $(e.target).hasClass 'btn-skills'
      fsm.showWork()    if $(e.target).hasClass 'btn-work'
      fsm.showContact() if $(e.target).hasClass 'btn-contact'


  fsm = StateMachine.create
      events: [
          { name: 'startup',     from: 'none', to: 'intro' }
          { name: 'showIntro',   from: ['intro', 'skills', 'work', 'contact'], to: 'intro' }
          { name: 'showSkills',  from: ['intro', 'skills', 'work', 'contact'], to: 'skills' }
          { name: 'showWork',    from: ['intro', 'skills', 'work', 'contact'], to: 'work' }
          { name: 'showContact', from: ['intro', 'skills', 'work', 'contact'], to: 'contact' }
      ],
      callbacks:
          onstartup: (e, from, to) ->
            $('.page').not(".page-#{ to }").css opacity: 0, display: 'none'
            $('.title').not(".title-#{ to }").css opacity: 0, display: 'none'

          onleavestate: (e, from, to) ->
            return if from == 'none'
            $(".page-#{ from }").css(opacity: 0).one transitionEnd, -> $(@).css display: 'none'
            $(".title-#{ from }").css(opacity: 0).css display: 'none'

          onenterstate: (e, from, to) ->
            return if from == 'none'
            $(".page-#{ to }").css display: 'block', opacity: 1
            $(".title-#{ to }").css display: 'block', opacity: 1

  fsm.startup()

  resetParticles = ->
      $('.page').not(".page-#{ fsm.current }").css opacity: 0, display: 'block'
      $('.title').not(".title-#{ fsm.current }").css opacity: 0, display: 'block'
      createParticles()
      $('.page').not(".page-#{ fsm.current }").css opacity: 0, display: 'none'
      $('.title').not(".title-#{ fsm.current }").css opacity: 0, display: 'none'

  window.addEventListener 'resize', resetParticles
  window.addEventListener 'pageshow', resetParticles

