const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const tasksContainer = document.getElementById("tasksContainer");
const deleteAllTasksBtn = document.getElementById("deleteAllTasks");
const deleteDoneTasksBtn = document.getElementById("deleteDoneTasks");
const showAllBtn = document.getElementById("showAll");
const showDoneBtn = document.getElementById("showDone");
const showTodoBtn = document.getElementById("showTodo");
const confirmationDialog = document.getElementById("confirmationDialog"); // Confirmation dialog
const errorMessage = document.getElementById("errorMessage"); // Error message element

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();

  // Check if task is empty
  if (taskText === "") {
    showError("Task cannot be empty!");
    return;
  }

  // Check if task is less than 5 characters
  if (taskText.length < 5) {
    showError("Task name must be at least 5 characters long!");
    return;
  }

  const taskRow = createTaskRow(taskText);
  tasksContainer.appendChild(taskRow);
  taskInput.value = ""; // Clear input after adding
  errorMessage.style.display = "none"; // Hide error message
  updateNoTaskMessage();
});

function createTaskRow(text) {
  const taskRow = document.createElement("div");
  taskRow.classList.add("task-row");

  // Task text
  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;

  const taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.addEventListener("change", () => {
    if (taskCheckbox.checked) {
      taskSpan.style.textDecoration = "line-through";
      taskSpan.style.color = "red";
      taskRow.classList.add("task-done");
    } else {
      taskSpan.style.textDecoration = "none";
      taskSpan.style.color = "black";
      taskRow.classList.remove("task-done");
    }
  });

  const editBtn = document.createElement("button");
  editBtn.classList.add("icon-btn");
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.addEventListener("click", () => {
    const newName = prompt("Enter new name:", taskSpan.textContent);
    if (newName && /^[a-zA-Z0-9\s]+$/.test(newName)) {
      if (newName.length < 5) {
        alert("Task name must be at least 5 characters long!");
      } else {
        taskSpan.textContent = newName;
      }
    } else {
      alert("Invalid task name!");
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("icon-btn");
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      taskRow.remove();
      updateNoTaskMessage();
    }
  });

  // Append elements to task row
  taskRow.append(taskSpan, taskCheckbox, editBtn, deleteBtn);
  return taskRow;
}

deleteAllTasksBtn.addEventListener("click", () => {
  tasksContainer.innerHTML = "";
  updateNoTaskMessage();
});

// Deleting done tasks
deleteDoneTasksBtn.addEventListener("click", () => {
  const doneTasks = document.querySelectorAll(".task-row.task-done");
  doneTasks.forEach(task => task.remove());
  updateNoTaskMessage();
});

function updateNoTaskMessage() {
  if (tasksContainer.children.length === 0) {
    const existingMessage = document.getElementById("noTaskMessage");
    if (!existingMessage) {
      const noTaskMessage = document.createElement("p");
      noTaskMessage.id = "noTaskMessage";
      noTaskMessage.textContent = "No task";
      tasksContainer.appendChild(noTaskMessage);
    }
  } else {
    const existingMessage = document.getElementById("noTaskMessage");
    if (existingMessage) existingMessage.remove();
  }
}

showAllBtn.addEventListener("click", () => {
  const tasks = document.querySelectorAll(".task-row");
  tasks.forEach(task => (task.style.display = "flex"));
});

showDoneBtn.addEventListener("click", () => {
  const tasks = document.querySelectorAll(".task-row");
  tasks.forEach(task => {
    if (task.classList.contains("task-done")) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
});

showTodoBtn.addEventListener("click", () => {
  const tasks = document.querySelectorAll(".task-row");
  tasks.forEach(task => {
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
