// filepath: d:\React Native Project\kgrillhub01\server\middleware\verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send("Access Denied");

    try {
        const verified = jwt.verify(token, process.env.JWT_KEY);
        req.user = verified; // Attach the decoded token payload to req.user
        next();
    } catch (error) {
        console.log(error);
        res.status(403).send("Invalid Token");
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) { // Corrected property name
            next();
        } else {
            return res.status(403).send("Access Denied: You are not an Administrator");
        }
    });
};

module.exports = {
    verifyToken,
    verifyAdmin,
};