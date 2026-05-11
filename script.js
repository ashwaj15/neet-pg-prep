// ================= DATA =================
let data = {};
let medicineData = {};
let surgeryData = {};
let obgData = {};
let physiologyData = {};
let ophthaData = {};
let entData = {};
let biochemData = {};
let anatData = {};

// ================= GLOBAL =================
let historyStack = [];
let currentSubject = "";
let medicineStack = [];
let medicineNavigatingBack = false;

// ================= NESTED SUBJECTS LIST =================
const nestedSubjects = [
    "Medicine", "Surgery", "OBG", "Physiology",
    "Ophthalmology", "ENT", "Biochemistry", "Anatomy"
];

// ================= LOAD JSON =================
let loadedCount = 0;
const totalToLoad = 9;

function onAllLoaded() {
    loadedCount++;
    if (loadedCount === totalToLoad) {
        if (medicineData["Medicine"])      data["Medicine"]      = medicineData["Medicine"];
        if (surgeryData["Surgery"])        data["Surgery"]       = surgeryData["Surgery"];
        if (obgData["OBG"])                data["OBG"]           = obgData["OBG"];
        if (physiologyData["Physiology"])  data["Physiology"]    = physiologyData["Physiology"];
        if (ophthaData["Ophthalmology"])   data["Ophthalmology"] = ophthaData["Ophthalmology"];
        if (entData["ENT"])                data["ENT"]           = entData["ENT"];
        if (biochemData["Biochemistry"])   data["Biochemistry"]  = biochemData["Biochemistry"];
        if (anatData["Anatomy"])           data["Anatomy"]       = anatData["Anatomy"];
        loadSubjects();
    }
}

fetch("data.json")
    .then(res => res.json()).then(json => { data = json; onAllLoaded(); })
    .catch(err => { console.error("data.json error:", err); onAllLoaded(); });

fetch("medicine.json")
    .then(res => res.json()).then(json => { medicineData = json; onAllLoaded(); })
    .catch(err => { console.error("medicine.json error:", err); onAllLoaded(); });

fetch("surgery.json")
    .then(res => res.json()).then(json => { surgeryData = json; onAllLoaded(); })
    .catch(err => { console.error("surgery.json error:", err); onAllLoaded(); });

fetch("obg.json")
    .then(res => res.json()).then(json => { obgData = json; onAllLoaded(); })
    .catch(err => { console.error("obg.json error:", err); onAllLoaded(); });

fetch("physio.json")
    .then(res => res.json()).then(json => { physiologyData = json; onAllLoaded(); })
    .catch(err => { console.error("physio.json error:", err); onAllLoaded(); });

fetch("optha.json")
    .then(res => res.json()).then(json => { ophthaData = json; onAllLoaded(); })
    .catch(err => { console.error("optha.json error:", err); onAllLoaded(); });

fetch("ent.json")
    .then(res => res.json()).then(json => { entData = json; onAllLoaded(); })
    .catch(err => { console.error("ent.json error:", err); onAllLoaded(); });

fetch("biochem.json")
    .then(res => res.json()).then(json => { biochemData = json; onAllLoaded(); })
    .catch(err => { console.error("biochem.json error:", err); onAllLoaded(); });

fetch("anat.json")
    .then(res => res.json()).then(json => { anatData = json; onAllLoaded(); })
    .catch(err => { console.error("anat.json error:", err); onAllLoaded(); });


// ================= PAGE CONTROL =================
function showPage(pageId, isBack = false) {

    const currentPage = document.querySelector(".page.active");

    if (!isBack && !nestedSubjects.includes(currentSubject) && currentPage && currentPage.id !== pageId) {
        historyStack.push(currentPage.id);
    }

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
        page.style.display = "none";
    });

    const page = document.getElementById(pageId);
    if (page) {
        page.style.display = "block";
        page.classList.add("active");
    }

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


// ================= BACK =================
function goBack() {

    if (nestedSubjects.includes(currentSubject)) {

        if (medicineStack.length > 0) {
            medicineNavigatingBack = true;
            const previous = medicineStack.pop();
            previous();
            medicineNavigatingBack = false;
            return;
        }

        currentSubject = "";
        historyStack = [];
        showPage("subjects", true);
        return;
    }

    if (historyStack.length > 0) {
        const prev = historyStack.pop();
        showPage(prev, true);
    } else {
        showPage("home", true);
    }
}


// ================= START =================
function startLearning() {
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
            handleSubjectClick(sub);
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
                document.getElementById("subjectTitle").innerText = sub;
                handleSubjectClick(sub);
            };

            container.appendChild(div);
        }
    });
}


// ================= SUBJECT CLICK ROUTER =================
function handleSubjectClick(sub) {

    medicineStack = [];
    historyStack = [];
    medicineNavigatingBack = false;

    if      (sub === "Medicine")      showMedicineTypes();
    else if (sub === "Surgery")       showSurgeryTypes();
    else if (sub === "OBG")           showOBGTypes();
    else if (sub === "Physiology")    showPhysiologyTypes();
    else if (sub === "Ophthalmology") showOphthaTypes();
    else if (sub === "ENT")           showENTTypes();
    else if (sub === "Biochemistry")  showBiochemTypes();
    else if (sub === "Anatomy")       showAnatTypes();
    else                              showPage("options");
}


// ================= NORMAL SUBJECT CHAPTERS =================
function showChapters(type) {

    let chapterData = data[currentSubject][type];
    let list = document.getElementById("chapterList");
    list.innerHTML = "";

    Object.keys(chapterData).forEach(chapter => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="openQuestions('${type}', '${chapter}')">${chapter}</button>`;
        list.appendChild(li);
    });

    document.getElementById("chapterTitle").innerText = currentSubject + " - " + type;
    showPage("chapters");
}


// ================= NORMAL QUESTIONS =================
function openQuestions(type, chapter) {

    let dataSet = data[currentSubject][type][chapter];
    let container = document.getElementById("questionList");
    container.innerHTML = "";

    dataSet.forEach((item, index) => {
        let div = document.createElement("div");
        div.className = "question-box";

        if (type === "PYQs") {
            div.innerHTML = `
                <p><strong>Q${index + 1}. ${item.question}</strong></p>
                <button onclick="toggleAnswer(this)">Show Answer</button>
                <p class="answer" style="display:none;">${item.answer}</p>
            `;
        } else {
            let text = typeof item === "string" ? item : item.topic;
            let stars = item.rating ? "⭐".repeat(item.rating) : "";
            div.innerHTML = `
                <p><strong>${index + 1}. ${text}</strong>
                <span class="stars">${stars}</span></p>
            `;
        }

        container.appendChild(div);
    });

    document.getElementById("questionTitle").innerText = chapter + " - " + type;
    showPage("questions");
}


// ================= TOGGLE ANSWER =================
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


// =====================================================
// ============= GENERIC NESTED FLOW HELPERS ===========
// =====================================================

function buildTypeList(subjectData, subjectKey, onClickFn, titleText) {
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(subjectData[subjectKey]).forEach(type => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="${onClickFn}('${type}')">${type}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = titleText;
    showPage("chapters", true);
}

function buildSystemList(systems, onClickFn, titleText) {
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(systems).forEach(system => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="${onClickFn}('${system}')">${system}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = titleText;
    showPage("chapters", true);
}

function buildChapterList(chapters, onClickFn, titleText) {
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(chapters).forEach(chapter => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="${onClickFn}('${chapter}')">${chapter}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = titleText;
    showPage("chapters", true);
}

function buildTopicList(dataSet, type, titleText) {
    let container = document.getElementById("questionList");
    container.innerHTML = "";

    dataSet.forEach((item, index) => {
        let div = document.createElement("div");
        div.className = "question-box";

        if (type === "PYQs") {
            div.innerHTML = `
                <p><strong>Q${index + 1}. ${item.question}</strong></p>
                <button onclick="toggleAnswer(this)">Show Answer</button>
                <p class="answer" style="display:none;">${item.answer}</p>
            `;
        } else {
            let stars = "⭐".repeat(item.rating || 0);
            div.innerHTML = `
                <p><strong>${index + 1}. ${item.topic}</strong>
                <span class="stars">${stars}</span></p>
            `;
        }

        container.appendChild(div);
    });

    document.getElementById("questionTitle").innerText = titleText;
    showPage("questions", true);
}


// =====================================================
// ================= MEDICINE FLOW =====================
// =====================================================

function showMedicineTypes() {
    buildTypeList(medicineData, "Medicine", "showMedicineSystems", "Medicine");
}

function showMedicineSystems(type) {
    if (!medicineNavigatingBack) medicineStack.push(() => showMedicineTypes());
    buildSystemList(medicineData["Medicine"][type], `showMedicineChapters_${type}`, "Medicine - " + type);

    // Store type for closure
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(medicineData["Medicine"][type]).forEach(system => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showMedicineChapters('${type}','${system}')">${system}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Medicine - " + type;
    showPage("chapters", true);
}

function showMedicineChapters(type, system) {
    if (!medicineNavigatingBack) medicineStack.push(() => showMedicineSystems(type));
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(medicineData["Medicine"][type][system]).forEach(chapter => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="openMedicineTopics('${type}','${system}','${chapter}')">${chapter}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = system;
    showPage("chapters", true);
}

function openMedicineTopics(type, system, chapter) {
    if (!medicineNavigatingBack) medicineStack.push(() => showMedicineChapters(type, system));
    buildTopicList(medicineData["Medicine"][type][system][chapter], type, chapter);
}


// =====================================================
// ================= SURGERY FLOW ======================
// =====================================================

function showSurgeryTypes() {
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(surgeryData["Surgery"]).forEach(type => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showSurgerySystems('${type}')">${type}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Surgery";
    showPage("chapters", true);
}

function showSurgerySystems(type) {
    if (!medicineNavigatingBack) medicineStack.push(() => showSurgeryTypes());
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(surgeryData["Surgery"][type]).forEach(system => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showSurgeryChapters('${type}','${system}')">${system}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Surgery - " + type;
    showPage("chapters", true);
}

function showSurgeryChapters(type, system) {
    if (!medicineNavigatingBack) medicineStack.push(() => showSurgerySystems(type));
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(surgeryData["Surgery"][type][system]).forEach(chapter => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="openSurgeryTopics('${type}','${system}','${chapter}')">${chapter}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = system;
    showPage("chapters", true);
}

function openSurgeryTopics(type, system, chapter) {
    if (!medicineNavigatingBack) medicineStack.push(() => showSurgeryChapters(type, system));
    buildTopicList(surgeryData["Surgery"][type][system][chapter], type, chapter);
}


// =====================================================
// ================= OBG FLOW ==========================
// =====================================================

function showOBGTypes() {
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(obgData["OBG"]).forEach(type => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showOBGSystems('${type}')">${type}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "OBG";
    showPage("chapters", true);
}

function showOBGSystems(type) {
    if (!medicineNavigatingBack) medicineStack.push(() => showOBGTypes());
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(obgData["OBG"][type]).forEach(system => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showOBGChapters('${type}','${system}')">${system}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "OBG - " + type;
    showPage("chapters", true);
}

function showOBGChapters(type, system) {
    if (!medicineNavigatingBack) medicineStack.push(() => showOBGSystems(type));
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(obgData["OBG"][type][system]).forEach(chapter => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="openOBGTopics('${type}','${system}','${chapter}')">${chapter}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = system;
    showPage("chapters", true);
}

function openOBGTopics(type, system, chapter) {
    if (!medicineNavigatingBack) medicineStack.push(() => showOBGChapters(type, system));
    buildTopicList(obgData["OBG"][type][system][chapter], type, chapter);
}


// =====================================================
// ================ PHYSIOLOGY FLOW ====================
// =====================================================

function showPhysiologyTypes() {
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(physiologyData["Physiology"]).forEach(type => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showPhysiologySystems('${type}')">${type}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Physiology";
    showPage("chapters", true);
}

function showPhysiologySystems(type) {
    if (!medicineNavigatingBack) medicineStack.push(() => showPhysiologyTypes());
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(physiologyData["Physiology"][type]).forEach(system => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showPhysiologyChapters('${type}','${system}')">${system}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Physiology - " + type;
    showPage("chapters", true);
}

function showPhysiologyChapters(type, system) {
    if (!medicineNavigatingBack) medicineStack.push(() => showPhysiologySystems(type));
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(physiologyData["Physiology"][type][system]).forEach(chapter => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="openPhysiologyTopics('${type}','${system}','${chapter}')">${chapter}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = system;
    showPage("chapters", true);
}

function openPhysiologyTopics(type, system, chapter) {
    if (!medicineNavigatingBack) medicineStack.push(() => showPhysiologyChapters(type, system));
    buildTopicList(physiologyData["Physiology"][type][system][chapter], type, chapter);
}


// =====================================================
// =============== OPHTHALMOLOGY FLOW ==================
// =====================================================

function showOphthaTypes() {
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(ophthaData["Ophthalmology"]).forEach(type => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showOpthaaSystems('${type}')">${type}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Ophthalmology";
    showPage("chapters", true);
}

function showOpthaaSystems(type) {
    if (!medicineNavigatingBack) medicineStack.push(() => showOphthaTypes());
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(ophthaData["Ophthalmology"][type]).forEach(system => {
        let li = document.createElement("li");
        li.innerHTML =
`<button onclick="showOphthaChapters('${type}','${system}')">
    ${system}
</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Ophthalmology - " + type;
    showPage("chapters", true);
}

function showOphthaChapters(type, system) {

    if (!medicineNavigatingBack)
        medicineStack.push(() => showOpthaaSystems(type));

    let list = document.getElementById("chapterList");
    list.innerHTML = "";

    Object.keys(ophthaData["Ophthalmology"][type][system]).forEach(chapter => {

        let li = document.createElement("li");

        li.innerHTML =
        `<button onclick="openOphthaTopics('${type}','${system}','${chapter}')">
            ${chapter}
        </button>`;

        list.appendChild(li);
    });

    document.getElementById("chapterTitle").innerText = system;
    showPage("chapters", true);
}

function openOphthaTopics(type, system, chapter) {

    if (!medicineNavigatingBack)
        medicineStack.push(() => showOphthaChapters(type, system));

    buildTopicList(
        ophthaData["Ophthalmology"][type][system][chapter],
        type,
        chapter
    );
}

// =====================================================
// =================== ENT FLOW ========================
// =====================================================

function showENTTypes() {
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(entData["ENT"]).forEach(type => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showENTSystems('${type}')">${type}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "ENT";
    showPage("chapters", true);
}

function showENTSystems(type) {
    if (!medicineNavigatingBack) medicineStack.push(() => showENTTypes());
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(entData["ENT"][type]).forEach(system => {
        let li = document.createElement("li");
       li.innerHTML =
`<button onclick="showENTChapters('${type}','${system}')">
    ${system}
</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "ENT - " + type;
    showPage("chapters", true);
}

function showENTChapters(type, system) {

    if (!medicineNavigatingBack)
        medicineStack.push(() => showENTSystems(type));

    let list = document.getElementById("chapterList");
    list.innerHTML = "";

    Object.keys(entData["ENT"][type][system]).forEach(chapter => {

        let li = document.createElement("li");

        li.innerHTML =
            `<button onclick="openENTTopics('${type}','${system}','${chapter}')">
                ${chapter}
            </button>`;

        list.appendChild(li);
    });

    document.getElementById("chapterTitle").innerText = system;
    showPage("chapters", true);
}

function openENTTopics(type, system, chapter) {

    if (!medicineNavigatingBack)
        medicineStack.push(() => showENTChapters(type, system));

    buildTopicList(
        entData["ENT"][type][system][chapter],
        type,
        chapter
    );
}

// =====================================================
// ================ BIOCHEMISTRY FLOW ==================
// =====================================================

function showBiochemTypes() {
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(biochemData["Biochemistry"]).forEach(type => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showBiochemSystems('${type}')">${type}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Biochemistry";
    showPage("chapters", true);
}

function showBiochemSystems(type) {
    if (!medicineNavigatingBack) medicineStack.push(() => showBiochemTypes());
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(biochemData["Biochemistry"][type]).forEach(system => {
        let li = document.createElement("li");
       li.innerHTML =
`<button onclick="showBiochemChapters('${type}','${system}')">
    ${system}
</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Biochemistry - " + type;
    showPage("chapters", true);
}

function showBiochemChapters(type, system) {

    if (!medicineNavigatingBack)
        medicineStack.push(() => showBiochemSystems(type));

    let list = document.getElementById("chapterList");
    list.innerHTML = "";

    Object.keys(biochemData["Biochemistry"][type][system]).forEach(chapter => {

        let li = document.createElement("li");

        li.innerHTML =
        `<button onclick="openBiochemTopics('${type}','${system}','${chapter}')">
            ${chapter}
        </button>`;

        list.appendChild(li);
    });

    document.getElementById("chapterTitle").innerText = system;
    showPage("chapters", true);
}

function openBiochemTopics(type, system, chapter) {

    if (!medicineNavigatingBack)
        medicineStack.push(() => showBiochemChapters(type, system));

    buildTopicList(
        biochemData["Biochemistry"][type][system][chapter],
        type,
        chapter
    );
}

// =====================================================
// ================== ANATOMY FLOW =====================
// =====================================================

function showAnatTypes() {
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(anatData["Anatomy"]).forEach(type => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="showAnatSystems('${type}')">${type}</button>`;
        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Anatomy";
    showPage("chapters", true);
}

function showAnatSystems(type) {
    if (!medicineNavigatingBack) medicineStack.push(() => showAnatTypes());
    let list = document.getElementById("chapterList");
    list.innerHTML = "";
    Object.keys(anatData["Anatomy"][type]).forEach(system => {
        let li = document.createElement("li");
li.innerHTML =
`<button onclick="showAnatChapters('${type}','${system}')">
    ${system}
</button>`;        list.appendChild(li);
    });
    document.getElementById("chapterTitle").innerText = "Anatomy - " + type;
    showPage("chapters", true);
}

function showAnatChapters(type, system) {

    if (!medicineNavigatingBack)
        medicineStack.push(() => showAnatSystems(type));

    let list = document.getElementById("chapterList");
    list.innerHTML = "";

    Object.keys(anatData["Anatomy"][type][system]).forEach(chapter => {

        let li = document.createElement("li");

        li.innerHTML =
        `<button onclick="openAnatTopics('${type}','${system}','${chapter}')">
            ${chapter}
        </button>`;

        list.appendChild(li);
    });

    document.getElementById("chapterTitle").innerText = system;
    showPage("chapters", true);
}

function openAnatTopics(type, system, chapter) {

    if (!medicineNavigatingBack)
        medicineStack.push(() => showAnatChapters(type, system));

    buildTopicList(
        anatData["Anatomy"][type][system][chapter],
        type,
        chapter
    );
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", function () {
    showPage("home");
});