const request = require('supertest');
const app = require('../index');

describe('Health Endpoint', () => {
    describe('GET /health', () => {
        it('should return 200 status', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
        });

        it('should return status ok', async () => {
            const response = await request(app).get('/health');
            expect(response.body).toHaveProperty('status', 'ok');
        });

        it('should return service name', async () => {
            const response = await request(app).get('/health');
            expect(response.body).toHaveProperty('service', 'QuoteMaster API');
        });

        it('should return valid JSON', async () => {
            const response = await request(app).get('/health');
            expect(response.headers['content-type']).toMatch(/application\/json/);
        });
    });
});
