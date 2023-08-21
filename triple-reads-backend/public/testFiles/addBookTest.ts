const bookForm = document.getElementById('bookForm') as HTMLFormElement;
bookForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(bookForm);

    const authorsInput = formData.get('authors');
    const authorNames = authorsInput ? (authorsInput as string).split(',').map(author => author.trim()) : [];

    const genresInput = formData.get('genres');
    const genreNames = genresInput ? (genresInput as string).split(',').map(genre => genre.trim()) : [];

    const requestBody = {
        title: formData.get('title'),
        isbn: formData.get('isbn'),
        datePublished: formData.get('datePublished'),
        abstract: formData.get('abstract'),
        image: formData.get('image'),
        authorNames,
        genreNames,
        publisher: formData.get('publisher'),
        admin: formData.get('admin'),
        dateAdded: new Date().toISOString(),
    };    

    try {
        const response = await fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            console.log('Book added successfully');
        } else {
            console.error('Failed to add book');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
