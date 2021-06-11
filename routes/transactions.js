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

// router for '/transaction' routes
const express = require("express");
const router = express.Router();
const db = require("../db");
const Transaction = require("../models/Transaction");
const uuid = require("uuid");

router.use((req, res, next) => {
    if(req.session.loggedIn) next();
    else res.redirect("/login");
});

router.get("/", (req, res) => {
    Transaction.findAll()
        .then(transactions => {
            var total = 0;
            transactions.forEach((trans) => trans.type == "withdrawal" ? total -= parseFloat(trans.amount) : total += parseFloat(trans.amount));
            res.render("transactions", {title: "Transactions", transactions, total: total.toFixed(2), loggedIn: req.session.loggedIn});
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

router.route("/add")
.get((req, res) => res.render("add", {title: "Add Transaction", loggedIn: req.session.loggedIn}))
.post((req, res) => {
    console.log(req.body);
    let {type, purpose, amount, date, description} = req.body;

    //refactor date to date object
    date = new Date(date);
    Transaction.create({
        id: uuid.v4(),
        type,
        purpose,
        amount,
        date,
        description
    }).then(trans => res.redirect("/transaction"))
    .catch(err => {
        console.error(err);
        res.sendStatus(400);
    })
});

router.route("/edit/:id")
    .get((req, res) => {
    Transaction.findByPk(req.params.id)
    .then(trans => res.render("edit", {
        title: "Edit Transaction",
        trans,
        loggedIn: req.session.loggedIn
    }))
    .catch(err => {
        console.error(err);
        res.sendStatus(500);
    })
}).put((req, res) => {
    Transaction.update({
        type:req.body.type,
        purpose: req.body.purpose,
        description: req.body.description,
        amount: req.body.amount,
        date: new Date(req.body.date)
    }, {where: {id: req.params.id}})
    .then(trans => res.redirect("/transaction"))
    .catch(err => {
        console.error(err);
        res.sendStatus(500);
    })
});

router.get("/delete/:id", (req, res) => {
    Transaction.findOne({where:{id: req.params.id}})
    .then(trans => {
        if(trans != null) {
            Transaction.destroy({where:{id: req.params.id}})
            .then(() => {
                res.redirect("/transaction");
            });
        } else {
            res.sendStatus(400);
        }
    })
    .catch(err => {
        console.error(err);
        res.sendStatus(500);
    })
});

module.exports = router;