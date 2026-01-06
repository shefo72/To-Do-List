const container = document.querySelector(".container .row");
const addBtn = document.getElementById("addBtn");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const taskCount = document.getElementById("taskCount");
const darkBtn = document.getElementById("darkBtn");
const label = document.getElementById("label");
const sortList = document.getElementById("sortList");

const tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];
const notyf = new Notyf();
const savedTheme = localStorage.getItem("theme");
const labelsName = ["Study", "Fun", "Work", "Projects"];

let currentFilter = "All";

initApp();

function initApp() {
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    darkBtn.innerHTML = `<i class="fa-solid fa-sun text-dark"></i>`;
    darkBtn.classList.remove("bg-black");
    darkBtn.classList.add("bg-white");
  }

  viewTasks(tasks);
  calcProgress();
  handleLabel(label);
  handleLabel(sortList);
}

function calcProgress() {
  const progress = document.querySelector(".progress-bar");
  const completed = tasks.filter((t) => t.status).length;
  taskCount.textContent = `${completed}/${tasks.length}`;
  progress.setAttribute("style", `width: ${(completed / tasks.length) * 100}%`);
}

function changeStatus(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.status = !task.status;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  calcProgress();
  applyFilter();
}

addBtn.addEventListener("click", () => {
  if (!noteTitle.value) {
    notyf.error("Title is required.");
    return;
  }

  if (!noteBody.value) {
    notyf.error("Note content is required.");
    return;
  }

  if (label.value === "Choose label") {
    notyf.error("Please select a label.");
    return;
  }

  const task = {
    id: Date.now(),
    title: noteTitle.value,
    body: noteBody.value,
    status: false,
    label: label.value,
  };

  tasks.push(task);
  window.localStorage.setItem("tasks", JSON.stringify(tasks));

  noteTitle.value = "";
  noteBody.value = "";

  applyFilter();
  calcProgress();
  notyf.success("Your note have been successfully added!");

  const modalEl = document.getElementById("addTaskModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
});

function viewTasks(tasks) {
  let TasksHTML = "";
  const bgColors = [
    "#fcf3b3",
    "#d1ebec",
    "#fed4a8",
    "#ffdada",
    "#E07C7B",
    "#F2A365",
  ];

  tasks.forEach((task, index) => {
    TasksHTML += `
            <div class="col-lg-4 col-sm-6 d-flex">
              <div class="task p-3 rounded-2 w-100 position-relative ${
                task.status ? "opacity-50 text-decoration-line-through" : ""
              }"
                  style="background-color: ${
                    bgColors[index % bgColors.length]
                  }">

                <h3>${task.title}</h3>
                <p>${task.body}</p>
                <span class="badge position-absolute">${task.label.toUpperCase()}</span>
                <div class="options d-flex align-items-center justify-content-center gap-1 mt-2">
                  <input type="checkbox" onchange="changeStatus(${task.id})" ${
      task.status ? "checked" : ""
    } class="form-check-input mt-0 task-status" />
                  <button
                    class="btn btn-sm"
                    onclick="editTask(${task.id})"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    class="btn btn-sm"
                    onclick="deleteTask(${task.id})"
                  >
                    <i class="fa-solid fa-x"></i>
                  </button>
                </div>
              </div>
            </div>
      `;
  });

  TasksHTML += `
      <div class="col-lg-4 col-sm-6 d-flex">
        <div class="task bg-secondary-subtle p-3 rounded-2 w-100 d-flex align-items-center justify-content-center">
          <button
            class="w-100 h-100 btn"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#addTaskModal"
          >
            <i class="fa-solid fs-1 fa-plus"></i>
          </button>
        </div>
      </div>
    `;

  container.innerHTML = TasksHTML;
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
    applyFilter();
    calcProgress();

    notyf.success("Your note have been successfully deleted!");
  }
}

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    darkBtn.innerHTML = `<i class="fa-solid fa-sun text-dark"></i>`;
    darkBtn.classList.remove("bg-black");
    darkBtn.classList.add("bg-white");
    window.localStorage.setItem("theme", "dark");
  } else {
    darkBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    darkBtn.classList.remove("bg-white");
    darkBtn.classList.add("bg-black");
    window.localStorage.setItem("theme", "light");
  }
});

let currentEditId = null;

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  const labelEdit = document.getElementById("editLabel");

  if (!task) return;
  document.getElementById("editTitle").value = task.title;
  document.getElementById("editBody").value = task.body;

  handleLabel(labelEdit);
  labelEdit.value = task.label;
  currentEditId = id;

  const editModalEl = document.getElementById("editModal");
  const editModal = new bootstrap.Modal(editModalEl);

  editModal.show();
}

document.getElementById("editBtn").addEventListener("click", () => {
  const title = document.getElementById("editTitle").value;
  const body = document.getElementById("editBody").value;
  const label = document.getElementById("editLabel").value;

  const task = tasks.find((t) => t.id === currentEditId);
  if (!task) return;

  task.title = title;
  task.body = body;
  task.label = label;

  document.activeElement.blur();
  const modalEl = document.getElementById("editModal");
  bootstrap.Modal.getInstance(modalEl).hide();

  applyFilter();
});

function handleLabel(ele) {
  if (ele.options.length > 1) return;

  labelsName.forEach((l) => {
    ele.innerHTML += `<option value="${l}">${l}</option>`;
  });
}

sortList.addEventListener("change", () => {
  currentFilter = sortList.value;
  applyFilter();
});

function applyFilter() {
  const filteredTasks =
    currentFilter === "All"
      ? tasks
      : tasks.filter((t) => t.label === currentFilter);

  viewTasks(filteredTasks);
}
