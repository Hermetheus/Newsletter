const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");
const md5 = require("md5");

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Signup Route
app.post("/signup", (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email } = req.body; //Destructuring

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    console.log("Input Not Filled Out");
    return;
  }

  // Construct req Data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: "https://us5.api.mailchimp.com/3.0/lists/799d735784",
    method: "POST",
    headers: {
      Authorization: "auth 171eabbd17615d5a0b0186373b50c38e-us5"
    },
    body: postData
  };

  request(options, (err, response, body) => {
    if (err) {
      res.redirect("/fail.html");
    } else {
      if (response.statusCode === 200) {
        res.redirect("/success.html");
      } else {
        res.redirect("/fail.html");
      }
    }
  });
});

// Unsubscribe Route

app.post("/unsubscribe", function(req, res) {
  console.log(req.body);
  const { email, id } = req.body;
  // Make sure fields are filled
  if (!email) {
    res.redirect("/fail.html");
    console.log("Input Not Filled Out");
    return;
  }

  const data = {
    members: [
      {
        email_address: email,
        status: "unsubscribed"
      }
    ]
  };

  const postData = JSON.stringify(data);

  var options = {
    method: "PUT",
    url: `https://us5.api.mailchimp.com/3.0/lists/799d735784/members/${md5(
      email
    )}`,
    headers: {
      Authorization: "auth 171eabbd17615d5a0b0186373b50c38e-us5"
    },
    body: postData
  };

  request(options, function(err, response, body) {
    if (err) {
      res.redirect("/fail.html");
    } else {
      if (response.statusCode === 200) {
        res.redirect("/unsubscribed.html");
      } else {
        res.redirect("/fail.html");
      }
    }
    console.log(body);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started on ${PORT}`));
