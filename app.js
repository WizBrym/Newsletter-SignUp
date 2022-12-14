//Creating a Newsletter webpage
const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); //To specified a static folder To render for a static file such as css, images
app.use(bodyparser.urlencoded({
  extended: true
}));


//creating a GET request
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//creating a POST request
app.post("/", function(req, res) {

  //obtaining new members details
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };
  const jsonData = JSON.stringify(data); //passing jsonData to mailchipm API

  //API Credentials
  const apiKey = "f64*****14c29cf0********5e660-us*"
  const api_server = "us8";
  const listID = "989***91**";
  const url = "https://" + api_server + ".api.mailchimp.com/3.0/lists/" + listID; //API endpoint

  //initiate connection to the API using Basic Auth
  const options = {
    method: "POST",
    auth: "wizbrym:" + apiKey
  }

  // make request using https npm module
  const request = https.request(url, options, function(response) {

    //condition if API response code is 200 which means a succesfull request
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    };
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

//Redicting failure page to the home page
app.post("/failure.html", function(req, res) {
  res.redirect("/")
});


//creating a localHost
app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("server is up running");
});
