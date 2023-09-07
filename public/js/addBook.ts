import * as validations from "./validations";

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("email")) {
        // User is logged in, show the "Add Book" page
        const addBookPage = document.getElementById('addBookForm');
        if (addBookPage) {
            addBookPage.style.display = 'block';
        }
    } else {
        // User is not logged in, optionally show a message or redirect to the login page
        const loginMessage = document.getElementById('successModal');
        if (loginMessage) {
            loginMessage.style.display = 'block';
            validations.showSuccessPopup("You are not logged in", "index.html");
        }
    }

    const bookTitleInput = document.getElementById("bookTitleInput") as HTMLInputElement;
    let inputAuthorBoxes = (document.getElementById("authoursInput") as HTMLElement)?.querySelectorAll(".authorInput");
    let inputGenreBoxes = (document.getElementById("genresInput") as HTMLInputElement)?.querySelectorAll(".genreInput");
    const publisherInput = document.getElementById("publisherInput") as HTMLInputElement;
    const publishedInput = document.getElementById("publishedInput") as HTMLInputElement;
    const IsbnInput = document.getElementById("IsbnInput") as HTMLInputElement;
    const coverUrlInput = document.getElementById("coverUrlInput") as HTMLInputElement; 

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
            validations.validateAuthorBox(inputBox);
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
            validations.validateGenreBox(inputBox);
        })

        mainBox?.appendChild(deleteBtn);

        inputBox.focus();
    }

    async function submitAddBook() {
        let error = false as boolean;

        // get input value (book title)
        const bookTitle = validations.validateBookTitle(bookTitleInput);

        // get input value (author)
        inputAuthorBoxes = (document.getElementById("authoursInput") as HTMLElement)?.querySelectorAll(".authorInput");
        const authors: string[] = [];
        inputAuthorBoxes.forEach((inputBox) => {
            if (inputBox instanceof HTMLInputElement) {
                const authorValue = validations.validateAuthorBox(inputBox) as string;
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
                const genreValue = validations.validateGenreBox(inputBox) as string;
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
        const publisher = validations.validatePublisher(publisherInput);

        // get input value (published in)
        const published = validations.validatePublished(publishedInput);

        // get input value (isbn number)
        const isbn = validations.validateIsbn(IsbnInput);

        // get input value (cover url)
        const coverUrl = validations.validateCoverUrl(coverUrlInput);

        // get input value (abstract)
        const abstractInput = document.getElementById("abstractInput") as HTMLInputElement;
        const abstract = abstractInput.value as string;
    
        try {
            const addedBook = await addBook(bookTitle, authors, genres, publisher, published, isbn, coverUrl, abstract);

            if (addedBook["message"]) {
                // show success message
                validations.showSuccessPopup(addedBook["message"], `viewBook.html?isbn=${isbn}`);
            }
            else {
                // show failure
                validations.showSuccessPopup(addedBook["error"], "");
            }
        }
        catch (error) {
            // show failure
            validations.showSuccessPopup(error as string, "");
        }
    }

    async function addBook(bookTitle:string, authors: string[], genres: string[], publisher: string, published: string, isbn: string, coverUrl: string, abstract: string) {
        const requestBody = {
            title: bookTitle, 
            isbn: isbn, 
            abstract: abstract, 
            image: coverUrl, 
            authors: authors, 
            genres: genres, 
            publisher: publisher, 
            datePublished: published, 
            admin: localStorage.getItem('email')
        }

        const response = await fetch('/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
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

    bookTitleInput.addEventListener("input", function () {
        bookTitleInput.setCustomValidity("");
    });

    bookTitleInput.addEventListener("blur", function () {
        validations.validateBookTitle(bookTitleInput);
    });

    inputAuthorBoxes.forEach((inputBox) => {
        if (inputBox instanceof HTMLInputElement) {
            inputBox.addEventListener("input", () => {
                inputBox.setCustomValidity("");
                inputBox.reportValidity();
            });

            inputBox.addEventListener("blur", function () {
                validations.validateAuthorBox(inputBox);
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
                validations.validateGenreBox(inputBox);
            })
        }
    });

    publisherInput.addEventListener("input", function () {
        publisherInput.setCustomValidity("");
    });

    publisherInput.addEventListener("blur", function () {
        validations.validatePublisher(publisherInput);
    });

    publishedInput.addEventListener("input", function () {
        publishedInput.setCustomValidity("");
    });

    publishedInput.addEventListener("blur", function () {
        validations.validatePublished(publishedInput);
    });

    IsbnInput.addEventListener("input", function () {
        IsbnInput.setCustomValidity("");
    });

    IsbnInput.addEventListener("blur", function () {
        validations.validateIsbn(IsbnInput);
    });

    coverUrlInput.addEventListener("input", function () {
        coverUrlInput.setCustomValidity("");
    });

    coverUrlInput.addEventListener("blur", function () {
        validations.validateCoverUrl(coverUrlInput);
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