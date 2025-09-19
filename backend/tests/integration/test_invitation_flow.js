// Integration test for invitation flow
const request = require('supertest');
const app = require('../../server');

describe('Invitation Flow', () => {
  it('should allow authorized user to create and manage invitations', async () => {
    // Create an invitation
    const invitationData = {
      inviteeEmail: 'newuser@example.com',
      permissions: { read: true, write: true }
    };

    const createResponse = await request(app)
      .post('/api/invitations')
      .set('Authorization', 'Bearer valid_token')
      .send(invitationData);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.inviteeEmail).toBe(invitationData.inviteeEmail);
    expect(createResponse.body.status).toBe('pending');

    // Get all invitations for the user
    const getResponse = await request(app)
      .get('/api/invitations')
      .set('Authorization', 'Bearer valid_token');

    expect(getResponse.status).toBe(200);
    expect(Array.isArray(getResponse.body)).toBe(true);
    expect(getResponse.body.length).toBeGreaterThan(0);
  });
});