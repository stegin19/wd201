/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo App", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "stegin",
      lastName: "rajeev",
      email: "steginmrajeev@gmail.com",
      password: "13245768",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("Creates a todo", async () => {
    const agent = request.agent(server);
    await login(agent, "steginmrajeev@gmail.com", "13245768");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy book",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks as complete with id", async () => {
    const agent = request.agent(server);
    await login(agent, "steginmrajeev@gmail.com", "13245768");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy book",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosRes = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedRes = JSON.parse(groupedTodosRes.text);
    const dueTodayCount = parsedGroupedRes.dueToday.length;
    const new_Todo = parsedGroupedRes.dueToday[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent.put(`/todos/${new_Todo.id}`).send({
      completed: true,
      _csrf: csrfToken,
    });
    const parsedUpdateRes = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateRes.completed).toBe(true);
  });
  test("Deletes a todo with the given ID", async () => {
    const agent = request.agent(server);
    await login(agent, "steginmrajeev@gmail.com", "13245768");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "do homework",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosRes = await agent
      .get("/todos")
      .set("Accept", "application/json");

    const parsedResponces = JSON.parse(groupedTodosRes.text);
    const todo_Id = parsedResponces.dueToday.length;
    const new_Todo = parsedResponces.dueToday[todo_Id - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const deleteResponce = await agent.delete(`/todos/${new_Todo.id}`).send({
      _csrf: csrfToken,
    });
    const parsedUpdateRes = JSON.parse(deleteResponce.text);
    expect(parsedUpdateRes).toBe(true);
  });
});
