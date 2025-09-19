# Contract Tests: Task Management

## Test: GET /api/projects/{projectId}/tasks - Valid project ID
```javascript
// Test that tasks for a valid project are returned
const response = await request(app)
  .get('/api/projects/valid_project_id/tasks')
  .set('Authorization', 'Bearer valid_token');

expect(response.status).toBe(200);
expect(Array.isArray(response.body)).toBe(true);
```

## Test: GET /api/projects/{projectId}/tasks - Invalid project ID
```javascript
// Test that an invalid project ID returns 404
const response = await request(app)
  .get('/api/projects/invalid_project_id/tasks')
  .set('Authorization', 'Bearer valid_token');

expect(response.status).toBe(404);
```

## Test: GET /api/projects/{projectId}/tasks - Unauthorized
```javascript
// Test that unauthorized access returns 401
const response = await request(app)
  .get('/api/projects/valid_project_id/tasks');

expect(response.status).toBe(401);
```

## Test: POST /api/projects/{projectId}/tasks - Valid task data
```javascript
// Test that a valid task is created
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
```

## Test: POST /api/projects/{projectId}/tasks - Invalid task data
```javascript
// Test that invalid task data returns 400
const invalidTaskData = {
  title: '',  // Invalid: empty title
  status: 'invalid_status'  // Invalid: not in enum
};

const response = await request(app)
  .post('/api/projects/valid_project_id/tasks')
  .set('Authorization', 'Bearer valid_token')
  .send(invalidTaskData);

expect(response.status).toBe(400);
```

## Test: PUT /api/tasks/{taskId} - Valid update
```javascript
// Test that a task can be updated
const updateData = {
  status: 'in_progress'
};

const response = await request(app)
  .put('/api/tasks/valid_task_id')
  .set('Authorization', 'Bearer valid_token')
  .send(updateData);

expect(response.status).toBe(200);
expect(response.body.status).toBe(updateData.status);
```