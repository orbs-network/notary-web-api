const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const Orbs = require("orbs-client-sdk");
const { Notary, sha256 } = require("orbs-notary-lib");
const NotaryContractName = process.env.NOTARY_CONTRACT_NAME || "Notary";

function getClient() {
    return new Orbs.Client("http://localhost:8080", 42, Orbs.NetworkType.NETWORK_TYPE_TEST_NET);
}

app.use(bodyParser.raw())

app.get("/", (req, res) => res.send({
    status: "OK",
    description: "Orbs notary gateway"
}));

app.post("/api/register", async (req, res) => {
    try {
        const account = Orbs.createAccount();
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

        const account = Orbs.createAccount();
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
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
} else {
    module.exports = {
        app
    }
}
