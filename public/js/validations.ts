const bookCover = "https://via.placeholder.com/200x300.png?text=Book+Cover";

// Function to show the modal with a success message
export function showSuccessPopup(message: string, showButton: string) {
    // Get the modal and close button
    const modal = document.getElementById("successModal") as HTMLElement;
    const closeButton = document.querySelector(".close") as HTMLSpanElement;

    const successMessage = document.getElementById("successMessage") as HTMLParagraphElement;
    successMessage.textContent = message;
    modal.style.display = "block";

    const popupBtn = document.getElementById("modelBtn") as HTMLButtonElement;
    if (showButton.length > 0) {
        popupBtn.style.display = "initial";
        popupBtn.addEventListener("click", () => {
            window.location.href = showButton;
        });

        closeButton.addEventListener("click", () => {
            window.location.href = showButton;
        });
    }
    else {
        popupBtn.style.display = "none";

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
    }
}

export function validateBookTitle(bookTitleInput: HTMLInputElement) {
    const bookTitle = bookTitleInput.value as string;
    if (bookTitle == "") {
        bookTitleInput.setCustomValidity("Please enter a book title");
        bookTitleInput.reportValidity();
        return "";
    }
    return bookTitle;
}

export function validateAuthorBox(inputBox: HTMLInputElement) {
    const authorValue = (inputBox as HTMLInputElement).value.trim() as string;
    if (authorValue == "") {
        inputBox.setCustomValidity("Please enter a book author");
        inputBox.reportValidity();
        return;
    }
    return authorValue;
}


export function isValidYear(input: string): boolean {
    const year = parseInt(input, 10);
    const currentYear = new Date().getFullYear();

    return !isNaN(year) && year >= 1000 && year <= currentYear;
}

export function isValidURL(input: string): boolean {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(input);
}

export function validateIsbnNumber(isbn: string): boolean {
    const isbn10Pattern = /^(?:\d[\ |-]?){9}[\d|X]$/;
    const isbn13Pattern = /^(?=(?:\D*\d){13}\D*$)(\d[\ |-]?){13}$/;

    return isbn10Pattern.test(isbn) || isbn13Pattern.test(isbn);
}

export function checkImageUrl(url: string) {
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

export function validatePublished(publishedInput: HTMLInputElement) {
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

export function validateIsbn(IsbnInput: HTMLInputElement){
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

export function validateGenreBox(inputBox: HTMLInputElement) {
    const genreValue = (inputBox as HTMLInputElement).value.trim() as string;
    if (genreValue == "") {
        inputBox.setCustomValidity("Please enter a book genre");
        inputBox.reportValidity();
        return;
    }
    return genreValue;
}

export function validatePublisher(publisherInput: HTMLInputElement) {
    const publisher = publisherInput.value as string;
    if (publisher == "") {
        publisherInput.setCustomValidity("Please enter a publisher");
        publisherInput.reportValidity();
        return "";
    }
    return publisher;
}

export function validateCoverUrl(coverUrlInput: HTMLInputElement){
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