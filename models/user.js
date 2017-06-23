const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const sql = require("../util/sql");

// Hook that hashes the user's password before saving
function hashUserPassword(user, options) {
	return bcrypt.genSalt()
		.then(function(salt) {
			return bcrypt.hash(user.password, salt);
		})
		.then(function(hashedPw) {
			user.password = hashedPw;
		});
}


const User = sql.define("user", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	username: {
		type: Sequelize.STRING,
		notNull: true,
		unique: true,
	},
	password: {
		type: Sequelize.STRING,
		notNull: true,
	},
}, {
	hooks: {
		beforeCreate: hashUserPassword,
		beforeUpdate: hashUserPassword,
	},
});

// Function for comparing a submitted password with the user's
User.prototype.comparePassword = function(pw) {
	return bcrypt.compare(pw, this.get("password"));
};

module.exports = User;
