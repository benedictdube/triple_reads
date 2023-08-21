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
const fusekiUrlUpdate = process.env.FUSEKI_URL_UPDATE || 'http://localhost:3030/triple-reads/update';
app.use(express_1.default.static('public'));
app.use(express_1.default.static('dist/public'));
app.use(express_1.default.json());
// GET REQUEST FOR ALL BOOKS
app.get('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
    PREFIX schema: <http://schema.org/>
    PREFIX ex: <http://example.org/>
    
    SELECT DISTINCT ?title ?isbn ?datePublished ?abstract ?image ?authorName ?genreName ?publisher ?adminEmail WHERE {
      ?book a schema:Book ;
        schema:title ?title ;
        schema:isbn ?isbn ;
        schema:datePublished ?datePublished ;
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
                    adminEmail: bookBinding.adminEmail.value
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
      SELECT DISTINCT ?title ?isbn ?datePublished ?abstract ?image ?authorName ?genreName ?publisher ?adminEmail WHERE {
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
        ?admin ex:hasEmail ?adminEmail .
        
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
                    adminEmail: bookBinding.adminEmail.value
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

      SELECT ?title ?isbn ?datePublished ?abstract ?image ?authorName ?genreName ?publisher ?adminEmail WHERE {
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
          ?admin ex:hasEmail ?adminEmail .
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
//POST TO INSERT
app.post('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, isbn, datePublished, abstract, image, authorNames, genreNames, publisher, admin, dateAdded } = req.body;
        const adminString = yield getAdminID(admin);
        let authorString = "schema:author";
        for (let i = 0; i < authorNames.length; i++) {
            if (i !== authorNames.length - 1) {
                authorString += " ex:" + authorNames[i].replace(/\s+/g, '_') + ",";
            }
            else {
                authorString += " ex:" + authorNames[i].replace(/\s+/g, '_') + " ;";
            }
            const authorQuery = `
        PREFIX schema: <http://schema.org/>
        PREFIX ex: <http://example.org/>

        INSERT DATA {
          ex:${authorNames[i].replace(/\s+/g, '_')} a schema:Person ;
            schema:name "${authorNames[i]}" .
        }
      `;
            addAuthor(authorQuery);
        }
        let genreString = "schema:genre";
        for (let i = 0; i < genreNames.length; i++) {
            if (i !== genreNames.length - 1) {
                genreString += " ex:" + genreNames[i].replace(/\s+/g, '_') + ",";
            }
            else {
                genreString += " ex:" + genreNames[i].replace(/\s+/g, '_') + " ;";
            }
            const genreQuery = `
        PREFIX schema: <http://schema.org/>
        PREFIX ex: <http://example.org/>

        INSERT DATA {
          ex:${genreNames[i].replace(/\s+/g, '_')} a ex:Genre ;
            schema:name "${genreNames[i]}" .
        }
      `;
            addGenre(genreQuery);
        }
        const bookQuery = `
      PREFIX schema: <http://schema.org/>
      PREFIX ex: <http://example.org/>

      INSERT DATA {
        ex:${isbn} a schema:Book ;
          schema:title "${title}" ;
          schema:isbn "${isbn}" ;
          schema:datePublished "${datePublished}" ;
          schema:abstract "${abstract}" ;
          schema:image "${image}" ;
          ex:addedBy ex:${adminString} ;
          schema:dateAdded "${dateAdded}" ;
          ${authorString}
          ${genreString}
          schema:publisher "${publisher}" .
      }
    `;
        yield axios_1.default.post(fusekiUrlUpdate, null, {
            params: {
                update: bookQuery,
            },
        });
        res.status(201).json({ message: 'Book inserted successfully' });
    }
    catch (error) {
        console.error('Error inserting book:', error);
        res.status(500).json({ error: 'Error inserting book' });
    }
}));
app.delete('/books/:isbn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isbnToDelete = req.params.isbn;
        const query = `
      PREFIX schema: <http://schema.org/>
      PREFIX ex: <http://example.org/>

      DELETE WHERE {
        ?book a schema:Book ;
          schema:isbn "${isbnToDelete}" ;
          ?p ?o .
      }
    `;
        yield axios_1.default.post(fusekiUrlUpdate, null, {
            params: {
                update: query,
            },
        });
        res.status(201).json({ message: 'Book deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Error deleting book' });
    }
}));
function addAuthor(authorQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.post(fusekiUrlUpdate, null, {
            params: {
                update: authorQuery,
            },
        });
    });
}
function addGenre(genreQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.post(fusekiUrlUpdate, null, {
            params: {
                update: genreQuery,
            },
        });
    });
}
function getAdminID(adminEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    PREFIX schema: <http://schema.org/>
    PREFIX ex: <http://example.org/>

    SELECT ?admin WHERE {
      ?admin ex:hasEmail "${adminEmail}" .
    }
  `;
        const response = yield axios_1.default.get(fusekiUrl, {
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
            yield axios_1.default.post(fusekiUrlUpdate, null, {
                params: {
                    update: insertQuery,
                },
            });
            return adminEmail.replace(/[@.]/g, '');
        }
    });
}
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
