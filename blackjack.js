document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const dealerCardsDiv = document.getElementById('dealerCards');
    const playerCardsDiv = document.getElementById('playerCards');
    const gameStatusDiv = document.getElementById('gameStatus');
    let dealerActionDiv = document.createElement('div'); // For displaying dealer actions

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
        dealerActionDiv.innerHTML = ''; // Reset dealer actions display
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
        inGame = false; // End player's turn

        let dealerScore = calculateScore(dealerCards);
        while (dealerScore < 17) {
            let card = deck.pop();
            dealerCards.push(card);
            dealerScore = calculateScore(dealerCards);
            dealerActionDiv.innerHTML += `<div>Dealer hits: ${card.value} of ${card.suit}</div>`; // Show dealer hit
        }
        if (dealerScore >= 17) {
            dealerActionDiv.innerHTML += `<div>Dealer stands.</div>`; // Show dealer stands
        }

        endGame();
    }

    function endGame() {
        const playerScore = calculateScore(playerCards);
        const dealerScore = calculateScore(dealerCards);
        let resultMessage;
        
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
        updateGameArea();
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
        dealerCardsDiv.appendChild(dealerActionDiv);
    }

    startGameButton.addEventListener('click', startGame);
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
});
