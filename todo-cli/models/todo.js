// models/todo.js
"use strict";
const { Op } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdueto = await this.overdue();
      const overlist = overdue.map((todo) => displayableString()).join("\n");
      console.log(overlist.trim());

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const duetodayto = await this.dueToday();
      const overtodaylist = duetodayto
        .map((todo) => displayableString())
        .join("\n");
      console.log(overtodaylist.trim());
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const duelaterto = await this.dueLater();
      const duelaterlist = duelaterto
        .map((todo) => displayableString())
        .join("\n");
      console.log(overlaterlist.trim());
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
        order: [["id", ASC]],
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
        order: [["id", ASC]],
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
        order: [["id", ASC]],
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      return Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      const date = new Date(this.dueDate);
      return date.getDate() === new Date().getDate()
        ? `${this.id}. ${checkbox} ${this.title}`.trim()
        : `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
