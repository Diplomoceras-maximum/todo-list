import {
  todoModal,
  projectModal,
  todoTitleInput,
  todoDescInput,
  todoDueDateInput,
  todoPriorityInput,
  todoProjectSelect,
  projectTitleInput,
  projectDescInput,
  projectColourInput,
  newTodoBtn,
  newProjectBtn,
} from "../dom/dom.js";
import {
  myProjects,
  inboxProject,
  selectedProject,
  setIsEditingTodo,
  setCurrentEditIndex,
  setIsEditingProject,
  setCurrentEditProject,
} from "../core/data.js";

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
