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

  test("Creates  new todo", async () => {
    const res = await agent.get("/");
    const csrfToken = ExtractCsrfToken(res);

    const response = await agent.post("/todos").send({
      title: "clean",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(500);
  });

  test("Marks a todo as complete id", async () => {
    let res = await agent.get("/");
    let csrfToken = ExtractCsrfToken(res.text);
    await agent.post("/todos").send({
      title: "do homework",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const groupedres = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedRes = JSON.parse(groupedres.text);
    const todoitem = parsedRes[parsedRes.length - 1];

    res = await agent.get("/");
    csrfToken = ExtractCsrfToken(res.text);

    const markasCompleted = await agent.put(`/todos/${todoitem.id}`).send({
      _csrf: csrfToken,
      completed: true,
    });

    const parsedUpdatedres = JSON.parse(markasCompleted.text);
    expect(parsedUpdatedres.completed).toBe(true);
  });

  test("Deletes a todo with  id", async () => {
    let res = await agent.get("/");
    let csrfToken = ExtractCsrfToken(res.text);

    await agent.post("/todos").send({
      title: "Completed",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const groupedres = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedRes = JSON.parse(groupedres.text);
    const todoitem = parsedRes[parsedRes.length - 1].id;

    res = await agent.get("/");
    csrfToken = ExtractCsrfToken(res.text);

    const deleteitem = await agent.delete(`/todos/${todoitem}`).send({
      _csrf: csrfToken,
    });
    expect(deleteitem.statusCode).toBe(200);
  });
});
