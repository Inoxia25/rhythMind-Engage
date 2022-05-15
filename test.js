require("dotenv").config();
const express=require('express');
const axios=require("axios");
const fs=require("fs-extra");
const {AZURE_ENDPOINT, AZURE_FACE_KEY_1}=process.env;
const app=express();

//returnFaceLandmarks=true&
//recognitionModel=recognition_03&
//faceidTimeToLive=60
app.get('/', async(req,res)=>{
    const imageData=await fs.readFile(`./images/Nandini-portfolio.jpeg`);
const response= await axios.post(`${AZURE_ENDPOINT}/face/v1.0/detect?

returnFaceAttributes=emotion
`,
imageData,
{
    headers:{
        "Content-Type":"application/octet-stream",
        "Ocp-Apim-Subscription-Key":AZURE_FACE_KEY_1
    }
});
    console.log(JSON.stringify(response.data,null,2));
    res.send('Successfully found out emotion');
}
)

const PORT= process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));