import { saveToLocalStorage } from "../utility/storage.js";
import {
  selectedProject,
  setPendingDeleteIndex,
  setPendingDeleteProject,
} from "../core/data.js";
import { displaySmartView } from "./smartViewDisplay.js";
import { displayProjectDetails } from "./projectDisplay.js";
import { closeAllDropdowns, setActiveTab } from "../utility/helpers.js";
import { inboxTab, deleteModal, deleteModalMessage } from "../dom/dom.js";
import { openEditTodoModal } from "./modalDisplay.js";

// Function to create a todo
export function createTodoElement(todo, index, isSmartView = false) {
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo-item");
  todoItem.setAttribute("data-todo-index", index);

  if (isSmartView) {
    todoItem.classList.add("clickable-smart-view-todo");
    todoItem.addEventListener("click", () => {
      displayProjectDetails(todo.originalProject);
      if (todo.originalProject.title === "Inbox") {
        setActiveTab(inboxTab);
      } else {
        const projectTabElement = document.querySelector(
          `.tab[data-project-title="${todo.projectTitle}"]`
        );
        if (projectTabElement) {
          setActiveTab(projectTabElement);
        }
      }
    });
  }

  todoItem.classList.add(`priority-${todo.priority.toLowerCase()}`);

  const dueDateObj = new Date(todo.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (todo.completed) {
    todoItem.classList.add("completed");
  }

  const priorityIndicator = document.createElement("div");
  priorityIndicator.classList.add("priority-indicator");

  // --- Checkbox Logic (Only for non-Smart Views) ---
  if (!isSmartView) {
    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.checked = todo.completed;
    completeCheckbox.addEventListener("change", (e) => {
      e.stopPropagation();

      todo.completed = completeCheckbox.checked;
      saveToLocalStorage();

      const currentViewTitle = selectedProject.title;
      if (currentViewTitle === "Today") {
        displaySmartView("today");
      } else if (currentViewTitle === "This Week") {
        displaySmartView("week");
      } else {
        displayProjectDetails(selectedProject);
      }
    });

    todoItem.appendChild(completeCheckbox);
  }

  const todoContent = document.createElement("div");

  const title = document.createElement("h3");
  title.textContent = isSmartView
    ? `${todo.title} (${todo.projectTitle})`
    : todo.title;

  const desc = document.createElement("p");
  desc.textContent = todo.desc;

  todoContent.appendChild(title);
  todoContent.appendChild(desc);

  const metaWrapper = document.createElement("div");
  metaWrapper.classList.add("todo-meta-wrapper");

  const dateMeta = document.createElement("p");
  const dateParts = todo.dueDate.split("-");
  const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  let dateText = `Due: ${formattedDate}`;

  if (dueDateObj < today && !todo.completed) {
    dateText += " (OVERDUE)";
    todoItem.classList.add("overdue");
  }
  dateMeta.textContent = dateText;
  dateMeta.classList.add("date-meta");

  const priorityMeta = document.createElement("p");
  priorityMeta.classList.add("priority-text");
  priorityMeta.textContent = `Priority: ${todo.priority}`;

  metaWrapper.appendChild(dateMeta);
  metaWrapper.appendChild(priorityMeta);

  todoItem.appendChild(priorityIndicator);
  todoItem.appendChild(todoContent);
  todoItem.appendChild(metaWrapper);

  // --- Menu Buttons Logic (Only for non-Smart Views) ---
  if (!isSmartView) {
    const todoMenuContainer = document.createElement("div");
    todoMenuContainer.classList.add("todo-menu-container");

    const todoMenuBtn = document.createElement("button");
    todoMenuBtn.classList.add("todo-menu-btn");
    todoMenuBtn.innerHTML = "&#8942";

    const todoActionsDropdown = document.createElement("div");
    todoActionsDropdown.classList.add("todo-actions-dropdown");
    todoActionsDropdown.style.display = "none";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      openEditTodoModal(todo, index);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      setPendingDeleteIndex(index);
      setPendingDeleteProject(null);
      deleteModalMessage.textContent =
        "Are you sure you want to delete this todo?";
      deleteModal.showModal();
    });

    todoActionsDropdown.appendChild(editBtn);
    todoActionsDropdown.appendChild(deleteBtn);
    todoMenuContainer.appendChild(todoMenuBtn);
    todoMenuContainer.appendChild(todoActionsDropdown);

    todoMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = todoActionsDropdown.style.display !== "none";
      closeAllDropdowns();
      if (!isCurrentlyOpen) {
        todoActionsDropdown.style.display = "flex";
      }
    });

    todoItem.appendChild(todoMenuContainer);
  }

  return todoItem;
}
