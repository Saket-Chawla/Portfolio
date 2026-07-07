/**
 * Saket Chawla - Portfolio Website Script
 * Custom Trailing Cursor Physics, Auto-typing, Theme Switching, Modal Viewer, Coffee Widget, and Scroll Reveal.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CUSTOM ANIMATED MAGNETIC CURSOR PHYSICS
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    
    if (cursorDot && cursorRing) {
        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        // Track real mouse coordinates
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move small core dot immediately
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Lerping function for the larger trail ring (ease factor 0.15)
        function animateCursorRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(animateCursorRing);
        }
        
        // Start trail loop
        animateCursorRing();

        // Mouse hover interactions with links and interactive elements
        function updateHoverListeners() {
            const hoverables = document.querySelectorAll('a, button, .btn, .social-link-btn, .certificate-card, .theme-toggle-btn, .interactive-click-widget');
            
            hoverables.forEach(el => {
                // Remove existing to avoid duplicates
                el.removeEventListener('mouseenter', addHoverClass);
                el.removeEventListener('mouseleave', removeHoverClass);
                
                el.addEventListener('mouseenter', addHoverClass);
                el.addEventListener('mouseleave', removeHoverClass);
            });
        }

        function addHoverClass() {
            cursorRing.classList.add('cursor-hover');
            cursorDot.classList.add('cursor-hover');
        }

        function removeHoverClass() {
            cursorRing.classList.remove('cursor-hover');
            cursorDot.classList.remove('cursor-hover');
        }

        // Initialize listeners
        updateHoverListeners();
        
        // Expose helper to re-bind when DOM changes
        window.rebindCursorListeners = updateHoverListeners;
    }


    /* ==========================================================================
       2. COFFEE WIDGET INTERACTION (EASTER EGG)
       ========================================================================== */
    const coffeeWidget = document.getElementById('coffee-widget');
    if (coffeeWidget) {
        coffeeWidget.addEventListener('click', (e) => {
            e.stopPropagation();
            coffeeWidget.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            coffeeWidget.classList.remove('active');
        });
    }


    /* ==========================================================================
       3. TEXT TYPING EFFECT (HERO SECTION)
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
       4. DARK / LIGHT THEME TOGGLE & PERSISTENCE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Read stored preference, default to light cream theme
    const activeTheme = localStorage.getItem('theme') || 'light';
    
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
       5. MOBILE MENU INTERACTION
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
       6. SCROLL REVEAL (INTERSECTION OBSERVER)
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
       7. ACTIVE NAV LINK HIGHLIGHTER
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
       8. PDF CREDENTIAL VIEWER MODAL
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
