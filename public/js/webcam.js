//require("dotenv").config();

//const { response } = require("express");

/*const {CLOUDINARY_CLOUD_NAME,CLOUDINARY_UPLOAD_PRESET}=process.env;
const cloud_name = CLOUDINARY_CLOUD_NAME;
const upload_preset = CLOUDINARY_UPLOAD_PRESET;*/

const cloud_name = "diclfnvsi";
const upload_preset = "fucxfen0";

const AZURE_FACE_KEY_1 = "6b86f5d59db74be18cdc9bf9a454024f";

//cloud_name = document.getElementById("cloud_name");
//upload_preset = document.getElementById("upload_preset");
const video_camera = document.getElementById("video_camera");
const canvas = document.getElementById("canvas");
//cloudinary_photo = document.getElementById("cloudinary_photo");
const start_camera_button = document.getElementById("start_camera_button");
const take_picture_button = document.getElementById("take_picture_button");
const detect_mood_button = document.getElementById("detect_mood_button");
//clear_picture_button = document.getElementById("clear_picture_button");
//upload_button = document.getElementById("upload_button");
//upload_response = document.getElementById("upload_response");

start_camera_button.addEventListener("click", startCamera);
take_picture_button.addEventListener("click", takePhoto);
detect_mood_button.addEventListener("click", detectMood);

let image_url;
let streaming = false;
let width = 320;
let height = 0;

//function init()

//console.log("init");

//clear_picture_button.addEventListener("click", clearPhotos);
//upload_button.addEventListener("click", uploadPhoto);
//startCamera();

//variables to store emotion detected
let max_emotion = 0;
let detected_emotion;

function startCamera(ev) {
  console.log("startCamera");
  take_picture_button.disabled = false;

  start_camera_button.disabled = true;
  //clear_picture_button.disabled = false;
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      video_camera.srcObject = stream;
      video_camera.play();
      ev.srcElement.disabled = true;
    })
    .catch(function (err) {
      console.log("An error occurred: " + err);
    });

  video_camera.addEventListener(
    "canplay",
    (ev) => {
      if (!streaming) {
        height = video_camera.videoHeight / (video_camera.videoWidth / width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video_camera.setAttribute("width", width);
        video_camera.setAttribute("height", height);

        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);

        streaming = true;
      }
    },
    false
  );
}

function clearPhotos() {
  var context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL("image/png");
  //cloudinary_photo.setAttribute("src", data);
  //upload_button.disabled = true;
}

function takePhoto() {
  detect_mood_button.disabled = false;
  document.getElementById("detected_mood").innerHTML = "Detect Mood";
  var context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video_camera, 0, 0, width, height);

    //uploading the pic captured to cloudinary to send it to our api
    uploadPhoto();
    //console.log(image_url);
    //upload_button.disabled = false;
  } else {
    clearPhotos();
  }
}

/*function areAllFieldsValid() {
return cloud_name.value !== "" && upload_preset.value !== "";
}*/

function uploadPhoto() {
  /*if (!areAllFieldsValid()) {
  alert("All fields are required");
  return;
}*/
  canvas.toBlob((blob) => {
    var formdata = new FormData();
    formdata.append("file", blob);
    formdata.append("upload_preset", upload_preset);
    formdata.append("cloud_name", cloud_name);

    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.cloudinary.com/v1_1/" + cloud_name + "/image/upload",
      false
    );

    xhr.onload = function () {
      //extracting our cloudinary url from the response after posting photo to cloudinary
      let response = JSON.parse(this.response);
      image_url = response.secure_url;
      console.log(image_url);
      //cloudinary_photo.setAttribute("src", response.secure_url);
      //upload_response.value += this.responseText + "\n";
    };
    //console.log(image_url);
    xhr.send(formdata);
  });
}

//function to detect mood from api
async function detectMood() {
  const image = {
    url: image_url,
  };
  const response = await axios.post(
    "https://nandini.cognitiveservices.azure.com/face/v1.0/detect?overload=stream&returnFaceAttributes=emotion&recognitionModel=recognition_01&returnRecognitionModel=True&detectionModel=detection_01",
    image,
    {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": AZURE_FACE_KEY_1,
      },
    }
  );
  console.log(response.data[0].faceAttributes.emotion);
  emotion = response.data[0].faceAttributes.emotion;

  find_max_emotion(emotion.anger, "anger");
  find_max_emotion(emotion.contempt, "contempt");
  find_max_emotion(emotion.disgust, "disgust");
  find_max_emotion(emotion.fear, "fear");
  find_max_emotion(emotion.happiness, "happy");
  find_max_emotion(emotion.neutral, "neutral");
  find_max_emotion(emotion.sadness, "sadness");
  find_max_emotion(emotion.surprise, "surprise");

  console.log(detected_emotion);
  document.getElementById("detected_mood").innerHTML =
    "Mood:" + detected_emotion;

  window.location.href = `https://rhyth-mind.herokuapp.com/detectedmood/${detected_emotion}`;
}
function find_max_emotion(value_found, emotion) {
  if (value_found > max_emotion) {
    max_emotion = value_found;
    detected_emotion = emotion;
  }
}

window.onload = init();
