const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.every(item => item.username !== username)
}

const authenticatedUser = (username, password) => {
    return !!users.find(item => item.username === username && item.password === password)
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (username && password) {
        if (authenticatedUser(username, password)) {
            const accessToken = jwt.sign({
                user: {
                    username
                }
            }, 'fingerprint_customer', {
                expiresIn: 60 * 60
            })

            req.session.authorization = {
                accessToken, username
            }

            res.json({ message: `User with ${username} logged in successfully` });
        } else {
            res.status(404).send('User does not exist')
        }
    } else {
        res.status(400).send('Unable to login user')
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const review = req.query.review

    const selectedBook = books[isbn]

    if (selectedBook) {
        const { username } = req.session.authorization

        selectedBook.reviews = {
            ...selectedBook.reviews,
            [username]: review
        }

        res.send(JSON.stringify(selectedBook, null, 4));
    }

    return res.status(404).json({ message: "Book not found" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn

    const selectedBook = books[isbn]

    if (selectedBook) {
        const { username } = req.session.authorization

        if (selectedBook.reviews[username]) delete selectedBook.reviews[username]

        res.send(JSON.stringify(selectedBook, null, 4));
    }

    return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
