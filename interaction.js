document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.createElement("canvas");
    canvas.id = "interaction-canvas";
    Object.assign(canvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "10000" // Above snow canvas (9999)
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let width, height;

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    window.addEventListener("resize", resize);
    resize();

    const particles = [];
    // Limit particles for performance
    const maxParticles = 100;

    // Track mouse/touch position
    const mouse = { x: null, y: null };

    // Function to create particles
    function createParticle(x, y) {
        // Create 2-3 particles per event for a denser "fog" feel
        for (let i = 0; i < 2; i++) {
            particles.push({
                x: x,
                y: y,
                size: Math.random() * 8 + 4, // Variable size for depth
                speedX: (Math.random() - 0.5) * 1.5, // Drift left/right
                speedY: (Math.random() - 0.5) * 1.5, // Drift up/down
                opacity: 0.5 + Math.random() * 0.3, // Start opacity
                shrink: 0.01 + Math.random() * 0.01 // Fade speed
            });
        }
    }

    // Mouse Events
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
        createParticle(mouse.x, mouse.y);
    });

    // Touch Events
    window.addEventListener("touchmove", (e) => {
        // Prevent scrolling while generating effect if desired? 
        // No, let's keep scrolling natural.
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        createParticle(mouse.x, mouse.y);
    });

    // Handle touch start to spawn immediately
    window.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        createParticle(mouse.x, mouse.y);
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.x += p.speedX;
            p.y += p.speedY;
            p.opacity -= p.shrink;
            p.size -= 0.05; // Slowly shrink size too

            if (p.opacity <= 0 || p.size <= 0) {
                particles.splice(i, 1);
                i--;
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;

                // Optional: Add a subtle blur for "fog" look
                // Note: shadowBlur can be expensive on mobile, keeping it minimal or removing if laggy
                // ctx.shadowBlur = 5;
                // ctx.shadowColor = "white"; 

                ctx.fill();
                // ctx.shadowBlur = 0; // Reset
            }
        }

        // Safety cap
        if (particles.length > maxParticles) {
            particles.splice(0, particles.length - maxParticles);
        }

        requestAnimationFrame(animate);
    }

    animate();
});

// --- Smart Navbar Scroll Logic ---
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add background when scrolled past 50px
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Smart hide/show logic
        if (currentScroll <= 0) {
            header.classList.remove('hidden');
        } else if (currentScroll > lastScroll && !header.classList.contains('hidden') && currentScroll > 100) {
            // Scrolling down - hide header (if mobile menu isn't open)
            const nav = document.querySelector('.site-nav');
            if (!nav || !nav.classList.contains('open')) {
                header.classList.add('hidden');
            }
        } else if (currentScroll < lastScroll && header.classList.contains('hidden')) {
            // Scrolling up - show header
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });
});

// --- Cinematic Scroll Reveal System ---
document.addEventListener("DOMContentLoaded", function () {
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-stagger');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed so it doesn't animate out and in repeatedly
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
