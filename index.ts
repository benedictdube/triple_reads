import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const fusekiUrl = process.env.FUSEKI_URL || 'http://localhost:3030/triple-reads/sparql';

app.use(express.json());

app.get('/books', async (req: Request, res: Response) => {
  console.log(`Received request on ${req.url}`)
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
    }
    `;

    const response = await axios.get(fusekiUrl, {
      params: {
        query,
      },
    });

    const booksData = response.data.results.bindings.map((bookBinding: any) => ({
      title: bookBinding.title.value,
      isbn: bookBinding.isbn.value,
      datePublished: bookBinding.datePublished.value,
      abstract: bookBinding.abstract.value,
      image: bookBinding.image.value,
      authorName: bookBinding.authorName.value,
      genreName: bookBinding.genreName.value,
      publisher: bookBinding.publisher.value,
    }));

    res.json(booksData);
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ error: 'Error retrieving books' });
  }
});

app.get('/books/:isbn', async (req: Request, res: Response) => {
  try {
    console.log(`Received request on ${req.url}`)
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
  console.log(`⚡️[server]: Server is running at ${'localhost:'+port} with DB on ${fusekiUrl}`);
});
