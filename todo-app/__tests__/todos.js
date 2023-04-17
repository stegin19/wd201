/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

const ExtractCsrfToken = (html) => {
  const $ = cheerio.load(html);
  return $("[name=_csrf]").val();
};

describe("Todo Application", function () {
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

  test("Creates new todo", async () => {
    const res = await agent.get("/");
    const csrfToken = ExtractCsrfToken(res);

    const response = await agent.post("/todos").send({
      title: "Buy car",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo as completed with id", async () => {
    let res = await agent.get("/");
    let csrfToken = ExtractCsrfToken(res);
    await agent.post("/todos").send({
      title: "clean",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const groupedTodo = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedRes = JSON.parse(groupedTodo.text);
    const dueTodayCount = parsedRes.dueToday.length;
    const todoitem = parsedRes.dueToday[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = ExtractCsrfToken(res.text);

    const markCompleted = await agent.put(`/todos/${todoitem.id}`).send({
      _csrf: csrfToken,
      completed: true,
    });

    const parsedupdatedres = JSON.parse(markCompleted.text);
    expect(parsedupdatedres.completed).toBe(true);
  });

  test("Deletes a todo with id", async () => {
    let res = await agent.get("/");
    let csrfToken = ExtractCsrfToken(res.text);

    await agent.post("/todos").send({
      title: "Complete levels",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const groupeditem = await agent.get("/todos");

    const parsedRes = JSON.parse(groupeditem.text);
    const dueTodayCount = parsedRes.dueToday.length;
    const todoitem = parsedRes.dueToday[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = ExtractCsrfToken(res.text);

    const deleteTodo = await agent.delete(`/todos/${todoitem}`).send({
      _csrf: csrfToken,
    });
    expect(deleteTodo.statusCode).toBe(200);
  });
});
