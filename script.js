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




});

