// Main database schema setup
const fs = require('fs');
const path = require('path');

// Function to run all migrations in order
async function runMigrations(sequelize) {
  const queryInterface = sequelize.getQueryInterface();
  const Sequelize = sequelize.constructor;
  
  // Load and run migrations in order
  const migrationFiles = [
    '01_create_team_members_table.js',
    '02_create_projects_table.js',
    '03_create_tasks_table.js',
    '04_create_invitations_table.js',
    '05_create_notifications_table.js',
    '06_create_pull_requests_table.js',
    '07_create_onboarding_questions_table.js',
    '08_create_onboarding_responses_table.js'
  ];
  
  for (const file of migrationFiles) {
    const migrationPath = path.join(__dirname, 'migrations', file);
    if (fs.existsSync(migrationPath)) {
      console.log(`Running migration: ${file}`);
      const migration = require(migrationPath);
      await migration.up(queryInterface, Sequelize);
    }
  }
  
  console.log('All migrations completed successfully');
}

module.exports = { runMigrations };