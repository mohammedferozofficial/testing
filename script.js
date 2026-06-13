document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // MODULE A: ELEMENTS & SELECTORS
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    const heroTitle = document.querySelector('#home h1') || document.querySelector('.hero-text-container');
    const heroSubtitle = document.querySelector('#home p') || document.querySelector('.hero-subtitle');

    let isScrollingFromClick = false;

    // ==========================================
    // MODULE B: POPUP MODAL NAVIGATION SYSTEM
    // ==========================================
    const socialImages = [
        "assets/social1.jpeg",
        "assets/social2.jpeg",
        "assets/social3.jpeg",
        "assets/social4.jpeg",
        "assets/social5.jpeg",
        "assets/social6.jpeg",
        "assets/social7.jpeg",
        "assets/social8.jpeg"
    ];
    let currentModalIndex = 0;

    const cardTrigger = document.getElementById("social-card-trigger");
    const socialModal = document.getElementById("socialModal");
    const modalImg = document.getElementById("modalSlideshowImage");
    const modalPrevBtn = document.getElementById("modal-prev-btn");
    const modalNextBtn = document.getElementById("modal-next-btn");

    // Click Event to OPEN the modal popup box
    if (cardTrigger && socialModal) {
        cardTrigger.addEventListener("click", () => {
            currentModalIndex = 0;
            if (modalImg) modalImg.src = socialImages[currentModalIndex];
            
            socialModal.classList.remove("hidden");
            setTimeout(() => {
                socialModal.classList.remove("opacity-0");
                const panel = socialModal.querySelector(".glass-panel");
                if (panel) panel.classList.remove("translate-y-8");
            }, 50);
        });
    }

    // Next Slide trigger
    if (modalNextBtn) {
        modalNextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentModalIndex = (currentModalIndex + 1) % socialImages.length;
            if (modalImg) modalImg.src = socialImages[currentModalIndex];
        });
    }

    // Previous Slide trigger
    if (modalPrevBtn) {
        modalPrevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentModalIndex = (currentModalIndex - 1 + socialImages.length) % socialImages.length;
            if (modalImg) modalImg.src = socialImages[currentModalIndex];
        });
    }

    // Background overlay click to CLOSE modal popup box
    if (socialModal) {
        socialModal.addEventListener("click", (e) => {
            if (e.target === socialModal) {
                socialModal.classList.add("opacity-0");
                const panel = socialModal.querySelector(".glass-panel");
                if (panel) panel.classList.add("translate-y-8");

                setTimeout(() => {
                    socialModal.classList.add("hidden");
                }, 300);
            }
        });
    }

    // ==========================================
    // MODULE C: MOBILE MENU TOGGLE
    // ==========================================
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // ==========================================
    // MODULE D: SMOOTH SCROLL INTERCEPTOR
    // ==========================================
    const scrollLinks = document.querySelectorAll('.nav-links a, .hero-buttons a, .logo-container, .scroll-indicator');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            let targetId = this.getAttribute('href');
            if (!targetId && (this.classList.contains('logo-container') || this.classList.contains('scroll-indicator'))) {
                targetId = '#home';
            }

            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    isScrollingFromClick = true; 

                    navItems.forEach(item => item.classList.remove('active'));
                    const correspondingNavLink = document.querySelector(`.nav-links a[href="${targetId}"]`);
                    if (correspondingNavLink) correspondingNavLink.classList.add('active');

                    if (targetId === '#home' && heroTitle) {
                        heroTitle.style.transform = 'translateY(0px) scale(1)';
                        heroTitle.style.opacity = 1;
                    }

                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.pushState(null, null, targetId);

                    setTimeout(() => { isScrollingFromClick = false; }, 1000); 
                }

                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuToggle) menuToggle.querySelector('i').className = 'fas fa-bars';
                }
            }
        });
    });

    // ==========================================
    // MODULE E: GLOBAL SCROLL LOOP (ANIMATIONS)
    // ==========================================
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;

        if (!isScrollingFromClick && heroTitle) {
            const progress = Math.min(Math.max(scrollPosition / (viewportHeight * 0.8), 0), 1);
            const slideAmount = Math.min(progress * 150, 150);
            const scaleAmount = Math.max(1 - (progress * 0.15), 0.85);
            const opacityAmount = Math.max(1 - (progress * 1.8), 0);

            heroTitle.style.transform = `translateY(-${slideAmount}px) scale(${scaleAmount})`;
            heroTitle.style.opacity = opacityAmount;

            if (heroSubtitle) heroSubtitle.style.opacity = Math.max(1 - (progress * 2.2), 0);
        }

        if (isScrollingFromClick) return; 

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140; 
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (scrollPosition < 50) current = 'home';

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
        });
    });
});

// General Portfolio Details Modal (Work Section)
function openProjectModal(title, category, description, year, imageSrc) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    document.getElementById('projectTitle').innerText = title;
    document.getElementById('projectCategory').innerText = category;
    document.getElementById('projectDescription').innerText = description;
    document.getElementById('projectYear').innerText = year;
    
    const modalImg = document.getElementById('modalProjectImage');
    if (modalImg && imageSrc) {
        modalImg.src = imageSrc;
        modalImg.alt = title;
        modalImg.classList.remove('hidden'); 
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const internalPanel = modal.querySelector('.glass-panel');
        if (internalPanel) internalPanel.classList.remove('translate-y-8');
    }, 50);
}
// =========================================================================
// MULTI-IMAGE POPUP SLIDESHOW LOGIC (GLOBAL SCOPE)
// =========================================================================
let modalImageSet = [];
let currentModalImageIndex = 0;

function openProjectModal(title, category, description, year, imagesArray) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    // Assign standard meta descriptors
    document.getElementById('projectTitle').innerText = title;
    document.getElementById('projectCategory').innerText = category;
    document.getElementById('projectDescription').innerText = description;
    document.getElementById('projectYear').innerText = year;
    
    // Store array reference globally
    modalImageSet = Array.isArray(imagesArray) ? imagesArray : [imagesArray];
    currentModalImageIndex = 0;
    
    // Load first image slide initial viewport view
    const modalImg = document.getElementById('modalProjectImage');
    if (modalImg && modalImageSet.length > 0) {
        modalImg.src = modalImageSet[currentModalImageIndex];
        modalImg.alt = title;
    }

    // Toggle navigation arrows visibility based on images count
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    if (prevBtn && nextBtn) {
        if (modalImageSet.length > 1) {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
        } else {
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
        }
    }

    // Trigger opening transitions animation layers
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const internalPanel = modal.querySelector('.glass-panel');
        if (internalPanel) internalPanel.classList.remove('translate-y-8');
    }, 50);
}

function shiftModalSlide(direction) {
    if (modalImageSet.length <= 1) return;
    
    const modalImg = document.getElementById('modalProjectImage');
    if (!modalImg) return;
    
    // Apply a fast clean slide transition fade step
    modalImg.classList.add('opacity-0');
    
    setTimeout(() => {
        // Calculate looping safe step bounds
        currentModalImageIndex = (currentModalImageIndex + direction + modalImageSet.length) % modalImageSet.length;
        modalImg.src = modalImageSet[currentModalImageIndex];
        modalImg.classList.remove('opacity-0');
    }, 150);
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    modal.classList.add('opacity-0');
    const internalPanel = modal.querySelector('.glass-panel');
    if (internalPanel) internalPanel.classList.add('translate-y-8');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

z