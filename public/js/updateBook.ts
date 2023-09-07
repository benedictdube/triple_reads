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

const bookCover = "https://via.placeholder.com/200x300.png?text=Book+Cover";

const routeUrl = new URL(window.location.href);
const isbn = routeUrl.searchParams.get('isbn');

document.addEventListener("DOMContentLoaded", function () {
    fetchAndDisplayBookDetails();

    async function fetchAndDisplayBookDetails() {
        const url = `/book/${isbn}`;

        try {
            const response = await fetch(url);
            const bookData = await response.json();

            if (response.ok) {
                const isbnValue = document.getElementById('isbnValue') as HTMLInputElement;
                isbnValue.value = bookData.isbn;

                const bookTitleInput = document.getElementById('bookTitleInput') as HTMLInputElement;
                bookTitleInput.value = bookData.title;

                for (let index = 0; index < bookData.authors.length; index++) {
                    if (index > 0) {
                        createInputAuthorBox(index);
                    }

                    let authorInput = document.getElementById('authorInputValue') as HTMLInputElement;

                    if (index !== 0) {
                        authorInput = document.getElementById('authorInputValue' + index) as HTMLInputElement;
                        authorInput.value = bookData.authors[index];
                    }
                    else {
                        authorInput.value = bookData.authors[index];
                    }
                }

                for (let index = 0; index < bookData.genres.length; index++) {
                    if (index > 0) {
                        createInputGenereBox(index);
                    }

                    let genreInput = document.getElementById('genreInputValue') as HTMLInputElement;

                    if (index !== 0) {
                        genreInput = document.getElementById('genreInputValue' + index) as HTMLInputElement;
                        genreInput.value = bookData.genres[index];
                    }
                    else {
                        genreInput.value = bookData.genres[index];
                    }
                }

                const publisherInput = document.getElementById('publisherInput') as HTMLInputElement;
                publisherInput.value = bookData.publisher;

                const publishedInput = document.getElementById('publishedInput') as HTMLInputElement;
                publishedInput.value = bookData.publishedYear;

                const coverUrlInput = document.getElementById('coverUrlInput') as HTMLTextAreaElement;
                coverUrlInput.value = bookData.image;

                const coverUrlImgInput = document.getElementById('coverUrlImgInput') as HTMLImageElement;
                coverUrlImgInput.src = bookData.image;

                const abstractInput = document.getElementById('abstractInput') as HTMLTextAreaElement;
                abstractInput.value = bookData.abstract;

            } else {
                showSuccessPopup("Book not found with that ISBN");
            }
        } catch (error) {
            showSuccessPopup("Error fetching book details");
        }
    }

    const form = document.getElementById("updateBookForm") as HTMLElement;
    const bookTitleInput = document.getElementById("bookTitleInput") as HTMLInputElement;
    let inputAuthorBoxes = (document.getElementById("authoursInput") as HTMLElement)?.querySelectorAll(".authorInput");
    let inputGenreBoxes = (document.getElementById("genresInput") as HTMLInputElement)?.querySelectorAll(".genreInput");
    const publisherInput = document.getElementById("publisherInput") as HTMLInputElement;
    const publishedInput = document.getElementById("publishedInput") as HTMLInputElement;
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


    function createInputAuthorBox(index: number) {
        const mainBox = document.getElementById("authoursInput") as HTMLElement;

        // new input 
        const inputBox = document.createElement("input");
        inputBox.setAttribute("type", "text");

        if (index === 0) {
            inputBox.setAttribute("id", "authorInputValue");
        }
        else {
            const idName = "authorInputValue" + index;
            inputBox.setAttribute("id", idName);
        }

        inputBox.setAttribute("class", "input-add authorInput");

        mainBox?.appendChild(inputBox);

        // new button
        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("type", "button");
        deleteBtn.setAttribute("id", "deleteAuthor");
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("class", "btn delete-btn");
        deleteBtn.addEventListener("click", function () {
            mainBox?.removeChild(inputBox);
            mainBox?.removeChild(deleteBtn);
        });

        inputBox.addEventListener("blur", function () {
            validateAuthorBox(inputBox);
        });

        mainBox?.appendChild(deleteBtn);
    }

    function createInputGenereBox(index: number) {
        const mainBox = document.getElementById("genresInput") as HTMLElement;

        // new input 
        const inputBox = document.createElement("input");
        inputBox.setAttribute("type", "text");
        if (index === 0) {
            inputBox.setAttribute("id", "genreInputValue");
        }
        else {
            const idName = "genreInputValue" + index;
            inputBox.setAttribute("id", idName);
        }
        mainBox?.appendChild(inputBox);

        inputBox.setAttribute("class", "input-add genreInput");


        // new button
        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("type", "button");
        deleteBtn.setAttribute("id", "deleteGenre");
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("class", "btn delete-btn");
        deleteBtn.addEventListener("click", function () {
            mainBox?.removeChild(inputBox);
            mainBox?.removeChild(deleteBtn);
        });

        inputBox.addEventListener("blur", function () {
            validateGenreBox(inputBox);
        })

        mainBox?.appendChild(deleteBtn);
    }

    async function submitUpdateBook() {
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

        // get input value (cover url)
        const coverUrl = validateCoverUrl();

        // get input value (abstract)
        const abstractInput = document.getElementById("abstractInput") as HTMLInputElement;
        const abstract = abstractInput.value as string;

        updateBook(bookTitle, authors, genres, publisher, published, coverUrl, abstract);
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

    function validateCoverUrl() {
        const coverUrl = coverUrlInput.value as string;
        if (coverUrl == "") {
            coverUrlInput.setCustomValidity("Please enter a cover URL");
            coverUrlInput.reportValidity();
            setCoverImgInput(bookCover);
            return "";
        }
        else if (!isValidURL(coverUrl as string)) {
            coverUrlInput.setCustomValidity("Please enter a valid cover URL");
            coverUrlInput.reportValidity();
            setCoverImgInput(bookCover);
            return "";
        }
        else if (!checkImageUrl(coverUrl)) {
            coverUrlInput.setCustomValidity("Please enter a valid image");
            coverUrlInput.reportValidity();
            setCoverImgInput(bookCover);
            return "";
        }

        setCoverImgInput(coverUrlInput.value);

        return coverUrl;
    }

    function setCoverImgInput(src: string) {
        const coverUrlImgInput = document.getElementById("coverUrlImgInput") as HTMLImageElement;
        coverUrlImgInput.src = src;
    }

    async function updateBook(bookTitle: string, authors: string[], genres: string[], publisher: string, published: string, coverUrl: string, abstract: string) {
        //Need to get logged in admin to add to book and the isbn       

        const admin = localStorage.getItem("email") as string;

        const bookAdded = await updateBookCall(bookTitle, authors, genres, publisher, published, coverUrl, abstract, admin);


        if (bookAdded) {
            showSuccessPopup("Book updated successfully!");
            window.location.href = `viewBook.html?isbn=${isbn}`;
        }
        else {
            showSuccessPopup("Book failed to update!");
        }

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

    coverUrlInput.addEventListener("input", function () {
        coverUrlInput.setCustomValidity("");
    });

    coverUrlInput.addEventListener("blur", function () {
        validateCoverUrl();
    });

    const initialAddAuthorBtn = document.getElementById("addAuthor") as HTMLButtonElement;
    initialAddAuthorBtn.addEventListener("click", function () {
        createInputAuthorBox(0);
    });

    const initialAddGenreBtn = document.getElementById("addGenre") as HTMLButtonElement;
    initialAddGenreBtn.addEventListener("click", function () {
        createInputGenereBox(0);
    });

    const submitBtn = document.getElementById("submitUpdateBookForm") as HTMLButtonElement;
    submitBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        submitUpdateBook();
    });

    async function updateBookCall(bookTitle: string, authors: string[], genres: string[], publisher: string, published: string, coverUrl: string, abstract: string, admin: string) {
        const requestBody = {
            title: bookTitle,
            isbn: isbn,
            abstract: abstract,
            image: coverUrl,
            authors,
            genres,
            publisher: publisher,
            admin: admin,
            datePublished: published,
        };        

        try {
            const response = await fetch('/book', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
})
