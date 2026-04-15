// Website functionality: theme, mobile toggle, and scroll effects
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const body = document.body;
    const desktopQuery = window.matchMedia('(min-width: 992px)');

    // Theme Toggle Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // Mobile Nav Logic
    function openMobileMenu() {
        if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
        if (header) header.classList.add('nav-open');
        body.style.overflow = 'hidden';

        let backdrop = document.querySelector('.nav-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'nav-backdrop';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', closeMobileMenu);
            // Force reflow
            backdrop.offsetHeight;
            backdrop.classList.add('active');
        }
    }

    function closeMobileMenu() {
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        if (header) header.classList.remove('nav-open');
        body.style.overflow = '';

        const backdrop = document.querySelector('.nav-backdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
            setTimeout(() => { if (backdrop.parentNode) backdrop.remove(); }, 300);
        }
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpened = navToggle.getAttribute('aria-expanded') === 'true';
            if (isOpened) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Handle scroll state for navbar
    const handleScroll = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Handle screen resize
    desktopQuery.addEventListener('change', () => {
        if (desktopQuery.matches) {
            closeMobileMenu();
        }
    });

    // Newsletter Form Handler
    window.handleNewsletterSubmit = function (event) {
        event.preventDefault();
        const emailInput = event.target.querySelector('input[type="email"]');
        if (emailInput) {
            alert('Thank you for subscribing! We will send updates to ' + emailInput.value);
            event.target.reset();
        }
    };

    // Smooth scroll fallback for older browsers
    if (!CSS.supports('scroll-behavior', 'smooth')) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    // Donation Modal Handler
    const donationModal = document.getElementById('donationModal');
    const modalClose = document.getElementById('modalClose');
    const donationForm = document.getElementById('donationForm');
    if (donationModal && modalClose && donationForm) {
        const customAmountGroup = document.getElementById('customAmountGroup');
        const amountSelect = document.getElementById('amount');

        // Get all donate buttons in the page
        const donateButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-button');

        donateButtons.forEach(button => {
            if (button.textContent.includes('Donate')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    donationModal.classList.add('active');
                    body.style.overflow = 'hidden';
                });
            }
        });

        modalClose.addEventListener('click', () => {
            donationModal.classList.remove('active');
            body.style.overflow = 'auto';
        });

        donationModal.addEventListener('click', (e) => {
            if (e.target === donationModal) {
                donationModal.classList.remove('active');
                body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && donationModal.classList.contains('active')) {
                donationModal.classList.remove('active');
                body.style.overflow = 'auto';
            }
        });

        if (amountSelect) {
            amountSelect.addEventListener('change', () => {
                if (amountSelect.value === 'custom') {
                    customAmountGroup.style.display = 'flex';
                } else {
                    customAmountGroup.style.display = 'none';
                }
            });
        }

        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const amount = amountSelect.value === 'custom' ?
                document.getElementById('customAmount').value :
                amountSelect.value;

            alert(`Thank you, ${fullName}! Your donation of ${amount} RWF has been received. A confirmation will be sent to ${email}`);
            donationForm.reset();
            donationModal.classList.remove('active');
            body.style.overflow = 'auto';
        });
    }

    // Hero Background Slideshow
    const heroBackground = document.querySelector('.hero-bg');
    if (heroBackground) {
        const slides = heroBackground.querySelectorAll('.hero-slide');
        let currentSlide = 0;
        if (slides.length > 1) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 6000);
        }
    }

    // About Section Image Carousel
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    if (carouselSlides.length > 0) {
        let currentCarouselSlide = 0;
        const showCarouselSlide = (index) => {
            carouselSlides.forEach(slide => slide.classList.remove('active'));
            carouselDots.forEach(dot => dot.classList.remove('active'));
            carouselSlides[index].classList.add('active');
            if (carouselDots[index]) carouselDots[index].classList.add('active');
        };

        const nextCarouselSlide = () => {
            currentCarouselSlide = (currentCarouselSlide + 1) % carouselSlides.length;
            showCarouselSlide(currentCarouselSlide);
        };

        setInterval(nextCarouselSlide, 4000);

        carouselDots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentCarouselSlide = parseInt(dot.getAttribute('data-slide'));
                showCarouselSlide(currentCarouselSlide);
            });
        });
    }

    // Impact Statistics Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            if (isNaN(target)) return;
            const increment = target / 50;
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
    }

    const impactSection = document.getElementById('impact');
    if (impactSection) {
        let counterAnimated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterAnimated) {
                    animateCounters();
                    counterAnimated = true;
                    observer.unobserve(impactSection);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(impactSection);
    }
});
