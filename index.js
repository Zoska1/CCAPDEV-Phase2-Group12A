import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from "url";

import express from "express";
import exphbs from "express-handlebars";

import cookieParser from "cookie-parser";

import { connect } from "./src/models/db.js";
import router from "./router.js";

async function startServer() {
    const __dirname = dirname(fileURLToPath(import.meta.url)); // directory URL
    const app = express();

    // To be able to read data from the cookies
    app.use(cookieParser());

    // Set static folder
    app.use("/static", express.static(__dirname + "/public"));

    // Set templating engine to exphbs
    app.engine("hbs", exphbs.engine({
        extname: "hbs"
    }));
    app.set("view engine", "hbs");
    app.set("views", "./views");
    app.set("view cache", false);

    // Parse body from json format
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Assign router
    app.use(router);

    await connect();
    console.log("Connected to MongoDB Server.");

    app.listen(process.env.PORT, () => {
        console.log("Express app is now listening on port " + process.env.PORT);
    });
}

startServer();
