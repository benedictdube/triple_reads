interface Book {
    title: string;
    isbn: string;
    datePublished: string;
    abstract: string;
    image: string;
    publisher: string;
    authors: string[];
    genres: string[];
}

window.onload = fetchAndDisplayBookDetails;

async function fetchAndDisplayBookDetails() {
    const routeUrl = new URL(window.location.href);

    const isbn = routeUrl.searchParams.get('isbn');

    const url = `/books/${isbn}`;

    try {
        const response = await fetch(url);
        const bookData = await response.json();

        if (response.ok) {
            console.log(bookData);
            const bookTitleInput = document.getElementById('bookTitleInput') as HTMLInputElement;         
            bookTitleInput.value = bookData[0].title;

            // const bookTitleInput = document.getElementById('bookTitleInput') as HTMLInputElement;         
            // bookTitleInput.value = bookData[0].title;

            // const bookTitleInput = document.getElementById('bookTitleInput') as HTMLInputElement;         
            // bookTitleInput.value = bookData[0].title;

            const publisherInput = document.getElementById('publisherInput') as HTMLInputElement;         
            publisherInput.value = bookData[0].publisher;

            const publishedInput = document.getElementById('publishedInput') as HTMLInputElement;         
            publishedInput.value = bookData[0].publishedYear;

            const IsbnInput = document.getElementById('IsbnInput') as HTMLInputElement;         
            IsbnInput.value = bookData[0].isbn;

            const coverUrlInput = document.getElementById('coverUrlInput') as HTMLTextAreaElement;         
            coverUrlInput.value = bookData[0].image;

            const coverUrlImgInput = document.getElementById('coverUrlImgInput') as HTMLImageElement;         
            coverUrlImgInput.src = bookData[0].image;
            
            const abstractInput = document.getElementById('abstractInput') as HTMLTextAreaElement;         
            abstractInput.value = bookData[0].abstract;

        } else {
            console.error('Book not found:');
        }
    } catch (error) {
        console.error('Error retrieving book:', error);
    }
}