import {
  setInboxProject,
  myProjects,
  Project,
  Todo,
  inboxProject,
} from "../core/data.js";

export function saveToLocalStorage() {
  const data = {
    inboxProject,
    myProjects,
  };
  localStorage.setItem("todoAppData", JSON.stringify(data));
}

export function loadFromLocalStorage() {
  const storedData = localStorage.getItem("todoAppData");
  if (!storedData) return;

  const data = JSON.parse(storedData);

  // Rehydrate inboxProject
  const rehydratedInbox = Object.assign(new Project(), data.inboxProject);
  rehydratedInbox.todos = data.inboxProject.todos.map((t) =>
    Object.assign(new Todo(), t)
  );

  // FIX: Use the setter function to re-assign the inboxProject state
  setInboxProject(rehydratedInbox);

  // Rehydrate myProjects
  data.myProjects.forEach((p) => {
    const project = Object.assign(new Project(), p);
    project.todos = p.todos.map((t) => Object.assign(new Todo(), t));
    myProjects.push(project);
  });
}
