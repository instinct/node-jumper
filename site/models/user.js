
module.exports = function(sequelize, DataTypes) {

	return sequelize.define('User', {
		username: DataTypes.STRING(32),
		email: DataTypes.STRING(128),
		password: DataTypes.STRING(32),
		joined: DataTypes.DATE,
		lastLogin: DataTypes.DATE,
	},
	{
		timestamps: false,
		tableName: 'user'
	});

};