import { projectList, inboxTab, todayTab, weekTab } from "../dom/dom";

// Clear main content area
export function clearContent() {
  const content = document.querySelector("#content");
  content.innerHTML = "";
}

// Function to manage the active state of sidebar tabs
export function setActiveTab(activeTab) {
  const allTabs = [
    inboxTab,
    todayTab,
    weekTab,
    ...Array.from(projectList.children),
  ];

  allTabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  if (activeTab) {
    activeTab.classList.add("active");
  }
}

// Function to close dropdowns
export function closeAllDropdowns() {
  document
    .querySelectorAll(".project-actions-dropdown, .todo-actions-dropdown")
    .forEach((d) => {
      d.style.display = "none";
    });
}

// Function to get the priority value of a todo
export function getPriorityValue(priority) {
  if (priority.toLowerCase() === "high") return 1;
  if (priority.toLowerCase() === "medium") return 2;
  return 3;
}
