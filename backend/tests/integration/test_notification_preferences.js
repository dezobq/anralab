// Integration test for notification preferences
const request = require('supertest');
const app = require('../../server');

describe('Notification Preferences', () => {
  it('should allow user to set and retrieve notification preferences', async () => {
    // Set notification preferences
    const preferences = {
      email: true,
      sms: false,
      whatsapp: true
    };

    const updateResponse = await request(app)
      .put('/api/users/current/notifications/preferences')
      .set('Authorization', 'Bearer valid_token')
      .send(preferences);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.email).toBe(true);
    expect(updateResponse.body.sms).toBe(false);
    expect(updateResponse.body.whatsapp).toBe(true);

    // Retrieve notification preferences
    const getResponse = await request(app)
      .get('/api/users/current/notifications/preferences')
      .set('Authorization', 'Bearer valid_token');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.email).toBe(true);
    expect(getResponse.body.sms).toBe(false);
    expect(getResponse.body.whatsapp).toBe(true);
  });
});