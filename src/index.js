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
  setActiveTab,
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

const SVG_INBOX = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="none">
<title>ionicons-v5-i</title>
<path d="M384,80H128c-26,0-43,14-48,40L48,272V384a48.14,48.14,0,0,0,48,48H416a48.14,48.14,0,0,0,48-48V272L432,120C427,93,409,80,384,80Z" stroke="currentColor" stroke-linejoin="round" stroke-width="24"></path>
<line x1="48" y1="272" x2="192" y2="272" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
<line x1="320" y1="272" x2="464" y2="272" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
<path d="M192,272a64,64,0,0,0,128,0" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></path>
<line x1="144" y1="144" x2="368" y2="144" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
<line x1="128" y1="208" x2="384" y2="208" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
</svg>`;

const SVG_TODAY = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="none">
<rect stroke="currentColor" stroke-linejoin="round" stroke-width="24" x="48" y="80" width="416" height="384" rx="48"></rect>
<line stroke="currentColor" stroke-linejoin="round" stroke-width="24" stroke-linecap="round" x1="128" y1="48" x2="128" y2="80"></line>
<line stroke="currentColor" stroke-linejoin="round" stroke-width="24" stroke-linecap="round" x1="384" y1="48" x2="384" y2="80"></line>
<rect stroke="currentColor" stroke-linejoin="round" stroke-width="24" stroke-linecap="round" x="112" y="224" width="96" height="96" rx="13"></rect>
<line stroke="currentColor" stroke-linejoin="round" stroke-width="24" stroke-linecap="round" x1="464" y1="160" x2="48" y2="160"></line>
</svg>`;

const SVG_WEEK = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="none">
<rect stroke="currentColor" stroke-linejoin="round" stroke-width="24" x="48" y="80" width="416" height="384" rx="48"></rect>
<circle cx="296" cy="232" r="24" stroke="currentColor" fill="currentColor"></circle>
<circle cx="376" cy="232" r="24" stroke="currentColor" fill="currentColor"></circle>
<circle cx="296" cy="312" r="24" stroke="currentColor" fill="currentColor"></circle>
<circle cx="376" cy="312" r="24" stroke="currentColor" fill="currentColor"></circle>
<circle cx="136" cy="312" r="24" stroke="currentColor" fill="currentColor"></circle>
<circle cx="216" cy="312" r="24" stroke="currentColor" fill="currentColor"></circle>
<circle cx="136" cy="392" r="24" stroke="currentColor" fill="currentColor"></circle>
<circle cx="216" cy="392" r="24" stroke="currentColor" fill="currentColor"></circle>
<circle cx="296" cy="392" r="24" stroke="currentColor" fill="currentColor"></circle>
<line stroke="currentColor" stroke-linejoin="round" stroke-width="24" stroke-linecap="round" x1="128" y1="48" x2="128" y2="80"></line>
<line stroke="currentColor" stroke-linejoin="round" stroke-width="24" stroke-linecap="round" x1="384" y1="48" x2="384" y2="80"></line>
<line stroke="currentColor" stroke-linejoin="round" stroke-width="24" x1="464" y1="160" x2="48" y2="160"></line>
</svg>`;

function setTabContent(tabElement, svgCode, titleText) {
  tabElement.innerHTML = "";

  const iconWrapper = document.createElement("div");
  iconWrapper.classList.add("tab-icon");
  iconWrapper.innerHTML = svgCode;

  const title = document.createElement("h3");
  title.textContent = titleText;

  tabElement.appendChild(iconWrapper);
  tabElement.appendChild(title);
}

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

  setTabContent(inboxTab, SVG_INBOX, "Inbox");
  setTabContent(todayTab, SVG_TODAY, "Today");
  setTabContent(weekTab, SVG_WEEK, "This week");

  // Sidebar tab event listeners
  inboxTab.addEventListener("click", () => {
    handleProjectTabClick(inboxProject, inboxTab);
  });

  todayTab.addEventListener("click", () => {
    displaySmartView("today");
    setActiveTab(todayTab);
  });

  weekTab.addEventListener("click", () => {
    displaySmartView("week");
    setActiveTab(weekTab);
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

  // Close menus if one is already open
  document.addEventListener("click", (e) => {
    if (!e.target.matches(".project-menu-btn, .todo-menu-btn")) {
      document
        .querySelectorAll(".project-actions-dropdown, .todo-actions-dropdown")
        .forEach((d) => {
          d.style.display = "none";
        });
    }
  });

  // Initial rendering
  displayProjects(myProjects);
  displayProjectDetails(selectedProject);
}

init(); // Call to start the app
