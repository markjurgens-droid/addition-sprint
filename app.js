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
const progressFill = document.querySelector("#progress-fill");
const answeredCount = document.querySelector("#answered-count");

const sessionLength = 10;
let currentQuestion = createQuestion();
let questionNumber = 1;
let score = 0;
let answered = 0;
let checkedThisRound = false;

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
  }

  if (guess === currentQuestion.answer) {
    score += 1;
    setCardState("correct");
    feedback.textContent = "Correct! Press Enter again for the next question.";
    updateScore();
  } else {
    setCardState("incorrect");
    feedback.textContent = `Not correct yet. ${currentQuestion.a} + ${currentQuestion.b} = ${currentQuestion.answer}.`;
  }

  updateProgress();
}

function nextQuestion() {
  if (answered >= sessionLength) {
    finishSession();
    return;
  }

  questionNumber += 1;
  currentQuestion = createQuestion();
  renderQuestion();
}

function finishSession() {
  setCardState("correct");
  feedback.textContent = `Great work! You scored ${score} out of ${sessionLength}. Press Restart to play again.`;
  answerInput.value = "";
  answerInput.disabled = true;
  nextButton.disabled = true;
}

function restartSession() {
  currentQuestion = createQuestion();
  questionNumber = 1;
  score = 0;
  answered = 0;
  checkedThisRound = false;
  answerInput.disabled = false;
  nextButton.disabled = false;
  updateScore();
  updateProgress();
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

function updateProgress() {
  answeredCount.textContent = answered;
  progressFill.style.width = `${(answered / sessionLength) * 100}%`;
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (questionCard.classList.contains("correct") && checkedThisRound) {
    nextQuestion();
    return;
  }

  checkAnswer();
});

nextButton.addEventListener("click", () => {
  if (!checkedThisRound) {
    answered += 1;
    updateProgress();
  }
  nextQuestion();
});

restartButton.addEventListener("click", restartSession);

renderQuestion();
