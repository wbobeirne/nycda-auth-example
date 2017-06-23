const User = require("../models/user");

function deserializeUserMW(req, res, next) {
	if (req.session.userid) {
		User.findById(req.session.userid).then(function(user) {
			if (user) {
				// Attach directly to req, NOT session
				req.user = user;
			}
			else {
				// If it was a bad userid, remove it from session
				req.session.userid = null;
			}
			next();
		});
	}
	else {
		next();
	}
}

module.exports = deserializeUserMW;
