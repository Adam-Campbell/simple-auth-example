const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/userModel');
const secrets = require('./secrets');

/*
Handles standard username and password authentication.
*/
passport.use(new LocalStrategy({
    passReqToCallback: true
  },
  async (req, username, password, cb) => {
    try {
      const currentUser = await User.findOne({username: username}).select('+password').exec();
      // Check that user exists
      if (!currentUser) {
        return cb(null, false, {message: 'Incorrect username.'});
      // Check that password is valid
      } else if (!currentUser.authenticate(password)) {
          return cb(null, false, {message: 'Incorrect password.'});
      }
      // if both tests are passed, call cb with the currentUser
      return cb(null, currentUser);
    } catch (err) {
      return cb(err);
    }
    
  })
);

/*
Takes the user object for the now authenticated user, and stores the users id in the session store.
*/
passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

/*
Takes the id from the session associated with the current user, and retreives the full (sans password hash)
from the DB, then makes this object available on req.user
*/
passport.deserializeUser(async function(user_id, cb) {
  const user = await User.findById(user_id).exec();
  cb(null, user);
});


/*
Handles authentication via Facebook, either creating a new profile if it's the first login
associated with this Facebook id, or if a profile already exists then it just logs in 
as that profile.
*/
passport.use(new FacebookStrategy({
  clientID: secrets.facebookClientId,
  clientSecret: secrets.facebookClientSecret,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
async (accessToken, refreshToken, profile, cb) => {
  try {
    // see if a user associated with this Facebook id already exists,
    // if yes then pass the user to cb
    const user = await User.findOne({ facebookId: profile.id }).exec();
    if (user) {
      return cb(null, user);
    } else {
      // if there is no user associated with this Facebook id, create one and
      // pass the new user to cb
      let username = profile.username || profile.displayName
      const newUser = await User.create({
        username,
        facebookId: profile.id
      });
      return cb(null, newUser);
    }
  } catch (err) {
    return cb(err);
  }
}));

/*
Handles authentication via Google, either creating a new profile if it's the first login
associated with this Google id, or if a profile already exists then it just logs in 
as that profile.
*/
passport.use(new GoogleStrategy({
  clientID: secrets.googleClientId,
  clientSecret: secrets.googleClientSecret,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
async (accessToken, refreshToken, profile, cb) => {
  try {
    // see if a user associated with this Google id already exists,
    // if yes then pass the user to cb
    const user = await User.findOne({ googleId: profile.id }).exec();
    if (user) {
      return cb(null, user);
    } else {
      // if there is no user associated with this Google id, create one and
      // pass the new user to cb
      const newUser = await User.create({
        username: profile.displayName,
        googleId: profile.id
      });
      return cb(null, newUser);
    }
  } catch (err) {
    return cb(err);
  }
}
));