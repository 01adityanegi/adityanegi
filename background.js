document.addEventListener("DOMContentLoaded", function () {
    // Create container for background
    const bgContainer = document.createElement("div");
    bgContainer.classList.add("animated-background");
    document.body.prepend(bgContainer);

    // Create Gradient Blobs
    const blob1 = document.createElement("div");
    blob1.classList.add("bg-blob", "blob-1");
    bgContainer.appendChild(blob1);

    const blob2 = document.createElement("div");
    blob2.classList.add("bg-blob", "blob-2");
    bgContainer.appendChild(blob2);

    const blob3 = document.createElement("div");
    blob3.classList.add("bg-blob", "blob-3");
    bgContainer.appendChild(blob3);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // Disable parallax on reduced motion

    // Parallax Effect on Scroll with Throttle
    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                // Move blobs at different speeds
                blob1.style.transform = `translate3d(0, ${scrollY * 0.2}px, 0) rotate(${scrollY * 0.05}deg)`;
                blob2.style.transform = `translate3d(0, ${scrollY * -0.15}px, 0) rotate(${scrollY * -0.02}deg)`;
                blob3.style.transform = `translate3d(0, ${scrollY * 0.1}px, 0) rotate(${scrollY * 0.08}deg)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
});
