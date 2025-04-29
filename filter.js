document.addEventListener('DOMContentLoaded', function() {
    const filterItems = document.querySelectorAll('.filter-item');
    const resetBtn = document.querySelector('.reset-btn');
    const applyBtn = document.querySelector('.apply-btn');
    const seasonSelector = document.querySelector('#season-selector') || document.createElement('select');

    // Debug helper function to see what's in localStorage
    function debugLocalStorage() {
        console.log('--- Debug localStorage ---');
        console.log('activeFilters:', localStorage.getItem('activeFilters'));
        console.log('dogFilters_default:', localStorage.getItem('dogFilters_default'));
        console.log('filterPageVisited:', sessionStorage.getItem('filterPageVisited'));
        console.log('------------------------');
    }
    debugLocalStorage();

    // Check if filters were cleared from home page
    const activeFilters = localStorage.getItem('activeFilters');
    const currentSeason = seasonSelector.value || 'default';
    
    // Reset all filter items to unselected state initially
    filterItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // IMPORTANT: This is the main function that will highlight active filters
    function applyStoredFilters() {
        console.log("Applying stored filters");
        
        // First try to get activeFilters from localStorage
        const activeFiltersStr = localStorage.getItem('activeFilters');
        if (activeFiltersStr && activeFiltersStr !== '{}') {
            try {
                console.log("Found activeFilters:", activeFiltersStr);
                const filters = JSON.parse(activeFiltersStr);
                
                // First clear all active states
                filterItems.forEach(item => item.classList.remove('active'));
                
                // Then set active state for each matching filter
                filterItems.forEach(item => {
                    const itemText = item.textContent.trim();
                    const groupTitle = item.closest('.filter-group').querySelector('h3').textContent;
                    
                    // Check against appropriate filter type
                    if (groupTitle === 'Breed' && filters.breed) {
                        const breeds = filters.breed.split(',');
                        if (breeds.includes(itemText)) {
                            item.classList.add('active');
                        }
                    } 
                    else if (groupTitle === 'Age' && filters.age) {
                        const ages = filters.age.split(',');
                        for (const ageRange of ages) {
                            const [min, max] = ageRange.split('-').map(Number);
                            if ((itemText.includes('Puppy') && min === 0) ||
                                (itemText.includes('Young') && min === 1) ||
                                (itemText.includes('Adult') && min === 3) ||
                                (itemText.includes('Senior') && min === 7)) {
                                item.classList.add('active');
                                break;
                            }
                        }
                    }
                    else if (groupTitle === 'Size' && filters.size) {
                        const sizes = filters.size.split(',');
                        if (sizes.includes(itemText)) {
                            item.classList.add('active');
                        }
                    }
                    else if (groupTitle === 'Location' && filters.location) {
                        const locations = filters.location.split(',');
                        for (const locRange of locations) {
                            const [min, max] = locRange.split('-').map(Number);
                            if ((itemText.includes('Under 2') && min === 0) ||
                                (itemText.includes('2-5') && min === 2) ||
                                (itemText.includes('5+') && min === 5)) {
                                item.classList.add('active');
                                break;
                            }
                        }
                    }
                    else if (groupTitle === 'Owner Experience' && filters.experience) {
                        const experiences = filters.experience.split(',');
                        if (experiences.includes(itemText)) {
                            item.classList.add('active');
                        }
                    }
                    else if (groupTitle === 'Personality' && filters.temperament) {
                        const personalities = filters.temperament.split(',');
                        if (personalities.includes(itemText)) {
                            item.classList.add('active');
                        }
                    }
                });
                
                console.log("Successfully applied activeFilters");
                return true; // Successfully applied filters
            } catch (e) {
                console.error('Error parsing active filters:', e);
            }
        }
        
        // If activeFilters failed, try season-specific filters
        const savedFiltersStr = localStorage.getItem(`dogFilters_${currentSeason}`);
        if (savedFiltersStr) {
            try {
                console.log("Found dogFilters:", savedFiltersStr);
                const savedFilters = JSON.parse(savedFiltersStr);
                
                // First clear all active states
                filterItems.forEach(item => item.classList.remove('active'));
                
                // Then set active state for each matching filter
                filterItems.forEach(item => {
                    const itemText = item.textContent.trim();
                    const groupTitle = item.closest('.filter-group').querySelector('h3').textContent;
                    
                    if (groupTitle === 'Breed' && savedFilters.breed && savedFilters.breed.length > 0) {
                        if (savedFilters.breed.includes(itemText)) {
                            item.classList.add('active');
                        }
                    }
                    else if (groupTitle === 'Age' && savedFilters.age && savedFilters.age.length > 0) {
                        for (const ageRange of savedFilters.age) {
                            const [min, max] = ageRange.split('-').map(Number);
                            if ((itemText.includes('Puppy') && min === 0) ||
                                (itemText.includes('Young') && min === 1) ||
                                (itemText.includes('Adult') && min === 3) ||
                                (itemText.includes('Senior') && min === 7)) {
                                item.classList.add('active');
                                break;
                            }
                        }
                    }
                    else if (groupTitle === 'Size' && savedFilters.size && savedFilters.size.length > 0) {
                        if (savedFilters.size.includes(itemText)) {
                            item.classList.add('active');
                        }
                    }
                    else if (groupTitle === 'Location' && savedFilters.location && savedFilters.location.length > 0) {
                        for (const locRange of savedFilters.location) {
                            const [min, max] = locRange.split('-').map(Number);
                            if ((itemText.includes('Under 2') && min === 0) ||
                                (itemText.includes('2-5') && min === 2) ||
                                (itemText.includes('5+') && min === 5)) {
                                item.classList.add('active');
                                break;
                            }
                        }
                    }
                    else if (groupTitle === 'Owner Experience' && savedFilters.experience && savedFilters.experience.length > 0) {
                        if (savedFilters.experience.includes(itemText)) {
                            item.classList.add('active');
                        }
                    }
                    else if (groupTitle === 'Personality' && savedFilters.personality && savedFilters.personality.length > 0) {
                        if (savedFilters.personality.includes(itemText)) {
                            item.classList.add('active');
                        }
                    }
                });
                
                console.log("Successfully applied dogFilters");
                return true; // Successfully applied filters
            } catch (e) {
                console.error('Error parsing saved filters for season:', e);
            }
        }
        
        return false; // Failed to apply any filters
    }
    
    // Apply stored filters immediately when the page loads
    applyStoredFilters();
    
    // When a filter item is clicked
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Reset button handler
    resetBtn.addEventListener('click', function() {
        filterItems.forEach(item => {
            item.classList.remove('active');
        });
        const currentSeason = seasonSelector.value || 'default';
        localStorage.removeItem(`dogFilters_${currentSeason}`);
        localStorage.removeItem('activeFilters');
    });
    
    // Apply button handler
    applyBtn.addEventListener('click', function() {
        const selectedFilters = {
            breed: [],
            age: [], 
            size: [], 
            location: [], 
            experience: [],
            personality: []
        };
        
        const filterGroups = document.querySelectorAll('.filter-group');
        
        filterGroups.forEach(group => {
            const groupTitle = group.querySelector('h3').textContent;
            const activeItems = group.querySelectorAll('.filter-item.active');
            
            if (groupTitle === 'Breed') {
                activeItems.forEach(item => {
                    selectedFilters.breed.push(item.textContent.trim());
                });
            } else if (groupTitle === 'Age') {
                activeItems.forEach(item => {
                    const ageText = item.textContent.trim();
                    const ageNumbers = ageText.match(/\d+/g)?.map(Number) || [];
                    if (ageText.includes('Puppy')) {
                        selectedFilters.age.push(`${ageNumbers[0]}-${ageNumbers[1]}`);
                    } else if (ageText.includes('Senior')) {
                        selectedFilters.age.push(`${ageNumbers[0]}-30`);
                    } else if (ageNumbers.length >= 2) {
                        selectedFilters.age.push(`${ageNumbers[0]}-${ageNumbers[1]}`);
                    }
                });
            } else if (groupTitle === 'Size') {
                activeItems.forEach(item => {
                    selectedFilters.size.push(item.textContent.trim());
                });
            } else if (groupTitle === 'Location') {
                activeItems.forEach(item => {
                    const locationText = item.textContent.trim();
                    if (locationText.includes('Under 2')) {
                        selectedFilters.location.push('0-2');
                    } else if (locationText.includes('2-5')) {
                        selectedFilters.location.push('2-5');
                    } else if (locationText.includes('5+')) {
                        selectedFilters.location.push('5-100');
                    }
                });
            } else if (groupTitle === 'Owner Experience') {
                activeItems.forEach(item => {
                    selectedFilters.experience.push(item.textContent.trim());
                });
            } else if (groupTitle === 'Personality') {
                activeItems.forEach(item => {
                    selectedFilters.personality.push(item.textContent.trim());
                });
            }
        });
        
        // Show the confirmation dialog
        showFilterConfirmation(selectedFilters);
    });

    // Season selector change handler
    if (seasonSelector) {
        seasonSelector.addEventListener('change', function() {
            const season = this.value || 'default';
            console.log("Season changed to", season);
            // Try to load season-specific filters
            const savedFiltersStr = localStorage.getItem(`dogFilters_${season}`);
            if (savedFiltersStr) {
                try {
                    const savedFilters = JSON.parse(savedFiltersStr);
                    console.log("Found season filters:", savedFiltersStr);
                    
                    // First clear all active states
                    filterItems.forEach(item => item.classList.remove('active'));
                    
                    // Then set active state for each matching filter based on saved filters
                    // Similar to the code in applyStoredFilters but specifically for season filters
                    // ... (implementation similar to above)
                } catch (e) {
                    console.error('Error parsing saved filters for season:', e);
                }
            } else {
                // If no saved filters for this season, clear all
                filterItems.forEach(item => item.classList.remove('active'));
            }
        });
    }

    // Filter confirmation functions
    function showFilterConfirmation(filters) {
        // Create modal container if it doesn't exist
        let modalContainer = document.querySelector('.filter-confirm-modal');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.className = 'filter-confirm-modal';
            document.body.appendChild(modalContainer);
        }
        
        // Create the modal content
        const modalHTML = `
            <div class="filter-confirm-content">
                <div class="filter-confirm-header">
                    <h3>Confirm Your Filters</h3>
                    <span class="close-filter-modal">&times;</span>
                </div>
                <div class="filter-confirm-body">
                    <p>You're about to apply the following filters:</p>
                    <div class="filter-summary">
                        ${createFilterSummary(filters)}
                    </div>
                    <div class="filter-edit-section">
                        <h4>Edit Filters</h4>
                        <div class="filter-edit-container">
                            ${createEditableFilters(filters)}
                        </div>
                    </div>
                </div>
                <div class="filter-confirm-footer">
                    <button class="cancel-filter-btn">Cancel</button>
                    <button class="apply-filter-btn">Apply Filters</button>
                </div>
            </div>
        `;
        
        modalContainer.innerHTML = modalHTML;
        modalContainer.style.display = 'flex';
        
        // Add event listeners
        const closeBtn = modalContainer.querySelector('.close-filter-modal');
        const cancelBtn = modalContainer.querySelector('.cancel-filter-btn');
        const applyBtn = modalContainer.querySelector('.apply-filter-btn');
        
        closeBtn.addEventListener('click', () => {
            modalContainer.style.display = 'none';
        });
        
        cancelBtn.addEventListener('click', () => {
            modalContainer.style.display = 'none';
        });
        
        applyBtn.addEventListener('click', () => {
            // Get updated filters from the editable sections
            const updatedFilters = getUpdatedFiltersFromModal();
            
            // Save and apply the updated filters
            applyFiltersAndNavigate(updatedFilters);
            
            // Close the modal
            modalContainer.style.display = 'none';
        });
        
        // Add event listeners for the editable filter tags
        setupEditableFilterTags(modalContainer);
    }

    function createFilterSummary(filters) {
        let summary = '';
        
        if (filters.breed.length > 0) {
            summary += `<div class="filter-group-summary">
                <h5>Breed:</h5>
                <div class="filter-tags">${filters.breed.map(b => `<span class="filter-tag">${b}</span>`).join('')}</div>
            </div>`;
        }
        
        if (filters.age.length > 0) {
            summary += `<div class="filter-group-summary">
                <h5>Age:</h5>
                <div class="filter-tags">${filters.age.map(a => {
                    const [min, max] = a.split('-');
                    let ageText = '';
                    if (min === '0') ageText = 'Puppy (0-1 years)';
                    else if (min === '1') ageText = 'Young (1-3 years)';
                    else if (min === '3') ageText = 'Adult (3-7 years)';
                    else if (min === '7') ageText = 'Senior (7+ years)';
                    return `<span class="filter-tag">${ageText}</span>`;
                }).join('')}</div>
            </div>`;
        }
        
        if (filters.size.length > 0) {
            summary += `<div class="filter-group-summary">
                <h5>Size:</h5>
                <div class="filter-tags">${filters.size.map(s => `<span class="filter-tag">${s}</span>`).join('')}</div>
            </div>`;
        }
        
        if (filters.location.length > 0) {
            summary += `<div class="filter-group-summary">
                <h5>Location:</h5>
                <div class="filter-tags">${filters.location.map(l => {
                    const [min, max] = l.split('-');
                    let locText = '';
                    if (min === '0') locText = 'Under 2 miles';
                    else if (min === '2') locText = '2-5 miles';
                    else if (min === '5') locText = '5+ miles';
                    return `<span class="filter-tag">${locText}</span>`;
                }).join('')}</div>
            </div>`;
        }
        
        if (filters.experience.length > 0) {
            summary += `<div class="filter-group-summary">
                <h5>Owner Experience:</h5>
                <div class="filter-tags">${filters.experience.map(e => `<span class="filter-tag">${e}</span>`).join('')}</div>
            </div>`;
        }
        
        if (filters.personality.length > 0) {
            summary += `<div class="filter-group-summary">
                <h5>Personality:</h5>
                <div class="filter-tags">${filters.personality.map(p => `<span class="filter-tag">${p}</span>`).join('')}</div>
            </div>`;
        }
        
        return summary || '<p>No filters selected</p>';
    }

    function createEditableFilters(filters) {
        let editableHTML = '';
        
        // Create editable sections for each filter category
        const categories = [
            { name: 'Breed', key: 'breed' },
            { name: 'Age', key: 'age', transform: transformAgeForDisplay },
            { name: 'Size', key: 'size' },
            { name: 'Location', key: 'location', transform: transformLocationForDisplay },
            { name: 'Owner Experience', key: 'experience' },
            { name: 'Personality', key: 'personality' }
        ];
        
        categories.forEach(category => {
            const values = filters[category.key];
            if (values && values.length > 0) {
                editableHTML += `
                    <div class="editable-filter-group" data-filter-type="${category.key}">
                        <h5>${category.name}:</h5>
                        <div class="editable-filter-tags">
                            ${values.map(value => {
                                const displayValue = category.transform ? category.transform(value) : value;
                                return `<span class="editable-filter-tag" data-value="${value}">
                                    ${displayValue} <span class="remove-filter">×</span>
                                </span>`;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
        });
        
        return editableHTML || '<p>No filters to edit</p>';
    }

    function transformAgeForDisplay(ageRange) {
        const [min, max] = ageRange.split('-');
        if (min === '0') return 'Puppy (0-1 years)';
        if (min === '1') return 'Young (1-3 years)';
        if (min === '3') return 'Adult (3-7 years)';
        if (min === '7') return 'Senior (7+ years)';
        return ageRange;
    }

    function transformLocationForDisplay(locationRange) {
        const [min, max] = locationRange.split('-');
        if (min === '0') return 'Under 2 miles';
        if (min === '2') return '2-5 miles';
        if (min === '5') return '5+ miles';
        return locationRange;
    }

    function setupEditableFilterTags(modalContainer) {
        const removeBtns = modalContainer.querySelectorAll('.remove-filter');
        
        removeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tag = this.parentElement;
                tag.remove();
            });
        });
    }

    function getUpdatedFiltersFromModal() {
        const updatedFilters = {
            breed: [],
            age: [],
            size: [],
            location: [],
            experience: [],
            personality: []
        };
        
        const filterGroups = document.querySelectorAll('.editable-filter-group');
        
        filterGroups.forEach(group => {
            const filterType = group.getAttribute('data-filter-type');
            const tags = group.querySelectorAll('.editable-filter-tag');
            
            tags.forEach(tag => {
                const value = tag.getAttribute('data-value');
                if (value) {
                    updatedFilters[filterType].push(value);
                }
            });
        });
        
        return updatedFilters;
    }

    function applyFiltersAndNavigate(filters) {
        const currentSeason = document.querySelector('#season-selector')?.value || 'default';
        
        // Save filters to both storage locations with consistent formats
        localStorage.setItem(`dogFilters_${currentSeason}`, JSON.stringify(filters));
        
        const queryParams = new URLSearchParams();
        if (currentSeason && currentSeason !== 'default') {
            queryParams.append('season', currentSeason);
        }
        
        // Create the activeFilters object
        const activeFilters = {};
        
        // Add each filter type to query params and activeFilters
        if (filters.breed.length > 0) {
            queryParams.append('breed', filters.breed.join(','));
            activeFilters.breed = filters.breed.join(',');
        }
        if (filters.age.length > 0) {
            queryParams.append('age', filters.age.join(','));
            activeFilters.age = filters.age.join(',');
        }
        if (filters.size.length > 0) {
            queryParams.append('size', filters.size.join(','));
            activeFilters.size = filters.size.join(',');
        }
        if (filters.location.length > 0) {
            queryParams.append('location', filters.location.join(','));
            activeFilters.location = filters.location.join(',');
        }
        if (filters.experience.length > 0) {
            queryParams.append('experience', filters.experience.join(','));
            activeFilters.experience = filters.experience.join(',');
        }
        if (filters.personality.length > 0) {
            queryParams.append('temperament', filters.personality.join(','));
            activeFilters.temperament = filters.personality.join(',');
        }
        
        // Store active filters
        localStorage.setItem('activeFilters', JSON.stringify(activeFilters));
        console.log("Saved activeFilters:", JSON.stringify(activeFilters));
        
        // Navigate back to home page
        window.location.href = 'index.html' + (queryParams.toString() ? '?' + queryParams.toString() : '');
    }
});