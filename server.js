let express = require("express");
let path = require("path");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let port = 8080;

const fs = require("fs");
// Imports the Google Cloud client library
const textToSpeech = require("@google-cloud/text-to-speech");
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
// The text to synthesize
// Construct the request


var fileName = "";
// Performs the Text-to-Speech request


app.use("/", express.static(path.join(__dirname, "dist/chatapp")));
app.use(express.static(__dirname + '/src/assets'))

io.on("connection", socket => {
  console.log("new connection made from client with ID="+socket.id);
  socket.on("newMsg", data => {
    
    io.sockets.emit("msg", { user: data.userName, msg: data.message, timeStamp: getCurrentDate() });
    var request = {
      input: { text: data.message },
      // Select the language and SSML Voice Gender (optional)
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      // Select the type of audio encoding
      audioConfig: { audioEncoding: "MP3" },
    };
  //request.input = {text: msg};
  fileName = socket.id+".mp3";
  
  client.synthesizeSpeech(request, (err, response) => {
    if (err) {
      console.error("ERROR:", err);
      return;
    }
    // Write the binary audio content to a local file
    fs.writeFile(__dirname + '/src/assets/' + socket.id + ".mp3", response.audioContent, "binary", err => {
      if (err) {
        console.error("ERROR:", err);
        return;
      }
      console.log("Audio content written to file: " + fileName);
    });
  })

  socket.emit("done", "audio is done");
  });
 
});
server.listen(port, () => {
  console.log("Listening on port " + port);
});
function getCurrentDate() {
  let d = new Date();
  return d.toLocaleString();
}


//export GOOGLE_APPLICATION_CREDENTIALS="/Users/andyko/Downloads/FIT2095Project-252eb9e4920e.json"