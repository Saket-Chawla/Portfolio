/**
 * Saket Chawla - Portfolio Website Script
 * Replicates Sonam's Editorial Interactions:
 * Header scroll-reveal toggles, Custom Cursor with dynamic text hover indicators, 
 * Coffee widget counter popup, and PDF Modal overlay.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CUSTOM ANIMATED MAGNETIC CURSOR & TOOLTIPS
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const cursorText = document.getElementById('cursor-text');
    
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

        // Mouse hover interactions with standard links/buttons and card tooltips
        function updateHoverListeners() {
            // Standard hovers (buttons, navigation, icons)
            const hoverables = document.querySelectorAll('a, button, .btn, .theme-toggle-btn, .interactive-click-widget');
            hoverables.forEach(el => {
                el.removeEventListener('mouseenter', addHoverClass);
                el.removeEventListener('mouseleave', removeHoverClass);
                el.addEventListener('mouseenter', addHoverClass);
                el.addEventListener('mouseleave', removeHoverClass);
            });

            // Card hovers (elements with data-cursor-text, e.g. project cards)
            const cardHoverables = document.querySelectorAll('[data-cursor-text]');
            cardHoverables.forEach(el => {
                el.removeEventListener('mouseenter', addCardHoverClass);
                el.removeEventListener('mouseleave', removeCardHoverClass);
                el.addEventListener('mouseenter', addCardHoverClass);
                el.addEventListener('mouseleave', removeCardHoverClass);
            });
        }

        // Standard link hover
        function addHoverClass() {
            cursorRing.classList.add('cursor-hover');
            cursorDot.classList.add('cursor-hover');
        }

        function removeHoverClass() {
            cursorRing.classList.remove('cursor-hover');
            cursorDot.classList.remove('cursor-hover');
        }

        // Card tooltip hover (displays "VIEW" bubble)
        function addCardHoverClass(e) {
            const textVal = e.currentTarget.getAttribute('data-cursor-text');
            if (cursorText && textVal) {
                cursorText.textContent = textVal;
            }
            cursorRing.classList.add('cursor-card-hover');
            cursorDot.classList.add('cursor-card-hover');
        }

        function removeCardHoverClass() {
            cursorRing.classList.remove('cursor-card-hover');
            cursorDot.classList.remove('cursor-card-hover');
            if (cursorText) {
                cursorText.textContent = '';
            }
        }

        // Initialize listeners
        updateHoverListeners();
        
        // Expose helper to re-bind when DOM changes
        window.rebindCursorListeners = updateHoverListeners;
    }


    /* ==========================================================================
       2. STICKY HEADER SCROLL DIRECTION TOGGLE
       ========================================================================== */
    const header = document.getElementById('header');
    let lastScrollY = window.pageYOffset;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        
        if (!header) return;

        // Hide header on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
    });


    /* ==========================================================================
       3. COFFEE WIDGET INTERACTION (EASTER EGG)
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
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% is visible
        rootMargin: '0px 0px -40px 0px'
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
            const sectionTop = current.offsetTop - 150; // Match navigation offset
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
