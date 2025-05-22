const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  fs.readdir(path.join(__dirname, "tasks"), (err, files) => {
    res.render("index", { files: files });
  });
});

app.post("/create", function (req, res) {
  if (req.body.taskTitle != "" && req.body.taskDesc != "") {
    fs.writeFile(
      path.join(
        __dirname,
        `tasks/${req.body.taskTitle.split(" ").join("")}.txt`
      ),
      req.body.taskDesc,
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error creating task");
          res.redirect("/?msg=Error creating the task");
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    if (req.body.taskTitle == "") {
      res.redirect("/?msg=Please Enter the title to the task");
    } else {
      res.redirect("/?msg=Please Enter the Description to the task");
    }
  }
});

app.get("/:task", function (req, res) {
  fs.readFile(
    path.join(__dirname, `tasks/${req.params.task}.txt`),
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error reading task");
      } else {
        res.render("task", { task: req.params.task, data: data });
      }
    }
  );
});

app.listen(3000, function () {
  console.log("Server is running");
});
