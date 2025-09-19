// Contract test for POST /api/onboarding/questions
const request = require('supertest');
const app = require('../../server');

describe('POST /api/onboarding/questions', () => {
  it('should create a new question with valid data', async () => {
    const questionData = {
      questionText: 'How do I create a task?',
      context: { projectId: 'some_project_id' }
    };

    const response = await request(app)
      .post('/api/onboarding/questions')
      .set('Authorization', 'Bearer valid_token')
      .send(questionData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.questionText).toBe(questionData.questionText);
  });

  it('should return 400 for empty question text', async () => {
    const invalidQuestionData = {
      questionText: '',
      context: { projectId: 'some_project_id' }
    };

    const response = await request(app)
      .post('/api/onboarding/questions')
      .set('Authorization', 'Bearer valid_token')
      .send(invalidQuestionData);

    expect(response.status).toBe(400);
  });

  it('should return 401 for unauthorized access', async () => {
    const questionData = {
      questionText: 'How do I create a task?',
      context: { projectId: 'some_project_id' }
    };

    const response = await request(app)
      .post('/api/onboarding/questions')
      .send(questionData);

    expect(response.status).toBe(401);
  });
});