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
  
const renderTasks = () => {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
  
    tasks.forEach((task, index) => {
      if ((filter === "done" && !task.done) || (filter === "todo" && task.done)) return;
  
      const li = document.createElement("li");
  
      const span = document.createElement("span");
      span.textContent = task.text;
      if (task.done) span.style.textDecoration = "line-through";
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.onchange = () => {
        task.done = !task.done;
        saveTasks();
        renderTasks();
      };
  
      const edit = document.createElement("i");
      edit.textContent = "✏️";
      edit.onclick = () => showEditPopup(index);
  
      const del = document.createElement("i");
      del.textContent = "🗑️";
      del.onclick = () => showDeleteConfirm(index);
  
      const icons = document.createElement("div");
      icons.className = "icons";
      icons.appendChild(checkbox);
      icons.appendChild(edit);
      icons.appendChild(del);
  
      li.appendChild(span);
      li.appendChild(icons);
      list.appendChild(li);
    });
  };
  