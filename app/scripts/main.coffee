'use strict'

class CharParticle
    constructor: (@el) ->
        @x = 0
        @y = 0
        @velocityX = 0
        @velocityY = 0

        @updatePosition()
        @isSettled = false

    updatePosition: () ->
        @width   = @el.getBoundingClientRect().width
        @height  = @el.getBoundingClientRect().height
        @originX = @el.getBoundingClientRect().left + @width / 2
        @originY = @el.getBoundingClientRect().top + @height / 2 - 100

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


# PARSE, SPLIT AND WRAP
nodes = document.querySelectorAll('.split')


# CREATE PARTICLES
transformProp = Modernizr.prefixed 'transform'
[mX, mY] = [window.innerWidth / 2, window.innerHeight / 3]
isHover  = true
charParticles = []
createParticles = ->
    charParticles = (new CharParticle el for el in document.querySelectorAll('.char'))
    charParticles.push new CharParticle el for el in document.querySelectorAll('.dot')
    charParticles.push new CharParticle el for el in document.querySelectorAll('.divider')


# ANIMATION LOOP
animate = ->
    for p in charParticles
        p.update() if not p.isSettled
    requestAnimationFrame animate


# STATE TRANSITIONS
fsm = StateMachine.create
    events: [
        { name: 'startup',     from: 'none', to: 'about' }
        { name: 'showAbout',   from: ['about', 'skills', 'work', 'contact'], to: 'about' }
        { name: 'showSkills',  from: ['about', 'skills', 'work', 'contact'], to: 'skills' }
        { name: 'showWork',    from: ['about', 'skills', 'work', 'contact'], to: 'work' }
        { name: 'showContact', from: ['about', 'skills', 'work', 'contact'], to: 'contact' }
    ],
    callbacks:
        onbeforeevent: (e, from, to) ->
          if from == to
            $(".title-#{ to }").css opacity: 0, transform: 'scale(0)'
            delay(100).then ->
              $(".title-#{ to }").css opacity: 1, transform: 'scale(1)'

        onstartup: (e, from, to) ->
          $('.page').not(".page-#{ to }").css opacity: 0, display: 'none'
          $('.title').css opacity: 0, transform: 'scale(0)'

        onleavestate: (e, from, to) ->
          return if from == 'none'
          $(".page-#{ from }").css(opacity: 0).one transitionEnd, -> $(@).css display: 'none'
          $(".title-#{ from }").css opacity: 0, transform: 'scale(0)'

        onenterstate: (e, from, to) ->
          $(".page-#{ to }").css display: 'block', opacity: 1
          $(".title-#{ to }").css opacity: 1, transform: 'scale(1)'


# HANDLERS
resetParticles = ->
    $('.page').not(".page-#{ fsm.current }").css opacity: 0, display: 'block'
    $('.title').not(".title-#{ fsm.current }").css opacity: 0
    createParticles()
    $('.page').not(".page-#{ fsm.current }").css opacity: 0, display: 'none'
    $('.title').not(".title-#{ fsm.current }").css opacity: 0

onPointer = (e) ->
  mX = e.pageX
  mY = e.pageY

timeSincePointerDown = 0
onPointerDown = (e) ->
  (p.isSettled = false) for p in charParticles
  isHover = true
  timeSincePointerDown = +new Date

onPointerUp = (e) ->
  e.preventDefault()

  fsm.showAbout()   if $(e.currentTarget).hasClass 'btn-about'
  fsm.showSkills()  if $(e.currentTarget).hasClass 'btn-skills'
  fsm.showWork()    if $(e.currentTarget).hasClass 'btn-work'
  fsm.showContact() if $(e.currentTarget).hasClass 'btn-contact'

  if e.type == 'touchend'
   if +new Date - timeSincePointerDown < 500
     setTimeout ->
       isHover = false
     , 500
   else
     isHover = false
  else
   isHover = false

onPointerEnter = ->
  (p.isSettled = false) for p in charParticles
  isHover = true

onPointerLeave = ->
  isHover = false

onMouseMove = (e) ->
  $('.invert').width e.pageX

# EVENTS
bindEvents = ->
  pointerdown = 'touchstart mousedown'
  pointerup = 'touchend mouseup'
  window.addEventListener 'resize', resetParticles
  window.addEventListener 'pageshow', resetParticles
  document.addEventListener 'touchstart', onPointer
  document.addEventListener 'mousemove', onPointer
  document.addEventListener 'mousemove', onMouseMove
  $('.nav li').on pointerdown, onPointerDown
  $('.nav li').on pointerup, onPointerUp
  $('.nav li').hover onPointerEnter, onPointerLeave


# INTRO ANIMATION
delay = (t) ->
  new Promise (resolve) ->
    setTimeout resolve, t

startIntroAnimation = ->
  $('body').css opacity: 1

  delay(1000).then ->
    isHover = false
    (p.isSettled = false) for p in charParticles

    delay 50
  .then ->
    $('.btn-about').css opacity: 1, transform: 'scale(1)'

    delay 50
  .then ->
    $('.btn-skills').css opacity: 1, transform: 'scale(1)'

    delay 50
  .then ->
    $('.btn-work').css opacity: 1, transform: 'scale(1)'

    delay 50
  .then ->
    $('.btn-contact').css opacity: 1, transform: 'scale(1)'

    delay 50
  .then ->
    $('.title-about').css opacity: 1, transform: 'scale(1)'

  .then ->
    $('.invert').css opacity: 1

init = ->
  walk(node, wrapChars) for node in nodes
  createParticles()
  animate()
  fsm.startup()


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
            init()
            startIntroAnimation().then ->
              bindEvents()

