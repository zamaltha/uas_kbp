let studyTime = 25;         // Default waktu belajar (menit)
let breakTime = 5;          // Default waktu istirahat (menit)
let timer;                  // Variabel untuk menyimpan interval timer
let remainingTime;          // Waktu tersisa dalam detik
let isStudyTime = true;     // Apakah saat ini waktu belajar
let isRunning = false;      // Status apakah timer sedang berjalan

const statusLabel = document.getElementById("status");
const timerLabel = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const studyTimeInput = document.getElementById("studyTime");
const breakTimeInput = document.getElementById("breakTime");
const alarmSound = document.getElementById("alarmSound");

// Fungsi untuk memperbarui tampilan timer
function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerLabel.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Fungsi untuk memulai atau melanjutkan timer
function startTimer() {
    if (isRunning) return;  // Jika sudah berjalan, jangan mulai lagi

    isRunning = true;
    timer = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();

        // Ketika waktu habis
        if (remainingTime <= 0) {
            clearInterval(timer);
            isRunning = false;
        
            // Putar suara alarm
            alarmSound.play();
        
            // Atur ulang waktu berdasarkan apakah belajar atau istirahat
            if (isStudyTime) {
                statusLabel.textContent = "Waktu Istirahat";
                remainingTime = breakTime * 60; // Set waktu istirahat
            } else {
                statusLabel.textContent = "Waktu Belajar";
                remainingTime = studyTime * 60; // Set waktu belajar
            }
        
            isStudyTime = !isStudyTime; // Toggle waktu belajar/istirahat
           
            alarmSound.volume = 0.5; // Volume 50%
        }       
    }, 1000);
}

// Fungsi untuk menghentikan sementara timer
function stopTimer() {
    if (!isRunning) return; // Jika tidak berjalan, tidak perlu dihentikan

    clearInterval(timer);
    isRunning = false;
}

// Fungsi untuk mereset timer
function resetTimer() {
    stopTimer(); // Hentikan timer jika berjalan
    studyTime = parseInt(studyTimeInput.value) || 25; // Ambil waktu belajar dari input
    breakTime = parseInt(breakTimeInput.value) || 5;  // Ambil waktu istirahat dari input

    remainingTime = studyTime * 60; // Atur waktu belajar sebagai default
    isStudyTime = true; // Reset ke waktu belajar
    isRunning = false;

    statusLabel.textContent = "Waktu Belajar"; // Reset status label
    updateTimerDisplay(); // Perbarui tampilan
}

// Event listener untuk tombol
startBtn.addEventListener("click", () => {
    studyTime = parseInt(studyTimeInput.value) || 25;
    breakTime = parseInt(breakTimeInput.value) || 5;

    if (remainingTime == null) {
        remainingTime = studyTime * 60; // Jika belum disetel, mulai dengan waktu belajar
    }

    startTimer();
});

stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);

//
// To Do List 
//
// Ambil elemen DOM
const addBttn = document.getElementById("addBttn");
const todoInput = document.getElementById("todo");
const todoList = document.getElementById("todo-list");

// Fungsi untuk menambahkan task ke daftar
function addTask() {
    const taskText = todoInput.value.trim(); // Ambil input dan hilangkan spasi di awal/akhir
    if (taskText === "") {
        alert("Task tidak boleh kosong!");
        return;
    }

    // Buat elemen list baru
    const listItem = document.createElement("li");
    listItem.className = "todo-item";

    // Tambahkan teks task ke elemen
    const taskLabel = document.createElement("span");
    taskLabel.textContent = taskText;
    taskLabel.className = "task-label";

    // Tombol untuk menandai selesai
    const doneButton = document.createElement("button");
    doneButton.textContent = "Done";
    doneButton.className = "done-btn";
    doneButton.addEventListener("click", () => {
        taskLabel.classList.toggle("completed"); // Tandai selesai
        saveTasksToLocalStorage();
    });

    // Tombol untuk menghapus task
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => {
        todoList.removeChild(listItem); // Hapus task dari daftar
        saveTasksToLocalStorage();
    });

    // Tambahkan elemen ke dalam list item
    listItem.appendChild(taskLabel);
    listItem.appendChild(doneButton);
    listItem.appendChild(deleteButton);

    // Tambahkan list item ke dalam ul
    todoList.appendChild(listItem);
    saveTasksToLocalStorage();

    // Bersihkan input
    todoInput.value = "";
}

// Event listener untuk tombol Add Task
addBttn.addEventListener("click", addTask);

// Event listener untuk menambahkan task dengan tombol Enter
todoInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Local Storage agar tidak hilang ketika di refresh
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll(".todo-item").forEach(item => {
        const taskText = item.querySelector(".task-label").textContent;
        const isCompleted = item.querySelector(".task-label").classList.contains("completed");
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
    savedTasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.className = "todo-item";

        const taskLabel = document.createElement("span");
        taskLabel.textContent = task.text;
        taskLabel.className = "task-label";
        if (task.completed) {
            taskLabel.classList.add("completed");
        }

        const doneButton = document.createElement("button");
        doneButton.textContent = "Done";
        doneButton.className = "done-btn";
        doneButton.addEventListener("click", () => {
            taskLabel.classList.toggle("completed");
            saveTasksToLocalStorage();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => {
            todoList.removeChild(listItem);
            saveTasksToLocalStorage();
        });

        listItem.appendChild(taskLabel);
        listItem.appendChild(doneButton);
        listItem.appendChild(deleteButton);

        todoList.appendChild(listItem);
    });
}

window.addEventListener("load", loadTasksFromLocalStorage);
