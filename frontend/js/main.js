// Internationalization State
window.currentLocale = localStorage.getItem('locale') || 'en';
window.currentCountry = localStorage.getItem('country') || 'USA';

const COUNTRY_CONFIG = {
    "USA": { flag: "🇺🇸", languages: { "en": "English" } },
    "India": { flag: "🇮🇳", languages: { "en": "English", "hi": "Hindi", "gu": "Gujarati", "ta": "Tamil" } },
    "UK": { flag: "🇬🇧", languages: { "en": "English" } },
    "Canada": { flag: "🇨🇦", languages: { "en": "English", "fr": "French" } }
};

// Global Production Error Handling
window.onerror = (msg, url, line, col, error) => {
    console.error(`[Global Error]: ${msg} at ${url}:${line}:${col}`, error);
    if (window.showToast) window.showToast("An unexpected UI error occurred.", "error");
    return false;
};

window.onunhandledrejection = (event) => {
    console.error("[Unhandled Promise]:", event.reason);
    if (window.showToast) window.showToast("A background task failed.", "error");
};

// Toast Notification System
window.showToast = (message, type = 'info', duration = 4000) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = { info: 'ℹ️', success: '✅', error: '⚠️', warning: '🛜' };
    toast.innerHTML = `<span>${icons[type] || '•'}</span><span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
};

document.addEventListener('DOMContentLoaded', () => {
    try {
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
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
            mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
            mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close Menu' : 'Open Menu');
        });
    }

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            mobileMenuBtn.textContent = '☰';
        });
    });

    // Language Management & Translations
    const applyTranslations = (locale) => {
        if (!window.translations) return; 

        const content = window.translations[locale] || window.translations['en'];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = content[key];
            if (translation) el.innerHTML = translation;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = content[key];
            if (translation) el.setAttribute('placeholder', translation);
        });
        
        document.documentElement.lang = locale;
    };

    window.setLanguage = (locale) => {
        window.currentLocale = locale;
        localStorage.setItem('locale', locale);
        applyTranslations(locale);
        renderSuggestedPrompts();
        updateSelectorUI();
    };

    const updateSelectorUI = () => {
        const flagEl = document.getElementById('current-country-flag');
        const codeEl = document.getElementById('current-lang-code');
        if (flagEl) flagEl.textContent = COUNTRY_CONFIG[window.currentCountry].flag;
        if (codeEl) codeEl.textContent = window.currentLocale.toUpperCase();

        // Update active states in dropdown
        document.querySelectorAll('.country-opt').forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-country') === window.currentCountry);
        });

        const langContainer = document.getElementById('language-options');
        if (langContainer) {
            langContainer.innerHTML = '';
            const langs = COUNTRY_CONFIG[window.currentCountry].languages;
            Object.keys(langs).forEach(code => {
                const btn = document.createElement('button');
                btn.className = `lang-opt ${code === window.currentLocale ? 'active' : ''}`;
                btn.textContent = langs[code];
                btn.onclick = () => window.setLanguage(code);
                langContainer.appendChild(btn);
            });
        }
    };

    const setCountry = (country) => {
        window.currentCountry = country;
        localStorage.setItem('country', country);
        
        // Default to first available language for country if current one isn't supported
        const supportedLangs = COUNTRY_CONFIG[country].languages;
        if (!supportedLangs[window.currentLocale]) {
            window.setLanguage(Object.keys(supportedLangs)[0]);
        } else {
            updateSelectorUI();
        }
    };

    // Auto-detect language on first load
    const detectLocale = () => {
        if (localStorage.getItem('locale')) return;
        
        const browserLang = navigator.language.split('-')[0];
        const supported = ['en', 'hi', 'gu', 'ta', 'fr'];
        if (supported.includes(browserLang)) {
            window.currentLocale = browserLang;
            // Also try to guess country for India/Canada
            if (browserLang === 'hi' || browserLang === 'gu' || browserLang === 'ta') window.currentCountry = 'India';
            if (browserLang === 'fr') window.currentCountry = 'Canada';
        }
    };

    // Language Selector UI
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = langDropdown.classList.toggle('active');
            langBtn.setAttribute('aria-expanded', isOpen);
        });
        document.addEventListener('click', () => {
            langDropdown.classList.remove('active');
            langBtn.setAttribute('aria-expanded', 'false');
        });

        document.querySelectorAll('.country-opt').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                setCountry(e.target.getAttribute('data-country'));
            });
        });
    }

    // Initialize
    detectLocale();
    applyTranslations(window.currentLocale);
    updateSelectorUI();

    // Chat Panel Toggle
    const chatFab = document.getElementById('chat-fab');
    const chatPanel = document.getElementById('chat-panel');
    const closeChat = document.getElementById('close-chat');
    const heroChatBtn = document.getElementById('hero-chat-btn');
    const userInput = document.getElementById('user-input');

    const openChat = () => {
        chatPanel.classList.add('active');
        chatFab.setAttribute('aria-expanded', 'true');
        chatPanel.setAttribute('aria-hidden', 'false');
        setTimeout(() => userInput.focus(), 300);
    };

    // Chat Toggle
    if(chatFab) {
        chatFab.addEventListener('click', () => {
            const isOpen = chatPanel.classList.toggle('active');
            chatFab.setAttribute('aria-expanded', isOpen);
            chatPanel.setAttribute('aria-hidden', !isOpen);
            if (isOpen) {
                userInput.focus();
            }
        });
    }

    const closeChatPanel = () => {
        chatPanel.classList.remove('active');
        chatFab.setAttribute('aria-expanded', 'false');
        chatPanel.setAttribute('aria-hidden', 'true');
        if(chatFab) chatFab.focus();
    };

    if(closeChat) closeChat.addEventListener('click', closeChatPanel);
    if(heroChatBtn) heroChatBtn.addEventListener('click', (e) => { e.preventDefault(); openChat(); });

    const resetBtn = document.getElementById('reset-chat');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Reset chat history?")) {
                sessionStorage.removeItem('chatHistory');
                chatHistory = [];
                chatBox.innerHTML = '';
                // Add initial welcome
                const welcomeMsg = window.translations[window.currentLocale]?.chat_welcome || window.translations['en'].chat_welcome;
                createMessage('system', welcomeMsg, false);
                renderSuggestedPrompts();
                window.showToast("Conversation reset.", "success");
            }
        });
    }

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (chatPanel && chatPanel.classList.contains('active')) {
                closeChatPanel();
            }
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                mobileMenuBtn.focus();
            }
            if (langDropdown && langDropdown.classList.contains('active')) {
                langDropdown.classList.remove('active');
                langBtn.setAttribute('aria-expanded', 'false');
                langBtn.focus();
            }
        }
    });

    // Chat & API Configuration
    const chatBox = document.getElementById('chat-box');
    const sendBtn = document.getElementById('send-btn');
    
    // Production-safe dynamic API base URL detection
    // IMPORTANT: Replace the URL below with your actual deployed backend URL
    const API_BASE_URL = window.API_BASE_URL || 
        ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
            ? 'http://localhost:8000' 
            : 'REPLACE_WITH_YOUR_BACKEND_URL'); // e.g., 'https://votewise-backend-xyz.a.run.app'
            
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

    const renderSuggestedPrompts = () => {
        const container = document.getElementById('suggested-prompts');
        if (!container) return;

        if (chatHistory.length > 0) {
            container.classList.add('hidden');
            return;
        }

        container.innerHTML = '';
        container.classList.remove('hidden');

        const promptKeys = ['prompt_next_election', 'prompt_register', 'prompt_candidates', 'prompt_id'];
        promptKeys.forEach(key => {
            const text = window.translations[window.currentLocale]?.[key] || window.translations['en'][key];
            if (!text) return;

            const chip = document.createElement('button');
            chip.className = 'prompt-chip fade-in-up';
            chip.textContent = text;
            chip.onclick = () => {
                userInput.value = text;
                sendMessage();
            };
            container.appendChild(chip);
        });
    };

    // Initialize chat
    const initChat = () => {
        // Clear default welcome message if there is history
        if (chatHistory.length > 0) {
            chatBox.innerHTML = '';
            chatHistory.forEach(msg => createMessage(msg.sender, msg.text, false));
        }
        renderSuggestedPrompts();
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
        
        // Hide suggested prompts once interaction starts
        document.getElementById('suggested-prompts')?.classList.add('hidden');
        
        addTypingIndicator();

        let attempts = 0;
        const maxAttempts = 2;
        let success = false;

        while (attempts < maxAttempts && !success) {
            try {
                // Map internal history to API format (role: user/assistant)
                const localeMap = { "English": "en", "Hindi": "hi", "Gujarati": "gu" };
                const apiMessages = chatHistory.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                }));

                // Using fetchWithTimeout to prevent UI freeze
                const response = await fetchWithTimeout(CHAT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        messages: apiMessages, 
                        locale: window.currentLocale 
                    }),
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
                    const fallbackText = `⚠️ Something went wrong. Please try again.`;
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
            versionDisplay.innerHTML = `<span style="color: #ef4444;">Offline 🔴</span> <a href="#" id="retry-health" style="margin-left: 5px; text-decoration: underline; color: var(--primary);">Retry</a>`;
            const retryLink = document.getElementById('retry-health');
            if (retryLink) {
                retryLink.onclick = (e) => {
                    e.preventDefault();
                    versionDisplay.textContent = 'Retrying...';
                    initializeHealthCheck();
                };
            }
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

    // Candidate Comparison AI Feature
    const compareBtn = document.getElementById('compare-btn');
    const c1Input = document.getElementById('candidate-1');
    const c2Input = document.getElementById('candidate-2');
    const compResults = document.getElementById('comparison-results');
    const compSkeleton = document.getElementById('comparison-skeleton');

    if (compareBtn) {
        compareBtn.addEventListener('click', async () => {
            const c1 = c1Input.value.trim();
            const c2 = c2Input.value.trim();

            if (!c1 || !c2) {
                window.showToast("Please enter names for both candidates.", "warning");
                return;
            }

            compareBtn.disabled = true;
            compResults.classList.add('hidden');
            compSkeleton.classList.remove('hidden');
            compResults.innerHTML = '';

            try {
                const response = await fetchWithTimeout(`${API_BASE_URL}/api/v1/compare/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ candidate1: c1, candidate2: c2, locale: window.currentLocale }),
                    timeout: 25000 // Comparison takes longer
                });

                if (!response.ok) throw new Error("Failed to fetch comparison.");

                const data = await response.json();
                
                // Construct Grid
                let gridHtml = `<div class="comparison-grid">`;
                data.comparison.forEach(item => {
                    gridHtml += `
                        <div class="comparison-card fade-in-up">
                            <div class="comp-point c1">${item.c1}</div>
                            <div class="category-name">${item.category}</div>
                            <div class="comp-point c2">${item.c2}</div>
                        </div>
                    `;
                });
                gridHtml += `</div>`;
                
                // Add Summary and Share
                const summaryHtml = `
                    <div class="comparison-summary fade-in-up">
                        <p>${data.summary}</p>
                    </div>
                    <div style="text-align: center; margin-top: 1.5rem;">
                        <button class="btn btn-secondary glass-btn" id="share-comp">📋 Copy Comparison</button>
                    </div>
                `;

                compResults.innerHTML = gridHtml + summaryHtml;
                
                document.getElementById('share-comp').onclick = () => {
                    const text = data.comparison.map(i => `${i.category}\n${c1}: ${i.c1}\n${c2}: ${i.c2}`).join('\n\n');
                    navigator.clipboard.writeText(text);
                    window.showToast("Comparison copied to clipboard!", "success");
                };

                compResults.classList.remove('hidden');
            } catch (err) {
                console.error(err);
                window.showToast("AI Comparison failed. Please try again.", "error");
            } finally {
                compSkeleton.classList.add('hidden');
                compareBtn.disabled = false;
                // Scroll to results
                requestAnimationFrame(() => {
                    compResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                });
            }
        });
    }

    // Election Lookup Feature
    const lookupBtn = document.getElementById('lookup-btn');
    const lookupAddress = document.getElementById('lookup-address');
    const lookupResults = document.getElementById('lookup-results');
    const lookupSkeleton = document.getElementById('lookup-skeleton');
    const electionList = document.getElementById('election-list');
    const repList = document.getElementById('rep-list');

    if (lookupBtn) {
        lookupBtn.addEventListener('click', async () => {
            const address = lookupAddress.value.trim();
            if (!address) {
                window.showToast("Please enter a ZIP code or address.", "warning");
                return;
            }

            lookupBtn.disabled = true;
            lookupResults.classList.add('hidden');
            lookupSkeleton.classList.remove('hidden');
            electionList.innerHTML = '';
            repList.innerHTML = '';

            try {
                const response = await fetchWithTimeout(`${API_BASE_URL}/api/v1/lookup/?address=${encodeURIComponent(address)}`, {
                    timeout: 15000
                });

                if (!response.ok) throw new Error("Lookup failed.");

                const data = await response.json();

                if (data.elections && data.elections.length > 0) {
                    data.elections.forEach(e => {
                        const card = document.createElement('div');
                        card.className = 'lookup-card fade-in-up';
                        card.innerHTML = `
                            <div>
                                <div class="card-title">${e.name}</div>
                                <div class="card-subtitle">Election Day: ${e.date || 'TBD'}</div>
                            </div>
                            <div class="card-meta">Official Election</div>
                        `;
                        electionList.appendChild(card);
                    });
                } else {
                    electionList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No upcoming elections found for this area.</p>';
                }

                if (data.representatives && data.representatives.length > 0) {
                    data.representatives.forEach(r => {
                        const card = document.createElement('div');
                        card.className = 'lookup-card fade-in-up';
                        card.innerHTML = `
                            <div>
                                <div class="card-title">${r.name}</div>
                                <div class="card-subtitle">${r.title}</div>
                            </div>
                            <div class="card-meta">${r.party || 'Independent'}</div>
                        `;
                        repList.appendChild(card);
                    });
                }

                lookupResults.classList.remove('hidden');
                if (data.is_demo) {
                    window.showToast("Note: Using sample data (API Key not configured).", "info");
                }
            } catch (err) {
                console.error(err);
                window.showToast("Failed to find election data. Please check your ZIP code.", "error");
            } finally {
                lookupSkeleton.classList.add('hidden');
                lookupBtn.disabled = false;
                requestAnimationFrame(() => {
                    lookupResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                });
            }
        });
    }

    if (versionDisplay) {
        initializeHealthCheck();
    }

    // Offline/Online Detection
    window.addEventListener('online', () => window.showToast('Connection restored.', 'success'));
    window.addEventListener('offline', () => window.showToast('You are currently offline.', 'warning'));

    } catch (criticalError) {
        console.error("[Critical Initialization Error]:", criticalError);
        // Fallback for extreme cases
        const footer = document.querySelector('.footer');
        if (footer) footer.innerHTML += '<p style="color: #ef4444; font-size: 0.7rem;">Application load failed. Please refresh.</p>';
    }
});
