let tasks = [];

const params = new URLSearchParams(window.location.search);
if (params.has("data")) {
  try {
    const base64 = params.get("data");
    const binary = atob(base64);
    const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
    const decoded = new TextDecoder().decode(bytes);    tasks = JSON.parse(decoded);
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
    edit.innerHTML = '<i class="mc mc-writable-book mc-xl"></i>';
    edit.onclick = () => showEditPopup(index);

    const del = document.createElement("i");
    del.innerHTML = '<i class="mc mc-barrier mc-xl"></i>';
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

const addTask = () => {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!validateTaskInput(text)) return;
  tasks.push({ text, done: false });
  input.value = "";
  saveTasks();
  renderTasks();
};

const filterTasks = (type) => {
  filter = type;
  document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(btn => {
    if (btn.textContent.toLowerCase() === type) btn.classList.add("active");
  });
  renderTasks();
};

const deleteDoneTasks = () => {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  renderTasks();
};

const deleteAllTasks = () => {
  showDeleteConfirm("all");
};


const generateShareLink = () => {
    const utf8Encoded = new TextEncoder().encode(JSON.stringify(tasks));
    const base64String = btoa(String.fromCharCode(...utf8Encoded));
    const link = `${location.origin}${location.pathname}?data=${base64String}`;
    document.getElementById("shareLink").value = link;
  };
  
const showEditPopup = (index) => {
  const popup = document.getElementById("editPopup");
  const input = document.getElementById("editInput");
  input.value = tasks[index].text;
  popup.style.display = "block";

  document.getElementById("saveEditBtn").onclick = () => {
    const newText = input.value.trim();
    if (!validateTaskInput(newText)) return;

    if (newText) {
      tasks[index].text = newText;
      saveTasks();
      renderTasks();
    }
    popup.style.display = "none";
  };

  document.getElementById("cancelEditBtn").onclick = () => {
    popup.style.display = "none";
  };
};

const showDeleteConfirm = (index) => {
  const popup = document.getElementById("deleteConfirmPopup");
  popup.style.display = "block";

  document.getElementById("confirmDel").onclick = () => {
    if (index === "all") {
      tasks = [];
    } else {
      tasks.splice(index, 1);
    }
    saveTasks();
    renderTasks();
    popup.style.display = "none";
  };

  document.getElementById("cancelDel").onclick = () => {
    popup.style.display = "none";
  };
};


const showError = (message) => {
    const popup = document.getElementById("errorPopup");
    const msg = document.getElementById("errorText");
    msg.textContent = message;
    popup.style.display = "block";
  
    document.getElementById("closeErrorBtn").onclick = () => {
      popup.style.display = "none";
    };
  };
  const validateTaskInput = (text) => {
    if (!text.trim()) {
      showError("Task cannot be empty.");
      return false;
    }
    if (/^\d/.test(text)) {
      showError("Task cannot start with a number.");
      return false;
    }
    if (text.length < 5) {
      showError("Task must be at least 5 characters long.");
      return false;
    }
    return true;
  };
  
  const copyLink = () => {
    const input = document.getElementById("shareLink");
    navigator.clipboard.writeText(input.value)
      
  };

  document.getElementById("copyBtn").addEventListener("click", copyLink);


window.onload = () => renderTasks();
