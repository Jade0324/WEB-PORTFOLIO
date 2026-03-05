document.addEventListener('DOMContentLoaded', () => {
    // === 1. THEME TOGGLE ===
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    // === 2. BANNER POPUP ===
    const bannerWrapper = document.getElementById('banner-wrapper');
    const bannerBtn = document.getElementById('hackathon-btn');
    if (bannerWrapper && bannerBtn) {
        bannerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            bannerWrapper.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!bannerWrapper.contains(e.target)) bannerWrapper.classList.remove('open');
        });
    }

    // === 3. GALLERY SCROLL ===
    const scrollContainer = document.getElementById('gallery-scroll');
    const btnLeft = document.getElementById('scroll-left');
    const btnRight = document.getElementById('scroll-right');
    if (scrollContainer && btnLeft && btnRight) {
        btnLeft.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
        });
        btnRight.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    // === 4. AI CHATBOT FRONTEND LOGIC ===
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const closeChatBtn = document.getElementById('close-chat');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    // Open/Close Chat Window
    if (chatToggleBtn && closeChatBtn && chatWindow) {
        chatToggleBtn.addEventListener('click', () => {
            chatWindow.classList.add('active');
        });

        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
    }

    // Send Message
    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }

    async function handleSendMessage() {
        const userText = chatInput.value.trim();
        if (!userText) return;

        // Clear input field
        chatInput.value = '';

        // Append User's Message
        appendMessage(userText, 'user-message');

        // Append a "Typing..." indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.textContent = 'AI is typing...';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Talk to the Vercel backend file you created (api/chat.js)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userText }) 
            });

            const data = await response.json();
            
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);

            // Display AI response
            if (data.candidates && data.candidates.length > 0) {
                const aiText = data.candidates[0].content.parts[0].text;
                appendMessage(aiText, 'ai-message');
            } else {
                console.error("Backend response format:", data);
                appendMessage("Sorry, I couldn't process that. Try again.", 'ai-message');
            }

        } catch (error) {
            console.error("Frontend Error:", error);
            chatMessages.removeChild(typingIndicator);
            appendMessage("Network error. Chat only works when hosted on Vercel.", 'ai-message');
        }
    }

    function appendMessage(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;
        
        // Simple markdown parsing for bold text
        msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});