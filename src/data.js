// Project constructor
export function Project(title, desc, colour) {
  this.title = title;
  this.desc = desc;
  this.colour = colour;
  this.todos = [];
}

// Todo constructor
export function Todo(title, desc, dueDate, priority, projectTitle) {
  this.title = title;
  this.desc = desc;
  this.dueDate = dueDate;
  this.priority = priority;
  this.completed = false;
  this.projectTitle = projectTitle;
}

// --- State variables ---

export let inboxProject = null; // Default "Inbox" project
export const myProjects = []; // Array to store user-created projects
export let selectedProject = null; // Current active project

// Editing/Deleting state trackers
export let isEditingTodo = false;
export let currentEditIndex = null;
export let pendingDeleteIndex = null;

export let isEditingProject = false;
export let currentEditProject = null;
export let pendingDeleteProject = null;

// --- Setters ---

// Setters for primary state
export function setInboxProject(project) {
  inboxProject = project;
}
export function setSelectedProject(project) {
  selectedProject = project;
}

// Setters for Todo Editing/Deletion
export function setIsEditingTodo(bool) {
  isEditingTodo = bool;
}
export function setCurrentEditIndex(index) {
  currentEditIndex = index;
}
export function setPendingDeleteIndex(index) {
  pendingDeleteIndex = index;
}

// Setters for Project Editing/Deletion
export function setIsEditingProject(bool) {
  isEditingProject = bool;
}
export function setCurrentEditProject(project) {
  currentEditProject = project;
}
export function setPendingDeleteProject(project) {
  pendingDeleteProject = project;
}
