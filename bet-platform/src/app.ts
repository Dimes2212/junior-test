// импорт библиотек ---------------------------------------------------
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

// const start = async () => {
//   try {
//     await fastify.listen({ port: Number(process.env.PORT) || 3000 });
//     console.log(`Server running on port ${process.env.PORT || 3000}`);
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };


// сама API -----------------------------------------------------------

fastify.get("/events" , async () => {
    const currentTime = Math.floor(Date.now() / 1000);
    try {
        const currentEvents = await prisma.events.findMany({
            where: {
                deadline: {
                    gte: currentTime
                }
            }
        })
        if (currentEvents) {
            return currentEvents;
        }
    }
    catch (err) {
        throw new Error('Internal server error')
    }
    
})

interface Bet {
    eventId: String , 
    amount: number
}
fastify.post('/bets', async (req: FastifyRequest<{Body: Bet}> , res: FastifyReply) => {
    const currentEventId = req.body.eventId;
    let currentAmount: number = req.body.amount;
    const count = await prisma.bets.count()
    const currentTime = Math.floor(Date.now() / 1000);
    try {
        const neededEvent = await prisma.events.findUnique({
            where : {
                AND: [
                {deadline: {gte: currentTime} },  
                {id: { equals: currentEventId}}
            ]
            }
        })
        if (neededEvent && neededEvent.deadline < currentTime) {
            const newbet = await prisma.bets.create({
                data : {
                    betId: `bet${count + 1}`,
                    eventId: currentEventId,
                    amount: currentAmount,
                    potentialWin: neededEvent.coefficient * currentAmount,
                    status: "pending"
                }
            })
        }
    }
    catch (err) {
        throw new Error('Internal server error')
    }
} )

interface Bet {
    betId: string,
    eventId: String,
    amount:  number,
    potentialWin: number,
    status: string
}

fastify.get("/bets" , async () =>  {
    try {
        const arrBets = await prisma.bets.findMany();
        return arrBets;
    }
    catch (err) {
        throw new Error('Internal server error')
    }
    
})



interface EventStatusUpdate {
    eventId: string;
    status: string;
}
fastify.post('/event-status', async (req: FastifyRequest<{ Body: EventStatusUpdate }>, res: FastifyReply) => {
    const { eventId, status } = req.body;

    try {
        const updatedEvent = await prisma.events.update({
            where: { id: eventId },
            data: { status }
        });

        return res.send(updatedEvent);
    } catch (err) {
        console.error('Ошибка при обновлении статуса события:', err);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

export = fastify;