// Contract test for POST /api/projects/{projectId}/tasks
const request = require('supertest');
const app = require('../../server');

describe('POST /api/projects/{projectId}/tasks', () => {
  it('should create a new task with valid data', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo',
      priority: 'medium'
    };

    const response = await request(app)
      .post('/api/projects/valid_project_id/tasks')
      .set('Authorization', 'Bearer valid_token')
      .send(taskData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(taskData.title);
  });

  it('should return 400 for invalid task data', async () => {
    const invalidTaskData = {
      title: '',  // Invalid: empty title
      status: 'invalid_status'  // Invalid: not in enum
    };

    const response = await request(app)
      .post('/api/projects/valid_project_id/tasks')
      .set('Authorization', 'Bearer valid_token')
      .send(invalidTaskData);

    expect(response.status).toBe(400);
  });
});