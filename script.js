const gameContainer = document.querySelector('.game-container');
const startButton = document.getElementById('startGame');
const resetButton = document.getElementById('resetGame');
const playerNameInput = document.getElementById('playerName');
const leaderboard = {
  wins: 0,
  losses: 0,
  totalGameTime: 0,
  gamesPlayed: []
};

let cards = [];
let openedCards = [];
let matchedCards = [];

function generateCards() {
  const symbols = ['🍎', '🍌', '🍒', '🍓', '🍐', '🍊', '🍋', '🍇'];
  const tempCards = [...symbols, ...symbols];
  cards = tempCards.sort(() => Math.random() - 0.5);
}

function createCards() {
  gameContainer.innerHTML = '';
  cards.forEach((card, index) => {
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.setAttribute('data-index', index);
    newCard.textContent = '?';
    newCard.addEventListener('click', flipCard);
    gameContainer.appendChild(newCard);
  });
}

function flipCard() {
  const clickedIndex = parseInt(this.getAttribute('data-index'));
  if (openedCards.length < 2 && !this.classList.contains('disabled')) {
    this.textContent = cards[clickedIndex];
    this.classList.add('disabled');
    openedCards.push(clickedIndex);

    if (openedCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  const [index1, index2] = openedCards;
  const card1 = document.querySelector(`[data-index="${index1}"]`);
  const card2 = document.querySelector(`[data-index="${index2}"]`);

  if (cards[index1] === cards[index2]) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCards.push(index1, index2);
  } else {
    card1.textContent = '?';
    card2.textContent = '?';
    card1.classList.remove('disabled');
    card2.classList.remove('disabled');
  }

  openedCards = [];

  if (matchedCards.length === cards.length) {
    endGame(true);
  }
}

function endGame(won) {
  const name = playerNameInput.value || 'Player';
  const gameResult = {
    name: name,
    won: won,
    time: performance.now()
  };

  leaderboard.gamesPlayed.push(gameResult);
  playerNameInput.value = '';
  calculateStats();
  alert(won ? 'You win! Game Over!' : 'You lose! Game Over!');
}

function calculateStats() {
  let wins = 0,
    losses = 0,
    totalTime = 0;
  for (const game of leaderboard.gamesPlayed) {
    if (game.won) {
      wins++;
    } else {
      losses++;
    }
    totalTime += game.time;
  }

  leaderboard.wins = wins;
  leaderboard.losses = losses;
  leaderboard.totalGameTime = totalTime;
  leaderboard.averageTime = totalTime / leaderboard.gamesPlayed.length;
}

startButton.addEventListener('click', () => {
  if (playerNameInput.value) {
    generateCards();
    createCards();
  } else {
    alert('Please enter your name to start the game!');
  }
});

resetButton.addEventListener('click', () => {
  gameContainer.innerHTML = '';
  cards = [];
  openedCards = [];
  matchedCards = [];
});
