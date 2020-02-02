const Chance = require("chance");
const expect = require("expect.js");
const chance = new Chance();

const setTopologyNodes = (nodes) => {
    process.env.ORBS_TOPOLOGY = JSON.stringify({
        nodes
    });
};

const generateNodes = amount => {
    return Array(amount)
        .fill(1)
        .map(() => ({
            name: chance.name(),
            host: chance.ip()
        }));
}

describe("Orbs Client Builder module", () => {
    let defaultTopology = process.env.ORBS_TOPOLOGY;

    beforeEach(() => {
        delete require.cache[require.resolve("../client")]
    });

    afterEach(() => {
        process.env.ORBS_TOPOLOGY = defaultTopology;
    });

    it("should return random list of clients", async () => {
        const nodes = generateNodes(6);
        setTopologyNodes(nodes);
        const { getRandomClients } = require("../client");
        expect(getRandomClients()).to.have.length(3);
    });

    it("should be at least 2", async () => {
        const nodes = generateNodes(3);
        setTopologyNodes(nodes);
        const { getRandomClients } = require("../client");
        expect(getRandomClients()).to.have.length(2);
    });

    it("should return the same nodes if less than minimum", () => {
        const nodes = generateNodes(1);
        setTopologyNodes(nodes);
        const { getRandomClients } = require("../client");
        expect(getRandomClients()).to.have.length(1);
    });
});