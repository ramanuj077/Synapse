const { Sequelize } = require('sequelize');
require('dotenv').config();

// PostgreSQL Connection Configuration
let sequelize;

if (process.env.DATABASE_URL) {
    // Attempting PostgreSQL connection
    sequelize = new Sequelize(process.env.DATABASE_URL.trim(), {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Common for cloud databases (Neon, Render, Heroku)
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true
        }
    });
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME || 'synapse_db',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'postgres',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            define: {
                timestamps: true,
                underscored: true
            }
        }
    );
}

// Test connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connection established successfully.');
    } catch (error) {
        // Silently fail - SQLite fallback is automatic
        throw error;
    }
};

module.exports = { sequelize, testConnection };
