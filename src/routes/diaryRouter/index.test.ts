/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { before } from "mocha";
import User from "../../models/user";
import Require from "supertest";
import { app } from "../../..";
import { expect } from "chai";
describe("Diary router", () => {
    let token = "";
    before(async () => {
        const res = await Require(app).post("/api/auth/register").send({
            username: "John",
            email: "john@example.com",
            password: "password",
            fullName: "John Doe",
        });
        token = res.headers["x-token"];
    });
    after(async () => {
        await User.destroy({ where: { username: "John" } });
    });
    describe("GET api/diary", () => {
        it("Should return the diary with status code 200", async () => {
            const res = await Require(app).get("/api/diary").set({
                "x-token": token,
            });
            expect(res.statusCode).to.be.equal(200);
            expect(res.body[0]).to.not.equal(null);
        });
    });
    // describe("PUT api/diary/update",  () => {
    //     it("Should return the diary with status code 200", async () => {
    //         const res = await Require(app).get("/api/diary").set({
    //             "x-token": token
    //         });
    //         expect(res.statusCode).to.be.equal(200);
    //         expect(res.body[0]).to.not.equal(null);
    //     });

    // });
});
