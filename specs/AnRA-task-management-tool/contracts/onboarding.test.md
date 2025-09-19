# Contract Tests: Onboarding Agent

## Test: POST /api/onboarding/questions - Valid question
```javascript
// Test that a valid question is created
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
```

## Test: GET /api/onboarding/questions/{questionId}/responses - Valid question
```javascript
// Test that responses are returned for a valid question
const response = await request(app)
  .get('/api/onboarding/questions/valid_question_id/responses')
  .set('Authorization', 'Bearer valid_token');

expect(response.status).toBe(200);
expect(Array.isArray(response.body)).toBe(true);
expect(response.body.length).toBeGreaterThan(0);
```