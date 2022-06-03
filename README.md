# rhythMind
![](https://user-images.githubusercontent.com/66139520/171702294-2f49ac9c-2bd5-4902-b6c1-6e73b0ae5eb8.png) </br>
A web app that plays music according to your emotional needs and helps you recharge your mental health with an altogether new and different listening experience. Often times, we are not able to communicate through words how we feel, and rhythMind helps just there! It detects your emotion from your face, and suggests a number from tracks based on it, or lets you join chat rooms where you can chat with people feeling similar options. After detecting your emotion, it tracks your mood and shows an interactive chart on your emotions. You can also like suggested songs or playlists and listen to them later!


# Features

1) *Login/Signup with Spotify* to get authorized into the application. All the routes of the application are protected, i.e. without logging in, they cant be accessed and are restricted.</br>

2) *Mood Detector Page*: Which asks the user to start their their camera and take a picture. Using the Microsoft Azure's Face API, it detects the percentage of various emotions visible from user's face and stores it in the database. The emotions that are detected are:</br>

Anger </br>
Surprise </br>
Sadness </br>
Happiness </br>
Neutral </br>
Fear </br>
Disgust </br>

3) *Music Player*, suggests music using the Spotify API depending on the user's emotion. As user is logged in using their account, the songs suggested are personlized according to the region they live in, i.e if someone lives in India, they will be mostly suggested Bollywood songs.  These songs are played in the web browser itself without going to Spotify's page.The user can easily share the songs with their friends/family on Facebook, Twitter or whatsapp. User can also like the songs or playlists.</br>

4) *Chat Room*, where user can talk to other people feeling the same emotions. this chat room provides a safe space, allowing only users from whose picture that emotion is detected to enter the room. In different rooms, different background music also plays according to the mood of the chat room. 
 ### Please Note: </br>
 Due to Google's newly introduced Privacy Policies, Google Chrome does not allow music to autoplay in the web browser. To enjoy this feature, kindly use Mozilla Firefox as your web browser.
 
 5) *Mood Tracker*, which shows a detailed interactive chart of the users emotion detected, along the time and date of when it was recorded. These emotions are detected using the Chart.js library.
 
 6) *Your likings Page*, which shows a users their liked songs and playlists
 



# Repository link
 The complete source code is uploaded at: https://github.com/Inoxia25/rhythMind-Engage
# Deployed link:
The deployed link can be found at : https://rhyth-mind.herokuapp.com/home

# Screenshots

## Home Page
 
  ![](https://user-images.githubusercontent.com/66139520/171703230-93ebb022-21cd-4a58-bbca-f92103c258a5.png)

## Login with Spotify Page
![](https://user-images.githubusercontent.com/66139520/171732313-bd2f4ffc-e28d-4202-8634-5284c91fc560.png)

 

## Logged in Home Page
 ![](https://user-images.githubusercontent.com/66139520/171732338-dc9df691-1913-4225-addf-0604f6f77d1b.png)


## Mood detector page ( before starting the camera )
![](https://user-images.githubusercontent.com/66139520/171732396-ab79bd3e-5d84-431c-8fd3-ae2a41d7ba8b.png)



## Mood Detector with camera started

  ### Detecting the happy emotion
  <img width="1512" alt="Screenshot 1944-03-13 at 9 55 34 PM" src="https://user-images.githubusercontent.com/66139520/171906544-60ddf564-7bd6-4c02-a0ec-71790fad1368.png">

  
 
  ### Happy mood detected
 
  <img width="1512" alt="Screenshot 2022-06-03 at 1 28 43 AM" src="https://user-images.githubusercontent.com/66139520/171727832-53fd401a-48b7-4a56-bd46-7be0208ac920.png">
  
  ##  Music player (for happy mood)

https://user-images.githubusercontent.com/66139520/171910168-0d441c0d-e2ed-4f9e-9086-b5af02a9a14f.mov




## Chat room (for happy mood)



<img width="1512" alt="Screenshot 1944-03-13 at 10 23 01 PM" src="https://user-images.githubusercontent.com/66139520/171910352-d6d6cb61-017c-4bf1-b5ac-0ee353f04fd7.png">

 
 
  ### Detecting the surprised emotion
  <img width="1512" alt="Screenshot 1944-03-13 at 10 27 05 PM" src="https://user-images.githubusercontent.com/66139520/171911171-62dade62-a580-4a4b-927e-49032edeaa43.png">

 
  ### Surprised mood detected

<img width="1512" alt="Screenshot 2022-06-03 at 1 30 51 AM" src="https://user-images.githubusercontent.com/66139520/171727955-ed72413f-0465-447c-b1c6-4118621186c3.png">




## Music Player (for Surprised Mood)
https://user-images.githubusercontent.com/66139520/171730455-6f461131-783c-454c-ab3f-c465566dc906.mov


## Chat room (for Surprised Mood)

<img width="1512" alt="Screenshot 2022-06-03 at 1 47 53 AM" src="https://user-images.githubusercontent.com/66139520/171730658-42a84781-408e-4ea6-872e-70f072a5750e.png">

## Mood Tracker page

<img width="1512" alt="Screenshot 2022-06-03 at 1 50 33 AM" src="https://user-images.githubusercontent.com/66139520/171731115-913164e1-5a6a-4de8-94ee-e7c67edf5e16.png">

## Your likings page
<img width="1512" alt="Screenshot 2022-06-03 at 1 53 23 AM" src="https://user-images.githubusercontent.com/66139520/171731759-aa2624da-567e-405f-91e8-58bce2fd0b6b.png">


## Page shown when restricted route is accessed
<img width="1512" alt="Screenshot 2022-06-03 at 2 02 19 AM" src="https://user-images.githubusercontent.com/66139520/171732970-e336a3ca-fcfb-4276-8137-465f1c19eb8a.png">


# Tech Stack used:
1) Bootstrap for frontend.
2) NodeJS for Backend.
3) Express
4) MongoDB as Database.

# Third Party Libraries used:
1) Microsoft Azure Face API.
2) Spotify API.
3) Cloudinary.
4) Chart.js

# For detailed info about the project: 
https://docs.google.com/document/d/15EoytKndcxxX2nk1ywqX_RMYbfC3MVuxdWuBFSmdUBc/edit?usp=sharing


# How to run the app
- If you don't have git on your machine, [install](https://docs.github.com/en/github/getting-started-with-github/set-up-git) it.

Incase If you dont have node.js in your computer then install it here  https://nodejs.org/en/download/<br/>
Once its download ,chech the version using <br/>
1)node -v (on your terminal/cmd)<br/>
2)npm -v

## Clone the repository 🏁
Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button and then click the copy to clipboard icon.

Open a terminal and run the following git command:

`git clone "url you just copied"`
where "url you just copied" (without the quotation marks) is the url to this repository (your fork of this project). See the previous steps to obtain the url.

Then in terminal run -  <br/>
npm i(for installing all dependencies). <br/>


Open http://localhost:3000/home to view the app.
