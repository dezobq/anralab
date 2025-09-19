// Contract test for PUT /api/users/{userId}/notifications/preferences
const request = require('supertest');
const app = require('../../server');

describe('PUT /api/users/{userId}/notifications/preferences', () => {
  it('should update notification preferences for a valid user', async () => {
    const preferences = {
      email: true,
      sms: false,
      whatsapp: true
    };

    const response = await request(app)
      .put('/api/users/valid_user_id/notifications/preferences')
      .set('Authorization', 'Bearer valid_token')
      .send(preferences);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(true);
    expect(response.body.sms).toBe(false);
    expect(response.body.whatsapp).toBe(true);
  });

  it('should return 401 for unauthorized access', async () => {
    const preferences = {
      email: true,
      sms: false,
      whatsapp: true
    };

    const response = await request(app)
      .put('/api/users/valid_user_id/notifications/preferences')
      .send(preferences);

    expect(response.status).toBe(401);
  });
});