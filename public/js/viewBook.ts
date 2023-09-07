interface Book {
    title: string;
    isbn: string;
    datePublished: string;
    abs: string;
    image: string;
    publisher: string;
    authors: string[];
    genres: string[];
}

document.addEventListener("DOMContentLoaded", async function () {
    const routeUrl = new URL(window.location.href);

    const isbnString = routeUrl.searchParams.get('isbn') as String;
	
	const title = document.getElementById("book_title") as HTMLElement;
	const authors = document.getElementById("book_authors") as HTMLElement;
	const isbnBook = document.getElementById("book_isbn") as HTMLElement;
	const genres = document.getElementById("book_genres") as HTMLElement;
	const publishInfo = document.getElementById("book_publishInfo") as HTMLElement;
	const book_ab = document.getElementById("book_abstract") as HTMLElement;
	const cover = document.getElementById("book_cover") as HTMLImageElement;
	isbnBook.innerText = "ISBN: " + isbnString;

    const url = `/books/${isbnString}`;

    try {
        const response = await fetch(url);
        const bookData = await response.json();

        if (response.ok) {
            console.log(bookData);     
            title.innerText = bookData[0].title;
			authors.innerText = bookData[0].authors.toString();
			genres.innerText = bookData[0].genres.toString();
			publishInfo.innerText = bookData[0].publisher;
			book_ab.innerText = bookData[0].abs;
			cover.src = bookData[0].image;

        } else {
            console.error('Book not found:');
        }
    } catch (error) {
        console.error('Error retrieving book:', error);
    }
})