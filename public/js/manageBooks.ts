interface Book {
    title: string;
    isbn: string;
    publishedYear: string;
    abstract: string;
    image: string;
    publisher: string;
    authors: string[];
    genres: string[];
    adminEmail: string;
  }

document.addEventListener("DOMContentLoaded", async function () {
    // Get the modal and close button
    const modal = document.getElementById("successModal") as HTMLElement;
    const closeButton = document.querySelector(".close") as HTMLSpanElement;

    // Function to show the modal with a success message
    function showSuccessPopup(message: string) {
        const successMessage = document.getElementById("successMessage") as HTMLParagraphElement;
        successMessage.textContent = message;
        modal.style.display = "block";
    }

    // Close the modal when the close button is clicked
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    // Close the modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    if (localStorage.getItem("email")) {
        // User is logged in, show the page
        const bookGrid = document.getElementById('book_grid');
        if (bookGrid) {
            bookGrid.style.display = "grid";
        }
    }
    else {
        // User is not logged in, optionally show a message or redirect to the login page
        const loginMessage = document.getElementById('successModal');
        if (loginMessage) {
            loginMessage.style.display = 'block';
            showSuccessPopup("You are not logged in");
        }
    }


	const grid = document.getElementById("book_grid") as HTMLElement;
	
    try {
        const books = await searchBooks() as Book[];

        books.forEach(function (book) {
            const cell = document.createElement("article") as HTMLElement;
            const cover = document.createElement("img") as HTMLImageElement;
            const title = document.createElement("h1") as HTMLHeadingElement;
            const author = document.createElement("h3") as HTMLHeadingElement;
            
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
            
            grid.appendChild(cell);
        })
    }
    catch (error) {
        showSuccessPopup(error as string);
    }

    async function searchBooks(){
        const admin = localStorage.getItem('email');
        const response = await fetch(`/search?adminEmail=${admin}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
            console.log(response);
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
})