const sidebar = document.querySelector("#sidebar");
const toggleBtn = document.querySelector("#open-close-btn");

function setupSidebarToggle() {
  sidebar.classList.remove("no-transition");
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
}

export { setupSidebarToggle };
