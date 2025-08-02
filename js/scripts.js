document.addEventListener('DOMContentLoaded', function() {
    const genreSelected = document.getElementById('genreSelected');
    const genreOptions = document.getElementById('genreOptions');
    const sortBy = document.getElementById('sortBy');
    const bookContainer = document.getElementById('bookContainer');
    
    if (!genreSelected || !genreOptions || !sortBy || !bookContainer) return;
    
    let allBooks = Array.from(bookContainer.children);
    
    // Toggle dropdown
    genreSelected.addEventListener('click', function() {
        genreOptions.style.display = genreOptions.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-dropdown')) {
            genreOptions.style.display = 'none';
        }
    });
    
    // Handle checkbox changes
    genreOptions.addEventListener('change', function(e) {
        const checkboxes = genreOptions.querySelectorAll('input[type="checkbox"]');
        const allCheckbox = genreOptions.querySelector('input[value="all"]');
        
        if (e.target.value === 'all') {
            // If "All" is checked, uncheck others
            if (e.target.checked) {
                checkboxes.forEach(cb => {
                    if (cb.value !== 'all') cb.checked = false;
                });
            }
        } else {
            // If any other checkbox is checked, uncheck "All"
            if (e.target.checked) {
                allCheckbox.checked = false;
            }
        }
        
        updateSelectedText();
        filterAndSort();
    });
    
    function updateSelectedText() {
        const checkedBoxes = genreOptions.querySelectorAll('input[type="checkbox"]:checked');
        const checkedValues = Array.from(checkedBoxes).map(cb => cb.nextSibling.textContent.trim());
        
        if (checkedValues.length === 0 || checkedValues.includes('All Genres')) {
            genreSelected.textContent = 'All Genres';
        } else if (checkedValues.length === 1) {
            genreSelected.textContent = checkedValues[0];
        } else {
            genreSelected.textContent = `${checkedValues.length} genres selected`;
        }
    }
    
    function filterAndSort() {
        const checkedBoxes = genreOptions.querySelectorAll('input[type="checkbox"]:checked');
        const selectedGenres = Array.from(checkedBoxes).map(cb => cb.value);
        const selectedSort = sortBy.value;
        
        // Filter books
        let filteredBooks = allBooks.filter(book => {
            if (selectedGenres.includes('all') || selectedGenres.length === 0) return true;
            return selectedGenres.includes(book.dataset.genre);
        });
        
        // Sort books
        filteredBooks.sort((a, b) => {
            let aValue, bValue;
            
            switch(selectedSort) {
                case 'title':
                    aValue = a.querySelector('.book-title').textContent.toLowerCase();
                    bValue = b.querySelector('.book-title').textContent.toLowerCase();
                    break;
                case 'author':
                    aValue = a.dataset.author;
                    bValue = b.dataset.author;
                    break;
                case 'rating':
                    aValue = parseInt(a.dataset.rating);
                    bValue = parseInt(b.dataset.rating);
                    return bValue - aValue;
                default:
                    return 0;
            }
            
            return aValue > bValue ? 1 : -1;
        });
        
        // Clear container and add filtered/sorted books
        bookContainer.innerHTML = '';
        filteredBooks.forEach(book => bookContainer.appendChild(book));
    }
    
    // Add event listener for sort
    sortBy.addEventListener('change', filterAndSort);
});