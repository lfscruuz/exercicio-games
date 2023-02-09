import { faker } from "@faker-js/faker";
import app from "app";
import prisma from "config/database";
import httpStatus from "http-status";
import supertest from "supertest";
import createConsole from "../factories/consoles.factory";
import CleanDB from "../helpers";

const server = supertest(app)

beforeAll(async () => {
    CleanDB()
})

describe("consoles tests", () =>{
    describe("GET /consoles", () =>{
        it("should respond with statuscode 200 if ok", async () =>{
            const newConsole = await createConsole();   
            const {body, status} = await server.get("/consoles")
            const insertedConsole = await prisma.console.findFirst({
                where: {
                    name: newConsole.name
                }
            })

            expect(status).toBe(httpStatus.OK)
            expect(body).toEqual([newConsole])
            expect(insertedConsole.name).toBe(newConsole.name)
        })
    })
    describe("GET /consoles/:id", () => {
        it("should respond with statuscode 404 if id not found - id: 0", async () =>{

            const {status} = await server.get("/consoles/0");
            expect(status).toBe(httpStatus.NOT_FOUND)
        })
        it("should respond with statuscode 404 if id not found - id: -1", async () =>{

            const {status} = await server.get("/consoles/-1");
            expect(status).toBe(httpStatus.NOT_FOUND)
        })
        it("should respond with statuscode 200 if id found", async () =>{

            const {name} = await createConsole()
            const {id} = await prisma.console.findFirst({
                where: {
                    name
                }
            })

            const {status} = await server.get(`/consoles/${id}`);
            expect(status).toBe(httpStatus.OK)
        })
    })
    describe("POST /consoles", () =>{
        it("should respond with status code 201 if created", async () =>{
            const newConsole = {
                name: faker.commerce.product()
            }

            const {status} = await server.post("/consoles").send(newConsole)
            const createdConsole = await prisma.console.findFirst({
                where:{
                    name: newConsole.name
                }
            })

            expect(createdConsole.name).toBe(newConsole.name)
            expect(status).toBe(httpStatus.CREATED)
        })
        it("should return with statuscode 409 if conflict", async () =>{
            const newConsole = {
                name: faker.commerce.product()
            }
            const createdConsole = {
                name: newConsole.name
            }
            await server.post("/consoles").send(newConsole)
            const {status} = await server.post("/consoles").send(createdConsole)
            expect(status).toBe(409)
        })
    })
})