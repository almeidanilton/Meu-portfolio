/* ============================================
   SCRIPT.JS - INTERAÇÕES E ANIMAÇÕES
   ============================================ */

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initSmoothScroll();
    initNavigation();
    initSkillCards();
    initProjectCards();
    initCounterAnimation();
});

/* ============================================
   ANIMAÇÕES DE SCROLL
   ============================================ */

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar seções
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Observar cards
    document.querySelectorAll('.project-card, .skill-card, .stat-card').forEach(card => {
        observer.observe(card);
    });

    // Observar timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
}

/* ============================================
   SCROLL SUAVE
   ============================================ */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ============================================
   NAVEGAÇÃO ATIVA
   ============================================ */

function initNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Adicionar estilo para link ativo
    const style = document.createElement('style');
    style.textContent = `
        nav a.active {
            color: var(--text-primary) !important;
        }
        nav a.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   INTERAÇÕES COM SKILL CARDS
   ============================================ */

function initSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Remover hover de outros cards
            skillCards.forEach(c => c.style.transform = '');
            
            // Aplicar efeito ao card atual
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });

        // Ripple effect ao clicar
        card.addEventListener('click', function() {
            createRipple(this, event);
        });
    });
}

/* ============================================
   INTERAÇÕES COM PROJECT CARDS
   ============================================ */

function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Adicionar glow effect
            this.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.5), 0 16px 48px rgba(0, 0, 0, 0.5)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

/* ============================================
   ANIMAÇÃO DE CONTAGEM (STATS)
   ============================================ */

function initCounterAnimation() {
    const statCards = document.querySelectorAll('.stat-card');
    let hasAnimated = false;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statCards.length > 0) {
        observer.observe(statCards[0]);
    }

    function animateCounters() {
        statCards.forEach(card => {
            const numberElement = card.querySelector('.stat-number');
            const finalValue = numberElement.textContent;
            
            // Extrair número
            const match = finalValue.match(/\d+/);
            if (!match) return;
            
            const number = parseInt(match[0]);
            let current = 0;
            const increment = Math.ceil(number / 30);
            const duration = 1000;
            const startTime = Date.now();

            function updateNumber() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                current = Math.floor(number * progress);
                
                // Manter o formato original (com + ou %)
                let displayValue = current.toString();
                if (finalValue.includes('+')) {
                    displayValue = '+' + displayValue;
                } else if (finalValue.includes('%')) {
                    displayValue = displayValue + '%';
                }
                
                numberElement.textContent = displayValue;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    numberElement.textContent = finalValue;
                }
            }

            updateAnimationFrame(updateNumber);
        });
    }

    function requestAnimationFrame(callback) {
        return window.requestAnimationFrame(callback);
    }
}

/* ============================================
   EFEITO RIPPLE
   ============================================ */

function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    // Adicionar estilos para ripple
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-ripple]')) {
        style.setAttribute('data-ripple', 'true');
        document.head.appendChild(style);
    }

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

/* ============================================
   PARALLAX EFFECT (OPCIONAL)
   ============================================ */

function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementOffset = element.offsetTop;
            const distance = scrollPosition - elementOffset;
            const speed = element.getAttribute('data-parallax') || 0.5;

            element.style.transform = `translateY(${distance * speed}px)`;
        });
    });
}

/* ============================================
   DARK MODE TOGGLE (OPCIONAL)
   ============================================ */

function initDarkModeToggle() {
    const toggleButton = document.getElementById('darkModeToggle');
    
    if (!toggleButton) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = localStorage.getItem('darkMode') !== 'false' && prefersDark;

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
}

/* ============================================
   PERFORMANCE MONITORING
   ============================================ */

function logPerformance() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        console.log(`%c⚡ Performance Metrics`, 'color: #667eea; font-weight: bold;');
        console.log(`Page Load Time: ${loadTime}ms`);
        console.log(`DOM Content Loaded: ${timing.domContentLoadedEventEnd - timing.navigationStart}ms`);
    }
}

// Log performance quando página carrega
window.addEventListener('load', logPerformance);

/* ============================================
   LAZY LOADING IMAGES (OPCIONAL)
   ============================================ */

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

/* ============================================
   ACCESSIBILITY IMPROVEMENTS
   ============================================ */

function initAccessibility() {
    // Adicionar suporte a teclado para cards
    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                card.click();
            }
        });
    });
}

// Inicializar acessibilidade
document.addEventListener('DOMContentLoaded', initAccessibility);

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Função para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para throttle
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Log quando página está pronta
console.log('%c✨ Portfólio de José Nilton carregado com sucesso!', 'color: #667eea; font-weight: bold; font-size: 14px;');
console.log('%cDesenvolvedor em Formação | Mobile • Cloud • Cybersecurity • AI', 'color: #00d4ff; font-size: 12px;');
