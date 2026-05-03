// Accessibility features logic

window.isBeginnerMode = false;

document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const darkModeBtn = document.getElementById('dark-mode-btn');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            darkModeBtn.innerHTML = isDark ? '☀️' : '🌙';
            darkModeBtn.classList.toggle('active', isDark);
            darkModeBtn.setAttribute('aria-pressed', isDark);
        });
    }

    // Large Text Toggle
    const largeTextBtn = document.getElementById('large-text-btn');
    if (largeTextBtn) {
        largeTextBtn.addEventListener('click', () => {
            document.body.classList.toggle('large-text');
            const isLarge = document.body.classList.contains('large-text');
            largeTextBtn.classList.toggle('active', isLarge);
            largeTextBtn.setAttribute('aria-pressed', isLarge);
        });
    }

    // Beginner Mode Toggle
    const beginnerModeBtn = document.getElementById('beginner-mode-btn');
    if (beginnerModeBtn) {
        beginnerModeBtn.addEventListener('click', () => {
            window.isBeginnerMode = !window.isBeginnerMode;
            beginnerModeBtn.classList.toggle('active', window.isBeginnerMode);
            beginnerModeBtn.setAttribute('aria-pressed', window.isBeginnerMode);
            
            // Show a brief notification in chat
            const chatBox = document.getElementById('chat-box');
            if (chatBox) {
                const notice = document.createElement('div');
                notice.className = 'message system-message';
                notice.style.width = '100%';
                notice.innerHTML = `<div class="bubble" style="background: var(--primary-light); color: var(--primary-dark); padding: 0.5rem; font-size: 0.85rem; width: fit-content; margin: 0 auto; border: none; text-align: center;">🎓 Beginner Mode is now ${window.isBeginnerMode ? 'ON' : 'OFF'}</div>`;
                chatBox.appendChild(notice);
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        });
    }

    // Speech Recognition for Mic Button
    const micBtn = document.getElementById('mic-btn');
    const userInput = document.getElementById('user-input');
    
    if (micBtn && userInput) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            let isRecording = false;

            recognition.onstart = () => {
                isRecording = true;
                micBtn.classList.add('recording');
                userInput.placeholder = "Listening...";
                micBtn.setAttribute('aria-label', 'Stop Recording');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                userInput.value = transcript;
            };

            recognition.onend = () => {
                isRecording = false;
                micBtn.classList.remove('recording');
                userInput.placeholder = "Ask about voting, elections, etc...";
                micBtn.setAttribute('aria-label', 'Voice Input');
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                isRecording = false;
                micBtn.classList.remove('recording');
                userInput.placeholder = "Ask about voting, elections, etc...";
            };

            micBtn.addEventListener('click', () => {
                if (isRecording) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });
            
            // Keyboard accessibility for mic
            micBtn.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    micBtn.click();
                }
            });
        } else {
            micBtn.style.display = 'none'; // Hide if browser doesn't support
        }
    }
});
