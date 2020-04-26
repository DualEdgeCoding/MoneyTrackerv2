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

const sequelize = require("sequelize");
const db = require("../db");

const Transaction = db.define("transaction", {
    id: {
        type: sequelize.STRING,
        primaryKey: true
    },
    date: {
        type: sequelize.DATEONLY
    },
    amount: {
        type: sequelize.DECIMAL(8, 2)
    },
    purpose: {
        type: sequelize.STRING
    },
    description: {
        type: sequelize.STRING,
        allowNull: true
    },
    type: {
        type: sequelize.STRING
    }
});

module.exports = Transaction;