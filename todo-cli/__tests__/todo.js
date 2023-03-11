/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { toNamespacedPath } = require("path");
const todoList = require("../todo");

const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();

const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};

var dateToday = new Date();
const today = formattedDate(dateToday);
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1))
);
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1))
);

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });

  test("Should add new todo", () => {
    const todoItensCount = all.length;
    add({
      title: "test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItensCount + 1);
  });

  test("todo as completed", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("overdue items", () => {
    add({
      title: "submit assignment",
      completed: false,
      dueDate: yesterday,
    });
    expect(overdue().length).toBe(1);
  });

  test("due today", () => {
    add({
      title: "pay rent",
      completed: false,
      dueDate: today,
    });
    add({
      title: "service vehicle",
      completed: false,
      dueDate: today,
    });

    add({
      title: "exam",
      completed: false,
      dueDate: today,
    });
    expect(dueToday().length).toBe(5);
  });

  test("due later", () => {
    add({
      title: "file taxes",
      completed: false,
      dueDate: tomorrow,
    });
    add({
      title: "pay electric bill",
      completed: false,
      dueDate: tomorrow,
    });

    add({
      title: "car wash",
      completed: false,
      dueDate: tomorrow,
    });

    expect(dueLater().length).toBe(3);
  });
});
