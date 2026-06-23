document.addEventListener("DOMContentLoaded", function () {
    // === CONFIGURATION ===
    // Enter your Gemini API Key here to enable the AI:
    const GEMINI_API_KEY = "AIzaSyCafiFoSDNvL3LL3w9gKmgl8kobKGVncCU";

    // 1. Create Chat Widget DOM
    const chatWidget = document.createElement("div");
    chatWidget.id = "chatbot-widget";
    chatWidget.innerHTML = `
        <div class="chat-toggle-btn">
            <div class="tech-ring"></div>
            <div class="robot-face" style="width: 100%; height: 100%;">
                <div class="robot-orb">
                    <div class="robot-screen">
                        <div class="orb-eye orb-eye-left"></div>
                        <div class="orb-eye orb-eye-right">
                            <div class="eye-bar"></div>
                            <div class="eye-wedge top"></div>
                            <div class="eye-wedge bottom"></div>
                        </div>
                    </div>
                </div>
            </div>
            <span class="chat-notification-dot"></span>
        </div>
        
        <!-- Speech Bubble for Random shoutouts -->
        <div class="chat-shoutout" id="chat-shoutout">Hi! 👋</div>

        <div class="chat-window">
            <div class="chat-header">
                <div class="header-info">
                    <i class="fas fa-robot"></i>
                    <span>AdiXa AI</span>
                </div>
                <div class="header-controls">
                    <button class="chat-close-btn">&times;</button>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages">
                <!-- Messages will appear here -->
            </div>
            <div class="chat-options" id="chat-options">
                <!-- Dynamic Options -->
            </div>
            <div class="chat-input-area" id="chat-input-area">
                <button id="mic-btn" class="icon-btn mic-trigger" title="Voice Input"><i class="fas fa-microphone"></i></button>
                <input type="text" id="chat-input-text" placeholder="Ask me anything..." aria-label="Chat input">
                <button id="chat-send-btn" class="icon-btn send-trigger" title="Send"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(chatWidget);

    // 2. CSS Styles (Injected for portability)
    const style = document.createElement('style');
    style.innerHTML = `
        #chatbot-widget {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 10000;
            font-family: 'Outfit', sans-serif;
        }
        
        .chat-toggle-btn {
            width: 65px;
            height: 65px;
            background: linear-gradient(135deg, #FF1493, #FFA500, #32CD32, #00BFFF);
            background-size: 300% 300%;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(255, 20, 147, 0.6);
            border: 2px solid #fff;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: floatBot 4s ease-in-out infinite, pulseGlow 2.5s infinite;
            position: relative;
        }

        .chat-toggle-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(0, 198, 255, 0.8);
        }

        .tech-ring {
            position: absolute;
            width: 75px; 
            height: 75px;
            border: 2px dashed rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            animation: spinRing 8s linear infinite;
            pointer-events: none;
        }

        @keyframes spinRing { 100% { transform: rotate(360deg); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 4px 20px rgba(255, 20, 147, 0.6); } 50% { box-shadow: 0 4px 30px rgba(0, 198, 255, 0.8); } }
        @keyframes flowColors { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        .robot-face {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            padding: 2px;
        }

        @keyframes floatBot { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .chat-shoutout {
            position: absolute;
            bottom: 85px; 
            right: 10px;
            background: #fff;
            color: #7000ff;
            padding: 8px 15px;
            border-radius: 20px 20px 0 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            font-size: 0.9rem;
            font-weight: 600;
            opacity: 0;
            transform: translateY(10px) scale(0.8);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
            white-space: nowrap;
            z-index: 9999;
        }

        .chat-shoutout.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .chat-notification-dot {
            position: absolute;
            top: 0;
            right: 0;
            width: 15px;
            height: 15px;
            background: #ff4757;
            border-radius: 50%;
            border: 2px solid #fff;
            animation: pulseDot 2s infinite;
        }
        @keyframes pulseDot { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }

        .chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 380px;
            height: 600px; 
            background: rgba(20, 20, 35, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px) scale(0.9);
            transform-origin: bottom right;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        }

        .chat-window.active {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }

        .chat-header {
            background: linear-gradient(135deg, #FF1493, #FFA500, #32CD32, #00BFFF);
            background-size: 300% 300%;
            animation: flowColors 5s ease infinite;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .header-info { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 1.1rem; }
        .header-controls { display: flex; align-items: center; gap: 10px; }
        .icon-btn { background: none; border: none; color: #fff; cursor: pointer; font-size: 1rem; opacity: 0.8; transition: opacity 0.2s; }
        .icon-btn:hover { opacity: 1; }
        .chat-close-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; opacity: 0.8; transition: opacity 0.2s; }
        .chat-close-btn:hover { opacity: 1; }

        .chat-messages {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 6px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

        .message {
            max-width: 85%;
            padding: 0.8rem 1rem;
            border-radius: 12px;
            font-size: 0.95rem;
            line-height: 1.5;
            animation: slideIn 0.3s ease;
            word-wrap: break-word;
        }

        .bot-msg {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            align-self: flex-start;
            border-bottom-left-radius: 2px;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .user-msg {
            background: linear-gradient(135deg, #FF1493, #FFA500);
            color: #fff;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(255, 20, 147, 0.3);
        }

        .chat-options {
            padding: 0.5rem 1rem 1rem 1rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.6rem;
        }

        .option-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid #FF1493;
            color: #FF69B4;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
        }

        .option-btn:hover {
            background: #FF1493;
            color: #fff;
            box-shadow: 0 0 10px rgba(255, 20, 147, 0.4);
        }
        
        /* Input Area (Text & Mic) */
        .chat-input-area {
            padding: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            gap: 10px;
            align-items: center;
            background: rgba(0,0,0,0.2);
        }

        .chat-input-area input {
            flex: 1;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            padding: 10px 15px;
            border-radius: 20px;
            outline: none;
            font-family: inherit;
            font-size: 0.95rem;
            transition: border-color 0.3s;
        }

        .chat-input-area input::placeholder { color: rgba(255,255,255,0.5); }
        .chat-input-area input:focus { border-color: #FF1493; }

        .mic-trigger, .send-trigger {
            background: linear-gradient(135deg, #FF1493, #FFA500);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, background 0.3s;
            box-shadow: 0 4px 10px rgba(255, 20, 147, 0.3);
        }

        .mic-trigger:hover, .send-trigger:hover { transform: scale(1.1); }
        .mic-trigger.listening { background: #ff4757 !important; animation: pulseMic 1.5s infinite; }
        
        @keyframes pulseMic { 0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(255, 71, 87, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Typing Indicator */
        .typing-indicator { display: inline-block; width: 40px; text-align: center; }
        .typing-indicator span {
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #fff;
            border-radius: 50%;
            margin: 0 2px;
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

        /* Mobile Responsive */
        @media (max-width: 480px) {
            #chatbot-widget { 
                right: 10px !important; 
                bottom: 15px !important; /* Increased from 10px to avoid overlapping with nav */
            }
            .chat-toggle-btn {
                width: 50px !important;  /* Reduced from 65px */
                height: 50px !important; /* Reduced from 65px */
            }
            .tech-ring {
                width: 60px !important;  /* Reduced from 75px */
                height: 60px !important; /* Reduced from 75px */
            }
            .chat-window {
                position: fixed;
                width: 95vw;
                height: 85vh;
                max-height: 600px;
                left: 50%;
                right: auto;
                bottom: 70px;
                transform: translateX(-50%) translateY(20px) scale(0.9);
                transform-origin: bottom center;
            }
            .chat-window.active { transform: translateX(-50%) translateY(0) scale(1); }
            .chat-shoutout { 
                right: -5px; 
                bottom: 65px; 
                font-size: 0.75rem;
                padding: 6px 12px;
            }
        }

        /* Extra small screens */
        @media (max-width: 360px) {
            .chat-toggle-btn {
                width: 45px !important;
                height: 45px !important;
            }
            .tech-ring {
                width: 55px !important;
                height: 55px !important;
            }
            .chat-window {
                width: 98vw;
                bottom: 60px;
            }
            .chat-shoutout {
                bottom: 55px;
                font-size: 0.7rem;
            }
        }

        /* --- Animated Chatbot Orb --- */
        .robot-orb { width: 100%; height: 100%; border-radius: 50%; background: radial-gradient(circle at 50% 50%, #1a1a2e 0%, #05050f 100%); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 255, 255, 0.2); }
        .robot-orb::before { content: ''; position: absolute; top: 5%; left: 10%; width: 80%; height: 40%; background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, transparent 100%); border-radius: 50%; transform: rotate(-10deg); pointer-events: none; z-index: 5; }
        .robot-screen { width: 65%; height: 40%; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(0, 255, 255, 0.5) 0%, rgba(0, 150, 255, 0.2) 40%, transparent 70%); display: flex; align-items: center; justify-content: center; gap: 10px; position: relative; z-index: 2; }
        .robot-orb::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(rgba(0, 0, 0, 0.6) 1px, transparent 1px); background-size: 3px 3px; z-index: 3; pointer-events: none; }
        .orb-eye { width: 6px; height: 16px; background: #ffffff; border-radius: 4px; box-shadow: 0 0 5px #fff, 0 0 15px #0ff; z-index: 4; position: relative; }
        .orb-eye-left { animation: orbBlink 5s infinite; }
        .orb-eye-right { background: transparent; box-shadow: none; animation: orbBlink 5s infinite; }
        .orb-eye-right .eye-bar { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #ffffff; border-radius: 4px; box-shadow: 0 0 5px #fff, 0 0 15px #0ff; animation: exprBar 6s infinite; }
        @keyframes exprBar { 0%, 45%, 100% { opacity: 1; } 50%, 95% { opacity: 0; } }
        .eye-wedge { position: absolute; width: 6px; height: 10px; background: #ffffff; border-radius: 4px; box-shadow: 0 0 5px #fff, 0 0 15px #0ff; left: 0; opacity: 0; animation: exprWedge 6s infinite; }
        @keyframes exprWedge { 0%, 45%, 100% { opacity: 0; } 50%, 95% { opacity: 1; } }
        .eye-wedge.top { top: -1px; transform-origin: bottom left; transform: rotate(35deg); }
        .eye-wedge.bottom { bottom: -1px; transform-origin: top left; transform: rotate(-35deg); }
        @keyframes orbBlink { 0%, 30%, 34%, 100% { transform: scaleY(1); } 32% { transform: scaleY(0.1); } }
    `;
    document.head.appendChild(style);

    // 3. Chat Logic
    const toggleBtn = chatWidget.querySelector('.chat-toggle-btn');
    const windowEl = chatWidget.querySelector('.chat-window');
    const closeBtn = chatWidget.querySelector('.chat-close-btn');
    const micBtn = chatWidget.querySelector('#mic-btn');
    const sendBtn = chatWidget.querySelector('#chat-send-btn');
    const textInput = chatWidget.querySelector('#chat-input-text');

    const messagesEl = chatWidget.querySelector('#chat-messages');
    const optionsEl = chatWidget.querySelector('#chat-options');
    const notificationDot = chatWidget.querySelector('.chat-notification-dot');
    const shoutoutEl = chatWidget.querySelector('#chat-shoutout');

    let hasOpened = false;
    let recognition = null;
    let isWaitingForAI = false;

    // --- Random Shoutouts Logic ---
    const shoutouts = [
        "Hi there! 👋",
        "Need a Website? 💻",
        "Chat with our AI! 🤖",
        "Ask me anything! 🗣️",
        "See my packages 📦"
    ];

    function showRandomShoutout() {
        if (hasOpened) return;
        const randomText = shoutouts[Math.floor(Math.random() * shoutouts.length)];
        shoutoutEl.textContent = randomText;
        shoutoutEl.classList.add('visible');
        setTimeout(() => { shoutoutEl.classList.remove('visible'); }, 4000);
    }

    setInterval(showRandomShoutout, 10000);
    setTimeout(showRandomShoutout, 2000);

    // --- Voice Recognition (STT) ---
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            micBtn.classList.add('listening');
            micBtn.innerHTML = '<i class="fas fa-wave-square"></i>';
        };

        recognition.onend = () => {
            micBtn.classList.remove('listening');
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            handleUserSubmission(transcript);
        };
    } else {
        micBtn.style.display = 'none';
    }

    // --- UI Interactions ---
    toggleBtn.addEventListener('click', () => {
        const isActive = windowEl.classList.toggle('active');
        if (isActive && !hasOpened) {
            hasOpened = true;
            notificationDot.style.display = 'none';
            if (messagesEl.children.length === 0) {
                const greet = "Hi there! 👋 I'm AdiXa AI, your assistant for Aditya Negi's portfolio. How can I help you today?";
                addBotMessage(greet);
                showMainOptions();
            }
        }
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('active');
    });

    micBtn.addEventListener('click', () => {
        if (isWaitingForAI) return;
        if (recognition) {
            recognition.start();
        } else {
            alert("Voice input not supported in this browser.");
        }
    });

    sendBtn.addEventListener('click', () => {
        const val = textInput.value.trim();
        if (val) {
            handleUserSubmission(val);
            textInput.value = '';
        }
    });

    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = textInput.value.trim();
            if (val) {
                handleUserSubmission(val);
                textInput.value = '';
            }
        }
    });

    function handleUserSubmission(text) {
        if (isWaitingForAI) return;
        addUserMessage(text);
        askAI(text);
    }

    function addBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'message bot-msg';
        // Basic Markdown parser for AI (bold and lists)
        let formatted = text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\\n/g, '<br>');
        msg.innerHTML = formatted;
        messagesEl.appendChild(msg);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'message user-msg';
        msg.textContent = text;
        messagesEl.appendChild(msg);
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showOptions(options) {
        optionsEl.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.label;
            btn.addEventListener('click', () => {
                if (isWaitingForAI) return;
                addUserMessage(opt.label);
                if (opt.action) opt.action();
                else askAI(opt.label); // Default act as a prompt
            });
            optionsEl.appendChild(btn);
        });
    }

    function showOptionsWithTitle(titleText, options) {
        optionsEl.innerHTML = '';
        if (titleText) {
            const titleMsg = document.createElement('div');
            titleMsg.className = 'message bot-msg';
            titleMsg.style.marginBottom = '10px';
            titleMsg.innerHTML = `<strong>${titleText}</strong>`;
            messagesEl.appendChild(titleMsg);
            scrollToBottom();
        }
        showOptions(options);
    }

    function showMainOptions() {
        showOptions([
            { label: "Services & FAQ ❓", action: showFAQMenu },
            { label: "Just saying Hi 👋", action: () => { handleUserSubmission("hi"); } }
        ]);
    }

    function showFAQMenu() {
        showOptionsWithTitle("What would you like to know about my web services?", [
            { label: "Website Packages 💻", action: () => { handleUserSubmission("packages"); } },
            { label: "How are you? 😊", action: () => { handleUserSubmission("how are you"); } },
            { label: "Do you provide Hosting? ☁️", action: () => { handleUserSubmission("hosting"); } },
            { label: "What is the Process of Payment? 💰", action: () => { handleUserSubmission("payment process"); } },
            { label: "What about Domains? 🌐", action: () => { handleUserSubmission("domains"); } },
            { label: "Do you offer Maintenance? 🛠️", action: () => { handleUserSubmission("maintenance"); } },
            { label: "How long does it take? ⏳", action: () => { handleUserSubmission("timeline"); } },
            { label: "Back to Menu", action: showMainOptions }
        ]);
    }

    // --- AI Integration (Gemini) ---
    async function askAI(query) {
        isWaitingForAI = true;
        optionsEl.innerHTML = ''; // Hide options while thinking

        // Show Typing Indicator
        const id = Date.now();
        const msg = document.createElement('div');
        msg.className = 'message bot-msg';
        msg.id = 'msg-' + id;
        msg.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        messagesEl.appendChild(msg);
        scrollToBottom();

        // Rule-Based Logic (Locally Processing)
        setTimeout(() => {
            let responseText = "I'm not quite sure about that. Try asking about **Website Packages**, **IoT Services**, or my **Contact Info**!";
            const lowerQ = query.toLowerCase();

            // Greetings / How are you
            if (lowerQ.match(/\b(hi|hello|hey|greetings|what's up|how are you|how do you do|how are u)\b/)) {
                responseText = "Hello! 👋 I'm **AdiXa AI**, your assistant. I am doing great! How can I help you regarding Aditya's web and IoT services?";
            }
            // About Aditya / Identity / Role / Location (56, 58, 22, 64)
            else if (lowerQ.includes("who are you") || lowerQ.includes("who is aditya") || lowerQ.includes("about aditya") || lowerQ.includes("aditya negi") || lowerQ.includes("experience") || lowerQ.match(/\b(how long|years)\b.*\b(working|field|experience)\b/)) {
                responseText = "Aditya Negi is a professional **Web Developer** based in Almora, Uttarakhand. He specializes in building beautiful, fast, and secure websites, custom web apps, and AI chatbots with years of deep technical expertise!";
            }
            // Services Offered / What do you do (1, 36, 48, 49, 57)
            else if (lowerQ.includes("what services") || lowerQ.includes("company do") || lowerQ.includes("offer") || lowerQ.includes("build business website") || lowerQ.includes("portfolio website")) {
                responseText = "Aditya builds everything from **Business Websites** and **Personal Portfolios** to complex **Full-Stack Web Applications** with integrated databases, eCommerce features, and AI Chatbots!";
            }
            // Pricing / Packages / Quotes / Affordability (3, 38, 44, 62, 65)
            else if (lowerQ.match(/\b(package|packages|price|pricing|cost|how much|quote|quotation|afford)\b/)) {
                responseText = "Aditya offers three main packages:<br>1. **Starter** (₹6,499) - A simple, professional website.<br>2. **Business** (₹15,000) - A larger site optimized for growth. (Most Popular!)<br>3. **Full Stack** (₹45,000) - A custom app with advanced features.<br>Yes, services are designed to be highly affordable for small businesses! Which sounds like a good fit?";
            }
            // Starter Package
            else if (lowerQ.includes("starter")) {
                responseText = "The **Starter Package (₹6,499)** gives you a beautiful 1-3 page website, a contact form so customers can email you directly, and **6 months of free hosting**.";
            }
            // Business Package
            else if (lowerQ.includes("business")) {
                responseText = "The **Business Package (₹15,000)** is perfect for growing companies! You get up to 5 pages, blazing-fast speeds, and a **free domain name and hosting for 1 whole year**.";
            }
            // Full Stack Package
            else if (lowerQ.includes("full stack") || lowerQ.includes("full-stack") || lowerQ.includes("app")) {
                responseText = "The **Full Stack Web App (₹45,000)** is for complex needs. It includes a custom database to store user information, top-tier security, and even a custom AI Chatbot!";
            }

            // --- FAQs for Non-Technical Clients ---

            // Revisions (29)
            else if (lowerQ.includes("revision") || lowerQ.includes("changes")) {
                responseText = "A **Revision Window** is an opportunity for you to review the completed draft of the website and request design/text changes before we launch it live. We collaborate to ensure you are 100% satisfied!";
            }
            // What is a Domain? (10)
            else if (lowerQ.includes("domain") || lowerQ.includes("url") || lowerQ.includes("website name")) {
                responseText = "A **Domain Name** is your website's address on the internet (like `yourbusiness.com`). Aditya provides domain registration services, and the Business Package includes one for free!";
            }
            // What is Hosting? (10, 43)
            else if (lowerQ.includes("hosting") || lowerQ.includes("host") || lowerQ.includes("server")) {
                responseText = "**Hosting** is like renting space on the internet to store your website's files so it stays online 24/7. Yes, Aditya handles all the technical server setup and hosting for you!";
            }
            // What is SEO / Marketing? (6, 51, 67)
            else if (lowerQ.includes("seo") || lowerQ.includes("google search") || lowerQ.includes("rank") || lowerQ.includes("marketing")) {
                responseText = "Yes! **SEO (Search Engine Optimization)** is included. Your website will be optimized to appear higher on Google when people search for your services. Aditya focuses on technical SEO for maximum visibility.";
            }
            // Maintenance & Upgrades & Support & Fixes (8, 25, 31, 35, 40, 46, 47, 68, 69)
            else if (lowerQ.includes("maintenance") || lowerQ.includes("update") || lowerQ.includes("support") || lowerQ.includes("fix") || lowerQ.includes("upgrade") || lowerQ.includes("emergency") || lowerQ.includes("monthly")) {
                responseText = "Yes! Aditya offers an optional **Monthly Maintenance Plan (₹3,499/mo)** covering security updates, content edits, emergency bug fixes, and continuous SEO monitoring. You can always upgrade your website later!";
            }
            // Payment Terms (45)
            else if (lowerQ.includes("payment") || lowerQ.includes("pay") || lowerQ.includes("terms") || lowerQ.includes("method")) {
                responseText = "For standard projects, the payment structure is **50% upfront** to begin work, and the remaining **50% upon final completion** right before your website goes live. We accept UPI, Bank Transfers, and major online payment gateways.";
            }
            // Timeline / How long? (2, 39)
            else if (lowerQ.includes("long") || lowerQ.includes("timeline") || lowerQ.includes("when") || lowerQ.includes("days") || lowerQ.includes("time") || lowerQ.includes("take")) {
                responseText = "A Starter website usually takes **3-5 days**, while a Business website takes about **1-2 weeks**. Complex applications take a bit longer based on features. How soon do you need your site?";
            }
            // Custom vs Templates / UI UX (4, 16, 17, 33)
            else if (lowerQ.includes("template") || lowerQ.includes("custom") || lowerQ.includes("wordpress") || lowerQ.includes("ui") || lowerQ.includes("ux")) {
                responseText = "Aditya strictly writes **custom code** following modern UI/UX practices. We do not use slow, bloated template builders like WordPress. Everything is hand-crafted for maximum speed and a unique design!";
            }
            // Mobile Friendly / Responsive (5)
            else if (lowerQ.includes("mobile") || lowerQ.includes("phone") || lowerQ.includes("responsive")) {
                responseText = "Absolutely! Every website Aditya builds is **100% mobile-friendly** and responsive, ensuring it looks and works perfectly on smartphones, tablets, and desktops.";
            }
            // Performance / Speed (13, 32)
            else if (lowerQ.includes("fast") || lowerQ.includes("speed") || lowerQ.includes("load") || lowerQ.includes("performance") || lowerQ.includes("optimize")) {
                responseText = "Yes! Performance is a top priority. Websites are optimized with minified code, compressed images, and modern caching to guarantee **lightning-fast loading speeds**.";
            }
            // eCommerce / Payment Gateways (12, 15)
            else if (lowerQ.includes("ecommerce") || lowerQ.includes("store") || lowerQ.includes("shop") || lowerQ.includes("payment gateway") || lowerQ.includes("sell")) {
                responseText = "Yes, Aditya builds powerful **eCommerce** websites and seamlessly integrates **Payment Gateways** (like Razorpay, Stripe) so you can sell products and accept online payments securely. (Add-on starts at ₹8,000)";
            }
            // Tech Stack (11, 52)
            else if (lowerQ.includes("technologies") || lowerQ.includes("tech") || lowerQ.includes("language") || lowerQ.includes("code")) {
                responseText = "Aditya utilizes modern, industry-standard technologies including **HTML5, CSS3, JavaScript (React/Node.js), PHP, and SQL databases**, ensuring a robust and secure foundation.";
            }
            // Security & Backups (14, 19)
            else if (lowerQ.includes("security") || lowerQ.includes("secure") || lowerQ.includes("backup") || lowerQ.includes("hack")) {
                responseText = "Yes! All websites include **SSL Certificates**, strict form validation to prevent spam, and secure server architectures. Regular automated **Website Backups** are included in the maintenance plans.";
            }
            // API Integrations (34)
            else if (lowerQ.includes("api") || lowerQ.includes("integrate")) {
                responseText = "Yes, Aditya can integrate complex third-party **APIs** into your web application, such as CRM systems, mapping tools, or specific payment gateways to enhance your site's functionality.";
            }
            // Self-updating / CMS (9)
            else if (lowerQ.includes("update myself") || lowerQ.includes("cms") || lowerQ.includes("edit myself")) {
                responseText = "Yes! If requested, Aditya can integrate an easy-to-use **Admin Dashboard** so you can quickly update text, images, or blog posts without needing any coding knowledge.";
            }
            // Browsers (18)
            else if (lowerQ.includes("browser") || lowerQ.includes("chrome") || lowerQ.includes("safari")) {
                responseText = "Yes, your website is guaranteed to be **cross-browser compatible**, meaning it will function perfectly on Google Chrome, Safari, Firefox, Edge, and others.";
            }
            // Remote / International / Worldwide (27, 61)
            else if (lowerQ.includes("remote") || lowerQ.includes("international") || lowerQ.includes("worldwide") || lowerQ.includes("country")) {
                responseText = "Yes, Aditya works **worldwide**! Project communication, testing, and deployment are done 100% online through email, WhatsApp, or video calls with international clients across the globe.";
            }
            // Freelance / Contracts / Startups / Industries (23, 24, 66)
            else if (lowerQ.includes("freelance") || lowerQ.includes("contract") || lowerQ.includes("startup") || lowerQ.includes("industry")) {
                responseText = "Yes, Aditya takes on **freelance contracts** and works with clients ranging from brand-new **startups** to established businesses across all industries (healthcare, tech, retail, etc).";
            }
            // Why hire pro / Difference (21, 30)
            else if (lowerQ.includes("why hire") || lowerQ.includes("different") || lowerQ.includes("professional")) {
                responseText = "Hiring a professional guarantees a fast, secure, and uniquely branded website that actually converts visitors into customers, unlike slow, generic drag-and-drop templates.";
            }
            // Source Code (28)
            else if (lowerQ.includes("source code") || lowerQ.includes("ownership")) {
                responseText = "Yes! Upon final completion and payment, you gain **100% full ownership** of the website and access to your source code. You are never locked in.";
            }
            // Communication & Progress (26, 50)
            else if (lowerQ.includes("communicate") || lowerQ.includes("track") || lowerQ.includes("progress")) {
                responseText = "You are never left in the dark! Private development links are shared so you can **track the progress live** as your site is being built, and communication remains open via WhatsApp or Email.";
            }
            // Previous Work / Portfolio (42)
            else if (lowerQ.includes("previous work") || lowerQ.includes("portfolio")) {
                responseText = "You can view Aditya's past projects by browsing through the **Portfolio / Work section** right here on this website!";
            }
            // Working Hours (60)
            else if (lowerQ.includes("hour") || lowerQ.includes("time zone") || lowerQ.includes("timing")) {
                responseText = "Normal working hours are **10:00 AM to 7:00 PM (IST)**, Monday to Saturday. However, emergency server support is provided 24/7 if you are on a maintenance plan.";
            }
            // What do you need from me / How to start? / Consultation (41, 54, 63, 70, 25)
            else if (lowerQ.includes("need from me") || lowerQ.includes("require") || lowerQ.includes("process") || lowerQ.includes("get started") || lowerQ.includes("consultation")) {
                responseText = "To get started, we do a **free consultation** to discuss your needs. All Aditya needs from you is your business logo and basic text—he handles the entire design and coding process!";
            }
            // Chatbot questions / AI (20, 53)
            else if (lowerQ.includes("chatbot") || lowerQ.includes("ai features") || lowerQ.includes("add ai")) {
                responseText = "Yes! You can add an intelligent AI feature or a Chatbot (just like me!) to your website to instantly answer customer questions automatically. Prices for bots start at just **₹2,500**.";
            }
            // Contact (37, 59)
            else if (lowerQ.includes("contact") || lowerQ.includes("phone") || lowerQ.includes("email") || lowerQ.includes("hire") || lowerQ.includes("reach") || lowerQ.includes("call") || lowerQ.includes("support")) {
                responseText = "Ready to start? You can email Aditya at **01adityanegi@gmail.com** or call/WhatsApp him directly at **+91 88594 32652**!";
            }
            // Location (55, 58)
            else if (lowerQ.includes("where") || lowerQ.includes("location") || lowerQ.includes("almora") || lowerQ.includes("based")) {
                responseText = "Aditya is based in **Almora, Uttarakhand**, but he builds websites for clients all over the world! Everything is done seamlessly online. 🌍";
            }
            // Thanks / Bye
            else if (lowerQ.match(/\b(thanks|thank you|bye|goodbye)\b/)) {
                responseText = "You're very welcome! Feel free to reach out to Aditya when you're ready to start your project. 👋";
            }

            // Render text
            let formatted = responseText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            document.getElementById('msg-' + id).innerHTML = formatted;

            scrollToBottom();

            isWaitingForAI = false;
            showMainOptions();
        }, 800);
    }

});
