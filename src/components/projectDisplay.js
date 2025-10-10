import {
  projectList,
  deleteModal,
  deleteModalMessage,
  todoForm,
  newTodoBtn,
  todoModal,
} from "../dom/dom.js";

import { inboxProject } from "../core/data.js";
import { handleProjectTabClick } from "../handlers.js";
import {
  clearContent,
  closeAllDropdowns,
  getPriorityValue,
} from "../utility/helpers.js";
import { openEditProjectModal, populateProjectSelect } from "./modalDisplay.js";
import { createTodoElement } from "./todoDisplay.js";
import {
  setIsEditingTodo,
  setCurrentEditIndex,
  setPendingDeleteProject,
  setPendingDeleteIndex,
} from "../core/data.js";

// Render all project tabs
export function displayProjects(projects) {
  projectList.innerHTML = "";

  projects.forEach((project) => {
    const tab = createProjectTab(project);
    projectList.appendChild(tab);
  });
}

// Create project tab elements
export function createProjectTab(project) {
  const tab = document.createElement("div");
  tab.classList.add("tab");
  tab.setAttribute("data-project-title", project.title);
  tab.addEventListener("click", () => handleProjectTabClick(project, tab));

  const colourIndicator = document.createElement("div");
  colourIndicator.classList.add("indicator");
  colourIndicator.style.backgroundColor = project.colour;

  const title = document.createElement("h3");
  title.textContent = project.title;

  tab.appendChild(colourIndicator);
  tab.appendChild(title);
  return tab;
}

// Display selected project details and its todos
export function displayProjectDetails(project) {
  clearContent();
  const content = document.querySelector("#content");

  const projectTitle = document.createElement("h1");
  projectTitle.textContent = project.title;

  const projectDescription = document.createElement("p");
  projectDescription.classList.add("project-desc");
  projectDescription.textContent = project.desc;

  const projectHeaderWrapper = document.createElement("div");
  projectHeaderWrapper.id = "project-header-wrapper";

  const isInbox = project === inboxProject;
  let menuContainer;

  // Show edit and delete buttons if project is not the initial Inbox
  if (!isInbox) {
    menuContainer = document.createElement("div");
    menuContainer.classList.add("project-menu-container");

    const menuBtn = document.createElement("button");
    menuBtn.classList.add("project-menu-btn");
    menuBtn.innerHTML = "&#8942";

    const actionsDropdown = document.createElement("div");
    actionsDropdown.classList.add("project-actions-dropdown");
    actionsDropdown.style.display = "none";

    const editProjectBtn = document.createElement("button");
    editProjectBtn.textContent = "Edit Project";
    editProjectBtn.addEventListener("click", () => {
      openEditProjectModal(project);
    });

    const deleteProjectBtn = document.createElement("button");
    deleteProjectBtn.textContent = "Delete Project";
    deleteProjectBtn.classList.add("delete-btn");
    deleteProjectBtn.addEventListener("click", () => {
      setPendingDeleteProject(project);
      setPendingDeleteIndex(null);
      deleteModalMessage.textContent =
        "Are you sure you want to delete this project?";
      deleteModal.showModal();
    });

    actionsDropdown.appendChild(editProjectBtn);
    actionsDropdown.appendChild(deleteProjectBtn);

    menuContainer.appendChild(menuBtn);
    menuContainer.appendChild(actionsDropdown);

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = actionsDropdown.style.display !== "none";
      closeAllDropdowns();
      if (!isCurrentlyOpen) {
        actionsDropdown.style.display = "flex";
      }
    });
  }

  projectHeaderWrapper.appendChild(projectTitle);
  if (menuContainer) {
    projectHeaderWrapper.appendChild(menuContainer);
  }

  const addTodoButton = document.createElement("button");
  addTodoButton.textContent = "+ Add Todo";
  addTodoButton.addEventListener("click", () => {
    todoForm.reset();
    populateProjectSelect();
    newTodoBtn.textContent = "Add Todo";
    newTodoBtn.disabled = true;

    setIsEditingTodo(false);
    setCurrentEditIndex(null);

    todoModal.showModal();
  });

  const projectTodos = document.createElement("div");
  projectTodos.id = "project-todos";

  // Check if the current view is a smart view (Today, This Week)
  const isSmartView =
    project.title === "Today" || project.title === "This Week";

  project.todos
    .slice()
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
    .forEach((todo, index) => {
      const originalIndex = project.todos.indexOf(todo);
      const todoItem = createTodoElement(todo, originalIndex, isSmartView);
      projectTodos.appendChild(todoItem);
    });

  content.appendChild(projectHeaderWrapper);
  content.appendChild(projectDescription);

  if (!isSmartView) {
    content.appendChild(addTodoButton);
  }

  content.appendChild(projectTodos);
}
