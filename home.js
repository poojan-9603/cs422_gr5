document.addEventListener('DOMContentLoaded', function() {
    // Check if this is a programmatic navigation from filter removal
    const isFilterModification = sessionStorage.getItem('filterModification') === 'true';
    
    const pageAccessedByReload = (
        (window.performance.navigation && window.performance.navigation.type === 1) ||
        window.performance.getEntriesByType('navigation')
            .map((nav) => nav.type)
            .includes('reload')
    );
    
    if (pageAccessedByReload && !isFilterModification) {
        localStorage.removeItem('activeFilters');
        
        const seasons = ['default', 'spring', 'summer', 'fall', 'winter'];
        seasons.forEach(season => {
            localStorage.removeItem(`dogFilters_${season}`);
        });
        
        sessionStorage.removeItem('filterPageVisited');
        
        if (window.location.search) {
            window.location.href = window.location.pathname;
            return;
        }
    }
    
    // Clear the filter modification flag
    sessionStorage.removeItem('filterModification');
    // Ensure filters from URL are loaded into localStorage on page load
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.toString()) {
    // Convert URL parameters to filters object
    const filtersFromUrl = {};
    for (const [key, value] of urlParams.entries()) {
        filtersFromUrl[key] = value;  // Keep as-is, don't split
    }
    
    // Save these filters to localStorage to ensure persistence
    if (Object.keys(filtersFromUrl).length > 0) {
        localStorage.setItem('activeFilters', JSON.stringify(filtersFromUrl));
        
        // Update seasonal filters if needed
        const currentSeason = localStorage.getItem('currentSeason') || 'default';
        localStorage.setItem(`dogFilters_${currentSeason}`, JSON.stringify(filtersFromUrl));
    }
}
    const allDogs = [
        { id: 1, name: 'Max', breed: 'German Shepherd', age: 4, size: 'Large', vaccination: 'Up to date', location: '3 miles away', temperament: 'Protective', ownerName: 'Jack', experience: 'Experienced', emoji: '🐕' },
        { id: 2, name: 'Bella', breed: 'Labrador', age: 2, size: 'Medium', vaccination: 'Up to date', location: '5 miles away', temperament: 'Friendly', ownerName: 'Emma', experience: 'Intermediate', emoji: '🐕' },
        { id: 3, name: 'Charlie', breed: 'Beagle', age: 3, size: 'Small', vaccination: 'Up to date', location: '2 miles away', temperament: 'Curious', ownerName: 'Michael', experience: 'Beginner', emoji: '🐕' },
        { id: 4, name: 'Luna', breed: 'Husky', age: 5, size: 'Large', vaccination: 'Partial', location: '7 miles away', temperament: 'Independent', ownerName: 'Sophia', experience: 'Experienced', emoji: '🐕' },
        { id: 5, name: 'Cooper', breed: 'Golden Retriever', age: 1, size: 'Medium', vaccination: 'Up to date', location: '4 miles away', temperament: 'Gentle', ownerName: 'Noah', experience: 'Intermediate', emoji: '🐕' },
        { id: 6, name: 'Lucy', breed: 'Poodle', age: 6, size: 'Small', vaccination: 'Up to date', location: '6 miles away', temperament: 'Smart', ownerName: 'Olivia', experience: 'Experienced', emoji: '🐕' },
        { id: 7, name: 'Bailey', breed: 'Corgi', age: 2, size: 'Small', vaccination: 'Up to date', location: '1 mile away', temperament: 'Playful', ownerName: 'William', experience: 'Beginner', emoji: '🐕' },
        { id: 8, name: 'Rocky', breed: 'Bulldog', age: 4, size: 'Medium', vaccination: 'Up to date', location: '3 miles away', temperament: 'Calm', ownerName: 'Ava', experience: 'Intermediate', emoji: '🐕' },
        { id: 9, name: 'Daisy', breed: 'Dachshund', age: 3, size: 'Small', vaccination: 'Partial', location: '5 miles away', temperament: 'Energetic', ownerName: 'James', experience: 'Beginner', emoji: '🐕' },
        { id: 10, name: 'Milo', breed: 'Shih Tzu', age: 7, size: 'Small', vaccination: 'Up to date', location: '2 miles away', temperament: 'Affectionate', ownerName: 'Charlotte', experience: 'Experienced', emoji: '🐕' },
        { id: 11, name: 'Zoe', breed: 'Boxer', age: 2, size: 'Large', vaccination: 'Up to date', location: '4 miles away', temperament: 'Energetic', ownerName: 'Benjamin', experience: 'Intermediate', emoji: '🐕' },
        { id: 12, name: 'Jack', breed: 'Australian Shepherd', age: 3, size: 'Medium', vaccination: 'Up to date', location: '6 miles away', temperament: 'Intelligent', ownerName: 'Mia', experience: 'Experienced', emoji: '🐕' },
        { id: 13, name: 'Sadie', breed: 'Chihuahua', age: 5, size: 'Small', vaccination: 'None', location: '1 mile away', temperament: 'Sassy', ownerName: 'Elijah', experience: 'Beginner', emoji: '🐕' },
        { id: 14, name: 'Chopper', breed: 'Terrier Mix', age: 5, size: 'Small', vaccination: 'None', location: '7 miles away', temperament: 'Aggressive', ownerName: 'Jack', experience: 'New', emoji: '🐕' },
        { id: 15, name: 'Toby', breed: 'Pit Bull', age: 4, size: 'Large', vaccination: 'Up to date', location: '3 miles away', temperament: 'Loyal', ownerName: 'Amelia', experience: 'Experienced', emoji: '🐕' }
    ];

    let filteredDogs = [...allDogs];
    let currentDogIndex = 0;
    let viewedDogs = [];
    let rejectedDogs = [];
    let viewHistory = [];

    const activeFilters = JSON.parse(localStorage.getItem('activeFilters') || '{}');
    if (Object.keys(activeFilters).length > 0) {
        createActiveFiltersBanner(activeFilters);
    }
    const bannerStyles = document.createElement('style');
    bannerStyles.textContent = `
        .active-filters-banner {
            background: white;
            padding: 15px 20px;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            max-width: 90%;
            position: relative;
        }

        .banner-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }

        .filter-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0;
        }

        .filter-tag {
            background: #f0f0f0;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 14px;
            color: #555;
        }

        .clear-all-btn {
            background: #ff5252;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
        }

        .clear-all-btn:hover {
            background: #ff3838;
        }
    `;
    document.head.appendChild(bannerStyles);
    
    const loadViewedDogs = () => {
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
    };

    const saveViewedDogs = () => {
        localStorage.setItem('viewedDogs', JSON.stringify(viewedDogs));
    };

    viewedDogs = loadViewedDogs();

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    function applyFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const filters = {};
    
    // Convert URL parameters to filters object
    for (const [key, value] of urlParams.entries()) {
        filters[key] = value.split(',');
    }

    // Apply filters to the dogs array
    filteredDogs = allDogs.filter(dog => {
        let matches = true;

        for (const [filterType, filterValues] of Object.entries(filters)) {
            switch (filterType) {
                case 'breed':
                    matches = matches && filterValues.includes(dog.breed);
                    break;
                case 'size':
                    matches = matches && filterValues.includes(dog.size);
                    break;
                case 'age':
                    const [minAge, maxAge] = filterValues[0].split('-').map(Number);
                    matches = matches && dog.age >= minAge && dog.age <= maxAge;
                    break;
                case 'temperament':
                    matches = matches && filterValues.includes(dog.temperament);
                    break;
                case 'vaccination':
                    matches = matches && filterValues.includes(dog.vaccination);
                    break;
                case 'location':
                    const [minDist, maxDist] = filterValues[0].split('-').map(num => parseInt(num));
                    const dogDistance = parseInt(dog.location);
                    matches = matches && dogDistance >= minDist && dogDistance <= maxDist;
                    break;
                case 'experience':
                    matches = matches && filterValues.includes(dog.experience);
                    break;
            }
        }
        return matches;
    });

    // Reset the current dog index
    currentDogIndex = 0;
    
    // If we have filtered dogs, show the first one
    if (filteredDogs.length > 0) {
        showRandomDog();
    } else {
        // Show no results message
        const container = document.querySelector('.dog-profile-container') || document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="no-results">
                    <h2>No dogs found</h2>
                    <p>Try adjusting your filters to see more dogs</p>
                    <button onclick="window.location.href='filter.html'" class="adjust-filters-btn">
                        Adjust Filters
                    </button>
                </div>
            `;
        }
    }
}

    function applyFilters(filters) {
        if (Object.keys(filters).length > 0) {
            filteredDogs = allDogs.filter(dog => {
                let match = true;
                
                if (filters.breed) {
                    const breeds = filters.breed.split(',');
                    const breedMatch = breeds.some(b => dog.breed.toLowerCase() === b.toLowerCase());
                    if (!breedMatch) match = false;
                }
                
                if (filters.size && dog.size.toLowerCase() !== filters.size.toLowerCase()) match = false;
                
                if (filters.age) {
                    const [minAge, maxAge] = filters.age.split('-').map(Number);
                    if (dog.age < minAge || dog.age > maxAge) match = false;
                }
                
                if (filters.temperament) {
                    const traits = filters.temperament.split(',');
                    const traitMatch = traits.some(t => dog.temperament.toLowerCase() === t.toLowerCase());
                    if (!traitMatch) match = false;
                }
                
                if (filters.vaccination && dog.vaccination.toLowerCase() !== filters.vaccination.toLowerCase()) match = false;
                
                if (filters.location) {
                    const [minDist, maxDist] = filters.location.split('-').map(Number);
                    const dogDistance = parseInt(dog.location.split(' ')[0]);
                    if (dogDistance < minDist || dogDistance > maxDist) match = false;
                }
                
                if (filters.experience) {
                    const experiences = filters.experience.split(',');
                    const expMatch = experiences.some(e => dog.experience.toLowerCase() === e.toLowerCase());
                    if (!expMatch) match = false;
                }
                
                return match;
            });
    
            if (filteredDogs.length === 0) {
                filteredDogs = [...allDogs];
                alert('No dogs match your filters. Showing all dogs.');
            }
        }
    }

    function showRandomDog() {
        if (filteredDogs.length === 0) return;
        currentDogIndex = Math.floor(Math.random() * filteredDogs.length);
        showDogProfile(filteredDogs[currentDogIndex]);
    }

    function showNextDog() {
        if (filteredDogs.length === 0) return;
        
        if (filteredDogs[currentDogIndex]) {
            viewHistory.push(currentDogIndex);
            if (viewHistory.length > 50) {
                viewHistory.shift();
            }
        }
        
        currentDogIndex = (currentDogIndex + 1) % filteredDogs.length;
        showDogProfile(filteredDogs[currentDogIndex]);
        
        updateUndoButtonState();
    }
    
    function showPreviousDog() {
        if (viewHistory.length === 0) return;
        
        const previousIndex = viewHistory.pop();
        currentDogIndex = previousIndex;
        showDogProfile(filteredDogs[currentDogIndex]);
        
        updateUndoButtonState();
    }
    
    function updateUndoButtonState() {
        const undoBtn = document.getElementById('undoBtn');
        if (undoBtn) {
            if (viewHistory.length === 0) {
                undoBtn.classList.add('disabled');
                undoBtn.setAttribute('aria-disabled', 'true');
            } else {
                undoBtn.classList.remove('disabled');
                undoBtn.setAttribute('aria-disabled', 'false');
            }
        }
    }


    function showDogProfile(dog) {
        const dogDrawing = document.querySelector('.dog-drawing');
        const dogInfo = document.querySelector('.dog-info');
    
        if (!dogDrawing || !dogInfo) return;
    
        if (!viewedDogs.some(d => d.id === dog.id)) {
            viewedDogs.push(dog);
            if (viewedDogs.length > 20) {
                viewedDogs.shift();
            }
            saveViewedDogs();
        }
    
        const breedForUrl = dog.breed.toLowerCase().replace(/\s+/g, '/');
        
        dogDrawing.innerHTML = `
            <div class="owner-pic" id="ownerPic">
                <img src="images/person/${dog.id}.jpeg" 
                     onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(dog.ownerName)}&background=random&color=fff&size=128';" 
                     alt="${dog.ownerName}">
            </div>
            <img id="dogImage" src="images/dogs/${dog.id}.jpeg" 
                 onerror="this.onerror=null;this.src='images/default-dog.jpeg';" 
                 alt="${dog.name}" style="max-width: 70%; max-height: 70%; object-fit: contain;">
        `;
    
        dogInfo.innerHTML = `
            <div class="info-row"><span class="info-label">Name:</span><span class="info-value">${dog.name}</span></div>
            <div class="info-row"><span class="info-label">Age:</span><span class="info-value">${dog.age} years</span></div>
            <div class="info-row"><span class="info-label">Breed:</span><span class="info-value">${dog.breed}</span></div>
            <div class="info-row"><span class="info-label">Size:</span><span class="info-value">${dog.size}</span></div>
            <div class="info-row"><span class="info-label">Vaccination:</span><span class="info-value">${dog.vaccination}</span></div>
            <div class="info-row"><span class="info-label">Location:</span><span class="info-value">${dog.location}</span></div>
            <div class="info-row"><span class="info-label">Personality:</span><span class="info-value">${dog.temperament}</span></div>
            <div class="owner-section">
                <div class="section-title">Owner Information</div>
                <div class="info-row"><span class="info-label">Owner Name:</span><span class="info-value">${dog.ownerName}</span></div>
                <div class="info-row"><span class="info-label">Experience:</span><span class="info-value">${dog.experience}</span></div>
                <div class="info-row">
                    <span class="info-label">Rating:</span>
                    <span class="info-value">
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="far fa-star"></i>
                            <span>(4.0)</span>
                        </div>
                    </span>
                </div>
                <div class="info-row">
                    <span class="info-label">Reviews :</span>
                    <span class="info-value">
                        <a href="#" class="view-reviews">View 12 reviews</a>
                    </span>
                </div>
            </div>
        `;

        setTimeout(() => {
            const dogImage = document.getElementById('dogImage');
            const ownerPic = document.getElementById('ownerPic');
            if (dogImage) {
                dogImage.addEventListener('click', function() {
                    modal.style.display = 'flex';
                    modalImg.src = this.src;
                });
            }
            if (ownerPic) {
                ownerPic.addEventListener('click', function() {
                    showOwnerProfileModal(dog);
                });
            }
            const viewReviews = document.querySelector('.view-reviews');
            if (viewReviews) {
                viewReviews.addEventListener('click', function(e) {
                    e.preventDefault();
                    showReviewsModal(dog);
                });
            }
        }, 100);
    }

    function showReviewsModal(dog) {
        let reviewsModal = document.getElementById('reviewsModal');
        if (!reviewsModal) {
            reviewsModal = document.createElement('div');
            reviewsModal.id = 'reviewsModal';
            reviewsModal.className = 'modal';
            reviewsModal.innerHTML = `
                <div class="reviews-modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Reviews for ${dog.ownerName}</h2>
                    <div class="reviews-list"> 
                        <div class="review-item">
                            <div class="review-header">
                                <span class="reviewer-name">Sarah</span>
                                <div class="review-rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </div>
                            </div>
                            <p class="review-text">Great experience! ${dog.ownerName} was very responsible and ${dog.name} was well-behaved.</p>
                        </div>
                        <div class="review-item">
                            <div class="review-header">
                                <span class="reviewer-name">Mike</span>
                                <div class="review-rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="far fa-star"></i>
                                </div>
                            </div>
                            <p class="review-text">My dog had a great time with ${dog.name}. Would recommend!</p>
                        </div>
                        <div class="review-item">
                            <div class="review-header">
                                <span class="reviewer-name">Jessica</span>
                                <div class="review-rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="far fa-star"></i>
                                    <i class="far fa-star"></i>
                                </div>
                            </div>
                            <p class="review-text">${dog.ownerName} was punctual but ${dog.name} was a bit too energetic for my small dog.</p>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(reviewsModal);
            const closeReviewsModal = reviewsModal.querySelector('.close-modal');
            closeReviewsModal.addEventListener('click', function() {
                reviewsModal.style.display = 'none';
            });
        } else {
            reviewsModal.querySelector('h2').textContent = `Reviews for ${dog.ownerName}`;
        }
        reviewsModal.style.display = 'flex';
    }

    function showOwnerProfileModal(dog) {
        let ownerModal = document.getElementById('ownerProfileModal');
        if (!ownerModal) {
            const modalStyles = document.createElement('style');
            modalStyles.textContent = `
                .owner-modal-content {
                    background-color: white;
                    margin: auto;
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 500px;
                    width: 90%;
                    position: relative;
                }
                
                .owner-profile-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .owner-profile-pic {
                    margin-right: 20px;
                }
                
                .owner-profile-pic img {
                    width: 250px;
                    height: 250px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid #6c63ff;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .owner-profile-info h2 {
                    margin-top: 0;
                    color: #333;
                    font-size: 24px;
                }
                
                .owner-stats {
                    margin-top: 15px;
                }
                
                .owner-stat {
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .stat-label {
                    font-weight: bold;
                    margin-right: 10px;
                    color: #555;
                }
                
                .rating {
                    color: #ffc107;
                }
                
                .rating span {
                    color: #333;
                    margin-left: 5px;
                }
                
                .close-modal {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    font-size: 24px;
                    cursor: pointer;
                    color: #555;
                }
                
                .close-modal:hover {
                    color: #000;
                }
            `;
            document.head.appendChild(modalStyles);
            
            ownerModal = document.createElement('div');
            ownerModal.id = 'ownerProfileModal';
            ownerModal.className = 'modal';
            
            const ownerId = dog.id;
            
            ownerModal.innerHTML = `
                <div class="owner-modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="owner-profile-header">
                        <div class="owner-profile-pic">
                            <img src="images/person/${ownerId}.jpeg" 
                                 onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(dog.ownerName)}&background=random&color=fff&size=250';" 
                                 alt="${dog.ownerName}">
                        </div>
                        <div class="owner-profile-info">
                            <h2>${dog.ownerName}</h2>
                            <div class="owner-stats">
                                <div class="owner-stat">
                                    <span class="stat-label">Experience:</span>
                                    <span class="stat-value">${dog.experience}</span>
                                </div>
                                <div class="owner-stat">
                                    <span class="stat-label">Rating:</span>
                                    <span class="stat-value">
                                        <div class="rating">
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="far fa-star"></i>
                                            <span>(4.0)</span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(ownerModal);
            
            const closeOwnerModal = ownerModal.querySelector('.close-modal');
            closeOwnerModal.addEventListener('click', function() {
                ownerModal.style.display = 'none';
                const bottomPanel = document.querySelector('.bottom-action-panel');
                if (bottomPanel) bottomPanel.style.display = 'flex';
            });
        } else {
            const ownerImg = ownerModal.querySelector('.owner-profile-pic img');
            if (ownerImg) {
                const ownerId = dog.id;
                ownerImg.src = `images/person/${ownerId}.jpeg`;
                ownerImg.onerror = function() {
                    this.onerror = null;
                    this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dog.ownerName)}&background=random&color=fff&size=250`;
                };
                ownerImg.alt = dog.ownerName;
            }
            
            const ownerName = ownerModal.querySelector('.owner-profile-info h2');
            if (ownerName) {
                ownerName.textContent = dog.ownerName;
            }
            
            const expValue = ownerModal.querySelector('.owner-stat .stat-value');
            if (expValue && !expValue.querySelector('.rating')) {
                expValue.textContent = dog.experience;
            }
        }
        ownerModal.style.display = 'flex';
    }

  // Add this function to handle modal state
function toggleModalState(isOpen) {
    const bottomPanel = document.querySelector('.bottom-action-panel');
    if (bottomPanel) {
        if (isOpen) {
            bottomPanel.style.display = 'none';
        } else {
            bottomPanel.style.display = 'flex';
        }
    }
}

// Modify the image click handler in showDogProfile
setTimeout(() => {
    const dogImage = document.getElementById('dogImage');
    const ownerPic = document.getElementById('ownerPic');
    if (dogImage) {
        dogImage.addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImg.src = this.src;
            toggleModalState(true);
            const bottomPanel = document.querySelector('.bottom-action-panel');
            if (bottomPanel) bottomPanel.style.display = 'none';
             // Hide buttons when modal opens
        });
    }
    if (ownerPic) {
        ownerPic.addEventListener('click', function() {
            showOwnerProfileModal(dog);
            toggleModalState(true); // Hide buttons when modal opens
            const bottomPanel = document.querySelector('.bottom-action-panel');
            if (bottomPanel) bottomPanel.style.display = 'none';
        });
    }
    // ... rest of the code ...
}, 100);

// Modify modal close handlers
window.addEventListener('click', function(event) {
    const bottomPanel = document.querySelector('.bottom-action-panel');
    
    if (event.target === modal) {
        modal.style.display = 'none';
        if (bottomPanel) bottomPanel.style.display = 'flex';
    }
    const reviewsModal = document.getElementById('reviewsModal');
    if (event.target === reviewsModal) {
        reviewsModal.style.display = 'none';
        if (bottomPanel) bottomPanel.style.display = 'flex';
    }
    const ownerModal = document.getElementById('ownerProfileModal');
    if (event.target === ownerModal) {
        ownerModal.style.display = 'none';
        if (bottomPanel) bottomPanel.style.display = 'flex';
    }
});

// Update the close modal handler
const closeModal = document.querySelector('.close-modal');
if (closeModal) {
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        const bottomPanel = document.querySelector('.bottom-action-panel');
        if (bottomPanel) bottomPanel.style.display = 'flex';
    });
}

    

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        const reviewsModal = document.getElementById('reviewsModal');
        if (event.target === reviewsModal) {
            reviewsModal.style.display = 'none';
        }
        const ownerModal = document.getElementById('ownerProfileModal');
        if (event.target === ownerModal) {
            ownerModal.style.display = 'none';
        }
    });

// ——— if navigated from history “View Profile” ———
const viewDogIdStr = localStorage.getItem('viewDogId');
const viewDogId = viewDogIdStr ? parseInt(viewDogIdStr, 10) : null;
if (viewDogId) {
    // show that exact dog instead of a random one
    const dog = allDogs.find(d => d.id === viewDogId);
    if (dog) {
        showDogProfile(dog);
        setTimeout(createBottomPanel, 100);
        localStorage.removeItem('viewDogId');
        return;  // skip the random flow
    }
}

// ——— otherwise use your normal filter + random logic ———
applyFiltersFromURL();
showRandomDog();

    
    // Create a function to add the bottom panel with all three buttons
        // Create a function to add the bottom panel with all three buttons
        function createBottomPanel() {
            // Remove any existing bottom panels first
            const existingPanels = document.querySelectorAll('.bottom-action-panel');
            existingPanels.forEach(panel => panel.remove());
            
            // Create the new panel
            const bottomPanel = document.createElement('div');
            bottomPanel.className = 'bottom-action-panel';
            
            // Create the undo button
            const undoBtn = document.createElement('button');
            undoBtn.className = 'panel-btn undo-btn';
            undoBtn.id = 'undoBtn'; // Add ID for easier reference
            undoBtn.innerHTML = '<i class="fas fa-undo"></i><span class="btn-text">Previous</span>';
            undoBtn.setAttribute('aria-label', 'Go back to previous profile');
            
            // Set initial state based on viewHistory length
            if (viewHistory.length === 0) {
                undoBtn.classList.add('disabled');
                undoBtn.setAttribute('aria-disabled', 'true');
            } else {
                undoBtn.classList.remove('disabled');
                undoBtn.setAttribute('aria-disabled', 'false');
            }
            
            // Create the next button
            const nextBtn = document.createElement('button');
            nextBtn.className = 'panel-btn next-btn';
            nextBtn.innerHTML = '<i class="fas fa-times"></i><span class="btn-text">Next</span>';
            nextBtn.setAttribute('aria-label', 'Skip this dog');
            
            // Create the message button
            const messageBtn = document.createElement('button');
            messageBtn.className = 'panel-btn message-btn';
            messageBtn.innerHTML = '<i class="fas fa-comment"></i><span class="btn-text">Message</span>';
            messageBtn.setAttribute('aria-label', 'Message this dog owner');
            
            // Add buttons to panel
            bottomPanel.appendChild(undoBtn);
            bottomPanel.appendChild(nextBtn);
            bottomPanel.appendChild(messageBtn);
            
            // Add panel to the page
            const profileContainer = document.querySelector('.profile-card') || 
                                    document.querySelector('.dog-profile-container') || 
                                    document.querySelector('.home-container') || 
                                    document.querySelector('.container');
            
            profileContainer.appendChild(bottomPanel);
            
            // Add event listeners
            undoBtn.addEventListener('click', function() {
                if (!this.classList.contains('disabled')) {
                    showPreviousDog();
                }
            });
            
            // Use the existing showNextDog function directly instead of duplicating logic
            nextBtn.addEventListener('click', showNextDog);
            
            messageBtn.addEventListener('click', function() {
                const currentDog = filteredDogs[currentDogIndex];
                localStorage.setItem('chatWith', currentDog.ownerName);
                localStorage.setItem('dogName', currentDog.name);
                localStorage.setItem('autoMessage', `Hi! I'm interested in meeting ${currentDog.name}. Would you like to arrange a playdate?`);
                localStorage.setItem('selectChat', 'true');
                window.location.href = 'chat.html';
            });
            
               // Add styling
               const style = document.createElement('style');
        style.textContent = `
            /* Hide all other action buttons */
            .action-buttons, 
            .bottom-buttons,
            .profile-card-actions {
                display: none !important;
            }
            
            /* Style the new bottom panel */
            .bottom-action-panel {
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: white;
                padding: 0;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
                z-index: 1 !important;
                margin-top: 20px;
                width: 100%;
            }
            
            /* Make the middle container (dog profile) much bigger */
            .profile-card, .dog-profile-container {
                max-width: 90% !important;
                width: 90% !important;
                margin: 0 auto !important;
            }
            
            .dog-drawing img {
                max-width: 90% !important;
                max-height: 500px !important;
                object-fit: contain !important;
            }
            
            .dog-info {
                font-size: 1.2em !important;
                padding: 20px !important;
            }
            
            /* Make the buttons rectangular and equal width with no gaps */
            .panel-btn {
                flex: 1;
                height: 70px;
                border-radius: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
                font-size: 22px;
                box-shadow: none;
                margin: 0;
            }
            
            .panel-btn i {
                margin-bottom: 5px;
            }
            
            .btn-text {
                font-size: 16px;
                font-weight: 500;
            }
            
            .undo-btn {
                background-color: #e0e0e0;
                color: #555;
            }
            
            .undo-btn:hover:not(.disabled) {
                background-color: #d0d0d0;
                transform: translateY(-2px);
            }
            
            .undo-btn.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .next-btn {
                background-color: #ff5252;
                color: white;
            }
            
            .next-btn:hover {
                background-color: #ff3838;
                transform: translateY(-2px);
            }
            
            .message-btn {
                background-color: #6c63ff;
                color: white;
            }
            
            .message-btn:hover {
                background-color: #5a52d5;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Call the function to create the bottom panel
    setTimeout(createBottomPanel, 100);
});
function addFilterTag(container, text) {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.textContent = text;
    container.appendChild(tag);
  }
  
  function createActiveFiltersBanner(filters) {
    // 1. Locate mount point
    const possible = [
      document.querySelector('.dog-profile-container'),
      document.querySelector('.home-container'),
      document.querySelector('.container'),
      document.querySelector('main'),
      document.body
    ];
    const mount = possible.find(el => el);
    if (!mount) return console.error('No container for filter banner');
  
    // 2. Remove old banner
    const old = document.querySelector('.active-filters-banner');
    if (old) old.remove();
  
    // 3. Build banner structure
    const banner = document.createElement('div');
    banner.className = 'active-filters-banner';
    banner.innerHTML = `
      <div class="banner-title"><i class="fas fa-filter"></i> Active Filters</div>
      <div class="filter-tags"></div>
      <button class="clear-all-btn">Clear All</button>
    `;
    mount.insertBefore(banner, mount.firstChild);
  
    // 4. "Clear All" action
    banner.querySelector('.clear-all-btn')
    .addEventListener('click', () => {
      // wipe every season's stored filters
      ['default', 'spring', 'summer', 'fall', 'winter']
        .forEach(season => localStorage.removeItem(`dogFilters_${season}`));
  
      // remove banner state and first-visit flag
      localStorage.removeItem('activeFilters');
      sessionStorage.removeItem('filterPageVisited');
  
      // reload Home
      window.location.href = 'index.html';
    });
  
    // 5. Inject styles once
    if (!document.getElementById('filter-banner-styles')) {
      const style = document.createElement('style');
      style.id = 'filter-banner-styles';
      style.textContent = `
        .active-filters-banner {
          background: #fff;
          padding: 1rem;
          margin: 1rem auto;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 95%;
          position: relative;
        }
        .banner-title {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .filter-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .filter-tag-cell {
          background: #f6f7f9;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .filter-type {
          font-weight: bold;
          color: #444;
          font-size: 0.9rem;
        }
        .filter-values {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .filter-value {
          background: #fff;
          padding: 0.4rem 0.8rem;
          border-radius: 12px;
          font-size: 0.85rem;
          color: #555;
          border: 1px solid #e0e0e0;
          position: relative;
          padding-right: 28px;
          cursor: pointer;
        }
        .filter-value:hover {
          background: #f0f0f0;
        }
        .remove-filter {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ddd;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          line-height: 1;
        }
        .filter-value:hover .remove-filter {
          background: #ff5252;
          color: white;
        }
        .clear-all-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #ff5252;
          color: #fff;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .clear-all-btn:hover { background: #ff3838; }
      `;
      document.head.appendChild(style);
    }
  
    // 6. Helper to create one category‐cell
    const containerTags = banner.querySelector('.filter-tags');
    const createFilterCell = (type, values, originalKey) => {
      const cell = document.createElement('div');
      cell.className = 'filter-tag-cell';
      
      const typeDiv = document.createElement('div');
      typeDiv.className = 'filter-type';
      typeDiv.textContent = type;
      
      const valsDiv = document.createElement('div');
      valsDiv.className = 'filter-values';
      
      // Save original raw value for reference
      const rawValues = filters[originalKey];
      const isArray = Array.isArray(rawValues);
      const valueArray = isArray ? rawValues : rawValues.split(',');
      
      values.forEach((v, i) => {
        const span = document.createElement('span');
        span.className = 'filter-value';
        
        // Store the original value for reference when removing
        const originalValue = valueArray[i];
        
        // Create text and remove icon
        const textNode = document.createTextNode(v);
        span.appendChild(textNode);
        
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-filter';
        removeBtn.innerHTML = '×';
        span.appendChild(removeBtn);
        
        // Add click event to remove this filter
        removeBtn.addEventListener('click', function(e) {
          e.stopPropagation(); // Prevent any parent clicks
          removeFilter(originalKey, originalValue);
        });
        
        valsDiv.appendChild(span);
      });
      
      cell.appendChild(typeDiv);
      cell.appendChild(valsDiv);
      containerTags.appendChild(cell);
    };
  
    // 7. Map URL keys → display labels + format special cases
    const labelMap = {
      breed: 'Breed',
      size: 'Size',
      age: 'Age',
      temperament: 'Personality',
      vaccination: 'Vaccination',
      location: 'Location',
      experience: 'Owner Experience'
    };
  
    Object.entries(filters).forEach(([key, raw]) => {
      if (!raw) return;
      const label = labelMap[key] || key;
      const vals = Array.isArray(raw) ? raw : raw.split(',');
      const formatted = vals.map(v => {
        if (key === 'age') {
          const [min, max] = v.split('-');
          return max === '30' ? `${min}+ years` : `${min}-${max} years`;
        }
        if (key === 'location') {
          const [min, max] = v.split('-');
          return max === '100' ? `${min}+ miles` : `${min}-${max} miles`;
        }
        return v;
      });
      createFilterCell(label, formatted, key);
    });
  
    // 8. If mounted on <body>, re-run filtering logic
    if (mount === document.body) {
      applyFiltersFromURL();
      showRandomDog();
    }
  }
  
  // Function to remove an individual filter
  function removeFilter(key, value) {
    // Get current filters
    const activeFilters = JSON.parse(localStorage.getItem('activeFilters') || '{}');
    
    // For age and location filters, we need special handling
    if (key === 'age' || key === 'location') {
        // These are expected to be stored as a string like "0-1"
        // We need to check if this is the only value for this key
        if (activeFilters[key] === value) {
            delete activeFilters[key];
        } else {
            // If we have multiple values for age/location, they should be separated with commas
            let values = activeFilters[key].split(',');
            values = values.filter(v => v !== value);
            
            if (values.length === 0) {
                delete activeFilters[key];
            } else {
                activeFilters[key] = values.join(',');
            }
        }
    } 
    // For other filters that can have multiple values
    else {
        // Get current values
        let values = activeFilters[key];
        
        // Convert to array if it's a string
        if (typeof values === 'string') {
            values = values.split(',');
        }
        
        // Remove specific value
        const newValues = values.filter(v => v !== value);
        
        // If no values left, remove the key entirely
        if (newValues.length === 0) {
            delete activeFilters[key];
        } else {
            // Otherwise update with remaining values
            activeFilters[key] = newValues.join(',');  // Store as comma-separated string
        }
    }
    
    // IMPORTANT: Check if we still have any filters left
    if (Object.keys(activeFilters).length === 0) {
        // If no filters left, clear everything
        localStorage.removeItem('activeFilters');
        
        // Clear seasonal filters
        const seasons = ['default', 'spring', 'summer', 'fall', 'winter'];
        seasons.forEach(season => {
            localStorage.removeItem(`dogFilters_${season}`);
        });
        
        sessionStorage.removeItem('filterPageVisited');
    } else {
        // Otherwise save the updated filters
        localStorage.setItem('activeFilters', JSON.stringify(activeFilters));
        
        // Update seasonal filters if needed
        const currentSeason = localStorage.getItem('currentSeason') || 'default';
        localStorage.setItem(`dogFilters_${currentSeason}`, JSON.stringify(activeFilters));
    }
    
    // Set flag for programmatic filter modification
    sessionStorage.setItem('filterModification', 'true');
    
    // Rebuild URL parameters correctly
    const params = new URLSearchParams();
    Object.entries(activeFilters).forEach(([k, v]) => {
        params.append(k, v);
    });
    
    // Update page URL and reload
    window.location.href = window.location.pathname + 
        (params.toString() ? '?' + params.toString() : '');
}