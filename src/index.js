import "./styles.css";

// ======= DOM Elements =======
const projectModal = document.querySelector("#project-modal");
const projectList = document.querySelector("#project-list");
const newProjectBtn = document.querySelector("#confirm-project-btn");
const addProjectBtn = document.querySelector("#add-project-btn");
const cancelProjectBtn = document.querySelector("#cancel-project-btn");
const projectForm = document.querySelector("#new-project-form");

const projectTitleInput = document.querySelector("#project_title");
const projectDescInput = document.querySelector("#project_desc");
const projectColourInput = document.querySelector("#project_colour");
const projectInputs = [projectTitleInput, projectDescInput, projectColourInput];

const todoModal = document.querySelector("#todo-modal");
const newTodoBtn = document.querySelector("#confirm-todo-btn");
const addTodoBtn = document.querySelector("#add-todo-btn");
const cancelTodoBtn = document.querySelector("#cancel-todo-btn");
const todoForm = document.querySelector("#new-todo-form");

const todoTitleInput = document.querySelector("#todo_title");
const todoDescInput = document.querySelector("#todo_desc");
const todoDueDateInput = document.querySelector("#todo_due_date");
const todoPriorityInput = document.querySelector("#todo_priority");
const todoInputs = [
  todoTitleInput,
  todoDescInput,
  todoDueDateInput,
  todoPriorityInput,
];

const deleteModal = document.querySelector("#delete-confirm-modal");
const confirmDeleteBtn = document.querySelector("#confirm-delete-btn");
const cancelDeleteBtn = document.querySelector("#cancel-delete-btn");

// ======= Data =======
const myProjects = [];
let selectedProject = null;

let isEditingTodo = false;
let currentEditIndex = null;

let pendingDeleteIndex = null;

function Project(title, desc, colour) {
  this.title = title;
  this.desc = desc;
  this.colour = colour;
  this.todos = [];
}

function Todo(title, desc, dueDate, priority) {
  this.title = title;
  this.desc = desc;
  this.dueDate = dueDate;
  this.priority = priority;
  this.completed = false;
}

// ======= Initialisation =======

function init() {
  addProjectBtn.addEventListener("click", handleOpenProjectModal);
  cancelProjectBtn.addEventListener("click", () => projectModal.close());
  projectInputs.forEach((input) =>
    input.addEventListener("input", checkProjectFormValidity)
  );
  newProjectBtn.addEventListener("click", handleAddProject);

  cancelTodoBtn.addEventListener("click", () => todoModal.close());
  todoInputs.forEach((input) =>
    input.addEventListener("input", checkTodoFormValidity)
  );
  newTodoBtn.addEventListener("click", handleAddTodo);

  confirmDeleteBtn.addEventListener("click", handleConfirmDelete);
  cancelDeleteBtn.addEventListener("click", handleCancelDelete);

  displayProjects(myProjects);
}

init();

// ======= Event Handlers =======

function handleOpenProjectModal() {
  projectForm.reset();
  newProjectBtn.disabled = true;
  projectModal.showModal();
}

function handleAddProject() {
  const title = projectTitleInput.value.trim();
  const desc = projectDescInput.value.trim();
  const colour = projectColourInput.value;

  addProjectToList(title, desc, colour);
  displayProjects(myProjects);

  projectForm.reset();
  newProjectBtn.disabled = true;
  projectModal.close();
}

function handleProjectTabClick(project) {
  selectedProject = project;
  clearContent();
  displayProjectDetails(project);
}

function handleAddTodo() {
  const title = todoTitleInput.value.trim();
  const desc = todoDescInput.value.trim();
  const dueDate = todoDueDateInput.value;
  const priority = todoPriorityInput.value;

  if (!selectedProject) return;

  if (isEditingTodo && currentEditIndex !== null) {
    // Editing an existing todo
    const todo = selectedProject.todos[currentEditIndex];
    todo.title = title;
    todo.desc = desc;
    todo.dueDate = dueDate;
    todo.priority = priority;
  } else {
    // Adding a new todo
    const newTodo = new Todo(title, desc, dueDate, priority);
    selectedProject.todos.push(newTodo);
  }

  displayProjectDetails(selectedProject);
  todoForm.reset();
  newTodoBtn.textContent = "Add Todo";
  isEditingTodo = false;
  currentEditIndex = null;
  todoModal.close();
}

function handleConfirmDelete() {
  if (pendingDeleteIndex !== null && selectedProject) {
    selectedProject.todos.splice(pendingDeleteIndex, 1);
    pendingDeleteIndex = null;
    displayProjectDetails(selectedProject);
  }
  deleteModal.close();
}

function handleCancelDelete() {
  pendingDeleteIndex = null;
  deleteModal.close();
}

// ======= Form Validation =======

function checkProjectFormValidity() {
  const isValid =
    projectTitleInput.value.trim() &&
    projectDescInput.value.trim() &&
    projectColourInput.value;
  newProjectBtn.disabled = !isValid;
}

function checkTodoFormValidity() {
  const isValid =
    todoTitleInput.value.trim() &&
    todoDescInput.value.trim() &&
    todoDueDateInput.value &&
    todoPriorityInput.value;
  newTodoBtn.disabled = !isValid;
}

// ======= Logic =======

function addProjectToList(title, desc, colour) {
  const newProject = new Project(title, desc, colour);
  myProjects.push(newProject);
}

function displayProjects(projects) {
  projectList.innerHTML = "";

  projects.forEach((project) => {
    const tab = document.createElement("div");
    tab.classList.add("tab");
    tab.addEventListener("click", () => handleProjectTabClick(project));

    const colourIndicator = document.createElement("div");
    colourIndicator.classList.add("indicator");
    colourIndicator.style.backgroundColor = project.colour;

    const title = document.createElement("h3");
    title.textContent = project.title;

    tab.appendChild(colourIndicator);
    tab.appendChild(title);
    projectList.appendChild(tab);
  });
}

function clearContent() {
  const content = document.querySelector("#content");
  content.innerHTML = "";
}

function displayProjectDetails(project) {
  clearContent();
  const content = document.querySelector("#content");

  const projectTitle = document.createElement("h1");
  projectTitle.textContent = project.title;

  const projectDescription = document.createElement("p");
  projectDescription.textContent = project.desc;

  const addTodoButton = document.createElement("button");
  addTodoButton.textContent = "+ Add Todo";
  addTodoButton.addEventListener("click", () => {
    todoForm.reset();
    newTodoBtn.textContent = "Add Todo";
    newTodoBtn.disabled = true;

    isEditingTodo = false;
    currentEditIndex = null;

    todoModal.showModal();
  });

  const projectTodos = document.createElement("div");
  projectTodos.id = "project-todos";

  project.todos.forEach((todo, index) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    const title = document.createElement("h3");
    title.textContent = todo.title;
    if (todo.completed) {
      title.style.textDecoration = "line-through";
    }

    const desc = document.createElement("p");
    desc.textContent = todo.desc;

    const meta = document.createElement("p");
    meta.textContent = `Due: ${todo.dueDate} | Priority: ${todo.priority}`;

    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.checked = todo.completed;
    completeCheckbox.addEventListener("change", () => {
      todo.completed = completeCheckbox.checked;
      displayProjectDetails(selectedProject);
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      openEditTodoModal(todo, index);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      pendingDeleteIndex = index;
      deleteModal.showModal();
    });

    todoItem.appendChild(completeCheckbox);
    todoItem.appendChild(title);
    todoItem.appendChild(desc);
    todoItem.appendChild(meta);
    todoItem.appendChild(editBtn);
    todoItem.appendChild(deleteBtn);

    projectTodos.appendChild(todoItem);
  });

  content.appendChild(projectTitle);
  content.appendChild(projectDescription);
  content.appendChild(addTodoButton);
  content.appendChild(projectTodos);
}

function openEditTodoModal(todo, index) {
  todoTitleInput.value = todo.title;
  todoDescInput.value = todo.desc;
  todoDueDateInput.value = todo.dueDate;
  todoPriorityInput.value = todo.priority;

  newTodoBtn.textContent = "Update Todo";
  newTodoBtn.disabled = false;

  isEditingTodo = true;
  currentEditIndex = index;

  todoModal.showModal();
}
