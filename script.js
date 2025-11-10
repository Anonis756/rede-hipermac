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