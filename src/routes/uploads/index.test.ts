/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { before } from "mocha";
import User from "../../models/user";
import Require from "supertest";
import { app } from "../../..";
import { expect } from "chai";
import Path from "path";
import fs from "fs";
import dotenv from "dotenv";
import config from "../../config/env";
dotenv.config(config);
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
    describe("API api/upload", () => {
        it("Should upload an image succesfully (and delete it after)", async () => {
            const res = await Require(app)
                .post("/api/upload")
                .set({
                    "x-token": token,
                    "Content-Type": "multipart/form-data",
                })
                .attach("file", Path.normalize(__dirname + "/../../../static/test/NormalImage.jpg"));

            expect(res.statusCode).to.be.equal(200);
            if (res.text) {
                fs.unlinkSync(Path.normalize(__dirname + "/../../../static/uploads/images/" + res.text));
            }
        });
        it("Should fail because of size", async () => {
            const res = await Require(app)
                .post("/api/upload")
                .set({
                    "x-token": token,
                    "Content-Type": "multipart/form-data",
                })
                .attach("file", Path.normalize(__dirname + "/../../../static/test/BigImage.jpg"));

            expect(res.statusCode).to.be.equal(400);
        });
        // it("Should fail because of data type", async () => {

        //         const res = await Require(app).post("/api/upload").set({
        //             "x-token": token,
        //             'Content-Type': 'multipart/form-data',
        //     }).attach("file", Path.normalize(__dirname + "/../../../static/test/file.pdf"));
        //    expect(res.statusCode).to.be.equal(400);

        // });
    });
});
