document.addEventListener("DOMContentLoaded", function () {

    /* ============================================================
       1) MENU / SEÇÕES
    ============================================================ */
    const menuItems = document.querySelectorAll("nav .menu-item");
    const sections = document.querySelectorAll(".page-section");

    // Função para mostrar apenas a section ativa
    function showSection(targetId) {
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add("active");
                section.style.display = "block";
                section.scrollIntoView({ behavior: 'smooth' });
            } else {
                section.classList.remove("active");
                section.style.display = "none";
            }
        });
    }

    // Inicializa com a section HOME ativa
    showSection("home");
    menuItems.forEach(item => {
        if (item.getAttribute("data-target") === "home") {
            item.classList.add("active");
        }
    });

    // Clique no menu
    menuItems.forEach(item => {
        item.addEventListener("click", e => {
            e.preventDefault();
            const targetId = item.getAttribute("data-target");

            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            showSection(targetId);
        });
    });

    /* ============================================================
       2) ANIMAÇÃO DE IMAGENS - appear on scroll
    ============================================================ */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".page-section.active img").forEach(img => observer.observe(img));

    /* ============================================================
       3) CARROSSEL SUAVE (LOOP INFINITO)
    ============================================================ */
    const track = document.querySelector('.carousel-track');
    const speedBtn = document.getElementById('speedBtn');

    if (track && speedBtn) {
        let speed = 90, speedBeforePause = 90, position = 0, lastTime = null, mode = 2;
        speedBtn.textContent = "Velocidade: Normal ⚡";

        function animateCarousel(time) {
            if (lastTime !== null) {
                const delta = time - lastTime;
                position -= (speed * delta) / 1000;
                const width = track.scrollWidth / 2;
                if (Math.abs(position) >= width) position = 0;
                track.style.transform = `translateX(${position}px)`;
            }
            lastTime = time;
            requestAnimationFrame(animateCarousel);
        }
        requestAnimationFrame(animateCarousel);

        track.addEventListener("mouseover", () => { speedBeforePause = speed; speed = 0; });
        track.addEventListener("mouseout", () => { speed = speedBeforePause; });

        speedBtn.addEventListener("click", () => {
            if (mode === 1) { speed = 90; mode = 2; speedBtn.textContent = "Velocidade: Normal ⚡"; }
            else if (mode === 2) { speed = 130; mode = 3; speedBtn.textContent = "Velocidade: Rápida 🚀"; }
            else { speed = 30; mode = 1; speedBtn.textContent = "Velocidade: Lenta 🐢"; }
            speedBeforePause = speed;
        });
    }

    /* ============================================================
       4) HERO ROTATIVO TRAJETÓRIA
    ============================================================ */
    const heroImgs = document.querySelectorAll('.traj-hero .hero-img');
    if (heroImgs.length > 0) {
        let current = 0, total = heroImgs.length, intervalMs = 4000;
        function show(i) { heroImgs.forEach((img, idx) => img.classList.toggle('active', idx === i)); }
        let heroTimer = setInterval(() => { current = (current + 1) % total; show(current); }, intervalMs);
        const heroWrap = document.querySelector('.traj-hero');
        if (heroWrap) {
            heroWrap.addEventListener('mouseover', () => clearInterval(heroTimer));
            heroWrap.addEventListener('mouseout', () => {
                clearInterval(heroTimer);
                heroTimer = setInterval(() => { current = (current + 1) % total; show(current); }, intervalMs);
            });
        }
    }

    /* ============================================================
       5) HERO ROTATIVO LOJAS
    ============================================================ */
    (function () {
        const imgs = document.querySelectorAll('.loja-hero .hero-img');
        if (imgs.length === 0) return;
        let index = 0, total = imgs.length, intervalMs = 4000;
        function show(i) { imgs.forEach((img, idx) => img.classList.toggle('active', idx === i)); }
        let timer = setInterval(() => { index = (index + 1) % total; show(index); }, intervalMs);
        const wrap = document.querySelector('.loja-hero');
        if (wrap) {
            wrap.addEventListener('mouseover', () => clearInterval(timer));
            wrap.addEventListener('mouseout', () => {
                clearInterval(timer);
                timer = setInterval(() => { index = (index + 1) % total; show(index); }, intervalMs);
            });
        }
    })();

    /* ============================================================
       6) TRAJETÓRIA CARROSSEL MANUAL
    ============================================================ */
    (function () {
        const track = document.querySelector('.traj-track');
        const prevBtn = document.querySelector('.traj-prev');
        const nextBtn = document.querySelector('.traj-next');
        if (!track) return;

        let pos = 0;
        const step = () => {
            const item = track.querySelector('.traj-item');
            if (!item) return 220;
            const style = getComputedStyle(track);
            const gap = parseInt(style.columnGap || style.gap || 14, 10);
            return item.offsetWidth + gap;
        };

        function updateButtons() {
            const wrap = document.querySelector('.traj-track-wrap');
            const maxScroll = Math.max(0, track.scrollWidth - wrap.offsetWidth);
            prevBtn.disabled = pos >= 0;
            nextBtn.disabled = Math.abs(pos) >= maxScroll;
        }

        prevBtn?.addEventListener('click', () => { pos = Math.min(0, pos + step() * 2); track.style.transform = `translateX(${pos}px)`; updateButtons(); });
        nextBtn?.addEventListener('click', () => { const wrap = document.querySelector('.traj-track-wrap'); const maxScroll = Math.max(0, track.scrollWidth - wrap.offsetWidth); pos = Math.max(-maxScroll, pos - step() * 2); track.style.transform = `translateX(${pos}px)`; updateButtons(); });

        let startX = 0;
        track.addEventListener("touchstart", e => startX = e.touches[0].clientX, { passive: true });
        track.addEventListener("touchend", e => {
            const diff = e.changedTouches[0].clientX - startX;
            if (Math.abs(diff) > 40) { diff < 0 ? nextBtn?.click() : prevBtn?.click(); }
        }, { passive: true });

        window.addEventListener("resize", () => {
            const wrap = document.querySelector('.traj-track-wrap');
            const maxScroll = Math.max(0, track.scrollWidth - wrap.offsetWidth);
            pos = Math.max(-maxScroll, Math.min(0, pos));
            track.style.transform = `translateX(${pos}px)`;
            updateButtons();
        });

        updateButtons();
    })();

    /* ============================================================
       7) TROCA DE LOGOS LOJAS
    ============================================================ */
    const logoMap = {
        "Agronômica": "images/neri_lg.png",
        "Aurora": "images/sg_lg.png",
        "Imbuia": "images/imbuia_lg.png",
        "Laranjeiras": "images/cerutti_lg.png",
        "Fundo Canoas": "images/cerutti_lg.png",
        "Santa Rita": "images/cerutti_lg.png",
        "Santa Terezinha": "images/junckes_lg.png",
        "Vidal Ramos": "images/nico_lg.png"
    };

    const storeLogo = document.getElementById("storeLogo");
    const storeItems = document.querySelectorAll(".store-item");

    storeItems.forEach(item => {
        item.addEventListener("click", e => {
            e.preventDefault();
            document.querySelectorAll(".store-item.active").forEach(el => el.classList.remove("active"));
            item.classList.add("active");
            const name = item.textContent.trim();
            storeLogo.src = logoMap[name] || "images/rede-hiper-mac_lg.png";
        });
    });

    /* ============================================================
       8) APRESENTAÇÃO / SLIDES
    ============================================================ */
    (function () {
        const track = document.querySelector('.pres-track');
        const slides = document.querySelectorAll('.pres-slide');
        const btnPrev = document.querySelector('.pres-prev');
        const btnNext = document.querySelector('.pres-next');
        const indicatorsWrap = document.querySelector('.pres-indicators');
        if (!track || slides.length === 0) return;

        let current = 0, total = slides.length, interval = 5000, timer = null;

        function buildIndicators() {
            if (!indicatorsWrap) return;
            indicatorsWrap.innerHTML = "";
            for (let i = 0; i < total; i++) {
                const b = document.createElement("button");
                if (i === 0) b.classList.add("active");
                b.addEventListener("click", () => go(i));
                indicatorsWrap.appendChild(b);
            }
        }

        function updateIndicators() {
            if (!indicatorsWrap) return;
            Array.from(indicatorsWrap.children).forEach((btn, i) => btn.classList.toggle("active", i === current));
        }

        function go(i) { current = (i + total) % total; track.style.transform = `translateX(${-current * 100}%)`; updateIndicators(); }
        function next() { go(current + 1); }
        function prev() { go(current - 1); }
        function start() { stop(); timer = setInterval(next, interval); }
        function stop() { if (timer) clearInterval(timer); }

        btnNext?.addEventListener("click", () => { next(); start(); });
        btnPrev?.addEventListener("click", () => { prev(); start(); });

        const viewport = document.querySelector(".pres-viewport");
        if (viewport) {
            viewport.addEventListener("mouseover", stop);
            viewport.addEventListener("mouseout", start);
        }

        buildIndicators();
        go(0);
        start();
    })();

    /* ============================================================
       9) TABLOID CARROSSEL
    ============================================================ */
    (function () {
        const pages = document.querySelectorAll(".tabloid-page");
        const btnPrev = document.querySelector(".tabloid-prev");
        const btnNext = document.querySelector(".tabloid-next");
        const indicatorsContainer = document.querySelector('.tabloid-indicators');
        if (pages.length === 0) return;

        let currentIndex = 0;

        // Cria bolinhas
        pages.forEach((_, i) => {
            const dot = document.createElement('span');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => { currentIndex = i; updateSlide(); });
            indicatorsContainer.appendChild(dot);
        });

        const indicators = indicatorsContainer.querySelectorAll('span');

        function updateSlide() {
            pages.forEach(p => p.classList.remove('active'));
            pages[currentIndex].classList.add('active');
            indicators.forEach(dot => dot.classList.remove('active'));
            indicators[currentIndex].classList.add('active');
        }

        btnNext.addEventListener('click', () => { currentIndex = (currentIndex + 1) % pages.length; updateSlide(); });
        btnPrev.addEventListener('click', () => { currentIndex = (currentIndex - 1 + pages.length) % pages.length; updateSlide(); });

        updateSlide();
    })();

});
