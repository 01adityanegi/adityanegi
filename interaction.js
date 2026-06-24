document.addEventListener("DOMContentLoaded", function () {
    
    


    
    const header = document.querySelector('.site-header');
    if (header) {
        let lastScroll = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScroll = window.pageYOffset;

                    
                    if (currentScroll > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }

                    
                    if (currentScroll <= 0) {
                        header.classList.remove('hidden');
                    } else if (currentScroll > lastScroll && !header.classList.contains('hidden') && currentScroll > 100) {
                        
                        const nav = document.querySelector('.site-nav');
                        if (!nav || !nav.classList.contains('open')) {
                            header.classList.add('hidden');
                        }
                    } else if (currentScroll < lastScroll && header.classList.contains('hidden')) {
                        
                        header.classList.remove('hidden');
                    }

                    lastScroll = currentScroll;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    
        
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        revealElements.forEach(el => {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", 
                        toggleActions: "play none none reverse" 
                    }
                }
            );
        });

        
        const staggerContainers = document.querySelectorAll('.reveal-stagger');
        staggerContainers.forEach(container => {
            const children = container.children;
            gsap.fromTo(children,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        
        const imageWrappers = document.querySelectorAll('.services-icon, .showcase-image');
        imageWrappers.forEach(wrapper => {
            const img = wrapper.querySelector('img, video, i');
            if (!img) return;

            gsap.fromTo(img,
                { scale: 1.2 },
                {
                    scale: 1,
                    duration: 1.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top 90%",
                        scrub: 1 
                    }
                }
            );
        });

    
        const menuToggle = document.querySelector('.menu-toggle');
        const siteNav = document.querySelector('.site-nav');

        if (menuToggle && siteNav) {
            menuToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                menuToggle.classList.toggle('active');
                siteNav.classList.toggle('open');
                const isExpanded = menuToggle.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', isExpanded);
            });

            
            document.addEventListener('click', function (event) {
                if (siteNav.classList.contains('open') &&
                    !siteNav.contains(event.target) &&
                    !menuToggle.contains(event.target)) {
                    menuToggle.classList.remove('active');
                    siteNav.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });

            
            const navLinks = siteNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    siteNav.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }

    
    const counters = document.querySelectorAll('.counter');

    if (counters.length > 0) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-target')) || 0;
                        const duration = 2000; 
                        const stepTime = 16; 
                        const totalSteps = duration / stepTime;
                        let currentStep = 0;

                        const updateCounter = () => {
                            currentStep++;
                            
                            const progress = currentStep / totalSteps;
                            const easeOutQuad = progress * (2 - progress);
                            const currentVal = Math.round(easeOutQuad * target);

                            counter.innerText = currentVal;

                            if (currentStep < totalSteps) {
                                setTimeout(updateCounter, stepTime);
                            } else {
                                counter.innerText = target;
                            }
                        };

                        updateCounter();
                        
                        obs.unobserve(counter);
                    }
                });
            }, { threshold: 0.3 });

            counters.forEach(counter => {
                observer.observe(counter);
            });
        }

    

        
        const magneticBtns = document.querySelectorAll('.btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });

        
        const tiltElements = document.querySelectorAll('.service-box, .project-card, .featured-slide');
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                
                const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

                
                gsap.to(el, {
                    rotationY: x * 10,
                    rotationX: -y * 10,
                    transformPerspective: 1000,
                    ease: 'power1.out',
                    duration: 0.4
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    rotationY: 0,
                    rotationX: 0,
                    ease: 'power3.out',
                    duration: 0.6
                });
            });
        });

    
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        const showcase = document.querySelector('.featured-showcase');
        const slides = document.querySelectorAll('.featured-slide');
        const progressFill = document.getElementById('scrollProgressFill');

        if (!showcase || slides.length === 0) return;

        let mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            ScrollTrigger.create({
                trigger: showcase,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    if (progressFill) {
                        progressFill.style.width = (self.progress * 100) + '%';
                    }
                }
            });

            slides.forEach((slide, index) => {
                if (index < slides.length - 1) {
                    gsap.to(slide, {
                        scale: 0.92,
                        opacity: 0.5,
                        ease: "none",
                        scrollTrigger: {
                            trigger: slides[index + 1],
                            start: "top bottom",
                            end: "top top",
                            scrub: 1
                        }
                    });
                }
            });
        });

        mm.add("(max-width: 768px)", () => {
            slides.forEach((slide) => {
                gsap.fromTo(slide,
                    { opacity: 0, y: 60, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: slide,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
                
                const slideContent = slide.querySelector('.slide-content');
                if (slideContent) {
                    gsap.fromTo(slideContent,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            delay: 0.2,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: slide,
                                start: "top 80%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                }
            });
        });

        // ==========================================
        // LUXURY SCROLL EFFECTS
        // ==========================================

        // Image Parallax Effect
        const parallaxImages = document.querySelectorAll('.proj-card img, .slide-image img, .service-box img');
        parallaxImages.forEach(img => {
            gsap.fromTo(img, 
                {
                    yPercent: -15,
                    scale: 1.05
                },
                {
                    yPercent: 15,
                    scale: 1.05,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        });

        // Subtle Scroll Skew Effect for Luxury Feel
        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(".proj-card, .service-box, .featured-slide", "skewY", "deg"),
            clamp = gsap.utils.clamp(-5, 5); 

        ScrollTrigger.create({
            onUpdate: (self) => {
                let skew = clamp(self.getVelocity() / -300);
                if (Math.abs(skew) > Math.abs(proxy.skew)) {
                    proxy.skew = skew;
                    gsap.to(proxy, { skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew) });
                }
            }
        });
        
        // Ensure reveal triggers correctly with lenis
        ScrollTrigger.refresh();
});
