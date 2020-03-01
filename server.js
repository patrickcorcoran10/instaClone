const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const app = express();
const session = require("express-session");
const passport = require("./config/passport");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: "pictures", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const db = require("./models");

require("./routes/api-routes")(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, ".client/build/index.html"));
});

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("We are Taking Snap Shots on ", PORT);
  });
});
