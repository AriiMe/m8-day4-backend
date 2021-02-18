const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const listEndpoints = require('express-list-endpoints')
const passport = require("passport")
const cookieParser = require("cookie-parser")


const oauth = require("./auth/oauth")

const articleRouter = require("./medium");
const authorRoute = require("./authors");

const {
    notFoundHandler,
    forbiddenHandler,
    badRequestHandler,
    genericErrorHandler
} = require('./errorHandlers')


const server = express();
const port = process.env.PORT || 3001

const whitelist = ["http://localhost:3000"]
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}


server.use(cors(corsOptions));
server.use(express.json());
server.use(cookieParser())
server.use("/medium", articleRouter)
server.use("/authors", authorRoute);


server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

//console.log(listEndpoints(server))

mongoose.set("debug", true)

mongoose
    .connect(process.env.MONGO_ATLAS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(
        server.listen(port, () => {
            console.log(port, "hunting femboys");
        })
    );