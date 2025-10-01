import "./styles.css";

// ======= DOM Elements =======

// Modals
const projectModal = document.querySelector("#project-modal");
const todoModal = document.querySelector("#todo-modal");
const deleteModal = document.querySelector("#delete-confirm-modal");

// Forms
const projectForm = document.querySelector("#new-project-form");
const todoForm = document.querySelector("#new-todo-form");

// Project Form Inputs
const projectTitleInput = document.querySelector("#project_title");
const projectDescInput = document.querySelector("#project_desc");
const projectColourInput = document.querySelector("#project_colour");
const projectInputs = [projectTitleInput, projectDescInput, projectColourInput];

// Todo Form Inputs
const todoTitleInput = document.querySelector("#todo_title");
const todoDescInput = document.querySelector("#todo_desc");
const todoDueDateInput = document.querySelector("#todo_due_date");
const todoPriorityInput = document.querySelector("#todo_priority");
const todoProjectSelect = document.querySelector("#todo_project");
const todoInputs = [
  todoTitleInput,
  todoDescInput,
  todoDueDateInput,
  todoPriorityInput,
  todoProjectSelect,
];

// Sidebar Tabs
const inboxTab = document.querySelector("#inbox-tab");
const todayTab = document.querySelector("#today-tab");
const weekTab = document.querySelector("#week-tab");

// Project List
const projectList = document.querySelector("#project-list");

// Buttons
const newProjectBtn = document.querySelector("#confirm-project-btn");
const cancelProjectBtn = document.querySelector("#cancel-project-btn");
const newTodoBtn = document.querySelector("#confirm-todo-btn");
const cancelTodoBtn = document.querySelector("#cancel-todo-btn");
const confirmDeleteBtn = document.querySelector("#confirm-delete-btn");
const cancelDeleteBtn = document.querySelector("#cancel-delete-btn");

// Delete Modal Message
const deleteModalMessage = document.querySelector("#delete-modal-message");

// ======= Data =======
let inboxProject = null;
const myProjects = [];
let selectedProject = null;

let isEditingTodo = false;
let currentEditIndex = null;
let pendingDeleteIndex = null;

let isEditingProject = false;
let currentEditProject = null;
let pendingDeleteProject = null;

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
  // Create default Inbox project
  inboxProject = new Project(
    "Inbox",
    "Default inbox for uncategorised tasks",
    "#888888"
  );
  selectedProject = inboxProject;

  // Sidebar tab event listeners
  inboxTab.addEventListener("click", () => {
    displayProjectDetails(inboxProject);
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

  const addProjectBtn = document.querySelector("#add-project-btn");
  addProjectBtn.addEventListener("click", handleOpenProjectModal);

  // Initial rendering
  displayProjects(myProjects);
  displayProjectDetails(selectedProject);
}

init();

// ======= Event Handlers =======

function handleOpenProjectModal() {
  projectForm.reset();
  newProjectBtn.disabled = true;
  newProjectBtn.textContent = "Add Project";
  isEditingProject = false;
  currentEditProject = null;
  projectModal.showModal();
}

function handleAddProject() {
  const title = projectTitleInput.value.trim();
  const desc = projectDescInput.value.trim();
  const colour = projectColourInput.value;

  const isDuplicate = myProjects.some(
    (project) =>
      project.title.toLowerCase() === title.toLowerCase() &&
      project !== currentEditProject // Allow editing without triggering duplicate error
  );

  if (isDuplicate) {
    alert("A project with this title already exists.");
    return;
  }

  if (isEditingProject && currentEditProject) {
    currentEditProject.title = title;
    currentEditProject.desc = desc;
    currentEditProject.colour = colour;
  } else {
    addProjectToList(title, desc, colour);
  }

  displayProjects(myProjects);
  if (selectedProject) displayProjectDetails(selectedProject);

  projectForm.reset();
  newProjectBtn.textContent = "Add Project";
  newProjectBtn.disabled = true;
  isEditingProject = false;
  currentEditProject = null;
  projectModal.close();
}

function handleProjectTabClick(project) {
  selectedProject = project;
  displayProjectDetails(project);
}

function handleAddTodo() {
  const title = todoTitleInput.value.trim();
  const desc = todoDescInput.value.trim();
  const dueDate = todoDueDateInput.value;
  const priority = todoPriorityInput.value;

  const projectIndex = parseInt(todoProjectSelect.value);
  let targetProject =
    projectIndex === -1 ? inboxProject : myProjects[projectIndex];

  if (isEditingTodo && currentEditIndex !== null) {
    // Remove todo from current project
    const oldTodo = selectedProject.todos.splice(currentEditIndex, 1)[0];

    // Update fields
    oldTodo.title = title;
    oldTodo.desc = desc;
    oldTodo.dueDate = dueDate;
    oldTodo.priority = priority;

    // Add to target project
    targetProject.todos.push(oldTodo);

    // Do NOT switch selectedProject if moving todo between projects, just refresh the current view
    displayProjects(myProjects);
    displayProjectDetails(selectedProject);
  } else {
    // Create and add new todo
    const newTodo = new Todo(title, desc, dueDate, priority);
    targetProject.todos.push(newTodo);

    // Only switch to targetProject if this is a new todo
    selectedProject = targetProject;
    displayProjects(myProjects);
    displayProjectDetails(selectedProject);
  }

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
  } else if (pendingDeleteProject !== null) {
    const index = myProjects.indexOf(pendingDeleteProject);
    if (index !== -1) {
      myProjects.splice(index, 1);
      selectedProject = myProjects[0] || inboxProject;
      clearContent();
      displayProjects(myProjects);
      if (selectedProject) displayProjectDetails(selectedProject);
    }
    pendingDeleteProject = null;
  }
  deleteModal.close();
  deleteModalMessage.textContent = "";
  pendingDeleteIndex = null;
  pendingDeleteProject = null;
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
    const tab = createProjectTab(project);
    projectList.appendChild(tab);
  });
}

function createProjectTab(project) {
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
  return tab;
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

  const projectActions = document.createElement("div");
  projectActions.classList.add("project-actions");

  const isInbox = project === inboxProject;

  if (!isInbox) {
    const editProjectBtn = document.createElement("button");
    editProjectBtn.textContent = "Edit Project";
    editProjectBtn.addEventListener("click", () => {
      openEditProjectModal(project);
    });

    const deleteProjectBtn = document.createElement("button");
    deleteProjectBtn.textContent = "Delete Project";
    deleteProjectBtn.addEventListener("click", () => {
      pendingDeleteProject = project;
      pendingDeleteIndex = null;
      deleteModalMessage.textContent =
        "Are you sure you want to delete this project?";
      deleteModal.showModal();
    });

    projectActions.appendChild(editProjectBtn);
    projectActions.appendChild(deleteProjectBtn);
  }

  const addTodoButton = document.createElement("button");
  addTodoButton.textContent = "+ Add Todo";
  addTodoButton.addEventListener("click", () => {
    todoForm.reset();
    populateProjectSelect();
    newTodoBtn.textContent = "Add Todo";
    newTodoBtn.disabled = true;

    isEditingTodo = false;
    currentEditIndex = null;

    todoModal.showModal();
  });

  const projectTodos = document.createElement("div");
  projectTodos.id = "project-todos";

  project.todos
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .forEach((todo, index) => {
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

      const dueDateObj = new Date(todo.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDateObj < today && !todo.completed) {
        todoItem.classList.add("overdue");
      }

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
        pendingDeleteProject = null;
        deleteModalMessage.textContent =
          "Are you sure you want to delete this todo?";
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
  content.appendChild(projectActions);
  content.appendChild(addTodoButton);
  content.appendChild(projectTodos);
}

function openEditTodoModal(todo, index) {
  todoTitleInput.value = todo.title;
  todoDescInput.value = todo.desc;
  todoDueDateInput.value = todo.dueDate;
  todoPriorityInput.value = todo.priority;

  populateProjectSelect();
  if (selectedProject === inboxProject) {
    todoProjectSelect.value = -1;
  } else {
    todoProjectSelect.value = myProjects.indexOf(selectedProject);
  }

  newTodoBtn.textContent = "Update Todo";
  newTodoBtn.disabled = false;

  isEditingTodo = true;
  currentEditIndex = index;

  todoModal.showModal();
}

function openEditProjectModal(project) {
  projectTitleInput.value = project.title;
  projectDescInput.value = project.desc;
  projectColourInput.value = project.colour;

  newProjectBtn.textContent = "Update Project";
  newProjectBtn.disabled = false;

  isEditingProject = true;
  currentEditProject = project;

  projectModal.showModal();
}

function populateProjectSelect() {
  todoProjectSelect.innerHTML = "";

  // Add Inbox option first
  const inboxOption = document.createElement("option");
  inboxOption.value = -1;
  inboxOption.textContent = inboxProject.title;
  todoProjectSelect.appendChild(inboxOption);

  myProjects.forEach((project, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = project.title;
    todoProjectSelect.appendChild(option);
  });

  // Set selected value in the dropdown based on selectedProject
  if (selectedProject === inboxProject) {
    todoProjectSelect.value = -1;
  } else {
    todoProjectSelect.value = myProjects.indexOf(selectedProject);
  }
}

function displaySmartView(type) {
  clearContent();
  const content = document.querySelector("#content");

  let heading = type === "today" ? "Today's Tasks" : "This Week's Tasks";
  let filterFn;

  const today = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(today.getDate() + 7);

  if (type === "today") {
    filterFn = (date) => new Date(date).toDateString() === today.toDateString();
  } else {
    filterFn = (date) => {
      const d = new Date(date);
      return d >= today && d <= oneWeekFromNow;
    };
  }

  const allTodos = [inboxProject, ...myProjects].flatMap((p) =>
    p.todos.map((todo) => ({ ...todo, projectTitle: p.title }))
  );

  const filtered = allTodos.filter((todo) => filterFn(todo.dueDate));

  const headingEl = document.createElement("h1");
  headingEl.textContent = heading;
  content.appendChild(headingEl);

  const todosEl = document.createElement("div");
  todosEl.id = "project-todos";

  if (filtered.length === 0) {
    todosEl.textContent = "No tasks found.";
  } else {
    filtered.forEach((todo) => {
      const item = document.createElement("div");
      item.classList.add("todo-item");

      const title = document.createElement("h3");
      title.textContent = `${todo.title} (${todo.projectTitle})`;

      const desc = document.createElement("p");
      desc.textContent = todo.desc;

      const meta = document.createElement("p");
      meta.textContent = `Due: ${todo.dueDate} | Priority: ${todo.priority}`;

      item.appendChild(title);
      item.appendChild(desc);
      item.appendChild(meta);

      todosEl.appendChild(item);
    });
  }

  content.appendChild(todosEl);
}
