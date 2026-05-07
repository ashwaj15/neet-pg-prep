
// ================= DATA =================
let data = {};

fetch("data.json")
    .then(res => res.json())
    .then(json => {
        data = json;
        loadSubjects();
    })
    .catch(err => {
        console.error("JSON error:", err);
    });

fetch("medicine.json")
    .then(res => res.json())
    .then(json => {
        medicineData = json;
    })
    .catch(err => {
        console.error("Medicine JSON error:", err);
    });







// ================= GLOBAL =================
let historyStack = [];
let currentSubject = "";
let medicineData = {};
let medicineStack = [];

// ================= PAGE CONTROL =================
function showPage(pageId, isBack = false) {
    const currentPage = document.querySelector(".page.active");

    // ONLY push when NOT going back
    if (!isBack && currentPage && currentPage.id !== pageId) {
        historyStack.push(currentPage.id);
    }

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
        p.style.display = "none";
    });

    const page = document.getElementById(pageId);
    page.style.display = "block";
    page.classList.add("active");

    const homeBtn = document.getElementById("homeBtn");
    const backBtn = document.getElementById("backBtn");

    if (pageId === "home") {
        homeBtn.style.display = "none";
        backBtn.style.display = "none";
        historyStack = [];
    } else {
        homeBtn.style.display = "flex";
        backBtn.style.display = "flex";
    }

    window.scrollTo(0, 0);
}

function goBack() {

    // ===== MEDICINE FLOW =====
    if (currentSubject === "Medicine") {

        if (medicineStack.length > 0) {

            let previous = medicineStack.pop();

            previous();

            return;
        }

        currentSubject = "";

        showPage("subjects", true);

        return;
    }

    // ===== NORMAL SUBJECTS =====
    if (historyStack.length > 0) {

        const prev = historyStack.pop();

        showPage(prev, true);

    } else {

        showPage("home", true);
    }
}



// ================= START =================
function startLearning() {
    loadSubjects();
    showPage("subjects");
}

// ================= LOAD SUBJECTS =================
function loadSubjects() {
    let container = document.getElementById("subjectsList");
    if (!container) return;

    container.innerHTML = "";

    Object.keys(data).forEach(sub => {
        let div = document.createElement("div");
        div.className = "subject-card";
        div.innerText = sub;

        div.onclick = () => {

    currentSubject = sub;

    localStorage.setItem("lastSubject", sub);

    document.getElementById("subjectTitle").innerText = sub;

    // MEDICINE SPECIAL FLOW
    if (sub === "Medicine") {

    medicineStack = [];

    showMedicineTypes();

} else {

        showPage("options");

    }
};

        container.appendChild(div);
    });
}

// ================= SEARCH =================
function searchSubjects() {
    let input = document.getElementById("search").value.toLowerCase();
    let container = document.getElementById("subjectsList");

    container.innerHTML = "";

    Object.keys(data).forEach(sub => {
        if (sub.toLowerCase().includes(input)) {
            let div = document.createElement("div");
            div.className = "subject-card";
            div.innerText = sub;

            div.onclick = () => {
                currentSubject = sub;
                showPage("options");
            };

            container.appendChild(div);
        }
    });
}

// ================= CHAPTERS =================
function showChapters(type) {
    let chapterData = data[currentSubject][type];

    let list = document.getElementById("chapterList");
    list.innerHTML = "";

    Object.keys(chapterData).forEach(chapter => {
        let li = document.createElement("li");

        li.innerHTML = `
            <button onclick="openQuestions('${type}', '${chapter}')">
                ${chapter}
            </button>
        `;

        list.appendChild(li);
    });

    document.getElementById("chapterTitle").innerText =
        currentSubject + " - " + type;

    showPage("chapters");
}



function showMedicineTypes() {


    let list = document.getElementById("chapterList");

    list.innerHTML = "";

    Object.keys(medicineData["Medicine"]).forEach(type => {

        let li = document.createElement("li");

        li.innerHTML = `
            <button onclick="showMedicineSystems('${type}')">
                ${type}
            </button>
        `;

        list.appendChild(li);

    });

    document.getElementById("chapterTitle").innerText =
        "Medicine";

    showPage("chapters", true);
}

// ================= QUESTIONS =================
function openQuestions(type, chapter) {
    let dataSet = data[currentSubject][type][chapter];

    let container = document.getElementById("questionList");
    container.innerHTML = "";

    dataSet.forEach((item, index) => {
        let div = document.createElement("div");
        div.className = "question-box";

        // PYQs → show question + answer
        if (type === "PYQs") {
            div.innerHTML = `
                <p><strong>Q${index + 1}. ${item.question}</strong></p>
                <button onclick="toggleAnswer(this)">Show Answer</button>
                <p class="answer" style="display:none;">${item.answer}</p>
            `;
        }

        // PYTs → show topic only
   if (type === "PYTs") {
    let text = "";
    let stars = "";

    if (typeof item === "string") {
        text = item;
    } else {
        text = item.topic;

        // create stars dynamically
        if (item.rating) {
            stars = "⭐".repeat(item.rating);
        }
    }

    div.innerHTML = `
        <p>
            <strong>${index + 1}. ${text}</strong>
            <span class="stars">${stars}</span>
        </p>
    `;
}

        container.appendChild(div);
    });

    document.getElementById("questionTitle").innerText =
        chapter + " - " + type;

    showPage("questions");
}

function toggleAnswer(btn) {
    let ans = btn.nextElementSibling;

    if (ans.style.display === "none") {
        ans.style.display = "block";
        btn.innerText = "Hide Answer";
    } else {
        ans.style.display = "none";
        btn.innerText = "Show Answer";
    }
}


function showMedicineSystems(type) {

    medicineStack.push(() => showMedicineTypes());

    let systemData = medicineData["Medicine"][type];

    let list = document.getElementById("chapterList");

    list.innerHTML = "";

    Object.keys(systemData).forEach(system => {

        let li = document.createElement("li");

        li.innerHTML = `
            <button onclick="showMedicineChapters('${type}', '${system}')">
                ${system}
            </button>
        `;

        list.appendChild(li);

    });

    document.getElementById("chapterTitle").innerText =
        "Medicine - " + type;

    showPage("chapters", true);
}


function showMedicineChapters(type, system) {

    medicineStack.push(() => showMedicineSystems(type));

    let chapterData =
        medicineData["Medicine"][type][system];

    let list = document.getElementById("chapterList");

    list.innerHTML = "";

    Object.keys(chapterData).forEach(chapter => {

        let li = document.createElement("li");

        li.innerHTML = `
            <button onclick="openMedicineTopics('${type}', '${system}', '${chapter}')">
                ${chapter}
            </button>
        `;

        list.appendChild(li);

    });

    document.getElementById("chapterTitle").innerText =
        system;

    showPage("chapters", true);
}






function openMedicineTopics(type, system, chapter) {

    medicineStack.push(() =>
        showMedicineChapters(type, system)
    );

    let dataSet =
        medicineData["Medicine"][type][system][chapter];

    let container = document.getElementById("questionList");

    container.innerHTML = "";

    dataSet.forEach((item, index) => {

        let div = document.createElement("div");

        div.className = "question-box";

        if (type === "PYQs") {

            div.innerHTML = `
                <p><strong>Q${index + 1}. ${item.question}</strong></p>

                <button onclick="toggleAnswer(this)">
                    Show Answer
                </button>

                <p class="answer" style="display:none;">
                    ${item.answer}
                </p>
            `;

        } else {

            let stars = "⭐".repeat(item.rating || 0);

            div.innerHTML = `
                <p>
                    <strong>${index + 1}. ${item.topic}</strong>
                    <span class="stars">${stars}</span>
                </p>
            `;
        }

        container.appendChild(div);

    });

    document.getElementById("questionTitle").innerText =
        chapter;

    showPage("questions", true);
}



// ================= INIT =================
document.addEventListener("DOMContentLoaded", function () {
    showPage("home");
});