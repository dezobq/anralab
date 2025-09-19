// Contract test for POST /api/auth/github
const request = require('supertest');
const app = require('../../server');

describe('POST /api/auth/github', () => {
  it('should authenticate user via GitHub OAuth with valid code', async () => {
    const response = await request(app)
      .post('/api/auth/github')
      .send({ code: 'valid_oauth_code' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('name');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('role');
  });

  it('should return 401 for invalid OAuth code', async () => {
    const response = await request(app)
      .post('/api/auth/github')
      .send({ code: 'invalid_oauth_code' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});