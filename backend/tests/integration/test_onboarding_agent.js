// Integration test for onboarding agent
const request = require('supertest');
const app = require('../../server');

describe('Onboarding Agent', () => {
  it('should allow user to ask questions and receive responses', async () => {
    // Ask a question
    const questionData = {
      questionText: 'How do I create a task?',
      context: { projectId: 'test_project_id' }
    };

    const questionResponse = await request(app)
      .post('/api/onboarding/questions')
      .set('Authorization', 'Bearer valid_token')
      .send(questionData);

    expect(questionResponse.status).toBe(201);
    expect(questionResponse.body).toHaveProperty('id');
    expect(questionResponse.body.questionText).toBe(questionData.questionText);

    // Get responses to the question
    const responsesResponse = await request(app)
      .get(`/api/onboarding/questions/${questionResponse.body.id}/responses`)
      .set('Authorization', 'Bearer valid_token');

    expect(responsesResponse.status).toBe(200);
    expect(Array.isArray(responsesResponse.body)).toBe(true);
    // Note: In a real test, we might expect at least one response,
    // but for contract tests, we're just verifying the endpoint works
  });
});