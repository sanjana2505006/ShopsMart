process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const app = require('../src/app');
const { ensureDatabase } = require('../src/bootstrap');
const prisma = require('../src/prisma');

beforeAll(async () => {
    await ensureDatabase();
});

beforeEach(async () => {
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });
});

describe('POST /api/auth/signup', () => {
    it('creates an account and returns a token', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Riya Sharma',
                email: 'riya@college.edu',
                password: 'smartshop123',
                role: 'student',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toMatchObject({
            name: 'Riya Sharma',
            email: 'riya@college.edu',
            role: 'student',
        });
    });
});

describe('POST /api/auth/login', () => {
    it('logs in an existing user', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Mess Admin',
                email: 'admin@college.edu',
                password: 'committee123',
                role: 'admin',
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@college.edu',
                password: 'committee123',
            });

        expect(loginRes.statusCode).toEqual(200);
        expect(loginRes.body).toHaveProperty('token');
        expect(loginRes.body.user).toMatchObject({
            role: 'admin',
            email: 'admin@college.edu',
        });
    });
});
