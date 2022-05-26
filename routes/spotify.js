require("dotenv").config();
var express=require("express");
var router=express.Router();
let access_token;
//SPOTIFY LOGIN
//const cookieSession = require('cookie-session')
const session = require('express-session');
const passport = require('passport');
const  SpotifyStrategy = require('passport-spotify').Strategy;
const User=require('../model/user.js');

//require('./passport')

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. 
passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        });
});
  
  // Using the SpotifyStrategy within Passport.
  passport.use(
    new SpotifyStrategy(
      {
        clientID: "6836a36561414b15a1757f7e450ae6dd",
  clientSecret: "839cf1ef88c048f3a87200c098ed6791",
  //  callbackURL: "https://rhyth-mind.herokuapp.com/auth/spotify/callback"
  callbackURL: "http://localhost:3000/auth/spotify/callback"
      },
     async function (access_token, refresh_token, expires_in, profile, done) {
        const spotify_id = profile.id
    const name = profile.displayName
    //const email = profile.emails[0].value
        access_token=access_token;
    const existingUser = await User.findOne({ spotify_id: profile.id });

    if (existingUser) {
        existingUser.access_token=access_token;
        existingUser.save();
        return done(null, existingUser);
    }

    const user = await new User({ spotify_id, name, access_token, refresh_token}).save();

    done(null, user);
      }
    )
  );
  router.use(
    session({secret: 'keyboard cat', resave: true, saveUninitialized: true})
  );
/*app.use(cookieSession({
    name: 'spotify-auth-session',  
    keys: ['key1', 'key2']
  }))*/
  router.use(passport.initialize());
  router.use(passport.session());

  //MIDDLEWARE-- add this before all routes
router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    //res.locals.error = req.flash("error");
   // res.locals.success = req.flash("success");
    next();
  });

  //SPOTIFY AUTHENTICATION
var cookieParser = require("cookie-parser");
var querystring = require("querystring");
var request = require("request"); // "Request" library

var s1, s2, a1, a2, p1, p2;
router.use(cookieParser());

const client_id="6836a36561414b15a1757f7e450ae6dd";
const client_secret="839cf1ef88c048f3a87200c098ed6791";
const redirect_uri ="https://rhyth-mind.herokuapp.com/auth/spotify/callback";

let emotion;

//function to generate random string to be used in authentication
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


var stateKey = "spotify_auth_state";
//Earlier login url was '/emotion/:mood/auth/spotify'
router.get('/auth/spotify',passport.authenticate('spotify'),function (req,res){
    //emotion=req.params.mood;
});

/*router.get("/emotion/:mood/auth/spotify", function (req, res) {
    emotion=req.params.mood;
  var state = generateRandomString(16);
  res.cookie(stateKey, state)
  // your application requests authorization
  var scope = "user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});*/

router.get(
    "/auth/spotify/callback",
    passport.authenticate('spotify', {failureRedirect: '/auth/spotify'}),
    function (req, res) {
      res.redirect('/home');
    }
  );
/*router.get("/auth/spotify/callback", function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };
        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          songs = {};
          const name=body.display_name;
          console.log(body.display_name);
          console.log(emotion);
          res.redirect(`/spotify/${name}/${emotion}`);
        });
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});*/

router.get('/logout', function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/home');
      });
  });

//REQUESTING SONGS FROM SPOTIFY USING ACCESS_TOKEN
//getting songs from spotify
// send id of spotify recommendations
router.get("/spotify/:name/:emotion", function (req, res) {
	var name = req.params.name;
	var emotion = req.params.emotion;
    console.log(req.user);
    access_token=req.user.access_token;
	var options = {
	  url:
		"https://api.spotify.com/v1/search?q=" +
		emotion +
		"&type=playlist&limit=2",
	  headers: { Authorization: "Bearer " + access_token },
	  json: true,
	};
	// use the access token to access the Spotify Web API
   request.get(options, function (error, response, body) {
	  p1 = body.playlists.items[0].id;
	  p2 = body.playlists.items[1].id;
	  //getting the tracks
	  var options = {
		url:
		  "https://api.spotify.com/v1/search?q=" +
		  emotion +
		  "&type=track&limit=2",
		headers: { Authorization: "Bearer " + access_token },
		json: true,
	  };
	  request.get(options, function (error, response, body) {
		s1 = body.tracks.items[0].id;
		s2 = body.tracks.items[1].id;
  
		/*var options = {
		  url:
			"https://api.spotify.com/v1/search?q=" +
			emotion +
			"&type=album&limit=2",
		  headers: { Authorization: "Bearer " + access_token },
		  json: true,
        };*/
          var songs = {
			s1: s1,
			s2: s2,
			p1: p1,
			p2: p2,
			/*a1: a1,
			a2: a2,*/
		  };;
		  res.render("songs.ejs", { name: name, emotion:emotion, songs: songs });
	
	   /*request.get(options, function (error, response, body) {
		  a1 = body.albums.items[0].id;
		  a2 = body.albums.items[1].id;
		  var songs = {
			s1: s1,
			s2: s2,
			p1: p1,
			p2: p2,
			a1: a1,
			a2: a2,
		  };
         
		  res.render("songs.ejs", { name: name, emotion:emotion, songs: songs });
		});*/
	  });
	});
  });

module.exports=router;
