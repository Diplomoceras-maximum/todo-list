// App Containers
export const appContainer = document.querySelector("#app-container");
export const sidebar = document.querySelector("#sidebar");

// Mobile Menu Button
export const menuBtn = document.querySelector("#menu-btn");

// Modals
export const projectModal = document.querySelector("#project-modal"); // Project modal
export const todoModal = document.querySelector("#todo-modal"); // Todo modal
export const deleteModal = document.querySelector("#delete-confirm-modal"); // Delete confirmation modal

// Forms
export const projectForm = document.querySelector("#new-project-form"); // Project form
export const todoForm = document.querySelector("#new-todo-form"); // Todo form

// Project Form Inputs
export const projectTitleInput = document.querySelector("#project_title"); // Project title input
export const projectDescInput = document.querySelector("#project_desc"); // Project description input
export const projectColourInput = document.querySelector("#project_colour"); // Project colour input
export const projectInputs = [
  projectTitleInput,
  projectDescInput,
  projectColourInput,
]; // Group of project inputs

// Todo Form Inputs
export const todoTitleInput = document.querySelector("#todo_title"); // Todo title input
export const todoDescInput = document.querySelector("#todo_desc"); // Todo description input
export const todoDueDateInput = document.querySelector("#todo_due_date"); // Todo due date input
export const todoPriorityInput = document.querySelector("#todo_priority"); // Todo priority input
export const todoProjectSelect = document.querySelector("#todo_project"); // Todo project selector
export const todoInputs = [
  todoTitleInput,
  todoDescInput,
  todoDueDateInput,
  todoPriorityInput,
  todoProjectSelect,
]; // Group of todo inputs

// Sidebar Tabs
export const inboxTab = document.querySelector("#inbox-tab"); // Inbox tab
export const todayTab = document.querySelector("#today-tab"); // Today tab
export const weekTab = document.querySelector("#week-tab"); // This Week tab

// Project List
export const projectList = document.querySelector("#project-list"); // Sidebar project list container

// Buttons
export const newProjectBtn = document.querySelector("#confirm-project-btn"); // Add/Update project button
export const cancelProjectBtn = document.querySelector("#cancel-project-btn"); // Cancel project modal button
export const newTodoBtn = document.querySelector("#confirm-todo-btn"); // Add/Update todo button
export const cancelTodoBtn = document.querySelector("#cancel-todo-btn"); // Cancel todo modal button
export const confirmDeleteBtn = document.querySelector("#confirm-delete-btn"); // Confirm deletion button
export const cancelDeleteBtn = document.querySelector("#cancel-delete-btn"); // Cancel deletion button

// Delete Modal Message
export const deleteModalMessage = document.querySelector(
  "#delete-modal-message"
); // Delete modal message
