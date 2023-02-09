import app from "app";
import prisma from "config/database";
import supertest from "supertest";
import httpStatus from "http-status";
import CleanDB from "../helpers";
import createGame from "../factories/games-factory";
import { faker } from "@faker-js/faker";
import createConsole from "../factories/consoles.factory";

const server = supertest(app);

beforeAll(async () => {
    CleanDB();
})
afterEach(async () => {
    CleanDB();
})

describe("games tests", () => {
    describe("GET /games", () => {
        it("should respond with statuscode 200 if ok", async () => {
            const newGame = await createGame()
            const { status } = await server.get("/games")
            const insertedGame = await prisma.game.findFirst({
                where: {
                    title: newGame.title
                }
            })

            expect(status).toBe(httpStatus.OK);
            expect(insertedGame.title).toBe(newGame.title)
        })
    })
    describe("GET /games/:id", () => {
        it("should respond with statuscode 200 if id found", async () => {
            const { title } = await createGame();
            const { id } = await prisma.game.findFirst({
                where: {
                    title
                }
            })
            const { status } = await server.get(`/games/${id}`)
            expect(status).toBe(httpStatus.OK)
        })
        it("should respond with statuscode 404 if id not found - id: 0", async () =>{
            const {status} = await server.get("/games/0");
            expect(status).toBe(httpStatus.NOT_FOUND)
        })
        it("should respond with statuscode 404 if id not found - id: -1", async () =>{
            const {status} = await server.get("/games/-1");
            expect(status).toBe(httpStatus.NOT_FOUND)
        })
    })
    describe("POST /games", () =>{
        it("should responde with statuscode 201 if created",async () => {
            const newConsole = await createConsole();

            const newGame = {
                title: faker.lorem.word(),
                consoleId: newConsole.id
            }
            const {status} = await server.post("/games").send(newGame)

            const createdGame = await prisma.game.findFirst({
                where: {
                    title: newGame.title
                }
            })
            expect(createdGame.title).toBe(newGame.title)
            expect(status).toBe(httpStatus.CREATED)
        })
        it("should respond with statuscode 409 if conflict",async () => {
            const newConsole = await createConsole();

            const newGame = {
                title: faker.lorem.word(),
                consoleId: newConsole.id
            }

            const createdGame = {
                title: newGame.title,
                consoleId: newGame.consoleId
            }

            await server.post("/games").send(newGame)
            const {status} = await server.post("/games").send(createdGame)

            expect(status).toBe(httpStatus.CONFLICT)
        })
    })
})