//routes to send secret key values to client side js, as storing it directly in frontend is not safe
require("dotenv").config();
const express = require("express");
const router = express.Router();

router.get("/azurekeys", (req, res) => {
  let azureObj = {};
  azureObj.AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
  azureObj.AZURE_FACE_KEY_1 = process.env.AZURE_FACE_KEY_1;
  azureObj.AZURE_FACE_KEY_2 = process.env.AZURE_FACE_KEY_2;
  res.json(azureObj);
});

router.get("/cloudinarykeys", (key, res) => {
  let cloudinaryObj = {};
  cloudinaryObj.CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  cloudinaryObj.UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
  res.json(cloudinaryObj);
});

module.exports = router;
