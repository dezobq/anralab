// Integration test for task creation workflow
const request = require('supertest');
const app = require('../../server');

describe('Task Creation Workflow', () => {
  it('should allow user to create a project and tasks', async () => {
    // Create a project
    const projectData = {
      name: 'Test Project',
      description: 'Test project description'
    };

    const projectResponse = await request(app)
      .post('/api/projects')
      .set('Authorization', 'Bearer valid_token')
      .send(projectData);

    expect(projectResponse.status).toBe(201);
    expect(projectResponse.body).toHaveProperty('id');
    expect(projectResponse.body.name).toBe(projectData.name);

    // Create a task in the project
    const taskData = {
      title: 'Test Task',
      description: 'Test task description',
      projectId: projectResponse.body.id,
      status: 'todo',
      priority: 'medium'
    };

    const taskResponse = await request(app)
      .post(`/api/projects/${projectResponse.body.id}/tasks`)
      .set('Authorization', 'Bearer valid_token')
      .send(taskData);

    expect(taskResponse.status).toBe(201);
    expect(taskResponse.body).toHaveProperty('id');
    expect(taskResponse.body.title).toBe(taskData.title);
    expect(taskResponse.body.projectId).toBe(projectResponse.body.id);
  });
});