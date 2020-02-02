const express = require("express");
const any = require("promise.any");
const bodyParser = require('body-parser');
const { Notary } = require("orbs-notary-lib");
const { createAccount } = require("orbs-client-sdk");
const { NotaryContractName, getRandomClients } = require("./client");

const port = process.env.PORT || 3000;

const app = express();
const account = createAccount();
const notaryPool = getRandomClients().map(notaryBuilder);

app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_, res) => res.send({
    status: "OK",
    description: "Orbs notary gateway"
}));

app.post("/api/register", async (req, res) => {
    try {
        const response = await any(notaryPool.map(notary => notary.register(req.body, "")));
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
        const response = await any(notaryPool.map(notary => notary.verify(hash)));
        res.send({ status: "OK", response });
    } catch (e) {
        res.status(500).send({
            status: "Error",
            message: e.toString()
        })
    }
})

function notaryBuilder(client) {
    return new Notary(client, NotaryContractName, account.publicKey, account.privateKey, false);
}

if (!module.parent) {
    app.listen(port, () => console.log(`Orbs Notary gateway is listening on port ${port}!`))
} else {
    module.exports = {
        app
    }
}
