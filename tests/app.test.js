import request from 'supertest';
import app from '../server.js';
import { sequelize } from '../db/database.js';

describe('App Default Route Test', () => {
    beforeAll(async () => {
        // Force the database to connect fully before tests run
        // This prevents connection attempts from lingering after Jest tears down
        await sequelize.authenticate();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should return "test" when hitting GET /', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('test');
    });
});
