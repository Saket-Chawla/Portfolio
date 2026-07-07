/**
 * Saket Chawla - Portfolio Website Script
 * Interactive Canvas Particles, Auto-typing, Theme Switching, Modal Viewer, and Scroll Reveal.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. INTERACTIVE CANVAS PARTICLE WEB
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 65; // Balanced for aesthetics and performance
        let animationFrameId;

        // Mouse coordinates tracker
        const mouse = {
            x: null,
            y: null,
            radius: 120 // Distance of connection to mouse
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Speeds
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.color = getComputedStyle(document.body).getPropertyValue('--accent-color-1') || '#00f2fe';
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 4;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow for lines
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Warp on boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        function connectParticles() {
            let opacityValue = 1;
            const lineColor = getComputedStyle(document.body).getPropertyValue('--glass-border') || 'rgba(255, 255, 255, 0.08)';
            const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color-1') || '#00f2fe';

            for (let a = 0; a < particles.length; a++) {
                // Adjust particle color on theme switch
                particles[a].color = accentColor;

                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 90) {
                        opacityValue = 1 - (distance / 90);
                        ctx.strokeStyle = lineColor.replace(/[^,]+(?=\))/, opacityValue * 0.25);
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse pointer
                if (mouse.x !== null && mouse.y !== null) {
                    let dxMouse = particles[a].x - mouse.x;
                    let dyMouse = particles[a].y - mouse.y;
                    let mouseDistance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                    if (mouseDistance < mouse.radius) {
                        opacityValue = 1 - (mouseDistance / mouse.radius);
                        ctx.strokeStyle = accentColor + Math.floor(opacityValue * 30).toString(16).padStart(2, '0');
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
                particles[i].update();
            }

            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }


    /* ==========================================================================
       2. TEXT TYPING EFFECT (HERO SECTION)
       ========================================================================== */
    const typingTarget = document.getElementById('typing-target');
    if (typingTarget) {
        const roles = [
            "AI-powered Web Systems",
            "Machine Learning Solutions",
            "Generative AI Integrations",
            "Full Stack Web Products"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 70;

        function type() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typingTarget.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 30; // Faster deleting speed
            } else {
                typingTarget.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 70; // Standard typing speed
            }

            // Word completed
            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400; // Pause before typing next word
            }

            setTimeout(type, typingSpeed);
        }

        // Start Typing Animation after a tiny delay
        setTimeout(type, 1000);
    }


    /* ==========================================================================
       3. DARK / LIGHT THEME TOGGLE & PERSISTENCE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Read stored preference, fallback to dark theme
    const activeTheme = localStorage.getItem('theme') || 'dark';
    
    if (activeTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
        });
    }


    /* ==========================================================================
       4. MOBILE MENU INTERACTION
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Disable scroll when mobile menu is active
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Close menu on link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }


    /* ==========================================================================
       5. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once shown
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12, // Trigger when 12% is visible
        rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ==========================================================================
       6. ACTIVE NAV LINK HILIGHTER
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Match navigation offset
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            
            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveLink);


    /* ==========================================================================
       7. PDF CREDENTIAL VIEWER MODAL
       ========================================================================== */
    const pdfModal = document.getElementById('pdf-modal');
    const modalClose = document.getElementById('modal-close');
    const pdfIframe = document.getElementById('pdf-iframe');
    const openPdfBtns = document.querySelectorAll('.open-pdf-btn');
    const fallbackContainer = document.getElementById('fallback-container');
    const pdfFallbackLink = document.getElementById('pdf-fallback-link');

    function openModal(pdfPath) {
        if (!pdfModal || !pdfIframe) return;

        pdfIframe.src = pdfPath;
        if (pdfFallbackLink) {
            pdfFallbackLink.href = pdfPath;
        }

        // Display modal
        pdfModal.classList.add('active');
        pdfModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Check if iframe handles PDF view successfully
        // Devices like mobile browsers often fail to render PDF directly in iframe, show fallback
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile && fallbackContainer && pdfIframe) {
            fallbackContainer.style.display = 'flex';
            pdfIframe.style.display = 'none';
        } else {
            if (fallbackContainer) fallbackContainer.style.display = 'none';
            if (pdfIframe) pdfIframe.style.display = 'block';
        }
    }

    function closeModal() {
        if (!pdfModal || !pdfIframe) return;

        pdfModal.classList.remove('active');
        pdfModal.setAttribute('aria-hidden', 'true');
        pdfIframe.src = ''; // Clear source to save bandwidth
        document.body.style.overflow = 'auto';
    }

    openPdfBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pdfPath = btn.getAttribute('data-pdf');
            if (pdfPath) {
                openModal(pdfPath);
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (pdfModal) {
        pdfModal.addEventListener('click', (e) => {
            // Close if clicking overlay itself, not modal-card
            if (e.target === pdfModal) {
                closeModal();
            }
        });
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('active')) {
            closeModal();
        }
    });

});
