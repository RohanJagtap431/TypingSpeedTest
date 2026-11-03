
const passageElement = document.getElementById("passage");
const typingInput = document.getElementById("typingInput");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const againBtn = document.getElementById("againBtn");

const durationSelect = document.getElementById("duration");
const difficultySelect = document.getElementById("difficulty");

const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const charactersElement = document.getElementById("characters");

const resultPanel = document.getElementById("resultPanel");
const statusElement = document.getElementById("testStatus");
const messageElement = document.getElementById("message");

const passages = {
    easy: [
        "Learning to type faster can improve your productivity. Practice every day and focus on accuracy before speed.",
        "Technology makes our daily life easier. Computers help students learn new things and solve many problems.",
        "Practice is the key to success. Small improvements every day can make a big difference in your future."
    ],

    medium: [
        "Programming is not just about writing code; it is about solving problems, thinking logically, and creating useful applications.",
        "Consistency, patience, and curiosity are important qualities for every developer who wants to build successful software.",
        "The internet connects people around the world and provides access to information, education, and communication."
    ],

    hard: [
        "Software development requires creativity, logical reasoning, debugging skills, and a strong understanding of computational complexity.",
        "Efficient algorithms reduce unnecessary operations and improve application performance, scalability, and maintainability.",
        "Developers should prioritize security, reliability, accessibility, and performance while designing modern applications."
    ]
};

let currentPassage = "";
let timer = null;
let timeLeft = 60;
let totalDuration = 60;

let started = false;
let finished = false;

let startTime = 0;
let endTime = 0;

let correctCount = 0;
let incorrectCount = 0;

let currentWpm = 0;
let currentAccuracy = 100;


// CSRF TOKEN
const csrfToken = document.querySelector(
    '[name=csrfmiddlewaretoken]'
).value;


// RANDOM PASSAGE
function getPassage() {

    const level = difficultySelect.value;
    const list = passages[level];

    return list[Math.floor(Math.random() * list.length)];
}


// ADD NEW PASSAGE
function addNewPassage() {

    currentPassage += " " + getPassage();

    renderPassage();
}


// DISPLAY PASSAGE
function renderPassage() {

    const fragment = document.createDocumentFragment();

    [...currentPassage].forEach((character, index) => {

        const span = document.createElement("span");

        span.textContent = character;
        span.dataset.index = index;

        fragment.appendChild(span);

    });

    passageElement.replaceChildren(fragment);

    updateTypingDisplay();
}


// TIMER FORMAT
function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}


// UPDATE HOME PROGRESS
function updateHomeSpeedBar(wpm) {

    const speedBar = document.getElementById("homeSpeedBar");

    if (!speedBar) return;

    const percentage = Math.min(
        Math.max(Number(wpm) || 0, 0),
        100
    );

    speedBar.style.width = percentage + "%";
}


// HOME STATISTICS
function loadHomeStats() {

    const homeWpm = document.getElementById("homeWpm");
    const homeAccuracy = document.getElementById("homeAccuracy");

    if (!homeWpm || !homeAccuracy) return;

    const lastWpm = localStorage.getItem("lastWpm");
    const lastAccuracy = localStorage.getItem("lastAccuracy");

    homeWpm.textContent = lastWpm ?? "--";

    homeAccuracy.textContent =
        lastAccuracy !== null ? lastAccuracy + "%" : "--";

    updateHomeSpeedBar(lastWpm || 0);
}


// RESET TEST
function resetTest() {

    clearInterval(timer);
    timer = null;

    started = false;
    finished = false;

    totalDuration = Number(durationSelect.value) * 60;
    timeLeft = totalDuration;

    startTime = 0;
    endTime = 0;

    correctCount = 0;
    incorrectCount = 0;

    currentWpm = 0;
    currentAccuracy = 100;

    typingInput.value = "";
    typingInput.disabled = true;

    timerElement.textContent = formatTime(timeLeft);

    wpmElement.textContent = "0";
    accuracyElement.textContent = "100%";
    charactersElement.textContent = "0";

    document.getElementById("charCount").textContent =
        "0 characters";

    statusElement.textContent = "READY TO START";

    messageElement.textContent =
        "Select difficulty and duration to begin.";

    resultPanel.hidden = true;

    startBtn.disabled = false;
    startBtn.textContent = "Start Test →";

    currentPassage = getPassage();

    renderPassage();
}


// START TEST
function startTest() {

    if (started) return;

    resetTest();

    started = true;

    startTime = Date.now();
    endTime = startTime + totalDuration * 1000;

    typingInput.disabled = false;
    typingInput.focus();

    startBtn.disabled = true;
    startBtn.textContent = "Test Running...";

    statusElement.textContent = "TEST RUNNING";
    messageElement.textContent = "Keep typing...";

    timer = setInterval(() => {

        const remainingMilliseconds = Math.max(
            0,
            endTime - Date.now()
        );

        timeLeft = Math.ceil(remainingMilliseconds / 1000);

        timerElement.textContent = formatTime(timeLeft);

        updateStats();

        if (remainingMilliseconds <= 0) {
            finishTest();
        }

    }, 200);

}


// UPDATE TYPING DISPLAY
function updateTypingDisplay() {

    const typedText = typingInput.value;

    const spans = passageElement.querySelectorAll("span");

    correctCount = 0;
    incorrectCount = 0;

    spans.forEach((span, index) => {

        const expected = currentPassage[index];
        const actual = typedText[index];

        span.classList.remove(
            "correct",
            "incorrect",
            "current"
        );

        if (actual === undefined) {
            return;
        }

        if (actual === expected) {

            span.classList.add("correct");
            correctCount++;

        } else {

            span.classList.add("incorrect");
            incorrectCount++;

        }

    });

    if (typedText.length < spans.length) {

        const currentSpan = spans[typedText.length];

        if (currentSpan) {
            currentSpan.classList.add("current");
        }

    }

}


// CALCULATE STATISTICS
function updateStats() {

    const typedText = typingInput.value;

    if (!started) return;

    const elapsedSeconds = Math.max(
        (Date.now() - startTime) / 1000,
        0.1
    );

    const elapsedMinutes = elapsedSeconds / 60;

    // Correct characters / 5 / elapsed minutes
    currentWpm = Math.round(
        (correctCount / 5) / elapsedMinutes
    );

    const totalTyped = typedText.length;

    currentAccuracy = totalTyped > 0
        ? (correctCount / totalTyped) * 100
        : 100;

    currentAccuracy = Math.round(currentAccuracy * 10) / 10;

    wpmElement.textContent = currentWpm;

    accuracyElement.textContent =
        currentAccuracy + "%";

    charactersElement.textContent = totalTyped;

    document.getElementById("charCount").textContent =
        totalTyped + " characters";

    updateHomeSpeedBar(currentWpm);

}


// HANDLE TYPING
typingInput.addEventListener("input", () => {

    if (!started || finished) return;

    updateTypingDisplay();

    // Add another passage before current text ends
    if (
        currentPassage.length - typingInput.value.length < 150
    ) {
        addNewPassage();
    }

    updateStats();

});


// FINISH TEST
async function finishTest() {

    if (finished || !started) return;

    finished = true;
    started = false;

    clearInterval(timer);
    timer = null;

    typingInput.disabled = true;

    startBtn.disabled = false;
    startBtn.textContent = "Test Completed";

    statusElement.textContent = "COMPLETED";

    updateTypingDisplay();

    // Final WPM and Accuracy
    const typedText = typingInput.value;

    currentWpm = Math.round(
        (correctCount / 5) / (totalDuration / 60)
    );

    currentAccuracy = typedText.length > 0
        ? Math.round(
            (correctCount / typedText.length) * 1000
        ) / 10
        : 100;

    wpmElement.textContent = currentWpm;
    accuracyElement.textContent = currentAccuracy + "%";

    updateHomeSpeedBar(currentWpm);

    const result = {
        wpm: currentWpm,
        accuracy: currentAccuracy,
        correct_chars: correctCount,
        incorrect_chars: incorrectCount,
        duration: Number(durationSelect.value),
        difficulty: difficultySelect.value
    };

    document.getElementById("finalWpm").textContent =
        result.wpm;

    document.getElementById("finalAccuracy").textContent =
        result.accuracy + "%";

    document.getElementById("finalCorrect").textContent =
        result.correct_chars;

    document.getElementById("finalIncorrect").textContent =
        result.incorrect_chars;

    resultPanel.hidden = false;

    document.getElementById("saveStatus").textContent =
        "Saving result...";

    try {

        const response = await fetch("/", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },

            body: JSON.stringify(result)

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not save result.");
        }

        // Save only after successful server response
        localStorage.setItem("lastWpm", result.wpm);
        localStorage.setItem("lastAccuracy", result.accuracy);

        loadHomeStats();

        document.getElementById("saveStatus").textContent =
            "✓ Result saved successfully!";

    }
    catch (error) {

        document.getElementById("saveStatus").textContent =
            "Could not save result: " + error.message;

    }

}


// BUTTON EVENTS
startBtn.addEventListener("click", startTest);

restartBtn.addEventListener("click", resetTest);

againBtn.addEventListener("click", () => {

    resetTest();

    document.getElementById("test").scrollIntoView({
        behavior: "smooth"
    });

});


// SETTINGS CHANGE
difficultySelect.addEventListener("change", resetTest);

durationSelect.addEventListener("change", resetTest);


// INITIALIZE
resetTest();
loadHomeStats();
