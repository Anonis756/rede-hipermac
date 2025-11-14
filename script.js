document.addEventListener("DOMContentLoaded", function () {
    const menuLinks = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".page-section");

    // Mostra o HOME ao carregar
    const homeSection = document.querySelector("#home");
    homeSection.classList.add("active");
    homeSection.style.display = "block";

    // Alternância de seções
    menuLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("data-target");

            // Remove ativo de tudo
            menuLinks.forEach(l => l.classList.remove("active"));
            sections.forEach(section => {
                section.classList.remove("active");
                section.style.display = "none";
            });

            // Ativa o link e a seção clicada
            this.classList.add("active");
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add("active");
                targetSection.style.display = "block";

                // Reobserva imagens da nova seção visível
                setTimeout(() => {
                    document.querySelectorAll(`#${targetId} img`).forEach(img => {
                        observer.observe(img);
                    });
                }, 300);
            }
        });
    });

    // --- Animação das imagens ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Observar todas as imagens visíveis ao carregar
    document.querySelectorAll(".page-section.active img").forEach(img => {
        observer.observe(img);
    });
});

// =====================================
// 🔥 LOOP SUAVE DO CARROSSEL (sem reset)
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const track = document.querySelector('.carousel-track');
    const btn = document.getElementById('speedBtn');

    // checagens de segurança — se não existir, nada quebra
    if (!track) {
        console.warn("Carousel track não encontrado (.carousel-track). Verifique o HTML.");
        return;
    }
    if (!btn) {
        console.warn("Botão de velocidade não encontrado (id='speedBtn'). Verifique o HTML.");
        return;
    }

    // === configurações iniciais ===
    let speed = 90;               // velocidade inicial: NORMAL
    let speedBeforePause = 90;    // mantém valor para pausa/retomar
    let position = 0;
    let lastTime = null;

    // modo: 1=Lenta, 2=Normal, 3=Rápida
    // como queremos começar em Normal, sete mode = 2
    let mode = 2;

    // texto inicial do botão
    btn.textContent = "Velocidade: Normal ⚡";

    // Função principal de animação (requestAnimationFrame)
    function animateCarousel(time) {
        if (lastTime !== null) {
            const delta = time - lastTime;
            // move proporcional ao tempo decorrido (px por segundo)
            position -= (speed * delta) / 1000;

            // largura da metade do conteúdo (supondo que a lista foi duplicada)
            const width = track.scrollWidth / 2;

            // quando atingir metade, reinicia posição sem salto perceptível
            if (Math.abs(position) >= width) {
                position = 0;
            }

            track.style.transform = `translateX(${position}px)`;
        }

        lastTime = time;
        requestAnimationFrame(animateCarousel);
    }

    requestAnimationFrame(animateCarousel);

    // Pausa no hover (mantém posição e depois retoma)
    track.addEventListener("mouseover", () => {
        // guarda velocidade atual e zera
        speedBeforePause = speed;
        speed = 0;
    });

    track.addEventListener("mouseout", () => {
        // retoma velocidade que estava antes da pausa
        speed = speedBeforePause;
    });

    // Controle do botão (Normal -> Rápida -> Lenta -> Normal)
    btn.addEventListener("click", () => {
        if (mode === 1) {
            // Lenta -> Normal
            speed = 90;
            speedBeforePause = 90;
            btn.textContent = "Velocidade: Normal ⚡";
            mode = 2;
        } else if (mode === 2) {
            // Normal -> Rápida
            speed = 130;
            speedBeforePause = 130;
            btn.textContent = "Velocidade: Rápida 🚀";
            mode = 3;
        } else {
            // Rápida -> Lenta
            speed = 30;
            speedBeforePause = 30;
            btn.textContent = "Velocidade: Lenta 🐢";
            mode = 1;
        }
    });

});
