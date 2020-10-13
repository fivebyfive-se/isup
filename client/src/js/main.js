(() => {
    const spinners = document.querySelectorAll('.find-spinner');
    const spinAnimations = [];
    const spinnerRex = /\[([\|\w\s]+)\]/;
    spinners.forEach((element) => {
        const matches = element.textContent.match(spinnerRex);
        console.log(element.textContent, matches);
        if (matches) {
            const [ _, spinner ] = matches;
            const texts = spinner.split('|');
            const spinnerElement = document.createElement('span');
            spinnerElement.classList.add('spinner');
            spinnerElement.textContent = texts[0];
            element.textContent = element.textContent.replace(spinnerRex, '');
            element.appendChild(spinnerElement);

            spinAnimations.push({
                element: spinnerElement,
                texts,
                currentWord: 0,
                currentChar: texts[0].length,
                direction: 1,
                delay: 0,
            });    
        }
    });

    let start = 0;
    const animate = (t) => {
        const diff = Math.min(Math.abs(t - start), 20);
            start = t;
        spinAnimations.forEach(anim => {
            if (anim.delay <= 0) {
                const currentWord = anim.texts[anim.currentWord];

                anim.element.classList.remove('done');
                anim.currentChar += anim.direction;
                anim.element.textContent = currentWord.slice(0, anim.currentChar);
                anim.delay = diff * 10;
    
                if (anim.currentChar === currentWord.length + 1) {
                    anim.direction = -1;
                    anim.delay = diff * 100;
                    anim.element.classList.add('done');
                } else if (anim.currentChar === 0) {
                    anim.currentWord = (anim.currentWord + 1) % anim.texts.length;
                    anim.direction = 1;
                }
            }
            anim.delay = Math.max(0, anim.delay - Math.abs(diff));
        });

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
})();

(() => {
    const drawLogo = (targetElement) => {
        const two = new Two({ width: 80, height: 80 }).appendTo(targetElement);
        const goalCircleish = [[0, 30], [-20, 20], [-15, 10], [0, -5], [15, 10], [20, 20], [0,  30]];
        const goalCircumflex = [[-30,30], [-20,20], [-10,10], [0,-5], [10,10], [20,20], [30,30]];
        const goalFinal = [[-30,30], [-20,30], [-10,30], [0,30], [10,30], [20,30], [30,30]];

        const path = two.makePath(
            -30,30,
            -20,30,
            -10,30,
            0,30,
            10,30,
            20,30,
            30,30,
            true
        );
        path.curved = true;
        path.join = 'bevel';
        path.center();

        const logo_group = two.makeGroup(path);
        logo_group.noFill();
        logo_group.stroke = 'var(--color-text)';
        logo_group.linewidth = '16px';
        logo_group.join = 'bevel';
        logo_group.translation.set(two.width / 2, 0);

        path.vertices.forEach((v, i) => {
            const { x, y } = v;

            const [ circleX, circleY ] = goalCircleish[i];
            const [ flexX, flexY ] = goalCircumflex[i];
            const [ finalX, finalY ] = goalFinal[i];
            const update = (pos) => {
                v.x = pos.x;
                v.y = pos.y;
            };

            const tweenFinal = new TWEEN.Tween({x: circleX, y:circleY })
                .to({ x: finalX, y: finalY }, 1000)
                .easing(TWEEN.Easing.Back.InOut)
                .onUpdate(update);

            const tweenCircle = new TWEEN.Tween({x: flexX, y: flexY})
                .to({ x: circleX, y: circleY }, 1000)
                .easing(TWEEN.Easing.Elastic.InOut)
                .onUpdate(update);

            const tweenCircumflex = new TWEEN.Tween({x, y})
                .to({ x: flexX, y: flexY }, 1500)
                .easing(TWEEN.Easing.Elastic.InOut)
                .onUpdate(update);

            tweenCircumflex.chain(tweenCircle);
            tweenCircle.chain(tweenFinal);
            tweenCircumflex.start(2500);
        });

        const animate = (time) => {
            requestAnimationFrame(animate);
            TWEEN.update(time);
            two.update();
        };
        requestAnimationFrame(animate);
    };

    document.querySelector('.header__logo svg').style.display = 'none';

    drawLogo(document.querySelector('.header__logo'));

})();