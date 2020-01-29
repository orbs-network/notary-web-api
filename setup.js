require("dotenv").config();
const Orbs = require("orbs-client-sdk");
const { getContractCodeAsBuffer } = require("orbs-notary-lib/src/deploy");
const { getClient, NotaryContractName } = require("./client");

async function deploy(client, owner, code, contractName) {
    const [tx, txid] = client.createTransaction(owner.publicKey, owner.privateKey, "_Deployments", "deployService", [Orbs.argString(contractName), Orbs.argUint32(1), Orbs.argBytes(code)])
    return await client.sendTransaction(tx);
}

(async () => {
    const owner = Orbs.createAccount();
    await deploy(getClient(), owner, getContractCodeAsBuffer(), NotaryContractName);
    console.log("Success!");
})();
