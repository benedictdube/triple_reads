document.addEventListener("DOMContentLoaded", function () {
	const grid = document.getElementById("book_grid");
	
	let book_data = [{
	image_link: "book-covers-big.jpg",
	title: "Book1",
	author: "Author1"
	},
	{
	image_link: "book-covers-big.jpg",
	title: "Book2",
	author: "Author2"
	},
	{
	image_link: "book-covers-big.jpg",
	title: "Book3",
	author: "Author3"
	},
	{
	image_link: "book-covers-big.jpg",
	title: "Book4",
	author: "Author4"
	},
	{
	image_link: "book-covers-big.jpg",
	title: "Book5",
	author: "Author5"
	},
	{
	image_link: "book-covers-big.jpg",
	title: "Book6",
	author: "Author6"
	}
	];
	
	for (var i = 0; i < book_data.length; i++)
    {
		const cell = document.createElement("article");
		const cover = document.createElement("img");
		const title = document.createElement("h1");
		const author = document.createElement("h3");	
		
		cell.id = "book_item";
		title.innerText = book_data[i].title;
		author.innerText = book_data[i].author;
		cover.src = book_data[i].image_link;
		cover.alt = "Book Cover";
		cover.id = "cover";
		
		cell.appendChild(cover);
		cell.appendChild(title);
		cell.appendChild(author);
		
		grid.appendChild(cell);
	}
})