document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const dealerCardsDiv = document.getElementById('dealerCards');
    const playerCardsDiv = document.getElementById('playerCards');
    const gameStatusDiv = document.getElementById('gameStatus');

    let playerCards = [], dealerCards = [], deck = [];
    let inGame = false;

    function createDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({value, suit});
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap
        }
    }

    function startGame() {
        deck = createDeck();
        shuffleDeck(deck);
        dealerCards = [deck.pop(), deck.pop()];
        playerCards = [deck.pop(), deck.pop()];
        inGame = true;
        updateGameArea();
    }

    function hit() {
        if (!inGame) return;
        playerCards.push(deck.pop());
        if (calculateScore(playerCards) > 21) {
            endGame();
        }
        updateGameArea();
    }

    function stand() {
        if (!inGame) return;
        // Dealer's turn
        while (calculateScore(dealerCards) < 17) {
            dealerCards.push(deck.pop());
        }
        endGame();
    }

    function endGame() {
        inGame = false;
        const playerScore = calculateScore(playerCards);
        const dealerScore = calculateScore(dealerCards);
        if (playerScore > 21 || (dealerScore <= 21 && dealerScore > playerScore)) {
            gameStatusDiv.textContent = 'You lose!';
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            gameStatusDiv.textContent = 'You win!';
        } else {
            gameStatusDiv.textContent = 'Draw!';
        }
    }

    function calculateScore(cards) {
        let score = 0;
        let aceCount = 0;
        for (let card of cards) {
            if (card.value === 'A') {
                score += 11;
                aceCount += 1;
            } else if (['J', 'Q', 'K'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        }

        // Adjust score for Aces
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount -= 1;
        }

        return score;
    }

    function updateGameArea() {
        if (!inGame) {
            gameArea.style.display = 'none';
            return;
        }
        gameArea.style.display = 'block';
        dealerCardsDiv.innerHTML = dealerCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
        playerCardsDiv.innerHTML = playerCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
        gameStatusDiv.textContent = `Your score: ${calculateScore(playerCards)}`;
    }

    startGameButton.addEventListener('click', startGame);
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
});

