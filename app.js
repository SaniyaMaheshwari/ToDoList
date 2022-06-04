//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://atlas-saniya:30027012@cluster0.fw4l0.mongodb.net/taskDB");

let Task = mongoose.model('Task', { work: String });

const workItems = [];

app.get("/", function (req, res) {
  Task.deleteMany({work: ""}, function(err){
    console.log(err);
  })

  const day = date.getDate();
  Task.find({}, function(err, foundItems){
    res.render("list", { listTitle: day, newListItems: foundItems });
  });


});

app.post("/", function (req, res) {

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    let newTask = new Task({ work: item });
    newTask.save();
    res.redirect("/");
  }
});

app.post("/delete", function(req, res){
  let id = req.body.checkbox;
  Task.findByIdAndRemove(id, function(err){
    console.log(err);
  });

  res.redirect("/");
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
