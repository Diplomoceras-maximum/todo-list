import {
  projectModal,
  projectForm,
  newProjectBtn,
  todoModal,
  todoForm,
  newTodoBtn,
  deleteModal,
  deleteModalMessage,
  todoProjectSelect,
  projectTitleInput,
  projectDescInput,
  projectColourInput,
  todoTitleInput,
  todoDescInput,
  todoDueDateInput,
  todoPriorityInput,
} from "./dom.js";
import {
  myProjects,
  selectedProject,
  inboxProject,
  Todo,
  isEditingTodo,
  currentEditIndex,
  isEditingProject,
  currentEditProject,
  pendingDeleteIndex,
  pendingDeleteProject,
  setCurrentEditProject,
  setIsEditingProject,
  setSelectedProject,
  setCurrentEditIndex,
  setIsEditingTodo,
  setPendingDeleteIndex,
  setPendingDeleteProject,
} from "./data.js";
import {
  displayProjects,
  displayProjectDetails,
  addProjectToList,
  clearContent,
  setActiveTab,
} from "./display.js";
import { saveToLocalStorage } from "./storage.js";

// Open modal to create a new project
export function handleOpenProjectModal() {
  projectForm.reset();
  newProjectBtn.disabled = true;
  newProjectBtn.textContent = "Add Project";
  setIsEditingProject(false);
  setCurrentEditProject(null);
  projectModal.showModal();
}

// Add or update a project
export function handleAddProject() {
  const title = projectTitleInput.value.trim();
  const desc = projectDescInput.value.trim();
  const colour = projectColourInput.value;

  // Check for duplicate titles
  const isDuplicate = myProjects.some(
    (project) =>
      project.title.toLowerCase() === title.toLowerCase() &&
      project !== currentEditProject
  );

  if (isDuplicate) {
    alert("A project with this title already exists.");
    return;
  }

  // Update if editing, otherwise add
  if (isEditingProject && currentEditProject) {
    currentEditProject.title = title;
    currentEditProject.desc = desc;
    currentEditProject.colour = colour;
  } else {
    addProjectToList(title, desc, colour);
  }

  displayProjects(myProjects);
  if (selectedProject) displayProjectDetails(selectedProject);

  // Reset and close modal
  projectForm.reset();
  newProjectBtn.textContent = "Add Project";
  newProjectBtn.disabled = true;
  setIsEditingProject(false);
  setCurrentEditProject(null);
  saveToLocalStorage();
  projectModal.close();
}

// Switch to clicked project
export function handleProjectTabClick(project, tabElement) {
  setSelectedProject(project);
  displayProjectDetails(project);
  setActiveTab(tabElement);
}

// Add or update a todo item
export function handleAddTodo() {
  const title = todoTitleInput.value.trim();
  const desc = todoDescInput.value.trim();
  const dueDate = todoDueDateInput.value;
  const priority = todoPriorityInput.value;

  const projectIndex = parseInt(todoProjectSelect.value);
  let targetProject =
    projectIndex === -1 ? inboxProject : myProjects[projectIndex];

  const newProjectTitle = targetProject.title;

  // Remove todo from current project
  if (isEditingTodo && currentEditIndex !== null) {
    const oldTodo = selectedProject.todos.splice(currentEditIndex, 1)[0];

    if (oldTodo) {
      // Update fields
      oldTodo.title = title;
      oldTodo.desc = desc;
      oldTodo.dueDate = dueDate;
      oldTodo.priority = priority;

      oldTodo.projectTitle = newProjectTitle;

      // Add to target project
      targetProject.todos.push(oldTodo);

      // Do NOT switch selectedProject if moving todo between projects
      displayProjects(myProjects);
      displayProjectDetails(selectedProject);
    }
  } else {
    // Create and add new todo
    const newTodo = new Todo(title, desc, dueDate, priority, newProjectTitle);
    targetProject.todos.push(newTodo);

    // Only switch to targetProject if this is a new todo
    setSelectedProject(targetProject);
    displayProjects(myProjects);
    displayProjectDetails(selectedProject);
  }

  // Reset and close modal
  todoForm.reset();
  newTodoBtn.textContent = "Add Todo";
  setIsEditingTodo(false);
  setCurrentEditIndex(null);
  saveToLocalStorage();
  todoModal.close();
}

// Handle delete for todo or project
export function handleConfirmDelete() {
  if (pendingDeleteIndex !== null && selectedProject) {
    selectedProject.todos.splice(pendingDeleteIndex, 1);
    setPendingDeleteIndex(null);
    displayProjectDetails(selectedProject);
  } else if (pendingDeleteProject !== null) {
    const index = myProjects.indexOf(pendingDeleteProject);
    if (index !== -1) {
      myProjects.splice(index, 1);

      const newSelectedProject = myProjects[0] || inboxProject;
      setSelectedProject(newSelectedProject);

      clearContent();
      displayProjects(myProjects);
      if (selectedProject) displayProjectDetails(selectedProject);
    }
    setPendingDeleteProject(null);
  }
  // Reset and close modal
  saveToLocalStorage();
  deleteModal.close();
  deleteModalMessage.textContent = "";
  setPendingDeleteIndex(null);
  setPendingDeleteProject(null);
}

// Cancel delete and reset state
export function handleCancelDelete() {
  setPendingDeleteIndex(null);
  deleteModal.close();
}
