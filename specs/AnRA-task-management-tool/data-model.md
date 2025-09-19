# Data Model: Task Management Tool

## Task
Represents a unit of work assigned to team members.

### Attributes:
- id: UUID (Primary Key)
- title: String (Required)
- description: Text (Optional)
- assigneeId: UUID (Foreign Key to TeamMember)
- status: Enum (todo, in_progress, review, done)
- priority: Enum (low, medium, high, urgent)
- dueDate: DateTime (Optional)
- createdAt: DateTime (Required)
- updatedAt: DateTime (Required)
- projectId: UUID (Foreign Key to Project)
- githubPrId: String (Optional, GitHub Pull Request ID)

### Relationships:
- Belongs to one Project
- Belongs to one TeamMember (assignee)
- Can have many Notifications
- Can have many OnboardingQuestions (through context)

### Validation Rules:
- Title must be between 1 and 255 characters
- Status must be one of the defined enum values
- Priority must be one of the defined enum values
- Due date, if provided, must be in the future

## TeamMember
Represents an authorized user of the system.

### Attributes:
- id: UUID (Primary Key)
- name: String (Required)
- email: String (Required, Unique)
- role: Enum (member, admin)
- permissions: JSON (Object defining specific permissions)
- availabilityStatus: Enum (available, busy, offline, away)
- githubHandle: String (Optional)
- createdAt: DateTime (Required)
- updatedAt: DateTime (Required)
- lastLoginAt: DateTime (Optional)

### Relationships:
- Can be assigned many Tasks
- Can create many Invitations
- Can receive many Notifications
- Can ask many OnboardingQuestions

### Validation Rules:
- Email must be a valid email format
- Role must be one of the defined enum values
- Availability status must be one of the defined enum values

## Project
Collection of tasks and team members.

### Attributes:
- id: UUID (Primary Key)
- name: String (Required)
- description: Text (Optional)
- createdAt: DateTime (Required)
- updatedAt: DateTime (Required)
- ownerId: UUID (Foreign Key to TeamMember)

### Relationships:
- Has many Tasks
- Has many TeamMembers (through a join table)
- Belongs to one TeamMember (owner)

### Validation Rules:
- Name must be between 1 and 100 characters

## Invitation
Privileged access request for new team members.

### Attributes:
- id: UUID (Primary Key)
- inviteeEmail: String (Required)
- inviterId: UUID (Foreign Key to TeamMember)
- permissions: JSON (Object defining permissions for the invitee)
- status: Enum (pending, accepted, expired, revoked)
- expirationDate: DateTime (Required)
- createdAt: DateTime (Required)
- acceptedAt: DateTime (Optional)

### Relationships:
- Belongs to one TeamMember (inviter)
- Can result in a new TeamMember

### Validation Rules:
- Invitee email must be a valid email format
- Status must be one of the defined enum values
- Expiration date must be in the future

## Notification
Automated message sent to team members.

### Attributes:
- id: UUID (Primary Key)
- recipientId: UUID (Foreign Key to TeamMember)
- channelId: Enum (email, sms, whatsapp)
- content: Text (Required)
- status: Enum (pending, sent, failed)
- relatedTaskId: UUID (Foreign Key to Task, Optional)
- createdAt: DateTime (Required)
- sentAt: DateTime (Optional)

### Relationships:
- Belongs to one TeamMember (recipient)
- Can be related to one Task

### Validation Rules:
- Channel must be one of the defined enum values
- Status must be one of the defined enum values

## PullRequest
GitHub Pull Request associated with tasks.

### Attributes:
- id: String (Primary Key, GitHub PR ID)
- url: String (Required)
- status: Enum (open, closed, merged)
- taskId: UUID (Foreign Key to Task)
- authorId: String (GitHub user ID)
- createdAt: DateTime (Required)
- updatedAt: DateTime (Required)

### Relationships:
- Belongs to one Task

### Validation Rules:
- Status must be one of the defined enum values

## OnboardingQuestion
User query to the intelligent agent.

### Attributes:
- id: UUID (Primary Key)
- questionText: Text (Required)
- context: JSON (Optional, additional context)
- askedById: UUID (Foreign Key to TeamMember)
- createdAt: DateTime (Required)

### Relationships:
- Belongs to one TeamMember (asker)

### Validation Rules:
- Question text must not be empty

## OnboardingResponse
Agent's answer to user questions.

### Attributes:
- id: UUID (Primary Key)
- responseText: Text (Required)
- confidenceLevel: Integer (0-100)
- sourceDocumentation: Text (Optional)
- questionId: UUID (Foreign Key to OnboardingQuestion)
- createdAt: DateTime (Required)

### Relationships:
- Belongs to one OnboardingQuestion

### Validation Rules:
- Confidence level must be between 0 and 100
- Response text must not be empty