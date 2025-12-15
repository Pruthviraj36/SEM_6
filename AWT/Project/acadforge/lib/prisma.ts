// // lib/prisma.ts
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "@prisma/client";
// import { createPool } from "mariadb";

// const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// const adapter = new PrismaMariaDb({
//   host: process.env.DATABASE_HOST,
//   port: Number(process.env.DATABASE_PORT),
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASS,
//   database: process.env.DATABASE_NAME,
//   connectionLimit: 5,
// });

// const adapter = new PrismaMariaDb({    });

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;


import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../app/generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 3306,
  connectionLimit: 5
});

const prisma = new PrismaClient({ adapter });

export default prisma;
