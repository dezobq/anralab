// Contract test for PUT /api/tasks/{taskId}
const request = require('supertest');
const app = require('../../server');

describe('PUT /api/tasks/{taskId}', () => {
  it('should update a task with valid data', async () => {
    const updateData = {
      status: 'in_progress'
    };

    const response = await request(app)
      .put('/api/tasks/valid_task_id')
      .set('Authorization', 'Bearer valid_token')
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(updateData.status);
  });

  it('should return 404 for invalid task ID', async () => {
    const updateData = {
      status: 'in_progress'
    };

    const response = await request(app)
      .put('/api/tasks/invalid_task_id')
      .set('Authorization', 'Bearer valid_token')
      .send(updateData);

    expect(response.status).toBe(404);
  });
});