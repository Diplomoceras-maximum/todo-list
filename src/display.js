import {
  projectList,
  deleteModal,
  deleteModalMessage,
  todoModal,
  todoForm,
  newTodoBtn,
  projectModal,
  newProjectBtn,
  projectTitleInput,
  projectDescInput,
  projectColourInput,
  todoTitleInput,
  todoDescInput,
  todoDueDateInput,
  todoPriorityInput,
  todoProjectSelect,
  inboxTab,
  todayTab,
  weekTab,
} from "./dom.js";
import {
  Project,
  myProjects,
  selectedProject,
  inboxProject,
  setPendingDeleteIndex,
  setPendingDeleteProject,
  setIsEditingTodo,
  setCurrentEditIndex,
  setIsEditingProject,
  setCurrentEditProject,
} from "./data.js";
import { handleProjectTabClick } from "./handlers.js";
import { saveToLocalStorage } from "./storage.js";

// Store and create new project
export function addProjectToList(title, desc, colour) {
  const newProject = new Project(title, desc, colour);
  myProjects.push(newProject);
}

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

// Clear main content area
export function clearContent() {
  const content = document.querySelector("#content");
  content.innerHTML = "";
}

// Display selected project details and its todos
export function displayProjectDetails(project) {
  clearContent();
  const content = document.querySelector("#content");

  const projectTitle = document.createElement("h1");
  projectTitle.textContent = project.title;

  const projectDescription = document.createElement("p");
  projectDescription.textContent = project.desc;

  const projectActions = document.createElement("div");
  projectActions.classList.add("project-actions");

  const isInbox = project === inboxProject;

  // Show edit and delete buttons if project is not the initial Inbox
  if (!isInbox) {
    const editProjectBtn = document.createElement("button");
    editProjectBtn.textContent = "Edit Project";
    editProjectBtn.addEventListener("click", () => {
      openEditProjectModal(project);
    });

    const deleteProjectBtn = document.createElement("button");
    deleteProjectBtn.textContent = "Delete Project";
    deleteProjectBtn.addEventListener("click", () => {
      setPendingDeleteProject(project);
      setPendingDeleteIndex(null);
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

    setIsEditingTodo(false);
    setCurrentEditIndex(null);

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
        saveToLocalStorage();
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
        setPendingDeleteIndex(index);
        setPendingDeleteProject(null);
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

// Pre-fill form for editing todo
export function openEditTodoModal(todo, index) {
  todoTitleInput.value = todo.title;
  todoDescInput.value = todo.desc;
  todoDueDateInput.value = todo.dueDate;
  todoPriorityInput.value = todo.priority;

  populateProjectSelect();

  const projectOptions = todoProjectSelect.options;
  for (let i = 0; i < projectOptions.length; i++) {
    if (projectOptions[i].textContent.trim() === todo.projectTitle) {
      todoProjectSelect.selectedIndex = i;
    }
  }

  newTodoBtn.textContent = "Update Todo";
  newTodoBtn.disabled = false;

  setIsEditingTodo(true);
  setCurrentEditIndex(index);

  todoModal.showModal();
}

// Pre-fill form for editing project
export function openEditProjectModal(project) {
  projectTitleInput.value = project.title;
  projectDescInput.value = project.desc;
  projectColourInput.value = project.colour;

  newProjectBtn.textContent = "Update Project";
  newProjectBtn.disabled = false;

  setIsEditingProject(true);
  setCurrentEditProject(project);

  projectModal.showModal();
}

// Populate select dropdown with all projects
export function populateProjectSelect() {
  todoProjectSelect.innerHTML = "";

  // Add Inbox option first
  const inboxOption = document.createElement("option");
  inboxOption.value = -1; // Value for Inbox
  inboxOption.textContent = inboxProject.title;
  todoProjectSelect.appendChild(inboxOption);

  myProjects.forEach((project, index) => {
    const option = document.createElement("option");
    option.value = index; // Value is the index in myProjects array
    option.textContent = project.title;
    todoProjectSelect.appendChild(option);
  });

  if (selectedProject === inboxProject) {
    // If viewing Inbox, select the Inbox option (value -1)
    todoProjectSelect.value = -1;
  } else {
    // If viewing a custom project, select its index value
    const projectIndex = myProjects.indexOf(selectedProject);
    if (projectIndex !== -1) {
      todoProjectSelect.value = projectIndex;
    }
  }
}

// Display todos due today or this week
export function displaySmartView(type) {
  clearContent();
  const content = document.querySelector("#content");

  let heading = type === "today" ? "Today's Tasks" : "This Week's Tasks";
  let filterFn;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
