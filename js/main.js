const container = document.querySelector(".container .row");
const addBtn = document.getElementById("addBtn");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");

const tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];

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
  };

  tasks.push(task);
  window.localStorage.setItem("tasks", JSON.stringify(tasks));

  noteTitle.value = "";
  noteBody.value = "";

  viewTasks(tasks);
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
            <div class="task p-3 rounded-2 w-100" style="background-color: ${
              bgColors[index % bgColors.length]
            }">
              <h3>${task.title}</h3>
              <p>${task.body}</p>
              <button class="noteDeleteBtn btn btn-sm mt-2" onclick="deleteTask(${
                task.id
              })">
                <i class="fa-solid fa-x"></i>
              </button>
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
    notyf.success("Your note have been successfully deleted!");
  }
}

viewTasks(tasks);
