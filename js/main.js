const container = document.querySelector(".container .row");
const addBtn = document.getElementById("addBtn");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");

const tasks = [];

addBtn.addEventListener("click", () => {
  if (!noteTitle.value || !noteBody.value) return;

  const task = {
    id: Date.now(),
    title: noteTitle.value,
    body: noteBody.value,
  };

  tasks.push(task);

  noteTitle.value = "";
  noteBody.value = "";

  viewTasks(tasks);

  const modalEl = document.getElementById("exampleModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
});

function viewTasks(tasks) {
  let TasksHTML = "";

  tasks.forEach((task) => {
    TasksHTML += `
      <div class="col-lg-4 col-sm-6 d-flex">
        <div class="task bg-red p-3 rounded-2 w-100">
          <h3>${task.title}</h3>
          <p>${task.body}</p>
          <button class="btn btn-sm btn-danger mt-2" onclick="deleteTask(${task.id})">Delete</button>
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
    viewTasks(tasks);
  }
}

viewTasks(tasks);
