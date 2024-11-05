const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

app.use(cors());
app.use(express.json());

//app.use(express.static('static'));

let db;

(async () => {
  db = await open({
    filename: './books_database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Function to fetch all the books from the database
async function getAllBooks() {
  let query = 'SELECT * FROM books';
  let response = await db.all(query, []);

  return { books: response };
}

//Endpoint 1: Fetch All Books
app.get('/books', async (req, res) => {
  try {
    let results = await getAllBooks();

    if (results.books.length === 0) {
      return res.status(404).json({ message: 'No Books Found.' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the books by an author from the database
async function getAllBooksByAuthor(author) {
  let query = 'SELECT * FROM books WHERE author = ?';
  let response = await db.all(query, [author]);

  return { books: response };
}

//Endpoint 2: Fetch Books by Author
app.get('/books/author/:author', async (req, res) => {
  try {
    let author = req.params.author;
    let results = await getAllBooksByAuthor(author);

    if (results.books.length === 0) {
      return res.status(404).json({ message: 'No Books Found.' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the books based on specific genre
async function getAllBooksByGenre(genre) {
  let query = 'SELECT * FROM books WHERE genre = ?';
  let response = await db.all(query, [genre]);

  return { books: response };
}

//Endpoint 3: Fetch Books by Genre
app.get('/books/genre/:genre', async (req, res) => {
  try {
    let genre = req.params.genre;
    let results = await getAllBooksByGenre(genre);

    if (results.books.length === 0) {
      return res.status(404).json({ message: 'No Books Found.' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the books in a specific year
async function getAllBooksByPublicationYear(year) {
  let query = 'SELECT * FROM books WHERE publication_year = ?';
  let response = await db.all(query, [year]);

  return { books: response };
}

//Endpoint 4: Fetch Books by Publication Year
app.get('/books/publication_year/:year', async (req, res) => {
  try {
    let year = req.params.year;
    let results = await getAllBooksByPublicationYear(year);

    if (results.books.length === 0) {
      return res.status(404).json({ message: 'No Books Found.' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
