# Contract Tests: Invitation Management

## Test: POST /api/invitations - Valid invitation data
```javascript
// Test that a valid invitation is created
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
```

## Test: POST /api/invitations - Invalid email
```javascript
// Test that an invalid email returns 400
const invalidInvitationData = {
  inviteeEmail: 'invalid-email',
  permissions: { read: true }
};

const response = await request(app)
  .post('/api/invitations')
  .set('Authorization', 'Bearer valid_token')
  .send(invalidInvitationData);

expect(response.status).toBe(400);
```

## Test: GET /api/invitations - Valid request
```javascript
// Test that invitations are returned for the current user
const response = await request(app)
  .get('/api/invitations')
  .set('Authorization', 'Bearer valid_token');

expect(response.status).toBe(200);
expect(Array.isArray(response.body)).toBe(true);
```