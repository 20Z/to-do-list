let tasks=[];


const params = new URLSearchParams(window.location.search);
if (params.has("data")) {
  try {
    const decoded = atob(params.get("data"));
    tasks = JSON.parse(decoded);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (e) {
    alert("Invalid shared link.");
  }
}

tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  
  