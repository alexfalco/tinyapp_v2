const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser')
app.use(cookieParser())


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}



// go to register page
app.get("/register", (req, res) => {
  
  let templateVars = {  };    //username: username
  res.render("register", templateVars)
})

// register with your info
app.post("/register", (req,res) => {
user_id = generateRandomShortURL()
users[user_id] = {"id" : user_id, "email" : req.body.email, "password" : req.body.password}
console.log(users)
res.cookie("user_id",user_id)
res.redirect("/urls")
})


// Login post information
app.post("/login", (req, res) => {
  //res.cookie(name, value [, options])
  res.cookie("username",req.body.username)
  res.redirect("/urls")
})

//logout 
app.post("/logout", (req,res) => {
res.clearCookie("username")
res.redirect("/urls")
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


// Get user list of URL
app.get("/urls", (req, res) => {
 
  let username = " "
  if(!req.cookies){
    username = ""
  
  }else{
    username = req.cookies["username"]
 
  }
  let templateVars = { urls: urlDatabase, username: username };  
  res.render("urls_index", templateVars);
});


// add a new URL
app.post("/urls/new", (req, res) => {
  let newShortURL = generateRandomShortURL();
  urlDatabase[newShortURL] = req.body.longURL
  res.redirect("/urls");       
});


// Delete a URL
app.post("/urls/:shortURL/delete",(req,res) => {
  const urlToDelete = req.params.shortURL;
    delete urlDatabase[urlToDelete];
    res.redirect("/urls");

})

//update long url
app.post("/urls/:shortURL", (req, res) => {

  const urlToEdit = req.params.shortURL;
  const newLongURL = req.body.newLongURL;
    urlDatabase[urlToEdit] = newLongURL;
    res.redirect("/urls");

});

// get to update page with the selected item to edit
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL  , longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

// get to the add a new URL page
app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies["username"] };
  res.render("urls_new",templateVars);
});



app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL] // const longURL = ...
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



const generateRandomShortURL = function() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  
  let stringLength = 6;
  let randomString = '';
   
  for (let i = 0; i < stringLength; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rnum, rnum + 1);
  }
   
  return randomString;
  
};


// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });