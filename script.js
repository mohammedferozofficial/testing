document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    // Select your hero text elements (make sure these IDs or classes match your HTML!)
    const heroTitle = document.querySelector('#home h1') || document.querySelector('.hero-text-container');
    const heroSubtitle = document.querySelector('#home p') || document.querySelector('.hero-subtitle');

    let isScrollingFromClick = false;

    // --- 1. Mobile Menu Toggle ---
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

    // --- 2. Smooth Scroll Click Interceptor ---
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
                    // Block ALL scroll handlers (menu tracking & text animations) during automatic travel
                    isScrollingFromClick = true; 

                    navItems.forEach(item => item.classList.remove('active'));
                    const correspondingNavLink = document.querySelector(`.nav-links a[href="${targetId}"]`);
                    if (correspondingNavLink) {
                        correspondingNavLink.classList.add('active');
                    }

                    // If jumping back home, quickly reset text attributes so coordinates calculate cleanly
                    if (targetId === '#home' && heroTitle) {
                        heroTitle.style.transform = 'translateY(0px) scale(1)';
                        heroTitle.style.opacity = 1;
                    }

                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    history.pushState(null, null, targetId);

                    // Re-enable scroll handlers after the smooth transition completes
                    setTimeout(() => {
                        isScrollingFromClick = false;
                    }, 1000); 
                }

                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuToggle) menuToggle.querySelector('i').className = 'fas fa-bars';
                }
            }
        });
    });

    // --- 3. Combined Global Scroll Event Loop ---
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;

        // --- PART A: Hero Text Animation (Only runs if user is manually scrolling) ---
        if (!isScrollingFromClick && heroTitle) {
            // Animation calculates progress through the first 80% of viewport height
            const progress = Math.min(Math.max(scrollPosition / (viewportHeight * 0.8), 0), 1);

            const rawSlide = progress * 150;            // Max move up: 150px
            const rawScale = 1 - (progress * 0.15);     // Shrink floor: 85%
            const rawOpacity = 1 - (progress * 1.8);    // Faster clean fade out

            // Secure clamping limits so browsers don't stutter on bad math inputs
            const slideAmount = Math.min(rawSlide, 150);
            const scaleAmount = Math.max(rawScale, 0.85);
            const opacityAmount = Math.max(Math.min(rawOpacity, 1), 0);

            // Apply styling efficiently using template literals
            heroTitle.style.transform = `translateY(-${slideAmount}px) scale(${scaleAmount})`;
            heroTitle.style.opacity = opacityAmount;

            if (heroSubtitle) {
                heroSubtitle.style.opacity = Math.max(1 - (progress * 2.2), 0);
            }
        }

        // --- PART B: Dynamic Menu Link Tracking ---
        if (isScrollingFromClick) return; 

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140; 
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (scrollPosition < 50) {
            current = 'home';
        }

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });
});
function openProjectModal(title, tag, description, year, imageSrc) {
    // ... your modal elements setup ...
    document.getElementById('modalProjectImage').src = imageSrc;
    // ... show modal logic ...
}
function openProjectModal(title, category, description, year, imageSrc) {
    const modal = document.getElementById('projectModal');
    
    // 1. Assign the text contents safely
    document.getElementById('projectTitle').innerText = title;
    document.getElementById('projectCategory').innerText = category;
    document.getElementById('projectDescription').innerText = description;
    document.getElementById('projectYear').innerText = year;
    
    // 2. THE FIX: Assign the image source path directly to the element
    const modalImg = document.getElementById('modalProjectImage');
    if (modalImg && imageSrc) {
        modalImg.src = imageSrc;
        modalImg.alt = title;
        modalImg.classList.remove('hidden'); // Ensure it isn't hidden by default style layers
    }

    // 3. Reveal and trigger smooth fade animations
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.glass-panel').classList.remove('translate-y-8');
    }, 50);
}