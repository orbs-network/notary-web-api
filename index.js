const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const { createAccount } = require("orbs-client-sdk");
const { Notary } = require("orbs-notary-lib");
const { NotaryContractName, getClient } = require("./client");

const account = createAccount();

app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send({
    status: "OK",
    description: "Orbs notary gateway"
}));

app.post("/api/register", async (req, res) => {
    try {
        const notary = new Notary(getClient(), NotaryContractName, account.publicKey, account.privateKey, false);
        const response = await notary.register(req.body, "");

        res.send({ status: "OK", response });
    } catch (e) {
        console.log(e)
        res.status(500).send({
            status: "Error",
            message: e.toString()
        })
    }
})

app.post("/api/verify", async (req, res) => {
    try {
        const { hash } = req.body;
        const notary = new Notary(getClient(), NotaryContractName, account.publicKey, account.privateKey, false);
        const response = await notary.verify(hash);

        res.send({ status: "OK", response });
    } catch (e) {
        res.status(500).send({
            status: "Error",
            message: e.toString()
        })
    }
})

if (!module.parent) {
    app.listen(port, () => console.log(`Orbs Notary gateway is listening on port ${port}!`))
} else {
    module.exports = {
        app
    }
}
