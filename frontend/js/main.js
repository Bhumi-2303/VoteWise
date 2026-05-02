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

    // Chat & API Configuration
    const chatBox = document.getElementById('chat-box');
    const sendBtn = document.getElementById('send-btn');
    
    // Production-safe dynamic API base URL detection
    const API_BASE_URL = window.API_BASE_URL || 
        ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
            ? 'http://localhost:8000' 
            : 'https://votewise-backend-74clgpdhmq-uc.a.run.app');
            
    const CHAT_API_URL = `${API_BASE_URL}/api/v1/chat/`;
    const VERSION_API_URL = `${API_BASE_URL}/api/v1/version`;

    // State
    let isSending = false;
    let chatHistory = JSON.parse(sessionStorage.getItem('chatHistory')) || [];

    // Utility: Native fetch with timeout using AbortController to prevent memory leaks and infinite hanging
    const fetchWithTimeout = async (resource, options = {}) => {
        const { timeout = 8000 } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(resource, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    };

    const safeHTML = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const renderMarkdown = (text) => {
        // Safe HTML escaping then markdown parsing
        let safeText = safeHTML(text);
        return safeText
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    };

    const createMessage = (sender, text, save = true) => {
        const div = document.createElement('div');
        div.className = `message ${sender}-message fade-in-up`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';

        const bubbleContainer = document.createElement('div');
        bubbleContainer.className = 'bubble-container';
        
        const bubble = document.createElement('div');
        bubble.className = `bubble ${sender === 'system' ? 'glass' : ''}`;
        
        bubble.innerHTML = renderMarkdown(text);
        
        bubbleContainer.appendChild(bubble);
        div.appendChild(avatar);
        div.appendChild(bubbleContainer);
        chatBox.appendChild(div);
        
        // Scroll with a tiny delay to ensure rendering completes
        requestAnimationFrame(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        });

        if (save && text.trim() !== '') {
            chatHistory.push({ sender, text });
            sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }

        return bubble;
    };

    // Initialize chat
    const initChat = () => {
        // Clear default welcome message if there is history
        if (chatHistory.length > 0) {
            chatBox.innerHTML = '';
            chatHistory.forEach(msg => createMessage(msg.sender, msg.text, false));
        }
    };
    initChat();

    const addTypingIndicator = () => {
        const div = document.createElement('div');
        div.className = `message system-message fade-in-up`;
        div.id = 'typing-indicator';
        div.innerHTML = `<div class="avatar">🤖</div><div class="bubble-container"><div class="bubble glass"><div class="typing"><span></span><span></span><span></span></div></div></div>`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const sendMessage = async (retryText = null) => {
        if (isSending) return; // Prevent race conditions & duplicate messages
        
        const text = retryText || userInput.value.trim();
        if (!text) return;

        if (!retryText) {
            createMessage('user', text);
            userInput.value = '';
        }

        isSending = true;
        sendBtn.disabled = true;
        userInput.disabled = true; // Prevent input while sending for mobile
        
        addTypingIndicator();

        let attempts = 0;
        const maxAttempts = 2;
        let success = false;

        while (attempts < maxAttempts && !success) {
            try {
                // Using fetchWithTimeout to prevent UI freeze
                const response = await fetchWithTimeout(CHAT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, language: window.currentLanguage }),
                    timeout: 15000 // 15 seconds max for chat response
                });

                if (!response.ok) {
                    let errMsg = `HTTP ${response.status}`;
                    try {
                        const errData = await response.json();
                        if (errData.message) errMsg = errData.message;
                    } catch (e) { /* Non-JSON response */ }
                    throw new Error(errMsg);
                }
                
                const data = await response.json();
                document.getElementById('typing-indicator')?.remove();
                
                createMessage('system', data.reply, true);
                success = true;
            } catch (error) {
                attempts++;
                if (attempts >= maxAttempts) {
                    if (window.console && console.error) {
                        console.error("Chat API Error:", error.message || error);
                    }
                    document.getElementById('typing-indicator')?.remove();
                    
                    // Create fallback message with retry button
                    const fallbackText = `⚠️ **Connection Error:** Our AI backend is unreachable. Please try again.`;
                    const bubble = createMessage('system', fallbackText, false);
                    
                    const retryBtn = document.createElement('button');
                    retryBtn.className = 'btn-primary retry-btn';
                    retryBtn.style.marginTop = '10px';
                    retryBtn.style.padding = '5px 10px';
                    retryBtn.style.fontSize = '0.8rem';
                    retryBtn.textContent = 'Retry Message';
                    retryBtn.onclick = () => {
                        bubble.parentElement.parentElement.remove(); // Remove error message
                        sendMessage(text); // Retry
                    };
                    bubble.appendChild(retryBtn);
                    chatBox.scrollTop = chatBox.scrollHeight;
                } else {
                    // Exponential backoff before retry (1s, 2s, ...)
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                }
            }
        }
        
        isSending = false;
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    };

    if (sendBtn) sendBtn.addEventListener('click', () => sendMessage());
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !sendBtn.disabled) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Health Check & Version Fetch System
    const versionDisplay = document.getElementById('backend-version-display');
    
    const updateHealthUI = (state, data = null) => {
        if (!versionDisplay) return;
        
        if (state === 'connected' && data) {
            versionDisplay.innerHTML = `v${data.version || 'Unknown'} <span style="color: #10b981;">(Connected 🟢)</span>`;
        } else if (state === 'degraded' && data) {
            versionDisplay.innerHTML = `v${data.version || 'Unknown'} <span style="color: #f59e0b;">(Degraded 🟡)</span>`;
        } else if (state === 'offline') {
            versionDisplay.innerHTML = `<span style="color: #ef4444;">Offline 🔴</span>`;
        }
    };

    const initializeHealthCheck = async () => {
        let attempts = 0;
        const maxRetries = 3;
        const baseDelay = 1000;

        while (attempts < maxRetries) {
            try {
                const startTime = performance.now();
                // 5 seconds timeout for health check
                const response = await fetchWithTimeout(VERSION_API_URL, { timeout: 5000 });
                
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                
                const data = await response.json();
                const duration = performance.now() - startTime;
                
                if (duration > 2000 || attempts > 0) {
                    updateHealthUI('degraded', data);
                } else {
                    updateHealthUI('connected', data);
                }
                
                if (window.console && console.info) {
                    console.info('Backend connected successfully.');
                }
                return; // Success, exit
                
            } catch (error) {
                attempts++;
                if (window.console && console.warn) {
                    console.warn(`Health check attempt ${attempts} failed:`, error.message || error);
                }
                
                if (attempts >= maxRetries) {
                    updateHealthUI('offline');
                    return;
                }
                
                // Exponential backoff
                const delay = baseDelay * Math.pow(2, attempts - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    if (versionDisplay) {
        initializeHealthCheck();
    }
});
