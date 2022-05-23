require("dotenv").config();
var express=require("express");
var router=express.Router();

//SPOTIFY AUTHENTICATION
var cookieParser = require("cookie-parser");
var querystring = require("querystring");
var request = require("request"); // "Request" library
var access_token;
var s1, s2, a1, a2, p1, p2;
router.use(cookieParser());

const client_id="6836a36561414b15a1757f7e450ae6dd";
const client_secret="839cf1ef88c048f3a87200c098ed6791";
const redirect_uri ="http://localhost:3000/auth/spotify/callback";

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
router.get("/emotion/:mood/auth/spotify", function (req, res) {
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
});

router.get("/auth/spotify/callback", function (req, res) {
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
});

//REQUESTING SONGS FROM SPOTIFY USING ACCESS_TOKEN
//getting songs from spotify
// send id of spotify recommendations
router.get("/spotify/:name/:emotion", function (req, res) {
	var name = req.params.name;
	var emotion = req.params.emotion;
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
  
		var options = {
		  url:
			"https://api.spotify.com/v1/search?q=" +
			emotion +
			"&type=album&limit=2",
		  headers: { Authorization: "Bearer " + access_token },
		  json: true,
		};
	   request.get(options, function (error, response, body) {
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
          console.log(songs);
		  res.render("songs.ejs", { name: name, emotion:emotion, songs: songs });
		});
	  });
	});
  });

module.exports=router;
