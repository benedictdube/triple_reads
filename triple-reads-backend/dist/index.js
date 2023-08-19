"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const fusekiUrl = process.env.FUSEKI_URL || 'http://localhost:3030/triple-reads/sparql';
app.use(express_1.default.static('public'));
app.use(express_1.default.static('dist/public'));
app.use(express_1.default.json());
// GET REQUEST FOR ALL BOOKS
app.get('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.get(fusekiUrl, {
            params: {
                query,
            },
        });
        const booksMap = new Map();
        response.data.results.bindings.forEach((bookBinding) => {
            const isbn = bookBinding.isbn.value;
            if (!booksMap.has(isbn)) {
                const bookData = {
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
            const bookData = booksMap.get(isbn);
            if (!bookData.authors.includes(bookBinding.authorName.value)) {
                bookData.authors.push(bookBinding.authorName.value);
            }
            if (!bookData.genres.includes(bookBinding.genreName.value)) {
                bookData.genres.push(bookBinding.genreName.value);
            }
        });
        const booksData = Array.from(booksMap.values());
        res.json(booksData);
    }
    catch (error) {
        console.error('Error retrieving books:', error);
        res.status(500).json({ error: 'Error retrieving books' });
    }
}));
// GET REQUEST FOR ALL BOOKS THAT CONTAIN A STRING IN THE TITLE
app.get('/books/search/:title', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.get(fusekiUrl, {
            params: {
                query,
            },
        });
        const booksMap = new Map();
        response.data.results.bindings.forEach((bookBinding) => {
            const isbn = bookBinding.isbn.value;
            if (!booksMap.has(isbn)) {
                const bookData = {
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
            const bookData = booksMap.get(isbn);
            if (!bookData.authors.includes(bookBinding.authorName.value)) {
                bookData.authors.push(bookBinding.authorName.value);
            }
            if (!bookData.genres.includes(bookBinding.genreName.value)) {
                bookData.genres.push(bookBinding.genreName.value);
            }
        });
        const booksData = Array.from(booksMap.values());
        res.json(booksData);
    }
    catch (error) {
        console.error('Error retrieving books:', error);
        res.status(500).json({ error: 'Error retrieving books' });
    }
}));
//GET REQUEST FOR BOOKS BASED ON ISBN
app.get('/books/:isbn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.get(fusekiUrl, {
            params: {
                query,
            },
        });
        const bookData = response.data.results.bindings[0];
        if (bookData) {
            res.json(bookData);
        }
        else {
            res.status(404).json({ error: 'Book not found' });
        }
    }
    catch (error) {
        console.error('Error retrieving book:', error);
        res.status(500).json({ error: 'Error retrieving book' });
    }
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
