/* eslint-disable no-undef */
const express = require("express");
const app = express();
var csrf = require("tiny-csrf");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
app.use(bodyParser.json());
const path = require("path");
const { Todo } = require("./models");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

<<<<<<< HEAD
app.set("view engine", "ejs");
=======
passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});
>>>>>>> 293a0c2cc541b0059378fd89e7ab073888ca7b59

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
<<<<<<< HEAD
  const allTodos = await Todo.getTodo();
  const overdue = await Todo.overdue();
  const dueLater = await Todo.dueLater();
  const dueToday = await Todo.dueToday();
  const completedItems = await Todo.completedItems();
  if (request.accepts("html")) {
    response.render("index", {
      title: "Todo Application",
      allTodos,
      overdue,
      dueLater,
      dueToday,
      completedItems,
      csrfToken: request.csrfToken(),
=======
  response.render("index", {
    title: "Todo Application",
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const loggedInUser = request.user.id;
    const allTodos = await Todo.getTodos();
    const overdue_items = await Todo.overdue(loggedInUser);
    const dueLater = await Todo.dueLater(loggedInUser);
    const dueToday = await Todo.dueToday(loggedInUser);
    const completedItems = await Todo.completedItems(loggedInUser);
    if (request.accepts("html")) {
      response.render("todo", {
        title: "Todo Application",
        allTodos,
        overdue_items,
        dueToday,
        dueLater,
        completedItems,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({ overdue_items, dueToday, dueLater, completedItems });
    }
  }
);
app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Signup",
    csrfToken: request.csrfToken(),
  });
});
app.post("/users", async (request, response) => {
  if (request.body.email.length == 0) {
    request.flash("error", "Email can not be empty!");
    return response.redirect("/signup");
  }

  if (request.body.firstName.length == 0) {
    request.flash("error", "First name can not be empty!");
    return response.redirect("/signup");
  }
  if (request.body.password.length < 8) {
    request.flash("error", "Password length should be minimun 8");
    return response.redirect("/signup");
  }
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);

  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todos");
>>>>>>> 293a0c2cc541b0059378fd89e7ab073888ca7b59
    });
  } else {
    response.json(overdue, dueLater, dueToday, completedItems);
  }
});

app.get("/todos", async (request, response) => {
  console.log("Todo list");
  try {
    const todoli = await Todo.findAll();
    return response.json(todoli);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

<<<<<<< HEAD
app.post("/todos", async (request, response) => {
  console.log("creating new todo", request.body);
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      commpleted: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
=======
app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    if (request.body.title.length == 0) {
      request.flash("error", "Title can not be empty!");
      return response.redirect("/todos");
    }
    if (request.body.dueDate.length == 0) {
      request.flash("error", "Due date can not be empty!");
      return response.redirect("/todos");
    }
    console.log("creating new todo", request.body);
    try {
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        completed: false,
        userId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
>>>>>>> 293a0c2cc541b0059378fd89e7ab073888ca7b59
  }
});

<<<<<<< HEAD
app.put("/todos/:id", async (request, response) => {
  console.log("Mark Todo as completed:", request.params.id);
=======
app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("we have to update a todo with ID:", request.params.id);
    const todo = await Todo.findByPk(request.params.id);
    try {
      const updatedtodo = await todo.setCompletionStatus(
        request.body.completed
      );
      return response.json(updatedtodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);
app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("we have to update a todo with ID:", request.params.id);
>>>>>>> 293a0c2cc541b0059378fd89e7ab073888ca7b59
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatetodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatetodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
<<<<<<< HEAD
app.delete("/todos/:id", async (request, response) => {
  console.log("delete a todo with ID:", request.params.id);
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    return response.status(422).json(error);
=======

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("delete a todo:", request.params.id);
    try {
      await Todo.remove(request.params.id, request.user.id);
      return response.json(true);
    } catch (error) {
      return response.status(422).json(error);
    }
>>>>>>> 293a0c2cc541b0059378fd89e7ab073888ca7b59
  }
});
module.exports = app;
