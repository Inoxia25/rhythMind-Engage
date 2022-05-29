require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const ejs = require("ejs");
const mongoose = require("mongoose");
const moment = require("moment");

const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

//Importing models
const Emotion = require("./model/emotion");
const User = require("./model/user");

const spotifyRoutes = require("./routes/spotify");
const secretkeyRoutes= require("./routes/secretkeys");
const middleware = require("./middleware"); // importing middleware object

//MONGOOSE CONNECT
const mongo_password = "sne123";

mongoose.connect(
  `mongodb://Nandini:${mongo_password}@ac-mtvzg9w-shard-00-00.mjodpgy.mongodb.net:27017,ac-mtvzg9w-shard-00-01.mjodpgy.mongodb.net:27017,ac-mtvzg9w-shard-00-02.mjodpgy.mongodb.net:27017/?ssl=true&replicaSet=atlas-2jwzki-shard-0&authSource=admin&retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  //res.locals.error = req.flash("error");
  // res.locals.success = req.flash("success");
  next();
});
app.use(express.json());
//app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/public'));
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  uniqueUser,
} = require("./utils/users");

//Logic for Chat Room

const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static("public"));
app.set("view engine", "ejs");

const botName = "Groovy";

io.on("connection", (socket) => {
  // check user is unique
  socket.on("newUser", (username) => {
    if (!uniqueUser(username)) {
      console.log("Username checks out! Welcome");
      // user is unique
      socket.emit("uniqueUser");
    } else {
      console.log("Sorry, username is already in use");
      socket.emit("duplicateUser");
    }
  });

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to Song Bud!"));

    // Broadcast to all connections except the current connection joining
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chat messages
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // User disconnecting
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

app.use("/", spotifyRoutes);
app.use("/secretkey",secretkeyRoutes);

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/mooddetector",middleware.isAuthenticated, (req, res) => {
  res.render("moodDetector");
});

app.get("/detectedmood/:mood", middleware.isAuthenticated, (req, res) => {
  console.log(req.params.mood);
  res.render("detectedMood", { name: req.user.name, mood: req.params.mood });
});

app.post("/postemotion", middleware.isAuthenticated, async (req, res) => {
  //saving the detected emotion to database to keep track of moods for mood tracker
  //const date = new Date().toISOString();
  const date= moment().utcOffset("+05:30").format();
  const emotion = req.body;
  const emotionsDetected = await new Emotion({ emotion, date }).save();
  const existingUser = await User.findById(req.user._id);
  existingUser.emotions.push(emotionsDetected);
  existingUser.save();
  console.log(existingUser);
});

app.get("/moodtracker", middleware.isAuthenticated, (req, res) => {
  res.render("moodTracker");
});
app.get("/getEmotions", middleware.isAuthenticated, (req, res) => {
  //function to send the history of users emotion to moodTracker page
  let emotionsObj = {};
  User.findById(req.user._id)
    .populate("emotions")
    .exec(function (err, foundUser) {
      if (err) {
        //req.flash("error","Campground not found!");
        console.log(err);
      } else {
        const format = "HH:mm MMMM Do, YYYY";

        emotionsObj.dates = [];
        emotionsObj.anger = [];
        emotionsObj.contempt = [];
        emotionsObj.disgust = [];
        emotionsObj.fear = [];
        emotionsObj.happiness = [];
        emotionsObj.neutral = [];
        emotionsObj.sadness = [];
        emotionsObj.surprise = [];
        foundUser.emotions.forEach(function (emotion) {
          //console.log(emotion);
          const dateTime = moment(emotion.date).utcOffset("+05:30").format(format);
          emotionsObj.dates.push(dateTime);
          emotionsObj.anger.push(emotion.emotion.anger * 100);
          console.log(emotionsObj.anger); //storing percentage of moods in separate arrays to use in mood tracker
          emotionsObj.contempt.push(emotion.emotion.contempt * 100);
          emotionsObj.disgust.push(emotion.emotion.disgust * 100);
          emotionsObj.fear.push(emotion.emotion.fear * 100);
          emotionsObj.happiness.push(emotion.emotion.happiness * 100);
          emotionsObj.neutral.push(emotion.emotion.neutral * 100);
          emotionsObj.sadness.push(emotion.emotion.sadness * 100);
          emotionsObj.surprise.push(emotion.emotion.surprise * 100);
        });
        console.log(emotionsObj);
        res.json(emotionsObj);
      }
    });
});
app.get("/likings", middleware.isAuthenticated, async (req, res) => {
  let emotionsObj = {};
  User.findById(req.user._id)
    .populate("liked_songs")
    .populate("liked_playlists")
    .exec(function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        res.render("likings", {
          songs: foundUser.liked_songs,
          playlists: foundUser.liked_playlists,
        });
      }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
