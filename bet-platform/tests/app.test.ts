const request = require('supertest');
const app = require('../src/app');


beforeAll(async () => {
  await app.ready(); // Fastify должен подняться
});

afterAll(async () => {
  await app.close(); // закрываем сервер после тестов
});

describe('API Tests', () => {
  it('GET /events должно вернуть массив', async () => {
    const res = await request(app.server).get('/events');
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /bets должно вернуть массив', async () => {
    const res = await request(app.server).get('/bets');
    expect(Array.isArray(res.body)).toBe(true);
  });
});
