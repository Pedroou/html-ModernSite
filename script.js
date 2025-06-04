document.addEventListener('DOMContentLoaded', function() {
    // --- Typing effect in hero ---
    const typedText = [
        "Lighting that learns your routine.", 
        "Security that adapts to your needs.",
        "Climate control, personalized.",
        "Your voice, your home, your rules."
    ];
    let typeIndex = 0, charIndex = 0, erasing = false;

    function playTyping() {
        const el = document.querySelector('.typed-text');
        if (!el) return;
        
        // Make the element visible once we start typing
        if (!el.classList.contains('typing-ready')) {
            el.style.display = 'inline-block';
            el.classList.add('typing-ready');
        }
        
        if (!erasing && charIndex <= typedText[typeIndex].length) {
            el.textContent = typedText[typeIndex].slice(0, charIndex++);
            setTimeout(playTyping, 60 + Math.random() * 40);
        } else if (!erasing && charIndex > typedText[typeIndex].length) {
            erasing = true;
            setTimeout(playTyping, 1200);
        } else if (erasing && charIndex >= 0) {
            el.textContent = typedText[typeIndex].slice(0, charIndex--);
            setTimeout(playTyping, 30);
        } else {
            erasing = false;
            typeIndex = (typeIndex + 1) % typedText.length;
            charIndex = 0;
            el.textContent = '';
            setTimeout(playTyping, 600);
        }
    }
    
    // Initialize typing immediately but ensure the element is empty
    const typedTextEl = document.querySelector('.typed-text');
    if (typedTextEl) {
        typedTextEl.textContent = '';
        // Start typing animation with a slight delay to ensure DOM is ready
        setTimeout(playTyping, 50);
    }

    // --- Navbar shrink on scroll ---
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Smooth scrolling for nav links and active highlighting ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function changeNavOnScroll() {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navbarHeight - 0;
            let sectionId = current.getAttribute('id');

            if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector('.nav-link[href*=' + sectionId + ']');
                if (activeLink) activeLink.classList.add('active');
            }
        });
        
        if (scrollY < sections[0].offsetTop - navbarHeight - 50) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-link[href="#hero"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }
    
    window.addEventListener('scroll', changeNavOnScroll);
    changeNavOnScroll();

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile navbar on click
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                    }
                    
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // --- Intersection Observer for scroll animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // obs.unobserve(entry.target); // Uncomment to animate only once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Form submission simulation ---
    const interestForm = document.getElementById('interestForm');
    const formMessage = document.getElementById('formMessage');

    if (interestForm) {
        interestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const interestLevelInput = document.getElementById('interestLevel');

            formMessage.classList.remove('alert-success', 'alert-danger', 'd-none');
            formMessage.textContent = '';

            // Basic validation
            if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || interestLevelInput.value === '') {
                formMessage.classList.add('alert', 'alert-danger');
                formMessage.textContent = 'Please fill out all required fields.';
                formMessage.classList.remove('d-none');
                return;
            }

            // Simulate sending data
            console.log('Form Submitted (Simulated):', {
                name: nameInput.value,
                email: emailInput.value,
                interestLevel: interestLevelInput.value,
                features: document.getElementById('features').value
            });

            formMessage.classList.add('alert', 'alert-success');
            formMessage.textContent = 'Thank you for your interest! We\'ve received your response and may contact you with updates.';
            formMessage.classList.remove('d-none');
            interestForm.reset();
        });
    }

    // --- Dynamic Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const counterSpeed = 250;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const isPercentage = counter.parentElement.querySelector('p').textContent.includes('%');
        let count = 0;
        
        const updateCount = () => {
            const increment = Math.max(target / counterSpeed, 1);
            count += increment;
            if (count < target) {
                counter.innerText = Math.ceil(count) + (isPercentage ? '%' : '');
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target + (isPercentage ? '%' : '');
            }
        };
        requestAnimationFrame(updateCount);
        counter.classList.add('counted');
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        const isPercentage = counter.parentElement.querySelector('p').textContent.includes('%');
        counter.innerText = '0' + (isPercentage ? '%' : '');
        counterObserver.observe(counter);
    });

    // --- Set current year in footer ---
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }


});