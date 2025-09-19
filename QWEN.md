# QWEN.md - AnRA Lab Context

## Project Overview

This repository follows a structured approach to software development based on the **AnRA Lab Constitution** (v1.0.0), which emphasizes:

1. **User-Centered Design** - Features must prioritize user needs and business value
2. **Collaborative Simplicity** - Maintain simplicity while enabling team collaboration
3. **Test-First Development** - TDD is mandatory for all code
4. **Transparent Communication** - Real-time visibility of team activities
5. **Secure by Design** - Security integrated from the beginning

The project currently contains a planned feature for a **Collaborative Task Management Tool** with advanced security features including access controls, privileged invitation system, multi-channel notifications, and an intelligent onboarding agent.

## Development Workflow

The project follows a standardized workflow with the following phases:

### 1. Specification (`/specify`)
- Create a feature specification using `.specify/templates/spec-template.md`
- Focus on user needs, scenarios, and testable requirements
- Avoid implementation details

### 2. Planning (`/plan`)
- Execute the plan template to generate design artifacts:
  - `research.md` - Technology decisions
  - `data-model.md` - Data entity definitions
  - `contracts/` - API contracts and contract tests
  - `quickstart.md` - Quickstart guide
- Follow the constitution check requirements

### 3. Task Generation (`/tasks`)
- Generate implementation tasks from design artifacts
- Follow Test-First Development (TDD) approach
- Order tasks by dependencies

### 4. Implementation
- Execute tasks in order
- Ensure all tests pass before merging

## Current Project Status

### Planned Feature
**Ferramenta de Gerenciamento de Tarefas Colaborativas com Controles de Acesso, Convites, Notificações e Onboarding Inteligente**

This is a web-based collaborative task management tool with:
- GitHub integration for PR tracking
- Access control and authentication
- Privileged invitation system
- Multi-channel notifications (email, SMS, WhatsApp)
- Intelligent onboarding agent (AI-powered)
- Real-time task status updates

### Technology Stack (Planned)
- **Backend**: Node.js with Express.js
- **Frontend**: React
- **Database**: PostgreSQL
- **Authentication**: GitHub OAuth
- **Notifications**: Twilio (SMS), SendGrid (Email), WhatsApp Business API
- **Real-time**: Socket.IO
- **AI**: OpenAI GPT for onboarding agent
- **Testing**: Jest (backend), Cypress (frontend)

## Directory Structure

```
.specify/
├── memory/                 # Project constitution and memory
├── scripts/                # PowerShell automation scripts
│   └── powershell/
├── templates/              # Workflow templates
│   ├── spec-template.md
│   ├── plan-template.md
│   ├── tasks-template.md
│   └── agent-file-template.md
└── commands/               # Command definitions (if exists)

.specs/
├── AnRA-task-management-tool/  # Main feature specification
│   ├── spec.md             # Feature specification
│   ├── plan.md             # Implementation plan
│   ├── research.md         # Technology research
│   ├── data-model.md       # Data model definition
│   ├── quickstart.md       # Quickstart guide
│   ├── contracts/          # API contracts and tests
│   └── tasks.md            # Implementation tasks
└── main/                   # (Placeholder directory)

.qwen/
└── commands/               # Qwen-specific command definitions
```

## Key Files

1. **`.specify/memory/constitution.md`** - Project constitution with core principles
2. **`.specify/templates/spec-template.md`** - Template for feature specifications
3. **`.specify/templates/plan-template.md`** - Template for implementation planning
4. **`.specify/templates/tasks-template.md`** - Template for task generation
5. **`specs/AnRA-task-management-tool/spec.md`** - Main feature specification
6. **`specs/AnRA-task-management-tool/tasks.md`** - Generated implementation tasks

## Development Process

### Creating a New Feature
1. Use `.specify/scripts/powershell/create-new-feature.ps1` to initialize
2. Create specification following `spec-template.md`
3. Run `/plan` command to generate design artifacts
4. Run `/tasks` command to generate implementation tasks
5. Execute tasks in order

### Test-First Development
1. Write contract tests first (must fail initially)
2. Write integration tests
3. Implement code to make tests pass
4. Add unit tests for validation
5. Refactor and optimize

## Automation Scripts

PowerShell scripts in `.specify/scripts/powershell/` provide automation for:
- Creating new features
- Setting up implementation plans
- Checking prerequisites
- Updating agent context

## Constitution Compliance

All development must comply with the AnRA Lab Constitution:
- User needs over technical preferences
- Simplicity with collaboration
- Mandatory TDD
- Real-time transparency
- Built-in security

Any deviations must be justified and documented.