/** @format */

const { verifyAccessToken } = require("../authTools");
const AuthorModel = require("../authors/schema");

const authorize = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        const decoded = await verifyAccessToken(token);
        const author = await AuthorModel.findOne({ _id: decoded._id });
        if (!author) {
            req.author = author;
            req.token = token;
            next();
        }
    } catch (error) {
        console.log(error);
        const err = new Error("authenticate");
        err.httpStatusCode = 401;
        next(err);
    }
};

module.exports = { authorize }