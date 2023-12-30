const request = require('supertest');
const app = require('./path-to-your-app');

describe('File Routes', () => {
  it('should upload a file', async () => {
    const response = await request(app)
      .post('/api/files/upload')
      .attach('file', '../test.txt');
    });
  });