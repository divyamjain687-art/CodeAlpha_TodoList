/* ==========================================
   NeoTask - Modern Todo List
   Part 1 : CRUD + Local Storage
========================================== */

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===============================
// Save Tasks
// ===============================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// ===============================
// Render Tasks
// ===============================

function renderTasks(filter = "all") {

    taskList.innerHTML = "";

    const searchValue = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.text.toLowerCase().includes(searchValue);

        if (filter === "active")
            return !task.completed && matchesSearch;

        if (filter === "completed")
            return task.completed && matchesSearch;

        return matchesSearch;

    });

    if(filteredTasks.length===0){

        taskList.innerHTML=`

        <div class="empty">

            <i class="fa-solid fa-list-check"></i>

            <h3>No Tasks Found</h3>

            <p>Add your first task 🚀</p>

        </div>

        `;

        updateProgress();

        return;

    }

    filteredTasks.forEach(task => {

        const index = tasks.indexOf(task);

        const li = document.createElement("li");

        li.className = task.completed
            ? "task completed"
            : "task";

        li.innerHTML = `

        <div class="left">

            <input
            type="checkbox"
            ${task.completed ? "checked" : ""}
            onchange="toggleTask(${index})">

            <span class="task-name">

                ${task.text}

            </span>

        </div>

        <div class="actions">

            <button
            class="edit"
            onclick="editTask(${index})">

                <i class="fa-solid fa-pen"></i>

            </button>

            <button
            class="delete"
            onclick="deleteTask(${index})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

        taskList.appendChild(li);

    });

    updateProgress();

}

// ===============================
// Add Task
// ===============================

function addTask(){

    const text = taskInput.value.trim();

    if(text===""){

        showToast("Please enter a task!");

        return;

    }

    tasks.push({

        text:text,

        completed:false

    });

    taskInput.value="";

    saveTasks();

    renderTasks();

    showToast("Task Added");

}

// ===============================
// Delete Task
// ===============================

function deleteTask(index){

    tasks.splice(index,1);

    saveTasks();

    renderTasks();

    showToast("Task Deleted");

}

// ===============================
// Edit Task
// ===============================

function editTask(index){

    const updated = prompt(

        "Edit Task",

        tasks[index].text

    );

    if(updated!==null && updated.trim()!==""){

        tasks[index].text=updated.trim();

        saveTasks();

        renderTasks();

        showToast("Task Updated");

    }

}

// ===============================
// Complete Task
// ===============================

function toggleTask(index){

    tasks[index].completed=!tasks[index].completed;

    saveTasks();

    renderTasks();

}

// ===============================
// Add Button
// ===============================

addTaskBtn.addEventListener(

    "click",

    addTask

);

// ===============================
// Enter Key
// ===============================

taskInput.addEventListener(

    "keypress",

    function(e){

        if(e.key==="Enter"){

            addTask();

        }

    }

);
/* ==========================================
   Part 2 : Search + Filters + Progress
========================================== */

// ===============================
// Search
// ===============================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

    const activeFilter = document.querySelector(".filter.active");

    renderTasks(activeFilter.dataset.filter);

});

// ===============================
// Filter Buttons
// ===============================

const filterButtons = document.querySelectorAll(".filter");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        renderTasks(button.dataset.filter);

    });

});

// ===============================
// Progress & Counters
// ===============================

function updateProgress(){

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const remaining = total - completed;

    document.getElementById("totalTasks").innerHTML =
        `Total : ${total}`;

    document.getElementById("remainingTasks").innerHTML =
        `Remaining : ${remaining}`;

    document.getElementById("progressText").innerHTML =
        `${completed} / ${total} Completed`;

    const percent =
        total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressPercent").innerHTML =
        `${percent}%`;

    document.querySelector(".progress-circle").style.background =
        `conic-gradient(
            #6366F1 ${percent * 3.6}deg,
            #E5E7EB 0deg
        )`;

}

// ===============================
// Toast Notification
// ===============================

function showToast(message){

    const toast = document.getElementById("toast");

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },2500);

}

// ===============================
// First Load
// ===============================

renderTasks();
/* ==========================================
   Part 3 : Theme + Date + Greeting
========================================== */

// ===============================
// Theme Toggle
// ===============================

const themeBtn = document.getElementById("themeBtn");

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

    themeBtn.innerHTML=
    '<i class="fa-solid fa-sun"></i>';

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML=
        '<i class="fa-solid fa-sun"></i>';

    }

    else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML=
        '<i class="fa-solid fa-moon"></i>';

    }

});

// ===============================
// Greeting
// ===============================

const hour=new Date().getHours();

let greeting="Hello";

if(hour<12){

    greeting="Good Morning";

}

else if(hour<17){

    greeting="Good Afternoon";

}

else{

    greeting="Good Evening";

}

document.getElementById("greeting").innerHTML =
`${greeting} 👋`;


// ===============================
// Auto Focus
// ===============================

window.onload=()=>{

    taskInput.focus();

};

// ===============================
// Initial Render
// ===============================

renderTasks();
