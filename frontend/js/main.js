window.currentLanguage = "English";

document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 50) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Dark Mode Toggle
    const html = document.documentElement;
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const mobileDarkModeBtn = document.getElementById('mobile-dark-mode-btn');
    
    const toggleDarkMode = () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        darkModeBtn.textContent = isDark ? '☀️' : '🌙';
        mobileDarkModeBtn.textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    if (localStorage.getItem('theme') === 'dark') { toggleDarkMode(); }

    if(darkModeBtn) darkModeBtn.addEventListener('click', toggleDarkMode);
    if(mobileDarkModeBtn) mobileDarkModeBtn.addEventListener('click', toggleDarkMode);

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
        });
    }

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        });
    });

    // Language Selector
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    if(langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
        document.addEventListener('click', () => langDropdown.classList.remove('active'));

        langDropdown.querySelectorAll('a').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.preventDefault();
                const langName = e.target.getAttribute('data-lang');
                window.currentLanguage = langName;
                langBtn.innerHTML = e.target.textContent.split(' ')[0] + ' ' + langName.substring(0,2).toUpperCase() + ' ▼';
                langDropdown.classList.remove('active');
            });
        });
    }

    // Chat Panel Toggle
    const chatFab = document.getElementById('chat-fab');
    const chatPanel = document.getElementById('chat-panel');
    const closeChat = document.getElementById('close-chat');
    const heroChatBtn = document.getElementById('hero-chat-btn');
    const userInput = document.getElementById('user-input');

    const openChat = () => {
        chatPanel.classList.add('active');
        setTimeout(() => userInput.focus(), 300);
    };

    const toggleChat = () => {
        chatPanel.classList.toggle('active');
        if (chatPanel.classList.contains('active')) {
            setTimeout(() => userInput.focus(), 300);
        }
    };

    if(chatFab) chatFab.addEventListener('click', toggleChat);
    if(closeChat) closeChat.addEventListener('click', () => chatPanel.classList.remove('active'));
    if(heroChatBtn) heroChatBtn.addEventListener('click', (e) => { e.preventDefault(); openChat(); });

    // Chat API Logic
    const chatBox = document.getElementById('chat-box');
    const sendBtn = document.getElementById('send-btn');
    
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8000' : 'https://votewise-backend-74clgpdhmq-uc.a.run.app';
    const API_URL = `${API_BASE_URL}/api/v1/chat/`;

    const createMessage = (sender, text) => {
        const div = document.createElement('div');
        div.className = `message ${sender}-message fade-in-up`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';

        const bubbleContainer = document.createElement('div');
        bubbleContainer.className = 'bubble-container';
        
        const bubble = document.createElement('div');
        bubble.className = `bubble ${sender === 'system' ? 'glass' : ''}`;
        
        // Simple markdown parsing
        bubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        bubbleContainer.appendChild(bubble);
        div.appendChild(avatar);
        div.appendChild(bubbleContainer);
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
        return bubble;
    };

    const addTypingIndicator = () => {
        const div = document.createElement('div');
        div.className = `message system-message fade-in-up`;
        div.id = 'typing-indicator';
        div.innerHTML = `<div class="avatar">🤖</div><div class="bubble-container"><div class="bubble glass"><div class="typing"><span></span><span></span><span></span></div></div></div>`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const typeEffect = (element, text) => {
        element.innerHTML = '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        let i = 0;
        const textNodes = Array.from(tempDiv.childNodes);
        
        // Fast instant display for better UX since streaming isn't fully supported on backend yet
        element.innerHTML = tempDiv.innerHTML;
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const sendMessage = async () => {
        const text = userInput.value.trim();
        if (!text) return;

        createMessage('user', text);
        userInput.value = '';
        sendBtn.disabled = true;
        
        addTypingIndicator();

        let attempts = 0;
        const maxAttempts = 2;
        let success = false;

        while(attempts < maxAttempts && !success) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, language: window.currentLanguage })
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                document.getElementById('typing-indicator')?.remove();
                
                const bubble = createMessage('system', '');
                typeEffect(bubble, data.reply);
                success = true;
            } catch (error) {
                attempts++;
                if (attempts >= maxAttempts) {
                    console.error("Chat Error:", error);
                    document.getElementById('typing-indicator')?.remove();
                    createMessage('system', "⚠️ Service unavailable. Please try again later.");
                }
            }
        }
        
        sendBtn.disabled = false;
        userInput.focus();
    };

    if(sendBtn) sendBtn.addEventListener('click', sendMessage);
    if(userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !sendBtn.disabled) sendMessage();
        });
    }
});
