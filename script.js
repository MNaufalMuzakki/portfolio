document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SELECTORS & STATE
    // ==========================================
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const mainHeader = document.getElementById('mainHeader');
    
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Scroll spy links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Action Triggers
    const downloadCVBtn = document.getElementById('downloadCV');


    // ==========================================
    // 2. THEME SETUP (DARK MODE DEFAULT)
    // ==========================================
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    // Default to dark theme if no preference is saved
    if (savedTheme === 'light') {
        htmlElement.classList.remove('dark');
    } else {
        htmlElement.classList.add('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });


    // ==========================================
    // 3. FLOATING NAVBAR STYLING & MOBILE MENU
    // ==========================================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            mainHeader.classList.add('py-2');
            mainHeader.classList.remove('py-4');
        } else {
            mainHeader.classList.add('py-4');
            mainHeader.classList.remove('py-2');
        }
    });

    // Mobile Hamburger Toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.className = 'fa-solid fa-bars text-sm';
        } else {
            menuIcon.className = 'fa-solid fa-xmark text-sm';
        }
    });

    // Close Mobile Menu on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.className = 'fa-solid fa-bars text-sm';
        });
    });


    // ==========================================
    // 4. SCROLL SPY ACTIVE INDICATOR
    // ==========================================
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-brand-500');
            link.classList.add('text-slate-600', 'dark:text-slate-400');
            if (link.getAttribute('data-section') === currentSectionId) {
                link.classList.add('text-brand-500');
                link.classList.remove('text-slate-600', 'dark:text-slate-400');
            }
        });
    });





    // ==========================================
    // 8. PRINT TRIGGER (DOWNLOAD CV ACTION)
    // ==========================================
    if (downloadCVBtn) {
        downloadCVBtn.addEventListener('click', () => {
            window.print();
        });
    }




    // ==========================================
    // 7. SECURE DOCUMENT IMAGE VIEWER MODAL
    // ==========================================
    const docViewerModal = document.getElementById('docViewerModal');
    const docViewerModalContent = document.getElementById('docViewerModalContent');
    const closeDocViewerBtn = document.getElementById('closeDocViewerBtn');
    const docViewerTitle = document.getElementById('docViewerTitle');
    const protectionOverlay = document.getElementById('protectionOverlay');
    const viewerScrollContainer = document.getElementById('viewerScrollContainer');

    const openDocViewer = (docBase, pageCount, title) => {
        if (!docViewerModal || !viewerScrollContainer) return;
        
        docViewerTitle.textContent = title;
        
        // Clear previous images
        viewerScrollContainer.innerHTML = '';
        
        // Dynamically add images for each page
        for (let i = 0; i < pageCount; i++) {
            const img = document.createElement('img');
            img.src = `${docBase}_page_${i}.png`;
            img.alt = `${title} - Page ${i + 1}`;
            img.className = "w-full max-w-2xl h-auto select-none pointer-events-none transition-all duration-300 rounded-lg shadow-md mb-4 last:mb-0";
            img.setAttribute('draggable', 'false');
            img.setAttribute('oncontextmenu', 'return false;');
            viewerScrollContainer.appendChild(img);
        }
        
        // Reset scroll position to top
        viewerScrollContainer.scrollTop = 0;
        
        // Hide protection overlay initially
        if (protectionOverlay) protectionOverlay.classList.add('hidden');
        
        docViewerModal.classList.remove('hidden');
        docViewerModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            docViewerModalContent.classList.remove('scale-95', 'opacity-0');
            docViewerModalContent.classList.add('scale-100', 'opacity-100');
        }, 50);
    };

    const closeDocViewer = () => {
        if (!docViewerModalContent) return;
        docViewerModalContent.classList.remove('scale-100', 'opacity-100');
        docViewerModalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            docViewerModal.classList.add('hidden');
            docViewerModal.classList.remove('flex');
            document.body.style.overflow = '';
            if (viewerScrollContainer) {
                viewerScrollContainer.innerHTML = ''; // Clear images for security
            }
        }, 300);
    };

    // Attach listeners to view buttons
    document.querySelectorAll('.view-doc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const docBase = btn.getAttribute('data-doc');
            const pageCount = parseInt(btn.getAttribute('data-pages') || '1', 10);
            const docTitle = btn.getAttribute('data-title');
            openDocViewer(docBase, pageCount, docTitle);
        });
    });

    if (closeDocViewerBtn) {
        closeDocViewerBtn.addEventListener('click', closeDocViewer);
    }
    if (docViewerModal) {
        docViewerModal.addEventListener('click', (e) => {
            if (e.target === docViewerModal) closeDocViewer();
        });
    }

    // ==========================================
    // 7B. ANTI-DOWNLOAD & SCREENSHOT PROTECTION TRICKS
    // ==========================================
    // 1. Disable context menu (Right-click) inside the document viewer
    if (docViewerModal) {
        docViewerModal.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    // 2. Prevent keyboard saving / printing shortcuts globally
    window.addEventListener('keydown', (e) => {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        
        // Block Save (Ctrl+S, Cmd+S), Print (Ctrl+P, Cmd+P), View Source (Ctrl+U, Cmd+U)
        if (isCtrlOrCmd && (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'S' || e.key === 'P' || e.key === 'U')) {
            e.preventDefault();
            alert('Access denied: Saving, copying, or printing this document is not allowed.');
            return;
        }

        // Block Developer Tools (F12)
        if (e.key === 'F12') {
            e.preventDefault();
            return;
        }

        // Block Inspect / Console / Developer Tools shortcuts:
        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Cmd+Option+I, Cmd+Option+J, Cmd+Option+C
        if (
            (isCtrlOrCmd && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
            (e.altKey && isCtrlOrCmd && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
        ) {
            e.preventDefault();
            return;
        }

        // Block PrintScreen key instantly on keydown
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            e.preventDefault();
            clearClipboardAndBlur();
            return;
        }

        // Block screenshot shortcut detection (Windows+Shift+S, Cmd+Shift+3/4/5)
        if (isCtrlOrCmd && e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === '3' || e.key === '4' || e.key === '5')) {
            triggerBlur();
        }
    });

    // Helper functions for protection
    const triggerBlur = () => {
        if (viewerScrollContainer) {
            const images = viewerScrollContainer.querySelectorAll('img');
            images.forEach(img => img.classList.add('blur-2xl'));
        }
        if (protectionOverlay) protectionOverlay.classList.remove('hidden');
    };

    const clearClipboardAndBlur = () => {
        try {
            navigator.clipboard.writeText('');
        } catch (err) {}
        triggerBlur();
    };

    // 3. PrintScreen Keyup backup detection
    window.addEventListener('keyup', (e) => {
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            clearClipboardAndBlur();
        }
    });

    // 4. Blur Document if tab/window loses focus (like when user opens Snipping Tool or switches windows)
    window.addEventListener('blur', () => {
        triggerBlur();
    });

    // 5. Blur Document if tab is hidden (switching tabs or minimizing browser)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            triggerBlur();
        }
    });

    // 6. Restore Document when user clicks/focuses back on the protection overlay
    if (protectionOverlay) {
        protectionOverlay.addEventListener('click', () => {
            protectionOverlay.classList.add('hidden');
            if (viewerScrollContainer) {
                const images = viewerScrollContainer.querySelectorAll('img');
                images.forEach(img => img.classList.remove('blur-2xl'));
            }
        });
    }

    // 7. Prevent element dragging globally (anti-drag to desktop/another tab)
    window.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // 8. Prevent selection inside the document viewer modal
    if (docViewerModal) {
        docViewerModal.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
        
        // Prevent copying inside the modal
        docViewerModal.addEventListener('copy', (e) => {
            e.preventDefault();
            try {
                e.clipboardData.setData('text/plain', 'Content copying is disabled.');
            } catch (err) {}
        });
    }

});

