const { PrismaClient } = requie('prisma');

const prisma = new PrismaClient();

modules.exports = prisma;
