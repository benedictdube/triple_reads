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

document.addEventListener("DOMContentLoaded", async function () {
	const submitBtn = document.getElementById("submitSearch") as HTMLButtonElement;
    submitBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        submitSearch();
    });
	
	submitSearch();

	async function submitSearch() {
		const customSelect = document.getElementById("customSelect") as HTMLSelectElement;
		const key = customSelect.options[customSelect.selectedIndex].value as string;

		const searchInfo = document.getElementById("searchInfo") as HTMLInputElement;
		const value = searchInfo.value as string;

		if (key == "abstract") {
			// no validation 
		}

		else if (key == "title") {
			// no validation 
		}

		else if (key == "author") {
			// no validation 
		}

		else if (key == "genre") {
			// no validation 
		}

		else if (key == "publishedYear") {
			if (!isValidYear(value as string)) {
				searchInfo.setCustomValidity("Please enter a valid published yesr");
				searchInfo.reportValidity();
				return "";
			}
		}

		else if (key == "publisher") {
			// no validation 
		}

		else if (key == "isbn") {
			if (!validateIsbnNumber(value as string)) {
				searchInfo.setCustomValidity("Please enter a valid ISBN number");
				searchInfo.reportValidity();
				return "";
			}
		}

		try {
			const grid = document.getElementById("book_grid") as HTMLElement;
			grid.innerHTML = "";
			const books = await searchBooks(key, value) as Book[];
			
			if (books.length == 0) {
				grid.textContent = "No books found";
			}
			else {
				books.forEach(function (book) {
					const link = document.createElement("a");
					const cell = document.createElement("article");
					const cover = document.createElement("img");
					const title = document.createElement("h1");
					const author = document.createElement("h3");	
					
					cell.id = "book_item";
					title.innerText = book.title;
					author.innerText = book.authors.toString().replace(',', ', ');
					
					cover.src = book.image;
					cover.alt = "Book Cover";
					cover.id = "cover";
					cover.width = 200;
					
					cell.appendChild(cover);
					cell.appendChild(title);
					cell.appendChild(author);
					
					link.href = "viewBook.html?isbn=" + book.isbn;
					
					link.appendChild(cell);
					
					grid.appendChild(link);
				});
			}			
		} catch (error) {
			console.error('Error retrieving books:', error);
		}
	}

	async function searchBooks(key: string, value: string){
        const response = await fetch(`/search?${key}=${value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                return response.json();
            }
        })
        .catch(function (error) {
            throw error;
        });

        return response; 
    }

	function isValidYear(input: string): boolean {
        const year = parseInt(input, 10);
        const currentYear = new Date().getFullYear();
    
        return !isNaN(year) && year >= 1000 && year <= currentYear;
    }

	function validateIsbnNumber(isbn: string): boolean {
        const isbn10Pattern = /^(?:\d[\ |-]?){9}[\d|X]$/;
        const isbn13Pattern = /^(?=(?:\D*\d){13}\D*$)(\d[\ |-]?){13}$/;
    
        return isbn10Pattern.test(isbn) || isbn13Pattern.test(isbn);
    }
})