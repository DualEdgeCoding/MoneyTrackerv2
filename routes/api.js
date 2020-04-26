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

//router for api calls. '/api'
const express = require("express");
const router = express.Router();
const db = require("../db");
const Transaction = require("../models/Transaction");

router.get("/getTransactions", (req, res) => {
    Transaction.findAll()
        .then(trans => res.json(trans))
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
})

module.exports = router;