document.addEventListener("DOMContentLoaded", function () {

    const dropdownButton = document.getElementById("dropdownButton") as HTMLButtonElement;
    const dropdownContent = document.getElementById("dropdownContent") as HTMLElement;

    dropdownButton.addEventListener("click", function () {
        dropdownContent.classList.toggle("show");
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener("click", function (event) {
        const targetElement = event.target as Element;

        if (!targetElement.matches("#dropdownButton")) {
            if (dropdownContent.classList.contains("show")) {
                dropdownContent.classList.remove("show");
            }
        }
    });
});
