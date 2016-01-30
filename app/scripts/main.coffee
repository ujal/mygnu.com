'use strict'


[mX, mY] = [null, null]
isHover  = false

# TRANSITION AND TRANSOFRM NORMALIZATION
transitionEnds =
    'WebkitTransition' : 'webkitTransitionEnd'
    'MozTransition'    : 'transitionend'
    'transition'       : 'transitionend'

transitionEnd = transitionEnds[Modernizr.prefixed 'transition']
transformProp = Modernizr.prefixed 'transform'

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
                        wrappedChars = ("<span class='char'>#{char}</span>" for char in chars)
                        "<span class='word'>#{wrappedChars.join('')}</span>")

    node.firstChild.remove()
    node.insertAdjacentHTML 'afterbegin', wrappedWords.join('')


class CharParticle
    constructor: (@el) ->
        @time = 0

        @x = 0
        @y = 0
        @velocityX = 0
        @velocityY = 0

        @updatePosition()
        @isSettled = true

    updatePosition: () ->
        @width   = @el.offsetWidth
        @height  = @el.offsetHeight
        @originX = @el.getBoundingClientRect().left + @width / 2
        @originY = @el.getBoundingClientRect().top + @height / 2 - 150

    update: (time) ->

        # ATTRACTED TO POINTER
        dx = mX - (@originX + @x)
        dy = mY - (@originY + @y)

        # DISTANCE TO POINTER
        d  = Math.sqrt(dx * dx + dy * dy)

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

        @time = time

    render: () ->
        @el.style[transformProp] = if @isSettled then "translateZ(0)" else "translate3d(#{ @x }px, #{ @y }px, 0)"


$ ->

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
    charParticles = (new CharParticle el for el in document.querySelectorAll('.char'))

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
            mX = parseInt e.touches[0].pageX, 10
            mY = parseInt e.touches[0].pageY, 10
        else
            mX = parseInt e.pageX, 10
            mY = parseInt e.pageY, 10

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


    setLogo = (c) -> $('.logo .icon-gnu').html(c)
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
              $('.logo').css opacity: 1

            onleavestate: (e, from, to) ->
              return if from == 'none'
              $(".page-#{ from }").css(opacity: 0).one transitionEnd, -> $(@).css display: 'none'

            onenterstate: (e, from, to) ->
              return if from == 'none'
              $(".page-#{ to }").css display: 'block', opacity: 1

              switch to
                when 'intro'   then setLogo('A')
                when 'skills'  then setLogo('S')
                when 'work'    then setLogo('W')
                when 'contact' then setLogo('C')

    fsm.startup()
