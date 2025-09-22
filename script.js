
gsap.registerPlugin(CustomEase, EasePack, CustomWiggle);

jQuery(function($) {
    let flowerInterval;
    const letterContainer = $('#letterContainer');
    const gift = $('g.surprise-gift');
    const fallingContainer = $('<div id="falling-container"></div>').appendTo('body');
    const flowers = ['🌻', '❤️'];

    $('[data-origin]').each(function() {
        gsap.set($(this).get(0), { transformOrigin: $(this).attr('data-origin') });
    });

    CustomWiggle.create('giftShake', { wiggles: 60, timingEase: 'expo.out' });

    let openGiftTL = gsap.timeline({
        paused: true,
        onComplete: showLetterAndStartFlowers
    });
    
    openGiftTL.to(gift, { rotation: 2.5, duration: 2, ease: 'giftShake', onStart: () => $('.bg').removeClass('gift-open') });
    openGiftTL.to(gift.find('.lid'), {
        yPercent: -70,
        rotation: -5,
        duration: 0.25,
        delay: -0.15,
        ease: 'back.out(4)',
        onStart: () => $('.bg').addClass('gift-open'),
    });
    openGiftTL.to(gift.find('.lid-cast-shadow'), { scaleY: 2, opacity: 0, duration: 0.25, delay: -0.4, ease: 'expo.in' });

    gift.on('click', function() {
        if (!openGiftTL.isActive()) {
            openGiftTL.play(0);
        }
    });

   
    $(document).on('keydown', function(event) {
        if (event.key === 'Enter') {
            gift.trigger('click');
        }
    });

    function showLetterAndStartFlowers() {
        letterContainer.fadeIn(500);
        flowerInterval = setInterval(dropFlowers, 150);
    }

    function dropFlowers() {
        const piece = $('<div class="flower-piece"></div>');
        const flowerEmoji = flowers[Math.floor(Math.random() * flowers.length)];
        piece.html(flowerEmoji);
        
        const startX = Math.random() * window.innerWidth;
        const startRotation = Math.random() * 360;
        const startSize = Math.random() * 20 + 20;

        piece.css({
            left: startX,
            top: '-50px',
            fontSize: startSize + 'px',
            transform: `rotate(${startRotation}deg)`
        });

        fallingContainer.append(piece);

        const duration = Math.random() * 4 + 5;
        const endY = window.innerHeight + 50;
        const endRotation = startRotation + (Math.random() - 0.5) * 720;
        const driftX = (Math.random() - 0.5) * 300;

        gsap.to(piece, {
            y: endY,
            x: `+=${driftX}`,
            rotation: endRotation,
            duration: duration,
            ease: 'none',
            onComplete: () => piece.remove()
        });
    }

    $('#letterImage').on('click', function() {
        letterContainer.fadeOut(500);
        clearInterval(flowerInterval);

        let closeGiftTL = gsap.timeline({ delay: 0.5 });
        closeGiftTL.to(gift.find('.lid'), { yPercent: 0, rotation: 0, duration: 0.5, ease: 'bounce.out' });
        closeGiftTL.to(gift.find('.lid-cast-shadow'), { scaleY: 1, opacity: 0.2, duration: 0.5, delay: -0.5, ease: 'bounce.out' });
        closeGiftTL.to(gift, { rotation: 0, duration: 1.5, ease: 'elastic.out(1, 0.3)', delay: -0.2 });
    });
});