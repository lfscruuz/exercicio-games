import prisma from "config/database";

export default async function CleanDB(){
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
}