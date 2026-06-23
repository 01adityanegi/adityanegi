document.addEventListener("DOMContentLoaded", function () {
    const techContainer = document.createElement("div");
    techContainer.id = "tech-animation-container";
    Object.assign(techContainer.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "-1", // Behind content, in front of blobs
        overflow: "hidden"
    });
    document.body.appendChild(techContainer);

    // --- 1. Floating Code Snippets ---
    const codeSnippets = [
        "console.log('Future');",
        "if (user.isAwesome) { connect(); }",
        "while(alive) { code(); }",
        "git push origin master",
        "npm install universe",
        "const idea = new Innovation();",
        "<div>Hello World</div>",
        "import React from 'react';",
        "chmod 777 perception",
        "404: Limits Not Found"
    ];

    function createCodeParticle() {
        const span = document.createElement("span");
        span.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        span.className = "floating-code";

        // Random Position
        span.style.left = Math.random() * 90 + "%";
        span.style.top = Math.random() * 90 + "%";

        // Random Size & Opacity
        const size = Math.random() * 0.8 + 0.6; // 0.6rem to 1.4rem
        span.style.fontSize = `${size}rem`;
        span.style.opacity = "0";

        techContainer.appendChild(span);

        // Animate (Fade in, float up/down, fade out)
        // Using Web Animations API for better performance than CSS class toggling for dynamic values
        const duration = Math.random() * 5000 + 5000; // 5-10s
        const directionY = Math.random() > 0.5 ? -50 : 50; // Float up or down

        const animation = span.animate([
            { opacity: 0, transform: `translateY(0px)` },
            { opacity: 0.3, transform: `translateY(${directionY * 0.5}px)`, offset: 0.2 },
            { opacity: 0.3, transform: `translateY(${directionY * 0.8}px)`, offset: 0.8 },
            { opacity: 0, transform: `translateY(${directionY}px)` }
        ], {
            duration: duration,
            easing: "ease-in-out"
        });

        animation.onfinish = () => span.remove();
    }

    // Spawn code occasionally unless reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        setInterval(createCodeParticle, 2000);
    }


    // --- 2. The IoT Car (Circuit Runner) ---
    // A simplified visual: An SVG path representing a "road" or "circuit" and a moving element
    const carContainer = document.createElement("div");
    carContainer.className = "iot-car-container";
    carContainer.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <!-- Invisible Path for reference, visual line handled by CSS if needed or just implied -->
            <path id="carPath" d="M -50,250 C 200,250 300,100 500,100 S 800,250 1050,250" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2" stroke-dasharray="10 10"/>
        </svg>
        <div class="iot-car">
            <i class="fas fa-car-side"></i>
            <div class="wi-fi-waves">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    if (!prefersReducedMotion) {
        techContainer.appendChild(carContainer);
    }

    // Animate the car along the curve roughly using simple CSS translationKeyframes in generated style or JS
    // For simplicity and performance, we'll use CSS keyframes in the accompanying stylesheet.


    // --- 3. (Robot Removed - Upgrading to Interactive Chatbot) ---
    // The previous ambient robot is now being replaced by the full chatbot.js 
    // to avoid duplications and provide real functionality.

});
