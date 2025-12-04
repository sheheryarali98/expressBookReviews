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
            }, 'secret', {
                expiresIn: 60 * 60
            })

            req.session.authorization = {
                accessToken
            }
        } else {
            res.status(404).send('User does not exist')
        }
    } else {
        res.status(400).send('Unable to login user')
    }

    return res.json({ message: `User with ${username} logged in successfully` });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
