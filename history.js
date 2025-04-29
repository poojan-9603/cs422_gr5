document.addEventListener('DOMContentLoaded', function() {
    const historyList = document.getElementById('historyList');
    const noHistory = document.getElementById('noHistory');
    const clearHistoryBtn = document.getElementById('clearHistory');

    function loadViewedDogs() {
        const saved = localStorage.getItem('viewedDogs');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error parsing viewed dogs:', e);
                return [];
            }
        }
        return [];
    }

    function saveViewedDogs(viewedDogs) {
        localStorage.setItem('viewedDogs', JSON.stringify(viewedDogs));
    }

    function deleteHistoryItem(dogId) {
        const viewedDogs = loadViewedDogs();
        const updatedDogs = viewedDogs.filter(dog => dog.id !== dogId);
        saveViewedDogs(updatedDogs);
        displayHistory();
    }

    function displayHistory() {
        const viewedDogs = loadViewedDogs();
        
        // Clear existing history items first
        while (historyList.firstChild) {
            historyList.removeChild(historyList.firstChild);
        }
        
        // Add no history element back
        historyList.appendChild(noHistory);
        
        if (viewedDogs.length === 0) {
            noHistory.style.display = 'flex';
            return;
        }

        noHistory.style.display = 'none';

        viewedDogs.slice().reverse().forEach(dog => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const dogImageUrl = `https://dog.ceo/api/breed/${dog.breed.toLowerCase().replace(' ', '/')}/images/random`;

            historyItem.innerHTML = `
                <div class="history-item-left">
                    <div class="dog-pic">
                        <img src="${dogImageUrl}" 
                             onerror="this.onerror=null;this.src='https://dog.ceo/api/breed/retriever/golden/images/random';" 
                             alt="${dog.name}">
                    </div>
                    <div class="history-info">
                        <div class="dog-name">${dog.name}</div>
                        <div class="dog-breed">${dog.breed}</div>
                        <div class="owner-name">Owner: ${dog.ownerName}</div>
                    </div>
                </div>
                <div class="history-item-right">
                    <button class="view-profile-btn" data-id="${dog.id}">View Profile</button>
                    <button class="message-owner-btn" data-owner="${dog.ownerName}" data-dog="${dog.name}">Message</button>
                    <button class="delete-item-btn view-profile-btn" data-id="${dog.id}">Remove</button>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });

        // Add event listeners to buttons
        addButtonEventListeners();
    }

    function addButtonEventListeners() {
        // View profile button events
        document.querySelectorAll('.view-profile-btn').forEach(btn => {
            if (!btn.classList.contains('delete-item-btn')) {
                btn.addEventListener('click', function() {
                    const dogId = parseInt(this.dataset.id);
                    localStorage.setItem('viewDogId', dogId);
                    window.location.href = 'index.html';
                });
            }
        });

        // Message button events
        document.querySelectorAll('.message-owner-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ownerName = this.dataset.owner;
                const dogName = this.dataset.dog;
                localStorage.setItem('chatWith', ownerName);
                localStorage.setItem('dogName', dogName);
                window.location.href = 'chat.html';
            });
        });

        // Delete individual item button events
        document.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const dogId = parseInt(this.dataset.id);
                deleteHistoryItem(dogId);
            });
        });
    }

    // Clear all history button event
    clearHistoryBtn.addEventListener('click', function() {
        localStorage.removeItem('viewedDogs');
        displayHistory();
    });

    // Initialize the display
    displayHistory();
});