document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("addBookForm") as HTMLElement;

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

        mainBox?.appendChild(deleteBtn);
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

        mainBox?.appendChild(deleteBtn);
    }

    const initialAddAuthorBtn = document.getElementById("addAuthor") as HTMLButtonElement;    
    initialAddAuthorBtn.addEventListener("click", function() {
        createInputAuthorBox();
    });

    const initialAddGenreBtn = document.getElementById("addGenre") as HTMLButtonElement;    
    initialAddGenreBtn.addEventListener("click", function() {
        createInputGenereBox();
    });
    
})