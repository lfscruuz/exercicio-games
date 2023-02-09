import prisma from "config/database";
import {faker} from "@faker-js/faker"

export default async function createConsole() {
    return prisma.console.create({
        data: {
            name: faker.commerce.product()
        }
    })
}