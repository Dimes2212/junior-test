// import type FastifyReply = require("fastify");
// import type fastify = require("fastify");

// // импорт модулей -------------------------------------------
// const dotenv = require('dotenv');
// const path = require('path');
// const Fastify = require('fastify');
// const {PrismaClient} = require('@prisma/client');
// // подключение модулей + запуск сервера----------------------
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// // Prisma Client
// const prisma = new PrismaClient();

// // Fastify сервер
// const fastify = Fastify({ logger: true });
// const start = async () => {
//     try {
//       await fastify.listen({ port: process.env.PORT || 3000 });
//       console.log(`Server running on port ${process.env.PORT || 3000}`);
//     } catch (err) {
//       fastify.log.error(err);
//       process.exit(1);
//     }
//   };
  
//   start();

// Импорт типов (только для TypeScript, не влияет на runtime)
import type { FastifyReply, FastifyRequest } from 'fastify';

// Импорт модулей CommonJS
const dotenv = require('dotenv');
const path = require('path');
const Fastify = require('fastify');
const { PrismaClient } = require('@prisma/client');

// Подключаем dotenv с указанием пути к .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Создаём клиент Prisma
const prisma = new PrismaClient();

// Создаём Fastify сервер
const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 3000 });
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
// Работа самого API ---------------------------------------
fastify.get('/events' , async () => {
    const events =  await prisma.events.findMany();
    return events;
})


interface CreateEventBody {
    coefficient: number;
    deadline: number;
}
fastify.post('/events' , async (req: FastifyRequest<{Body: CreateEventBody}> , res: FastifyReply ) => {
    const event = req.body;
    try {
      const count = await prisma.events.count();
      const newEvent = await prisma.events.create({
        data: {
          id: `event${count + 1}`,
          coefficient: event.coefficient,
          deadline: event.deadline,
          status: 'pending',
        }
      });      
    return res.send(newEvent);
    }
    catch (err) {
      throw new Error('Internal server error')
    }
})

interface ChangeStatus {
    status: String;
}
fastify.put('/events/:id' , async (req: FastifyRequest<{Params: { id: string }; Body: ChangeStatus}> , res: FastifyReply) => {
    const ID = req.params.id;
    const Status = req.body.status;
    try {
      const neededEvent = await prisma.events.update({
        where: {id: ID} , 
        data: {status: Status }
    })
    if (Status === 'first_team_won') {
      await fetch(`${process.env.BET_PLATFORM_URL}/event-status`, {
        method: 'POST' , 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({
          eventId: ID,
          status: "won"
        })
      })
    } else {
      await fetch(`${process.env.BET_PLATFORM_URL}/event-status`, {
        method: 'POST' , 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({
          eventId: ID,
          status: "lost"
        })
      })
    }
    
    return res.send(neededEvent);
    }
    catch (err) {
      throw new Error('Internal server error')
    }
})

