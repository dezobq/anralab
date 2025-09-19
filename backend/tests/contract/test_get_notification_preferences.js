// Contract test for GET /api/users/{userId}/notifications/preferences
const request = require('supertest');
const app = require('../../server');

describe('GET /api/users/{userId}/notifications/preferences', () => {
  it('should return notification preferences for a valid user', async () => {
    const response = await request(app)
      .get('/api/users/valid_user_id/notifications/preferences')
      .set('Authorization', 'Bearer valid_token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('sms');
    expect(response.body).toHaveProperty('whatsapp');
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/api/users/valid_user_id/notifications/preferences');

    expect(response.status).toBe(401);
  });
});