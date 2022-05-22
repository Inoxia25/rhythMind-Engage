const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const ejs = require("ejs");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const spotifyRoutes = require("./routes/spotify");

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

app.get("/home", (req, res) => {
  res.render("home");
});
app.get("/mooddetector", (req, res) => {
  res.render("moodDetector");
});
app.get("/songs", (req, res) => {
  res.render("songs");
});
app.get("/detectedmood/:mood", (req, res) => {
  console.log(req.params.mood);
  res.render("detectedMood", { mood: req.params.mood });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));