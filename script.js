//Get items from DOM
const taskInput = document.getElementById('task-input');
const addTodoBtn = document.getElementById('add-todo');
const taskList = document.querySelector('.tasks-list');
const todoDisplay = document.querySelector('.todo-display');
const todoContent = document.querySelector('.todo-content');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const seeAll = document.getElementById('display-tasks');
const todoBtn = document.querySelector('.todo');
const doneBtn = document.querySelector('.done');
const progressBtn = document.querySelector('.progress');
const backBtn = document.getElementById('back-btn');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const todoTitleInput = document.getElementById('todo-title');
const updateTitleInput = document.getElementById('update-todo-title');
const todoDescInput = document.getElementById('todo-desc');
const updateDescInput = document.getElementById('update-todo-desc');
const update = document.getElementById('update-todo');
const task = document.querySelectorAll('.task');
const deleteTaskBtn = document.getElementById('delete-task');
const updateTaskBtn = document.getElementById('update-task');


// when see all is clicked show next page
seeAll.addEventListener('click', function() {
  document.querySelector('.first-page').classList.remove('active');
  document.querySelector('.second-page').classList.add('active');
});

// when back button is clicked show first page
backBtn.addEventListener('click', function() {
  document.querySelector('.second-page').classList.remove('active');
  document.querySelector('.first-page').classList.add('active');
});

//Show modal when open modal button is clicked
openModalBtn.addEventListener('click', function() {
  document.querySelector('.modal').classList.add('active1');
});

//Close modal when close button is clicked
closeModalBtn.addEventListener('click', function() {
  document.querySelector('.modal').classList.remove('active1');
});

//declaring todos array progress and done arrays
let allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let progress = JSON.parse(localStorage.getItem('progress')) || [];
let done = JSON.parse(localStorage.getItem('done')) || [];


// send todo items to local storage
function saveAllTasks() {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function saveProgress() {
  localStorage.setItem('progress', JSON.stringify(progress));
}

function saveDone() {
  localStorage.setItem('done', JSON.stringify(done));
}

// Add todo item 
addTodoBtn.addEventListener('click', function (e) {
  e.preventDefault();
  
  
  const title = todoTitleInput.value.trim();
  const desc = todoDescInput.value.trim();

  if (title && desc) {
    allTasks.push({ title, desc, status: 'Todo' });
    todos.push({ title, desc, status: 'Todo' });

    saveTodos();
    saveAllTasks();

    renderAllTasks();
    countTasks();

    todoTitleInput.value = '';
    todoDescInput.value = '';

    document.querySelector('.modal').classList.remove('active1');
  }
});

// Render todos function
function renderTodos() {
  todoContent.innerHTML = '';

  const sortedTodos = [...allTasks].reverse()
  sortedTodos.forEach(todo => {
    if(!todo.title || !todo.desc) return;
    const task = document.createElement('div');
    task.innerHTML = `
      <div class="task">
        <h3 class="task-title">${todo.title}</h3>
        <p class="task-desc">${todo.desc}</p>
      </div>
    `;
    
    todoContent.appendChild(task);
  });
}

// Initial rendering of all tasks on page load
function renderAllTasks() {
  taskList.innerHTML = '';
  todoDisplay.innerHTML = '';

  const sortedTasks = [...allTasks].reverse()
  sortedTasks.forEach(todo => {
    if(!todo.title || !todo.desc) return;
    const task = document.createElement('div');
    const todoItem = document.createElement('div');
    task.innerHTML = `
      <div class="task">
        <h3 class="task-title">${todo.title}</h3>
        <p class="task-desc">${todo.desc}</p>
      </div>
    `;
    todoItem.innerHTML = `
      <div class="task">
        <h3 class="task-title">${todo.title}</h3>
        <p class="task-desc">${todo.desc}</p>
      </div>
    `;
    taskList.appendChild(task);
    todoDisplay.appendChild(todoItem);
  });
}

//Find number of tasks
function countTasks() {
  let counter = allTasks.length;
  document.getElementById('total-tasks').innerText = counter;
}



//Make delete update popup when task is clicked
taskList.addEventListener('click', function(e) {
  if (e.target.closest('.task')) {
    const clickedTask = e.target.closest('.task');
    const title = clickedTask.querySelector('.task-title').innerText;
    const desc = clickedTask.querySelector('.task-desc').innerText;
    document.getElementById('task-task').innerText = title;
    document.getElementById('task-description').innerText = desc;
    document.querySelector('.task-modal').classList.add('active1');
  }
});

todoDisplay.addEventListener('click', function(e) {
  if (e.target.closest('.task')) {
    const clickedTask = e.target.closest('.task');
    const title = clickedTask.querySelector('.task-title').innerText;
    const desc = clickedTask.querySelector('.task-desc').innerText;
    document.getElementById('task-task').innerText = title;
    document.getElementById('task-description').innerText = desc;
    document.querySelector('.task-modal').classList.add('active1');
  }
});

//Delete the clicked task with delete button
deleteTaskBtn.addEventListener('click', function() {
  const titleToDelete = document.getElementById('task-task').innerText;
  allTasks = allTasks.filter(todo => todo.title !== titleToDelete);
  saveAllTasks();
  renderAllTasks();
  renderTodos();
  countTasks();
  document.querySelector('.task-modal').classList.remove('active1');
});

//Update the clicked task with update button
updateTaskBtn.addEventListener('click', function() {
  document.querySelector('.update-modal').classList.add('active1');
  document.querySelector('.task-modal').classList.remove('active1');
});

//Close update modal
document.getElementById('close-modal2').addEventListener('click', function() {
  document.querySelector('.update-modal').classList.remove('active1');
});

//Get input and description from update modal and update the task
update.addEventListener('click', function(e) {
  e.preventDefault()

  const title = updateTitleInput.value.trim();
  const desc = updateDescInput.value.trim();

  if (title && desc) {
    const currentTitle = document.getElementById('task-task').innerText;
    todos = todos.map(todo => {
      if (todo.title === currentTitle) {
        return { ...todo, title, desc };
      }
      return todo;
    });
    saveTodos();
    renderTodos();
    document.querySelector('.update-modal').classList.remove('active1');
  }

  updateTitleInput.value = '';
  updateDescInput.value = '';
});

//Give active class to todo when todo button is clicked
todoBtn.addEventListener('click', function() {
  document.querySelector('.todo-page').classList.add('active');
  document.querySelector('.first-page').classList.remove('active');
});

//Give active class to progress when progress button is clicked
progressBtn.addEventListener('click', function() {
  document.querySelector('.progress-page').classList.add('active');
  document.querySelector('.first-page').classList.remove('active');
});

//Give active class to done when done button is clicked
doneBtn.addEventListener('click', function() {
  document.querySelector('.done-page').classList.add('active');
  document.querySelector('.first-page').classList.remove('active');
});

// Make back buttons work for status pages
document.getElementById('todo-back-btn').addEventListener('click', function() {
  document.querySelector('.todo-page').classList.remove('active');
  document.querySelector('.first-page').classList.add('active');
});

document.getElementById('progress-back-btn').addEventListener('click', function() {
  document.querySelector('.progress-page').classList.remove('active');
  document.querySelector('.first-page').classList.add('active');
});

document.getElementById('done-back-btn').addEventListener('click', function() {
  document.querySelector('.done-page').classList.remove('active');
  document.querySelector('.first-page').classList.add('active');
});

// Search functionality
const searchInput = document.getElementById('task-search');
searchInput.addEventListener('input', function() {
  const query = searchInput.value.toLowerCase();
  const tasks = document.querySelectorAll('.task');
  tasks.forEach(task => {
    const title = task.querySelector('.task-title').innerText.toLowerCase();
    const desc = task.querySelector('.task-desc').innerText.toLowerCase();
    if (title.includes(query) || desc.includes(query)) {
      task.style.display = '';
    } else {
      task.style.display = 'none';
    }
  });
});

//Render todos on page load
renderAllTasks()
renderTodos()
countTasks();