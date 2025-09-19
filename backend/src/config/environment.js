// Environment configuration
require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'task_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'task_management_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  // GitHub OAuth configuration
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || 'your_github_client_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'your_github_client_secret',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback'
  },
  
  // Twilio configuration for SMS
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'your_twilio_account_sid',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || 'your_twilio_phone_number'
  },
  
  // SendGrid configuration for Email
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || 'your_sendgrid_api_key',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'your_sendgrid_from_email'
  },
  
  // WhatsApp Business API configuration
  whatsapp: {
    apiKey: process.env.WHATSAPP_API_KEY || 'your_whatsapp_api_key',
    phoneNumber: process.env.WHATSAPP_PHONE_NUMBER || 'your_whatsapp_phone_number'
  },
  
  // OpenAI configuration for onboarding agent
  openai: {
    apiKey: process.env.OPENAI_API_KEY || 'your_openai_api_key'
  }
};