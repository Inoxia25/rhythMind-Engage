const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new SpotifyStrategy({
  clientID: "6836a36561414b15a1757f7e450ae6dd",
  clientSecret: "839cf1ef88c048f3a87200c098ed6791",
  callbackURL: "https://rhyth-mind.herokuapp.com/auth/spotify/callback"
},
function(accessToken, refreshToken, profile, done) {
   // Initialize spotifyapi object
   var spotifyApi = new SpotifyWebApi({
    clientID: "6836a36561414b15a1757f7e450ae6dd",
    clientSecret: "839cf1ef88c048f3a87200c098ed6791",
    callbackURL: "https://rhyth-mind.herokuapp.com/auth/spotify/callback"
});

// Set accesstoken for api objct
spotifyApi.setAccessToken(accessToken);
  return done(null, profile);
}
));