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
 * Task 3: Retrieve All Books
 * GET /api/books
 */
app.get('/api/books', (req, res) => {
    if (books.length === 0) {
        return res.status(200).json({ message: 'No books found in the collection.', books: [] });
    }
    res.status(200).json(books);
});

/**
 * Task 6: Search Books by Title
 * GET /api/books/search?title=java
 * (NOTE: Must be placed BEFORE /api/books/:id)
 */
app.get('/api/books/search', (req, res) => {
    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ error: 'Please provide a title query parameter.' });
    }

    // Filter books matching the title (case-insensitive)
    const filteredBooks = books.filter(b => 
        b.title.toLowerCase().includes(title.toLowerCase())
    );

    res.status(200).json(filteredBooks);
});

/**
 * Task 3: Retrieve Book by ID
 * GET /api/books/:id
 */
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

/**
 * Task 5: Delete a Book
 * DELETE /api/books/:id
 */
app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    const deletedBook = books.splice(bookIndex, 1);

    res.status(200).json({
        message: 'Book deleted successfully',
        book: deletedBook[0]
    });
});

/**
 * Task 7: Issue a Book
 * POST /api/books/:id/issue
 */
app.post('/api/books/:id/issue', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    if (book.available <= 0) {
        return res.status(400).json({ error: 'No copies available to issue.' });
    }

    book.available -= 1;

    res.status(200).json({
        message: 'Book issued successfully',
        book: book
    });
});

/**
 * Task 7: Return a Book
 * POST /api/books/:id/return
 */
app.post('/api/books/:id/return', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    if (book.available >= book.quantity) {
        return res.status(400).json({ error: 'All copies are already returned.' });
    }

    book.available += 1;

    res.status(200).json({
        message: 'Book returned successfully',
        book: book
    });
});

// Start the server (MUST be at the very bottom)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});