# Tasks: Ferramenta de Gerenciamento de Tarefas Colaborativas com Controles de Acesso, Convites, Notificações e Onboarding Inteligente

**Input**: Design documents from `/specs/AnRA-task-management-tool/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume web app structure based on plan.md

## Phase 3.1: Setup
- [ ] T001 Create project structure with backend/ and frontend/ directories
- [ ] T002 Initialize Node.js backend project with Express.js dependencies in backend/
- [ ] T003 Initialize React frontend project with dependencies in frontend/
- [ ] T004 [P] Configure ESLint and Prettier for code formatting in both backend/ and frontend/
- [ ] T005 Set up PostgreSQL database schema based on data-model.md
- [ ] T006 Configure environment variables for GitHub OAuth, Twilio, SendGrid, and WhatsApp API keys

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Authentication Contract Tests
- [ ] T007 [P] Contract test POST /api/auth/github in backend/tests/contract/test_auth_github.js
- [ ] T008 [P] Contract test GET /api/auth/me in backend/tests/contract/test_auth_me.js

### Task Management Contract Tests
- [ ] T009 [P] Contract test GET /api/projects/{projectId}/tasks in backend/tests/contract/test_get_tasks.js
- [ ] T010 [P] Contract test POST /api/projects/{projectId}/tasks in backend/tests/contract/test_create_task.js
- [ ] T011 [P] Contract test PUT /api/tasks/{taskId} in backend/tests/contract/test_update_task.js

### Invitation Management Contract Tests
- [ ] T012 [P] Contract test POST /api/invitations in backend/tests/contract/test_create_invitation.js
- [ ] T013 [P] Contract test GET /api/invitations in backend/tests/contract/test_get_invitations.js

### Notification Preferences Contract Tests
- [ ] T014 [P] Contract test GET /api/users/{userId}/notifications/preferences in backend/tests/contract/test_get_notification_preferences.js
- [ ] T015 [P] Contract test PUT /api/users/{userId}/notifications/preferences in backend/tests/contract/test_update_notification_preferences.js

### Onboarding Agent Contract Tests
- [ ] T016 [P] Contract test POST /api/onboarding/questions in backend/tests/contract/test_ask_question.js
- [ ] T017 [P] Contract test GET /api/onboarding/questions/{questionId}/responses in backend/tests/contract/test_get_responses.js

### Integration Tests
- [ ] T018 [P] Integration test for task creation workflow in backend/tests/integration/test_task_workflow.js
- [ ] T019 [P] Integration test for invitation flow in backend/tests/integration/test_invitation_flow.js
- [ ] T020 [P] Integration test for notification preferences in backend/tests/integration/test_notification_preferences.js
- [ ] T021 [P] Integration test for onboarding agent in backend/tests/integration/test_onboarding_agent.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Data Models [P]
- [ ] T022 [P] Task model in backend/src/models/Task.js
- [ ] T023 [P] TeamMember model in backend/src/models/TeamMember.js
- [ ] T024 [P] Project model in backend/src/models/Project.js
- [ ] T025 [P] Invitation model in backend/src/models/Invitation.js
- [ ] T026 [P] Notification model in backend/src/models/Notification.js
- [ ] T027 [P] PullRequest model in backend/src/models/PullRequest.js
- [ ] T028 [P] OnboardingQuestion model in backend/src/models/OnboardingQuestion.js
- [ ] T029 [P] OnboardingResponse model in backend/src/models/OnboardingResponse.js

### Services [P]
- [ ] T030 [P] TaskService CRUD operations in backend/src/services/TaskService.js
- [ ] T031 [P] TeamMemberService CRUD operations in backend/src/services/TeamMemberService.js
- [ ] T032 [P] ProjectService CRUD operations in backend/src/services/ProjectService.js
- [ ] T033 [P] InvitationService CRUD operations in backend/src/services/InvitationService.js
- [ ] T034 [P] NotificationService CRUD operations in backend/src/services/NotificationService.js
- [ ] T035 [P] PullRequestService CRUD operations in backend/src/services/PullRequestService.js
- [ ] T036 [P] OnboardingAgentService in backend/src/services/OnboardingAgentService.js

### API Endpoints
- [ ] T037 POST /api/auth/github endpoint in backend/src/api/auth.js
- [ ] T038 GET /api/auth/me endpoint in backend/src/api/auth.js
- [ ] T039 GET /api/projects/{projectId}/tasks endpoint in backend/src/api/tasks.js
- [ ] T040 POST /api/projects/{projectId}/tasks endpoint in backend/src/api/tasks.js
- [ ] T041 PUT /api/tasks/{taskId} endpoint in backend/src/api/tasks.js
- [ ] T042 POST /api/invitations endpoint in backend/src/api/invitations.js
- [ ] T043 GET /api/invitations endpoint in backend/src/api/invitations.js
- [ ] T044 GET /api/users/{userId}/notifications/preferences endpoint in backend/src/api/notifications.js
- [ ] T045 PUT /api/users/{userId}/notifications/preferences endpoint in backend/src/api/notifications.js
- [ ] T046 POST /api/onboarding/questions endpoint in backend/src/api/onboarding.js
- [ ] T047 GET /api/onboarding/questions/{questionId}/responses endpoint in backend/src/api/onboarding.js

### Input Validation
- [ ] T048 Task input validation in backend/src/validation/taskValidation.js
- [ ] T049 TeamMember input validation in backend/src/validation/teamMemberValidation.js
- [ ] T050 Invitation input validation in backend/src/validation/invitationValidation.js
- [ ] T051 Notification input validation in backend/src/validation/notificationValidation.js
- [ ] T052 OnboardingQuestion input validation in backend/src/validation/onboardingValidation.js

### Error Handling
- [ ] T053 Authentication error handling in backend/src/middleware/authErrorHandler.js
- [ ] T054 Database error handling in backend/src/middleware/dbErrorHandler.js
- [ ] T055 API error handling in backend/src/middleware/apiErrorHandler.js

### Frontend Components
- [ ] T056 [P] Task list component in frontend/src/components/TaskList.js
- [ ] T057 [P] Task form component in frontend/src/components/TaskForm.js
- [ ] T058 [P] Invitation form component in frontend/src/components/InvitationForm.js
- [ ] T059 [P] Notification preferences component in frontend/src/components/NotificationPreferences.js
- [ ] T060 [P] Onboarding chat component in frontend/src/components/OnboardingChat.js
- [ ] T061 [P] GitHub PR integration component in frontend/src/components/GithubPR.js

## Phase 3.4: Integration
- [ ] T062 Connect models to PostgreSQL database using Sequelize or similar ORM
- [ ] T063 Implement GitHub OAuth authentication middleware
- [ ] T064 Integrate Twilio SMS notification service
- [ ] T065 Integrate SendGrid email notification service
- [ ] T066 Integrate WhatsApp Business API
- [ ] T067 Implement real-time updates with Socket.IO
- [ ] T068 Connect frontend to backend API
- [ ] T069 Implement GitHub PR tracking integration
- [ ] T070 Integrate OpenAI GPT for onboarding agent

## Phase 3.5: Polish
- [ ] T071 [P] Unit tests for validation functions in backend/tests/unit/test_validations.js
- [ ] T072 [P] Unit tests for services in backend/tests/unit/test_services.js
- [ ] T073 [P] Frontend component tests in frontend/tests/components/
- [ ] T074 Performance tests for API endpoints (<200ms response time)
- [ ] T075 [P] Update API documentation in docs/api.md
- [ ] T076 [P] Update user guide in docs/user-guide.md
- [ ] T077 Run end-to-end tests using Cypress
- [ ] T078 Optimize database queries and add indexes
- [ ] T079 Remove code duplication and refactor
- [ ] T080 Verify quickstart guide works as described

## Dependencies
- Tests (T007-T021) before implementation (T022-T061)
- Model tasks (T022-T029) before service tasks (T030-T036)
- Service tasks (T030-T036) before API endpoint tasks (T037-T047)
- API endpoints (T037-T047) before frontend components (T056-T061)
- Core implementation (T022-T061) before integration (T062-T070)
- Integration (T062-T070) before polish (T071-T080)

## Parallel Example
```
# Launch database model tasks together:
Task: "Task model in backend/src/models/Task.js"
Task: "TeamMember model in backend/src/models/TeamMember.js"
Task: "Project model in backend/src/models/Project.js"
Task: "Invitation model in backend/src/models/Invitation.js"

# Launch service tasks together:
Task: "TaskService CRUD operations in backend/src/services/TaskService.js"
Task: "TeamMemberService CRUD operations in backend/src/services/TeamMemberService.js"
Task: "ProjectService CRUD operations in backend/src/services/ProjectService.js"
Task: "InvitationService CRUD operations in backend/src/services/InvitationService.js"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract endpoint → contract test task [P]
   - Each endpoint → implementation task

2. **From Data Model**:
   - Each entity → model creation task [P]
   - Each entity → service layer task [P]

3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Frontend → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task