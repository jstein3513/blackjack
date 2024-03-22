document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const dealerCardsDiv = document.getElementById('dealerCards');
    const playerCardsDiv = document.getElementById('playerCards');
    const gameStatusDiv = document.getElementById('gameStatus');
    const dealerActionDiv = document.createElement('div');
    const gameArea = document.getElementById('gameArea'); // Ensure this line is correctly referencing the game area

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
        dealerActionDiv.textContent = ''; // Reset dealer actions text
        updateGameArea(true); // Ensure game area is visible at start
    }

    function hit() {
        if (!inGame) return;
        playerCards.push(deck.pop());
        if (calculateScore(playerCards) > 21) {
            stand(); // Proceed to dealer's turn if player busts
        } else {
            updateGameArea(true); // Keep game area visible during player's turn
        }
    }

    function stand() {
        if (!inGame) return;
        let actionTaken = false;
        while (calculateScore(dealerCards) < 17) {
            dealerCards.push(deck.pop());
            actionTaken = true;
        }
        dealerActionDiv.textContent = actionTaken ? 'Dealer Hits' : 'Dealer Stands';
        inGame = false; // End the game after dealer's turn
        endGame();
    }

    function endGame() {
        const playerScore = calculateScore(playerCards);
        const dealerScore = calculateScore(dealerCards);
        let resultMessage = '';
        if (playerScore > 21) {
            resultMessage = 'You bust! Dealer wins.';
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            resultMessage = 'You win!';
        } else if (dealerScore > playerScore) {
            resultMessage = 'Dealer wins.';
        } else {
            resultMessage = 'It\'s a draw!';
        }
        gameStatusDiv.textContent = resultMessage;
        updateGameArea(false); // Update but don't hide the game area immediately
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
                score += parseInt(card.value, 10);
            }
        }
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount -= 1;
        }
        return score;
    }

    function updateGameArea(keepVisible) {
        if (!keepVisible) {
            gameArea.style.display = 'none';
            return;
        }
        gameArea.style.display = 'block';
        dealerCardsDiv.innerHTML = dealerCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
        playerCardsDiv.innerHTML = playerCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
        dealerCardsDiv.appendChild(dealerActionDiv); // Show dealer's last action

        gameStatusDiv.textContent = `Your score: ${calculateScore(playerCards)}`;
    }

    startGameButton.addEventListener('click', startGame);
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
});

