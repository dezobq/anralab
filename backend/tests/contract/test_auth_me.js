// Contract test for GET /api/auth/me
const request = require('supertest');
const app = require('../../server');

describe('GET /api/auth/me', () => {
  it('should return current user information with valid token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer valid_token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('role');
    expect(response.body).toHaveProperty('permissions');
  });

  it('should return 401 for invalid token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(401);
  });
});