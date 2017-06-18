require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const sql = require("./util/sql");
const User = require("./models/user");
const renderTemplate = require("./util/renderTemplate");

const app = express();
const cookieSecret = process.env.COOKIE_SECRET || "dev";


// *** Configuration *** //
app.set("view engine", "ejs");
app.use(express.static("assets"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(cookieSecret));
app.use(session({ secret: cookieSecret }));


// *** Routes *** //
app.get("/", function(req, res) {
	renderTemplate(res, "Welcome", "index");
});


app.get("/signup", function(req, res) {
	renderTemplate(res, "Signup", "signup");
});

app.post("/signup", function(req, res) {
	renderTemplate(res, "Signup", "signup", {
		error: "Signup not yet implemented!",
	});
});


app.get("/login", function(req, res) {
	renderTemplate(res, "Login", "login");
});

app.post("/login", function(req, res) {
	renderTemplate(res, "Login", "login", {
		error: "Login not yet implemented!",
	});
});


app.get("/home", function(req, res) {
	renderTemplate(res, "Home", "home", {
		username: "[insert username here]",
	});
});


// *** Startup *** //
sql.sync().then(function() {
	console.log("Database sync'd");
	const port = process.env.PORT || 3000;
	app.listen(port, function() {
		console.log("App is available at http://localhost:" + port);
	});
});
