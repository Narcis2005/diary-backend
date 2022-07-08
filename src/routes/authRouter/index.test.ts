/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Require from "supertest";
import { app } from "../../..";
import { expect } from "chai";
import User from "../../models/user";
describe("Auth router", () => {
    let token = "";
    after(async () => {
        await User.destroy({ where: { username: "John" } });
    });
    describe("POST api/auth/regitser", () => {
        it("Should return a code 400 because no params were specified", async () => {
            const res = await Require(app).post("/api/auth/register").send({});
            expect(res.statusCode).to.be.equal(400);
        });
        it("Should return a code 400 because not ALL params were specified", async () => {
            const res = await Require(app).post("/api/auth/register").send({
                username: "dsadsac",
            });
            expect(res.statusCode).to.be.equal(400);
        });
        it("Should return a code 422 because the email is invalid params", async () => {
            const res = await Require(app).post("/api/auth/register").send({
                username: "dsadsac",
                password: "fjsdfj",
                fullName: "John Doe",
                email: "JohnDoe",
            });
            expect(res.statusCode).to.be.equal(422);
        });
        it("Should return a code 422 because the fullName is invalid", async () => {
            const res = await Require(app).post("/api/auth/register").send({
                username: "dsadsac",
                password: "fjsdfj",
                fullName: "Jo",
                email: "JohnDoe@example.com",
            });
            expect(res.statusCode).to.be.equal(422);
        });
        it("Should return a code 200", async () => {
            const res = await Require(app).post("/api/auth/register").send({
                username: "John",
                password: "fjsdfj",
                fullName: "John Doe",
                email: "JohnDoe@example.com",
            });
            expect(res.statusCode).to.be.equal(200);
            expect(res.headers["x-token"]).to.be.a("string");
            expect(res.headers["x-refresh-token"]).to.be.a("string");
        });
        it("Should return a code 400 because we aleardy created an account with this username", async () => {
            const res = await Require(app).post("/api/auth/register").send({
                username: "John",
                password: "fjsdfj",
                fullName: "John Doe",
                email: "JohnDoe@example.com",
            });
            expect(res.statusCode).to.be.equal(400);
        });
    });

    describe("POST api/auth/login", () => {
        it("Should return a code 404 because no params were specified", async () => {
            const res = await Require(app).post("/api/auth/login").send({});
            expect(res.statusCode).to.be.equal(404);
        });
        it("Should return a code 404 because not ALL params were specified", async () => {
            const res = await Require(app).post("/api/auth/login").send({
                username: "John",
            });
            expect(res.statusCode).to.be.equal(404);
        });
        it("Should return a code 404 because no user with that username exists", async () => {
            const res = await Require(app).post("/api/auth/login").send({
                username: "FakeJohn",
                password: "somePass",
            });
            expect(res.statusCode).to.be.equal(404);
        });
        it("Should return a code 403 because the password is incorect", async () => {
            const res = await Require(app).post("/api/auth/login").send({
                username: "John",
                password: "password",
            });
            expect(res.statusCode).to.be.equal(403);
        });
        it("Should return a code 200", async () => {
            const res = await Require(app).post("/api/auth/login").send({
                username: "John",
                password: "fjsdfj",
            });
            expect(res.statusCode).to.be.equal(200);
            expect(res.headers["x-token"]).to.be.a("string");
            expect(res.headers["x-refresh-token"]).to.be.a("string");
            token = res.headers["x-token"];
        });
    });
    describe("GET api/auth/getuser", () => {
        it("Should return a code 403 because no headers were specified", async () => {
            const res = await Require(app).get("/api/auth/getuser");
            expect(res.statusCode).to.be.equal(403);
        });
        it("Should return a code 200", async () => {
            const res = await Require(app).get("/api/auth/getuser").set({
                "x-token": token,
            });
            expect(res.statusCode).to.be.equal(200);
        });
    });
    describe("GET api/auth/update", () => {
        it("Should return a code 403 because no headers were specified", async () => {
            const res = await Require(app).put("/api/auth/update");
            expect(res.statusCode).to.be.equal(403);
        });
        it("Should return a code 200", async () => {
            const res = await Require(app)
                .put("/api/auth/update")
                .set({
                    "x-token": token,
                })
                .send({
                    fullName: "John Mark",
                });
            expect(res.statusCode).to.be.equal(200);
        });
    });
});
