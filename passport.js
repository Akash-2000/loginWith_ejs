const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const GOOGLE_CLIENT_ID="261827684810-6ue8oba0j86q2gdvdv3a7v8dthtqmaku.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET="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"

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   done(null,profile)
  }
));

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})