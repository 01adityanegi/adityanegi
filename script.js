// Small helpers for the site
// 1) Set the current year in the footer
// 2) Keep accessible focus behaviour or small interactive bits

document.addEventListener('DOMContentLoaded', function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (menuToggle && siteNav) {
    // Keep track of focus for accessibility
    let previousFocus = null;

    const focusableSelectors = 'a, button, input, textarea, [tabindex]:not([tabindex="-1"])';

    function trapFocus(container) {
      const focusable = Array.from(container.querySelectorAll(focusableSelectors)).filter(el => !el.hasAttribute('disabled'));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      function handleKey(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        } else if (e.key === 'Escape') {
          closeMenu();
        }
      }

      container._removeTrap = () => document.removeEventListener('keydown', handleKey, true);
      document.addEventListener('keydown', handleKey, true);
      // focus the first element
      first.focus();
    }

    function openMenu() {
      previousFocus = document.activeElement;
      const isOpen = siteNav.classList.add('open');
      document.body.classList.add('nav-open');
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      // trap focus inside nav
      trapFocus(siteNav);
    }

    function closeMenu() {
      siteNav.classList.remove('open');
      document.body.classList.remove('nav-open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      if (siteNav._removeTrap) siteNav._removeTrap();
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    }

    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      document.body.classList.toggle('nav-open');
      // toggle visual state
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(isOpen));

      if (isOpen) {
        previousFocus = document.activeElement;
        trapFocus(siteNav);
      } else {
        if (siteNav._removeTrap) siteNav._removeTrap();
        if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
      }
    });

    // Close nav when a link inside it is clicked (useful for single-page or multi-page nav)
    const navLinks = siteNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (siteNav.classList.contains('open')) closeMenu();
      });
    });

    // Also close on Escape globally
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('open')) closeMenu();
    });
  }

  // --- Contact Form Submission ---
  const contactForm = document.getElementById('contactForm');
  // IMPORTANT: Replace the URL below with your actual deployed Google Apps Script Web App URL (starts with https://script.google.com/...)
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwSdflFo0YKNHjvUlohCQ3VCE5iHhNvAm9vGIgUdniTsvhqVA3dycqumngn5ucUh1EjKQ/exec';

  if (contactForm) {
    // Popup Elements
    const successPopup = document.getElementById('successPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');

    function openPopup() {
      if (successPopup) successPopup.classList.add('active');
    }

    function closePopup() {
      if (successPopup) successPopup.classList.remove('active');
    }

    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', closePopup);
    }

    // Close on click outside
    if (successPopup) {
      successPopup.addEventListener('click', (e) => {
        if (e.target === successPopup) closePopup();
      });
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;

      // --- SPAM PROTECTION (Honeypot) ---
      // If the hidden 'bot-field' is filled, it's a bot. Return silently.
      const botField = document.getElementById('bot-field');
      if (botField && botField.value) {
        // Silent success for bots - don't reveal we're blocking them
        openPopup(); // Fake success to fool the bot
        contactForm.reset();
        return;
      }

      // Visual feedback
      submitBtn.disabled = true;
      submitBtn.innerText = 'Sending...';

      // Capture form data
      const params = new URLSearchParams();
      params.append('name', document.getElementById('name').value);
      params.append('phoneno', document.getElementById('phoneno').value);
      params.append('email', document.getElementById('email').value);
      // Build comprehensive message with checkout details
      let finalMessage = "--- PROJECT DETAILS ---\n" + document.getElementById('message').value + "\n\n";

      try {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect && serviceSelect.selectedIndex > 0) {
          finalMessage += "--- CHECKOUT SELECTION ---\n";
          finalMessage += "Base Package: " + serviceSelect.options[serviceSelect.selectedIndex].text + "\n";

          const addons = [];
          document.querySelectorAll('.addon-checkbox:checked').forEach(cb => {
            if (cb.nextElementSibling) addons.push(cb.nextElementSibling.innerText);
          });
          finalMessage += "Add-ons: " + (addons.length > 0 ? addons.join(', ') : 'None') + "\n";



          const totalEl = document.getElementById('summary-total');
          if (totalEl) {
            finalMessage += "Final Total: " + totalEl.innerText + "\n";
          }
        }
      } catch (e) {
        // Silently handle checkout parsing errors - don't break the form
        // This is optional functionality
      }

      params.append('message', finalMessage);

      // Send to Google Apps Script
      // Using mode: 'no-cors' is essential for Google Scripts to avoid blocking redirects
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: params
      })
        .then(response => {
          // With no-cors, we get an opaque response, so we assume success if no error is thrown
          openPopup();
          contactForm.reset();
          setTimeout(() => {
            window.location.href = window.location.pathname;
          }, 4000);
        })
        .catch(error => {
          // Show user-friendly error message instead of console.error
          const errorPopup = document.getElementById('successPopup');
          if (errorPopup) {
            // Show error state in popup if available, otherwise use alert
            errorPopup.innerHTML = '<p style="color: #ff6b6b;">Failed to send message. Please try again or contact directly via WhatsApp/Email.</p>';
            errorPopup.classList.add('active');
          } else {
            alert('Something went wrong. Please try again or contact me directly via WhatsApp/Email.');
          }
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        });
    });
  }
});




// --- 3D Project Carousel Logic ---
const track = document.getElementById('projectTrack');
if (track) {
  const cards = Array.from(track.querySelectorAll('.project-card'));
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentIndex = 0;

  function updateCarousel() {
    const totalCards = cards.length;

    cards.forEach((card, index) => {
      // Reset classes
      card.className = 'project-card';

      // Calculate minimal distance in a circular manner
      // We want (index - currentIndex) but wrapped around totalCards

      let diff = (index - currentIndex) % totalCards;
      if (diff < -Math.floor(totalCards / 2)) diff += totalCards;
      if (diff > Math.floor(totalCards / 2)) diff -= totalCards;

      // Apply classes based on circular difference
      if (diff === 0) {
        card.classList.add('active');
        card.style.zIndex = 10;
      } else if (diff === -1) {
        card.classList.add('prev');
        card.style.zIndex = 5;
      } else if (diff === 1) {
        card.classList.add('next');
        card.style.zIndex = 5;
      } else if (diff < -1) {
        card.classList.add('hide-left');
        card.style.zIndex = 0;
      } else {
        card.classList.add('hide-right');
        card.style.zIndex = 0;
      }

      // Click to navigate logic
      card.onclick = () => {
        // Determine shortest path to this card
        let moveDiff = (index - currentIndex + totalCards) % totalCards;

        if (moveDiff === 0) return; // Already active

        // Decide whether to go forward or backward
        if (moveDiff > totalCards / 2) {
          // Closer to go backward
          currentIndex = (currentIndex - (totalCards - moveDiff) + totalCards) % totalCards;
        } else {
          // Go forward
          currentIndex = (currentIndex + moveDiff) % totalCards;
        }
        updateCarousel();
      };
    });
  }

  // Initialize
  updateCarousel();

  // Event Listeners with Infinite Loop
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateCarousel();
    });
  }

  // Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      // Swipe Left -> Next
      currentIndex = (currentIndex + 1) % cards.length;
      updateCarousel();
    } else if (touchEndX - touchStartX > 50) {
      // Swipe Right -> Prev
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    }
  });
}

// --- Internal Slideshow Logic ---
const slideshows = document.querySelectorAll('[data-slideshow]');
slideshows.forEach(wrapper => {
  const slides = wrapper.querySelectorAll('.project-img');
  if (slides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 1000); // Switch every 1 second
  }
});

// Ensure Video Autoplay on Safari/Mobile
const videos = document.querySelectorAll('video');
videos.forEach(video => {
  video.play().catch(e => {
    // Autoplay blocked - this is expected on many browsers, silent handling
  });
});

// --- Number Counting Animation ---
const counters = document.querySelectorAll('.counter');
if (counters.length > 0) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // Animation duration in ms
        const increment = target / (duration / 16); // 60fps

        let current = 0;
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
        observer.unobserve(counter); // Run once
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// --- Scroll Reveal Animations (Global) ---
const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-stagger');

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
}

// Register Service Worker for PWA/Offline Support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        // Service worker registered successfully - silent for production
      })
      .catch((err) => {
        // Service worker failed - don't break the site, just continue
      });
  });
}

// --- 3D Mouse-follow tilt (for elements with data-tilt; desktop only) ---
document.addEventListener('DOMContentLoaded', function () {
  if ('ontouchstart' in window) return;
  var tiltEls = document.querySelectorAll('[data-tilt]');
  if (!tiltEls.length) return;

  var maxTilt = 12;
  tiltEls.forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var rotateY = -x * maxTilt;
      var rotateX = y * maxTilt;
      el.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(10px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
    });
  });
});
