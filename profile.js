document.addEventListener('DOMContentLoaded', function() {
    // Location suggestions functionality
    const locationInput = document.getElementById('locationInput');
    const locationSuggestions = document.getElementById('locationSuggestions');
    const experienceSelect = document.getElementById('experienceSelect');
    
    const locations = [
        'Chicago, IL',
        'New York, NY',
        'Los Angeles, CA',
        'Houston, TX',
        'Phoenix, AZ',
        'Philadelphia, PA',
        'San Antonio, TX',
        'San Diego, CA',
        'Dallas, TX',
        'San Jose, CA'
    ];

    // Convert location input to a tag-like display
    if (locationInput) {
        const locationValue = locationInput.value || 'Chicago, IL';
        const locationContainer = locationInput.parentElement;
        
        // Create a tag-like element to replace the input
        const locationTag = document.createElement('div');
        locationTag.className = 'profile-tag';
        locationTag.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${locationValue}`;
        
        // Hide the original input
        locationInput.style.display = 'none';
        
        // Insert the tag before the input
        locationContainer.insertBefore(locationTag, locationInput);
    }
    
    // Convert experience select to a tag-like display
    if (experienceSelect) {
        const experienceValue = experienceSelect.options[experienceSelect.selectedIndex].text;
        const experienceContainer = experienceSelect.parentElement;
        
        // Create a tag-like element to replace the select
        const experienceTag = document.createElement('div');
        experienceTag.className = 'profile-tag';
        experienceTag.innerHTML = `<i class="fas fa-star"></i> ${experienceValue}`;
        
        // Hide the original select
        experienceSelect.style.display = 'none';
        
        // Insert the tag before the select
        experienceContainer.insertBefore(experienceTag, experienceSelect);
    }

    // Keep the location suggestions functionality for the edit modal
    if (locationInput) {
        locationInput.addEventListener('input', function() {
            const inputValue = this.value.toLowerCase();
            locationSuggestions.innerHTML = '';
            
            if (inputValue.length < 2) {
                locationSuggestions.style.display = 'none';
                return;
            }
            
            const filteredLocations = locations.filter(location => 
                location.toLowerCase().includes(inputValue)
            );
            
            if (filteredLocations.length === 0) {
                locationSuggestions.style.display = 'none';
                return;
            }
            
            filteredLocations.forEach(location => {
                const div = document.createElement('div');
                div.textContent = location;
                div.addEventListener('click', function() {
                    locationInput.value = location;
                    locationSuggestions.style.display = 'none';
                });
                locationSuggestions.appendChild(div);
            });
            
            locationSuggestions.style.display = 'block';
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target !== locationInput && e.target !== locationSuggestions) {
            locationSuggestions.style.display = 'none';
        }
    });

    // Reviews modal functionality
    const reviewsModal = document.getElementById('reviewsModal');
    const viewMyReviews = document.getElementById('viewMyReviews');
    const closeModal = document.querySelector('.close-modal');

    viewMyReviews.addEventListener('click', function(e) {
        e.preventDefault();
        reviewsModal.style.display = 'block';
        
        // Populate reviews (example)
        const reviewsList = document.querySelector('.reviews-list');
        reviewsList.innerHTML = ''; // Clear existing reviews
        
        // Example reviews
        const reviews = [
            { name: 'Alice Smith', rating: 5, comment: 'Great dog owner! Very responsible and caring.' },
            { name: 'Bob Johnson', rating: 4, comment: 'Buddy was well-behaved and got along great with my dog.' },
            { name: 'Carol Williams', rating: 5, comment: 'Very punctual and respectful of park rules.' },
            { name: 'David Brown', rating: 4, comment: 'John is knowledgeable about dog behavior and training.' }
        ];
        
        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            const reviewHeader = document.createElement('div');
            reviewHeader.className = 'review-header';
            
            const reviewerName = document.createElement('h4');
            reviewerName.textContent = review.name;
            
            const reviewRating = document.createElement('div');
            reviewRating.className = 'review-rating';
            
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                star.className = i <= review.rating ? 'fas fa-star' : 'far fa-star';
                reviewRating.appendChild(star);
            }
            
            reviewHeader.appendChild(reviewerName);
            reviewHeader.appendChild(reviewRating);
            
            const reviewComment = document.createElement('p');
            reviewComment.textContent = review.comment;
            
            reviewItem.appendChild(reviewHeader);
            reviewItem.appendChild(reviewComment);
            
            reviewsList.appendChild(reviewItem);
        });
    });

    closeModal.addEventListener('click', function() {
        reviewsModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target == reviewsModal) {
            reviewsModal.style.display = 'none';
        }
    });

    // Edit Profile Modal Functionality
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editProfileForm = document.getElementById('editProfileForm');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Populate form with current values
            document.getElementById('editName').value = document.getElementById('profileName').textContent;
            document.getElementById('editEmail').value = document.getElementById('profileEmail').textContent;
            document.getElementById('editPhone').value = document.getElementById('profilePhone').textContent;
            document.getElementById('editLocation').value = locationInput.value;
            document.getElementById('editExperience').value = experienceSelect.value;
            document.getElementById('editProfilePicUrl').value = document.getElementById('profilePic').src;
            
            // Show modal
            editProfileModal.style.display = 'block';
        });
    }

    closeEditModal.addEventListener('click', function() {
        editProfileModal.style.display = 'none';
    });

    cancelEditBtn.addEventListener('click', function() {
        editProfileModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target == editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });

    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        const phone = document.getElementById('editPhone').value;
        const location = document.getElementById('editLocation').value;
        const experience = document.getElementById('editExperience').value;
        const profilePicUrl = document.getElementById('editProfilePicUrl').value;
        
        // Update profile
        document.getElementById('profileName').textContent = name;
        document.getElementById('profileEmail').textContent = email;
        document.getElementById('profilePhone').textContent = phone;
        locationInput.value = location;
        experienceSelect.value = experience;
        
        // Update the tag displays
        const locationTag = locationInput.previousElementSibling;
        if (locationTag && locationTag.classList.contains('profile-tag')) {
            locationTag.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${location}`;
        }
        
        const experienceTag = experienceSelect.previousElementSibling;
        if (experienceTag && experienceTag.classList.contains('profile-tag')) {
            experienceTag.innerHTML = `<i class="fas fa-star"></i> ${experienceSelect.options[experienceSelect.selectedIndex].text}`;
        }
        
        // Update profile picture if URL is valid
        if (profilePicUrl && isValidUrl(profilePicUrl)) {
            document.getElementById('profilePic').src = profilePicUrl;
        }
        
        // Show success message
        showToast('Profile updated successfully!');
        
        // Close modal
        editProfileModal.style.display = 'none';
    });

    // Add Dog Modal Functionality
    const addDogBtn = document.querySelector('.add-dog-btn');
    const addDogModal = document.getElementById('addDogModal');
    const closeAddDogModal = document.getElementById('closeAddDogModal');
    const cancelAddDogBtn = document.getElementById('cancelAddDogBtn');
    const addDogForm = document.getElementById('addDogForm');

    addDogBtn.addEventListener('click', function() {
        // Reset form
        addDogForm.reset();
        
        // Show modal
        addDogModal.style.display = 'block';
    });

    closeAddDogModal.addEventListener('click', function() {
        addDogModal.style.display = 'none';
    });

    cancelAddDogBtn.addEventListener('click', function() {
        addDogModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target == addDogModal) {
            addDogModal.style.display = 'none';
        }
    });

    addDogForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('dogName').value;
        const breed = document.getElementById('dogBreed').value;
        const age = document.getElementById('dogAge').value;
        const photoUrl = document.getElementById('dogPhoto').value || 'https://dog.ceo/api/breed/retriever/golden/images/random';
        
        // Get selected traits
        const selectedTraits = [];
        document.querySelectorAll('input[name="dogTraits"]:checked').forEach(checkbox => {
            selectedTraits.push(checkbox.value);
        });
        
        // Add dog to profile
        addDogToProfile(name, breed, age, photoUrl, selectedTraits);
        
        // Show success message
        showToast(`${name} has been added to your profile!`);
        
        // Close modal
        addDogModal.style.display = 'none';
    });

    // Dog management functionality
    const editDogBtns = document.querySelectorAll('.edit-dog-btn');
    const deleteDogBtns = document.querySelectorAll('.delete-dog-btn');

    editDogBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dogCard = this.closest('.dog-profile-card');
            const dogName = dogCard.querySelector('h4').textContent;
            alert(`Edit ${dogName}'s profile functionality will be implemented here.`);
        });
    });

    deleteDogBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dogCard = this.closest('.dog-profile-card');
            const dogName = dogCard.querySelector('h4').textContent;
            
            if (confirm(`Are you sure you want to remove ${dogName} from your profile?`)) {
                dogCard.remove();
                showToast(`${dogName} has been removed from your profile.`);
            }
        });
    });

    // Function to add a new dog to the profile
    function addDogToProfile(name, breed, age, photoUrl, traits) {
        const dogsList = document.querySelector('.dogs-list');
        
        // Create dog card
        const dogCard = document.createElement('div');
        dogCard.className = 'dog-profile-card';
        
        // Create dog profile picture
        const dogPic = document.createElement('div');
        dogPic.className = 'dog-profile-pic';
        
        const img = document.createElement('img');
        img.src = photoUrl;
        img.alt = name;
        
        dogPic.appendChild(img);
        
        // Create dog info
        const dogInfo = document.createElement('div');
        dogInfo.className = 'dog-profile-info';
        
        const dogName = document.createElement('h4');
        dogName.textContent = name;
        
        const dogDetails = document.createElement('p');
        dogDetails.textContent = `${breed}, ${age} years`;
        
        // Create dog tags
        const dogTags = document.createElement('div');
        dogTags.className = 'dog-tags';
        
        traits.forEach(trait => {
            const tag = document.createElement('span');
            tag.className = 'dog-tag';
            tag.textContent = trait;
            
            dogTags.appendChild(tag);
        });
        
        dogInfo.appendChild(dogName);
        dogInfo.appendChild(dogDetails);
        dogInfo.appendChild(dogTags);
        
        // Create dog actions
        const dogActions = document.createElement('div');
        dogActions.className = 'dog-profile-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-dog-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-dog-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        dogActions.appendChild(editBtn);
        dogActions.appendChild(deleteBtn);
        
        // Assemble dog card
        dogCard.appendChild(dogPic);
        dogCard.appendChild(dogInfo);
        dogCard.appendChild(dogActions);
        
        dogsList.appendChild(dogCard);
        
        // Add event listeners to the new buttons
        editBtn.addEventListener('click', function() {
            alert(`Edit ${name}'s profile functionality will be implemented here.`);
        });
        
        deleteBtn.addEventListener('click', function() {
            if (confirm(`Are you sure you want to remove ${name} from your profile?`)) {
                dogCard.remove();
                showToast(`${name} has been removed from your profile.`);
            }
        });
    }

    // Helper function to validate URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Toast notification function
    function showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Set background color based on type
        let bgColor = '#4CAF50'; // Default green for success
        if (type === 'warning') {
            bgColor = '#ffcccb'; // Light red for warnings
            toast.style.color = '#d32f2f'; // Darker red text for contrast
        } else if (type === 'error') {
            bgColor = '#f44336'; // Red for errors
        } else if (type === 'info') {
            bgColor = '#2196F3'; // Blue for info
        }
        
        // Add toast styles
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = bgColor;
        toast.style.padding = '15px 25px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        toast.style.zIndex = '1000';
        
        // Add to document
        document.body.appendChild(toast);
        
        // Add fade in animation
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
});
