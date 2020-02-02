const { Client, NetworkType } = require("orbs-client-sdk");
const NotaryContractName = process.env.NOTARY_CONTRACT_NAME;
const VCHAIN = Number(process.env.VCHAIN);

function buildClient(url) {
    return new Client(url, VCHAIN, NetworkType.NETWORK_TYPE_TEST_NET);
}

function buildUrl(node) {
    const { host } = node;
    const prefix = `http://${host}`;
    if (host.includes("localhost")) {
        return prefix;
    } else {
        return `${prefix}/vchains/${VCHAIN}`;
    }
}

function makeSample(collection, minimum) {
    if (collection.length === 0) {
        throw new Error('Collection must have at least one item');
    }
    if (collection.length === 1 || collection.length < minimum) {
        return collection;
    }
    const quorumCount = Math.ceil(collection.length / minimum);
    const sample = [];
    const copyCollection = [...collection];
    for (let i = 0; i < quorumCount; i++) {
        const max = copyCollection.length - i;
        const randomIndex = Math.floor(Math.random() * max);
        const [chosen] = copyCollection.splice(randomIndex, 1);
        sample.push(chosen);
    }
    return sample;
}

function getClient() {
    const API_ENDPOINT = process.env.API_ENDPOINT;
    return buildClient(API_ENDPOINT);
}

function getRandomClients() {
    const ORBS_TOPOLOGY = JSON.parse(process.env.ORBS_TOPOLOGY);
    if (!ORBS_TOPOLOGY || !ORBS_TOPOLOGY.nodes) {
        return [];
    }
    const { nodes } = ORBS_TOPOLOGY;

    const allNodes = nodes.map(buildUrl).map(buildClient);
    return makeSample(allNodes, 2);
}

module.exports = {
    getClient,
    getRandomClients,
    NotaryContractName
}