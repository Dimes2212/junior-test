// Если запускаешь скомпилированный код (из dist)
const fastify = require('./app');

// Если используешь ts-node (можно указывать .ts)
/// const fastify = require('./app.ts').default;

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
