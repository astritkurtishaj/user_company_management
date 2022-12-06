const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { faker } = require("@faker-js/faker");

//Assertion Style
const should = chai.should();

const loginDetails = {
    email: "astrit7@test.com",
    password: "123456",
};

const badLoginDetails = {
    email: faker.internet.email(),
    password: faker.internet.password(),
};

const createdID = [];

chai.use(chaiHttp);

describe("/POST login", () => {
    it("it should GET token", (done) => {
        chai.request(server)
            .post("/login")
            .send(loginDetails)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object");
                res.body.should.have.property("token");
                token = res.body.token;
                done();
            });
    });
});

describe("/POST login", () => {
    it(`it should NOT POST login after credentials fail`, (done) => {
        chai.request(server)
            .post("/login")
            .send(badLoginDetails)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("messages")
                    .eql("Wrong credentials");
                done();
            });
    });
});
