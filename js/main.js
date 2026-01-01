const container = document.querySelector(".container .row");
const addBtn = document.getElementById("addBtn");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const taskCount = document.getElementById("taskCount");

const tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];

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
  viewTasks(tasks);
}

const notyf = new Notyf();

addBtn.addEventListener("click", () => {
  if (!noteTitle.value || !noteBody.value) {
    notyf.error("You must fill out all data moving forward");
    return;
  }

  const task = {
    id: Date.now(),
    title: noteTitle.value,
    body: noteBody.value,
    status: false,
  };

  tasks.push(task);
  window.localStorage.setItem("tasks", JSON.stringify(tasks));

  noteTitle.value = "";
  noteBody.value = "";

  viewTasks(tasks);
  calcProgress();
  notyf.success("Your note have been successfully added!");

  const modalEl = document.getElementById("exampleModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
});

function viewTasks(tasks) {
  let TasksHTML = "";
  const bgColors = ["#fcf3b3", "#d1ebec", "#fed4a8", "#ffdada"];

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
                <div class="options d-flex align-items-center justify-content-center gap-1 mt-2">
                  <input type="checkbox" onchange="changeStatus(${task.id})" ${
      task.status ? "checked" : ""
    } class="form-check-input mt-0 task-status" />

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
            data-bs-target="#exampleModal"
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
    viewTasks(tasks);
    calcProgress();

    notyf.success("Your note have been successfully deleted!");
  }
}

viewTasks(tasks);
calcProgress();
