// defines the authenticateToken middleware, which ensures that API requests are made by authenticated users by verifying a JSON Web Token (JWT).
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization token required." });
    }

    const token = authHeader && authHeader.split(" ")[1];

    // if(!token){
    //     return res.status(401).json({ message: "Authorization token required." });
    // }

    jwt.verify(token, "100MIL", (err, user) => {
        if (err) {
            return res.status(403).json(err);
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
