// Main JavaScript for VoteWise AI Landing Page

document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Selector Toggle Logic
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');

    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (langDropdown.classList.contains('active')) {
                langDropdown.classList.remove('active');
            }
        });

        // Handle language selection (UI Update Only)
        const langOptions = langDropdown.querySelectorAll('a');
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                // Update button text to selected language flag & code
                const text = e.target.textContent;
                const flag = text.split(' ')[0];
                const code = text.split(' ')[1].substring(0, 2).toUpperCase();
                langBtn.innerHTML = `${flag} ${code} ▼`;
                langDropdown.classList.remove('active');
            });
        });
    }

    // 2. Chat Interface Logic (Frontend Mockup)
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    if (chatBox && userInput && sendBtn) {
        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}-message`;
            
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.textContent = sender === 'user' ? '👤' : '🤖';

            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.textContent = text;

            msgDiv.appendChild(avatar);
            msgDiv.appendChild(bubble);

            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        const sendMessage = () => {
            const text = userInput.value.trim();
            if (!text) return;

            // Add user message to UI
            addMessage(text, 'user');
            userInput.value = '';

            // Simulate AI typing and responding (Frontend only for now)
            setTimeout(() => {
                addMessage("I am the VoteWise AI assistant. My backend is currently being connected, but soon I'll be able to provide detailed, unbiased answers regarding your local elections, voting rights, and more!", 'system');
            }, 800);
        };

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // 3. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
