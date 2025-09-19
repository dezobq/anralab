// Contract test for GET /api/projects/{projectId}/tasks
const request = require('supertest');
const app = require('../../server');

describe('GET /api/projects/{projectId}/tasks', () => {
  it('should return tasks for a valid project ID', async () => {
    const response = await request(app)
      .get('/api/projects/valid_project_id/tasks')
      .set('Authorization', 'Bearer valid_token');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 404 for invalid project ID', async () => {
    const response = await request(app)
      .get('/api/projects/invalid_project_id/tasks')
      .set('Authorization', 'Bearer valid_token');

    expect(response.status).toBe(404);
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/api/projects/valid_project_id/tasks');

    expect(response.status).toBe(401);
  });
});