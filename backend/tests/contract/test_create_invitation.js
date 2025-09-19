// Contract test for POST /api/invitations
const request = require('supertest');
const app = require('../../server');

describe('POST /api/invitations', () => {
  it('should create a new invitation with valid data', async () => {
    const invitationData = {
      inviteeEmail: 'test@example.com',
      permissions: { read: true, write: false }
    };

    const response = await request(app)
      .post('/api/invitations')
      .set('Authorization', 'Bearer valid_token')
      .send(invitationData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.inviteeEmail).toBe(invitationData.inviteeEmail);
    expect(response.body.status).toBe('pending');
  });

  it('should return 400 for invalid email', async () => {
    const invalidInvitationData = {
      inviteeEmail: 'invalid-email',
      permissions: { read: true }
    };

    const response = await request(app)
      .post('/api/invitations')
      .set('Authorization', 'Bearer valid_token')
      .send(invalidInvitationData);

    expect(response.status).toBe(400);
  });
});