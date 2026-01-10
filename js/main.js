/* ========= Variables ========= */
const container = document.querySelector(".container .row");
const addBtn = document.getElementById("addBtn");
const closeFormBtn = document.getElementById("closeFormBtn");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const taskCount = document.getElementById("taskCount");
const darkBtn = document.getElementById("darkBtn");
const label = document.getElementById("label");
const sortList = document.getElementById("sortList");
const searchBar = document.getElementById("searchBar");
const editBtn = document.getElementById("editBtn");
const inputLabel = document.getElementById("inputLabel");

let tasks = readFromLocalStorage("tasks") || [];
let labelsName = readFromLocalStorage("labels") || [
  "Work",
  "Personal",
  "Fun",
  "Health",
];

let currentEditId = null;
let currentFilter = "All";
let newLabel = "";

const savedTheme = localStorage.getItem("theme") || "light";
const notyf = new Notyf();

// ========== INIT ==========
function initApp() {
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    darkBtn.innerHTML = `<i class="fa-solid fa-sun text-dark"></i>`;
    darkBtn.classList.remove("bg-black");
    darkBtn.classList.add("bg-white");
  }

  renderTasks(tasks);
  calcProgress();
  handleLabel(label, true);
  handleLabel(sortList);
}

initApp();

// ========== CRUD OPERATION ==========
function createTask() {
  const modalEl = document.getElementById("addTaskModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  let task;

  if (!noteTitle.value || noteTitle.value.trim() === "") {
    notyf.error("Title is required.");
    return;
  }

  if (!noteBody.value || noteBody.value.trim() === "") {
    notyf.error("Note content is required.");
    return;
  }

  if (label.value === "Choose label") {
    notyf.error("Please select a label.");
    return;
  }

  if (label.value === "+ Add New Label") {
    if (!newLabel || newLabel.trim() === "") {
      notyf.error("Please enter a valid label name.");
      return;
    }
    if (!labelsName.includes(newLabel)) {
      labelsName.push(newLabel);
      saveToLocalStorage("labels", labelsName);
      handleLabel(label, true);
      handleLabel(sortList);
    }
    task = buildTask(newLabel);
  } else {
    task = buildTask(label.value);
  }
  tasks.push(task);

  resetForm();
  updateUI();
  modal.hide();

  notyf.success("Your note have been successfully added!");
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    updateUI();

    notyf.success("Your note have been successfully deleted!");
  }
}

function openTask(id) {
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

function changeStatus(id) {
  const task = tasks.find((t) => t.id === id);

  if (!task) return;
  task.status = !task.status;

  updateUI();
}

// ========== HELPER FUNCTION ==========
function buildTask(labelValue) {
  return {
    id: Date.now(),
    title: noteTitle.value,
    body: noteBody.value,
    status: false,
    label: labelValue,
  };
}

function resetForm() {
  noteTitle.value = "";
  noteBody.value = "";
  label.value = "Choose label";
  inputLabel.innerHTML = "";
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function readFromLocalStorage(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

function calcProgress() {
  const progress = document.querySelector(".progress-bar");
  const completed = tasks.filter((t) => t.status).length;
  taskCount.textContent = `${completed}/${tasks.length}`;
  progress.setAttribute("style", `width: ${(completed / tasks.length) * 100}%`);
}

function handleLabel(ele, allowAdd = false) {
  labelsName.forEach((l) => {
    if (ele.querySelector(`option[value="${l}"]`)) return;
    ele.innerHTML += `<option value="${l}">${l}</option>`;
  });
  if (!allowAdd) return;
  if (ele.querySelector(`option[value="+ Add New Label"]`))
    ele.querySelector(`option[value="+ Add New Label"]`).remove();
  ele.innerHTML += `<option value="+ Add New Label">+ Add New Label</option>`;
}

// ========== UI Functions ==========
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
            <div id="${task.id}" class="col-lg-4 col-sm-6 d-flex ${
      task.status ? "fixed" : ""
    }">
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
                  <input type="checkbox" name="status" data-id="${task.id}" ${
      task.status ? "checked" : ""
    } class="form-check-input mt-0 task-status" />
                  <button class="btn btn-sm deleteBtn" >
                    <i class="fa-solid fa-x"></i>
                  </button>
                </div>
              </div>
            </div>
      `;
  });

  TasksHTML += `
      <div class="col-lg-4 col-sm-6 d-flex fixed">
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

function renderTasks(selectedTasks) {
  const filteredTasks =
    currentFilter === "All"
      ? selectedTasks
      : selectedTasks.filter((t) => t.label === currentFilter);

  filteredTasks.sort((a, b) => {
    return a.status - b.status;
  });

  viewTasks(filteredTasks);
}

function updateUI() {
  saveToLocalStorage("tasks", tasks);
  renderTasks(tasks);
  calcProgress();
}

/* ========== Events ========== */
container.addEventListener("click", (e) => {
  const task = e.target.closest(".task");
  if (!task) return;
  const card = task.closest(".col-lg-4");
  if (!card) return;
  const id = Number(card.id);

  if (e.target.closest(".deleteBtn")) {
    e.stopPropagation();
    deleteTask(id);
    return;
  }
  if (e.target.closest(".form-check-input")) {
    return;
  }
  openTask(id);
});

addBtn.addEventListener("click", () => {
  createTask();
});

searchBar.addEventListener("input", (e) => {
  let query = e.target.value.toLowerCase().trim();
  if (query.length >= 3) {
    let searchedTasks = tasks.filter((t) => {
      return (
        t.body.toLowerCase().includes(query) ||
        t.title.toLowerCase().includes(query)
      );
    });
    renderTasks(searchedTasks);
  } else {
    renderTasks(tasks);
  }
});

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    darkBtn.innerHTML = `<i class="fa-solid fa-sun text-dark"></i>`;
    darkBtn.classList.remove("bg-black");
    darkBtn.classList.add("bg-white");
    saveToLocalStorage("theme", "dark");
  } else {
    darkBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    darkBtn.classList.remove("bg-white");
    darkBtn.classList.add("bg-black");
    saveToLocalStorage("theme", "light");
  }
});

editBtn.addEventListener("click", () => {
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

  renderTasks(tasks);
});

sortList.addEventListener("change", () => {
  currentFilter = sortList.value;
  renderTasks(tasks);
});

container.addEventListener("change", (e) => {
  if (!e.target.classList.contains("task-status")) return;

  const id = Number(e.target.dataset.id);
  changeStatus(id);
});

closeFormBtn.addEventListener("click", () => {
  resetForm();
});

label.addEventListener("change", (e) => {
  if (e.target.value === "+ Add New Label") {
    inputLabel.innerHTML = `
      <label for="newLabel" class="form-label">New Label</label>
      <input type="text" class="form-control" id="newLabel" placeholder="Enter new label">
    `;

    const newLabelInput = document.getElementById("newLabel");
    newLabelInput.focus();

    newLabelInput.addEventListener("input", (e) => {
      newLabel = e.target.value;
    });
  } else {
    inputLabel.innerHTML = "";
    newLabel = "";
  }
});

// ========== SortableJS ==========
new Sortable(container, {
  swapThreshold: 1,
  animation: 250,
  draggable: ".col-lg-4:not(.fixed)",

  onEnd() {
    const items = container.querySelectorAll(".col-lg-4[id]");

    const newOrderIds = Array.from(items).map((item) => Number(item.id));

    tasks.sort((a, b) => {
      return newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id);
    });

    saveToLocalStorage("tasks", tasks);
  },
});
