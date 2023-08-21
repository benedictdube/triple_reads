
const deleteBookForm = document.getElementById('delete-form') as HTMLFormElement;

deleteBookForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const isbn = document.getElementById('isbn') as HTMLInputElement;    

    try {
        const response = await fetch(`/books/${isbn.value}`, {
            method: 'DELETE',
        });

        const responseData = await response.json();

        if (response.ok) {
            console.log(responseData.message);
        } else {
            console.error('Error deleting book:', responseData.error);
        }
    } catch (error) {
        console.error('Error deleting book:', error);
    }
});
