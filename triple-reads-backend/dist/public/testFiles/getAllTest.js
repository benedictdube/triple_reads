"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getAllBooks = document.getElementById('getAllBooks');
const resultDiv = document.getElementById('result');
getAllBooks.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('/books');
        const data = yield response.json();
        displayBooks(data);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}));
function createBookElement(book) {
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
    bookDiv.appendChild(bookDetails);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteBook(book));
    bookDetails.appendChild(deleteButton);
    bookDiv.appendChild(bookDetails);
    return bookDiv;
}
function displayBooks(books) {
    resultDiv.innerHTML = '';
    books.forEach((book) => {
        const bookElement = createBookElement(book);
        resultDiv.appendChild(bookElement);
    });
}
function deleteBook(book) {
    console.log("Delete Book");
}
