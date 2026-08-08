// Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false, // Standard to not interfere with native mobile touch
  touchMultiplier: 2,
  infinite: false,
});

// Synchronize Lenis with GSAP ScrollTrigger
if (typeof ScrollTrigger !== 'undefined') {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
} else {
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Page Transition Logic
document.addEventListener('DOMContentLoaded', () => {
  const transitionEl = document.querySelector('.page-transition');
  
  // Reveal page on load
  if (transitionEl) {
    // 1. Ensure the premium typing animation finishes at least once (1.5s)
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 1500));
    
    // 2. Ensure all page assets (images, fonts) are perfectly loaded
    const windowLoadPromise = new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });

    // Wait for BOTH conditions to be true before hiding the loader
    Promise.all([minTimePromise, windowLoadPromise]).then(() => {
      transitionEl.classList.add('is-loaded');
    });
  }

  // Handle internal link clicks
  const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"])');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetUrl = link.getAttribute('href');
      
      // If it's a real internal URL
      if (targetUrl && !targetUrl.startsWith('mailto:') && !targetUrl.startsWith('tel:')) {
        e.preventDefault();
        
        if (transitionEl) {
          transitionEl.classList.remove('is-loaded');
        }
        
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 500); // Wait for CSS transition (0.5s)
      }
    });
  });
});
