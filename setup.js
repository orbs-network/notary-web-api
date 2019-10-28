const Orbs = require("orbs-client-sdk");
const { deploy, getContractCodeAsBuffer } = require("orbs-notary-lib/src/deploy");

function getClient() {
    return new Orbs.Client("http://localhost:8080", 42, Orbs.NetworkType.NETWORK_TYPE_TEST_NET);
}

const owner = Orbs.createAccount();
const notaryContractName = "Notary";

(async () => {
    await deploy(getClient(), owner, getContractCodeAsBuffer(), notaryContractName);

    console.log("Success!");
})();
