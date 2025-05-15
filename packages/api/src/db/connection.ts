import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_SSL
} = process.env;

const pool = new Pool({
  host: DB_HOST,
  port: parseInt(DB_PORT || '5432'),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release();
    
    // Create tables if they don't exist
    await initializeDatabase();
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  try {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) UNIQUE NOT NULL,
        username VARCHAR(255),
        bio TEXT,
        avatar_url TEXT,
        favorite_genres TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
};

export { pool };
