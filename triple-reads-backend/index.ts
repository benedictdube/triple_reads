import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import querystring from 'querystring';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const fusekiBaseUrl = process.env.FUSEKI_BASE_URL || 'http://localhost:3030/triple-reads';
const fusekiUrl = process.env.FUSEKI_URL || fusekiBaseUrl + '/sparql';
const fusekiUrlUpdate = process.env.FUSEKI_URL_UPDATE || fusekiBaseUrl + '/update';

app.use(express.static('public'));
app.use(express.static('dist/public'));

app.use(express.json());

interface Book {
  title: string;
  isbn: string;
  publishedYear: string;
  abstract: string;
  image: string;
  publisher: string;
  authors: string[];
  genres: string[];
  adminEmail: string;
}

async function getAllBooks() {
  const query = `
    PREFIX schema: <http://schema.org/>
    PREFIX ex: <http://example.org/>
    
    SELECT DISTINCT ?title ?isbn ?publishedYear ?abstract ?image ?authorName ?genreName ?publisher ?adminEmail WHERE {
      ?book a schema:Book ;
        schema:title ?title ;
        schema:isbn ?isbn ;
        schema:publishedYear ?publishedYear ;
        schema:abstract ?abstract ;
        schema:image ?image ;
        schema:author ?author ;
        schema:genre ?genre ;
        schema:publisher ?publisher ;
        ex:addedBy ?admin .
      ?author schema:name ?authorName .
      ?genre schema:name ?genreName .
      ?admin ex:hasEmail ?adminEmail .
    }
  `;
  const response = await axios.get(fusekiUrl, {
    params: {
      query,
    },
  });

  const booksMap = new Map<string, Book>();
  response.data.results.bindings.forEach((bookBinding: any) => {
    const isbn = bookBinding.isbn.value;
    if (!booksMap.has(isbn)) {

      const bookData: Book = {
        title: bookBinding.title.value,
        isbn: isbn,
        publishedYear: bookBinding.publishedYear.value,
        abstract: bookBinding.abstract.value,
        image: bookBinding.image.value,
        publisher: bookBinding.publisher.value,
        authors: [],
        genres: [],
        adminEmail: bookBinding.adminEmail.value
      };
      booksMap.set(isbn, bookData);
    }
    const bookData = booksMap.get(isbn)!;
    if (!bookData.authors.includes(bookBinding.authorName.value)) {
      bookData.authors.push(bookBinding.authorName.value);
    }
    if (!bookData.genres.includes(bookBinding.genreName.value)) {
      bookData.genres.push(bookBinding.genreName.value);
    }
  });
  const booksData = Array.from(booksMap.values());
  return booksData;
}

// Define the endpoints 
app.get('/search', searchBooks);


// GET REQUEST FOR ALL BOOKS
app.get('/books', async (req: Request, res: Response) => {
  try {
    const booksData = await getAllBooks();
    res.json(booksData);
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ error: 'Error retrieving books' });
  }
});

// GET REQUEST FOR ALL BOOKS THAT CONTAIN A STRING IN THE TITLE
app.get('/books/search/:title', async (req: Request, res: Response) => {
  try {
    const encodedSearchString = encodeURIComponent(req.params.title);

    const query = `
      PREFIX schema: <http://schema.org/>
      PREFIX ex: <http://example.org/>
      SELECT DISTINCT ?title ?isbn ?publishedYear ?abstract ?image ?authorName ?genreName ?publisher ?adminEmail WHERE {
        ?book a schema:Book ;
          schema:title ?title ;
          schema:isbn ?isbn ;
          schema:publishedYear ?publishedYear ;
          schema:abstract ?abstract ;
          schema:image ?image ;
          schema:author ?author ;
          schema:genre ?genre ;
          schema:publisher ?publisher .
        ?author schema:name ?authorName .
        ?genre schema:name ?genreName .
        ?admin ex:hasEmail ?adminEmail .
        
        FILTER(contains(lcase(str(?title)), lcase("${encodedSearchString}")))
      }
    `;

    const response = await axios.get(fusekiUrl, {
      params: {
        query,
      },
    });

    const booksMap = new Map<string, Book>();

    response.data.results.bindings.forEach((bookBinding: any) => {
      const isbn = bookBinding.isbn.value;

      if (!booksMap.has(isbn)) {
        const bookData: Book = {
          title: bookBinding.title.value,
          isbn: isbn,
          publishedYear: bookBinding.publishedYear.value,
          abstract: bookBinding.abstract.value,
          image: bookBinding.image.value,
          publisher: bookBinding.publisher.value,
          authors: [],
          genres: [],
          adminEmail: bookBinding.adminEmail.value
        };

        booksMap.set(isbn, bookData);
      }

      // Add author and genre names to the existing book data
      const bookData = booksMap.get(isbn)!;
      if (!bookData.authors.includes(bookBinding.authorName.value)) {
        bookData.authors.push(bookBinding.authorName.value);
      }
      if (!bookData.genres.includes(bookBinding.genreName.value)) {
        bookData.genres.push(bookBinding.genreName.value);
      }
    });

    const booksData = Array.from(booksMap.values());

    res.json(booksData);
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ error: 'Error retrieving books' });
  }
});

//GET REQUEST FOR BOOKS BASED ON ISBN
app.get('/books/:isbn', async (req: Request, res: Response) => {
  try {
    const query = `
      PREFIX schema: <http://schema.org/>
      PREFIX ex: <http://example.org/>

        SELECT DISTINCT ?title ?isbn ?publishedYear ?abstract ?image ?authorName ?genreName ?publisher ?adminEmail WHERE {
          ?book a schema:Book ;
            schema:title ?title ;
            schema:isbn ?isbn ;
            schema:publishedYear ?publishedYear ;
            schema:abstract ?abstract ;
            schema:image ?image ;
            schema:author ?author ;
            schema:genre ?genre ;
            schema:publisher ?publisher .
          ?author schema:name ?authorName .
          ?genre schema:name ?genreName .
          ?admin ex:hasEmail ?adminEmail .

          FILTER (?isbn = "${req.params.isbn}")
      }
    `;

    const response = await axios.get(fusekiUrl, {
      params: {
        query,
      },
    });

    const booksMap = new Map<string, Book>();

    response.data.results.bindings.forEach((bookBinding: any) => {
      const isbn = bookBinding.isbn.value;

      console.log();


      if (!booksMap.has(isbn)) {
        const bookData: Book = {
          title: bookBinding.title.value,
          isbn: isbn,
          publishedYear: bookBinding.publishedYear.value,
          abstract: bookBinding.abstract.value,
          image: bookBinding.image.value,
          publisher: bookBinding.publisher.value,
          authors: [],
          genres: [],
          adminEmail: bookBinding.adminEmail.value
        };

        booksMap.set(isbn, bookData);
      }

      // Add author and genre names to the existing book data
      const bookData = booksMap.get(isbn)!;
      if (!bookData.authors.includes(bookBinding.authorName.value)) {
        bookData.authors.push(bookBinding.authorName.value);
      }
      if (!bookData.genres.includes(bookBinding.genreName.value)) {
        bookData.genres.push(bookBinding.genreName.value);
      }
    });

    const booksData = Array.from(booksMap.values());

    res.json(booksData);
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ error: 'Error retrieving books' });
  }
});

//POST TO INSERT
app.post('/book', async (req: Request, res: Response) => {
  try {
    const { title, isbn, datePublished, abstract, image, authors, genres, publisher, admin } = req.body;

    const added = await addBook(title, isbn, datePublished, abstract, image, authors, genres, publisher, admin);
    res.status(201).json("Book added successfully");
  } catch (error) {
    console.error('Error inserting book:', error);
    res.status(500).json({ error: 'Error creating book' });
  }
});

app.delete('/book/:isbn', async (req, res) => {
  try {
    const deleted = await deleteBook(req.params.isbn);
    res.status(201).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Error deleting book' });
  }
});

app.put('/book', async (req, res) => {
  try {
    const { title, isbn, datePublished, abstract, image, authors, genres, publisher, admin } = req.body;

    const deleted = await deleteBook(isbn);

    if (deleted) {
      const added = await addBook(title, isbn, datePublished, abstract, image, authors, genres, publisher, admin);
      res.status(201).json({ message: 'Book updated successfully' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Error deleting and adding book' });
  }
});

async function addAuthor(authorQuery: string): Promise<void> {
  await axios.post(fusekiUrlUpdate, null, {
    params: {
      update: authorQuery,
    },
  });
}

async function addGenre(genreQuery: string): Promise<void> {
  await axios.post(fusekiUrlUpdate, null, {
    params: {
      update: genreQuery,
    },
  });
}

async function getAdminID(adminEmail: string): Promise<string> {
  const query = `
    PREFIX schema: <http://schema.org/>
    PREFIX ex: <http://example.org/>

    SELECT ?admin WHERE {
      ?admin ex:hasEmail "${adminEmail}" .
    }
  `;

  const response = await axios.get(fusekiUrl, {
    params: {
      query,
    },
  });

  const adminData = response.data.results.bindings[0];

  if (adminData) {
    const parts = adminData.admin.value.split('/');
    const adminIdentifier = parts[parts.length - 1];
    return adminIdentifier;
  }
  else {
    const insertQuery = `
      PREFIX schema: <http://schema.org/>
      PREFIX ex: <http://example.org/>

      INSERT DATA {
        ex:${adminEmail.replace(/[@.]/g, '')} ex:hasEmail "${adminEmail}" .
      }
    `;

    await axios.post(fusekiUrlUpdate, null, {
      params: {
        update: insertQuery,
      },
    });

    return adminEmail.replace(/[@.]/g, '');
  }
}

async function addBook(title: string, isbn: string, publishedYear: string, abstract: string, image: string, authors: string[], genres: string[], publisher: string, admin: string): Promise<boolean> {
  const checkQuery = `
      PREFIX schema: <http://schema.org/>
      PREFIX ex: <http://example.org/>

      ASK WHERE {
        ?book a schema:Book ;
          schema:isbn "${isbn}" .
      }
    `;

  const { data } = await axios.post(fusekiUrl, null, {
    params: {
      query: checkQuery,
    },
  });

  const exists = data.boolean;

  if (exists) {
    return false;
  }

  const adminString = await getAdminID(admin);

  let authorString = "schema:author";

  for (let i = 0; i < authors.length; i++) {

    if (i !== authors.length - 1) {
      authorString += " ex:" + authors[i].replace(/\s+/g, '_') + ",";
    }
    else {
      authorString += " ex:" + authors[i].replace(/\s+/g, '_') + " ;";
    }

    const authorQuery = `
        PREFIX schema: <http://schema.org/>
        PREFIX ex: <http://example.org/>

        INSERT DATA {
          ex:${authors[i].replace(/\s+/g, '_')} a schema:Person ;
            schema:name "${authors[i]}" .
        }
      `;

    addAuthor(authorQuery);
  }

  let genreString = "schema:genre";

  for (let i = 0; i < genres.length; i++) {

    if (i !== genres.length - 1) {
      genreString += " ex:" + genres[i].replace(/\s+/g, '_') + ",";
    }
    else {
      genreString += " ex:" + genres[i].replace(/\s+/g, '_') + " ;";
    }

    const genreQuery = `
        PREFIX schema: <http://schema.org/>
        PREFIX ex: <http://example.org/>

        INSERT DATA {
          ex:${genres[i].replace(/\s+/g, '_')} a ex:Genre ;
            schema:name "${genres[i]}" .
        }
      `;

    addGenre(genreQuery);
  }

  const currentDate = new Date();

  const bookQuery = `
      PREFIX schema: <http://schema.org/>
      PREFIX ex: <http://example.org/>

      INSERT DATA {
        ex:${isbn} a schema:Book ;
          schema:title "${title}" ;
          schema:isbn "${isbn}" ;
          schema:publishedYear "${publishedYear}" ;
          schema:abstract "${abstract}" ;
          schema:image "${image}" ;
          ex:addedBy ex:${adminString} ;
          schema:dateAdded "${currentDate}" ;
          ${authorString}
          ${genreString}
          schema:publisher "${publisher}" .
      }
    `;

  await axios.post(fusekiUrlUpdate, null, {
    params: {
      update: bookQuery,
    },
  });

  return true;
}

async function deleteBook(isbn: string): Promise<boolean> {
  const isbnToDelete = isbn;

  const checkQuery = `
      PREFIX schema: <http://schema.org/>
      PREFIX ex: <http://example.org/>

      ASK WHERE {
        ?book a schema:Book ;
          schema:isbn "${isbnToDelete}" .
      }
    `;

  const { data } = await axios.post(fusekiUrl, null, {
    params: {
      query: checkQuery,
    },
  });

  const exists = data.boolean;

  if (!exists) {
    return false;
  }

  const deleteQuery = `
      PREFIX schema: <http://schema.org/>
      PREFIX ex: <http://example.org/>

      DELETE WHERE {
        ?book a schema:Book ;
          schema:isbn "${isbnToDelete}" ;
          ?p ?o .
      }
    `;

  await axios.post(fusekiUrlUpdate, null, {
    params: {
      update: deleteQuery,
    },
  });

  return true;
}

export async function searchBooks(req: Request, res: Response) {
  try {
    const title = req.query.title as string;
    const author = req.query.authors as string;
    const genre = req.query.genres as string;
    const publishedYear = req.query.publishedYear as string;
    const publisher = req.query.publishedYear as string;
    const isbn = req.query.isbn as string;
    const abstract = req.query.abstract as string;

    const allBooks = await getAllBooks();

    // Filter the books based on the search criteria
    const filteredBooks = allBooks.filter(book =>
      (!title || book.title.toLowerCase().includes(title.toLowerCase())) &&
      (!author || book.authors.some(b_author => b_author.toLowerCase().includes(author.toLowerCase()))) &&
      (!genre || book.genres.some(b_genre => b_genre.toLowerCase().includes(genre.toLowerCase()))) &&
      (!publishedYear || book.publishedYear === publishedYear) &&
      (!publisher || book.publisher.toLowerCase().includes(publisher.toLowerCase())) &&
      (!isbn || book.isbn === isbn) &&

      // abstract means search in all fields
      ((!abstract || book.abstract.toLowerCase().includes(abstract.toLowerCase())) ||
        (!abstract || book.title.toLowerCase().includes(abstract.toLowerCase())) ||
        (!abstract || book.isbn.toLowerCase().includes(abstract.toLowerCase())) ||
        (!abstract || book.publishedYear.toLowerCase().includes(abstract.toLowerCase())) ||
        (!abstract || book.publisher.toLowerCase().includes(abstract.toLowerCase())) ||
        (!abstract || book.authors.some(b_author => b_author.toLowerCase().includes(abstract.toLowerCase()))) ||
        (!abstract || book.genres.some(b_genre => b_genre.toLowerCase().includes(abstract.toLowerCase()))))
    );

    res.status(200).json(filteredBooks);
  }
  catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Error searching books' });
  }
}

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
