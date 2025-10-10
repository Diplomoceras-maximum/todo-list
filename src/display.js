// --- Project Display ---
import {
  displayProjects,
  createProjectTab,
  displayProjectDetails,
} from "./components/projectDisplay.js";
export { displayProjects, createProjectTab, displayProjectDetails };

// --- Smart View Display ---
import { displaySmartView } from "./components/smartViewDisplay.js";
export { displaySmartView };

// --- Todo Display ---
import { createTodoElement } from "./components/todoDisplay.js";
export { createTodoElement };

// --- Modal Display ---
import {
  openEditTodoModal,
  openEditProjectModal,
  populateProjectSelect,
} from "./components/modalDisplay.js";
export { openEditTodoModal, openEditProjectModal, populateProjectSelect };

// --- Utilities ---
import {
  clearContent,
  setActiveTab,
  closeAllDropdowns,
} from "./utility/helpers.js";
export { clearContent, setActiveTab, closeAllDropdowns };
