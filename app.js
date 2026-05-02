const numberA = document.querySelector("#number-a");
const numberB = document.querySelector("#number-b");
const questionCount = document.querySelector("#question-count");
const scoreDisplay = document.querySelector("#score");
const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer-input");
const feedback = document.querySelector("#feedback");
const questionCard = document.querySelector("#question-card");
const nextButton = document.querySelector("#next-button");
const restartButton = document.querySelector("#restart-button");
const answeredCount = document.querySelector("#answered-count");
const confettiLayer = document.querySelector("#confetti-layer");
const runner = document.querySelector("#runner");

const sessionLength = 10;
const nextQuestionDelay = 900;
const puppyRunDuration = 920;
const confettiColors = ["#3b82d6", "#62caa7", "#ffd166", "#ff7b73", "#7b61ff"];
let currentQuestion = createQuestion();
let questionNumber = 1;
let score = 0;
let answered = 0;
let checkedThisRound = false;
let nextQuestionTimer = null;

function createQuestion() {
  const a = randomNumber(0, 20);
  const b = randomNumber(0, 20 - a);
  return { a, b, answer: a + b };
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderQuestion() {
  numberA.textContent = currentQuestion.a;
  numberB.textContent = currentQuestion.b;
  questionCount.textContent = questionNumber;
  answerInput.value = "";
  answerInput.focus();
  checkedThisRound = false;
  setCardState("");
  feedback.textContent = "Press Enter to check your answer.";
}

function checkAnswer() {
  const guess = Number(answerInput.value.trim());

  if (answerInput.value.trim() === "" || Number.isNaN(guess)) {
    setCardState("incorrect");
    feedback.textContent = "Type a number first, then press Enter.";
    return;
  }

  if (!checkedThisRound) {
    answered += 1;
    checkedThisRound = true;
    updateSprintProgress();
  }

  if (guess === currentQuestion.answer) {
    score += 1;
    setCardState("correct");
    feedback.textContent = "Correct! Next question coming up...";
    updateScore();
    launchConfetti();
    scheduleNextQuestion();
  } else {
    setCardState("incorrect");
    feedback.textContent = `Not correct yet. ${currentQuestion.a} + ${currentQuestion.b} = ${currentQuestion.answer}.`;
    stumbleRunner();
  }

  updateProgressText();
}

function nextQuestion() {
  clearNextQuestionTimer();

  if (answered >= sessionLength) {
    finishSession();
    return;
  }

  questionNumber += 1;
  currentQuestion = createQuestion();
  renderQuestion();
}

function finishSession() {
  clearNextQuestionTimer();
  setCardState("correct");
  feedback.textContent = `Great work! You scored ${score} out of ${sessionLength}. Press Restart to play again.`;
  answerInput.value = "";
  answerInput.disabled = true;
  nextButton.disabled = true;
  celebrateRunner();
}

function restartSession() {
  clearNextQuestionTimer();
  currentQuestion = createQuestion();
  questionNumber = 1;
  score = 0;
  answered = 0;
  checkedThisRound = false;
  answerInput.disabled = false;
  nextButton.disabled = false;
  updateScore();
  updateSprintProgress(false);
  updateProgressText();
  renderQuestion();
}

function setCardState(state) {
  questionCard.classList.remove("correct", "incorrect");
  if (state) {
    questionCard.classList.add(state);
  }
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function updateProgressText() {
  answeredCount.textContent = answered;
}

function updateSprintProgress(animate = true) {
  const progress = 6 + Math.min(answered / sessionLength, 1) * 88;
  runner.style.setProperty("--progress", `${progress}%`);
  runner.classList.remove("runner-stumble", "runner-dance");
  if (animate) {
    runner.classList.add("runner-moving");
    setTimeout(() => runner.classList.remove("runner-moving"), puppyRunDuration);
  } else {
    runner.classList.remove("runner-moving");
  }
  updateProgressText();
}

function stumbleRunner() {
  runner.classList.remove("runner-stumble", "runner-dance");
  runner.offsetHeight;
  runner.classList.add("runner-stumble");
}

function celebrateRunner() {
  runner.classList.remove("runner-moving", "runner-stumble", "runner-dance");
  runner.offsetHeight;
  runner.classList.add("runner-dance");
}

function scheduleNextQuestion() {
  clearNextQuestionTimer();
  nextQuestionTimer = setTimeout(nextQuestion, nextQuestionDelay);
}

function clearNextQuestionTimer() {
  if (nextQuestionTimer) {
    clearTimeout(nextQuestionTimer);
    nextQuestionTimer = null;
  }
}

function launchConfetti() {
  confettiLayer.replaceChildren();

  for (let index = 0; index < 28; index += 1) {
    const piece = document.createElement("span");
    const angle = ((-80 + Math.random() * 160) * Math.PI) / 180;
    const distance = 120 + Math.random() * 170;
    const rotation = Math.random() * 540;

    piece.className = "confetti-piece";
    piece.style.background = confettiColors[index % confettiColors.length];
    piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--y", `${Math.sin(angle) * distance - 80}px`);
    piece.style.setProperty("--r", `${rotation}deg`);
    piece.style.left = `${42 + Math.random() * 18}%`;
    piece.style.top = `${42 + Math.random() * 10}%`;

    confettiLayer.append(piece);
  }

  setTimeout(() => confettiLayer.replaceChildren(), 850);
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (questionCard.classList.contains("correct") && checkedThisRound) {
    return;
  }

  checkAnswer();
});

nextButton.addEventListener("click", () => {
  if (!checkedThisRound) {
    answered += 1;
    updateSprintProgress();
  }
  nextQuestion();
});

restartButton.addEventListener("click", restartSession);

renderQuestion();
