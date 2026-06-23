document.addEventListener('DOMContentLoaded', () => {
    // --- 2. Typing Effect for Hero ---
    const typingElement = document.querySelector('.hero-text h1 .text-gradient-silver');
    if (typingElement) {
        const phrases = ["High-Impact Websites", "Smart Chatbots", "IoT Solutions", "Digital Experiences"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Faster when deleting
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Normal typing speed
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Finished typing phrase
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing loop
        setTimeout(type, 1000);
    }
});
