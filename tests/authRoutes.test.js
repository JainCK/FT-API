// tests/authRoutes.test.js

const request = require('supertest');
const app = require('../app'); // Adjust the path based on your project structure

describe('Authentication Routes', () => {
  test('User Registration', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword',
      });

    expect(response.status).toBe(201);
    // Add more assertions based on the expected response
  });

  test('User Login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword',
      });

    expect(response.status).toBe(200);
    // Add more assertions based on the expected response, e.g., check for the presence of a token
  });
});
