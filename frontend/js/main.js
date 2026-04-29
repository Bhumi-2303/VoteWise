// Main JavaScript file for handling UI interactions and API calls

document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Handle sending a message
    const sendMessage = async () => {
        const text = userInput.value.trim();
        if (!text) return;

        // Display user message in UI
        addMessage(text, 'user');
        userInput.value = '';

        try {
            // TODO: Call the FastAPI backend endpoint here
            // const response = await fetch('http://localhost:8000/api/chat', { ... });
            
            // Placeholder response to show UI interactivity
            setTimeout(() => {
                addMessage("This is a placeholder response from VoteWise AI. Connect backend to get real answers!", 'system');
            }, 500);

        } catch (error) {
            console.error("Error communicating with backend:", error);
            addMessage("Sorry, there was an error processing your request.", 'system');
        }
    };

    // Helper to add message to the chat interface
    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
