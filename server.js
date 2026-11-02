const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-Memory JavaScript Array to store books
let books = [];

/**
 * Task 2: Add a New Book
 * POST /api/books
 */
app.post('/api/books', (req, res) => {
    const { id, title, author, category, quantity, available } = req.body;

    if (!id || !title || !author || quantity === undefined) {
        return res.status(400).json({ error: 'ID, title, author, and quantity are required fields.' });
    }

    const existingBook = books.find(b => b.id === id);
    if (existingBook) {
        return res.status(409).json({ error: 'A book with this ID already exists.' });
    }

    const newBook = {
        id,
        title,
        author,
        category: category || '',
        quantity,
        available: available !== undefined ? available : quantity
    };

    books.push(newBook);
    res.status(201).json({
        message: 'Book added successfully',
        book: newBook
    });
});

/**
 * Task 3: Retrieve Books
 * GET /api/books
 * GET /api/books/:id
 */
app.get('/api/books', (req, res) => {
    if (books.length === 0) {
        return res.status(200).json({ message: 'No books found in the collection.', books: [] });
    }
    res.status(200).json(books);
});

app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    res.status(200).json(book);
});

/**
 * Task 4: Update Book Details
 * PUT /api/books/:id
 */
app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    const { id, title, author, category, quantity, available } = req.body;
    const currentBook = books[bookIndex];

    if (id !== undefined && id !== currentBook.id) {
        return res.status(400).json({ error: 'Book ID cannot be changed.' });
    }

    currentBook.title = title !== undefined ? title : currentBook.title;
    currentBook.author = author !== undefined ? author : currentBook.author;
    currentBook.category = category !== undefined ? category : currentBook.category;
    currentBook.quantity = quantity !== undefined ? quantity : currentBook.quantity;
    currentBook.available = available !== undefined ? available : currentBook.available;

    res.status(200).json({
        message: 'Book updated successfully',
        book: currentBook
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});