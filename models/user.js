const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const sql = require("../util/sql");

function hashUserPassword(user) {
	if (user.password) {
		return bcrypt.genSalt()
			.then(function(salt) {
		    return bcrypt.hash(user.password, salt);
			})
			.then(function(hashedPw) {
				user.password = hashedPw;
			});
	}
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
		type: Sequelize.STRING(1000),
		notNull: true,
	},
}, {
	hooks: {
		beforeCreate: hashUserPassword,
		beforeUpdate: hashUserPassword,
	},
});

User.prototype.comparePassword = function(pw) {
	return bcrypt.compare(pw, this.get("password"));
};

module.exports = User;
