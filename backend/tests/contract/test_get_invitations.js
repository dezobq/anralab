// Contract test for GET /api/invitations
const request = require('supertest');
const app = require('../../server');

describe('GET /api/invitations', () => {
  it('should return all invitations created by the current user', async () => {
    const response = await request(app)
      .get('/api/invitations')
      .set('Authorization', 'Bearer valid_token');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/api/invitations');

    expect(response.status).toBe(401);
  });
});