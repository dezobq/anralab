# Quickstart Guide: Task Management Tool

## Prerequisites
1. Node.js v18+ installed
2. PostgreSQL database
3. GitHub account for OAuth setup
4. Twilio account for SMS notifications
5. SendGrid account for email notifications
6. WhatsApp Business API access

## Installation
1. Clone the repository
2. Run `npm install` in both frontend and backend directories
3. Set up environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `GITHUB_CLIENT_ID` - GitHub OAuth client ID
   - `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
   - `TWILIO_ACCOUNT_SID` - Twilio account SID
   - `TWILIO_AUTH_TOKEN` - Twilio auth token
   - `SENDGRID_API_KEY` - SendGrid API key
   - `WHATSAPP_API_KEY` - WhatsApp Business API key

## Running the Application
1. Start the backend server: `npm run start` in the backend directory
2. Start the frontend: `npm run start` in the frontend directory
3. Visit `http://localhost:3000` in your browser

## Authentication
1. Click "Sign in with GitHub" on the login page
2. Authorize the application in GitHub
3. You'll be redirected to the dashboard

## Creating a Task
1. Navigate to the "Tasks" section
2. Click "New Task"
3. Fill in the task details
4. Click "Create Task"

## Setting Up Notifications
1. Go to "Settings" → "Notifications"
2. Select which channels you want to receive notifications on
3. Save your preferences

## Inviting Team Members
1. Go to "Settings" → "Team"
2. Click "Invite Member"
3. Enter the email address and set permissions
4. Click "Send Invitation"

## Using the Onboarding Agent
1. Click on the "Help" icon in the navigation bar
2. Type your question in the chat interface
3. Receive an AI-powered response with relevant information

## GitHub Integration
1. Tasks can be linked to GitHub Pull Requests
2. PR status updates will automatically sync with task status
3. View PR details directly in the task interface

## Testing
1. Run backend tests: `npm run test` in the backend directory
2. Run frontend tests: `npm run test` in the frontend directory
3. Run end-to-end tests: `npm run test:e2e`

## Deployment
1. Set up a Heroku app
2. Configure environment variables in Heroku
3. Deploy using Heroku CLI or GitHub integration