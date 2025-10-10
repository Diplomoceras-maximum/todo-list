import { myProjects, inboxProject } from "../core/data.js";
import { clearContent, getPriorityValue } from "../utility/helpers.js";
import { createTodoElement } from "./todoDisplay.js";

// Display todos due today or this week
export function displaySmartView(type) {
  clearContent();
  const content = document.querySelector("#content");

  let heading = type === "today" ? "Today's Tasks" : "This Week's Tasks";
  let filterFn;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(today.getDate() + 7);

  if (type === "today") {
    filterFn = (date) => new Date(date).toDateString() === today.toDateString();
  } else {
    filterFn = (date) => {
      const d = new Date(date);
      return d >= today && d < oneWeekFromNow;
    };
  }

  // Combine all todos and include the original project object for reference
  const allTodosWithProject = [inboxProject, ...myProjects].flatMap((p) =>
    p.todos.map((todo) => ({
      ...todo,
      projectTitle: p.title,
      originalProject: p,
      originalIndex: p.todos.indexOf(todo),
    }))
  );

  const filtered = allTodosWithProject.filter((todo) => filterFn(todo.dueDate));

  const headingEl = document.createElement("h1");
  headingEl.textContent = heading;
  content.appendChild(headingEl);

  const todosEl = document.createElement("div");
  todosEl.id = "project-todos";

  if (filtered.length === 0) {
    todosEl.textContent = "No tasks found.";
  } else {
    filtered
      .sort((a, b) => {
        const priorityA = getPriorityValue(a.priority);
        const priorityB = getPriorityValue(b.priority);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA - dateB;
      })
      .forEach((todo) => {
        const item = createTodoElement(todo, todo.originalIndex, true);
        todosEl.appendChild(item);
      });
  }

  content.appendChild(todosEl);
}
