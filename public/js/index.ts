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

/*let book_data = [
{
	"title": "Book Title 1",
    "isbn": "978-1234567890",
    "publishedYear": "2023",
    "abstract": "This is the abstract of Book 1.",
    "image": "http://example.com/cover1.jpg",
	"publisher": "Publisher ABC",
	"authors": [
		"John Author",
		"Jane Writer"
	],
	"genres": [
		"Fantasy",
		"Mystery"
	],
	"adminEmail": "admin@example.com"
},
{
	"title": "Book Title 2",
	"isbn": "978-9876543210",
	"publishedYear": "2022",
	"abstract": "This is the abstract of Book 2.",
	"image": "http://example.com/cover2.jpg",
	"publisher": "Publisher XYZ",
	"authors": [
		"John Author"
	],
	"genres": [
		"Fantasy"
	],
	"adminEmail": "admin@example.com"
},
{
	"title": "Book Title 3",
	"isbn": "978-9876543211",
	"publishedYear": "2022",
	"abstract": "This is the abstract of Book 2.",
	"image": "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fimages%2Fanimals%2Fcat&psig=AOvVaw2OZhxun6-jEV9Rm2B4h1md&ust=1692286808055000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOjxmvHB4YADFQAAAAAdAAAAABAE",
	"publisher": "Publisher XYZ",
	"authors": [
		"John Author"
	],
	"genres": [
		"Fantasy"
	],
	"adminEmail": "admin@example.com"
},
{
	"title": "Book Title 4",
	"isbn": "978-9876543212",
	"publishedYear": "2022",
	"abstract": "This is the abstract of Book 3.",
	"image": "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
	"publisher": "Publisher XYZ",
	"authors": [
		"John Author"
	],
	"genres": [
	"Fantasy"
	],
	"adminEmail": "admin@example.com"
}
];*/

document.addEventListener("DOMContentLoaded", async function () {
	const grid = document.getElementById("book_grid") as HTMLElement;
	
	const url = `/books`;

    try {
        const response = await fetch(url);
        const book_data = await response.json();
		
		if (response.ok) {
			for (var i = 0; i < book_data.length; i++)
			{
				const link = document.createElement("a");
				const cell = document.createElement("article");
				const cover = document.createElement("img");
				const title = document.createElement("h1");
				const author = document.createElement("h3");	
				
				cell.id = "book_item";
				title.innerText = book_data[i].title;
				author.innerText = book_data[i].authors.toString();
				cover.src = book_data[i].image;
				cover.alt = "Book Cover";
				cover.id = "cover";
				
				cell.appendChild(cover);
				cell.appendChild(title);
				cell.appendChild(author);
				
				link.href = "viewBook.html?isbn=" + book_data[i].isbn;
				
				link.appendChild(cell);
				
				grid.appendChild(link);
			}	
		} else {
            console.error('Books not found:');
        }
    } catch (error) {
        console.error('Error retrieving books:', error);
    }
})