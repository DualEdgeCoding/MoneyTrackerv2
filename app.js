/*
   Copyright 2020 Weebkun

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require("method-override")
const db = require("./db");
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();

//set template engine
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers:{
        ifEquals: (str1, str2, options) => {
            return str1 == str2 ? options.fn(this) : options.inverse(this);
        }
    } 
}));
app.set("view engine", "handlebars");

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));
app.use(express.static("public/"));
app.use(session({
    key: "tracker",
    secret: "tracker",
    saveUninitialized: false
}));

app.use("/transaction", require("./routes/transactions"));
app.use("/api", require("./routes/api"));

app.get("/", (req, res) => res.render("home", {title: "home", loggedIn: req.session.loggedIn}));

//test connection to db
db.authenticate()
    .then(() => db.sync({alter: true}))
    .then(() => console.log("database connection to localhost successful."))
    .catch(err => console.error(err));

app.route("/login")
    .get((req, res) => res.render("login", {title: "login", loggedIn: req.session.loggedIn}))
    .post((req, res) => {
        bcrypt.compare(req.body.password, process.env.password)
            .then(match => {
                if(match) {
                    req.session.loggedIn = true;
                    req.session.username = "weeb";
                    res.redirect("/");
                } else {
                    res.redirect("/login");
                }
            });
    });

app.get("/logout", (req, res) => {
    req.session.destroy((err => {
        if(err) res.send(err);
        else res.redirect("/");
    }));
});

//start app and listen on specified port.
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server started on port ${port}`));