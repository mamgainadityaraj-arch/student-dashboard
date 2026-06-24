// ===== STORAGE =====

let homeworks = JSON.parse(localStorage.getItem("homeworks")) || [];
let exams = JSON.parse(localStorage.getItem("exams")) || [];
let marks = JSON.parse(localStorage.getItem("marks")) || [];
let goals = JSON.parse(localStorage.getItem("goals")) || [];

// ===== NOTIFICATION =====

function showNotification(message) {
    const notification = document.getElementById("notification");

    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

// ===== HOMEWORK =====

function addHomework() {

    const title = document.getElementById("homeworkTitle").value;
    const subject = document.getElementById("homeworkSubject").value;
    const date = document.getElementById("homeworkDate").value;
    const status = document.getElementById("homeworkStatus").value;

    if (!title || !subject || !date) {
        alert("Fill all homework fields");
        return;
    }

    homeworks.push({
        title,
        subject,
        date,
        status
    });

    localStorage.setItem("homeworks", JSON.stringify(homeworks));

    document.getElementById("homeworkTitle").value = "";
    document.getElementById("homeworkSubject").value = "";
    document.getElementById("homeworkDate").value = "";

    renderHomework();

    showNotification("Homework Added ✅");
}

function renderHomework() {

    const container = document.getElementById("homeworkList");

    container.innerHTML = "";

    homeworks.forEach((hw, index) => {

        container.innerHTML += `
        <div class="homework-item">
            <h4>${hw.title}</h4>
            <p>📚 ${hw.subject}</p>
            <p>📅 ${hw.date}</p>
            <p>📌 ${hw.status}</p>

            <button onclick="deleteHomework(${index})">
                Delete
            </button>
        </div>
        `;
    });

    updateStats();
}

function deleteHomework(index) {
    homeworks.splice(index, 1);

    localStorage.setItem("homeworks", JSON.stringify(homeworks));

    renderHomework();
}

// ===== EXAMS =====

function addExam() {

    const name = document.getElementById("examName").value;
    const date = document.getElementById("examDate").value;

    if (!name || !date) {
        alert("Fill all exam fields");
        return;
    }

    exams.push({
        name,
        date
    });

    localStorage.setItem("exams", JSON.stringify(exams));

    document.getElementById("examName").value = "";
    document.getElementById("examDate").value = "";

    renderExams();

    showNotification("Exam Added 📅");
}

function renderExams() {

    const container = document.getElementById("examList");

    container.innerHTML = "";

    exams.forEach((exam, index) => {

        const today = new Date();
        const examDate = new Date(exam.date);

        const diff =
            Math.ceil(
                (examDate - today) /
                (1000 * 60 * 60 * 24)
            );

        container.innerHTML += `
        <div class="exam-item">
            <h4>${exam.name}</h4>
            <p>${diff} day(s) left</p>

            <button onclick="deleteExam(${index})">
                Delete
            </button>
        </div>
        `;
    });

    updateStats();
}

function deleteExam(index) {

    exams.splice(index, 1);

    localStorage.setItem("exams", JSON.stringify(exams));

    renderExams();
}

// ===== MARKS =====

function addMarks() {

    const subject =
        document.getElementById("subjectName").value;

    const obtained =
        Number(document.getElementById("marksObtained").value);

    const total =
        Number(document.getElementById("totalMarks").value);

    if (!subject || !obtained || !total) {
        alert("Fill all mark fields");
        return;
    }

    marks.push({
        subject,
        obtained,
        total
    });

    localStorage.setItem("marks", JSON.stringify(marks));

    document.getElementById("subjectName").value = "";
    document.getElementById("marksObtained").value = "";
    document.getElementById("totalMarks").value = "";

    renderMarks();

    showNotification("Marks Added 📊");
}

function renderMarks() {

    const container =
        document.getElementById("marksList");

    container.innerHTML = "";

    let totalPercent = 0;

    marks.forEach((mark, index) => {

        const percentage =
            ((mark.obtained / mark.total) * 100)
            .toFixed(1);

        totalPercent += Number(percentage);

        container.innerHTML += `
        <div class="mark-item">

            <h4>${mark.subject}</h4>

            <p>
            ${mark.obtained}/${mark.total}
            (${percentage}%)
            </p>

            <div class="progress-container">
                <div class="progress-bar"
                     style="width:${percentage}%">
                </div>
            </div>

            <button onclick="deleteMark(${index})">
                Delete
            </button>

        </div>
        `;
    });

    let average = 0;

    if (marks.length > 0) {
        average =
            (totalPercent / marks.length)
            .toFixed(1);
    }

    document.getElementById(
        "averagePercentage"
    ).textContent = average + "%";

    updateStats();
}

function deleteMark(index) {

    marks.splice(index, 1);

    localStorage.setItem("marks", JSON.stringify(marks));

    renderMarks();
}

// ===== GOALS =====

function addGoal() {

    const text =
        document.getElementById("goalInput").value;

    if (!text) return;

    goals.push({
        text,
        completed: false
    });

    localStorage.setItem("goals", JSON.stringify(goals));

    document.getElementById("goalInput").value = "";

    renderGoals();

    showNotification("Goal Added 🎯");
}

function renderGoals() {

    const container =
        document.getElementById("goalList");

    container.innerHTML = "";

    goals.forEach((goal, index) => {

        container.innerHTML += `
        <div class="goal-item ${goal.completed ? "completed" : ""}">

            <h4>${goal.text}</h4>

            <button onclick="toggleGoal(${index})">
                ${goal.completed ? "Undo" : "Done"}
            </button>

            <button onclick="deleteGoal(${index})">
                Delete
            </button>

        </div>
        `;
    });
}

function toggleGoal(index) {

    goals[index].completed =
        !goals[index].completed;

    localStorage.setItem("goals", JSON.stringify(goals));

    renderGoals();

    showNotification("Goal Updated ✅");
}

function deleteGoal(index) {

    goals.splice(index, 1);

    localStorage.setItem("goals", JSON.stringify(goals));

    renderGoals();
}

// ===== STUDY STREAK =====

let streak =
    Number(localStorage.getItem("streak")) || 0;

let bestStreak =
    Number(localStorage.getItem("bestStreak")) || 0;

let lastStudy =
    localStorage.getItem("lastStudy") || "";

function updateStreakUI() {

    document.getElementById(
        "currentStreak"
    ).textContent = streak;

    document.getElementById(
        "bestStreak"
    ).textContent = bestStreak;

    document.getElementById(
        "streakDisplay"
    ).textContent = streak + " Days";
}

document.getElementById("studyBtn")
.addEventListener("click", () => {

    const today =
        new Date().toDateString();

    if (lastStudy === today) {

        alert("Already studied today 😎");
        return;
    }

    streak++;

    if (streak > bestStreak) {
        bestStreak = streak;
    }

    lastStudy = today;

    localStorage.setItem("streak", streak);
    localStorage.setItem("bestStreak", bestStreak);
    localStorage.setItem("lastStudy", lastStudy);

    updateStreakUI();

    showNotification("Study Streak Increased 🔥");
});

// ===== DARK MODE =====

const darkBtn =
    document.getElementById("darkModeBtn");

if (localStorage.getItem("darkMode") === "on") {
    document.body.classList.add("dark");
}

darkBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (
        document.body.classList.contains("dark")
    ) {
        localStorage.setItem("darkMode", "on");
    } else {
        localStorage.setItem("darkMode", "off");
    }
});

// ===== STATS =====

function updateStats() {

    const pending =
        homeworks.filter(
            hw => hw.status !== "Done"
        ).length;

    const completed =
        homeworks.filter(
            hw => hw.status === "Done"
        ).length;

    document.getElementById(
        "pendingCount"
    ).textContent = pending;

    document.getElementById(
        "completedCount"
    ).textContent = completed;

    document.getElementById(
        "examCount"
    ).textContent = exams.length;
}

// ===== LOAD DATA =====

renderHomework();
renderExams();
renderMarks();
renderGoals();
updateStreakUI();
updateStats();
