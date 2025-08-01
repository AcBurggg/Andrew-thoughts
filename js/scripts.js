document.addEventListener('DOMContentLoaded', function() {
    const genreFilter = document.getElementById('genreFilter');
    const sortBy = document.getElementById('sortBy');
    const bookContainer = document.getElementById('bookContainer');
    
    if (!genreFilter || !sortBy || !bookContainer) return; // Exit if elements don't exist
    
    let allBooks = Array.from(bookContainer.children);
    
    function filterAndSort() {
        const selectedGenre = genreFilter.value;
        const selectedSort = sortBy.value;
        
        // Filter books
        let filteredBooks = allBooks.filter(book => {
            if (selectedGenre === 'all') return true;
            return book.dataset.genre === selectedGenre;
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
                    return bValue - aValue; // Sort ratings high to low
                default:
                    return 0;
            }
            
            return aValue > bValue ? 1 : -1;
        });
        
        // Clear container and add filtered/sorted books
        bookContainer.innerHTML = '';
        filteredBooks.forEach(book => bookContainer.appendChild(book));
    }
    
    // Add event listeners
    genreFilter.addEventListener('change', filterAndSort);
    sortBy.addEventListener('change', filterAndSort);
});