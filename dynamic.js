 if (!isDeleting && charIndex === currentPhrase.length) {
                
                isDeleting = true;
                typeSpeed = 2000; 
            } else if (isDeleting && charIndex === 0) {
                
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500; 
            }

            setTimeout(type, typeSpeed);
        }

        
        setTimeout(type, 1000);
    }
});
