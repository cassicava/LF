window.addEventListener('focus', () => {
    if (esperandoVoltaConfete) {
        confetti({
            particleCount: 300,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#128C7E', '#25D366', '#3182ce', '#ffffff']
        });
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 160,
                origin: { y: 0.7 },
                colors: ['#128C7E', '#25D366', '#3182ce', '#ffffff']
            });
        }, 300);
        esperandoVoltaConfete = false;
    }
});

document.addEventListener('mousemove', (e) => {
    mouseShadow.style.left = e.clientX + 'px';
    mouseShadow.style.top = e.clientY + 'px';
});

appTitle.addEventListener('click', (e) => {
    currentClicks++;
    
    if (currentClicks >= clicksNeeded) {
        const easterEmojis = ['\uD83D\uDE80', '\uD83C\uDF89', '\uD83D\uDE0E', '\uD83D\uDCBB', '\uD83E\uDD73', '\uD83D\uDE4C', '\u2728', '\uD83D\uDD25'];
        
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const el = document.createElement('div');
                el.className = 'flying-emoji';
                el.innerText = easterEmojis[Math.floor(Math.random() * easterEmojis.length)];
                el.style.left = e.clientX + 'px';
                el.style.top = e.clientY + 'px';
                
                const tx = (Math.random() - 0.5) * 400 + 'px';
                const ty = (Math.random() - 0.5) * 400 + 'px';
                const rot = (Math.random() - 0.5) * 180 + 'deg';
                
                el.style.setProperty('--tx', tx);
                el.style.setProperty('--ty', ty);
                el.style.setProperty('--rot', rot);
                
                document.body.appendChild(el);
                
                setTimeout(() => el.remove(), 1500);
            }, i * 50);
        }
        
        currentClicks = 0;
        clicksNeeded = Math.floor(Math.random() * 11) + 10;
    }
});