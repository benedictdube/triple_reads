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
const searchForBook = document.getElementById('search-form');
searchForBook.addEventListener('submit', function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const isbn = document.getElementById('isbn');
        const url = `/books/${isbn.value}`;
        try {
            const response = yield fetch(url);
            const bookData = yield response.json();
            const bookDetails = document.getElementById('book-details');
            if (response.ok) {
                bookDetails.innerHTML = `
              <h2>${bookData.title.value}</h2>
              <p><strong>ISBN:</strong> ${bookData.isbn.value}</p>
              <p><strong>Date Published:</strong> ${bookData.datePublished.value}</p>
              <p><strong>Abstract:</strong> ${bookData.abstract.value}</p>
              <p><strong>Author:</strong> ${bookData.authorName.value}</p>
              <p><strong>Genre:</strong> ${bookData.genreName.value}</p>
              <p><strong>Publisher:</strong> ${bookData.publisher.value}</p>
              <p><strong>Admin Email:</strong> ${bookData.adminEmail.value}</p>
              <img src="${bookData.image.value}" alt="Book Cover">
          `;
            }
            else {
                bookDetails.innerHTML = `<p>Book not found.</p>`;
            }
        }
        catch (error) {
            console.error('Error retrieving book:', error);
        }
    });
});
