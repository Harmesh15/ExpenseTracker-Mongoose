const jwt = require("jsonwebtoken");

const authorizationToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access token missing"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if (err) {
            return res.status(403).json({
                message: "Invalid or Expired token"
            });
        }

        req.user = user;

        next();
    });
};

module.exports = authorizationToken;


// const token = jwt.sign(
//     { userId: user._id },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
// );