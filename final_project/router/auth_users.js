const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let validUsername = users.filter((user) => {
        return user.username === username
    });
    if (validUsername.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    let validUsers = users.filter((user) => {
        return user.username === username && user.password === password
    });

    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in user" });
    }

    if (!isValid(username)) {
        return res.status(404).json({ message: `Username: ${username} is invalid`});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,
            username
        }
        return res.status(200).send(`User: ${username} logged in successfully`);
    } else {
        return res.status(401).json({ message: "Invalid login information"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let username = req.session.authorization['username'];
    let isbn = req.params.isbn;
    let review = req.body.review;

    if (!isbn) {
        return res.status(400).json({ message: "No ISBN supplied in the request" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: `No book found for ISBN: ${isbn}`});
    }
    if (!review) {
        return res.status(400).json({ message: "No review provided with request"});
    }
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: `Review added for isbn: ${isbn} by user: ${username}`,
        reviews: books[isbn].reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization['username'];
    if (!isbn) {
        return res.status(400).json({ message: "No ISBN supplied in the request" });
    }
    if (!books[isbn].reviews[username]) {
        return res.status(410).json({ message: `No review found for ISBN: ${isbn} by user: ${username}` });
    }
    delete books[isbn].reviews[username];
    return res.status(200).json({
        message: `Review deleted successfully for ISBN: ${isbn} by user ${username}`,
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
