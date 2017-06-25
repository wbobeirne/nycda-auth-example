require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const connectSessionSequelize = require("connect-session-sequelize");

const sql = require("./util/sql");
const User = require("./models/user");
const renderTemplate = require("./util/renderTemplate");
const deserializeUserMW = require("./middleware/deserializeUser");

const app = express();
const cookieSecret = process.env.COOKIE_SECRET || "dev";
const SessionStore = connectSessionSequelize(session.Store);


// *** Configuration *** //
app.set("view engine", "ejs");
app.use(express.static("assets"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(cookieSecret));
app.use(session({
	secret: cookieSecret,
	store: new SessionStore({ db: sql }),
}));
app.use(deserializeUserMW);


// *** Routes *** //
app.get("/", function(req, res) {
	renderTemplate(res, "Welcome", "index");
});


app.get("/signup", function(req, res) {
	renderTemplate(res, "Signup", "signup");
});

app.post("/signup", function(req, res) {
	User.create({
		username: req.body.username,
		password: req.body.password,
	})
	.then(function(user) {
		req.session.userid = user.id;
		res.redirect("/home");
	})
	.catch(function(err) {
		renderTemplate(res, "Signup", "signup", {
			error: "Invalid username or password",
		});
	});
});


app.get("/login", function(req, res) {
	renderTemplate(res, "Login", "login");
});

app.post("/login", function(req, res) {
	User.findOne({
		where: {
			username: req.body.username,
		},
	})
	.then(function(user) {
		if (user) {
			user.comparePassword(req.body.password).then(function(valid) {
				if (valid) {
					req.session.userid = user.get("id");
					res.redirect("/home");
				}
				else {
					renderTemplate(res, "Login", "login", {
						error: "Incorrect password",
					});
				}
			});
		}
		else {
			renderTemplate(res, "Login", "login", {
				error: "Username not found",
			});
		}
	})
	.catch(function(err) {
		console.log(err);
		renderTemplate(res, "Login", "login", {
			error: "The database exploded, please try again"
		});
	});
});


app.get("/home", function(req, res) {
	if (req.user) {
		renderTemplate(res, "Home", "home", {
			username: req.user.get("username"),
		});
	}
	else {
		res.redirect("/");
	}
});


// *** Startup *** //
sql.sync().then(function() {
	console.log("Database sync'd");
	const port = process.env.PORT || 3000;
	app.listen(port, function() {
		console.log("App is available at http://localhost:" + port);
	});
});
