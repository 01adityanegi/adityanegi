document.addEventListener('DOMContentLoaded', () => {
    
    
    const verifyEmailBtn = document.getElementById('verify-email-btn');
    const otpGroup = document.getElementById('otp-group');
    const otpInput = document.getElementById('otp');
    const confirmOtpBtn = document.getElementById('confirm-otp-btn');
    const otpMessage = document.getElementById('otp-message');
    const emailInput = document.getElementById('email');
    const finalCheckoutBtn = document.getElementById('final-checkout-btn');

    let generatedOTP = null;
    let emailVerified = false;

    verifyEmailBtn.addEventListener('click', () => {
        console.log("Verify Button Clicked!");
        const emailVal = emailInput.value.trim();
        if (!emailVal || !emailVal.includes('@')) {
            alert('Please enter a valid email address first.');
            return;
        }

        
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

        verifyEmailBtn.innerText = 'Sending...';
        verifyEmailBtn.style.opacity = '0.7';
        verifyEmailBtn.disabled = true;

        
        
        
        
        
        

        const serviceID = 'service_8orr4b2'; 
        const templateID = 'template_4brqhab'; 
        const nameVal = document.getElementById('name').value.trim() || 'Valued Client';

        const templateParams = {
            email: emailVal,
            passcode: generatedOTP,
            user_name: nameVal
        };

        try {
            if (typeof emailjs === 'undefined') {
                throw new Error("EmailJS library could not be loaded. Please turn off your adblocker or tracking protection.");
            }

            
            emailjs.send(serviceID, templateID, templateParams, "an_nU40tFBGN52ATn")
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    verifyEmailBtn.innerText = 'Sent ✓';
                    verifyEmailBtn.style.background = '#32CD32';
                    verifyEmailBtn.style.color = 'white';

                    otpGroup.style.display = 'block';
                    otpGroup.style.animation = 'fadeInUp 0.5s ease backwards';
                    otpMessage.innerText = 'Code sent securely to ' + emailVal;
                    otpMessage.style.color = 'var(--text-secondary)';
                }, function (error) {
                    console.log('FAILED...', error);

                    
                    verifyEmailBtn.innerText = 'VERIFY';
                    verifyEmailBtn.style.background = 'var(--accent-color)';
                    verifyEmailBtn.style.opacity = '1';
                    verifyEmailBtn.disabled = false;

                    let errorMsg = typeof error === 'string' ? error : (error.text || JSON.stringify(error));
                    console.warn('EmailJS failed to send the email:\n\n' + errorMsg);

                    if (errorMsg.includes('strict mode')) {
                        alert('EmailJS Error: Your account has "Strict Mode" enabled.\n\nTo fix this:\n1. Go to your EmailJS Dashboard -> Account\n2. Turn OFF "Allow EmailJS API for non-browser applications" (Strict Mode)\n3. Save and try again.');
                    }

                    
                    console.warn("FALLBACK OTP FOR TESTING (Since EmailJS is unconfigured/failed):", generatedOTP);
                    otpGroup.style.display = 'block';
                    otpGroup.style.animation = 'fadeInUp 0.5s ease backwards';
                    otpMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Email service unavailable. <b>Check browser console</b> for fallback OTP code.';
                    otpMessage.style.color = '#ffaa00'; 
                });
        } catch (err) {
            console.error('EmailJS Sync Error:', err);
            verifyEmailBtn.innerText = 'VERIFY';
            verifyEmailBtn.style.background = 'linear-gradient(135deg, var(--accent-color), #ff8c00)';
            verifyEmailBtn.style.opacity = '1';
            verifyEmailBtn.disabled = false;

            
            console.warn("FALLBACK LOGIC MOVED FORWARD DUE TO ERROR. OTP IS:", generatedOTP);
            otpGroup.style.display = 'block';
            otpGroup.style.animation = 'fadeInUp 0.5s ease backwards';
            otpMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Adblocker detected. <b>Check browser console</b> for fallback OTP code.';
            otpMessage.style.color = '#ffaa00';
        }
    });

    confirmOtpBtn.addEventListener('click', () => {
        const enteredOTP = otpInput.value.trim();

        if (enteredOTP === generatedOTP) {
            emailVerified = true;
            otpMessage.innerText = 'Email successfully verified!';
            otpMessage.style.color = '#32CD32';
            otpInput.disabled = true;
            confirmOtpBtn.disabled = true;
            confirmOtpBtn.innerText = 'Verified';
            emailInput.readOnly = true;

            
            finalCheckoutBtn.style.opacity = '1';
            finalCheckoutBtn.style.cursor = 'pointer';
            finalCheckoutBtn.style.pointerEvents = 'auto';
            finalCheckoutBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        } else {
            otpMessage.innerText = 'Incorrect OTP. Please try again.';
            otpMessage.style.color = '#ff4d4d';
        }
    });

    
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        if (!emailVerified) {
            alert("You must verify your email address before sending the message.");
            return;
        }

        
        const now = Date.now();
        const lastSubmit = localStorage.getItem('lastFormSubmitTime');
        if (lastSubmit && (now - parseInt(lastSubmit, 10)) < 60000) {
            alert("Please wait at least 60 seconds before sending another message.");
            return;
        }
        localStorage.setItem('lastFormSubmitTime', now.toString());

        
        finalCheckoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        finalCheckoutBtn.style.opacity = '0.7';
        finalCheckoutBtn.style.pointerEvents = 'none';

        function sanitizeInput(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                "/": '&#x2F;',
            };
            const reg = /[&<>"'/]/ig;
            return text.replace(reg, (match) => (map[match]));
        }

        
        const formData = new FormData();
        formData.append('name', sanitizeInput(document.getElementById('name').value.trim()));
        formData.append('phoneno', sanitizeInput(document.getElementById('phoneno').value.trim()));
        formData.append('email', sanitizeInput(document.getElementById('email').value.trim()));
        formData.append('message', sanitizeInput(document.getElementById('message').value.trim()));
        formData.append('_subject', "New Project Inquiry from Aditya Negi Portfolio!");

        
        
        const scriptURL = "https://script.google.com/macros/s/AKfycbwZNguYs8sJfuliNfhbuW461syEmhVnf4gL1_DsYdeo8ob1Zia5BgfYMedAhU_3Ah3W/exec";

        fetch(scriptURL, {
            method: "POST",
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    finalCheckoutBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent Successfully!';
                    finalCheckoutBtn.style.background = '#32CD32';
                    finalCheckoutBtn.style.color = 'white';

                    alert("Thank you! Your message has been sent to Aditya. I will get back to you soon.");

                    
                    setTimeout(() => {
                        contactForm.reset();
                        window.location.reload();
                    }, 3000);
                } else {
                    throw new Error("Network response was not ok.");
                }
            })
            .catch(error => {
                console.error("Submission Error:", error);
                finalCheckoutBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error Sending';
                finalCheckoutBtn.style.background = '#ff4d4d';
                alert("Oops! There was an issue sending your message. Please try emailing directly at 01adityanegi@gmail.com");

                
                setTimeout(() => {
                    finalCheckoutBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    finalCheckoutBtn.style.background = 'linear-gradient(135deg, var(--accent-color), #ff8c00)';
                    finalCheckoutBtn.style.opacity = '1';
                    finalCheckoutBtn.style.pointerEvents = 'auto';
                }, 3000);
            });
    });

});
