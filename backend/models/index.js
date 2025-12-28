const User = require('./User');
const RefactoringSession = require('./RefactoringSession');

// Define relationships
User.hasMany(RefactoringSession, {
    foreignKey: 'user_id',
    as: 'sessions'
});

RefactoringSession.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

module.exports = {
    User,
    RefactoringSession
};
