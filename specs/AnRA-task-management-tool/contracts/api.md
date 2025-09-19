# API Contracts

## Authentication and Authorization

### POST /api/auth/github
Authenticate user via GitHub OAuth

**Request:**
```json
{
  "code": "string"  // GitHub OAuth code
}
```

**Response (200):**
```json
{
  "token": "string",
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "member|admin"
  }
}
```

**Response (401):**
```json
{
  "error": "Invalid OAuth code"
}
```

### GET /api/auth/me
Get current user information

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "member|admin",
  "permissions": {}
}
```

## Task Management

### GET /api/projects/{projectId}/tasks
Get all tasks for a project

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string|null",
    "assignee": {
      "id": "uuid",
      "name": "string"
    },
    "status": "todo|in_progress|review|done",
    "priority": "low|medium|high|urgent",
    "dueDate": "iso8601|null",
    "createdAt": "iso8601",
    "updatedAt": "iso8601"
  }
]
```

### POST /api/projects/{projectId}/tasks
Create a new task

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "title": "string",
  "description": "string|null",
  "assigneeId": "uuid|null",
  "status": "todo|in_progress|review|done",
  "priority": "low|medium|high|urgent",
  "dueDate": "iso8601|null"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string|null",
  "assigneeId": "uuid|null",
  "status": "todo|in_progress|review|done",
  "priority": "low|medium|high|urgent",
  "dueDate": "iso8601|null",
  "createdAt": "iso8601",
  "updatedAt": "iso8601"
}
```

### PUT /api/tasks/{taskId}
Update a task

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "title": "string",
  "description": "string|null",
  "assigneeId": "uuid|null",
  "status": "todo|in_progress|review|done",
  "priority": "low|medium|high|urgent",
  "dueDate": "iso8601|null"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string|null",
  "assigneeId": "uuid|null",
  "status": "todo|in_progress|review|done",
  "priority": "low|medium|high|urgent",
  "dueDate": "iso8601|null",
  "createdAt": "iso8601",
  "updatedAt": "iso8601"
}
```

## Invitation Management

### POST /api/invitations
Create a new invitation

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "inviteeEmail": "string",
  "permissions": {}
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "inviteeEmail": "string",
  "inviterId": "uuid",
  "permissions": {},
  "status": "pending",
  "expirationDate": "iso8601",
  "createdAt": "iso8601"
}
```

### GET /api/invitations
Get all invitations created by the current user

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "inviteeEmail": "string",
    "permissions": {},
    "status": "pending|accepted|expired|revoked",
    "expirationDate": "iso8601",
    "createdAt": "iso8601",
    "acceptedAt": "iso8601|null"
  }
]
```

## Notification Preferences

### GET /api/users/{userId}/notifications/preferences
Get notification preferences for a user

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "email": true,
  "sms": false,
  "whatsapp": true
}
```

### PUT /api/users/{userId}/notifications/preferences
Update notification preferences for a user

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "email": true,
  "sms": false,
  "whatsapp": true
}
```

**Response (200):**
```json
{
  "email": true,
  "sms": false,
  "whatsapp": true
}
```

## Onboarding Agent

### POST /api/onboarding/questions
Ask a question to the onboarding agent

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "questionText": "string",
  "context": {}
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "questionText": "string",
  "context": {},
  "askedById": "uuid",
  "createdAt": "iso8601"
}
```

### GET /api/onboarding/questions/{questionId}/responses
Get responses to a question

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "responseText": "string",
    "confidenceLevel": 0,
    "sourceDocumentation": "string|null",
    "questionId": "uuid",
    "createdAt": "iso8601"
  }
]
```