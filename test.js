require("dotenv").config();
const express=require('express');
const axios=require("axios");
const fs=require("fs-extra");
const {AZURE_ENDPOINT, AZURE_FACE_KEY_1}=process.env;
const app=express();

//returnFaceLandmarks=true&
//recognitionModel=recognition_03&
//faceidTimeToLive=60
/*POST {Endpoint}/face/v1.0/detect?returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise&recognitionModel=recognition_01&returnRecognitionModel=True&detectionModel=detection_01
Ocp-Apim-Subscription-Key: {API key}*/

app.get('/', async(req,res)=>{
    const imageData=await fs.readFile(`./images/Nandini-portfolio.jpeg`);
    const image={
        url:"http://res.cloudinary.com/diclfnvsi/image/upload/v1652963513/bwxkkq9hfxjg6uecmg4u.png"
    };
const response= await axios.post("https://nandini.cognitiveservices.azure.com/face/v1.0/detect?overload=stream&returnFaceAttributes=emotion&recognitionModel=recognition_01&returnRecognitionModel=True&detectionModel=detection_01",
image,
{
    headers:{
        "Content-Type":"application/json",
        "Ocp-Apim-Subscription-Key":AZURE_FACE_KEY_1
    }
});
    console.log(response.data[0].faceAttributes.emotion);
    console.log(new Date().toISOString());
    res.send('Successfully found out emotion');
}
)

const PORT= process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));