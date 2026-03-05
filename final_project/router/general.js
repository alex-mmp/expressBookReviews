const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooksAsync = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 500);
    });
};

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        return res.status(400).json({ message: "No username provided" });
    }
    if (!password) {
        return res.status(400).json({ message: "No password provided" });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "That username is taken" });
    } else {
        users.push({"username":username,"password":password});
        return res.status(200).send(`User added successfully: ${username}`);
    }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const bookList = await getBooksAsync();
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    if (!isbn) {
        return res.status(400).json({ message: "No ISBN supplied with request"});
    }
    try {
        const bookList = await getBooksAsync();
        if (bookList[isbn]) {
            return res.status(200).send(JSON.stringify(books[isbn], null, 4));
        } else {
            return res.status(404).json({ message: `Book not found for ISBN: ${isbn}`});
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = decodeURI(req.params.author);
    const booksKeys = Object.keys(books);
    const booksByAuthor = booksKeys
        .filter((key) => books[key].author === author)
        .reduce((book, key) => {
            return Object.assign(book, {
                [key]: books[key]
            });
        }, {});

    if (Object.keys(booksByAuthor).length > 0) {
        return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } else {
        return res.status(404).json({ message: `No books found for Author: ${author}` });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = decodeURI(req.params.title);
    const booksKeys = Object.keys(books);
    const booksByTitle = booksKeys
        .filter((key) => books[key].title === title)
        .reduce((book, key) => {
            return Object.assign(book, {
                [key]: books[key]
            });
        }, {});
    if (Object.keys(booksByTitle).length > 0) {
        return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } else {
        return res.status(404).json({ message: `No books found for Title: ${title}` });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        return res.status(200).send(JSON.stringify(reviews, null, 4));
    } else {
        return res.status(404).json({ message: `No book found for ISBN: ${isbn}`});
    }
});

module.exports.general = public_users;
