import "./styles.css";

// ======= DOM Elements =======
const projectModal = document.querySelector("#project-modal");
const projectList = document.querySelector("#project-list");
const newProjectBtn = document.querySelector("#confirm-project-btn");
const addProjectBtn = document.querySelector("#add-project-btn");
const cancelProjectBtn = document.querySelector("#cancel-project-btn");
const form = document.querySelector("#new-project-form");

const titleInput = document.querySelector("#project_title");
const descInput = document.querySelector("#project_desc");
const colourInput = document.querySelector("#project_colour");
const inputs = [titleInput, descInput, colourInput];

// ======= Project Data =======
const myProjects = [];

function Project(title, desc, colour) {
  this.title = title;
  this.desc = desc;
  this.colour = colour;
}

// ======= Event Listeners =======

// Open modal and reset form
addProjectBtn.addEventListener("click", () => {
  form.reset();
  newProjectBtn.disabled = true; // reset button state
  projectModal.showModal();
});

// Close modal without saving
cancelProjectBtn.addEventListener("click", () => {
  projectModal.close();
});

// Enable/disable button on input
inputs.forEach((input) => {
  input.addEventListener("input", checkFormValidity);
});

function checkFormValidity() {
  const isValid =
    titleInput.value.trim() && descInput.value.trim() && colourInput.value;

  newProjectBtn.disabled = !isValid;
}

// Add project
newProjectBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const colour = colourInput.value;

  addProjectToList(title, desc, colour);
  displayProjects(myProjects);

  form.reset();
  newProjectBtn.disabled = true;
  projectModal.close();
});

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
