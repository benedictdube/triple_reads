"use strict";
// interface Book {
//   title: string;
//   isbn: string;
//   datePublished: string;
//   abstract: string;
//   image: string;
//   publisher: string;
//   authors: string[];
//   genres: string[];
// }
// const getAllBooks = document.getElementById('getAllBooks') as HTMLButtonElement;
// const searchForBook = document.getElementById('search-form') as HTMLFormElement;
// const resultDiv = document.getElementById('result') as HTMLDivElement;
// getAllBooks.addEventListener('click', async () => {
//   try {
//     const response = await fetch('/books');
//     const data: Book[] = await response.json();
//     displayBooks(data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// });
// searchForBook.addEventListener('submit', async function(event) {
//   event.preventDefault();
//   const isbn = document.getElementById('isbn') as HTMLInputElement;
//   const url = `/books/${isbn.value}`;
//   try {
//       const response = await fetch(url);
//       const bookData = await response.json();
//       const bookDetails = document.getElementById('book-details') as HTMLDivElement;
//       if (response.ok) {
//           bookDetails.innerHTML = `
//               <h2>${bookData.title.value}</h2>
//               <p><strong>ISBN:</strong> ${bookData.isbn.value}</p>
//               <p><strong>Date Published:</strong> ${bookData.datePublished.value}</p>
//               <p><strong>Abstract:</strong> ${bookData.abstract.value}</p>
//               <p><strong>Author:</strong> ${bookData.authorName.value}</p>
//               <p><strong>Genre:</strong> ${bookData.genreName.value}</p>
//               <p><strong>Publisher:</strong> ${bookData.publisher.value}</p>
//               <img src="${bookData.image.value}" alt="Book Cover">
//           `;
//       } else {
//           bookDetails.innerHTML = `<p>Book not found.</p>`;
//       }
//   } catch (error) {
//       console.error('Error retrieving book:', error);
//   }
// });
// function createBookElement(book: Book) {
//   const bookDiv = document.createElement('div');
//   bookDiv.className = 'book';
//   const bookImage = document.createElement('img');
//   bookImage.src = book.image;
//   bookImage.alt = 'Book Cover';
//   bookDiv.appendChild(bookImage);
//   const bookTitle = document.createElement('h2');
//   bookTitle.textContent = book.title;
//   bookDiv.appendChild(bookTitle);
//   const bookDetails = document.createElement('div');
//   bookDetails.className = 'book-details';
//   const bookIsbn = document.createElement('p');
//   bookIsbn.textContent = 'ISBN: ' + book.isbn;
//   bookDetails.appendChild(bookIsbn);
//   const bookDatePublished = document.createElement('p');
//   bookDatePublished.textContent = 'Date Published: ' + book.datePublished;
//   bookDetails.appendChild(bookDatePublished);
//   const bookAbstract = document.createElement('p');
//   bookAbstract.textContent = 'Abstract: ' + book.abstract;
//   bookDetails.appendChild(bookAbstract);
//   const bookPublisher = document.createElement('p');
//   bookPublisher.textContent = 'Publisher: ' + book.publisher;
//   bookDetails.appendChild(bookPublisher);
//   const bookAuthors = document.createElement('p');
//   bookAuthors.textContent = 'Authors: ' + book.authors.join(', ');
//   bookDetails.appendChild(bookAuthors);
//   const bookGenres = document.createElement('p');
//   bookGenres.textContent = 'Genres: ' + book.genres.join(', ');
//   bookDetails.appendChild(bookGenres);
//   bookDiv.appendChild(bookDetails);
//   const updateButton = document.createElement('button');
//   updateButton.textContent = 'Update';
//   updateButton.addEventListener('click', () => updateBook(book));
//   bookDetails.appendChild(updateButton);
//   const deleteButton = document.createElement('button');
//   deleteButton.textContent = 'Delete';
//   deleteButton.addEventListener('click', () => deleteBook(book));
//   bookDetails.appendChild(deleteButton);
//   bookDiv.appendChild(bookDetails);
//   return bookDiv;
// }
// function displayBooks(books: Book[]) {
//   resultDiv.innerHTML = '';
//   books.forEach((book) => {
//     const bookElement = createBookElement(book);
//     resultDiv.appendChild(bookElement);
//   });
// }
// function updateBook(book: Book) {
//   console.log("Update Book");
// }
// function deleteBook(book: Book) {
//   console.log("Delete Book");
// }
