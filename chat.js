document.addEventListener('DOMContentLoaded', function() {
    window.chats = [
        { id: 1, ownerName: 'Jack', dogName: 'Max', lastMessage: 'How is Max doing today?', time: '10:30 AM', unread: 2, profilePic: '👤', rating: 4 },
        { id: 2, ownerName: 'Emma', dogName: 'Bella', lastMessage: 'Bella loves the park you recommended!', time: 'Yesterday', unread: 0, profilePic: '👤', rating: 5 },
        { id: 3, ownerName: 'Michael', dogName: 'Charlie', lastMessage: 'Can Charlie join us for the playdate?', time: 'Yesterday', unread: 1, profilePic: '👤', rating: 0 },
        { id: 4, ownerName: 'Sophia', dogName: 'Luna', lastMessage: 'Luna is feeling much better now', time: 'Monday', unread: 0, profilePic: '👤', rating: 3 },
        { id: 5, ownerName: 'Noah', dogName: 'Cooper', lastMessage: 'Thanks for the training tips!', time: 'Sunday', unread: 0, profilePic: '👤', rating: 0 }
    ];

    const conversations = {
        1: [
            { sender: 'Jack', message: 'Hey there! How is Max doing today?', time: '10:30 AM', sent: false },
            { sender: 'You', message: 'He\'s doing great! We went for a long walk this morning.', time: '10:32 AM', sent: true },
            { sender: 'Jack', message: 'That\'s awesome! Max loves walks.', time: '10:33 AM', sent: false },
            { sender: 'You', message: 'Yes, he was so excited! How\'s your day going?', time: '10:35 AM', sent: true }
        ]
    };

    const chatList = document.getElementById('chatList');
    const noChatSelected = document.getElementById('noChatSelected');
    const activeChat = document.getElementById('activeChat');
    const chatName = document.getElementById('chatName');
    const chatProfilePic = document.getElementById('chatProfilePic');
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const ratingModal = document.getElementById('ratingModal');
    // Ensure rating modal is hidden on page load
    if (ratingModal) {
        ratingModal.style.display = 'none';
    }
    
    const openRatingBtn = document.getElementById('openRatingBtn');
    const submitRatingBtn = document.getElementById('submitRatingBtn');
    const cancelRatingBtn = document.getElementById('cancelRatingBtn');
    const closeRatingModal = document.querySelector('.close-rating-modal');
    const ratingStars = document.querySelectorAll('.rating-star');

    let currentChatId = null;
    let currentRating = 0;

    const chatWith = localStorage.getItem('chatWith');
    const dogName = localStorage.getItem('dogName');

    function createToastContainer() {
        if (document.getElementById('toastContainer')) return;
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    function showToast(message, duration = 3000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    function populateChatList() {
        chatList.innerHTML = '';
        chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.dataset.chatId = chat.id;
            if (currentChatId === chat.id) {
                chatItem.classList.add('active');
            }
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.ownerName)}&background=random`; // Use encodeURIComponent for names with special chars
            const ratingDisplay = chat.rating > 0 ? `<div class="chat-rating">${'★'.repeat(chat.rating)}${'☆'.repeat(5 - chat.rating)}</div>` : '';
            // --- EDIT START ---
            // Structure owner and dog names on separate lines
            chatItem.innerHTML = `
                <div class="profile-pic">
                    <img src="${avatarUrl}" alt="${chat.ownerName}" style="width: 100%; height: 100%; border-radius: 50%;">
                </div>
                <div class="chat-info">
                    <div class="chat-name-line owner-name">
                        <i class="fas fa-user" style="margin-right: 5px; width: 12px; text-align: center;"></i>${chat.ownerName}
                    </div>
                    <div class="chat-name-line dog-name">
                        <i class="fas fa-dog" style="margin-right: 5px; width: 12px; text-align: center;"></i>${chat.dogName}
                    </div>
                    <div class="chat-preview">${chat.lastMessage}</div>
                    ${ratingDisplay}
                </div>
                <!-- EDIT START: Wrap time and badge -->
                <div class="chat-meta">
                    <div class="chat-time">${chat.time}</div>
                    ${chat.unread > 0 ? `<div class="unread-badge">${chat.unread}</div>` : ''}
                </div>
                <!-- EDIT END -->
            `;
            // --- EDIT END ---
            chatItem.addEventListener('click', function () {
                document.querySelectorAll('.chat-item').forEach(item => {
                    item.classList.remove('active');
                });
                chatItem.classList.add('active');
                showChat(chat);
            });
            chatList.appendChild(chatItem);
        });
    }

    function showChat(chat) {
        noChatSelected.style.display = 'none';
        activeChat.style.display = 'flex';
        currentChatId = chat.id;
        // --- EDIT START ---
        // Update chat header name format to match the list (optional, but consistent)
        chatName.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
                <div class="chat-name-line owner-name">
                    <i class="fas fa-user" style="margin-right: 5px; width: 12px; text-align: center;"></i>${chat.ownerName}
                </div>
                <div class="chat-name-line dog-name" style="font-size: 0.9em; color: #555;">
                    <i class="fas fa-dog" style="margin-right: 5px; width: 12px; text-align: center;"></i>${chat.dogName}
                </div>
            </div>
        `;
        // --- EDIT END ---
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.ownerName)}&background=random`;
        chatProfilePic.innerHTML = `<img src="${avatarUrl}" alt="${chat.ownerName}" style="width: 100%; height: 100%; border-radius: 50%;">`;
        loadMessages(chat.id);
    }

    // Add this function before the loadMessages function
    function deleteMessage(chatId, messageIndex) {
        // Add confirmation dialog
        if (!confirm('Are you sure you want to delete this message?')) {
            return; // If user clicks Cancel, stop the deletion
        }
    
        const message = conversations[chatId][messageIndex];
        if (!message) return;
    
        // Add deleting animation class
        const messageDiv = messagesContainer.children[messageIndex];
        messageDiv.classList.add('deleting');
    
        // Remove the message after animation
        setTimeout(() => {
            conversations[chatId].splice(messageIndex, 1);
            loadMessages(chatId);
            showToast('Message deleted');
        }, 300);
    }

    // Update the message creation in loadMessages function
    function loadMessages(chatId) {
        messagesContainer.innerHTML = '';
        if (conversations[chatId]) {
            conversations[chatId].forEach((msg, index) => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.sent ? 'sent' : 'received'}`;
                messageDiv.dataset.index = index;
                messageDiv.innerHTML = `
                    <div class="message-content">${msg.message}</div>
                    <div class="message-time">${msg.time}</div>
                    <div class="message-options">
                        <div class="delete-message">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                    </div>
                `;
                
                // Add click event for the delete icon
                const deleteIcon = messageDiv.querySelector('.delete-message');
                deleteIcon.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent message selection when clicking delete
                    deleteMessage(chatId, index);
                });
                
                // Add click event for message selection
                messageDiv.addEventListener('click', function() {
                    this.classList.toggle('message-selected');
                });
                
                messagesContainer.appendChild(messageDiv);
            });
        }
        // ... rest of the function remains the same
    }

    // Update the sendMessage function to match the new structure
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        const activeChat = document.querySelector('.chat-item.active');
        if (!activeChat) return;
        const chatId = parseInt(activeChat.dataset.chatId);
        if (isNaN(chatId)) return;
        if (!conversations[chatId]) {
            conversations[chatId] = [];
        }
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        const newMessage = {
            sender: 'You',
            message: message,
            time: timeString,
            sent: true
        };
        conversations[chatId].push(newMessage);
        
        // Update to include the delete icon in the new message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.dataset.index = conversations[chatId].length - 1;
        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${timeString}</div>
            <div class="message-options">
                <div class="delete-message">
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>
        `;
        
        // Add click events for the new message
        const deleteIcon = messageDiv.querySelector('.delete-message');
        deleteIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteMessage(chatId, parseInt(messageDiv.dataset.index));
        });
        
        messageDiv.addEventListener('click', function() {
            this.classList.toggle('message-selected');
        });
        
        messagesContainer.appendChild(messageDiv);
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
            chat.lastMessage = message;
            chat.time = 'Just now';
            populateChatList();
        }
        messageInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    if (openRatingBtn) {
        openRatingBtn.addEventListener('click', function () {
            const chat = chats.find(c => c.id === currentChatId);
            if (chat) {
                currentRating = chat.rating || 0;
                updateStarDisplay(currentRating);
                ratingModal.style.display = 'flex';
            }
        });
    }

    if (ratingStars) {
        ratingStars.forEach(star => {
            star.addEventListener('mouseover', function () {
                const value = parseInt(this.dataset.value);
                updateStarDisplay(value);
            });
            star.addEventListener('click', function () {
                currentRating = parseInt(this.dataset.value);
                updateStarDisplay(currentRating);
            });
        });
        const starsContainer = document.getElementById('starsContainer');
        if (starsContainer) {
            starsContainer.addEventListener('mouseleave', function () {
                updateStarDisplay(currentRating);
            });
        }
    }

    function updateStarDisplay(rating) {
        if (ratingStars) {
            ratingStars.forEach(star => {
                const value = parseInt(star.dataset.value);
                if (value <= rating) {
                    star.classList.add('rated');
                    star.style.color = '#ffc107';
                } else {
                    star.classList.remove('rated');
                    star.style.color = '#ccc';
                }
            });
        }
    }

    if (submitRatingBtn) {
        submitRatingBtn.addEventListener('click', function () {
            const review = document.getElementById('ratingReview').value.trim();
            if (currentRating > 0 && currentChatId) {
                const chatIndex = chats.findIndex(chat => chat.id === currentChatId);
                if (chatIndex !== -1) {
                    chats[chatIndex].rating = currentRating;
                    showToast(`Rating submitted: ${currentRating} stars${review ? ' with review!' : ''}`);
                    populateChatList();
                }
                ratingModal.style.display = 'none';
            } else {
                showToast('Please select a rating before submitting');
            }
        });
    }

    if (closeRatingModal) {
        closeRatingModal.addEventListener('click', function () {
            ratingModal.style.display = 'none';
        });
    }

    if (cancelRatingBtn) {
        cancelRatingBtn.addEventListener('click', function () {
            ratingModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function (event) {
        if (event.target === ratingModal) {
            ratingModal.style.display = 'none';
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    createToastContainer();
    populateChatList();

    // Add this near the end of your DOMContentLoaded function
    if (chatWith) {
        const existingChat = chats.find(chat => chat.ownerName === chatWith);
        if (existingChat) {
            // Force select the chat
            const chatItems = document.querySelectorAll('.chat-item');
            chatItems.forEach(item => {
                if (item.querySelector('.owner-name').textContent.includes(chatWith)) {
                    item.click();
                    return;
                }
            });
        }
        else {
            const newChat = {
                id: chats.length + 1,
                ownerName: chatWith,
                dogName: dogName || 'Dog',
                lastMessage: 'Start a conversation',
                time: 'Just now',
                unread: 0,
                profilePic: '👤',
                rating: 0
            };
            chats.unshift(newChat);
            populateChatList();
            const firstChatItem = document.querySelector('.chat-item');
            if (firstChatItem) {
                firstChatItem.click();
            }
        }

        const autoMessage = localStorage.getItem('autoMessage');
        if (autoMessage) {
            messageInput.value = autoMessage;
            messageInput.focus();
           
            localStorage.removeItem('autoMessage');
        }

        localStorage.removeItem('chatWith');
        localStorage.removeItem('dogName');
    } else {
        const firstChatItem = document.querySelector('.chat-item');
        if (firstChatItem) {
            firstChatItem.click();
        }
    }

    // Add at the end of your DOMContentLoaded function
    const locationModal = document.getElementById('locationModal');
    const suggestLocationBtn = document.getElementById('suggestLocationBtn');
    const closeLocationModal = document.querySelector('#locationModal .close-modal');
    const cancelLocationBtn = document.querySelector('#locationModal .cancel-btn');
    const submitLocationBtn = document.querySelector('#locationModal .primary-btn');
    
    if (suggestLocationBtn) {
        suggestLocationBtn.addEventListener('click', function() {
            locationModal.style.display = 'flex';
        });
    }
    
    if (closeLocationModal) {
        closeLocationModal.addEventListener('click', function() {
            locationModal.style.display = 'none';
        });
    }
    
    if (cancelLocationBtn) {
        cancelLocationBtn.addEventListener('click', function() {
            locationModal.style.display = 'none';
        });
    }
    
    if (submitLocationBtn) {
        submitLocationBtn.addEventListener('click', function() {
            // Get the selected location
            const selectedLocation = document.querySelector('.location-item.selected');
            if (selectedLocation) {
                const locationName = selectedLocation.querySelector('.location-name').textContent;
                // Send a message with the selected location
                messageInput.value = `Let's meet at ${locationName}!`;
                sendMessage();
                locationModal.style.display = 'none';
            } else {
                showToast('Please select a location first');
            }
        });
    }
    
    // Add click event to location items
    document.querySelectorAll('.location-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.location-item').forEach(i => {
                i.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === locationModal) {
            locationModal.style.display = 'none';
        }
    });
});

// Update the chat input area HTML structure
const chatInputArea = document.querySelector('.chat-input-area');


// Add styles for the updated layout
const style = document.createElement('style');
style.textContent = `
    .input-actions {
        display: flex;
        gap: 8px;
        padding: 0 10px;
    }
    
    .action-btn {
        background: none;
        border: none;
        color: #6c63ff;
        cursor: pointer;
        font-size: 1.2em;
        padding: 5px;
        transition: color 0.3s ease;
    }
    
    .action-btn:hover {
        color: #5a52d5;
    }
    
    .chat-input-area {
        display: flex;
        align-items: center;
        padding: 10px;
        background: white;
        border-top: 1px solid #eee;
    }
    
    #messageInput {
        flex: 1;
        padding: 8px 15px;
        border: 1px solid #ddd;
        border-radius: 20px;
        margin: 0 10px;
        outline: none;
    }
`;
document.head.appendChild(style);


// Add this function to handle the owner profile modal
// Add this function at the top level of your chat.js file
function showOwnerProfileModal(ownerData) {
    const modal = document.getElementById('ownerProfileModal');
    if (!modal) return;

    modal.classList.add('show');
    
    // Update modal content with owner data
    const ownerName = modal.querySelector('.owner-profile-info h2');
    const experience = modal.querySelector('.stat-value');
    const rating = modal.querySelector('.rating span');
    
    if (ownerName) ownerName.textContent = ownerData.ownerName;
    if (experience) experience.textContent = '2+ years';
    if (rating) rating.textContent = ` ${ownerData.rating || 0}`;

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Close modal when clicking close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }
}

// Update the chat profile click handler
const chatProfileHeader = document.getElementById('chatProfileHeader');
if (chatProfileHeader) {
    chatProfileHeader.addEventListener('click', function() {
        const activeChat = document.querySelector('.chat-item.active');
        if (!activeChat) return;
        const chatId = parseInt(activeChat.dataset.chatId);
        
        const currentChat = chats.find(chat => chat.id === chatId);
        if (!currentChat) return;

        const ownerProfileModal = document.getElementById('ownerProfileModal');
        const ownerPic = ownerProfileModal.querySelector('.owner-profile-pic img');
        const dogPic = ownerProfileModal.querySelector('.dog-profile-pic img');
        const ownerName = ownerProfileModal.querySelector('.owner-info .owner-name');
        const dogName = ownerProfileModal.querySelector('.dog-info .dog-name');
        const ratingStars = ownerProfileModal.querySelectorAll('.rating i');
        const ratingValue = ownerProfileModal.querySelector('.rating-value');

        // Set profile pictures
        ownerPic.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentChat.ownerName)}&background=random`;
        dogPic.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentChat.dogName)}&background=random`;
        
        // Set names
        ownerName.textContent = currentChat.ownerName;
        dogName.textContent = currentChat.dogName;
        
        // Set rating
        const rating = currentChat.rating || 0;
        ratingStars.forEach((star, index) => {
            star.className = index < rating ? 'fas fa-star' : 'far fa-star';
        });
        ratingValue.textContent = rating.toFixed(1);

        // Show modal
        ownerProfileModal.style.display = 'flex';
    });
}

    // Add modal close handlers
    const ownerProfileModal = document.getElementById('ownerProfileModal');
    const closeModalBtn = ownerProfileModal.querySelector('.close-modal');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            ownerProfileModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === ownerProfileModal) {
            ownerProfileModal.style.display = 'none';
        }
    });

   