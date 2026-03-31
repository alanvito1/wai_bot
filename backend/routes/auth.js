const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "supersecret123";

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const ADMIN_USER = process.env.ADMIN_USER || "admin";
    const ADMIN_PASS = process.env.ADMIN_PASS || "1234";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: "Usuário ou senha inválidos!" });
    }
});

module.exports = router;
