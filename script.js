/**
 * Saket Chawla - Portfolio Website Script
 * Replicates Wall of Portfolios Showcase Interactions:
 * Tab switching (Portfolio / Profile), Custom Trailing Cursor, Coffee Widget, Theme Switcher, and Modal Viewer.
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
            const hoverables = document.querySelectorAll('a, button, .btn, .social-link-btn, .theme-toggle-btn, .interactive-click-widget, .tab-btn, .contact-editorial-item');
            
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
       2. TAB NAVIGATION SWITCHER (PROFILE / PORTFOLIO)
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const rightPane = document.querySelector('.right-content-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            if (!targetTab) return;

            // Remove active class from all buttons, add to clicked
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Hide all view panels
            const panels = document.querySelectorAll('.view-panel');
            panels.forEach(panel => {
                panel.classList.remove('active-view');
                panel.classList.add('hidden-view');
            });

            // Show active view panel
            const activePanel = document.getElementById(`${targetTab}-view`);
            if (activePanel) {
                activePanel.classList.remove('hidden-view');
                activePanel.classList.add('active-view');
            }

            // Scroll right content area back to top
            if (rightPane) {
                rightPane.scrollTop = 0;
            }
        });
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
       4. BOOKMARK TOGGLE BUTTON
       ========================================================================== */
    const bookmarkBtn = document.getElementById('bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => {
            bookmarkBtn.classList.toggle('btn-primary');
            bookmarkBtn.classList.toggle('btn-secondary');
            
            // Subtle feedback (can be expanded to localStorage bookmarking)
            const icon = bookmarkBtn.querySelector('.btn-icon');
            if (bookmarkBtn.classList.contains('btn-primary')) {
                icon.setAttribute('fill', 'currentColor');
            } else {
                icon.setAttribute('fill', 'none');
            }
        });
    }


    /* ==========================================================================
       5. DARK / LIGHT THEME TOGGLE & PERSISTENCE
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
            const themeLabel = themeToggleBtn.querySelector('.theme-text');
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
                if (themeLabel) themeLabel.textContent = 'Dark Theme';
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
                if (themeLabel) themeLabel.textContent = 'Light Theme';
            }
        });
    }


    /* ==========================================================================
       6. PDF CREDENTIAL VIEWER MODAL
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
