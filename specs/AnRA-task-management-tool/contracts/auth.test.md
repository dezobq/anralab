# Contract Tests: Authentication

## Test: POST /api/auth/github - Valid OAuth code
```javascript
// Test that a valid OAuth code returns a token and user info
const response = await request(app)
  .post('/api/auth/github')
  .send({ code: 'valid_oauth_code' });

expect(response.status).toBe(200);
expect(response.body).toHaveProperty('token');
expect(response.body.user).toHaveProperty('id');
expect(response.body.user).toHaveProperty('name');
expect(response.body.user).toHaveProperty('email');
```

## Test: POST /api/auth/github - Invalid OAuth code
```javascript
// Test that an invalid OAuth code returns 401
const response = await request(app)
  .post('/api/auth/github')
  .send({ code: 'invalid_oauth_code' });

expect(response.status).toBe(401);
expect(response.body).toHaveProperty('error');
```

## Test: GET /api/auth/me - Valid token
```javascript
// Test that a valid token returns user info
const response = await request(app)
  .get('/api/auth/me')
  .set('Authorization', 'Bearer valid_token');

expect(response.status).toBe(200);
expect(response.body).toHaveProperty('id');
expect(response.body).toHaveProperty('name');
expect(response.body).toHaveProperty('email');
expect(response.body).toHaveProperty('role');
```

## Test: GET /api/auth/me - Invalid token
```javascript
// Test that an invalid token returns 401
const response = await request(app)
  .get('/api/auth/me')
  .set('Authorization', 'Bearer invalid_token');

expect(response.status).toBe(401);
```