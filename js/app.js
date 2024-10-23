const taskInput = document.querySelector(".input-todo");
const addBtn = document.querySelector(".add-btn");
const editeBtn = document.querySelector(".edite-btn");
const tasksList = document.querySelector(".todos-list");
const filterBtns = document.querySelectorAll(".filter-todos__buttons button");
const titleApp = document.querySelector(".filter-todos__show");
const alertMsg = document.querySelector(".box-message");

import { changeDocumentThem } from "./theme.js";

let filterStatus = "all";
let todos = getTodos();

function addTodo() {
  const value = taskInput.value;

  if (!value) {
    alertShow("Enter a title", "delete");
    return;
  }

  const todo = {
    id: new Date().getTime(),
    title: value,
    isCompleted: false,
  };

  todos.push(todo);
  saveTodos();
  filterTodos();
  alertShow("New todo added", "add");
  taskInput.value = "";
}

function createDom(newTodos) {
  tasksList.innerHTML = "";

  newTodos.forEach((todo) => {
    tasksList.innerHTML += showTodoList(todo);
  });

  document.querySelectorAll(".delete-todo").forEach((btn) => {
    btn.addEventListener("click", deleteTodo);
  });

  document.querySelectorAll(".complete-todo").forEach((btn) => {
    btn.addEventListener("change", completeTodo);
  });

  document.querySelectorAll(".edite-todo").forEach((btn) => {
    btn.addEventListener("click", editeTodo);
  });
}

function showTodoList(todo) {
  const maxLength = 10;
  const { id, title, isCompleted } = todo;
  return `<li class="todo-item">
            <div>
              <input type="checkbox" class="complete-todo" ${
                isCompleted ? "checked" : ""
              } class="complete-todo" data-id=${id} />
              <p class="todo-title ${isCompleted ? "completed" : ""}">
              ${title.length > maxLength ? title.slice(0, maxLength) : title}
              ${title.length > maxLength ? "..." : ""}
              </p>
            </div>
            <div class="todo-buttons">
              <button class="edite-todo" data-id=${id}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
              <button class="delete-todo" data-id=${id}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </li>`;
}

function deleteTodo(e) {
  const id = +e.target.dataset.id;
  todos = todos.filter((todo) => +todo.id !== id);
  saveTodos();
  filterTodos();
  alertShow("Todo deleted", "delete");
}

function completeTodo(e) {
  const id = +e.target.dataset.id;
  const checkedComplete = e.target.checked;
  const todo = todos.find((todo) => +todo.id === id);
  todo.isCompleted = checkedComplete;
  saveTodos();
  filterTodos();
  alertShow(
    `Todo changed to ${
      todo.isCompleted ? "complete state" : "uncomplete state"
    }`,
    "add",
    "add"
  );
}

function editeTodo(e) {
  const id = +e.target.dataset.id;
  const todo = todos.find((todo) => +todo.id === id);
  taskInput.value = todo.title;
  addBtn.style.display = "none";
  editeBtn.style.display = "block";
  editeBtn.dataset.id = id;
}

function applyEditTodo(e) {
  const id = +e.target.dataset.id;
  const todo = todos.find((todo) => +todo.id === id);
  todo.title = taskInput.value;
  saveTodos();
  filterTodos();
  alertShow("todo changed", "add");

  addBtn.style.display = "block";
  editeBtn.style.display = "none";
  taskInput.value = "";
}

function filterTodos() {
  let newTodos;

  switch (filterStatus) {
    case "all":
      createDom(todos);
      changeDom();
      break;
    case "complete":
      newTodos = todos.filter((todo) => todo.isCompleted);
      changeDom(newTodos.length);
      createDom(newTodos);
      break;
    case "uncomplete":
      newTodos = todos.filter((todo) => !todo.isCompleted);
      changeDom(newTodos.length);
      createDom(newTodos);
      break;
  }
}

function changeDom(count) {
  count = count ?? todos.length;
  titleApp.textContent = `${count}/${todos.length}`;
}

function filterBtnsCheck(e) {
  filterBtns.forEach((btn) => btn.classList.remove("focus"));
  e.target.classList.add("focus");
}

function alertShow(msg, className) {
  alertMsg.innerHTML = "";
  alertMsg.innerHTML = ` <pre class="alert">${msg}      ${
    className === "add" ? "✅" : "🔺"
  }</pre>`;
  alertMsg.style.opacity = "1";

  setTimeout(() => {
    alertMsg.style.opacity = "0";
  }, 3000);
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

window.addEventListener("DOMContentLoaded", () => {
  addBtn.addEventListener("click", addTodo);
  editeBtn.addEventListener("click", applyEditTodo);

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterStatus = e.target.dataset.id;
      filterBtnsCheck(e);
      filterTodos();
    });
  });

  filterTodos();
  changeDocumentThem();
});
