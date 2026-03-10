// ========================================
// COFFEE TRIP - JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- HEADER SCROLL ----
    const header = document.getElementById('header');
    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---- MOBILE MENU ----
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---- ACTIVE NAV LINK ON SCROLL ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ---- REVEAL ON SCROLL ----
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // ---- COUNTER ANIMATION ----
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();

                const animate = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                    el.textContent = Math.floor(target * eased);
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        el.textContent = target;
                    }
                };
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    // ---- GALERIA FILTROS ----
    const filtros = document.querySelectorAll('.filtro');
    const galeriaItems = document.querySelectorAll('.galeria-item');

    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            filtros.forEach(f => f.classList.remove('active'));
            filtro.classList.add('active');

            const filter = filtro.getAttribute('data-filter');

            galeriaItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                const show = filter === 'todos' || category === filter;

                if (show) {
                    item.classList.remove('hidden');
                    item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s both`;
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ---- LIGHTBOX ----
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentImageIndex = 0;
    let visibleImages = [];

    const getVisibleImages = () => {
        return [...document.querySelectorAll('.galeria-item:not(.hidden) img')];
    };

    const openLightbox = (index) => {
        visibleImages = getVisibleImages();
        currentImageIndex = index;
        lightboxImg.src = visibleImages[currentImageIndex].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const navigateLightbox = (direction) => {
        visibleImages = getVisibleImages();
        currentImageIndex = (currentImageIndex + direction + visibleImages.length) % visibleImages.length;
        lightboxImg.src = visibleImages[currentImageIndex].src;
    };

    galeriaItems.forEach((item) => {
        item.addEventListener('click', () => {
            const visibleItems = [...document.querySelectorAll('.galeria-item:not(.hidden)')];
            const index = visibleItems.indexOf(item);
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ---- SMOOTH SCROLL ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
