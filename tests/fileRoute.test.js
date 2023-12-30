const request = require('supertest');
const app = require('./path-to-your-app');

describe('File Routes', () => {
  it('should upload a file', async () => {
    const response = await request(app)
      .post('/api/files/upload')
      .attach('file', '../test.txt');

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'File uploaded successfully');
    expect(response.body).toHaveProperty('fileId');
    });
  });