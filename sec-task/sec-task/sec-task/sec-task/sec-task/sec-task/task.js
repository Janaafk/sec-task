const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const tasksContainer = document.getElementById("tasksContainer");
const deleteAllTasksBtn = document.getElementById("deleteAllTasks");
const deleteDoneTasksBtn = document.getElementById("deleteDoneTasks");
const showAllBtn = document.getElementById("showAll");
const showDoneBtn = document.getElementById("showDone");
const showTodoBtn = document.getElementById("showTodo");
const errorMessage = document.getElementById("errorMessage");


window.addEventListener("load", function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => {
    const taskRow = createTaskRow(task.text, task.done);
    tasksContainer.appendChild(taskRow);
  });
  updateNoTaskMessage();
});

addTaskBtn.addEventListener("click", function () {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    showError("Task cannot be empty!");
    return;
  }

  if (/[\u0600-\u06FF]/.test(taskText)) {
    showError("Task cannot contain Arabic letters!");
    return;
  }

  if (taskText.length < 5) {
    showError("Task name must be at least 5 characters long!");
    return;
  }

  const taskRow = createTaskRow(taskText, false);
  tasksContainer.appendChild(taskRow);
  saveTasksToLocalStorage();
  taskInput.value = "";
  errorMessage.style.display = "none";
  updateNoTaskMessage();
});

function createTaskRow(text, done) {
  const taskRow = document.createElement("div");
  taskRow.classList.add("task-row");

  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;

  const taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.checked = done;

  if (done) {
    taskSpan.style.textDecoration = "line-through";
    taskSpan.style.color = "red";
    taskRow.classList.add("task-done");
  }

  taskCheckbox.addEventListener("change", function () {
    if (taskCheckbox.checked) {
      taskSpan.style.textDecoration = "line-through";
      taskSpan.style.color = "red";
      taskRow.classList.add("task-done");
    } else {
      taskSpan.style.textDecoration = "none";
      taskSpan.style.color = "black";
      taskRow.classList.remove("task-done");
    }
    saveTasksToLocalStorage();
  });

  const editBtn = document.createElement("button");
  editBtn.classList.add("icon-btn");
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.addEventListener("click", function () {
    const newName = prompt("Enter new name:", taskSpan.textContent);

    if (newName && /[\u0600-\u06FF]/.test(newName)) {
      alert("Task name cannot contain Arabic letters!");
      return;
    }

    if (newName && newName.length < 5) {
      alert("Task name must be at least 5 characters long!");
    } else if (newName) {
      taskSpan.textContent = newName;
      saveTasksToLocalStorage();
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("icon-btn");
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.addEventListener("click", function () {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      taskRow.remove();
      saveTasksToLocalStorage();
      updateNoTaskMessage();
    }
  });

  taskRow.appendChild(taskSpan);
  taskRow.appendChild(taskCheckbox);
  taskRow.appendChild(editBtn);
  taskRow.appendChild(deleteBtn);

  return taskRow;
}

deleteAllTasksBtn.addEventListener("click", function () {
  tasksContainer.innerHTML = "";
  saveTasksToLocalStorage();
  updateNoTaskMessage();
});

deleteDoneTasksBtn.addEventListener("click", function () {
  const doneTasks = document.querySelectorAll(".task-row.task-done");
  doneTasks.forEach(function (task) {
    task.remove();
  });
  saveTasksToLocalStorage();
  updateNoTaskMessage();
});

function saveTasksToLocalStorage() {
  const tasks = [];
  const taskRows = document.querySelectorAll(".task-row");
  taskRows.forEach((taskRow) => {
    const taskText = taskRow.querySelector("span").textContent;
    const taskDone = taskRow.querySelector("input").checked;
    tasks.push({ text: taskText, done: taskDone });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateNoTaskMessage() {
  if (tasksContainer.children.length === 0) {
    let noTaskMessage = document.getElementById("noTaskMessage");
    if (!noTaskMessage) {
      noTaskMessage = document.createElement("p");
      noTaskMessage.id = "noTaskMessage";
      noTaskMessage.textContent = "No tasks";
      tasksContainer.appendChild(noTaskMessage);
    }
  } else {
    const noTaskMessage = document.getElementById("noTaskMessage");
    if (noTaskMessage) {
      noTaskMessage.remove();
    }
  }
}

showAllBtn.addEventListener("click", function () {
  const tasks = document.querySelectorAll(".task-row");
  tasks.forEach(function (task) {
    task.style.display = "flex";
  });
});

showDoneBtn.addEventListener("click", function () {
  const tasks = document.querySelectorAll(".task-row");
  tasks.forEach(function (task) {
    if (task.classList.contains("task-done")) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
});

showTodoBtn.addEventListener("click", function () {
  const tasks = document.querySelectorAll(".task-row");
  tasks.forEach(function (task) {
    if (!task.classList.contains("task-done")) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}