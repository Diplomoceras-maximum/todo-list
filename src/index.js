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

// ======= Data =======
const myProjects = [];
let selectedProject = null;

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

  const newTodo = new Todo(title, desc, dueDate, priority);

  if (selectedProject) {
    selectedProject.todos.push(newTodo);
    displayProjectDetails(selectedProject);
  }

  todoForm.reset();
  todoModal.close();
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
    newTodoBtn.disabled = true;
    todoModal.showModal();
  });

  const projectTodos = document.createElement("div");
  projectTodos.id = "project-todos";

  project.todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    const title = document.createElement("h3");
    title.textContent = todo.title;

    const desc = document.createElement("p");
    desc.textContent = todo.desc;

    const meta = document.createElement("p");
    meta.textContent = `Due: ${todo.dueDate} | Priority: ${todo.priority}`;

    todoItem.appendChild(title);
    todoItem.appendChild(desc);
    todoItem.appendChild(meta);

    projectTodos.appendChild(todoItem);
  });

  content.appendChild(projectTitle);
  content.appendChild(projectDescription);
  content.appendChild(addTodoButton);
  content.appendChild(projectTodos);
}
