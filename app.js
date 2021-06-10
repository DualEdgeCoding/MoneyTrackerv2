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
const bodyParser = require("body-parser")
const db = require("./db");
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");

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
app.use(express.static("public"));

app.use("/transaction", require("./routes/transactions"));
app.use("/api", require("./routes/api"));

app.get("/", (req, res) => res.render("home"));

//test connection to db
db.authenticate()
    .then(() => db.sync({alter: true}))
    .then(() => console.log("database connection to localhost successful."))
    .catch(err => console.error(err));

//start app and listen on specified port.
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server started on port ${port}`));