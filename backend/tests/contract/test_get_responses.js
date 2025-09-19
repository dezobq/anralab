// Contract test for GET /api/onboarding/questions/{questionId}/responses
const request = require('supertest');
const app = require('../../server');

describe('GET /api/onboarding/questions/{questionId}/responses', () => {
  it('should return responses for a valid question', async () => {
    const response = await request(app)
      .get('/api/onboarding/questions/valid_question_id/responses')
      .set('Authorization', 'Bearer valid_token');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return 404 for invalid question ID', async () => {
    const response = await request(app)
      .get('/api/onboarding/questions/invalid_question_id/responses')
      .set('Authorization', 'Bearer valid_token');

    expect(response.status).toBe(404);
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/api/onboarding/questions/valid_question_id/responses');

    expect(response.status).toBe(401);
  });
});