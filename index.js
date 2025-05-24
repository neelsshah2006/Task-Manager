const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  fs.readdir(path.join(__dirname, "tasks"), (err, files) => {
    const taskFiles = files
      ? files.filter(
          (file) => file.endsWith(".txt") && file !== "favicon.ico.txt"
        )
      : [];
    res.render("index", { files: taskFiles });
  });
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
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
    "utf-8",
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

app.get("/edit/:filename", function (req, res) {
  fs.readFile(
    path.join(__dirname, `tasks/${req.params.filename}.txt`),
    "utf-8",
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error reading task");
      } else {
        res.render("edit", { filename: req.params.filename, data: data });
      }
    }
  );
});

app.post("/editfile/:filename", (req, res) => {
  if (req.body.taskTitle == req.params.filename) {
    if (req.body.taskTitle != "" && req.body.taskDesc != "") {
      fs.writeFile(
        path.join(
          __dirname,
          "tasks",
          `${req.body.taskTitle.split(" ").join("")}.txt`
        ),
        req.body.taskDesc,
        (err) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error Editing task");
            res.redirect("/?msg=Error Editing the task");
          } else {
            res.redirect("/");
          }
        }
      );
    } else {
      if (req.body.taskTitle == "") {
        res.redirect("/?msg=Please give the title to the task");
      } else {
        res.redirect("/?msg=Please give the Description to the task");
      }
    }
  } else {
    const fName = req.body.taskTitle.split(" ").join("");
    fs.rename(
      path.join(__dirname, "tasks", `${req.params.filename}.txt`),
      path.join(__dirname, "tasks", `${fName}.txt`),
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error Editing task");
          res.redirect("/?msg=Error creating the task");
        } else {
          fs.writeFile(
            path.join(__dirname, "tasks", `${fName}.txt`),
            req.body.taskDesc,
            (err) => {
              if (err) {
                console.log(err);
                res.status(500).send("Error Editing task");
                res.redirect("/?msg=Error Editing the task");
              } else {
                res.redirect("/");
              }
            }
          );
        }
      }
    );
  }
});

app.get("/delete/:filename", function (req, res) {
  fs.rm(path.join(__dirname, `/tasks/${req.params.filename}.txt`), (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error deleting task");
    } else {
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server is running");
});
