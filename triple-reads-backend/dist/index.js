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
app.use(express_1.default.json());
app.get('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.get(fusekiUrl, {
            params: {
                query,
            },
        });
        const booksData = response.data.results.bindings.map((bookBinding) => ({
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
    }
    catch (error) {
        console.error('Error retrieving books:', error);
        res.status(500).json({ error: 'Error retrieving books' });
    }
}));
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
