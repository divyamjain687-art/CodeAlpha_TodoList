/* ==========================================
   NeoTask
   Modern Todo List
   Part 1
========================================== */

const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save Tasks

function saveTasks(){

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// Render Tasks

function renderTasks(filter="all"){

    taskList.innerHTML="";

    const searchText=document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    let filtered=tasks.filter(task=>{

        const matches=task.text
        .toLowerCase()
        .includes(searchText);

        if(filter==="active")
            return !task.completed && matches;

        if(filter==="completed")
            return task.completed && matches;

        return matches;

    });

    if(filtered.length===0){

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

    filtered.forEach(task=>{

        const index=tasks.indexOf(task);

        const li=document.createElement("li");

        li.className=task.completed
        ? "task completed"
        : "task";

        li.innerHTML=`

        <div class="left">

            <input
            type="checkbox"
            ${task.completed ? "checked" : ""}
            onchange="toggleTask(${index})">

            <span class="task-name">

                ${task.text}

            </span>

            <span class="priority ${task.priority.toLowerCase()}">

                ${task.priority}

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

// Add Task

function addTask(){

    const text=taskInput.value.trim();

    if(text===""){

        showToast("Please enter a task!");

        return;

    }

    tasks.push({

        text:text,

        priority:prioritySelect.value,

        completed:false

    });

    taskInput.value="";

    prioritySelect.value="Medium";

    saveTasks();

    renderTasks();

    showToast("Task Added");

}

// Delete Task

function deleteTask(index){

    tasks.splice(index,1);

    saveTasks();

    renderTasks();

    showToast("Task Deleted");

}

// Edit Task

function editTask(index){

    const updated=prompt(

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

// Complete Task

function toggleTask(index){

    tasks[index].completed=
    !tasks[index].completed;

    saveTasks();

    renderTasks();

}

// Events

addTaskBtn.addEventListener(

    "click",

    addTask

);

taskInput.addEventListener(

    "keypress",

    function(e){

        if(e.key==="Enter"){

            addTask();

        }

    }

);
/* ==========================================
   Part 2 : Search • Filters • Progress
========================================== */

// Search Input
const searchInput = document.getElementById("searchInput");

// Filter Buttons
const filterButtons = document.querySelectorAll(".filter");

// Current Filter
let currentFilter = "all";

// ===============================
// Search
// ===============================

searchInput.addEventListener("input", () => {

    renderTasks(currentFilter);

});

// ===============================
// Filters
// ===============================

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks(currentFilter);

    });

});

// ===============================
// Progress Ring
// ===============================

function updateProgress(){

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const remaining = total - completed;

    document.getElementById("progressText").textContent =
        `${completed} / ${total} Completed`;

    document.getElementById("totalTasks").textContent =
        `Total : ${total}`;

    document.getElementById("remainingTasks").textContent =
        `Remaining : ${remaining}`;

    const percent =
        total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressPercent").textContent =
        `${percent}%`;

    const circle =
        document.querySelector(".progress-circle");

    circle.style.background = `conic-gradient(
        #6366F1 ${percent * 3.6}deg,
        #E5E7EB 0deg
    )`;

}

// ===============================
// Toast Notification
// ===============================

function showToast(message){

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },2500);

}

// ===============================
// Initial Render
// ===============================

renderTasks();
/* ==========================================
   Part 3 : Theme • Keyboard • Final Setup
========================================== */

// ===============================
// Dark Mode
// ===============================

const themeBtn = document.getElementById("themeBtn");

// Load saved theme
if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

    themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

}

// Toggle Theme

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

        showToast("Dark Mode Enabled");

    }

    else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

        showToast("Light Mode Enabled");

    }

});

// ===============================
// Keyboard Shortcut
// Ctrl + / Focus Input
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="/"){

        e.preventDefault();

        taskInput.focus();

    }

});

// ===============================
// Auto Focus
// ===============================

window.addEventListener("load",()=>{

    taskInput.focus();

    renderTasks(currentFilter);

});

// ===============================
// Clear Input After Add
// ===============================

taskInput.addEventListener("input",()=>{

    taskInput.style.border="none";

});

// ===============================
// Prevent Empty Spaces
// ===============================

taskInput.addEventListener("blur",()=>{

    taskInput.value=taskInput.value.trim();

});

// ===============================
// Save Before Closing
// ===============================

window.addEventListener("beforeunload",()=>{

    saveTasks();

});

// ===============================
// Console Message
// ===============================

console.log("%cNeoTask Loaded Successfully 🚀",
"color:#6366F1;font-size:16px;font-weight:bold;");

// ===============================
// First Render
// ===============================

renderTasks(currentFilter);
