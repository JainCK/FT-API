// tests/fileRoutes.test.js

const request = require('supertest');
const app = require('../app'); // Adjust the path based on your project structure
const mongoose = require('mongoose');
const File = require('../src/models/File');

// Set up a test database


// Clear the test database before each test
beforeEach(async () => {
  await File.deleteMany();
});

// Close the test database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('File Management Routes', () => {
  test('Update File Metadata (Filename)', async () => {
    // Create a test file
    const file = new File({
      filename: 'testFile.txt',
      size: 1024,
      type: 'text/plain',
    });
    await file.save();

    const response = await request(app)
      .put(`/api/files/${file._id}`)
      .send({
        filename: 'updatedFileName.txt',
      });

    // Check if the response indicates success
    expect(response.status).toBe(200);

    // Check if the file metadata is updated
    const updatedFile = await File.findById(file._id);
    expect(updatedFile.filename).toBe('updatedFileName.txt');
  });
});
