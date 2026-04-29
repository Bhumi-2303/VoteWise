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
                const text = e.target.textContent;
                const flag = text.split(' ')[0];
                const code = text.split(' ')[1].substring(0, 2).toUpperCase();
                langBtn.innerHTML = `${flag} ${code} ▼`;
                langDropdown.classList.remove('active');
            });
        });
    }

    // 2. Chat Interface Logic
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // API endpoint for FastAPI backend
    const API_URL = 'http://localhost:8000/api/v1/chat/';

    if (chatBox && userInput && sendBtn) {
        
        // Helper to create basic message DOM structure
        const createMessageElement = (sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}-message`;
            
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.textContent = sender === 'user' ? '👤' : '🤖';

            const bubbleContainer = document.createElement('div');
            bubbleContainer.className = 'bubble-container';

            const bubble = document.createElement('div');
            bubble.className = 'bubble';

            bubbleContainer.appendChild(bubble);
            msgDiv.appendChild(avatar);
            msgDiv.appendChild(bubbleContainer);
            
            return { msgDiv, bubble, bubbleContainer };
        };

        // Add a message directly to chat
        const addMessage = (text, sender) => {
            const { msgDiv, bubble, bubbleContainer } = createMessageElement(sender);
            
            // Basic markdown formatting for bold and newlines
            let formattedText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            bubble.innerHTML = formattedText;

            // Add Copy Button for AI responses
            if (sender === 'system') {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'message-actions';
                
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.innerHTML = '📋 Copy Response';
                
                // Copy raw text (not HTML)
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(text);
                    copyBtn.innerHTML = '✅ Copied!';
                    copyBtn.style.color = 'var(--primary)';
                    setTimeout(() => {
                        copyBtn.innerHTML = '📋 Copy Response';
                        copyBtn.style.color = 'var(--text-muted)';
                    }, 2000);
                };
                
                // Text to Speech Button
                const speakBtn = document.createElement('button');
                speakBtn.className = 'copy-btn speak-btn';
                speakBtn.innerHTML = '🔊 Listen';
                speakBtn.setAttribute('aria-label', 'Read response aloud');
                speakBtn.onclick = () => {
                    if (window.speechSynthesis) {
                        window.speechSynthesis.cancel(); // Stop current speech
                        const utterance = new SpeechSynthesisUtterance(text);
                        window.speechSynthesis.speak(utterance);
                    } else {
                        alert("Text-to-speech is not supported in your browser.");
                    }
                };
                
                actionsDiv.appendChild(copyBtn);
                actionsDiv.appendChild(speakBtn);
                bubbleContainer.appendChild(actionsDiv);
            }

            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
            return msgDiv;
        };

        // Loading animation logic
        const addLoadingIndicator = () => {
            const { msgDiv, bubble } = createMessageElement('system');
            bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            msgDiv.id = 'loading-indicator';
            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        const removeLoadingIndicator = () => {
            const indicator = document.getElementById('loading-indicator');
            if (indicator) {
                indicator.remove();
            }
        };

        // Simulates a smooth fade-in typing effect
        const typeEffect = (element, text, bubbleContainer) => {
            element.innerHTML = '';
            
            // Temporary div to parse markdown correctly before displaying
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            element.innerHTML = tempDiv.innerHTML;
            element.style.opacity = '0';
            
            let opacity = 0;
            const fadeIn = setInterval(() => {
                opacity += 0.1;
                element.style.opacity = opacity.toString();
                chatBox.scrollTop = chatBox.scrollHeight;
                if (opacity >= 1) clearInterval(fadeIn);
            }, 30);
            
            // Append copy button after text is injected
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '📋 Copy Response';
            
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(text);
                copyBtn.innerHTML = '✅ Copied!';
                copyBtn.style.color = 'var(--primary)';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋 Copy Response';
                    copyBtn.style.color = 'var(--text-muted)';
                }, 2000);
            };

            const speakBtn = document.createElement('button');
            speakBtn.className = 'copy-btn speak-btn';
            speakBtn.innerHTML = '🔊 Listen';
            speakBtn.setAttribute('aria-label', 'Read response aloud');
            speakBtn.onclick = () => {
                if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(text);
                    window.speechSynthesis.speak(utterance);
                }
            };
            
            actionsDiv.appendChild(copyBtn);
            actionsDiv.appendChild(speakBtn);
            bubbleContainer.appendChild(actionsDiv);
        };

        // Core Send Message Logic
        const sendMessage = async () => {
            const text = userInput.value.trim();
            if (!text) return;

            // Display user's query
            addMessage(text, 'user');
            userInput.value = '';
            sendBtn.disabled = true;

            // Show loading dots
            addLoadingIndicator();

            try {
                let apiMessage = text;
                // Append beginner mode instruction if active
                if (window.isBeginnerMode) {
                    apiMessage = text + " (Please explain this very simply, as if I am a beginner learning about elections for the first time. Keep it easy to understand.)";
                }

                // Connect to FastAPI Backend
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: apiMessage })
                });

                removeLoadingIndicator();

                if (!response.ok) {
                    throw new Error(`Server Error: ${response.status}`);
                }

                const data = await response.json();
                
                // Render AI response with typing effect
                const { msgDiv, bubble, bubbleContainer } = createMessageElement('system');
                chatBox.appendChild(msgDiv);
                typeEffect(bubble, data.reply, bubbleContainer);

            } catch (error) {
                console.error("Error communicating with backend:", error);
                removeLoadingIndicator();
                addMessage("⚠️ I'm currently having trouble connecting to my servers. Please make sure the backend is running and try again.", 'system');
            } finally {
                sendBtn.disabled = false;
                userInput.focus();
            }
        };

        // Event Listeners
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !sendBtn.disabled) {
                sendMessage();
            }
        });
        
        // Let's modify the initial welcome message to use the bubbleContainer correctly
        const existingWelcome = document.querySelector('.system-message');
        if (existingWelcome) {
            const bubble = existingWelcome.querySelector('.bubble');
            const newContainer = document.createElement('div');
            newContainer.className = 'bubble-container';
            existingWelcome.insertBefore(newContainer, bubble);
            newContainer.appendChild(bubble);
        }
    }

    // 3. Guided Election Flow Logic
    const steps = document.querySelectorAll('.step-card');
    const indicators = document.querySelectorAll('.step-indicator');
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const progressBar = document.getElementById('flow-progress-bar');
    
    if (steps.length > 0 && indicators.length > 0) {
        let currentStep = 1;
        const totalSteps = steps.length;

        const updateFlow = (stepNumber) => {
            // Update cards
            steps.forEach(card => {
                if (parseInt(card.getAttribute('data-step')) === stepNumber) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            // Update indicators
            indicators.forEach(ind => {
                const indStep = parseInt(ind.getAttribute('data-step'));
                if (indStep === stepNumber) {
                    ind.classList.add('active');
                    ind.classList.remove('completed');
                } else if (indStep < stepNumber) {
                    ind.classList.add('completed');
                    ind.classList.remove('active');
                } else {
                    ind.classList.remove('active', 'completed');
                }
            });

            // Update progress bar width
            const percentage = ((stepNumber - 1) / (totalSteps - 1)) * 100;
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }

            // Update buttons
            if (prevBtn) prevBtn.disabled = stepNumber === 1;
            if (nextBtn) nextBtn.disabled = stepNumber === totalSteps;
        };

        // Navigation button listeners
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateFlow(currentStep);
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateFlow(currentStep);
                }
            });
        }

        // Indicator click listeners
        indicators.forEach(ind => {
            ind.addEventListener('click', () => {
                currentStep = parseInt(ind.getAttribute('data-step'));
                updateFlow(currentStep);
            });
        });

        // Expandable details listeners
        const expandBtns = document.querySelectorAll('.expand-btn');
        expandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const details = e.target.previousElementSibling;
                details.classList.toggle('expanded');
                if (details.classList.contains('expanded')) {
                    e.target.innerHTML = 'Read Less ▲';
                } else {
                    e.target.innerHTML = 'Read More ▼';
                }
            });
        });
        
        // Initialize
        updateFlow(currentStep);
    }

    // 4. Scroll Reveal Animation for Timeline
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // 5. Smooth scroll for anchor links
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
