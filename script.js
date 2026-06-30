const levels = [
  { title: "A", file: "set_A.json" },
  { title: "B", file: "set_B.json" },
  { title: "C", file: "set_C.json" },
  { title: "D", file: "set_D.json" },
  { title: "E", file: "set_E.json" },
  { title: "F", file: "set_F.json" }
];

let deck = [];
let order = [];
let currentIndex = 0;
let currentCard = null;
let activeLevelIndex = 0;

const englishPrompt = document.getElementById("englishPrompt");
const japaneseAnswer = document.getElementById("japaneseAnswer");
const answerCard = document.getElementById("answerCard");
const revealButton = document.getElementById("revealButton");
const nextButton = document.getElementById("nextButton");
const resetButton = document.getElementById("resetButton");
const progressText = document.getElementById("progressText");
const chipRow = document.getElementById("chipRow");
const noteText = document.getElementById("noteText");
const levelButtons = document.querySelectorAll(".level-picker button");

async function loadDeck(levelIndex = 0) {
  activeLevelIndex = levelIndex;

  try {
    englishPrompt.textContent = "Loading...";
    answerCard.classList.add("hidden");
    revealButton.classList.add("hidden");
    chipRow.innerHTML = "";
    noteText.textContent = "";

    const response = await fetch(levels[levelIndex].file);
    if (!response.ok) throw new Error("Failed to load file");

    deck = await response.json();

    shuffleDeck();
    updateActiveButton();
    showCard();
  } catch (err) {
    englishPrompt.textContent = "Error loading deck";
    progressText.textContent = "0/0";
  }
}

function shuffleDeck() {
  order = [...Array(deck.length).keys()];

  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  currentIndex = 0;
}

function showCard() {
  if (!deck.length) return;

  if (currentIndex >= order.length) {
    shuffleDeck();
  }

  currentCard = deck[order[currentIndex]];

  englishPrompt.textContent = currentCard.english;
  japaneseAnswer.textContent = currentCard.japanese;
  noteText.textContent = currentCard.note || "";

  renderChips(currentCard.tags || []);
  updateProgress();

  answerCard.classList.add("hidden");
  revealButton.classList.remove("hidden");
}

function renderChips(tags) {
  chipRow.innerHTML = "";

  tags.forEach(tag => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = tag.label;
    chipRow.appendChild(chip);
  });
}

function updateProgress() {
  const seen = Math.min(currentIndex + 1, deck.length);
  progressText.textContent = `${seen}/${deck.length}`;
}

function updateActiveButton() {
  levelButtons.forEach((btn, i) => {
    btn.classList.toggle("active", i === activeLevelIndex);
  });
}

levelButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    loadDeck(index);
  });
});

revealButton.addEventListener("click", () => {
  answerCard.classList.remove("hidden");
  revealButton.classList.add("hidden");
});

nextButton.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= order.length) {
    shuffleDeck();
  }

  showCard();
});

resetButton.addEventListener("click", () => {
  shuffleDeck();
  showCard();
});

// init
loadDeck(0);
