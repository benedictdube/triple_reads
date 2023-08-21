interface Book {
    title: string;
    isbn: string;
    datePublished: string;
    abstract: string;
    image: string;
    publisher: string;
    authors: string[];
    genres: string[];
    adminEmail: string;
}

const searchResultDiv = document.getElementById('result') as HTMLDivElement;
const searchForBookName = document.getElementById('search-form') as HTMLFormElement;

searchForBookName.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name') as HTMLInputElement;
    try {
        const response = await fetch(`/books/search/${name.value}`);
        const data: Book[] = await response.json();
        displaySearchBooks(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});


function createSearchBookElement(book: Book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';

    const bookImage = document.createElement('img');
    bookImage.src = book.image;
    bookImage.alt = 'Book Cover';
    bookDiv.appendChild(bookImage);

    const bookTitle = document.createElement('h2');
    bookTitle.textContent = book.title;
    bookDiv.appendChild(bookTitle);

    const bookDetails = document.createElement('div');
    bookDetails.className = 'book-details';

    const bookIsbn = document.createElement('p');
    bookIsbn.textContent = 'ISBN: ' + book.isbn;
    bookDetails.appendChild(bookIsbn);

    const bookDatePublished = document.createElement('p');
    bookDatePublished.textContent = 'Date Published: ' + book.datePublished;
    bookDetails.appendChild(bookDatePublished);

    const bookAbstract = document.createElement('p');
    bookAbstract.textContent = 'Abstract: ' + book.abstract;
    bookDetails.appendChild(bookAbstract);

    const bookPublisher = document.createElement('p');
    bookPublisher.textContent = 'Publisher: ' + book.publisher;
    bookDetails.appendChild(bookPublisher);

    const bookAuthors = document.createElement('p');
    bookAuthors.textContent = 'Authors: ' + book.authors.join(', ');
    bookDetails.appendChild(bookAuthors);

    const bookGenres = document.createElement('p');
    bookGenres.textContent = 'Genres: ' + book.genres.join(', ');
    bookDetails.appendChild(bookGenres);

    const addedByAdmin = document.createElement('p');
    addedByAdmin.textContent = 'Admin Email: ' + book.adminEmail;
    bookDetails.appendChild(addedByAdmin);

    bookDiv.appendChild(bookDetails);

    bookDiv.appendChild(bookDetails);

    return bookDiv;
}

function displaySearchBooks(books: Book[]) {
    searchResultDiv.innerHTML = '';
    books.forEach((book) => {
        const bookElement = createSearchBookElement(book);
        searchResultDiv.appendChild(bookElement);
    });
}
