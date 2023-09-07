document.addEventListener("DOMContentLoaded", () =>{
    const btnDelete = document.getElementsByClassName("delete-btn").item(0) as HTMLButtonElement;
    const popupContent = document.getElementById("popupContent") as HTMLElement;
    const btnContinue = document.getElementById("continueDelete") as HTMLElement;
    const btnCancel = document.getElementById("cancelDelete") as HTMLElement;
    
    btnDelete.onclick = () =>{
        popupContent.style.display = "block";
    }

    btnContinue.onclick = () =>{
        const isbn = document.getElementById('isbn') as HTMLElement;
        
        fetch(`/book/${isbn.textContent}`, {method: 'DELETE'})
        .then(response => {
            if (response.ok)
            {
                popupContent.style.display = "none";
                window.location.href = "/";        
            }
            else
                throw Error("Couldn't delete the book");
        })
        .catch(()=>console.error("Couldn't delete the book"));
    }

    btnCancel.onclick = () => {
        popupContent.style.display = "none";
    }

});