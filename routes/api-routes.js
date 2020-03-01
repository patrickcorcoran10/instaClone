const db = require("../models");
const passport = require("../config/passport");

const jwt = require("jsonwebtoken");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (!user) {
        return res.sendStatus(401);
      }
      if (err) {
        return res.status(422).json(err.errors[0].message);
      }
      req.login(user, { session: false }, err => {
        if (err) {
          res.send(err);
        }
        const token = jwt.sign(user.id, process.env.JWT_SECRET);
        return res.json({
          token
        });
      });
    })(req, res);
  });
  //   res.json("/admin");
  // });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/register", function(req, res) {
    console.log(req.body);
    db.User.create({
      // name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        window.location.href = "/login";

        // res.redirect(307, "/login");
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
      });
  });

  // Route for logging user out
  app.post("/api/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
};
