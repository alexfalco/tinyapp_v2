const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.post("/login", (req, res) => {
  //res.cookie(name, value [, options])
  res.cookie("username",req.body.username)
  res.redirect("/urls")
})


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
 
  let username = " "
  if(!req.cookies){
    username = ""
    console.log(req.cookies["username"])
  }else{
    username = req.cookies["username"]
    console.log(username)
  }
  let templateVars = { urls: urlDatabase, username: username };  
  res.render("urls_index", templateVars);
});

app.post("/urls/new", (req, res) => {
  let newShortURL = generateRandomShortURL();
  urlDatabase[newShortURL] = req.body.longURL
  res.redirect("/urls");       
});

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




app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies["username"] };
  res.render("urls_new",templateVars);
});





app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL] // const longURL = ...
  console.log(req.params)
  res.redirect(longURL);
});


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL  , longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
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