const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
        res.status(404).json({ message: `Book not found for ISBN: ${isbn}`});
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
        res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } else {
        res.status(404).json({ message: `No books found for Author: ${author}` });
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
        res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } else {
        res.status(404).json({ message: `No books found for Title: ${title}` });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
