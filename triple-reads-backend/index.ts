import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const fusekiUrl = process.env.FUSEKI_URL || 'http://localhost:3030/triple-reads/sparql';


app.use(express.static('public'));
app.use(express.static('dist/public'));

app.use(express.json());

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

// GET REQUEST FOR ALL BOOKS
app.get('/books', async (req: Request, res: Response) => {
  try {
    const query = `
      PREFIX schema: <http://schema.org/>
      PREFIX ex: <http://example.org/>
      SELECT DISTINCT ?title ?isbn ?datePublished ?abstract ?image ?authorName ?genreName ?publisher WHERE {
        ?book a schema:Book ;
          schema:title ?title ;
          schema:isbn ?isbn ;
          schema:datePublished ?datePublished ;
          schema:abstract ?abstract ;
          schema:image ?image ;
          schema:author ?author ;
          schema:genre ?genre ;
          schema:publisher ?publisher .
        ?author schema:name ?authorName .
        ?genre schema:name ?genreName .
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
          datePublished: bookBinding.datePublished.value,
          abstract: bookBinding.abstract.value,
          image: bookBinding.image.value,
          publisher: bookBinding.publisher.value,
          authors: [],
          genres: [],
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
      SELECT DISTINCT ?title ?isbn ?datePublished ?abstract ?image ?authorName ?genreName ?publisher WHERE {
        ?book a schema:Book ;
          schema:title ?title ;
          schema:isbn ?isbn ;
          schema:datePublished ?datePublished ;
          schema:abstract ?abstract ;
          schema:image ?image ;
          schema:author ?author ;
          schema:genre ?genre ;
          schema:publisher ?publisher .
        ?author schema:name ?authorName .
        ?genre schema:name ?genreName .
        
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
          datePublished: bookBinding.datePublished.value,
          abstract: bookBinding.abstract.value,
          image: bookBinding.image.value,
          publisher: bookBinding.publisher.value,
          authors: [],
          genres: [],
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

      SELECT ?title ?isbn ?datePublished ?abstract ?image ?authorName ?genreName ?publisher WHERE {
          ?book a schema:Book ;
            schema:title ?title ;
            schema:isbn ?isbn ;
            schema:datePublished ?datePublished ;
            schema:abstract ?abstract ;
            schema:image ?image ;
            schema:author ?author ;
            schema:genre ?genre ;
            schema:publisher ?publisher .
          ?author schema:name ?authorName .
          ?genre schema:name ?genreName .
          FILTER (?isbn = "${req.params.isbn}")
      }
    `;  

    const response = await axios.get(fusekiUrl, {
      params: {
        query,
      },
    });

    const bookData = response.data.results.bindings[0];
    if (bookData) {
      res.json(bookData);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error retrieving book:', error);
    res.status(500).json({ error: 'Error retrieving book' });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
