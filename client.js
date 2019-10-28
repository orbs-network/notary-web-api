const Orbs = require("orbs-client-sdk");

const NotaryContractName = process.env.NOTARY_CONTRACT_NAME || "Notary";
const API_ENDPOINT = process.env.API_ENDPOINT || "http://localhost:8080";
const VCHAIN = Number(process.env.VCHAIN || 42);

function getClient() {
    return new Orbs.Client(API_ENDPOINT, VCHAIN, Orbs.NetworkType.NETWORK_TYPE_TEST_NET);
}

module.exports = {
    getClient,
    NotaryContractName
}