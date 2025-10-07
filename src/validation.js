import {
  projectTitleInput,
  projectDescInput,
  projectColourInput,
  newProjectBtn,
  todoTitleInput,
  todoDescInput,
  todoDueDateInput,
  todoPriorityInput,
  newTodoBtn,
} from "./dom.js";

// Enable button if all project fields are filled
export function checkProjectFormValidity() {
  const isValid =
    projectTitleInput.value.trim() &&
    projectDescInput.value.trim() &&
    projectColourInput.value;
  newProjectBtn.disabled = !isValid;
}

// Enable button if all todo fields are filled
export function checkTodoFormValidity() {
  const isValid =
    todoTitleInput.value.trim() &&
    todoDescInput.value.trim() &&
    todoDueDateInput.value &&
    todoPriorityInput.value;
  newTodoBtn.disabled = !isValid;
}
