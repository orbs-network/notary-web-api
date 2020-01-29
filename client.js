const { Client, NetworkType } = require("orbs-client-sdk");
const NotaryContractName = process.env.NOTARY_CONTRACT_NAME;
const ORBS_TOPOLOGY = JSON.parse(process.env.ORBS_TOPOLOGY);
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

function getClients() {
    if (!ORBS_TOPOLOGY || !ORBS_TOPOLOGY.nodes) {
        return [];
    }
    const { nodes } = ORBS_TOPOLOGY;
    return nodes
        .map(buildUrl)
        .map(buildClient);
}

module.exports = {
    getClients,
    NotaryContractName
}