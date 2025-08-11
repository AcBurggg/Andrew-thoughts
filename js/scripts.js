document.addEventListener('DOMContentLoaded', function() {
    const genreSelected = document.getElementById('genreSelected');
    const genreOptions = document.getElementById('genreOptions');
    const sortSelected = document.getElementById('sortSelected');
    const sortOptions = document.getElementById('sortOptions');
    const bookContainer = document.getElementById('bookContainer');
    
    if (!genreSelected || !genreOptions || !sortSelected || !sortOptions || !bookContainer) return;
    
    let allBooks = Array.from(bookContainer.children);
    
    // Toggle genre dropdown
    genreSelected.addEventListener('click', function() {
        genreOptions.style.display = genreOptions.style.display === 'block' ? 'none' : 'block';
        sortOptions.style.display = 'none'; // Close sort dropdown
    });
    
    // Toggle sort dropdown
    sortSelected.addEventListener('click', function() {
        sortOptions.style.display = sortOptions.style.display === 'block' ? 'none' : 'block';
        genreOptions.style.display = 'none'; // Close genre dropdown
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-dropdown')) {
            genreOptions.style.display = 'none';
            sortOptions.style.display = 'none';
        }
    });
    
    // Handle genre checkbox changes
    genreOptions.addEventListener('change', function(e) {
        const checkboxes = genreOptions.querySelectorAll('input[type="checkbox"]');
        const allCheckbox = genreOptions.querySelector('input[value="all"]');
        
        if (e.target.value === 'all') {
            if (e.target.checked) {
                checkboxes.forEach(cb => {
                    if (cb.value !== 'all') cb.checked = false;
                });
            }
        } else {
            if (e.target.checked) {
                allCheckbox.checked = false;
            }
        }
        
        updateSelectedText();
        filterAndSort();
    });
    
    // Handle sort radio button changes
    sortOptions.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            sortSelected.textContent = e.target.nextSibling.textContent.trim();
            sortOptions.style.display = 'none';
            filterAndSort();
        }
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
        const selectedSort = sortOptions.querySelector('input[type="radio"]:checked').value;
        
        // Filter books
        let filteredBooks = allBooks.filter(book => {
            if (selectedGenres.includes('all') || selectedGenres.length === 0) return true;
            
            // Get all genre elements for this book
            const bookGenres = Array.from(book.querySelectorAll('.book-genre')).map(genre => 
                genre.textContent.toLowerCase().trim()
            );
            
            // Check if any selected genre matches any of the book's genres
            return selectedGenres.some(selectedGenre => 
                bookGenres.some(bookGenre => 
                    bookGenre.includes(selectedGenre.toLowerCase()) || 
                    selectedGenre.toLowerCase().includes(bookGenre)
                )
            );
        });
        
        // Sort books (rest remains the same)
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
                    aValue = parseFloat(a.dataset.rating);
                    bValue = parseFloat(b.dataset.rating);
                    return bValue - aValue;
                default:
                    return 0;
            }
            
            return aValue > bValue ? 1 : -1;
        });

        bookContainer.innerHTML = '';
        filteredBooks.forEach(book => bookContainer.appendChild(book));
    }
});