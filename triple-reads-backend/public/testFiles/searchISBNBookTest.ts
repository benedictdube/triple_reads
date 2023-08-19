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

const searchForBook = document.getElementById('search-form') as HTMLFormElement;

searchForBook.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const isbn = document.getElementById('isbn') as HTMLInputElement;
  const url = `/books/${isbn.value}`;
  
  try {
      const response = await fetch(url);
      const bookData = await response.json();
      
      const bookDetails = document.getElementById('book-details') as HTMLDivElement;
      if (response.ok) {
          bookDetails.innerHTML = `
              <h2>${bookData.title.value}</h2>
              <p><strong>ISBN:</strong> ${bookData.isbn.value}</p>
              <p><strong>Date Published:</strong> ${bookData.datePublished.value}</p>
              <p><strong>Abstract:</strong> ${bookData.abstract.value}</p>
              <p><strong>Author:</strong> ${bookData.authorName.value}</p>
              <p><strong>Genre:</strong> ${bookData.genreName.value}</p>
              <p><strong>Publisher:</strong> ${bookData.publisher.value}</p>
              <img src="${bookData.image.value}" alt="Book Cover">
          `;
      } else {
          bookDetails.innerHTML = `<p>Book not found.</p>`;
      }
  } catch (error) {
      console.error('Error retrieving book:', error);
  }
});
