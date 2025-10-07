import "./styles.css"; // Import stylesheet

import {
  inboxProject,
  myProjects,
  selectedProject,
  Project,
  setSelectedProject,
} from "./data.js";
import { loadFromLocalStorage } from "./storage.js";
import {
  displayProjects,
  displayProjectDetails,
  displaySmartView,
} from "./display.js";
import {
  checkProjectFormValidity,
  checkTodoFormValidity,
} from "./validation.js";
import {
  handleAddProject,
  handleAddTodo,
  handleConfirmDelete,
  handleCancelDelete,
  handleOpenProjectModal,
  handleProjectTabClick,
} from "./handlers.js";
import {
  inboxTab,
  todayTab,
  weekTab,
  cancelProjectBtn,
  projectInputs,
  newProjectBtn,
  cancelTodoBtn,
  todoInputs,
  newTodoBtn,
  confirmDeleteBtn,
  cancelDeleteBtn,
  todoModal,
  projectModal,
} from "./dom.js";

function init() {
  loadFromLocalStorage();
  // Create default Inbox project if one wasnt already created
  if (!inboxProject) {
    inboxProject = new Project(
      "Inbox",
      "Default inbox for uncategorised tasks",
      "#888888"
    );
  }

  // Fallback to inbox
  if (!selectedProject) {
    setSelectedProject(inboxProject);
  }

  // Sidebar tab event listeners
  inboxTab.addEventListener("click", () => {
    handleProjectTabClick(inboxProject);
  });

  todayTab.addEventListener("click", () => {
    displaySmartView("today");
  });

  weekTab.addEventListener("click", () => {
    displaySmartView("week");
  });

  // Project form listeners
  cancelProjectBtn.addEventListener("click", () => projectModal.close());
  projectInputs.forEach((input) =>
    input.addEventListener("input", checkProjectFormValidity)
  );
  newProjectBtn.addEventListener("click", handleAddProject);

  // Todo form listeners
  cancelTodoBtn.addEventListener("click", () => todoModal.close());
  todoInputs.forEach((input) =>
    input.addEventListener("input", checkTodoFormValidity)
  );
  newTodoBtn.addEventListener("click", handleAddTodo);

  // Delete modal listeners
  confirmDeleteBtn.addEventListener("click", handleConfirmDelete);
  cancelDeleteBtn.addEventListener("click", handleCancelDelete);

  // Add project button
  const addProjectBtn = document.querySelector("#add-project-btn");
  addProjectBtn.addEventListener("click", handleOpenProjectModal);

  // Initial rendering
  displayProjects(myProjects);
  displayProjectDetails(selectedProject);
}

init(); // Call to start the app
