const { app } = require("../index");
const supertest = require("supertest");
const expect = require("expect.js");
const { randomBytes } = require("crypto");
const { sha256 } = require("orbs-notary-lib");

function s(f) {
    return require("crypto").createHash('sha256').update(f, 'utf8').digest('hex')
}

describe("#register", () => {
    it("happy flow", async () => {
        const request = supertest(app);
        const document = randomBytes(100);
        const { body } = await request
            .post("/api/register")
            .set("Content-Type", "application/octet-stream")
            .send(document)
            .expect(200);

        expect(body.status).to.be.eql("OK");
        expect(body.response.hash).to.be.eql(sha256(document));
        expect(body.response.txId).not.to.be.empty();
        expect(body.response.metadata).to.be.empty();
    });
});

describe("#verify", () => {
    it("verified", async () => {
        const request = supertest(app);
        const document = randomBytes(100);        

        await request
            .post("/api/register")
            .set("Content-Type", "application/octet-stream")
            .send(document)
            .expect(200);

        const { body } = await request
            .post("/api/verify")
            .send(`hash=`+sha256(document))
            .expect(200);

        expect(body.status).to.be.eql("OK");
        expect(body.response.hash).to.be.eql(sha256(document));
        expect(body.response.verified).to.be.eql(true);
    });

    it("not verified", async () => {
        const request = supertest(app);

        const { body } = await request
            .post("/api/verify")
            .send(`hash=some-hash`)
            .expect(200);

        expect(body.status).to.be.eql("OK");
        expect(body.response.hash).to.be.eql("some-hash");
        expect(body.response.verified).to.be.eql(false);
    });
});