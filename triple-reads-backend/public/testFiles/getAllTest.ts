interface Book {
    title: string;
    isbn: string;
    publishedYear: string;
    abstract: string;
    image: string;
    publisher: string;
    authors: string[];
    genres: string[];
  }
  
  const getAllBooks = document.getElementById('getAllBooks') as HTMLButtonElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;
  
  getAllBooks.addEventListener('click', async () => {
    try {
      const response = await fetch('/books');
      const data: Book[] = await response.json();
      displayBooks(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
  

  function createBookElement(book: Book) {
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
    bookDatePublished.textContent = 'Date Published: ' + book.publishedYear;
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
  
    bookDiv.appendChild(bookDetails);
  

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteBook(book));
    bookDetails.appendChild(deleteButton);
  
    bookDiv.appendChild(bookDetails);
  
    return bookDiv;
  }
  
  function displayBooks(books: Book[]) {
    resultDiv.innerHTML = '';
    books.forEach((book) => {
      const bookElement = createBookElement(book);
      resultDiv.appendChild(bookElement);
    });
  }
  
  function deleteBook(book: Book) {
    console.log("Delete Book");
  }
  