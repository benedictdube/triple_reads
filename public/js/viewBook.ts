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
    function showSuccessPopup(message: string, showButton: string) {
        const successMessage = document.getElementById("successMessage") as HTMLParagraphElement;
        successMessage.textContent = message;
        modal.style.display = "block";

        if (showButton.length > 0) {
            closeButton.addEventListener("click", () => {
                window.location.href = showButton;
            });
        }
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

    const backButton = document.getElementById("backButton") as HTMLButtonElement;
    backButton.addEventListener("click", function() {
        history.back();
    });

    const routeUrl = new URL(window.location.href);
    const isbn = routeUrl.searchParams.get('isbn') as string;

    if (localStorage.getItem("email")) {
        // User is logged in, show the buttons
        var btnClasses = ["delete-btn", "submit-btn"];
        var btnNames = ["Delete", "Edit"];
        
        const leftSection = document.getElementById("leftSection") as HTMLElement;

        btnNames.forEach((btnName, index) => {
            const btn = document.createElement("button") as HTMLButtonElement;
            btn.type = "button";
            btn.classList.add("btn");
            btn.classList.add(btnClasses[index]);
            btn.textContent = btnName;

            if (btnName == "Edit") {
                btn.addEventListener("click", () => {
                    window.location.href = `updateBook.html?isbn=${isbn}`;
                });
            }
            leftSection.appendChild(btn);
        });
    }

    try {
        const leftSection = document.getElementById("leftSection") as HTMLElement;
        const rightSection = document.getElementById("rightSection") as HTMLElement;
        const book = await getBook(isbn) as unknown as Book;
        if (!validateIsbnNumber(isbn) || typeof book === 'string') {
            showSuccessPopup("Invalid ISBN", "index.html");
            return;
        }
        else {
            leftSection.style.display = "flex";
            rightSection.style.display = "block";
        }
        
        if (book)
        {
            const coverBook = document.getElementById("coverBook") as HTMLImageElement;
            coverBook.src = book.image;

            const bookTitle = document.getElementById("bookTitle") as HTMLHeadingElement;
            bookTitle.textContent = book.title;

            const authors = document.getElementById("authors") as HTMLHeadingElement;
            authors.textContent = book.authors.toString().replace(',', ', ');

            const isbn = document.getElementById("isbn") as HTMLParagraphElement;
            isbn.textContent = "ISBN: " + book.isbn;

            const genres = document.getElementById("genres") as HTMLParagraphElement;
            genres.textContent = "Genre: " + book.genres.toString().replace(',', ', ');

            const publishInfo = document.getElementById("publishInfo") as HTMLParagraphElement;
            publishInfo.textContent = "Published By " + book.publisher + ", " + book.publishedYear + ".";

            const abstract = document.getElementById("abstract") as HTMLParagraphElement;
            abstract.textContent = book.abstract;
        }
    }
    catch (error) {
        showSuccessPopup(error as string, "");
    }

    async function getBook(isbn: string) : Promise<Book>{
        const response = await fetch(`/book/${isbn}`, {
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
                return response.text();
            }
        })
        .catch(function (error) {
            throw error;
        });

        return response; 
    }

    // Delete popup logic
    const btnDelete = document.getElementsByClassName("delete-btn").item(0) as HTMLButtonElement || document.createElement("button");
    const popupContent = document.getElementById("popupContent") as HTMLElement;
    const btnContinue = document.getElementById("continueDelete") as HTMLElement;
    const btnCancel = document.getElementById("cancelDelete") as HTMLElement;
    const errorParagraph = document.getElementById('errorMessage') as HTMLElement;    

    btnDelete.onclick = () =>{
        popupContent.style.display = "block";
    }

    btnContinue.addEventListener("click", async () =>{
        try {
            const delMsg = await deleteBook();
            if (delMsg["message"]) {
                popupContent.style.display = "none";
                window.location.href = "index.html";
            }
            else {
                errorParagraph.style.display = "block";
                errorParagraph.textContent = delMsg["error"];
            }
        } 
        catch(error) {
            errorParagraph.style.display = "block";
                errorParagraph.textContent = error as string;
        }
    });

    btnCancel.onclick = () => {
        popupContent.style.display = "none";
        errorParagraph.style.display = "none";
        errorParagraph.textContent = "";
    }

    function validateIsbnNumber(isbn: string): boolean {
        const isbn10Pattern = /^(?:\d[\ |-]?){9}[\d|X]$/;
        const isbn13Pattern = /^(?=(?:\D*\d){13}\D*$)(\d[\ |-]?){13}$/;
    
        return isbn10Pattern.test(isbn) || isbn13Pattern.test(isbn);
    }

    async function deleteBook() {
        const response = await fetch(`/book/${isbn}`, {
            method: 'DELETE',
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
})