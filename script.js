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
                features: document.getElementById('features').value,
                scenario: document.getElementById('geminiScenarioResult').textContent || 'Not generated'
            });

            formMessage.classList.add('alert', 'alert-success');
            formMessage.textContent = 'Thank you for your interest! We\'ve received your response and may contact you with updates.';
            formMessage.classList.remove('d-none');
            interestForm.reset();
            
            // Clear Gemini scenario result
            document.getElementById('geminiScenarioResult').classList.add('d-none');
            document.getElementById('geminiScenarioResult').textContent = '';
            document.getElementById('getGeminiScenarioBtn').disabled = true;
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

    // --- Gemini API Integration ---
    const apiKey = ''; // API key would be provided by environment
    const geminiApiUrlText = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Gemini for form scenario generation
    const featuresTextarea = document.getElementById('features');
    const getGeminiScenarioBtn = document.getElementById('getGeminiScenarioBtn');
    const geminiScenarioResultDiv = document.getElementById('geminiScenarioResult');
    const geminiScenarioSpinner = document.getElementById('geminiScenarioSpinner');

    if (featuresTextarea && getGeminiScenarioBtn) {
        featuresTextarea.addEventListener('input', () => {
            getGeminiScenarioBtn.disabled = featuresTextarea.value.trim() === '';
        });

        getGeminiScenarioBtn.addEventListener('click', async () => {
            const userInterests = featuresTextarea.value.trim();
            if (!userInterests) {
                geminiScenarioResultDiv.textContent = 'Please describe your interests first.';
                geminiScenarioResultDiv.classList.remove('d-none');
                return;
            }

            geminiScenarioSpinner.classList.remove('d-none');
            getGeminiScenarioBtn.disabled = true;
            geminiScenarioResultDiv.classList.add('d-none');
            geminiScenarioResultDiv.textContent = '';

            const prompt = `A person is interested in the following smart home features: "${userInterests}".
                Generate a short, imaginative, and positive daily life scenario (2-3 paragraphs, about 100-150 words)
                describing how these features could seamlessly improve their day. Focus on the benefits and convenience.
                Make it sound appealing and futuristic but achievable.`;

            try {
                const payload = {
                    contents: [
                        { role: 'user', parts: [{ text: prompt }] }
                    ]
                };
                
                const response = await fetch(geminiApiUrlText, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                
                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    geminiScenarioResultDiv.textContent = text;
                } else {
                    geminiScenarioResultDiv.textContent = 'Sorry, I couldn\'t generate a scenario at this time. The response structure was unexpected.';
                    console.error('Unexpected Gemini response structure:', result);
                }
            } catch (error) {
                console.error('Error calling Gemini API:', error);
                geminiScenarioResultDiv.textContent = `Sorry, there was an error generating your scenario: ${error.message}. Please try again later.`;
            } finally {
                geminiScenarioSpinner.classList.add('d-none');
                geminiScenarioResultDiv.classList.remove('d-none');
                getGeminiScenarioBtn.disabled = featuresTextarea.value.trim() === '';
            }
        });
    }

    // --- Gemini for Feature Cards ---
    const discoverBtns = document.querySelectorAll('.discover-possibilities-btn');
    const geminiModal = new bootstrap.Modal(document.getElementById('geminiFeatureModal'));
    const geminiModalTitle = document.getElementById('geminiFeatureModalLabel');
    const geminiModalContent = document.getElementById('geminiModalContent');
    const geminiModalSpinner = document.getElementById('geminiModalSpinner');

    discoverBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            const featureCard = this.closest('.feature-card');
            const featureName = featureCard.dataset.featureName;

            geminiModalTitle.textContent = `✨ AI Insights for ${featureName}`;
            geminiModalContent.classList.add('d-none');
            geminiModalSpinner.classList.remove('d-none');
            geminiModal.show();

            const prompt = `For the smart home feature "${featureName}", generate 2-3 innovative or less common potential use cases or possibilities that go beyond the obvious.
                Present them as a short, bulleted list. Each point should be concise and inspiring.`;

            try {
                const payload = {
                    contents: [
                        { role: 'user', parts: [{ text: prompt }] }
                    ]
                };
                
                const response = await fetch(geminiApiUrlText, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                
                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    geminiModalContent.innerHTML = text.replace(/\n/g, '<br>');
                } else {
                    geminiModalContent.textContent = 'Sorry, I couldn\'t generate possibilities at this time. Unexpected response.';
                    console.error('Unexpected Gemini response structure for feature possibilities:', result);
                }
            } catch (error) {
                console.error('Error calling Gemini API for feature possibilities:', error);
                geminiModalContent.textContent = `Error: ${error.message}. Please try again.`;
            } finally {
                geminiModalSpinner.classList.add('d-none');
                geminiModalContent.classList.remove('d-none');
            }
        });
    });
});