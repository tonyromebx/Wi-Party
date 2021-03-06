var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

var exphbs = require("express-handlebars");

var exphbs = require('express-handlebars');
var hbsHelpers = exphbs.create({
    helpers: require("./helpers/handlebars.js").helpers,
    defaultLayout: 'main',
    extname: '.handlebars',
    partialsDir: __dirname + '/views/partials/'
});

app.engine('.handlebars', hbsHelpers.engine);
app.set('view engine', '.handlebars');

// Routes
// =============================================================

require("./routes/party-api.js")(app);
require("./routes/html-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
