const User = require("../models/user");

function deserializeUserMW(req, res, next) {
	if (req.session.userid) {
		User.findById(req.session.userid)
			.then(function(user) {
				req.user = user;
				next();
			})
			.catch(function(err) {
				console.error("Something went wrong deserializing user " + req.session.userid);
				console.error(err);
				next();
			});
	}
	else {
		next();
	}
}

module.exports = deserializeUserMW;
