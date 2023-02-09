import { faker } from "@faker-js/faker";
import prisma from "config/database";
import createConsole from "./consoles.factory";

export default async function createGame(){
    const console = await createConsole();
    return prisma.game.create({
        data:{
            title: faker.lorem.word(),
            consoleId: console.id
        }
    })
}