const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RefactoringSession = sequelize.define('RefactoringSession', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    type: {
        type: DataTypes.ENUM('single-file', 'repository', 'snippet'),
        defaultValue: 'single-file'
    },
    inputCode: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    refactoredCode: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    smellDetected: {
        type: DataTypes.STRING,
        allowNull: true
    },
    explanation: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    metrics: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Complexity, time complexity, risk score, etc.'
    },
    refactorType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'clean-code, performance, readability, security'
    },
    analysisType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    safetyStatus: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // For repository analysis
    repoUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    repoData: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'File tree, analysis results for multiple files'
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
        defaultValue: 'completed'
    }
}, {
    tableName: 'refactoring_sessions',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['type']
        },
        {
            fields: ['created_at']
        }
    ]
});

module.exports = RefactoringSession;
