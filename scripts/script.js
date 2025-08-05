

const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const totalTaskElement = document.getElementById('total-tasks');
const completedTask = document.getElementById('completed-tasks');
const pendingTask = document.getElementById('pending-tasks');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = [];
let taskIdCounter = 1;
let currentFilter = 'all';

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

taskInput.addEventListener('input', () => {
  addBtn.disabled = taskInput.value.trim() === '';
});

filterButtons.forEach((btn) => {
  btn.addEventListener('click', function () {
    filterButtons.forEach((b) => b.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.dataset.filter;
    renderTask();
  });
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const task = {
    id: taskIdCounter++,
    text: taskText,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(task);
  taskInput.value = '';
  addBtn.disabled = true;
  renderTask();
}

function toggleTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderTask();
  }
}

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks = tasks.filter((t) => t.id !== taskId);
    renderTask();
  }
}

function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    const newText = prompt('Edit your task:', task.text);
    if (newText !== null && newText.trim() !== '') {
      task.text = newText.trim();
      renderTask();
    }
  }
}

function renderTask() {
  taskList.innerHTML = '';
  let filteredTasks = tasks;

  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter((t) => t.completed);
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter((t) => !t.completed);
  }

  if (filteredTasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    filteredTasks.forEach((task) => {
      taskList.appendChild(createTaskElement(task));
    });
  }

  updateTaskCounts();
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const span = document.createElement('span');
  span.textContent = task.text;
  span.className = 'task-text';
  span.addEventListener('dblclick', () => editTask(task.id));

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'btn edit-btn';
  editBtn.addEventListener('click', () => editTask(task.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'btn delete-btn';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  const contentDiv = document.createElement('div');
  contentDiv.className = 'task-content';
  contentDiv.appendChild(checkbox);
  contentDiv.appendChild(span);
  contentDiv.appendChild(editBtn);
  contentDiv.appendChild(deleteBtn);

  li.appendChild(contentDiv);
  return li;
}

function updateTaskCounts() {
  totalTaskElement.textContent = tasks.length;
  completedTask.textContent = tasks.filter((t) => t.completed).length;
  pendingTask.textContent = tasks.filter((t) => !t.completed).length;
}

function init() {
  addBtn.disabled = true;
  renderTask();
}

init();
