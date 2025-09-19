// Script to initialize the database schema
require('dotenv').config();
const sequelize = require('./src/config/database');
const { runMigrations } = require('./src/config/schema');

async function initializeDatabase() {
  try {
    // Authenticate connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Run migrations
    await runMigrations(sequelize);
    
    console.log('Database schema initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the initialization
initializeDatabase();