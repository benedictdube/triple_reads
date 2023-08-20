document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("addBookForm") as HTMLElement;
    const bookTitleInput = document.getElementById("bookTitleInput") as HTMLInputElement;
    let inputAuthorBoxes = (document.getElementById("authoursInput") as HTMLElement)?.querySelectorAll(".authorInput");
    let inputGenreBoxes = (document.getElementById("genresInput") as HTMLInputElement)?.querySelectorAll(".genreInput");
    const publisherInput = document.getElementById("publisherInput") as HTMLInputElement;
    const publishedInput = document.getElementById("publishedInput") as HTMLInputElement;
    const IsbnInput = document.getElementById("IsbnInput") as HTMLInputElement;
    const coverUrlInput = document.getElementById("coverUrlInput") as HTMLInputElement; 

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


    function createInputAuthorBox() {
        const mainBox = document.getElementById("authoursInput") as HTMLElement;

        // new input 
        const inputBox = document.createElement("input");
        inputBox.setAttribute("type", "text");
        inputBox.setAttribute("class", "input-add authorInput");
        mainBox?.appendChild(inputBox);

        // new button
        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("type", "button");
        deleteBtn.setAttribute("id", "deleteAuthor");
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("class", "btn delete-btn");
        deleteBtn.addEventListener("click", function() {
            mainBox?.removeChild(inputBox);
            mainBox?.removeChild(deleteBtn);
        });

        inputBox.addEventListener("blur", function () {
            validateAuthorBox(inputBox);
        });

        mainBox?.appendChild(deleteBtn);

        inputBox.focus();
    }

    function createInputGenereBox() {
        const mainBox = document.getElementById("genresInput") as HTMLElement;

        // new input 
        const inputBox = document.createElement("input");
        inputBox.setAttribute("type", "text");
        inputBox.setAttribute("class", "input-add genreInput");
        mainBox?.appendChild(inputBox);

        // new button
        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("type", "button");
        deleteBtn.setAttribute("id", "deleteGenre");
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("class", "btn delete-btn");
        deleteBtn.addEventListener("click", function() {
            mainBox?.removeChild(inputBox);
            mainBox?.removeChild(deleteBtn);
        });

        inputBox.addEventListener("blur", function () {
            validateGenreBox(inputBox);
        })

        mainBox?.appendChild(deleteBtn);

        inputBox.focus();
    }

    async function submitAddBook() {
        let error = false as boolean;

        // get input value (book title)
        const bookTitle = validateBookTitle();

        // get input value (author)
        inputAuthorBoxes = (document.getElementById("authoursInput") as HTMLElement)?.querySelectorAll(".authorInput");
        const authors: string[] = [];
        inputAuthorBoxes.forEach((inputBox) => {
            if (inputBox instanceof HTMLInputElement) {
                const authorValue = validateAuthorBox(inputBox) as string;
                if (authorValue == "") {
                    error = true;
                    return;
                }
                else {
                    authors.push(authorValue);
                }
            }
        });

        if (error)
            return;

        // get input value (genre)
        inputGenreBoxes = (document.getElementById("genresInput") as HTMLInputElement)?.querySelectorAll(".genreInput");
        const genres: string[] = [];
        inputGenreBoxes.forEach((inputBox) => {
            if (inputBox instanceof HTMLInputElement) {
                const genreValue = validateGenreBox(inputBox) as string;
                if (genreValue == "") {
                    error = true;
                    return;
                }
                else {
                    genres.push(genreValue);
                }
            }
        });

        if (error) 
            return;

        // get input value (publisher)
        const publisher = validatePublisher();

        // get input value (published in)
        const published = validatePublished();

        // get input value (isbn number)
        const isbn = validateIsbn();

        // get input value (cover url)
        const coverUrl = validateCoverUrl();

        // get input value (abstract)
        const abstractInput = document.getElementById("abstractInput") as HTMLInputElement;
        const abstract = abstractInput.value as string;
    
        const addedBook = addBook(bookTitle, authors, genres, publisher, published, isbn, coverUrl, abstract);
        if (addedBook) {
            // show success message
            showSuccessPopup("Book added successfully!");
            // TODO: redirect to view full page
        }
        else {
            // show failure
            showSuccessPopup("Book failed to add!");

        }
    }

    function isValidYear(input: string): boolean {
        const year = parseInt(input, 10);
        const currentYear = new Date().getFullYear();
    
        return !isNaN(year) && year >= 1000 && year <= currentYear;
    }

    function isValidURL(input: string): boolean {
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        return urlPattern.test(input);
    }

    function validateIsbnNumber(isbn: string): boolean {
        const isbn10Pattern = /^(?:\d[\ |-]?){9}[\d|X]$/;
        const isbn13Pattern = /^(?=(?:\D*\d){13}\D*$)(\d[\ |-]?){13}$/;
    
        return isbn10Pattern.test(isbn) || isbn13Pattern.test(isbn);
    }

    function checkImageUrl(url: string) {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
      
          img.onload = function () {
            resolve(true); // Image loaded successfully
          };
      
          img.onerror = function () {
            resolve(false); // Error loading image
          };
        });
    }

    function validateBookTitle() {
        const bookTitle = bookTitleInput.value as string;
        if (bookTitle == "") {
            bookTitleInput.setCustomValidity("Please enter a book title");
            bookTitleInput.reportValidity();
            return "";
        }
        return bookTitle;
    }

    function validateAuthorBox(inputBox: HTMLInputElement) {
        const authorValue = (inputBox as HTMLInputElement).value.trim() as string;
        if (authorValue == "") {
            inputBox.setCustomValidity("Please enter a book author");
            inputBox.reportValidity();
            return;
        }
        return authorValue;
    }

    function validateGenreBox(inputBox: HTMLInputElement) {
        const genreValue = (inputBox as HTMLInputElement).value.trim() as string;
        if (genreValue == "") {
            inputBox.setCustomValidity("Please enter a book genre");
            inputBox.reportValidity();
            return;
        }
        return genreValue;
    }

    function validatePublisher() {
        const publisher = publisherInput.value as string;
        if (publisher == "") {
            publisherInput.setCustomValidity("Please enter a publisher");
            publisherInput.reportValidity();
            return "";
        }
        return publisher;
    }

    function validatePublished() {
        const published = publishedInput.value as string;
        if (published == "") {
            publishedInput.setCustomValidity("Please enter a published yesr");
            publishedInput.reportValidity();
            return "";
        }
        else if (!isValidYear(published as string)) {
            publishedInput.setCustomValidity("Please enter a valid published yesr");
            publishedInput.reportValidity();
            return "";
        }
        return published;
    }

    function validateIsbn(){
        const isbn = IsbnInput.value as string;
        if (isbn == "") {
            IsbnInput.setCustomValidity("Please enter an ISBN number");
            IsbnInput.reportValidity();
            return "";
        }
        else if (!validateIsbnNumber(isbn)) {
            IsbnInput.setCustomValidity("Please enter a valid ISBN number");
            IsbnInput.reportValidity();
            return "";
        }
        return isbn;
    }

    function validateCoverUrl(){
        const coverUrl = coverUrlInput.value as string;
        if (coverUrl == "") {
            coverUrlInput.setCustomValidity("Please enter a cover URL");
            coverUrlInput.reportValidity();
            return "";
        }
        else if (!isValidURL(coverUrl as string)) {
            coverUrlInput.setCustomValidity("Please enter a valid cover URL");
            coverUrlInput.reportValidity();
            return "";
        }
        else if (!checkImageUrl(coverUrl)) {
            coverUrlInput.setCustomValidity("Please enter a valid image");
            coverUrlInput.reportValidity();
            return "";
        }
        const coverUrlImgInput = document.getElementById("coverUrlImgInput") as HTMLImageElement;
        coverUrlImgInput.src = coverUrlInput.value;
        return coverUrl;
    }

    function addBook(bookTitle:string, authors: string[], genres: string[], publisher: string, published: string, isbn: string, coverUrl: string, abstract: string) {
        console.log("book title " + bookTitle);
        console.log("authors " + authors);
        console.log("genres " + genres);
        console.log("publisher " + publisher);
        console.log("published " + published);
        console.log("ISBN number " + isbn);
        console.log("cover url " + coverUrl);
        console.log("abstract " + abstract);

        // TODO: post the book!
        
        return true;
    }

    bookTitleInput.addEventListener("input", function () {
        bookTitleInput.setCustomValidity("");
    });

    bookTitleInput.addEventListener("blur", function () {
        validateBookTitle();
    });

    inputAuthorBoxes.forEach((inputBox) => {
        if (inputBox instanceof HTMLInputElement) {
            inputBox.addEventListener("input", () => {
                inputBox.setCustomValidity("");
                inputBox.reportValidity();
            });

            inputBox.addEventListener("blur", function () {
                validateAuthorBox(inputBox);
            })
        }
    });

    inputGenreBoxes.forEach((inputBox) => {
        if (inputBox instanceof HTMLInputElement) {
            inputBox.addEventListener("input", () => {
                inputBox.setCustomValidity("");
                inputBox.reportValidity();
            });

            inputBox.addEventListener("blur", function () {
                validateGenreBox(inputBox);
            })
        }
    });

    publisherInput.addEventListener("input", function () {
        publisherInput.setCustomValidity("");
    });

    publisherInput.addEventListener("blur", function () {
        validatePublisher();
    });

    publishedInput.addEventListener("input", function () {
        publishedInput.setCustomValidity("");
    });

    publishedInput.addEventListener("blur", function () {
        validatePublished();
    });

    IsbnInput.addEventListener("input", function () {
        IsbnInput.setCustomValidity("");
    });

    IsbnInput.addEventListener("blur", function () {
        validateIsbn();
    });

    coverUrlInput.addEventListener("input", function () {
        coverUrlInput.setCustomValidity("");
    });

    coverUrlInput.addEventListener("blur", function () {
        validateCoverUrl();
    });

    const initialAddAuthorBtn = document.getElementById("addAuthor") as HTMLButtonElement;    
    initialAddAuthorBtn.addEventListener("click", function() {
        createInputAuthorBox();
    });

    const initialAddGenreBtn = document.getElementById("addGenre") as HTMLButtonElement;    
    initialAddGenreBtn.addEventListener("click", function() {
        createInputGenereBox();
    });
    
    const submitBtn = document.getElementById("submitAddBookForm") as HTMLButtonElement;
    submitBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        submitAddBook();
    });

})